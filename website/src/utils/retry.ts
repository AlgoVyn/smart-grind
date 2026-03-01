/**
 * Shared retry utility with exponential backoff
 * Centralizes retry logic used across the application
 */

export interface RetryOptions {
    /** Maximum number of retry attempts */
    maxAttempts: number;
    /** Base delay in milliseconds */
    baseDelay: number;
    /** Maximum delay in milliseconds */
    maxDelay: number;
    /** Backoff multiplier (default: 2) */
    multiplier: number;
    /** Optional callback for each retry attempt */
    onRetry?: (_attempt: number, _error: unknown, _nextDelay: number) => void;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
    maxAttempts: 5,
    baseDelay: 1000,
    maxDelay: 60000,
    multiplier: 2,
};

/**
 * Calculate delay for exponential backoff with jitter
 * @param attempt - Current attempt number (0-indexed)
 * @param options - Retry configuration options
 * @returns Delay in milliseconds
 */
export function calculateRetryDelay(attempt: number, options: Partial<RetryOptions> = {}): number {
    const { baseDelay, maxDelay, multiplier } = { ...DEFAULT_RETRY_OPTIONS, ...options };

    // Base delay: 1s, 2s, 4s, 8s, max at maxDelay
    const baseRetryDelay = Math.min(baseDelay * Math.pow(multiplier, attempt), maxDelay);

    // Add jitter: ±25% random variation to prevent thundering herd
    const jitter = baseRetryDelay * 0.25 * (Math.random() * 2 - 1);

    return Math.floor(baseRetryDelay + jitter);
}

/**
 * Sleep for a specified duration
 * @param ms - Duration in milliseconds
 * @returns Promise that resolves after the delay
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function with retry logic
 * @param fn - Function to execute
 * @param options - Retry configuration options
 * @returns Result of the function
 * @throws Last error encountered if all retries fail
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: unknown;

    for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry on the last attempt
            if (attempt < config.maxAttempts - 1) {
                const delay = calculateRetryDelay(attempt, config);

                if (config.onRetry) {
                    config.onRetry(attempt + 1, error, delay);
                }

                await sleep(delay);
            }
        }
    }

    throw lastError;
}

/**
 * Create a retry wrapper for a function
 * @param fn - Function to wrap
 * @param options - Default retry configuration options
 * @returns Wrapped function with retry capability
 */
export function createRetryWrapper<T extends (..._args: unknown[]) => Promise<unknown>>(
    fn: T,
    options: Partial<RetryOptions> = {}
): (..._args: Parameters<T>) => Promise<ReturnType<T>> {
    return async (..._args: Parameters<T>): Promise<ReturnType<T>> => {
        return withRetry(() => fn(..._args) as Promise<ReturnType<T>>, options);
    };
}
