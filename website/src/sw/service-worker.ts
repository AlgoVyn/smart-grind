/// <reference lib="webworker" />

/**
 * SmartGrind Service Worker
 * Provides offline access to problems and background sync for user progress
 * @module sw/service-worker
 */

import { CACHE_NAMES } from './cache-strategies.js';
import { OfflineManager } from './offline-manager.js';
import { BackgroundSyncManager } from './background-sync.js';
import { OperationQueue } from './operation-queue.js';
import { BundleManager } from './bundle/index.js';
import { isValidSWClientMessage } from '../types/sw-messages.js';
import {
    openDatabase,
    safeStore,
    IDBOperationError,
    IDBErrorType,
} from '../utils/indexeddb-helper.js';

declare const self: ServiceWorkerGlobalScope;

// ============================================================================
// VERSION MANAGEMENT
// ============================================================================

/** Service Worker Version - replaced at build time */
const SW_VERSION: string = '__SW_VERSION_PLACEHOLDER__';
const CACHE_VERSION = `v${SW_VERSION}`;

// Maximum age for cached API responses (30 minutes)
// const API_CACHE_MAX_AGE = 30 * 60 * 1000; // Reserved for future cache age validation

// Maximum age for cached static assets (24 hours)
// const STATIC_CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // Reserved for future cache age validation

// ============================================================================
// CACHE INVENTORY
// ============================================================================

interface CacheInventory {
    version: string;
    cachedAt: number;
    assets: string[];
}

const INVENTORY_KEY = 'smartgrind-cache-inventory';
const INVENTORY_DB_NAME = 'smartgrind-sw-inventory';

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

// async function getCacheInventory(): Promise<CacheInventory | null> {
//     try {
//         const db = await openInventoryDB();
//         try {
//             return await safeRetrieve<CacheInventory>(db, 'inventory', INVENTORY_KEY);
//         } finally {
//             db.close();
//         }
//     } catch (error) {
//         console.warn('[SW] Failed to get cache inventory:', error);
//         return null;
//     }
// }

async function openInventoryDB(): Promise<IDBDatabase> {
    return openDatabase(INVENTORY_DB_NAME, 1, (db) => {
        if (!db.objectStoreNames.contains('inventory')) {
            db.createObjectStore('inventory', { keyPath: 'key' });
        }
    });
}

// ============================================================================
// MANAGERS
// ============================================================================

const offlineManager = new OfflineManager();
const backgroundSync = new BackgroundSyncManager();
const operationQueue = new OperationQueue();
const bundleManager = new BundleManager(SW_VERSION);

// ============================================================================
// CACHE HELPERS
// ============================================================================

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

// ============================================================================
// URL PATTERNS
// ============================================================================

const PROBLEM_PATTERNS = [
    /\/smartgrind\/patterns\/.+\.md$/,
    /\/smartgrind\/solutions\/.+\.md$/,
    /\/smartgrind\/algorithms\/.+\.md$/,
];

const FLASHCARD_PATTERNS = [/\/flashcards\/.+\.md$/];
const API_ROUTES = [/\/smartgrind\/api\//];
const AUTH_ROUTES = [/\/smartgrind\/api\/auth/];

const CDN_DOMAINS = [
    'cdn.jsdelivr.net',
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
];

// ============================================================================
// REQUEST HANDLER FACTORY
// ============================================================================

const shouldHandleRequest = (requestUrl: URL): boolean => {
    const isHttpScheme = requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:';
    const isAuthRoute = AUTH_ROUTES.some((pattern) => pattern.test(requestUrl.pathname));
    const isCDN = CDN_DOMAINS.some((domain) => requestUrl.hostname === domain);
    return isHttpScheme && !isAuthRoute && !isCDN;
};

const getRequestHandler = (requestUrl: URL, request: Request) => {
    const isNavigationRequest = request.mode === 'navigate';
    const isProblemFile = PROBLEM_PATTERNS.some((pattern) => pattern.test(requestUrl.pathname));
    const isFlashcardFile = FLASHCARD_PATTERNS.some((pattern) => pattern.test(requestUrl.pathname));

    if (isNavigationRequest) return handleNavigationRequest;
    if (API_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))) return handleAPIRequest;
    if (isProblemFile || isFlashcardFile) return handleProblemRequest;
    if (request.method !== 'GET') return null;
    return handleStaticRequest;
};

// ============================================================================
// HANDLERS
// ============================================================================

async function handleAPIRequest(request: Request): Promise<Response> {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.status >= 300 && networkResponse.status < 400) {
            return networkResponse;
        }
        if (networkResponse.ok && request.method === 'GET') {
            const cache = await caches.open(`${CACHE_NAMES.API}-${CACHE_VERSION}`);
            const responseWithHeaders = addCacheHeaders(networkResponse.clone());
            cache.put(request, responseWithHeaders).catch(console.warn);
        }
        if (networkResponse.status === 401 || networkResponse.status === 403) {
            return networkResponse;
        }
        if (!networkResponse.ok) throw new Error(`API error: ${networkResponse.status}`);
        return networkResponse;
    } catch (error) {
        return handleAPIError(request, error);
    }
}

async function handleAPIError(request: Request, error: unknown): Promise<Response> {
    const isNetworkError = error instanceof TypeError;
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

async function handleProblemRequest(request: Request): Promise<Response> {
    const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);
    const cachedResponse = await cache.match(request, { ignoreSearch: true });
    if (cachedResponse) return serveCachedProblem(request, cachedResponse, cache);
    return fetchProblemFromNetwork(request, cache);
}

function serveCachedProblem(request: Request, cachedResponse: Response, cache: Cache): Response {
    if (request.method === 'GET') {
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse.ok) {
                    cache.put(request, addCacheHeaders(networkResponse)).catch(() => {});
                }
            })
            .catch(() => {});
    }
    return cachedResponse;
}

async function fetchProblemFromNetwork(request: Request, cache: Cache): Promise<Response> {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone()).catch(console.warn);
        }
        return networkResponse;
    } catch (error) {
        return new Response(
            '# Offline\n\nThis problem is not available offline. Please connect to the internet.',
            { status: 503, headers: { 'Content-Type': 'text/markdown', 'X-SW-Offline': 'true' } }
        );
    }
}

async function handleStaticRequest(request: Request): Promise<Response> {
    const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
    const cachedResponse = await cache.match(request);

    const networkFetch = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, addCacheHeaders(networkResponse.clone())).catch(() => {});
            }
            return networkResponse;
        })
        .catch(() => null);

    if (cachedResponse) {
        networkFetch
            .then((networkResponse) => {
                if (networkResponse) {
                    self.clients
                        .matchAll()
                        .then((clients) => {
                            clients.forEach((client) => {
                                client.postMessage({ type: 'ASSET_UPDATED', url: request.url });
                            });
                        })
                        .catch(() => {});
                }
            })
            .catch(() => {});
        return cachedResponse;
    }

    const networkResponse = await networkFetch;
    if (networkResponse) return networkResponse;

    return new Response('Offline - Resource not available', {
        status: 503,
        statusText: 'Service Unavailable',
    });
}

async function handleNavigationRequest(request: Request): Promise<Response> {
    const requestUrl = new URL(request.url);
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
            cache.put(request, addCacheHeaders(networkResponse.clone())).catch(console.warn);
        }
        return networkResponse;
    } catch (error) {
        const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
        let cachedResponse = await cache.match(request);

        if (!cachedResponse) {
            const mainPageUrl = `${requestUrl.origin}${requestUrl.pathname.split('/').slice(0, 3).join('/')}/`;
            cachedResponse = await cache.match(mainPageUrl);
            if (!cachedResponse) {
                cachedResponse = await cache.match(self.registration.scope);
            }
        }

        if (cachedResponse) {
            const headers = new Headers(cachedResponse.headers);
            headers.set('X-SW-Offline', 'true');
            headers.set('X-SW-Cache', 'true');
            return new Response(cachedResponse.body, {
                status: cachedResponse.status,
                statusText: cachedResponse.statusText,
                headers,
            });
        }
        return createOfflineFallbackPage();
    }
}

function createOfflineFallbackPage(): Response {
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
        .container { text-align: center; max-width: 500px; }
        .icon { font-size: 64px; margin-bottom: 24px; }
        h1 { font-size: 28px; margin-bottom: 16px; color: #fff; }
        p { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #a0a0a0; }
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
        .retry-btn:hover { background: #4338ca; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📡</div>
        <h1>You're Offline</h1>
        <p>Please check your connection and try again.</p>
        <button class="retry-btn" onclick="location.reload()">Try Again</button>
    </div>
    <script>
        window.addEventListener('online', () => setTimeout(() => location.reload(), 500));
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

// ============================================================================
// EVENT LISTENERS
// ============================================================================

self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            await offlineManager.preCacheProblemIndex();
            await self.skipWaiting();
        })()
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheWhitelist = Object.values(CACHE_NAMES).map(
                (name) => `${name}-${CACHE_VERSION}`
            );
            const allCaches = await caches.keys();

            await Promise.all(
                allCaches
                    .filter(
                        (cacheName) =>
                            !cacheWhitelist.includes(cacheName) &&
                            (cacheName.includes('smartgrind') || cacheName.includes('v1.'))
                    )
                    .map((cacheName) => caches.delete(cacheName))
            );

            await self.clients.claim();

            const clients = await self.clients.matchAll({ type: 'window' });
            clients.forEach((client) => {
                client.postMessage({
                    type: 'SW_ACTIVATED',
                    version: SW_VERSION,
                    controlling: true,
                });
                client.postMessage({ type: 'CLEAR_RELOAD_FLAG' });
            });

            await bundleManager.checkAndDownload();
            bundleManager.scheduleChecks();

            await saveCacheInventory({
                version: SW_VERSION,
                cachedAt: Date.now(),
                assets: [],
            });
        })()
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const requestUrl = new URL(request.url);

    if (!shouldHandleRequest(requestUrl)) return;

    const handler = getRequestHandler(requestUrl, request);
    if (!handler) return;

    event.respondWith(handler(request));
});

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

const sendReply = (event: ExtendableMessageEvent, message: unknown): void => {
    if (event.ports?.[0]) {
        event.ports[0].postMessage(message);
    } else if (event.source) {
        event.source.postMessage(message);
    }
};

self.addEventListener('message', (event: ExtendableMessageEvent) => {
    const data = event.data;
    if (!data || typeof data !== 'object' || !isValidSWClientMessage(data)) return;

    switch (data.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        case 'CACHE_ASSETS':
            if (data.assets && Array.isArray(data.assets)) {
                event.waitUntil(
                    caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`).then((cache) =>
                        Promise.allSettled(
                            data.assets.map((assetUrl: string) =>
                                fetch(assetUrl).then((r) => {
                                    if (r.ok) return cache.put(assetUrl, r);
                                    return undefined;
                                })
                            )
                        )
                    )
                );
            }
            break;
        case 'CACHE_PROBLEMS':
            if (data.problemUrls) {
                event.waitUntil(offlineManager.cacheProblems(data.problemUrls));
            }
            break;
        case 'SYNC_OPERATIONS':
            if (data.operations && Array.isArray(data.operations)) {
                event.waitUntil(
                    operationQueue.addOperations(data.operations).then((ids) => {
                        sendReply(event, { type: 'SYNC_QUEUED', operationId: ids?.[0] ?? null });
                    })
                );
            }
            break;
        case 'GET_SYNC_STATUS':
            event.waitUntil(
                operationQueue.getStatus().then((status) => {
                    sendReply(event, { type: 'SYNC_STATUS', status });
                })
            );
            break;
        case 'FORCE_SYNC':
            event.waitUntil(
                backgroundSync.forceSync().then((result) => {
                    sendReply(event, result);
                })
            );
            break;
        case 'REQUEST_SYNC':
            if (data.tag) {
                event.waitUntil(backgroundSync.performSync(data.tag));
            }
            break;
        case 'CLEAR_ALL_CACHES':
            event.waitUntil(
                caches
                    .keys()
                    .then((keys) => Promise.all(keys.map((name) => caches.delete(name))))
                    .then(() => sendReply(event, { type: 'CACHES_CLEARED' }))
            );
            break;
        case 'CLIENT_READY':
            event.waitUntil(
                self.clients
                    .matchAll({ type: 'window', includeUncontrolled: true })
                    .then((clients) => {
                        const sourceClient = event.source as Client | undefined;
                        if (sourceClient) {
                            const isControlled = clients.some(
                                (c) => c.id === sourceClient.id && 'frameType' in c
                            );
                            sourceClient.postMessage({
                                type: 'CLIENT_CONTROL_STATUS',
                                controlled: isControlled,
                                version: SW_VERSION,
                            });
                        }
                    })
            );
            break;
        case 'NETWORK_RESTORED':
            event.waitUntil(backgroundSync.checkAndSync().catch(console.warn));
            break;
        case 'DOWNLOAD_BUNDLE':
            event.waitUntil(bundleManager.handleDownloadMessage(event));
            break;
        case 'GET_BUNDLE_STATUS':
            event.waitUntil(
                bundleManager.getStatus().then((status) => {
                    sendReply(event, { type: 'BUNDLE_STATUS', status });
                })
            );
            break;
        case 'CHECK_OFFLINE_RELOAD':
            event.waitUntil(
                checkOfflineReloadStatus(data.url).then((status) => {
                    sendReply(event, { type: 'OFFLINE_RELOAD_STATUS', ...status });
                })
            );
            break;
        case 'GET_OFFLINE_STATUS':
            event.waitUntil(
                getOfflineCapabilityStatus().then((status) => {
                    sendReply(event, { type: 'OFFLINE_CAPABILITY', ...status });
                })
            );
            break;
    }
});

// ============================================================================
// SYNC & PERIODIC SYNC
// ============================================================================

self.addEventListener('sync', (event: Event) => {
    const syncEvent = event as Event & { tag: string; waitUntil(_fn: Promise<void>): void };
    if (syncEvent.tag === 'sync-user-progress') {
        syncEvent.waitUntil(backgroundSync.syncUserProgress());
    } else if (syncEvent.tag === 'sync-custom-problems') {
        syncEvent.waitUntil(backgroundSync.syncCustomProblems());
    }
});

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
// ============================================================================
// PUSH NOTIFICATIONS
// ============================================================================

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
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close();
    event.waitUntil(self.clients.openWindow('/smartgrind/'));
});

// ============================================================================
// ONLINE/OFFLINE EVENTS
// ============================================================================

self.addEventListener('online', () => {
    backgroundSync.checkAndSync().catch(console.warn);
});

// ============================================================================
// OFFLINE CAPABILITY CHECKS
// ============================================================================

interface OfflineReloadStatus {
    canReload: boolean;
    pageCached: boolean;
    assetsCached: boolean;
    bundleReady: boolean;
    cachedItemsCount: number;
}

async function checkOfflineReloadStatus(url?: string): Promise<OfflineReloadStatus> {
    const checkUrl = url || self.registration.scope;
    const staticCache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
    const problemsCache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);

    let pageCached = false;
    try {
        const pageResponse = await staticCache.match(checkUrl);
        pageCached = !!pageResponse;
        if (!pageCached) {
            const urlObj = new URL(checkUrl);
            const indexUrl = `${urlObj.origin}${urlObj.pathname}/index.html`;
            pageCached = !!(await staticCache.match(indexUrl));
        }
    } catch {
        pageCached = false;
    }

    const staticKeys = await staticCache.keys();
    const assetsCached = staticKeys.length > 0;

    const bundleStatus = await bundleManager.getStatus();
    const bundleReady = bundleStatus.status === 'complete';

    const problemsKeys = await problemsCache.keys();
    const cachedItemsCount = staticKeys.length + problemsKeys.length;

    return {
        canReload: pageCached && assetsCached,
        pageCached,
        assetsCached,
        bundleReady,
        cachedItemsCount,
    };
}

interface OfflineCapabilityStatus {
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
}

async function getOfflineCapabilityStatus(): Promise<OfflineCapabilityStatus> {
    const staticCache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
    const problemsCache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);
    const apiCache = await caches.open(`${CACHE_NAMES.API}-${CACHE_VERSION}`);

    const staticKeys = await staticCache.keys();
    const problemsKeys = await problemsCache.keys();
    const apiKeys = await apiCache.keys();

    const bundleStatus = await bundleManager.getStatus();

    const result: OfflineCapabilityStatus = {
        isOffline: !navigator.onLine,
        canFunctionOffline: staticKeys.length > 0,
        cacheStatus: {
            staticAssets: staticKeys.length,
            problems: problemsKeys.length,
            apiResponses: apiKeys.length,
            bundleFiles: bundleStatus.status === 'complete' ? bundleStatus.totalFiles : 0,
        },
    };

    if (bundleStatus.downloadedAt) result.lastBundleDownload = bundleStatus.downloadedAt;
    if (bundleStatus.bundleVersion) result.bundleVersion = bundleStatus.bundleVersion;

    return result;
}
