// --- NAVIGATION EVENTS ---

import { state } from '../state';
import { renderers } from '../renderers';
import {
    getToday,
    formatDate,
    getAvailableReviewDates,
    updateUrlParameter,
    scrollToTop,
} from '../utils';

/**
 * Re-renders the current view based on the active category context.
 * Centralizes view routing logic to ensure consistency across event handlers.
 */
const rerenderCurrentView = (): void => {
    if (state.ui.activeAlgorithmCategoryId) {
        renderers.renderAlgorithmsView(state.ui.activeAlgorithmCategoryId);
    } else if (state.ui.activeSQLCategoryId) {
        renderers.renderSQLView(state.ui.activeSQLCategoryId);
    } else if (state.ui.activeTopicId) {
        renderers.renderMainView(state.ui.activeTopicId);
    } else {
        // All Content view (combined view)
        renderers.renderCombinedView();
    }
};

// Bind navigation-related events
export const bindNavigationEvents = (): void => {
    // Filter buttons
    const filterBtns = state.elements['filterBtns'];
    if (filterBtns) {
        (filterBtns as unknown as HTMLElement[]).forEach((btn: HTMLElement) => {
            btn.addEventListener('click', () => {
                const newFilter = btn.dataset['filter'] || 'all';
                // Clear date filter when leaving review/solved modes (it only applies there)
                if (newFilter !== 'review' && newFilter !== 'solved') {
                    state.ui.reviewDateFilter = null;
                    // Also reset the dropdown to "All Dates"
                    const reviewDateFilterEl = state.elements[
                        'reviewDateFilter'
                    ] as HTMLSelectElement | null;
                    if (reviewDateFilterEl) {
                        reviewDateFilterEl.value = '';
                    }
                }
                state.ui.currentFilter = newFilter;
                renderers.updateFilterBtns();
                // Re-render the appropriate view based on current context
                rerenderCurrentView();
            });
        });
    }

    // Clear filters button (empty state)
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            const problemSearch = state.elements['problemSearch'] as HTMLInputElement | null;
            if (problemSearch) {
                problemSearch.value = '';
            }
            state.ui.currentFilter = 'all';
            state.ui.reviewDateFilter = null;
            // Reset the date filter dropdown
            const reviewDateFilterEl = state.elements[
                'reviewDateFilter'
            ] as HTMLSelectElement | null;
            if (reviewDateFilterEl) {
                reviewDateFilterEl.value = '';
            }
            renderers.updateFilterBtns();
            rerenderCurrentView();
        });
    }

    // Review date filter
    const reviewDateFilter = state.elements['reviewDateFilter'] as HTMLSelectElement | null;
    if (reviewDateFilter) {
        reviewDateFilter.addEventListener('change', () => {
            state.ui.reviewDateFilter = reviewDateFilter.value || null;
            // Re-render the appropriate view based on current context
            rerenderCurrentView();
        });
    }

    // Search
    const problemSearch = state.elements['problemSearch'];
    if (problemSearch) {
        problemSearch.addEventListener('input', () => {
            // Re-render the appropriate view based on current context
            rerenderCurrentView();
        });
    }

    // Theme toggle
    const themeToggleBtn = state.elements['themeToggleBtn'];
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Mobile menu - bind same handler to multiple elements
    [
        state.elements['mobileMenuBtn'],
        state.elements['mobileMenuBtnMain'],
        state.elements['sidebarBackdrop'],
    ].forEach((el) => el?.addEventListener('click', toggleMobileMenu));

    // Logo clicks - bind same handler to both logos
    [state.elements['sidebarLogo'], state.elements['mobileLogo']].forEach((el) =>
        el?.addEventListener('click', loadDefaultView)
    );
};

// Toggle date filter visibility based on current filter
export const toggleDateFilterVisibility = (show: boolean): void => {
    const dateFilterContainer = state.elements['dateFilterContainer'];
    if (dateFilterContainer) {
        dateFilterContainer.classList.toggle('hidden', !show);
    }
};

// Populate date filter dropdown with available dates
export const populateDateFilter = (): void => {
    const reviewDateFilter = state.elements['reviewDateFilter'] as HTMLSelectElement | null;
    if (!reviewDateFilter) return;

    const today = getToday();
    const currentFilter = state.ui.currentFilter;
    const availableDates = getAvailableReviewDates(today, currentFilter);

    // Save current selection
    const currentSelection = reviewDateFilter.value;

    // Clear existing options (except first)
    reviewDateFilter.innerHTML = '<option value="">All Dates</option>';

    // Add dates from oldest to newest
    availableDates.forEach((date: string) => {
        const option = document.createElement('option');
        option.value = date;
        option.textContent = formatDate(date);
        reviewDateFilter.appendChild(option);
    });

    // Restore selection if still valid
    if (currentSelection && availableDates.includes(currentSelection)) {
        reviewDateFilter.value = currentSelection;
    }
};

/**
 * Updates the date filter visibility and populates the dropdown
 * based on the current filter mode. Date filter is only shown in
 * review or solved modes.
 */
export const updateDateFilterForCurrentMode = (): void => {
    const showDateFilter =
        state.ui.currentFilter === 'review' || state.ui.currentFilter === 'solved';
    toggleDateFilterVisibility(showDateFilter);
    if (showDateFilter) {
        populateDateFilter();
    }
};

// Theme toggle
export const toggleTheme = (): void => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

export const _toggleSidebarClasses = (sidebar: HTMLElement, isOpen: boolean): void => {
    sidebar.classList.toggle('translate-x-0', !isOpen);
    sidebar.classList.toggle('-translate-x-full', isOpen);
};

export const _toggleBackdrop = (backdrop: HTMLElement, show: boolean): void => {
    backdrop.classList.toggle('hidden', !show);
    if (show) {
        setTimeout(() => backdrop.classList.add('opacity-100'), 10);
    } else {
        backdrop.classList.remove('opacity-100');
    }
};

// Mobile menu toggle
export const toggleMobileMenu = (): void => {
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

// Load default view (all content)
export const loadDefaultView = (): void => {
    // Clear all active categories to show combined view
    state.ui.activeTopicId = '';
    state.ui.activeAlgorithmCategoryId = null;
    state.ui.activeSQLCategoryId = null;
    updateUrlParameter('category', null);
    renderers.renderSidebar();
    renderers.renderCombinedView();
    renderers.updateStats();
    scrollToTop();
    // Close mobile menu if open
    const mainSidebar = state.elements['mainSidebar'];
    if (window.innerWidth < 768 && mainSidebar && mainSidebar.classList.contains('translate-x-0')) {
        toggleMobileMenu();
    }
};
