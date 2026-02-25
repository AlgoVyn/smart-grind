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

    /**
     * Gets today's date in ISO format (YYYY-MM-DD).
     * Used for calculating review dates and filtering problems.
     * @returns {string} Today's date in YYYY-MM-DD format, or fallback date '2024-01-01' if parsing fails
     * @example
     * const today = utils.getToday(); // Returns "2024-01-15"
     */
    getToday: (): string => {
        const today = new Date().toISOString().split('T')[0];
        return today ?? '2024-01-01'; // Default date if parsing fails
    },

    /**
     * Adds a specified number of days to a given date.
     * Used for calculating next review dates in the spaced repetition system.
     * @param {string} date - The base date in ISO format (YYYY-MM-DD)
     * @param {number} days - Number of days to add (can be negative for subtraction)
     * @returns {string} The resulting date in YYYY-MM-DD format
     * @example
     * const nextReview = utils.addDays('2024-01-15', 7); // Returns "2024-01-22"
     */
    addDays: (date: string, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    },

    /**
     * Formats a date string into a human-readable format.
     * Displays month abbreviation and day number in UTC timezone.
     * @param {string} date - The date string to format (ISO format recommended)
     * @returns {string} Formatted date like "Jan 15"
     * @example
     * const formatted = utils.formatDate('2024-01-15'); // Returns "Jan 15"
     */
    formatDate: (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
        }),

    // URL helpers

    /**
     * Extracts a query parameter value from the current URL.
     * @param {string} name - The name of the URL parameter to retrieve
     * @returns {string | null} The parameter value, or null if not found
     * @example
     * // URL: ?token=abc123
     * const token = utils.getUrlParameter('token'); // Returns "abc123"
     */
    getUrlParameter: (name: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    /**
     * Gets the base URL for the application.
     * Uses the VITE_BASE_URL global variable or falls back to default.
     * @returns {string} The base URL path (e.g., '/smartgrind/')
     */
    getBaseUrl: () => {
        return window.VITE_BASE_URL || '/smartgrind/';
    },

    /**
     * Updates a URL parameter without triggering a page reload.
     * Uses History API to maintain clean URLs for categories and filters.
     * @param {string} name - The parameter name to update
     * @param {string | null} value - The new value, or null to remove the parameter
     * @returns {void}
     * @example
     * // Update category in URL
     * utils.updateUrlParameter('category', 'arrays');
     * // Result: URL changes to /smartgrind/c/arrays
     *
     * // Update algorithms in URL
     * utils.updateUrlParameter('algorithms', 'arrays-strings');
     * // Result: URL changes to /smartgrind/a/arrays-strings
     */
    updateUrlParameter: (name: string, value: string | null) => {
        // Handle SEO-friendly path-based URLs for category and algorithms
        const pathParams: Record<string, string> = { category: 'c', algorithms: 'a' };

        if (name in pathParams) {
            const prefix = pathParams[name];
            const newPath =
                value && value !== 'all' ? `/smartgrind/${prefix}/${value}` : '/smartgrind/';
            window.history.pushState({ path: newPath }, '', newPath);
        } else {
            // Handle query string parameters
            const urlParams = new URLSearchParams(window.location.search);
            if (value) {
                urlParams.set(name, value);
            } else {
                urlParams.delete(name);
            }
            const newUrl =
                window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    },

    // Clipboard helper

    /**
     * Copies text to the clipboard with fallback support for older browsers.
     * Shows a toast notification on success or failure.
     * @param {string} text - The text content to copy to clipboard
     * @returns {Promise<void>}
     * @example
     * await utils.copyToClipboard('Problem solution code here');
     * // Shows success toast if copied, error toast if failed
     */
    copyToClipboard: async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            utils.showToast('Prompt copied to clipboard', 'success');
        } catch (_err) {
            // Fallback for older browsers or when clipboard API fails
            try {
                const textArea = document.createElement('textarea');
                textArea.id = 'clipboard-fallback';
                textArea.name = 'clipboard-fallback';
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
            } catch (_fallbackErr) {
                utils.showToast('Failed to copy prompt', 'error');
            }
        }
    },

    // AI helper

    /**
     * Opens an AI assistant with a pre-filled prompt for a coding problem or algorithm.
     * Supports ChatGPT, Google AI Studio, and Grok with mobile app deep linking.
     * Saves the preferred AI provider to localStorage for future use.
     * @param {string} name - The name of the coding problem or algorithm to ask about
     * @param {'chatgpt' | 'aistudio' | 'grok'} provider - The AI service provider to use
     * @param {'problem' | 'algorithm'} type - Whether this is a problem or algorithm
     * @returns {Promise<void>}
     * @example
     * // Open ChatGPT with pre-filled prompt about Two Sum problem
     * await utils.askAI('Two Sum', 'chatgpt', 'problem');
     * // Open ChatGPT with pre-filled prompt about Two Pointers algorithm
     * await utils.askAI('Two Pointers', 'chatgpt', 'algorithm');
     */
    askAI: async (
        name: string,
        provider: 'chatgpt' | 'aistudio' | 'grok',
        type: 'problem' | 'algorithm' = 'problem'
    ) => {
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        // AI provider configurations
        const providers = {
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
        };

        // Different prompts for problems vs algorithms
        const aiPrompt =
            type === 'algorithm'
                ? `Explain the "${name}" algorithm/technique. Provide a detailed explanation of the core concept, when to use it, step-by-step approach, template code in multiple languages, time/space complexity analysis, common variations, and 3-5 practice problems that use this technique with brief explanations of how to apply it. Include video tutorial links if available.`
                : `Explain the solution for LeetCode problem: "${name}". Provide the detailed problem statement, examples, intuition, multiple approaches with code, and time/space complexity analysis. Include related problems, video tutorial links and followup questions with brief answers without code.`;
        const encodedPrompt = encodeURIComponent(aiPrompt);

        localStorage.setItem('preferred-ai', provider);
        state.ui.preferredAI = provider;

        const config = providers[provider];
        const url = isMobile
            ? config.mobileIntent.replace(
                  /S\.browser_fallback_url=[^;]+/,
                  `S.browser_fallback_url=${encodeURIComponent(`${config.desktopUrl}${encodedPrompt}`)}`
              )
            : config.desktopUrl + encodedPrompt;

        if (isMobile) {
            window.location.href = url;
        } else {
            window.open(url, '_blank');
        }
    },

    // Count lines in a string (for multiline note support)

    /**
     * Counts the number of lines in a string, excluding trailing empty lines.
     * Used for determining textarea height and validating note content.
     * @param {string | null | undefined} input - The string to count lines in
     * @returns {number} The number of non-empty lines (0 if input is null/undefined/empty)
     * @example
     * const lines = utils.countLines('Line 1\nLine 2\n'); // Returns 2
     * const empty = utils.countLines(null); // Returns 0
     */
    countLines: (input: string | null | undefined): number => {
        if (!input) return 0;
        // Trim trailing newlines to avoid counting empty trailing lines
        const trimmed = input.trimEnd();
        if (!trimmed) return 0;
        return trimmed.split('\n').length;
    },

    // Input sanitization utilities

    /**
     * Sanitizes user input to prevent XSS attacks and injection.
     * Removes HTML tags, control characters, script patterns, and limits length.
     * Preserves newlines for multiline text support.
     * @param {string | null | undefined} input - The raw user input to sanitize
     * @returns {string} Sanitized string safe for display and storage (max 200 chars)
     * @example
     * const safe = utils.sanitizeInput('<script>alert("xss")</script>Hello');
     * // Returns "Hello"
     */
    sanitizeInput: (input: string | null | undefined) => {
        if (!input) return '';

        // Normalize line endings, trim lines, remove control chars and HTML
        let sanitized = input
            .replace(/\r\n/g, '\n')
            .split('\n')
            .map((line) => line.trim())
            .join('\n')
            .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/["'\\]/g, '');

        // Remove dangerous patterns (URL schemes and event handlers)
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
    },

    /**
     * Sanitizes and validates a URL string.
     * Rejects dangerous schemes (javascript:, data:, vbscript:), validates format,
     * prepends https:// if missing, and limits length.
     * @param {string | null | undefined} url - The URL string to sanitize
     * @returns {string} Validated URL or empty string if invalid/dangerous
     * @example
     * const safeUrl = utils.sanitizeUrl('leetcode.com/problems/two-sum');
     * // Returns "https://leetcode.com/problems/two-sum"
     */
    sanitizeUrl: (url: string | null | undefined) => {
        if (!url) return '';

        const sanitized = url.trim();
        const lowerSanitized = sanitized.toLowerCase();

        // Reject dangerous URL schemes before processing
        if (
            lowerSanitized.includes('javascript:') ||
            lowerSanitized.includes('data:') ||
            lowerSanitized.includes('vbscript:')
        ) {
            return '';
        }

        // Prepend https:// if missing and validate
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
    },

    // Toast notifications

    /**
     * Displays a temporary toast notification message.
     * Automatically removes after 3 seconds with fade-out animation.
     * Uses textContent to prevent XSS vulnerabilities.
     * @param {string} msg - The message to display
     * @param {'success' | 'error'} [type='success'] - The notification type (affects styling)
     * @returns {void}
     * @example
     * utils.showToast('Problem saved successfully!', 'success');
     * utils.showToast('Failed to save', 'error');
     */
    showToast: (msg: string, type = 'success') => {
        const el = document.createElement('div');
        el.className = `toast ${type} px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 animate-fade-in ${type === 'success' ? 'bg-brand-600' : 'bg-red-500'}`;
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

    /**
     * Scrolls the main content area to the top.
     * Falls back to window scroll for mobile compatibility.
     * @param {boolean} [smooth=false] - Whether to use smooth scrolling animation
     * @returns {void}
     * @example
     * utils.scrollToTop(); // Instant scroll
     * utils.scrollToTop(true); // Smooth animated scroll
     */
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

    /**
     * Calculates the next review date based on the spaced repetition interval.
     * Uses the Leitner system intervals defined in data.SPACED_REPETITION_INTERVALS.
     * @param {string} today - The current date in YYYY-MM-DD format
     * @param {number} intervalIndex - Index into the intervals array (0-5)
     * @returns {string} The next review date in YYYY-MM-DD format
     * @example
     * // First review (1 day later)
     * const next = utils.getNextReviewDate('2024-01-15', 0); // Returns "2024-01-16"
     * // Final interval (60 days later)
     * const final = utils.getNextReviewDate('2024-01-15', 5); // Returns "2024-03-15"
     */
    getNextReviewDate: (today: string, intervalIndex: number) => {
        const daysToAdd = data.SPACED_REPETITION_INTERVALS[intervalIndex] ?? 1;
        return utils.addDays(today, daysToAdd);
    },

    // Helper to get unique problem IDs for a topic

    /**
     * Retrieves all unique problem IDs associated with a specific topic.
     * For 'all', returns all problem IDs in state (excluding algorithms).
     * For specific topics, filters to only problems defined in that topic's patterns.
     * @param {string} topicId - The topic identifier, or 'all' for all problems
     * @returns {Set<string>} Set of unique problem IDs
     * @example
     * const allIds = utils.getUniqueProblemIdsForTopic('all');
     * const arrayIds = utils.getUniqueProblemIdsForTopic('arrays');
     */
    getUniqueProblemIdsForTopic: (topicId: string) => {
        const ids = new Set<string>();
        if (topicId === 'all') {
            // For 'all', only include pattern problems (exclude algorithms)
            state.problems.forEach((problem: Problem, id: string) => {
                if (problem.pattern !== 'Algorithms') {
                    ids.add(id);
                }
            });
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

    /**
     * Calculates statistics for problems in a specific topic.
     * Returns total count, solved count, and due-for-review count.
     * @param {string} topicId - The topic identifier to calculate stats for
     * @returns {{total: number, solved: number, due: number}} Statistics object
     * @example
     * const stats = utils.getUniqueProblemsForTopic('arrays');
     * // Returns { total: 50, solved: 30, due: 5 }
     */
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

    /**
     * Retrieves all unique problem IDs including both pattern problems and algorithms.
     * Used for calculating total progress across all content.
     * @returns {Set<string>} Set of unique problem IDs including algorithms
     * @example
     * const allIds = utils.getAllUniqueProblemIdsIncludingAlgorithms();
     * // Returns Set of all problem and algorithm IDs
     */
    getAllUniqueProblemIdsIncludingAlgorithms: () => {
        const ids = new Set<string>();

        // Add all pattern problems
        state.problems.forEach((_problem: Problem, id: string) => {
            ids.add(id);
        });

        return ids;
    },

    /**
     * Calculates statistics for all problems including algorithms.
     * Returns total count, solved count, and due-for-review count across all content.
     * @returns {{total: number, solved: number, due: number}} Statistics object
     * @example
     * const stats = utils.getAllUniqueProblemsIncludingAlgorithms();
     * // Returns { total: 385, solved: 200, due: 10 } - includes both problems and algorithms
     */
    getAllUniqueProblemsIncludingAlgorithms: () => {
        const today = utils.getToday();
        const uniqueIds = utils.getAllUniqueProblemIdsIncludingAlgorithms();
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

    /**
     * Determines whether a problem should be displayed based on current filters.
     * Applies status filter, date filter (for review/solved modes), and search query.
     * @param {Problem} problem - The problem object to evaluate
     * @param {string} filter - The current filter mode ('all', 'unsolved', 'solved', 'review')
     * @param {string} searchQuery - The user's search query (case-insensitive)
     * @param {string} today - Today's date in YYYY-MM-DD format
     * @returns {boolean} True if the problem should be displayed
     */
    shouldShowProblem: (problem: Problem, filter: string, searchQuery: string, today: string) => {
        // Status filter check
        if (filter === 'unsolved' && problem.status !== 'unsolved') return false;
        if (filter === 'solved' && problem.status !== 'solved') return false;
        if (
            filter === 'review' &&
            (problem.status !== 'solved' ||
                !problem.nextReviewDate ||
                problem.nextReviewDate > today)
        ) {
            return false;
        }

        // Date filter for review/solved modes
        if (
            (filter === 'review' || filter === 'solved') &&
            state.ui.reviewDateFilter &&
            problem.nextReviewDate !== state.ui.reviewDateFilter
        ) {
            return false;
        }

        // Search query filter
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            problem.name.toLowerCase().includes(query) ||
            problem.note?.toLowerCase().includes(query) ||
            false
        );
    },

    // Get available review dates from problems

    /**
     * Extracts all unique review dates from solved problems for the date filter dropdown.
     * For 'review' filter: only includes dates that are due (today or earlier).
     * For 'solved' filter: includes all future review dates.
     * @param {string} today - Today's date in YYYY-MM-DD format
     * @param {string} filter - The current filter mode ('review' or 'solved')
     * @returns {string[]} Sorted array of unique dates (oldest first) in YYYY-MM-DD format
     * @example
     * const dates = utils.getAvailableReviewDates('2024-01-15', 'review');
     * // Returns ['2024-01-10', '2024-01-15'] - only due dates
     */
    getAvailableReviewDates: (today: string, filter: string): string[] => {
        const dates = new Set<string>();
        state.problems.forEach((problem: Problem) => {
            if (problem.status === 'solved' && problem.nextReviewDate !== null) {
                const isDue = problem.nextReviewDate <= today;
                // For review filter: only include due dates; for solved: include all
                if (filter !== 'review' || isDue) {
                    dates.add(problem.nextReviewDate);
                }
            }
        });
        return Array.from(dates).sort();
    },
};
