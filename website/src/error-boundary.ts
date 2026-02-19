// --- ERROR BOUNDARY MODULE ---
// Global error handling and error boundary utilities

import { ui } from './ui/ui';

/**
 * Error boundary class for catching and handling errors in component-like operations
 */
export class ErrorBoundary {
    private errorContainer: HTMLElement | null = null;

    constructor(containerId: string) {
        this.errorContainer = document.getElementById(containerId);
    }

    /**
     * Wraps a function execution with error handling
     * @param fn The function to execute
     * @param fallbackContent Optional fallback HTML content to display on error
     */
    async execute<T>(fn: () => Promise<T> | T, fallbackContent?: string): Promise<T | null> {
        try {
            return await fn();
        } catch (error) {
            this.handleError(error, fallbackContent);
            return null;
        }
    }

    /**
     * Handles errors by displaying user-friendly messages
     * @param error The error to handle
     * @param fallbackContent Optional fallback HTML content
     */
    private handleError(error: unknown, fallbackContent?: string): void {
        const message = error instanceof Error ? error.message : String(error);

        // Log error for debugging
        console.error('ErrorBoundary caught an error:', error);

        // Show user-friendly alert
        ui.showAlert(`An error occurred: ${message}`);

        // Display fallback UI if container exists
        if (this.errorContainer) {
            this.errorContainer.innerHTML =
                fallbackContent ||
                `
                <div class="error-fallback p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 class="text-red-800 font-semibold mb-2">Something went wrong</h3>
                    <p class="text-red-600 text-sm">${this.sanitizeMessage(message)}</p>
                    <button onclick="location.reload()" class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    /**
     * Sanitizes error messages for safe HTML display
     * @param message The error message to sanitize
     */
    private sanitizeMessage(message: string): string {
        // Properly escape HTML entities to prevent XSS attacks
        return message
            .replace(/&/g, '&amp;')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '&#x27;');
    }

    /**
     * Resets the error boundary state
     */
    reset(): void {
        if (this.errorContainer) {
            this.errorContainer.innerHTML = '';
        }
    }
}

/** Get UI for alerts when available (avoids depending on ui before it's loaded) */
function getUI(): { showAlert: (_msg: string) => void } | undefined {
    return (window as unknown as { SmartGrind?: { ui?: { showAlert: (_msg: string) => void } } })
        .SmartGrind?.ui;
}

/**
 * Global error handler for uncaught errors
 */
export const setupGlobalErrorHandlers = (): void => {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
        console.error('Global error handler:', event.error);
        getUI()?.showAlert(`An unexpected error occurred: ${event.message}`);

        // Prevent default browser error handling
        event.preventDefault();
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const message = event.reason instanceof Error ? event.reason.message : String(event.reason);
        console.error('Unhandled promise rejection:', event.reason);
        getUI()?.showAlert(`An unexpected error occurred: ${message}`);

        // Prevent default browser error handling
        event.preventDefault();
    });
};

/**
 * Utility function to wrap async operations with error handling
 * @param operation The async operation to wrap
 * @param errorMessage Custom error message to display
 */
export const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Operation failed'
): Promise<T | null> => {
    try {
        return await operation();
    } catch (error) {
        console.error(errorMessage, error);
        const message = error instanceof Error ? error.message : String(error);
        ui.showAlert(`${errorMessage}: ${message}`);
        return null;
    }
};

/**
 * Utility function to wrap synchronous operations with error handling
 * @param operation The synchronous operation to wrap
 * @param errorMessage Custom error message to display
 */
export const withSyncErrorHandling = <T>(
    operation: () => T,
    errorMessage: string = 'Operation failed'
): T | null => {
    try {
        return operation();
    } catch (error) {
        console.error(errorMessage, error);
        const message = error instanceof Error ? error.message : String(error);
        ui.showAlert(`${errorMessage}: ${message}`);
        return null;
    }
};

// Global error handlers are set up explicitly from init.ts after app is ready
