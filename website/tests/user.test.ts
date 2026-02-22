import { onRequestGet, onRequestPost } from '../functions/api/user.ts';
import { jwtVerify } from 'jose';

// Mock jose
jest.mock('jose', () => ({
    jwtVerify: jest.fn(),
}));

// Mock crypto.randomUUID
global.crypto = {
    randomUUID: jest.fn(() => 'test-csrf-token-12345'),
};

// Helper to compress data for testing (matches the mock CompressionStream behavior)
async function _mockCompress(data: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const input = encoder.encode(data);
    return input.buffer; // Return uncompressed for testing
}

// Helper to decompress data for testing (matches the mock DecompressionStream behavior)
async function _mockDecompress(
    data: ArrayBuffer | string,
    _contentType: string | null
): Promise<string> {
    if (typeof data === 'string') {
        return data;
    }
    return new TextDecoder().decode(data);
}

// Mock atob (CompressionStream/DecompressionStream/Request/Response are in jest.setup.mjs)
global.atob = jest.fn((str) => Buffer.from(str, 'base64').toString('binary'));

describe('User API', () => {
    let mockEnv;
    let mockKV;

    beforeEach(() => {
        mockKV = {
            get: jest.fn(),
            getWithMetadata: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        };

        // Make getWithMetadata return value and metadata
        mockKV.getWithMetadata.mockImplementation((_key, _type, _options) => {
            return new Promise((resolve) => {
                mockKV.get.mockImplementationOnce((_k, _t, _o) => {
                    return Promise.resolve(null);
                });
                resolve({
                    value: null,
                    metadata: null,
                });
            });
        });

        mockEnv = {
            JWT_SECRET: 'test-jwt-secret',
            KV: mockKV,
        };

        // Mock jwtVerify to return valid payload for valid tokens
        jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('onRequestGet', () => {
        test('should handle CORS preflight request', async () => {
            const request = new Request('https://example.com/user', {
                method: 'OPTIONS',
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(204);
            expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
            expect(response.headers.get('Access-Control-Allow-Credentials')).toBe('true');
        });

        test('should return 401 for missing authorization header', async () => {
            const request = new Request('https://example.com/user');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data.error).toBe('Unauthorized');
        });

        test('should return 401 for invalid authorization header', async () => {
            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Invalid' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data.error).toBe('Unauthorized');
        });

        test('should return 401 for invalid JWT', async () => {
            jwtVerify.mockRejectedValue(new Error('Invalid token')); // Invalid token

            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data.error).toBe('Unauthorized');
        });

        test('should authenticate via cookie', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: null,
                metadata: null,
            });

            const request = new Request('https://example.com/user', {
                headers: { Cookie: 'auth_token=valid_token_from_cookie' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            // jwtVerify is called with the token from cookie and the secret key
            expect(jwtVerify).toHaveBeenCalled();
            const callArgs = jwtVerify.mock.calls[0];
            expect(callArgs[0]).toBe('valid_token_from_cookie');
        });

        test('should generate CSRF token with action=csrf', async () => {
            const request = new Request('https://example.com/user?action=csrf', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            const data = await response.json();
            // crypto.randomUUID is mocked to return 'test-csrf-token-12345'
            expect(data.csrfToken).toBeDefined();
            expect(typeof data.csrfToken).toBe('string');
            expect(mockKV.put).toHaveBeenCalledWith(
                'csrf_user123',
                expect.any(String),
                { expirationTtl: 3600 }
            );
        });

        test('should return 401 for CSRF generation without auth', async () => {
            const request = new Request('https://example.com/user?action=csrf');

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data.error).toBe('Unauthorized');
        });

        test('should return 400 for CSRF generation with invalid userId', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 123 } });

            const request = new Request('https://example.com/user?action=csrf', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Invalid userId');
        });

        test('should return 400 for invalid userId', async () => {
            // Mock valid JWT but invalid userId
            jwtVerify.mockResolvedValue({ payload: { userId: 123 } }); // Not string

            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Invalid userId');
        });

        test('should return 400 for userId too long', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'a'.repeat(101) } });

            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Invalid userId');
        });

        test('should return user data from KV (compressed)', async () => {
            // Create compressed data using mock compression
            const rawData = JSON.stringify({ problems: { '1': {} }, deletedIds: ['2'] });
            const encoder = new TextEncoder();
            const compressedData = encoder.encode(rawData).buffer; // Use uncompressed for testing

            mockKV.getWithMetadata.mockResolvedValue({
                value: compressedData,
                metadata: {
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'br',
                },
            });

            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual({ problems: { '1': {} }, deletedIds: ['2'] });
        });

        test('should return user data from KV (uncompressed - backward compatibility)', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: JSON.stringify({ problems: { '1': {} }, deletedIds: ['2'] }),
                metadata: {
                    'Content-Type': 'application/json',
                },
            });

            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual({ problems: { '1': {} }, deletedIds: ['2'] });
        });

        test('should return default data if no KV data', async () => {
            mockKV.getWithMetadata.mockResolvedValue({
                value: null,
                metadata: null,
            });

            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual({ problems: {}, deletedIds: [] });
        });

        test('should handle gzip compressed data', async () => {
            const rawData = JSON.stringify({ problems: { '1': {} }, deletedIds: ['2'] });
            const encoder = new TextEncoder();
            const compressedData = encoder.encode(rawData).buffer;

            mockKV.getWithMetadata.mockResolvedValue({
                value: compressedData,
                metadata: {
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'gzip',
                },
            });

            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data).toEqual({ problems: { '1': {} }, deletedIds: ['2'] });
        });

        test('should return 500 on KV error', async () => {
            mockKV.getWithMetadata.mockRejectedValue(new Error('KV error'));

            const request = new Request('https://example.com/user', {
                headers: { Authorization: 'Bearer header.payload.signature' },
            });

            const response = await onRequestGet({ request, env: mockEnv });

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data.error).toBe('KV error');
        });
    });

    describe('onRequestPost', () => {
        test('should handle CORS preflight request', async () => {
            const request = new Request('https://example.com/user', {
                method: 'OPTIONS',
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(204);
            expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
            expect(response.headers.get('Access-Control-Allow-Credentials')).toBe('true');
        });

        test('should return 401 for missing authorization', async () => {
            const request = new Request('https://example.com/user', {
                method: 'POST',
                body: JSON.stringify({ data: {} }),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(401);
            const data = await response.json();
            expect(data.error).toBe('Unauthorized');
        });

        test('should return 403 for missing CSRF token', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: { Authorization: 'Bearer header.payload.signature' },
                body: JSON.stringify({ data: {} }),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(403);
            const data = await response.json();
            expect(data.error).toBe('Invalid CSRF token');
        });

        test('should return 403 for mismatched CSRF token', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
            mockKV.get.mockResolvedValue('different-csrf-token');

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer header.payload.signature',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: JSON.stringify({ data: {} }),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(403);
            const data = await response.json();
            expect(data.error).toBe('Invalid CSRF token');
        });

        test('should delete CSRF token after successful validation', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
            mockKV.get.mockResolvedValue('test-csrf-token-12345');

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer header.payload.signature',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: JSON.stringify({ data: { problems: {}, deletedIds: [] } }),
            });

            await onRequestPost({ request, env: mockEnv });

            expect(mockKV.delete).toHaveBeenCalledWith('csrf_user123');
        });

        test('should return 400 for invalid JSON', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
            mockKV.get.mockResolvedValue('test-csrf-token-12345');

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer header.payload.signature',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: 'invalid json',
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Invalid JSON');
        });

        test('should return 400 for missing data', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
            mockKV.get.mockResolvedValue('test-csrf-token-12345');

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer header.payload.signature',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: JSON.stringify({}),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Invalid data');
        });

        test('should return 400 for invalid data type', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
            mockKV.get.mockResolvedValue('test-csrf-token-12345');

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer header.payload.signature',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: JSON.stringify({ data: 'string' }),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Invalid data');
        });

        test('should save data to KV and return OK', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
            mockKV.get.mockResolvedValue('test-csrf-token-12345');

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer header.payload.signature',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: JSON.stringify({ data: { problems: {}, deletedIds: [] } }),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(200);
            expect(await response.text()).toBe('OK');
            expect(mockKV.put).toHaveBeenCalled();

            // Verify the data was stored with appropriate metadata
            const putCall = mockKV.put.mock.calls[0];
            expect(putCall.length).toBeGreaterThanOrEqual(3); // Should have key, value, options
            expect(putCall[2].metadata).toEqual(
                expect.objectContaining({
                    'Content-Type': 'application/json',
                })
            );
        });

        test('should store data with appropriate metadata', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
            mockKV.get.mockResolvedValue('test-csrf-token-12345');

            const smallData = { problems: { '1': { status: 'solved' } }, deletedIds: [] };

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer header.payload.signature',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: JSON.stringify({ data: smallData }),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(200);
            expect(mockKV.put).toHaveBeenCalled();

            // Verify the data was stored with metadata
            const putCall = mockKV.put.mock.calls[0];
            expect(putCall[2].metadata).toEqual(
                expect.objectContaining({
                    'Content-Type': 'application/json',
                })
            );
        });

        test('should authenticate via cookie for POST requests', async () => {
            mockKV.get.mockImplementation((key) => {
                if (key === 'csrf_user123') return Promise.resolve('test-csrf-token-12345');
                return Promise.resolve(null);
            });

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Cookie: 'auth_token=valid_token_from_cookie',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: JSON.stringify({ data: { problems: {}, deletedIds: [] } }),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(200);
            // jwtVerify is called with the token from cookie
            expect(jwtVerify).toHaveBeenCalled();
            const callArgs = jwtVerify.mock.calls[0];
            expect(callArgs[0]).toBe('valid_token_from_cookie');
        });

        test('should return 500 on KV error', async () => {
            jwtVerify.mockResolvedValue({ payload: { userId: 'user123' } });
            mockKV.get.mockResolvedValue('test-csrf-token-12345');
            mockKV.put.mockRejectedValue(new Error('KV put error'));

            const request = new Request('https://example.com/user', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer header.payload.signature',
                    'X-CSRF-Token': 'test-csrf-token-12345',
                },
                body: JSON.stringify({ data: {} }),
            });

            const response = await onRequestPost({ request, env: mockEnv });

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data.error).toBe('KV put error');
        });
    });
});
