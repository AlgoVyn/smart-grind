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
    sidebarResizer
};

if (typeof jest === 'undefined') {
    state.init();
    checkAuth();
    ui.init().catch(console.error);
}