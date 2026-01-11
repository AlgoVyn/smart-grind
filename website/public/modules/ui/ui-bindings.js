// --- UI BINDINGS ---

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Initialize UI components
window.SmartGrind.ui.init = () => {
    window.SmartGrind.state.init();
    window.SmartGrind.ui.bindEvents();
    window.SmartGrind.ui.initScrollButton();
    window.SmartGrind.ui.pullToRefresh.init();
    window.SmartGrind.ui.sidebarResizer.init();
    window.SmartGrind.ui.updateAuthUI();
    // Ensure "All" filter is visually selected on page load
    window.SmartGrind.renderers.updateFilterBtns();
};

// Bind all event listeners
window.SmartGrind.ui.bindEvents = () => {
    window.SmartGrind.ui.bindAuthEvents();
    window.SmartGrind.ui.bindModalEvents();
    window.SmartGrind.ui.bindNavigationEvents();
    window.SmartGrind.ui.bindProblemEvents();
    window.SmartGrind.ui.bindGlobalEvents();
};

// Bind authentication-related events
window.SmartGrind.ui.bindAuthEvents = () => {
    window.SmartGrind.state.elements.googleLoginBtn?.addEventListener('click', window.SmartGrind.ui.handleGoogleLogin);
    window.SmartGrind.state.elements.modalGoogleLoginBtn?.addEventListener('click', window.SmartGrind.ui.handleGoogleLogin);
    window.SmartGrind.state.elements.disconnectBtn?.addEventListener('click', window.SmartGrind.ui.handleLogout);
};

// Bind modal-related events
window.SmartGrind.ui.bindModalEvents = () => {
    // Sign-in modal
    window.SmartGrind.state.elements.signinModal?.addEventListener('click', window.SmartGrind.ui.createModalHandler(
        window.SmartGrind.state.elements.signinModal,
        window.SmartGrind.state.elements.signinModalContent,
        null
    ));

    // Alert modal
    window.SmartGrind.state.elements.alertModal?.addEventListener('click', window.SmartGrind.ui.createModalHandler(
        window.SmartGrind.state.elements.alertModal
    ));
    window.SmartGrind.state.elements.alertOkBtn?.addEventListener('click', window.SmartGrind.ui.closeAlertModal);

    // Confirm modal
    window.SmartGrind.state.elements.confirmModal?.addEventListener('click', window.SmartGrind.ui.createModalHandler(
        window.SmartGrind.state.elements.confirmModal,
        null,
        () => window.SmartGrind.ui.closeConfirmModal(false)
    ));
    window.SmartGrind.state.elements.confirmOkBtn?.addEventListener('click', () => window.SmartGrind.ui.closeConfirmModal(true));
    window.SmartGrind.state.elements.confirmCancelBtn?.addEventListener('click', () => window.SmartGrind.ui.closeConfirmModal(false));

    // Add problem modal
    window.SmartGrind.state.elements.openAddModalBtn?.addEventListener('click', window.SmartGrind.ui.openAddModal);
    window.SmartGrind.state.elements.cancelAddBtn?.addEventListener('click', window.SmartGrind.ui.closeAddModal);
    window.SmartGrind.state.elements.saveAddBtn?.addEventListener('click', window.SmartGrind.ui.saveNewProblem);
    window.SmartGrind.state.elements.addProbCategory?.addEventListener('change', window.SmartGrind.ui.handleCategoryChange);
    window.SmartGrind.state.elements.addProbPattern?.addEventListener('change', window.SmartGrind.ui.handlePatternChange);

    // Solution modal
    window.SmartGrind.state.elements.solutionCloseBtn?.addEventListener('click', window.SmartGrind.ui.closeSolutionModal);
    window.SmartGrind.state.elements.solutionModal?.addEventListener('click', window.SmartGrind.ui.createModalHandler(
        window.SmartGrind.state.elements.solutionModal
    ));
};