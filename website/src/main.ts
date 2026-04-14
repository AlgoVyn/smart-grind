import { state } from './state';
import { checkAuth, runCleanup } from './init';
import { initSyncIndicators } from './ui/ui-sync-indicators';
import { ui } from './ui/ui';
import { checkAndShowErrorTrackingConsent } from './ui/ui-modals';
import { errorTracker } from './utils/error-tracker';

// Initialize the application
const initApp = async () => {
    try {
        // Initialize state
        state.init();

        // Check authentication status
        await checkAuth();

        // Initialize UI indicators
        initSyncIndicators();

        // Final UI initialization
        await ui.init();

        // Show error tracking consent dialog if needed
        checkAndShowErrorTrackingConsent();
    } catch (error) {
        console.error('[Main] Initialization failed:', error);
        errorTracker.captureException(error, { type: 'init_failed' });
    }
};

// Start initialization when DOM is ready
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

    // Expose globals and cleanup
    window.addEventListener('beforeunload', runCleanup);
    window.SmartGrind = window.SmartGrind || {};
}
