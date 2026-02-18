// --- API UTILITIES MODULE ---
// Shared utilities for API operations

/**
 * Allowed origins for API response validation
 */
const ALLOWED_ORIGINS = [
    window.location.origin,
    'https://smartgrind.com',
    'https://www.smartgrind.com',
];

/**
 * Validates that the API response originates from an expected origin
 * @param response - The fetch response to validate
 */
export const validateResponseOrigin = (response: Response): void => {
    // For same-origin requests, no additional validation needed
    if (response.url.startsWith(window.location.origin)) {
        return;
    }

    const responseOrigin = response.headers.get('Origin') || response.url;

    // Validate cross-origin responses
    if (!ALLOWED_ORIGINS.some((origin) => responseOrigin.includes(origin))) {
        console.warn('Response from unexpected origin:', responseOrigin);
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
