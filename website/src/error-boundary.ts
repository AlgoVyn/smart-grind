// --- ERROR BOUNDARY MODULE ---
// Global error handling utilities

import { ui } from './ui/ui';
import { escapeHtml } from './utils';

export class ErrorBoundary {
    private errorContainer: HTMLElement | null = null;

    constructor(containerId: string) {
        this.errorContainer = document.getElementById(containerId);
    }

    async execute<T>(fn: () => Promise<T> | T, fallbackContent?: string): Promise<T | null> {
        try {
            return await fn();
        } catch (error) {
            this.handleError(error, fallbackContent);
            return null;
        }
    }

    private handleError(error: unknown, fallbackContent?: string): void {
        const message = error instanceof Error ? error.message : String(error);
        console.error('ErrorBoundary caught an error:', error);
        ui.showAlert(`An error occurred: ${message}`);

        if (this.errorContainer) {
            this.errorContainer.innerHTML =
                fallbackContent ||
                `
                <div class="error-fallback p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 class="text-red-800 font-semibold mb-2">Something went wrong</h3>
                    <p class="text-red-600 text-sm">${escapeHtml(message)}</p>
                    <button onclick="location.reload()" class="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                        Reload Page
                    </button>
                </div>
            `;
        }
    }

    reset(): void {
        if (this.errorContainer) {
            this.errorContainer.innerHTML = '';
        }
    }
}

function getUI(): { showAlert: (_msg: string) => void } | undefined {
    return (window as unknown as { SmartGrind?: { ui?: { showAlert: (_msg: string) => void } } })
        .SmartGrind?.ui;
}

export const setupGlobalErrorHandlers = (): void => {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        getUI()?.showAlert(`An error occurred: ${event.message}`);
        event.preventDefault();
    });

    window.addEventListener('unhandledrejection', (event) => {
        const message = event.reason instanceof Error ? event.reason.message : String(event.reason);
        console.error('Unhandled rejection:', event.reason);
        getUI()?.showAlert(`An error occurred: ${message}`);
        event.preventDefault();
    });
};

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
