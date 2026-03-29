// --- UI BINDINGS ---

import { state } from '../state';
import { initScrollButton } from './ui-scroll';
import { pullToRefresh } from './ui-pull-to-refresh';
import { sidebarResizer } from './ui-sidebar-resizer';
import { updateAuthUI, handleGoogleLogin, handleLogout } from './ui-auth';
import {
    createModalHandler,
    closeAlertModal,
    closeConfirmModal,
    openAddModal,
    closeAddModal,
    saveNewProblem,
    handleCategoryChange,
    handlePatternChange,
} from './ui-modals';
import { bindNavigationEvents } from './ui-navigation';
import { bindProblemEvents } from './ui-problems';
import { bindGlobalEvents } from './ui-global';
import { closeSolutionModal, toggleTOC } from './ui-markdown';
import { initFlashcards } from './ui-flashcards';

// Initialize UI components
export const init = async () => {
    bindEvents();
    initScrollButton();
    pullToRefresh.init();
    sidebarResizer.init();
    updateAuthUI();
    initFlashcards();
    const { renderers } = await import('../renderers');
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

// Helper to safely add event listener
const on = (key: string, event: string, handler: EventListener) => {
    const el = state.elements[key] as HTMLElement | null;
    el?.addEventListener(event, handler);
};

// Bind authentication-related events
export const bindAuthEvents = () => {
    on('googleLoginButton', 'click', handleGoogleLogin);
    on('modalGoogleLoginButton', 'click', handleGoogleLogin);
    on('disconnectBtn', 'click', handleLogout);
};

// Bind modal-related events
export const bindModalEvents = () => {
    const signinModal = state.elements['signinModal'] as HTMLElement | null;
    const signinModalContent = state.elements['signinModalContent'] as HTMLElement | null;
    const alertModal = state.elements['alertModal'] as HTMLElement | null;
    const confirmModal = state.elements['confirmModal'] as HTMLElement | null;
    const solutionModal = state.elements['solutionModal'] as HTMLElement | null;

    if (signinModal) {
        signinModal.addEventListener(
            'click',
            createModalHandler(signinModal, signinModalContent || undefined, undefined)
        );
    }

    if (alertModal) {
        alertModal.addEventListener('click', createModalHandler(alertModal, undefined, undefined));
    }

    on('alertOkBtn', 'click', closeAlertModal);

    if (confirmModal) {
        confirmModal.addEventListener(
            'click',
            createModalHandler(confirmModal, undefined, () => closeConfirmModal(false))
        );
    }

    on('confirmOkBtn', 'click', () => closeConfirmModal(true));
    on('confirmCancelBtn', 'click', () => closeConfirmModal(false));

    // Add problem modal
    on('openAddModalBtn', 'click', openAddModal);
    on('cancelAddBtn', 'click', closeAddModal);
    on('saveAddBtn', 'click', saveNewProblem);
    on('addProbCategory', 'change', handleCategoryChange);
    on('addProbPattern', 'change', handlePatternChange);

    // Solution modal
    on('solutionCloseBtn', 'click', closeSolutionModal);

    if (solutionModal) {
        solutionModal.addEventListener(
            'click',
            createModalHandler(solutionModal, undefined, undefined)
        );
    }

    // TOC Toggle
    document.getElementById('toc-toggle-btn')?.addEventListener('click', toggleTOC);
};
