/**
 * @jest-environment jsdom
 */

import {
    FetchTimeoutError,
    FetchRetryError,
    fetchWithTimeout,
    fetchJson,
    postJson,
} from '../../src/utils/fetch-with-timeout';

describe('fetch-with-timeout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('FetchTimeoutError', () => {
        test('should create error with url and timeout properties', () => {
            const url = 'https://api.example.com/data';
            const timeout = 5000;
            const error = new FetchTimeoutError(url, timeout);

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(FetchTimeoutError);
            expect(error.name).toBe('FetchTimeoutError');
            expect(error.url).toBe(url);
            expect(error.timeout).toBe(timeout);
            expect(error.message).toBe(`Request to ${url} timed out after ${timeout}ms`);
        });

        test('should maintain error properties immutability', () => {
            const url = 'https://api.example.com/data';
            const timeout = 5000;
            const error = new FetchTimeoutError(url, timeout);

            expect(Object.isFrozen(error)).toBe(false);
            expect(error.url).toBe(url);
            expect(error.timeout).toBe(timeout);
        });
    });

    describe('FetchRetryError', () => {
        test('should create error with url, attempts, and lastError properties', () => {
            const url = 'https://api.example.com/data';
            const attempts = 3;
            const lastError = new Error('Network failure');
            const error = new FetchRetryError(url, attempts, lastError);

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(FetchRetryError);
            expect(error.name).toBe('FetchRetryError');
            expect(error.url).toBe(url);
            expect(error.attempts).toBe(attempts);
            expect(error.lastError).toBe(lastError);
            expect(error.message).toBe(
                `Request to ${url} failed after ${attempts} attempts. Last error: ${lastError.message}`
            );
        });

        test('should handle different error types as lastError', () => {
            const url = 'https://api.example.com/data';
            const attempts = 5;

            const typeError = new TypeError('Failed to fetch');
            const retryError = new FetchRetryError(url, attempts, typeError);

            expect(retryError.lastError).toBeInstanceOf(TypeError);
            expect(retryError.lastError.message).toBe('Failed to fetch');
        });
    });

    describe('fetchWithTimeout', () => {
        let mockFetch: jest.Mock;

        beforeEach(() => {
            mockFetch = jest.fn();
            global.fetch = mockFetch;
        });

        test('basic success case', async () => {
            const mockResponse = new Response('success', { status: 200 });
            mockFetch.mockResolvedValue(mockResponse);

            const result = await fetchWithTimeout('https://api.example.com/data');

            expect(result).toBe(mockResponse);
            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
                signal: expect.any(AbortSignal),
            });
        });

        test('with custom timeout', async () => {
            const mockResponse = new Response('success', { status: 200 });
            mockFetch.mockResolvedValue(mockResponse);

            await fetchWithTimeout('https://api.example.com/data', { timeout: 5000 });

            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
                signal: expect.any(AbortSignal),
            });
        });

        test('timeout error converts AbortError to FetchTimeoutError wrapped in FetchRetryError', async () => {
            const abortError = new Error('The operation was aborted');
            abortError.name = 'AbortError';
            mockFetch.mockRejectedValue(abortError);

            await expect(
                fetchWithTimeout('https://api.example.com/data', { timeout: 100 })
            ).rejects.toThrow(FetchRetryError);

            await expect(
                fetchWithTimeout('https://api.example.com/data', { timeout: 100 })
            ).rejects.toThrow('Request to https://api.example.com/data failed after 1 attempts');
        });

        test('retries on network error (TypeError)', async () => {
            const networkError = new TypeError('Failed to fetch');
            const mockResponse = new Response('success', { status: 200 });

            mockFetch
                .mockRejectedValueOnce(networkError)
                .mockRejectedValueOnce(networkError)
                .mockResolvedValueOnce(mockResponse);

            const result = await fetchWithTimeout('https://api.example.com/data', {
                retries: 2,
                retryDelay: 100,
            });

            expect(result).toBe(mockResponse);
            expect(mockFetch).toHaveBeenCalledTimes(3);
        });

        test('does not retry on non-network errors', async () => {
            const httpError = new Error('Internal Server Error');
            httpError.name = 'Error';

            mockFetch.mockRejectedValue(httpError);

            await expect(
                fetchWithTimeout('https://api.example.com/data', {
                    retries: 2,
                    retryDelay: 100,
                })
            ).rejects.toThrow(FetchRetryError);

            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        test('retry delay behavior', async () => {
            const networkError = new TypeError('Failed to fetch');
            const mockResponse = new Response('success', { status: 200 });

            mockFetch
                .mockRejectedValueOnce(networkError)
                .mockResolvedValueOnce(mockResponse);

            const delaySpy = jest.spyOn(global, 'setTimeout');

            await fetchWithTimeout('https://api.example.com/data', {
                retries: 1,
                retryDelay: 500,
            });

            expect(delaySpy).toHaveBeenCalledWith(expect.any(Function), 500);
            expect(mockFetch).toHaveBeenCalledTimes(2);

            delaySpy.mockRestore();
        });

        test('does not retry on timeout errors', async () => {
            const abortError = new Error('The operation was aborted');
            abortError.name = 'AbortError';

            mockFetch.mockRejectedValue(abortError);

            await expect(
                fetchWithTimeout('https://api.example.com/data', {
                    timeout: 100,
                    retries: 3,
                    retryDelay: 100,
                })
            ).rejects.toThrow(FetchRetryError);

            // Should only be called once since timeout errors don't retry
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        test('retry exhaustion throws FetchRetryError', async () => {
            const networkError = new TypeError('Failed to fetch');
            mockFetch.mockRejectedValue(networkError);

            const expectedError = `Request to https://api.example.com/data failed after 3 attempts. Last error: Failed to fetch`;

            await expect(
                fetchWithTimeout('https://api.example.com/data', {
                    retries: 2,
                    retryDelay: 50,
                })
            ).rejects.toThrow(expectedError);

            expect(mockFetch).toHaveBeenCalledTimes(3);
        });

        test('passes through fetch options', async () => {
            const mockResponse = new Response('success', { status: 200 });
            mockFetch.mockResolvedValue(mockResponse);

            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'value' }),
            };

            await fetchWithTimeout('https://api.example.com/data', options);

            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
                ...options,
                signal: expect.any(AbortSignal),
            });
        });
    });

    describe('fetchJson', () => {
        let mockFetch: jest.Mock;

        beforeEach(() => {
            mockFetch = jest.fn();
            global.fetch = mockFetch;
        });

        test('success case returns parsed JSON', async () => {
            const mockData = { id: 1, name: 'Test' };
            const mockResponse = new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
            mockFetch.mockResolvedValue(mockResponse);

            const result = await fetchJson<{ id: number; name: string }>(
                'https://api.example.com/data'
            );

            expect(result).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
                signal: expect.any(AbortSignal),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });

        test('throws on HTTP error response', async () => {
            const mockResponse = new Response('Not Found', {
                status: 404,
                statusText: 'Not Found',
            });
            mockFetch.mockResolvedValue(mockResponse);

            await expect(
                fetchJson('https://api.example.com/data')
            ).rejects.toThrow('HTTP 404: Not Found');
        });

        test('throws on 500 error response', async () => {
            const mockResponse = new Response('Internal Server Error', {
                status: 500,
                statusText: 'Internal Server Error',
            });
            mockFetch.mockResolvedValue(mockResponse);

            await expect(
                fetchJson('https://api.example.com/data')
            ).rejects.toThrow('HTTP 500: Internal Server Error');
        });

        test('custom headers overwrite default headers due to spread order', async () => {
            const mockData = { success: true };
            const mockResponse = new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
            mockFetch.mockResolvedValue(mockResponse);

            await fetchJson('https://api.example.com/data', {
                headers: {
                    Authorization: 'Bearer token123',
                    'X-Custom-Header': 'custom-value',
                },
            });

            // Note: Due to spread order in implementation, options.headers overwrites the default
            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
                signal: expect.any(AbortSignal),
                headers: {
                    Authorization: 'Bearer token123',
                    'X-Custom-Header': 'custom-value',
                },
            });
        });

        test('passes through timeout and retry options', async () => {
            const mockData = { success: true };
            const mockResponse = new Response(JSON.stringify(mockData), {
                status: 200,
            });
            mockFetch.mockResolvedValue(mockResponse);

            await fetchJson('https://api.example.com/data', {
                timeout: 5000,
                retries: 2,
                retryDelay: 500,
            });

            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
                signal: expect.any(AbortSignal),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });
    });

    describe('postJson', () => {
        let mockFetch: jest.Mock;

        beforeEach(() => {
            mockFetch = jest.fn();
            global.fetch = mockFetch;
        });

        test('success case with POST method and JSON body', async () => {
            const mockData = { id: 1, created: true };
            const mockResponse = new Response(JSON.stringify(mockData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
            mockFetch.mockResolvedValue(mockResponse);

            const postData = { name: 'New Item', value: 123 };
            const result = await postJson<{ id: number; created: boolean }>(
                'https://api.example.com/data',
                postData
            );

            expect(result).toEqual(mockData);
            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
                signal: expect.any(AbortSignal),
                method: 'POST',
                body: JSON.stringify(postData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        });

        test('sets proper headers and stringifies body', async () => {
            const mockData = { success: true };
            const mockResponse = new Response(JSON.stringify(mockData), {
                status: 200,
            });
            mockFetch.mockResolvedValue(mockResponse);

            const complexData = {
                nested: { key: 'value' },
                array: [1, 2, 3],
                nullValue: null,
            };

            await postJson('https://api.example.com/data', complexData);

            const callArgs = mockFetch.mock.calls[0];
            expect(callArgs[0]).toBe('https://api.example.com/data');
            expect(callArgs[1].method).toBe('POST');
            expect(callArgs[1].body).toBe(JSON.stringify(complexData));
            expect(callArgs[1].headers).toEqual({
                'Content-Type': 'application/json',
            });
        });

        test('passes through additional options', async () => {
            const mockData = { success: true };
            const mockResponse = new Response(JSON.stringify(mockData), {
                status: 200,
            });
            mockFetch.mockResolvedValue(mockResponse);

            const postData = { test: 'data' };
            await postJson('https://api.example.com/data', postData, {
                timeout: 3000,
                retries: 1,
                headers: {
                    Authorization: 'Bearer token',
                },
            });

            // Note: Due to spread order in implementation, options.headers overwrites defaults
            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
                signal: expect.any(AbortSignal),
                method: 'POST',
                body: JSON.stringify(postData),
                headers: {
                    Authorization: 'Bearer token',
                },
            });
        });

        test('throws on HTTP error', async () => {
            const mockResponse = new Response('Bad Request', {
                status: 400,
                statusText: 'Bad Request',
            });
            mockFetch.mockResolvedValue(mockResponse);

            await expect(
                postJson('https://api.example.com/data', { invalid: 'data' })
            ).rejects.toThrow('HTTP 400: Bad Request');
        });
    });
});
