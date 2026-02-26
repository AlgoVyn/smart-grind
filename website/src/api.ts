// --- API MODULE ---
// API functions for data management with offline detection and operation-based sync

import { saveData, saveProblem, saveDeletedId, flushPendingSync } from './api/api-save';
import { loadData } from './api/api-load';
import { syncPlan, mergeStructure } from './api/api-sync';
import { resetAll, resetCategory, resetAlgorithmCategory } from './api/api-reset';
import { deleteCategory, deleteAlgorithmCategory } from './api/api-delete';
import { state } from './state';
import { getConnectivityChecker } from './sw/connectivity-checker';
import { isBrowserOnline as checkBrowserOnline } from './api/api-utils';
import { cleanupManager } from './utils/cleanup-manager';
import { isSyncStatusResponse, type SyncStatus, type APIOperation } from './types/sync';
import { sendMessageToSW, isServiceWorkerAvailable } from './sw/sw-messaging';
import { SYNC_CONFIG } from './config/sync-config';

// Import and re-export types for backward compatibility
import type { APIOperationType } from './types/sync';
export type { APIOperationType, APIOperation };

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
 * Generates a unique operation ID
 */
const generateOperationId = (): string =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

/**
 * Stores operations in localStorage fallback (when SW is unavailable)
 * @param operations - Array of operations to store
 * @returns Array of operation IDs
 */
const storeOperationsLocally = (operations: APIOperation[]): string[] => {
    const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
    const opsWithIds = operations.map((op) => ({ ...op, id: generateOperationId() }));
    pendingOps.push(...opsWithIds);
    localStorage.setItem('pending-operations', JSON.stringify(pendingOps));
    return opsWithIds.map((op) => op.id);
};

/**
 * Queues API operations for background synchronization.
 * @param operation - Single operation or array of operations to queue
 * @returns Operation ID(s) or null if user is not signed in
 */
export async function queueOperation(
    operationOrOperations: APIOperation | APIOperation[]
): Promise<string | string[] | null> {
    if (state.user.type !== 'signed-in') return null;

    const operations = Array.isArray(operationOrOperations)
        ? operationOrOperations
        : [operationOrOperations];
    const isSingle = !Array.isArray(operationOrOperations);

    if (!isServiceWorkerAvailable()) {
        const ids = storeOperationsLocally(operations);
        return isSingle ? (ids[0] ?? null) : ids;
    }

    await sendMessageToSW({ type: 'SYNC_OPERATIONS', operations });
    updateSyncStatus().catch(() => {});

    const ids = operations.map(() => generateOperationId());
    return isSingle ? (ids[0] ?? null) : ids;
}

/**
 * Queues multiple API operations for background synchronization in batch.
 * @param operations - Array of operations to queue
 * @returns Promise resolving to array of operation IDs
 */
export const queueOperations = (operations: APIOperation[]): Promise<string[]> =>
    queueOperation(operations) as Promise<string[]>;

/**
 * Retrieves the current synchronization status from the service worker.
 * @returns Current sync status or null if unavailable
 */
export async function getSyncStatus(): Promise<SyncStatus | null> {
    if (!isServiceWorkerAvailable()) {
        const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
        return {
            pendingCount: pendingOps.length,
            isSyncing: false,
            lastSyncAt: null,
            stats: { pending: pendingOps.length, completed: 0, failed: 0, manual: 0 },
        };
    }

    const response = await sendMessageToSW({ type: 'GET_SYNC_STATUS' });

    // Use type guard for validation
    if (isSyncStatusResponse(response)) {
        return response.status ?? null;
    }

    return null;
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
 * @returns Result of the sync operation
 */
export async function forceSync(): Promise<{ success: boolean; synced: number; failed: number }> {
    if (!isServiceWorkerAvailable()) {
        const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
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
        } catch (_e) {
            // Background Sync registration failed
        }
    }

    const response = await sendMessageToSW({ type: 'FORCE_SYNC' });
    const result = response as { success: boolean; synced: number; failed: number } | null;
    await updateSyncStatus();
    return result || { success: false, synced: 0, failed: 0 };
}

/**
 * Clear all pending operations (for logout/reset)
 */
export async function clearPendingOperations(): Promise<void> {
    if (!isServiceWorkerAvailable()) {
        localStorage.removeItem('pending-operations');
        return;
    }
    await sendMessageToSW({ type: 'CLEAR_ALL_CACHES' });
    await updateSyncStatus();
}

/**
 * Saves problem updates with automatic offline support.
 * @param problemId - ID of the problem to update
 * @param updates - Partial problem data to save
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
        let operationType: APIOperationType = 'MARK_SOLVED';
        if (updates.note !== undefined) operationType = 'ADD_NOTE';
        else if (updates.nextReviewDate !== undefined) operationType = 'UPDATE_REVIEW_DATE';

        queueOperation({
            type: operationType,
            data: { problemId, ...updates, timestamp: Date.now() },
            timestamp: Date.now(),
        }).catch(() => {});
    }
}

/**
 * Deletes a problem with automatic offline support.
 * @param problemId - ID of the problem to delete
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

/**
 * Migrates operations stored in localStorage to the service worker queue.
 * This handles the case where operations were queued before the service worker was available.
 */
async function migrateLocalStorageOperations(): Promise<void> {
    const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
    if (pendingOps.length === 0) return;

    if (!isServiceWorkerAvailable()) return;

    try {
        await sendMessageToSW({ type: 'SYNC_OPERATIONS', operations: pendingOps });
        localStorage.removeItem('pending-operations');
    } catch (_error) {
        // Failed to migrate localStorage operations
    }
}

/**
 * Initializes offline/online detection and sync status monitoring.
 * @returns Cleanup function to stop monitoring
 */
export function initOfflineDetection(): () => void {
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
        } catch {
            // Failed to sync after connectivity restore
        }
    });

    checker.startMonitoring();
    checker.isOnline().then((online) => state.setOnlineStatus(online));

    if (!isServiceWorkerAvailable()) {
        return () => cleanupManager.cleanup('api');
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
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
    });

    const intervalId = setInterval(
        () => updateSyncStatus().catch(() => {}),
        SYNC_CONFIG.INTERVALS.SYNC_STATUS_POLL
    );

    cleanupManager.register('api', () => {
        unsubscribe();
        checker.stopMonitoring();
        clearInterval(intervalId);
    });

    return () => cleanupManager.cleanup('api');
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
    resetAlgorithmCategory,
    deleteCategory,
    deleteAlgorithmCategory,
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
};
