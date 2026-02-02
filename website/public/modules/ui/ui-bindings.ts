// --- UI BINDINGS ---

import { state } from '../state.js';
import { initScrollButton } from './ui-scroll.js';
import { pullToRefresh } from './ui-pull-to-refresh.js';
import { sidebarResizer } from './ui-sidebar-resizer.js';
import { updateAuthUI, handleGoogleLogin, handleLogout } from './ui-auth.js';
import {
    createModalHandler,
    closeAlertModal,
    closeConfirmModal,
    openAddModal,
    closeAddModal,
    saveNewProblem,
    handleCategoryChange,
    handlePatternChange,
} from './ui-modals.js';
import { bindNavigationEvents } from './ui-navigation.js';
import { bindProblemEvents } from './ui-problems.js';
import { bindGlobalEvents } from './ui-global.js';
import { closeSolutionModal, toggleTOC } from './ui-markdown.js';

// Initialize UI components
export const init = async () => {
    state.init();
    bindEvents();
    initScrollButton();
    pullToRefresh.init();
    sidebarResizer.init();
    updateAuthUI();
    // Dynamically import renderers to avoid circular dependency
    const { renderers } = await import('../renderers.js');
    renderers.updateFilterBtns();
};

// Bind all event listeners
export const bindEvents = () => {
    bindAuthEvents();
    bindModalEvents();
    bindNavigationEvents();
    bindProblemEvents();
    bindGlobalEvents();
};

// Bind authentication-related events
export const bindAuthEvents = () => {
    state.elements['googleLoginBtn']?.addEventListener('click', handleGoogleLogin);
    state.elements['modalGoogleLoginBtn']?.addEventListener('click', handleGoogleLogin);
    state.elements['disconnectBtn']?.addEventListener('click', handleLogout);
};

// Bind modal-related events
export const bindModalEvents = () => {
    // Sign-in modal
    state.elements['signinModal']?.addEventListener(
        'click',
        createModalHandler(
            state.elements['signinModal']!,
            state.elements['signinModalContent'] || undefined,
            undefined
        )
    );

    // Alert modal
    state.elements['alertModal']?.addEventListener(
        'click',
        createModalHandler(state.elements['alertModal']!, undefined, undefined)
    );
    state.elements['alertOkBtn']?.addEventListener('click', closeAlertModal);

    // Confirm modal
    state.elements['confirmModal']?.addEventListener(
        'click',
        createModalHandler(state.elements['confirmModal']!, undefined, () =>
            closeConfirmModal(false)
        )
    );
    state.elements['confirmOkBtn']?.addEventListener('click', () => closeConfirmModal(true));
    state.elements['confirmCancelBtn']?.addEventListener('click', () => closeConfirmModal(false));

    // Add problem modal
    state.elements['openAddModalBtn']?.addEventListener('click', openAddModal);
    state.elements['cancelAddBtn']?.addEventListener('click', closeAddModal);
    state.elements['saveAddBtn']?.addEventListener('click', saveNewProblem);
    state.elements['addProbCategory']?.addEventListener('change', handleCategoryChange);
    state.elements['addProbPattern']?.addEventListener('change', handlePatternChange);

    // Solution modal
    state.elements['solutionCloseBtn']?.addEventListener('click', closeSolutionModal);
    state.elements['solutionModal']?.addEventListener(
        'click',
        createModalHandler(state.elements['solutionModal']!, undefined, undefined)
    );

    // TOC Toggle
    document.getElementById('toc-toggle-btn')?.addEventListener('click', toggleTOC);
};
