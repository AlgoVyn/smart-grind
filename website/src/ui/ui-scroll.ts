// --- SCROLL BUTTON ---

import { state } from '../state';
import { utils } from '../utils';

// Scroll button
export const initScrollButton = () => {
    if (state.elements['contentScroll'] && state.elements['scrollToTopBtn']) {
        state.elements['contentScroll'].addEventListener('scroll', () => {
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

        state.elements['scrollToTopBtn'].addEventListener('click', () => {
            utils.scrollToTop(true);
        });
    }
};
