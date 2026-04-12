// --- INITIALIZATION ---
// SECURITY: Authentication uses httpOnly cookies + CSRF tokens
// - JWT tokens are stored in httpOnly cookies (not accessible to JavaScript)
// - CSRF tokens protect against cross-site request forgery
// - Service Worker gets token via secure /api/auth/token endpoint

import { Topic } from './types';
import { state } from './state';
import { data } from './data';
import { initOfflineDetection } from './api';
import { getConnectivityChecker } from './sw/connectivity-checker';
import { loadData } from './api/api-load';
import { scrollToTop, showToast } from './utils';
import { withErrorHandling, setupGlobalErrorHandlers } from './error-boundary';
import * as swRegister from './sw-register';
import { openSigninModal } from './ui/ui-modals';

// Initialize global error handlers
setupGlobalErrorHandlers();

// ============================================================================
// Cleanup Management
// ============================================================================

const cleanupFunctions: (() => void)[] = [];

const registerCleanup = (cleanup: () => void) => {
    cleanupFunctions.push(cleanup);
};

export const runCleanup = () => {
    cleanupFunctions.forEach((fn) => {
        try {
            fn();
        } catch (e) {
            console.error('Cleanup function failed:', e);
        }
    });
    cleanupFunctions.length = 0;
};
// Safely initialize offline detection with error handling
const safeInitOfflineDetection = async (): Promise<void> => {
    try {
        const cleanup = await initOfflineDetection();
        registerCleanup(cleanup);
    } catch (error) {
        console.error('[Init] Failed to initialize offline detection:', error);
        // Continue without offline detection - app will work in online-only mode
    }
};

// ============================================================================
// URL Parameter Helpers
// ============================================================================

const getPathParam = (prefix: string): string | null => {
    // Check for SSR initial state first
    if (typeof window !== 'undefined') {
        const win = window as unknown as {
            __INITIAL_STATE__?: { route?: { type: string; id: string } };
        };
        if (win.__INITIAL_STATE__?.route?.type === prefix) {
            return win.__INITIAL_STATE__.route!.id;
        }
    }

    const path = window.location.pathname;
    if (path.startsWith(`/smartgrind/${prefix}/`)) {
        return path.split(`/smartgrind/${prefix}/`)[1] || null;
    }
    // Handle clean paths from SSR (without /smartgrind prefix)
    if (path.startsWith(`/${prefix}/`)) {
        return path.split(`/${prefix}/`)[1] || null;
    }
    return prefix === 'c' && (path === '/smartgrind/' || path === '/') ? 'all' : null;
};

const getCategoryFromUrl = (): string | null => getPathParam('c');
const getAlgorithmsFromUrl = (): string | null => getPathParam('a');
const getSQLFromUrl = (): string | null => getPathParam('s');

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
    const DB_NAME = 'smartgrind-auth';
    const STORE_NAME = 'auth-tokens';

    const db = await new Promise<IDBDatabase | null>((resolve) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
        };
    });

    if (!db?.objectStoreNames.contains(STORE_NAME)) {
        db?.close();
        return null;
    }

    try {
        const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);
        const getValue = <T>(key: string): Promise<T | null> =>
            new Promise((resolve) => {
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result?.value ?? null);
                req.onerror = () => resolve(null);
            });

        const [token, expiresAt] = await Promise.all([
            getValue<string>('token'),
            getValue<string>('tokenExpiresAt'),
        ]);
        db.close();

        if (!token) return null;
        const expiry = expiresAt ? parseInt(expiresAt, 10) : null;
        return expiry && Date.now() >= expiry ? null : token;
    } catch {
        db.close();
        return null;
    }
};

// ============================================================================
// User Setup Functions
// ============================================================================

const applyCategory = async (
    categoryParam: string | null,
    algorithmsParam: string | null,
    sqlParam: string | null
) => {
    const { renderers } = await import('./renderers');

    // Ensure app wrapper is visible before rendering
    const appWrapper = state.elements['appWrapper'] as HTMLElement | null;
    const setupModal = state.elements['setupModal'] as HTMLElement | null;
    const loadingScreen = state.elements['loadingScreen'] as HTMLElement | null;

    setupModal?.classList.add('hidden');
    loadingScreen?.classList.add('hidden');
    appWrapper?.classList.remove('hidden');

    // Re-cache elements to ensure we have the latest DOM references
    state.cacheElements();

    // Handle SQL view
    if (sqlParam && data.sqlData.some((c) => c.id === sqlParam)) {
        state.ui.activeSQLCategoryId = sqlParam;
        renderers.renderSidebar();
        await renderers.renderSQLView(sqlParam);
        scrollToTop();
        return;
    }

    // Handle algorithms view
    if (algorithmsParam && data.algorithmsData.some((c) => c.id === algorithmsParam)) {
        state.ui.activeAlgorithmCategoryId = algorithmsParam;
        renderers.renderSidebar();
        await renderers.renderAlgorithmsView(algorithmsParam);
        scrollToTop();
        return;
    }

    // Handle problems category
    const isValidCategory =
        categoryParam &&
        categoryParam !== 'all' &&
        data.topicsData.some((t: Topic) => t.id === categoryParam);

    if (isValidCategory) {
        state.ui.activeTopicId = categoryParam;
        renderers.renderSidebar();
        await renderers.renderMainView(categoryParam);
        scrollToTop();
        return;
    }

    // Default: Show combined view with all content
    state.ui.activeTopicId = '';
    state.ui.activeAlgorithmCategoryId = null;
    state.ui.activeSQLCategoryId = null;
    renderers.renderSidebar();
    await renderers.renderCombinedView();
    renderers.updateStats();
    scrollToTop();
};
// Helper to initialize UI after user setup
const initializeUIAfterSetup = async () => {
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

    (state.elements['setupModal'] as HTMLElement | null)?.classList.add('hidden');
    (state.elements['appWrapper'] as HTMLElement | null)?.classList.remove('hidden');
    (state.elements['loadingScreen'] as HTMLElement | null)?.classList.add('hidden');
};

const setupSignedInUser = async (
    userId: string,
    displayName: string,
    categoryParam: string | null,
    algorithmsParam: string | null,
    sqlParam: string | null,
    token?: string
) => {
    // Set user type FIRST before loading from storage
    state.user.type = 'signed-in';

    localStorage.setItem('userId', userId);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');

    state.user.id = userId;
    state.user.displayName = displayName;
    const userDisplayEl = state.elements['userDisplay'] as HTMLElement | null;
    if (userDisplayEl) userDisplayEl.innerText = displayName;

    state.loadFromStorage();

    if (token) {
        const { storeTokenForServiceWorker } = await import('./sw-auth-storage');
        await storeTokenForServiceWorker(token);
    }

    // If offline with valid local data, skip API calls
    const isOnline = await getConnectivityChecker().isOnline();
    if (!isOnline && state.hasValidData()) {
        console.log('[Init] Offline with valid local data - skipping API calls');
        await initializeUIAfterSetup();
        await applyCategory(categoryParam, algorithmsParam, sqlParam);
        return;
    }

    const { fetchCsrfToken } = await import('./app');
    await fetchCsrfToken();

    await loadData();
    const { ui } = await import('./ui/ui');
    ui.updateAuthUI();
    await applyCategory(categoryParam, algorithmsParam, sqlParam);
};

const setupLocalUser = async (
    categoryParam: string | null,
    algorithmsParam: string | null,
    sqlParam: string | null
) => {
    const { app } = await import('./app');
    app.initializeLocalUser();
    await applyCategory(categoryParam, algorithmsParam, sqlParam);
};

// ============================================================================
// Auth Handlers
// ============================================================================

/**
 * Handles auth=success callback from PWA OAuth redirect.
 * SECURITY: PII is NOT passed via URL parameters. Instead, this function uses
 * the HttpOnly cookie set by the auth callback to fetch user info via /api/auth/token.
 * This prevents PII exposure in browser history, server logs, and referrer headers.
 */
const handleAuthSuccessCallback = async (
    categoryParam: string | null,
    algorithmsParam: string | null,
    sqlParam: string | null
): Promise<boolean> => {
    const authData = await fetchAuthToken();

    if (!authData) {
        const { ui } = await import('./ui/ui');
        ui.showAlert('Authentication failed. Please try signing in again.');
        return false;
    }

    await withErrorHandling(async () => {
        await setupSignedInUser(
            authData.userId,
            authData.displayName,
            categoryParam,
            algorithmsParam,
            sqlParam,
            authData.token
        );
    }, 'Failed to set up signed-in user');

    await safeInitOfflineDetection();
    return true;
};

const restoreSession = async (
    userId: string,
    displayName: string,
    token: string,
    categoryParam: string | null,
    algorithmsParam: string | null,
    sqlParam: string | null,
    errorMessage: string
): Promise<void> => {
    await withErrorHandling(
        () =>
            setupSignedInUser(userId, displayName, categoryParam, algorithmsParam, sqlParam, token),
        errorMessage
    );
    await safeInitOfflineDetection();
};

const handleExistingSession = async (
    userId: string,
    categoryParam: string | null,
    algorithmsParam: string | null,
    sqlParam: string | null
): Promise<boolean> => {
    const authData = await fetchAuthToken();
    const storedToken = !authData ? await getStoredTokenForOffline() : null;
    const token = authData?.token || storedToken;

    if (token) {
        const displayName = localStorage.getItem('displayName') || authData?.displayName || 'User';
        await restoreSession(
            userId,
            displayName,
            token,
            categoryParam,
            algorithmsParam,
            sqlParam,
            authData
                ? 'Failed to restore user session'
                : 'Failed to restore session with stored token'
        );
        return true;
    }

    // Session expired - clear and show signin
    localStorage.removeItem('userId');
    localStorage.removeItem('displayName');
    localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');
    openSigninModal();
    showToast('Session expired. Please sign in again.', 'error');
    return false;
};

const showSetupModal = async () => {
    const setupModal = state.elements['setupModal'] as HTMLElement | null;
    const appWrapper = state.elements['appWrapper'] as HTMLElement | null;
    const loadingScreen = state.elements['loadingScreen'] as HTMLElement | null;
    const googleLoginButton = state.elements['googleLoginButton'] as HTMLButtonElement | null;

    setupModal?.classList.remove('hidden');
    appWrapper?.classList.add('hidden');
    loadingScreen?.classList.add('hidden');

    if (googleLoginButton) {
        googleLoginButton.disabled = false;
        googleLoginButton.innerHTML = window.SmartGrind?.GOOGLE_BUTTON_HTML || '';
    }

    const { ui } = await import('./ui/ui');
    ui.updateAuthUI();
};

// ============================================================================
// Main Auth Check
// ============================================================================

const checkAuth = async () => {
    // Track if update toast has already been shown (prevents duplicates)
    let updateToastShown = false;

    // Listen for auth required events from Service Worker
    swRegister.on('authRequired', (data: unknown) => {
        const { message } = (data || {}) as { message?: string };
        console.warn('[Init] Auth required:', message);
        openSigninModal();
        showToast('Session expired. Please sign in again.', 'error');
    });

    // Listen for update available events (first install or new version)
    swRegister.on('updateAvailable', (data: unknown) => {
        const { reason } = (data || {}) as { reason?: string };
        console.log('[Init] Update available:', reason);

        // For updates (not first install), show notification
        // For first install, bundleReady event will handle it
        if (reason !== 'first-install' && !updateToastShown) {
            updateToastShown = true;
            showToast('New version is ready, reload', 'success', 15000);
        }
    });

    // Listen for bundle ready - show toast after offline bundle is fully extracted
    swRegister.on('bundleReady', (data: unknown) => {
        const { bundleVersion, downloadedAt } = (data || {}) as {
            bundleVersion?: string;
            downloadedAt?: number;
        };
        console.log(
            '[Init] Bundle ready:',
            bundleVersion,
            downloadedAt ? new Date(downloadedAt).toLocaleString() : 'unknown'
        );

        // Show toast only once (prevents duplicates from multiple events)
        if (!updateToastShown) {
            updateToastShown = true;
            showToast('New version is ready, reload', 'success', 15000);
        }
    });

    const categoryParam = getCategoryFromUrl();
    const algorithmsParam = getAlgorithmsFromUrl();
    const sqlParam = getSQLFromUrl();
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth') === 'success';
    // Handle auth=success callback (PWA redirect from OAuth)
    // SECURITY: PII (userId, displayName) is NOT passed via URL parameters.
    // Instead, we use the HttpOnly cookie to fetch user info via /api/auth/token.
    if (authSuccess) {
        const success = await handleAuthSuccessCallback(categoryParam, algorithmsParam, sqlParam);
        if (success) {
            // Clean up auth parameter from URL after successful auth (no PII in URL)
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }
    }

    // Check for existing session
    const userId = localStorage.getItem('userId');
    if (userId && (await handleExistingSession(userId, categoryParam, algorithmsParam, sqlParam))) {
        return;
    }

    // Default to local user or show setup modal
    const userType = localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE);

    if (userType === 'local' || (!userId && !userType)) {
        await withErrorHandling(
            () => setupLocalUser(categoryParam, algorithmsParam, sqlParam),
            'Failed to initialize local user'
        );
    } else {
        await showSetupModal();
    }

    await safeInitOfflineDetection();
};

export { checkAuth };
