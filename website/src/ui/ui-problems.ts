// --- PROBLEM-RELATED EVENTS ---

import { state } from '../state';
import { renderers } from '../renderers';
import { openPatternSolutionModal } from './ui-markdown';

// Bind problem-related events
export const bindProblemEvents = () => {
    // Event delegation for problem card buttons
    state.elements['problemsContainer']?.addEventListener('click', (e: MouseEvent) => {
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

    // Event delegation for pattern solution buttons (outside problem cards)
    state.elements['problemsContainer']?.addEventListener('click', (e: MouseEvent) => {
        const patternSolutionButton = (e.target as Element).closest(
            'button[data-action="pattern-solution"]'
        );
        if (!patternSolutionButton) return;

        const patternName = (patternSolutionButton as HTMLElement).dataset['pattern'];
        if (patternName) {
            openPatternSolutionModal(patternName);
        }
    });
};
