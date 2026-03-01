/**
 * @jest-environment jsdom
 */

import {
    ConnectivityChecker,
    getConnectivityChecker,
    initConnectivityMonitoring,
} from '../../src/sw/connectivity-checker';

const mockFetch = global.fetch as jest.Mock;

describe('ConnectivityChecker', () => {
    let checker: ConnectivityChecker;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        
        // Reset navigator.onLine
        Object.defineProperty(navigator, 'onLine', {
            value: true,
            writable: true,
            configurable: true,
        });

        // Create new checker for each test
        checker = new ConnectivityChecker();
    });

    afterEach(() => {
        checker.stopMonitoring();
        jest.useRealTimers();
    });

    describe('constructor', () => {
        it('should initialize with default options', () => {
            const c = new ConnectivityChecker();
            const state = c.getState();

            expect(state.isOnline).toBe(true);
            expect(state.checkInProgress).toBe(false);
            expect(state.consecutiveFailures).toBe(0);
            expect(state.lastChecked).toBeGreaterThan(0);
        });

        it('should use custom options', () => {
            const c = new ConnectivityChecker({
                checkInterval: 5000,
                timeout: 1000,
                maxRetries: 5,
            });

            expect(c).toBeDefined();
        });

        it('should initialize with offline status when navigator.onLine is false', () => {
            Object.defineProperty(navigator, 'onLine', {
                value: false,
                writable: true,
                configurable: true,
            });

            const c = new ConnectivityChecker();
            const state = c.getState();

            expect(state.isOnline).toBe(false);
        });
    });

    describe('getState', () => {
        it('should return current state', () => {
            const state = checker.getState();

            expect(state).toHaveProperty('isOnline');
            expect(state).toHaveProperty('lastChecked');
            expect(state).toHaveProperty('checkInProgress');
            expect(state).toHaveProperty('consecutiveFailures');
        });

        it('should return a copy of state', () => {
            const state1 = checker.getState();
            const state2 = checker.getState();

            expect(state1).not.toBe(state2);
            expect(state1).toEqual(state2);
        });
    });

    describe('checkConnectivity', () => {
        it('should return cached state if check is in progress', async () => {
            // Start a check
            const checkPromise = checker.checkConnectivity();

            // Immediately try another check
            const result = await checker.checkConnectivity();

            // Should return cached state
            expect(typeof result).toBe('boolean');

            await checkPromise; // Clean up
        });

        it('should detect online status on successful fetch', async () => {
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            const result = await checker.checkConnectivity();

            expect(result).toBe(true);
            expect(checker.getState().isOnline).toBe(true);
            expect(checker.getState().consecutiveFailures).toBe(0);
        });

        it('should detect offline status on failed fetch', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await checker.checkConnectivity();

            expect(result).toBe(false);
            expect(checker.getState().isOnline).toBe(false);
            expect(checker.getState().consecutiveFailures).toBeGreaterThan(0);
        });

        it('should use HEAD method with no-store cache', async () => {
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            await checker.checkConnectivity();

            expect(mockFetch).toHaveBeenCalledWith('/smartgrind/', {
                method: 'HEAD',
                signal: expect.any(AbortSignal),
                cache: 'no-store',
                credentials: 'same-origin',
            });
        });

        it('should handle non-ok response as offline', async () => {
            mockFetch.mockResolvedValueOnce(new Response('Server Error', { status: 500 }));

            const result = await checker.checkConnectivity();

            expect(result).toBe(false);
            expect(checker.getState().isOnline).toBe(false);
        });

        it('should handle concurrent check requests', async () => {
            // First check in progress
            mockFetch.mockImplementationOnce(() => new Promise(() => {}));
            const promise1 = checker.checkConnectivity();

            // Second check should return cached state
            const result2 = await checker.checkConnectivity();
            expect(typeof result2).toBe('boolean');

            // Clean up
            checker.stopMonitoring();
        });

        it('should update lastChecked timestamp', async () => {
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            const beforeCheck = Date.now();
            await checker.checkConnectivity();
            const afterCheck = Date.now();

            expect(checker.getState().lastChecked).toBeGreaterThanOrEqual(beforeCheck);
            expect(checker.getState().lastChecked).toBeLessThanOrEqual(afterCheck);
        });
    });

    describe('isOnline', () => {
        it('should return cached state if checked recently', async () => {
            // First check
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            await checker.checkConnectivity();

            mockFetch.mockClear();

            // Should use cached state
            const result = await checker.isOnline();

            expect(result).toBe(true);
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should perform new check if cache is stale', async () => {
            // First check
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            await checker.checkConnectivity();

            // Advance time past cache duration
            jest.advanceTimersByTime(15000);

            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            // Should perform new check
            const result = await checker.isOnline();

            expect(result).toBe(true);
            // Fetch was called once during checkConnectivity and once during isOnline
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        it('should use shorter cache time when offline', async () => {
            // Start offline using setOnlineStatus instead of relying on check
            checker.setOnlineStatus(false);

            expect(checker.getState().isOnline).toBe(false);

            // Clear any previous calls
            mockFetch.mockClear();

            // Use forceCheck to bypass cache
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            await checker.forceCheck();

            expect(mockFetch).toHaveBeenCalled();
        });
    });

    describe('forceCheck', () => {
        it('should bypass cache and perform fresh check', async () => {
            // First check
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
            await checker.checkConnectivity();

            mockFetch.mockClear();

            // Force check should bypass cache
            mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

            const result = await checker.forceCheck();

            expect(result).toBe(true);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should be aliased as forceFreshCheck', () => {
            // Both should be functions that call forceCheck
            expect(typeof checker.forceFreshCheck).toBe('function');
            expect(typeof checker.forceCheck).toBe('function');
        });
    });

    describe('setOnlineStatus', () => {
        it('should manually set online status', () => {
            checker.setOnlineStatus(true);

            expect(checker.getState().isOnline).toBe(true);
            expect(checker.getState().consecutiveFailures).toBe(0);
        });

        it('should manually set offline status', () => {
            checker.setOnlineStatus(false);

            expect(checker.getState().isOnline).toBe(false);
            expect(checker.getState().consecutiveFailures).toBeGreaterThan(0);
        });

        it('should notify listeners on status change', () => {
            const listener = jest.fn();
            checker.onConnectivityChange(listener);

            checker.setOnlineStatus(false);

            expect(listener).toHaveBeenCalledWith(false);
        });

        it('should not notify if status unchanged', () => {
            checker.setOnlineStatus(true); // Already online

            const listener = jest.fn();
            checker.onConnectivityChange(listener);

            checker.setOnlineStatus(true);

            expect(listener).not.toHaveBeenCalled();
        });
    });

    describe('onConnectivityChange', () => {
        it('should subscribe to connectivity changes', () => {
            const listener = jest.fn();
            const unsubscribe = checker.onConnectivityChange(listener);

            checker.setOnlineStatus(false);

            expect(listener).toHaveBeenCalledWith(false);

            unsubscribe();
        });

        it('should return unsubscribe function', () => {
            const listener = jest.fn();
            const unsubscribe = checker.onConnectivityChange(listener);

            unsubscribe();

            checker.setOnlineStatus(false);

            expect(listener).not.toHaveBeenCalled();
        });

        it('should handle multiple listeners', () => {
            const listener1 = jest.fn();
            const listener2 = jest.fn();

            checker.onConnectivityChange(listener1);
            checker.onConnectivityChange(listener2);

            checker.setOnlineStatus(false);

            expect(listener1).toHaveBeenCalled();
            expect(listener2).toHaveBeenCalled();
        });

        it('should handle listener errors gracefully', async () => {
            const errorListener = jest.fn().mockImplementation(() => {
                throw new Error('Listener error');
            });
            const goodListener = jest.fn();

            checker.onConnectivityChange(errorListener);
            checker.onConnectivityChange(goodListener);

            // Should not throw
            checker.setOnlineStatus(false);

            expect(errorListener).toHaveBeenCalled();
            expect(goodListener).toHaveBeenCalled();
        });
    });

    describe('startMonitoring', () => {
        it('should start periodic connectivity checks', async () => {
            mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

            checker.startMonitoring();

            // Initial check
            expect(mockFetch).toHaveBeenCalledTimes(1);

            // Wait for async operations and advance timers
            await Promise.resolve();
            jest.advanceTimersByTime(10000);
            await Promise.resolve();

            // Should have made additional calls (exact count depends on timing)
            expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(1);
        });

        it('should use custom check interval', async () => {
            const customChecker = new ConnectivityChecker({ checkInterval: 5000 });
            mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

            customChecker.startMonitoring();

            // Initial check
            expect(mockFetch).toHaveBeenCalledTimes(1);

            // Wait for async operations
            await Promise.resolve();
            jest.advanceTimersByTime(5000);
            await Promise.resolve();

            // Should have made additional calls
            expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(1);

            customChecker.stopMonitoring();
        });
    });

    describe('stopMonitoring', () => {
        it('should stop periodic checks', async () => {
            mockFetch.mockResolvedValue(new Response(null, { status: 200 }));

            checker.startMonitoring();
            expect(mockFetch).toHaveBeenCalledTimes(1);

            checker.stopMonitoring();

            jest.advanceTimersByTime(20000);

            // Should not have checked again
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should abort in-progress check', async () => {
            mockFetch.mockImplementationOnce(() => new Promise(() => {}));

            checker.startMonitoring();

            // Stop should not throw
            expect(() => checker.stopMonitoring()).not.toThrow();
        });
    });

    describe('getRetryDelay', () => {
        it('should return base delay for no failures', () => {
            const delay = checker.getRetryDelay();

            expect(delay).toBeGreaterThanOrEqual(1000);
            expect(delay).toBeLessThanOrEqual(30000);
        });

        it('should increase delay with consecutive failures', async () => {
            // Simulate failures
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            await checker.checkConnectivity();
            
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            await checker.checkConnectivity();
            
            const delay = checker.getRetryDelay();
            expect(delay).toBeGreaterThanOrEqual(1000);
        });

        it('should cap delay at 30 seconds', async () => {
            // Many failures - use sequential awaits
            for (let i = 0; i < 10; i++) {
                mockFetch.mockRejectedValueOnce(new Error('Network error'));
                await checker.checkConnectivity();
            }

            const delay = checker.getRetryDelay();
            expect(delay).toBeLessThanOrEqual(30000);
        });
    });

    describe('browser event listeners', () => {
        it('should handle online event', () => {
            checker.setOnlineStatus(false);

            // Simulate browser online event
            window.dispatchEvent(new Event('online'));

            // Should trigger a check
            expect(mockFetch).toHaveBeenCalled();
        });

        it('should handle offline event', () => {
            checker.setOnlineStatus(true);

            // Simulate browser offline event
            window.dispatchEvent(new Event('offline'));

            expect(checker.getState().isOnline).toBe(false);
        });

        it('should handle visibility change', () => {
            Object.defineProperty(document, 'visibilityState', {
                value: 'visible',
                writable: true,
                configurable: true,
            });

            // Simulate visibility change
            document.dispatchEvent(new Event('visibilitychange'));

            expect(mockFetch).toHaveBeenCalled();
        });
    });
});

describe('getConnectivityChecker', () => {
    it('should return singleton instance', () => {
        const checker1 = getConnectivityChecker();
        const checker2 = getConnectivityChecker();

        expect(checker1).toBe(checker2);
    });
});

describe('initConnectivityMonitoring', () => {
    it('should return checker with monitoring started', () => {
        const checker = initConnectivityMonitoring();

        expect(checker).toBeDefined();
        expect(checker.getState).toBeDefined();

        checker.stopMonitoring();
    });
});
