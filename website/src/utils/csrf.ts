// --- CSRF TOKEN MANAGEMENT MODULE ---
// CSRF token fetching and caching for secure API operations

import { fetchWithTimeout, FetchTimeoutError } from './fetch-with-timeout';

// CSRF token storage (in memory, not localStorage for security)
let csrfToken: string | null = null;

// Promise to track ongoing fetch requests to prevent race conditions
let pendingFetch: Promise<string | null> | null = null;

// Constants for CSRF token fetching
const CSRF_TIMEOUT = 10000; // 10 seconds
const CSRF_RETRIES = 2; // 2 retries for network errors

/**
 * Fetches a new CSRF token from the server.
 * Called after authentication and before state-changing operations.
 * Implements request deduplication and timeout handling to prevent race conditions.
 * @returns The CSRF token or null if fetch failed
 */
export const fetchCsrfToken = async (): Promise<string | null> => {
    // Return existing promise if a fetch is already in progress
    if (pendingFetch) {
        return pendingFetch;
    }

    // Create new fetch promise
    pendingFetch = (async (): Promise<string | null> => {
        try {
            const response = await fetchWithTimeout('/smartgrind/api/user?action=csrf', {
                method: 'GET',
                credentials: 'include', // Important: sends httpOnly cookies
                timeout: CSRF_TIMEOUT,
                retries: CSRF_RETRIES,
            });

            if (!response.ok) {
                console.error('[CSRF] Failed to fetch CSRF token:', response.status);
                return null;
            }

            const data = await response.json();
            csrfToken = data.csrfToken;
            return csrfToken;
        } catch (error) {
            if (error instanceof FetchTimeoutError) {
                console.error('[CSRF] Request timed out:', error.message);
            } else {
                console.error('[CSRF] Error fetching CSRF token:', error);
            }
            return null;
        } finally {
            // Clear pending fetch after completion (success or error)
            pendingFetch = null;
        }
    })();

    return pendingFetch;
};

/**
 * Gets the current CSRF token, fetching a new one if needed.
 * Implements request deduplication to prevent race conditions.
 * @returns The CSRF token or null if unavailable
 */
export const getCsrfToken = async (): Promise<string | null> => {
    // If a fetch is in progress, wait for it
    if (pendingFetch) {
        return pendingFetch;
    }

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
