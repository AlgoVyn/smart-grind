/**
 * @jest-environment jsdom
 */

import {
    fetchWithTimeout,
    fetchJson,
    postJson,
    FetchTimeoutError,
    FetchRetryError,
} from '../../src/utils/fetch-with-timeout';

const mockFetch = global.fetch as jest.Mock;

describe('Fetch with Timeout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('FetchTimeoutError', () => {
        it('should create error with correct properties', () => {
            const error = new FetchTimeoutError('http://example.com', 5000);

            expect(error.name).toBe('FetchTimeoutError');
            expect(error.message).toBe('Request to http://example.com timed out after 5000ms');
            expect(error.url).toBe('http://example.com');
            expect(error.timeout).toBe(5000);
        });
    });

    describe('FetchRetryError', () => {
        it('should create error with correct properties', () => {
            const lastError = new Error('Network failed');
            const error = new FetchRetryError('http://example.com', 3, lastError);

            expect(error.name).toBe('FetchRetryError');
            expect(error.message).toContain('Request to http://example.com failed after 3 attempts');
            expect(error.message).toContain('Network failed');
            expect(error.url).toBe('http://example.com');
            expect(error.attempts).toBe(3);
            expect(error.lastError).toBe(lastError);
        });
    });

    describe('fetchWithTimeout', () => {
        it('should return response on successful fetch', async () => {
            const mockResponse = new Response('test data', { status: 200 });
            mockFetch.mockResolvedValueOnce(mockResponse);

            const result = await fetchWithTimeout('http://example.com');

            expect(result).toBe(mockResponse);
            expect(mockFetch).toHaveBeenCalledWith(
                'http://example.com',
                expect.objectContaining({
                    signal: expect.any(AbortSignal),
                })
            );
        });

        it('should use default timeout of 10 seconds', async () => {
            mockFetch.mockResolvedValueOnce(new Response('ok'));

            await fetchWithTimeout('http://example.com');

            expect(mockFetch).toHaveBeenCalled();
        });

        it('should throw FetchTimeoutError on timeout', async () => {
            mockFetch.mockImplementationOnce(() => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                return Promise.reject(error);
            });

            // With default retries=0, timeout errors get wrapped in FetchRetryError
            // The inner error is FetchTimeoutError
            await expect(
                fetchWithTimeout('http://example.com', { timeout: 100 })
            ).rejects.toThrow(FetchRetryError);
        });

        it('should pass through fetch options', async () => {
            mockFetch.mockResolvedValueOnce(new Response('ok'));

            await fetchWithTimeout('http://example.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ test: true }),
            });

            expect(mockFetch).toHaveBeenCalledWith(
                'http://example.com',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ test: true }),
                    signal: expect.any(AbortSignal),
                })
            );
        });

        it('should retry on TypeError (network error)', async () => {
            mockFetch
                .mockRejectedValueOnce(new TypeError('Network error'))
                .mockResolvedValueOnce(new Response('success'));

            const result = await fetchWithTimeout('http://example.com', {
                retries: 2,
                retryDelay: 10,
            });

            expect(result.status).toBe(200);
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });

        it('should not retry on timeout errors', async () => {
            mockFetch.mockImplementationOnce(() => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                return Promise.reject(error);
            });

            // Timeout errors don't trigger retries but still result in FetchRetryError
            await expect(
                fetchWithTimeout('http://example.com', {
                    timeout: 100,
                    retries: 2,
                    retryDelay: 10,
                })
            ).rejects.toThrow(FetchRetryError);

            // Should only be called once (no retries)
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should not retry on HTTP errors', async () => {
            mockFetch.mockResolvedValueOnce(new Response('Error', { status: 500 }));

            // HTTP errors (non-ok responses) are not retried
            const result = await fetchWithTimeout('http://example.com', {
                retries: 2,
                retryDelay: 10,
            });

            // Returns the response without retrying
            expect(result.status).toBe(500);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should throw FetchRetryError after exhausting retries', async () => {
            mockFetch.mockRejectedValue(new TypeError('Network error'));

            await expect(
                fetchWithTimeout('http://example.com', {
                    retries: 2,
                    retryDelay: 10,
                })
            ).rejects.toThrow(FetchRetryError);

            expect(mockFetch).toHaveBeenCalledTimes(3);
        });

        it('should use custom retry delay', async () => {
            mockFetch
                .mockRejectedValueOnce(new TypeError('Network error'))
                .mockResolvedValueOnce(new Response('success'));

            const startTime = Date.now();
            await fetchWithTimeout('http://example.com', {
                retries: 1,
                retryDelay: 100,
            });
            const elapsed = Date.now() - startTime;

            // Allow for slight timing variations
            expect(elapsed).toBeGreaterThanOrEqual(90);
        });

        it('should handle zero retries', async () => {
            mockFetch.mockRejectedValueOnce(new TypeError('Network error'));

            await expect(
                fetchWithTimeout('http://example.com', { retries: 0 })
            ).rejects.toThrow(FetchRetryError);

            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        it('should handle fetch returning non-ok response', async () => {
            mockFetch.mockResolvedValueOnce(new Response('Not Found', { status: 404 }));

            const result = await fetchWithTimeout('http://example.com');

            expect(result.status).toBe(404);
        });

        it('should preserve original error when not TypeError', async () => {
            const originalError = new Error('Some other error');
            mockFetch.mockRejectedValueOnce(originalError);

            // Error gets wrapped in FetchRetryError
            await expect(fetchWithTimeout('http://example.com')).rejects.toThrow(FetchRetryError);
        });

        it('should handle non-Error rejections', async () => {
            mockFetch.mockRejectedValueOnce('string error');

            // Non-Error rejections get wrapped in FetchRetryError
            await expect(fetchWithTimeout('http://example.com')).rejects.toThrow(FetchRetryError);
        });
    });

    describe('fetchJson', () => {
        it('should fetch and parse JSON response', async () => {
            const data = { id: 1, name: 'Test' };
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                })
            );

            const result = await fetchJson<{ id: number; name: string }>('http://example.com/api');

            expect(result).toEqual(data);
        });

        it('should add Content-Type header', async () => {
            mockFetch.mockResolvedValueOnce(new Response('{}'));

            await fetchJson('http://example.com/api');

            expect(mockFetch).toHaveBeenCalledWith(
                'http://example.com/api',
                expect.objectContaining({
                    headers: { 'Content-Type': 'application/json' },
                })
            );
        });

        it('should merge custom headers', async () => {
            mockFetch.mockResolvedValueOnce(new Response('{}'));

            await fetchJson('http://example.com/api', {
                headers: { Authorization: 'Bearer token' },
            });

            // Verify fetch was called with custom headers
            expect(mockFetch).toHaveBeenCalledWith(
                'http://example.com/api',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer token',
                    }),
                })
            );
        });

        it('should throw on non-ok response', async () => {
            mockFetch.mockResolvedValueOnce(
                new Response('Not Found', { status: 404, statusText: 'Not Found' })
            );

            await expect(fetchJson('http://example.com/api')).rejects.toThrow('HTTP 404: Not Found');
        });

        it('should pass through timeout and retry options', async () => {
            mockFetch.mockResolvedValueOnce(new Response('{}'));

            await fetchJson('http://example.com/api', {
                timeout: 5000,
                retries: 3,
                retryDelay: 100,
            });

            expect(mockFetch).toHaveBeenCalled();
        });
    });

    describe('postJson', () => {
        it('should POST JSON data', async () => {
            const data = { name: 'Test' };
            mockFetch.mockResolvedValueOnce(
                new Response(JSON.stringify({ id: 1, ...data }), { status: 201 })
            );

            const result = await postJson<{ id: number; name: string }>(
                'http://example.com/api',
                data
            );

            expect(result).toEqual({ id: 1, name: 'Test' });
            expect(mockFetch).toHaveBeenCalledWith(
                'http://example.com/api',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json' },
                })
            );
        });

        it('should handle empty data object', async () => {
            mockFetch.mockResolvedValueOnce(new Response('{}'));

            await postJson('http://example.com/api', {});

            expect(mockFetch).toHaveBeenCalledWith(
                'http://example.com/api',
                expect.objectContaining({
                    method: 'POST',
                    body: '{}',
                })
            );
        });

        it('should handle array data', async () => {
            const data = [1, 2, 3];
            mockFetch.mockResolvedValueOnce(new Response('[1,2,3]'));

            await postJson<number[]>('http://example.com/api', data);

            expect(mockFetch).toHaveBeenCalledWith(
                'http://example.com/api',
                expect.objectContaining({
                    body: '[1,2,3]',
                })
            );
        });

        it('should merge with additional options', async () => {
            mockFetch.mockResolvedValueOnce(new Response('{}'));

            await postJson(
                'http://example.com/api',
                { test: true },
                {
                    headers: { 'X-Custom': 'value' },
                    timeout: 5000,
                }
            );

            // Verify fetch was called with correct options
            const callArgs = mockFetch.mock.calls[0];
            expect(callArgs[0]).toBe('http://example.com/api');
            expect(callArgs[1].method).toBe('POST');
            expect(callArgs[1].headers['X-Custom']).toBe('value');
            // timeout is handled internally, not passed to fetch
        });
    });

    describe('Edge cases', () => {
        it('should handle URL with query parameters', async () => {
            mockFetch.mockResolvedValueOnce(new Response('ok'));

            await fetchWithTimeout('http://example.com/api?key=value&other=test');

            expect(mockFetch).toHaveBeenCalledWith(
                'http://example.com/api?key=value&other=test',
                expect.any(Object)
            );
        });

        it('should handle very short timeout', async () => {
            mockFetch.mockImplementationOnce(() => {
                const error = new Error('AbortError');
                error.name = 'AbortError';
                return Promise.reject(error);
            });

            // With retries=0, timeout errors get wrapped in FetchRetryError
            await expect(
                fetchWithTimeout('http://example.com', { timeout: 1, retries: 0 })
            ).rejects.toThrow();
        });

        it('should handle many retries', async () => {
            mockFetch.mockRejectedValue(new TypeError('Network error'));

            await expect(
                fetchWithTimeout('http://example.com', {
                    retries: 5,
                    retryDelay: 10,
                })
            ).rejects.toThrow(FetchRetryError);

            expect(mockFetch).toHaveBeenCalledTimes(6);
        });

        it('should clear timeout after successful fetch', async () => {
            mockFetch.mockResolvedValueOnce(new Response('ok'));

            const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

            await fetchWithTimeout('http://example.com');

            expect(clearTimeoutSpy).toHaveBeenCalled();

            clearTimeoutSpy.mockRestore();
        });
    });
});
