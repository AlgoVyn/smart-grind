// --- UTILITIES MODULE ---
// Consolidated utilities for the application

import { state } from './state';
import { data } from './data';
import type { Problem } from './types';

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
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

export const getNextReviewDate = (today: string, intervalIndex: number): string =>
    addDays(today, data.SPACED_REPETITION_INTERVALS[intervalIndex] ?? 1);

// ============================================================================
// URL UTILITIES
// ============================================================================

declare global {
    interface Window {
        VITE_BASE_URL?: string;
    }
}

export const getUrlParameter = (name: string): string | null =>
    new URLSearchParams(window.location.search).get(name);

export const getBaseUrl = (): string =>
    window.VITE_BASE_URL ||
    (window.location.pathname.startsWith('/smartgrind/') ? '/smartgrind/' : '/');

const PATH_PREFIXES: Record<string, string> = { category: 'c', algorithms: 'a', sql: 's' };

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

const DANGEROUS_PATTERNS = [
    /javascript:/gi,
    /data:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
];

export const sanitizeInput = (input: string | null | undefined): string => {
    if (input == null) return '';

    let sanitized = input
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/["'\\]/g, '');

    DANGEROUS_PATTERNS.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, '');
    });

    return sanitized.slice(0, 200);
};

export const sanitizeUrl = (url: string | null | undefined): string => {
    if (!url) return '';

    const sanitized = url.trim();
    const lower = sanitized.toLowerCase();

    if (['javascript:', 'data:', 'vbscript:'].some((p) => lower.includes(p))) return '';

    try {
        const withScheme = /^https?:\/\//i.test(lower) ? sanitized : 'https://' + sanitized;
        new URL(withScheme);
        return withScheme.slice(0, 500);
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
        return item && item !== '[object Object]' ? JSON.parse(item) : defaultValue;
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

const toKebab = (str: string): string => str.replace(/([A-Z])/g, '-$1').toLowerCase();

export const cacheElements = (): Partial<ElementCache> => {
    const elements: Partial<ElementCache> = {};
    ELEMENT_IDS.forEach((id) => {
        (elements as Record<string, HTMLElement | null>)[id as string] = document.getElementById(
            toKebab(id as string)
        );
    });
    (elements as Record<string, NodeListOf<Element> | null>)['filterBtns'] =
        document.querySelectorAll('.filter-btn');
    return elements;
};

export const getElement = <T extends HTMLElement>(id: string): T | null =>
    document.getElementById(id.includes('-') ? id : toKebab(id)) as T | null;

// ============================================================================
// COUNTING UTILITIES
// ============================================================================

export const countLines = (input: string | null | undefined): number =>
    input?.trimEnd() ? input.trimEnd().split('\n').length : 0;

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

const TOAST_BG: Record<string, string> = {
    success: 'bg-brand-600',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
};

export const showToast = (
    msg: string,
    type: 'success' | 'error' | 'warning' = 'success',
    duration: number = 3000
): void => {
    const toastContainer = state.elements?.toastContainer;
    if (!toastContainer) return;

    const el = document.createElement('div');
    el.className = `toast ${type} px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 animate-fade-in ${TOAST_BG[type] ?? TOAST_BG['success']}`;
    el.innerHTML = `<span>${escapeHtml(msg)}</span>`;

    toastContainer.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        setTimeout(() => el.remove(), 300);
    }, duration);
};

// ============================================================================
// SCROLL UTILITIES
// ============================================================================

export const scrollToTop = (smooth = false): void => {
    const behavior = smooth ? 'smooth' : 'instant';
    state.elements.contentScroll?.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
};

// ============================================================================
// PROBLEM UTILITIES
// ============================================================================

export const getUniqueProblemIdsForTopic = (topicId: string): Set<string> => {
    if (topicId === 'all') {
        return new Set(
            [...state.problems.entries()]
                .filter(([, p]) => p.pattern !== 'Algorithms' && !p.id.startsWith('sql-'))
                .map(([id]) => id)
        );
    }

    const topic = data.topicsData.find((t) => t.id === topicId);
    if (!topic) return new Set();

    return new Set(
        topic.patterns
            .flatMap((p) => p.problems.map((pid) => (typeof pid === 'string' ? pid : pid.id)))
            .filter((id) => state.problems.has(id))
    );
};

export const getUniqueProblemsForTopic = (
    topicId: string
): { total: number; solved: number; due: number } => {
    const ids = getUniqueProblemIdsForTopic(topicId);
    const today = getToday();
    let solved = 0,
        due = 0;

    for (const id of ids) {
        const p = state.problems.get(id);
        if (p?.status === 'solved' && p.nextReviewDate) {
            solved++;
            if (p.nextReviewDate <= today) due++;
        }
    }

    return { total: ids.size, solved, due };
};

export const shouldShowProblem = (
    problem: Problem,
    filter: string,
    searchQuery: string,
    today: string
): boolean => {
    if (filter === 'unsolved' && problem.status !== 'unsolved') return false;
    if (filter === 'solved' && problem.status !== 'solved') return false;
    if (
        filter === 'review' &&
        (problem.status !== 'solved' || !problem.nextReviewDate || problem.nextReviewDate > today)
    )
        return false;

    if (
        (filter === 'review' || filter === 'solved') &&
        state.ui.reviewDateFilter &&
        problem.nextReviewDate !== state.ui.reviewDateFilter
    )
        return false;

    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
        problem.name.toLowerCase().includes(query) ||
        (problem.note?.toLowerCase().includes(query) ?? false)
    );
};

export const getAvailableReviewDates = (today: string, filter: string): string[] => {
    const dates = new Set<string>();
    for (const p of state.problems.values()) {
        if (p.status === 'solved' && p.nextReviewDate != null) {
            if (filter !== 'review' || p.nextReviewDate <= today) {
                dates.add(p.nextReviewDate);
            }
        }
    }
    return [...dates].sort();
};

// ============================================================================
// AI UTILITIES
// ============================================================================

const AI_PROVIDERS = {
    chatgpt: {
        desktopUrl: 'https://chatgpt.com/?q=',
        mobileIntent:
            'intent://chat.openai.com#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end',
    },
    aistudio: {
        desktopUrl: 'https://aistudio.google.com/prompts/new_chat?prompt=',
        mobileIntent:
            'intent://aistudio.google.com#Intent;scheme=https;package=com.google.ai.apps.aistudio;S.browser_fallback_url=https%3A%2F%2Faistudio.google.com;end',
    },
    grok: {
        desktopUrl: 'https://grok.com/?q=',
        mobileIntent:
            'intent://grok.com#Intent;scheme=https;package=com.xai.grok;S.browser_fallback_url=https%3A%2F%2Fgrok.com;end',
    },
} as const;

type AIProvider = keyof typeof AI_PROVIDERS;

const isMobile = (): boolean =>
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const generatePrompt = (name: string, type: 'problem' | 'algorithm'): string =>
    type === 'algorithm'
        ? `Explain the "${name}" algorithm/technique. Provide a detailed explanation of the core concept, when to use it, step-by-step approach, template code in multiple languages, time/space complexity analysis, common variations, and 3-5 practice problems that use this technique with brief explanations of how to apply it. Include video tutorial links if available.`
        : `Explain the solution for LeetCode problem: "${name}". Provide the detailed problem statement, examples, intuition, multiple approaches with code, and time/space complexity analysis. Include related problems, video tutorial links and followup questions with brief answers without code.`;

export const askAI = async (
    name: string,
    provider: AIProvider,
    type: 'problem' | 'algorithm' = 'problem'
): Promise<void> => {
    const encodedPrompt = encodeURIComponent(generatePrompt(name, type));
    localStorage.setItem('preferred-ai', provider);
    state.ui.preferredAI = provider;

    const config = AI_PROVIDERS[provider];
    const fallbackUrl = `${config.desktopUrl}${encodedPrompt}`;
    const url = isMobile()
        ? config.mobileIntent.replace(
              /S\.browser_fallback_url=[^;]+/,
              `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`
          )
        : fallbackUrl;

    if (isMobile()) {
        window.location.href = url;
    } else {
        window.open(url, '_blank');
    }
};

// ============================================================================
// CLIPBOARD UTILITIES
// ============================================================================

export const copyToClipboard = async (text: string): Promise<void> => {
    const fallback = () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(
            success ? 'Copied to clipboard' : 'Failed to copy',
            success ? 'success' : 'error'
        );
    };

    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard', 'success');
            return;
        } catch {
            // Fall through to legacy
        }
    }
    fallback();
};
