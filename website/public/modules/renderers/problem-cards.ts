// --- PROBLEM CARDS RENDERERS MODULE ---
// Problem card related rendering functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProblemCallback = (_problem: any) => void;

export const problemCardRenderers = {
    // Helper to re-render a problem card
    _reRenderCard: (button, p) => {
        const card = button.closest('.group');
        if (card) {
            const { className, innerHTML } = window.SmartGrind.renderers._generateProblemCardHTML(p);
            card.className = className;
            card.innerHTML = innerHTML;
        }
    },

    // Helper to perform async status change with loading and error handling
    _performStatusChange: async (button, _p, statusUpdater, options: { successMessage?: string; errorMessage?: string; onFinally?: ProblemCallback } = {}) => {
        const successMessage = options.successMessage;
        const errorMessage = options.errorMessage;
        const onFinally = options.onFinally;

        // Store original state for rollback on error
        const originalState = {
            status: _p.status,
            reviewInterval: _p.reviewInterval,
            nextReviewDate: _p.nextReviewDate,
            note: _p.note
        };

        // Apply status updates
        statusUpdater(_p);
        _p.loading = true;

        // Show loading state immediately
        window.SmartGrind.renderers._reRenderCard(button, _p);

        // Add delay for spinner visibility
        await new Promise(resolve => setTimeout(resolve, 400));

        try {
            await window.SmartGrind.api.saveProblem(_p);
            if (successMessage) {
                window.SmartGrind.utils.showToast(successMessage, 'success');
            }
        } catch (error) {
            // Revert to original state on error
            Object.assign(_p, originalState);
            const message = errorMessage || `Failed to update problem: ${error.message}`;
            window.SmartGrind.utils.showToast(message, 'error');
        } finally {
            _p.loading = false;
            // Custom finally behavior or default re-render
            if (onFinally) {
                onFinally(_p);
            } else {
                window.SmartGrind.renderers._reRenderAllCards(_p);
            }
        }
    },

    // Helper to re-render all instances of a problem card
    _reRenderAllCards: (p, hideIfDueFilter = false) => {
        const newCards = document.querySelectorAll(`[data-problem-id="${p.id}"]`);
        newCards.forEach(newCard => {
            const btn = newCard.querySelector('.action-btn[data-action]');
            if (btn) {
                if (hideIfDueFilter && window.SmartGrind.state.ui.currentFilter === 'review') {
                    window.SmartGrind.renderers._hideCardIfDueFilter(btn);
                } else {
                    window.SmartGrind.renderers._reRenderCard(btn, p);
                }
            }
        });
    },

    // Helper to handle problem status changes
    _handleStatusChange: async (button, p, newStatus, interval = 0, nextDate = null) => {
        await window.SmartGrind.renderers._performStatusChange(
            button,
            p,
            (problem) => {
                problem.status = newStatus;
                problem.reviewInterval = interval;
                problem.nextReviewDate = nextDate;
            }
        );
    },

    // Handle solve action
    _handleSolve: async (button, p) => {
        const today = window.SmartGrind.utils.getToday();
        await window.SmartGrind.renderers._handleStatusChange(button, p, 'solved', 0, window.SmartGrind.utils.getNextReviewDate(today, 0));
    },

    // Handle review action
    _handleReview: async (button, p) => {
        const today = window.SmartGrind.utils.getToday();
        const newInterval = (p.reviewInterval || 0) + 1;

        await window.SmartGrind.renderers._performStatusChange(
            button,
            p,
            (problem) => {
                problem.status = 'solved';
                problem.reviewInterval = newInterval;
                problem.nextReviewDate = window.SmartGrind.utils.getNextReviewDate(today, newInterval);
            },
            {
                onFinally: (problem) => {
                    // Special handling for review filter: hide cards when reviewed
                    if (window.SmartGrind.state.ui.currentFilter === 'review') {
                        window.SmartGrind.renderers._reRenderAllCards(problem, true);
                    } else {
                        window.SmartGrind.renderers._reRenderAllCards(problem);
                    }
                }
            }
        );
    },

    // Handle reset action
    _handleReset: async (button, p) => {
        await window.SmartGrind.renderers._handleStatusChange(button, p, 'unsolved', 0, null);
    },

    // Helper to hide card when due filter is active
    _hideCardIfDueFilter: (button) => {
        const card = button.closest('.group');
        if (!card) return;

        card.style.display = 'none';

        // Check if pattern section should be hidden
        const grid = card.parentElement;
        if (grid && grid.querySelectorAll('.group:not([style*="display: none"])').length === 0) {
            const patternSection = grid.parentElement;
            if (patternSection) {
                patternSection.style.display = 'none';

                // Check if topic section should be hidden
                const topicSection = patternSection.parentElement;
                if (topicSection && topicSection.querySelectorAll(':scope > div:not([style*="display: none"])').length === 0) {
                    topicSection.style.display = 'none';
                    const currentFilter = window.SmartGrind.state.ui.currentFilter;
                    const allProblemsContainer = document.getElementById('problems-container');
                    if (allProblemsContainer) {
                        const visibleProblems = allProblemsContainer.querySelectorAll('.group:not([style*="display: none"])');
                        if (currentFilter === 'review' && visibleProblems.length === 0) {
                            window.SmartGrind.state.elements.emptyState.classList.remove('hidden');
                        } else {
                            window.SmartGrind.state.elements.emptyState.classList.add('hidden');
                        }
                    }
                }
            }
        }

        window.SmartGrind.renderers.updateStats();
    },

    // Helper to handle status actions (solve, review, reset)
    _handleStatusAction: async (button, p, action) => {
        switch (action) {
        case 'solve':
            await window.SmartGrind.renderers._handleSolve(button, p);
            break;
        case 'review':
            await window.SmartGrind.renderers._handleReview(button, p);
            break;
        case 'reset':
            await window.SmartGrind.renderers._handleReset(button, p);
            break;
        }
    },

    // Helper to handle delete action
    _handleDeleteAction: async (button, p) => {
        const confirmed = await window.SmartGrind.ui.showConfirm(`Delete "<b>${p.name}</b>"?`);
        if (confirmed) {
            await window.SmartGrind.api.saveDeletedId(p.id);
        }
    },

    // Helper to handle note toggle
    _handleNoteToggle: (button, p) => {
        const noteArea = button.closest('.group').querySelector('.note-area');
        if (noteArea) {
            const isHidden = noteArea.classList.toggle('hidden');
            p.noteVisible = !isHidden;
        }
    },

    // Helper to handle note saving
    _handleNoteSave: async (button, p) => {
        const textarea = button.closest('.note-area').querySelector('textarea');
        if (!textarea) return;

        await window.SmartGrind.renderers._performStatusChange(
            button,
            p,
            (problem) => {
                problem.note = textarea.value.trim();
            }
        );
    },

    // Helper to handle AI assistant actions
    _handleAIActions: (button, p, action) => {
        const provider = action.split('-')[1];
        window.SmartGrind.utils.askAI(p.name, provider);
    },

    // Helper to handle solution actions
    _handleSolutionActions: (button, p, action) => {
        if (action === 'solution') {
            window.SmartGrind.ui.openSolutionModal(p.id);
        } else if (action === 'pattern-solution') {
            const patternName = button.dataset.pattern;
            if (patternName) {
                window.SmartGrind.ui.openPatternSolutionModal(patternName);
            }
        }
    },

    // Handle clicks on problem card buttons
    handleProblemCardClick: async (e, p) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        if (!action) return;

        // Group actions by type for cleaner handling
        if (['solve', 'review', 'reset'].includes(action)) {
            await window.SmartGrind.renderers._handleStatusAction(button, p, action);
        } else if (action === 'delete') {
            await window.SmartGrind.renderers._handleDeleteAction(button, p);
        } else if (action === 'note') {
            window.SmartGrind.renderers._handleNoteToggle(button, p);
        } else if (action === 'save-note') {
            await window.SmartGrind.renderers._handleNoteSave(button, p);
        } else if (['ask-chatgpt', 'ask-aistudio', 'ask-grok'].includes(action)) {
            window.SmartGrind.renderers._handleAIActions(button, p, action);
        } else if (['solution', 'pattern-solution'].includes(action)) {
            window.SmartGrind.renderers._handleSolutionActions(button, p, action);
        }
    },

    // Create a problem card element
    createProblemCard: (_p) => {
        const el = document.createElement('div');
        const { className, innerHTML } = window.SmartGrind.renderers._generateProblemCardHTML(_p);
        el.className = className;
        el.dataset.problemId = _p.id;
        el.innerHTML = innerHTML;

        return el;
    }
};