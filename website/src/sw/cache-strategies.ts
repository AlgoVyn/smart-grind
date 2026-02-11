// Cache Strategies for SmartGrind Service Worker
// Provides different caching strategies for various asset types

export const CACHE_NAMES = {
    STATIC: 'smartgrind-static',
    PROBLEMS: 'smartgrind-problems',
    API: 'smartgrind-api',
    IMAGES: 'smartgrind-images',
    DYNAMIC: 'smartgrind-dynamic',
} as const;

export type CacheName = (typeof CACHE_NAMES)[keyof typeof CACHE_NAMES];

export class CacheStrategies {
    private cacheVersion: string;

    constructor(cacheVersion: string) {
        this.cacheVersion = cacheVersion;
    }

    /**
     * Cache First Strategy
     * Try cache first, fall back to network
     * Best for: Static assets that rarely change (CSS, fonts, problem markdown)
     */
    async cacheFirst(request: Request, cacheName: CacheName): Promise<Response> {
        const cache = await caches.open(`${cacheName}-${this.cacheVersion}`);

        // Try cache first
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Not in cache, fetch from network
        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        } catch (_error) {
            throw new Error(`CacheFirst failed for ${request.url}: ${_error}`);
        }
    }

    /**
     * Network First Strategy
     * Try network first, fall back to cache
     * Best for: API calls, user-specific data that needs to be fresh
     */
    async networkFirst(request: Request, cacheName: CacheName, maxAge?: number): Promise<Response> {
        const cache = await caches.open(`${cacheName}-${this.cacheVersion}`);

        try {
            // Try network first
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                // Cache the fresh response
                const responseToCache = networkResponse.clone();
                const headers = new Headers(responseToCache.headers);
                headers.set('X-SW-Cached-At', Date.now().toString());
                const modifiedResponse = new Response(responseToCache.body, {
                    status: responseToCache.status,
                    statusText: responseToCache.statusText,
                    headers,
                });
                cache.put(request, modifiedResponse);
                return networkResponse;
            }
            throw new Error(`Network response not OK: ${networkResponse.status}`);
        } catch (_error) {
            // Network failed, try cache
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
                // Check if cached response is still valid (if maxAge specified)
                if (maxAge) {
                    const cachedAt = cachedResponse.headers.get('X-SW-Cached-At');
                    if (cachedAt) {
                        const age = Date.now() - parseInt(cachedAt, 10);
                        if (age > maxAge) {
                            throw new Error('Cached response is stale');
                        }
                    }
                }
                return cachedResponse;
            }
            throw new Error(`NetworkFirst failed for ${request.url}: ${_error}`);
        }
    }

    /**
     * Stale While Revalidate Strategy
     * Return cached version immediately, update cache in background
     * Best for: Assets that can be slightly outdated (JS bundles, images)
     */
    async staleWhileRevalidate(request: Request, cacheName: CacheName): Promise<Response> {
        const cache = await caches.open(`${cacheName}-${this.cacheVersion}`);

        const cachedResponse = await cache.match(request);

        // Always try to fetch from network for revalidation
        const networkFetch = fetch(request)
            .then((networkResponse) => {
                if (networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                }
                return networkResponse;
            })
            .catch(() => {
                return null;
            });

        if (cachedResponse) {
            // Return cached version immediately, revalidate in background
            // Trigger background revalidation - intentionally not awaiting
            networkFetch
                .then((_response) => {
                    // Revalidation complete, _response is intentionally unused
                })
                .catch(() => {
                    // Ignore background revalidation errors
                });
            return cachedResponse;
        }

        // Not in cache, wait for network
        const networkResponse = await networkFetch;
        if (networkResponse) {
            return networkResponse;
        }

        throw new Error(`StaleWhileRevalidate failed for ${request.url}`);
    }

    /**
     * Network Only Strategy
     * Always fetch from network, don't cache
     * Best for: Real-time data, sensitive information
     */
    async networkOnly(request: Request): Promise<Response> {
        return fetch(request);
    }

    /**
     * Cache Only Strategy
     * Only return from cache, never hit network
     * Best for: Offline-first resources that are pre-cached
     */
    async cacheOnly(request: Request, cacheName: CacheName): Promise<Response> {
        const cache = await caches.open(`${cacheName}-${this.cacheVersion}`);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw new Error(`CacheOnly miss for ${request.url}`);
    }

    /**
     * Pre-cache a list of URLs
     */
    async preCacheUrls(urls: string[], cacheName: CacheName): Promise<void> {
        const cache = await caches.open(`${cacheName}-${this.cacheVersion}`);
        const promises = urls.map(async (url) => {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response);
                }
            } catch (_error) {
                // Silent fail for pre-cache
            }
        });
        await Promise.all(promises);
    }

    /**
     * Get all cached URLs for a specific cache
     */
    async getCachedUrls(cacheName: CacheName): Promise<string[]> {
        const cache = await caches.open(`${cacheName}-${this.cacheVersion}`);
        const requests = await cache.keys();
        return requests.map((request) => request.url);
    }

    /**
     * Clear a specific cache
     */
    async clearCache(cacheName: CacheName): Promise<void> {
        const cache = await caches.open(`${cacheName}-${this.cacheVersion}`);
        const requests = await cache.keys();
        await Promise.all(requests.map((request) => cache.delete(request)));
    }

    /**
     * Get cache size information
     */
    async getCacheInfo(): Promise<{ name: string; itemCount: number; size: number }[]> {
        const info = [];
        for (const [key, name] of Object.entries(CACHE_NAMES)) {
            try {
                const cache = await caches.open(`${name}-${this.cacheVersion}`);
                const requests = await cache.keys();
                let size = 0;
                for (const request of requests) {
                    const response = await cache.match(request);
                    if (response) {
                        const blob = await response.blob();
                        size += blob.size;
                    }
                }
                info.push({
                    name: key,
                    itemCount: requests.length,
                    size,
                });
            } catch (_error) {
                // Silent fail for cache info
            }
        }
        return info;
    }
}
