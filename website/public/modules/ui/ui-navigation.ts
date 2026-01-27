// --- NAVIGATION EVENTS ---

import { state } from '../state.js';
import { renderers } from '../renderers.js';
import { utils } from '../utils.js';

// Bind navigation-related events
export const bindNavigationEvents = () => {
    // Filter buttons
    const filterBtns = state.elements['filterBtns'];
    if (filterBtns) {
        (filterBtns as unknown as HTMLElement[]).forEach((btn: HTMLElement) => {
            btn.addEventListener('click', () => {
                state.ui.currentFilter = btn.dataset['filter'] || 'all';
                renderers.updateFilterBtns();
                renderers.renderMainView(state.ui.activeTopicId);
            });
        });
    }

    // Search
    const problemSearch = state.elements['problemSearch'];
    if (problemSearch) {
        problemSearch.addEventListener('input', () => {
            renderers.renderMainView(state.ui.activeTopicId);
        });
    }

    // Theme toggle
    const themeToggleBtn = state.elements['themeToggleBtn'];
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Mobile menu
    const mobileMenuBtn = state.elements['mobileMenuBtn'];
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    const mobileMenuBtnMain = state.elements['mobileMenuBtnMain'];
    if (mobileMenuBtnMain) {
        mobileMenuBtnMain.addEventListener('click', toggleMobileMenu);
    }
    const sidebarBackdrop = state.elements['sidebarBackdrop'];
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', toggleMobileMenu);
    }

    // Logo clicks
    const sidebarLogo = state.elements['sidebarLogo'];
    if (sidebarLogo) {
        sidebarLogo.addEventListener('click', loadDefaultView);
    }
    const mobileLogo = state.elements['mobileLogo'];
    if (mobileLogo) {
        mobileLogo.addEventListener('click', loadDefaultView);
    }
};

// Theme toggle
export const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

export const _toggleSidebarClasses = (sidebar: HTMLElement, addClasses: string[], removeClasses: string[]) => {
    addClasses.forEach((cls: string) => sidebar.classList.add(cls));
    removeClasses.forEach((cls: string) => sidebar.classList.remove(cls));
};

export const _toggleBackdrop = (backdrop: HTMLElement, show: boolean) => {
    if (show) {
        backdrop.classList.remove('hidden');
        setTimeout(() => backdrop.classList.add('opacity-100'), 10);
    } else {
        backdrop.classList.add('hidden');
        backdrop.classList.remove('opacity-100');
    }
};

// Mobile menu toggle
export const toggleMobileMenu = () => {
    const sidebar = state.elements['mainSidebar'];
    const backdrop = state.elements['sidebarBackdrop'];
    if (sidebar) {
        const isOpen = sidebar.classList.contains('translate-x-0');

        if (isOpen) {
            _toggleSidebarClasses(sidebar, ['-translate-x-full'], ['translate-x-0']);
            if (backdrop) {
                _toggleBackdrop(backdrop, false);
            }
            document.body.style.overflow = '';
        } else {
            _toggleSidebarClasses(sidebar, ['translate-x-0'], ['-translate-x-full']);
            if (backdrop) {
                _toggleBackdrop(backdrop, true);
            }
            document.body.style.overflow = 'hidden';
        }
    }
};

// Load default view (all problems)
export const loadDefaultView = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (renderers as any).setActiveTopic('all');
    utils.updateUrlParameter('category', null);
    renderers.renderMainView('all');
    utils.scrollToTop();
    // Close mobile menu if open
    const mainSidebar = state.elements['mainSidebar'];
    if (window.innerWidth < 768 && mainSidebar && mainSidebar.classList.contains('translate-x-0')) {
        toggleMobileMenu();
    }
};