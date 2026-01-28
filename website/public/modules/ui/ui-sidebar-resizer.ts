// --- SIDEBAR RESIZER FUNCTIONALITY ---

import { UI_CONSTANTS } from './ui-constants.js';

// Sidebar resizer functionality
export const sidebarResizer = {
    isResizing: false,
    startX: 0,
    startWidth: 0,
    minWidth: UI_CONSTANTS.SIDEBAR_MIN_WIDTH,
    maxWidth: UI_CONSTANTS.SIDEBAR_MAX_WIDTH,

    init: () => {
        const resizer = document.getElementById('sidebar-resizer');
        if (resizer) {
            resizer.addEventListener('mousedown', sidebarResizer.startResize);
            // Touch support
            resizer.addEventListener('touchstart', sidebarResizer.startResize, { passive: false });
        }
        // Load saved width from localStorage
        sidebarResizer.loadWidth();
    },

    startResize: (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        sidebarResizer.isResizing = true;
        if (e.type === 'touchstart') {
            const touchEvent = e as TouchEvent;
            sidebarResizer.startX = touchEvent.touches[0]?.clientX || 0;
        } else {
            const mouseEvent = e as MouseEvent;
            sidebarResizer.startX = mouseEvent.clientX;
        }

        const sidebar = document.getElementById('main-sidebar');
        if (sidebar) {
            sidebarResizer.startWidth = sidebar.offsetWidth;
        }

        // Add event listeners for dragging
        document.addEventListener('mousemove', sidebarResizer.resize);
        document.addEventListener('mouseup', sidebarResizer.stopResize);
        document.addEventListener('touchmove', sidebarResizer.resize, { passive: false });
        document.addEventListener('touchend', sidebarResizer.stopResize);

        // Add resizing class for visual feedback
        document.body.classList.add('sidebar-resizing');
    },

    resize: (e: MouseEvent | TouchEvent) => {
        if (!sidebarResizer.isResizing) return;
        e.preventDefault();

        let currentX: number;
        if (e.type === 'touchmove') {
            const touchEvent = e as TouchEvent;
            currentX = touchEvent.touches[0]?.clientX || 0;
        } else {
            const mouseEvent = e as MouseEvent;
            currentX = mouseEvent.clientX;
        }
        const diff = currentX - sidebarResizer.startX;
        let newWidth = sidebarResizer.startWidth + diff;

        // Apply min/max constraints
        newWidth = Math.max(sidebarResizer.minWidth, Math.min(sidebarResizer.maxWidth, newWidth));

        const sidebar = document.getElementById('main-sidebar');
        if (sidebar) {
            sidebar.style.width = newWidth + 'px';
        }
    },

    stopResize: () => {
        if (!sidebarResizer.isResizing) return;
        sidebarResizer.isResizing = false;

        // Remove event listeners
        const events = [
            ['mousemove', 'resize'],
            ['mouseup', 'stopResize'],
            ['touchmove', 'resize'],
            ['touchend', 'stopResize'],
        ];
        events.forEach(([event, method]) => {
            const handler = sidebarResizer[method as 'resize' | 'stopResize'];
            document.removeEventListener(
                event as keyof DocumentEventMap,
                handler as unknown as EventListener
            );
        });

        // Remove resizing class
        document.body.classList.remove('sidebar-resizing');

        // Save width to localStorage
        sidebarResizer.saveWidth();
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
                const constrainedWidth = Math.max(
                    sidebarResizer.minWidth,
                    Math.min(sidebarResizer.maxWidth, width)
                );
                sidebar.style.width = constrainedWidth + 'px';
            }
        }
    },
};
