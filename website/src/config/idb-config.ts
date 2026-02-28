/**
 * IndexedDB Configuration
 * Consolidates all IndexedDB database and store names into a single configuration
 * to avoid fragmentation across multiple databases
 */

export const IDB_CONFIG = {
    /** Main database name - all stores consolidated here */
    DATABASE_NAME: 'smartgrind',
    DATABASE_VERSION: 1,

    /** Object store names */
    STORES: {
        /** Auth tokens storage (replaces smartgrind-auth) */
        AUTH_TOKENS: 'auth-tokens',
        /** Problem metadata storage (replaces smartgrind-offline) */
        PROBLEM_METADATA: 'problem-metadata',
        /** Operation queue storage (replaces smartgrind-sync) */
        OPERATION_QUEUE: 'operation-queue',
        /** Queue metadata (device ID, sync time) */
        QUEUE_META: 'queue-meta',
        /** Bundle state storage (replaces smartgrind-sw-inventory) */
        BUNDLE_STATE: 'bundle-state',
        /** Sync retry storage (replaces smartgrind-sync-retry) */
        SYNC_RETRY: 'sync-retry',
        /** Cache inventory tracking */
        CACHE_INVENTORY: 'cache-inventory',
    },

    /** Legacy database names - used for migration/cleanup */
    LEGACY_DATABASES: [
        'smartgrind-auth',
        'smartgrind-offline',
        'smartgrind-sync',
        'smartgrind-sw-inventory',
        'smartgrind-sync-retry',
    ] as const,
} as const;

/** Type for store names */
export type IDBStoreName = (typeof IDB_CONFIG.STORES)[keyof typeof IDB_CONFIG.STORES];
