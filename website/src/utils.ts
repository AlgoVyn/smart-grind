// --- UTILITIES MODULE ---
// Helper functions and utilities

declare global {
    interface Window {
        VITE_BASE_URL?: string;
    }
}

import { Problem, Topic, ProblemDef } from './types';
import { state } from './state';
import { data } from './data';

export const utils = {
    // Date helpers
    getToday: (): string => {
        const today = new Date().toISOString().split('T')[0];
        return today ?? '2024-01-01'; // Default date if parsing fails
    },

    addDays: (date: string, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    },

    formatDate: (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
        }),

    // URL helpers
    getUrlParameter: (name: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    getBaseUrl: () => {
        return window.VITE_BASE_URL || '/smartgrind/';
    },

    updateUrlParameter: (name: string, value: string | null) => {
        if (name === 'category') {
            if (value && value !== 'all') {
                const newPath = `/smartgrind/c/${value}`;
                window.history.pushState({ path: newPath }, '', newPath);
            } else {
                const newPath = '/smartgrind';
                window.history.pushState({ path: newPath }, '', newPath);
            }
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            if (value) {
                urlParams.set(name, value);
            } else {
                urlParams.delete(name);
            }

            // Use history.pushState to update URL without page reload
            const newUrl =
                window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    },

    // Clipboard helper
    copyToClipboard: async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            utils.showToast('Prompt copied to clipboard', 'success');
        } catch (err) {
            console.error('Clipboard API failed, trying fallback: ', err);
            // Fallback for older browsers or when clipboard API fails
            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (success) {
                    utils.showToast('Prompt copied to clipboard', 'success');
                } else {
                    throw new Error('execCommand returned false');
                }
            } catch (fallbackErr) {
                console.error('Fallback copy failed: ', fallbackErr);
                utils.showToast('Failed to copy prompt', 'error');
            }
        }
    },

    // AI provider configurations
    _aiProviders: {
        chatgpt: {
            mobileIntent:
                'intent://chat.openai.com#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end',
            desktopUrl: 'https://chatgpt.com/?q=',
        },
        aistudio: {
            mobileIntent:
                'intent://aistudio.google.com#Intent;scheme=https;package=com.google.ai.apps.aistudio;S.browser_fallback_url=https%3A%2F%2Faistudio.google.com;end',
            desktopUrl: 'https://aistudio.google.com/prompts/new_chat?prompt=',
        },
        grok: {
            mobileIntent:
                'intent://grok.com#Intent;scheme=https;package=com.xai.grok;S.browser_fallback_url=https%3A%2F%2Fgrok.com;end',
            desktopUrl: 'https://grok.com/?q=',
        },
    },

    // Helper to build AI URL
    _buildAIUrl: (provider: 'chatgpt' | 'aistudio' | 'grok', encodedPrompt: string) => {
        const config = utils._aiProviders[provider];
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        if (isMobile) {
            const fallbackParam = encodeURIComponent(`${config.desktopUrl}${encodedPrompt}`);
            return config.mobileIntent.replace(
                /S\.browser_fallback_url=[^;]+/,
                `S.browser_fallback_url=${fallbackParam}`
            );
        } else {
            return config.desktopUrl + encodedPrompt;
        }
    },

    // AI helper
    askAI: async (problemName: string, provider: 'chatgpt' | 'aistudio' | 'grok') => {
        const aiPrompt = `Explain the solution for LeetCode problem: "${problemName}". Provide the detailed problem statement, examples, intuition, multiple approaches with code, and time/space complexity analysis. Include related problems, video tutorial links and followup questions with brief answers without code.`;
        const encodedPrompt = encodeURIComponent(aiPrompt);

        localStorage.setItem('preferred-ai', provider);
        state.ui.preferredAI = provider;

        const url = utils._buildAIUrl(provider, encodedPrompt);

        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.location.href = url;
        } else {
            window.open(url, '_blank');
        }
    },

    // Input sanitization utilities
    sanitizeInput: (input: string | null | undefined) => {
        if (!input) return '';

        // Trim whitespace
        let sanitized = input.trim();

        // Remove control characters and null bytes
        sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

        // Remove HTML tags and special characters that could be harmful
        sanitized = sanitized.replace(/<[^>]*>/g, ''); // Remove HTML tags
        sanitized = sanitized.replace(/["'\\]/g, ''); // Remove quotes and backslashes

        // Prevent script injection by removing script-related content
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/data:/gi, '');
        sanitized = sanitized.replace(/vbscript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');

        // Remove potential XSS vectors
        sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
        sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

        // Limit length to prevent excessively long inputs
        if (sanitized.length > 200) {
            sanitized = sanitized.substring(0, 200);
        }

        return sanitized;
    },

    sanitizeUrl: (url: string | null | undefined) => {
        if (!url) return '';

        let sanitized = url.trim();

        // Basic URL validation and sanitization
        try {
            // If it doesn't start with http:// or https://, prepend https://
            if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
                sanitized = 'https://' + sanitized;
            }

            // Create URL object to validate
            new URL(sanitized);

            // Remove any script-related content from URL
            sanitized = sanitized.replace(/javascript:/gi, '');
            sanitized = sanitized.replace(/data:/gi, '');
        } catch (e) {
            // If URL parsing fails, return empty string
            console.warn('Invalid URL:', e);
            return '';
        }

        // Limit URL length
        if (sanitized.length > 500) {
            sanitized = sanitized.substring(0, 500);
        }

        return sanitized;
    },

    // Toast notifications
    showToast: (msg: string, type = 'success') => {
        const el = document.createElement('div');
        el.className = `px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 animate-fade-in ${type === 'success' ? 'bg-brand-600' : 'bg-red-500'}`;
        // Use textContent instead of innerHTML to prevent XSS
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
    },

    // Scroll helpers
    scrollToTop: (smooth = false) => {
        const behavior = smooth ? 'smooth' : 'instant';
        const el = state.elements.contentScroll;
        if (el) {
            el.scrollTo({ top: 0, behavior: behavior });
        }

        // Fallback/Redundancy for mobile/main container
        window.scrollTo({ top: 0, behavior: behavior });
    },

    // Get next review date based on interval
    getNextReviewDate: (today: string, intervalIndex: number) => {
        const daysToAdd = data.SPACED_REPETITION_INTERVALS[intervalIndex] ?? 1;
        return utils.addDays(today, daysToAdd);
    },

    // Helper to get unique problem IDs for a topic
    getUniqueProblemIdsForTopic: (topicId: string) => {
        const ids = new Set<string>();
        if (topicId === 'all') {
            state.problems.forEach((_: Problem, id: string) => ids.add(id));
        } else {
            const topicObj = data.topicsData.find((t: Topic) => t.id === topicId);
            if (topicObj) {
                topicObj.patterns.forEach((pattern: { problems: (string | ProblemDef)[] }) =>
                    pattern.problems.forEach((pid: string | ProblemDef) => {
                        const id = typeof pid === 'string' ? pid : pid.id;
                        if (state.problems.has(id)) {
                            ids.add(id);
                        }
                    })
                );
            }
        }
        return ids;
    },

    // Problem filtering and stats
    getUniqueProblemsForTopic: (topicId: string) => {
        const today = utils.getToday();
        const uniqueIds = utils.getUniqueProblemIdsForTopic(topicId);
        let solved = 0;
        let due = 0;

        uniqueIds.forEach((id: string) => {
            const problem = state.problems.get(id);
            if (problem && problem.status === 'solved' && problem.nextReviewDate) {
                solved++;
                if (problem.nextReviewDate <= today) due++;
            }
        });

        return {
            total: uniqueIds.size,
            solved,
            due,
        };
    },

    shouldShowProblem: (problem: Problem, filter: string, searchQuery: string, today: string) => {
        // Apply filter
        const filterFunctions: { [key: string]: (_p: Problem, _t: string) => boolean } = {
            all: (_p: Problem, _t: string) => true,
            unsolved: (_p: Problem, _t: string) => _p.status === 'unsolved',
            solved: (_p: Problem, _t: string) => _p.status === 'solved',
            review: (_p: Problem, _t: string) =>
                _p.status === 'solved' && _p.nextReviewDate !== null && _p.nextReviewDate <= _t,
        };
        const passesFilter = filterFunctions[filter]
            ? filterFunctions[filter](problem, today)
            : false;

        if (!passesFilter) return false;

        // Apply date filter for review and solved modes
        if ((filter === 'review' || filter === 'solved') && state.ui.reviewDateFilter) {
            if (problem.nextReviewDate !== state.ui.reviewDateFilter) return false;
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = problem.name.toLowerCase().includes(query);
            const noteMatch = problem.note && problem.note.toLowerCase().includes(query);
            return nameMatch || noteMatch;
        }

        return true;
    },

    // Get available review dates from problems
    getAvailableReviewDates: (today: string, filter: string): string[] => {
        const dates = new Set<string>();
        state.problems.forEach((problem: Problem) => {
            if (problem.status === 'solved' && problem.nextReviewDate !== null) {
                // For review filter: only include due dates (today or earlier)
                // For solved filter: include all solved dates
                const isDue = problem.nextReviewDate <= today;
                if (filter === 'review') {
                    if (isDue) {
                        dates.add(problem.nextReviewDate);
                    }
                } else {
                    // For solved mode, include all dates
                    dates.add(problem.nextReviewDate);
                }
            }
        });
        // Sort dates ascending (oldest first)
        return Array.from(dates).sort();
    },
};
