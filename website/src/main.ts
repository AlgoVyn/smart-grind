import { state } from './state';
import { checkAuth } from './init';
import { initSyncIndicators } from './ui/ui-sync-indicators';
import { ui } from './ui/ui';
import { checkAndShowErrorTrackingConsent } from './ui/ui-modals';
import { errorTracker } from './utils/error-tracker';
import { performanceMonitor } from './utils/performance-monitor';
import { cleanupManager } from './utils/cleanup-manager';
import { createGlobalErrorBoundary } from './utils/error-boundary';

// Initialize the application
const initApp = async () => {
    try {
        // Setup global error handlers first
        const globalErrorBoundary = createGlobalErrorBoundary();
        globalErrorBoundary.setupGlobalHandlers();

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

        // Show error tracking consent dialog if needed
        checkAndShowErrorTrackingConsent();
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
