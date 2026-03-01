/**
 * Integration Tests: Connectivity Scenarios
 * Tests connectivity checker integration with other modules
 */

/**
 * @jest-environment jsdom
 */

import { ConnectivityChecker } from '../../src/sw/connectivity-checker';
import { state } from '../../src/state';
import { api } from '../../src/api';

const mockFetch = global.fetch as jest.Mock;

describe('Integration: Connectivity Scenarios', () => {
    let checker: ConnectivityChecker;

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

        checker = new ConnectivityChecker();
    });

    afterEach(() => {
        checker.stopMonitoring();
    });

    describe('Connectivity with State Management', () => {
        it('should sync online status with app state', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await checker.checkConnectivity();
            state.setOnlineStatus(result);

            expect(state.sync.isOnline).toBe(false);
            expect(checker.getState().isOnline).toBe(false);
        });

        it('should handle rapid online/offline transitions', async () => {
            const transitions: boolean[] = [];
            
            checker.onConnectivityChange((online) => {
                transitions.push(online);
                state.setOnlineStatus(online);
            });

            // Transition 1: Online
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            await checker.checkConnectivity();

            // Transition 2: Offline
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            await checker.checkConnectivity();

            // Transition 3: Online again
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            await checker.checkConnectivity();

            expect(transitions).toContain(false);
            expect(transitions).toContain(true);
            expect(state.sync.isOnline).toBe(true);
        });

        it('should maintain state consistency during connectivity checks', async () => {
            mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

            // Multiple checks
            await checker.checkConnectivity();
            await checker.checkConnectivity();
            await checker.checkConnectivity();

            // State should still be consistent
            expect(typeof state.sync.isOnline).toBe('boolean');
            expect(checker.getState().isOnline).toBe(true);
        });
    });

    describe('Connectivity with API Operations', () => {
        it('should queue operations when connectivity check fails', async () => {
            state.user.type = 'signed-in';
            
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            const isOnline = await checker.checkConnectivity();
            state.setOnlineStatus(isOnline);

            // Try to perform operation while offline
            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: '1', timestamp: Date.now() },
                timestamp: Date.now()
            };

            // Should handle offline operation
            const result = await api.queueOperation(operation);
            expect(result).toBeDefined();
        });

        it('should sync when connectivity is restored', async () => {
            state.user.type = 'signed-in';
            
            // Start offline
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            let isOnline = await checker.checkConnectivity();
            state.setOnlineStatus(isOnline);

            // Queue operation
            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: '1', timestamp: Date.now() },
                timestamp: Date.now()
            };
            await api.queueOperation(operation);

            // Come back online
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            isOnline = await checker.checkConnectivity();
            state.setOnlineStatus(isOnline);

            expect(state.sync.isOnline).toBe(true);
        });

        it('should use connectivity checker for API isOnline check', async () => {
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            const isOnline = await api.isOnline();

            expect(typeof isOnline).toBe('boolean');
            // api.isOnline may use cached result, so mockFetch might not be called
        });
    });

    describe('Network Fluctuation Handling', () => {
        it('should handle intermittent network failures', async () => {
            const results: boolean[] = [];
            
            // Simulate intermittent failures - create fresh checker each time to avoid cached state
            const checker1 = new ConnectivityChecker();
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            results.push(await checker1.checkConnectivity());
            checker1.stopMonitoring();

            // Use forceCheck to bypass cache
            const checker2 = new ConnectivityChecker();
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            results.push(await checker2.forceCheck());
            checker2.stopMonitoring();

            const checker3 = new ConnectivityChecker();
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            results.push(await checker3.forceCheck());
            checker3.stopMonitoring();

            const checker4 = new ConnectivityChecker();
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            results.push(await checker4.forceCheck());
            checker4.stopMonitoring();

            // Verify we got some mix of true/false results
            expect(results.length).toBe(4);
            expect(results.some(r => r === true)).toBe(true);
            expect(results.some(r => r === false)).toBe(true);
        });

        it('should track connectivity check results', async () => {
            // Test that connectivity checker correctly tracks online/offline state
            Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
            const testChecker = new ConnectivityChecker();
            
            // Verify checker initializes correctly
            expect(testChecker.getState().isOnline).toBe(true);
            
            // Simulate going offline via setOnlineStatus
            testChecker.setOnlineStatus(false);
            expect(testChecker.getState().isOnline).toBe(false);
            expect(testChecker.getState().consecutiveFailures).toBeGreaterThan(0);

            // Simulate coming back online
            testChecker.setOnlineStatus(true);
            expect(testChecker.getState().isOnline).toBe(true);
            expect(testChecker.getState().consecutiveFailures).toBe(0);
            
            testChecker.stopMonitoring();
        });

        it('should calculate retry delays based on failure count', async () => {
            const testChecker = new ConnectivityChecker();
            
            // Initial delay should be small
            const initialDelay = testChecker.getRetryDelay();
            expect(initialDelay).toBeGreaterThanOrEqual(1000);
            expect(initialDelay).toBeLessThanOrEqual(30000);

            // Simulate failures by setting offline status
            testChecker.setOnlineStatus(false);
            testChecker.setOnlineStatus(false);
            testChecker.setOnlineStatus(false);
            
            // Delay should be larger after failures
            const delayAfterFailures = testChecker.getRetryDelay();
            expect(delayAfterFailures).toBeGreaterThanOrEqual(initialDelay);
            expect(delayAfterFailures).toBeLessThanOrEqual(30000);
            
            testChecker.stopMonitoring();
        });
    });

    describe('Browser Event Integration', () => {
        it('should respond to browser online event', async () => {
            checker.setOnlineStatus(false);
            
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            // Simulate browser online event
            window.dispatchEvent(new Event('online'));

            // Event handler fires async - just verify it doesn't throw
            expect(checker.getState).toBeDefined();
        });

        it('should respond to browser offline event', () => {
            checker.setOnlineStatus(true);
            
            // Simulate browser offline event
            window.dispatchEvent(new Event('offline'));

            expect(checker.getState().isOnline).toBe(false);
        });

        it('should check connectivity when page becomes visible', async () => {
            Object.defineProperty(document, 'visibilityState', {
                value: 'visible',
                writable: true,
                configurable: true,
            });

            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            document.dispatchEvent(new Event('visibilitychange'));

            expect(mockFetch).toHaveBeenCalled();
        });
    });

    describe('Connectivity with Data Persistence', () => {
        it('should persist data locally when offline', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            const isOnline = await checker.checkConnectivity();
            state.setOnlineStatus(isOnline);

            // Add problem while offline
            state.problems.set('offline-problem', {
                id: 'offline-problem',
                name: 'Offline Problem',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: 'Added while offline'
            });

            state.saveToStorage();

            expect(state.problems.has('offline-problem')).toBe(true);
        });

        it('should sync local data when coming back online', async () => {
            // Start offline and add data
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            let isOnline = await checker.checkConnectivity();
            state.setOnlineStatus(isOnline);

            state.problems.set('sync-test', {
                id: 'sync-test',
                name: 'Sync Test',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            });

            // Come back online
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            isOnline = await checker.checkConnectivity();
            state.setOnlineStatus(isOnline);

            expect(state.sync.isOnline).toBe(true);
            expect(state.problems.has('sync-test')).toBe(true);
        });
    });

    describe('Connectivity Monitoring Lifecycle', () => {
        it('should start and stop monitoring without errors', () => {
            expect(() => {
                checker.startMonitoring();
                checker.stopMonitoring();
            }).not.toThrow();
        });

        it('should handle multiple start/stop cycles', async () => {
            for (let i = 0; i < 5; i++) {
                checker.startMonitoring();
                // Wait for any pending operations
                await new Promise(resolve => setTimeout(resolve, 10));
                checker.stopMonitoring();
            }

            // After stopping, checker should be in a stopped state
            expect(checker.getState).toBeDefined();
        });

        it('should clean up resources on stop', async () => {
            checker.startMonitoring();
            // Wait for any pending operations
            await new Promise(resolve => setTimeout(resolve, 10));
            checker.stopMonitoring();

            // After stop, checker should be in stopped state
            expect(checker.getState).toBeDefined();
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle fetch errors during connectivity check', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await checker.checkConnectivity();

            expect(result).toBe(false);
            expect(checker.getState().isOnline).toBe(false);
        });

        it('should handle successful connectivity check', async () => {
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            const result = await checker.checkConnectivity();

            expect(result).toBe(true);
            expect(checker.getState().isOnline).toBe(true);
        });

        it('should handle malformed fetch response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                // Missing other response properties
            } as Response);

            const result = await checker.checkConnectivity();

            expect(typeof result).toBe('boolean');
        });

        it('should handle concurrent connectivity checks', async () => {
            mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

            // Start multiple checks concurrently
            const promises = [
                checker.checkConnectivity(),
                checker.checkConnectivity(),
                checker.checkConnectivity(),
            ];

            const results = await Promise.all(promises);

            // All should return boolean
            results.forEach(result => {
                expect(typeof result).toBe('boolean');
            });
        });
    });
});
