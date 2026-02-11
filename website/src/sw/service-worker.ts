/// <reference lib="webworker" />

// SmartGrind Service Worker
// Provides offline access to problems and background sync for user progress

import { CACHE_NAMES } from './cache-strategies';
import { OfflineManager } from './offline-manager';
import { BackgroundSyncManager } from './background-sync';
import { OperationQueue } from './operation-queue';

declare const self: ServiceWorkerGlobalScope;

// Version for cache busting - update this when deploying new versions
const SW_VERSION = '1.0.0';
const CACHE_VERSION = `${SW_VERSION}-${new Date().toISOString().split('T')[0]}`;

// Initialize managers
const offlineManager = new OfflineManager();
const backgroundSync = new BackgroundSyncManager();
const operationQueue = new OperationQueue();

// Static assets to cache on install
const STATIC_ASSETS = [
    '/smartgrind/',
    '/smartgrind/index.html',
    '/smartgrind/src/styles.css',
    '/smartgrind/logo.svg',
    '/smartgrind/manifest.json',
    // Core JS modules will be cached dynamically based on import map
];

// Problem content patterns to cache
const PROBLEM_PATTERNS = [/\/smartgrind\/patterns\/.+\.md$/, /\/smartgrind\/solutions\/.+\.md$/];

// API routes that should use network-first strategy
const API_ROUTES = [/\/smartgrind\/api\//];

// Auth routes that should bypass service worker (OAuth redirects)
const AUTH_ROUTES = [/\/smartgrind\/api\/auth/];

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        (async () => {
            try {
                // Pre-cache static assets
                const staticCache = await caches.open(CACHE_NAMES.STATIC);
                await staticCache.addAll(STATIC_ASSETS);

                // Pre-cache problem index/metadata
                await offlineManager.preCacheProblemIndex();

                // Skip waiting to activate immediately
                await self.skipWaiting();
            } catch (error) {
                console.error('[SW] Install failed:', error);
                throw error;
            }
        })()
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(
        (async () => {
            try {
                // Clean up old caches
                const cacheWhitelist = Object.values(CACHE_NAMES).map(
                    (name) => `${name}-${CACHE_VERSION}`
                );
                const allCaches = await caches.keys();

                const deletionPromises = allCaches
                    .filter((cacheName) => !cacheWhitelist.includes(cacheName))
                    .map((oldCache) => caches.delete(oldCache));

                await Promise.all(deletionPromises);

                // Claim clients immediately
                await self.clients.claim();

                // Notify all clients that SW is active
                const clients = await self.clients.matchAll({ type: 'window' });
                clients.forEach((client) => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        version: SW_VERSION,
                    });
                });
            } catch (error) {
                console.error('[SW] Activation failed:', error);
                throw error;
            }
        })()
    );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event: FetchEvent) => {
    const { request } = event;
    const requestUrl = new URL(request.url);

    // Skip auth routes - let browser handle OAuth redirects naturally
    if (AUTH_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))) {
        return;
    }

    // Skip non-GET requests for caching (except for API calls handled separately)
    if (
        request.method !== 'GET' &&
        !API_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))
    ) {
        return;
    }

    // Handle API requests
    if (API_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))) {
        event.respondWith(handleAPIRequest(request));
        return;
    }

    // Handle problem markdown files
    if (PROBLEM_PATTERNS.some((pattern) => pattern.test(requestUrl.pathname))) {
        event.respondWith(handleProblemRequest(request));
        return;
    }

    // Handle static assets (JS, CSS, images, fonts)
    event.respondWith(handleStaticRequest(request));
});

// Handle API requests with network-first strategy and offline fallback
async function handleAPIRequest(request: Request): Promise<Response> {
    try {
        // Try network first
        const networkResponse = await fetch(request);

        // Handle redirect responses - don't cache, return as-is
        if (networkResponse.status >= 300 && networkResponse.status < 400) {
            return networkResponse;
        }

        if (networkResponse.ok) {
            // Cache successful API responses
            const cache = await caches.open(CACHE_NAMES.API);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        }

        // For auth errors (401, 403), don't cache - let the client handle them
        if (networkResponse.status === 401 || networkResponse.status === 403) {
            return networkResponse;
        }

        // For other errors, try cache fallback
        throw new Error(`API error: ${networkResponse.status}`);
    } catch (error) {
        // Check if this is actually a network error (TypeError) or just a server error
        const isNetworkError = error instanceof TypeError;

        // Try cache for GET requests
        if (request.method === 'GET') {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                // Add header to indicate cached response
                const headers = new Headers(cachedResponse.headers);
                headers.set('X-SW-Cache', 'true');
                if (isNetworkError) {
                    headers.set('X-SW-Offline', 'true');
                }

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
                    headers: {
                        'Content-Type': 'application/json',
                        'X-SW-Offline': 'true',
                    },
                }
            );
        }

        // Re-throw other errors to let the client handle them
        throw error;
    }
}

// Handle problem markdown requests with cache-first strategy
async function handleProblemRequest(request: Request): Promise<Response> {
    const cache = await caches.open(CACHE_NAMES.PROBLEMS);

    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        // Revalidate in background (will fail silently if offline)
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse.ok) {
                    cache.put(request, networkResponse);
                }
            })
            .catch(() => {
                // Ignore background revalidation errors (offline or network issues)
            });

        return cachedResponse;
    }

    // Not in cache, try network
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (_error) {
        // Return offline fallback
        return new Response(
            '# Offline\n\nThis problem is not available offline. Please connect to the internet to access this content.',
            {
                status: 503,
                headers: {
                    'Content-Type': 'text/markdown',
                    'X-SW-Offline': 'true',
                },
            }
        );
    }
}

// Handle static assets with stale-while-revalidate strategy
async function handleStaticRequest(request: Request): Promise<Response> {
    const cache = await caches.open(CACHE_NAMES.STATIC);

    // Try cache first
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
            // Network failed, will use cache if available
            return null;
        });

    if (cachedResponse) {
        // Return cached version immediately, revalidate in background
        networkFetch.then((networkResponse) => {
            if (networkResponse) {
                // Notify clients about update if content changed
                self.clients.matchAll().then((matchedClients) => {
                    matchedClients.forEach((client) => {
                        client.postMessage({
                            type: 'ASSET_UPDATED',
                            url: request.url,
                        });
                    });
                });
            }
        });

        return cachedResponse;
    }

    // Not in cache, wait for network
    const networkResponse = await networkFetch;
    if (networkResponse) {
        return networkResponse;
    }

    // Both cache and network failed
    return new Response('Offline - Resource not available', {
        status: 503,
        statusText: 'Service Unavailable',
    });
}

// Message event - handle communication from main app
self.addEventListener('message', (event: ExtendableMessageEvent) => {
    const { data: messageData } = event;

    if (!messageData || !messageData.type) return;

    switch (messageData.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'CACHE_PROBLEMS':
            // Pre-cache specific problems
            if (messageData.problemUrls) {
                event.waitUntil(offlineManager.cacheProblems(messageData.problemUrls));
            }
            break;

        case 'SYNC_OPERATIONS':
            // Queue operations for background sync
            if (messageData.operations) {
                event.waitUntil(operationQueue.addOperations(messageData.operations));
            }
            break;

        case 'GET_SYNC_STATUS':
            // Return current sync status
            event.waitUntil(
                (async () => {
                    const status = await operationQueue.getStatus();
                    if (event.source) {
                        event.source.postMessage({
                            type: 'SYNC_STATUS',
                            status,
                        });
                    }
                })()
            );
            break;

        case 'FORCE_SYNC':
            // Force immediate sync of pending operations
            event.waitUntil(
                (async () => {
                    const result = await backgroundSync.forceSync();
                    if (event.source) {
                        event.source.postMessage({
                            type: 'FORCE_SYNC_RESULT',
                            result,
                        });
                    }
                })()
            );
            break;

        case 'CLEAR_ALL_CACHES':
            // Clear all caches (for debugging/logout)
            event.waitUntil(
                (async () => {
                    const allCaches = await caches.keys();
                    await Promise.all(allCaches.map((name) => caches.delete(name)));
                    if (event.source) {
                        event.source.postMessage({
                            type: 'CACHES_CLEARED',
                        });
                    }
                })()
            );
            break;

        default:
        // Unknown message type
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
