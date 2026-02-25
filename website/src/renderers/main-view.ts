// --- MAIN VIEW RENDERERS MODULE ---
// Main view rendering functions

import { Topic, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { utils } from '../utils';
// renderers import removed to break cycle
import { api } from '../api';
import { ICONS } from './icons';
import { htmlGenerators } from './html-generators';
import { problemCardRenderers } from './problem-cards';
import { AlgorithmCategory, AlgorithmDef } from '../data/algorithms-data';

export const mainViewRenderers = {
    // Helper to create an action button
    _createActionButton: (icon: string, title: string, hoverColor: string, onClick: () => void) => {
        const button = document.createElement('button');
        button.className = `category-action-btn p-1 rounded hover:${hoverColor} text-theme-muted hover:text-${hoverColor.split('-')[1]}-400 transition-colors`;
        button.title = title;
        button.innerHTML = icon;
        button.onclick = onClick;
        return button;
    },

    // Helper to remove existing action button container
    _removeExistingActionContainer: () => {
        const currentViewTitle = state.elements['currentViewTitle'];
        if (currentViewTitle) {
            const existingContainer = currentViewTitle.nextElementSibling;
            if (existingContainer?.classList.contains('category-action-container')) {
                existingContainer.remove();
            }
        }
    },

    // Helper to set view title and action buttons
    _setViewTitle: (filterTopicId: string) => {
        const title =
            filterTopicId === 'all'
                ? 'All Problems'
                : data.topicsData.find((t: Topic) => t.id === filterTopicId)?.title ||
                  'Unknown Topic';
        const currentViewTitle = state.elements['currentViewTitle'];
        if (currentViewTitle) {
            currentViewTitle.innerText = title;
        }

        mainViewRenderers._removeExistingActionContainer();

        // Add action buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'category-action-container ml-2 flex gap-1';

        if (filterTopicId === 'all') {
            // Reset All button for "All Problems" view
            const resetAllBtn = mainViewRenderers._createActionButton(
                ICONS.reset,
                'Reset All Problems',
                'bg-blue-500/10',
                () => api.resetAll()
            );
            buttonContainer.appendChild(resetAllBtn);
        } else {
            // Reset and Delete buttons for specific topics
            const resetBtn = mainViewRenderers._createActionButton(
                ICONS.reset,
                'Reset Category Problems',
                'bg-blue-500/10',
                () => api.resetCategory(filterTopicId)
            );
            buttonContainer.appendChild(resetBtn);

            const deleteBtn = mainViewRenderers._createActionButton(
                ICONS.delete,
                'Delete Category',
                'bg-red-500/10',
                () => api.deleteCategory(filterTopicId)
            );
            buttonContainer.appendChild(deleteBtn);
        }

        if (currentViewTitle) {
            currentViewTitle.insertAdjacentElement('afterend', buttonContainer);
        }
    },

    // Render main problem view
    renderMainView: async (filterTopicId: string) => {
        state.ui.activeTopicId = filterTopicId || state.ui.activeTopicId;
        const container = state.elements['problemsContainer'];
        if (container) {
            container.innerHTML = '';
        }

        mainViewRenderers._setViewTitle(state.ui.activeTopicId);

        // Update date filter visibility and populate dates when in review or solved mode
        const showDateFilter =
            state.ui.currentFilter === 'review' || state.ui.currentFilter === 'solved';
        const { ui } = await import('../ui/ui');
        ui.toggleDateFilterVisibility(showDateFilter);
        if (showDateFilter) {
            ui.populateDateFilter();
        }

        const today = utils.getToday();
        const visibleCountRef = { count: 0 };

        const relevantTopics =
            state.ui.activeTopicId === 'all'
                ? data.topicsData
                : data.topicsData.filter((t: Topic) => t.id === state.ui.activeTopicId);

        relevantTopics.forEach((topic: Topic) => {
            const topicSection = htmlGenerators.renderTopicSection(
                topic,
                state.ui.activeTopicId,
                today,
                visibleCountRef
            );
            if (topicSection && container) {
                container.appendChild(topicSection);
            }
        });

        // Show empty state only when in review filter and no problems are visible
        const shouldShowEmptyState =
            visibleCountRef.count === 0 && state.ui.currentFilter === 'review';
        const emptyState = state.elements['emptyState'];
        if (emptyState) {
            emptyState.classList.toggle('hidden', !shouldShowEmptyState);
        }
        import('../renderers').then(({ renderers }) => renderers.updateStats());
    },

    // Set algorithm view title
    _setAlgorithmViewTitle: (categoryId: string) => {
        const title =
            categoryId === 'all'
                ? 'All Algorithms'
                : data.algorithmsData.find((c: AlgorithmCategory) => c.id === categoryId)?.title ||
                  'Algorithms';
        const currentViewTitle = state.elements['currentViewTitle'];
        if (currentViewTitle) {
            currentViewTitle.innerText = title;
        }

        mainViewRenderers._removeExistingActionContainer();

        // Add reset and delete buttons for algorithm categories
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'category-action-container ml-2 flex gap-1';

        const resetBtn = mainViewRenderers._createActionButton(
            ICONS.reset,
            categoryId === 'all' ? 'Reset All Algorithms' : 'Reset Category Algorithms',
            'bg-blue-500/10',
            () => api.resetAlgorithmCategory(categoryId)
        );
        buttonContainer.appendChild(resetBtn);

        // Only show delete button for specific categories (not for 'all')
        if (categoryId !== 'all') {
            const deleteBtn = mainViewRenderers._createActionButton(
                ICONS.delete,
                'Delete Algorithm Category',
                'bg-red-500/10',
                () => api.deleteAlgorithmCategory(categoryId)
            );
            buttonContainer.appendChild(deleteBtn);
        }

        if (currentViewTitle) {
            currentViewTitle.insertAdjacentElement('afterend', buttonContainer);
        }
    },

    // Convert algorithm definition to Problem object
    _algorithmToProblem: (algoDef: AlgorithmDef, categoryId: string): Problem => {
        // Algorithm IDs are already prefixed with 'algo-' in the data file
        const existingProblem = state.problems.get(algoDef.id);
        if (existingProblem) {
            return existingProblem;
        }
        // Create a new Problem object with default values
        return {
            id: algoDef.id,
            name: algoDef.name,
            url: algoDef.url,
            status: 'unsolved',
            topic: categoryId,
            pattern: 'Algorithms',
            reviewInterval: 0,
            nextReviewDate: null,
            note: '',
            loading: false,
            noteVisible: false,
        };
    },

    // Render algorithms view for a category (treating algorithms as problems)
    renderAlgorithmsView: async (categoryId: string) => {
        state.ui.activeAlgorithmCategoryId = categoryId;
        const container = state.elements['problemsContainer'];
        if (container) {
            container.innerHTML = '';
        }

        mainViewRenderers._setAlgorithmViewTitle(categoryId);

        // Hide date filter for algorithms view
        const { ui } = await import('../ui/ui');
        ui.toggleDateFilterVisibility(false);

        // Hide empty state
        const emptyState = state.elements['emptyState'];
        if (emptyState) {
            emptyState.classList.add('hidden');
        }

        if (!container) {
            return;
        }

        // Get search query
        const searchQuery =
            (state.elements['problemSearch'] as HTMLInputElement | null)?.value
                .toLowerCase()
                .trim() || '';

        // Create section for algorithms
        const section = document.createElement('div');
        section.className = 'space-y-6';

        // Handle "all" category - show all algorithms grouped by category
        if (categoryId === 'all') {
            data.algorithmsData.forEach((category: AlgorithmCategory) => {
                // Filter algorithms by search
                const filteredAlgorithms = category.algorithms.filter((algoDef: AlgorithmDef) => {
                    if (searchQuery) {
                        return algoDef.name.toLowerCase().includes(searchQuery);
                    }
                    return true;
                });

                if (filteredAlgorithms.length === 0) {
                    return; // Skip empty categories
                }

                // Create category header
                const categoryHeader = document.createElement('h3');
                categoryHeader.className =
                    'text-xl font-bold text-theme-bold border-b border-theme pb-2';
                categoryHeader.textContent = category.title;
                section.appendChild(categoryHeader);

                // Create grid for algorithm cards
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-1 gap-3';

                // Add algorithm cards (skip deleted ones)
                filteredAlgorithms.forEach((algoDef: AlgorithmDef) => {
                    // Skip if algorithm was deleted
                    if (state.deletedProblemIds.has(algoDef.id)) {
                        return;
                    }
                    const problem = mainViewRenderers._algorithmToProblem(algoDef, category.id);
                    if (!state.problems.has(algoDef.id)) {
                        state.problems.set(algoDef.id, problem);
                    }
                    const card = problemCardRenderers.createProblemCard(problem);
                    grid.appendChild(card);
                });

                section.appendChild(grid);
            });
        } else {
            // Single category view
            const category = data.algorithmsData.find(
                (c: AlgorithmCategory) => c.id === categoryId
            );
            if (!category) {
                return;
            }

            // Create grid for algorithm cards
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 gap-3';

            // Filter and add algorithm cards (treating them as problems)
            category.algorithms.forEach((algoDef: AlgorithmDef) => {
                // Skip if algorithm was deleted
                if (state.deletedProblemIds.has(algoDef.id)) {
                    return;
                }

                // Apply search filter
                if (searchQuery) {
                    const matchesSearch = algoDef.name.toLowerCase().includes(searchQuery);
                    if (!matchesSearch) {
                        return; // Skip this algorithm
                    }
                }

                // Convert algorithm to Problem and ensure it exists in state
                const problem = mainViewRenderers._algorithmToProblem(algoDef, categoryId);

                // Initialize in state if not already present
                if (!state.problems.has(algoDef.id)) {
                    state.problems.set(algoDef.id, problem);
                }

                // Use the standard problem card renderer
                const card = problemCardRenderers.createProblemCard(problem);
                grid.appendChild(card);
            });

            section.appendChild(grid);
        }

        container.appendChild(section);

        // Update stats
        import('../renderers').then(({ renderers }) => renderers.updateStats());
    },
};
