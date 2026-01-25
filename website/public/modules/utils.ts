// --- UTILITIES MODULE ---
// Helper functions and utilities

import { Problem, Topic, ProblemDef } from './types.js';

window.SmartGrind = window.SmartGrind || {};

window.SmartGrind.utils = {
    // Date helpers
    getToday: () => new Date().toISOString().split('T')[0],

    addDays: (date: string, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    },

    formatDate: (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),

    // URL helpers
    getUrlParameter: (name: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
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
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    },

    // Clipboard helper
    copyToClipboard: async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            window.SmartGrind.utils.showToast('Prompt copied to clipboard', 'success');
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
                    window.SmartGrind.utils.showToast('Prompt copied to clipboard', 'success');
                } else {
                    throw new Error('execCommand returned false');
                }
            } catch (fallbackErr) {
                console.error('Fallback copy failed: ', fallbackErr);
                window.SmartGrind.utils.showToast('Failed to copy prompt', 'error');
            }
        }
    },

    // AI provider configurations
    _aiProviders: {
        chatgpt: { 
            mobileIntent: 'intent://chat.openai.com#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end', 
            desktopUrl: 'https://chatgpt.com/?q=' 
        },
        aistudio: { 
            mobileIntent: 'intent://aistudio.google.com#Intent;scheme=https;package=com.google.ai.apps.aistudio;S.browser_fallback_url=https%3A%2F%2Faistudio.google.com;end', 
            desktopUrl: 'https://aistudio.google.com/prompts/new_chat?prompt=' 
        },
        grok: { 
            mobileIntent: 'intent://grok.com#Intent;scheme=https;package=com.xai.grok;S.browser_fallback_url=https%3A%2F%2Fgrok.com;end', 
            desktopUrl: 'https://grok.com/?q=' 
        }
    },

    // Helper to build AI URL
    _buildAIUrl: (provider: string, encodedPrompt: string) => {
        const config = window.SmartGrind.utils._aiProviders[provider];
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
            const fallbackParam = encodeURIComponent(`${config.desktopUrl}${encodedPrompt}`);
            return config.mobileIntent.replace(/S\.browser_fallback_url=[^;]+/, `S.browser_fallback_url=${fallbackParam}`);
        } else {
            return config.desktopUrl + encodedPrompt;
        }
    },

    // AI helper
    askAI: async (problemName: string, provider: string) => {
        const aiPrompt = `Explain the solution for LeetCode problem: "${problemName}". Provide the detailed problem statement, examples, intuition, multiple approaches with code, and time/space complexity analysis. Include related problems, video tutorial links and followup questions with brief answers without code.`;
        const encodedPrompt = encodeURIComponent(aiPrompt);

        localStorage.setItem('preferred-ai', provider);
        window.SmartGrind.state.ui.preferredAI = provider;

        const url = window.SmartGrind.utils._buildAIUrl(provider, encodedPrompt);

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
        el.innerHTML = `<span>${msg}</span>`;
        window.SmartGrind.state.elements.toastContainer.appendChild(el);
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            setTimeout(() => el.remove(), 300);
        }, 3000);
    },

    // Scroll helpers
    scrollToTop: (smooth = false) => {
        const behavior = smooth ? 'smooth' : 'instant';
        const el = window.SmartGrind.state.elements.contentScroll;
        if (el) {
            el.scrollTo({ top: 0, behavior: behavior });
        }

        // Fallback/Redundancy for mobile/main container
        window.scrollTo({ top: 0, behavior: behavior });
    },

    // Get next review date based on interval
    getNextReviewDate: (today: string, intervalIndex: number) => {
        const daysToAdd = window.SmartGrind.data.SPACED_REPETITION_INTERVALS[intervalIndex];
        return window.SmartGrind.utils.addDays(today, daysToAdd);
    },

    // Helper to get unique problem IDs for a topic
    getUniqueProblemIdsForTopic: (topicId: string) => {
        const ids = new Set();
        if (topicId === 'all') {
            window.SmartGrind.state.problems.forEach((_: Problem, id: string) => ids.add(id));
        } else {
            const topicObj = window.SmartGrind.data.topicsData.find((t: Topic) => t.id === topicId);
            if (topicObj) {
                topicObj.patterns.forEach((pattern: { problems: (string | ProblemDef)[] }) =>
                    pattern.problems.forEach((pid: string | ProblemDef) => {
                        const id = typeof pid === 'string' ? pid : pid.id;
                        if (window.SmartGrind.state.problems.has(id)) {
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
        const today = window.SmartGrind.utils.getToday();
        const uniqueIds = window.SmartGrind.utils.getUniqueProblemIdsForTopic(topicId);
        let solved = 0;
        let due = 0;

        uniqueIds.forEach((id: string) => {
            const problem = window.SmartGrind.state.problems.get(id);
            if (problem.status === 'solved') {
                solved++;
                if (problem.nextReviewDate <= today) due++;
            }
        });

        return {
            total: uniqueIds.size,
            solved,
            due
        };
    },

    shouldShowProblem: (problem: Problem, filter: string, searchQuery: string, today: string) => {
    // Apply filter
        const filterFunctions: { [key: string]: (p: Problem, t: string) => boolean } = {
            'all': (_p: Problem, _t: string) => true,
            'unsolved': (p: Problem, _t: string) => p.status === 'unsolved',
            'solved': (p: Problem, _t: string) => p.status === 'solved',
            'review': (p: Problem, t: string) => p.status === 'solved' && p.nextReviewDate !== null && p.nextReviewDate <= t
        };
        const passesFilter = filterFunctions[filter] ? filterFunctions[filter](problem, today) : false;

        if (!passesFilter) return false;

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = problem.name.toLowerCase().includes(query);
            const noteMatch = problem.note && problem.note.toLowerCase().includes(query);
            return nameMatch || noteMatch;
        }

        return true;
    }
};