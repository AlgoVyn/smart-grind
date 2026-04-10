// --- PROBLEM-RELATED EVENTS ---
// Uses event delegation on the problems container to handle all button clicks.
// This avoids duplicate event listeners that would accumulate on re-render.

import { state } from '../state';
import { renderers } from '../renderers';
import { openPatternSolutionModal, openProblemSQLSolutionModal } from './ui-markdown';

// Bind problem-related events using event delegation
export const bindProblemEvents = () => {
    const container = state.elements['problemsContainer'];
    if (!container) return;

    // Single delegated click handler for all problem card buttons
    container.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as Element;

        // Handle SQL pattern solution buttons
        const sqlSolutionButton = target.closest(
            'button[data-action="sql-solution"]'
        ) as HTMLElement | null;
        if (sqlSolutionButton) {
            const patternName = sqlSolutionButton.dataset['pattern'];
            if (patternName) {
                openProblemSQLSolutionModal(patternName);
            }
            return;
        }

        // Handle pattern solution buttons
        const patternSolutionButton = target.closest(
            'button[data-action="pattern-solution"]'
        ) as HTMLElement | null;
        if (patternSolutionButton) {
            const patternName = patternSolutionButton.dataset['pattern'];
            if (patternName) {
                openPatternSolutionModal(patternName);
            }
            return;
        }

        // Handle all other problem card action buttons (solve, review, reset, note, etc.)
        const button = target.closest('button[data-action]');
        if (!button) return;

        const card = button.closest('.group') as HTMLElement;
        if (!card) return;

        const problemId = card.dataset['problemId'];
        if (!problemId) return;

        const foundProblem = state.problems.get(problemId);
        if (foundProblem) {
            renderers.handleProblemCardClick(button as HTMLElement, foundProblem);
        }
    });
};
