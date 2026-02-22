/// <reference lib="webworker" />

// SmartGrind Service Worker
// Provides offline access to problems and background sync for user progress

import { CACHE_NAMES } from './cache-strategies';
import { OfflineManager } from './offline-manager';
import { BackgroundSyncManager } from './background-sync';
import { OperationQueue } from './operation-queue';

declare const self: ServiceWorkerGlobalScope;

// Version for cache busting - update this when deploying new versions
const SW_VERSION = '1.0.2';
const CACHE_VERSION = `v${SW_VERSION}`;

// Initialize managers
const offlineManager = new OfflineManager();
const backgroundSync = new BackgroundSyncManager();
const operationQueue = new OperationQueue();

// Static assets to cache on install
// Note: Only cache files that are known to exist at build time
// CSS and JS are bundled with hashes and cached dynamically via CACHE_ASSETS message
// Don't cache any static assets during install - they may not exist or may redirect
// All assets will be cached dynamically via CACHE_ASSETS message after registration
const STATIC_ASSETS: string[] = [];

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
                // Pre-cache static assets only if there are any
                if (STATIC_ASSETS.length > 0) {
                    const staticCache = await caches.open(CACHE_NAMES.STATIC);
                    await staticCache.addAll(STATIC_ASSETS);
                }

                // Pre-cache problem index/metadata
                await offlineManager.preCacheProblemIndex();

                // Skip waiting to activate immediately
                await self.skipWaiting();
            } catch {
                throw new Error('Service worker install failed');
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

                const deletionPromises = allCaches
                    .filter((cacheName) => !cacheWhitelist.includes(cacheName))
                    .map((oldCache) => caches.delete(oldCache));

                await Promise.all(deletionPromises);

                // Small delay to ensure browser has processed the activation
                // This helps prevent race conditions with client-side detection
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
                checkAndDownloadBundle().catch(() => {
                    // Bundle download failed, will retry later
                });
            } catch {
                throw new Error('Service worker activation failed');
            }
        })()
    );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event: FetchEvent) => {
    const { request } = event;
    const requestUrl = new URL(request.url);

    // Skip non-http/https schemes (e.g., chrome-extension, data, blob)
    // These cannot be cached by the Cache API
    if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
        return;
    }

    // Skip auth routes - let browser handle OAuth redirects naturally
    if (AUTH_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))) {
        return;
    }

    // Skip non-GET requests for caching (except for API calls and HEAD requests for problems)
    const isHeadForProblem =
        request.method === 'HEAD' && PROBLEM_PATTERNS.some((p) => p.test(requestUrl.pathname));
    if (
        request.method !== 'GET' &&
        !isHeadForProblem &&
        !API_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))
    ) {
        return;
    }

    // Check if this is a problem file request
    const isProblemFile = PROBLEM_PATTERNS.some((pattern) => {
        return pattern.test(requestUrl.pathname);
    });

    // Handle API requests
    if (API_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))) {
        event.respondWith(handleAPIRequest(request));
        return;
    }

    // Handle problem markdown files
    if (isProblemFile) {
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
            // Only cache GET requests (Cache API doesn't support POST/PUT/DELETE)
            if (request.method === 'GET') {
                const cache = await caches.open(`${CACHE_NAMES.API}-${CACHE_VERSION}`);
                cache.put(request, networkResponse.clone());
            }
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
            const cache = await caches.open(`${CACHE_NAMES.API}-${CACHE_VERSION}`);
            const cachedResponse = await cache.match(request);
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
                    message:
                        'You are currently offline. Data will sync when connection is restored.',
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
    const cacheName = `${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`;
    const cache = await caches.open(cacheName);

    // Try cache first
    const cachedResponse = await cache.match(request, { ignoreSearch: true });
    if (cachedResponse) {
        // Revalidate in background (will fail silently if offline)
        if (request.method === 'GET') {
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse.ok) {
                        cache.put(request, networkResponse);
                    }
                })
                .catch(() => {
                    // Ignore background revalidation errors
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

    // Not in cache, try network
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch {
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
    const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);

    // Try cache first
    const cachedResponse = await cache.match(request);

    // Always try to fetch from network for revalidation
    const networkFetch = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                // Cache successful responses
                cache.put(request, networkResponse.clone());
                return networkResponse;
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

// ... (rest of imports and setup)

// Helper to send reply via message channel or source
const sendReply = (event: ExtendableMessageEvent, message: unknown) => {
    if (event.ports?.[0]) {
        event.ports[0].postMessage(message);
    } else if (event.source) {
        event.source.postMessage(message);
    }
};

// Message event - handle communication from main app
self.addEventListener('message', (event: ExtendableMessageEvent) => {
    const { data: messageData } = event;

    if (!messageData || !messageData.type) return;

    switch (messageData.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'CACHE_ASSETS':
            if (messageData.assets && Array.isArray(messageData.assets)) {
                event.waitUntil(
                    (async () => {
                        const cache = await caches.open(CACHE_NAMES.STATIC);
                        await cache.addAll(messageData.assets);
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
            if (messageData.operations) {
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
                backgroundSync.checkAndSync().catch(() => {
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
    backgroundSync.checkAndSync().catch(() => {
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
 * Store state in IndexedDB
 */
async function getStateFromIDB<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('smartgrind-offline', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('bundle-state')) {
                resolve(null);
                return;
            }
            const transaction = db.transaction('bundle-state', 'readonly');
            const store = transaction.objectStore('bundle-state');
            const getRequest = store.get(key);

            getRequest.onsuccess = () => resolve(getRequest.result?.value || null);
            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('bundle-state')) {
                db.createObjectStore('bundle-state', { keyPath: 'key' });
            }
        };
    });
}

/**
 * Save state to IndexedDB
 */
async function saveStateToIDB<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('smartgrind-offline', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction('bundle-state', 'readwrite');
            const store = transaction.objectStore('bundle-state');
            store.put({ key, value });

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('bundle-state')) {
                db.createObjectStore('bundle-state', { keyPath: 'key' });
            }
        };
    });
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
 * Check if bundle needs to be downloaded and download it in background
 * This is called automatically when SW activates
 */
async function checkAndDownloadBundle(): Promise<void> {
    // Skip in development mode
    if (isDev) {
        return;
    }

    try {
        // Check if we already have a cached bundle
        const currentState = await getBundleStatus();

        // Fetch the manifest to check version
        const manifestResponse = await fetch(BUNDLE_MANIFEST_URL).catch(() => {
            return null;
        });

        if (!manifestResponse || !manifestResponse.ok) {
            return;
        }

        const manifest = await manifestResponse.json();
        const remoteVersion = manifest.version;

        // Check if we need to download (no cache or new version)
        if (currentState.status === 'complete' && currentState.bundleVersion === remoteVersion) {
            return;
        }

        // Download the bundle
        await downloadAndExtractBundle();
    } catch {
        throw new Error('Bundle download failed');
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
            `[SW] Compressed bundle downloaded and extracted successfully: ${state.extractedFiles} files`
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

/**
 * Parse a tar archive
 */
function parseTar(buffer: Uint8Array): TarFile[] {
    const files: TarFile[] = [];
    let offset = 0;

    while (offset < buffer.length - 512) {
        // Check for end of archive (two empty blocks)
        if (buffer.slice(offset, offset + 512).every((b) => b === 0)) {
            break;
        }

        // Parse header
        const header = buffer.slice(offset, offset + 512);

        // Extract filename (first 100 bytes, null-terminated)
        let nameEnd = 0;
        while (nameEnd < 100 && header[nameEnd] !== 0) {
            nameEnd++;
        }
        const name = new TextDecoder().decode(header.slice(0, nameEnd));

        // Extract file size (bytes 124-136, octal string)
        const sizeStr = new TextDecoder().decode(header.slice(124, 136)).trim();
        const size = parseInt(sizeStr, 8) || 0;

        // Skip to content
        offset += 512;

        // Extract content
        if (size > 0 && name) {
            const content = buffer.slice(offset, offset + size);
            files.push({ name, content });
        }

        // Move to next header (aligned to 512 bytes)
        offset += Math.ceil(size / 512) * 512;
    }

    return files;
}
