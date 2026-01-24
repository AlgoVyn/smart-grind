// --- SCROLL BUTTON ---

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Scroll button
window.SmartGrind.ui.initScrollButton = () => {
    if (window.SmartGrind.state.elements.contentScroll && window.SmartGrind.state.elements.scrollToTopBtn) {
        window.SmartGrind.state.elements.contentScroll.addEventListener('scroll', () => {
            if (window.SmartGrind.state.elements.contentScroll.scrollTop > 300) {
                // Show button
                window.SmartGrind.state.elements.scrollToTopBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            } else {
                // Hide button
                window.SmartGrind.state.elements.scrollToTopBtn.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
            }
        });

        window.SmartGrind.state.elements.scrollToTopBtn.addEventListener('click', () => {
            window.SmartGrind.utils.scrollToTop(true);
        });
    }
};