// --- UI MODULE ---
// UI-specific functions and event handlers - clean barrel exports

export { pullToRefresh } from './ui-pull-to-refresh';
export { sidebarResizer } from './ui-sidebar-resizer';
export * from './ui-modals';
export * from './ui-auth';
export * from './ui-navigation';
export * from './ui-problems';
export * from './ui-global';
export * from './ui-scroll';
export * from './ui-markdown';
export * from './ui-bindings';

// Import all UI modules to create combined ui object
import * as uiModals from './ui-modals';
import * as uiAuth from './ui-auth';
import * as uiNavigation from './ui-navigation';
import * as uiProblems from './ui-problems';
import * as uiGlobal from './ui-global';
import * as uiScroll from './ui-scroll';
import * as uiMarkdown from './ui-markdown';
import * as uiBindings from './ui-bindings';
import { pullToRefresh } from './ui-pull-to-refresh';
import { sidebarResizer } from './ui-sidebar-resizer';
import { state } from '../state';
import { scrollToTop } from '../utils';
import { GOOGLE_BUTTON_HTML } from './ui-constants';

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
    pullToRefresh,
    sidebarResizer,
};

export const scrollToReview = () => {
    const contentScroll = state.elements['contentScroll'];
    if (contentScroll) {
        scrollToTop(true);
        const reviewBtn = document.querySelector(
            '[data-filter="review"]'
        ) as HTMLButtonElement | null;
        if (reviewBtn) {
            reviewBtn.click();
        }
    }
};

// Expose to window for inline onclick handlers
if (typeof window !== 'undefined') {
    window.SmartGrind = window.SmartGrind || {};
    window.SmartGrind.ui = ui;
    window.SmartGrind['GOOGLE_BUTTON_HTML'] = GOOGLE_BUTTON_HTML;
    window.scrollToReview = scrollToReview;
}
