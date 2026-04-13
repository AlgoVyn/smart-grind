// --- UI MODULE ---
// UI-specific functions and event handlers - combined as a single ui object

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

// Combined ui object - provides access to all UI module functions
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
