// --- CORE UTILITIES MODULE ---
// Base utilities that don't depend on state module (prevents circular dependencies)

// ============================================================================
// DATE UTILITIES
// ============================================================================

export const getToday = (): string => new Date().toISOString().split('T')[0]!;

export const addDays = (date: string, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0]!;
};

export const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    });

// ============================================================================
// URL UTILITIES
// ============================================================================

declare global {
    interface Window {
        VITE_BASE_URL?: string;
    }
}

export const getUrlParameter = (name: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

export const getBaseUrl = (): string => window.VITE_BASE_URL || '/smartgrind/';

const PATH_PREFIXES: Record<string, string> = {
    category: 'c',
    algorithms: 'a',
    sql: 's',
};

export const updateUrlParameter = (name: string, value: string | null): void => {
    if (name in PATH_PREFIXES) {
        const prefix = PATH_PREFIXES[name];
        const newPath =
            value && value !== 'all' ? `/smartgrind/${prefix}/${value}` : '/smartgrind/';
        window.history.pushState({ path: newPath }, '', newPath);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (value) {
        urlParams.set(name, value);
    } else {
        urlParams.delete(name);
    }
    const newUrl =
        window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.pushState({ path: newUrl }, '', newUrl);
};

// ============================================================================
// SANITIZATION UTILITIES
// ============================================================================

export const sanitizeInput = (input: string | null | undefined): string => {
    if (input === null || input === undefined) return '';

    let sanitized = input
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/["'\\]/g, '');

    const dangerousPatterns = [
        /javascript:/gi,
        /data:/gi,
        /vbscript:/gi,
        /on\w+\s*=/gi,
        /<script[^>]*>.*?<\/script>/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
    ];
    dangerousPatterns.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, '');
    });

    return sanitized.substring(0, 200);
};

export const sanitizeUrl = (url: string | null | undefined): string => {
    if (!url) return '';

    const sanitized = url.trim();
    const lowerSanitized = sanitized.toLowerCase();

    if (
        lowerSanitized.includes('javascript:') ||
        lowerSanitized.includes('data:') ||
        lowerSanitized.includes('vbscript:')
    ) {
        return '';
    }

    try {
        const urlWithScheme =
            lowerSanitized.startsWith('http://') || lowerSanitized.startsWith('https://')
                ? sanitized
                : 'https://' + sanitized;
        new URL(urlWithScheme);
        return urlWithScheme.substring(0, 500);
    } catch {
        return '';
    }
};

export const escapeHtml = (str: string): string =>
    str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

export const safeGetItem = <T>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        // Handle corrupted data from improper localStorage writes
        if (item === '[object Object]') {
            return defaultValue;
        }
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
};

export const safeSetItem = (key: string, value: unknown): boolean => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
};

export const safeRemoveItem = (key: string): boolean => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
};

export const getStringItem = (key: string, defaultValue: string): string => {
    try {
        return localStorage.getItem(key) || defaultValue;
    } catch {
        return defaultValue;
    }
};

export const setStringItem = (key: string, value: string): boolean => {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
};

// ============================================================================
// ELEMENT CACHE TYPE & UTILITIES
// ============================================================================

// Type-safe element cache interface with all known element IDs
export interface ElementCache {
    setupModal: HTMLElement | null;
    addProblemModal: HTMLElement | null;
    signinModal: HTMLElement | null;
    signinModalContent: HTMLElement | null;
    alertModal: HTMLElement | null;
    confirmModal: HTMLElement | null;
    solutionModal: HTMLElement | null;
    alertMessage: HTMLElement | null;
    confirmMessage: HTMLElement | null;
    alertTitle: HTMLElement | null;
    confirmTitle: HTMLElement | null;
    alertOkBtn: HTMLElement | null;
    confirmOkBtn: HTMLElement | null;
    confirmCancelBtn: HTMLElement | null;
    solutionCloseBtn: HTMLElement | null;
    appWrapper: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    topicList: HTMLElement | null;
    problemsContainer: HTMLElement | null;
    contentScroll: HTMLElement | null;
    emptyState: HTMLElement | null;
    currentViewTitle: HTMLElement | null;
    googleLoginButton: HTMLElement | null;
    modalGoogleLoginButton: HTMLElement | null;
    setupError: HTMLElement | null;
    signinError: HTMLElement | null;
    userDisplay: HTMLElement | null;
    disconnectBtn: HTMLElement | null;
    sidebarTotalStat: HTMLElement | null;
    sidebarTotalBar: HTMLElement | null;
    statTotal: HTMLElement | null;
    statSolved: HTMLElement | null;
    progressBarSolved: HTMLElement | null;
    statDue: HTMLElement | null;
    statDueBadge: HTMLElement | null;
    reviewBanner: HTMLElement | null;
    reviewCountBanner: HTMLElement | null;
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
    dateFilterContainer: HTMLElement | null;
    toastContainer: HTMLElement | null;
    addProbName: HTMLInputElement | null;
    addProbUrl: HTMLInputElement | null;
    addProbCategoryNew: HTMLInputElement | null;
    addProbPatternNew: HTMLInputElement | null;
    problemSearch: HTMLInputElement | null;
    addProbCategory: HTMLSelectElement | null;
    addProbPattern: HTMLSelectElement | null;
    reviewDateFilter: HTMLSelectElement | null;
    filterBtns: NodeListOf<Element> | null;
    // Allow string index access for dynamic element lookups
    [key: string]: HTMLElement | HTMLInputElement | HTMLSelectElement | NodeListOf<Element> | null;
}

const ELEMENT_IDS: (keyof ElementCache)[] = [
    'setupModal',
    'addProblemModal',
    'signinModal',
    'signinModalContent',
    'alertModal',
    'confirmModal',
    'solutionModal',
    'alertMessage',
    'confirmMessage',
    'alertTitle',
    'confirmTitle',
    'alertOkBtn',
    'confirmOkBtn',
    'confirmCancelBtn',
    'solutionCloseBtn',
    'appWrapper',
    'loadingScreen',
    'topicList',
    'problemsContainer',
    'contentScroll',
    'emptyState',
    'currentViewTitle',
    'googleLoginButton',
    'modalGoogleLoginButton',
    'setupError',
    'signinError',
    'userDisplay',
    'disconnectBtn',
    'sidebarTotalStat',
    'sidebarTotalBar',
    'statTotal',
    'statSolved',
    'progressBarSolved',
    'statDue',
    'statDueBadge',
    'reviewBanner',
    'reviewCountBanner',
    'mobileMenuBtn',
    'mobileMenuBtnMain',
    'openAddModalBtn',
    'cancelAddBtn',
    'saveAddBtn',
    'themeToggleBtn',
    'scrollToTopBtn',
    'sidebarLogo',
    'mobileLogo',
    'mainSidebar',
    'sidebarResizer',
    'sidebarBackdrop',
    'dateFilterContainer',
    'toastContainer',
    'addProbName',
    'addProbUrl',
    'addProbCategoryNew',
    'addProbPatternNew',
    'problemSearch',
    'addProbCategory',
    'addProbPattern',
    'reviewDateFilter',
];

export const cacheElements = (): Partial<ElementCache> => {
    const elements: Partial<ElementCache> = {};
    for (const id of ELEMENT_IDS) {
        const kebabId = (id as string).replace(/([A-Z])/g, '-$1').toLowerCase();
        (elements as Record<string, HTMLElement | NodeListOf<Element> | null>)[id] =
            document.getElementById(kebabId);
    }
    (elements as Record<string, NodeListOf<Element> | null>)['filterBtns'] =
        document.querySelectorAll('.filter-btn');
    return elements;
};

export const getElement = <T extends HTMLElement>(id: string): T | null => {
    const normalizedId = id.includes('-') ? id : id.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    return document.getElementById(normalizedId) as T | null;
};

// ============================================================================
// COUNTING UTILITIES
// ============================================================================

export const countLines = (input: string | null | undefined): number => {
    if (!input) return 0;
    const trimmed = input.trimEnd();
    return trimmed ? trimmed.split('\n').length : 0;
};
