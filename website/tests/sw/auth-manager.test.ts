/**
 * Auth Manager Tests
 * Tests for authentication token management and refresh
 */

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Simple in-memory storage mock
const mockStorage = new Map<string, string>();

// Mock AuthStorage class
jest.mock('../../src/sw/auth-manager', () => {
    const actual = jest.requireActual('../../src/sw/auth-manager');
    
    // Create a mock AuthStorage that uses in-memory Map
    class MockAuthStorage {
        async getItem(key: string): Promise<string | null> {
            return mockStorage.get(key) || null;
        }
        async setItem(key: string, value: string): Promise<void> {
            mockStorage.set(key, value);
        }
        async removeItem(key: string): Promise<void> {
            mockStorage.delete(key);
        }
        async clear(): Promise<void> {
            mockStorage.clear();
        }
    }

    // Return actual exports but with mocked AuthStorage
    return {
        ...actual,
        AuthManager: class extends actual.AuthManager {
            constructor(options?: any) {
                super(options);
                // Replace storage with mock
                (this as any).storage = new MockAuthStorage();
            }
        }
    };
});

// Import after mocks
import { AuthManager, getAuthManager } from '../../src/sw/auth-manager';

describe('AuthManager', () => {
    let authManager: AuthManager;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockReset();
        mockStorage.clear();
        authManager = new AuthManager();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('initialization', () => {
        test('should create AuthManager with default options', () => {
            const manager = new AuthManager();
            expect(manager).toBeDefined();
            expect(manager.getState()).toEqual({
                token: null,
                refreshToken: null,
                expiresAt: null,
                isRefreshing: false,
            });
        });

        test('should create AuthManager with custom options', () => {
            const onAuthFailure = jest.fn();
            const manager = new AuthManager({
                tokenRefreshThreshold: 60000,
                refreshRetryDelay: 10000,
                maxRefreshRetries: 5,
                onAuthFailure,
            });
            expect(manager).toBeDefined();
        });

        test('should set auth failure callback after construction', () => {
            const onAuthFailure = jest.fn();
            authManager.setOnAuthFailure(onAuthFailure);
            expect(authManager).toBeDefined();
        });
    });

    describe('token management', () => {
        test('should set tokens and save to storage', async () => {
            const token = 'test-token';
            const refreshToken = 'test-refresh-token';
            const expiresIn = 3600;

            await authManager.setTokens(token, refreshToken, expiresIn);

            const state = authManager.getState();
            expect(state.token).toBe(token);
            expect(state.refreshToken).toBe(refreshToken);
            expect(state.expiresAt).toBeGreaterThan(Date.now());
        });

        test('should clear tokens and notify auth failure', async () => {
            const onAuthFailure = jest.fn();
            authManager.setOnAuthFailure(onAuthFailure);

            await authManager.setTokens('token', 'refresh', 3600);
            await authManager.clearTokens();

            const state = authManager.getState();
            expect(state.token).toBeNull();
            expect(state.refreshToken).toBeNull();
            expect(state.expiresAt).toBeNull();
            expect(onAuthFailure).toHaveBeenCalled();
        });

        test('should get token without refresh when not needed', async () => {
            await authManager.setTokens('valid-token', 'refresh', 3600);
            const token = await authManager.getToken();
            expect(token).toBe('valid-token');
        });

        test('should return null when no token exists', async () => {
            const token = await authManager.getToken();
            expect(token).toBeNull();
        });
    });

    describe('token expiration', () => {
        test('should check if token is expired', async () => {
            await authManager.setTokens('token', 'refresh', -1);
            expect(authManager.isTokenExpired()).toBe(true);
        });

        test('should check if token is not expired', async () => {
            await authManager.setTokens('token', 'refresh', 3600);
            expect(authManager.isTokenExpired()).toBe(false);
        });

        test('should return true for expired when no token', () => {
            expect(authManager.isTokenExpired()).toBe(true);
        });

        test('should check authentication status', async () => {
            expect(authManager.isAuthenticated()).toBe(false);
            await authManager.setTokens('token', 'refresh', 3600);
            expect(authManager.isAuthenticated()).toBe(true);
            await authManager.setTokens('token', 'refresh', -1);
            expect(authManager.isAuthenticated()).toBe(false);
        });
    });

    describe('token refresh', () => {
        test('should refresh token successfully', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    token: 'new-token',
                    refreshToken: 'new-refresh',
                    expiresIn: 3600,
                }),
            });

            // Set token that expires very soon (within 5 minute threshold)
            await authManager.setTokens('old-token', 'old-refresh', 1); // 1 second = expires soon

            await authManager.getToken();

            expect(mockFetch).toHaveBeenCalledWith(
                '/smartgrind/api/auth/refresh',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ refreshToken: 'old-refresh' }),
                })
            );
        });

        test('should return null when refresh fails and max retries exceeded', async () => {
            mockFetch.mockRejectedValue(new Error('Network error'));

            // Set token that expires very soon
            await authManager.setTokens('token', 'refresh', 1); // 1 second = expires soon

            const token = await authManager.getToken();
            expect(token).toBeNull();
        }, 120000);

        test('should handle 401/403 auth errors', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    token: 'new-token',
                    expiresIn: 3600,
                }),
            });

            await authManager.setTokens('token', 'refresh', 3600);

            const response = new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
            });

            await authManager.handleAuthError(response);
            expect(mockFetch).toHaveBeenCalled();
        });

        test('should not handle non-auth errors', async () => {
            const response = new Response(JSON.stringify({ error: 'Bad Request' }), {
                status: 400,
            });

            const handled = await authManager.handleAuthError(response);
            expect(handled).toBe(false);
            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    describe('retry with fresh token', () => {
        test('should retry request with refreshed token', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    token: 'refreshed-token',
                    expiresIn: 3600,
                }),
            });

            await authManager.setTokens('token', 'refresh', 3600);

            const originalRequest = new Request('/api/test', {
                headers: { 'Content-Type': 'application/json' },
            });

            const fetchFn = jest.fn().mockResolvedValue(
                new Response(JSON.stringify({ success: true }))
            );

            const response = await authManager.retryWithFreshToken(originalRequest, fetchFn);
            expect(response.status).toBe(200);
        });

        test('should return 401 when refresh fails', async () => {
            mockFetch.mockRejectedValue(new Error('Refresh failed'));

            // Set token that expires very soon
            await authManager.setTokens('token', 'refresh', 1);

            const originalRequest = new Request('/api/test');
            const fetchFn = jest.fn();

            const response = await authManager.retryWithFreshToken(originalRequest, fetchFn);
            expect(response.status).toBe(401);
        }, 120000);
    });

    describe('auth headers', () => {
        test('should return auth headers with valid token', async () => {
            await authManager.setTokens('test-token', 'refresh', 3600);
            const headers = await authManager.getAuthHeaders();
            expect(headers).toEqual({
                Authorization: 'Bearer test-token',
            });
        });

        test('should return empty headers when no token', async () => {
            const headers = await authManager.getAuthHeaders();
            expect(headers).toEqual({});
        });
    });

    describe('singleton pattern', () => {
        test('should return same instance from getAuthManager', () => {
            const manager1 = getAuthManager();
            const manager2 = getAuthManager();
            expect(manager1).toBe(manager2);
        });

        test('should update auth failure callback on existing instance', () => {
            const onAuthFailure = jest.fn();
            const manager = getAuthManager({ onAuthFailure });
            expect(manager).toBeDefined();
        });
    });
});
