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
const _applyCategory = async (categoryParam: string | null, algorithmsParam: string | null) => {
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

// Helper to setup signed-in user
const _setupSignedInUser = async (
    userId: string,
    displayName: string,
    categoryParam: string | null,
    algorithmsParam: string | null,
    token?: string
) => {
    // CRITICAL: Set user type FIRST before loading from storage
    // This ensures loadFromStorage() uses the correct SIGNED_IN keys
    state.user.type = 'signed-in';
    
    // Store user info in localStorage (not sensitive)
    localStorage.setItem('userId', userId);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');

    state.user.id = userId;
    state.user.displayName = displayName;
    const userDisplayEl = state.elements['userDisplay'];
    if (userDisplayEl) userDisplayEl.innerText = displayName;

    // CRITICAL: Load state from localStorage BEFORE any API calls
    // This ensures offline data is available even if API fails
    // User type is already 'signed-in', so it will load from SIGNED_IN keys
    state.loadFromStorage();

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
    await _applyCategory(categoryParam, algorithmsParam);
};

/**
 * Fetch auth token from secure endpoint using httpOnly cookie
 * In offline mode, returns null gracefully without logging an error
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
        // Only log error if we're online - offline is expected to fail
        if (navigator.onLine) {
            console.error('[Init] Failed to fetch auth token:', error);
        }
        return null;
    }
};

// Helper to setup local user
const _setupLocalUser = async (categoryParam: string | null, algorithmsParam: string | null) => {
    const { app } = await import('./app');
    app.initializeLocalUser();
    await _applyCategory(categoryParam, algorithmsParam);
};

/**
 * Get stored token from IndexedDB for offline scenarios
 * Returns the token if valid (not expired), null otherwise
 */
const _getStoredTokenForOffline = async (): Promise<string | null> => {
    return new Promise((resolve) => {
        const request = indexedDB.open('smartgrind-auth', 1);

        request.onerror = () => resolve(null);

        request.onsuccess = async () => {
            const db = request.result;

            // Check if the object store exists
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

                // Check if token is expired
                if (expiresAt && Date.now() >= expiresAt) {
                    resolve(null); // Token expired
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

// Check auth state and initialize app
const checkAuth = async () => {
    // Listen for auth required events from Service Worker (background sync auth failures)
    // Register this EARLY so we don't miss events if initialization is slow
    swRegister.on('authRequired', (eventData: unknown) => {
        const eventDataObj = eventData as { message?: string; timestamp?: number };
        console.warn('[Init] Received authRequired event:', eventDataObj.message);

        // Show sign-in modal to ask user to sign in again
        openSigninModal();
        console.warn('[Init] Called openSigninModal()');

        // Show toast notification
        utils.showToast('Session expired. Please sign in again.', 'error');
    });

    // Extract category from URL path
    const path = window.location.pathname;
    const categoryParam = path.startsWith('/smartgrind/c/')
        ? path.split('/smartgrind/c/')[1] || null
        : path === '/smartgrind/'
          ? 'all'
          : null;

    // Extract algorithms parameter from URL path (SEO-friendly: /smartgrind/a/{category})
    const algorithmsParam = path.startsWith('/smartgrind/a/')
        ? path.split('/smartgrind/a/')[1] || null
        : null;

    // URL params for auth callback handling
    const urlParams = new URLSearchParams(window.location.search);

    // Check URL params for PWA auth callback (new secure flow)
    // Token is NO LONGER in URL - only userId and displayName
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
                algorithmsParam,
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
                await _setupSignedInUser(
                    userId,
                    displayName,
                    categoryParam,
                    algorithmsParam,
                    authData.token
                );
            }, 'Failed to restore user session');
        } else {
            // Fetch failed - try to use stored token from IndexedDB as fallback
            // This handles both offline mode and network race conditions when coming online
            const storedToken = await _getStoredTokenForOffline();
            if (storedToken) {
                const displayName = localStorage.getItem('displayName') || 'User';
                await withErrorHandling(async () => {
                    await _setupSignedInUser(
                        userId,
                        displayName,
                        categoryParam,
                        algorithmsParam,
                        storedToken
                    );
                }, 'Failed to restore session with stored token');

                // Initialize offline detection for signed-in users
                initOfflineDetection();
                return;
            }

            // No valid token available - session expired
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
            await _setupLocalUser(categoryParam, algorithmsParam);
        }, 'Failed to initialize local user');
    } else {
        // Show setup modal for orphaned signed-in state
        const { setupModal, appWrapper, loadingScreen, googleLoginButton } = state.elements;

        setupModal?.classList.remove('hidden');
        appWrapper?.classList.add('hidden');
        loadingScreen?.classList.add('hidden');

        if (googleLoginButton) {
            (googleLoginButton as HTMLButtonElement).disabled = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            googleLoginButton.innerHTML =
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
