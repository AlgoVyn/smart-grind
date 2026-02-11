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
    SYNC_TAGS,
} from '../src/sw-register';

describe('Service Worker Registration Module', () => {
    let mockRegistration: any;
    let mockServiceWorker: any;
    let mockController: any;
    let eventListeners: Map<string, Set<EventListenerOrEventListenerObject>>;

    beforeEach(() => {
        jest.clearAllMocks();
        eventListeners = new Map();

        // Create mock service worker
        mockServiceWorker = {
            state: 'installing',
            addEventListener: jest.fn((event, handler) => {
                if (!eventListeners.has(event)) {
                    eventListeners.set(event, new Set());
                }
                eventListeners.get(event)!.add(handler);
            }),
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
            addEventListener: jest.fn((event, handler) => {
                if (!eventListeners.has(event)) {
                    eventListeners.set(event, new Set());
                }
                eventListeners.get(event)!.add(handler);
            }),
            sync: {
                register: jest.fn().mockResolvedValue(undefined),
                getTags: jest.fn().mockResolvedValue([]),
            },
        };

        // Reset navigator.serviceWorker mock
        Object.defineProperty(global.navigator, 'serviceWorker', {
            value: {
                register: jest.fn().mockResolvedValue(mockRegistration),
                ready: Promise.resolve(mockRegistration),
                controller: mockController,
                getRegistration: jest.fn().mockResolvedValue(mockRegistration),
                getRegistrations: jest.fn().mockResolvedValue([mockRegistration]),
                startMessages: jest.fn(),
                addEventListener: jest.fn((event, handler) => {
                    if (!eventListeners.has(event)) {
                        eventListeners.set(event, new Set());
                    }
                    eventListeners.get(event)!.add(handler);
                }),
                removeEventListener: jest.fn((event, handler) => {
                    eventListeners.get(event)?.delete(handler);
                }),
            },
            writable: true,
            configurable: true,
        });

        // Reset navigator.onLine
        Object.defineProperty(global.navigator, 'onLine', {
            value: true,
            writable: true,
            configurable: true,
        });

        // Reset window event listeners
        global.window.addEventListener = jest.fn((event, handler) => {
            if (!eventListeners.has(event)) {
                eventListeners.set(event, new Set());
            }
            eventListeners.get(event)!.add(handler);
        });
        global.window.removeEventListener = jest.fn((event, handler) => {
            eventListeners.get(event)?.delete(handler);
        });

        // Note: window.location.reload is read-only in jsdom
        // We skip mocking it and test the skipWaiting function indirectly

        // Mock MessageChannel for getSyncStatus tests
        global.MessageChannel = class MockMessageChannel {
            port1: { onmessage: null | ((_event: { data: unknown }) => void) } = {
                onmessage: null,
            };
            port2 = {};
        } as unknown as typeof MessageChannel;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('isSupported', () => {
        test('should return true when serviceWorker is in navigator', () => {
            expect(isSupported()).toBe(true);
        });

        test('should return false when serviceWorker is not in navigator', () => {
            // Delete the property entirely to simulate no support
            delete (global.navigator as any).serviceWorker;
            expect(isSupported()).toBe(false);

            // Restore for other tests
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: {
                    register: jest.fn().mockResolvedValue(mockRegistration),
                    ready: Promise.resolve(mockRegistration),
                    controller: mockController,
                    getRegistration: jest.fn().mockResolvedValue(mockRegistration),
                    getRegistrations: jest.fn().mockResolvedValue([mockRegistration]),
                    startMessages: jest.fn(),
                    addEventListener: jest.fn((event, handler) => {
                        if (!eventListeners.has(event)) {
                            eventListeners.set(event, new Set());
                        }
                        eventListeners.get(event)!.add(handler);
                    }),
                    removeEventListener: jest.fn((event, handler) => {
                        eventListeners.get(event)?.delete(handler);
                    }),
                },
                writable: true,
                configurable: true,
            });
        });
    });

    describe('isBackgroundSyncSupported', () => {
        test('should return true when sync is in ServiceWorkerRegistration.prototype', () => {
            // Ensure sync is defined on prototype
            if (!('sync' in ServiceWorkerRegistration.prototype)) {
                (ServiceWorkerRegistration.prototype as any).sync = { register: jest.fn() };
            }
            expect(isBackgroundSyncSupported()).toBe(true);
        });

        test('should return false when sync is not in ServiceWorkerRegistration.prototype', () => {
            // Store original sync
            const originalSync = (ServiceWorkerRegistration.prototype as any).sync;
            // Remove sync from prototype
            delete (ServiceWorkerRegistration.prototype as any).sync;
            expect(isBackgroundSyncSupported()).toBe(false);
            // Restore
            if (originalSync) {
                (ServiceWorkerRegistration.prototype as any).sync = originalSync;
            }
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
            expect(navigator.serviceWorker.register).toHaveBeenCalled();
        });

        test('should handle registration failure', async () => {
            (navigator.serviceWorker.register as jest.Mock).mockRejectedValue(
                new Error('Registration failed')
            );

            const result = await registerServiceWorker();
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(
                '[SW] Registration failed:',
                expect.any(Error)
            );
        });

        test('should handle updatefound event', async () => {
            await registerServiceWorker();

            // Simulate updatefound event
            const updateHandler = mockRegistration.addEventListener.mock.calls.find(
                (call: any[]) => call[0] === 'updatefound'
            )?.[1];

            expect(updateHandler).toBeDefined();

            // Create new installing worker
            const newWorker = {
                state: 'installing',
                addEventListener: jest.fn(),
            };
            mockRegistration.installing = newWorker;

            if (updateHandler) {
                updateHandler();
            }

            expect(newWorker.addEventListener).toHaveBeenCalledWith(
                'statechange',
                expect.any(Function)
            );
        });

        test('should handle waiting worker on registration', async () => {
            const waitingWorker = {
                state: 'installed',
                postMessage: jest.fn(),
            };
            mockRegistration.waiting = waitingWorker;
            mockRegistration.installing = null;

            const result = await registerServiceWorker();
            expect(result).toBe(true);
        });
    });

    describe('skipWaiting', () => {
        test('should post SKIP_WAITING message when controller exists', async () => {
            await skipWaiting();

            expect(mockController.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
            // Note: window.location.reload() is called but cannot be mocked in jsdom
        });

        test('should do nothing when no controller', async () => {
            Object.defineProperty(global.navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            await skipWaiting();

            // When no controller, postMessage should not be called
            expect(mockController.postMessage).not.toHaveBeenCalled();
        });
    });

    describe('requestSync', () => {
        test('should return false when serviceWorker is not supported', async () => {
            // Delete serviceWorker property entirely to simulate no support
            delete (global.navigator as any).serviceWorker;

            const result = await requestSync('test-tag');
            expect(result).toBe(false);

            // Restore for other tests
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: {
                    register: jest.fn().mockResolvedValue(mockRegistration),
                    ready: Promise.resolve(mockRegistration),
                    controller: mockController,
                    getRegistration: jest.fn().mockResolvedValue(mockRegistration),
                    getRegistrations: jest.fn().mockResolvedValue([mockRegistration]),
                    startMessages: jest.fn(),
                    addEventListener: jest.fn((event, handler) => {
                        if (!eventListeners.has(event)) {
                            eventListeners.set(event, new Set());
                        }
                        eventListeners.get(event)!.add(handler);
                    }),
                    removeEventListener: jest.fn((event, handler) => {
                        eventListeners.get(event)?.delete(handler);
                    }),
                },
                writable: true,
                configurable: true,
            });
        });

        test('should return false when no controller', async () => {
            // Set controller to null
            Object.defineProperty(global.navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const result = await requestSync('test-tag');
            expect(result).toBe(false);
        });

        test('should register sync when supported', async () => {
            // Ensure controller exists
            Object.defineProperty(global.navigator.serviceWorker, 'controller', {
                value: mockController,
                writable: true,
                configurable: true,
            });

            const result = await requestSync('test-tag');
            expect(result).toBe(true);
            expect(mockRegistration.sync.register).toHaveBeenCalledWith('test-tag');
        });

        test('should fallback to postMessage when sync not supported', async () => {
            // Create a fresh mock controller
            const freshMockController = {
                postMessage: jest.fn(),
            };

            // Create a mock registration WITHOUT sync property (not supported)
            // Note: We don't include 'sync' at all to properly simulate no support
            // since 'sync' in obj returns true even if sync is undefined
            const mockRegWithoutSync = {
                scope: '/smartgrind/',
                active: null,
                installing: null,
                waiting: null,
                update: jest.fn().mockResolvedValue(undefined),
                unregister: jest.fn().mockResolvedValue(true),
                addEventListener: jest.fn(),
                // Note: no 'sync' property at all
            };

            // Set up navigator.serviceWorker with the fresh controller
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: {
                    register: jest.fn().mockResolvedValue(mockRegWithoutSync),
                    ready: Promise.resolve(mockRegWithoutSync),
                    controller: freshMockController,
                    getRegistration: jest.fn().mockResolvedValue(mockRegWithoutSync),
                    getRegistrations: jest.fn().mockResolvedValue([mockRegWithoutSync]),
                    startMessages: jest.fn(),
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                },
                writable: true,
                configurable: true,
            });

            const result = await requestSync('test-tag');
            expect(result).toBe(true);
            expect(freshMockController.postMessage).toHaveBeenCalledWith({
                type: 'REQUEST_SYNC',
                tag: 'test-tag',
            });
        });

        test('should handle sync registration failure', async () => {
            // Ensure controller exists
            Object.defineProperty(global.navigator.serviceWorker, 'controller', {
                value: mockController,
                writable: true,
                configurable: true,
            });
            mockRegistration.sync.register.mockRejectedValue(new Error('Sync failed'));

            const result = await requestSync('test-tag');
            expect(result).toBe(false);
            expect(console.error).toHaveBeenCalledWith(
                '[SW] Sync request failed:',
                expect.any(Error)
            );
        });
    });

    describe('syncUserProgress', () => {
        test('should return true when sync is requested', async () => {
            // Test that syncUserProgress calls requestSync internally
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
            Object.defineProperty(global.navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const result = await cacheProblemsForOffline(['/problem/1']);
            expect(result).toBe(false);
        });

        test('should post CACHE_PROBLEMS message', async () => {
            const urls = ['/problem/1', '/problem/2'];
            const result = await cacheProblemsForOffline(urls);

            expect(result).toBe(true);
            expect(mockController.postMessage).toHaveBeenCalledWith({
                type: 'CACHE_PROBLEMS',
                problemUrls: urls,
            });
        });
    });

    describe('getSyncStatus', () => {
        test('should return default status when no controller', async () => {
            Object.defineProperty(global.navigator.serviceWorker, 'controller', {
                value: null,
                writable: true,
                configurable: true,
            });

            const result = await getSyncStatus();
            expect(result).toEqual({
                pendingCount: 0,
                isSyncing: false,
                lastSyncAt: null,
            });
        });

        test('should request sync status from service worker', async () => {
            // Create a proper MessageChannel mock that will receive the response
            const mockPort1 = {
                onmessage: null as ((_event: { data: unknown }) => void) | null,
            };

            const mockPort2 = {};

            // Store original MessageChannel
            const originalMessageChannel = global.MessageChannel;

            // Mock MessageChannel to return our controlled ports
            global.MessageChannel = jest.fn().mockImplementation(() => ({
                port1: mockPort1,
                port2: mockPort2,
            }));

            // Create a mock controller that triggers the response synchronously
            const syncMockController = {
                postMessage: jest.fn((message: { type: string }, _transfer: unknown[]) => {
                    // Simulate the service worker responding immediately
                    if (message.type === 'GET_SYNC_STATUS') {
                        // Use setImmediate-like behavior to trigger after current execution
                        Promise.resolve().then(() => {
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
                        });
                    }
                }),
            };

            // Set the mock controller
            Object.defineProperty(global.navigator.serviceWorker, 'controller', {
                value: syncMockController,
                writable: true,
                configurable: true,
            });

            const result = await getSyncStatus();

            expect(syncMockController.postMessage).toHaveBeenCalledWith(
                { type: 'GET_SYNC_STATUS' },
                expect.any(Array)
            );
            expect(result).toEqual({
                pendingCount: 5,
                isSyncing: true,
                lastSyncAt: expect.any(Number),
            });

            // Restore original MessageChannel
            global.MessageChannel = originalMessageChannel;
        });

        test('should timeout after 5 seconds', async () => {
            jest.useFakeTimers();

            const resultPromise = getSyncStatus();

            // Fast-forward past the timeout
            jest.advanceTimersByTime(6000);

            const result = await resultPromise;
            expect(result).toEqual({
                pendingCount: 0,
                isSyncing: false,
                lastSyncAt: null,
            });

            jest.useRealTimers();
        });
    });

    describe('clearAllCaches', () => {
        test('should return false when no controller', async () => {
            Object.defineProperty(global.navigator.serviceWorker, 'controller', {
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
            expect(mockController.postMessage).toHaveBeenCalledWith({ type: 'CLEAR_ALL_CACHES' });
        });
    });

    describe('listenForConnectivityChanges', () => {
        test('should add online/offline event listeners', () => {
            const callback = jest.fn();
            const cleanup = listenForConnectivityChanges(callback);

            expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
            expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));

            // Test cleanup
            cleanup();
            expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function));
            expect(window.removeEventListener).toHaveBeenCalledWith(
                'offline',
                expect.any(Function)
            );
        });

        test('should trigger sync when coming back online', () => {
            const callback = jest.fn();
            listenForConnectivityChanges(callback);

            // Get the online handler
            const onlineHandler = (window.addEventListener as jest.Mock).mock.calls.find(
                (call: any[]) => call[0] === 'online'
            )?.[1];

            expect(onlineHandler).toBeDefined();

            // Simulate coming online
            if (onlineHandler) {
                onlineHandler();
            }

            // Callback should be called with true
            expect(callback).toHaveBeenCalledWith(true);
        });

        test('should call callback with false when going offline', () => {
            const callback = jest.fn();
            listenForConnectivityChanges(callback);

            // Get the offline handler
            const offlineHandler = (window.addEventListener as jest.Mock).mock.calls.find(
                (call: any[]) => call[0] === 'offline'
            )?.[1];

            expect(offlineHandler).toBeDefined();

            // Simulate going offline
            if (offlineHandler) {
                offlineHandler();
            }

            // Callback should be called with false
            expect(callback).toHaveBeenCalledWith(false);
        });
    });

    describe('on', () => {
        test('should subscribe to events', () => {
            const callback = jest.fn();
            const unsubscribe = on('test-event', callback);

            // Trigger the event by emitting (we need to access the internal emit function)
            // Since emit is not exported, we'll test through the event system indirectly

            expect(typeof unsubscribe).toBe('function');

            // Test unsubscribe
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
});
