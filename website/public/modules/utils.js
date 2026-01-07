// --- UTILITIES MODULE ---
// Helper functions and utilities

window.SmartGrind = window.SmartGrind || {};

window.SmartGrind.utils = {
    // Date helpers
    getToday: () => new Date().toISOString().split('T')[0],

    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    },

    formatDate: (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),

    // URL helpers
    getUrlParameter: (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    updateUrlParameter: (name, value) => {
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
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            window.SmartGrind.utils.showToast('Prompt copied to clipboard', 'success');
        } catch (err) {
            console.error('Clipboard API failed, trying fallback: ', err);
            // Fallback for older browsers or when clipboard API fails
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                window.SmartGrind.utils.showToast('Prompt copied to clipboard', 'success');
            } catch (fallbackErr) {
                console.error('Fallback copy failed: ', fallbackErr);
                window.SmartGrind.utils.showToast('Failed to copy prompt', 'error');
            }
        }
    },

    // AI helper
    askAI: async (problemName, provider) => {
        const aiPrompt = `Explain the solution for LeetCode problem: "${problemName}". Provide the intuition, optimal approach, and time/space complexity analysis.`;

        // Copy prompt to clipboard
        await window.SmartGrind.utils.copyToClipboard(aiPrompt);

        // Save preference
        localStorage.setItem('preferred-ai', provider);
        window.SmartGrind.state.ui.preferredAI = provider;

        // Open AI service - prefer app if installed on phone
        let url;
        if (provider === 'gemini') {
            // Android intent to open Gemini app, fallback to website
            url = 'intent://gemini.google.com/app#Intent;scheme=https;package=com.google.android.apps.ai;S.browser_fallback_url=https%3A%2F%2Fgemini.google.com%2Fapp;end';
        } else {
            // Android intent to open Grok app, fallback to website
            url = 'intent://grok.com#Intent;scheme=https;package=com.xai.grok;S.browser_fallback_url=https%3A%2F%2Fgrok.com;end';
        }

        // Use window.location.href to trigger app open or fallback
        window.location.href = url;
    },

    // Toast notifications
    showToast: (msg, type = 'success') => {
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
    getNextReviewDate: (today, intervalIndex) => {
        const daysToAdd = window.SmartGrind.data.SPACED_REPETITION_INTERVALS[intervalIndex];
        return window.SmartGrind.utils.addDays(today, daysToAdd);
    },

    // Helper to get unique problem IDs for a topic
    getUniqueProblemIdsForTopic: (topicId) => {
        const ids = new Set();
        if (topicId === 'all') {
            window.SmartGrind.state.problems.forEach((_, id) => ids.add(id));
        } else {
            const topicObj = window.SmartGrind.data.topicsData.find(t => t.id === topicId);
            if (topicObj) {
                topicObj.patterns.forEach(pattern =>
                    pattern.problems.forEach(pid => {
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
    getUniqueProblemsForTopic: (topicId) => {
        const today = window.SmartGrind.utils.getToday();
        const uniqueIds = window.SmartGrind.utils.getUniqueProblemIdsForTopic(topicId);
        let solved = 0;
        let due = 0;

        uniqueIds.forEach(id => {
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

    shouldShowProblem: (problem, filter, searchQuery, today) => {
        // Apply filter
        const filterFunctions = {
            'all': () => true,
            'unsolved': (p) => p.status === 'unsolved',
            'solved': (p) => p.status === 'solved',
            'review': (p, t) => p.status === 'solved' && p.nextReviewDate <= t
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