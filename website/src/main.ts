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
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        runCleanup();
    });
}

// Expose necessary globals
if (typeof window !== 'undefined') {
    window.SmartGrind = window.SmartGrind || {};
}
