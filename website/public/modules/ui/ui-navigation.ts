// --- NAVIGATION EVENTS ---

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Bind navigation-related events
window.SmartGrind.ui.bindNavigationEvents = () => {
    // Filter buttons
    window.SmartGrind.state.elements.filterBtns?.forEach((btn: HTMLElement) => {
        btn.addEventListener('click', () => {
            window.SmartGrind.state.ui.currentFilter = btn.dataset['filter'];
            window.SmartGrind.renderers.updateFilterBtns();
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
        });
    });

    // Search
    window.SmartGrind.state.elements.problemSearch?.addEventListener('input', () => {
        window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
    });

    // Theme toggle
    window.SmartGrind.state.elements.themeToggleBtn?.addEventListener('click', window.SmartGrind.ui.toggleTheme);

    // Mobile menu
    window.SmartGrind.state.elements.mobileMenuBtn?.addEventListener('click', window.SmartGrind.ui.toggleMobileMenu);
    window.SmartGrind.state.elements.mobileMenuBtnMain?.addEventListener('click', window.SmartGrind.ui.toggleMobileMenu);
    window.SmartGrind.state.elements.sidebarBackdrop?.addEventListener('click', window.SmartGrind.ui.toggleMobileMenu);

    // Logo clicks
    window.SmartGrind.state.elements.sidebarLogo?.addEventListener('click', window.SmartGrind.ui.loadDefaultView);
    window.SmartGrind.state.elements.mobileLogo?.addEventListener('click', window.SmartGrind.ui.loadDefaultView);
};

// Theme toggle
window.SmartGrind.ui.toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

window.SmartGrind.ui._toggleSidebarClasses = (sidebar: HTMLElement, addClasses: string[], removeClasses: string[]) => {
    addClasses.forEach((cls: string) => sidebar.classList.add(cls));
    removeClasses.forEach((cls: string) => sidebar.classList.remove(cls));
};

window.SmartGrind.ui._toggleBackdrop = (backdrop: HTMLElement, show: boolean) => {
    if (show) {
        backdrop.classList.remove('hidden');
        setTimeout(() => backdrop.classList.add('opacity-100'), 10);
    } else {
        backdrop.classList.add('hidden');
        backdrop.classList.remove('opacity-100');
    }
};

// Mobile menu toggle
window.SmartGrind.ui.toggleMobileMenu = () => {
    const sidebar = window.SmartGrind.state.elements.mainSidebar;
    const backdrop = window.SmartGrind.state.elements.sidebarBackdrop;
    const isOpen = sidebar.classList.contains('translate-x-0');

    if (isOpen) {
        window.SmartGrind.ui._toggleSidebarClasses(sidebar, ['-translate-x-full'], ['translate-x-0']);
        window.SmartGrind.ui._toggleBackdrop(backdrop, false);
        document.body.style.overflow = '';
    } else {
        window.SmartGrind.ui._toggleSidebarClasses(sidebar, ['translate-x-0'], ['-translate-x-full']);
        window.SmartGrind.ui._toggleBackdrop(backdrop, true);
        document.body.style.overflow = 'hidden';
    }
};

// Load default view (all problems)
window.SmartGrind.ui.loadDefaultView = () => {
    window.SmartGrind.renderers.setActiveTopic('all');
    window.SmartGrind.utils.updateUrlParameter('category', null);
    window.SmartGrind.renderers.renderMainView('all');
    window.SmartGrind.utils.scrollToTop();
    // Close mobile menu if open
    if (window.innerWidth < 768 && window.SmartGrind.state.elements.mainSidebar.classList.contains('translate-x-0')) {
        window.SmartGrind.ui.toggleMobileMenu();
    }
};