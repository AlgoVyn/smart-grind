// --- CSRF TOKEN MANAGEMENT MODULE ---
// CSRF token fetching and caching for secure API operations

// CSRF token storage (in memory, not localStorage for security)
let csrfToken: string | null = null;

/**
 * Fetches a new CSRF token from the server.
 * Called after authentication and before state-changing operations.
 * @returns The CSRF token or null if fetch failed
 */
export const fetchCsrfToken = async (): Promise<string | null> => {
    try {
        const response = await fetch('/smartgrind/api/user?action=csrf', {
            method: 'GET',
            credentials: 'include', // Important: sends httpOnly cookies
        });

        if (!response.ok) {
            console.error('[CSRF] Failed to fetch CSRF token:', response.status);
            return null;
        }

        const data = await response.json();
        csrfToken = data.csrfToken;
        return csrfToken;
    } catch (error) {
        console.error('[CSRF] Error fetching CSRF token:', error);
        return null;
    }
};

/**
 * Gets the current CSRF token, fetching a new one if needed.
 * @returns The CSRF token or null if unavailable
 */
export const getCsrfToken = async (): Promise<string | null> => {
    if (!csrfToken) {
        return await fetchCsrfToken();
    }
    return csrfToken;
};

/**
 * Gets the cached CSRF token synchronously (for beforeunload handlers).
 * Returns null if no token is cached (does not fetch).
 * Use this only in contexts where async is not possible (e.g., beforeunload).
 * @returns The cached CSRF token or null
 */
export const getCachedCsrfToken = (): string | null => {
    return csrfToken;
};

/**
 * Clears the CSRF token (e.g., on logout).
 * @returns void
 */
export const clearCsrfToken = (): void => {
    csrfToken = null;
};
