/**
 * Service Worker Cache Handlers
 * Handles all fetch events and caching strategies
 */

import { CACHE_NAMES } from './cache-strategies';

// Version management
const SW_VERSION = '1.0.0';
const CACHE_VERSION = `v${SW_VERSION}`;

// Cache max ages (used by cache validation)
export const API_CACHE_MAX_AGE = 30 * 60 * 1000; // 30 minutes
export const STATIC_CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// URL patterns
const PROBLEM_PATTERNS = [
    /\/smartgrind\/patterns\/.+\.md$/,
    /\/smartgrind\/solutions\/.+\.md$/,
    /\/smartgrind\/algorithms\/.+\.md$/,
];

const API_ROUTES = [/\/smartgrind\/api\//];
const AUTH_ROUTES = [/\/smartgrind\/api\/auth/];

/**
 * Adds cache timestamp headers to a response before storing
 */
export function addCacheHeaders(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set('X-SW-Cached-At', Date.now().toString());
    headers.set('X-SW-Version', SW_VERSION);
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

/**
 * Validates if a request should be handled by the service worker
 */
export function shouldHandleRequest(requestUrl: URL): boolean {
    const isHttpScheme = requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:';
    const isAuthRoute = AUTH_ROUTES.some((pattern) => pattern.test(requestUrl.pathname));
    return isHttpScheme && !isAuthRoute;
}

/**
 * Determines the appropriate handler for a request
 */
export function getRequestHandler(
    requestUrl: URL,
    request: Request
): ((_req: Request) => Promise<Response>) | null {
    const isNavigationRequest = request.mode === 'navigate';
    const isProblemFile = PROBLEM_PATTERNS.some((pattern) => pattern.test(requestUrl.pathname));

    if (isNavigationRequest) {
        return handleNavigationRequest;
    }

    if (API_ROUTES.some((pattern) => pattern.test(requestUrl.pathname))) {
        return handleAPIRequest;
    }

    if (isProblemFile) {
        return handleProblemRequest;
    }

    if (request.method !== 'GET') {
        return null;
    }

    return handleStaticRequest;
}

/**
 * Handles API requests with network-first strategy
 */
export async function handleAPIRequest(request: Request): Promise<Response> {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.status >= 300 && networkResponse.status < 400) {
            return networkResponse;
        }

        if (networkResponse.ok) {
            if (request.method === 'GET') {
                const cache = await caches.open(`${CACHE_NAMES.API}-${CACHE_VERSION}`);
                const responseWithHeaders = addCacheHeaders(networkResponse.clone());
                cache.put(request, responseWithHeaders).catch((error) => {
                    console.warn('[SW] Failed to cache API response:', error);
                });
            }
            return networkResponse;
        }

        if (networkResponse.status === 401 || networkResponse.status === 403) {
            return networkResponse;
        }

        throw new Error(`API error: ${networkResponse.status}`);
    } catch (error) {
        return handleAPIError(request, error);
    }
}

/**
 * Handles API request errors with cache fallback
 */
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

/**
 * Handles problem markdown file requests with cache-first strategy
 */
export async function handleProblemRequest(request: Request): Promise<Response> {
    const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);

    const cachedResponse = await cache.match(request, { ignoreSearch: true });
    if (cachedResponse) return serveCachedProblem(request, cachedResponse, cache);

    return fetchProblemFromNetwork(request, cache);
}

/**
 * Serves a cached problem response with background revalidation
 */
function serveCachedProblem(request: Request, cachedResponse: Response, cache: Cache): Response {
    if (request.method === 'GET') {
        fetch(request)
            .then((networkResponse) => {
                if (networkResponse.ok) {
                    const responseWithHeaders = addCacheHeaders(networkResponse);
                    cache.put(request, responseWithHeaders).catch((error) => {
                        console.warn('[SW] Background revalidation failed:', error);
                    });
                }
            })
            .catch((error) => {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.log(
                        '[SW] Background revalidation failed (likely offline):',
                        error.message
                    );
                }
            });
    }

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
    } catch {
        return new Response(
            '# Offline\n\nThis problem is not available offline. Please connect to the internet to access this content.',
            { status: 503, headers: { 'Content-Type': 'text/markdown', 'X-SW-Offline': 'true' } }
        );
    }
}

/**
 * Handles static asset requests with stale-while-revalidate strategy
 */
export async function handleStaticRequest(request: Request): Promise<Response> {
    const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
    const cachedResponse = await cache.match(request);

    const networkFetch = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
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
 * Revalidates a static asset in the background
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
 * Handles navigation requests (HTML pages) with network-first strategy
 */
export async function handleNavigationRequest(request: Request): Promise<Response> {
    const requestUrl = new URL(request.url);

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);
            const responseWithHeaders = addCacheHeaders(networkResponse.clone());
            cache.put(request, responseWithHeaders).catch((error) => {
                console.warn('[SW] Failed to cache navigation response:', error);
            });
        }

        return networkResponse;
    } catch {
        const cache = await caches.open(`${CACHE_NAMES.STATIC}-${CACHE_VERSION}`);

        let cachedResponse = await cache.match(request);

        if (!cachedResponse) {
            const mainPageUrl = `${requestUrl.origin}${requestUrl.pathname.split('/').slice(0, 3).join('/')}/`;
            cachedResponse = await cache.match(mainPageUrl);

            if (!cachedResponse) {
                const scopeRoot = (self as unknown as ServiceWorkerGlobalScope).registration.scope;
                cachedResponse = await cache.match(scopeRoot);
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

        return createOfflineFallbackPage(requestUrl);
    }
}

/**
 * Creates an offline fallback page
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

// Type declaration for self
declare const self: ServiceWorkerGlobalScope;
