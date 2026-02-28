/// <reference lib="webworker" />

/**
 * SmartGrind Service Worker
 * Provides offline access to problems and background sync for user progress
 * @module sw/service-worker
 */

import { CACHE_NAMES } from './cache-strategies';
import { OfflineManager } from './offline-manager';
import { BackgroundSyncManager } from './background-sync';
import { OperationQueue } from './operation-queue';
import { isValidSWClientMessage, type SWClientMessage } from '../types/sw-messages';
import {
    openDatabase,
    safeStore,
    safeRetrieve,
    IDBOperationError,
    IDBErrorType,
} from '../utils/indexeddb-helper';

declare const self: ServiceWorkerGlobalScope;

// ============================================================================
// VERSION MANAGEMENT
// ============================================================================

/**
 * Service Worker Version
 * This is replaced at build time by the build process
 * Format: YYYYMMDD-HHMMSS-gitsha (e.g., 20240115-143022-a1b2c3d)
 */
declare const __SW_VERSION__: string | undefined;
const SW_VERSION: string =
    typeof __SW_VERSION__ !== 'undefined' ? __SW_VERSION__ : 'dev-' + Date.now();
const CACHE_VERSION = `v${SW_VERSION}`;

// Maximum age for cached API responses (30 minutes)
const API_CACHE_MAX_AGE = 30 * 60 * 1000;

// Maximum age for cached static assets (24 hours)
const STATIC_CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

// ============================================================================
// CACHE INVENTORY - Track what we should have cached
// ============================================================================

interface CacheInventory {
    version: string;
    cachedAt: number;
    assets: string[];
}

const INVENTORY_KEY = 'smartgrind-cache-inventory';

/**
 * Save the current cache inventory to IndexedDB
 */
async function saveCacheInventory(inventory: CacheInventory): Promise<void> {
    try {
        const db = await openInventoryDB();
        try {
            await safeStore(db, 'inventory', INVENTORY_KEY, inventory);
        } finally {
            db.close();
        }
    } catch (error) {
        if (error instanceof IDBOperationError && error.type === IDBErrorType.QUOTA_EXCEEDED) {
            console.warn('[SW] Storage quota exceeded, cannot save cache inventory');
        } else {
            console.warn('[SW] Failed to save cache inventory:', error);
        }
    }
}

/**
 * Get the last saved cache inventory
 */
async function getCacheInventory(): Promise<CacheInventory | null> {
    try {
        const db = await openInventoryDB();
        try {
            return await safeRetrieve<CacheInventory>(db, 'inventory', INVENTORY_KEY);
        } finally {
            db.close();
        }
    } catch (error) {
        console.warn('[SW] Failed to get cache inventory:', error);
        return null;
    }
}

/**
 * Database names for different purposes
 */
const INVENTORY_DB_NAME = 'smartgrind-sw-inventory';
const BUNDLE_STATE_DB_NAME = 'smartgrind-offline';

/**
 * Open the IndexedDB for inventory storage
 */
async function openInventoryDB(): Promise<IDBDatabase> {
    return openDatabase(INVENTORY_DB_NAME, 1, (db) => {
        if (!db.objectStoreNames.contains('inventory')) {
            db.createObjectStore('inventory', { keyPath: 'key' });
        }
    });
}

/**
 * Open the IndexedDB for bundle state storage
 */
async function openBundleStateDB(): Promise<IDBDatabase> {
    return openDatabase(BUNDLE_STATE_DB_NAME, 1, (db) => {
        if (!db.objectStoreNames.contains('bundle-state')) {
            db.createObjectStore('bundle-state', { keyPath: 'key' });
        }
    });
}

/**
 * Validate current caches and remove orphaned entries
 */
async function validateAndCleanCaches(): Promise<void> {
    const inventory = await getCacheInventory();
    if (!inventory || inventory.version !== SW_VERSION) {
        console.log('[SW] Cache inventory outdated or missing, performing full cleanup');
        return;
    }

    // Check each cache for orphaned entries
    for (const cacheName of Object.values(CACHE_NAMES)) {
        const versionedCacheName = `${cacheName}-${CACHE_VERSION}`;
        try {
            const cache = await caches.open(versionedCacheName);
            const keys = await cache.keys();
            const orphanedKeys: Request[] = [];

            for (const request of keys) {
                // Check if this request should still be cached
                const cachedResponse = await cache.match(request);
                if (cachedResponse) {
                    const cachedAt = cachedResponse.headers.get('X-SW-Cached-At');
                    const age = cachedAt ? Date.now() - parseInt(cachedAt, 10) : Infinity;

                    // Check for stale entries based on cache type
                    const isAPICache = cacheName === CACHE_NAMES.API;
                    const maxAge = isAPICache ? API_CACHE_MAX_AGE : STATIC_CACHE_MAX_AGE;

                    if (age > maxAge) {
                        orphanedKeys.push(request);
                    }
                }
            }

            // Remove orphaned entries
            if (orphanedKeys.length > 0) {
                console.log(
                    `[SW] Removing ${orphanedKeys.length} orphaned entries from ${versionedCacheName}`
                );
                await Promise.all(orphanedKeys.map((key) => cache.delete(key)));
            }
        } catch (error) {
            console.warn(`[SW] Error validating cache ${versionedCacheName}:`, error);
        }
    }
}

// Initialize managers
const offlineManager = new OfflineManager();
const backgroundSync = new BackgroundSyncManager();
const operationQueue = new OperationQueue();

// ============================================================================
// CACHE HELPERS
// ============================================================================

/**
 * Adds cache timestamp headers to a response before storing
 */
function addCacheHeaders(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set('X-SW-Cached-At', Date.now().toString());
    headers.set('X-SW-Version', SW_VERSION);
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

// Static assets to cache on install
// Note: Only cache files that are known to exist at build time
// CSS and JS are bundled with hashes and cached dynamically via CACHE_ASSETS message
// Don't cache any static assets during install - they may not exist or may redirect
// All assets will be cached dynamically via CACHE_ASSETS message after registration
const STATIC_ASSETS: string[] = [];

/**
 * URL patterns for problem content files to cache
 */
const PROBLEM_PATTERNS = [
    /\/smartgrind\/patterns\/.+\.md$/,
    /\/smartgrind\/solutions\/.+\.md$/,
    /\/smartgrind\/algorithms\/.+\.md$/,
];

/**
 * API route patterns that should use network-first strategy
 */
const API_ROUTES = [/\/smartgrind\/api\//];

/**
 * Auth route patterns that should bypass service worker (OAuth redirects)
 */
const AUTH_ROUTES = [/\/smartgrind\/api\/auth/];

/**
 * Validates if a request should be handled by the service worker
 * @param requestUrl - URL of the incoming request
 * @returns True if the request should be handled
 */
const shouldHandleRequest = (requestUrl: URL): boolean => {
    // Skip non-http/https schemes (e.g., chrome-extension, data, blob)
    // Skip auth routes - let browser handle OAuth redirects naturally
    const isHttpScheme = requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:';
    const isAuthRoute = AUTH_ROUTES.some((pattern) => pattern.test(requestUrl.pathname));
    return isHttpScheme && !isAuthRoute;
};

/**
 * Determines the appropriate handler for a request
 * @param requestUrl - URL of the incoming request
 * @param request - The fetch request
 * @returns Handler function or null if request should not be handled
 */
const getRequestHandler = (
    requestUrl: URL,
    request: Request
): ((_req: Request) => Promise<Response>) | null => {
    // Check if this is a navigation request (HTML page)
    const isNavigationRequest = request.mode === 'navigate';

    // Check if this is a problem file request
    const isProblemFile = PROBLEM_PATTERNS.some((pattern) => {
        return pattern.test(requestUrl.pathname);
    });

    // Handle navigation requests (HTML pages) - critical for offline reload
    if (isNavigationRequest) {
        return handleNavigationRequest;
    }

    // Handle API requests
    if (API_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))) {
        return handleAPIRequest;
    }

    // Handle problem markdown files
    if (isProblemFile) {
        return handleProblemRequest;
    }

    // Skip non-GET requests for static assets
    if (request.method !== 'GET') {
        return null;
    }

    // Handle static assets (JS, CSS, images, fonts)
    return handleStaticRequest;
};

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        (async () => {
            try {
                // Pre-cache static assets only if there are any
                if (STATIC_ASSETS.length > 0) {
                    const staticCache = await caches.open(CACHE_NAMES.STATIC);
                    await staticCache.addAll(STATIC_ASSETS);
                }

                // Pre-cache problem index/metadata
                await offlineManager.preCacheProblemIndex();

                // Skip waiting to activate immediately
                await self.skipWaiting();
            } catch (error) {
                console.error('[SW] Install failed:', error);
                throw new Error(`Service worker install failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        })()
    );
});

// Activate event - clean up old caches and download bundle
self.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(
        (async () => {
            try {
                // Clean up old caches
                const cacheWhitelist = Object.values(CACHE_NAMES).map(
                    (name) => `${name}-${CACHE_VERSION}`
                );
                const allCaches = await caches.keys();

                // Delete old versioned caches and orphaned caches
                const deletionPromises = allCaches
                    .filter((cacheName) => {
                        // Keep caches that match our current version
                        if (cacheWhitelist.includes(cacheName)) return false;

                        // Delete old SmartGrind caches
                        if (cacheName.includes('smartgrind') || cacheName.includes('v1.')) {
                            return true;
                        }

                        return false;
                    })
                    .map((oldCache) => {
                        console.log(`[SW] Deleting old cache: ${oldCache}`);
                        return caches.delete(oldCache);
                    });

                await Promise.all(deletionPromises);

                // Validate and clean current caches
                await validateAndCleanCaches();

                // Small delay to ensure browser has processed the activation
                await new Promise((resolve) => setTimeout(resolve, 100));

                // Claim clients immediately - this is critical for the SW to control the page
                await self.clients.claim();

                // Wait a bit more for claim() to take effect in the browser
                await new Promise((resolve) => setTimeout(resolve, 100));

                // Get controlled clients to verify which clients are actually controlled
                const controlledClients = await self.clients.matchAll({
                    type: 'window',
                    includeUncontrolled: false,
                });

                // Also get uncontrolled clients for debugging
                const allClients = await self.clients.matchAll({
                    type: 'window',
                    includeUncontrolled: true,
                });

                // Notify controlled clients that SW is active
                controlledClients.forEach((client) => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        version: SW_VERSION,
                        controlling: true,
                    });
                    // Tell client to clear the reload flag since SW is ready
                    client.postMessage({
                        type: 'CLEAR_RELOAD_FLAG',
                    });
                });

                // For uncontrolled clients, send a message indicating they need to check controller
                const uncontrolledClients = allClients.filter(
                    (client) => !controlledClients.some((c) => c.id === client.id)
                );
                uncontrolledClients.forEach((client) => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        version: SW_VERSION,
                        controlling: false,
                    });
                });

                // Check and download bundle in background if needed
                checkAndDownloadBundle().catch((error) => {
                    console.warn('[SW] Bundle download failed during activation:', error);
                    // Bundle download failed, will retry later
                });

                // Save current inventory
                await saveCacheInventory({
                    version: SW_VERSION,
                    cachedAt: Date.now(),
                    assets: [],
                });
            } catch (error) {
                console.error('[SW] Activation failed:', error);
                throw new Error(`Service worker activation failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        })()
    );
});

/**
 * Fetch event handler - processes all network requests with appropriate caching strategies
 */
self.addEventListener('fetch', (event: FetchEvent) => {
    const { request } = event;
    const requestUrl = new URL(request.url);

    // Validate request should be handled
    if (!shouldHandleRequest(requestUrl)) {
        return;
    }

    // Get appropriate handler
    const handler = getRequestHandler(requestUrl, request);
    if (!handler) {
        return;
    }

    // Process request with selected handler
    event.respondWith(handler(request));
});

/**
 * Handles API requests with network-first strategy and offline fallback
 * @param request - The fetch request to handle
 * @returns Response from network or cache
 */
async function handleAPIRequest(request: Request): Promise<Response> {
    try {
        const networkResponse = await fetch(request);

        // Handle redirect responses - don't cache, return as-is
        if (networkResponse.status >= 300 && networkResponse.status < 400) {
            return networkResponse;
        }

        if (networkResponse.ok) {
            // Only cache GET requests (Cache API doesn't support POST/PUT/DELETE)
            if (request.method === 'GET') {
                const cache = await caches.open(`${CACHE_NAMES.API}-${CACHE_VERSION}`);
                const responseWithHeaders = addCacheHeaders(networkResponse.clone());
                cache.put(request, responseWithHeaders).catch((error) => {
                    console.warn('[SW] Failed to cache API response:', error);
                });
            }
            return networkResponse;
        }

        // For auth errors (401, 403), don't cache - let the client handle them
        if (networkResponse.status === 401 || networkResponse.status === 403) {
            return networkResponse;
        }

        throw new Error(`API error: ${networkResponse.status}`);
    } catch (error) {
        return handleAPIError(request, error);
    }
}

/**
 * Handles errors from API requests with appropriate fallback responses
 * @param request - The original fetch request
 * @param error - The error that occurred
 * @returns Cached response or offline fallback
 */
async function handleAPIError(request: Request, error: unknown): Promise<Response> {
    const isNetworkError = error instanceof TypeError;

    // Try cache for GET requests
    if (request.method === 'GET') {
        const cache = await caches.open(`${CACHE_NAMES.API}-${CACHE_VERSION}`);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            const headers = new Headers(cachedResponse.headers);
            headers.set('X-SW-Cache', 'true');
            if (isNetworkError) headers.set('X-SW-Offline', 'true');

            return new Response(cachedResponse.body, {
                status: cachedResponse.status,
                statusText: cachedResponse.statusText,
                headers,
            });
        }
    }

    // Only return offline fallback for actual network errors
    if (isNetworkError) {
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'You are currently offline. Data will sync when connection is restored.',
                offline: true,
            }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json', 'X-SW-Offline': 'true' },
            }
        );
    }

    throw error;
}

/**
 * Handles problem markdown file requests with cache-first strategy
 * @param request - The fetch request to handle
 * @returns Response from cache or network
 */
async function handleProblemRequest(request: Request): Promise<Response> {
    const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);

    // Try cache first
    const cachedResponse = await cache.match(request, { ignoreSearch: true });
    if (cachedResponse) return serveCachedProblem(request, cachedResponse, cache);

    // Not in cache, try network
    return fetchProblemFromNetwork(request, cache);
}

/**
 * Serves a cached problem response with background revalidation
 */
function serveCachedProblem(request: Request, cachedResponse: Response, cache: Cache): Response {
    // Revalidate in background (will fail silently if offline)
    if (request.method === 'GET') {
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse.ok) {
                    const responseWithHeaders = addCacheHeaders(networkResponse);
                    cache.put(request, responseWithHeaders).catch((error) => {
                        console.warn(
                            '[SW] Failed to update problem cache during revalidation:',
                            error
                        );
                    });
                }
            })
            .catch((error) => {
                // Background revalidation failed, likely offline - this is expected
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.log(
                        '[SW] Background revalidation failed (likely offline):',
                        error.message
                    );
                }
            });
    }

    // If it's a HEAD request, return response with no body
    if (request.method === 'HEAD') {
        return new Response(null, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers: cachedResponse.headers,
        });
    }

    return cachedResponse;
}

/**
 * Fetches a problem from the network and caches it
 */
async function fetchProblemFromNetwork(request: Request, cache: Cache): Promise<Response> {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone()).catch((error) => {
                console.warn('[SW] Failed to cache problem from network:', error);
            });
        }
        return networkResponse;
    } catch (error) {
        console.warn('[SW] Failed to fetch problem from network:', error);
        return new Response(
            '# Offline\n\nThis problem is not available offline. Please connect to the internet to access this content.',
            { status: 503, headers: { 'Content-Type': 'text/markdown', 'X-SW-Offline': 'true' } }
        );
    }
}

/**
 * Handles static asset requests with stale-while-revalidate strategy
 */
async function handleStaticRequest(request: Request): Promise<Response> {
    const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
    const cachedResponse = await cache.match(request);

    // Always try to fetch from network for revalidation
    const networkFetch = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                // Add cache headers and store
                const responseWithHeaders = addCacheHeaders(networkResponse.clone());
                cache.put(request, responseWithHeaders).catch((error) => {
                    console.warn('[SW] Failed to cache static asset:', error);
                });
            }
            return networkResponse;
        })
        .catch((error) => {
            console.warn('[SW] Network fetch for static asset failed:', error);
            return null;
        });

    if (cachedResponse) {
        revalidateStaticAsset(request, networkFetch);
        return cachedResponse;
    }

    const networkResponse = await networkFetch;
    if (networkResponse) return networkResponse;

    return new Response('Offline - Resource not available', {
        status: 503,
        statusText: 'Service Unavailable',
    });
}

/**
 * Revalidates a static asset in the background and notifies clients of updates
 */
function revalidateStaticAsset(request: Request, networkFetch: Promise<Response | null>): void {
    networkFetch
        .then((networkResponse) => {
            if (networkResponse) {
                self.clients
                    .matchAll()
                    .then((matchedClients) => {
                        matchedClients.forEach((client) => {
                            client.postMessage({ type: 'ASSET_UPDATED', url: request.url });
                        });
                    })
                    .catch((error) => {
                        console.warn('[SW] Failed to notify clients of asset update:', error);
                    });
            }
        })
        .catch((error) => {
            console.warn('[SW] Static asset revalidation failed:', error);
        });
}

/**
 * Handles navigation requests (HTML pages) with network-first strategy and offline fallback
 * This is critical for enabling page reloads when offline
 * @param request - The navigation request to handle
 * @returns Response from network or cached offline page
 */
async function handleNavigationRequest(request: Request): Promise<Response> {
    const requestUrl = new URL(request.url);

    // Try network first for navigation requests
    try {
        const networkResponse = await fetch(request);

        // Cache successful responses for offline access
        if (networkResponse.ok) {
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
            // Add cache headers and store
            const responseWithHeaders = addCacheHeaders(networkResponse.clone());
            cache.put(request, responseWithHeaders).catch((error) => {
                console.warn('[SW] Failed to cache navigation response:', error);
            });
        }

        return networkResponse;
    } catch (error) {
        console.log('[SW] Network request failed, serving from cache:', error);
        // Network failed, try to serve from cache
        const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);

        // Try exact match first
        let cachedResponse = await cache.match(request);

        // If no exact match, try to find the main page for SPA routing
        if (!cachedResponse) {
            // For SPA routes, serve the main index.html
            const mainPageUrl = `${requestUrl.origin}${requestUrl.pathname.split('/').slice(0, 3).join('/')}/`;
            cachedResponse = await cache.match(mainPageUrl);

            // If still no match, try the scope root
            if (!cachedResponse) {
                const scopeRoot = self.registration.scope;
                cachedResponse = await cache.match(scopeRoot);
            }
        }

        if (cachedResponse) {
            // Return cached page with offline header
            const headers = new Headers(cachedResponse.headers);
            headers.set('X-SW-Offline', 'true');
            headers.set('X-SW-Cache', 'true');

            return new Response(cachedResponse.body, {
                status: cachedResponse.status,
                statusText: cachedResponse.statusText,
                headers,
            });
        }

        // No cached page available, return offline fallback
        return createOfflineFallbackPage(requestUrl);
    }
}

/**
 * Creates an offline fallback page when no cached version is available
 * @param _requestUrl - The URL that was requested (unused but kept for API consistency)
 * @returns A basic offline page response
 */
function createOfflineFallbackPage(_requestUrl: URL): Response {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmartGrind - Offline</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #e0e0e0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            text-align: center;
            max-width: 500px;
        }
        .icon {
            font-size: 64px;
            margin-bottom: 24px;
        }
        h1 {
            font-size: 28px;
            margin-bottom: 16px;
            color: #fff;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 24px;
            color: #a0a0a0;
        }
        .retry-btn {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 12px 32px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .retry-btn:hover {
            background: #4338ca;
        }
        .status {
            margin-top: 24px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📡</div>
        <h1>You're Offline</h1>
        <p>
            It looks like you've lost your internet connection. 
            SmartGrind needs to be online for the first load, but once loaded,
            you can access cached problems offline.
        </p>
        <button class="retry-btn" onclick="location.reload()">
            Try Again
        </button>
        <div class="status">
            <p id="status-text">Checking connection...</p>
        </div>
    </div>
    <script>
        function checkConnection() {
            if (navigator.onLine) {
                document.getElementById('status-text').textContent = 
                    'Connection restored! Click "Try Again" to reload.';
            } else {
                document.getElementById('status-text').textContent = 
                    'Still offline. Please check your connection.';
            }
        }
        
        window.addEventListener('online', () => {
            document.getElementById('status-text').textContent = 
                'Connection restored! Click "Try Again" to reload.';
        });
        
        window.addEventListener('offline', () => {
            document.getElementById('status-text').textContent = 
                'Still offline. Please check your connection.';
        });
        
        checkConnection();
        
        // Auto-retry when connection is restored
        window.addEventListener('online', () => {
            setTimeout(() => location.reload(), 500);
        });
    </script>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
            'X-SW-Offline': 'true',
            'X-SW-Fallback': 'true',
        },
    });
}

// ... (rest of imports and setup)

// Helper to send reply via message channel or source
const sendReply = (event: ExtendableMessageEvent, message: unknown) => {
    if (event.ports?.[0]) {
        event.ports[0].postMessage(message);
    } else if (event.source) {
        event.source.postMessage(message);
    }
};

/**
 * Check if the page can be reloaded while offline
 * @param url - Optional URL to check, defaults to current scope
 * @returns Status object with reload capability info
 */
async function checkOfflineReloadStatus(url?: string): Promise<{
    canReload: boolean;
    pageCached: boolean;
    assetsCached: boolean;
    bundleReady: boolean;
    cachedItemsCount: number;
}> {
    const checkUrl = url || self.registration.scope;
    const staticCache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
    const problemsCache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);

    // Check if main page is cached
    let pageCached = false;
    try {
        const pageResponse = await staticCache.match(checkUrl);
        pageCached = !!pageResponse;

        // Also check for index.html variations
        if (!pageCached) {
            const urlObj = new URL(checkUrl);
            const indexUrl = `${urlObj.origin}${urlObj.pathname}/index.html`;
            const indexResponse = await staticCache.match(indexUrl);
            pageCached = !!indexResponse;
        }
    } catch {
        pageCached = false;
    }

    // Count cached static assets
    const staticKeys = await staticCache.keys();
    const assetsCached = staticKeys.length > 0;

    // Check bundle status
    const bundleStatus = await getBundleStatus();
    const bundleReady = bundleStatus.status === 'complete';

    // Count problems cache
    const problemsKeys = await problemsCache.keys();

    // Total cached items
    const cachedItemsCount = staticKeys.length + problemsKeys.length;

    return {
        canReload: pageCached && assetsCached,
        pageCached,
        assetsCached,
        bundleReady,
        cachedItemsCount,
    };
}

/**
 * Get detailed offline capability status
 * @returns Detailed offline capability information
 */
async function getOfflineCapabilityStatus(): Promise<{
    isOffline: boolean;
    canFunctionOffline: boolean;
    cacheStatus: {
        staticAssets: number;
        problems: number;
        apiResponses: number;
        bundleFiles: number;
    };
    lastBundleDownload?: number;
    bundleVersion?: string;
}> {
    // Get all cache stats
    const staticCache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
    const problemsCache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);
    const apiCache = await caches.open(`${CACHE_NAMES.API}-${CACHE_VERSION}`);

    const staticKeys = await staticCache.keys();
    const problemsKeys = await problemsCache.keys();
    const apiKeys = await apiCache.keys();

    // Get bundle status
    const bundleStatus = await getBundleStatus();

    // Check if we have essential assets cached
    const hasStaticAssets = staticKeys.length > 0;

    // Determine if app can function offline
    const canFunctionOffline = hasStaticAssets;

    // Build result object with optional properties only if they have values
    const result: {
        isOffline: boolean;
        canFunctionOffline: boolean;
        cacheStatus: {
            staticAssets: number;
            problems: number;
            apiResponses: number;
            bundleFiles: number;
        };
        lastBundleDownload?: number;
        bundleVersion?: string;
    } = {
        isOffline: !navigator.onLine,
        canFunctionOffline,
        cacheStatus: {
            staticAssets: staticKeys.length,
            problems: problemsKeys.length,
            apiResponses: apiKeys.length,
            bundleFiles: bundleStatus.status === 'complete' ? bundleStatus.totalFiles : 0,
        },
    };

    // Only add optional properties if they have defined values
    if (bundleStatus.downloadedAt !== undefined) {
        result.lastBundleDownload = bundleStatus.downloadedAt;
    }
    if (bundleStatus.bundleVersion !== undefined) {
        result.bundleVersion = bundleStatus.bundleVersion;
    }

    return result;
}

/**
 * Validates and extracts message data from an event
 * @param event - The message event from the client
 * @returns Validated message data or null if invalid
 */
const validateMessage = (event: ExtendableMessageEvent): SWClientMessage | null => {
    const { data } = event;

    if (!data || typeof data !== 'object') {
        return null;
    }

    if (!isValidSWClientMessage(data)) {
        console.warn('[SW] Rejected invalid message:', data);
        return null;
    }

    return data as SWClientMessage;
};

/**
 * Message event handler - processes communication from main app
 */
self.addEventListener('message', (event: ExtendableMessageEvent) => {
    // Validate message structure
    const messageData = validateMessage(event);
    if (!messageData) {
        return;
    }

    switch (messageData.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'CACHE_ASSETS':
            if (messageData.assets && Array.isArray(messageData.assets)) {
                event.waitUntil(
                    (async () => {
                        const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
                        // Cache assets individually to prevent one failure from failing the entire batch
                        await Promise.allSettled(
                            messageData.assets.map(async (assetUrl: string) => {
                                try {
                                    const response = await fetch(assetUrl);
                                    if (response.ok) {
                                        await cache.put(assetUrl, response);
                                    }
                                } catch {
                                    // Individual asset fetch failed - continue with other assets
                                }
                            })
                        );
                    })()
                );
            }
            break;

        case 'CACHE_PROBLEMS':
            if (messageData.problemUrls) {
                event.waitUntil(offlineManager.cacheProblems(messageData.problemUrls));
            }
            break;

        case 'SYNC_OPERATIONS':
            if (messageData.operations && Array.isArray(messageData.operations)) {
                event.waitUntil(
                    (async () => {
                        const ids = await operationQueue.addOperations(messageData.operations);
                        sendReply(event, { type: 'SYNC_QUEUED', operationId: ids?.[0] ?? null });
                    })()
                );
            }
            break;

        case 'GET_SYNC_STATUS':
            event.waitUntil(
                (async () => {
                    const status = await operationQueue.getStatus();
                    sendReply(event, { type: 'SYNC_STATUS', status });
                })()
            );
            break;

        case 'FORCE_SYNC':
            event.waitUntil(
                (async () => {
                    const result = await backgroundSync.forceSync();
                    sendReply(event, result);
                })()
            );
            break;

        case 'REQUEST_SYNC':
            if (messageData.tag) {
                event.waitUntil(backgroundSync.performSync(messageData.tag));
            }
            break;

        case 'CLEAR_ALL_CACHES':
            event.waitUntil(
                (async () => {
                    const allCaches = await caches.keys();
                    await Promise.all(allCaches.map((name) => caches.delete(name)));
                    sendReply(event, { type: 'CACHES_CLEARED' });
                })()
            );
            break;

        case 'CLIENT_READY':
            // Client is reporting it's ready and wants to know if it's controlled
            event.waitUntil(
                (async () => {
                    const allClients = await self.clients.matchAll({
                        type: 'window',
                        includeUncontrolled: true,
                    });
                    const sourceClient = event.source as Client | undefined;
                    if (sourceClient) {
                        const isControlled = allClients.some(
                            (client) => client.id === sourceClient.id && 'frameType' in client
                        );
                        sourceClient.postMessage({
                            type: 'CLIENT_CONTROL_STATUS',
                            controlled: isControlled,
                            version: SW_VERSION,
                        });
                    }
                })()
            );
            break;

        case 'NETWORK_RESTORED':
            event.waitUntil(
                backgroundSync.checkAndSync().catch((error) => {
                    console.warn('[SW] Network restored sync failed:', error);
                    // Sync failed, will retry
                })
            );
            break;

        case 'DOWNLOAD_BUNDLE':
            event.waitUntil(handleDownloadBundle(event));
            break;

        case 'GET_BUNDLE_STATUS':
            event.waitUntil(
                (async () => {
                    const status = await getBundleStatus();
                    sendReply(event, { type: 'BUNDLE_STATUS', status });
                })()
            );
            break;

        case 'CHECK_OFFLINE_RELOAD':
            event.waitUntil(
                (async () => {
                    const status = await checkOfflineReloadStatus(messageData.url);
                    sendReply(event, { type: 'OFFLINE_RELOAD_STATUS', ...status });
                })()
            );
            break;

        case 'GET_OFFLINE_STATUS':
            event.waitUntil(
                (async () => {
                    const status = await getOfflineCapabilityStatus();
                    sendReply(event, { type: 'OFFLINE_CAPABILITY', ...status });
                })()
            );
            break;
    }
});

// Sync event - handle background sync
self.addEventListener('sync', (event: Event) => {
    const syncEvent = event as Event & { tag: string; waitUntil(_fn: Promise<void>): void };

    if (syncEvent.tag === 'sync-user-progress') {
        syncEvent.waitUntil(backgroundSync.syncUserProgress());
    } else if (syncEvent.tag === 'sync-custom-problems') {
        syncEvent.waitUntil(backgroundSync.syncCustomProblems());
    }
});

// Push event - handle push notifications (future enhancement)
self.addEventListener('push', (event: PushEvent) => {
    if (!event.data) return;

    const data = event.data.json();
    const title = data.title || 'SmartGrind';
    const options: NotificationOptions = {
        body: data.body || 'Time to review your coding problems!',
        icon: '/smartgrind/logo.svg',
        badge: '/smartgrind/logo.svg',
        tag: data.tag || 'review-reminder',
        requireInteraction: data.requireInteraction || false,
        // actions: data.actions || [], // Note: actions not supported in all browsers
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click event
self.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close();

    event.waitUntil(self.clients.openWindow('/smartgrind/'));
});

// Periodic sync for daily review reminders (if supported)
self.addEventListener('periodicsync', (event: Event) => {
    const periodicEvent = event as Event & { tag: string; waitUntil(_fn: Promise<void>): void };
    if (periodicEvent.tag === 'daily-review-reminder') {
        periodicEvent.waitUntil(
            self.registration.showNotification('SmartGrind', {
                body: 'Time for your daily coding practice!',
                icon: '/smartgrind/logo.svg',
            })
        );
    }
});

// Online event - trigger sync when connection is restored
// This is critical for ensuring offline changes get synced
self.addEventListener('online', () => {
    // Use waitUntil pattern to ensure sync completes
    backgroundSync.checkAndSync().catch((error) => {
        console.warn('[SW] Online event sync failed:', error);
        // Sync failed, will retry
    });
});

// ============================================================================
// Offline Bundle Download and Extraction
// ============================================================================

// Bundle download state
interface BundleDownloadState {
    status: 'idle' | 'downloading' | 'extracting' | 'complete' | 'error';
    progress: number;
    totalFiles: number;
    extractedFiles: number;
    error?: string;
    bundleVersion?: string;
    downloadedAt?: number;
}

const BUNDLE_URL = '/smartgrind/offline-bundle.tar.gz';
const BUNDLE_MANIFEST_URL = '/smartgrind/offline-manifest.json';
const BUNDLE_STATE_KEY = 'smartgrind-bundle-state';

// Check if we're in development mode (localhost)
const isDev = typeof location !== 'undefined' && location.hostname === 'localhost';

/**
 * Get the current bundle download status
 */
async function getBundleStatus(): Promise<BundleDownloadState> {
    try {
        const state = await getStateFromIDB<BundleDownloadState>(BUNDLE_STATE_KEY);
        return state || { status: 'idle', progress: 0, totalFiles: 0, extractedFiles: 0 };
    } catch {
        return { status: 'idle', progress: 0, totalFiles: 0, extractedFiles: 0 };
    }
}

/**
 * Store state in IndexedDB with quota handling
 */
async function getStateFromIDB<T>(key: string): Promise<T | null> {
    try {
        const db = await openBundleStateDB();
        try {
            return await safeRetrieve<T>(db, 'bundle-state', key);
        } finally {
            db.close();
        }
    } catch (error) {
        console.warn('[SW] Failed to get bundle state from IndexedDB:', error);
        return null;
    }
}

/**
 * Save state to IndexedDB with quota handling
 */
async function saveStateToIDB<T>(key: string, value: T): Promise<void> {
    try {
        const db = await openBundleStateDB();
        try {
            await safeStore(db, 'bundle-state', key, value);
        } finally {
            db.close();
        }
    } catch (error) {
        if (error instanceof IDBOperationError && error.type === IDBErrorType.QUOTA_EXCEEDED) {
            console.warn('[SW] Storage quota exceeded, cannot save bundle state');
        } else {
            console.warn('[SW] Failed to save bundle state to IndexedDB:', error);
        }
    }
}

/**
 * Send progress update to all clients
 */
async function sendProgressUpdate(state: BundleDownloadState): Promise<void> {
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => {
        client.postMessage({
            type: 'BUNDLE_PROGRESS',
            state,
        });
    });
}

/**
 * Maximum number of retry attempts for bundle download
 */
const MAX_BUNDLE_RETRIES = 5;

/**
 * Calculate delay for exponential backoff with jitter
 * @param attempt - Current attempt number (0-indexed)
 * @returns Delay in milliseconds
 */
function getBundleRetryDelay(attempt: number): number {
    // Base delay: 1s, 2s, 4s, 8s, max 16s
    const baseDelay = Math.min(1000 * Math.pow(2, attempt), 16000);
    // Add jitter: ±25% random variation to prevent thundering herd
    const jitter = baseDelay * 0.25 * (Math.random() * 2 - 1);
    return Math.floor(baseDelay + jitter);
}

/**
 * Check if bundle needs to be downloaded and download it in background
 * This is called automatically when SW activates
 * Implements exponential backoff for failed downloads
 */
async function checkAndDownloadBundle(retryAttempt = 0): Promise<void> {
    // Skip in development mode
    if (isDev) {
        return;
    }

    try {
        // Check if we already have a cached bundle
        const currentState = await getBundleStatus();

        // Fetch the manifest to check version
        const manifestResponse = await fetch(BUNDLE_MANIFEST_URL).catch((error) => {
            console.warn('[SW] Failed to fetch bundle manifest:', error);
            return null;
        });

        if (!manifestResponse || !manifestResponse.ok) {
            console.log('[SW] Bundle manifest not available, skipping download');
            return;
        }

        const manifest = await manifestResponse.json();
        const remoteVersion = manifest.version;

        console.log(
            `[SW] Bundle version check - cached: ${currentState.bundleVersion || 'none'}, remote: ${remoteVersion}`
        );

        // Check if we need to download (no cache or new version)
        if (currentState.status === 'complete' && currentState.bundleVersion === remoteVersion) {
            console.log('[SW] Bundle is up to date, skipping download');
            return;
        }

        // If we have a different version cached, clear the old cache first
        if (currentState.bundleVersion && currentState.bundleVersion !== remoteVersion) {
            console.log(
                `[SW] Bundle version changed from ${currentState.bundleVersion} to ${remoteVersion}, clearing old cache`
            );
            await clearBundleCache();
        }

        // Download the bundle
        console.log(
            `[SW] Starting bundle download... (attempt ${retryAttempt + 1}/${MAX_BUNDLE_RETRIES})`
        );
        await downloadAndExtractBundle();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[SW] Bundle download attempt ${retryAttempt + 1} failed:`, errorMessage);

        // Check if we should retry
        if (retryAttempt < MAX_BUNDLE_RETRIES - 1) {
            const delay = getBundleRetryDelay(retryAttempt);
            console.log(`[SW] Retrying bundle download in ${delay}ms...`);

            // Save error state with retry info
            const errorState: BundleDownloadState = {
                status: 'error',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
                error: `${errorMessage} (retrying in ${Math.round(delay / 1000)}s... attempt ${retryAttempt + 1}/${MAX_BUNDLE_RETRIES})`,
            };
            await saveStateToIDB(BUNDLE_STATE_KEY, errorState);
            await sendProgressUpdate(errorState);

            // Wait and retry
            await new Promise((resolve) => setTimeout(resolve, delay));
            return checkAndDownloadBundle(retryAttempt + 1);
        }

        // All retries exhausted
        console.error('[SW] Bundle download failed after all retry attempts');

        // Save final error state
        const finalErrorState: BundleDownloadState = {
            status: 'error',
            progress: 0,
            totalFiles: 0,
            extractedFiles: 0,
            error: `Download failed after ${MAX_BUNDLE_RETRIES} attempts: ${errorMessage}. Will retry on next SW activation.`,
        };
        await saveStateToIDB(BUNDLE_STATE_KEY, finalErrorState);
        await sendProgressUpdate(finalErrorState);

        // Notify clients that bundle download failed permanently
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => {
            client.postMessage({
                type: 'BUNDLE_FAILED',
                error: errorMessage,
                retryExhausted: true,
            });
        });

        throw new Error(
            `Bundle download failed after ${MAX_BUNDLE_RETRIES} attempts: ${errorMessage}`
        );
    }
}

/**
 * Clear the bundle cache when version changes
 */
async function clearBundleCache(): Promise<void> {
    try {
        const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);
        const keys = await cache.keys();

        // Delete all cached problem files (patterns, solutions, algorithms)
        const deletionPromises = keys
            .filter((request) => {
                const url = new URL(request.url);
                return PROBLEM_PATTERNS.some((pattern) => pattern.test(url.pathname));
            })
            .map((request) => cache.delete(request));

        await Promise.all(deletionPromises);
        console.log(`[SW] Cleared ${deletionPromises.length} old bundle files from cache`);
    } catch (error) {
        console.error('[SW] Failed to clear bundle cache:', error);
    }
}

/**
 * Download and extract bundle (internal function)
 */
async function downloadAndExtractBundle(): Promise<void> {
    try {
        // Update state: downloading
        const state: BundleDownloadState = {
            status: 'downloading',
            progress: 0,
            totalFiles: 0,
            extractedFiles: 0,
        };
        await saveStateToIDB(BUNDLE_STATE_KEY, state);
        await sendProgressUpdate(state);

        // Fetch the bundle
        const response = await fetch(BUNDLE_URL);

        if (!response.ok) {
            throw new Error(`Failed to download bundle: ${response.status}`);
        }

        console.log('[SW] Compressed bundle download started successfully');

        // Get total size for progress tracking
        const contentLength = response.headers.get('content-length');
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

        // Download with progress tracking
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const chunks: Uint8Array[] = [];
        let downloadedSize = 0;

        let readResult = await reader.read();
        while (!readResult.done) {
            const { value } = readResult;
            if (value) {
                chunks.push(value);
                downloadedSize += value.length;

                // Update progress (0-50% for download)
                if (totalSize > 0) {
                    state.progress = Math.round((downloadedSize / totalSize) * 50);
                    await sendProgressUpdate(state);
                }
            }
            readResult = await reader.read();
        }

        // Decompress the bundle
        state.status = 'extracting';
        state.progress = 50;
        await saveStateToIDB(BUNDLE_STATE_KEY, state);
        await sendProgressUpdate(state);

        // Combine chunks and decompress
        const compressedData = new Uint8Array(downloadedSize);
        let offset = 0;
        for (const chunk of chunks) {
            compressedData.set(chunk, offset);
            offset += chunk.length;
        }

        // Decompress using DecompressionStream (gzip)
        const decompressedStream = new Response(compressedData).body?.pipeThrough(
            new DecompressionStream('gzip')
        );

        if (!decompressedStream) {
            throw new Error('Failed to create decompression stream');
        }

        const decompressedBuffer = await new Response(decompressedStream).arrayBuffer();
        const tarData = new Uint8Array(decompressedBuffer);

        // Parse tar and extract files
        const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);
        const files = parseTar(tarData);
        state.totalFiles = files.length;

        // Extract each file
        let manifest: { version?: string; totalFiles?: number } | null = null;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file) continue;

            // Check if this is the manifest
            if (file.name === 'manifest.json') {
                const manifestText = new TextDecoder().decode(file.content);
                manifest = JSON.parse(manifestText);
                continue;
            }

            // Store in cache - file.name already includes patterns/ or solutions/ prefix
            const url = `${self.registration.scope}${file.name}`;
            const fileResponse = new Response(file.content.buffer as BodyInit, {
                headers: {
                    'Content-Type': 'text/markdown',
                    'X-SW-Cached-At': Date.now().toString(),
                },
            });
            await cache.put(url, fileResponse);

            // Update progress (50-100% for extraction)
            state.extractedFiles = i + 1;
            state.progress = 50 + Math.round((i / files.length) * 50);

            // Send progress every 10 files or at the end
            if (i % 10 === 0 || i === files.length - 1) {
                await sendProgressUpdate(state);
            }
        }

        // Complete
        state.status = 'complete';
        state.progress = 100;
        if (manifest?.version) {
            state.bundleVersion = manifest.version;
        }
        state.downloadedAt = Date.now();
        await saveStateToIDB(BUNDLE_STATE_KEY, state);
        await sendProgressUpdate(state);

        console.log(
            `[SW] Compressed bundle downloaded and extracted successfully: ${state.extractedFiles} files (version: ${state.bundleVersion})`
        );

        // Notify clients that bundle is ready
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => {
            client.postMessage({
                type: 'BUNDLE_READY',
                state,
            });
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[SW] Compressed bundle download failed: ${errorMessage}`);

        const errorState: BundleDownloadState = {
            status: 'error',
            progress: 0,
            totalFiles: 0,
            extractedFiles: 0,
            error: errorMessage,
        };
        await saveStateToIDB(BUNDLE_STATE_KEY, errorState);
        await sendProgressUpdate(errorState);

        throw error;
    }
}

/**
 * Handle bundle download and extraction (message handler wrapper)
 */
async function handleDownloadBundle(event: ExtendableMessageEvent): Promise<void> {
    try {
        await downloadAndExtractBundle();
        const state = await getBundleStatus();
        sendReply(event, { type: 'BUNDLE_COMPLETE', state });
    } catch (error) {
        sendReply(event, {
            type: 'BUNDLE_ERROR',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

/**
 * Tar file entry
 */
interface TarFile {
    name: string;
    content: Uint8Array;
}

/** Maximum safe tar file size (10MB) */
const MAX_TAR_SIZE = 10 * 1024 * 1024;

/** Maximum safe file count in tar archive */
const MAX_TAR_FILES = 10000;

/**
 * Parse a tar archive with bounds checking
 * @throws Error if archive is malformed or exceeds safety limits
 */
function parseTar(buffer: Uint8Array): TarFile[] {
    // Safety check: buffer size
    if (buffer.length > MAX_TAR_SIZE) {
        throw new Error(`Tar archive too large: ${buffer.length} bytes (max: ${MAX_TAR_SIZE})`);
    }

    const files: TarFile[] = [];
    let offset = 0;

    while (offset < buffer.length) {
        // Check for end of archive (two empty blocks)
        if (offset + 512 > buffer.length || buffer.slice(offset, offset + 512).every((b) => b === 0)) {
            break;
        }

        // Bounds check: ensure we have enough bytes for header
        if (offset + 512 > buffer.length) {
            throw new Error(`Malformed tar: incomplete header at offset ${offset}`);
        }

        // Parse header
        const header = buffer.slice(offset, offset + 512);
        offset += 512;

        // Extract filename (first 100 bytes, null-terminated)
        let nameEnd = 0;
        while (nameEnd < 100 && header[nameEnd] !== 0) {
            nameEnd++;
        }
        const name = new TextDecoder().decode(header.slice(0, nameEnd));

        // Validate filename
        if (name.includes('..') || name.startsWith('/')) {
            throw new Error(`Invalid tar entry name: ${name}`);
        }

        // Extract file size (bytes 124-136, octal string)
        const sizeStr = new TextDecoder().decode(header.slice(124, 136)).trim();
        const size = parseInt(sizeStr, 8) || 0;

        // Validate size
        if (size < 0 || size > MAX_TAR_SIZE) {
            throw new Error(`Invalid tar entry size: ${size}`);
        }

        // Safety check: file count limit
        if (files.length >= MAX_TAR_FILES) {
            throw new Error(`Too many files in tar archive (max: ${MAX_TAR_FILES})`);
        }

        // Bounds check: ensure we have enough bytes for content
        if (size > 0) {
            if (offset + size > buffer.length) {
                throw new Error(`Malformed tar: incomplete content for ${name}`);
            }

            const content = buffer.slice(offset, offset + size);
            if (name) {
                files.push({ name, content });
            }
        }

        // Move to next header (aligned to 512 bytes)
        offset += Math.ceil(size / 512) * 512;
    }

    return files;
}
