/**
 * Enhanced tests for Auth Functions - Rate Limiting
 * @module tests/functions/auth-enhanced
 */

import {
    checkRateLimit,
    resetRateLimitStateForTests,
} from '../../functions/api/cloudflare-types';

describe('Auth Functions Enhanced', () => {
    const requestWithIp = (ip = '1.2.3.4') =>
        new Request('https://example.com/auth', {
            headers: { 'CF-Connecting-IP': ip },
        });

    beforeEach(() => {
        jest.clearAllMocks();
        resetRateLimitStateForTests();
        delete (globalThis as { caches?: unknown }).caches;
    });

    afterEach(() => {
        jest.clearAllMocks();
        resetRateLimitStateForTests();
        delete (globalThis as { caches?: unknown }).caches;
    });

    describe('checkRateLimit', () => {
        test('should not rate limit on first requests', async () => {
            const isLimited = await checkRateLimit(requestWithIp(), {}, 5, 60);

            expect(isLimited).toBe(false);
        });

        test('should rate limit after exceeding max requests', async () => {
            for (let i = 0; i < 5; i++) {
                await expect(checkRateLimit(requestWithIp(), {}, 5, 60)).resolves.toBe(false);
            }

            await expect(checkRateLimit(requestWithIp(), {}, 5, 60)).resolves.toBe(true);
        });

        test('should isolate limits per client IP', async () => {
            for (let i = 0; i < 5; i++) {
                await checkRateLimit(requestWithIp('1.1.1.1'), {}, 5, 60);
            }
            await expect(checkRateLimit(requestWithIp('1.1.1.1'), {}, 5, 60)).resolves.toBe(true);
            await expect(checkRateLimit(requestWithIp('9.9.9.9'), {}, 5, 60)).resolves.toBe(false);
        });

        test('should NOT use X-Forwarded-For when CF-Connecting-IP is not present (security)', async () => {
            const spoofed = new Request('https://example.com/auth', {
                headers: { 'X-Forwarded-For': '5.6.7.8' },
            });
            const known = new Request('https://example.com/auth', {
                headers: { 'CF-Connecting-IP': '5.6.7.8' },
            });

            for (let i = 0; i < 5; i++) {
                await checkRateLimit(spoofed, {}, 5, 60);
            }
            await expect(checkRateLimit(spoofed, {}, 5, 60)).resolves.toBe(true);
            await expect(checkRateLimit(known, {}, 5, 60)).resolves.toBe(false);
        });

        test('should use "unknown" when no IP header is present', async () => {
            const request = new Request('https://example.com/auth');
            await expect(checkRateLimit(request, {}, 5, 60)).resolves.toBe(false);
        });

        test('should filter out expired requests', async () => {
            jest.useFakeTimers();
            jest.setSystemTime(1_700_000_000_000);
            for (let i = 0; i < 5; i++) {
                await checkRateLimit(requestWithIp(), {}, 5, 60);
            }
            await expect(checkRateLimit(requestWithIp(), {}, 5, 60)).resolves.toBe(true);

            jest.setSystemTime(1_700_000_000_000 + 61_000);
            await expect(checkRateLimit(requestWithIp(), {}, 5, 60)).resolves.toBe(false);
            jest.useRealTimers();
        });

        test('should fail open when headers cannot be read, even if failClosed is requested', async () => {
            const request = {
                headers: {
                    get(): string {
                        throw new Error('header error');
                    },
                },
            } as unknown as Request;

            await expect(checkRateLimit(request, {}, 10, 60, 'oauth', true)).resolves.toBe(false);
        });

        test('should persist window state in the Cache API when available', async () => {
            const store = new Map<string, Response>();
            const put = jest.fn(async (request: RequestInfo, response: Response) => {
                const url = typeof request === 'string' ? request : (request as Request).url;
                store.set(url, response);
            });
            const match = jest.fn(async (request: RequestInfo) => {
                const url = typeof request === 'string' ? request : (request as Request).url;
                return store.get(url);
            });
            (globalThis as { caches: { default: { match: typeof match; put: typeof put } } }).caches =
                { default: { match, put } };

            await checkRateLimit(requestWithIp(), {}, 10, 120);
            expect(put).toHaveBeenCalled();
            const cached = put.mock.calls[0][1] as Response;
            expect(cached.headers.get('Cache-Control')).toBe('max-age=120');

            resetRateLimitStateForTests();
            // Warm memory from the 1 cached stamp, then add 8 more = 9; the 10th is still allowed, 11th blocked.
            for (let i = 0; i < 9; i++) {
                await expect(checkRateLimit(requestWithIp(), {}, 10, 120)).resolves.toBe(false);
            }
            await expect(checkRateLimit(requestWithIp(), {}, 10, 120)).resolves.toBe(true);
        });

        test('should ignore Cache API errors and keep using memory', async () => {
            (globalThis as { caches: { default: { match: jest.Mock; put: jest.Mock } } }).caches = {
                default: {
                    match: jest.fn().mockRejectedValue(new Error('cache down')),
                    put: jest.fn().mockRejectedValue(new Error('cache down')),
                },
            };

            for (let i = 0; i < 3; i++) {
                await expect(checkRateLimit(requestWithIp(), {}, 3, 60, 'api', true)).resolves.toBe(
                    false
                );
            }
            await expect(checkRateLimit(requestWithIp(), {}, 3, 60, 'api', true)).resolves.toBe(
                true
            );
        });

        test('does not use the KV binding', async () => {
            const kv = { get: jest.fn(), put: jest.fn(), delete: jest.fn() };
            await checkRateLimit(requestWithIp(), { KV: kv as never }, 5, 60);
            expect(kv.get).not.toHaveBeenCalled();
            expect(kv.put).not.toHaveBeenCalled();
        });
    });
});
