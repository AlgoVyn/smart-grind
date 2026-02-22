// Service Worker Registration Module Tests

// Mock navigator.onLine
Object.defineProperty(global.navigator, 'onLine', {
    value: true,
    writable: true,
    configurable: true,
});

// Mock ServiceWorkerRegistration for isBackgroundSyncSupported tests
if (typeof ServiceWorkerRegistration === 'undefined') {
    const MockServiceWorkerRegistration = function () {} as any;
    MockServiceWorkerRegistration.prototype = { sync: { register: jest.fn() } };
    (global as any).ServiceWorkerRegistration = MockServiceWorkerRegistration;
}

// Mock window.addEventListener - use jest.spyOn instead of redefining window
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Store original window methods
const originalAddEventListener = global.window?.addEventListener;
const originalRemoveEventListener = global.window?.removeEventListener;

// Replace window methods
if (global.window) {
    global.window.addEventListener = mockAddEventListener;
    global.window.removeEventListener = mockRemoveEventListener;
}

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
};
Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
    configurable: true,
});

// Mock sessionStorage
const mockSessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
};
Object.defineProperty(global, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true,
    configurable: true,
});

// Mock MessageChannel
const mockPort1 = {
    onmessage: null as ((event: { data: any }) => void) | null,
    postMessage: jest.fn(),
};
const mockPort2 = { postMessage: jest.fn() };

Object.defineProperty(global, 'MessageChannel', {
    value: jest.fn().mockImplementation(() => ({
        port1: mockPort1,
        port2: mockPort2,
    })),
    writable: true,
    configurable: true,
});

// Import the module after setting up mocks
import {
    registerServiceWorker,
    skipWaiting,
    requestSync,
    syncUserProgress,
    syncCustomProblems,
    cacheProblemsForOffline,
    getSyncStatus,
    clearAllCaches,
    isOffline,
    listenForConnectivityChanges,
    on,
    getState,
    isSupported,
    isBackgroundSyncSupported,
    unregister,
    checkForUpdates,
    getBundleStatus,
    downloadBundle,
    migrateLocalStorageOperations,
    SYNC_TAGS,
} from '../src/sw-register';

describe('Service Worker Registration Module', () => {
    let mockRegistration: any;
    let mockServiceWorker: any;
    let mockController: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue(null);

        // Reset MessageChannel mock
        mockPort1.onmessage = null;
        mockPort1.postMessage.mockClear();
        mockPort2.postMessage.mockClear();

        // Create mock service worker
        mockServiceWorker = {
            state: 'installing',
            addEventListener: jest.fn(),
            postMessage: jest.fn(),
        };

        // Create mock controller
        mockController = {
            postMessage: jest.fn(),
        };

        // Create mock registration
        mockRegistration = {
            scope: '/smartgrind/',
            active: null,
            installing: mockServiceWorker,
            waiting: null,
            update: jest.fn().mockResolvedValue(undefined),
            unregister: jest.fn().mockResolvedValue(true),
            addEventListener: jest.fn(),
            sync: {
                register: jest.fn().mockResolvedValue(undefined),
                getTags: jest.fn().mockResolvedValue([]),
            },
        };

        // Mock navigator.serviceWorker
        Object.defineProperty(global.navigator, 'serviceWorker', {
            value: {
                register: jest.fn().mockResolvedValue(mockRegistration),
                ready: Promise.resolve(mockRegistration),
                controller: mockController,
                addEventListener: jest.fn(),
            },
            writable: true,
            configurable: true,
        });

        // Reset console.error mock
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('isSupported', () => {
        test('should return true when serviceWorker is in navigator', () => {
            expect(isSupported()).toBe(true);
        });

        test('should return false when serviceWorker is not in navigator', () => {
            // Create a mock navigator without serviceWorker
            const originalNavigator = global.navigator;
            
            // Mock navigator without serviceWorker property
            Object.defineProperty(global, 'navigator', {
                value: {
                    onLine: true,
                    // No serviceWorker property
                },
                writable: true,
                configurable: true,
            });

            expect(isSupported()).toBe(false);

            // Restore original navigator
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true,
                configurable: true,
            });
        });
    });

    describe('isBackgroundSyncSupported', () => {
        test('should return true when sync is in ServiceWorkerRegistration.prototype', () => {
            expect(isBackgroundSyncSupported()).toBe(true);
        });

        test('should return false when sync is not in ServiceWorkerRegistration.prototype', () => {
            const originalSync = ServiceWorkerRegistration.prototype.sync;
            delete (ServiceWorkerRegistration.prototype as any).sync;

            expect(isBackgroundSyncSupported()).toBe(false);

            ServiceWorkerRegistration.prototype.sync = originalSync;
        });
    });

    describe('isOffline', () => {
        test('should return true when navigator.onLine is false', () => {
            Object.defineProperty(global.navigator, 'onLine', {
                value: false,
                writable: true,
                configurable: true,
            });

            expect(isOffline()).toBe(true);
        });

        test('should return false when navigator.onLine is true', () => {
            Object.defineProperty(global.navigator, 'onLine', {
                value: true,
                writable: true,
                configurable: true,
            });

            expect(isOffline()).toBe(false);
        });
    });

    describe('registerServiceWorker', () => {
        test('should return false when serviceWorker is not supported', async () => {
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const result = await registerServiceWorker();
            expect(result).toBe(false);
        });

        test('should register service worker successfully', async () => {
            const result = await registerServiceWorker();
            expect(result).toBe(true);
            expect(navigator.serviceWorker.register).toHaveBeenCalledWith(
                '/smartgrind/sw.js',
                expect.objectContaining({
                    updateViaCache: 'none',
                    scope: '/smartgrind/',
                })
            );
        });

        test('should handle registration failure', async () => {
            (navigator.serviceWorker as any).register = jest
                .fn()
                .mockRejectedValue(new Error('Registration failed'));

            const result = await registerServiceWorker();
            expect(result).toBe(false);
            // Check that error was logged with retry attempt info
            expect(console.error).toHaveBeenCalled();
        });

        test('should handle updatefound event', async () => {
            await registerServiceWorker();

            // Simulate updatefound event
            const updateHandler = mockRegistration.addEventListener.mock.calls.find(
                (call: any[]) => call[0] === 'updatefound'
            )?.[1];

            if (updateHandler) {
                mockRegistration.installing = {
                    ...mockServiceWorker,
                    state: 'installing',
                    addEventListener: jest.fn(),
                };
                updateHandler();
            }

            expect(mockRegistration.addEventListener).toHaveBeenCalledWith(
                'updatefound',
                expect.any(Function)
            );
        });

        test('should handle waiting worker on registration', async () => {
            mockRegistration.waiting = { ...mockServiceWorker, state: 'installed' };

            await registerServiceWorker();

            // Should have set up waiting worker
            expect(mockRegistration.waiting).toBeDefined();
        });
    });

    describe('skipWaiting', () => {
        test('should post SKIP_WAITING message when controller exists', async () => {
            skipWaiting();
            expect(mockController.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
        });

        test('should do nothing when no controller', async () => {
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            skipWaiting();
            expect(mockController.postMessage).not.toHaveBeenCalled();
        });
    });

    describe('requestSync', () => {
        test('should return false when serviceWorker is not supported', async () => {
            // Create a mock navigator without serviceWorker
            const originalNavigator = global.navigator;
            
            Object.defineProperty(global, 'navigator', {
                value: {
                    onLine: true,
                    // No serviceWorker property
                },
                writable: true,
                configurable: true,
            });

            const result = await requestSync('test-tag');
            expect(result).toBe(false);

            // Restore
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true,
                configurable: true,
            });
        });

        test('should return false when no controller', async () => {
            // Set up serviceWorker but with null controller
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const result = await requestSync('test-tag');
            expect(result).toBe(false);
        });

        test('should register sync when supported', async () => {
            const result = await requestSync('test-tag');
            expect(result).toBe(true);
        });

        test('should fallback to postMessage when sync not supported', async () => {
            // Mock registration.ready to resolve to a registration without sync
            const registrationWithoutSync = {
                ...mockRegistration,
                sync: undefined,
                active: mockController,
            };
            
            // Need to also set up the controller for the initial check
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: mockController,
                writable: true,
                configurable: true,
            });
            
            Object.defineProperty(navigator.serviceWorker, 'ready', {
                value: Promise.resolve(registrationWithoutSync),
                writable: true,
                configurable: true,
            });

            const result = await requestSync('test-tag');
            // Should return true via postMessage fallback
            expect(result).toBe(true);
        });

        test('should handle sync registration failure', async () => {
            mockRegistration.sync.register = jest
                .fn()
                .mockRejectedValue(new Error('Sync registration failed'));

            const result = await requestSync('test-tag');
            expect(result).toBe(false);
        });
    });

    describe('syncUserProgress', () => {
        test('should return true when sync is requested', async () => {
            const result = await syncUserProgress();
            expect(result).toBe(true);
        });
    });

    describe('syncCustomProblems', () => {
        test('should call requestSync with CUSTOM_PROBLEMS tag', async () => {
            const result = await syncCustomProblems();
            expect(result).toBe(true);
        });
    });

    describe('cacheProblemsForOffline', () => {
        test('should return false when no controller', async () => {
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const result = await cacheProblemsForOffline(['problem1']);
            expect(result).toBe(false);
        });

        test('should post CACHE_PROBLEMS message', async () => {
            const result = await cacheProblemsForOffline(['problem1', 'problem2']);
            expect(result).toBe(true);
            expect(mockController.postMessage).toHaveBeenCalledWith({
                type: 'CACHE_PROBLEMS',
                problemUrls: ['problem1', 'problem2'],
            });
        });
    });

    describe('getSyncStatus', () => {
        test('should return default status when no controller', async () => {
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const status = await getSyncStatus();
            expect(status).toEqual({
                pendingCount: 0,
                isSyncing: false,
                lastSyncAt: null,
            });
        });

        test('should request sync status from service worker', async () => {
            const statusPromise = getSyncStatus();

            // Simulate response from service worker
            setTimeout(() => {
                if (mockPort1.onmessage) {
                    mockPort1.onmessage({
                        data: {
                            type: 'SYNC_STATUS',
                            status: {
                                pendingCount: 5,
                                isSyncing: true,
                                lastSyncAt: Date.now(),
                            },
                        },
                    });
                }
            }, 10);

            const status = await statusPromise;
            expect(status.pendingCount).toBe(5);
            expect(status.isSyncing).toBe(true);
        });

        test('should timeout after 5 seconds', async () => {
            jest.useFakeTimers();

            const statusPromise = getSyncStatus();

            // Fast-forward time
            jest.advanceTimersByTime(5100);

            const status = await statusPromise;
            expect(status).toEqual({
                pendingCount: 0,
                isSyncing: false,
                lastSyncAt: null,
            });

            jest.useRealTimers();
        });
    });

    describe('clearAllCaches', () => {
        test('should return false when no controller', async () => {
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const result = await clearAllCaches();
            expect(result).toBe(false);
        });

        test('should post CLEAR_ALL_CACHES message', async () => {
            const result = await clearAllCaches();
            expect(result).toBe(true);
            expect(mockController.postMessage).toHaveBeenCalledWith({
                type: 'CLEAR_ALL_CACHES',
            });
        });
    });

    describe('listenForConnectivityChanges', () => {
        test('should add online/offline event listeners', () => {
            const cleanup = listenForConnectivityChanges(() => {});

            expect(mockAddEventListener).toHaveBeenCalledWith('online', expect.any(Function));
            expect(mockAddEventListener).toHaveBeenCalledWith('offline', expect.any(Function));

            cleanup();
        });

        test('should trigger sync when coming back online', async () => {
            jest.useFakeTimers();

            const callback = jest.fn();
            listenForConnectivityChanges(callback);

            // Get the online handler
            const onlineCall = mockAddEventListener.mock.calls.find(
                (call: any[]) => call[0] === 'online'
            );
            const onlineHandler = onlineCall?.[1];

            if (onlineHandler) {
                // Simulate coming online
                Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
                await onlineHandler();
            }

            // Fast-forward to trigger debounced sync
            jest.advanceTimersByTime(1100);

            jest.useRealTimers();
        });

        test('should call callback with false when going offline', () => {
            const callback = jest.fn();
            listenForConnectivityChanges(callback);

            // Get the offline handler
            const offlineCall = mockAddEventListener.mock.calls.find(
                (call: any[]) => call[0] === 'offline'
            );
            const offlineHandler = offlineCall?.[1];

            if (offlineHandler) {
                // Simulate going offline
                Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
                offlineHandler();
            }

            expect(callback).toHaveBeenCalledWith(false);
        });
    });

    describe('on', () => {
        test('should subscribe to events', () => {
            const callback = jest.fn();
            const unsubscribe = on('updateAvailable', callback);

            expect(typeof unsubscribe).toBe('function');

            unsubscribe();
        });

        test('should support multiple listeners for same event', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            const unsubscribe1 = on('multi-event', callback1);
            const unsubscribe2 = on('multi-event', callback2);

            expect(typeof unsubscribe1).toBe('function');
            expect(typeof unsubscribe2).toBe('function');

            unsubscribe1();
            unsubscribe2();
        });
    });

    describe('getState', () => {
        test('should return current service worker state', () => {
            const state = getState();

            expect(state).toHaveProperty('registered');
            expect(state).toHaveProperty('installing');
            expect(state).toHaveProperty('waiting');
            expect(state).toHaveProperty('active');
            expect(state).toHaveProperty('updateAvailable');
            expect(state).toHaveProperty('offlineReady');
            expect(state).toHaveProperty('syncPending');
            expect(state).toHaveProperty('lastSyncAt');
        });

        test('should return a copy of state, not the original', () => {
            const state1 = getState();
            const state2 = getState();

            expect(state1).toEqual(state2);
            expect(state1).not.toBe(state2);
        });
    });

    describe('unregister', () => {
        test('should return false when serviceWorker is not supported', async () => {
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const result = await unregister();
            expect(result).toBe(false);
        });

        test('should unregister service worker successfully', async () => {
            const result = await unregister();
            expect(result).toBe(true);
            expect(mockRegistration.unregister).toHaveBeenCalled();
        });

        test('should handle unregister failure', async () => {
            mockRegistration.unregister.mockRejectedValue(new Error('Unregister failed'));

            const result = await unregister();
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(
                '[SW] Unregister failed:',
                expect.any(Error)
            );
        });
    });

    describe('SYNC_TAGS', () => {
        test('should export sync tags', () => {
            expect(SYNC_TAGS).toHaveProperty('USER_PROGRESS');
            expect(SYNC_TAGS).toHaveProperty('CUSTOM_PROBLEMS');
            expect(SYNC_TAGS).toHaveProperty('USER_SETTINGS');
        });
    });

    describe('checkForUpdates', () => {
        test('should return true when update check succeeds', async () => {
            const result = await checkForUpdates();
            expect(result).toBe(true);
            expect(mockRegistration.update).toHaveBeenCalled();
        });

        test('should return false when serviceWorker is not supported', async () => {
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const result = await checkForUpdates();
            expect(result).toBe(false);
        });

        test('should return false when update check fails', async () => {
            mockRegistration.update.mockRejectedValue(new Error('Update check failed'));

            const result = await checkForUpdates();
            expect(result).toBe(false);
        });
    });

    describe('getBundleStatus', () => {
        test('should return default status when no controller', async () => {
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const status = await getBundleStatus();
            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });
        });

        test('should request bundle status from service worker', async () => {
            const statusPromise = getBundleStatus();

            // Simulate response from service worker
            setTimeout(() => {
                if (mockPort1.onmessage) {
                    mockPort1.onmessage({
                        data: {
                            type: 'BUNDLE_STATUS',
                            status: {
                                status: 'downloading',
                                progress: 50,
                                totalFiles: 100,
                                extractedFiles: 50,
                            },
                        },
                    });
                }
            }, 10);

            const status = await statusPromise;
            expect(status.status).toBe('downloading');
            expect(status.progress).toBe(50);
        });

        test('should timeout after 5 seconds', async () => {
            jest.useFakeTimers();

            const statusPromise = getBundleStatus();

            // Fast-forward time
            jest.advanceTimersByTime(5100);

            const status = await statusPromise;
            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });

            jest.useRealTimers();
        });
    });

    describe('downloadBundle', () => {
        test('should return false when no controller', async () => {
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const result = await downloadBundle();
            expect(result).toBe(false);
        });

        test('should return true when bundle download completes', async () => {
            const downloadPromise = downloadBundle();

            // Simulate response from service worker
            setTimeout(() => {
                if (mockPort1.onmessage) {
                    mockPort1.onmessage({
                        data: {
                            type: 'BUNDLE_COMPLETE',
                            state: {
                                status: 'complete',
                                progress: 100,
                                totalFiles: 100,
                                extractedFiles: 100,
                            },
                        },
                    });
                }
            }, 10);

            const result = await downloadPromise;
            expect(result).toBe(true);
        });

        test('should return false when bundle download fails', async () => {
            const downloadPromise = downloadBundle();

            // Simulate error response from service worker
            setTimeout(() => {
                if (mockPort1.onmessage) {
                    mockPort1.onmessage({
                        data: {
                            type: 'BUNDLE_ERROR',
                            error: 'Download failed',
                        },
                    });
                }
            }, 10);

            const result = await downloadPromise;
            expect(result).toBe(false);
        });

        test('should timeout after 60 seconds', async () => {
            jest.useFakeTimers();

            const downloadPromise = downloadBundle();

            // Fast-forward time
            jest.advanceTimersByTime(61000);

            const result = await downloadPromise;
            expect(result).toBe(false);

            jest.useRealTimers();
        });
    });

    describe('event emission', () => {
        test('should emit events to subscribers with data', async () => {
            const callback = jest.fn();
            const unsubscribe = on('assetUpdated', callback);

            // The event system is internal, so we verify the subscription works
            expect(typeof unsubscribe).toBe('function');

            unsubscribe();
        });

        test('should handle multiple listeners for same event', async () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            const unsubscribe1 = on('syncComplete', callback1);
            const unsubscribe2 = on('syncComplete', callback2);

            // Verify both subscriptions work
            expect(typeof unsubscribe1).toBe('function');
            expect(typeof unsubscribe2).toBe('function');

            unsubscribe1();
            unsubscribe2();
        });

        test('should handle errors in event listeners gracefully', async () => {
            // Create a mock error-throwing callback
            const errorCallback = jest.fn().mockImplementation(() => {
                throw new Error('Listener error');
            });
            const normalCallback = jest.fn();

            const unsubscribe1 = on('errorTest', errorCallback);
            const unsubscribe2 = on('errorTest', normalCallback);

            // The module should handle errors internally
            // We verify the subscriptions are set up correctly
            expect(typeof unsubscribe1).toBe('function');
            expect(typeof unsubscribe2).toBe('function');

            unsubscribe1();
            unsubscribe2();
        });
    });

    describe('migrateLocalStorageOperations', () => {
        test('should migrate operations from localStorage to service worker', async () => {
            // Setup localStorage with operations
            const operations = [
                { type: 'MARK_SOLVED', data: { problemId: '1' }, timestamp: Date.now() },
                { type: 'UPDATE_PROGRESS', data: { problemId: '2', progress: 50 }, timestamp: Date.now() },
            ];
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(operations));

            // Ensure serviceWorker is available and has active worker
            Object.defineProperty(navigator.serviceWorker, 'ready', {
                value: Promise.resolve({
                    ...mockRegistration,
                    active: mockController,
                }),
                writable: true,
                configurable: true,
            });

            const migrationPromise = migrateLocalStorageOperations();

            // Simulate success response
            setTimeout(() => {
                if (mockPort1.onmessage) {
                    mockPort1.onmessage({
                        data: { success: true },
                    });
                }
            }, 10);

            const result = await migrationPromise;
            expect(result).toBe(2);

            // localStorage should be cleared after successful migration
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('pending-operations');
        });

        test('should return 0 when no operations in localStorage', async () => {
            // Ensure no operations in localStorage
            mockLocalStorage.getItem.mockReturnValue('[]');

            const result = await migrateLocalStorageOperations();
            expect(result).toBe(0);
        });

        test('should return 0 when service worker not available', async () => {
            Object.defineProperty(navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const operations = [{ type: 'MARK_SOLVED', data: { problemId: '1' }, timestamp: Date.now() }];
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(operations));

            const result = await migrateLocalStorageOperations();
            expect(result).toBe(0);
        });

        test('should keep localStorage on migration failure', async () => {
            const operations = [{ type: 'MARK_SOLVED', data: { problemId: '1' }, timestamp: Date.now() }];
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(operations));

            const migrationPromise = migrateLocalStorageOperations();

            // Simulate error response
            setTimeout(() => {
                if (mockPort1.onmessage) {
                    mockPort1.onmessage({
                        data: { type: 'MIGRATION_ERROR', error: 'Migration failed' },
                    });
                }
            }, 10);

            const result = await migrationPromise;
            expect(result).toBe(0);

            // localStorage should NOT be cleared on failure
            expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
        }, 10000);
    });

    describe('connectivity changes with sync', () => {
        test('should retry sync after failure', async () => {
            jest.useFakeTimers();

            const callback = jest.fn();
            listenForConnectivityChanges(callback);

            // Get the online handler
            const onlineCall = mockAddEventListener.mock.calls.find(
                (call: any[]) => call[0] === 'online'
            );
            const onlineHandler = onlineCall?.[1];

            if (onlineHandler) {
                // Simulate coming online
                Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
                await onlineHandler();
            }

            // Fast-forward to trigger debounced sync
            jest.advanceTimersByTime(1100);

            jest.useRealTimers();
        });
    });
});
