// --- COMBINED VIEW RENDERER ---
// Renders all content (problems, algorithms, SQL) in a single view

import { state } from '../state';
import { data } from '../data';
import { Topic } from '../types';
import { AlgorithmCategory } from '../data/algorithms-data';
import { SQLCategory } from '../data/sql-data';
import { getToday } from '../utils';
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

        const today = getToday();

        // ===========================================
        // SECTION 1: PATTERNS (Problems)
        // ===========================================
        const patternsSection = document.createElement('div');
        patternsSection.className = 'mb-12';

        const patternsHeader = document.createElement('h2');
        patternsHeader.className =
            'text-2xl font-bold text-theme-bold border-b-2 border-brand-500 pb-3 mb-6';
        patternsHeader.textContent = 'Patterns';
        patternsSection.appendChild(patternsHeader);

        // Render all pattern topics
        data.topicsData.forEach((topic: Topic) => {
            const visibleCount = { count: 0 };
            const topicEl = htmlGenerators.renderTopicSection(topic, 'all', today, visibleCount);
            if (topicEl) {
                patternsSection.appendChild(topicEl);
            }
        });

        container.appendChild(patternsSection);

        // ===========================================
        // SECTION 2: ALGORITHMS
        // ===========================================
        const algorithmsSection = document.createElement('div');
        algorithmsSection.className = 'mb-12';

        const algorithmsHeader = document.createElement('h2');
        algorithmsHeader.className =
            'text-2xl font-bold text-theme-bold border-b-2 border-blue-500 pb-3 mb-6';
        algorithmsHeader.textContent = 'Algorithms';
        algorithmsSection.appendChild(algorithmsHeader);

        // Render all algorithm categories
        data.algorithmsData.forEach((category: AlgorithmCategory) => {
            const categoryEl = combinedViewRenderers.renderAlgorithmCategory(category);
            algorithmsSection.appendChild(categoryEl);
        });

        container.appendChild(algorithmsSection);

        // ===========================================
        // SECTION 3: SQL
        // ===========================================
        const sqlSection = document.createElement('div');
        sqlSection.className = 'mb-12';

        const sqlHeader = document.createElement('h2');
        sqlHeader.className =
            'text-2xl font-bold text-theme-bold border-b-2 border-green-500 pb-3 mb-6';
        sqlHeader.textContent = 'SQL';
        sqlSection.appendChild(sqlHeader);

        // Render all SQL categories
        data.sqlData.forEach((category: SQLCategory) => {
            const categoryEl = sqlViewRenderers.renderSQLCategoryViewForCombined(category);
            sqlSection.appendChild(categoryEl);
        });

        container.appendChild(sqlSection);
    },

    // Render algorithm category for combined view
    renderAlgorithmCategory: (category: AlgorithmCategory): HTMLElement => {
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

        category.algorithms.forEach((algo: { id: string; name: string; url: string }) => {
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
