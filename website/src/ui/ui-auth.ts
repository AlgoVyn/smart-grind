/**
 * @fileoverview Authentication UI handlers for Smart Grind web application.
 *
 * This module provides functions for managing user authentication through Google OAuth,
 * including login, logout, UI updates, and error handling. It handles the popup-based
 * OAuth flow, session management, and switching between signed-in and local user modes.
 *
 * @module ui-auth
 */

import { UI_CONSTANTS } from './ui-constants';
import { GOOGLE_BUTTON_HTML } from './ui-constants';
import { state } from '../state';
import { data } from '../data';
import { api } from '../api';
import { utils } from '../utils';
import { app } from '../app';
import { renderers } from '../renderers';
import { openSigninModal } from './ui-modals';
import { ui } from './ui';

/**
 * Sets the loading state on authentication buttons.
 * @param {HTMLElement} button - The button element to update.
 * @param {boolean} loading - Whether to show loading state.
 * @param {string} [loadingText="Connecting..."] - Text to display while loading.
 */
export const setButtonLoading = (
    button: HTMLElement | null,
    loading: boolean,
    loadingText = 'Connecting...'
) => {
    if (!button) return;
    const btn = button as HTMLButtonElement;
    btn.disabled = loading;
    btn.innerHTML = loading ? loadingText : GOOGLE_BUTTON_HTML;
};

/**
 * Helper to reset all login buttons to default state
 */
const resetLoginButtons = () => {
    ui.setButtonLoading(state.elements.googleLoginButton ?? null, false);
    ui.setButtonLoading(state.elements.modalGoogleLoginButton ?? null, false);
};

/**
 * Initiates Google OAuth login using a popup window.
 * Opens an authentication popup, listens for success/failure messages from the popup,
 * updates user session and UI on success, and handles errors or cancellations.
 */
export const handleGoogleLogin = () => {
    showError(null);
    ui.setButtonLoading(state.elements.googleLoginButton ?? null, true);
    ui.setButtonLoading(state.elements.modalGoogleLoginButton ?? null, true);

    // Open popup for auth
    const popup = window.open('/smartgrind/api/auth?action=login', 'auth', 'width=500,height=600');

    if (!popup) {
        // Popup blocked
        resetLoginButtons();
        utils.showToast(
            'Sign-in popup was blocked. Please allow popups for this site and try again.',
            'error'
        );
        return;
    }

    let authCompleted = false;
    let popupCheckInterval: ReturnType<typeof setInterval> | null = null;

    const handleAuthSuccess = async (authData: { userId: string; displayName: string }) => {
        const { userId, displayName } = authData;
        localStorage.setItem('userId', userId);
        localStorage.setItem('displayName', displayName);

        state.user.id = userId;
        state.user.displayName = displayName;
        if (state.elements.userDisplay) {
            state.elements.userDisplay.innerText = displayName;
        }
        state.user.type = 'signed-in';
        localStorage.setItem('smartgrind-user-type', 'signed-in');

        // Fetch token from secure endpoint for Service Worker
        // The HttpOnly cookie is automatically sent with this request
        try {
            const tokenResponse = await fetch('/smartgrind/api/auth?action=token', {
                credentials: 'include', // Send HttpOnly cookie
            });

            if (tokenResponse.ok) {
                const tokenData = await tokenResponse.json();
                if (tokenData.token) {
                    const { storeTokenForServiceWorker } = await import('../sw-auth-storage');
                    storeTokenForServiceWorker(tokenData.token).catch(() => {});
                }
            }
        } catch {
            // Token fetch failed - user is still authenticated via cookie
            // SW will fall back to cookie-based auth
        }

        api.loadData();
        updateAuthUI();

        // Close any open sign-in modals
        state.elements.setupModal?.classList.add('hidden');
        state.elements.signinModal?.classList.add('hidden');
    };

    const handleAuthFailure = (data: { message: string }) => {
        setTimeout(() => {
            utils.showToast(`Sign-in failed: ${data.message}`, 'error');
        }, 100);
    };

    const cleanupAuth = () => {
        window.removeEventListener('message', messageHandler);
        if (popupCheckInterval) {
            clearInterval(popupCheckInterval);
            popupCheckInterval = null;
        }
        resetLoginButtons();
    };

    // Listen for popup closure to reset buttons immediately
    const handlePopupClose = () => {
        if (!authCompleted) {
            authCompleted = true;
            clearTimeout(timeoutId);
            cleanupAuth();
        }
    };

    // Listen for auth messages
    const messageHandler = (event: MessageEvent): void | Promise<void> => {
        if (event.origin !== window.location.origin) {
            return;
        }
        authCompleted = true;
        if (event.data.type === 'auth-success') {
            const p = handleAuthSuccess(event.data);
            p.finally(cleanupAuth);
            return p;
        }
        if (event.data.type === 'auth-failure') {
            handleAuthFailure(event.data);
        }
        cleanupAuth();
        return;
    };
    window.addEventListener('message', messageHandler);

    // Monitor popup closure
    popupCheckInterval = setInterval(() => {
        try {
            // Check if popup is closed - COOP may block this, so we check location.href first
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            popup.location.href; // This will throw if COOP blocks access
            if (popup.closed) handlePopupClose();
        } catch {
            // COOP blocks access to cross-origin popup, assume it's still open
            // The message handler will clean up when auth completes
        }
    }, 500);

    const handleAuthTimeout = () => {
        if (!authCompleted) {
            authCompleted = true;
            try {
                // Try to close popup - COOP may block access
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                popup.location.href; // Check access first
                if (!popup.closed) popup.close();
            } catch {
                // COOP blocks access, popup may already be closed
            }
            utils.showToast('Sign-in timed out. Please try again.', 'error');
            cleanupAuth();
        }
    };

    // Timeout to reset buttons if no auth response received
    const timeoutId = setTimeout(handleAuthTimeout, UI_CONSTANTS.AUTH_TIMEOUT);
};

/**
 * Handles user logout or sign-in modal opening.
 * If the user is signed in, switches to local mode by clearing session data,
 * resetting state, and reloading local data. If local, opens the sign-in modal.
 */
export const handleLogout = async () => {
    if (state.user.type === 'signed-in') {
        // Switch to local user
        localStorage.removeItem('userId');
        localStorage.removeItem('displayName');
        const { clearTokenForServiceWorker } = await import('../sw-auth-storage');
        clearTokenForServiceWorker().catch(() => {});
        // Note: Cookie will be cleared by server or expire naturally
        state.user.id = null;

        // Switch to local user
        state.user.type = 'local';
        localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');

        // Clear current data and reload local data
        state.problems.clear();
        state.deletedProblemIds.clear();

        // Reset filter to 'all'
        state.ui.currentFilter = 'all';
        renderers.updateFilterBtns();

        // Initialize local user with fresh data
        app.initializeLocalUser();

        // Update the UI to show sign in option
        updateAuthUI();

        utils.showToast('Switched to local mode');
    } else {
        // Open sign in modal for local users
        openSigninModal();
    }
};

/**
 * Updates the authentication UI elements based on the current user type.
 * Changes the disconnect button's text, icon, and title to reflect whether
 * the user is local (show sign-in) or signed-in (show sign-out).
 */
export const updateAuthUI = () => {
    const disconnectBtn = state.elements.disconnectBtn;
    const isLocal = state.user.type === 'local';

    const signInIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>`;

    const signOutIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>`;

    if (disconnectBtn) {
        disconnectBtn.innerHTML = isLocal ? `${signInIcon} Sign In` : `${signOutIcon} Sign Out`;
        disconnectBtn.title = isLocal
            ? 'Sign in to sync across devices'
            : 'Sign out and switch to local mode';
    }
};

/**
 * Displays or hides setup error messages in the UI.
 * Shows an alert if a message is provided and toggles the visibility of the error element.
 * @param {string|null} msg - The error message to display, or null to hide the error.
 */
export const showError = (msg: string | null) => {
    showAuthError(state.elements.setupError ?? null, msg);
};

/**
 * Displays or hides sign-in error messages in the UI.
 * Shows an alert if a message is provided and toggles the visibility of the sign-in error element.
 * @param {string|null} msg - The error message to display, or null to hide the error.
 */
export const showAuthError = (element: HTMLElement | null, msg: string | null) => {
    if (element) {
        element.innerText = msg || '';
        element.classList.toggle('hidden', !msg);
    }
};

export const showSigninError = (msg: string | null) => {
    showAuthError(state.elements.signinError ?? null, msg);
};
