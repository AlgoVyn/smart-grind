// --- COMBINED UI MODULE ---
// Backward-compatible ui object combining all UI modules

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
