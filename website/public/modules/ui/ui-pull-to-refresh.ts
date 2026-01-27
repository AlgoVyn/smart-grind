// --- PULL TO REFRESH FUNCTIONALITY ---

import { UI_CONSTANTS } from './ui-constants.js';
import { state } from '../state.js';

// Pull to refresh functionality
export const pullToRefresh = {
    startY: 0,
    isPulling: false,
    isMousePulling: false,
    threshold: UI_CONSTANTS.PULL_TO_REFRESH_THRESHOLD,

    init: () => {
        document.addEventListener('touchstart', pullToRefresh.handleTouchStart, { passive: false });
        document.addEventListener('touchmove', pullToRefresh.handleTouchMove, { passive: false });
        document.addEventListener('touchend', pullToRefresh.handleTouchEnd, { passive: false });
        document.addEventListener('mousedown', pullToRefresh.handleMouseDown, { passive: false });
        document.addEventListener('mousemove', pullToRefresh.handleMouseMove, { passive: false });
        document.addEventListener('mouseup', pullToRefresh.handleMouseEnd, { passive: false });
        document.addEventListener('mouseleave', pullToRefresh.handleMouseLeave, { passive: false });
    },

    // Helper to check if any modal is currently open
    isAnyModalOpen: () => {
        const modals = [
            state.elements['setupModal'],
            state.elements['addProblemModal'],
            state.elements['signinModal'],
            state.elements['alertModal'],
            state.elements['confirmModal'],
            state.elements['solutionModal']
        ];
        return modals.some(modal => modal && !modal.classList.contains('hidden'));
    },

    handleTouchStart: (e: TouchEvent) => {
        if (window.scrollY === 0 && state.elements['contentScroll']!.scrollTop === 0 && !state.elements['mainSidebar']!.classList.contains('translate-x-0') && !pullToRefresh.isAnyModalOpen() && e.touches[0]) {
            pullToRefresh.startY = e.touches[0].clientY;
            pullToRefresh.isPulling = true;
        }
    },

    handleMove: (currentY: number, isPullingFlag: 'isPulling' | 'isMousePulling') => {
        if (!pullToRefresh[isPullingFlag]) return;
        const deltaY = currentY - pullToRefresh.startY;
        if (deltaY > 0) {
            const appWrapper = document.getElementById('app-wrapper');
            if (appWrapper) {
                appWrapper.style.transform = `translateY(${deltaY}px)`;
            }
            return true; // prevent default
        } else {
            pullToRefresh[isPullingFlag] = false;
            return false;
        }
    },

    handleEnd: (currentY: number, isPullingFlag: 'isPulling' | 'isMousePulling') => {
        if (!pullToRefresh[isPullingFlag]) return;
        const deltaY = currentY - pullToRefresh.startY;
        const appWrapper = document.getElementById('app-wrapper');
        if (appWrapper) {
            appWrapper.style.transform = 'translateY(0)';
        }
        if (deltaY > pullToRefresh.threshold) {
            // Only attempt reload in non-test environment (JSDOM doesn't fully implement navigation)
            if (typeof jest === 'undefined' && typeof window !== 'undefined' && window.location) {
                try {
                    // Check if reload is actually implemented
                    if (typeof window.location.reload === 'function') {
                        window.location.reload();
                    }
                } catch (_e) {
                    // Ignore - JSDOM may throw "Not implemented" errors
                }
            }
        }
        pullToRefresh[isPullingFlag] = false;
    },

    handleTouchMove: (e: TouchEvent) => {
        if (e.touches[0] && pullToRefresh.handleMove(e.touches[0].clientY, 'isPulling')) {
            e.preventDefault(); // prevent default scrolling
        }
    },

    handleTouchEnd: (e: TouchEvent) => {
        if (e.changedTouches[0]) {
            pullToRefresh.handleEnd(e.changedTouches[0].clientY, 'isPulling');
        }
    },

    handleMouseDown: (e: MouseEvent) => {
        if (e.button !== 0) return; // Only left mouse button
        if (window.scrollY === 0 && state.elements['contentScroll']!.scrollTop === 0 && !state.elements['mainSidebar']!.classList.contains('translate-x-0') && !pullToRefresh.isAnyModalOpen() && !pullToRefresh.isMousePulling) {
            pullToRefresh.startY = e.clientY;
            pullToRefresh.isMousePulling = true;
        }
    },

    handleMouseMove: (e: MouseEvent) => {
        if (pullToRefresh.handleMove(e.clientY, 'isMousePulling')) {
            e.preventDefault(); // prevent default scrolling or selection
        }
    },

    handleMouseEnd: (e: MouseEvent) => {
        pullToRefresh.handleEnd(e.clientY, 'isMousePulling');
    },

    handleMouseLeave: () => {
        if (pullToRefresh.isMousePulling) {
            const appWrapper = document.getElementById('app-wrapper');
            if (appWrapper) {
                appWrapper.style.transform = 'translateY(0)';
            }
            pullToRefresh.isMousePulling = false;
        }
    }
};