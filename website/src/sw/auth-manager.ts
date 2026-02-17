// Auth Manager Module for SmartGrind Service Worker
// Handles authentication token management and refresh

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
}

const DEFAULT_OPTIONS: AuthManagerOptions = {
    tokenRefreshThreshold: 300000, // 5 minutes
    refreshRetryDelay: 5000, // 5 seconds
    maxRefreshRetries: 3,
};

// IndexedDB configuration for auth storage (Service Workers don't have localStorage)
const DB_NAME = 'smartgrind-auth';
const DB_VERSION = 1;
const STORE_NAME = 'auth-tokens';

/**
 * IndexedDB-based storage for auth tokens
 * Used instead of localStorage because Service Workers don't have access to localStorage
 */
class AuthStorage {
    private db: IDBDatabase | null = null;

    /**
     * Initialize IndexedDB connection
     */
    private async initDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'key' });
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
                const transaction = db.transaction(STORE_NAME, 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(key);

                request.onsuccess = () => {
                    resolve(request.result?.value || null);
                };
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('[AuthStorage] Failed to get item:', error);
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
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ key, value });

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('[AuthStorage] Failed to set item:', error);
        }
    }

    /**
     * Remove a value from storage
     */
    async removeItem(key: string): Promise<void> {
        try {
            const db = await this.initDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(key);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('[AuthStorage] Failed to remove item:', error);
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
            console.error('[AuthManager] Failed to load from storage:', error);
        });
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
        } catch (error) {
            console.error('[AuthManager] Failed to load from storage:', error);
        }
    }

    /**
     * Save auth state to storage
     */
    private async saveToStorage(): Promise<void> {
        try {
            if (this.state.token) {
                await this.storage.setItem('token', this.state.token);
            } else {
                await this.storage.removeItem('token');
            }

            if (this.state.refreshToken) {
                await this.storage.setItem('refreshToken', this.state.refreshToken);
            } else {
                await this.storage.removeItem('refreshToken');
            }

            if (this.state.expiresAt) {
                await this.storage.setItem('tokenExpiresAt', this.state.expiresAt.toString());
            } else {
                await this.storage.removeItem('tokenExpiresAt');
            }
        } catch (error) {
            console.error('[AuthManager] Failed to save to storage:', error);
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
            console.error('[AuthManager] Max refresh retries exceeded');
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
                if (response.status === 401) {
                    // Refresh token is invalid, clear auth state
                    console.error('[AuthManager] Refresh token invalid');
                    this.clearTokens();
                    return null;
                }

                throw new Error(`Token refresh failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.token && data.refreshToken && data.expiresIn) {
                await this.setTokens(data.token, data.refreshToken, data.expiresIn);
                this.refreshRetries = 0;
                return data.token;
            } else {
                throw new Error('Invalid token refresh response');
            }
        } catch (error) {
            this.refreshRetries++;

            if (this.refreshRetries < this.options.maxRefreshRetries) {
                // Retry after delay
                console.log(
                    `[AuthManager] Token refresh failed, retrying in ${this.options.refreshRetryDelay}ms...`
                );
                await this.delay(this.options.refreshRetryDelay);
                return this.performRefresh();
            } else {
                console.error('[AuthManager] Token refresh failed after max retries:', error);
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

export function getAuthManager(): AuthManager {
    if (!authManager) {
        authManager = new AuthManager();
    }
    return authManager;
}
