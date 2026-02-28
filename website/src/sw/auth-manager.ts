// Auth Manager Module for SmartGrind Service Worker
// Handles authentication token management and refresh
// Uses IndexedDB for storage (localStorage is not available in Service Workers)

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    isRefreshing: boolean;
}

interface AuthManagerOptions {
    tokenRefreshThreshold: number; // Refresh token if expires within this time (ms)
    refreshRetryDelay: number;
    maxRefreshRetries: number;
    onAuthFailure?: () => void; // Callback when authentication fails completely
}

const DEFAULT_OPTIONS: AuthManagerOptions = {
    tokenRefreshThreshold: 300000, // 5 minutes
    refreshRetryDelay: 5000, // 5 seconds
    maxRefreshRetries: 3,
};

// IndexedDB configuration for auth storage
const AUTH_DB_NAME = 'smartgrind-auth';
const AUTH_DB_VERSION = 1;
const AUTH_STORE_NAME = 'auth-tokens';

/**
 * AuthStorage class using IndexedDB (compatible with Service Workers)
 */
class AuthStorage {
    private db: IDBDatabase | null = null;

    /**
     * Initialize IndexedDB connection
     */
    private async initDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(AUTH_DB_NAME, AUTH_DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(AUTH_STORE_NAME)) {
                    db.createObjectStore(AUTH_STORE_NAME, { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * Get a value from storage
     */
    async getItem(key: string): Promise<string | null> {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(AUTH_STORE_NAME, 'readonly');
                const store = transaction.objectStore(AUTH_STORE_NAME);
                const request = store.get(key);

                request.onsuccess = () => {
                    resolve(request.result?.value || null);
                };
                request.onerror = () => reject(request.error);
            });
        } catch {
            return null;
        }
    }

    /**
     * Set a value in storage
     */
    async setItem(key: string, value: string): Promise<void> {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(AUTH_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(AUTH_STORE_NAME);
                const request = store.put({ key, value });

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch {
            // Storage operation failed
        }
    }

    /**
     * Remove a value from storage
     */
    async removeItem(key: string): Promise<void> {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(AUTH_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(AUTH_STORE_NAME);
                const request = store.delete(key);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch {
            // Storage operation failed
        }
    }

    /**
     * Clear all auth data
     */
    async clear(): Promise<void> {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(AUTH_STORE_NAME, 'readwrite');
                const store = transaction.objectStore(AUTH_STORE_NAME);
                const request = store.clear();

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch {
            // Storage operation failed
        }
    }
}

export class AuthManager {
    private state: AuthState;
    private options: AuthManagerOptions;
    private refreshPromise: Promise<string | null> | null = null;
    private refreshRetries: number = 0;
    private storage: AuthStorage;

    constructor(options: Partial<AuthManagerOptions> = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.state = {
            token: null,
            refreshToken: null,
            expiresAt: null,
            isRefreshing: false,
        };
        this.storage = new AuthStorage();
        // Load from storage asynchronously
        this.loadFromStorage().catch((error) => {
            console.warn('[AuthManager] Failed to load auth from storage:', error);
        });
    }

    /**
     * Set the auth failure callback (can be called after construction)
     */
    setOnAuthFailure(callback: () => void): void {
        this.options.onAuthFailure = callback;
    }

    /**
     * Load auth state from storage
     */
    private async loadFromStorage(): Promise<void> {
        try {
            const [token, refreshToken, expiresAt] = await Promise.all([
                this.storage.getItem('token'),
                this.storage.getItem('refreshToken'),
                this.storage.getItem('tokenExpiresAt'),
            ]);

            this.state.token = token;
            this.state.refreshToken = refreshToken;
            this.state.expiresAt = expiresAt ? parseInt(expiresAt, 10) : null;
        } catch {
            // Storage load failed
        }
    }

    /**
     * Save auth state to storage
     */
    private async saveToStorage(): Promise<void> {
        try {
            const promises: Promise<void>[] = [];

            if (this.state.token) {
                promises.push(this.storage.setItem('token', this.state.token));
            } else {
                promises.push(this.storage.removeItem('token'));
            }

            if (this.state.refreshToken) {
                promises.push(this.storage.setItem('refreshToken', this.state.refreshToken));
            } else {
                promises.push(this.storage.removeItem('refreshToken'));
            }

            if (this.state.expiresAt) {
                promises.push(
                    this.storage.setItem('tokenExpiresAt', this.state.expiresAt.toString())
                );
            } else {
                promises.push(this.storage.removeItem('tokenExpiresAt'));
            }

            await Promise.all(promises);
        } catch {
            // Storage save failed
        }
    }

    /**
     * Set authentication tokens
     */
    async setTokens(token: string, refreshToken: string, expiresIn: number): Promise<void> {
        this.state.token = token;
        this.state.refreshToken = refreshToken;
        this.state.expiresAt = Date.now() + expiresIn * 1000;
        this.refreshRetries = 0;

        await this.saveToStorage();
    }

    /**
     * Clear authentication tokens
     */
    async clearTokens(): Promise<void> {
        this.state.token = null;
        this.state.refreshToken = null;
        this.state.expiresAt = null;
        this.refreshRetries = 0;
        this.refreshPromise = null;

        await this.saveToStorage();

        // Notify that auth has failed
        this.options.onAuthFailure?.();
    }

    /**
     * Update tokens after refresh
     */
    private async updateTokens(
        newToken: string,
        newRefreshToken?: string,
        expiresIn?: number
    ): Promise<void> {
        this.state.token = newToken;
        if (newRefreshToken) {
            this.state.refreshToken = newRefreshToken;
        }
        this.state.expiresAt = Date.now() + (expiresIn || 3600) * 1000;
        this.refreshRetries = 0;

        await this.saveToStorage();
    }

    /**
     * Get current token, refreshing if necessary
     */
    async getToken(): Promise<string | null> {
        // Check if token needs refresh
        if (this.needsRefresh()) {
            return this.refreshToken();
        }

        return this.state.token;
    }

    /**
     * Check if token needs refresh
     */
    private needsRefresh(): boolean {
        if (!this.state.token || !this.state.expiresAt) {
            return false;
        }

        const timeUntilExpiry = this.state.expiresAt - Date.now();
        return timeUntilExpiry < this.options.tokenRefreshThreshold;
    }

    /**
     * Check if token is expired
     */
    isTokenExpired(): boolean {
        if (!this.state.token || !this.state.expiresAt) {
            return true;
        }

        return Date.now() >= this.state.expiresAt;
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.state.token && !this.isTokenExpired();
    }

    /**
     * Refresh the authentication token
     */
    async refreshToken(): Promise<string | null> {
        // If already refreshing, return the existing promise
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        // If no refresh token available, can't refresh
        if (!this.state.refreshToken) {
            this.clearTokens();
            return null;
        }

        // If exceeded max retries, give up
        if (this.refreshRetries >= this.options.maxRefreshRetries) {
            this.clearTokens();
            return null;
        }

        this.refreshPromise = this.performRefresh();
        return this.refreshPromise;
    }

    /**
     * Perform the actual token refresh
     */
    private async performRefresh(): Promise<string | null> {
        try {
            this.state.isRefreshing = true;

            const response = await fetch('/smartgrind/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refreshToken: this.state.refreshToken,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Token refresh failed: ${response.status}`);
            }

            const data = (await response.json()) as {
                token: string;
                refreshToken?: string;
                expiresIn?: number;
            };

            await this.updateTokens(data.token, data.refreshToken, data.expiresIn);
            return data.token;
        } catch (_error) {
            this.refreshRetries++;
            if (this.refreshRetries < this.options.maxRefreshRetries) {
                // Exponential backoff
                await this.delay(
                    this.options.refreshRetryDelay * Math.pow(2, this.refreshRetries - 1)
                );
                return this.performRefresh();
            } else {
                await this.clearTokens();
                return null;
            }
        } finally {
            this.state.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    /**
     * Handle 401/403 response by attempting token refresh
     */
    async handleAuthError(response: Response): Promise<boolean> {
        if (response.status === 401 || response.status === 403) {
            // Try to refresh token
            const newToken = await this.refreshToken();
            return newToken !== null;
        }

        return false;
    }

    /**
     * Wait for storage to be loaded (useful for ensuring auth state is ready)
     */
    async waitForLoad(): Promise<void> {
        await this.loadFromStorage();
    }

    /**
     * Retry a request with refreshed token
     */
    async retryWithFreshToken(
        request: Request,
        fetchFn: (_req: Request) => Promise<Response>
    ): Promise<Response> {
        // Get fresh token
        const token = await this.refreshToken();

        if (!token) {
            // Can't refresh, return original error
            return new Response(JSON.stringify({ error: 'Authentication failed' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Clone request and add new token
        const newHeaders = new Headers(request.headers);
        newHeaders.set('Authorization', `Bearer ${token}`);

        const newRequest = new Request(request, {
            headers: newHeaders,
        });

        return fetchFn(newRequest);
    }

    /**
     * Get auth headers for requests
     */
    async getAuthHeaders(): Promise<Record<string, string>> {
        const token = await this.getToken();

        if (!token) {
            return {};
        }

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    /**
     * Delay helper
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Get current auth state (for debugging)
     */
    getState(): AuthState {
        return {
            ...this.state,
            isRefreshing: this.state.isRefreshing,
        };
    }
}

// Singleton instance
let authManager: AuthManager | null = null;

export function getAuthManager(options?: Partial<AuthManagerOptions>): AuthManager {
    if (!authManager) {
        authManager = new AuthManager(options);
    } else if (options?.onAuthFailure) {
        // Update the callback if provided
        authManager.setOnAuthFailure(options.onAuthFailure);
    }
    return authManager;
}
