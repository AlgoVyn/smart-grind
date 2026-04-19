// --- API MODULE ---
// API functions for data management with offline detection and operation-based sync

import { saveData, saveProblem, saveDeletedId, flushPendingSync } from './api/api-save';
import { loadData } from './api/api-load';
import { syncPlan, mergeStructure } from './api/api-sync';
import { resetAll, resetCategory, resetAlgorithmCategory, resetSQLCategory } from './api/api-reset';
import { deleteCategory, deleteAlgorithmCategory, deleteSQLCategory } from './api/api-delete';
import { state } from './state';
import { getConnectivityChecker } from './sw/connectivity-checker';
import { isBrowserOnline as checkBrowserOnline } from './api/api-utils';
import {
    isSyncStatusResponse,
    isForceSyncResponse,
    type SyncStatus,
    type APIOperation,
} from './types/sync';
import { sendMessageToSW, isServiceWorkerAvailable } from './sw/sw-messaging';
import { SYNC_CONFIG } from './config/sync-config';
import { MAX_PENDING_OPERATIONS, DEDUP_WINDOW_MS } from './config/limits';
import { errorTracker } from './utils/error-tracker';

// Re-export types
export type { APIOperationType, APIOperation, SyncStatus } from './types/sync';

/** Key for storing pending operations in localStorage */
const PENDING_OPS_KEY = 'pending-operations';

/** Generates a unique operation ID */
const generateOperationId = (): string =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/**
 * Safely parse pending operations from localStorage
 */
const safeParsePendingOps = (): APIOperation[] => {
    try {
        const rawValue = localStorage.getItem(PENDING_OPS_KEY);
        // Handle corrupted data from improper localStorage writes
        if (rawValue === '[object Object]') {
            localStorage.removeItem(PENDING_OPS_KEY);
            return [];
        }
        return JSON.parse(rawValue || '[]');
    } catch {
        // Clear corrupted data on parse failure
        localStorage.removeItem(PENDING_OPS_KEY);
        return [];
    }
};

// ============================================================================
// REQUEST DEDUPLICATION
// Prevents redundant API calls for the same operation in flight
// Only used when Service Worker is available (for sync operations)
// ============================================================================

/** Entry in the in-flight requests map with timestamp for TTL cleanup */
interface InFlightEntry {
    promise: Promise<unknown>;
    timestamp: number;
}

/** In-flight request deduplication map with TTL-based cleanup */
const inFlightRequests = new Map<string, InFlightEntry>();

/** Maximum number of entries to keep in the deduplication map */
const MAX_INFLIGHT_ENTRIES = 100;

/** TTL for in-flight requests in milliseconds (5 minutes) */
const INFLIGHT_TTL_MS = 5 * 60 * 1000;

/** Type for operation data with problemId */
interface OperationData {
    problemId?: string;
    [key: string]: unknown;
}

/**
 * Cleans up expired entries from the in-flight requests map
 * This prevents memory leaks from stale entries
 */
const cleanupExpiredInFlightRequests = (): void => {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of inFlightRequests.entries()) {
        if (now - entry.timestamp > INFLIGHT_TTL_MS) {
            inFlightRequests.delete(key);
            cleaned++;
        }
    }

    if (cleaned > 0) {
        console.log(`[API] Cleaned up ${cleaned} expired in-flight request(s)`);
    }
};

/**
 * Cleans up oldest entries when the map exceeds max size
 * This prevents unbounded memory growth
 */
const cleanupOldestInFlightRequests = (): void => {
    if (inFlightRequests.size <= MAX_INFLIGHT_ENTRIES) return;

    // Sort by timestamp and remove oldest entries
    const entries = Array.from(inFlightRequests.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = entries.slice(0, entries.length - MAX_INFLIGHT_ENTRIES);
    for (const [key] of toRemove) {
        inFlightRequests.delete(key);
    }

    console.log(
        `[API] Cleaned up ${toRemove.length} oldest in-flight request(s) due to size limit`
    );
};

/**
 * Periodic cleanup to prevent memory leaks
 * Runs every 60 seconds to clean up stale entries
 */
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/** Request counter for lazy-starting the cleanup interval */
let requestCount = 0;

const startCleanupInterval = (): void => {
    if (cleanupInterval) return; // Already running
    cleanupInterval = setInterval(() => {
        cleanupExpiredInFlightRequests();
        cleanupOldestInFlightRequests();
    }, 60000);
    // Allow Node.js to exit if this is the only timer (for tests)
    if (cleanupInterval.unref) {
        cleanupInterval.unref();
    }
};

/**
 * Starts the cleanup interval lazily (only after first request)
 */
const maybeStartCleanup = (): void => {
    requestCount++;
    if (requestCount === 1) {
        startCleanupInterval();
    }
};

/**
 * Stops the cleanup interval (useful for testing)
 */
export function stopDedupCleanup(): void {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
    }
}

/**
 * Generates a deduplication key for an operation
 * Combines operation type and relevant data fields
 */
const generateDedupKey = (operation: APIOperation): string => {
    const { type, data } = operation;
    // Create a key based on operation type and problem ID
    const opData = data as OperationData;
    const problemId = opData?.problemId || 'none';
    const timestamp = Math.floor(Date.now() / DEDUP_WINDOW_MS) * DEDUP_WINDOW_MS;
    return `${type}:${problemId}:${timestamp}`;
};

/**
 * Executes a function with request deduplication
 * If the same operation is already in flight, returns the existing promise
 * @param key - Deduplication key
 * @param fn - Async function to execute
 * @returns Promise resolving to the function result
 */
async function withDedup<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Lazy-start cleanup interval on first request
    maybeStartCleanup();

    // Check if there's already an in-flight request with this key
    const existing = inFlightRequests.get(key);
    if (existing) {
        console.log(`[API] Deduplicating request: ${key}`);
        return existing.promise as Promise<T>;
    }

    // Clean up old entries if we're at the limit
    if (inFlightRequests.size >= MAX_INFLIGHT_ENTRIES) {
        cleanupOldestInFlightRequests();
    }

    // Create new request
    const timestamp = Date.now();
    const promise = fn().finally(() => {
        // Clean up after completion (success or failure)
        setTimeout(() => {
            inFlightRequests.delete(key);
        }, DEDUP_WINDOW_MS);
    });

    // Store the in-flight request with timestamp
    inFlightRequests.set(key, { promise, timestamp });

    return promise;
}

/**
 * Clears all in-flight request deduplication entries
 * Useful for testing or when forcing fresh requests
 */
export function clearDedupCache(): void {
    inFlightRequests.clear();
    console.log('[API] Deduplication cache cleared');
}

/** Stores operations in localStorage fallback (when SW is unavailable) */
const storeOperationsLocally = (operations: APIOperation[]): string[] => {
    const pendingOps = safeParsePendingOps();

    if (pendingOps.length + operations.length > MAX_PENDING_OPERATIONS) {
        throw new Error(
            `Pending operations limit exceeded (${MAX_PENDING_OPERATIONS}). Please sync your data.`
        );
    }

    const opsWithIds = operations.map((op) => ({ ...op, id: generateOperationId() }));
    pendingOps.push(...opsWithIds);

    try {
        localStorage.setItem(PENDING_OPS_KEY, JSON.stringify(pendingOps));
    } catch (e) {
        if (
            e instanceof Error &&
            (e.name === 'QuotaExceededError' || e.message.includes('quota'))
        ) {
            throw new Error('Storage quota exceeded. Please sync your data to free up space.');
        }
        throw e;
    }

    return opsWithIds.map((op) => op.id);
};

/**
 * Check if the browser is online with actual connectivity verification
 */
export async function isOnline(): Promise<boolean> {
    const checker = getConnectivityChecker();
    return checker.isOnline();
}

/**
 * Check if the browser reports online status (fast check without verification)
 */
export function isBrowserOnline(): boolean {
    return checkBrowserOnline();
}

/**
 * Queues API operations for background synchronization.
 * Implements deduplication for SW operations to prevent redundant syncs.
 * Falls back to localStorage when SW is unavailable.
 * @param operation - Single operation or array of operations to queue
 * @returns Operation ID(s) or null if user is not signed in
 */
export async function queueOperation(
    operationOrOperations: APIOperation | APIOperation[]
): Promise<string | string[] | null> {
    if (state.user.type !== 'signed-in') return null;

    const isSingle = !Array.isArray(operationOrOperations);
    const operations: APIOperation[] = isSingle
        ? [operationOrOperations as APIOperation]
        : (operationOrOperations as APIOperation[]);

    // When Service Worker is unavailable, store locally without dedup
    if (!isServiceWorkerAvailable()) {
        const ids = storeOperationsLocally(operations);
        return isSingle ? (ids[0] ?? null) : ids;
    }

    // Use deduplication for single operations when SW is available
    if (isSingle && operations.length === 1) {
        const op = operations[0]!;
        const dedupKey = generateDedupKey(op);

        return withDedup(dedupKey, async () => {
            // Update pending count immediately for responsive UI
            const currentPending = state.sync?.pendingCount ?? 0;
            state.setSyncStatus({ pendingCount: currentPending + 1 });
            await sendMessageToSW({ type: 'SYNC_OPERATIONS', operations: [op] });
            // Trigger sync immediately after queuing
            await sendMessageToSW({ type: 'REQUEST_SYNC', tag: 'sync-user-progress' });
            updateSyncStatus().catch((err) => {
                console.warn('[API] Failed to fetch initial sync status:', err);
            });
            return generateOperationId();
        });
    }

    // For multiple operations with SW, send without dedup
    // Update pending count immediately for responsive UI
    const currentPending = state.sync?.pendingCount ?? 0;
    state.setSyncStatus({ pendingCount: currentPending + operations.length });
    await sendMessageToSW({ type: 'SYNC_OPERATIONS', operations });
    // Trigger sync immediately after queuing
    await sendMessageToSW({ type: 'REQUEST_SYNC', tag: 'sync-user-progress' });
    updateSyncStatus().catch((err) => {
        console.warn('[API] Failed to fetch initial sync status:', err);
    });

    const ids = operations.map(() => generateOperationId());
    return isSingle ? (ids[0] ?? null) : ids;
}

/**
 * Queues multiple API operations for background synchronization in batch.
 */
export const queueOperations = (operations: APIOperation[]): Promise<string[]> =>
    queueOperation(operations) as Promise<string[]>;

/**
 * Retrieves the current synchronization status from the service worker.
 */
export async function getSyncStatus(): Promise<SyncStatus | null> {
    if (!isServiceWorkerAvailable()) {
        const pendingOps = safeParsePendingOps();
        return {
            pendingCount: pendingOps.length,
            isSyncing: false,
            lastSyncAt: null,
            stats: { pending: pendingOps.length, completed: 0, failed: 0, manual: 0 },
        };
    }

    const response = await sendMessageToSW({ type: 'GET_SYNC_STATUS' });
    return isSyncStatusResponse(response) ? (response.status ?? null) : null;
}

/**
 * Update sync status in state from service worker
 */
export async function updateSyncStatus(): Promise<void> {
    const status = await getSyncStatus();
    if (status) {
        state.setSyncStatus({
            pendingCount: status.pendingCount,
            isSyncing: status.isSyncing,
            lastSyncAt: status.lastSyncAt,
        });
    }
}

/**
 * Forces an immediate synchronization of all pending operations.
 */
export async function forceSync(): Promise<{ success: boolean; synced: number; failed: number }> {
    if (!isServiceWorkerAvailable()) {
        const pendingOps = safeParsePendingOps();
        if (pendingOps.length === 0) return { success: true, synced: 0, failed: 0 };
        return { success: false, synced: 0, failed: pendingOps.length };
    }

    const registration = await navigator.serviceWorker.ready;
    const swRegistration = registration as ServiceWorkerRegistration & {
        sync?: { register: (_tag: string) => Promise<void> };
    };

    if (swRegistration.sync) {
        try {
            await swRegistration.sync.register('sync-user-progress');
        } catch (error) {
            errorTracker.captureException(error, { type: 'background_sync_registration_failed' });
        }
    }

    const response = await sendMessageToSW({ type: 'FORCE_SYNC' });
    if (!isForceSyncResponse(response)) {
        console.error('[API] Invalid force sync response', response);
        return { success: false, synced: 0, failed: 0 };
    }

    await updateSyncStatus();
    return response;
}

/**
 * Clear all pending operations (for logout/reset)
 */
export async function clearPendingOperations(): Promise<void> {
    if (!isServiceWorkerAvailable()) {
        localStorage.removeItem(PENDING_OPS_KEY);
        return;
    }
    await sendMessageToSW({ type: 'CLEAR_ALL_CACHES' });
    await updateSyncStatus();
}

/**
 * Saves problem updates with automatic offline support.
 * Implements deduplication to prevent redundant save operations.
 */
export async function saveProblemWithSync(
    problemId: string,
    updates: Partial<{
        status: 'solved' | 'unsolved';
        nextReviewDate: string | null;
        reviewInterval: number;
        note: string;
    }>
): Promise<void> {
    await saveProblem();

    if (state.user.type === 'signed-in') {
        let operationType: import('./types/sync').APIOperationType = 'MARK_SOLVED';
        if (updates.note !== undefined) operationType = 'ADD_NOTE';
        else if (updates.nextReviewDate !== undefined) operationType = 'UPDATE_REVIEW_DATE';

        queueOperation({
            type: operationType,
            data: { problemId, ...updates, timestamp: Date.now() },
            timestamp: Date.now(),
        }).catch((error) => {
            errorTracker.captureException(error, { type: 'queue_operation_failed', operationType });
        });
    }
}

/**
 * Deletes a problem with automatic offline support.
 */
export async function deleteProblemWithSync(problemId: string): Promise<void> {
    await saveDeletedId(problemId);

    if (state.user.type === 'signed-in') {
        await queueOperation({
            type: 'DELETE_PROBLEM',
            data: { problemId, timestamp: Date.now() },
            timestamp: Date.now(),
        });
    }
}

/** Migrates operations stored in localStorage to the service worker queue. */
async function migrateLocalStorageOperations(): Promise<void> {
    const pendingOps = safeParsePendingOps();
    if (pendingOps.length === 0) return;
    if (!isServiceWorkerAvailable()) return;

    try {
        await sendMessageToSW({ type: 'SYNC_OPERATIONS', operations: pendingOps });
        localStorage.removeItem(PENDING_OPS_KEY);
    } catch (error) {
        errorTracker.captureException(error, { type: 'migrate_localstorage_operations_failed' });
    }
}

/**
 * Initializes offline/online detection and sync status monitoring.
 * @returns Cleanup function to stop monitoring
 */
export async function initOfflineDetection(): Promise<() => void> {
    const checker = getConnectivityChecker();

    const unsubscribe = checker.onConnectivityChange(async (online) => {
        state.setOnlineStatus(online);
        if (!online) return;
        try {
            await migrateLocalStorageOperations();
            if (state.user.type === 'signed-in') {
                const { _performSave } = await import('./api/api-save');
                await _performSave();
            }
            await forceSync();
        } catch (error) {
            errorTracker.captureException(error, {
                type: 'sync_after_connectivity_restore_failed',
            });
        }
    });

    checker.startMonitoring();
    const online = await checker.isOnline();
    state.setOnlineStatus(online);

    // Track cleanup handlers for proper resource management
    const cleanupHandlers: (() => void)[] = [];
    cleanupHandlers.push(unsubscribe);
    cleanupHandlers.push(() => checker.stopMonitoring());

    const intervalId = setInterval(
        () => updateSyncStatus().catch(() => {}),
        SYNC_CONFIG.INTERVALS.SYNC_STATUS_POLL
    );
    cleanupHandlers.push(() => clearInterval(intervalId));

    // Service Worker message handling for sync status updates
    if (isServiceWorkerAvailable()) {
        const handleServiceWorkerMessage = (event: MessageEvent) => {
            const { type, data } = event.data || {};
            if (!type) return;

            switch (type) {
                case 'SYNC_COMPLETED':
                    state.setSyncStatus({
                        isSyncing: false,
                        lastSyncAt: Date.now(),
                        pendingCount: data?.pending ?? 0,
                    });
                    break;
                case 'SYNC_PROGRESS_SYNCED':
                    if (data?.pending !== undefined) {
                        state.setSyncStatus({ pendingCount: data.pending });
                    }
                    break;
                case 'SYNC_CONFLICT_REQUIRES_MANUAL':
                    state.setSyncStatus({
                        hasConflicts: true,
                        conflictMessage: data?.message,
                    });
                    break;
                case 'SYNC_AUTH_REQUIRED':
                    state.setSyncStatus({
                        isSyncing: false,
                        pendingCount: data?.pendingCount ?? state.sync.pendingCount,
                    });
                    break;
            }
        };

        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        cleanupHandlers.push(() => {
            if (typeof navigator.serviceWorker.removeEventListener === 'function') {
                navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
            }
        });
    }

    // Fetch initial sync status to ensure UI is up-to-date (non-blocking)
    updateSyncStatus().catch((err) => {
        console.warn('[API] Failed to fetch initial sync status:', err);
    });

    // Return cleanup function
    const cleanup = () => {
        cleanupHandlers.forEach((handler) => handler());
    };

    // Register for cleanup on page unload
    const handleBeforeUnload = () => cleanup();
    window.addEventListener('beforeunload', handleBeforeUnload);
    cleanupHandlers.push(() => window.removeEventListener('beforeunload', handleBeforeUnload));

    return cleanup;
}

// API object - combines all API functions
export const api = {
    saveData,
    saveProblem,
    saveDeletedId,
    loadData,
    syncPlan,
    mergeStructure,
    resetAll,
    resetCategory,
    resetAlgorithmCategory,
    resetSQLCategory,
    deleteCategory,
    deleteAlgorithmCategory,
    deleteSQLCategory,
    saveProblemWithSync,
    deleteProblemWithSync,
    queueOperation,
    queueOperations,
    getSyncStatus,
    forceSync,
    clearPendingOperations,
    isOnline,
    initOfflineDetection,
    flushPendingSync,
    clearDedupCache,
};
