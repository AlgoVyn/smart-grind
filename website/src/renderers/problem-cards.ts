// --- PROBLEM CARDS RENDERERS MODULE ---
// Problem card related rendering functions

import { Problem } from '../types';
import { htmlGenerators } from './html-generators';
import { api } from '../api';
import { utils } from '../utils';
import { data } from '../data';
// ui import removed to break cycle
import { state } from '../state';

type ProblemCallback = (_problem: Problem) => void;

export const problemCardRenderers = {
    // Helper to re-render a problem card
    _reRenderCard: (button: HTMLElement, p: Problem): void => {
        const card = button.closest('.group');
        if (card) {
            const { className, innerHTML } = htmlGenerators._generateProblemCardHTML(p);
            card.className = className;
            card.innerHTML = innerHTML;
        }
    },

    // Helper to perform async status change with loading and error handling
    _performStatusChange: async (
        button: HTMLElement,
        _p: Problem,
        statusUpdater: (_problem: Problem) => void,
        options: {
            successMessage?: string;
            errorMessage?: string;
            onFinally?: ProblemCallback;
        } = {}
    ): Promise<void> => {
        const successMessage = options.successMessage;
        const errorMessage = options.errorMessage;
        const onFinally = options.onFinally;

        // Store original state for rollback on error
        const originalState = {
            status: _p.status,
            reviewInterval: _p.reviewInterval,
            nextReviewDate: _p.nextReviewDate,
            note: _p.note,
        };

        // Apply status updates
        statusUpdater(_p);
        _p.loading = true;

        // Show loading state immediately
        problemCardRenderers._reRenderCard(button, _p);

        // Add short delay for spinner visibility (reduced from 400ms to 150ms)
        await new Promise<void>((resolve) => setTimeout(resolve, 150));

        // Safety timeout: ensure spinner is cleared even if the async operation hangs
        // Reduced from 10s to 3s since save is now non-blocking
        const safetyTimeoutId = setTimeout(() => {
            if (_p.loading) {
                _p.loading = false;
                problemCardRenderers._reRenderAllCards(_p);
            }
        }, 3000);

        try {
            // Prepare updates for sync-aware save
            const updates: Partial<{
                status: 'solved' | 'unsolved';
                nextReviewDate: string | null;
                reviewInterval: number;
                note: string;
            }> = {};

            if (_p.status !== originalState.status) {
                updates.status = _p.status;
            }
            if (_p.nextReviewDate !== originalState.nextReviewDate) {
                updates.nextReviewDate = _p.nextReviewDate;
            }
            if (_p.reviewInterval !== originalState.reviewInterval) {
                updates.reviewInterval = _p.reviewInterval;
            }
            if (_p.note !== originalState.note) {
                updates.note = _p.note;
            }

            await api.saveProblemWithSync(_p.id, updates);
            if (successMessage) {
                utils.showToast(successMessage, 'success');
            }
        } catch (error) {
            // Revert to original state on error
            Object.assign(_p, originalState);
            const errorMsg = error instanceof Error ? error.message : String(error);
            const message = errorMessage || `Failed to update problem: ${errorMsg}`;
            utils.showToast(message, 'error');
        } finally {
            clearTimeout(safetyTimeoutId);
            _p.loading = false;
            // Custom finally behavior or default re-render
            if (onFinally) {
                onFinally(_p);
            } else {
                problemCardRenderers._reRenderAllCards(_p);
            }
        }
    },

    // Helper to re-render all instances of a problem card
    _reRenderAllCards: (p: Problem, hideIfFilteredOut = false): void => {
        const newCards = document.querySelectorAll(`[data-problem-id="${p.id}"]`);
        newCards.forEach((newCard: Element) => {
            const btn = newCard.querySelector('.action-btn[data-action]');
            if (btn) {
                // Always re-render first to update loading state, then hide if needed
                problemCardRenderers._reRenderCard(btn as HTMLElement, p);
                if (hideIfFilteredOut) {
                    problemCardRenderers._hideCardIfFilteredOut(btn as HTMLElement);
                }
            }
        });
    },

    // Helper to handle problem status changes
    _handleStatusChange: async (
        button: HTMLElement,
        p: Problem,
        newStatus: 'unsolved' | 'solved',
        interval = 0,
        nextDate: string | null = null
    ): Promise<void> => {
        await problemCardRenderers._performStatusChange(button, p, (problem: Problem) => {
            problem.status = newStatus;
            problem.reviewInterval = interval;
            problem.nextReviewDate = nextDate;
        });
    },

    // Handle solve action
    _handleSolve: async (button: HTMLElement, p: Problem): Promise<void> => {
        const today = utils.getToday() || '2024-01-01'; // Default date if getToday() fails
        const nextReviewDate = utils.getNextReviewDate(today, 0) || null;
        await problemCardRenderers._handleStatusChange(button, p, 'solved', 0, nextReviewDate);
    },

    // Handle review action
    _handleReview: async (button: HTMLElement, p: Problem): Promise<void> => {
        const today = utils.getToday() || '2024-01-01'; // Default date if getToday() fails
        const newInterval = (p.reviewInterval || 0) + 1;

        await problemCardRenderers._performStatusChange(
            button,
            p,
            (problem: Problem) => {
                problem.status = 'solved';
                problem.reviewInterval = newInterval;
                problem.nextReviewDate = utils.getNextReviewDate(today, newInterval) || null;
            },
            {
                onFinally: (problem: Problem) => {
                    // Check if problem still matches current filters after review
                    // The shouldShowProblem function reads state.ui.reviewDateFilter directly
                    const shouldHide = !utils.shouldShowProblem(
                        problem,
                        state.ui.currentFilter,
                        state.ui.searchQuery || '',
                        today
                    );
                    problemCardRenderers._reRenderAllCards(problem, shouldHide);
                },
            }
        );
    },

    // Handle reset action
    _handleReset: async (button: HTMLElement, p: Problem): Promise<void> => {
        await problemCardRenderers._handleStatusChange(button, p, 'unsolved', 0, null);
    },

    // Helper to hide card when it no longer matches current filters
    _hideCardIfFilteredOut: (button: HTMLElement): void => {
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
                if (
                    topicSection &&
                    topicSection.querySelectorAll(':scope > div:not([style*="display: none"])')
                        .length === 0
                ) {
                    topicSection.style.display = 'none';
                    const allProblemsContainer = document.getElementById('problems-container');
                    if (allProblemsContainer) {
                        const visibleProblems = allProblemsContainer.querySelectorAll(
                            '.group:not([style*="display: none"])'
                        );
                        // Show empty state if no problems are visible
                        const emptyState = state.elements['emptyState'];
                        if (emptyState) {
                            emptyState.classList.toggle('hidden', visibleProblems.length > 0);
                        }
                    }
                }
            }
        }

        import('../renderers').then(({ renderers }) => renderers.updateStats());
    },

    // Helper to handle status actions (solve, review, reset)
    _handleStatusAction: async (button: HTMLElement, p: Problem, action: string): Promise<void> => {
        const handlers: Record<string, () => Promise<void>> = {
            solve: () => problemCardRenderers._handleSolve(button, p),
            review: () => problemCardRenderers._handleReview(button, p),
            reset: () => problemCardRenderers._handleReset(button, p),
        };
        await handlers[action]?.();
    },

    // Helper to handle delete action
    _handleDeleteAction: async (p: Problem): Promise<void> => {
        // Sanitize problem name before displaying in confirmation
        const sanitizedName = utils.sanitizeInput(p.name);
        const { ui } = await import('../ui/ui');
        const confirmed = await ui.showConfirm(`Delete "<b>${sanitizedName}</b>"?`);
        if (confirmed) {
            await api.saveDeletedId(p.id);
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
        const textarea = button
            .closest('.note-area')
            ?.querySelector('textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        const newNote = utils.sanitizeInput(textarea.value.trim());

        await problemCardRenderers._performStatusChange(button, p, (problem: Problem) => {
            // Sanitize note input before saving
            problem.note = newNote;
            // Close note area after saving
            problem.noteVisible = false;
        });
    },

    // Helper to handle AI assistant actions
    _handleAIActions: (p: Problem, action: string): void => {
        const provider = (action.split('-')[1] || 'chatgpt') as 'chatgpt' | 'aistudio' | 'grok';
        const name = p.name || 'Unknown Problem';
        // Check if this is an algorithm by looking up in algorithms data
        const isAlgorithm = data.algorithmsData.some((cat) =>
            cat.algorithms.some((algo) => algo.id === p.id)
        );
        utils.askAI(name, provider, isAlgorithm ? 'algorithm' : 'problem');
    },

    // Helper to handle solution actions
    _handleSolutionActions: async (
        button: HTMLElement,
        p: Problem,
        action: string
    ): Promise<void> => {
        const { ui } = await import('../ui/ui');
        if (action === 'solution') {
            ui.openSolutionModal(p.id);
        } else if (action === 'pattern-solution') {
            const patternName = button.dataset['pattern'];
            if (patternName) {
                ui.openPatternSolutionModal(patternName);
            }
        }
    },

    // Handle clicks on problem card buttons
    handleProblemCardClick: async (e: Event | HTMLElement, p: Problem): Promise<void> => {
        // Accept both Event objects and HTMLElement for flexibility
        const button =
            e instanceof HTMLElement
                ? e
                : ((e.target as HTMLElement).closest('button') as HTMLElement);
        if (!button) return;

        const action = button.dataset['action'];
        if (!action) return;

        // Action handlers mapping
        const actionHandlers: Record<string, () => void | Promise<void>> = {
            solve: () => problemCardRenderers._handleStatusAction(button, p, 'solve'),
            review: () => problemCardRenderers._handleStatusAction(button, p, 'review'),
            reset: () => problemCardRenderers._handleStatusAction(button, p, 'reset'),
            delete: () => problemCardRenderers._handleDeleteAction(p),
            note: () => problemCardRenderers._handleNoteToggle(button, p),
            'save-note': () => problemCardRenderers._handleNoteSave(button, p),
            'ask-chatgpt': () => problemCardRenderers._handleAIActions(p, 'ask-chatgpt'),
            'ask-aistudio': () => problemCardRenderers._handleAIActions(p, 'ask-aistudio'),
            'ask-grok': () => problemCardRenderers._handleAIActions(p, 'ask-grok'),
            solution: () => problemCardRenderers._handleSolutionActions(button, p, 'solution'),
            'pattern-solution': () =>
                problemCardRenderers._handleSolutionActions(button, p, 'pattern-solution'),
        };

        await actionHandlers[action]?.();
    },

    // Create a problem card element
    createProblemCard: (_p: Problem): HTMLElement => {
        const el = document.createElement('div');
        const { className, innerHTML } = htmlGenerators._generateProblemCardHTML(_p);
        el.className = className;
        el.dataset['problemId'] = _p.id;
        el.innerHTML = innerHTML;

        return el;
    },
};
