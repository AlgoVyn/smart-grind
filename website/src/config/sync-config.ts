/**
 * Centralized synchronization configuration
 * All timeouts, intervals, and retry configurations are defined here
 */

export const SYNC_CONFIG = {
    // Retry configuration
    MAX_RETRY_ATTEMPTS: 5,

    // Timeouts (in milliseconds)
    TIMEOUTS: {
        SYNC_BATCH: 60_000, // 1 minute for full sync batch
        INDIVIDUAL_REQUEST: 15_000, // 15 seconds per request
        SERVICE_WORKER_MESSAGE: 5_000, // 5 seconds for SW communication
        REGISTRATION_HANDSHAKE: 15_000, // 15 seconds for SW registration
    },

    // Intervals (in milliseconds)
    INTERVALS: {
        UPDATE_CHECK: 60 * 60 * 1000, // 60 minutes between update checks
        SYNC_STATUS_POLL: 30_000, // 30 seconds between status updates
        RETRY_CHECK: 30_000, // 30 seconds between retry checks
    },

    // Exponential backoff
    BACKOFF: {
        BASE_DELAY: 1_000, // 1 second base
        MAX_DELAY: 60_000, // 1 minute max
        MULTIPLIER: 2, // Double each retry
    },

    // Cache strategies
    CACHE: {
        PROBLEMS_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
        API_MAX_AGE: 5 * 60 * 1000, // 5 minutes
        STATIC_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
} as const;

// Type for configuration values
export type SyncConfig = typeof SYNC_CONFIG;
