// --- URL UTILITIES MODULE ---
// URL manipulation and parameter handling

declare global {
    interface Window {
        VITE_BASE_URL?: string;
    }
}

/**
 * Extracts a query parameter value from the current URL.
 * @param name - The name of the URL parameter to retrieve
 * @returns The parameter value, or null if not found
 * @example
 * // URL: ?token=abc123
 * const token = getUrlParameter('token'); // Returns "abc123"
 */
export const getUrlParameter = (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

/**
 * Gets the base URL for the application.
 * Uses the VITE_BASE_URL global variable or falls back to default.
 * @returns The base URL path (e.g., '/smartgrind/')
 */
export const getBaseUrl = (): string => {
    return window.VITE_BASE_URL || '/smartgrind/';
};

/**
 * Path prefixes for SEO-friendly URLs
 */
const PATH_PREFIXES: Record<string, string> = {
    category: 'c',
    algorithms: 'a',
};

/**
 * Updates a URL parameter without triggering a page reload.
 * Uses History API to maintain clean URLs for categories and filters.
 * @param name - The parameter name to update
 * @param value - The new value, or null to remove the parameter
 * @returns void
 * @example
 * // Update category in URL
 * updateUrlParameter('category', 'arrays');
 * // Result: URL changes to /smartgrind/c/arrays
 *
 * // Update algorithms in URL
 * updateUrlParameter('algorithms', 'arrays-strings');
 * // Result: URL changes to /smartgrind/a/arrays-strings
 */
export const updateUrlParameter = (name: string, value: string | null): void => {
    // Handle SEO-friendly path-based URLs for category and algorithms
    if (name in PATH_PREFIXES) {
        const prefix = PATH_PREFIXES[name];
        const newPath =
            value && value !== 'all' ? `/smartgrind/${prefix}/${value}` : '/smartgrind/';
        window.history.pushState({ path: newPath }, '', newPath);
        return;
    }

    // Handle query string parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (value) {
        urlParams.set(name, value);
    } else {
        urlParams.delete(name);
    }
    const newUrl =
        window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.pushState({ path: newUrl }, '', newUrl);
};
