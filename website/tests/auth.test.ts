import { onRequestGet } from '../functions/api/auth.ts';

// Mock jose
jest.mock('jose', () => ({
    SignJWT: jest.fn(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        sign: jest.fn().mockResolvedValue('mock-jwt-token'),
    })),
}));

// Mock Request and Response
(global as any).Request = class Request {
    constructor(url: any, options: any = {}) {
        (this as any).url = url;
        (this as any).method = options.method || 'GET';
        (this as any).headers = new Map(Object.entries(options.headers || {}));
        (this as any).body = options.body;
    }

    async json() {
        return JSON.parse((this as any).body);
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

(global as any).Response.redirect = (url: any, status: any) =>
    new (global as any).Response('', { status, headers: { Location: url } });

// crypto.subtle is mocked in jest.setup.js

describe('Auth API', () => {
    let mockFetch;
    let mockEnv;
    let mockKV;

    beforeEach(() => {
        mockFetch = global.fetch;
        mockFetch.mockClear();

        mockKV = {
            get: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        };

        mockEnv = {
            GOOGLE_CLIENT_ID: 'test-client-id',
            GOOGLE_CLIENT_SECRET: 'test-client-secret',
            JWT_SECRET: 'test-jwt-secret',
            KV: mockKV,
            OAUTH_REDIRECT_URI: 'https://algovyn.com/smartgrind/api/auth',
        };

        // Mock crypto.randomUUID
        global.crypto.randomUUID = jest.fn().mockReturnValue('mock-uuid');

        // Mock crypto.subtle for legacy (if needed)
        (global.crypto.subtle.importKey as any).mockResolvedValue('mock-key');
        (global.crypto.subtle.sign as any).mockResolvedValue(new Uint8Array([1, 2, 3, 4]));

        // Mock rate limiting to allow requests
        const authModule = require('../functions/api/auth.ts');
        jest.spyOn(authModule, 'checkRateLimit').mockResolvedValue(false);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('onRequestGet', () => {
        test('should redirect to Google OAuth for login action', async () => {
            const request = new Request('https://example.com/auth?action=login');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(302);
            expect(response.headers.get('Location')).toContain(
                'https://accounts.google.com/o/oauth2/v2/auth'
            );
            expect(response.headers.get('Location')).toContain('client_id=test-client-id');
            expect(response.headers.get('Location')).toContain(
                'redirect_uri=https%3A%2F%2Falgovyn.com%2Fsmartgrind%2Fapi%2Fauth'
            );
            expect(response.headers.get('Location')).toContain('state=mock-uuid');
            expect(mockKV.put).toHaveBeenCalledWith('oauth_state_mock-uuid', 'valid', {
                expirationTtl: 300,
            });
        });

        test('should return HTML with failure for invalid state in callback', async () => {
            mockKV.get.mockResolvedValue(null); // Invalid state

            const request = new Request(
                'https://example.com/auth?state=invalid-state&code=valid-code'
            );

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-failure');
            expect(html).toContain('Invalid state parameter');
        });

        test('should return HTML with failure for invalid code in callback', async () => {
            mockKV.get.mockResolvedValue('valid'); // Valid state

            const request = new Request('https://example.com/auth?state=mock-uuid&code=');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-failure');
            expect(html).toContain('Invalid authorization code');
        });

        test('should return HTML with failure for code too long', async () => {
            mockKV.get.mockResolvedValue('valid'); // Valid state

            const longCode = 'a'.repeat(1001);
            const request = new Request(
                `https://example.com/auth?state=mock-uuid&code=${longCode}`
            );

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-failure');
            expect(html).toContain('Invalid authorization code');
        });

        test('should return HTML with failure for OAuth failure', async () => {
            mockKV.get.mockResolvedValue('valid'); // Valid state
            mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) }); // No access_token

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-failure');
            expect(html).toContain('OAuth authorization failed');
        });

        test('should return HTML with failure for invalid user data', async () => {
            mockKV.get.mockResolvedValue('valid'); // Valid state
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ access_token: 'token' }),
                })
                .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) }); // No id

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-failure');
            expect(html).toContain('Invalid user data received');
        });

        test('should handle successful OAuth and return HTML for new user', async () => {
            mockKV.get
                .mockResolvedValueOnce('valid') // State check
                .mockResolvedValueOnce(null); // User check

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ access_token: 'token' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            id: 'user123',
                            name: 'Test User',
                            email: 'test@example.com',
                        }),
                });

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-success');
            expect(html).toContain('user123');
            expect(html).toContain('Test User');
            expect(mockKV.put).toHaveBeenCalledWith(
                'user123',
                JSON.stringify({ problems: {}, deletedIds: [] })
            );
            expect(mockKV.delete).toHaveBeenCalledWith('oauth_state_mock-uuid');
        });

        test('should handle successful OAuth for existing user without storing again', async () => {
            mockKV.get
                .mockResolvedValueOnce('valid') // State check
                .mockResolvedValueOnce('existing-data'); // Existing user

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ access_token: 'token' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ id: 'user123', name: 'Test User' }),
                });

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
        });

        test('should return 400 for invalid action', async () => {
            const request = new Request('https://example.com/auth?action=invalid');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            expect(await response.text()).toBe('Invalid action');
        });

        test('should handle user without name', async () => {
            mockKV.get
                .mockResolvedValueOnce('valid') // State check
                .mockResolvedValueOnce(null); // User check

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ access_token: 'token' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ id: 'user123', email: 'test@example.com' }),
                });

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            const html = await response.text();
            expect(html).toContain('test@example.com');
        });

        test('should handle user with no name or email', async () => {
            mockKV.get
                .mockResolvedValueOnce('valid') // State check
                .mockResolvedValueOnce(null); // User check

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ access_token: 'token' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ id: 'user123' }),
                });

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            const html = await response.text();
            expect(html).toContain('User');
        });

        test('should return HTML with failure message for token exchange network error', async () => {
            mockKV.get.mockResolvedValue('valid'); // Valid state
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(500);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-failure');
            expect(html).toContain('Database error during sign-in');
        });

        test('should return HTML with failure message for user info network error', async () => {
            mockKV.get.mockResolvedValue('valid'); // Valid state
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ access_token: 'token' }),
                })
                .mockRejectedValueOnce(new Error('Network error'));

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(500);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-failure');
            expect(html).toContain('Network error during sign-in');
        });

        test('should return HTML with failure message for KV error', async () => {
            mockKV.get
                .mockResolvedValueOnce('valid') // State check
                .mockRejectedValueOnce(new Error('KV error')); // User check

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ access_token: 'token' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ id: 'user123', name: 'Test User' }),
                });

            const request = new Request('https://example.com/auth?state=mock-uuid&code=valid-code');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(500);
            expect(response.headers.get('Content-Type')).toBe('text/html');
            const html = await response.text();
            expect(html).toContain('auth-failure');
            expect(html).toContain('Network error during sign-in');
        });
    });
});
