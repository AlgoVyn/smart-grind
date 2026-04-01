// --- RENDERER ERROR BOUNDARY MODULE ---
// React-style error boundaries for vanilla JS renderers
// Catches errors during rendering and displays fallback UI

import { showToast } from '../utils';

export interface ErrorBoundaryOptions {
    /** Container element ID where errors will be displayed */
    containerId: string;
    /** Fallback HTML to show when an error occurs */
    fallbackHtml?: string;
    /** Whether to show toast notification on error */
    showToastNotification?: boolean;
    /** Custom error handler */
    onError?: (_error: Error, _errorInfo: ErrorInfo) => void;
    /** Whether to reset container content on successful render */
    resetOnSuccess?: boolean;
}

export interface ErrorInfo {
    componentStack: string;
    timestamp: number;
    containerId: string;
}

export interface RenderResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: Error;
    errorInfo?: ErrorInfo;
}

/**
 * Sanitize stack trace to remove sensitive path information
 * SECURITY: Prevents exposing full file system paths in error details
 */
const sanitizeStackTrace = (stack: string): string => {
    if (!stack) return 'No stack trace available';

    return (
        stack
            // Remove user home directories (Unix/Linux/Mac)
            .replace(/\/home\/[^/]+/g, '/~')
            .replace(/\/Users\/[^/]+/g, '/~')
            // Remove Windows user profiles
            .replace(/C:\\Users\\[^\\]+/gi, 'C:\\~')
            // Remove node_modules paths (often contain username)
            .replace(/node_modules\/[^/]+/g, 'node_modules/...')
            // Remove absolute paths, keep relative
            .replace(/\s+at\s+\/[^ ]+/g, (match) => {
                const parts = match.split('/');
                const relevant = parts.slice(-2).join('/');
                return `    at .../${relevant}`;
            })
            // Remove query strings from URLs
            .replace(/\?[^\s]*/g, '')
    );
};

/**
 * Renderer Error Boundary
 *
 * Provides React-style error boundary functionality for vanilla JS renderers.
 * Wraps render functions and catches errors, displaying fallback UI.
 *
 * @example
 * const boundary = new RendererErrorBoundary({
 *   containerId: 'problems-container',
 *   fallbackHtml: '<p>Failed to load problems</p>'
 * });
 *
 * const result = boundary.render(() => {
 *   return renderProblemsList();
 * });
 */
export class RendererErrorBoundary {
    private options: Required<ErrorBoundaryOptions>;
    private errorCount = 0;
    private lastError: Error | null = null;
    private lastErrorTime: number | null = null;
    /** Track if event delegation is set up to prevent duplicates */
    private hasEventDelegation = false;
    /** Reference to the container for event delegation cleanup */
    private currentContainer: HTMLElement | null = null;

    constructor(options: ErrorBoundaryOptions) {
        this.options = {
            fallbackHtml: this.getDefaultFallbackHtml(),
            showToastNotification: true,
            resetOnSuccess: true,
            onError: (_error: Error, _errorInfo: ErrorInfo) => {},
            ...options,
        };
        // Bind the delegated handler so we can add/remove it properly
        this.handleDelegatedClick = this.handleDelegatedClick.bind(this);
    }

    private getDefaultFallbackHtml(): string {
        return `
            <div class="error-boundary-fallback p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div class="flex items-start gap-4">
                    <div class="shrink-0">
                        <svg class="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-red-400 mb-2">Something went wrong</h3>
                        <p class="text-sm text-theme-muted mb-4">
                            We encountered an error while rendering this content. 
                            This might be a temporary issue.
                        </p>
                        <div class="flex gap-3">
                            <button class="error-retry-btn px-4 py-2 bg-brand-600 hover:bg-brand-500 
                                         text-white rounded-lg text-sm font-medium transition-colors"
                                    data-action="error-retry">
                                Try Again
                            </button>
                            <button class="error-reload-btn px-4 py-2 bg-dark-800 hover:bg-dark-900 
                                         border border-theme rounded-lg text-sm text-theme-base 
                                         transition-colors"
                                    data-action="error-reload">
                                Reload Page
                            </button>
                        </div>
                        <details class="mt-4">
                            <summary class="text-xs text-theme-muted cursor-pointer hover:text-theme-base">
                                Technical Details
                            </summary>
                            <pre class="mt-2 p-3 bg-dark-950 rounded text-xs text-red-400 font-mono overflow-x-auto">
                                <code class="error-details">Loading...</code>
                            </pre>
                        </details>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Handle delegated click events from the fallback UI
     * This approach prevents memory leaks from orphaned event listeners
     */
    private handleDelegatedClick(event: Event): void {
        const target = event.target as HTMLElement;
        const action = target.closest('[data-action]')?.getAttribute('data-action');

        if (!action || !this.currentContainer) return;

        switch (action) {
            case 'error-retry':
                event.preventDefault();
                event.stopPropagation();
                this.retry(this.currentContainer);
                break;
            case 'error-reload':
                event.preventDefault();
                event.stopPropagation();
                window.location.reload();
                break;
        }
    }

    /**
     * Setup event delegation for fallback UI buttons
     * More efficient than individual listeners and easier to clean up
     */
    private setupEventDelegation(container: HTMLElement): void {
        // Remove any existing delegation first to prevent duplicates
        this.cleanupEventListeners();

        this.currentContainer = container;
        this.hasEventDelegation = true;

        // Use event delegation on the container
        container.addEventListener('click', this.handleDelegatedClick);
    }

    /**
     * Clean up event delegation to prevent memory leaks
     * Called when clearing error state or destroying the boundary
     */
    private cleanupEventListeners(): void {
        if (this.hasEventDelegation && this.currentContainer) {
            this.currentContainer.removeEventListener('click', this.handleDelegatedClick);
            this.hasEventDelegation = false;
        }
        this.currentContainer = null;
    }

    /**
     * Execute a render function within the error boundary
     */
    render<T>(renderFn: () => T): RenderResult<T> {
        const container = document.getElementById(this.options.containerId);

        if (!container) {
            const error = new Error(
                `Container element with id '${this.options.containerId}' not found`
            );
            return this.handleError(error, null);
        }

        try {
            // Clear previous errors if resetOnSuccess is true
            if (this.options.resetOnSuccess) {
                this.clearErrorState(container);
            }

            const result = renderFn();

            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return this.handleError(
                error instanceof Error ? error : new Error(String(error)),
                container
            );
        }
    }

    /**
     * Execute an async render function within the error boundary
     */
    async renderAsync<T>(renderFn: () => Promise<T>): Promise<RenderResult<T>> {
        const container = document.getElementById(this.options.containerId);

        if (!container) {
            const error = new Error(
                `Container element with id '${this.options.containerId}' not found`
            );
            return this.handleError(error, null);
        }

        try {
            if (this.options.resetOnSuccess) {
                this.clearErrorState(container);
            }

            const result = await renderFn();

            return {
                success: true,
                data: result,
            };
        } catch (error) {
            return this.handleError(
                error instanceof Error ? error : new Error(String(error)),
                container
            );
        }
    }

    private handleError<T>(error: Error, container: HTMLElement | null): RenderResult<T> {
        this.errorCount++;
        this.lastError = error;
        this.lastErrorTime = Date.now();

        // Sanitize stack trace for security before storing/displaying
        const sanitizedStack = sanitizeStackTrace(error.stack || '');

        const errorInfo: ErrorInfo = {
            componentStack: sanitizedStack,
            timestamp: this.lastErrorTime,
            containerId: this.options.containerId,
        };

        // Log error for debugging (full stack in console, sanitized in UI)
        console.error(`[RendererErrorBoundary:${this.options.containerId}]`, error, {
            ...errorInfo,
            componentStack: error.stack, // Keep full stack for console
        });

        // Show toast notification
        if (this.options.showToastNotification) {
            showToast('Failed to render content. Please try again.', 'error');
        }

        // Display fallback UI
        if (container) {
            this.displayFallback(container, error, errorInfo);
        }

        // Call custom error handler if provided
        if (this.options.onError) {
            this.options.onError(error, errorInfo);
        }

        return {
            success: false,
            error,
            errorInfo,
        };
    }

    private displayFallback(container: HTMLElement, error: Error, errorInfo: ErrorInfo): void {
        // Clean up any existing listeners before replacing content
        this.cleanupEventListeners();

        // Save original content for potential recovery
        if (!container.dataset['originalContent']) {
            container.dataset['originalContent'] = container.innerHTML;
        }

        // Insert fallback UI
        container.innerHTML = this.options.fallbackHtml;

        // Setup error details (with sanitized stack)
        const errorDetails = container.querySelector('.error-details');
        if (errorDetails) {
            errorDetails.textContent = `${error.message}\n\n${errorInfo.componentStack}`;
        }

        // Setup event delegation for buttons (prevents memory leaks)
        this.setupEventDelegation(container);

        // Add error state class
        container.classList.add('has-error-boundary-fallback');
    }

    private clearErrorState(container: HTMLElement): void {
        if (container.classList.contains('has-error-boundary-fallback')) {
            // Clean up event delegation
            this.cleanupEventListeners();

            container.classList.remove('has-error-boundary-fallback');
            delete container.dataset['originalContent'];
        }
    }

    /**
     * Retry rendering with exponential backoff
     */
    private retry(container: HTMLElement): void {
        const maxRetries = 3;

        if (this.errorCount >= maxRetries) {
            showToast('Maximum retry attempts reached. Please reload the page.', 'error');
            return;
        }

        // Clean up listeners before replacing content
        this.cleanupEventListeners();

        // Show loading state
        container.innerHTML = `
            <div class="flex items-center justify-center p-8">
                <div class="w-6 h-6 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin mr-3"></div>
                <span class="text-theme-muted">Retrying...</span>
            </div>
        `;

        // Delay retry with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, this.errorCount - 1), 5000);

        setTimeout(() => {
            // Restore original content and let the caller re-render
            if (container.dataset['originalContent']) {
                container.innerHTML = container.dataset['originalContent'];
            }

            // Dispatch custom event for retry
            container.dispatchEvent(
                new CustomEvent('error-boundary-retry', {
                    detail: {
                        error: this.lastError,
                        attempt: this.errorCount,
                    },
                })
            );
        }, delay);
    }

    /**
     * Get error statistics for monitoring
     */
    getErrorStats(): {
        count: number;
        lastError: Error | null;
        lastErrorTime: number | null;
    } {
        return {
            count: this.errorCount,
            lastError: this.lastError,
            lastErrorTime: this.lastErrorTime,
        };
    }

    /**
     * Reset error boundary state
     */
    reset(): void {
        this.errorCount = 0;
        this.lastError = null;
        this.lastErrorTime = null;

        const container = document.getElementById(this.options.containerId);
        if (container) {
            this.clearErrorState(container);
        }

        // Ensure all listeners are cleaned up
        this.cleanupEventListeners();
    }

    /**
     * Destroy the error boundary and clean up all resources
     * Call this when the boundary is no longer needed
     */
    destroy(): void {
        this.cleanupEventListeners();
        this.reset();
    }
}

/**
 * Create error boundaries for all main renderer containers
 */
export const createRendererErrorBoundaries = (): Map<string, RendererErrorBoundary> => {
    const boundaries = new Map<string, RendererErrorBoundary>();

    // Main content containers
    const containerIds = [
        'problems-container',
        'topic-list',
        'solution-content',
        'flashcard-content',
    ];

    containerIds.forEach((id) => {
        boundaries.set(
            id,
            new RendererErrorBoundary({
                containerId: id,
                showToastNotification: true,
            })
        );
    });

    return boundaries;
};

/**
 * Higher-order function to wrap any render function with error boundary
 */
export const withErrorBoundary = <T extends (..._args: unknown[]) => unknown>(
    fn: T,
    containerId: string,
    options?: Partial<ErrorBoundaryOptions>
): ((..._args: Parameters<T>) => ReturnType<T> | null) => {
    const boundary = new RendererErrorBoundary({
        containerId,
        ...options,
    });

    return (...args: Parameters<T>): ReturnType<T> | null => {
        const result = boundary.render(() => fn(...args));
        return result.success ? (result.data as ReturnType<T>) : null;
    };
};
