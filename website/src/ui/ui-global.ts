// --- GLOBAL EVENTS ---

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { scrollToTop, hideEl, parseRoute } from '../utils';
import { renderers } from '../renderers';
import { app } from '../app';

// Keyboard shortcuts map
const _keyboardShortcuts = {
    '/': () => {
        state.elements['problemSearch']?.focus();
    },
    Escape: () => {
        if (!state.elements['setupModal']?.classList.contains('hidden')) return; // Don't close setup modal
        hideEl(state.elements['addProblemModal']);
    },
    e: () => app.exportProgress(),
    E: () => app.exportProgress(),
};

// Keyboard shortcuts
export const handleKeyboard = (e: KeyboardEvent): void => {
    const target = e.target as Element;
    // Skip if typing in an input/textarea/select or contenteditable element
    const isEditable =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        (target instanceof HTMLElement && target.isContentEditable);
    if (isEditable) {
        // Allow Escape to close modals even when focused on editable elements
        if (e.key === 'Escape') {
            _keyboardShortcuts['Escape']();
            e.preventDefault();
        }
        return;
    }

    const handler = _keyboardShortcuts[e.key as keyof typeof _keyboardShortcuts];
    if (handler) {
        e.preventDefault();
        handler();
    }
};

// Browser navigation - path-based routing
export const handlePopState = (): void => {
    const route = parseRoute(window.location.pathname);

    if (route) {
        const { type, id } = route;

        if (type === 'c') {
            // Patterns/category route
            const category =
                data.topicsData.some((t: Topic) => t.id === id) || id === 'all' ? id : '';
            state.ui.activeTopicId = category;
            renderers.renderSidebar();
            renderers.renderMainView(category || 'all');
            scrollToTop();
            return;
        } else if (type === 'a') {
            // Algorithms route
            state.ui.activeTopicId = '';
            state.ui.activeAlgorithmCategoryId = id;
            renderers.renderSidebar();
            renderers.renderAlgorithmsView(id);
            scrollToTop();
            return;
        } else if (type === 's') {
            // SQL route
            state.ui.activeTopicId = '';
            state.ui.activeSQLCategoryId = id;
            renderers.renderSidebar();
            renderers.renderSQLView(id);
            scrollToTop();
            return;
        }
    }

    // Default/Dashboard view
    state.ui.activeTopicId = '';
    state.ui.activeAlgorithmCategoryId = null;
    state.ui.activeSQLCategoryId = null;
    renderers.renderSidebar();
    renderers.renderCombinedView();
    scrollToTop();
};

// Bind global events
export const bindGlobalEvents = (): void => {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Browser navigation
    window.addEventListener('popstate', handlePopState);
};
