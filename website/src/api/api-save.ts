// --- API SAVE MODULE ---
// Data saving operations

import { UserData, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { renderers } from '../renderers';
import { ui } from '../ui/ui';

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
     * @throws {Error} Throws an error if the fetch fails.
     */
    async _fetchCsrfToken(): Promise<string> {
        const response = await fetch(`${data.API_BASE}/user?action=csrf`);
        _validateResponseOrigin(response);
        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }
        const responseData: { csrfToken: string } = await response.json();
        return responseData.csrfToken;
    },

    /**
     * Saves the prepared data to the remote API.
     * @throws {Error} Throws an error if the save request fails.
     */
    async _saveRemotely(): Promise<void> {
        const dataToSave = this._prepareDataForSave();
        const csrfToken = await this._fetchCsrfToken();
        const response = await fetch(`${data.API_BASE}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
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
     * @throws {Error} Throws an error if the save function fails.
     */
    async _handleSaveOperation(saveFn: () => Promise<void>): Promise<void> {
        try {
            await saveFn();
            renderers.updateStats();
        } catch (e) {
            console.error('Save error:', e);

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
     * @throws {Error} Throws an error if the save fails.
     */
    async _performSave(): Promise<void> {
        const saveFn =
            state.user.type === 'local'
                ? this._saveLocally.bind(this)
                : this._saveRemotely.bind(this);
        await this._handleSaveOperation(saveFn);
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
