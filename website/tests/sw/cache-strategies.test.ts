/**
 * Cache Strategies Unit Tests
 * Tests for CacheFirst, NetworkFirst, and StaleWhileRevalidate strategies
 */

import { CacheStrategies, CACHE_NAMES } from '../../src/sw/cache-strategies';

describe('CacheStrategies', () => {
    let strategies: CacheStrategies;

    beforeEach(() => {
        strategies = new CacheStrategies('v1');
        jest.clearAllMocks();
    });

    describe('CacheFirst Strategy', () => {
        it('should return cached response when available', async () => {
            const url = 'https://example.com/static.js';
            const cachedResponse = new Response('cached content', {
                headers: { 'Content-Type': 'application/javascript' },
            });

            // Pre-populate cache
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-v1`);
            await cache.put(url, cachedResponse.clone());

            const request = new Request(url);

            const response = await strategies.cacheFirst(request, CACHE_NAMES.STATIC);

            expect(await response.text()).toBe('cached content');
        });

        it('should fetch from network when cache miss', async () => {
            const url = 'https://example.com/new.js';
            const networkResponse = new Response('network content', {
                headers: { 'Content-Type': 'application/javascript' },
            });

            global.fetch = jest.fn().mockResolvedValue(networkResponse.clone());

            const request = new Request(url);

            const response = await strategies.cacheFirst(request, CACHE_NAMES.STATIC);

            expect(await response.text()).toBe('network content');
            expect(global.fetch).toHaveBeenCalledWith(request);
        });

        it('should cache network response on cache miss', async () => {
            const url = 'https://example.com/cacheable.js';
            const networkResponse = new Response('network content', {
                headers: { 'Content-Type': 'application/javascript' },
            });

            global.fetch = jest.fn().mockResolvedValue(networkResponse.clone());

            const request = new Request(url);

            await strategies.cacheFirst(request, CACHE_NAMES.STATIC);

            // Verify response was cached
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-v1`);
            const cached = await cache.match(url);
            expect(cached).toBeDefined();
            expect(await cached!.text()).toBe('network content');
        });

        it('should throw error on network failure when cache miss', async () => {
            const url = 'https://example.com/failing.js';
            const request = new Request(url);

            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            await expect(strategies.cacheFirst(request, CACHE_NAMES.STATIC)).rejects.toThrow();
        });
    });

    describe('NetworkFirst Strategy', () => {
        it('should return network response when available', async () => {
            const url = 'https://api.example.com/data';
            const networkResponse = new Response('{"data": "fresh"}', {
                headers: { 'Content-Type': 'application/json' },
            });

            global.fetch = jest.fn().mockResolvedValue(networkResponse.clone());

            const request = new Request(url);

            const response = await strategies.networkFirst(request, CACHE_NAMES.API);

            expect(await response.text()).toBe('{"data": "fresh"}');
            expect(global.fetch).toHaveBeenCalledWith(request);
        });

        it('should cache successful network response', async () => {
            const url = 'https://api.example.com/data';
            const networkResponse = new Response('{"data": "fresh"}', {
                headers: { 'Content-Type': 'application/json' },
            });

            global.fetch = jest.fn().mockResolvedValue(networkResponse.clone());

            const request = new Request(url);

            await strategies.networkFirst(request, CACHE_NAMES.API);

            const cache = await caches.open(`${CACHE_NAMES.API}-v1`);
            const cached = await cache.match(url);
            expect(cached).toBeDefined();
        });

        it('should fall back to cache when network fails', async () => {
            const url = 'https://api.example.com/data';
            const cachedResponse = new Response('{"data": "cached"}', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-SW-Cached-At': Date.now().toString(),
                },
            });

            // Pre-populate cache
            const cache = await caches.open(`${CACHE_NAMES.API}-v1`);
            await cache.put(url, cachedResponse.clone());

            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            const request = new Request(url);

            const response = await strategies.networkFirst(request, CACHE_NAMES.API);

            expect(await response.text()).toBe('{"data": "cached"}');
        });

        it('should throw error when both network and cache fail', async () => {
            const url = 'https://api.example.com/unavailable';
            const request = new Request(url);

            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            await expect(strategies.networkFirst(request, CACHE_NAMES.API)).rejects.toThrow();
        });

        it('should not cache non-OK responses', async () => {
            const url = 'https://api.example.com/error';
            const errorResponse = new Response('Error', { status: 500 });

            global.fetch = jest.fn().mockResolvedValue(errorResponse);

            const request = new Request(url);

            await expect(strategies.networkFirst(request, CACHE_NAMES.API)).rejects.toThrow();

            const cache = await caches.open(`${CACHE_NAMES.API}-v1`);
            const cached = await cache.match(url);
            expect(cached).toBeUndefined();
        });
    });

    describe('StaleWhileRevalidate Strategy', () => {
        it('should return cached response immediately if available', async () => {
            const url = 'https://example.com/resource';
            const cachedResponse = new Response('cached', {
                headers: { 'Content-Type': 'text/plain' },
            });

            const cache = await caches.open(`${CACHE_NAMES.DYNAMIC}-v1`);
            await cache.put(url, cachedResponse.clone());

            global.fetch = jest.fn().mockResolvedValue(new Response('fresh'));

            const request = new Request(url);

            const response = await strategies.staleWhileRevalidate(request, CACHE_NAMES.DYNAMIC);

            expect(await response.text()).toBe('cached');
        });

        it('should fetch from network in background when cache hit', async () => {
            const url = 'https://example.com/resource';
            const cachedResponse = new Response('cached', {
                headers: { 'Content-Type': 'text/plain' },
            });

            const cache = await caches.open(`${CACHE_NAMES.DYNAMIC}-v1`);
            await cache.put(url, cachedResponse.clone());

            global.fetch = jest.fn().mockResolvedValue(new Response('fresh'));

            const request = new Request(url);

            await strategies.staleWhileRevalidate(request, CACHE_NAMES.DYNAMIC);

            // Wait for background fetch
            await new Promise((resolve) => setTimeout(resolve, 10));

            expect(global.fetch).toHaveBeenCalledWith(request);
        });

        it('should update cache with fresh response', async () => {
            const url = 'https://example.com/resource';
            const cachedResponse = new Response('cached', {
                headers: { 'Content-Type': 'text/plain' },
            });

            const cache = await caches.open(`${CACHE_NAMES.DYNAMIC}-v1`);
            await cache.put(url, cachedResponse.clone());

            global.fetch = jest.fn().mockResolvedValue(new Response('fresh'));

            const request = new Request(url);

            await strategies.staleWhileRevalidate(request, CACHE_NAMES.DYNAMIC);

            // Wait for background update
            await new Promise((resolve) => setTimeout(resolve, 10));

            const updated = await cache.match(url);
            expect(await updated!.text()).toBe('fresh');
        });

        it('should fetch from network when cache miss', async () => {
            const url = 'https://example.com/new-resource';
            const networkResponse = new Response('fresh', {
                headers: { 'Content-Type': 'text/plain' },
            });

            global.fetch = jest.fn().mockResolvedValue(networkResponse.clone());

            const request = new Request(url);

            const response = await strategies.staleWhileRevalidate(request, CACHE_NAMES.DYNAMIC);

            expect(await response.text()).toBe('fresh');
            expect(global.fetch).toHaveBeenCalledWith(request);
        });

        it('should cache network response on cache miss', async () => {
            const url = 'https://example.com/new-resource';
            const networkResponse = new Response('fresh', {
                headers: { 'Content-Type': 'text/plain' },
            });

            global.fetch = jest.fn().mockResolvedValue(networkResponse.clone());

            const request = new Request(url);

            await strategies.staleWhileRevalidate(request, CACHE_NAMES.DYNAMIC);

            const cache = await caches.open(`${CACHE_NAMES.DYNAMIC}-v1`);
            const cached = await cache.match(url);
            expect(cached).toBeDefined();
        });
    });

    describe('Cache Only Strategy', () => {
        it('should return cached response when available', async () => {
            const url = 'https://example.com/offline.html';
            const cachedResponse = new Response('offline content', {
                headers: { 'Content-Type': 'text/html' },
            });

            const cache = await caches.open(`${CACHE_NAMES.STATIC}-v1`);
            await cache.put(url, cachedResponse.clone());

            const request = new Request(url);

            const response = await strategies.cacheOnly(request, CACHE_NAMES.STATIC);

            expect(await response.text()).toBe('offline content');
        });

        it('should throw error when not in cache', async () => {
            const url = 'https://example.com/not-cached.html';
            const request = new Request(url);

            await expect(strategies.cacheOnly(request, CACHE_NAMES.STATIC)).rejects.toThrow();
        });
    });

    describe('Network Only Strategy', () => {
        it('should always fetch from network', async () => {
            const url = 'https://api.example.com/realtime';
            const networkResponse = new Response('realtime data');

            global.fetch = jest.fn().mockResolvedValue(networkResponse.clone());

            const request = new Request(url);

            const response = await strategies.networkOnly(request);

            expect(await response.text()).toBe('realtime data');
            expect(global.fetch).toHaveBeenCalledWith(request);
        });

        it('should not cache the response', async () => {
            const url = 'https://api.example.com/realtime';
            const networkResponse = new Response('realtime data');

            global.fetch = jest.fn().mockResolvedValue(networkResponse.clone());

            const request = new Request(url);

            await strategies.networkOnly(request);

            // Verify nothing was cached
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-v1`);
            const cached = await cache.match(url);
            expect(cached).toBeUndefined();
        });
    });

    describe('Pre-cache URLs', () => {
        it('should pre-cache multiple URLs', async () => {
            const urls = [
                'https://example.com/app.js',
                'https://example.com/styles.css',
                'https://example.com/index.html',
            ];

            global.fetch = jest.fn().mockResolvedValue(new Response('content'));

            await strategies.preCacheUrls(urls, CACHE_NAMES.STATIC);

            const cache = await caches.open(`${CACHE_NAMES.STATIC}-v1`);
            for (const url of urls) {
                const cached = await cache.match(url);
                expect(cached).toBeDefined();
            }
        });

        it('should handle pre-cache failures gracefully', async () => {
            const urls = ['https://example.com/valid.js', 'https://example.com/invalid.js'];

            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(new Response('valid'))
                .mockRejectedValueOnce(new Error('Failed'));

            // Should not throw, just log error
            await expect(strategies.preCacheUrls(urls, CACHE_NAMES.STATIC)).resolves.not.toThrow();
        });
    });

    describe('Cache Management', () => {
        it('should get cached URLs', async () => {
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-v1`);
            await cache.put('https://example.com/item1', new Response('content1'));
            await cache.put('https://example.com/item2', new Response('content2'));

            const urls = await strategies.getCachedUrls(CACHE_NAMES.STATIC);

            expect(urls).toContain('https://example.com/item1');
            expect(urls).toContain('https://example.com/item2');
        });

        it('should clear cache', async () => {
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-v1`);
            await cache.put('https://example.com/item', new Response('content'));

            await strategies.clearCache(CACHE_NAMES.STATIC);

            const urls = await strategies.getCachedUrls(CACHE_NAMES.STATIC);
            expect(urls).toHaveLength(0);
        });

        it('should get cache info', async () => {
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-v1`);
            await cache.put('https://example.com/item1', new Response('content1'));
            await cache.put('https://example.com/item2', new Response('content2'));

            const info = await strategies.getCacheInfo();

            const staticInfo = info.find((i) => i.name === 'STATIC');
            expect(staticInfo).toBeDefined();
            expect(staticInfo!.itemCount).toBe(2);
        });
    });
});
