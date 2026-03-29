/**
 * Error Tracker - Global error tracking and monitoring
 * Captures uncaught errors, unhandled rejections, and console errors
 *
 * Privacy: User consent is required before collecting error data with userAgent and URL.
 * Users can opt-out at any time via settings.
 */

// Consent storage key
const CONSENT_KEY = 'error-tracking-consent';

interface ErrorContext {
    type: string;
    [key: string]: unknown;
}

interface ErrorInfo {
    message: string;
    stack: string | undefined;
    context: ErrorContext;
    timestamp: number;
    userAgent?: string;
    url?: string;
}

class ErrorTracker {
    private isInitialized = false;
    private originalConsoleError: typeof console.error | undefined;

    /**
     * Check if user has consented to error tracking
     */
    hasConsent(): boolean {
        try {
            return localStorage.getItem(CONSENT_KEY) === 'granted';
        } catch {
            return false;
        }
    }

    /**
     * Grant consent for error tracking
     */
    grantConsent(): void {
        try {
            localStorage.setItem(CONSENT_KEY, 'granted');
        } catch {
            // Ignore localStorage errors
        }
    }

    /**
     * Revoke consent for error tracking
     */
    revokeConsent(): void {
        try {
            localStorage.setItem(CONSENT_KEY, 'denied');
            // Clear any stored errors when revoking consent
            this.clearPendingErrors();
        } catch {
            // Ignore localStorage errors
        }
    }

    /**
     * Get current consent status
     */
    getConsentStatus(): 'granted' | 'denied' | 'unknown' {
        try {
            const value = localStorage.getItem(CONSENT_KEY);
            if (value === 'granted') return 'granted';
            if (value === 'denied') return 'denied';
            return 'unknown';
        } catch {
            return 'unknown';
        }
    }

    init(): void {
        if (this.isInitialized) return;

        // Store original console.error
        this.originalConsoleError = console.error;

        // Global error handler
        window.addEventListener('error', (event) => {
            this.captureException(event.error, {
                type: 'uncaught',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.captureException(event.reason, {
                type: 'unhandledrejection',
            });
        });

        // Console error proxy
        console.error = (...args: unknown[]) => {
            this.captureConsoleError(args);
            this.originalConsoleError?.apply(console, args);
        };

        this.isInitialized = true;
    }

    /**
     * Capture an exception with context
     * Only includes userAgent and URL if user has consented
     */
    captureException(error: unknown, context: Record<string, unknown>): void {
        const hasConsent = this.hasConsent();

        const errorInfo: ErrorInfo = {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            context: {
                type: (context['type'] as string) || 'unknown',
                ...context,
            },
            timestamp: Date.now(),
        };

        // Only collect user data if consent has been granted
        if (hasConsent) {
            errorInfo.userAgent = navigator.userAgent;
            errorInfo.url = window.location.href;
        }

        // Send to error tracking endpoint
        this.sendToServer(errorInfo).catch(() => {
            // Store locally for later sync
            this.storeLocally(errorInfo);
        });
    }

    /**
     * Capture console.error calls
     * Only includes userAgent and URL if user has consented
     */
    private captureConsoleError(args: unknown[]): void {
        // Don't capture if it's just a string message
        if (args.length === 1 && typeof args[0] === 'string') {
            return;
        }

        const hasConsent = this.hasConsent();

        const errorInfo: ErrorInfo = {
            message: args
                .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
                .join(' '),
            stack: undefined,
            context: {
                type: 'console.error',
                args: args.map((arg) => (arg instanceof Error ? arg.message : String(arg))),
            },
            timestamp: Date.now(),
        };

        // Only collect user data if consent has been granted
        if (hasConsent) {
            errorInfo.userAgent = navigator.userAgent;
            errorInfo.url = window.location.href;
        }

        this.sendToServer(errorInfo).catch(() => {
            this.storeLocally(errorInfo);
        });
    }

    private async sendToServer(errorInfo: ErrorInfo): Promise<void> {
        // Errors are stored locally only - no server endpoint exists for error tracking
        // The /api/errors endpoint is not implemented, so we skip network request
        // This preserves errors locally for debugging purposes
        this.storeLocally(errorInfo);
    }

    private storeLocally(errorInfo: ErrorInfo): void {
        try {
            const errors = JSON.parse(localStorage.getItem('pending-errors') || '[]');
            errors.push(errorInfo);
            // Keep last 50 errors
            localStorage.setItem('pending-errors', JSON.stringify(errors.slice(-50)));
        } catch {
            // Ignore localStorage errors
        }
    }

    /**
     * Get pending errors stored locally
     */
    getPendingErrors(): ErrorInfo[] {
        try {
            return JSON.parse(localStorage.getItem('pending-errors') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Clear pending errors
     */
    clearPendingErrors(): void {
        try {
            localStorage.removeItem('pending-errors');
        } catch {
            // Ignore localStorage errors
        }
    }
}

export const errorTracker = new ErrorTracker();
