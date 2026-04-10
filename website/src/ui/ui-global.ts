// --- GLOBAL EVENTS ---

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { getUrlParameter, scrollToTop } from '../utils';
import { renderers } from '../renderers';
import { app } from '../app';

// Keyboard shortcuts map
const _keyboardShortcuts = {
    '/': () => {
        state.elements['problemSearch']?.focus();
    },
    Escape: () => {
        if (!state.elements['setupModal']?.classList.contains('hidden')) return; // Don't close setup modal
        if (!state.elements['addProblemModal']?.classList.contains('hidden')) {
            state.elements['addProblemModal']?.classList.add('hidden');
        }
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

// Browser navigation
export const handlePopState = (): void => {
    const categoryParam = getUrlParameter('category');
    const category =
        categoryParam &&
        (data.topicsData.some((t: Topic) => t.id === categoryParam) || categoryParam === 'all')
            ? categoryParam
            : '';

    state.ui.activeTopicId = category;
    renderers.renderSidebar();
    if (category) {
        renderers.renderMainView(state.ui.activeTopicId);
    } else {
        renderers.renderCombinedView();
    }
    scrollToTop();
};

// Bind global events
export const bindGlobalEvents = (): void => {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Browser navigation
    window.addEventListener('popstate', handlePopState);
};
