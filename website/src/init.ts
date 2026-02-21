// --- INITIALIZATION ---
// IMPORTANT SECURITY NOTES:
// - LocalStorage is used for storing user session data.
// - WARNING: LocalStorage is vulnerable to XSS attacks. If malicious code can access the page,
//   it can read all localStorage data. For production with sensitive data:
//   - Consider using httpOnly cookies for authentication tokens
//   - Implement Content Security Policy (CSP) headers
//   - Encrypt sensitive data before storing

import { Topic } from './types';
import { state } from './state';
import { data } from './data';
import { initOfflineDetection } from './api';
import { loadData } from './api/api-load';
import { utils } from './utils';
import { withErrorHandling, setupGlobalErrorHandlers } from './error-boundary';
import * as swRegister from './sw-register';
import { openSigninModal } from './ui/ui-modals';

// Initialize global error handlers
setupGlobalErrorHandlers();

// Helper to apply category from URL
const _applyCategory = async (categoryParam: string | null) => {
    const { renderers } = await import('./renderers');
    if (categoryParam && categoryParam !== 'all') {
        const validCategory = data.topicsData.some((t: Topic) => t.id === categoryParam);
        if (validCategory) {
            state.ui.activeTopicId = categoryParam;
        }
    }
    renderers.renderSidebar();
    await renderers.renderMainView(state.ui.activeTopicId);
    utils.scrollToTop();
};

// Helper to setup signed-in user
const _setupSignedInUser = async (
    userId: string,
    displayName: string,
    categoryParam: string | null
) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('displayName', displayName);

    state.user.id = userId;
    state.user.displayName = displayName;
    const userDisplayEl = state.elements['userDisplay'];
    if (userDisplayEl) userDisplayEl.innerText = displayName;
    state.user.type = 'signed-in';
    localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');

    await loadData();
    const { ui } = await import('./ui/ui');
    ui.updateAuthUI();
    await _applyCategory(categoryParam);
};

// Helper to setup local user
const _setupLocalUser = async (categoryParam: string | null) => {
    const { app } = await import('./app');
    app.initializeLocalUser();
    await _applyCategory(categoryParam);
};

// Check auth state and initialize app
const checkAuth = async () => {
    // Listen for auth required events from Service Worker (background sync auth failures)
    // Register this EARLY so we don't miss events if initialization is slow
    swRegister.on('authRequired', (eventData: unknown) => {
        const data = eventData as { message?: string; timestamp?: number };
        console.warn('[Init] Received authRequired event:', data.message);

        // Show sign-in modal to ask user to sign in again
        openSigninModal();
        console.warn('[Init] Called openSigninModal()');

        // Show toast notification
        utils.showToast('Session expired. Please sign in again.', 'error');
    });

    // Extract category from URL path
    const path = window.location.pathname;
    let categoryParam: string | null = null;
    if (path === '/smartgrind/') {
        categoryParam = 'all';
    } else if (path.startsWith('/smartgrind/c/')) {
        categoryParam = path.split('/smartgrind/c/')[1] || null;
    }

    // Check URL params for PWA auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlUserId = urlParams.get('userId');
    const urlDisplayName = urlParams.get('displayName');

    // Handle PWA auth callback with error handling
    if (urlToken && urlUserId && urlDisplayName) {
        // Validate token format before storing (basic validation)
        // Tokens should be non-empty and reasonably sized
        if (urlToken.length < 10 || urlToken.length > 1000) {
            const { ui } = await import('./ui/ui');
            ui.showAlert('Invalid authentication token. Please try signing in again.');
            return;
        }

        // Sanitize display name to prevent XSS
        const sanitizedDisplayName = utils.sanitizeInput(urlDisplayName) || 'User';

        // Clear URL parameters immediately for security
        window.history.replaceState({}, document.title, window.location.pathname);

        localStorage.setItem('token', urlToken);
        const { storeTokenForServiceWorker } = await import('./sw-auth-storage');
        storeTokenForServiceWorker(urlToken).catch(() => {});
        await withErrorHandling(async () => {
            await _setupSignedInUser(urlUserId, sanitizedDisplayName, categoryParam);
        }, 'Failed to set up signed-in user');
        // Initialize offline detection for signed-in users
        initOfflineDetection();
        return;
    }

    // Check for existing session with error handling
    const userId = localStorage.getItem('userId');
    if (userId) {
        const displayName = localStorage.getItem('displayName') || 'User';
        await withErrorHandling(async () => {
            await _setupSignedInUser(userId, displayName, categoryParam);
        }, 'Failed to restore user session');
        // Initialize offline detection for signed-in users
        initOfflineDetection();
        return;
    }

    // Default to local user
    const userType = localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE) || 'local';

    if (userType === 'local') {
        await withErrorHandling(async () => {
            await _setupLocalUser(categoryParam);
        }, 'Failed to initialize local user');
    } else {
        // Show setup modal for orphaned signed-in state
        const { setupModal, appWrapper, loadingScreen, googleLoginBtn } = state.elements;

        setupModal?.classList.remove('hidden');
        appWrapper?.classList.add('hidden');
        loadingScreen?.classList.add('hidden');

        if (googleLoginBtn) {
            (googleLoginBtn as HTMLButtonElement).disabled = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            googleLoginBtn.innerHTML =
                (window as Window & { SmartGrind?: { GOOGLE_BUTTON_HTML?: string } }).SmartGrind?.[
                    'GOOGLE_BUTTON_HTML'
                ] || '';
        }
        const { ui } = await import('./ui/ui');
        ui.updateAuthUI();
    }

    // Initialize offline detection and sync monitoring
    initOfflineDetection();
};

export { checkAuth };
