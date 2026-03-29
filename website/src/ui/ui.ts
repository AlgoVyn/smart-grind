// --- UI MODULE ---
// UI-specific functions and event handlers - direct re-exports

export * from './ui-pull-to-refresh';
export * from './ui-sidebar-resizer';
export * from './ui-flashcards';
export * from './ui-modals';
export * from './ui-auth';
export * from './ui-navigation';
export * from './ui-problems';
export * from './ui-global';
export * from './ui-scroll';
export * from './ui-markdown';
export * from './ui-bindings';
export * from './ui-constants';
export * from './ui-sync-indicators';

// Import all UI modules to create combined ui object
import * as uiModals from './ui-modals';
import * as uiAuth from './ui-auth';
import * as uiNavigation from './ui-navigation';
import * as uiProblems from './ui-problems';
import * as uiGlobal from './ui-global';
import * as uiScroll from './ui-scroll';
import * as uiMarkdown from './ui-markdown';
import * as uiBindings from './ui-bindings';
import * as uiPullToRefresh from './ui-pull-to-refresh';
import * as uiSidebarResizer from './ui-sidebar-resizer';
import * as uiFlashcards from './ui-flashcards';
import * as uiConstants from './ui-constants';
import * as uiSyncIndicators from './ui-sync-indicators';

import { state } from '../state';
import { scrollToTop } from '../utils';

// Backward-compatible ui object - combines all UI modules
export const ui = {
    ...uiModals,
    ...uiAuth,
    ...uiNavigation,
    ...uiProblems,
    ...uiGlobal,
    ...uiScroll,
    ...uiMarkdown,
    ...uiBindings,
    ...uiPullToRefresh,
    ...uiSidebarResizer,
    ...uiFlashcards,
    ...uiConstants,
    ...uiSyncIndicators,
};

export const scrollToReview = () => {
    const contentScroll = state.elements['contentScroll'];
    if (contentScroll) {
        scrollToTop(true);
        const reviewBtn = document.querySelector(
            '[data-filter="review"]'
        ) as HTMLButtonElement | null;
        if (reviewBtn) reviewBtn.click();
    }
};

// Expose to window for inline onclick handlers
if (typeof window !== 'undefined') {
    window.SmartGrind = window.SmartGrind || {};
    window.SmartGrind.ui = ui;
    window.SmartGrind['GOOGLE_BUTTON_HTML'] = uiConstants.GOOGLE_BUTTON_HTML;
    window.scrollToReview = scrollToReview;
}
