/**
 * Security function tests for backend API
 * Tests environment validation, rate limiting, and JWT functions
 */

// Mock jose before importing auth module
jest.mock('jose', () => ({
    SignJWT: jest.fn(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
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

import { checkRateLimit } from '../functions/api/auth';

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
        let mockKV: any;
        let mockEnv: any;

        beforeEach(() => {
            mockKV = {
                get: jest.fn(),
                put: jest.fn(),
                delete: jest.fn(),
            };
            mockEnv = {
                KV: mockKV,
            };
        });

        test('should allow requests under the limit', async () => {
            mockKV.get.mockResolvedValue(null);

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(false);
            expect(mockKV.put).toHaveBeenCalled();
        });

        test('should allow requests within the limit', async () => {
            const fiveMinutesAgo = Date.now() - 300000;
            mockKV.get.mockResolvedValue(JSON.stringify([fiveMinutesAgo, fiveMinutesAgo, fiveMinutesAgo, fiveMinutesAgo, fiveMinutesAgo]));

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(false);
        });

        test('should block requests over the limit', async () => {
            const now = Date.now();
            const recentRequests = Array(10).fill(null).map((_, i) => now - i * 1000);
            mockKV.get.mockResolvedValue(JSON.stringify(recentRequests));

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(true);
            expect(mockKV.put).not.toHaveBeenCalled();
        });

        test('should reject requests exceeding the limit', async () => {
            const now = Date.now();
            const recentRequests = Array(15).fill(null).map((_, i) => now - i * 1000);
            mockKV.get.mockResolvedValue(JSON.stringify(recentRequests));

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(true);
        });

        test('should clean up expired requests from the window', async () => {
            const now = Date.now();
            const oldRequest = now - 120000;
            const recentRequest = now - 30000;
            mockKV.get.mockResolvedValue(JSON.stringify([oldRequest, recentRequest]));

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(false);
        });

        test('should NOT use X-Forwarded-For when CF-Connecting-IP not available (security)', async () => {
            mockKV.get.mockResolvedValue(null);

            // X-Forwarded-For is intentionally excluded as it can be spoofed by clients
            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce(null)  // CF-Connecting-IP not available
                .mockReturnValueOnce('10.0.0.1');  // X-Forwarded-For is ignored

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(false);
            // Should use 'unknown' since X-Forwarded-For is not trusted
            expect(mockKV.put).toHaveBeenCalledWith(
                'ratelimit_unknown',
                expect.any(String),
                expect.any(Object)
            );
        });

        test('should use "unknown" when no IP headers available', async () => {
            mockKV.get.mockResolvedValue(null);

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce(null)
                .mockReturnValueOnce(null);

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(false);
            expect(mockKV.put).toHaveBeenCalledWith(
                'ratelimit_unknown',
                expect.any(String),
                expect.any(Object)
            );
        });

        test('should allow request on KV error (fail open)', async () => {
            mockKV.get.mockRejectedValue(new Error('KV error'));

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(false);
        });

        test('should set expiration TTL on the KV entry', async () => {
            mockKV.get.mockResolvedValue(null);

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(mockKV.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                { expirationTtl: 60 }
            );
        });

        test('should handle custom rate limit parameters', async () => {
            mockKV.get.mockResolvedValue(null);

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            await checkRateLimit(request, mockEnv, 5, 30);
            
            expect(mockKV.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                { expirationTtl: 30 }
            );
        });

        test('should handle empty requests array', async () => {
            mockKV.get.mockResolvedValue('[]');

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(false);
        });

        test('should handle malformed JSON in requests array', async () => {
            mockKV.get.mockResolvedValue('not valid json');

            const request = new Request('https://example.com/auth');
            request.headers.get = jest.fn()
                .mockReturnValueOnce('192.168.1.1');

            const isLimited = await checkRateLimit(request, mockEnv, 10, 60);
            
            expect(isLimited).toBe(false);
        });
    });
});
