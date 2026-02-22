import { state } from './state';
import { checkAuth } from './init';
import { initSyncIndicators } from './ui/ui-sync-indicators';
import { ui } from './ui/ui';
import { errorTracker } from './utils/error-tracker';
import { performanceMonitor } from './utils/performance-monitor';
import { cleanupManager } from './utils/cleanup-manager';

// Initialize the application
const initApp = async () => {
    try {
        // Initialize error tracking
        errorTracker.init();

        // Initialize performance monitoring
        performanceMonitor.init();

        // Initialize state (DOM elements, etc.)
        state.init();

        // Check authentication status
        await checkAuth();

        // Initialize UI indicators
        initSyncIndicators();

        // Final UI initialization
        await ui.init();

        // Record successful startup
        performanceMonitor.recordMetric('app_initialized', 1);
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

// Expose necessary globals
if (typeof window !== 'undefined') {
    window.SmartGrind = window.SmartGrind || {};
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    cleanupManager.cleanupAll();
});
