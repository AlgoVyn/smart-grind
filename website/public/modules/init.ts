// --- INITIALIZATION ---

import { Topic } from './types.js';

// Helper to apply category from URL
const _applyCategory = (categoryParam: string | null) => {
    if (categoryParam && categoryParam !== 'all') {
        const validCategory = window.SmartGrind.data.topicsData.some((t: Topic) => t.id === categoryParam);
        if (validCategory) {
            window.SmartGrind.state.ui.activeTopicId = categoryParam;
        }
    }
    window.SmartGrind.renderers.renderSidebar();
    window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
    window.SmartGrind.utils.scrollToTop();
};

// Helper to setup signed-in user
const _setupSignedInUser = async (userId: string, displayName: string, categoryParam: string | null) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('displayName', displayName);

    window.SmartGrind.state.user.id = userId;
    window.SmartGrind.state.user.displayName = displayName;
    window.SmartGrind.state.elements.userDisplay.innerText = displayName;
    window.SmartGrind.state.user.type = 'signed-in';
    localStorage.setItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE, 'signed-in');

    await window.SmartGrind.api.loadData();
    window.SmartGrind.ui.updateAuthUI();
    _applyCategory(categoryParam);
};

// Helper to setup local user
const _setupLocalUser = (categoryParam: string | null) => {
    window.SmartGrind.app.initializeLocalUser();
    _applyCategory(categoryParam);
};

// Check auth state and initialize app
const checkAuth = async () => {
    // Load UI modules dynamically for code splitting
    await Promise.all([
        import('./renderers.js'),
        import('./ui/ui.js')
    ]);

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

    // Handle PWA auth callback
    if (urlToken && urlUserId && urlDisplayName) {
        localStorage.setItem('token', urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
        await _setupSignedInUser(urlUserId, urlDisplayName, categoryParam);
        return;
    }

    // Check for existing session
    const userId = localStorage.getItem('userId');
    if (userId) {
        const displayName = localStorage.getItem('displayName') || 'User';
        await _setupSignedInUser(userId, displayName, categoryParam);
        return;
    }

    // Default to local user
    const userType = localStorage.getItem(window.SmartGrind.data.LOCAL_STORAGE_KEYS.USER_TYPE) || 'local';

    if (userType === 'local') {
        _setupLocalUser(categoryParam);
    } else {
    // Show setup modal for orphaned signed-in state
        window.SmartGrind.state.elements.setupModal.classList.remove('hidden');
        window.SmartGrind.state.elements.appWrapper.classList.add('hidden');
        window.SmartGrind.state.elements.loadingScreen.classList.add('hidden');

        window.SmartGrind.state.elements.googleLoginBtn.disabled = false;
        window.SmartGrind.state.elements.googleLoginBtn.innerHTML = window.SmartGrind['GOOGLE_BUTTON_HTML'];
        window.SmartGrind.ui.updateAuthUI();
    }
};

export { checkAuth };