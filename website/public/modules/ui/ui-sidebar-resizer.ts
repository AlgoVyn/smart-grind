// --- SIDEBAR RESIZER FUNCTIONALITY ---

import { UI_CONSTANTS } from './ui-constants.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Sidebar resizer functionality
window.SmartGrind.ui.sidebarResizer = {
    isResizing: false,
    startX: 0,
    startWidth: 0,
    minWidth: UI_CONSTANTS.SIDEBAR_MIN_WIDTH,
    maxWidth: UI_CONSTANTS.SIDEBAR_MAX_WIDTH,

    init: () => {
        const resizer = document.getElementById('sidebar-resizer');
        if (resizer) {
            resizer.addEventListener('mousedown', window.SmartGrind.ui.sidebarResizer.startResize);
            // Touch support
            resizer.addEventListener('touchstart', window.SmartGrind.ui.sidebarResizer.startResize, { passive: false });
        }
        // Load saved width from localStorage
        window.SmartGrind.ui.sidebarResizer.loadWidth();
    },

    startResize: (e) => {
        e.preventDefault();
        window.SmartGrind.ui.sidebarResizer.isResizing = true;
        window.SmartGrind.ui.sidebarResizer.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;

        const sidebar = document.getElementById('main-sidebar');
        window.SmartGrind.ui.sidebarResizer.startWidth = sidebar.offsetWidth;

        // Add event listeners for dragging
        document.addEventListener('mousemove', window.SmartGrind.ui.sidebarResizer.resize);
        document.addEventListener('mouseup', window.SmartGrind.ui.sidebarResizer.stopResize);
        document.addEventListener('touchmove', window.SmartGrind.ui.sidebarResizer.resize, { passive: false });
        document.addEventListener('touchend', window.SmartGrind.ui.sidebarResizer.stopResize);

        // Add resizing class for visual feedback
        document.body.classList.add('sidebar-resizing');
    },

    resize: (e) => {
        if (!window.SmartGrind.ui.sidebarResizer.isResizing) return;
        e.preventDefault();

        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = currentX - window.SmartGrind.ui.sidebarResizer.startX;
        let newWidth = window.SmartGrind.ui.sidebarResizer.startWidth + diff;

        // Apply min/max constraints
        newWidth = Math.max(window.SmartGrind.ui.sidebarResizer.minWidth, Math.min(window.SmartGrind.ui.sidebarResizer.maxWidth, newWidth));

        const sidebar = document.getElementById('main-sidebar');
        sidebar.style.width = newWidth + 'px';
    },

    stopResize: () => {
        if (!window.SmartGrind.ui.sidebarResizer.isResizing) return;
        window.SmartGrind.ui.sidebarResizer.isResizing = false;

        // Remove event listeners
        const events = [
            ['mousemove', 'resize'],
            ['mouseup', 'stopResize'],
            ['touchmove', 'resize'],
            ['touchend', 'stopResize']
        ];
        events.forEach(([event, method]) => {
            document.removeEventListener(event, window.SmartGrind.ui.sidebarResizer[method]);
        });

        // Remove resizing class
        document.body.classList.remove('sidebar-resizing');

        // Save width to localStorage
        window.SmartGrind.ui.sidebarResizer.saveWidth();
    },

    saveWidth: () => {
        const sidebar = document.getElementById('main-sidebar');
        if (sidebar) {
            localStorage.setItem('sidebarWidth', sidebar.offsetWidth.toString());
        }
    },

    loadWidth: () => {
        const savedWidth = localStorage.getItem('sidebarWidth');
        if (savedWidth) {
            const sidebar = document.getElementById('main-sidebar');
            if (sidebar) {
                const width = parseInt(savedWidth, 10);
                // Apply min/max constraints when loading
                const constrainedWidth = Math.max(window.SmartGrind.ui.sidebarResizer.minWidth, Math.min(window.SmartGrind.ui.sidebarResizer.maxWidth, width));
                sidebar.style.width = constrainedWidth + 'px';
            }
        }
    }
};