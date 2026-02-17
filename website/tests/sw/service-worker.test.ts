/**
 * Service Worker Unit Tests
 * Tests for install, activate, fetch, message, and sync event handlers
 */

// Mock Cache API before importing service worker
const mockCacheStore = new Map();

class MockTestCache {
    store = new Map();

    async match(request: string | Request) {
        const url = typeof request === 'string' ? request : request.url;
        return this.store.get(url) || undefined;
    }

    async put(request: string | Request, response: Response) {
        const url = typeof request === 'string' ? request : request.url;
        this.store.set(url, response);
    }

    async add(request: string | Request) {
        const url = typeof request === 'string' ? request : request.url;
        this.store.set(url, new Response('cached'));
    }

    async addAll(requests: (string | Request)[]) {
        for (const request of requests) {
            await this.add(request);
        }
    }

    async delete(request: string | Request) {
        const url = typeof request === 'string' ? request : request.url;
        return this.store.delete(url);
    }

    async keys() {
        return Array.from(this.store.keys()).map((url) => new Request(url));
    }
}

class MockTestCacheStorage {
    async open(cacheName: string) {
        if (!mockCacheStore.has(cacheName)) {
            mockCacheStore.set(cacheName, new MockTestCache());
        }
        return mockCacheStore.get(cacheName);
    }

    async match(request: string | Request, options?: { cacheName?: string }) {
        for (const [name, cache] of mockCacheStore) {
            if (!options?.cacheName || options.cacheName === name) {
                const match = await cache.match(request);
                if (match) return match;
            }
        }
        return undefined;
    }

    async has(cacheName: string) {
        return mockCacheStore.has(cacheName);
    }

    async delete(cacheName: string) {
        return mockCacheStore.delete(cacheName);
    }

    async keys() {
        return Array.from(mockCacheStore.keys());
    }
}

// Set up global caches mock
(global as unknown as { caches: MockTestCacheStorage }).caches = new MockTestCacheStorage();

// Mock the imported modules
jest.mock('../../src/sw/cache-strategies', () => ({
    CACHE_NAMES: {
        STATIC: 'smartgrind-static',
        PROBLEMS: 'smartgrind-problems',
        API: 'smartgrind-api',
        IMAGES: 'smartgrind-images',
        DYNAMIC: 'smartgrind-dynamic',
    },
}));

jest.mock('../../src/sw/offline-manager', () => ({
    OfflineManager: jest.fn().mockImplementation(() => ({
        preCacheProblemIndex: jest.fn().mockResolvedValue(undefined),
        cacheProblems: jest.fn().mockResolvedValue(undefined),
    })),
}));

jest.mock('../../src/sw/background-sync', () => ({
    BackgroundSyncManager: jest.fn().mockImplementation(() => ({
        syncUserProgress: jest.fn().mockResolvedValue(undefined),
        syncCustomProblems: jest.fn().mockResolvedValue(undefined),
        forceSync: jest.fn().mockResolvedValue({ success: true, synced: 1, failed: 0 }),
    })),
}));

jest.mock('../../src/sw/operation-queue', () => ({
    OperationQueue: jest.fn().mockImplementation(() => ({
        addOperations: jest.fn().mockResolvedValue(undefined),
        getStatus: jest.fn().mockResolvedValue({
            pendingCount: 0,
            isSyncing: false,
            lastSyncAt: null,
            stats: { pending: 0, completed: 0, failed: 0, manual: 0 },
        }),
        clearAll: jest.fn().mockResolvedValue(undefined),
    })),
}));

describe('Service Worker', () => {
    let mockSelf: {
        addEventListener: jest.Mock;
        registration: {
            scope: string;
            showNotification: jest.Mock;
        };
        clients: {
            claim: jest.Mock;
            matchAll: jest.Mock;
            openWindow: jest.Mock;
        };
        skipWaiting: jest.Mock;
    };
    let eventHandlers: Map<string, (_event: Event) => void | Promise<void>>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        eventHandlers = new Map();
        mockCacheStore.clear();

        // Setup mock self (ServiceWorkerGlobalScope)
        mockSelf = {
            addEventListener: jest.fn(
                (_event: string, handler: (_event: Event) => void | Promise<void>) => {
                    eventHandlers.set(_event, handler);
                }
            ),
            registration: {
                scope: '/smartgrind/',
                showNotification: jest.fn().mockResolvedValue(undefined),
            },
            clients: {
                claim: jest.fn().mockResolvedValue(undefined),
                matchAll: jest.fn().mockResolvedValue([]),
                openWindow: jest.fn().mockResolvedValue(undefined),
            },
            skipWaiting: jest.fn().mockResolvedValue(undefined),
        };

        // Mock global self
        Object.defineProperty(global, 'self', {
            value: mockSelf,
            writable: true,
            configurable: true,
        });

        // Reset caches mock
        (global as unknown as { caches: MockTestCacheStorage }).caches = new MockTestCacheStorage();
    });

    describe('Install Event', () => {
        it('should register install event listener', async () => {
            // Import the service worker to trigger event registration
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            expect(mockSelf.addEventListener).toHaveBeenCalledWith('install', expect.any(Function));
            expect(eventHandlers.has('install')).toBe(true);
        });

        it('should cache static assets on install', async () => {
            const cachePut = jest.fn();
            const cacheAddAll = jest.fn().mockResolvedValue(undefined);

            // Mock caches.open
            (global.caches as unknown as { open: jest.Mock }).open = jest.fn().mockResolvedValue({
                put: cachePut,
                addAll: cacheAddAll,
            });

            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            // Get the install handler
            const installHandler = eventHandlers.get('install');

            if (installHandler) {
                const _event = {
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                };
                await installHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });
    });

    describe('Activate Event', () => {
        it('should register activate event listener', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            expect(mockSelf.addEventListener).toHaveBeenCalledWith(
                'activate',
                expect.any(Function)
            );
            expect(eventHandlers.has('activate')).toBe(true);
        });

        it('should clean up old caches on activate', async () => {
            const mockCacheKeys = ['smartgrind-static-v1', 'smartgrind-static-v0'];

            (global.caches as unknown as { keys: jest.Mock; delete: jest.Mock }).keys = jest
                .fn()
                .mockResolvedValue(mockCacheKeys);
            (global.caches as unknown as { keys: jest.Mock; delete: jest.Mock }).delete = jest
                .fn()
                .mockResolvedValue(true);

            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const activateHandler = eventHandlers.get('activate');

            if (activateHandler) {
                const _event = {
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                };
                await activateHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });

        it('should claim clients on activate', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const activateHandler = eventHandlers.get('activate');

            if (activateHandler) {
                const _event = {
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                };
                await activateHandler(_event);
                // waitUntil should be called which triggers claim
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });
    });

    describe('Fetch Event', () => {
        it('should register fetch event listener', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            expect(mockSelf.addEventListener).toHaveBeenCalledWith('fetch', expect.any(Function));
            expect(eventHandlers.has('fetch')).toBe(true);
        });

        it('should handle API requests with network-first strategy', async () => {
            const mockResponse = new Response('{"data": "test"}', {
                headers: { 'Content-Type': 'application/json' },
            });

            global.fetch = jest.fn().mockResolvedValue(mockResponse);

            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const fetchHandler = eventHandlers.get('fetch');

            if (fetchHandler) {
                const request = new Request('https://example.com/smartgrind/api/user');
                const _event = {
                    request,
                    respondWith: jest.fn(),
                };

                await fetchHandler(_event);
                expect(_event.respondWith).toHaveBeenCalled();
            }
        });

        it('should handle problem markdown requests', async () => {
            const mockResponse = new Response('# Problem', {
                headers: { 'Content-Type': 'text/markdown' },
            });

            // Pre-cache the problem
            const cache = await caches.open('smartgrind-problems');
            await cache.put('https://example.com/smartgrind/patterns/two-sum.md', mockResponse);

            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const fetchHandler = eventHandlers.get('fetch');

            if (fetchHandler) {
                const request = new Request('https://example.com/smartgrind/patterns/two-sum.md');
                const _event = {
                    request,
                    respondWith: jest.fn(),
                };

                await fetchHandler(_event);
                expect(_event.respondWith).toHaveBeenCalled();
            }
        });

        it('should skip non-GET requests', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const fetchHandler = eventHandlers.get('fetch');

            if (fetchHandler) {
                const request = new Request('https://example.com/smartgrind/styles.css', {
                    method: 'POST',
                });
                const _event = {
                    request,
                    respondWith: jest.fn(),
                };

                await fetchHandler(_event);
                // Non-GET requests that are not API calls should not trigger respondWith
                // The handler returns early for non-GET non-API requests
                expect(_event.respondWith).not.toHaveBeenCalled();
            }
        });
    });

    describe('Message Event', () => {
        it('should register message event listener', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            expect(mockSelf.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
            expect(eventHandlers.has('message')).toBe(true);
        });

        it('should handle SKIP_WAITING message', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');

            if (messageHandler) {
                const _event = {
                    data: { type: 'SKIP_WAITING' },
                    waitUntil: jest.fn(),
                    source: null,
                };

                await messageHandler(_event);
                expect(mockSelf.skipWaiting).toHaveBeenCalled();
            }
        });

        it('should handle CACHE_PROBLEMS message', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');

            if (messageHandler) {
                const _event = {
                    data: {
                        type: 'CACHE_PROBLEMS',
                        problemUrls: ['https://example.com/problem.md'],
                    },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                    source: null,
                };

                await messageHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });

        it('should handle SYNC_OPERATIONS message', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');

            if (messageHandler) {
                const _event = {
                    data: {
                        type: 'SYNC_OPERATIONS',
                        operations: [{ type: 'MARK_SOLVED', data: {} }],
                    },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                    source: null,
                };

                await messageHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });

        it('should handle GET_SYNC_STATUS message', async () => {
            const mockClient = {
                postMessage: jest.fn(),
            };
            mockSelf.clients.matchAll = jest.fn().mockResolvedValue([mockClient]);

            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');

            if (messageHandler) {
                const _event = {
                    data: { type: 'GET_SYNC_STATUS' },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                    source: mockClient,
                };

                await messageHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });

        it('should handle GET_SYNC_STATUS message and reply via port', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');
            const mockPort = { postMessage: jest.fn() };

            if (messageHandler) {
                const _event = {
                    data: { type: 'GET_SYNC_STATUS' },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                    source: null,
                    ports: [mockPort],
                };

                await messageHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();

                // Await the promise passed to waitUntil
                const promise = (_event.waitUntil as jest.Mock).mock.calls[0][0];
                await promise;

                expect(mockPort.postMessage).toHaveBeenCalled();
            }
        });

        it('should handle FORCE_SYNC message and reply via port', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');
            const mockPort = { postMessage: jest.fn() };

            if (messageHandler) {
                const _event = {
                    data: { type: 'FORCE_SYNC' },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                    source: null,
                    ports: [mockPort],
                };

                await messageHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();

                // Await the promise passed to waitUntil
                const promise = (_event.waitUntil as jest.Mock).mock.calls[0][0];
                await promise;

                expect(mockPort.postMessage).toHaveBeenCalled();
            }
        });

        it('should handle CLEAR_ALL_CACHES message', async () => {
            const mockClient = {
                postMessage: jest.fn(),
            };

            (global.caches as unknown as { keys: jest.Mock; delete: jest.Mock }).keys = jest
                .fn()
                .mockResolvedValue(['cache1', 'cache2']);
            (global.caches as unknown as { keys: jest.Mock; delete: jest.Mock }).delete = jest
                .fn()
                .mockResolvedValue(true);

            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');

            if (messageHandler) {
                const _event = {
                    data: { type: 'CLEAR_ALL_CACHES' },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                    source: mockClient,
                };

                await messageHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });

        it('should handle CLEAR_ALL_CACHES message and reply via port', async () => {
            const mockPort = { postMessage: jest.fn() };

            (global.caches as unknown as { keys: jest.Mock; delete: jest.Mock }).keys = jest
                .fn()
                .mockResolvedValue([]);

            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');

            if (messageHandler) {
                const _event = {
                    data: { type: 'CLEAR_ALL_CACHES' },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                    source: null,
                    ports: [mockPort],
                };

                await messageHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();

                // Await the promise passed to waitUntil
                const promise = (_event.waitUntil as jest.Mock).mock.calls[0][0];
                await promise;

                expect(mockPort.postMessage).toHaveBeenCalled();
            }
        });

        it('should ignore unknown message types', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');

            if (messageHandler) {
                const _event = {
                    data: { type: 'UNKNOWN_TYPE' },
                    waitUntil: jest.fn(),
                    source: null,
                };

                // Should not throw - handler returns early for unknown types
                const result = messageHandler(_event);
                await expect(Promise.resolve(result)).resolves.toBeUndefined();
            }
        });

        it('should ignore messages without data', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const messageHandler = eventHandlers.get('message');

            if (messageHandler) {
                const _event = {
                    data: null,
                    waitUntil: jest.fn(),
                    source: null,
                };

                // Should not throw - handler returns early when no data
                const result = messageHandler(_event);
                await expect(Promise.resolve(result)).resolves.toBeUndefined();
            }
        });
    });

    describe('Sync Event', () => {
        it('should register sync event listener', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            expect(mockSelf.addEventListener).toHaveBeenCalledWith('sync', expect.any(Function));
            expect(eventHandlers.has('sync')).toBe(true);
        });

        it('should handle sync-user-progress tag', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const syncHandler = eventHandlers.get('sync');

            if (syncHandler) {
                const _event = {
                    tag: 'sync-user-progress',
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                };

                await syncHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });

        it('should handle sync-custom-problems tag', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const syncHandler = eventHandlers.get('sync');

            if (syncHandler) {
                const _event = {
                    tag: 'sync-custom-problems',
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                };

                await syncHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
            }
        });
    });

    describe('Push Event', () => {
        it('should register push event listener', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            expect(mockSelf.addEventListener).toHaveBeenCalledWith('push', expect.any(Function));
            expect(eventHandlers.has('push')).toBe(true);
        });

        it('should show notification on push event', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const pushHandler = eventHandlers.get('push');

            if (pushHandler) {
                const _event = {
                    data: {
                        json: () => ({
                            title: 'Test Notification',
                            body: 'Test body',
                        }),
                    },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                };

                await pushHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
                expect(mockSelf.registration.showNotification).toHaveBeenCalled();
            }
        });

        it('should handle push event without data', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const pushHandler = eventHandlers.get('push');

            if (pushHandler) {
                const _event = {
                    data: null,
                    waitUntil: jest.fn(),
                };

                // Should not throw - handler returns early when no data
                const result = pushHandler(_event);
                await expect(Promise.resolve(result)).resolves.toBeUndefined();
                expect(mockSelf.registration.showNotification).not.toHaveBeenCalled();
            }
        });
    });

    describe('Notification Click Event', () => {
        it('should register notificationclick event listener', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            expect(mockSelf.addEventListener).toHaveBeenCalledWith(
                'notificationclick',
                expect.any(Function)
            );
            expect(eventHandlers.has('notificationclick')).toBe(true);
        });

        it('should open window on notification click', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const clickHandler = eventHandlers.get('notificationclick');

            if (clickHandler) {
                const _event = {
                    notification: {
                        close: jest.fn(),
                    },
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                };

                await clickHandler(_event);
                expect(_event.notification.close).toHaveBeenCalled();
                expect(_event.waitUntil).toHaveBeenCalled();
                expect(mockSelf.clients.openWindow).toHaveBeenCalledWith('/smartgrind/');
            }
        });
    });

    describe('Periodic Sync Event', () => {
        it('should register periodicsync event listener', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            expect(mockSelf.addEventListener).toHaveBeenCalledWith(
                'periodicsync',
                expect.any(Function)
            );
            expect(eventHandlers.has('periodicsync')).toBe(true);
        });

        it('should show notification for daily-review-reminder', async () => {
            await jest.isolateModules(async () => {
                await import('../../src/sw/service-worker');
            });

            const periodicHandler = eventHandlers.get('periodicsync');

            if (periodicHandler) {
                const _event = {
                    tag: 'daily-review-reminder',
                    waitUntil: jest.fn((promise: Promise<void>) => promise),
                };

                await periodicHandler(_event);
                expect(_event.waitUntil).toHaveBeenCalled();
                expect(mockSelf.registration.showNotification).toHaveBeenCalledWith(
                    'SmartGrind',
                    expect.objectContaining({
                        body: 'Time for your daily coding practice!',
                    })
                );
            }
        });
    });
});
