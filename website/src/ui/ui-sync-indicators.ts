// --- SYNC INDICATORS MODULE ---
// UI components for displaying offline/sync status

import { state } from '../state';
import { showToast, showEl, hideEl, toggleEl } from '../utils';

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
    toggleEl(elements.onlineIndicator, isOnline);
};

// Update offline indicator visibility
const updateOfflineIndicator = (isOnline: boolean, previousState?: boolean): void => {
    const elements = getElements();
    toggleEl(elements.offlineIndicator, !isOnline);
    if (!isOnline) {
        // Hide syncing when offline (can't sync while offline)
        hideEl(elements.syncingIndicator);
        // Show toast when going offline
        if (previousState !== false) {
            showToast(
                'You are now offline. Changes will sync when connection is restored.',
                'warning'
            );
        }
    }
};

// Update syncing indicator visibility
const updateSyncingIndicator = (isSyncing: boolean, previousState?: boolean): void => {
    const elements = getElements();
    toggleEl(elements.syncingIndicator, isSyncing);
    if (!isSyncing && previousState === true) {
        showToast('Sync completed successfully', 'success');
    }
};

// Update pending indicator visibility and count
const updatePendingIndicator = (
    pendingCount: number,
    _isOnline: boolean,
    isSyncing: boolean
): void => {
    const elements = getElements();
    if (elements.pendingIndicator && elements.pendingCount) {
        if (pendingCount > 0 && !isSyncing) {
            showEl(elements.pendingIndicator);
            elements.pendingCount.textContent = `${pendingCount} pending`;
        } else {
            hideEl(elements.pendingIndicator);
        }
    }
};

// Update conflict indicator visibility
const updateConflictIndicator = (hasConflicts: boolean, previousState?: boolean): void => {
    const elements = getElements();
    toggleEl(elements.conflictIndicator, hasConflicts);
    if (hasConflicts && previousState !== true) {
        showToast('Sync conflict detected. Please review your changes.', 'error');
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
