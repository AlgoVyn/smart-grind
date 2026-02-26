// --- MAIN VIEW RENDERERS MODULE ---
// Main view rendering functions

import { Topic, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { getToday, shouldShowProblem } from '../utils';
// renderers import removed to break cycle
import { api } from '../api';
import { ICONS } from './icons';
import { htmlGenerators } from './html-generators';
import { problemCardRenderers } from './problem-cards';
import { AlgorithmCategory, AlgorithmDef } from '../data/algorithms-data';

export const mainViewRenderers = {
    // Helper to create an action button
    _createActionBtn: (icon: string, title: string, color: string, onClick: () => void) => {
        const btn = document.createElement('button');
        btn.className = `category-action-btn p-1 rounded hover:${color} text-theme-muted hover:text-${color.split('-')[1]}-400 transition-colors`;
        btn.title = title;
        btn.innerHTML = icon;
        btn.onclick = onClick;
        return btn;
    },

    // Helper to remove existing action button container
    _removeActionContainer: () => {
        const title = state.elements['currentViewTitle'] as HTMLElement | null;
        const container = title?.nextElementSibling;
        if (container?.classList.contains('category-action-container')) {
            container.remove();
        }
    },

    // Helper to set view title and action buttons
    _setViewTitle: (topicId: string) => {
        const title =
            topicId === 'all'
                ? 'All Problems'
                : data.topicsData.find((t: Topic) => t.id === topicId)?.title || 'Unknown Topic';

        const viewTitle = state.elements['currentViewTitle'] as HTMLElement | null;
        if (viewTitle) viewTitle.innerText = title;

        mainViewRenderers._removeActionContainer();

        const container = document.createElement('div');
        container.className = 'category-action-container ml-2 flex gap-1';

        if (topicId === 'all') {
            container.appendChild(
                mainViewRenderers._createActionBtn(ICONS.reset, 'Reset All', 'bg-blue-500/10', () =>
                    api.resetAll()
                )
            );
        } else {
            container.appendChild(
                mainViewRenderers._createActionBtn(
                    ICONS.reset,
                    'Reset Category',
                    'bg-blue-500/10',
                    () => api.resetCategory(topicId)
                )
            );
            container.appendChild(
                mainViewRenderers._createActionBtn(
                    ICONS.delete,
                    'Delete Category',
                    'bg-red-500/10',
                    () => api.deleteCategory(topicId)
                )
            );
        }

        viewTitle?.insertAdjacentElement('afterend', container);
    },

    // Render main problem view
    renderMainView: async (topicId: string) => {
        state.ui.activeTopicId = topicId || state.ui.activeTopicId;
        const container = state.elements['problemsContainer'] as HTMLElement | null;
        if (container) container.innerHTML = '';

        mainViewRenderers._setViewTitle(state.ui.activeTopicId);

        // Update date filter for review/solved modes
        const showDateFilter = ['review', 'solved'].includes(state.ui.currentFilter);
        const { ui } = await import('../ui/ui');
        ui.toggleDateFilterVisibility(showDateFilter);
        if (showDateFilter) ui.populateDateFilter();

        const today = getToday();
        const visibleCount = { count: 0 };

        const topics =
            state.ui.activeTopicId === 'all'
                ? data.topicsData
                : data.topicsData.filter((t: Topic) => t.id === state.ui.activeTopicId);

        topics.forEach((topic: Topic) => {
            const section = htmlGenerators.renderTopicSection(
                topic,
                state.ui.activeTopicId,
                today,
                visibleCount
            );
            if (section && container) container.appendChild(section);
        });

        // Show empty state only in review filter with no visible problems
        const showEmpty = visibleCount.count === 0 && state.ui.currentFilter === 'review';
        (state.elements['emptyState'] as HTMLElement | null)?.classList.toggle(
            'hidden',
            !showEmpty
        );

        import('../renderers').then(({ renderers }) => renderers.updateStats());
    },

    // Set algorithm view title
    _setAlgorithmViewTitle: (categoryId: string) => {
        const title =
            categoryId === 'all'
                ? 'All Algorithms'
                : data.algorithmsData.find((c: AlgorithmCategory) => c.id === categoryId)?.title ||
                  'Algorithms';

        const viewTitle = state.elements['currentViewTitle'] as HTMLElement | null;
        if (viewTitle) viewTitle.innerText = title;

        mainViewRenderers._removeActionContainer();

        const container = document.createElement('div');
        container.className = 'category-action-container ml-2 flex gap-1';

        const resetLabel = categoryId === 'all' ? 'Reset All Algorithms' : 'Reset Category';
        container.appendChild(
            mainViewRenderers._createActionBtn(ICONS.reset, resetLabel, 'bg-blue-500/10', () =>
                api.resetAlgorithmCategory(categoryId)
            )
        );

        if (categoryId !== 'all') {
            container.appendChild(
                mainViewRenderers._createActionBtn(
                    ICONS.delete,
                    'Delete Category',
                    'bg-red-500/10',
                    () => api.deleteAlgorithmCategory(categoryId)
                )
            );
        }

        viewTitle?.insertAdjacentElement('afterend', container);
    },

    // Convert algorithm definition to Problem object
    _algorithmToProblem: (algoDef: AlgorithmDef, categoryId: string): Problem => {
        return (
            state.problems.get(algoDef.id) || {
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
            }
        );
    },

    // Render algorithms view for a category (treating algorithms as problems)
    renderAlgorithmsView: async (categoryId: string) => {
        state.ui.activeAlgorithmCategoryId = categoryId;
        const container = state.elements['problemsContainer'] as HTMLElement | null;
        if (!container) return;

        container.innerHTML = '';
        mainViewRenderers._setAlgorithmViewTitle(categoryId);

        // Update date filter for review/solved modes
        const showDateFilter = ['review', 'solved'].includes(state.ui.currentFilter);
        const { ui } = await import('../ui/ui');
        ui.toggleDateFilterVisibility(showDateFilter);
        if (showDateFilter) ui.populateDateFilter();

        const today = getToday();
        const visibleCount = { count: 0 };

        const searchQuery =
            (state.elements['problemSearch'] as HTMLInputElement | null)?.value
                .toLowerCase()
                .trim() || '';
        const section = document.createElement('div');
        section.className = 'space-y-6';

        const renderAlgorithmCard = (algoDef: AlgorithmDef, catId: string, grid: HTMLElement) => {
            if (state.deletedProblemIds.has(algoDef.id)) return;

            const problem = mainViewRenderers._algorithmToProblem(algoDef, catId);
            if (!state.problems.has(algoDef.id)) state.problems.set(algoDef.id, problem);

            // Apply the same filtering logic as pattern problems
            if (!shouldShowProblem(problem, state.ui.currentFilter, searchQuery, today)) return;

            visibleCount.count++;
            grid.appendChild(problemCardRenderers.createProblemCard(problem));
        };

        if (categoryId === 'all') {
            data.algorithmsData.forEach((category: AlgorithmCategory) => {
                // First, determine which algorithms match all filters
                const matchingAlgorithms: AlgorithmDef[] = [];
                category.algorithms.forEach((algoDef) => {
                    if (state.deletedProblemIds.has(algoDef.id)) return;
                    const problem = mainViewRenderers._algorithmToProblem(algoDef, category.id);
                    if (!state.problems.has(algoDef.id)) state.problems.set(algoDef.id, problem);
                    if (shouldShowProblem(problem, state.ui.currentFilter, searchQuery, today)) {
                        matchingAlgorithms.push(algoDef);
                    }
                });

                // Only show category header if there are matching algorithms
                if (matchingAlgorithms.length === 0) return;

                const header = document.createElement('h3');
                header.className = 'text-xl font-bold text-theme-bold border-b border-theme pb-2';
                header.textContent = category.title;
                section.appendChild(header);

                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-1 gap-3';
                matchingAlgorithms.forEach((algo) => renderAlgorithmCard(algo, category.id, grid));
                section.appendChild(grid);
            });
        } else {
            const category = data.algorithmsData.find(
                (c: AlgorithmCategory) => c.id === categoryId
            );
            if (!category) return;

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 gap-3';
            category.algorithms.forEach((algo) => renderAlgorithmCard(algo, categoryId, grid));

            // Only append grid if there are matching algorithms
            if (grid.children.length > 0) {
                section.appendChild(grid);
            }
        }

        // Show empty state only in review filter with no visible problems
        const showEmpty = visibleCount.count === 0 && state.ui.currentFilter === 'review';
        (state.elements['emptyState'] as HTMLElement | null)?.classList.toggle(
            'hidden',
            !showEmpty
        );

        container.appendChild(section);
        import('../renderers').then(({ renderers }) => renderers.updateStats());
    },
};
