// --- COMBINED VIEW RENDERER ---
// Renders all content (problems, algorithms, SQL) in a single view

import { state } from '../state';
import { data } from '../data';
import { Topic } from '../types';
import { AlgorithmCategory } from '../data/algorithms-data';
import { SQLCategory } from '../data/sql-data';
import { getToday, shouldShowProblem, updateBreadcrumbs, generateBreadcrumbs } from '../utils';
import { htmlGenerators } from './html-generators';
import { sqlViewRenderers } from './sql-view';
import { mainViewRenderers } from './main-view';
import { ICONS } from './icons';
import { api } from '../api';

export const combinedViewRenderers = {
    // Render combined view with all content
    renderCombinedView: async () => {
        const container = document.getElementById('problems-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Remove any existing action buttons from previous views
        mainViewRenderers._removeActionContainer();

        // Update view title
        const viewTitle = document.getElementById('current-view-title');
        if (viewTitle) {
            viewTitle.textContent = 'All Content';
        }

        // Add reset button for All Content
        const actionContainer = document.createElement('div');
        actionContainer.className = 'category-action-container ml-2 flex gap-1';
        actionContainer.appendChild(
            mainViewRenderers._createActionBtn(
                ICONS.reset,
                'Reset All Content',
                'bg-blue-500/10',
                () => api.resetAll()
            )
        );
        viewTitle?.insertAdjacentElement('afterend', actionContainer);

        // Update date filter visibility and populate dropdown based on current filter mode
        const { ui } = await import('../ui/ui');
        ui.updateDateFilterForCurrentMode();

        // Hide breadcrumbs on dashboard/combined view
        updateBreadcrumbs(generateBreadcrumbs());

        const today = getToday();

        // ===========================================
        // SECTION 1: PATTERNS (Problems)
        // ===========================================
        const searchQuery =
            (state.elements?.['problemSearch'] as HTMLInputElement | null)?.value
                ?.toLowerCase()
                .trim() || '';

        // Collect all visible pattern topics first
        const patternsContent = document.createElement('div');
        patternsContent.className = 'mb-12';

        data.topicsData.forEach((topic: Topic) => {
            const visibleCount = { count: 0 };
            const topicEl = htmlGenerators.renderTopicSection(topic, 'all', today, visibleCount);
            if (topicEl) {
                patternsContent.appendChild(topicEl);
            }
        });

        // Only show Patterns section header if there's content
        if (patternsContent.children.length > 0) {
            const patternsSection = document.createElement('div');
            patternsSection.className = 'mb-12';

            const patternsHeader = document.createElement('h2');
            patternsHeader.className =
                'text-2xl font-bold text-theme-bold border-b-2 border-brand-500 pb-3 mb-6';
            patternsHeader.textContent = 'Patterns';
            patternsSection.appendChild(patternsHeader);

            // Move all children from patternsContent to patternsSection
            patternsSection.append(...patternsContent.children);

            container.appendChild(patternsSection);
        }

        // ===========================================
        // SECTION 2: ALGORITHMS
        // ===========================================
        // Collect all visible algorithm categories first
        const algorithmsContent = document.createElement('div');
        algorithmsContent.className = 'mb-12';

        data.algorithmsData.forEach((category: AlgorithmCategory) => {
            const categoryEl = combinedViewRenderers.renderAlgorithmCategory(
                category,
                searchQuery,
                today
            );
            if (categoryEl) {
                algorithmsContent.appendChild(categoryEl);
            }
        });

        // Only show Algorithms section header if there's content
        if (algorithmsContent.children.length > 0) {
            const algorithmsSection = document.createElement('div');
            algorithmsSection.className = 'mb-12';

            const algorithmsHeader = document.createElement('h2');
            algorithmsHeader.className =
                'text-2xl font-bold text-theme-bold border-b-2 border-blue-500 pb-3 mb-6';
            algorithmsHeader.textContent = 'Algorithms';
            algorithmsSection.appendChild(algorithmsHeader);

            // Move all children from algorithmsContent to algorithmsSection
            algorithmsSection.append(...algorithmsContent.children);

            container.appendChild(algorithmsSection);
        }

        // ===========================================
        // SECTION 3: SQL
        // ===========================================
        // Collect all visible SQL categories first
        const sqlContent = document.createElement('div');
        sqlContent.className = 'mb-12';

        data.sqlData.forEach((category: SQLCategory) => {
            const categoryEl = sqlViewRenderers.renderSQLCategoryViewForCombined(
                category,
                searchQuery,
                today
            );
            if (categoryEl) {
                sqlContent.appendChild(categoryEl);
            }
        });

        // Only show SQL section header if there's content
        if (sqlContent.children.length > 0) {
            const sqlSection = document.createElement('div');
            sqlSection.className = 'mb-12';

            const sqlHeader = document.createElement('h2');
            sqlHeader.className =
                'text-2xl font-bold text-theme-bold border-b-2 border-green-500 pb-3 mb-6';
            sqlHeader.textContent = 'SQL';
            sqlSection.appendChild(sqlHeader);

            // Move all children from sqlContent to sqlSection
            sqlSection.append(...sqlContent.children);

            container.appendChild(sqlSection);
        }

        // Show empty state if no content is visible
        if (container.children.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'text-center py-12 text-secondary';
            emptyState.innerHTML = `
                <div class="text-6xl mb-4">🔍</div>
                <p class="text-lg">No problems match your current filters.</p>
                <p class="text-sm mt-2">Try adjusting your search or filter criteria.</p>
            `;
            container.appendChild(emptyState);
        }
    },

    // Render algorithm category for combined view
    renderAlgorithmCategory: (
        category: AlgorithmCategory,
        searchQuery: string = '',
        today: string
    ): HTMLElement | null => {
        const currentFilter = state.ui?.currentFilter || 'all';
        // Collect visible algorithms first
        const visibleAlgorithms: Array<{ id: string; name: string; url: string }> = [];
        category.algorithms.forEach((algo: { id: string; name: string; url: string }) => {
            const problem = state.problems.get(algo.id);
            if (problem && shouldShowProblem(problem, currentFilter, searchQuery, today)) {
                visibleAlgorithms.push(algo);
            }
        });

        // Don't render category if no visible algorithms
        if (visibleAlgorithms.length === 0) return null;

        const section = document.createElement('div');
        section.className = 'mb-8';

        // Category header
        const categoryHeader = document.createElement('h3');
        categoryHeader.className =
            'text-xl font-bold text-theme-bold border-b border-theme pb-2 mb-4';
        categoryHeader.textContent = category.title;
        section.appendChild(categoryHeader);

        // Render algorithms
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 gap-3';

        visibleAlgorithms.forEach((algo) => {
            const problem = state.problems.get(algo.id);
            if (problem) {
                const { className, innerHTML } = htmlGenerators.generateProblemCardHTML(problem);
                const card = document.createElement('div');
                card.className = className;
                card.setAttribute('data-problem-id', problem.id);
                card.innerHTML = innerHTML;
                grid.appendChild(card);
            }
        });

        section.appendChild(grid);
        return section;
    },

    // DEPRECATED: Event delegation is now handled by bindProblemEvents() in ui-problems.ts.
    // This method is kept as a no-op for backward compatibility.
    attachEventListeners: () => {
        // No-op: All action button clicks are now handled via event delegation
        // on the problemsContainer element, which avoids duplicate listeners on re-render.
    },
};
