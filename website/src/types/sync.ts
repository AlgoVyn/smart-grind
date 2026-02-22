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
