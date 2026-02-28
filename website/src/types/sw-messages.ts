/**
 * Type definitions for Service Worker message protocols
 * @module types/sw-messages
 */

/**
 * Whitelist of allowed message types from clients to service worker
 */
export const ALLOWED_SW_MESSAGE_TYPES = [
    'SKIP_WAITING',
    'CACHE_ASSETS',
    'CACHE_PROBLEMS',
    'SYNC_OPERATIONS',
    'GET_SYNC_STATUS',
    'FORCE_SYNC',
    'REQUEST_SYNC',
    'CLEAR_ALL_CACHES',
    'CLIENT_READY',
    'NETWORK_RESTORED',
    'DOWNLOAD_BUNDLE',
    'GET_BUNDLE_STATUS',
    'CHECK_OFFLINE_RELOAD',
    'GET_OFFLINE_STATUS',
] as const;

/**
 * Union type of allowed message types
 */
export type SWMessageType = (typeof ALLOWED_SW_MESSAGE_TYPES)[number];

/**
 * Base interface for all service worker messages
 */
export interface SWBaseMessage {
    /** Message type - must be one of the allowed types */
    type: SWMessageType;
}

/**
 * SKIP_WAITING message - triggers immediate activation of waiting SW
 */
export interface SkipWaitingMessage extends SWBaseMessage {
    type: 'SKIP_WAITING';
}

/**
 * CACHE_ASSETS message - requests caching of dynamic assets
 */
export interface CacheAssetsMessage extends SWBaseMessage {
    type: 'CACHE_ASSETS';
    /** Array of asset URLs to cache */
    assets: string[];
}

/**
 * CACHE_PROBLEMS message - requests caching of problem files
 */
export interface CacheProblemsMessage extends SWBaseMessage {
    type: 'CACHE_PROBLEMS';
    /** Array of problem URLs to cache */
    problemUrls: string[];
}

/**
 * Operation types for background sync
 */
export type OperationType =
    | 'MARK_SOLVED'
    | 'UPDATE_REVIEW_DATE'
    | 'UPDATE_DIFFICULTY'
    | 'ADD_NOTE'
    | 'ADD_CUSTOM_PROBLEM'
    | 'DELETE_PROBLEM'
    | 'UPDATE_SETTINGS';

/**
 * SYNC_OPERATIONS message - queues operations for background sync
 */
export interface SyncOperationsMessage extends SWBaseMessage {
    type: 'SYNC_OPERATIONS';
    /** Array of operations to queue */
    operations: Array<{
        id?: string;
        type: OperationType;
        data: unknown;
        timestamp: number;
    }>;
}

/**
 * GET_SYNC_STATUS message - requests current sync status
 */
export interface GetSyncStatusMessage extends SWBaseMessage {
    type: 'GET_SYNC_STATUS';
}

/**
 * FORCE_SYNC message - triggers immediate sync attempt
 */
export interface ForceSyncMessage extends SWBaseMessage {
    type: 'FORCE_SYNC';
}

/**
 * REQUEST_SYNC message - requests background sync for a specific tag
 */
export interface RequestSyncMessage extends SWBaseMessage {
    type: 'REQUEST_SYNC';
    /** Sync tag identifier */
    tag: string;
}

/**
 * CLEAR_ALL_CACHES message - clears all caches (for debugging/logout)
 */
export interface ClearAllCachesMessage extends SWBaseMessage {
    type: 'CLEAR_ALL_CACHES';
}

/**
 * CLIENT_READY message - client reports it's ready and wants to know control status
 */
export interface ClientReadyMessage extends SWBaseMessage {
    type: 'CLIENT_READY';
}

/**
 * NETWORK_RESTORED message - indicates network connectivity was restored
 */
export interface NetworkRestoredMessage extends SWBaseMessage {
    type: 'NETWORK_RESTORED';
}

/**
 * DOWNLOAD_BUNDLE message - triggers offline bundle download
 */
export interface DownloadBundleMessage extends SWBaseMessage {
    type: 'DOWNLOAD_BUNDLE';
}

/**
 * GET_BUNDLE_STATUS message - requests current bundle download status
 */
export interface GetBundleStatusMessage extends SWBaseMessage {
    type: 'GET_BUNDLE_STATUS';
}

/**
 * CHECK_OFFLINE_RELOAD message - checks if the page can be reloaded while offline
 */
export interface CheckOfflineReloadMessage extends SWBaseMessage {
    type: 'CHECK_OFFLINE_RELOAD';
    /** The URL to check for offline availability */
    url?: string;
}

/**
 * GET_OFFLINE_STATUS message - requests current offline status and cache availability
 */
export interface GetOfflineStatusMessage extends SWBaseMessage {
    type: 'GET_OFFLINE_STATUS';
}

/**
 * Union type of all valid service worker messages from clients
 */
export type SWClientMessage =
    | SkipWaitingMessage
    | CacheAssetsMessage
    | CacheProblemsMessage
    | SyncOperationsMessage
    | GetSyncStatusMessage
    | ForceSyncMessage
    | RequestSyncMessage
    | ClearAllCachesMessage
    | ClientReadyMessage
    | NetworkRestoredMessage
    | DownloadBundleMessage
    | GetBundleStatusMessage
    | CheckOfflineReloadMessage
    | GetOfflineStatusMessage;

/**
 * Type guard to validate if a message type is allowed
 * @param type - String to validate
 * @returns True if type is a valid SW message type
 */
export const isValidSWMessageType = (type: string): type is SWMessageType => {
    return ALLOWED_SW_MESSAGE_TYPES.includes(type as SWMessageType);
};

/**
 * Type guard to validate if data is a valid service worker message
 * @param data - Unknown data to validate
 * @returns True if data is a valid SWClientMessage
 */
export const isValidSWClientMessage = (data: unknown): data is SWClientMessage => {
    if (!data || typeof data !== 'object') return false;

    const message = data as Record<string, unknown>;
    const type = message['type'];

    if (typeof type !== 'string') return false;
    if (!isValidSWMessageType(type)) return false;

    // Validate specific message structures
    switch (type) {
        case 'CACHE_ASSETS':
            return (
                Array.isArray(message['assets']) &&
                message['assets'].every((item) => typeof item === 'string')
            );
        case 'CACHE_PROBLEMS':
            return (
                Array.isArray(message['problemUrls']) &&
                message['problemUrls'].every((item) => typeof item === 'string')
            );
        case 'SYNC_OPERATIONS':
            return (
                Array.isArray(message['operations']) &&
                message['operations'].every(
                    (op) =>
                        typeof op === 'object' &&
                        op !== null &&
                        typeof (op as Record<string, unknown>)['type'] === 'string' &&
                        typeof (op as Record<string, unknown>)['timestamp'] === 'number'
                )
            );
        case 'REQUEST_SYNC':
            return typeof message['tag'] === 'string';
        default:
            // Messages without required fields
            return true;
    }
};

/**
 * Service Worker response message types (SW to client)
 */
export const ALLOWED_SW_RESPONSE_TYPES = [
    'SW_ACTIVATED',
    'CLEAR_RELOAD_FLAG',
    'SYNC_COMPLETED',
    'SYNC_FAILED',
    'SYNC_PROGRESS_SYNCED',
    'SYNC_CONFLICT_RESOLVED',
    'SYNC_CONFLICT_REQUIRES_MANUAL',
    'ASSET_UPDATED',
    'OFFLINE_STATUS',
    'BUNDLE_PROGRESS',
    'BUNDLE_READY',
    'BUNDLE_FAILED',
    'SYNC_AUTH_REQUIRED',
    'SYNC_QUEUED',
    'SYNC_STATUS',
    'CACHES_CLEARED',
    'CLIENT_CONTROL_STATUS',
    'BUNDLE_COMPLETE',
    'BUNDLE_ERROR',
    'BUNDLE_STATUS',
    'OFFLINE_RELOAD_STATUS',
    'OFFLINE_CAPABILITY',
] as const;

/**
 * Union type of allowed SW response message types
 */
export type SWResponseType = (typeof ALLOWED_SW_RESPONSE_TYPES)[number];

/**
 * Base interface for SW response messages
 */
export interface SWBaseResponse {
    type: SWResponseType;
}

/**
 * SW_ACTIVATED response - indicates SW has been activated
 */
export interface SWActivatedResponse extends SWBaseResponse {
    type: 'SW_ACTIVATED';
    /** Service worker version */
    version?: string;
    /** Whether this client is now controlled by the SW */
    controlling: boolean;
}

/**
 * SYNC_STATUS response - returns current sync status
 */
export interface SyncStatusResponse extends SWBaseResponse {
    type: 'SYNC_STATUS';
    /** Current sync status data */
    status: {
        pendingCount: number;
        isSyncing: boolean;
        lastSyncAt: number | null;
    };
}

/**
 * BUNDLE_STATUS response - returns current bundle download status
 */
export interface BundleStatusResponse extends SWBaseResponse {
    type: 'BUNDLE_STATUS';
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
 * OFFLINE_RELOAD_STATUS response - returns whether page can be reloaded offline
 */
export interface OfflineReloadStatusResponse extends SWBaseResponse {
    type: 'OFFLINE_RELOAD_STATUS';
    /** Whether the page can be reloaded while offline */
    canReload: boolean;
    /** Whether the main page is cached */
    pageCached: boolean;
    /** Whether critical assets are cached */
    assetsCached: boolean;
    /** Whether the offline bundle is downloaded */
    bundleReady: boolean;
    /** Total cached items count */
    cachedItemsCount: number;
}

/**
 * OFFLINE_CAPABILITY response - returns detailed offline capability status
 */
export interface OfflineCapabilityResponse extends SWBaseResponse {
    type: 'OFFLINE_CAPABILITY';
    /** Whether the app is currently offline */
    isOffline: boolean;
    /** Whether the app can function offline */
    canFunctionOffline: boolean;
    /** Details about cached resources */
    cacheStatus: {
        staticAssets: number;
        problems: number;
        apiResponses: number;
        bundleFiles: number;
    };
    /** Last time the bundle was downloaded */
    lastBundleDownload?: number;
    /** Bundle version if downloaded */
    bundleVersion?: string;
}

/**
 * Type guard to validate SW response messages
 * @param data - Unknown data to validate
 * @returns True if data is a valid SW response message
 */
export const isValidSWResponse = (data: unknown): data is SWBaseResponse => {
    if (!data || typeof data !== 'object') return false;
    const message = data as Record<string, unknown>;
    return (
        typeof message['type'] === 'string' &&
        ALLOWED_SW_RESPONSE_TYPES.includes(message['type'] as SWResponseType)
    );
};
