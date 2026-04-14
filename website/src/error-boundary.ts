// --- ERROR BOUNDARY MODULE ---
// Global error handling utilities

import { ui } from './ui/ui';
import { escapeHtml } from './utils';

/**
 * Extracts an error message from an unknown error value.
 */
const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : String(error);

/**
 * Global Error Boundary for application-level error handling
 */
export class AppErrorBoundary {
    private errorContainer: HTMLElement | null = null;
    private hasError = false;

    constructor(containerId: string) {
        this.errorContainer = document.getElementById(containerId);
    }

    async execute<T>(fn: () => Promise<T> | T, fallbackContent?: string): Promise<T | null> {
        if (this.hasError) {
            this.reset();
        }

        try {
            return await fn();
        } catch (_error) {
            this.handleError(_error, fallbackContent);
            return null;
        }
    }

    private handleError(error: unknown, fallbackContent?: string): void {
        this.hasError = true;
        console.error('[AppErrorBoundary] Caught error:', error);
        const message = getErrorMessage(error);

        // Show user-friendly alert
        ui.showAlert(`An error occurred: ${message}`);

        if (this.errorContainer) {
            this.errorContainer.innerHTML =
                fallbackContent ||
                `
                <div class="error-fallback p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <div class="flex items-start gap-4">
                        <div class="shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-red-400 mb-2">Application Error</h3>
                            <p class="text-sm text-theme-muted mb-4">${escapeHtml(message)}</p>
                            <button onclick="location.reload()" 
                                    class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg 
                                           text-sm font-medium transition-colors">
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    reset(): void {
        this.hasError = false;
        if (this.errorContainer) {
            this.errorContainer.innerHTML = '';
        }
    }
}

/**
 * Get UI showAlert function safely
 */
function getUI(): { showAlert: (_msg: string) => void } | undefined {
    return (window as unknown as { SmartGrind?: { ui?: { showAlert: (_msg: string) => void } } })
        .SmartGrind?.ui;
}

/**
 * Setup global error handlers for window-level errors
 */
export const setupGlobalErrorHandlers = (): void => {
    if (typeof window === 'undefined') return;

    // Handle synchronous errors
    window.addEventListener('error', (event) => {
        const error = event.error;
        const message = event.message || (error ? error.message : 'Unknown error');
        console.error('[Global Error]', error || message, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        });

        // Don't show alerts for network errors or external script errors
        // Check both filename and error stack to catch bundled code errors
        const isOwnCode =
            event.filename?.includes('smartgrind') ||
            error?.stack?.includes('smartgrind') ||
            message?.includes('smartgrind');
        if (isOwnCode) {
            getUI()?.showAlert(`An error occurred: ${message}`);
        }

        event.preventDefault();
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const message = event.reason instanceof Error ? event.reason.message : String(event.reason);
        console.error('[Unhandled Rejection]', event.reason);

        // Only show UI for errors from our own code
        if (
            event.reason?.stack?.includes('smartgrind') ||
            event.reason?.toString().includes('smartgrind')
        ) {
            getUI()?.showAlert(`An error occurred: ${message}`);
        }

        event.preventDefault();
    });
};

/**
 * Async operation wrapper with error handling
 */
export const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Operation failed'
): Promise<T | null> => {
    try {
        return await operation();
    } catch (_error) {
        console.error(`[withErrorHandling] ${errorMessage}:`, _error);
        ui.showAlert(`${errorMessage}: ${getErrorMessage(_error)}`);
        return null;
    }
};

/**
 * Synchronous operation wrapper with error handling
 */
export const withSyncErrorHandling = <T>(
    operation: () => T,
    errorMessage: string = 'Operation failed'
): T | null => {
    try {
        return operation();
    } catch (_error) {
        console.error(`[withSyncErrorHandling] ${errorMessage}:`, _error);
        ui.showAlert(`${errorMessage}: ${getErrorMessage(_error)}`);
        return null;
    }
};

/**
 * Safe wrapper for DOM operations
 */
export const safeDOMOperation = <T>(
    operation: () => T,
    fallback: T,
    context: string = 'DOM operation'
): T => {
    try {
        return operation();
    } catch (_error) {
        console.error(`[safeDOMOperation] ${context}:`, _error);
        return fallback;
    }
};

/**
 * Create a safe version of any function with error boundary support
 */
export const createSafeFunction = <T extends (..._args: unknown[]) => unknown>(
    fn: T,
    errorMessage: string,
    onError?: (_error: Error) => void
): ((..._args: Parameters<T>) => ReturnType<T> | null) => {
    return (...args: Parameters<T>): ReturnType<T> | null => {
        try {
            const result = fn(...args);

            // Handle async functions
            if (result instanceof Promise) {
                return result.catch((_error: unknown) => {
                    const err = _error instanceof Error ? _error : new Error(String(_error));
                    console.error(`[createSafeFunction] ${errorMessage}:`, err);
                    onError?.(err);
                    return null;
                }) as ReturnType<T>;
            }

            return result as ReturnType<T>;
        } catch (_error) {
            const err = _error instanceof Error ? _error : new Error(String(_error));
            console.error(`[createSafeFunction] ${errorMessage}:`, err);
            onError?.(err);
            return null as ReturnType<T>;
        }
    };
};

// Global error boundary instance for the main app
export const appErrorBoundary =
    typeof window !== 'undefined' ? new AppErrorBoundary('app-wrapper') : null;

// Initialize global error handlers on module load
if (typeof window !== 'undefined') {
    setupGlobalErrorHandlers();
}

// Backward compatibility alias for existing tests
export { AppErrorBoundary as ErrorBoundary };
