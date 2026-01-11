// --- API LOAD MODULE ---
// Data loading operations

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    // Helper to handle API response errors
    _handleApiError: (response) => {
        const errorMap = {
            401: 'Authentication failed. Please sign in again.',
            404: 'User data not found. Starting with fresh data.',
            500: 'Server error. Please try again later.'
        };
        throw new Error(errorMap[response.status] || `Failed to load data: ${response.statusText}`);
    },

    // Helper to process loaded user data
    _processUserData: (userData) => {
        window.SmartGrind.state.problems = new Map(Object.entries(userData.problems || {}));
        window.SmartGrind.state.problems.forEach(p => p.loading = false);
        window.SmartGrind.state.deletedProblemIds = new Set(userData.deletedIds || []);
    },

    // Helper to initialize UI after data load
    _initializeUI: () => {
        window.SmartGrind.renderers.renderSidebar();
        window.SmartGrind.renderers.renderMainView('all');
        window.SmartGrind.renderers.updateStats();
        window.SmartGrind.ui.initScrollButton();
        window.SmartGrind.state.elements.setupModal.classList.add('hidden');
        window.SmartGrind.state.elements.appWrapper.classList.remove('hidden');
    },

    // Load data from API
    loadData: async () => {
        window.SmartGrind.state.elements.loadingScreen.classList.remove('hidden');

        try {
            const token = sessionStorage.getItem('token');
            if (!token) throw new Error('No authentication token found. Please sign in again.');

            const response = await fetch(`${window.SmartGrind.data.API_BASE}/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

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