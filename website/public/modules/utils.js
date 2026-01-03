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

    // Problem ID helpers
    getCleanSlug: (id) => {
        const suffixes = [
            '-two-pointers', '-sliding-window', '-lists', '-heap', '-bs', '-dfs', '-bfs',
            '-dsu', '-scc', '-bridges', '-dp', '-greedy', '-cyclic', '-bit', '-check',
            '-design', '-trie', '-monotonic', '-string', '-array', '-merge', '-impl',
            '-kmp', '-rep', '-tree', '-graph', '-topo', '-stack', '-matrix'
        ];

        return suffixes.reduce((slug, suffix) =>
            slug.endsWith(suffix) ? slug.substring(0, slug.length - suffix.length) : slug, id);
    },

    formatProblemName: (id) => {
        const slug = window.SmartGrind.utils.getCleanSlug(id);
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },

    // AI helper
    askAI: async (problemName, provider) => {
        const aiPrompt = `Explain the solution for LeetCode problem: "${problemName}". Provide the intuition, optimal approach, and time/space complexity analysis.`;

        // Copy prompt to clipboard
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(aiPrompt);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = aiPrompt;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            window.SmartGrind.utils.showToast('Prompt copied to clipboard', 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            window.SmartGrind.utils.showToast('Failed to copy prompt', 'error');
        }

        // Save preference
        localStorage.setItem('preferred-ai', provider);
        window.SmartGrind.state.ui.preferredAI = provider;

        // Open AI service
        const url = provider === 'gemini' ? 'https://gemini.google.com/app' : 'https://grok.com';
        window.open(url, '_blank');
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
        let passesFilter;
        switch (filter) {
            case 'all':
                passesFilter = true;
                break;
            case 'unsolved':
                passesFilter = problem.status === 'unsolved';
                break;
            case 'solved':
                passesFilter = problem.status === 'solved';
                break;
            case 'review':
                passesFilter = problem.status === 'solved' && problem.nextReviewDate <= today;
                break;
            default:
                passesFilter = false;
        }

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