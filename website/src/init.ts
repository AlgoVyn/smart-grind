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

// ============================================================================
// URL Parameter Helpers
// ============================================================================

const getCategoryFromUrl = (): string | null => {
    const path = window.location.pathname;
    if (path.startsWith('/smartgrind/c/')) {
        return path.split('/smartgrind/c/')[1] || null;
    }
    return path === '/smartgrind/' ? 'all' : null;
};

const getAlgorithmsFromUrl = (): string | null => {
    const path = window.location.pathname;
    return path.startsWith('/smartgrind/a/') ? path.split('/smartgrind/a/')[1] || null : null;
};

// ============================================================================
// Auth Token Management
// ============================================================================

/**
 * Fetch auth token from secure endpoint using httpOnly cookie
 * In offline mode, returns null gracefully without logging an error
 */
const fetchAuthToken = async (): Promise<{
    token: string;
    userId: string;
    displayName: string;
} | null> => {
    try {
        const response = await fetch('/smartgrind/api/auth?action=token', {
            credentials: 'include',
        });

        if (!response.ok) return null;

        const data = await response.json();
        return {
            token: data.token,
            userId: data.userId,
            displayName: data.displayName,
        };
    } catch (error) {
        if (navigator.onLine) {
            console.error('[Init] Failed to fetch auth token:', error);
        }
        return null;
    }
};

/**
 * Get stored token from IndexedDB for offline scenarios
 * Returns the token if valid (not expired), null otherwise
 */
const getStoredTokenForOffline = async (): Promise<string | null> => {
    return new Promise((resolve) => {
        const request = indexedDB.open('smartgrind-auth', 1);

        request.onerror = () => resolve(null);

        request.onsuccess = async () => {
            const db = request.result;

            if (!db.objectStoreNames.contains('auth-tokens')) {
                db.close();
                resolve(null);
                return;
            }

            try {
                const transaction = db.transaction('auth-tokens', 'readonly');
                const store = transaction.objectStore('auth-tokens');

                const tokenRequest = store.get('token');
                const expiresAtRequest = store.get('tokenExpiresAt');

                const getToken = new Promise<string | null>((res) => {
                    tokenRequest.onsuccess = () => res(tokenRequest.result?.value || null);
                    tokenRequest.onerror = () => res(null);
                });

                const getExpiresAt = new Promise<number | null>((res) => {
                    expiresAtRequest.onsuccess = () => {
                        const val = expiresAtRequest.result?.value;
                        res(val ? parseInt(val, 10) : null);
                    };
                    expiresAtRequest.onerror = () => res(null);
                });

                const [token, expiresAt] = await Promise.all([getToken, getExpiresAt]);
                db.close();

                if (!token) {
                    resolve(null);
                    return;
                }

                if (expiresAt && Date.now() >= expiresAt) {
                    resolve(null);
                    return;
                }

                resolve(token);
            } catch {
                db.close();
                resolve(null);
            }
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('auth-tokens')) {
                db.createObjectStore('auth-tokens', { keyPath: 'key' });
            }
        };
    });
};

// ============================================================================
// User Setup Functions
// ============================================================================

const applyCategory = async (categoryParam: string | null, algorithmsParam: string | null) => {
    const { renderers } = await import('./renderers');

    // Handle algorithms parameter first
    if (algorithmsParam) {
        const validCategory = data.algorithmsData.some((c) => c.id === algorithmsParam);
        if (validCategory) {
            state.ui.activeAlgorithmCategoryId = algorithmsParam;
            renderers.renderSidebar();
            await renderers.renderAlgorithmsView(algorithmsParam);
            utils.scrollToTop();
            return;
        }
    }

    // Handle problems category parameter
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

const setupSignedInUser = async (
    userId: string,
    displayName: string,
    categoryParam: string | null,
    algorithmsParam: string | null,
    token?: string
) => {
    // Set user type FIRST before loading from storage
    state.user.type = 'signed-in';

    localStorage.setItem('userId', userId);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');

    state.user.id = userId;
    state.user.displayName = displayName;
    const userDisplayEl = state.elements['userDisplay'];
    if (userDisplayEl) userDisplayEl.innerText = displayName;

    state.loadFromStorage();

    if (token) {
        const { storeTokenForServiceWorker } = await import('./sw-auth-storage');
        await storeTokenForServiceWorker(token);
    }

    // If offline with valid local data, skip API calls
    if (!navigator.onLine && state.hasValidData()) {
        console.log('[Init] Offline with valid local data - skipping API calls');
        const { ui } = await import('./ui/ui');
        const { renderers } = await import('./renderers');
        const { api } = await import('./api');

        data.resetTopicsData();

        try {
            await api.syncPlan();
        } catch (e) {
            console.error('Error syncing plan:', e);
        }

        api.mergeStructure();

        renderers.renderSidebar();
        renderers.renderMainView(state.ui.activeTopicId);
        renderers.updateStats();
        ui.initScrollButton();
        ui.updateAuthUI();

        state.elements.setupModal?.classList.add('hidden');
        state.elements.appWrapper?.classList.remove('hidden');
        state.elements.loadingScreen?.classList.add('hidden');

        await applyCategory(categoryParam, algorithmsParam);
        return;
    }

    const { fetchCsrfToken } = await import('./app');
    await fetchCsrfToken();

    await loadData();
    const { ui } = await import('./ui/ui');
    ui.updateAuthUI();
    await applyCategory(categoryParam, algorithmsParam);
};

const setupLocalUser = async (categoryParam: string | null, algorithmsParam: string | null) => {
    const { app } = await import('./app');
    app.initializeLocalUser();
    await applyCategory(categoryParam, algorithmsParam);
};

// ============================================================================
// Auth Handlers
// ============================================================================

const handlePwaAuthCallback = async (
    urlUserId: string,
    urlDisplayName: string,
    categoryParam: string | null,
    algorithmsParam: string | null
): Promise<boolean> => {
    const sanitizedDisplayName = utils.sanitizeInput(urlDisplayName) || 'User';
    window.history.replaceState({}, document.title, window.location.pathname);

    const authData = await fetchAuthToken();

    if (!authData) {
        const { ui } = await import('./ui/ui');
        ui.showAlert('Authentication failed. Please try signing in again.');
        return false;
    }

    await withErrorHandling(async () => {
        await setupSignedInUser(
            urlUserId,
            sanitizedDisplayName,
            categoryParam,
            algorithmsParam,
            authData.token
        );
    }, 'Failed to set up signed-in user');

    initOfflineDetection();
    return true;
};

const handleExistingSession = async (
    userId: string,
    categoryParam: string | null,
    algorithmsParam: string | null
): Promise<boolean> => {
    const authData = await fetchAuthToken();

    if (authData) {
        const displayName = localStorage.getItem('displayName') || authData.displayName || 'User';
        await withErrorHandling(async () => {
            await setupSignedInUser(
                userId,
                displayName,
                categoryParam,
                algorithmsParam,
                authData.token
            );
        }, 'Failed to restore user session');
        initOfflineDetection();
        return true;
    }

    // Try stored token as fallback
    const storedToken = await getStoredTokenForOffline();
    if (storedToken) {
        const displayName = localStorage.getItem('displayName') || 'User';
        await withErrorHandling(async () => {
            await setupSignedInUser(
                userId,
                displayName,
                categoryParam,
                algorithmsParam,
                storedToken
            );
        }, 'Failed to restore session with stored token');
        initOfflineDetection();
        return true;
    }

    // No valid token - session expired
    localStorage.removeItem('userId');
    localStorage.removeItem('displayName');
    localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');

    openSigninModal();
    utils.showToast('Session expired. Please sign in again.', 'error');
    return false;
};

const showSetupModal = async () => {
    const { setupModal, appWrapper, loadingScreen, googleLoginButton } = state.elements;

    setupModal?.classList.remove('hidden');
    appWrapper?.classList.add('hidden');
    loadingScreen?.classList.add('hidden');

    if (googleLoginButton) {
        (googleLoginButton as HTMLButtonElement).disabled = false;
        googleLoginButton.innerHTML =
            (window as Window & { SmartGrind?: { GOOGLE_BUTTON_HTML?: string } }).SmartGrind?.[
                'GOOGLE_BUTTON_HTML'
            ] || '';
    }
    const { ui } = await import('./ui/ui');
    ui.updateAuthUI();
};

// ============================================================================
// Main Auth Check
// ============================================================================

const checkAuth = async () => {
    // Listen for auth required events from Service Worker
    swRegister.on('authRequired', (eventData: unknown) => {
        const eventDataObj = eventData as { message?: string; timestamp?: number };
        console.warn('[Init] Received authRequired event:', eventDataObj.message);
        openSigninModal();
        utils.showToast('Session expired. Please sign in again.', 'error');
    });

    const categoryParam = getCategoryFromUrl();
    const algorithmsParam = getAlgorithmsFromUrl();
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('userId');
    const urlDisplayName = urlParams.get('displayName');

    // Handle PWA auth callback
    if (urlUserId && urlDisplayName) {
        const success = await handlePwaAuthCallback(
            urlUserId,
            urlDisplayName,
            categoryParam,
            algorithmsParam
        );
        if (success) return;
    }

    // Check for existing session
    const userId = localStorage.getItem('userId');
    if (userId) {
        const hasSession = await handleExistingSession(userId, categoryParam, algorithmsParam);
        if (hasSession) return;
    }

    // Default to local user
    const userType = localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE) || 'local';

    if (userType === 'local') {
        await withErrorHandling(async () => {
            await setupLocalUser(categoryParam, algorithmsParam);
        }, 'Failed to initialize local user');
    } else {
        await showSetupModal();
    }

    initOfflineDetection();
};

export { checkAuth };
