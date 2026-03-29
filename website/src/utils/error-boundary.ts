// --- ERROR BOUNDARY SYSTEM ---
// Provides error catching and fallback UI for critical app sections
// Similar to React Error Boundaries but for vanilla TypeScript

import { showToast } from './toast';
import { errorTracker } from './error-tracker';

export interface ErrorBoundaryOptions {
    /** Name of the component/section for error reporting */
    name: string;
    /** Container element to render fallback UI into */
    container?: HTMLElement | null;
    /** Whether to show toast notification on error */
    showToast?: boolean;
    /** Whether to report to error tracker */
    reportError?: boolean;
    /** Custom fallback UI HTML */
    fallbackHtml?: string;
    /** Callback when error is caught */
    onError?: (error: Error, errorInfo: string) => void;
    /** Callback for recovery attempt */
    onRecover?: () => void;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: string;
}

/**
 * Creates an error boundary wrapper for a function
 * Catches synchronous and asynchronous errors
 */
export const createErrorBoundary = (options: ErrorBoundaryOptions) => {
    const {
        name,
        container,
        showToast: showToastOnError = true,
        reportError: report = true,
        fallbackHtml,
        onError,
        onRecover,
    } = options;

    const state: ErrorBoundaryState = {
        hasError: false,
        error: null,
        errorInfo: '',
    };

    /**
     * Render fallback UI when error occurs
     */
    const renderFallback = (error: Error): void => {
        if (!container) return;

        const defaultFallback = `
            <div class="error-boundary-fallback p-6 text-center">
                <div class="text-4xl mb-4">⚠️</div>
                <h3 class="text-lg font-semibold text-theme-bold mb-2">Something went wrong</h3>
                <p class="text-sm text-theme-muted mb-4">${error.message}</p>
                <button 
                    class="retry-btn px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm transition-colors"
                    data-action="retry"
                >
                    Try Again
                </button>
            </div>
        `;

        container.innerHTML = fallbackHtml || defaultFallback;

        // Set up retry button
        const retryBtn = container.querySelector('[data-action="retry"]');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                reset();
                if (onRecover) {
                    onRecover();
                }
            });
        }
    };

    /**
     * Handle caught error
     */
    const handleError = (error: Error, errorInfo = ''): void => {
        state.hasError = true;
        state.error = error;
        state.errorInfo = errorInfo;

        // Report to error tracker
        if (report) {
            errorTracker.captureException(error, {
                context: `ErrorBoundary:${name}`,
                errorInfo,
            });
        }

        // Show toast
        if (showToastOnError) {
            showToast(`Error in ${name}: ${error.message}`, 'error');
        }

        // Render fallback UI
        renderFallback(error);

        // Call custom error handler
        if (onError) {
            onError(error, errorInfo);
        }

        console.error(`[ErrorBoundary:${name}]`, error, errorInfo);
    };

    /**
     * Reset error boundary state
     */
    const reset = (): void => {
        state.hasError = false;
        state.error = null;
        state.errorInfo = '';
    };

    /**
     * Wrap a function with error boundary
     */
    const wrap = <T extends (...args: unknown[]) => unknown>(
        fn: T,
        context = ''
    ): ((...args: Parameters<T>) => unknown) => {
        return (...args: Parameters<T>): unknown => {
            if (state.hasError) {
                reset();
            }

            try {
                const result = fn(...args);

                // Handle promises
                if (result instanceof Promise) {
                    return result.catch((error): undefined => {
                        handleError(
                            error instanceof Error ? error : new Error(String(error)),
                            context
                        );
                        return undefined;
                    });
                }

                return result;
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), context);
                return undefined;
            }
        };
    };

    /**
     * Wrap an async function with error boundary
     */
    const wrapAsync = <T extends (...args: unknown[]) => Promise<unknown>>(
        fn: T,
        context = ''
    ): ((...args: Parameters<T>) => Promise<ReturnType<T> | undefined>) => {
        return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
            if (state.hasError) {
                reset();
            }

            try {
                return (await fn(...args)) as ReturnType<T>;
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), context);
                return undefined;
            }
        };
    };

    /**
     * Execute a function within error boundary without wrapping
     */
    const execute = <T>(fn: () => T, context = ''): T | undefined => {
        if (state.hasError) {
            reset();
        }

        try {
            const result = fn();

            // Handle promises
            if (result instanceof Promise) {
                return result.catch((error) => {
                    handleError(error instanceof Error ? error : new Error(String(error)), context);
                    return undefined;
                }) as T;
            }

            return result;
        } catch (error) {
            handleError(error instanceof Error ? error : new Error(String(error)), context);
            return undefined;
        }
    };

    return {
        wrap,
        wrapAsync,
        execute,
        reset,
        getState: () => ({ ...state }),
        handleError,
    };
};

/**
 * Global error boundary for critical app sections
 */
export const createGlobalErrorBoundary = () => {
    /**
     * Setup global error handlers
     */
    const setupGlobalHandlers = (): void => {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            errorTracker.captureException(event.error || new Error(event.message), {
                context: 'GlobalErrorHandler',
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
            });
            showToast('An unexpected error occurred', 'error');
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            const error =
                event.reason instanceof Error ? event.reason : new Error(String(event.reason));

            errorTracker.captureException(error, {
                context: 'UnhandledPromiseRejection',
            });
            showToast('An async operation failed', 'error');
        });
    };

    return { setupGlobalHandlers };
};

/**
 * Error boundary presets for common use cases
 */
export const errorBoundaryPresets = {
    /**
     * For main view rendering
     */
    mainView: (container: HTMLElement) =>
        createErrorBoundary({
            name: 'MainView',
            container,
            fallbackHtml: `
            <div class="p-8 text-center">
                <div class="text-4xl mb-4">📄</div>
                <h3 class="text-lg font-semibold text-theme-bold mb-2">Failed to load view</h3>
                <p class="text-sm text-theme-muted mb-4">There was an error loading this section.</p>
                <button 
                    class="retry-btn px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm transition-colors"
                    data-action="retry"
                >
                    Reload
                </button>
            </div>
        `,
        }),

    /**
     * For sidebar rendering
     */
    sidebar: (container: HTMLElement) =>
        createErrorBoundary({
            name: 'Sidebar',
            container,
            showToast: false,
            fallbackHtml: `
            <div class="p-4 text-center text-theme-muted text-sm">
                <p>Sidebar unavailable</p>
            </div>
        `,
        }),

    /**
     * For modal dialogs
     */
    modal: (container: HTMLElement, name: string) =>
        createErrorBoundary({
            name: `Modal:${name}`,
            container,
            fallbackHtml: `
            <div class="p-6 text-center">
                <p class="text-theme-muted mb-4">This dialog failed to load.</p>
                <button 
                    class="retry-btn px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm transition-colors"
                    data-action="retry"
                >
                    Try Again
                </button>
            </div>
        `,
        }),

    /**
     * For data loading operations
     */
    dataLoad: (name: string) =>
        createErrorBoundary({
            name: `DataLoad:${name}`,
            showToast: true,
            reportError: true,
        }),
};
