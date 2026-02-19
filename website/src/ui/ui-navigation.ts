// --- NAVIGATION EVENTS ---

import { state } from '../state';
import { renderers } from '../renderers';
import { utils } from '../utils';

// Bind navigation-related events
export const bindNavigationEvents = () => {
    // Filter buttons
    const filterBtns = state.elements['filterBtns'];
    if (filterBtns) {
        (filterBtns as unknown as HTMLElement[]).forEach((btn: HTMLElement) => {
            btn.addEventListener('click', () => {
                const newFilter = btn.dataset['filter'] || 'all';
                // Reset date filter when switching to review or solved
                if (newFilter === 'review' || newFilter === 'solved') {
                    state.ui.reviewDateFilter = null;
                    // Also reset the dropdown to "All Dates"
                    const reviewDateFilterEl = state.elements['reviewDateFilter'];
                    if (reviewDateFilterEl) {
                        reviewDateFilterEl.value = '';
                    }
                }
                state.ui.currentFilter = newFilter;
                renderers.updateFilterBtns();
                renderers.renderMainView(state.ui.activeTopicId);
            });
        });
    }

    // Review date filter
    const reviewDateFilter = state.elements['reviewDateFilter'];
    if (reviewDateFilter) {
        reviewDateFilter.addEventListener('change', () => {
            state.ui.reviewDateFilter = reviewDateFilter.value || null;
            renderers.renderMainView(state.ui.activeTopicId);
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

// Toggle date filter visibility based on current filter
export const toggleDateFilterVisibility = (show: boolean) => {
    const dateFilterContainer = state.elements['dateFilterContainer'];
    if (dateFilterContainer) {
        dateFilterContainer.classList.toggle('hidden', !show);
    }
};

// Populate date filter dropdown with available dates
export const populateDateFilter = () => {
    const reviewDateFilter = state.elements['reviewDateFilter'];
    if (!reviewDateFilter) return;

    const today = utils.getToday();
    const currentFilter = state.ui.currentFilter;
    const availableDates = utils.getAvailableReviewDates(today, currentFilter);

    // Save current selection
    const currentSelection = reviewDateFilter.value;

    // Clear existing options (except first)
    reviewDateFilter.innerHTML = '<option value="">All Dates</option>';

    // Add dates from oldest to newest
    availableDates.forEach((date: string) => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = utils.formatDate(date);
        reviewDateFilter.appendChild(option);
    });

    // Restore selection if still valid
    if (currentSelection && availableDates.includes(currentSelection)) {
        reviewDateFilter.value = currentSelection;
    }
};

// Theme toggle
export const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

export const _toggleSidebarClasses = (sidebar: HTMLElement, isOpen: boolean) => {
    sidebar.classList.toggle('translate-x-0', !isOpen);
    sidebar.classList.toggle('-translate-x-full', isOpen);
};

export const _toggleBackdrop = (backdrop: HTMLElement, show: boolean) => {
    backdrop.classList.toggle('hidden', !show);
    if (show) {
        setTimeout(() => backdrop.classList.add('opacity-100'), 10);
    } else {
        backdrop.classList.remove('opacity-100');
    }
};

// Mobile menu toggle
export const toggleMobileMenu = () => {
    const sidebar = state.elements['mainSidebar'];
    const backdrop = state.elements['sidebarBackdrop'];
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('translate-x-0');
    _toggleSidebarClasses(sidebar, isOpen);

    if (backdrop) {
        _toggleBackdrop(backdrop, !isOpen);
    }
    document.body.style.overflow = isOpen ? '' : 'hidden';
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
