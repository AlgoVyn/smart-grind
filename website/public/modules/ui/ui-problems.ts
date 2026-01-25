// --- PROBLEM-RELATED EVENTS ---

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.ui = window.SmartGrind.ui || {};

// Bind problem-related events
window.SmartGrind.ui.bindProblemEvents = () => {
    // Event delegation for problem card buttons
    window.SmartGrind.state.elements.problemsContainer?.addEventListener('click', (e: MouseEvent) => {
        const button = (e.target as Element).closest('button[data-action]');
        if (!button) return;

        const card = button.closest('.group') as HTMLElement;
        if (!card) return;

        const problemId = card.dataset['problemId'];
        if (!problemId) return;

        const foundProblem = window.SmartGrind.state.problems.get(problemId);

        if (foundProblem) {
            // Create a mock event object with the button
            const mockEvent = { target: button, stopPropagation: () => { } };
            window.SmartGrind.renderers.handleProblemCardClick(mockEvent, foundProblem);
        }
    });

    // Event delegation for pattern solution buttons (outside problem cards)
    window.SmartGrind.state.elements.problemsContainer?.addEventListener('click', (e: MouseEvent) => {
        const patternSolutionButton = (e.target as Element).closest('button[data-action="pattern-solution"]');
        if (!patternSolutionButton) return;

        const patternName = (patternSolutionButton as HTMLElement).dataset['pattern'];
        if (patternName) {
            window.SmartGrind.ui.openPatternSolutionModal(patternName);
        }
    });
};