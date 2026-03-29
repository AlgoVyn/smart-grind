/**
 * Auth Manager Tests
 * Tests for authentication token management using httpOnly cookie + token endpoint
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
                expiresAt: null,
                isFetchingToken: false,
            });
        });

        test('should create AuthManager with custom options', () => {
            const onAuthFailure = jest.fn();
            const manager = new AuthManager({
                tokenRefreshThreshold: 60000,
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
            const expiresIn = 3600;

            await authManager.setTokens(token, expiresIn);

            const state = authManager.getState();
            expect(state.token).toBe(token);
            expect(state.expiresAt).toBeGreaterThan(Date.now());
        });

        test('should clear tokens and notify auth failure', async () => {
            const onAuthFailure = jest.fn();
            authManager.setOnAuthFailure(onAuthFailure);

            await authManager.setTokens('token', 3600);
            await authManager.clearTokens();

            const state = authManager.getState();
            expect(state.token).toBeNull();
            expect(state.expiresAt).toBeNull();
            expect(onAuthFailure).toHaveBeenCalled();
        });

        test('should get token without fetch when not needed and not expired', async () => {
            await authManager.setTokens('valid-token', 3600);
            const token = await authManager.getToken();
            expect(token).toBe('valid-token');
            expect(mockFetch).not.toHaveBeenCalled();
        });

        test('should return null when no token exists', async () => {
            const token = await authManager.getToken();
            expect(token).toBeNull();
        });
    });

    describe('token expiration', () => {
        test('should check if token is expired', async () => {
            await authManager.setTokens('token', -1);
            expect(authManager.isTokenExpired()).toBe(true);
        });

        test('should check if token is not expired', async () => {
            await authManager.setTokens('token', 3600);
            expect(authManager.isTokenExpired()).toBe(false);
        });

        test('should return true for expired when no token', () => {
            expect(authManager.isTokenExpired()).toBe(true);
        });

        test('should check authentication status', async () => {
            expect(authManager.isAuthenticated()).toBe(false);
            await authManager.setTokens('token', 3600);
            expect(authManager.isAuthenticated()).toBe(true);
            await authManager.setTokens('token', -1);
            expect(authManager.isAuthenticated()).toBe(false);
        });
    });

    describe('token fetch from server', () => {
        test('should fetch fresh token when needed due to imminent expiration', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    token: 'new-token',
                    userId: 'user123',
                    displayName: 'Test User',
                    expiresIn: 3600,
                }),
            });

            // Set token that expires very soon (within 5 minute threshold)
            await authManager.setTokens('old-token', 1); // 1 second = expires soon

            const token = await authManager.getToken();

            expect(token).toBe('new-token');
            expect(mockFetch).toHaveBeenCalledWith(
                '/smartgrind/api/auth?action=token',
                expect.objectContaining({
                    method: 'GET',
                    credentials: 'include',
                })
            );
        });

        test('should return existing token if fetch fails but token is still valid', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            // Set valid token that expires in the future
            await authManager.setTokens('valid-token', 3600);

            const token = await authManager.getToken();
            // Should return existing token since it's still valid
            expect(token).toBe('valid-token');
        });

        test('should return null when fetch fails and token is expired', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            // Set expired token
            await authManager.setTokens('expired-token', -1);

            const token = await authManager.getToken();
            // Should return null since token is expired and refresh failed
            expect(token).toBeNull();
        });

        test('should handle 401/403 auth errors by fetching fresh token', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    token: 'new-token',
                    userId: 'user123',
                    displayName: 'Test User',
                    expiresIn: 3600,
                }),
            });

            await authManager.setTokens('token', 3600);

            const response = new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
            });

            const handled = await authManager.handleAuthError(response);
            expect(handled).toBe(true);
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

    describe('auth headers', () => {
        test('should return auth headers with valid token', async () => {
            await authManager.setTokens('test-token', 3600);
            const headers = await authManager.getAuthHeaders();
            expect(headers).toEqual({
                Authorization: 'Bearer test-token',
            });
        });

        test('should return empty headers when no token', async () => {
            const headers = await authManager.getAuthHeaders();
            expect(headers).toEqual({});
        });

        test('should fetch token and return headers when token is about to expire', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    token: 'fresh-token',
                    userId: 'user123',
                    displayName: 'Test User',
                    expiresIn: 3600,
                }),
            });

            await authManager.setTokens('old-token', 1); // About to expire
            const headers = await authManager.getAuthHeaders();
            expect(headers).toEqual({
                Authorization: 'Bearer fresh-token',
            });
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
