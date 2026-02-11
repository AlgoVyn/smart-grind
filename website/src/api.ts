// --- API MODULE ---
// API functions for data management with offline detection and operation-based sync

import { saveData, saveProblem, saveDeletedId } from './api/api-save';
import { loadData } from './api/api-load';
import { syncPlan, mergeStructure } from './api/api-sync';
import { resetAll, resetCategory } from './api/api-reset';
import { deleteCategory } from './api/api-delete';
import { state } from './state';

// Operation types for background sync
export type APIOperationType =
    | 'MARK_SOLVED'
    | 'UPDATE_REVIEW_DATE'
    | 'UPDATE_DIFFICULTY'
    | 'ADD_NOTE'
    | 'ADD_CUSTOM_PROBLEM'
    | 'DELETE_PROBLEM'
    | 'UPDATE_SETTINGS';

export interface APIOperation {
    type: APIOperationType;
    data: unknown;
    timestamp: number;
}

// Service Worker message types
interface SWMessage {
    type: string;
    data?: unknown;
    operations?: APIOperation[];
}

/**
 * Check if the browser is online
 */
export function isOnline(): boolean {
    return navigator.onLine;
}

/**
 * Send a message to the service worker
 */
async function sendMessageToSW(message: SWMessage): Promise<unknown> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) {
        return null;
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) {
        return null;
    }

    return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
            resolve(event.data);
        };
        registration.active?.postMessage(message, [channel.port2]);
    });
}

/**
 * Queues a single API operation for background synchronization.
 * When service worker is available, sends message to SW for queueing.
 * Falls back to localStorage if service worker is not supported.
 * @param {APIOperation} operation - The operation to queue (type, data, timestamp)
 * @returns {Promise<string | null>} The operation ID if queued successfully, null otherwise
 * @example
 * const opId = await queueOperation({
 *   type: 'MARK_SOLVED',
 *   data: { problemId: 'two-sum', status: 'solved' },
 *   timestamp: Date.now()
 * });
 */
export async function queueOperation(operation: APIOperation): Promise<string | null> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) {
        // Fallback: store in localStorage for later sync
        const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
        const opWithId = {
            ...operation,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        pendingOps.push(opWithId);
        localStorage.setItem('pending-operations', JSON.stringify(pendingOps));
        return opWithId.id;
    }

    const response = await sendMessageToSW({
        type: 'SYNC_OPERATIONS',
        operations: [operation],
    });

    // Update state with pending operation count
    await updateSyncStatus();

    return response ? (response as { operationId?: string }).operationId || null : null;
}

/**
 * Queues multiple API operations for background synchronization in batch.
 * More efficient than calling queueOperation multiple times for bulk updates.
 * @param {APIOperation[]} operations - Array of operations to queue
 * @returns {Promise<string[]>} Array of operation IDs for each queued operation
 * @example
 * const opIds = await queueOperations([
 *   { type: 'MARK_SOLVED', data: { problemId: 'two-sum' }, timestamp: Date.now() },
 *   { type: 'ADD_NOTE', data: { problemId: 'two-sum', note: 'Use hash map' }, timestamp: Date.now() }
 * ]);
 */
export async function queueOperations(operations: APIOperation[]): Promise<string[]> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) {
        // Fallback: store in localStorage for later sync
        const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
        const opsWithIds = operations.map((op) => ({
            ...op,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }));
        pendingOps.push(...opsWithIds);
        localStorage.setItem('pending-operations', JSON.stringify(pendingOps));
        return opsWithIds.map((op) => op.id);
    }

    await sendMessageToSW({
        type: 'SYNC_OPERATIONS',
        operations,
    });

    // Update state with pending operation count
    await updateSyncStatus();

    return operations.map(() => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
}

/**
 * Retrieves the current synchronization status from the service worker.
 * Returns pending operation count, sync state, and statistics.
 * Falls back to localStorage-based status if service worker is unavailable.
 * @returns {Promise<Object | null>} Sync status object containing:
 *   - pendingCount: Number of operations waiting to sync
 *   - isSyncing: Whether a sync is currently in progress
 *   - lastSyncAt: Timestamp of last successful sync (or null)
 *   - stats: Detailed statistics {pending, completed, failed, manual}
 * @example
 * const status = await getSyncStatus();
 * if (status?.pendingCount > 0) {
 *   console.log(`${status.pendingCount} operations pending`);
 * }
 */
export async function getSyncStatus(): Promise<{
    pendingCount: number;
    isSyncing: boolean;
    lastSyncAt: number | null;
    stats: {
        pending: number;
        completed: number;
        failed: number;
        manual: number;
    };
} | null> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) {
        // Fallback: check localStorage
        const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
        return {
            pendingCount: pendingOps.length,
            isSyncing: false,
            lastSyncAt: null,
            stats: {
                pending: pendingOps.length,
                completed: 0,
                failed: 0,
                manual: 0,
            },
        };
    }

    const response = await sendMessageToSW({ type: 'GET_SYNC_STATUS' });
    return response as {
        pendingCount: number;
        isSyncing: boolean;
        lastSyncAt: number | null;
        stats: {
            pending: number;
            completed: number;
            failed: number;
            manual: number;
        };
    } | null;
}

/**
 * Update sync status in state
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
 * Attempts to sync queued operations to the server right away.
 * Updates sync state after the attempt completes.
 * @returns {Promise<Object>} Sync result containing:
 *   - success: Whether the sync attempt completed without errors
 *   - synced: Number of operations successfully synced
 *   - failed: Number of operations that failed to sync
 * @example
 * const result = await forceSync();
 * if (result.success) {
 *   showToast(`Synced ${result.synced} operations`);
 * }
 */
export async function forceSync(): Promise<{ success: boolean; synced: number; failed: number }> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) {
        // Fallback: try to sync localStorage operations immediately
        const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
        if (pendingOps.length === 0) {
            return { success: true, synced: 0, failed: 0 };
        }

        // In fallback mode, we can't actually sync without SW
        // Just return the pending count as failed
        return { success: false, synced: 0, failed: pendingOps.length };
    }

    const response = await sendMessageToSW({ type: 'FORCE_SYNC' });
    const result = response as { success: boolean; synced: number; failed: number } | null;

    // Update state after sync attempt
    await updateSyncStatus();

    return result || { success: false, synced: 0, failed: 0 };
}

/**
 * Clear all pending operations (for logout/reset)
 */
export async function clearPendingOperations(): Promise<void> {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) {
        localStorage.removeItem('pending-operations');
        return;
    }

    await sendMessageToSW({ type: 'CLEAR_ALL_CACHES' });
    await updateSyncStatus();
}

/**
 * Saves problem updates with automatic offline support.
 * First saves locally, then attempts immediate remote save if online.
 * If remote save fails or offline, queues for background sync.
 * @param {string} problemId - The unique identifier of the problem to update
 * @param {Object} updates - Partial problem updates to apply
 * @param {'solved' | 'unsolved'} [updates.status] - New problem status
 * @param {string | null} [updates.nextReviewDate] - Next scheduled review date (ISO format)
 * @param {number} [updates.reviewInterval] - Spaced repetition interval index (0-5)
 * @param {string} [updates.note] - User's personal notes about the problem
 * @returns {Promise<void>}
 * @example
 * await saveProblemWithSync('two-sum', {
 *   status: 'solved',
 *   nextReviewDate: '2024-01-16',
 *   reviewInterval: 1,
 *   note: 'Use hash map for O(n) solution'
 * });
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
    // Always save locally first
    await saveProblem();

    // If online and signed in, try immediate remote save
    if (isOnline() && state.user.type === 'signed-in') {
        try {
            await saveProblem();
            return;
        } catch (error) {
            // If remote save fails, queue for background sync
            console.warn('Immediate save failed, queuing for background sync:', error);
        }
    }

    // Queue operation for background sync
    const operation: APIOperation = {
        type: 'MARK_SOLVED',
        data: {
            problemId,
            ...updates,
            timestamp: Date.now(),
        },
        timestamp: Date.now(),
    };

    await queueOperation(operation);
}

/**
 * Deletes a problem with automatic offline support.
 * Saves deletion locally first, then queues for background sync if signed in.
 * Ensures deletion is propagated to server when connectivity is restored.
 * @param {string} problemId - The unique identifier of the problem to delete
 * @returns {Promise<void>}
 * @example
 * await deleteProblemWithSync('custom-problem-123');
 * // Problem marked as deleted locally, will sync to server when online
 */
export async function deleteProblemWithSync(problemId: string): Promise<void> {
    // Always save locally first
    await saveDeletedId(problemId);

    // If online and signed in, the save already attempted remote sync
    // Queue operation for background sync to ensure consistency
    if (state.user.type === 'signed-in') {
        const operation: APIOperation = {
            type: 'DELETE_PROBLEM',
            data: {
                problemId,
                timestamp: Date.now(),
            },
            timestamp: Date.now(),
        };

        await queueOperation(operation);
    }
}

/**
 * Initializes offline/online detection and sync status monitoring.
 * Sets up event listeners for network state changes and service worker messages.
 * Automatically triggers sync when connection is restored.
 * Updates application state to reflect current connectivity.
 * @returns {void}
 * @example
 * // Call once during application initialization
 * initOfflineDetection();
 * // Now app will monitor online status and auto-sync when reconnected
 */
export function initOfflineDetection(): void {
    // Update online status in state
    const updateOnlineStatus = () => {
        state.setOnlineStatus(navigator.onLine);
        if (navigator.onLine) {
            // When coming back online, try to sync
            forceSync().catch(console.error);
        }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial status
    updateOnlineStatus();

    // Listen for service worker messages about sync status
    if ('serviceWorker' in navigator && navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type) {
                switch (event.data.type) {
                    case 'SYNC_SYNC_COMPLETED':
                        // Sync completed - update status and fetch fresh pending count
                        state.setSyncStatus({
                            isSyncing: false,
                            lastSyncAt: Date.now(),
                        });
                        // Fetch fresh sync status to get accurate pending count
                        updateSyncStatus().catch(console.error);
                        break;
                    case 'SYNC_PROGRESS_SYNCED':
                        updateSyncStatus().catch(console.error);
                        break;
                    case 'SYNC_CONFLICT_RESOLVED':
                        // Conflict was auto-resolved
                        console.log('Conflict resolved:', event.data.data);
                        break;
                    case 'SYNC_CONFLICT_REQUIRES_MANUAL':
                        // Notify UI that manual resolution is needed
                        state.setSyncStatus({
                            hasConflicts: true,
                            conflictMessage: event.data.data?.message,
                        });
                        break;
                }
            }
        });
    }

    // Periodic sync status update
    setInterval(() => {
        updateSyncStatus().catch(console.error);
    }, 30000); // Every 30 seconds
}

// Export all API functions
export const api = {
    saveData,
    saveProblem,
    saveDeletedId,
    loadData,
    syncPlan,
    mergeStructure,
    resetAll,
    resetCategory,
    deleteCategory,
    // New offline-aware functions
    saveProblemWithSync,
    deleteProblemWithSync,
    queueOperation,
    queueOperations,
    getSyncStatus,
    forceSync,
    clearPendingOperations,
    isOnline,
    initOfflineDetection,
};
