// --- UTILITIES MODULE ---
// Barrel file: re-exports pure utilities from sub-modules and provides
// domain-specific helpers that depend on application state / data.
//
// CIRCULAR-DEPENDENCY FIX: state.ts no longer imports from this file.
// Instead, state.ts imports directly from utils/storage.ts and utils/dom.ts.

// Re-exports from sub-modules (backward compatible for all other importers)
export * from './utils/date';
export * from './utils/sanitization';
export * from './utils/storage';
export * from './utils/dom';

// Domain-specific imports
import { state } from './state';
import { data } from './data';
import type { Problem } from './types';
import { escapeHtml } from './utils/sanitization';
import { getToday, addDays } from './utils/date';

// ============================================================================
// DATE UTILITIES (domain-specific)
// ============================================================================

export const getNextReviewDate = (today: string, intervalIndex: number): string =>
    addDays(today, data.SPACED_REPETITION_INTERVALS[intervalIndex] ?? 1);

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
// URL UTILITIES (domain-specific parts)
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

// Route parsing for path-based routing: /smartgrind/{c|a|s}/{id}
// Returns { type: 'c'|'a'|'s', id: string } or null if not a category route
export const parseRoute = (path: string): { type: string; id: string } | null => {
    const pathMatch = path.match(/^\/smartgrind\/(c|a|s)\/([^/]+)$/);
    if (!pathMatch) return null;
    const type = pathMatch[1];
    const id = pathMatch[2];
    if (!type || !id) return null;
    return { type, id };
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

    // Apply date filter if set (regardless of current filter mode)
    if (state.ui.reviewDateFilter && problem.nextReviewDate !== state.ui.reviewDateFilter)
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

// ============================================================================
// BREADCRUMB UTILITIES
// ============================================================================

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export const updateBreadcrumbs = (items: BreadcrumbItem[]): void => {
    const breadcrumbNav = document.getElementById('breadcrumb-nav');
    const breadcrumbList = document.getElementById('breadcrumb-list');
    if (!breadcrumbNav || !breadcrumbList) return;

    // Breadcrumbs are hidden visually but JSON-LD structured data is kept for SEO
    breadcrumbNav.classList.add('hidden');
    if (items.length === 0) {
        return;
    }

    // Build breadcrumb HTML
    breadcrumbList.innerHTML = items
        .map((item, index) => {
            const isLast = index === items.length - 1;
            if (isLast) {
                return `<li class="text-theme-bold font-medium" aria-current="page">${_escapeBreadcrumbHtml(item.label)}</li>`;
            }
            return `<li><a href="${item.href || '#'}" class="hover:text-brand-400 transition-colors">${_escapeBreadcrumbHtml(item.label)}</a><span class="mx-1 text-theme-muted">/</span></li>`;
        })
        .join('');
};

// Generate breadcrumbs based on current route (path-based)
export const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const route = parseRoute(window.location.pathname);

    if (!route) {
        // Default/Dashboard view - no breadcrumbs needed
        return [];
    }

    const { type, id } = route;

    const typeLabels: Record<string, string> = {
        c: 'Patterns',
        a: 'Algorithms',
        s: 'SQL',
    };

    // Find the category name from data
    let categoryName = id.replace(/-/g, ' ');

    // Try to find in topics data for patterns (c)
    if (type === 'c') {
        const topic = data.topicsData.find((t) => t.id === id);
        if (topic) {
            categoryName = topic.title;
        }
    }
    // Try to find in algorithms data for algorithms (a)
    else if (type === 'a') {
        const algoCategory = data.algorithmsData.find((c) => c.id === id);
        if (algoCategory) {
            categoryName = algoCategory.title;
        }
    }
    // Try to find in SQL data for SQL (s)
    else if (type === 's') {
        const sqlCategory = data.sqlData.find((c) => c.id === id);
        if (sqlCategory) {
            categoryName = sqlCategory.title;
        }
    }

    return [
        { label: 'Home', href: '/smartgrind/' },
        { label: typeLabels[type] || 'Category' }, // No href - current page context
        { label: categoryName },
    ];
};

// Escape HTML for safe rendering
const _escapeBreadcrumbHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};
