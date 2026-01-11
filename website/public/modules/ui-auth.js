// --- AUTHENTICATION HANDLERS ---

import { UI_CONSTANTS } from './ui-constants.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Helper to set loading state on buttons
window.SmartGrind.ui.setButtonLoading = (button, loading, loadingText = "Connecting...") => {
    if (!button) return;
    button.disabled = loading;
    button.innerHTML = loading ? loadingText : window.SmartGrind.GOOGLE_BUTTON_HTML;
};

// Google login handler
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
        window.SmartGrind.ui.setButtonLoading(btn, false);
        window.SmartGrind.ui.setButtonLoading(modalBtn, false);
        window.SmartGrind.utils.showToast('Sign-in popup was blocked. Please allow popups for this site and try again.', 'error');
        return;
    }

    let authCompleted = false;

    // Listen for auth messages
    const messageHandler = (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === 'auth-success') {
            authCompleted = true;
            const { token, userId, displayName } = event.data;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('displayName', displayName);

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

            window.removeEventListener('message', messageHandler);
            window.SmartGrind.ui.setButtonLoading(btn, false);
            window.SmartGrind.ui.setButtonLoading(modalBtn, false);
        } else if (event.data.type === 'auth-failure') {
            authCompleted = true;
            const { message } = event.data;
            // Delay toast to ensure popup closes first
            setTimeout(() => {
                window.SmartGrind.utils.showToast(`Sign-in failed: ${message}`, 'error');
            }, 100);
            window.removeEventListener('message', messageHandler);
            window.SmartGrind.ui.setButtonLoading(btn, false);
            window.SmartGrind.ui.setButtonLoading(modalBtn, false);
        }
    };
    window.addEventListener('message', messageHandler);

    // Check if popup is closed without auth
    const checkPopupClosed = setInterval(() => {
        if (popup.closed && !authCompleted) {
            authCompleted = true;
            clearInterval(checkPopupClosed);
            window.removeEventListener('message', messageHandler);
            window.SmartGrind.ui.setButtonLoading(btn, false);
            window.SmartGrind.ui.setButtonLoading(modalBtn, false);
            window.SmartGrind.utils.showToast('Sign-in was cancelled.', 'error');
        }
    }, 1000);

    // Timeout to reset buttons if no auth response received
    setTimeout(() => {
        if (!authCompleted) {
            authCompleted = true;
            clearInterval(checkPopupClosed);
            window.removeEventListener('message', messageHandler);
            window.SmartGrind.ui.setButtonLoading(btn, false);
            window.SmartGrind.ui.setButtonLoading(modalBtn, false);
            if (!popup.closed) {
                popup.close();
            }
            window.SmartGrind.utils.showToast('Sign-in timed out. Please try again.', 'error');
        }
    }, UI_CONSTANTS.AUTH_TIMEOUT);
};

// Logout handler
window.SmartGrind.ui.handleLogout = async () => {
    if (window.SmartGrind.state.user.type === 'signed-in') {
        // Switch to local user
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('displayName');
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

// Update auth UI
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

// Error display
window.SmartGrind.ui.showError = (msg) => {
    if (msg) {
        window.SmartGrind.ui.showAlert(msg);
    }
    window.SmartGrind.state.elements.setupError.classList.toggle('hidden', !msg);
    window.SmartGrind.state.elements.setupError.innerText = msg || '';
};

window.SmartGrind.ui.showSigninError = (msg) => {
    if (msg) {
        window.SmartGrind.ui.showAlert(msg);
    }
    window.SmartGrind.state.elements.signinError.classList.toggle('hidden', !msg);
    window.SmartGrind.state.elements.signinError.innerText = msg || '';
};