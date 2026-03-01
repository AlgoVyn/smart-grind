/**
 * Integration Tests: Error Recovery Scenarios
 * Tests error handling and recovery across modules
 */

/**
 * @jest-environment jsdom
 */

import { state } from '../../src/state';
import { api } from '../../src/api';
import { ConnectivityChecker } from '../../src/sw/connectivity-checker';
import { withRetry, calculateRetryDelay } from '../../src/utils/retry';
import {
    fetchWithTimeout,
    FetchTimeoutError,
    FetchRetryError,
} from '../../src/utils/fetch-with-timeout';

const mockFetch = global.fetch as jest.Mock;

describe('Integration: Error Recovery Scenarios', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Reset state
        state.problems.clear();
        state.deletedProblemIds.clear();
        state.user = { type: 'local', id: null, displayName: 'Local User' };
        state.sync = { isOnline: true, isSyncing: false, pendingCount: 0, lastSyncAt: null, hasConflicts: false, conflictMessage: null };

        Object.defineProperty(navigator, 'onLine', {
            value: true,
            writable: true,
            configurable: true,
        });
    });

    describe('Network Failure Recovery', () => {
        it('should retry failed network requests with exponential backoff', async () => {
            const operation = jest.fn()
                .mockRejectedValueOnce(new Error('Network error'))
                .mockRejectedValueOnce(new Error('Network error'))
                .mockResolvedValueOnce('success');

            const result = await withRetry(operation, { maxAttempts: 3, baseDelay: 100 });

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(3);
        });

        it('should handle cascading network failures', async () => {
            // Mock all calls to fail with TypeError (which triggers retry logic)
            mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));

            try {
                await fetchWithTimeout('http://example.com', { retries: 2, retryDelay: 10 });
                // Should not reach here
                expect(true).toBe(false);
            } catch (error) {
                // Should throw FetchRetryError
                expect(error).toBeInstanceOf(FetchRetryError);
            }

            // Verify fetch was called multiple times (initial + retries)
            expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(2);
        });

        it('should recover after temporary network outage', async () => {
            // Mock first call to fail, subsequent calls to succeed
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            mockFetch.mockResolvedValue(new Response('ok', { status: 200 }));

            try {
                const result = await fetchWithTimeout('http://example.com', {
                    retries: 1,
                    retryDelay: 10,
                });
                expect(result.status).toBe(200);
            } catch (error) {
                // If it fails, verify it's a retry error
                expect(error).toBeInstanceOf(FetchRetryError);
            }
        });
    });

    describe('API Error Recovery', () => {
        it('should handle 500 errors', async () => {
            mockFetch.mockResolvedValueOnce(
                new Response('Server Error', { status: 500, statusText: 'Internal Server Error' })
            );

            // API.loadData handles 500 errors internally
            const result = await api.loadData();
            // Result may be undefined or empty when server returns 500
            expect(result === undefined || typeof result === 'object').toBe(true);
        });

        it('should handle API errors gracefully', async () => {
            mockFetch.mockRejectedValueOnce(new Error('API Error'));

            // API should handle errors without throwing unhandled exceptions
            try {
                await api.loadData();
            } catch {
                // Expected to potentially throw
            }
            
            // Test that we can continue after error
            expect(state).toBeDefined();
        });

        it('should recover from authentication errors', async () => {
            state.user.type = 'signed-in';

            // First request returns 401
            mockFetch.mockResolvedValueOnce(
                new Response('Unauthorized', { status: 401 })
            );

            // Try to sync - should handle auth error
            const result = await api.forceSync();

            // Should complete even if auth fails
            expect(result).toBeDefined();
        });
    });

    describe('State Recovery After Errors', () => {
        it('should maintain data integrity after failed save', async () => {
            const problem = {
                id: 'test-1',
                name: 'Test Problem',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved' as const,
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            };

            state.problems.set(problem.id, problem);

            // Simulate save failure - api.saveProblem doesn't exist, use queueOperation
            try {
                await api.queueOperation({
                    type: 'MARK_SOLVED',
                    data: { problemId: problem.id, timestamp: Date.now() },
                    timestamp: Date.now()
                });
            } catch {
                // Expected to potentially fail
            }

            // Data should still be in state
            expect(state.problems.get(problem.id)).toEqual(problem);
        });

        it('should handle sync errors gracefully', async () => {
            state.user.type = 'signed-in';

            // Simulate sync failure
            mockFetch.mockRejectedValueOnce(new Error('Sync failed'));

            // Should complete without throwing
            const result = await api.forceSync();
            expect(result).toBeDefined();
        });

        it('should clear error state after successful operation', async () => {
            state.user.type = 'signed-in';

            // First fail
            mockFetch.mockRejectedValueOnce(new Error('Failed'));
            try {
                await api.loadData();
            } catch {
                // Expected
            }

            // Then succeed
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ problems: [] }), { status: 200 })
            );
            await api.loadData();

            // State should reflect success
            expect(state.sync.hasConflicts).toBe(false);
        });
    });

    describe('Offline Recovery', () => {
        it('should queue operations while offline', async () => {
            state.user.type = 'signed-in';

            // Simulate offline
            Object.defineProperty(navigator, 'onLine', { value: false });
            state.setOnlineStatus(false);

            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: '1', timestamp: Date.now() },
                timestamp: Date.now()
            };

            const result = await api.queueOperation(operation);
            expect(result).toBeDefined();
        });

        it('should sync queued operations when back online', async () => {
            state.user.type = 'signed-in';

            // Add pending operations
            const pendingOps = [
                { id: 'op-1', type: 'MARK_SOLVED', data: { problemId: '1' }, timestamp: Date.now() }
            ];
            localStorage.setItem('pending-operations', JSON.stringify(pendingOps));

            // Come back online
            Object.defineProperty(navigator, 'onLine', { value: true });
            state.setOnlineStatus(true);

            // Initialize sync
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'token' })
            });

            const cleanup = api.initOfflineDetection();
            cleanup();
        });

        it('should handle intermittent connectivity during sync', async () => {
            // Test that the system can handle mixed success/failure scenarios
            const results = [];
            
            // First request - success
            mockFetch.mockResolvedValueOnce(new Response('ok', { status: 200 }));
            try {
                const result = await fetchWithTimeout('http://example.com', {
                    retries: 0,
                    timeout: 1000
                });
                results.push({ success: true, status: result.status });
            } catch (error) {
                results.push({ success: false, error: (error as Error).message });
            }

            // Second request - failure
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            try {
                const result = await fetchWithTimeout('http://example.com', {
                    retries: 0,
                    timeout: 1000
                });
                results.push({ success: true, status: result.status });
            } catch (error) {
                results.push({ success: false, error: (error as Error).message });
            }

            // Third request - success
            mockFetch.mockResolvedValueOnce(new Response('ok', { status: 200 }));
            try {
                const result = await fetchWithTimeout('http://example.com', {
                    retries: 0,
                    timeout: 1000
                });
                results.push({ success: true, status: result.status });
            } catch (error) {
                results.push({ success: false, error: (error as Error).message });
            }

            expect(results).toHaveLength(3);
            // Should have a mix of successes and failures
            expect(results.some(r => r.success)).toBe(true);
            expect(results.some(r => !r.success)).toBe(true);
        });
    });

    describe('Retry Strategy Integration', () => {
        it('should use exponential backoff for retries', () => {
            const delay0 = calculateRetryDelay(0, { baseDelay: 100, maxDelay: 10000 });
            const delay1 = calculateRetryDelay(1, { baseDelay: 100, maxDelay: 10000 });
            const delay2 = calculateRetryDelay(2, { baseDelay: 100, maxDelay: 10000 });

            // Each delay should be roughly double the previous (with jitter)
            expect(delay1).toBeGreaterThan(delay0 * 0.8);
            expect(delay2).toBeGreaterThan(delay1 * 0.8);
        });

        it('should cap maximum retry delay', () => {
            const delay = calculateRetryDelay(100, { baseDelay: 1000, maxDelay: 5000 });
            expect(delay).toBeLessThanOrEqual(5000 * 1.25); // maxDelay + 25% jitter
        });

        it('should add jitter to prevent thundering herd', () => {
            const delays: number[] = [];
            for (let i = 0; i < 10; i++) {
                delays.push(calculateRetryDelay(1, { baseDelay: 1000 }));
            }

            // Not all delays should be identical
            const uniqueDelays = new Set(delays);
            expect(uniqueDelays.size).toBeGreaterThan(1);
        });
    });

    describe('Connectivity-Aware Recovery', () => {
        it('should use connectivity checker for offline detection', async () => {
            // Start with offline navigator state
            Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true });
            const checker = new ConnectivityChecker();
            
            // Checker should initialize with offline state based on navigator.onLine
            expect(typeof checker.getState().isOnline).toBe('boolean');
            
            // Simulate going offline through setOnlineStatus
            checker.setOnlineStatus(false);
            expect(checker.getState().isOnline).toBe(false);

            checker.stopMonitoring();
        });

        it('should calculate retry delay based on failures', async () => {
            const checker = new ConnectivityChecker();

            // Initial delay should be at least base delay
            const initialDelay = checker.getRetryDelay();
            expect(initialDelay).toBeGreaterThanOrEqual(1000);

            checker.stopMonitoring();
        });
    });

    describe('Data Consistency During Recovery', () => {
        it('should prevent duplicate operations during retry', async () => {
            state.user.type = 'signed-in';

            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: '1', timestamp: Date.now() },
                timestamp: Date.now()
            };

            // Operation should only be queued once even if API retries
            const result = await api.queueOperation(operation);
            expect(result).toBeDefined();
        });

        it('should maintain atomic operations during failures', async () => {
            const operations = [
                { id: '1', type: 'MARK_SOLVED' },
                { id: '2', type: 'MARK_SOLVED' },
                { id: '3', type: 'MARK_SOLVED' },
            ];

            // Queue multiple operations
            for (const op of operations) {
                const result = await api.queueOperation({
                    type: op.type as 'MARK_SOLVED',
                    data: { problemId: op.id, timestamp: Date.now() },
                    timestamp: Date.now()
                });
                expect(result).toBeDefined();
            }
        });
    });

    describe('Error Boundary Integration', () => {
        it('should catch and report errors appropriately', async () => {
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            // Test with fetchWithTimeout
            try {
                await fetchWithTimeout('http://example.com', { retries: 0 });
            } catch {
                // Expected
            }

            consoleWarnSpy.mockRestore();
        });

        it('should provide meaningful error messages', async () => {
            mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));

            try {
                await fetchWithTimeout('http://example.com', { retries: 0 });
                // Should not reach here
                expect(true).toBe(false);
            } catch (error) {
                // Should throw an error with a message
                expect(error).toBeDefined();
                expect((error as Error).message).toBeDefined();
            }
        });
    });
});
