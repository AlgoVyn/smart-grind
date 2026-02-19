// --- UI MODULE ---
// UI-specific functions and event handlers

import { pullToRefresh } from './ui-pull-to-refresh';
import { sidebarResizer } from './ui-sidebar-resizer';
import * as uiModals from './ui-modals';
import * as uiAuth from './ui-auth';
import * as uiNavigation from './ui-navigation';
import * as uiProblems from './ui-problems';
import * as uiGlobal from './ui-global';
import * as uiScroll from './ui-scroll';
import * as uiMarkdown from './ui-markdown';
import * as uiBindings from './ui-bindings';
import { initSyncIndicators } from './ui-sync-indicators';
import { state } from '../state';
import { checkAuth } from '../init';
import { utils } from '../utils';
import { GOOGLE_BUTTON_HTML } from './ui-constants';

// Combine all UI modules into a single ui object
export const ui = {
    ...uiModals,
    ...uiAuth,
    ...uiNavigation,
    ...uiProblems,
    ...uiGlobal,
    ...uiScroll,
    ...uiMarkdown,
    ...uiBindings,
    pullToRefresh,
    sidebarResizer,
};

// Scroll to review section
export const scrollToReview = () => {
    const contentScroll = state.elements['contentScroll'];
    if (contentScroll) {
        utils.scrollToTop(true);
        // Set filter to 'review' and scroll to top
        const reviewBtn = document.querySelector(
            '[data-filter="review"]'
        ) as HTMLButtonElement | null;
        if (reviewBtn) {
            reviewBtn.click();
        }
    }
};

// Expose ui, scrollToReview, and GOOGLE_BUTTON_HTML to window for inline onclick handlers
if (typeof window !== 'undefined') {
    window.SmartGrind = window.SmartGrind || {};
    window.SmartGrind.ui = ui;
    window.SmartGrind['GOOGLE_BUTTON_HTML'] = GOOGLE_BUTTON_HTML;
    window.scrollToReview = scrollToReview;
}

if (typeof jest === 'undefined') {
    state.init();
    checkAuth();
    // Initialize sync indicators for offline/online status display
    initSyncIndicators();
    ui.init().catch(() => {});
}
