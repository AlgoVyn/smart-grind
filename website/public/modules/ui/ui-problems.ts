// --- PROBLEM-RELATED EVENTS ---

import { state } from '../state.js';
import { renderers } from '../renderers.js';
import { openPatternSolutionModal } from './ui-markdown.js';

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
            // Create a mock event object with the button that matches Event interface
            const mockEvent = {
                target: button,
                stopPropagation: () => {},
                preventDefault: () => {},
                bubbles: true,
                cancelBubble: false,
                cancelable: false,
                composed: false,
                currentTarget: button,
                defaultPrevented: false,
                eventPhase: 2,
                isTrusted: true,
                returnValue: true,
                timeStamp: Date.now(),
                type: 'click',
            } as unknown as Event;
            renderers.handleProblemCardClick(mockEvent, foundProblem);
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
