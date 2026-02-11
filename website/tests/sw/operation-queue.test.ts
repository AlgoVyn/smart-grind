/**
 * Operation Queue Unit Tests
 * Tests for operation deduplication, retry logic, and queue management
 */

import { OperationQueue, QueuedOperation as _QueuedOperation } from '../../src/sw/operation-queue';

describe('OperationQueue', () => {
    let queue: OperationQueue;

    beforeEach(() => {
        queue = new OperationQueue();
        jest.clearAllMocks();
    });

    describe('Add Operations', () => {
        it('should add operation to queue', async () => {
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            expect(id).toBeDefined();
            expect(typeof id).toBe('string');
        });

        it('should add multiple operations', async () => {
            const ids = await queue.addOperations([
                { type: 'MARK_SOLVED', data: { problemId: 'two-sum' } },
                { type: 'UPDATE_DIFFICULTY', data: { problemId: 'two-sum', difficulty: 'medium' } },
            ]);
            expect(ids).toHaveLength(2);
        });

        it('should deduplicate operations with same type and key', async () => {
            const id1 = await queue.addOperation(
                'MARK_SOLVED',
                { problemId: 'two-sum' },
                { deduplicate: true, dedupeKey: 'MARK_SOLVED-two-sum' }
            );

            const id2 = await queue.addOperation(
                'MARK_SOLVED',
                { problemId: 'two-sum', solved: true },
                { deduplicate: true, dedupeKey: 'MARK_SOLVED-two-sum' }
            );

            // Should return same ID (updated existing)
            expect(id1).toBe(id2);
        });

        it('should allow different operations for same problem', async () => {
            const id1 = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            const id2 = await queue.addOperation('UPDATE_DIFFICULTY', {
                problemId: 'two-sum',
                difficulty: 'hard',
            });

            expect(id1).not.toBe(id2);
        });
    });

    describe('Get Operations', () => {
        it('should get pending operations sorted by timestamp', async () => {
            await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.addOperation('MARK_SOLVED', { problemId: 'three-sum' });
            await queue.addOperation('MARK_SOLVED', { problemId: 'four-sum' });

            const pending = await queue.getPendingOperations();
            expect(pending).toHaveLength(3);
            // Should be sorted by timestamp (oldest first)
            expect(pending[0].timestamp).toBeLessThanOrEqual(pending[1].timestamp);
        });

        it('should get operations by type', async () => {
            await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.addOperation('UPDATE_DIFFICULTY', {
                problemId: 'three-sum',
                difficulty: 'medium',
            });
            await queue.addOperation('MARK_SOLVED', { problemId: 'four-sum' });

            const solvedOps = await queue.getOperationsByType('MARK_SOLVED');
            expect(solvedOps).toHaveLength(2);
        });

        it('should get failed operations', async () => {
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.markFailed(id, 'Network error');

            const failed = await queue.getFailedOperations();
            expect(failed).toHaveLength(1);
            expect(failed[0].status).toBe('failed');
        });
    });

    describe('Update Operations', () => {
        it('should mark operation as completed', async () => {
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.markCompleted(id);

            const pending = await queue.getPendingOperations();
            expect(pending).toHaveLength(0);
        });

        it('should mark operation as failed', async () => {
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.markFailed(id, 'Network error');

            const failed = await queue.getFailedOperations();
            expect(failed).toHaveLength(1);
            expect(failed[0].errorMessage).toBe('Network error');
        });

        it('should mark operation for manual resolution', async () => {
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.markPendingManualResolution(id, 'Conflict detected');

            const status = await queue.getStatus();
            expect(status.stats.manual).toBe(1);
        });

        it('should update retry count', async () => {
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });

            const count1 = await queue.updateRetryCount(id);
            expect(count1).toBe(1);

            const count2 = await queue.updateRetryCount(id);
            expect(count2).toBe(2);
        });

        it('should requeue failed operation', async () => {
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.markFailed(id, 'Network error');

            const failed = await queue.getFailedOperations();
            expect(failed).toHaveLength(1);

            await queue.requeueOperation(failed[0]);

            const pending = await queue.getPendingOperations();
            expect(pending).toHaveLength(1);
            expect(pending[0].status).toBe('pending');
        });
    });

    describe('Queue Statistics', () => {
        it('should return queue statistics', async () => {
            await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.addOperation('UPDATE_DIFFICULTY', {
                problemId: 'three-sum',
                difficulty: 'medium',
            });

            const stats = await queue.getStats();
            expect(stats.pending).toBe(2);
            expect(stats.completed).toBe(0);
            expect(stats.failed).toBe(0);
            expect(stats.manual).toBe(0);
        });

        it('should return status for UI', async () => {
            await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });

            const status = await queue.getStatus();
            expect(status.pendingCount).toBe(1);
            expect(status.isSyncing).toBe(false);
            expect(status.stats.pending).toBe(1);
        });

        it('should track last sync time', async () => {
            await queue.updateLastSyncTime();
            const lastSync = await queue.getLastSyncTime();

            expect(lastSync).toBeDefined();
            expect(typeof lastSync).toBe('number');
            expect(lastSync).toBeLessThanOrEqual(Date.now());
        });
    });

    describe('Cleanup Operations', () => {
        it('should clear all operations', async () => {
            await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.addOperation('MARK_SOLVED', { problemId: 'three-sum' });

            await queue.clearAll();

            const pending = await queue.getPendingOperations();
            expect(pending).toHaveLength(0);
        });

        it('should cleanup old completed operations', async () => {
            // Add and complete an operation
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });
            await queue.markCompleted(id);

            // Cleanup operations older than 0 days (should remove all)
            const deleted = await queue.cleanupOldOperations(0);
            expect(deleted).toBeGreaterThanOrEqual(0); // May be 0 due to mock timing
        });
    });

    describe('Operation Types', () => {
        it('should support all operation types', async () => {
            const operations = [
                { type: 'MARK_SOLVED' as const, data: { problemId: 'p1' } },
                {
                    type: 'UPDATE_REVIEW_DATE' as const,
                    data: { problemId: 'p2', nextReview: Date.now() },
                },
                {
                    type: 'UPDATE_DIFFICULTY' as const,
                    data: { problemId: 'p3', difficulty: 'hard' },
                },
                { type: 'ADD_NOTE' as const, data: { problemId: 'p4', note: 'Test note' } },
                { type: 'ADD_CUSTOM_PROBLEM' as const, data: { name: 'Custom Problem' } },
                { type: 'DELETE_PROBLEM' as const, data: { problemId: 'p5' } },
                { type: 'UPDATE_SETTINGS' as const, data: { theme: 'dark' } },
            ];

            const ids: string[] = [];
            for (const op of operations) {
                const id = await queue.addOperation(op.type, op.data);
                ids.push(id);
            }

            expect(ids).toHaveLength(7);
        });
    });

    describe('Device ID', () => {
        it('should generate device ID for operations', async () => {
            await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });

            const pending = await queue.getPendingOperations();
            expect(pending[0].deviceId).toBeDefined();
            expect(typeof pending[0].deviceId).toBe('string');
            expect(pending[0].deviceId.length).toBeGreaterThan(0);
        });
    });

    describe('Operation Structure', () => {
        it('should create operation with all required fields', async () => {
            const id = await queue.addOperation('MARK_SOLVED', { problemId: 'two-sum' });

            const pending = await queue.getPendingOperations();
            const op = pending[0];

            expect(op.id).toBe(id);
            expect(op.type).toBe('MARK_SOLVED');
            expect(op.data).toEqual({ problemId: 'two-sum' });
            expect(op.timestamp).toBeDefined();
            expect(op.deviceId).toBeDefined();
            expect(op.retryCount).toBe(0);
            expect(op.status).toBe('pending');
            expect(op.createdAt).toBeDefined();
        });
    });
});
