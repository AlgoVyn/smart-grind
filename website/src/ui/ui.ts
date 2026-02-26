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

// Backward-compatible ui object - re-exported from combined module
export { ui } from './ui-combined';

// Import for window exposure (must be at module level for immediate execution)
import { ui } from './ui-combined';
import { state } from '../state';
import { scrollToTop } from '../utils';
import { GOOGLE_BUTTON_HTML } from './ui-constants';

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
