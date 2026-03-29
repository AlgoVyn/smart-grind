// --- UTILITIES MODULE ---
// Consolidated utilities for the application
// Re-exports from utils-core.ts plus state-dependent utilities

import { state } from './state';
import { data } from './data';
import type { Problem } from './types';

// Re-export all core utilities
export {
    getToday,
    addDays,
    formatDate,
    getUrlParameter,
    getBaseUrl,
    updateUrlParameter,
    sanitizeInput,
    sanitizeUrl,
    escapeHtml,
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    getStringItem,
    setStringItem,
    cacheElements,
    getElement,
    countLines,
    type ElementCache,
} from './utils-core';

// ============================================================================
// DATE UTILITIES (with data dependency)
// ============================================================================

import { addDays } from './utils-core';

export const getNextReviewDate = (today: string, intervalIndex: number): string =>
    addDays(today, data.SPACED_REPETITION_INTERVALS[intervalIndex] ?? 1);

// ============================================================================
// TOAST NOTIFICATIONS (state-dependent)
// ============================================================================

export const showToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success'): void => {
    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-brand-600';
            case 'error':
                return 'bg-red-500';
            case 'warning':
                return 'bg-amber-500';
            default:
                return 'bg-brand-600';
        }
    };
    const el = document.createElement('div');
    el.className = `toast ${type} px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 animate-fade-in ${getBgColor()}`;
    const span = document.createElement('span');
    span.textContent = msg;
    el.appendChild(span);
    const toastContainer = state.elements.toastContainer;
    if (toastContainer) {
        toastContainer.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    }
};

// ============================================================================
// SCROLL UTILITIES (state-dependent)
// ============================================================================

export const scrollToTop = (smooth = false): void => {
    const behavior = smooth ? 'smooth' : 'instant';
    const el = state.elements.contentScroll;
    if (el && 'scrollTo' in el) {
        el.scrollTo({ top: 0, behavior: behavior });
    }
    window.scrollTo({ top: 0, behavior: behavior });
};

// ============================================================================
// PROBLEM UTILITIES (state-dependent)
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
    const today = new Date().toISOString().split('T')[0]!;
    let solved = 0;
    let due = 0;

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
    ) {
        return false;
    }

    if (
        (filter === 'review' || filter === 'solved') &&
        state.ui.reviewDateFilter &&
        problem.nextReviewDate !== state.ui.reviewDateFilter
    ) {
        return false;
    }

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
        if (p.status === 'solved' && p.nextReviewDate !== null) {
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

const isMobileDevice = (): boolean =>
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const generatePrompt = (name: string, type: 'problem' | 'algorithm'): string => {
    if (type === 'algorithm') {
        return `Explain the "${name}" algorithm/technique. Provide a detailed explanation of the core concept, when to use it, step-by-step approach, template code in multiple languages, time/space complexity analysis, common variations, and 3-5 practice problems that use this technique with brief explanations of how to apply it. Include video tutorial links if available.`;
    }
    return `Explain the solution for LeetCode problem: "${name}". Provide the detailed problem statement, examples, intuition, multiple approaches with code, and time/space complexity analysis. Include related problems, video tutorial links and followup questions with brief answers without code.`;
};

export const askAI = async (
    name: string,
    provider: AIProvider,
    type: 'problem' | 'algorithm' = 'problem'
): Promise<void> => {
    const isMobile = isMobileDevice();
    const aiPrompt = generatePrompt(name, type);
    const encodedPrompt = encodeURIComponent(aiPrompt);

    localStorage.setItem('preferred-ai', provider);
    state.ui.preferredAI = provider;

    const config = AI_PROVIDERS[provider];
    const fallbackUrl = `${config.desktopUrl}${encodedPrompt}`;

    const url = isMobile
        ? config.mobileIntent.replace(
              /S\.browser_fallback_url=[^;]+/,
              `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`
          )
        : fallbackUrl;

    if (isMobile) {
        window.location.href = url;
    } else {
        window.open(url, '_blank');
    }
};

// ============================================================================
// CLIPBOARD UTILITIES (with fallback for older browsers)
// ============================================================================

export const copyToClipboard = async (text: string): Promise<void> => {
    try {
        // Try modern Clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard', 'success');
            return;
        }
    } catch {
        // Fall through to legacy method
    }

    // Fallback for older browsers or non-secure contexts
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (success) {
            showToast('Copied to clipboard', 'success');
        } else {
            showToast('Failed to copy', 'error');
        }
    } catch {
        showToast('Failed to copy', 'error');
    }
};
