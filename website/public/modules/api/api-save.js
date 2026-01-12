// --- API SAVE MODULE ---
// Data saving operations

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    /**
     * Prepares the current problem data for saving by serializing the problems map and deleted IDs.
     * @returns {Object} The data object to save.
     * @returns {Object} return.problems - Object of problem IDs to problem data.
     * @returns {string[]} return.deletedIds - Array of deleted problem IDs.
     */
    _prepareDataForSave: () => ({
        problems: Object.fromEntries(
            Array.from(window.SmartGrind.state.problems.entries()).map(([id, p]) => {
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
    _saveRemotely: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found. Please sign in again.');
        }
        const data = window.SmartGrind.api._prepareDataForSave();
        const response = await fetch(`${window.SmartGrind.data.API_BASE}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data })
        });
        if (!response.ok) {
            const errorMessages = {
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
    _handleSaveOperation: async (saveFn) => {
        try {
            await saveFn();
            window.SmartGrind.renderers.updateStats();
        } catch (e) {
            console.error('Save error:', e);
            window.SmartGrind.ui.showAlert(`Failed to save data: ${e.message}`);
            throw e;
        }
    },

    /**
     * Performs the save operation based on the user type (local or remote).
     * @throws {Error} Throws an error if the save fails.
     */
    _performSave: async () => {
        const saveFn = window.SmartGrind.state.user.type === 'local'
            ? window.SmartGrind.api._saveLocally
            : window.SmartGrind.api._saveRemotely;
        await window.SmartGrind.api._handleSaveOperation(saveFn);
    },

    /**
     * Saves a problem to storage or API.
     * @param {Object} p - The problem object (not used in current implementation).
     * @throws {Error} Throws an error if the save fails.
     */
    saveProblem: async (p) => {
        await window.SmartGrind.api._performSave();
    },

    /**
     * Saves the deletion of a problem by marking it as deleted and saving the state.
     * @param {string} id - The ID of the problem to delete.
     * @throws {Error} Throws an error if the save fails.
     */
    saveDeletedId: async (id) => {
        const problem = window.SmartGrind.state.problems.get(id);
        try {
            window.SmartGrind.state.problems.delete(id);
            window.SmartGrind.state.deletedProblemIds.add(id);
            await window.SmartGrind.api._performSave();
            // Re-render the view to remove the deleted problem
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
        } catch (e) {
            console.error('Delete save error:', e);
            window.SmartGrind.ui.showAlert(`Failed to delete problem: ${e.message}`);
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
    saveData: async () => {
        await window.SmartGrind.api._performSave();
    }
});