// Connectivity Checker Module for SmartGrind
// Provides reliable network detection beyond navigator.onLine

interface ConnectivityState {
    isOnline: boolean;
    lastChecked: number;
    checkInProgress: boolean;
    consecutiveFailures: number;
}

interface ConnectivityOptions {
    checkInterval: number;
    timeout: number;
    maxRetries: number;
    backoffMultiplier: number;
}

const DEFAULT_OPTIONS: ConnectivityOptions = {
    checkInterval: 10000, // 10 seconds
    timeout: 3000, // 3 seconds
    maxRetries: 3,
    backoffMultiplier: 2,
};

export class ConnectivityChecker {
    private state: ConnectivityState;
    private options: ConnectivityOptions;
    private checkIntervalId: number | null = null;
    private listeners: Set<(_online: boolean) => void> = new Set();
    private abortController: AbortController | null = null;

    constructor(options: Partial<ConnectivityOptions> = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.state = {
            isOnline: navigator.onLine,
            lastChecked: Date.now(),
            checkInProgress: false,
            consecutiveFailures: 0,
        };

        this.setupEventListeners();
    }

    /**
     * Initialize connectivity monitoring
     */
    startMonitoring(): void {
        // Initial check
        this.checkConnectivity();

        // Set up periodic checks
        this.checkIntervalId = window.setInterval(() => {
            this.checkConnectivity();
        }, this.options.checkInterval);
    }

    /**
     * Stop connectivity monitoring
     */
    stopMonitoring(): void {
        if (this.checkIntervalId !== null) {
            clearInterval(this.checkIntervalId);
            this.checkIntervalId = null;
        }

        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    /**
     * Perform actual connectivity check by pinging the server
     */
    async checkConnectivity(): Promise<boolean> {
        if (this.state.checkInProgress) {
            return this.state.isOnline;
        }

        this.state.checkInProgress = true;

        try {
            // Cancel any previous check
            if (this.abortController) {
                this.abortController.abort();
            }
            this.abortController = new AbortController();

            const timeoutId = setTimeout(() => {
                this.abortController?.abort();
            }, this.options.timeout);

            // Try to fetch the root or a static asset
            const response = await fetch('/smartgrind/', {
                method: 'HEAD',
                signal: this.abortController.signal,
                cache: 'no-store',
                credentials: 'same-origin',
            });

            clearTimeout(timeoutId);

            const wasOffline = !this.state.isOnline;
            this.state.isOnline = response.ok;
            this.state.lastChecked = Date.now();

            if (response.ok) {
                this.state.consecutiveFailures = 0;
            } else {
                this.state.consecutiveFailures++;
            }

            // Notify listeners if state changed
            if (wasOffline && this.state.isOnline) {
                this.notifyListeners(true);
            } else if (!wasOffline && !this.state.isOnline) {
                this.notifyListeners(false);
            }

            return this.state.isOnline;
        } catch (_error) {
            // Network error - we're offline
            const wasOnline = this.state.isOnline;
            this.state.isOnline = false;
            this.state.consecutiveFailures++;
            this.state.lastChecked = Date.now();

            if (wasOnline) {
                this.notifyListeners(false);
            }

            return false;
        } finally {
            this.state.checkInProgress = false;
        }
    }

    /**
     * Get current connectivity state
     */
    getState(): ConnectivityState {
        return { ...this.state };
    }

    /**
     * Check if currently online with actual verification
     * Optimized for fast return when online to avoid blocking saves
     */
    async isOnline(): Promise<boolean> {
        // Fast path: if we're online and checked recently, return cached state
        // Use a longer cache time when online (10s) vs offline (5s)
        const cacheTime = this.state.isOnline ? 10000 : 5000;
        if (Date.now() - this.state.lastChecked < cacheTime) {
            return this.state.isOnline;
        }

        // Only do network check if we might be offline or cache is stale
        return this.checkConnectivity();
    }

    /** Force a fresh connectivity check, bypassing cache */
    async forceCheck(): Promise<boolean> {
        this.state.lastChecked = 0;
        return this.checkConnectivity();
    }

    /** Alias for forceCheck - for backward compatibility */
    async forceFreshCheck(): Promise<boolean> {
        return this.forceCheck();
    }

    /**
     * Manually set online status (used when browser reports offline)
     */
    setOnlineStatus(online: boolean): void {
        const changed = this.state.isOnline !== online;
        this.state.isOnline = online;
        this.state.lastChecked = Date.now();

        if (!online) {
            this.state.consecutiveFailures++;
        } else {
            this.state.consecutiveFailures = 0;
        }

        if (changed) {
            this.notifyListeners(online);
        }
    }

    /**
     * Subscribe to connectivity changes
     */
    onConnectivityChange(callback: (_online: boolean) => void): () => void {
        this.listeners.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * Notify all listeners of connectivity change
     */
    private notifyListeners(_online: boolean): void {
        this.listeners.forEach((callback) => {
            try {
                callback(_online);
            } catch {
                // Listener error ignored
            }
        });
    }

    /**
     * Set up browser online/offline event listeners
     */
    private setupEventListeners(): void {
        // Browser online event - force fresh check
        window.addEventListener('online', () => {
            this.state.lastChecked = 0;
            this.checkConnectivity().catch((error) => {
                console.warn('[ConnectivityChecker] Online check failed:', error);
            });
        });

        // Browser offline event
        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.notifyListeners(false);
        });

        // Check connectivity when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.state.lastChecked = 0;
                this.checkConnectivity().catch(() => {});
            }
        });
    }

    /**
     * Get recommended retry delay based on consecutive failures
     */
    getRetryDelay(): number {
        const baseDelay = 1000; // 1 second
        const delay =
            baseDelay * Math.pow(this.options.backoffMultiplier, this.state.consecutiveFailures);
        return Math.min(delay, 30000); // Cap at 30 seconds
    }
}

// Singleton instance
let connectivityChecker: ConnectivityChecker | null = null;

export function getConnectivityChecker(): ConnectivityChecker {
    if (!connectivityChecker) {
        connectivityChecker = new ConnectivityChecker();
    }
    return connectivityChecker;
}

export function initConnectivityMonitoring(): ConnectivityChecker {
    const checker = getConnectivityChecker();
    checker.startMonitoring();
    return checker;
}
