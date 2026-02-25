// --- PROBLEM CARDS RENDERERS MODULE ---
// Problem card related rendering functions

import { Problem } from '../types';
import { htmlGenerators } from './html-generators';
import { api } from '../api';
import { utils } from '../utils';
import { data } from '../data';
import { state } from '../state';

type ProblemCallback = (_problem: Problem) => void;

// Helper to re-render a problem card
const reRenderCard = (button: HTMLElement, p: Problem): void => {
    const card = button.closest('.group');
    if (card) {
        const { className, innerHTML } = htmlGenerators._generateProblemCardHTML(p);
        card.className = className;
        card.innerHTML = innerHTML;
    }
};

// Helper to re-render all instances of a problem card
const reRenderAllCards = (p: Problem, hideIfFilteredOut = false): void => {
    const newCards = document.querySelectorAll(`[data-problem-id="${p.id}"]`);
    newCards.forEach((newCard: Element) => {
        const btn = newCard.querySelector('.action-btn[data-action]');
        if (btn) {
            problemCardRenderers._reRenderCard(btn as HTMLElement, p);
            if (hideIfFilteredOut) {
                problemCardRenderers._hideCardIfFilteredOut(btn as HTMLElement);
            }
        }
    });
};

// Helper to hide card when it no longer matches current filters
const hideCardIfFilteredOut = (button: HTMLElement): void => {
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
                    const emptyState = state.elements['emptyState'];
                    if (emptyState) {
                        emptyState.classList.toggle('hidden', visibleProblems.length > 0);
                    }
                }
            }
        }
    }

    import('../renderers').then(({ renderers }) => renderers.updateStats());
};

// Helper to perform async status change with loading and error handling
const performStatusChange = async (
    button: HTMLElement,
    problem: Problem,
    statusUpdater: (_problem: Problem) => void,
    options: {
        successMessage?: string;
        errorMessage?: string;
        onFinally?: ProblemCallback;
    } = {}
): Promise<void> => {
    const { successMessage, errorMessage, onFinally } = options;

    // Store original state for rollback on error
    const originalState = {
        status: problem.status,
        reviewInterval: problem.reviewInterval,
        nextReviewDate: problem.nextReviewDate,
        note: problem.note,
    };

    // Apply status updates
    statusUpdater(problem);
    problem.loading = true;

    // Show loading state immediately
    problemCardRenderers._reRenderCard(button, problem);

    // Add short delay for spinner visibility
    await new Promise<void>((resolve) => setTimeout(resolve, 150));

    // Safety timeout: ensure spinner is cleared even if the async operation hangs
    const safetyTimeoutId = setTimeout(() => {
        if (problem.loading) {
            problem.loading = false;
            problemCardRenderers._reRenderAllCards(problem);
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

        if (problem.status !== originalState.status) {
            updates.status = problem.status;
        }
        if (problem.nextReviewDate !== originalState.nextReviewDate) {
            updates.nextReviewDate = problem.nextReviewDate;
        }
        if (problem.reviewInterval !== originalState.reviewInterval) {
            updates.reviewInterval = problem.reviewInterval;
        }
        if (problem.note !== originalState.note) {
            updates.note = problem.note;
        }

        await api.saveProblemWithSync(problem.id, updates);
        if (successMessage) {
            utils.showToast(successMessage, 'success');
        }
    } catch (error) {
        // Revert to original state on error
        Object.assign(problem, originalState);
        const errorMsg = error instanceof Error ? error.message : String(error);
        const message = errorMessage || `Failed to update problem: ${errorMsg}`;
        utils.showToast(message, 'error');
    } finally {
        clearTimeout(safetyTimeoutId);
        problem.loading = false;
        // Custom finally behavior or default re-render
        if (onFinally) {
            onFinally(problem);
        } else {
            problemCardRenderers._reRenderAllCards(problem);
        }
    }
};

// Handle solve action
const handleSolve = async (button: HTMLElement, p: Problem): Promise<void> => {
    const today = utils.getToday() || '2024-01-01';
    const nextReviewDate = utils.getNextReviewDate(today, 0) || null;

    await performStatusChange(button, p, (problem: Problem) => {
        problem.status = 'solved';
        problem.reviewInterval = 0;
        problem.nextReviewDate = nextReviewDate;
    });
};

// Handle review action
const handleReview = async (button: HTMLElement, p: Problem): Promise<void> => {
    const today = utils.getToday() || '2024-01-01';
    const newInterval = (p.reviewInterval || 0) + 1;

    await performStatusChange(
        button,
        p,
        (problem: Problem) => {
            problem.status = 'solved';
            problem.reviewInterval = newInterval;
            problem.nextReviewDate = utils.getNextReviewDate(today, newInterval) || null;
        },
        {
            onFinally: (problem: Problem) => {
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
};

// Handle reset action
const handleReset = async (button: HTMLElement, p: Problem): Promise<void> => {
    await performStatusChange(button, p, (problem: Problem) => {
        problem.status = 'unsolved';
        problem.reviewInterval = 0;
        problem.nextReviewDate = null;
    });
};

// Handle status action (solve, review, reset)
const handleStatusAction = async (
    button: HTMLElement,
    p: Problem,
    action: string
): Promise<void> => {
    const handlers: Record<string, () => Promise<void>> = {
        solve: () => problemCardRenderers._handleSolve(button, p),
        review: () => problemCardRenderers._handleReview(button, p),
        reset: () => problemCardRenderers._handleReset(button, p),
    };
    await handlers[action]?.();
};

// Handle delete action
const handleDeleteAction = async (p: Problem): Promise<void> => {
    const sanitizedName = utils.sanitizeInput(p.name);
    const { ui } = await import('../ui/ui');
    const confirmed = await ui.showConfirm(`Delete "<b>${sanitizedName}</b>"?`);
    if (confirmed) {
        await api.saveDeletedId(p.id);
    }
};

// Handle note toggle
const handleNoteToggle = (button: HTMLElement, p: Problem): void => {
    const noteArea = button.closest('.group')?.querySelector('.note-area') as HTMLElement;
    if (noteArea) {
        const isHidden = noteArea.classList.toggle('hidden');
        p.noteVisible = !isHidden;
    }
};

// Handle note saving
const handleNoteSave = async (button: HTMLElement, p: Problem): Promise<void> => {
    const textarea = button.closest('.note-area')?.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const newNote = utils.sanitizeInput(textarea.value.trim());

    await performStatusChange(button, p, (problem: Problem) => {
        problem.note = newNote;
        problem.noteVisible = false;
    });
};

// Handle AI assistant actions
const handleAIActions = (p: Problem, action: string): void => {
    const provider = (action.split('-')[1] || 'chatgpt') as 'chatgpt' | 'aistudio' | 'grok';
    const name = p.name || 'Unknown Problem';
    const isAlgorithm = data.algorithmsData.some((cat) =>
        cat.algorithms.some((algo) => algo.id === p.id)
    );
    utils.askAI(name, provider, isAlgorithm ? 'algorithm' : 'problem');
};

// Handle solution actions
const handleSolutionActions = async (
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
};

// Handle clicks on problem card buttons
const handleProblemCardClick = async (e: Event | HTMLElement, p: Problem): Promise<void> => {
    // Accept both Event objects and HTMLElement for flexibility
    const button =
        e instanceof HTMLElement ? e : ((e.target as HTMLElement).closest('button') as HTMLElement);
    if (!button) return;

    const action = button.dataset['action'];
    if (!action) return;

    // Get reference to the exported object for test spying
    const renderers = problemCardRenderers;

    // Use exported methods so tests can spy on them
    const actionHandlers: Record<string, () => void | Promise<void>> = {
        solve: () => renderers._handleSolve(button, p),
        review: () => renderers._handleReview(button, p),
        reset: () => renderers._handleReset(button, p),
        delete: () => renderers._handleDeleteAction(p),
        note: () => renderers._handleNoteToggle(button, p),
        'save-note': () => renderers._handleNoteSave(button, p),
        'ask-chatgpt': () => renderers._handleAIActions(p, 'ask-chatgpt'),
        'ask-aistudio': () => renderers._handleAIActions(p, 'ask-aistudio'),
        'ask-grok': () => renderers._handleAIActions(p, 'ask-grok'),
        solution: () => renderers._handleSolutionActions(button, p, 'solution'),
        'pattern-solution': () => renderers._handleSolutionActions(button, p, 'pattern-solution'),
    };

    await actionHandlers[action]?.();
};

// Create a problem card element
const createProblemCard = (_p: Problem): HTMLElement => {
    const el = document.createElement('div');
    const { className, innerHTML } = htmlGenerators._generateProblemCardHTML(_p);
    el.className = className;
    el.dataset['problemId'] = _p.id;
    el.innerHTML = innerHTML;

    return el;
};

// Export the problem card renderers
export const problemCardRenderers = {
    _reRenderCard: reRenderCard,
    _performStatusChange: performStatusChange,
    _reRenderAllCards: reRenderAllCards,
    _handleStatusChange: async (
        button: HTMLElement,
        p: Problem,
        newStatus: 'unsolved' | 'solved',
        interval = 0,
        nextDate: string | null = null
    ) => {
        await performStatusChange(button, p, (problem: Problem) => {
            problem.status = newStatus;
            problem.reviewInterval = interval;
            problem.nextReviewDate = nextDate;
        });
    },
    _handleSolve: handleSolve,
    _handleReview: handleReview,
    _handleReset: handleReset,
    _hideCardIfFilteredOut: hideCardIfFilteredOut,
    _handleStatusAction: handleStatusAction,
    _handleDeleteAction: handleDeleteAction,
    _handleNoteToggle: handleNoteToggle,
    _handleNoteSave: handleNoteSave,
    _handleAIActions: handleAIActions,
    _handleSolutionActions: handleSolutionActions,
    handleProblemCardClick,
    createProblemCard,
};
