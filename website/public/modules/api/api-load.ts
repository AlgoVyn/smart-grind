// --- API LOAD MODULE ---
// Data loading operations

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    /**
     * Handles API response errors by throwing appropriate error messages.
     * @param {Response} response - The fetch response object.
     * @throws {Error} Throws an error with a user-friendly message based on status.
     */
    _handleApiError: (response) => {
        const errorMap = {
            401: 'Authentication failed. Please sign in again.',
            404: 'User data not found. Starting with fresh data.',
            500: 'Server error. Please try again later.'
        };
        throw new Error(errorMap[response.status] || `Failed to load data: ${response.statusText}`);
    },

    /**
     * Processes the loaded user data and updates the application state.
     * @param {Object} userData - The user data object from the API.
     * @param {Object} userData.problems - Map of problem IDs to problem objects.
     * @param {string[]} userData.deletedIds - Array of deleted problem IDs.
     */
    _processUserData: (userData) => {
        window.SmartGrind.state.problems = new Map(Object.entries(userData.problems || {}));
        window.SmartGrind.state.problems.forEach(p => p.loading = false);
        window.SmartGrind.state.deletedProblemIds = new Set(userData.deletedIds || []);
    },

    /**
     * Initializes the UI components after data has been loaded.
     * Renders sidebar, main view, updates stats, and hides loading screen.
     */
    _initializeUI: () => {
        window.SmartGrind.renderers.renderSidebar();
        window.SmartGrind.renderers.renderMainView('all');
        window.SmartGrind.renderers.updateStats();
        window.SmartGrind.ui.initScrollButton();
        window.SmartGrind.state.elements.setupModal.classList.add('hidden');
        window.SmartGrind.state.elements.appWrapper.classList.remove('hidden');
    },

    /**
     * Loads user data from the API and initializes the application.
     * Handles authentication, data processing, syncing, and UI initialization.
     * @throws {Error} Throws an error if loading fails.
     */
    loadData: async () => {
        window.SmartGrind.state.elements.loadingScreen.classList.remove('hidden');

        try {
            const response = await fetch(`${window.SmartGrind.data.API_BASE}/user`);

            if (!response.ok) window.SmartGrind.api._handleApiError(response);

            const userData = await response.json();
            window.SmartGrind.api._processUserData(userData);

            window.SmartGrind.data.resetTopicsData();
            await window.SmartGrind.api.syncPlan();
            window.SmartGrind.api.mergeStructure();

            window.SmartGrind.api._initializeUI();

        } catch (e) {
            console.error('Load data error:', e);
            window.SmartGrind.ui.showAlert(`Failed to load data: ${e.message}`);
            const isAuthError = e.message.includes('Authentication failed') || e.message.includes('No authentication token');
            window.SmartGrind.state.elements[isAuthError ? 'signinModal' : 'setupModal'].classList.remove('hidden');
            window.SmartGrind.state.elements.appWrapper.classList.add('hidden');
        } finally {
            window.SmartGrind.state.elements.loadingScreen.classList.add('hidden');
        }
    }
});