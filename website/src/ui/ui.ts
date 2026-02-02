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
