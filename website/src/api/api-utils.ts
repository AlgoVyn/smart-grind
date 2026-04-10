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
 * Validates that the API response originates from an expected origin.
 * Uses strict origin comparison (not substring matching) to prevent
 * origin confusion attacks (e.g., https://evil.algovyn.com must not match).
 * Throws an error if the response origin is not in the allowed list.
 *
 * Handles three cases:
 * 1. Same-origin absolute URLs (e.g., https://algovyn.com/api) — validated by origin
 * 2. Relative URLs (e.g., /api/user) — assumed same-origin (native fetch behavior)
 * 3. Empty URL (opaque redirects) — skipped, as no origin can be verified
 *
 * @param response - The fetch response to validate
 * @throws {Error} If the response origin is not in the allowed origins list
 */
export const validateResponseOrigin = (response: Response): void => {
    const responseUrl = response.url;

    // Empty URL: opaque redirect responses have empty url property.
    // We cannot validate origin, so we skip validation for these.
    if (!responseUrl) {
        return;
    }

    // Relative URL: starts with '/' — these are same-origin by definition
    // (browser fetch resolves relative URLs against the current origin).
    if (responseUrl.startsWith('/')) {
        return;
    }

    // Absolute URL: extract origin for strict comparison
    let responseOrigin: string;
    try {
        responseOrigin = new URL(responseUrl).origin;
    } catch {
        // If URL is unparseable, reject the response
        throw new Error(`Invalid response URL: ${responseUrl}`);
    }

    // Use strict equality comparison — substring matching (includes) would allow
    // https://evil.algovyn.com to match https://algovyn.com
    const allowedOrigins = getAllowedOrigins();
    const isAllowed = allowedOrigins.some((origin) => responseOrigin === origin);

    if (!isAllowed) {
        throw new Error(
            `Response origin validation failed: received "${responseOrigin}", ` +
                `expected one of: ${allowedOrigins.join(', ')}`
        );
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
