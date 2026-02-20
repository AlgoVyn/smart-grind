import { state } from './state';
import { checkAuth } from './init';
import { initSyncIndicators } from './ui/ui-sync-indicators';
import { ui } from './ui/ui';

// Initialize the application
const initApp = async () => {
    try {
        // Initialize state (DOM elements, etc.)
        state.init();

        // Check authentication status
        await checkAuth();

        // Initialize UI indicators
        initSyncIndicators();

        // Final UI initialization
        await ui.init();
    } catch (error) {
        console.error('[Main] Initialization failed:', error);
    }
};

// Start initialization when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}

// Expose necessary globals
if (typeof window !== 'undefined') {
    window.SmartGrind = window.SmartGrind || {};
}
