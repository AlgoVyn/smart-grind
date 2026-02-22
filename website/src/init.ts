// --- INITIALIZATION ---
// SECURITY: Authentication uses httpOnly cookies + CSRF tokens
// - JWT tokens are stored in httpOnly cookies (not accessible to JavaScript)
// - CSRF tokens protect against cross-site request forgery
// - Service Worker gets token via secure /api/auth/token endpoint

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
    categoryParam: string | null,
    token?: string
) => {
    // Store user info in localStorage (not sensitive)
    localStorage.setItem('userId', userId);
    localStorage.setItem('displayName', displayName);

    state.user.id = userId;
    state.user.displayName = displayName;
    const userDisplayEl = state.elements['userDisplay'];
    if (userDisplayEl) userDisplayEl.innerText = displayName;
    state.user.type = 'signed-in';
    localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');

    // If token provided, store for Service Worker (IndexedDB, not localStorage)
    if (token) {
        const { storeTokenForServiceWorker } = await import('./sw-auth-storage');
        await storeTokenForServiceWorker(token);
    }

    // Fetch CSRF token for state-changing operations
    const { fetchCsrfToken } = await import('./app');
    await fetchCsrfToken();

    await loadData();
    const { ui } = await import('./ui/ui');
    ui.updateAuthUI();
    await _applyCategory(categoryParam);
};

/**
 * Fetch auth token from secure endpoint using httpOnly cookie
 */
const _fetchAuthToken = async (): Promise<{
    token: string;
    userId: string;
    displayName: string;
} | null> => {
    try {
        const response = await fetch('/smartgrind/api/auth?action=token', {
            credentials: 'include', // Important: sends httpOnly cookies
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return {
            token: data.token,
            userId: data.userId,
            displayName: data.displayName,
        };
    } catch (error) {
        console.error('[Init] Failed to fetch auth token:', error);
        return null;
    }
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

    // Check URL params for PWA auth callback (new secure flow)
    // Token is NO LONGER in URL - only userId and displayName
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('userId');
    const urlDisplayName = urlParams.get('displayName');

    // Handle PWA auth callback - token is in httpOnly cookie, fetch it securely
    if (urlUserId && urlDisplayName) {
        // Sanitize display name to prevent XSS
        const sanitizedDisplayName = utils.sanitizeInput(urlDisplayName) || 'User';

        // Clear URL parameters immediately for security
        window.history.replaceState({}, document.title, window.location.pathname);

        // Fetch token from secure endpoint (uses httpOnly cookie)
        const authData = await _fetchAuthToken();

        if (!authData) {
            const { ui } = await import('./ui/ui');
            ui.showAlert('Authentication failed. Please try signing in again.');
            return;
        }

        await withErrorHandling(async () => {
            await _setupSignedInUser(
                urlUserId,
                sanitizedDisplayName,
                categoryParam,
                authData.token
            );
        }, 'Failed to set up signed-in user');

        // Initialize offline detection for signed-in users
        initOfflineDetection();
        return;
    }

    // Check for existing session - verify with server using httpOnly cookie
    const userId = localStorage.getItem('userId');
    if (userId) {
        // Verify session is still valid by fetching token
        const authData = await _fetchAuthToken();

        if (authData) {
            const displayName =
                localStorage.getItem('displayName') || authData.displayName || 'User';
            await withErrorHandling(async () => {
                await _setupSignedInUser(userId, displayName, categoryParam, authData.token);
            }, 'Failed to restore user session');
        } else {
            // Session expired, clear local state
            localStorage.removeItem('userId');
            localStorage.removeItem('displayName');
            localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');

            // Show sign-in modal
            openSigninModal();
            utils.showToast('Session expired. Please sign in again.', 'error');
        }

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
