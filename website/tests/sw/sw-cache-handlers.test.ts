/**
 * @jest-environment jsdom
 */

import {
    shouldHandleRequest,
    getRequestHandler,
    handleAPIRequest,
    handleProblemRequest,
    handleStaticRequest,
    handleNavigationRequest,
    API_CACHE_MAX_AGE,
    STATIC_CACHE_MAX_AGE,
} from '../../src/sw/sw-cache-handlers';

describe('SW Cache Handlers', () => {
    let mockCacheStorage: Map<string, Cache>;
    let mockFetch: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockFetch = jest.fn();
        global.fetch = mockFetch;

        mockCacheStorage = new Map();

        // Mock caches API
        global.caches = {
            open: jest.fn().mockImplementation((name: string) => {
                if (!mockCacheStorage.has(name)) {
                    const mockCache = {
                        put: jest.fn().mockResolvedValue(undefined),
                        match: jest.fn().mockResolvedValue(undefined),
                        delete: jest.fn().mockResolvedValue(true),
                        keys: jest.fn().mockResolvedValue([]),
                        add: jest.fn().mockResolvedValue(undefined),
                        addAll: jest.fn().mockResolvedValue(undefined),
                    } as unknown as Cache;
                    mockCacheStorage.set(name, mockCache);
                }
                return Promise.resolve(mockCacheStorage.get(name));
            }),
            match: jest.fn().mockResolvedValue(undefined),
            has: jest.fn().mockResolvedValue(false),
            delete: jest.fn().mockResolvedValue(true),
            keys: jest.fn().mockResolvedValue([]),
        } as unknown as CacheStorage;

        // Mock clients
        (global.self as unknown as ServiceWorkerGlobalScope).clients = {
            matchAll: jest.fn().mockResolvedValue([]),
            claim: jest.fn().mockResolvedValue(undefined),
            get: jest.fn().mockResolvedValue(null),
        };

        (global.self as unknown as ServiceWorkerGlobalScope).registration = {
            scope: '/smartgrind/',
        } as unknown as ServiceWorkerRegistration;
    });

    describe('shouldHandleRequest', () => {
        it('should handle HTTP requests', () => {
            const url = new URL('http://example.com/smartgrind/test');
            expect(shouldHandleRequest(url)).toBe(true);
        });

        it('should handle HTTPS requests', () => {
            const url = new URL('https://example.com/smartgrind/test');
            expect(shouldHandleRequest(url)).toBe(true);
        });

        it('should not handle non-HTTP schemes', () => {
            const url = new URL('chrome-extension://extension-id/test');
            expect(shouldHandleRequest(url)).toBe(false);
        });

        it('should not handle auth routes', () => {
            const url = new URL('https://example.com/smartgrind/api/auth/login');
            expect(shouldHandleRequest(url)).toBe(false);
        });

        it('should handle non-auth API routes', () => {
            const url = new URL('https://example.com/smartgrind/api/user');
            expect(shouldHandleRequest(url)).toBe(true);
        });
    });

    describe('getRequestHandler', () => {
        it('should return API handler for API routes', () => {
            const request = new Request('https://example.com/smartgrind/api/user');
            const url = new URL(request.url);

            const handler = getRequestHandler(url, request);
            expect(handler).toBeDefined();
        });

        it('should return problem handler for problem markdown files', () => {
            const request = new Request('https://example.com/smartgrind/patterns/two-sum.md');
            const url = new URL(request.url);

            const handler = getRequestHandler(url, request);
            expect(handler).toBeDefined();
        });

        it('should return handler for solution files', () => {
            const request = new Request('https://example.com/smartgrind/solutions/two-sum-solution.md');
            const url = new URL(request.url);

            const handler = getRequestHandler(url, request);
            expect(handler).toBeDefined();
        });

        it('should return handler for algorithm files', () => {
            const request = new Request('https://example.com/smartgrind/algorithms/binary-search.md');
            const url = new URL(request.url);

            const handler = getRequestHandler(url, request);
            expect(handler).toBeDefined();
        });

        it('should return handler for GET requests', () => {
            const request = new Request('https://example.com/smartgrind/style.css');
            const url = new URL(request.url);

            const handler = getRequestHandler(url, request);
            expect(handler).toBeDefined();
        });
    });

    describe('handleAPIRequest', () => {
        it('should return network response on success', async () => {
            const mockResponse = new Response('{"data": "test"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
            mockFetch.mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/smartgrind/api/user');
            const response = await handleAPIRequest(request);

            expect(response.status).toBe(200);
        });

        it('should return network response for GET requests', async () => {
            const mockResponse = new Response('{"data": "test"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
            mockFetch.mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/smartgrind/api/user');
            const response = await handleAPIRequest(request);

            expect(response.status).toBe(200);
            expect(mockFetch).toHaveBeenCalled();
        });

        it('should not cache non-GET requests', async () => {
            const mockResponse = new Response('{"data": "test"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
            mockFetch.mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/smartgrind/api/user', {
                method: 'POST',
            });
            const response = await handleAPIRequest(request);

            expect(response.status).toBe(200);
            // POST requests should be fetched but not cached
            expect(mockFetch).toHaveBeenCalled();
        });

        it('should return redirect responses without caching', async () => {
            const mockResponse = new Response('', {
                status: 302,
                headers: { Location: '/new-url' },
            });
            mockFetch.mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/smartgrind/api/user');
            const response = await handleAPIRequest(request);

            expect(response.status).toBe(302);
        });

        it('should return 401/403 responses without fallback', async () => {
            const mockResponse = new Response('Unauthorized', { status: 401 });
            mockFetch.mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/smartgrind/api/user');
            const response = await handleAPIRequest(request);

            expect(response.status).toBe(401);
        });

        it('should return offline response for network errors without cache', async () => {
            mockFetch.mockRejectedValue(new TypeError('Network error'));

            const request = new Request('https://example.com/smartgrind/api/user');
            const response = await handleAPIRequest(request);

            expect(response.status).toBe(503);

            const body = await response.json();
            expect(body.offline).toBe(true);
        });
    });

    describe('handleProblemRequest', () => {
        it('should fetch from network if not cached', async () => {
            const networkResponse = new Response('# Two Sum\n\nProblem content', {
                status: 200,
                headers: { 'Content-Type': 'text/markdown' },
            });
            mockFetch.mockResolvedValue(networkResponse);

            const request = new Request('https://example.com/smartgrind/patterns/two-sum.md');
            const response = await handleProblemRequest(request);

            expect(await response.text()).toBe('# Two Sum\n\nProblem content');
            expect(mockFetch).toHaveBeenCalledWith(request);
        });

        it('should return offline message when network fails and not cached', async () => {
            mockFetch.mockRejectedValue(new Error('Network error'));

            const request = new Request('https://example.com/smartgrind/patterns/two-sum.md');
            const response = await handleProblemRequest(request);

            expect(response.status).toBe(503);

            const body = await response.text();
            expect(body).toContain('Offline');
        });
    });

    describe('handleStaticRequest', () => {
        it('should fetch from network when not cached', async () => {
            const networkResponse = new Response('fresh css', {
                status: 200,
                headers: { 'Content-Type': 'text/css' },
            });
            mockFetch.mockResolvedValue(networkResponse);

            const request = new Request('https://example.com/smartgrind/style.css');
            const response = await handleStaticRequest(request);

            expect(await response.text()).toBe('fresh css');
        });

        it('should return 503 when offline and not cached', async () => {
            mockFetch.mockRejectedValue(new Error('Network error'));

            const request = new Request('https://example.com/smartgrind/style.css');
            const response = await handleStaticRequest(request);

            expect(response.status).toBe(503);
        });
    });

    describe('handleNavigationRequest', () => {
        it('should return network response on success', async () => {
            const networkResponse = new Response('<html>Page</html>', {
                status: 200,
                headers: { 'Content-Type': 'text/html' },
            });
            mockFetch.mockResolvedValue(networkResponse);

            const request = new Request('https://example.com/smartgrind/');
            const response = await handleNavigationRequest(request);

            expect(response.status).toBe(200);
        });

        it('should cache successful responses', async () => {
            const networkResponse = new Response('<html>Page</html>', {
                status: 200,
                headers: { 'Content-Type': 'text/html' },
            });
            mockFetch.mockResolvedValue(networkResponse);

            const request = new Request('https://example.com/smartgrind/');
            await handleNavigationRequest(request);

            expect(mockFetch).toHaveBeenCalledWith(request);
        });

        it('should return offline fallback when nothing is cached', async () => {
            mockFetch.mockRejectedValue(new Error('Network error'));

            const cache = await caches.open('smartgrind-static-v1.0.0');
            (cache.match as jest.Mock).mockResolvedValue(undefined);

            const request = new Request('https://example.com/smartgrind/');
            const response = await handleNavigationRequest(request);

            expect(response.status).toBe(200);

            const body = await response.text();
            expect(body).toContain('Offline');
            expect(body).toContain('Try Again');
        });
    });

    describe('cache constants', () => {
        it('should have correct API cache max age', () => {
            expect(API_CACHE_MAX_AGE).toBe(30 * 60 * 1000); // 30 minutes
        });

        it('should have correct static cache max age', () => {
            expect(STATIC_CACHE_MAX_AGE).toBe(24 * 60 * 60 * 1000); // 24 hours
        });
    });
});
