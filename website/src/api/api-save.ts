// --- API SAVE MODULE ---
// Data saving operations

import { UserData, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { renderers } from '../renderers';
import { ui } from '../ui/ui';

/**
 * Check if the browser reports being online
 * This is a fast synchronous check - we rely on the save failing
 * naturally if the network is actually unavailable
 */
const isOnline = (): boolean => {
    return typeof navigator !== 'undefined' && navigator.onLine;
};

/**
 * Debounce configuration for remote sync
 * This batches multiple rapid changes into a single sync request
 */
const SYNC_DEBOUNCE_MS = 1000; // Wait 500ms after last change before syncing
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSyncData: UserData | null = null;

/**
 * Validates that the API response originates from the expected origin
 * @param response - The fetch response to validate
 */
const _validateResponseOrigin = (response: Response): void => {
    const allowedOrigins = [
        window.location.origin,
        'https://smartgrind.com',
        'https://www.smartgrind.com',
    ];

    const responseOrigin = response.headers.get('Origin') || response.url;

    // For same-origin requests, no additional validation needed
    if (response.url.startsWith(window.location.origin)) {
        return;
    }

    // Validate cross-origin responses
    if (!allowedOrigins.some((origin) => responseOrigin.includes(origin))) {
        console.warn('Response from unexpected origin:', responseOrigin);
    }
};

// Export all functions as part of a single object
export const apiSave = {
    /**
     * Prepares the current problem data for saving by serializing the problems map and deleted IDs.
     * @returns {Object} The data object to save.
     * @returns {Object} return.problems - Object of problem IDs to problem data.
     * @returns {string[]} return.deletedIds - Array of deleted problem IDs.
     */
    _prepareDataForSave(): UserData {
        return {
            problems: Object.fromEntries(
                Array.from(state.problems.entries() as IterableIterator<[string, Problem]>).map(
                    ([id, p]) => {
                        const { loading: _loading, noteVisible: _noteVisible, ...rest } = p;
                        return [id, rest];
                    }
                )
            ),
            deletedIds: Array.from(state.deletedProblemIds),
        };
    },

    /**
     * Saves the current state data to local storage.
     */
    async _saveLocally() {
        state.saveToStorage();
    },

    /**
     * Fetches a CSRF token from the API.
     * @returns {Promise<string>} The CSRF token.
     * @throws {Error} Throws an error if the fetch fails or if offline.
     */
    async _fetchCsrfToken(): Promise<string> {
        if (!isOnline()) {
            throw new Error('OFFLINE: Cannot fetch CSRF token while offline');
        }
        const response = await fetch(`${data.API_BASE}/user?action=csrf`, {
            credentials: 'include',
        });
        _validateResponseOrigin(response);
        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }
        const responseData: { csrfToken: string } = await response.json();
        return responseData.csrfToken;
    },

    /**
     * Saves the prepared data to the remote API.
     * @throws {Error} Throws an error if the save request fails or if offline.
     */
    async _saveRemotely(): Promise<void> {
        if (!isOnline()) {
            throw new Error('OFFLINE: Cannot save remotely while offline');
        }
        const dataToSave = this._prepareDataForSave();
        const csrfToken = await this._fetchCsrfToken();
        const response = await fetch(`${data.API_BASE}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({ data: dataToSave }),
        });
        _validateResponseOrigin(response);
        if (!response.ok) {
            const errorMessages: Record<number, string> = {
                401: 'Authentication failed. Please sign in again.',
                403: 'CSRF token validation failed. Please refresh the page and try again.',
                500: 'Server error. Please try again later.',
            };
            throw new Error(
                errorMessages[response.status] || `Save failed: ${response.statusText}`
            );
        }
    },

    /**
     * Handles the save operation with error handling and UI updates.
     * @param {Function} saveFn - The save function to execute (local or remote).
     * @param {boolean} isOfflineMode - Whether this is an offline save (no error UI).
     * @throws {Error} Throws an error if the save function fails.
     */
    async _handleSaveOperation(saveFn: () => Promise<void>, isOfflineMode = false): Promise<void> {
        try {
            await saveFn();
            renderers.updateStats();
        } catch (e) {
            console.error('Save error:', e);

            // If in offline mode, don't show error UI - just rethrow
            if (isOfflineMode) {
                throw e;
            }

            // Handle different error types with specific messages
            let errorMessage: string;

            if (e instanceof TypeError && e.message.includes('fetch')) {
                // Network error
                errorMessage =
                    'Network error. Please check your internet connection and try again.';
            } else if (e instanceof Error) {
                // Check for specific error messages from _saveRemotely
                if (e.message.includes('Authentication failed')) {
                    errorMessage = 'Authentication failed. Please sign in again.';
                } else if (e.message.includes('CSRF token validation failed')) {
                    errorMessage =
                        'CSRF token validation failed. Please refresh the page and try again.';
                } else if (e.message.includes('Server error')) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (e.message.includes('Save failed')) {
                    errorMessage = e.message;
                } else {
                    errorMessage = e.message;
                }
            } else {
                errorMessage = String(e);
            }

            ui.showAlert(`Failed to save data: ${errorMessage}`);
            throw e;
        }
    },

    /**
     * Performs the save operation based on the user type (local or remote).
     * Always saves locally first, then triggers background sync for signed-in users.
     * The frontend is never blocked by remote saves - they happen in the background.
     * @throws {Error} Throws an error if the local save fails.
     */
    async _performSave(): Promise<void> {
        // ALWAYS save locally first to ensure offline availability
        // This acts as a reliable backup even for signed-in users
        await this._handleSaveOperation(this._saveLocally.bind(this), true);

        const isSignedIn = state.user.type === 'signed-in';

        // For signed-in users, trigger background sync without blocking
        // The actual remote save happens in the service worker
        if (isSignedIn) {
            // Fire and forget - sync happens in background
            this._triggerBackgroundSync();
        }
    },

    /**
     * Triggers background sync for signed-in users with debouncing.
     * Multiple rapid changes are batched into a single sync request.
     * This is non-blocking - the frontend returns immediately.
     * If online, attempts direct remote save first. Falls back to SW queue if that fails.
     */
    _triggerBackgroundSync(): void {
        // Store the current data to sync
        pendingSyncData = this._prepareDataForSave();

        // Clear any existing timer
        if (syncDebounceTimer !== null) {
            clearTimeout(syncDebounceTimer);
        }

        // Set a new timer to execute the sync after debounce period
        syncDebounceTimer = setTimeout(() => {
            this._executeBackgroundSync();
        }, SYNC_DEBOUNCE_MS);
    },

    /**
     * Executes the actual background sync after debounce period.
     * This is called internally after the debounce timer fires.
     */
    _executeBackgroundSync(): void {
        // Clear the timer reference
        syncDebounceTimer = null;

        // Get the pending data and clear it
        const dataToSync = pendingSyncData;
        pendingSyncData = null;

        // Don't await - fire and forget
        (async () => {
            try {
                // If online, try direct remote save first (faster than SW queue)
                if (isOnline()) {
                    console.log('[APISave] Online - attempting direct remote save');
                    try {
                        await this._saveRemotelyWithData(dataToSync);
                        console.log('[APISave] Direct remote save successful');
                        return; // Success - no need to queue
                    } catch (error) {
                        console.warn(
                            '[APISave] Direct remote save failed, falling back to SW queue:',
                            error
                        );
                    }
                }

                // Offline or direct save failed - queue for background sync
                const { queueOperation, forceSync } = await import('../api');

                // Queue a full sync operation with the captured data
                await queueOperation({
                    type: 'UPDATE_SETTINGS',
                    data: dataToSync || this._prepareDataForSave(),
                    timestamp: Date.now(),
                });

                // If we're online (but direct save failed), trigger SW sync
                if (isOnline()) {
                    await forceSync();
                }
            } catch (error) {
                console.warn('[APISave] Background sync trigger failed:', error);
            }
        })();
    },

    /**
     * Saves the provided data to the remote API.
     * Used by the debounced sync to ensure we sync the correct snapshot of data.
     * @param dataToSave - The data to save, or null to prepare fresh data.
     * @throws {Error} Throws an error if the save request fails or if offline.
     */
    async _saveRemotelyWithData(dataToSave: UserData | null): Promise<void> {
        if (!isOnline()) {
            throw new Error('OFFLINE: Cannot save remotely while offline');
        }
        const dataToUse = dataToSave || this._prepareDataForSave();
        const csrfToken = await this._fetchCsrfToken();
        const response = await fetch(`${data.API_BASE}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({ data: dataToUse }),
        });
        _validateResponseOrigin(response);
        if (!response.ok) {
            const errorMessages: Record<number, string> = {
                401: 'Authentication failed. Please sign in again.',
                403: 'CSRF token validation failed. Please refresh the page and try again.',
                500: 'Server error. Please try again later.',
            };
            throw new Error(
                errorMessages[response.status] || `Save failed: ${response.statusText}`
            );
        }
    },

    /**
     * Forces an immediate sync, bypassing the debounce timer.
     * Call this when you need to ensure data is synced immediately,
     * e.g., before page unload or when user explicitly requests sync.
     */
    async flushPendingSync(): Promise<void> {
        // Clear the debounce timer if set
        if (syncDebounceTimer !== null) {
            clearTimeout(syncDebounceTimer);
            syncDebounceTimer = null;
        }

        // If there's pending data, execute sync immediately
        if (pendingSyncData) {
            const dataToSync = pendingSyncData;
            pendingSyncData = null;

            try {
                if (isOnline()) {
                    await this._saveRemotelyWithData(dataToSync);
                    console.log('[APISave] Flushed pending sync successfully');
                }
            } catch (error) {
                console.warn('[APISave] Failed to flush pending sync:', error);
                // Queue for background sync as fallback
                const { queueOperation, forceSync } = await import('../api');
                await queueOperation({
                    type: 'UPDATE_SETTINGS',
                    data: dataToSync,
                    timestamp: Date.now(),
                });
                if (isOnline()) {
                    await forceSync();
                }
            }
        }
    },

    /**
     * Saves a problem to storage or API.
     * @param {Problem} _problem - The problem being saved (for compatibility, not used).
     * @throws {Error} Throws an error if the save fails.
     */
    async saveProblem(_problem?: Problem): Promise<void> {
        await this._performSave();
    },

    /**
     * Saves the deletion of a problem by marking it and saving the state.
     * @param {string} id - The ID of the problem to delete.
     * @throws {Error} Throws an error if the save fails.
     */
    async saveDeletedId(id: string): Promise<void> {
        const problem = state.problems.get(id);
        try {
            state.problems.delete(id);
            state.deletedProblemIds.add(id);
            await this._performSave();
            // Re-render the view to remove the deleted problem
            renderers.renderMainView(state.ui.activeTopicId);
        } catch (e) {
            console.error('Delete save error:', e);
            const message = e instanceof Error ? e.message : String(e);
            ui.showAlert(`Failed to delete problem: ${message}`);
            // Restore the problem if save failed
            if (problem) {
                state.problems.set(id, problem);
                state.deletedProblemIds.delete(id);
            }
            throw e;
        }
    },

    /**
     * Saves all current data to storage or API.
     * @throws {Error} Throws an error if the save fails.
     */
    async saveData(): Promise<void> {
        await this._performSave();
    },

    /**
     * Resets the debounce state. Used for testing.
     * Clears any pending timer and pending sync data.
     */
    _resetDebounceState(): void {
        if (syncDebounceTimer !== null) {
            clearTimeout(syncDebounceTimer);
            syncDebounceTimer = null;
        }
        pendingSyncData = null;
    },
};

// Export all functions as individual exports for backward compatibility
export const _prepareDataForSave = apiSave._prepareDataForSave.bind(apiSave);
export const _saveLocally = apiSave._saveLocally.bind(apiSave);
export const _saveRemotely = apiSave._saveRemotely.bind(apiSave);
export const _handleSaveOperation = apiSave._handleSaveOperation.bind(apiSave);
export const _performSave = apiSave._performSave.bind(apiSave);
export const saveProblem = apiSave.saveProblem.bind(apiSave);
export const saveDeletedId = apiSave.saveDeletedId.bind(apiSave);
export const saveData = apiSave.saveData.bind(apiSave);
export const flushPendingSync = apiSave.flushPendingSync.bind(apiSave);

// Set up page unload handler to flush pending syncs
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (syncDebounceTimer !== null && pendingSyncData) {
            // Use navigator.sendBeacon for reliable delivery during page unload
            // This is a best-effort attempt - we can't guarantee delivery
            const csrfToken = localStorage.getItem('smartgrind-csrf-token');
            if (csrfToken && isOnline()) {
                const blob = new Blob([JSON.stringify({ data: pendingSyncData })], {
                    type: 'application/json',
                });
                navigator.sendBeacon(`${data.API_BASE}/user?_csrf=${csrfToken}`, blob);
            }
        }
    });
}
