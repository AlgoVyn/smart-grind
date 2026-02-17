// --- SYNC INDICATORS MODULE ---
// UI components for displaying offline/sync status

import { state } from '../state';
import { utils } from '../utils';

// DOM element cache for sync indicators
interface SyncIndicatorElements {
    container: HTMLElement | null;
    onlineIndicator: HTMLElement | null;
    offlineIndicator: HTMLElement | null;
    syncingIndicator: HTMLElement | null;
    pendingIndicator: HTMLElement | null;
    pendingCount: HTMLElement | null;
    conflictIndicator: HTMLElement | null;
}

// Cache sync indicator elements
const getElements = (): SyncIndicatorElements => ({
    container: document.getElementById('sync-status-container'),
    onlineIndicator: document.getElementById('online-indicator'),
    offlineIndicator: document.getElementById('offline-indicator'),
    syncingIndicator: document.getElementById('syncing-indicator'),
    pendingIndicator: document.getElementById('pending-indicator'),
    pendingCount: document.getElementById('pending-count'),
    conflictIndicator: document.getElementById('conflict-indicator'),
});

// Update online indicator visibility
const updateOnlineIndicator = (isOnline: boolean): void => {
    const elements = getElements();
    if (elements.onlineIndicator) {
        if (isOnline) {
            elements.onlineIndicator.classList.remove('hidden');
        } else {
            elements.onlineIndicator.classList.add('hidden');
        }
    }
};

// Update offline indicator visibility
const updateOfflineIndicator = (isOnline: boolean, previousState?: boolean): void => {
    const elements = getElements();
    if (elements.offlineIndicator) {
        if (isOnline) {
            elements.offlineIndicator.classList.add('hidden');
        } else {
            elements.offlineIndicator.classList.remove('hidden');
            // Hide syncing and pending when offline
            elements.syncingIndicator?.classList.add('hidden');
            elements.pendingIndicator?.classList.add('hidden');
            // Show toast when going offline
            if (previousState !== false) {
                utils.showToast(
                    'You are now offline. Changes will sync when connection is restored.',
                    'warning'
                );
            }
        }
    }
};

// Update syncing indicator visibility
const updateSyncingIndicator = (isSyncing: boolean, previousState?: boolean): void => {
    const elements = getElements();
    if (elements.syncingIndicator) {
        if (isSyncing) {
            elements.syncingIndicator.classList.remove('hidden');
        } else {
            elements.syncingIndicator.classList.add('hidden');
            // Show toast when sync completes
            if (previousState === true) {
                utils.showToast('Sync completed successfully', 'success');
            }
        }
    }
};

// Update pending indicator visibility and count
// Hide when syncing is in progress to avoid UI clutter
const updatePendingIndicator = (
    pendingCount: number,
    isOnline: boolean,
    isSyncing: boolean
): void => {
    const elements = getElements();
    if (elements.pendingIndicator && elements.pendingCount) {
        // Only show pending indicator when:
        // 1. There are pending operations
        // 2. We're online
        // 3. We're NOT currently syncing (to avoid showing both indicators)
        if (pendingCount > 0 && isOnline && !isSyncing) {
            elements.pendingIndicator.classList.remove('hidden');
            elements.pendingCount.textContent = `${pendingCount} pending`;
        } else {
            elements.pendingIndicator.classList.add('hidden');
        }
    }
};

// Update conflict indicator visibility
const updateConflictIndicator = (hasConflicts: boolean, previousState?: boolean): void => {
    const elements = getElements();
    if (elements.conflictIndicator) {
        if (hasConflicts) {
            elements.conflictIndicator.classList.remove('hidden');
            // Show toast when conflicts detected
            if (previousState !== true) {
                utils.showToast('Sync conflict detected. Please review your changes.', 'error');
            }
        } else {
            elements.conflictIndicator.classList.add('hidden');
        }
    }
};

// Track previous state for toast notifications
let previousSyncStatus = {
    isOnline: true,
    isSyncing: false,
    hasConflicts: false,
};

// Handle sync status change event
const handleSyncStatusChange = (): void => {
    const status = state.getSyncStatus();

    updateOnlineIndicator(status.isOnline);
    updateOfflineIndicator(status.isOnline, previousSyncStatus.isOnline);
    updateSyncingIndicator(status.isSyncing, previousSyncStatus.isSyncing);
    updatePendingIndicator(status.pendingCount, status.isOnline, status.isSyncing);
    updateConflictIndicator(status.hasConflicts, previousSyncStatus.hasConflicts);

    // Update previous state
    previousSyncStatus = {
        isOnline: status.isOnline,
        isSyncing: status.isSyncing,
        hasConflicts: status.hasConflicts,
    };
};

// Initialize sync indicators
export const initSyncIndicators = (): void => {
    // Set initial state based on navigator.onLine
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    state.setOnlineStatus(isOnline);

    // Listen for sync status changes
    if (typeof window !== 'undefined') {
        window.addEventListener('sync-status-change', handleSyncStatusChange);
    }

    // Initial UI update
    handleSyncStatusChange();
};

// Sync indicators module
export const syncIndicators = {
    init: initSyncIndicators,
    updateOnlineIndicator,
    updateOfflineIndicator,
    updateSyncingIndicator,
    updatePendingIndicator,
    updateConflictIndicator,
};
