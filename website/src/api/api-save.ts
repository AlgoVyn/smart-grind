// --- API SAVE MODULE ---
// Data saving operations

import { UserData, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { renderers } from '../renderers';
import { ui } from '../ui/ui';
import { validateResponseOrigin, isBrowserOnline, getErrorMessage } from './api-utils';

/**
 * Debounce configuration for remote sync
 * This batches multiple rapid changes into a single sync request
 */
const SYNC_DEBOUNCE_MS = 1000;
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSyncData: UserData | null = null;

/**
 * Prepares the current problem data for saving by serializing the problems map and deleted IDs.
 */
const prepareDataForSave = (): UserData => ({
    problems: Object.fromEntries(
        Array.from(state.problems.entries()).map(
            ([id, { loading: _, noteVisible: __, ...rest }]) => [id, rest]
        )
    ),
    deletedIds: Array.from(state.deletedProblemIds),
});

/**
 * Fetches a CSRF token from the API.
 */
const fetchCsrfToken = async (): Promise<string> => {
    if (!isBrowserOnline()) {
        throw new Error('OFFLINE: Cannot fetch CSRF token while offline');
    }
    const response = await fetch(`${data.API_BASE}/user?action=csrf`, { credentials: 'include' });
    validateResponseOrigin(response);
    if (!response.ok) throw new Error('Failed to fetch CSRF token');
    const responseData: { csrfToken: string } = await response.json();
    return responseData.csrfToken;
};

/**
 * Saves the provided data to the remote API.
 */
const saveRemotelyWithData = async (dataToSave: UserData | null): Promise<void> => {
    if (!isBrowserOnline()) throw new Error('OFFLINE: Cannot save remotely while offline');

    const dataToUse = dataToSave || prepareDataForSave();
    const csrfToken = await fetchCsrfToken();
    const response = await fetch(`${data.API_BASE}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ data: dataToUse }),
    });

    validateResponseOrigin(response);
    if (!response.ok) {
        throw new Error(getErrorMessage(response.status, `Save failed: ${response.statusText}`));
    }
};

/**
 * Handles the save operation with error handling and UI updates.
 */
const handleSaveOperation = async (
    saveFn: () => Promise<void>,
    isOfflineMode = false
): Promise<void> => {
    try {
        await saveFn();
        renderers.updateStats();
    } catch (e) {
        console.error('Save error:', e);
        if (isOfflineMode) throw e;

        const errorMessage =
            e instanceof TypeError && e.message.includes('fetch')
                ? 'Network error. Please check your internet connection and try again.'
                : e instanceof Error
                  ? e.message
                  : String(e);

        ui.showAlert(`Failed to save data: ${errorMessage}`);
        throw e;
    }
};

/**
 * Executes the actual background sync after debounce period.
 */
const executeBackgroundSync = async (): Promise<void> => {
    syncDebounceTimer = null;
    const dataToSync = pendingSyncData;
    pendingSyncData = null;

    try {
        if (isBrowserOnline()) {
            try {
                await saveRemotelyWithData(dataToSync);
                console.log('[APISave] Direct remote save successful');
                return;
            } catch (error) {
                console.warn(
                    '[APISave] Direct remote save failed, falling back to SW queue:',
                    error
                );
            }
        }

        const { queueOperation, forceSync } = await import('../api');
        await queueOperation({
            type: 'UPDATE_SETTINGS',
            data: dataToSync || prepareDataForSave(),
            timestamp: Date.now(),
        });

        if (isBrowserOnline()) await forceSync();
    } catch (error) {
        console.warn('[APISave] Background sync trigger failed:', error);
    }
};

/**
 * Triggers background sync for signed-in users with debouncing.
 */
const triggerBackgroundSync = (): void => {
    pendingSyncData = prepareDataForSave();
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(executeBackgroundSync, SYNC_DEBOUNCE_MS);
};

/**
 * Performs the save operation based on the user type (local or remote).
 */
export const _performSave = async (): Promise<void> => {
    await handleSaveOperation(async () => state.saveToStorage(), true);
    if (state.user.type === 'signed-in') triggerBackgroundSync();
};

/**
 * Saves a problem to storage or API.
 */
export const saveProblem = async (_problem?: Problem): Promise<void> => {
    await apiSave._performSave();
};

/**
 * Saves the deletion of a problem by marking it and saving the state.
 */
export const saveDeletedId = async (id: string): Promise<void> => {
    const problem = state.problems.get(id);
    try {
        state.problems.delete(id);
        state.deletedProblemIds.add(id);
        await apiSave._performSave();
        renderers.renderMainView(state.ui.activeTopicId);
    } catch (e) {
        console.error('Delete save error:', e);
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to delete problem: ${message}`);
        if (problem) {
            state.problems.set(id, problem);
            state.deletedProblemIds.delete(id);
        }
        throw e;
    }
};

/**
 * Saves all current data to storage or API.
 */
export const saveData = async (): Promise<void> => {
    await apiSave._performSave();
};

/**
 * Forces an immediate sync, bypassing the debounce timer.
 */
export const flushPendingSync = async (): Promise<void> => {
    if (syncDebounceTimer) {
        clearTimeout(syncDebounceTimer);
        syncDebounceTimer = null;
    }

    if (pendingSyncData) {
        const dataToSync = pendingSyncData;
        pendingSyncData = null;

        try {
            if (isBrowserOnline()) {
                await saveRemotelyWithData(dataToSync);
                console.log('[APISave] Flushed pending sync successfully');
            }
        } catch (error) {
            console.warn('[APISave] Failed to flush pending sync:', error);
            const { queueOperation, forceSync } = await import('../api');
            await queueOperation({
                type: 'UPDATE_SETTINGS',
                data: dataToSync,
                timestamp: Date.now(),
            });
            if (isBrowserOnline()) await forceSync();
        }
    }
};

/**
 * Resets the debounce state. Used for testing.
 */
export const _resetDebounceState = (): void => {
    if (syncDebounceTimer) {
        clearTimeout(syncDebounceTimer);
        syncDebounceTimer = null;
    }
    pendingSyncData = null;
};

/**
 * Saves the current state data to local storage.
 */
export const _saveLocally = async (): Promise<void> => {
    state.saveToStorage();
};

/**
 * Saves the prepared data to the remote API.
 */
export const _saveRemotely = async (): Promise<void> => {
    await saveRemotelyWithData(null);
};

// Set up page unload handler to flush pending syncs
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (syncDebounceTimer && pendingSyncData) {
            const csrfToken = localStorage.getItem('smartgrind-csrf-token');
            if (csrfToken && isBrowserOnline()) {
                const blob = new Blob([JSON.stringify({ data: pendingSyncData })], {
                    type: 'application/json',
                });
                navigator.sendBeacon(`${data.API_BASE}/user?_csrf=${csrfToken}`, blob);
            }
        }
    });
}

// Export apiSave object for backward compatibility with tests
export const apiSave = {
    _performSave,
    _saveLocally,
    _saveRemotely,
    _resetDebounceState,
    _triggerBackgroundSync: triggerBackgroundSync,
    saveData,
    saveProblem,
    saveDeletedId,
    flushPendingSync,
};
