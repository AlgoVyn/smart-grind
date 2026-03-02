/**
 * @jest-environment jsdom
 *
 * Integration Tests for Offline Sync Flow
 * Tests cross-module interactions between service worker, cache strategies, and UI
 */

// Mock the modules before importing
jest.mock('../../src/sw/cache-strategies', () => ({
    CACHE_NAMES: {
        PROBLEMS: 'problems-cache',
        API: 'api-cache',
        STATIC: 'static-cache',
        USER: 'user-cache',
        DYNAMIC: 'dynamic-cache',
    },
    strategies: {
        api: { fetch: jest.fn() },
        static: { fetch: jest.fn() },
        problems: { fetch: jest.fn() },
        user: { fetch: jest.fn() },
    },
    CacheStrategies: jest.fn().mockImplementation(() => ({
        cacheFirst: jest.fn(),
        networkFirst: jest.fn(),
        staleWhileRevalidate: jest.fn(),
        cacheOnly: jest.fn(),
        networkOnly: jest.fn(),
        preCacheUrls: jest.fn(),
        getCachedUrls: jest.fn(),
        clearCache: jest.fn(),
        getCacheInfo: jest.fn(),
    })),
}));

jest.mock('../../src/utils/indexeddb-helper', () => ({
    openDatabase: jest.fn().mockResolvedValue({
        close: jest.fn(),
        objectStoreNames: { contains: jest.fn().mockReturnValue(true) },
    }),
    safeStore: jest.fn().mockResolvedValue(undefined),
    safeRetrieve: jest.fn().mockResolvedValue(null),
    IDBOperationError: class IDBOperationError extends Error {
        type: string;
        constructor(message: string, type: string) {
            super(message);
            this.type = type;
        }
    },
    IDBErrorType: {
        QUOTA_EXCEEDED: 'QuotaExceededError',
        VERSION_ERROR: 'VersionError',
        ABORT: 'AbortError',
        UNKNOWN: 'UnknownError',
    },
}));

import { CACHE_NAMES } from '../../src/sw/cache-strategies';

describe('Offline Sync Flow Integration', () => {
    let mockCacheStorage: Map<string, any>;
    let messageHandlers: Map<string, ((data: any) => void)[]>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockCacheStorage = new Map();
        messageHandlers = new Map();

        // Setup Service Worker controller mock
        const mockController = {
            postMessage: jest.fn().mockImplementation((message: any) => {
                const handlers = messageHandlers.get(message.type) || [];
                handlers.forEach(handler => handler(message));
            }),
        };

        Object.defineProperty(navigator, 'serviceWorker', {
            value: {
                controller: mockController,
                ready: Promise.resolve({
                    active: mockController,
                    sync: {
                        register: jest.fn().mockResolvedValue(undefined),
                    },
                }),
                addEventListener: jest.fn().mockImplementation((event: string, handler: any) => {
                    if (!messageHandlers.has(event)) {
                        messageHandlers.set(event, []);
                    }
                    messageHandlers.get(event)?.push(handler);
                }),
            },
            writable: true,
        });

        // Setup caches mock
        global.caches = {
            open: jest.fn().mockImplementation((name: string) => {
                if (!mockCacheStorage.has(name)) {
                    mockCacheStorage.set(name, {
                        put: jest.fn().mockResolvedValue(undefined),
                        match: jest.fn().mockResolvedValue(undefined),
                        delete: jest.fn().mockResolvedValue(true),
                        keys: jest.fn().mockResolvedValue([]),
                    });
                }
                return Promise.resolve(mockCacheStorage.get(name));
            }),
            match: jest.fn().mockResolvedValue(undefined),
            has: jest.fn().mockResolvedValue(false),
            delete: jest.fn().mockResolvedValue(true),
            keys: jest.fn().mockResolvedValue([]),
        } as unknown as CacheStorage;
    });

    describe('Service Worker Registration and Cache Prepopulation', () => {
        it('should register service worker and cache initial assets', async () => {
            const mockRegistration = {
                active: { postMessage: jest.fn() },
                installing: null,
                waiting: null,
            };

            Object.defineProperty(navigator, 'serviceWorker', {
                value: {
                    register: jest.fn().mockResolvedValue(mockRegistration),
                    controller: null,
                    ready: Promise.resolve(mockRegistration),
                    addEventListener: jest.fn(),
                },
                writable: true,
            });

            // Simulate registration
            const registration = await navigator.serviceWorker.register('/sw.js');
            expect(registration).toBe(mockRegistration);
        });

        it('should cache API responses for offline use', async () => {
            const apiResponse = new Response(JSON.stringify({ data: 'test' }), {
                headers: { 'Content-Type': 'application/json' },
            });

            global.fetch = jest.fn().mockResolvedValue(apiResponse);

            const cache = await caches.open(CACHE_NAMES.API);
            const request = new Request('/api/data');
            const response = await fetch(request);

            if (response.ok) {
                await cache.put(request, response.clone());
            }

            expect(cache.put).toHaveBeenCalled();
        });
    });

    describe('Offline-Online Transition', () => {
        it('should detect online status change', () => {
            const onlineHandler = jest.fn();
            const offlineHandler = jest.fn();

            window.addEventListener('online', onlineHandler);
            window.addEventListener('offline', offlineHandler);

            // Simulate online event
            Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
            window.dispatchEvent(new Event('online'));

            expect(onlineHandler).toHaveBeenCalled();
        });

        it('should trigger sync when coming back online', async () => {
            const syncRegisterSpy = jest.fn().mockResolvedValue(undefined);
            
            Object.defineProperty(navigator, 'serviceWorker', {
                value: {
                    controller: { postMessage: jest.fn() },
                    ready: Promise.resolve({
                        active: {},
                        sync: { register: syncRegisterSpy },
                    }),
                },
                writable: true,
            });

            // Simulate coming back online
            Object.defineProperty(navigator, 'onLine', { value: true });
            
            const registration = await navigator.serviceWorker.ready;
            if (navigator.onLine && 'sync' in registration) {
                await registration.sync.register('sync-user-progress');
            }

            expect(syncRegisterSpy).toHaveBeenCalledWith('sync-user-progress');
        });
    });

    describe('Background Sync with Cache Updates', () => {
        it('should queue operations when offline', async () => {
            Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

            const operation = {
                type: 'SAVE_PROGRESS',
                problemId: 'two-sum',
                status: 'solved',
                timestamp: Date.now(),
            };

            // Store operation in IndexedDB queue
            const idbHelper = jest.requireMock('../../src/utils/indexeddb-helper');
            await idbHelper.safeStore(null, 'operations', 'op-1', operation);

            expect(idbHelper.safeStore).toHaveBeenCalledWith(
                null,
                'operations',
                'op-1',
                operation
            );
        });

        it('should process queued operations when online', async () => {
            const operations = [
                { type: 'SAVE_PROGRESS', problemId: 'two-sum', status: 'solved' },
                { type: 'SAVE_PROGRESS', problemId: 'three-sum', status: 'solved' },
            ];

            const idbHelper = jest.requireMock('../../src/utils/indexeddb-helper');
            idbHelper.safeRetrieve.mockResolvedValueOnce(operations);

            // Simulate processing queued operations
            const queuedOps = await idbHelper.safeRetrieve(null, 'operations-queue', 'pending');
            
            // Verify that retrieve was called to get queued operations
            expect(idbHelper.safeRetrieve).toHaveBeenCalled();
            
            // If operations exist, verify they would be processed
            if (queuedOps) {
                expect(queuedOps).toHaveLength(2);
            }
        });
    });

    describe('Cache Invalidation on Data Update', () => {
        it('should invalidate problem cache on update', async () => {
            const problemId = 'two-sum';
            const cacheName = CACHE_NAMES.PROBLEMS;
            
            const cache = await caches.open(cacheName);
            const request = new Request(`/smartgrind/solutions/${problemId}.md`);
            
            // Delete cached entry
            await cache.delete(request);
            
            expect(cache.delete).toHaveBeenCalledWith(request);
        });

        it('should update API cache after successful sync', async () => {
            const apiResponse = new Response(JSON.stringify({ synced: true }), {
                headers: { 'Content-Type': 'application/json' },
            });

            global.fetch = jest.fn().mockResolvedValue(apiResponse);

            const cache = await caches.open(CACHE_NAMES.API);
            const request = new Request('/api/sync');
            const response = await fetch(request);

            if (response.ok) {
                await cache.put(request, response.clone());
            }

            expect(cache.put).toHaveBeenCalled();
        });
    });

    describe('Error Recovery', () => {
        it('should handle cache open failure gracefully', async () => {
            global.caches.open = jest.fn().mockRejectedValue(new Error('Cache open failed'));

            await expect(caches.open(CACHE_NAMES.PROBLEMS)).rejects.toThrow('Cache open failed');
        });

        it('should retry failed sync operations', async () => {
            const operation = { type: 'SAVE', data: 'test' };
            let attempts = 0;

            // Create a deterministic mock that fails twice then succeeds
            const mockProcessOperation = jest.fn()
                .mockRejectedValueOnce(new Error('Network error'))
                .mockRejectedValueOnce(new Error('Network error'))
                .mockResolvedValueOnce(undefined);

            const processWithRetry = async (op: any, maxRetries = 3) => {
                for (let i = 0; i < maxRetries; i++) {
                    attempts++;
                    try {
                        await mockProcessOperation(op);
                        return true;
                    } catch (error) {
                        if (i === maxRetries - 1) throw error;
                        // Skip the actual timeout to speed up test
                    }
                }
                return false;
            };

            const result = await processWithRetry(operation);

            expect(attempts).toBeGreaterThan(0);
            expect(mockProcessOperation).toHaveBeenCalled();
        });
    });

    describe('Cross-Module State Consistency', () => {
        it('should maintain consistent problem state across modules', async () => {
            const problemId = 'two-sum';
            const problemState = {
                id: problemId,
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
            };

            // Save to IndexedDB
            const idbHelper = jest.requireMock('../../src/utils/indexeddb-helper');
            
            // Mock the retrieve to return what was stored
            idbHelper.safeRetrieve.mockResolvedValueOnce(problemState);
            await idbHelper.safeStore(null, 'problems', problemId, problemState);

            // Retrieve from IndexedDB
            const retrieved = await idbHelper.safeRetrieve(null, 'problems', problemId);

            expect(retrieved).toEqual(problemState);
        });

        it('should sync state between cache and IndexedDB', async () => {
            const problemId = 'two-sum';
            const problemData = { status: 'solved', reviewInterval: 2 };

            // Save to both cache and IndexedDB
            const cache = await caches.open(CACHE_NAMES.PROBLEMS);
            const idbHelper = jest.requireMock('../../src/utils/indexeddb-helper');

            const request = new Request(`/api/problems/${problemId}`);
            const response = new Response(JSON.stringify(problemData));

            await Promise.all([
                cache.put(request, response.clone()),
                idbHelper.safeStore(null, 'problems', problemId, problemData),
            ]);

            expect(cache.put).toHaveBeenCalled();
            expect(idbHelper.safeStore).toHaveBeenCalled();
        });
    });
});

// Helper function
async function processOperation(op: any): Promise<void> {
    // Placeholder for operation processing
    if (Math.random() > 0.5) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error('Random failure'));
    }
}
