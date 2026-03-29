// --- ELEMENT CACHING UTILITY ---
// Centralized DOM element caching for fast access throughout the app

/** Element cache type */
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
    // Index signature for dynamic access
    [key: string]: HTMLElement | HTMLInputElement | HTMLSelectElement | NodeListOf<Element> | null;
}

/** Converts kebab-case string to camelCase */
const toCamelCase = (str: string): string =>
    str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

/** All element IDs to cache */
const ELEMENT_IDS = [
    // Modal elements
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
    // App structure
    'app-wrapper',
    'loading-screen',
    'topic-list',
    'problems-container',
    'content-scroll',
    'empty-state',
    'current-view-title',
    // Auth elements
    'google-login-button',
    'modal-google-login-button',
    'setup-error',
    'signin-error',
    'user-display',
    'disconnect-btn',
    // Stats elements
    'sidebar-total-stat',
    'sidebar-total-bar',
    'stat-total',
    'stat-solved',
    'progress-bar-solved',
    'stat-due',
    'stat-due-badge',
    'review-banner',
    'review-count-banner',
    // Navigation & controls
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
    // Form inputs
    'add-prob-name',
    'add-prob-url',
    'add-prob-category-new',
    'add-prob-pattern-new',
    'problem-search',
    // Select elements
    'add-prob-category',
    'add-prob-pattern',
    'review-date-filter',
];

/** Cache all DOM elements and return the element cache object */
export const cacheElements = <T>(): T => {
    const elements = {} as Record<
        string,
        HTMLElement | HTMLInputElement | HTMLSelectElement | NodeListOf<Element> | null
    >;

    for (const id of ELEMENT_IDS) {
        elements[toCamelCase(id)] = document.getElementById(id);
    }

    elements['filterBtns'] = document.querySelectorAll('.filter-btn');

    return elements as T;
};

/** Get a single element by ID (kebab-case or camelCase) */
export const getElement = <T extends HTMLElement>(id: string): T | null => {
    const normalizedId = id.includes('-') ? id : id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    return document.getElementById(normalizedId) as T | null;
};

/** Get multiple elements by selector */
export const getElements = (selector: string): NodeListOf<Element> => {
    return document.querySelectorAll(selector);
};

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
