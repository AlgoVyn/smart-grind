/**
 * Enhanced tests for Auth Functions - Rate Limiting
 * @module tests/functions/auth-enhanced
 */

import { checkRateLimit } from '../../functions/api/cloudflare-types';

describe('Auth Functions Enhanced', () => {
    let mockKV: any;

    beforeEach(() => {
        jest.clearAllMocks();

        mockKV = {
            get: jest.fn(),
            put: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkRateLimit', () => {
        test('should not rate limit on first requests', async () => {
            mockKV.get.mockResolvedValue(null);

            const request = new Request('https://example.com/auth', {
                headers: { 'CF-Connecting-IP': '1.2.3.4' },
            });

            const isLimited = await checkRateLimit(request, { KV: mockKV }, 5, 60);

            expect(isLimited).toBe(false);
            expect(mockKV.put).toHaveBeenCalled();
        });

        test('should rate limit after exceeding max requests', async () => {
            const now = Date.now();
            const requests = [now, now - 1000, now - 2000, now - 3000, now - 4000];
            mockKV.get.mockResolvedValue(JSON.stringify(requests));

            const request = new Request('https://example.com/auth', {
                headers: { 'CF-Connecting-IP': '1.2.3.4' },
            });

            const isLimited = await checkRateLimit(request, { KV: mockKV }, 5, 60);

            expect(isLimited).toBe(true);
        });

        test('should NOT use X-Forwarded-For when CF-Connecting-IP is not present (security)', async () => {
            mockKV.get.mockResolvedValue(null);

            // X-Forwarded-For is intentionally excluded as it can be spoofed
            const request = new Request('https://example.com/auth', {
                headers: { 'X-Forwarded-For': '5.6.7.8' },
            });

            await checkRateLimit(request, { KV: mockKV });

            // Should fallback to 'unknown' since X-Forwarded-For is not trusted
            expect(mockKV.get).toHaveBeenCalledWith('ratelimit_unknown');
        });

        test('should use "unknown" when no IP header is present', async () => {
            mockKV.get.mockResolvedValue(null);

            const request = new Request('https://example.com/auth');

            await checkRateLimit(request, { KV: mockKV });

            expect(mockKV.get).toHaveBeenCalledWith('ratelimit_unknown');
        });

        test('should filter out expired requests', async () => {
            const now = Date.now();
            const requests = [now, now - 1000, now - 2000, now - 70000, now - 80000];
            mockKV.get.mockResolvedValue(JSON.stringify(requests));

            const request = new Request('https://example.com/auth', {
                headers: { 'CF-Connecting-IP': '1.2.3.4' },
            });

            const isLimited = await checkRateLimit(request, { KV: mockKV }, 5, 60);

            expect(isLimited).toBe(false);
        });

        test('should handle KV errors gracefully', async () => {
            mockKV.get.mockRejectedValue(new Error('KV Error'));

            const request = new Request('https://example.com/auth', {
                headers: { 'CF-Connecting-IP': '1.2.3.4' },
            });

            const isLimited = await checkRateLimit(request, { KV: mockKV });

            expect(isLimited).toBe(false);
        });

        test('should use default max requests (10) and window (60s)', async () => {
            mockKV.get.mockResolvedValue(JSON.stringify([]));

            const request = new Request('https://example.com/auth', {
                headers: { 'CF-Connecting-IP': '1.2.3.4' },
            });

            await checkRateLimit(request, { KV: mockKV });

            expect(mockKV.get).toHaveBeenCalled();
        });

        test('should push current timestamp to requests list', async () => {
            const now = Date.now();
            mockKV.get.mockResolvedValue(JSON.stringify([now - 1000]));

            const request = new Request('https://example.com/auth', {
                headers: { 'CF-Connecting-IP': '1.2.3.4' },
            });

            await checkRateLimit(request, { KV: mockKV });

            expect(mockKV.put).toHaveBeenCalled();
            const putCall = mockKV.put.mock.calls[0];
            const savedRequests = JSON.parse(putCall[1]);
            expect(savedRequests).toHaveLength(2);
        });

        test('should set expiration TTL on KV put', async () => {
            mockKV.get.mockResolvedValue(null);

            const request = new Request('https://example.com/auth', {
                headers: { 'CF-Connecting-IP': '1.2.3.4' },
            });

            await checkRateLimit(request, { KV: mockKV }, 10, 120);

            expect(mockKV.put).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
                { expirationTtl: 120 }
            );
        });
    });
});
