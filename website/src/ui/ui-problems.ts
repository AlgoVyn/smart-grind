// --- PROBLEM-RELATED EVENTS ---

import { state } from '../state';
import { renderers } from '../renderers';
import { openPatternSolutionModal } from './ui-markdown';

// Bind problem-related events
export const bindProblemEvents = () => {
    // Single event delegation handler for all problem container clicks
    state.elements['problemsContainer']?.addEventListener('click', (e: MouseEvent) => {
        // Check for pattern solution buttons first
        const patternSolutionButton = (e.target as Element).closest(
            'button[data-action="pattern-solution"]'
        ) as HTMLElement | null;
        if (patternSolutionButton) {
            const patternName = patternSolutionButton.dataset['pattern'];
            if (patternName) {
                openPatternSolutionModal(patternName);
            }
            return;
        }

        // Handle problem card buttons
        const button = (e.target as Element).closest('button[data-action]');
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
