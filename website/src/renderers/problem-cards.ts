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
    // Support both real DOM and mock objects for testing
    const card = button.closest
        ? button.closest('.group')
        : (button as unknown as { parentElement: HTMLElement | null }).parentElement;
    if (!card) return;
    const { className, innerHTML } = htmlGenerators.generateProblemCardHTML(p);
    card.className = className;
    card.innerHTML = innerHTML;
};

// Helper to re-render all instances of a problem card
const reRenderAllCards = (p: Problem, hideIfFilteredOut = false): void => {
    document.querySelectorAll(`[data-problem-id="${p.id}"]`).forEach((card) => {
        const btn = card.querySelector('.action-btn[data-action]');
        if (!btn) return;
        problemCardRenderers.reRenderCard(btn as HTMLElement, p);
        if (hideIfFilteredOut) problemCardRenderers.hideCardIfFilteredOut(btn as HTMLElement);
    });
};

// Helper to hide card when it no longer matches current filters
const hideCardIfFilteredOut = (button: HTMLElement): void => {
    const card = button.closest('.group') as HTMLElement;
    if (!card) return;

    card.style.display = 'none';

    // Hide parent sections if empty
    const grid = card.parentElement;
    if (!grid || grid.querySelectorAll('.group:not([style*="display: none"])').length > 0) {
        import('../renderers').then(({ renderers }) => renderers.updateStats());
        return;
    }

    const patternSection = grid.parentElement;
    if (patternSection) {
        patternSection.style.display = 'none';
        const topicSection = patternSection.parentElement;
        if (
            topicSection?.querySelectorAll(':scope > div:not([style*="display: none"])').length ===
            0
        ) {
            topicSection.style.display = 'none';
            const container = document.getElementById('problems-container');
            const emptyState = state.elements['emptyState'] as HTMLElement | null;
            if (container && emptyState) {
                const visible = container.querySelectorAll('.group:not([style*="display: none"])');
                emptyState.classList.toggle('hidden', visible.length > 0);
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

    // Store original state for rollback
    const original = { ...problem };

    // Apply updates and show loading
    statusUpdater(problem);
    problem.loading = true;
    problemCardRenderers.reRenderCard(button, problem);

    // Spinner visibility delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Safety timeout to clear spinner
    const timeoutId = setTimeout(() => {
        if (problem.loading) {
            problem.loading = false;
            problemCardRenderers.reRenderAllCards(problem);
        }
    }, 3000);

    try {
        // Build updates object with only changed fields
        const updates = {
            ...(problem.status !== original.status && { status: problem.status }),
            ...(problem.nextReviewDate !== original.nextReviewDate && {
                nextReviewDate: problem.nextReviewDate,
            }),
            ...(problem.reviewInterval !== original.reviewInterval && {
                reviewInterval: problem.reviewInterval,
            }),
            ...(problem.note !== original.note && { note: problem.note }),
        };

        await api.saveProblemWithSync(problem.id, updates);
        if (successMessage) utils.showToast(successMessage, 'success');
    } catch (error) {
        Object.assign(problem, original);
        const msg = error instanceof Error ? error.message : String(error);
        utils.showToast(errorMessage || `Failed to update problem: ${msg}`, 'error');
    } finally {
        clearTimeout(timeoutId);
        problem.loading = false;
        if (onFinally) {
            onFinally(problem);
        } else {
            problemCardRenderers.reRenderAllCards(problem);
        }
    }
};

// Status change handlers
const handleSolve = async (button: HTMLElement, p: Problem): Promise<void> => {
    const today = utils.getToday() || '2024-01-01';
    await performStatusChange(button, p, (prob) => {
        prob.status = 'solved';
        prob.reviewInterval = 0;
        prob.nextReviewDate = utils.getNextReviewDate(today, 0) || null;
    });
};

const handleReview = async (button: HTMLElement, p: Problem): Promise<void> => {
    const today = utils.getToday() || '2024-01-01';
    const newInterval = (p.reviewInterval || 0) + 1;
    await performStatusChange(
        button,
        p,
        (prob) => {
            prob.status = 'solved';
            prob.reviewInterval = newInterval;
            prob.nextReviewDate = utils.getNextReviewDate(today, newInterval) || null;
        },
        {
            onFinally: (prob) => {
                const shouldHide = !utils.shouldShowProblem(
                    prob,
                    state.ui.currentFilter,
                    state.ui.searchQuery || '',
                    today
                );
                problemCardRenderers.reRenderAllCards(prob, shouldHide);
            },
        }
    );
};

const handleReset = async (button: HTMLElement, p: Problem): Promise<void> => {
    await performStatusChange(button, p, (prob) => {
        prob.status = 'unsolved';
        prob.reviewInterval = 0;
        prob.nextReviewDate = null;
    });
};

// Handle status action (solve, review, reset)
const handleStatusAction = async (
    button: HTMLElement,
    p: Problem,
    action: string
): Promise<void> => {
    const handlers: Record<string, () => Promise<void>> = {
        solve: () => problemCardRenderers.handleSolve(button, p),
        review: () => problemCardRenderers.handleReview(button, p),
        reset: () => problemCardRenderers.handleReset(button, p),
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
    const button =
        e instanceof HTMLElement ? e : ((e.target as HTMLElement).closest('button') as HTMLElement);
    if (!button) return;

    const action = button.dataset['action'];
    if (!action) return;

    // Use exported methods so tests can spy on them
    const renderers = problemCardRenderers;
    const handlers: Record<string, () => void | Promise<void>> = {
        solve: () => renderers.handleSolve(button, p),
        review: () => renderers.handleReview(button, p),
        reset: () => renderers.handleReset(button, p),
        delete: () => renderers.handleDeleteAction(p),
        note: () => renderers.handleNoteToggle(button, p),
        'save-note': () => renderers.handleNoteSave(button, p),
        'ask-chatgpt': () => renderers.handleAIActions(p, 'ask-chatgpt'),
        'ask-aistudio': () => renderers.handleAIActions(p, 'ask-aistudio'),
        'ask-grok': () => renderers.handleAIActions(p, 'ask-grok'),
        solution: () => renderers.handleSolutionActions(button, p, 'solution'),
        'pattern-solution': () => renderers.handleSolutionActions(button, p, 'pattern-solution'),
    };

    await handlers[action]?.();
};

// Create a problem card element
const createProblemCard = (_p: Problem): HTMLElement => {
    const el = document.createElement('div');
    const { className, innerHTML } = htmlGenerators.generateProblemCardHTML(_p);
    el.className = className;
    el.dataset['problemId'] = _p.id;
    el.innerHTML = innerHTML;

    return el;
};

// Export the problem card renderers
export const problemCardRenderers = {
    reRenderCard,
    performStatusChange,
    reRenderAllCards,
    handleStatusChange: async (
        button: HTMLElement,
        p: Problem,
        newStatus: 'unsolved' | 'solved',
        interval = 0,
        nextDate: string | null = null
    ) => {
        await performStatusChange(button, p, (prob) => {
            prob.status = newStatus;
            prob.reviewInterval = interval;
            prob.nextReviewDate = nextDate;
        });
    },
    handleSolve,
    handleReview,
    handleReset,
    hideCardIfFilteredOut,
    handleStatusAction,
    handleDeleteAction,
    handleNoteToggle,
    handleNoteSave,
    handleAIActions,
    handleSolutionActions,
    handleProblemCardClick,
    createProblemCard,
};
