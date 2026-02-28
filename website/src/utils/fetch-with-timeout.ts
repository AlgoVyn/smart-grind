// --- FETCH WITH TIMEOUT UTILITY ---
// Wrapper around fetch that adds timeout support and automatic retry logic

interface FetchWithTimeoutOptions extends RequestInit {
    /** Timeout in milliseconds (default: 10000) */
    timeout?: number;
    /** Number of retry attempts for network errors (default: 0) */
    retries?: number;
    /** Delay between retries in milliseconds (default: 1000) */
    retryDelay?: number;
}

/**
 * Error thrown when a fetch request times out
 */
export class FetchTimeoutError extends Error {
    constructor(
        public readonly url: string,
        public readonly timeout: number
    ) {
        super(`Request to ${url} timed out after ${timeout}ms`);
        this.name = 'FetchTimeoutError';
    }
}

/**
 * Error thrown when all retry attempts are exhausted
 */
export class FetchRetryError extends Error {
    constructor(
        public readonly url: string,
        public readonly attempts: number,
        public readonly lastError: Error
    ) {
        super(
            `Request to ${url} failed after ${attempts} attempts. Last error: ${lastError.message}`
        );
        this.name = 'FetchRetryError';
    }
}

/**
 * Fetches a resource with a timeout and optional retry logic.
 * Uses AbortController for proper cancellation.
 *
 * @param url - The URL to fetch
 * @param options - Fetch options with timeout and retry settings
 * @returns Promise resolving to the Response
 * @throws {FetchTimeoutError} If the request times out
 * @throws {FetchRetryError} If all retry attempts are exhausted
 *
 * @example
 * // Basic usage with 5 second timeout
 * const response = await fetchWithTimeout('/api/data', { timeout: 5000 });
 *
 * @example
 * // With retries for network errors
 * const response = await fetchWithTimeout('/api/data', {
 *   timeout: 10000,
 *   retries: 3,
 *   retryDelay: 2000
 * });
 */
export async function fetchWithTimeout(
    url: string,
    options: FetchWithTimeoutOptions = {}
): Promise<Response> {
    const { timeout = 10000, retries = 0, retryDelay = 1000, ...fetchOptions } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await executeFetch(url, timeout, fetchOptions);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // Don't retry on timeout errors or if this was the last attempt
            if (error instanceof FetchTimeoutError || attempt >= retries) {
                break;
            }

            // Only retry on network errors (TypeError from fetch)
            if (lastError.name === 'TypeError') {
                console.warn(
                    `[Fetch] Attempt ${attempt + 1} failed for ${url}, retrying in ${retryDelay}ms...`
                );
                await delay(retryDelay);
                continue;
            }

            // Don't retry on HTTP errors (4xx, 5xx)
            break;
        }
    }

    throw new FetchRetryError(url, retries + 1, lastError!);
}

/**
 * Execute a single fetch request with timeout
 */
async function executeFetch(
    url: string,
    timeout: number,
    fetchOptions: RequestInit
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });
        return response;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new FetchTimeoutError(url, timeout);
            }
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

/**
 * Delay helper for retry logic
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convenience function for JSON API requests with timeout
 */
export async function fetchJson<T>(url: string, options: FetchWithTimeoutOptions = {}): Promise<T> {
    const response = await fetchWithTimeout(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

/**
 * Convenience function for POST requests with JSON body
 */
export async function postJson<T>(
    url: string,
    data: unknown,
    options: FetchWithTimeoutOptions = {}
): Promise<T> {
    return fetchJson<T>(url, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
    });
}
