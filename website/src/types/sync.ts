/**
 * Type definitions for synchronization-related data structures
 * @module types/sync
 */

/**
 * Statistics for sync operations
 */
export interface SyncStats {
    /** Number of operations pending sync */
    pending: number;
    /** Number of operations successfully synced */
    completed: number;
    /** Number of operations that failed to sync */
    failed: number;
    /** Number of operations requiring manual resolution */
    manual: number;
}

/**
 * Current synchronization status
 */
export interface SyncStatus {
    /** Number of pending operations */
    pendingCount: number;
    /** Whether a sync operation is currently in progress */
    isSyncing: boolean;
    /** Timestamp of the last successful sync (null if never synced) */
    lastSyncAt: number | null;
    /** Detailed statistics */
    stats: SyncStats;
}

/**
 * Response from service worker for sync status requests
 */
export interface SyncStatusResponse {
    /** Message type identifier */
    type?: string;
    /** The sync status data */
    status?: SyncStatus;
}

/**
 * API operation types for background sync
 */
export type APIOperationType =
    | 'MARK_SOLVED'
    | 'UPDATE_REVIEW_DATE'
    | 'UPDATE_DIFFICULTY'
    | 'ADD_NOTE'
    | 'ADD_CUSTOM_PROBLEM'
    | 'DELETE_PROBLEM'
    | 'UPDATE_SETTINGS';

/**
 * Individual API operation queued for sync
 */
export interface APIOperation {
    /** Type of operation being performed */
    type: APIOperationType;
    /** Operation-specific data payload */
    data: unknown;
    /** Timestamp when operation was created */
    timestamp: number;
}

/**
 * Service worker message for sync operations
 */
export interface SWMessage {
    /** Message type identifier */
    type: string;
    /** Optional data payload */
    data?: unknown;
    /** Optional array of operations for batch processing */
    operations?: APIOperation[];
}

/**
 * Type guard to validate SyncStatusResponse
 * @param data - Unknown data to validate
 * @returns True if data is a valid SyncStatusResponse
 */
export const isSyncStatusResponse = (data: unknown): data is SyncStatusResponse => {
    if (!data || typeof data !== 'object') return false;

    const response = data as Record<string, unknown>;
    if (!response['status'] || typeof response['status'] !== 'object') return false;

    const status = response['status'] as Record<string, unknown>;
    return (
        typeof status['pendingCount'] === 'number' &&
        typeof status['isSyncing'] === 'boolean' &&
        (status['lastSyncAt'] === null || typeof status['lastSyncAt'] === 'number')
    );
};

/**
 * Type guard to validate APIOperation
 * @param data - Unknown data to validate
 * @returns True if data is a valid APIOperation
 */
export const isAPIOperation = (data: unknown): data is APIOperation => {
    if (!data || typeof data !== 'object') return false;

    const op = data as Record<string, unknown>;
    const validTypes: APIOperationType[] = [
        'MARK_SOLVED',
        'UPDATE_REVIEW_DATE',
        'UPDATE_DIFFICULTY',
        'ADD_NOTE',
        'ADD_CUSTOM_PROBLEM',
        'DELETE_PROBLEM',
        'UPDATE_SETTINGS',
    ];

    return (
        typeof op['type'] === 'string' &&
        validTypes.includes(op['type'] as APIOperationType) &&
        typeof op['timestamp'] === 'number'
    );
};

/**
 * Conflict resolution result from server
 */
export interface ConflictResolution {
    /** Resolution status */
    status: 'resolved' | 'manual' | 'error';
    /** Resolved data (if status is 'resolved') */
    data?: unknown;
    /** Error or informational message */
    message?: string;
}

/**
 * Server conflict data structure
 */
export interface ServerConflict {
    /** ID of the operation that caused the conflict */
    operationId: string;
    /** ID of the problem with conflicting data */
    problemId: string;
    /** Client's version of the data */
    clientData: unknown;
    /** Server's version of the data */
    serverData: unknown;
}

/**
 * Force sync response from service worker
 */
export interface ForceSyncResponse {
    /** Whether the sync was successful */
    success: boolean;
    /** Number of operations successfully synced */
    synced: number;
    /** Number of operations that failed */
    failed: number;
}

/**
 * Type guard to validate ForceSyncResponse
 * @param data - Unknown data to validate
 * @returns True if data is a valid ForceSyncResponse
 */
export const isForceSyncResponse = (data: unknown): data is ForceSyncResponse => {
    if (!data || typeof data !== 'object') return false;
    const response = data as Record<string, unknown>;
    return (
        typeof response['success'] === 'boolean' &&
        typeof response['synced'] === 'number' &&
        typeof response['failed'] === 'number'
    );
};

/**
 * Bundle status response from service worker
 */
export interface BundleStatusResponse {
    /** Message type identifier */
    type: 'BUNDLE_STATUS';
    /** The bundle status data */
    status: {
        status: 'idle' | 'downloading' | 'extracting' | 'complete' | 'error';
        progress: number;
        totalFiles: number;
        extractedFiles: number;
        error?: string;
        bundleVersion?: string;
        downloadedAt?: number;
    };
}

/**
 * Type guard to validate BundleStatusResponse
 * @param data - Unknown data to validate
 * @returns True if data is a valid BundleStatusResponse
 */
export const isBundleStatusResponse = (data: unknown): data is BundleStatusResponse => {
    if (!data || typeof data !== 'object') return false;
    const response = data as Record<string, unknown>;
    if (response['type'] !== 'BUNDLE_STATUS') return false;

    const status = response['status'] as Record<string, unknown> | undefined;
    if (!status || typeof status !== 'object') return false;

    const validStatuses = ['idle', 'downloading', 'extracting', 'complete', 'error'];
    return (
        typeof status['status'] === 'string' &&
        validStatuses.includes(status['status']) &&
        typeof status['progress'] === 'number' &&
        typeof status['totalFiles'] === 'number' &&
        typeof status['extractedFiles'] === 'number'
    );
};

/**
 * Offline reload status response
 */
export interface OfflineReloadStatusResponse {
    /** Whether the page can be reloaded while offline */
    canReload: boolean;
    /** Whether the page is cached */
    pageCached: boolean;
    /** Whether assets are cached */
    assetsCached: boolean;
    /** Whether the bundle is ready */
    bundleReady: boolean;
    /** Total number of cached items */
    cachedItemsCount: number;
}

/**
 * Type guard to validate OfflineReloadStatusResponse
 * @param data - Unknown data to validate
 * @returns True if data is a valid OfflineReloadStatusResponse
 */
export const isOfflineReloadStatusResponse = (
    data: unknown
): data is OfflineReloadStatusResponse => {
    if (!data || typeof data !== 'object') return false;
    const response = data as Record<string, unknown>;
    return (
        typeof response['canReload'] === 'boolean' &&
        typeof response['pageCached'] === 'boolean' &&
        typeof response['assetsCached'] === 'boolean' &&
        typeof response['bundleReady'] === 'boolean' &&
        typeof response['cachedItemsCount'] === 'number'
    );
};

/**
 * Offline capability status response
 */
export interface OfflineCapabilityResponse {
    /** Whether the device is currently offline */
    isOffline: boolean;
    /** Whether the app can function offline */
    canFunctionOffline: boolean;
    /** Cache statistics */
    cacheStatus: {
        staticAssets: number;
        problems: number;
        apiResponses: number;
        bundleFiles: number;
    };
    /** Timestamp of last bundle download */
    lastBundleDownload?: number;
    /** Version of downloaded bundle */
    bundleVersion?: string;
}

/**
 * Type guard to validate OfflineCapabilityResponse
 * @param data - Unknown data to validate
 * @returns True if data is a valid OfflineCapabilityResponse
 */
export const isOfflineCapabilityResponse = (data: unknown): data is OfflineCapabilityResponse => {
    if (!data || typeof data !== 'object') return false;
    const response = data as Record<string, unknown>;

    if (!response['cacheStatus'] || typeof response['cacheStatus'] !== 'object') return false;
    const cacheStatus = response['cacheStatus'] as Record<string, unknown>;

    return (
        typeof response['isOffline'] === 'boolean' &&
        typeof response['canFunctionOffline'] === 'boolean' &&
        typeof cacheStatus['staticAssets'] === 'number' &&
        typeof cacheStatus['problems'] === 'number' &&
        typeof cacheStatus['apiResponses'] === 'number' &&
        typeof cacheStatus['bundleFiles'] === 'number'
    );
};

/**
 * Union type for all service worker responses
 */
export type SWResponse =
    | SyncStatusResponse
    | ForceSyncResponse
    | BundleStatusResponse
    | OfflineReloadStatusResponse
    | OfflineCapabilityResponse;

/**
 * Central type guard to validate any service worker response
 * @param data - Unknown data to validate
 * @returns True if data is a valid SWResponse
 */
export const isSWResponse = (data: unknown): data is SWResponse => {
    return (
        isSyncStatusResponse(data) ||
        isForceSyncResponse(data) ||
        isBundleStatusResponse(data) ||
        isOfflineReloadStatusResponse(data) ||
        isOfflineCapabilityResponse(data)
    );
};
