// --- UI MODULE ---
// UI-specific functions and event handlers

window.SmartGrind = window.SmartGrind || {};

// Import all UI modules
import './ui-constants.js';
import './ui-pull-to-refresh.js';
import './ui-sidebar-resizer.js';
import './ui-modals.js';
import './ui-auth.js';
import './ui-navigation.js';
import './ui-problems.js';
import './ui-global.js';
import './ui-scroll.js';
import './ui-markdown.js';
import './ui-bindings.js';
import './app.js';
import { checkAuth } from './init.js';

if (typeof jest === 'undefined') {
    window.SmartGrind.state.init();
    checkAuth();
    window.SmartGrind.ui.init();
}

export default window.SmartGrind.ui;