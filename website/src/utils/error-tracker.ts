/**
 * Error Tracker - Global error tracking and monitoring
 * Captures uncaught errors, unhandled rejections, and console errors
 */

interface ErrorContext {
    type: string;
    [key: string]: unknown;
}

interface ErrorInfo {
    message: string;
    stack: string | undefined;
    context: ErrorContext;
    timestamp: number;
    userAgent: string;
    url: string;
}

class ErrorTracker {
    private isInitialized = false;
    private originalConsoleError: typeof console.error | undefined;

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
     */
    captureException(error: unknown, context: Record<string, unknown>): void {
        const errorInfo: ErrorInfo = {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            context: {
                type: (context['type'] as string) || 'unknown',
                ...context,
            },
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
        };

        // Send to error tracking endpoint
        this.sendToServer(errorInfo).catch(() => {
            // Store locally for later sync
            this.storeLocally(errorInfo);
        });
    }

    /**
     * Capture console.error calls
     */
    private captureConsoleError(args: unknown[]): void {
        // Don't capture if it's just a string message
        if (args.length === 1 && typeof args[0] === 'string') {
            return;
        }

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
            userAgent: navigator.userAgent,
            url: window.location.href,
        };

        this.sendToServer(errorInfo).catch(() => {
            this.storeLocally(errorInfo);
        });
    }

    private async sendToServer(errorInfo: ErrorInfo): Promise<void> {
        // Only send in production or if explicitly enabled
        if (process.env['NODE_ENV'] !== 'production') {
            return;
        }

        const response = await fetch('/api/errors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(errorInfo),
        });

        if (!response.ok) {
            throw new Error('Failed to send error to server');
        }
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
        localStorage.removeItem('pending-errors');
    }
}

export const errorTracker = new ErrorTracker();
