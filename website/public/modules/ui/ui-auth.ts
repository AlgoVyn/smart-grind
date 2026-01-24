/**
 * @fileoverview Authentication UI handlers for Smart Grind web application.
 *
 * This module provides functions for managing user authentication through Google OAuth,
 * including login, logout, UI updates, and error handling. It handles the popup-based
 * OAuth flow, session management, and switching between signed-in and local user modes.
 *
 * @module ui-auth
 */

import { UI_CONSTANTS } from './ui-constants.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

/**
 * Sets the loading state on authentication buttons.
 * @param {HTMLElement} button - The button element to update.
 * @param {boolean} loading - Whether to show loading state.
 * @param {string} [loadingText="Connecting..."] - Text to display while loading.
 */
window.SmartGrind.ui.setButtonLoading = (button, loading, loadingText = 'Connecting...') => {
    if (!button) return;
    button.disabled = loading;
    button.innerHTML = loading ? loadingText : window.SmartGrind.GOOGLE_BUTTON_HTML;
};

/**
 * Initiates Google OAuth login using a popup window.
 * Opens an authentication popup, listens for success/failure messages from the popup,
 * updates user session and UI on success, and handles errors or cancellations.
 */
window.SmartGrind.ui.handleGoogleLogin = () => {
    window.SmartGrind.ui.showError(null);
    const btn = window.SmartGrind.state.elements.googleLoginBtn;
    const modalBtn = window.SmartGrind.state.elements.modalGoogleLoginBtn;
    window.SmartGrind.ui.setButtonLoading(btn, true);
    window.SmartGrind.ui.setButtonLoading(modalBtn, true);

    // Open popup for auth
    const popup = window.open('/smartgrind/api/auth?action=login', 'auth', 'width=500,height=600');

    if (!popup) {
    // Popup blocked
        const btn = window.SmartGrind.state.elements.googleLoginBtn;
        const modalBtn = window.SmartGrind.state.elements.modalGoogleLoginBtn;
        window.SmartGrind.ui.setButtonLoading(btn, false);
        window.SmartGrind.ui.setButtonLoading(modalBtn, false);
        window.SmartGrind.utils.showToast('Sign-in popup was blocked. Please allow popups for this site and try again.', 'error');
        return;
    }

    let authCompleted = false;

    const handleAuthSuccess = (data) => {
        const { userId, displayName } = data;
        localStorage.setItem('userId', userId);
        localStorage.setItem('displayName', displayName);

        window.SmartGrind.state.user.id = userId;
        window.SmartGrind.state.user.displayName = displayName;
        window.SmartGrind.state.elements.userDisplay.innerText = displayName;
        window.SmartGrind.state.user.type = 'signed-in';
        localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');

        window.SmartGrind.api.loadData();
        window.SmartGrind.ui.updateAuthUI();

        // Close any open sign-in modals
        window.SmartGrind.state.elements.setupModal.classList.add('hidden');
        window.SmartGrind.state.elements.signinModal.classList.add('hidden');
    };

    const handleAuthFailure = (data) => {
        const { message } = data;
        setTimeout(() => {
            window.SmartGrind.utils.showToast(`Sign-in failed: ${message}`, 'error');
        }, 100);
    };

    const cleanupAuth = () => {
        window.removeEventListener('message', messageHandler);
        const btn = window.SmartGrind.state.elements.googleLoginBtn;
        const modalBtn = window.SmartGrind.state.elements.modalGoogleLoginBtn;
        window.SmartGrind.ui.setButtonLoading(btn, false);
        window.SmartGrind.ui.setButtonLoading(modalBtn, false);
    };

    // Listen for auth messages
    const messageHandler = (event) => {
    // Strict origin check for security
        const expectedOrigin = window.location.origin;
        if (event.origin !== expectedOrigin) {
            console.warn('Received message from unexpected origin:', event.origin);
            return;
        }
        authCompleted = true;
        if (event.data.type === 'auth-success') {
            handleAuthSuccess(event.data);
        } else if (event.data.type === 'auth-failure') {
            handleAuthFailure(event.data);
        }
        cleanupAuth();
    };
    window.addEventListener('message', messageHandler);

    const handlePopupClosed = () => {
        if (!authCompleted) {
            authCompleted = true;
            window.SmartGrind.utils.showToast('Sign-in was cancelled.', 'error');
            cleanupAuth();
        }
    };

    const handleAuthTimeout = () => {
        if (!authCompleted) {
            authCompleted = true;
            try {
                if (!popup.closed) popup.close();
            } catch (_e) {
                // ignore
            }
            window.SmartGrind.utils.showToast('Sign-in timed out. Please try again.', 'error');
            cleanupAuth();
        }
    };

    // Check if popup is closed without auth
    const checkPopupClosed = setInterval(() => {
        try {
            if (popup.closed) {
                clearInterval(checkPopupClosed);
                handlePopupClosed();
            }
        } catch (_e) {
            // COOP may block the check, ignore
        }
    }, 1000);

    // Timeout to reset buttons if no auth response received
    setTimeout(() => {
        clearInterval(checkPopupClosed);
        handleAuthTimeout();
    }, UI_CONSTANTS.AUTH_TIMEOUT);
};

/**
 * Handles user logout or sign-in modal opening.
 * If the user is signed in, switches to local mode by clearing session data,
 * resetting state, and reloading local data. If local, opens the sign-in modal.
 */
window.SmartGrind.ui.handleLogout = async () => {
    if (window.SmartGrind.state.user.type === 'signed-in') {
    // Switch to local user
        localStorage.removeItem('userId');
        localStorage.removeItem('displayName');
        // Note: Cookie will be cleared by server or expire naturally
        window.SmartGrind.state.user.id = null;

        // Switch to local user
        window.SmartGrind.state.user.type = 'local';
        localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');

        // Clear current data and reload local data
        window.SmartGrind.state.problems.clear();
        window.SmartGrind.state.deletedProblemIds.clear();

        // Reset filter to 'all'
        window.SmartGrind.state.ui.currentFilter = 'all';
        window.SmartGrind.renderers.updateFilterBtns();

        // Initialize local user with fresh data
        window.SmartGrind.app.initializeLocalUser();

        // Update the UI to show sign in option
        window.SmartGrind.ui.updateAuthUI();

        window.SmartGrind.utils.showToast('Switched to local mode');
    } else {
    // Open sign in modal for local users
        window.SmartGrind.ui.openSigninModal();
    }
};

/**
 * Updates the authentication UI elements based on the current user type.
 * Changes the disconnect button's text, icon, and title to reflect whether
 * the user is local (show sign-in) or signed-in (show sign-out).
 */
window.SmartGrind.ui.updateAuthUI = () => {
    const disconnectBtn = window.SmartGrind.state.elements.disconnectBtn;
    const isLocal = window.SmartGrind.state.user.type === 'local';

    const signInIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>`;

    const signOutIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>`;

    disconnectBtn.innerHTML = isLocal ? `${signInIcon} Sign In` : `${signOutIcon} Sign Out`;
    disconnectBtn.title = isLocal ? 'Sign in to sync across devices' : 'Sign out and switch to local mode';
};

/**
 * Displays or hides setup error messages in the UI.
 * Shows an alert if a message is provided and toggles the visibility of the error element.
 * @param {string|null} msg - The error message to display, or null to hide the error.
 */
window.SmartGrind.ui.showError = (msg) => {
    window.SmartGrind.ui.showAuthError(window.SmartGrind.state.elements.setupError, msg);
};

/**
 * Displays or hides sign-in error messages in the UI.
 * Shows an alert if a message is provided and toggles the visibility of the sign-in error element.
 * @param {string|null} msg - The error message to display, or null to hide the error.
 */
window.SmartGrind.ui.showAuthError = (element, msg) => {
    element.innerText = msg || '';
    element.classList.toggle('hidden', !msg);
};

window.SmartGrind.ui.showSigninError = (msg) => {
    window.SmartGrind.ui.showAuthError(window.SmartGrind.state.elements.signinError, msg);
};