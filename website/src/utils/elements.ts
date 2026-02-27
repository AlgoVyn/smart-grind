// --- ELEMENT CACHING UTILITY ---
// Centralized DOM element caching for fast access throughout the app

/**
 * Interface for DOM element cache
 * Elements are cached on init for fast access throughout the app
 */
export interface ElementCache {
    // Modals
    setupModal: HTMLElement | null;
    addProblemModal: HTMLElement | null;
    signinModal: HTMLElement | null;
    signinModalContent: HTMLElement | null;
    alertModal: HTMLElement | null;
    confirmModal: HTMLElement | null;
    solutionModal: HTMLElement | null;
    // Modal content elements
    alertMessage: HTMLElement | null;
    confirmMessage: HTMLElement | null;
    alertTitle: HTMLElement | null;
    confirmTitle: HTMLElement | null;
    alertOkBtn: HTMLElement | null;
    confirmOkBtn: HTMLElement | null;
    confirmCancelBtn: HTMLElement | null;
    solutionCloseBtn: HTMLElement | null;
    // App structure
    appWrapper: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    topicList: HTMLElement | null;
    problemsContainer: HTMLElement | null;
    contentScroll: HTMLElement | null;
    emptyState: HTMLElement | null;
    currentViewTitle: HTMLElement | null;
    // Auth elements
    googleLoginButton: HTMLElement | null;
    modalGoogleLoginButton: HTMLElement | null;
    setupError: HTMLElement | null;
    signinError: HTMLElement | null;
    userDisplay: HTMLElement | null;
    disconnectBtn: HTMLElement | null;
    // Stats elements
    sidebarTotalStat: HTMLElement | null;
    sidebarTotalBar: HTMLElement | null;
    statTotal: HTMLElement | null;
    statSolved: HTMLElement | null;
    progressBarSolved: HTMLElement | null;
    statDue: HTMLElement | null;
    statDueBadge: HTMLElement | null;
    reviewBanner: HTMLElement | null;
    reviewCountBanner: HTMLElement | null;
    // Navigation & controls
    mobileMenuBtn: HTMLElement | null;
    mobileMenuBtnMain: HTMLElement | null;
    openAddModalBtn: HTMLElement | null;
    cancelAddBtn: HTMLElement | null;
    saveAddBtn: HTMLElement | null;
    themeToggleBtn: HTMLElement | null;
    scrollToTopBtn: HTMLElement | null;
    sidebarLogo: HTMLElement | null;
    mobileLogo: HTMLElement | null;
    mainSidebar: HTMLElement | null;
    sidebarResizer: HTMLElement | null;
    sidebarBackdrop: HTMLElement | null;
    // Form inputs
    addProbName: HTMLInputElement | null;
    addProbUrl: HTMLInputElement | null;
    addProbCategory: HTMLSelectElement | null;
    addProbCategoryNew: HTMLInputElement | null;
    addProbPattern: HTMLSelectElement | null;
    addProbPatternNew: HTMLInputElement | null;
    problemSearch: HTMLInputElement | null;
    reviewDateFilter: HTMLSelectElement | null;
    // Other elements
    dateFilterContainer: HTMLElement | null;
    toastContainer: HTMLElement | null;
    // Element collections
    filterBtns: NodeListOf<Element> | null;
    /**
     * Index signature for dynamic access.
     * Note: Prefer using direct property access when possible for better type safety.
     * Example: state.elements.userDisplay (typed) vs state.elements['userDisplay'] (less safe)
     */
    [key: string]: HTMLElement | HTMLInputElement | HTMLSelectElement | NodeListOf<Element> | null;
}

/**
 * Type-safe element accessor that validates the element exists
 * Use this instead of direct bracket access for type safety
 * @param cache - The element cache
 * @param key - The element key
 * @returns The element or null if not found
 */
export function getCachedElement<K extends keyof ElementCache>(
    cache: Partial<ElementCache>,
    key: K
): ElementCache[K] {
    return cache[key] ?? null;
}

/**
 * Converts kebab-case string to camelCase
 * @example 'setup-modal' → 'setupModal'
 */
const toCamelCase = (str: string): string =>
    str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

/**
 * Element ID definitions organized by type
 * Grouped for easier maintenance
 */
const ELEMENT_IDS = {
    // Modal elements
    elements: [
        'setup-modal',
        'add-problem-modal',
        'signin-modal',
        'signin-modal-content',
        'alert-modal',
        'confirm-modal',
        'solution-modal',
        'alert-message',
        'confirm-message',
        'alert-title',
        'confirm-title',
        'alert-ok-btn',
        'confirm-ok-btn',
        'confirm-cancel-btn',
        'solution-close-btn',
    ],
    // App structure
    elementsApp: [
        'app-wrapper',
        'loading-screen',
        'topic-list',
        'problems-container',
        'content-scroll',
        'empty-state',
        'current-view-title',
    ],
    // Auth elements
    elementsAuth: [
        'google-login-button',
        'modal-google-login-button',
        'setup-error',
        'signin-error',
        'user-display',
        'disconnect-btn',
    ],
    // Stats elements
    elementsStats: [
        'sidebar-total-stat',
        'sidebar-total-bar',
        'stat-total',
        'stat-solved',
        'progress-bar-solved',
        'stat-due',
        'stat-due-badge',
        'review-banner',
        'review-count-banner',
    ],
    // Navigation & controls
    elementsNav: [
        'mobile-menu-btn',
        'mobile-menu-btn-main',
        'open-add-modal-btn',
        'cancel-add-btn',
        'save-add-btn',
        'theme-toggle-btn',
        'scroll-to-top-btn',
        'sidebar-logo',
        'mobile-logo',
        'main-sidebar',
        'sidebar-resizer',
        'sidebar-backdrop',
        'date-filter-container',
        'toast-container',
    ],

    // Form inputs
    inputs: [
        'add-prob-name',
        'add-prob-url',
        'add-prob-category-new',
        'add-prob-pattern-new',
        'problem-search',
    ],

    // Select elements
    selects: ['add-prob-category', 'add-prob-pattern', 'review-date-filter'],
};

/**
 * Cached element collections
 */
const COLLECTIONS = {
    filterBtns: '.filter-btn',
};

/**
 * Cache all DOM elements and return the element cache object
 * @returns Object with cached elements keyed by camelCase IDs
 */
export const cacheElements = <T>(): T => {
    const elements = {} as Record<
        string,
        HTMLElement | HTMLInputElement | HTMLSelectElement | NodeListOf<Element> | null
    >;

    // Helper to cache elements by ID array
    const cacheByIds = (ids: string[], type?: 'input' | 'select') => {
        for (const id of ids) {
            const el = document.getElementById(id);
            elements[toCamelCase(id)] =
                type === 'input'
                    ? (el as HTMLInputElement | null)
                    : type === 'select'
                      ? (el as HTMLSelectElement | null)
                      : el;
        }
    };

    // Cache all element groups
    cacheByIds(ELEMENT_IDS.elements);
    cacheByIds(ELEMENT_IDS.elementsApp);
    cacheByIds(ELEMENT_IDS.elementsAuth);
    cacheByIds(ELEMENT_IDS.elementsStats);
    cacheByIds(ELEMENT_IDS.elementsNav);
    cacheByIds(ELEMENT_IDS.inputs, 'input');
    cacheByIds(ELEMENT_IDS.selects, 'select');

    // Cache filter buttons
    elements['filterBtns'] = document.querySelectorAll(COLLECTIONS.filterBtns);

    return elements as T;
};

/**
 * Get a single element by ID (convenience function)
 * @param id - The element ID (kebab-case or camelCase)
 * @returns The element or null if not found
 */
export const getElement = <T extends HTMLElement>(id: string): T | null => {
    const normalizedId = id.includes('-') ? id : id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    return document.getElementById(normalizedId) as T | null;
};

/**
 * Get multiple elements by selector
 * @param selector - CSS selector
 * @returns NodeList of matching elements
 */
export const getElements = (selector: string): NodeListOf<Element> => {
    return document.querySelectorAll(selector);
};
