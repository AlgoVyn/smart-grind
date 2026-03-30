/**
 * @jest-environment jsdom
 *
 * CSRF Token Management Tests
 * Comprehensive tests for CSRF token fetching, caching, and management
 */

// Mock fetchWithTimeout before any imports
jest.mock('../../src/utils/fetch-with-timeout', () => ({
    fetchWithTimeout: jest.fn(),
    FetchTimeoutError: class FetchTimeoutError extends Error {
        constructor(public readonly url: string, public readonly timeout: number) {
            super(`Request to ${url} timed out after ${timeout}ms`);
            this.name = 'FetchTimeoutError';
        }
    },
}));

// Import mocked module
import { fetchWithTimeout, FetchTimeoutError } from '../../src/utils/fetch-with-timeout';
// Import csrf module (which uses the mocked fetchWithTimeout)
import {
    fetchCsrfToken,
    getCsrfToken,
    getCachedCsrfToken,
    clearCsrfToken,
    __resetCsrfState,
} from '../../src/utils/csrf';

const mockFetchWithTimeout = fetchWithTimeout as jest.MockedFunction<typeof fetchWithTimeout>;

describe('CSRF Token Management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset module state between tests (clears both csrfToken and pendingFetch)
        __resetCsrfState();
    });

    describe('fetchCsrfToken', () => {
        test('should fetch and cache token on success', async () => {
            const mockToken = 'test-csrf-token-123';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: mockToken }),
            } as unknown as Response;

            mockFetchWithTimeout.mockResolvedValueOnce(mockResponse);

            const result = await fetchCsrfToken();

            expect(result).toBe(mockToken);
            expect(mockFetchWithTimeout).toHaveBeenCalledWith(
                '/smartgrind/api/user?action=csrf',
                {
                    method: 'GET',
                    credentials: 'include',
                    timeout: 10000,
                    retries: 2,
                }
            );
            expect(mockResponse.json).toHaveBeenCalled();
            expect(getCachedCsrfToken()).toBe(mockToken);
        });

        test('should return same promise for concurrent calls (deduplication)', async () => {
            const mockToken = 'test-csrf-token-456';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: mockToken }),
            } as unknown as Response;

            // Create a controlled promise
            let resolveFetch: ((value: Response) => void) | undefined;
            const deferredPromise = new Promise<Response>((resolve) => {
                resolveFetch = resolve;
            });
            mockFetchWithTimeout.mockReturnValueOnce(deferredPromise);

            // Start multiple concurrent fetches (before first one resolves)
            const promise1 = fetchCsrfToken();
            const promise2 = fetchCsrfToken();
            const promise3 = fetchCsrfToken();

            // All should be the same promise (deduplication)
            // Use Promise.all to verify they all resolve to the same value
            // and fetchWithTimeout is only called once
            expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);

            // Resolve the fetch
            resolveFetch!(mockResponse);

            // All should resolve to the same token
            const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);
            expect(result1).toBe(mockToken);
            expect(result2).toBe(mockToken);
            expect(result3).toBe(mockToken);

            // fetchWithTimeout should still only be called once
            expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);
        });

        test('should return null for non-ok response', async () => {
            const mockResponse = {
                ok: false,
                status: 500,
            } as Response;

            mockFetchWithTimeout.mockResolvedValueOnce(mockResponse);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await fetchCsrfToken();

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith('[CSRF] Failed to fetch CSRF token:', 500);

            consoleSpy.mockRestore();
        });

        test('should return null on FetchTimeoutError', async () => {
            const timeoutError = new FetchTimeoutError('/smartgrind/api/user?action=csrf', 10000);
            mockFetchWithTimeout.mockRejectedValueOnce(timeoutError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await fetchCsrfToken();

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith('[CSRF] Request timed out:', timeoutError.message);

            consoleSpy.mockRestore();
        });

        test('should return null on generic error', async () => {
            const genericError = new Error('Network failure');
            mockFetchWithTimeout.mockRejectedValueOnce(genericError);

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await fetchCsrfToken();

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith('[CSRF] Error fetching CSRF token:', genericError);

            consoleSpy.mockRestore();
        });
    });

    describe('getCsrfToken', () => {
        test('should return cached token when token exists', async () => {
            // First fetch a token to cache it
            const mockToken = 'cached-token-789';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: mockToken }),
            } as unknown as Response;

            mockFetchWithTimeout.mockResolvedValueOnce(mockResponse);
            await fetchCsrfToken();

            // Reset mock to verify it's not called again
            mockFetchWithTimeout.mockClear();

            // Now getCsrfToken should return cached token without fetching
            const result = await getCsrfToken();

            expect(result).toBe(mockToken);
            expect(mockFetchWithTimeout).not.toHaveBeenCalled();
        });

        test('should fetch new token when no token exists', async () => {
            const mockToken = 'new-token-abc';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: mockToken }),
            } as unknown as Response;

            mockFetchWithTimeout.mockResolvedValueOnce(mockResponse);

            // Verify no token is cached initially
            expect(getCachedCsrfToken()).toBeNull();

            const result = await getCsrfToken();

            expect(result).toBe(mockToken);
            expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);
            expect(mockFetchWithTimeout).toHaveBeenCalledWith(
                '/smartgrind/api/user?action=csrf',
                {
                    method: 'GET',
                    credentials: 'include',
                    timeout: 10000,
                    retries: 2,
                }
            );
        });

        test('should wait for ongoing fetch when fetch is in progress', async () => {
            const mockToken = 'ongoing-token-def';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: mockToken }),
            } as unknown as Response;

            // Create a controlled promise
            let resolveFetch: ((value: Response) => void) | undefined;
            const deferredPromise = new Promise<Response>((resolve) => {
                resolveFetch = resolve;
            });
            mockFetchWithTimeout.mockReturnValueOnce(deferredPromise);

            // Start a fetch via fetchCsrfToken
            const fetchPromise = fetchCsrfToken();

            // While that fetch is in progress, call getCsrfToken
            const getPromise = getCsrfToken();

            // Resolve the fetch
            resolveFetch!(mockResponse);

            const [fetchResult, getResult] = await Promise.all([fetchPromise, getPromise]);

            expect(fetchResult).toBe(mockToken);
            expect(getResult).toBe(mockToken);

            // fetchWithTimeout should only be called once
            expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCachedCsrfToken', () => {
        test('should return cached token when token exists', async () => {
            const mockToken = 'sync-token-ghi';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: mockToken }),
            } as unknown as Response;

            mockFetchWithTimeout.mockResolvedValueOnce(mockResponse);
            await fetchCsrfToken();

            // getCachedCsrfToken should return the token synchronously
            const result = getCachedCsrfToken();

            expect(result).toBe(mockToken);
        });

        test('should return null when no token is cached', () => {
            // No token cached initially
            const result = getCachedCsrfToken();

            expect(result).toBeNull();
        });
    });

    describe('clearCsrfToken', () => {
        test('should clear the cached token', async () => {
            // First cache a token
            const mockToken = 'token-to-clear';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: mockToken }),
            } as unknown as Response;

            mockFetchWithTimeout.mockResolvedValueOnce(mockResponse);
            await fetchCsrfToken();

            // Verify token is cached
            expect(getCachedCsrfToken()).toBe(mockToken);

            // Clear the token
            clearCsrfToken();

            // Verify token is cleared
            expect(getCachedCsrfToken()).toBeNull();
        });

        test('should not affect ongoing fetch when called after fetch starts', async () => {
            const mockToken = 'ongoing-untouched-token';
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: mockToken }),
            } as unknown as Response;

            // Create a controlled promise
            let resolveFetch: ((value: Response) => void) | undefined;
            const deferredPromise = new Promise<Response>((resolve) => {
                resolveFetch = resolve;
            });
            mockFetchWithTimeout.mockReturnValueOnce(deferredPromise);

            // Start the fetch
            const fetchPromise = fetchCsrfToken();

            // Clear the token while fetch is in progress
            clearCsrfToken();

            // getCachedCsrfToken should return null (token was cleared)
            expect(getCachedCsrfToken()).toBeNull();

            // Resolve the fetch
            resolveFetch!(mockResponse);

            // The fetch should still complete successfully
            const result = await fetchPromise;
            expect(result).toBe(mockToken);

            // After fetch completes, the token should be cached
            expect(getCachedCsrfToken()).toBe(mockToken);
        });
    });

    describe('fetchCsrfToken arguments verification', () => {
        test('should pass correct arguments to fetchWithTimeout', async () => {
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({ csrfToken: 'test-token' }),
            } as unknown as Response;

            mockFetchWithTimeout.mockResolvedValueOnce(mockResponse);

            await fetchCsrfToken();

            expect(mockFetchWithTimeout).toHaveBeenCalledTimes(1);
            expect(mockFetchWithTimeout).toHaveBeenCalledWith(
                '/smartgrind/api/user?action=csrf',
                {
                    method: 'GET',
                    credentials: 'include',
                    timeout: 10000,
                    retries: 2,
                }
            );
        });
    });
});
