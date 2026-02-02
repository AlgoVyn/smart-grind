// --- GLOBAL EVENTS ---

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { utils } from '../utils';
import { renderers } from '../renderers';
import { app } from '../app';
import { toggleMobileMenu } from './ui-navigation';

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
export const handleKeyboard = (e: KeyboardEvent) => {
    // Skip if typing in an input/textarea
    if ((e.target as Element).tagName === 'INPUT' || (e.target as Element).tagName === 'TEXTAREA') {
        // Allow Escape to close modals even when focused on input
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
export const handlePopState = () => {
    const categoryParam = utils.getUrlParameter('category');
    const category =
        categoryParam &&
        (data.topicsData.some((t: Topic) => t.id === categoryParam) || categoryParam === 'all')
            ? categoryParam
            : 'all';

    state.ui.activeTopicId = category;
    renderers.renderSidebar();
    renderers.renderMainView(state.ui.activeTopicId);
    utils.scrollToTop();
};

// Bind global events
export const bindGlobalEvents = () => {
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Browser navigation
    window.addEventListener('popstate', handlePopState);

    // Close sidebar on topic click (mobile)
    state.elements['topicList']?.addEventListener('click', (e: MouseEvent) => {
        if (
            window.innerWidth < 768 &&
            ((e.target as Element).closest('.sidebar-link') ||
                (e.target as Element).closest('button'))
        ) {
            toggleMobileMenu();
        }
    });
};
