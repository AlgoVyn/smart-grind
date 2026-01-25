// --- GLOBAL EVENTS ---

import { Topic } from '../types.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Bind global events
window.SmartGrind.ui.bindGlobalEvents = () => {
    // Keyboard shortcuts
    document.addEventListener('keydown', window.SmartGrind.ui.handleKeyboard);

    // Browser navigation
    window.addEventListener('popstate', window.SmartGrind.ui.handlePopState);

    // Close sidebar on topic click (mobile)
    window.SmartGrind.state.elements.topicList?.addEventListener('click', (e: MouseEvent) => {
        if (window.innerWidth < 768 && ((e.target as Element).closest('.sidebar-link') || (e.target as Element).closest('button'))) {
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
window.SmartGrind.ui.handleKeyboard = (e: KeyboardEvent) => {
    // Skip if typing in an input/textarea
    if ((e.target as Element).tagName === 'INPUT' || (e.target as Element).tagName === 'TEXTAREA') {
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
    const category = categoryParam && (window.SmartGrind.data.topicsData.some((t: Topic) => t.id === categoryParam) || categoryParam === 'all')
        ? categoryParam
        : 'all';

    window.SmartGrind.state.ui.activeTopicId = category;
    window.SmartGrind.renderers.renderSidebar();
    window.SmartGrind.renderers.renderMainView();
    window.SmartGrind.utils.scrollToTop();
};