// --- GLOBAL EVENTS ---

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Bind global events
window.SmartGrind.ui.bindGlobalEvents = () => {
    // Keyboard shortcuts
    document.addEventListener('keydown', window.SmartGrind.ui.handleKeyboard);

    // Browser navigation
    window.addEventListener('popstate', window.SmartGrind.ui.handlePopState);

    // Close sidebar on topic click (mobile)
    window.SmartGrind.state.elements.topicList?.addEventListener('click', (e) => {
        if (window.innerWidth < 768 && (e.target.closest('.sidebar-link') || e.target.closest('button'))) {
            window.SmartGrind.ui.toggleMobileMenu();
        }
    });
};

// Keyboard shortcuts map
window.SmartGrind.ui._keyboardShortcuts = {
    '/': () => {
        window.SmartGrind.state.elements.problemSearch.focus();
    },
    'Escape': () => {
        if (!window.SmartGrind.state.elements.setupModal.classList.contains('hidden')) return; // Don't close setup modal
        if (!window.SmartGrind.state.elements.addProblemModal.classList.contains('hidden')) {
            window.SmartGrind.state.elements.addProblemModal.classList.add('hidden');
        }
    },
    'e': () => window.SmartGrind.app.exportProgress(),
    'E': () => window.SmartGrind.app.exportProgress()
};

// Keyboard shortcuts
window.SmartGrind.ui.handleKeyboard = (e) => {
    // Skip if typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Allow Escape to close modals even when focused on input
        if (e.key === 'Escape') {
            window.SmartGrind.ui._keyboardShortcuts['Escape']();
            e.preventDefault();
        }
        return;
    }

    const handler = window.SmartGrind.ui._keyboardShortcuts[e.key];
    if (handler) {
        e.preventDefault();
        handler();
    }
};

// Browser navigation
window.SmartGrind.ui.handlePopState = () => {
    const categoryParam = window.SmartGrind.utils.getUrlParameter('category');
    if (categoryParam) {
        // Check if this is a valid category
        const validCategory = window.SmartGrind.data.topicsData.some(t => t.id === categoryParam) || categoryParam === 'all';
        if (validCategory) {
            window.SmartGrind.state.ui.activeTopicId = categoryParam;
            window.SmartGrind.renderers.renderSidebar(); // Re-render sidebar to update active state
            window.SmartGrind.renderers.renderMainView(); // Re-render main view with new category
            window.SmartGrind.utils.scrollToTop();
        }
    } else {
        // No category parameter, show all
        window.SmartGrind.state.ui.activeTopicId = 'all';
        window.SmartGrind.renderers.renderSidebar(); // Re-render sidebar to update active state
        window.SmartGrind.renderers.renderMainView(); // Re-render main view with all problems
        window.SmartGrind.utils.scrollToTop();
    }
};