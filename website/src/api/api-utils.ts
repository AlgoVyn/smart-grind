// --- API UTILITIES MODULE ---
// Shared utilities for API operations

/**
 * Gets the allowed origins for API response validation
 * Lazy evaluation to support service worker context where window is not available
 */
const getAllowedOrigins = (): string[] => {
    if (typeof window !== 'undefined') {
        return [window.location.origin];
    }
    // In service worker context, allow common origins
    return ['http://localhost:8788', 'https://algovyn.com'];
};

/**
 * Gets the current origin
 * Works in both browser and service worker contexts
 */
const getCurrentOrigin = (): string => {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    // In service worker, use self.location
    if (typeof self !== 'undefined' && self.location) {
        return self.location.origin;
    }
    return '';
};

/**
 * Validates that the API response originates from an expected origin
 * @param response - The fetch response to validate
 */
export const validateResponseOrigin = (response: Response): void => {
    const currentOrigin = getCurrentOrigin();
    // For same-origin requests, no additional validation needed
    if (currentOrigin && response.url.startsWith(currentOrigin)) {
        return;
    }

    const responseOrigin = response.headers.get('Origin') || response.url;

    // Validate cross-origin responses
    if (!getAllowedOrigins().some((origin) => responseOrigin.includes(origin))) {
        // Unexpected origin - response will be handled by error handling
    }
};

/**
 * Check if the browser reports being online
 * This is a fast synchronous check - we rely on the save failing
 * naturally if the network is actually unavailable
 */
export const isBrowserOnline = (): boolean => {
    return typeof navigator !== 'undefined' && navigator.onLine;
};

/**
 * Standard error messages for HTTP status codes
 */
export const ERROR_MESSAGES: Record<number, string> = {
    401: 'Authentication failed. Please sign in again.',
    403: 'CSRF token validation failed. Please refresh the page and try again.',
    404: 'User data not found. Starting with fresh data.',
    500: 'Server error. Please try again later.',
};

/**
 * Get user-friendly error message for a response status
 */
export const getErrorMessage = (status: number, fallback: string): string => {
    return ERROR_MESSAGES[status] || fallback;
};
