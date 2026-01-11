// --- PULL TO REFRESH FUNCTIONALITY ---

import { UI_CONSTANTS } from './ui-constants.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Pull to refresh functionality
window.SmartGrind.ui.pullToRefresh = {
    startY: 0,
    isPulling: false,
    threshold: UI_CONSTANTS.PULL_TO_REFRESH_THRESHOLD,

    init: () => {
        document.addEventListener('touchstart', window.SmartGrind.ui.pullToRefresh.handleTouchStart, { passive: false });
        document.addEventListener('touchmove', window.SmartGrind.ui.pullToRefresh.handleTouchMove, { passive: false });
        document.addEventListener('touchend', window.SmartGrind.ui.pullToRefresh.handleTouchEnd, { passive: false });
    },

    // Helper to check if any modal is currently open
    isAnyModalOpen: () => {
        const modals = [
            window.SmartGrind.state.elements.setupModal,
            window.SmartGrind.state.elements.addProblemModal,
            window.SmartGrind.state.elements.signinModal,
            window.SmartGrind.state.elements.alertModal,
            window.SmartGrind.state.elements.confirmModal,
            window.SmartGrind.state.elements.solutionModal
        ];
        return modals.some(modal => modal && !modal.classList.contains('hidden'));
    },

    handleTouchStart: (e) => {
        if (window.scrollY === 0 && window.SmartGrind.state.elements.contentScroll.scrollTop === 0 && !window.SmartGrind.state.elements.mainSidebar.classList.contains('translate-x-0') && !window.SmartGrind.ui.pullToRefresh.isAnyModalOpen()) {
            window.SmartGrind.ui.pullToRefresh.startY = e.touches[0].clientY;
            window.SmartGrind.ui.pullToRefresh.isPulling = true;
        }
    },

    handleTouchMove: (e) => {
        if (!window.SmartGrind.ui.pullToRefresh.isPulling) return;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - window.SmartGrind.ui.pullToRefresh.startY;
        if (deltaY > 0) {
            e.preventDefault(); // prevent default scrolling
            const appWrapper = document.getElementById('app-wrapper');
            appWrapper.style.transform = `translateY(${deltaY}px)`;
        } else {
            window.SmartGrind.ui.pullToRefresh.isPulling = false;
        }
    },

    handleTouchEnd: (e) => {
        if (!window.SmartGrind.ui.pullToRefresh.isPulling) return;
        const currentY = e.changedTouches[0].clientY;
        const deltaY = currentY - window.SmartGrind.ui.pullToRefresh.startY;
        const appWrapper = document.getElementById('app-wrapper');
        appWrapper.style.transform = 'translateY(0)';
        if (deltaY > window.SmartGrind.ui.pullToRefresh.threshold) {
            // Only attempt reload in non-test environment (JSDOM doesn't fully implement navigation)
            if (typeof jest === 'undefined' && typeof window !== 'undefined' && window.location) {
                try {
                    // Check if reload is actually implemented
                    if (typeof window.location.reload === 'function') {
                        window.location.reload();
                    }
                } catch (e) {
                    // Ignore - JSDOM may throw "Not implemented" errors
                }
            }
        }
        window.SmartGrind.ui.pullToRefresh.isPulling = false;
    }
};