/**
 * Centralized limits and thresholds configuration
 * All magic numbers, limits, and thresholds are defined here for easy maintenance
 */

export const LIMITS = {
    // Storage and localStorage limits
    STORAGE: {
        /** Maximum pending operations before rejecting new ones (prevents quota exceeded) */
        MAX_PENDING_OPERATIONS: 1000,
        /** Debounce delay for localStorage writes in milliseconds */
        SAVE_DEBOUNCE_MS: 300,
        /** Maximum string length for export data (10KB) */
        MAX_EXPORT_STRING_LENGTH: 10000,
        /** Maximum key length for export data */
        MAX_EXPORT_KEY_LENGTH: 100,
        /** Default maximum items to keep in deleted IDs set */
        MAX_DELETED_IDS: 50,
        /** Threshold for triggering auto-cleanup */
        CLEANUP_THRESHOLD: 100,
        /** Number of problems to remove during cleanup (20% of total, max) */
        CLEANUP_BATCH_SIZE: 0.2,
        /** Minimum problems before cleanup triggers */
        MIN_PROBLEMS_BEFORE_CLEANUP: 50,
    },

    // API and sync limits
    API: {
        /** Deduplication window for API requests in milliseconds */
        DEDUP_WINDOW_MS: 100,
        /** Rate limit: OAuth requests per minute */
        OAUTH_RATE_LIMIT: 10,
        /** Rate limit: Token fetch requests per minute */
        TOKEN_RATE_LIMIT: 60,
        /** OAuth state TTL in seconds (5 minutes) */
        OAUTH_STATE_TTL: 300,
        /** JWT token expiration in seconds (7 days) */
        JWT_EXPIRATION_SECONDS: 7 * 24 * 60 * 60,
    },

    // State management thresholds
    STATE: {
        /** Threshold for incremental vs full save (dirty items < 30 or < 20% of total) */
        INCREMENTAL_SAVE_MAX_DIRTY: 30,
        /** Percentage threshold for incremental save */
        INCREMENTAL_SAVE_PERCENTAGE: 0.2,
        /** Maximum input length for sanitized strings */
        MAX_INPUT_LENGTH: 200,
        /** Maximum URL length after sanitization */
        MAX_URL_LENGTH: 500,
    },

    // Data validation limits
    VALIDATION: {
        /** Maximum length for OAuth authorization code */
        MAX_OAUTH_CODE_LENGTH: 1000,
        /** Maximum export file size in bytes (rough estimate) */
        MAX_EXPORT_FILE_SIZE: 1024 * 1024, // 1MB
    },
} as const;

// Type for limits values
export type Limits = typeof LIMITS;

// Re-export for backward compatibility during migration
export const MAX_PENDING_OPERATIONS = LIMITS.STORAGE.MAX_PENDING_OPERATIONS;
export const STORAGE_SAVE_DELAY = LIMITS.STORAGE.SAVE_DEBOUNCE_MS;
export const DEDUP_WINDOW_MS = LIMITS.API.DEDUP_WINDOW_MS;
