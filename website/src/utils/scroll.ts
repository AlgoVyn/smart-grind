// --- SCROLL UTILITIES MODULE ---
// Scroll-related helper functions

import { state } from '../state';

/**
 * Scrolls the main content area to the top.
 * Falls back to window scroll for mobile compatibility.
 * @param smooth - Whether to use smooth scrolling animation
 * @returns void
 * @example
 * scrollToTop(); // Instant scroll
 * scrollToTop(true); // Smooth animated scroll
 */
export const scrollToTop = (smooth = false): void => {
    const behavior = smooth ? 'smooth' : 'instant';
    const el = state.elements.contentScroll;
    if (el) {
        el.scrollTo({ top: 0, behavior: behavior });
    }

    // Fallback/Redundancy for mobile/main container
    window.scrollTo({ top: 0, behavior: behavior });
};
