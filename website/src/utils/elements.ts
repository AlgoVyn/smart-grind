// --- ELEMENT CACHING UTILITY ---
// Centralized DOM element caching for fast access throughout the app

/**
 * Converts kebab-case string to camelCase
 * @example 'setup-modal' → 'setupModal'
 */
const toCamelCase = (str: string): string =>
    str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

/**
 * Element ID definitions organized by type
 */
const ELEMENT_IDS = {
    // Simple HTMLElement IDs
    elements: [
        'setup-modal',
        'add-problem-modal',
        'signin-modal',
        'signin-modal-content',
        'alert-modal',
        'confirm-modal',
        'alert-message',
        'confirm-message',
        'alert-title',
        'confirm-title',
        'alert-ok-btn',
        'confirm-ok-btn',
        'confirm-cancel-btn',
        'solution-modal',
        'solution-close-btn',
        'app-wrapper',
        'loading-screen',
        'topic-list',
        'problems-container',
        'content-scroll',
        'empty-state',
        'current-view-title',
        'google-login-button',
        'modal-google-login-button',
        'setup-error',
        'signin-error',
        'user-display',
        'disconnect-btn',
        'sidebar-total-stat',
        'sidebar-total-bar',
        'stat-total',
        'stat-solved',
        'progress-bar-solved',
        'stat-due',
        'stat-due-badge',
        'review-banner',
        'review-count-banner',
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

    // HTMLInputElement IDs
    inputs: [
        'add-prob-name',
        'add-prob-url',
        'add-prob-category-new',
        'add-prob-pattern-new',
        'problem-search',
    ],

    // HTMLSelectElement IDs
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

    // Cache simple HTMLElements
    for (const id of ELEMENT_IDS.elements) {
        elements[toCamelCase(id)] = document.getElementById(id);
    }

    // Cache input elements
    for (const id of ELEMENT_IDS.inputs) {
        elements[toCamelCase(id)] = document.getElementById(id) as HTMLInputElement | null;
    }

    // Cache select elements
    for (const id of ELEMENT_IDS.selects) {
        elements[toCamelCase(id)] = document.getElementById(id) as HTMLSelectElement | null;
    }

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
