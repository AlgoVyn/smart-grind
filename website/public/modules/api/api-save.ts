// --- API SAVE MODULE ---
// Data saving operations

import { UserData, Problem } from '../types.js';
import { state } from '../state.js';
import { data } from '../data.js';
import { renderers } from '../renderers.js';
import { ui } from '../ui/ui.js';

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
                Array.from(state.problems.entries() as IterableIterator<[string, Problem]>).map(([id, p]) => {
                    const { loading: _loading, noteVisible: _noteVisible, ...rest } = p;
                    return [id, rest];
                })
            ),
            deletedIds: Array.from(state.deletedProblemIds)
        };
    },

    /**
     * Saves the current state data to local storage.
     */
    async _saveLocally() {
        state.saveToStorage();
    },

    /**
      * Saves the prepared data to the remote API.
      * @throws {Error} Throws an error if the save request fails.
      */
    async _saveRemotely(): Promise<void> {
        const dataToSave = this._prepareDataForSave();
        const response = await fetch(`${data.API_BASE}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: dataToSave })
        });
        if (!response.ok) {
            const errorMessages: Record<number, string> = {
                401: 'Authentication failed. Please sign in again.',
                500: 'Server error. Please try again later.'
            };
            throw new Error(errorMessages[response.status] || `Save failed: ${response.statusText}`);
        }
    },

    /**
      * Handles the save operation with error handling and UI updates.
      * @param {Function} saveFn - The save function to execute (local or remote).
      * @throws {Error} Throws the error if the save function fails.
      */
    async _handleSaveOperation(saveFn: () => Promise<void>): Promise<void> {
        try {
            await saveFn();
            renderers.updateStats();
        } catch (e) {
            console.error('Save error:', e);
            const message = e instanceof Error ? e.message : String(e);
            ui.showAlert(`Failed to save data: ${message}`);
            throw e;
        }
    },

    /**
      * Performs the save operation based on the user type (local or remote).
      * @throws {Error} Throws an error if the save fails.
      */
    async _performSave(): Promise<void> {
        const saveFn = state.user.type === 'local'
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
    }
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