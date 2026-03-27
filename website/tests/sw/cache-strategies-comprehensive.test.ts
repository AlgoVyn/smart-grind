/**
 * @jest-environment jsdom
 *
 * Comprehensive Tests for Cache Strategies Module
 * Aims to significantly improve branch coverage
 */

import {
    CacheStrategies,
    strategies,
    cleanupOldCaches,
    getCacheStats,
    CACHE_NAMES,
    CACHE_VERSION,
} from '../../src/sw/cache-strategies';

describe('Cache Strategies - Comprehensive', () => {
    let mockCacheStorage: Map<string, MockCache>;
    let originalDateNow: () => number;

    interface MockCache {
        put: jest.Mock;
        match: jest.Mock;
        delete: jest.Mock;
        keys: jest.Mock;
        add: jest.Mock;
        addAll: jest.Mock;
    }

    beforeEach(() => {
        jest.clearAllMocks();
        mockCacheStorage = new Map();

        // Mock Date.now() for consistent timestamps
        originalDateNow = Date.now;
        let currentTime = 1000000;
        Date.now = jest.fn().mockReturnValue(currentTime);

        // Mock caches API
        global.caches = {
            open: jest.fn().mockImplementation((name: string) => {
                if (!mockCacheStorage.has(name)) {
                    const mockCache: MockCache = {
                        put: jest.fn().mockResolvedValue(undefined),
                        match: jest.fn().mockResolvedValue(undefined),
                        delete: jest.fn().mockResolvedValue(true),
                        keys: jest.fn().mockResolvedValue([]),
                        add: jest.fn().mockResolvedValue(undefined),
                        addAll: jest.fn().mockResolvedValue(undefined),
                    };
                    mockCacheStorage.set(name, mockCache);
                }
                return Promise.resolve(mockCacheStorage.get(name));
            }),
            match: jest.fn().mockResolvedValue(undefined),
            has: jest.fn().mockResolvedValue(false),
            delete: jest.fn().mockResolvedValue(true),
            keys: jest.fn().mockImplementation(() => {
                return Promise.resolve(Array.from(mockCacheStorage.keys()));
            }),
        } as unknown as CacheStorage;
    });

    afterEach(() => {
        Date.now = originalDateNow;
    });

    describe('StaleWhileRevalidate Strategy', () => {
        it('should return cached response if not expired', async () => {
            const mockResponse = new Response('cached data', {
                headers: { 'sw-cached-time': String(Date.now() - 1000) }, // 1 second ago
            });
            
            const cache = mockCacheStorage.get('api-cache-v3') || {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(mockResponse),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('api-cache-v3', cache);

            const request = new Request('https://example.com/api/data');
            const response = await strategies.api.fetch(request);

            expect(response).toBe(mockResponse);
        });

        it('should fetch fresh when cache is expired', async () => {
            const oldResponse = new Response('old data', {
                headers: { 'sw-cached-time': String(Date.now() - 10 * 60 * 1000) }, // 10 minutes ago
            });
            
            const freshResponse = new Response('fresh data');
            global.fetch = jest.fn().mockResolvedValue(freshResponse);

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(oldResponse),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('api-cache-v3', cache);

            const request = new Request('https://example.com/api/data');
            const response = await strategies.api.fetch(request);

            expect(response).toBe(freshResponse);
        });

        it('should return stale cache when network fails', async () => {
            const staleResponse = new Response('stale data', {
                headers: { 'sw-cached-time': String(Date.now() - 10 * 60 * 1000) },
            });
            
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(staleResponse),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('api-cache-v3', cache);

            const request = new Request('https://example.com/api/data');
            const response = await strategies.api.fetch(request);

            expect(response).toBe(staleResponse);
        });

        it('should throw when no cache and network fails', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('api-cache-v3', cache);

            const request = new Request('https://example.com/api/data');
            await expect(strategies.api.fetch(request)).rejects.toThrow('Network error');
        });

        it('should handle cache with no timestamp header', async () => {
            const responseWithoutTimestamp = new Response('cached data');
            const freshResponse = new Response('fresh data');
            
            global.fetch = jest.fn().mockResolvedValue(freshResponse);

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(responseWithoutTimestamp),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('api-cache-v3', cache);

            const request = new Request('https://example.com/api/data');
            const response = await strategies.api.fetch(request);

            expect(response).toBe(freshResponse);
        });
    });

    describe('NetworkFirst Strategy', () => {
        it('should return network response and cache it', async () => {
            const networkResponse = new Response('network data');
            global.fetch = jest.fn().mockResolvedValue(networkResponse);

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('user-cache-v3', cache);

            const request = new Request('https://example.com/user');
            const response = await strategies.user.fetch(request);

            expect(response).toBe(networkResponse);
            expect(cache.put).toHaveBeenCalled();
        });

        it('should return cached response when network fails', async () => {
            const cachedResponse = new Response('cached data');
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(cachedResponse),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('user-cache-v3', cache);

            const request = new Request('https://example.com/user');
            const response = await strategies.user.fetch(request);

            expect(response).toBe(cachedResponse);
        });

        it('should throw when network fails and no cache', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('user-cache-v3', cache);

            const request = new Request('https://example.com/user');
            await expect(strategies.user.fetch(request)).rejects.toThrow('Network error');
        });

        it('should not cache non-ok responses', async () => {
            const errorResponse = new Response('error', { status: 500 });
            global.fetch = jest.fn().mockResolvedValue(errorResponse);

            const putSpy = jest.fn().mockResolvedValue(undefined);
            const cache = {
                put: putSpy,
                match: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('user-cache-v3', cache);

            const request = new Request('https://example.com/user');
            const response = await strategies.user.fetch(request);
            
            // Should return error response without caching
            expect(response.status).toBe(500);
            expect(putSpy).not.toHaveBeenCalled();
        });
    });

    describe('CacheFirst Strategy', () => {
        it('should return cached response if available', async () => {
            const cachedResponse = new Response('cached data');

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(cachedResponse),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('static-cache-v3', cache);

            const request = new Request('https://example.com/static.js');
            const response = await strategies.static.fetch(request);

            expect(response).toBe(cachedResponse);
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should fetch and cache when not in cache', async () => {
            const networkResponse = new Response('network data');
            global.fetch = jest.fn().mockResolvedValue(networkResponse);

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('static-cache-v3', cache);

            const request = new Request('https://example.com/static.js');
            const response = await strategies.static.fetch(request);

            expect(response).toBe(networkResponse);
            expect(cache.put).toHaveBeenCalled();
        });

        it('should not cache non-ok responses', async () => {
            const errorResponse = new Response('not found', { status: 404 });
            global.fetch = jest.fn().mockResolvedValue(errorResponse);

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('static-cache-v3', cache);

            const request = new Request('https://example.com/static.js');
            const response = await strategies.static.fetch(request);

            expect(response).toBe(errorResponse);
            expect(cache.put).not.toHaveBeenCalled();
        });
    });

    describe('Problems Strategy', () => {
        it('should return cached problems if not expired', async () => {
            const cachedResponse = new Response('cached problem', {
                headers: { 'sw-cached-time': String(Date.now() - 1000) },
            });

            const cache = {
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(cachedResponse),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            };
            mockCacheStorage.set('problems-cache-v3', cache);

            const request = new Request('https://example.com/problem.md');
            const response = await strategies.problems.fetch(request);

            expect(response).toBe(cachedResponse);
        });
    });

    describe('CacheStrategies Class', () => {
        let cacheStrategies: CacheStrategies;

        beforeEach(() => {
            cacheStrategies = new CacheStrategies('v3');
        });

        describe('cacheFirst', () => {
            it('should return cached response if available', async () => {
                const cachedResponse = new Response('cached');
                
                const cache = {
                    put: jest.fn().mockResolvedValue(undefined),
                    match: jest.fn().mockResolvedValue(cachedResponse),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const request = new Request('https://example.com/test');
                const response = await cacheStrategies.cacheFirst(request, 'problems');
    
                expect(response).toBe(cachedResponse);
            });

            it('should fetch and cache when not available', async () => {
                const networkResponse = new Response('network');
                global.fetch = jest.fn().mockResolvedValue(networkResponse);
    
                const putSpy = jest.fn().mockResolvedValue(undefined);
                const cache = {
                    put: putSpy,
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const request = new Request('https://example.com/test');
                const response = await cacheStrategies.cacheFirst(request, 'problems');
    
                expect(response).toBe(networkResponse);
                expect(putSpy).toHaveBeenCalled();
            });
        });

        describe('networkFirst', () => {
            it('should return network response and cache', async () => {
                const networkResponse = new Response('network');
                global.fetch = jest.fn().mockResolvedValue(networkResponse);
    
                const putSpy = jest.fn().mockResolvedValue(undefined);
                const cache = {
                    put: putSpy,
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const request = new Request('https://example.com/api');
                const response = await cacheStrategies.networkFirst(request, 'api');
    
                expect(response).toBe(networkResponse);
                expect(putSpy).toHaveBeenCalled();
            });

            it('should handle cache put failure gracefully', async () => {
                const networkResponse = new Response('network');
                global.fetch = jest.fn().mockResolvedValue(networkResponse);
    
                const cache = {
                    put: jest.fn().mockRejectedValue(new Error('Cache full')),
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const request = new Request('https://example.com/api');
                const response = await cacheStrategies.networkFirst(request, 'api');
    
                expect(response).toBe(networkResponse);
            });
        });

        describe('staleWhileRevalidate', () => {
            it('should return cached response and revalidate', async () => {
                const cachedResponse = new Response('cached');
                const networkResponse = new Response('network');
                
                global.fetch = jest.fn().mockResolvedValue(networkResponse);
    
                const putSpy = jest.fn().mockResolvedValue(undefined);
                const cache = {
                    put: putSpy,
                    match: jest.fn().mockResolvedValue(cachedResponse),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const request = new Request('https://example.com/problem');
                const response = await cacheStrategies.staleWhileRevalidate(request, 'problems');
    
                expect(response.body).toBe(cachedResponse.body);
            });

            it('should fetch when no cache', async () => {
                const networkResponse = new Response('network');
                global.fetch = jest.fn().mockResolvedValue(networkResponse);
    
                const putSpy = jest.fn().mockResolvedValue(undefined);
                const cache = {
                    put: putSpy,
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const request = new Request('https://example.com/problem');
                const response = await cacheStrategies.staleWhileRevalidate(request, 'problems');
    
                expect(response.body).toBe(networkResponse.body);
            });
        });

        describe('cacheOnly', () => {
            it('should return cached response', async () => {
                const cachedResponse = new Response('cached');
    
                const cache = {
                    put: jest.fn().mockResolvedValue(undefined),
                    match: jest.fn().mockResolvedValue(cachedResponse),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const request = new Request('https://example.com/problem');
                const response = await cacheStrategies.cacheOnly(request, 'problems');
    
                expect(response).toBe(cachedResponse);
            });

            it('should throw when cache miss', async () => {
                const cache = {
                    put: jest.fn().mockResolvedValue(undefined),
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const request = new Request('https://example.com/problem');
                await expect(cacheStrategies.cacheOnly(request, 'problems')).rejects.toThrow('Cache miss');
            });
        });

        describe('networkOnly', () => {
            it('should only fetch from network', async () => {
                const networkResponse = new Response('network');
                global.fetch = jest.fn().mockResolvedValue(networkResponse);

                const request = new Request('https://example.com/api');
                const response = await cacheStrategies.networkOnly(request);

                expect(response).toBe(networkResponse);
                expect(global.fetch).toHaveBeenCalledWith(request);
            });
        });

        describe('preCacheUrls', () => {
            it('should cache multiple URLs', async () => {
                const putSpy = jest.fn().mockResolvedValue(undefined);
                const cache = {
                    put: putSpy,
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.fetch = jest.fn().mockResolvedValue(new Response('data'));
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const urls = ['https://example.com/1.js', 'https://example.com/2.js'];
                await cacheStrategies.preCacheUrls(urls, 'static');
    
                expect(global.fetch).toHaveBeenCalledTimes(2);
                expect(putSpy).toHaveBeenCalledTimes(2);
            });
    
            it('should handle individual fetch failures', async () => {
                const putSpy = jest.fn().mockResolvedValue(undefined);
                const cache = {
                    put: putSpy,
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: jest.fn().mockResolvedValue([]),
                };
                
                global.fetch = jest.fn()
                    .mockResolvedValueOnce(new Response('data'))
                    .mockRejectedValueOnce(new Error('Failed'));
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const urls = ['https://example.com/1.js', 'https://example.com/2.js'];
                await cacheStrategies.preCacheUrls(urls, 'static');
    
                // Should complete without throwing
                expect(global.fetch).toHaveBeenCalledTimes(2);
            });
        });

        describe('getCachedUrls', () => {
            it('should return list of cached URLs', async () => {
                const requests = [
                    new Request('https://example.com/1.js'),
                    new Request('https://example.com/2.js'),
                ];
    
                const keysSpy = jest.fn().mockResolvedValue(requests);
                const cache = {
                    put: jest.fn().mockResolvedValue(undefined),
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: jest.fn().mockResolvedValue(true),
                    keys: keysSpy,
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                const urls = await cacheStrategies.getCachedUrls('static');
    
                expect(urls).toHaveLength(2);
                expect(urls[0]).toBe('https://example.com/1.js');
            });
        });

        describe('clearCache', () => {
            it('should clear all entries from cache', async () => {
                const requests = [
                    new Request('https://example.com/1.js'),
                    new Request('https://example.com/2.js'),
                ];
    
                const deleteSpy = jest.fn().mockResolvedValue(true);
                const cache = {
                    put: jest.fn().mockResolvedValue(undefined),
                    match: jest.fn().mockResolvedValue(undefined),
                    delete: deleteSpy,
                    keys: jest.fn().mockResolvedValue(requests),
                };
                
                global.caches.open = jest.fn().mockResolvedValue(cache);
    
                const cacheStrategies = new CacheStrategies('v3');
                await cacheStrategies.clearCache('static');
    
                // Verify that delete was called for each cached item
                expect(deleteSpy).toHaveBeenCalledTimes(2);
            });
        });

        describe('getCacheInfo', () => {
            it('should return cache info for all caches', async () => {
                const cache1 = {
                    put: jest.fn(),
                    match: jest.fn(),
                    delete: jest.fn(),
                    keys: jest.fn().mockResolvedValue([1, 2, 3]),
                };
                const cache2 = {
                    put: jest.fn(),
                    match: jest.fn(),
                    delete: jest.fn(),
                    keys: jest.fn().mockResolvedValue([1, 2]),
                };

                mockCacheStorage.set('cache1', cache1);
                mockCacheStorage.set('cache2', cache2);

                global.caches.keys = jest.fn().mockResolvedValue(['cache1', 'cache2']);
                global.caches.open = jest.fn().mockImplementation((name: string) => {
                    return Promise.resolve(mockCacheStorage.get(name));
                });

                const info = await cacheStrategies.getCacheInfo();

                expect(info).toHaveLength(2);
            });
        });
    });

    describe('cleanupOldCaches', () => {
        it('should remove old versioned caches', async () => {
            const allCacheNames = [
                'problems-cache-v3',
                'api-cache-v3',
                'static-cache-v3',
                'old-cache-v1',
                'problems-cache-v1',
            ];

            global.caches.keys = jest.fn().mockResolvedValue(allCacheNames);
            global.caches.delete = jest.fn().mockResolvedValue(true);

            await cleanupOldCaches();

            // Should delete old caches not in current strategies
            expect(global.caches.delete).toHaveBeenCalledWith('old-cache-v1');
            expect(global.caches.delete).toHaveBeenCalledWith('problems-cache-v1');
        });

        it('should keep current versioned caches', async () => {
            const allCacheNames = [
                'problems-cache-v3',
                'api-cache-v3',
                'static-cache-v3',
                'user-cache-v3',
            ];

            global.caches.keys = jest.fn().mockResolvedValue(allCacheNames);
            global.caches.delete = jest.fn().mockResolvedValue(true);

            await cleanupOldCaches();

            // Should not delete current caches
            expect(global.caches.delete).not.toHaveBeenCalledWith('problems-cache-v3');
            expect(global.caches.delete).not.toHaveBeenCalledWith('api-cache-v3');
        });
    });

    describe('getCacheStats', () => {
        it('should return stats for all caches', async () => {
            const cache1 = {
                keys: jest.fn().mockResolvedValue([1, 2, 3]),
            };
            const cache2 = {
                keys: jest.fn().mockResolvedValue([1, 2]),
            };

            mockCacheStorage.set('cache1', cache1);
            mockCacheStorage.set('cache2', cache2);

            global.caches.keys = jest.fn().mockResolvedValue(['cache1', 'cache2']);
            global.caches.open = jest.fn().mockImplementation((name: string) => {
                return Promise.resolve(mockCacheStorage.get(name));
            });

            const stats = await getCacheStats();

            expect(stats).toEqual({
                cache1: 3,
                cache2: 2,
            });
        });

        it('should handle empty cache list', async () => {
            global.caches.keys = jest.fn().mockResolvedValue([]);

            const stats = await getCacheStats();

            expect(stats).toEqual({});
        });
    });

    describe('CACHE_NAMES', () => {
        it('should export cache name constants', () => {
            expect(CACHE_NAMES.PROBLEMS).toBe('problems-cache');
            expect(CACHE_NAMES.API).toBe('api-cache');
            expect(CACHE_NAMES.STATIC).toBe('static-cache');
            expect(CACHE_NAMES.USER).toBe('user-cache');
            expect(CACHE_NAMES.DYNAMIC).toBe('dynamic-cache');
        });
    });
});
