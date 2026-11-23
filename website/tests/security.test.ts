/**
 * Security function tests for backend API
 * Tests environment validation, rate limiting, and JWT functions
 */

// Mock jose before importing auth module
jest.mock('jose', () => ({
    SignJWT: jest.fn(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setIssuedAt: jest.fn().mockReturnThis(),
        setIssuer: jest.fn().mockReturnThis(),
        setAudience: jest.fn().mockReturnThis(),
        setJti: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        sign: jest.fn().mockResolvedValue('mock-jwt-token'),
    })),
    jwtVerify: jest.fn().mockResolvedValue({
        payload: { userId: 'test-user', displayName: 'Test User' },
    }),
}));

// Mock Request and Response
(global as any).Request = class Request {
    constructor(url: any, options: any = {}) {
        (this as any).url = url;
        (this as any).method = options.method || 'GET';
        (this as any).headers = new Map(Object.entries(options.headers || {}));
        (this as any).body = options.body;
    }
};

(global as any).Response = class Response {
    constructor(body: any, options: any = {}) {
        (this as any).body = body;
        (this as any).status = options.status || 200;
        (this as any).headers = new Map(Object.entries(options.headers || {}));
    }

    async text() {
        return (this as any).body;
    }

    async json() {
        return JSON.parse((this as any).body);
    }
};

// Mock crypto
global.crypto.randomUUID = jest.fn().mockReturnValue('mock-uuid');

import { checkRateLimit, resetRateLimitStateForTests } from '../functions/api/cloudflare-types';

describe('Security Functions', () => {
    describe('Environment Validation', () => {
        test('should throw error when JWT_SECRET is missing', async () => {
            const { onRequestGet } = require('../functions/api/auth');

            const mockEnv = {
                // JWT_SECRET is missing
                GOOGLE_CLIENT_ID: 'test-client-id',
                GOOGLE_CLIENT_SECRET: 'test-client-secret',
                KV: {
                    get: jest.fn(),
                    put: jest.fn(),
                    delete: jest.fn(),
                },
                OAUTH_REDIRECT_URI: 'https://example.com/smartgrind/api/auth',
            };

            const request = new Request('https://example.com/auth?action=login');

            await expect(onRequestGet({ request, env: mockEnv })).rejects.toThrow(
                'Missing required environment variables: JWT_SECRET'
            );
        });

        test('should throw error when GOOGLE_CLIENT_ID is missing', async () => {
            const { onRequestGet } = require('../functions/api/auth');

            const mockEnv = {
                JWT_SECRET: 'test-secret',
                // GOOGLE_CLIENT_ID is missing
                GOOGLE_CLIENT_SECRET: 'test-client-secret',
                KV: {
                    get: jest.fn(),
                    put: jest.fn(),
                    delete: jest.fn(),
                },
                OAUTH_REDIRECT_URI: 'https://example.com/smartgrind/api/auth',
            };

            const request = new Request('https://example.com/auth?action=login');

            await expect(onRequestGet({ request, env: mockEnv })).rejects.toThrow(
                'Missing required environment variables: GOOGLE_CLIENT_ID'
            );
        });

        test('should throw error when GOOGLE_CLIENT_SECRET is missing', async () => {
            const { onRequestGet } = require('../functions/api/auth');

            const mockEnv = {
                JWT_SECRET: 'test-secret',
                GOOGLE_CLIENT_ID: 'test-client-id',
                // GOOGLE_CLIENT_SECRET is missing
                KV: {
                    get: jest.fn(),
                    put: jest.fn(),
                    delete: jest.fn(),
                },
                OAUTH_REDIRECT_URI: 'https://example.com/smartgrind/api/auth',
            };

            const request = new Request('https://example.com/auth?action=login');

            await expect(onRequestGet({ request, env: mockEnv })).rejects.toThrow(
                'Missing required environment variables: GOOGLE_CLIENT_SECRET'
            );
        });

        test('should throw error for multiple missing env vars', async () => {
            const { onRequestGet } = require('../functions/api/auth');

            const mockEnv = {
                // Multiple vars missing
                KV: {
                    get: jest.fn(),
                    put: jest.fn(),
                    delete: jest.fn(),
                },
                OAUTH_REDIRECT_URI: 'https://example.com/smartgrind/api/auth',
            };

            const request = new Request('https://example.com/auth?action=login');

            await expect(onRequestGet({ request, env: mockEnv })).rejects.toThrow(
                'Missing required environment variables:'
            );
        });
    });

    describe('Rate Limiting', () => {
        beforeEach(() => {
            resetRateLimitStateForTests();
            delete (globalThis as { caches?: unknown }).caches;
        });

        afterEach(() => {
            resetRateLimitStateForTests();
            delete (globalThis as { caches?: unknown }).caches;
        });

        const requestWithIp = (ip = '192.168.1.1') => {
            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn().mockReturnValueOnce(ip);
            return request;
        };

        test('should allow requests under the limit', async () => {
            const isLimited = await checkRateLimit(requestWithIp(), {}, 10, 60);
            expect(isLimited).toBe(false);
        });

        test('should allow requests within the limit', async () => {
            for (let i = 0; i < 5; i++) {
                await expect(checkRateLimit(requestWithIp(), {}, 10, 60)).resolves.toBe(false);
            }
        });

        test('should block requests over the limit', async () => {
            for (let i = 0; i < 10; i++) {
                await expect(checkRateLimit(requestWithIp(), {}, 10, 60)).resolves.toBe(false);
            }
            await expect(checkRateLimit(requestWithIp(), {}, 10, 60)).resolves.toBe(true);
        });

        test('should reject requests exceeding the limit', async () => {
            for (let i = 0; i < 15; i++) {
                await checkRateLimit(requestWithIp(), {}, 10, 60);
            }
            await expect(checkRateLimit(requestWithIp(), {}, 10, 60)).resolves.toBe(true);
        });

        test('should clean up expired requests from the window', async () => {
            jest.useFakeTimers();
            jest.setSystemTime(1_700_000_000_000);
            for (let i = 0; i < 10; i++) {
                await checkRateLimit(requestWithIp(), {}, 10, 60);
            }
            await expect(checkRateLimit(requestWithIp(), {}, 10, 60)).resolves.toBe(true);
            jest.setSystemTime(1_700_000_000_000 + 61_000);
            await expect(checkRateLimit(requestWithIp(), {}, 10, 60)).resolves.toBe(false);
            jest.useRealTimers();
        });

        test('should NOT use X-Forwarded-For when CF-Connecting-IP not available (security)', async () => {
            const spoofed = new Request('https://example.com/auth');
            spoofed.headers.get = jest.fn((name: string) =>
                name === 'X-Forwarded-For' ? '10.0.0.1' : null
            );

            const known = requestWithIp('10.0.0.1');
            for (let i = 0; i < 10; i++) {
                await checkRateLimit(spoofed, {}, 10, 60);
            }
            await expect(checkRateLimit(spoofed, {}, 10, 60)).resolves.toBe(true);
            await expect(checkRateLimit(known, {}, 10, 60)).resolves.toBe(false);
        });

        test('should use "unknown" when no IP headers available', async () => {
            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn().mockReturnValueOnce(null).mockReturnValueOnce(null);
            await expect(checkRateLimit(request, {}, 10, 60)).resolves.toBe(false);
        });

        test('should allow request when cache is unavailable (fail open)', async () => {
            (globalThis as { caches: { default: { match: jest.Mock; put: jest.Mock } } }).caches = {
                default: {
                    match: jest.fn().mockRejectedValue(new Error('cache error')),
                    put: jest.fn().mockRejectedValue(new Error('cache error')),
                },
            };
            await expect(checkRateLimit(requestWithIp(), {}, 10, 60, 'api', true)).resolves.toBe(
                false
            );
        });

        test('should write Cache-Control max-age matching the window', async () => {
            const put = jest.fn(async () => undefined);
            (globalThis as { caches: { default: { match: jest.Mock; put: jest.Mock } } }).caches = {
                default: {
                    match: jest.fn().mockResolvedValue(undefined),
                    put,
                },
            };
            await checkRateLimit(requestWithIp(), {}, 10, 60);
            expect(put).toHaveBeenCalled();
            const response = put.mock.calls[0][1] as Response;
            expect(response.headers.get('Cache-Control')).toBe('max-age=60');
        });

        test('should handle custom rate limit parameters', async () => {
            const put = jest.fn(async () => undefined);
            (globalThis as { caches: { default: { match: jest.Mock; put: jest.Mock } } }).caches = {
                default: {
                    match: jest.fn().mockResolvedValue(undefined),
                    put,
                },
            };
            await checkRateLimit(requestWithIp(), {}, 5, 30);
            const response = put.mock.calls[0][1] as Response;
            expect(response.headers.get('Cache-Control')).toBe('max-age=30');
        });

        test('should not use KV for rate limiting', async () => {
            const kv = { get: jest.fn(), put: jest.fn(), delete: jest.fn() };
            await checkRateLimit(requestWithIp(), { KV: kv }, 10, 60);
            expect(kv.get).not.toHaveBeenCalled();
            expect(kv.put).not.toHaveBeenCalled();
        });

        test('should fail open when the request is unreadable, even if failClosed is set', async () => {
            const request = {
                headers: {
                    get(): string {
                        throw new Error('not valid json / header failure');
                    },
                },
            } as unknown as Request;
            await expect(checkRateLimit(request, {}, 10, 60, 'oauth', true)).resolves.toBe(false);
        });
    });
});
