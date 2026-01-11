// --- API SAVE MODULE ---
// Data saving operations

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    // Helper to prepare data for saving
    _prepareDataForSave: () => ({
        problems: Object.fromEntries(
            Array.from(window.SmartGrind.state.problems.entries()).map(([id, p]) => {
                const { loading, noteVisible, ...rest } = p;
                return [id, rest];
            })
        ),
        deletedIds: Array.from(window.SmartGrind.state.deletedProblemIds)
    }),

    // Save data locally
    _saveLocally: () => {
        window.SmartGrind.state.saveToStorage();
    },

    // Save data remotely
    _saveRemotely: async () => {
        const token = sessionStorage.getItem('token');
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

    // Helper to handle save operations with error handling
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

    // Helper function to perform save operation
    _performSave: async () => {
        const saveFn = window.SmartGrind.state.user.type === 'local'
            ? window.SmartGrind.api._saveLocally
            : window.SmartGrind.api._saveRemotely;
        await window.SmartGrind.api._handleSaveOperation(saveFn);
    },

    // Save problem to storage/API
    saveProblem: async (p) => {
        await window.SmartGrind.api._performSave();
    },

    // Save deleted problem ID
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

    // Save all data
    saveData: async () => {
        await window.SmartGrind.api._performSave();
    }
});