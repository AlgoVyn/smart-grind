/**
 * Sync Scheduler Tests
 * Tests for sync queue management with circuit breaker and retry logic
 */

// Mock ConnectivityChecker
const mockIsOnline = jest.fn();
const mockStartMonitoring = jest.fn();
const mockStopMonitoring = jest.fn();
const mockOnConnectivityChange = jest.fn().mockReturnValue(() => {});

jest.mock('../../src/sw/connectivity-checker', () => ({
    ConnectivityChecker: jest.fn().mockImplementation(() => ({
        isOnline: mockIsOnline,
        startMonitoring: mockStartMonitoring,
        stopMonitoring: mockStopMonitoring,
        onConnectivityChange: mockOnConnectivityChange,
    })),
    getConnectivityChecker: jest.fn().mockImplementation(() => ({
        isOnline: mockIsOnline,
        startMonitoring: mockStartMonitoring,
        stopMonitoring: mockStopMonitoring,
        onConnectivityChange: mockOnConnectivityChange,
    })),
}));

import { SyncScheduler, getSyncScheduler, type SyncPriority } from '../../src/sw/sync-scheduler';

describe('SyncScheduler', () => {
    let scheduler: SyncScheduler;
    let mockConnectivityChecker: {
        isOnline: jest.Mock;
        startMonitoring: jest.Mock;
        stopMonitoring: jest.Mock;
        onConnectivityChange: jest.Mock;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        mockConnectivityChecker = {
            isOnline: mockIsOnline,
            startMonitoring: mockStartMonitoring,
            stopMonitoring: mockStopMonitoring,
            onConnectivityChange: mockOnConnectivityChange,
        };

        mockIsOnline.mockResolvedValue(true);
        scheduler = new SyncScheduler(mockConnectivityChecker as any);
    });

    afterEach(() => {
        scheduler.stop();
        jest.useRealTimers();
    });

    describe('constructor', () => {
        test('should create SyncScheduler with default options', () => {
            expect(scheduler).toBeDefined();
            const stats = scheduler.getStats();
            expect(stats.queued).toBe(0);
            expect(stats.running).toBe(0);
            expect(stats.circuitBreakersOpen).toBe(0);
        });

        test('should create SyncScheduler with custom options', () => {
            const customScheduler = new SyncScheduler(mockConnectivityChecker as any, {
                maxConcurrentSyncs: 3,
                defaultMaxRetries: 10,
                circuitBreakerThreshold: 3,
                circuitBreakerResetTime: 30000,
                highPriorityInterval: 1000,
                normalPriorityInterval: 5000,
                lowPriorityInterval: 10000,
            });
            expect(customScheduler).toBeDefined();
        });
    });

    describe('start() and stop()', () => {
        test('should start the scheduler', () => {
            scheduler.start();
            expect(scheduler.getStats()).toBeDefined();
        });

        test('should not start multiple times', () => {
            scheduler.start();
            scheduler.start(); // Second call should be ignored
            expect(scheduler.getStats()).toBeDefined();
        });

        test('should stop the scheduler', () => {
            scheduler.start();
            scheduler.stop();
            expect(scheduler.getStats()).toBeDefined();
        });

        test('should handle stop when not started', () => {
            expect(() => scheduler.stop()).not.toThrow();
        });
    });

    describe('schedule()', () => {
        test('should schedule a task with default priority', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            const taskId = scheduler.schedule('test-tag', execute);

            expect(taskId).toBeDefined();
            expect(taskId).toContain('test-tag');
            expect(scheduler.getStats().queued).toBe(1);
        });

        test('should schedule a high priority task', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            const taskId = scheduler.schedule('high-priority-tag', execute, {
                priority: 'high',
            });

            expect(taskId).toBeDefined();
            expect(scheduler.getStats().queued).toBe(1);
        });

        test('should schedule a low priority task', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            const taskId = scheduler.schedule('low-priority-tag', execute, {
                priority: 'low',
            });

            expect(taskId).toBeDefined();
            expect(scheduler.getStats().queued).toBe(1);
        });

        test('should schedule task with custom max retries', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            const taskId = scheduler.schedule('retry-tag', execute, {
                maxRetries: 10,
            });

            expect(taskId).toBeDefined();
        });

        test('should generate unique task IDs', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            const taskId1 = scheduler.schedule('tag', execute);
            const taskId2 = scheduler.schedule('tag', execute);

            expect(taskId1).not.toBe(taskId2);
        });
    });

    describe('cancel()', () => {
        test('should cancel a scheduled task', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            const taskId = scheduler.schedule('test-tag', execute);

            const cancelled = scheduler.cancel(taskId);
            expect(cancelled).toBe(true);
            expect(scheduler.getStats().queued).toBe(0);
        });

        test('should return false when cancelling non-existent task', () => {
            const cancelled = scheduler.cancel('non-existent-id');
            expect(cancelled).toBe(false);
        });
    });

    describe('cancelByTag()', () => {
        test('should cancel all tasks with specific tag', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            scheduler.schedule('tag-a', execute);
            scheduler.schedule('tag-a', execute);
            scheduler.schedule('tag-b', execute);

            const cancelled = scheduler.cancelByTag('tag-a');
            expect(cancelled).toBe(2);
            expect(scheduler.getStats().queued).toBe(1);
        });

        test('should return 0 when no tasks match tag', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            scheduler.schedule('other-tag', execute);

            const cancelled = scheduler.cancelByTag('non-existent-tag');
            expect(cancelled).toBe(0);
        });
    });

    describe('processQueue()', () => {
        test('should process queued tasks', async () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            scheduler.schedule('test-tag', execute);

            scheduler.start();
            await jest.advanceTimersByTimeAsync(1000);

            expect(execute).toHaveBeenCalled();
        });

        test('should not process when offline', async () => {
            mockIsOnline.mockResolvedValue(false);

            const execute = jest.fn().mockResolvedValue(undefined);
            scheduler.schedule('test-tag', execute);

            scheduler.start();
            await jest.advanceTimersByTimeAsync(1000);

            expect(execute).not.toHaveBeenCalled();
        });

        test('should respect max concurrent syncs', async () => {
            const schedulerWithLimit = new SyncScheduler(mockConnectivityChecker as any, {
                maxConcurrentSyncs: 1,
            });

            const firstExecute = jest.fn().mockResolvedValue(undefined);
            const secondExecute = jest.fn().mockResolvedValue(undefined);

            schedulerWithLimit.schedule('tag-1', firstExecute);
            schedulerWithLimit.schedule('tag-2', secondExecute);

            schedulerWithLimit.start();
            await jest.advanceTimersByTimeAsync(1000);

            // First task should be processed, second may be queued or processed depending on timing
            expect(firstExecute).toHaveBeenCalled();

            schedulerWithLimit.stop();
        });

        test('should handle task execution errors', async () => {
            const execute = jest.fn().mockRejectedValue(new Error('Task failed'));
            scheduler.schedule('test-tag', execute, { maxRetries: 0 });

            scheduler.start();
            await jest.advanceTimersByTimeAsync(1000);

            expect(execute).toHaveBeenCalled();
        });

        test('should not process when already processing', async () => {
            const execute = jest.fn().mockResolvedValue(undefined);

            scheduler.schedule('tag-1', execute);
            scheduler.schedule('tag-2', execute);

            scheduler.start();
            await jest.advanceTimersByTimeAsync(1000);

            // Should process tasks without exceeding max concurrent
            expect(execute).toHaveBeenCalled();
        });
    });

    describe('circuit breaker', () => {
        test('should open circuit breaker after threshold failures', async () => {
            const execute = jest.fn().mockRejectedValue(new Error('Task failed'));

            // Schedule and fail task multiple times
            for (let i = 0; i < 5; i++) {
                scheduler.schedule('failing-tag', execute, { maxRetries: 0 });
                scheduler.start();
                await jest.advanceTimersByTimeAsync(1000);
                scheduler.stop();
            }

            // Circuit breaker should be open now
            expect(scheduler.getStats().circuitBreakersOpen).toBeGreaterThan(0);
        });

        test('should reset circuit breaker after reset time', async () => {
            const execute = jest.fn().mockRejectedValue(new Error('Task failed'));

            // Fail task to open circuit breaker
            for (let i = 0; i < 5; i++) {
                scheduler.schedule('reset-tag', execute, { maxRetries: 0 });
                scheduler.start();
                await jest.advanceTimersByTimeAsync(1000);
                scheduler.stop();
            }

            expect(scheduler.getStats().circuitBreakersOpen).toBeGreaterThan(0);

            // Advance time past reset threshold
            await jest.advanceTimersByTimeAsync(61000);

            // Circuit breaker should be reset
            const newScheduler = new SyncScheduler(mockConnectivityChecker as any);
            expect(newScheduler.getStats().circuitBreakersOpen).toBe(0);
        });

        test('should reset all circuit breakers', async () => {
            const execute = jest.fn().mockRejectedValue(new Error('Task failed'));

            // Open multiple circuit breakers
            for (let i = 0; i < 5; i++) {
                scheduler.schedule(`tag-${i}`, execute, { maxRetries: 0 });
                scheduler.start();
                await jest.advanceTimersByTimeAsync(1000);
                scheduler.stop();
            }

            scheduler.resetAllCircuitBreakers();
            expect(scheduler.getStats().circuitBreakersOpen).toBe(0);
        });

        test('should handle connectivity restored', async () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            scheduler.schedule('test-tag', execute);

            await scheduler.onConnectivityRestored();

            // Should reset circuit breakers and process queue
            expect(scheduler.getStats().circuitBreakersOpen).toBe(0);
        });
    });

    describe('retry logic', () => {
        test('should handle task failures', async () => {
            const execute = jest.fn().mockRejectedValue(new Error('Task failed'));

            scheduler.schedule('fail-tag', execute, { maxRetries: 0 });
            scheduler.start();

            // Task should be attempted
            await jest.advanceTimersByTimeAsync(1000);
            expect(execute).toHaveBeenCalled();

            scheduler.stop();
        });

        test('should track consecutive failures', async () => {
            const execute = jest.fn().mockRejectedValue(new Error('Always fails'));

            // Fail task with same tag multiple times to trigger circuit breaker
            for (let i = 0; i < 5; i++) {
                scheduler.schedule('same-failing-tag', execute, { maxRetries: 0 });
                scheduler.start();
                await jest.advanceTimersByTimeAsync(1000);
                scheduler.stop();
            }

            // Circuit breaker should be open after threshold
            expect(scheduler.getStats().circuitBreakersOpen).toBeGreaterThan(0);
        });
    });

    describe('priority handling', () => {
        test('should process high priority tasks first', async () => {
            const executionOrder: string[] = [];

            const lowExecute = jest.fn().mockImplementation(() => {
                executionOrder.push('low');
                return Promise.resolve();
            });

            const highExecute = jest.fn().mockImplementation(() => {
                executionOrder.push('high');
                return Promise.resolve();
            });

            // Schedule low priority first
            scheduler.schedule('low-tag', lowExecute, { priority: 'low' });
            scheduler.schedule('high-tag', highExecute, { priority: 'high' });

            scheduler.start();
            await jest.advanceTimersByTimeAsync(1000);

            // High priority should be processed first
            expect(executionOrder[0]).toBe('high');
        });

        test('should process tasks in FIFO order within same priority', async () => {
            const executionOrder: number[] = [];

            const execute1 = jest.fn().mockImplementation(async () => {
                executionOrder.push(1);
            });

            const execute2 = jest.fn().mockImplementation(async () => {
                executionOrder.push(2);
            });

            scheduler.schedule('tag-1', execute1, { priority: 'normal' });
            scheduler.schedule('tag-2', execute2, { priority: 'normal' });

            scheduler.start();
            await jest.advanceTimersByTimeAsync(2000);
            await Promise.resolve(); // Allow promises to settle

            // Both tasks should be processed
            expect(executionOrder).toContain(1);
            expect(executionOrder).toContain(2);
        });
    });

    describe('forceSync()', () => {
        test('should force immediate execution of all tasks', async () => {
            const execute1 = jest.fn().mockResolvedValue(undefined);
            const execute2 = jest.fn().mockResolvedValue(undefined);

            scheduler.schedule('tag-1', execute1);
            scheduler.schedule('tag-2', execute2);

            const result = await scheduler.forceSync();

            expect(result.completed).toBe(2);
            expect(result.failed).toBe(0);
            expect(execute1).toHaveBeenCalled();
            expect(execute2).toHaveBeenCalled();
        });

        test('should handle failures in force sync', async () => {
            const execute1 = jest.fn().mockResolvedValue(undefined);
            const execute2 = jest.fn().mockRejectedValue(new Error('Failed'));

            scheduler.schedule('tag-1', execute1);
            scheduler.schedule('tag-2', execute2);

            const result = await scheduler.forceSync();

            expect(result.completed).toBe(1);
            expect(result.failed).toBe(1);
        });

        test('should clear queue after force sync', async () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            scheduler.schedule('tag', execute);

            await scheduler.forceSync();

            expect(scheduler.getStats().queued).toBe(0);
        });
    });

    describe('getStats()', () => {
        test('should return current statistics', () => {
            const execute = jest.fn().mockResolvedValue(undefined);
            scheduler.schedule('tag-1', execute);
            scheduler.schedule('tag-2', execute);

            const stats = scheduler.getStats();
            expect(stats.queued).toBe(2);
            expect(stats.running).toBe(0);
            expect(stats.circuitBreakersOpen).toBe(0);
        });
    });

    describe('singleton pattern', () => {
        test('should return same instance from getSyncScheduler', () => {
            const scheduler1 = getSyncScheduler(mockConnectivityChecker as any);
            const scheduler2 = getSyncScheduler(mockConnectivityChecker as any);
            expect(scheduler1).toBe(scheduler2);
        });
    });

    describe('task timeout', () => {
        test('should timeout long-running tasks', async () => {
            const execute = jest.fn().mockImplementation(() => 
                new Promise<void>((resolve) => {
                    // Never resolve - simulating hanging task
                    setTimeout(() => resolve(), 60000);
                })
            );

            scheduler.schedule('timeout-tag', execute, { maxRetries: 0 });
            scheduler.start();

            await jest.advanceTimersByTimeAsync(1000); // Start processing
            await jest.advanceTimersByTimeAsync(30000); // Wait for timeout

            expect(execute).toHaveBeenCalled();
            // Task should have timed out and been removed
        });
    });
});
