// --- UI MODULE ---
// UI-specific functions and event handlers

import { pullToRefresh } from './ui-pull-to-refresh.js';
import { sidebarResizer } from './ui-sidebar-resizer.js';
import * as uiModals from './ui-modals.js';
import * as uiAuth from './ui-auth.js';
import * as uiNavigation from './ui-navigation.js';
import * as uiProblems from './ui-problems.js';
import * as uiGlobal from './ui-global.js';
import * as uiScroll from './ui-scroll.js';
import * as uiMarkdown from './ui-markdown.js';
import * as uiBindings from './ui-bindings.js';
import { state } from '../state.js';
import { checkAuth } from '../init.js';
import { utils } from '../utils.js';
import { GOOGLE_BUTTON_HTML } from './ui-constants.js';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).SmartGrind = (window as any).SmartGrind || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).SmartGrind.ui = ui;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).SmartGrind['GOOGLE_BUTTON_HTML'] = GOOGLE_BUTTON_HTML;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).scrollToReview = scrollToReview;
}

if (typeof jest === 'undefined') {
    state.init();
    checkAuth();
    ui.init().catch(console.error);
}
