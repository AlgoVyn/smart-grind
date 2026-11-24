// Auth Manager Module for SmartGrind Service Worker
// Handles authentication token management
// Uses IndexedDB for storage (localStorage is not available in Service Workers)
//
// SECURITY: Tokens are stored in httpOnly cookies on the server side. This manager
// stores tokens in IndexedDB for Service Worker access. Fresh tokens are obtained
// via the /api/auth?action=token endpoint which reads the httpOnly cookie.

interface AuthState {
    token: string | null;
    expiresAt: number | null;
    isFetchingToken: boolean;
}

interface AuthManagerOptions {
    tokenRefreshThreshold: number; // Fetch new token if expires within this time (ms)
    onAuthFailure?: () => void; // Callback when authentication fails completely
}

const DEFAULT_OPTIONS: AuthManagerOptions = {
    tokenRefreshThreshold: 300000, // 5 minutes - refresh before expiry
};

/** First pause after a 401 / missing session, then doubles up to the max. */
const AUTH_BACKOFF_BASE_MS = 2 * 60 * 1000;
const AUTH_BACKOFF_MAX_MS = 30 * 60 * 1000;

// IndexedDB configuration for auth storage
const AUTH_DB_NAME = 'smartgrind-auth';
const AUTH_DB_VERSION = 1;
const AUTH_STORE_NAME = 'auth-tokens';

/**
 * Helper to promisify IndexedDB requests
 */
import { promisifyRequest } from '../utils/indexeddb-helper';

/**
 * AuthStorage class using IndexedDB (compatible with Service Workers)
 */
class AuthStorage {
    private db: IDBDatabase | null = null;
    private dbInitPromise: Promise<IDBDatabase> | null = null;

    private async initDB(): Promise<IDBDatabase> {
        // Return existing database if already initialized
        if (this.db) return this.db;

        // If initialization is already in progress, wait for it
        if (this.dbInitPromise) {
            return this.dbInitPromise;
        }

        // Create new initialization promise with proper locking
        this.dbInitPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(AUTH_DB_NAME, AUTH_DB_VERSION);

            request.onerror = () => {
                console.error('[AuthStorage] IndexedDB initialization error:', request.error);
                reject(request.error);
            };
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

        try {
            return await this.dbInitPromise;
        } finally {
            // Clear the promise so future calls can reinitialize if needed
            this.dbInitPromise = null;
        }
    }

    private async getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.initDB();
        return db.transaction(AUTH_STORE_NAME, mode).objectStore(AUTH_STORE_NAME);
    }

    async getItem(key: string): Promise<string | null> {
        try {
            const store = await this.getStore('readonly');
            const result = await promisifyRequest(store.get(key));
            return result?.value ?? null;
        } catch (error) {
            console.error(`[AuthStorage] Failed to get item '${key}':`, error);
            return null;
        }
    }

    async setItem(key: string, value: string): Promise<void> {
        try {
            const store = await this.getStore('readwrite');
            await promisifyRequest(store.put({ key, value }));
        } catch (error) {
            console.error(`[AuthStorage] Failed to set item '${key}':`, error);
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            const store = await this.getStore('readwrite');
            await promisifyRequest(store.delete(key));
        } catch (error) {
            console.error(`[AuthStorage] Failed to remove item '${key}':`, error);
        }
    }

    async clear(): Promise<void> {
        try {
            const store = await this.getStore('readwrite');
            await promisifyRequest(store.clear());
        } catch (error) {
            console.error('[AuthStorage] Failed to clear storage:', error);
        }
    }
}

export class AuthManager {
    private state: AuthState;
    private options: AuthManagerOptions;
    private tokenFetchPromise: Promise<string | null> | null = null;
    private storage: AuthStorage;
    /** Do not hit /api/auth?action=token until this time (signed out / 401 backoff). */
    private signedOutUntil = 0;
    private backoffMs = AUTH_BACKOFF_BASE_MS;

    constructor(options: Partial<AuthManagerOptions> = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.state = {
            token: null,
            expiresAt: null,
            isFetchingToken: false,
        };
        this.storage = new AuthStorage();
        // Load from storage asynchronously
        this.loadFromStorage().catch((error) => {
            console.error('[AuthManager] Failed to load auth from storage:', error);
        });
    }

    private isTabHidden(): boolean {
        return typeof document !== 'undefined' && document.visibilityState === 'hidden';
    }

    private isInAuthBackoff(): boolean {
        return Date.now() < this.signedOutUntil;
    }

    private beginAuthBackoff(): void {
        this.signedOutUntil = Date.now() + this.backoffMs;
        this.backoffMs = Math.min(this.backoffMs * 2, AUTH_BACKOFF_MAX_MS);
    }

    private clearAuthBackoff(): void {
        this.signedOutUntil = 0;
        this.backoffMs = AUTH_BACKOFF_BASE_MS;
    }

    /** True when a token refresh / cookie probe should be attempted. */
    canAttemptNetworkAuth(): boolean {
        return !this.isTabHidden() && !this.isInAuthBackoff();
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
            const [token, expiresAt] = await Promise.all([
                this.storage.getItem('token'),
                this.storage.getItem('tokenExpiresAt'),
            ]);

            this.state.token = token;
            this.state.expiresAt = expiresAt ? parseInt(expiresAt, 10) : null;
        } catch (error) {
            console.error('[AuthManager] Failed to load auth state from storage:', error);
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

            if (this.state.expiresAt) {
                promises.push(
                    this.storage.setItem('tokenExpiresAt', this.state.expiresAt.toString())
                );
            } else {
                promises.push(this.storage.removeItem('tokenExpiresAt'));
            }

            await Promise.all(promises);
        } catch (error) {
            console.error('[AuthManager] Failed to save auth state to storage:', error);
        }
    }

    /**
     * Set authentication tokens
     * @param token - The JWT token
     * @param expiresIn - Token expiration time in seconds
     */
    async setTokens(token: string, expiresIn: number): Promise<void> {
        this.state.token = token;
        this.state.expiresAt = Date.now() + expiresIn * 1000;
        this.clearAuthBackoff();

        await this.saveToStorage();
    }

    /**
     * Clear authentication tokens
     */
    async clearTokens(): Promise<void> {
        this.state.token = null;
        this.state.expiresAt = null;
        this.tokenFetchPromise = null;

        await this.saveToStorage();

        // Notify that auth has failed
        this.options.onAuthFailure?.();
    }

    /**
     * Check if token needs refresh (is expired or expiring soon)
     */
    /**
     * Refresh only when a token already exists and is near expiry.
     * No token and no session must not trigger /api/auth?action=token probes.
     */
    private needsRefresh(): boolean {
        if (!this.canAttemptNetworkAuth()) {
            return false;
        }
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
     * Fetch a fresh token from the server using the httpOnly cookie
     * This endpoint reads the auth_token cookie set during OAuth login
     */
    private async fetchFreshToken(): Promise<string | null> {
        if (!this.canAttemptNetworkAuth()) {
            return null;
        }
        // If already fetching, return the existing promise
        if (this.tokenFetchPromise) {
            return this.tokenFetchPromise;
        }

        this.tokenFetchPromise = this.performTokenFetch();
        return this.tokenFetchPromise;
    }

    /**
     * Perform the actual token fetch from the server
     */
    private async performTokenFetch(): Promise<string | null> {
        try {
            this.state.isFetchingToken = true;

            const response = await fetch('/smartgrind/api/auth?action=token', {
                method: 'GET',
                credentials: 'include', // Important: sends httpOnly cookies
            });

            if (response.status === 401 || response.status === 403) {
                // Expected when the cookie session is absent or expired. This is
                // not an application error, and logging it as one made normal
                // signed-out/local usage look broken in the console.
                console.debug('[AuthManager] No active cookie session:', response.status);
                this.beginAuthBackoff();
                return null;
            }

            if (!response.ok) {
                console.warn('[AuthManager] Token fetch failed:', response.status);
                if (response.status === 429) {
                    this.beginAuthBackoff();
                }
                return null;
            }

            const data = (await response.json()) as {
                token: string;
                userId: string;
                displayName: string;
                expiresIn: number;
            };

            if (!data.token) {
                console.warn('[AuthManager] No token in response');
                this.beginAuthBackoff();
                return null;
            }

            // Store the new token
            await this.setTokens(data.token, data.expiresIn);
            return data.token;
        } catch (error) {
            console.error('[AuthManager] Token fetch error:', error);
            this.beginAuthBackoff();
            return null;
        } finally {
            this.state.isFetchingToken = false;
            this.tokenFetchPromise = null;
        }
    }

    /**
     * Get current token, fetching a new one if needed or about to expire
     * @returns The token or null if not authenticated
     */
    async getToken(): Promise<string | null> {
        // No token in IndexedDB means this device never established an SW
        // session (local mode or signed out). Do not probe the cookie-token
        // endpoint in that case: it can only answer 401 and used to spam the
        // console on every sync attempt. Cookie-only auth is still checked by
        // the sync manager's CSRF probe.
        if (!this.state.token) {
            return null;
        }

        // If token is about to expire, fetch a fresh one
        if (this.needsRefresh()) {
            const newToken = await this.fetchFreshToken();
            if (newToken) {
                return newToken;
            }
            // If fetch failed but we have a non-expired token, use it
            if (this.state.token && !this.isTokenExpired()) {
                return this.state.token;
            }
            return null;
        }

        if (!this.state.token || this.isTokenExpired()) {
            return null;
        }
        return this.state.token;
    }

    /**
     * Handle 401/403 response by fetching a fresh token
     */
    async handleAuthError(response: Response): Promise<boolean> {
        if (response.status === 401 || response.status === 403) {
            if (!this.canAttemptNetworkAuth()) {
                return false;
            }
            const newToken = await this.fetchFreshToken();
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
     * Get current auth state (for debugging)
     */
    getState(): AuthState {
        return {
            ...this.state,
            isFetchingToken: this.state.isFetchingToken,
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
