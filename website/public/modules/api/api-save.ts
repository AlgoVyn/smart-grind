// --- API SAVE MODULE ---
// Data saving operations

import { UserData, Problem } from '../types.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    /**
      * Prepares the current problem data for saving by serializing the problems map and deleted IDs.
      * @returns {Object} The data object to save.
      * @returns {Object} return.problems - Object of problem IDs to problem data.
      * @returns {string[]} return.deletedIds - Array of deleted problem IDs.
      */
    _prepareDataForSave: (): UserData => ({
        problems: Object.fromEntries(
            Array.from(window.SmartGrind.state.problems.entries() as IterableIterator<[string, Problem]>).map(([id, p]) => {
                const { loading, noteVisible, ...rest } = p;
                return [id, rest];
            })
        ),
        deletedIds: Array.from(window.SmartGrind.state.deletedProblemIds)
    }),

    /**
     * Saves the current state data to local storage.
     */
    _saveLocally: () => {
        window.SmartGrind.state.saveToStorage();
    },

    /**
      * Saves the prepared data to the remote API.
      * @throws {Error} Throws an error if the save request fails.
      */
    _saveRemotely: async (): Promise<void> => {
        const data = window.SmartGrind.api._prepareDataForSave();
        const response = await fetch(`${window.SmartGrind.data.API_BASE}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
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
    _handleSaveOperation: async (saveFn: () => Promise<void>): Promise<void> => {
        try {
            await saveFn();
            window.SmartGrind.renderers.updateStats();
        } catch (e) {
            console.error('Save error:', e);
            const message = e instanceof Error ? e.message : String(e);
            window.SmartGrind.ui.showAlert(`Failed to save data: ${message}`);
            throw e;
        }
    },

    /**
      * Performs the save operation based on the user type (local or remote).
      * @throws {Error} Throws an error if the save fails.
      */
    _performSave: async (): Promise<void> => {
        const saveFn = window.SmartGrind.state.user.type === 'local'
            ? window.SmartGrind.api._saveLocally
            : window.SmartGrind.api._saveRemotely;
        await window.SmartGrind.api._handleSaveOperation(saveFn);
    },

    /**
      * Saves a problem to storage or API.
      * @param {Problem} _problem - The problem being saved (for compatibility, not used).
      * @throws {Error} Throws an error if the save fails.
      */
    saveProblem: async (_problem?: Problem): Promise<void> => {
        await window.SmartGrind.api._performSave();
    },

    /**
      * Saves the deletion of a problem by marking it and saving the state.
      * @param {string} id - The ID of the problem to delete.
      * @throws {Error} Throws an error if the save fails.
      */
    saveDeletedId: async (id: string): Promise<void> => {
        const problem = window.SmartGrind.state.problems.get(id);
        try {
            window.SmartGrind.state.problems.delete(id);
            window.SmartGrind.state.deletedProblemIds.add(id);
            await window.SmartGrind.api._performSave();
            // Re-render the view to remove the deleted problem
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
        } catch (e) {
            console.error('Delete save error:', e);
            const message = e instanceof Error ? e.message : String(e);
            window.SmartGrind.ui.showAlert(`Failed to delete problem: ${message}`);
            // Restore the problem if save failed
            if (problem) {
                window.SmartGrind.state.problems.set(id, problem);
                window.SmartGrind.state.deletedProblemIds.delete(id);
            }
            throw e;
        }
    },

    /**
      * Saves all current data to storage or API.
      * @throws {Error} Throws an error if the save fails.
      */
    saveData: async (): Promise<void> => {
        await window.SmartGrind.api._performSave();
    }
});