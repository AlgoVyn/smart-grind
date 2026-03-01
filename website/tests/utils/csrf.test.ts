/**
 * @jest-environment jsdom
 */

import {
    fetchCsrfToken,
    getCsrfToken,
    getCachedCsrfToken,
    clearCsrfToken,
} from '../../src/utils/csrf';
import { FetchTimeoutError } from '../../src/utils/fetch-with-timeout';

const mockFetch = global.fetch as jest.Mock;

describe('CSRF Token Management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        clearCsrfToken(); // Clear the module-level token
    });

    afterEach(() => {
        clearCsrfToken();
    });

    describe('fetchCsrfToken', () => {
        it('should fetch and return CSRF token from server', async () => {
            const expectedToken = 'csrf-token-12345';
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: expectedToken }),
            });

            const token = await fetchCsrfToken();

            expect(token).toBe(expectedToken);
            expect(mockFetch).toHaveBeenCalledWith(
                '/smartgrind/api/user?action=csrf',
                expect.objectContaining({
                    method: 'GET',
                    credentials: 'include',
                })
            );
        });

        it('should return null on HTTP error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            const token = await fetchCsrfToken();

            expect(token).toBeNull();
        });

        it('should return null on network error', async () => {
            mockFetch.mockRejectedValueOnce(new TypeError('Network error'));

            const token = await fetchCsrfToken();

            expect(token).toBeNull();
        });

        it('should return null on timeout error', async () => {
            mockFetch.mockRejectedValueOnce(
                new FetchTimeoutError('/smartgrind/api/user?action=csrf', 10000)
            );

            const token = await fetchCsrfToken();

            expect(token).toBeNull();
        });

        it('should deduplicate concurrent fetch requests', async () => {
            const expectedToken = 'dedup-token';
            let resolveFetch: (value: { ok: boolean; json: () => Promise<{ csrfToken: string }> }) => void;
            
            mockFetch.mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        resolveFetch = resolve;
                    })
            );

            // Start multiple concurrent requests
            const promise1 = fetchCsrfToken();
            const promise2 = fetchCsrfToken();
            const promise3 = fetchCsrfToken();

            // Resolve the fetch
            resolveFetch!({
                ok: true,
                json: () => Promise.resolve({ csrfToken: expectedToken }),
            });

            const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);

            // All should return the same token
            expect(result1).toBe(expectedToken);
            expect(result2).toBe(expectedToken);
            expect(result3).toBe(expectedToken);

            // Fetch should only be called once
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should handle 401 unauthorized error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
            });

            const token = await fetchCsrfToken();

            expect(token).toBeNull();
        });

        it('should handle 403 forbidden error', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 403,
            });

            const token = await fetchCsrfToken();

            expect(token).toBeNull();
        });

        it('should handle malformed JSON response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.reject(new Error('Invalid JSON')),
            });

            const token = await fetchCsrfToken();

            expect(token).toBeNull();
        });

        it('should handle response without csrfToken field', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ otherField: 'value' }),
            });

            const token = await fetchCsrfToken();

            expect(token).toBeUndefined();
        });

        it('should handle empty token response', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: '' }),
            });

            const token = await fetchCsrfToken();

            expect(token).toBe('');
        });
    });

    describe('getCsrfToken', () => {
        it('should return cached token if available', async () => {
            // First fetch to cache the token
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'cached-token' }),
            });

            await getCsrfToken();

            // Reset mock to verify no new fetch
            mockFetch.mockClear();

            // Second call should return cached token
            const token = await getCsrfToken();

            expect(token).toBe('cached-token');
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should fetch new token if none cached', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'new-token' }),
            });

            const token = await getCsrfToken();

            expect(token).toBe('new-token');
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should wait for pending fetch instead of making new request', async () => {
            let resolveFetch: (value: { ok: boolean; json: () => Promise<{ csrfToken: string }> }) => void;
            
            mockFetch.mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        resolveFetch = resolve;
                    })
            );

            // Start a fetch
            const promise1 = fetchCsrfToken();

            // While fetch is pending, call getCsrfToken
            const promise2 = getCsrfToken();

            // Resolve the fetch
            resolveFetch!({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'shared-token' }),
            });

            const [result1, result2] = await Promise.all([promise1, promise2]);

            expect(result1).toBe('shared-token');
            expect(result2).toBe('shared-token');
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCachedCsrfToken', () => {
        it('should return null when no token is cached', () => {
            const token = getCachedCsrfToken();
            expect(token).toBeNull();
        });

        it('should return cached token synchronously', async () => {
            // First, cache a token
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'sync-token' }),
            });

            await getCsrfToken();

            // Now get it synchronously
            const token = getCachedCsrfToken();
            expect(token).toBe('sync-token');
        });

        it('should not trigger a fetch', () => {
            getCachedCsrfToken();
            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    describe('clearCsrfToken', () => {
        it('should clear the cached token', async () => {
            // First, cache a token
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'token-to-clear' }),
            });

            await getCsrfToken();
            expect(getCachedCsrfToken()).toBe('token-to-clear');

            // Clear it
            clearCsrfToken();

            // Should be null now
            expect(getCachedCsrfToken()).toBeNull();
        });

        it('should allow fetching new token after clear', async () => {
            // First token
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'first-token' }),
            });

            await getCsrfToken();
            clearCsrfToken();

            // Second token
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'second-token' }),
            });

            const token = await getCsrfToken();
            expect(token).toBe('second-token');
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });
    });

    describe('Token lifecycle', () => {
        it('should handle full fetch-get-clear cycle', async () => {
            // Fetch new token
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'lifecycle-token' }),
            });

            const fetched = await fetchCsrfToken();
            expect(fetched).toBe('lifecycle-token');

            // Get cached
            const cached = await getCsrfToken();
            expect(cached).toBe('lifecycle-token');

            // Get synchronously
            const sync = getCachedCsrfToken();
            expect(sync).toBe('lifecycle-token');

            // Clear
            clearCsrfToken();
            expect(getCachedCsrfToken()).toBeNull();
        });

        it('should handle multiple clear calls', () => {
            clearCsrfToken();
            clearCsrfToken();
            clearCsrfToken();

            expect(getCachedCsrfToken()).toBeNull();
        });

        it('should handle fetch failure after successful fetch', async () => {
            // First successful fetch
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ csrfToken: 'success-token' }),
            });

            await fetchCsrfToken();

            // Clear and try again with failure
            clearCsrfToken();
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const token = await fetchCsrfToken();
            expect(token).toBeNull();
        });
    });
});
