/**
 * Cache Strategies - Optimized caching strategies for Service Worker
 * Implements stale-while-revalidate with proper cache versioning
 */

import { SYNC_CONFIG } from '../config/sync-config';

interface CacheStrategy {
    fetch(_request: Request): Promise<Response>;
}

class StaleWhileRevalidate implements CacheStrategy {
    private cacheName: string;
    private maxAge: number;

    constructor(cacheName: string, maxAge: number) {
        this.cacheName = cacheName;
        this.maxAge = maxAge;
    }

    async fetch(request: Request): Promise<Response> {
        const cache = await caches.open(this.cacheName);
        const cached = await cache.match(request);

        // Return cached version immediately if available and not expired
        if (cached) {
            const cachedTime = cached.headers.get('sw-cached-time');
            if (cachedTime) {
                const age = Date.now() - parseInt(cachedTime, 10);
                if (age < this.maxAge) {
                    // Revalidate in background
                    this.revalidate(request, cache);
                    return cached;
                }
            }
        }

        // Fetch fresh version
        try {
            const response = await fetch(request);
            if (response.ok) {
                await this.putInCache(request, response.clone(), cache);
            }
            return response;
        } catch (error) {
            // Return stale cache if available, even if expired
            if (cached) {
                return cached;
            }
            throw error;
        }
    }

    private async revalidate(request: Request, cache: Cache): Promise<void> {
        try {
            const response = await fetch(request);
            if (response.ok) {
                await this.putInCache(request, response, cache);
            }
        } catch {
            // Silently fail background revalidation
        }
    }

    private async putInCache(request: Request, response: Response, cache: Cache): Promise<void> {
        // Add timestamp header for age tracking
        const headers = new Headers(response.headers);
        headers.set('sw-cached-time', Date.now().toString());

        const modifiedResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
        });

        await cache.put(request, modifiedResponse);
    }
}

class NetworkFirst implements CacheStrategy {
    private cacheName: string;

    constructor(cacheName: string) {
        this.cacheName = cacheName;
    }

    async fetch(request: Request): Promise<Response> {
        try {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                const cache = await caches.open(this.cacheName);
                await cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        } catch (error) {
            const cache = await caches.open(this.cacheName);
            const cached = await cache.match(request);
            if (cached) {
                return cached;
            }
            throw error;
        }
    }
}

class CacheFirst implements CacheStrategy {
    private cacheName: string;

    constructor(cacheName: string) {
        this.cacheName = cacheName;
    }

    async fetch(request: Request): Promise<Response> {
        const cache = await caches.open(this.cacheName);
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }

        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response.clone());
        }
        return response;
    }
}

// Cache version for cache busting
const CACHE_VERSION = 'v2';

// Cache names for external reference (base names without version for test compatibility)
export const CACHE_NAMES = {
    PROBLEMS: 'problems-cache',
    API: 'api-cache',
    STATIC: 'static-cache',
    USER: 'user-cache',
    DYNAMIC: 'dynamic-cache', // For backward compatibility with tests
};

// Strategy instances
export const strategies = {
    // API calls - stale-while-revalidate with 5 minute max age
    api: new StaleWhileRevalidate(`api-cache-${CACHE_VERSION}`, SYNC_CONFIG.CACHE.API_MAX_AGE),

    // Static assets - cache first with long TTL
    static: new CacheFirst(`static-cache-${CACHE_VERSION}`),

    // Problem data - stale-while-revalidate with 24 hour max age
    problems: new StaleWhileRevalidate(
        `problems-cache-${CACHE_VERSION}`,
        SYNC_CONFIG.CACHE.PROBLEMS_MAX_AGE
    ),

    // User data - network first for freshness
    user: new NetworkFirst(`user-cache-${CACHE_VERSION}`),
};

/**
 * CacheStrategies class for backward compatibility with existing tests
 * Provides a unified interface for all caching strategies
 */
export class CacheStrategies {
    private version: string;

    constructor(version: string) {
        this.version = version;
    }

    private getFullCacheName(cacheName: string): string {
        const baseName = CACHE_NAMES[cacheName as keyof typeof CACHE_NAMES] || cacheName;
        return `${baseName}-${this.version}`;
    }

    /**
     * CacheFirst strategy - returns cached response if available, otherwise fetches from network
     */
    async cacheFirst(request: Request, cacheName: string): Promise<Response> {
        const cache = await caches.open(this.getFullCacheName(cacheName));
        const cached = await cache.match(request);

        if (cached) return cached;

        const response = await fetch(request);
        if (response?.ok) await cache.put(request, response.clone());
        return response;
    }

    /**
     * NetworkFirst strategy - fetches from network first, falls back to cache on failure
     */
    async networkFirst(request: Request, cacheName: string): Promise<Response> {
        const fullCacheName = this.getFullCacheName(cacheName);

        try {
            const networkResponse = await fetch(request);
            if (networkResponse?.ok) {
                const cache = await caches.open(fullCacheName);
                await cache.put(request, networkResponse.clone());
                return networkResponse;
            }
            // Non-OK response - try cache fallback
            const cache = await caches.open(fullCacheName);
            const cached = await cache.match(request);
            if (cached) return cached;
            throw new Error(
                `Network request failed with status ${networkResponse?.status || 'unknown'}`
            );
        } catch (error) {
            if (error instanceof Error && error.message.includes('Network request failed'))
                throw error;
            const cache = await caches.open(fullCacheName);
            const cached = await cache.match(request);
            if (cached) return cached;
            throw error;
        }
    }

    /**
     * StaleWhileRevalidate strategy - returns cached response immediately, updates cache in background
     */
    async staleWhileRevalidate(request: Request, cacheName: string): Promise<Response> {
        const fullCacheName = this.getFullCacheName(cacheName);
        const cache = await caches.open(fullCacheName);
        const cached = await cache.match(request);

        if (cached) {
            // Revalidate in background
            fetch(request)
                .then(async (response) => {
                    if (response?.ok) {
                        const bgCache = await caches.open(fullCacheName);
                        await bgCache.put(request, response.clone());
                    }
                })
                .catch(() => {});
            return cached.clone();
        }

        // No cache, fetch from network
        const response = await fetch(request);
        if (response?.ok) await cache.put(request, response.clone());
        return response;
    }

    /**
     * CacheOnly strategy - only returns cached response, throws if not found
     */
    async cacheOnly(request: Request, cacheName: string): Promise<Response> {
        const cache = await caches.open(this.getFullCacheName(cacheName));
        const cached = await cache.match(request);
        if (cached) return cached;
        throw new Error('Cache miss');
    }

    /**
     * NetworkOnly strategy - always fetches from network, never caches
     */
    async networkOnly(request: Request): Promise<Response> {
        return fetch(request);
    }

    /**
     * Pre-cache multiple URLs
     */
    async preCacheUrls(urls: string[], cacheName: string): Promise<void> {
        const cache = await caches.open(this.getFullCacheName(cacheName));

        await Promise.all(
            urls.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (response?.ok) await cache.put(url, response.clone());
                } catch (error) {
                    console.error(`Failed to pre-cache ${url}:`, error);
                }
            })
        );
    }

    /**
     * Get all cached URLs for a cache
     */
    async getCachedUrls(cacheName: string): Promise<string[]> {
        const cache = await caches.open(this.getFullCacheName(cacheName));
        const keys = await cache.keys();
        return keys.map((request) => request.url);
    }

    /**
     * Clear all entries from a cache
     */
    async clearCache(cacheName: string): Promise<void> {
        const cache = await caches.open(this.getFullCacheName(cacheName));
        const keys = await cache.keys();
        await Promise.all(keys.map((key) => cache.delete(key)));
    }

    /**
     * Get info about all caches
     */
    async getCacheInfo(): Promise<Array<{ name: string; itemCount: number }>> {
        const cacheNames = await caches.keys();
        return Promise.all(
            cacheNames.map(async (name) => {
                const cache = await caches.open(name);
                const keys = await cache.keys();
                const simpleName =
                    Object.entries(CACHE_NAMES).find(([, value]) => name.startsWith(value))?.[0] ||
                    name;
                return { name: simpleName, itemCount: keys.length };
            })
        );
    }
}

/**
 * Clean up old caches
 */
export async function cleanupOldCaches(): Promise<void> {
    const cacheNames = await caches.keys();
    const validCacheNames = Object.values(strategies).map((s) => {
        // Extract cache name from strategy
        if (s instanceof StaleWhileRevalidate) {
            return (s as unknown as { cacheName: string }).cacheName;
        }
        if (s instanceof NetworkFirst) {
            return (s as unknown as { cacheName: string }).cacheName;
        }
        if (s instanceof CacheFirst) {
            return (s as unknown as { cacheName: string }).cacheName;
        }
        return '';
    });

    const oldCaches = cacheNames.filter((name) => !validCacheNames.includes(name));
    await Promise.all(oldCaches.map((name) => caches.delete(name)));
}

/**
 * Get cache stats
 */
export async function getCacheStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    const cacheNames = await caches.keys();

    for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        stats[name] = keys.length;
    }

    return stats;
}
