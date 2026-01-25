// --- PROBLEM CARDS RENDERERS MODULE ---
// Problem card related rendering functions

import { Problem } from '../types.js';

type ProblemCallback = (_problem: Problem) => void;

export const problemCardRenderers = {
    // Helper to re-render a problem card
    _reRenderCard: (button: HTMLElement, p: Problem): void => {
        const card = button.closest('.group');
        if (card) {
            const { className, innerHTML } = window.SmartGrind.renderers._generateProblemCardHTML(p);
            card.className = className;
            card.innerHTML = innerHTML;
        }
    },

    // Helper to perform async status change with loading and error handling
    _performStatusChange: async (button: HTMLElement, _p: Problem, statusUpdater: (_problem: Problem) => void, options: { successMessage?: string; errorMessage?: string; onFinally?: ProblemCallback } = {}): Promise<void> => {
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
        await new Promise<void>(resolve => setTimeout(resolve, 400));

        try {
            await window.SmartGrind.api.saveProblem(_p);
            if (successMessage) {
                window.SmartGrind.utils.showToast(successMessage, 'success');
            }
        } catch (error) {
            // Revert to original state on error
            Object.assign(_p, originalState);
            const errorMsg = error instanceof Error ? error.message : String(error);
            const message = errorMessage || `Failed to update problem: ${errorMsg}`;
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
    _reRenderAllCards: (p: Problem, hideIfDueFilter = false): void => {
        const newCards = document.querySelectorAll(`[data-problem-id="${p.id}"]`);
        newCards.forEach((newCard: Element) => {
            const btn = newCard.querySelector('.action-btn[data-action]');
            if (btn) {
                if (hideIfDueFilter && window.SmartGrind.state.ui.currentFilter === 'review') {
                    window.SmartGrind.renderers._hideCardIfDueFilter(btn as HTMLElement);
                } else {
                    window.SmartGrind.renderers._reRenderCard(btn as HTMLElement, p);
                }
            }
        });
    },

    // Helper to handle problem status changes
    _handleStatusChange: async (button: HTMLElement, p: Problem, newStatus: 'unsolved' | 'solved', interval = 0, nextDate: string | null = null): Promise<void> => {
        await window.SmartGrind.renderers._performStatusChange(
            button,
            p,
            (problem: Problem) => {
                problem.status = newStatus;
                problem.reviewInterval = interval;
                problem.nextReviewDate = nextDate;
            }
        );
    },

    // Handle solve action
    _handleSolve: async (button: HTMLElement, p: Problem): Promise<void> => {
        const today = window.SmartGrind.utils.getToday();
        await window.SmartGrind.renderers._handleStatusChange(button, p, 'solved', 0, window.SmartGrind.utils.getNextReviewDate(today, 0));
    },

    // Handle review action
    _handleReview: async (button: HTMLElement, p: Problem): Promise<void> => {
        const today = window.SmartGrind.utils.getToday();
        const newInterval = (p.reviewInterval || 0) + 1;

        await window.SmartGrind.renderers._performStatusChange(
            button,
            p,
            (problem: Problem) => {
                problem.status = 'solved';
                problem.reviewInterval = newInterval;
                problem.nextReviewDate = window.SmartGrind.utils.getNextReviewDate(today, newInterval);
            },
            {
                onFinally: (problem: Problem) => {
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
    _handleReset: async (button: HTMLElement, p: Problem): Promise<void> => {
        await window.SmartGrind.renderers._handleStatusChange(button, p, 'unsolved', 0, null);
    },

    // Helper to hide card when due filter is active
    _hideCardIfDueFilter: (button: HTMLElement): void => {
        const card = button.closest('.group') as HTMLElement;
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
    _handleStatusAction: async (button: HTMLElement, p: Problem, action: string): Promise<void> => {
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
    _handleDeleteAction: async (p: Problem): Promise<void> => {
        const confirmed = await window.SmartGrind.ui.showConfirm(`Delete "<b>${p.name}</b>"?`);
        if (confirmed) {
            await window.SmartGrind.api.saveDeletedId(p.id);
        }
    },

    // Helper to handle note toggle
    _handleNoteToggle: (button: HTMLElement, p: Problem): void => {
        const noteArea = button.closest('.group')?.querySelector('.note-area') as HTMLElement;
        if (noteArea) {
            const isHidden = noteArea.classList.toggle('hidden');
            p.noteVisible = !isHidden;
        }
    },

    // Helper to handle note saving
    _handleNoteSave: async (button: HTMLElement, p: Problem): Promise<void> => {
        const textarea = button.closest('.note-area')?.querySelector('textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        await window.SmartGrind.renderers._performStatusChange(
            button,
            p,
            (problem: Problem) => {
                problem.note = textarea.value.trim();
            }
        );
    },

    // Helper to handle AI assistant actions
    _handleAIActions: (p: Problem, action: string): void => {
        const provider = action.split('-')[1];
        window.SmartGrind.utils.askAI(p.name, provider);
    },

    // Helper to handle solution actions
    _handleSolutionActions: (button: HTMLElement, p: Problem, action: string): void => {
        if (action === 'solution') {
            window.SmartGrind.ui.openSolutionModal(p.id);
        } else if (action === 'pattern-solution') {
            const patternName = button.dataset['pattern'];
            if (patternName) {
                window.SmartGrind.ui.openPatternSolutionModal(patternName);
            }
        }
    },

    // Handle clicks on problem card buttons
    handleProblemCardClick: async (e: Event, p: Problem): Promise<void> => {
        const button = (e.target as HTMLElement).closest('button') as HTMLElement;
        if (!button) return;

        const action = button.dataset['action'];
        if (!action) return;

        // Group actions by type for cleaner handling
        if (['solve', 'review', 'reset'].includes(action)) {
            await window.SmartGrind.renderers._handleStatusAction(button, p, action);
        } else if (action === 'delete') {
            await window.SmartGrind.renderers._handleDeleteAction(p);
        } else if (action === 'note') {
            window.SmartGrind.renderers._handleNoteToggle(button, p);
        } else if (action === 'save-note') {
            await window.SmartGrind.renderers._handleNoteSave(button, p);
        } else if (['ask-chatgpt', 'ask-aistudio', 'ask-grok'].includes(action)) {
            window.SmartGrind.renderers._handleAIActions(p, action);
        } else if (['solution', 'pattern-solution'].includes(action)) {
            window.SmartGrind.renderers._handleSolutionActions(button, p, action);
        }
    },

    // Create a problem card element
    createProblemCard: (_p: Problem): HTMLElement => {
        const el = document.createElement('div');
        const { className, innerHTML } = window.SmartGrind.renderers._generateProblemCardHTML(_p);
        el.className = className;
        el.dataset['problemId'] = _p.id;
        el.innerHTML = innerHTML;

        return el;
    }
};