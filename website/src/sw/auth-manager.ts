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

export class AuthManager {
    private state: AuthState;
    private options: AuthManagerOptions;
    private refreshPromise: Promise<string | null> | null = null;
    private refreshRetries: number = 0;

    constructor(options: Partial<AuthManagerOptions> = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.state = {
            token: null,
            refreshToken: null,
            expiresAt: null,
            isRefreshing: false,
        };

        this.loadFromStorage();
    }

    /**
     * Load auth state from storage
     */
    private loadFromStorage(): void {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refreshToken');
            const expiresAt = localStorage.getItem('tokenExpiresAt');

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
    private saveToStorage(): void {
        try {
            if (this.state.token) {
                localStorage.setItem('token', this.state.token);
            } else {
                localStorage.removeItem('token');
            }

            if (this.state.refreshToken) {
                localStorage.setItem('refreshToken', this.state.refreshToken);
            } else {
                localStorage.removeItem('refreshToken');
            }

            if (this.state.expiresAt) {
                localStorage.setItem('tokenExpiresAt', this.state.expiresAt.toString());
            } else {
                localStorage.removeItem('tokenExpiresAt');
            }
        } catch (error) {
            console.error('[AuthManager] Failed to save to storage:', error);
        }
    }

    /**
     * Set authentication tokens
     */
    setTokens(token: string, refreshToken: string, expiresIn: number): void {
        this.state.token = token;
        this.state.refreshToken = refreshToken;
        this.state.expiresAt = Date.now() + expiresIn * 1000;
        this.refreshRetries = 0;

        this.saveToStorage();
    }

    /**
     * Clear authentication tokens
     */
    clearTokens(): void {
        this.state.token = null;
        this.state.refreshToken = null;
        this.state.expiresAt = null;
        this.refreshRetries = 0;
        this.refreshPromise = null;

        this.saveToStorage();
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
                this.setTokens(data.token, data.refreshToken, data.expiresIn);
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
                this.clearTokens();
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
