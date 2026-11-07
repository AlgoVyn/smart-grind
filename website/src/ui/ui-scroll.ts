// --- SCROLL BUTTON ---

import { state } from '../state';
import { scrollToTop } from '../utils';

// Elements that already have the scroll/click listeners attached. This runs
// after every auth transition (local init, post-setup, data load) on the same
// persistent elements — attaching unconditionally would stack duplicate
// listeners on each sign-out/sign-in cycle.
const listenersAttachedTo = new WeakSet<object>();

export const initScrollButton = () => {
    const contentScroll = state.elements['contentScroll'];
    const scrollToTopBtn = state.elements['scrollToTopBtn'];
    if (!contentScroll || !scrollToTopBtn) return;

    if (listenersAttachedTo.has(contentScroll) && listenersAttachedTo.has(scrollToTopBtn)) return;
    listenersAttachedTo.add(contentScroll);
    listenersAttachedTo.add(scrollToTopBtn);

    contentScroll.addEventListener('scroll', () => {
        if (state.elements['contentScroll']!.scrollTop > 300) {
            // Show button
            state.elements['scrollToTopBtn']!.classList.remove(
                'opacity-0',
                'translate-y-4',
                'pointer-events-none'
            );
        } else {
            // Hide button
            state.elements['scrollToTopBtn']!.classList.add(
                'opacity-0',
                'translate-y-4',
                'pointer-events-none'
            );
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        scrollToTop(true);
    });
};
