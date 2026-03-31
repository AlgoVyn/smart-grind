// --- SQL VIEW RENDERER ---
// Renders SQL problems view using the same design as patterns

import { SQLCategory, SQLTopic, SQLPattern, getSQLCategoryById } from '../data/sql-data';
import { state } from '../state';
import { Problem, ProblemDef } from '../types';
import { updateUrlParameter, scrollToTop } from '../utils';
import { sidebarRenderers } from './sidebar';
import { renderers } from '../renderers';
import { htmlGenerators } from './html-generators';
import { ICONS } from './icons';
import { openSQLSolutionModal, openProblemSQLSolutionModal } from '../ui/ui-markdown';

export const sqlViewRenderers = {
    // Initialize SQL problem data in state if not exists
    initializeSQLProblem: (
        problemDef: ProblemDef,
        topicName: string,
        patternName: string
    ): Problem => {
        let problem = state.problems.get(problemDef.id);
        if (!problem) {
            problem = {
                id: problemDef.id,
                name: problemDef.name,
                url: problemDef.url,
                status: 'unsolved',
                topic: topicName,
                pattern: patternName,
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };
            state.problems.set(problemDef.id, problem);
        }
        return problem;
    },

    // Main SQL view renderer
    renderSQLView: async (categoryId?: string) => {
        const container = document.getElementById('problems-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Update view title and add action buttons
        const viewTitle = document.getElementById('current-view-title');
        if (viewTitle) {
            if (categoryId && categoryId !== 'all') {
                const category = getSQLCategoryById(categoryId);
                viewTitle.textContent = category ? category.title : 'SQL';

                // Add action buttons for specific category
                sqlViewRenderers._addSQLCategoryActionButtons(categoryId);
            } else {
                viewTitle.textContent = 'All SQL Problems';

                // Remove any existing action buttons for 'all' view
                sqlViewRenderers._removeActionContainer();

                // Add reset button for All SQL
                const actionContainer = document.createElement('div');
                actionContainer.className = 'category-action-container ml-2 flex gap-1';
                actionContainer.appendChild(
                    sqlViewRenderers._createActionBtn(
                        ICONS.reset,
                        'Reset All SQL',
                        'bg-blue-500/10',
                        async () => {
                            const { api } = await import('../api');
                            api.resetSQLCategory('all');
                        }
                    )
                );
                viewTitle?.insertAdjacentElement('afterend', actionContainer);
            }
        }

        if (categoryId && categoryId !== 'all') {
            const category = getSQLCategoryById(categoryId);
            if (category) {
                await sqlViewRenderers.renderSQLCategoryView(container, category);
            }
        } else {
            await sqlViewRenderers.renderAllSQLView(container);
        }

        // Re-attach event listeners for the problem cards
        sqlViewRenderers.attachProblemCardListeners();
    },

    // Attach event listeners to problem cards and pattern buttons
    attachProblemCardListeners: () => {
        document.querySelectorAll('.action-btn[data-action]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget as HTMLElement;
                const action = button.dataset['action'];

                // Handle pattern-level actions (sql-solution)
                if (action === 'sql-solution') {
                    const patternName = button.dataset['pattern'];
                    if (patternName) {
                        openSQLSolutionModal(patternName);
                    }
                    return;
                }

                // Handle problem-level actions
                const problemId = button
                    .closest('[data-problem-id]')
                    ?.getAttribute('data-problem-id');
                if (!problemId) return;

                const problem = state.problems.get(problemId);
                if (!problem) return;

                if (action === 'toggle-solve') {
                    sqlViewRenderers.handleSolve(button, problem);
                } else if (action === 'toggle-note') {
                    sqlViewRenderers.handleToggleNote(button, problem);
                } else if (action === 'problem-solution') {
                    openProblemSQLSolutionModal(problem.name);
                }
            });
        });
    },

    // Handle solve toggle
    handleSolve: async (button: HTMLElement, problem: Problem) => {
        const { getToday, getNextReviewDate } = await import('../utils');
        const { api } = await import('../api');

        const today = getToday();
        const originalStatus = problem.status;
        const newStatus = originalStatus === 'solved' ? 'unsolved' : 'solved';

        // Optimistic update
        problem.status = newStatus;
        if (newStatus === 'solved') {
            problem.reviewInterval = 0;
            problem.nextReviewDate = getNextReviewDate(today, 0);
        } else {
            problem.nextReviewDate = null;
        }

        // Re-render the card
        const card = button.closest('.group') as HTMLElement;
        if (card) {
            const { className, innerHTML } = htmlGenerators.generateProblemCardHTML(problem);
            card.className = className;
            card.innerHTML = innerHTML;
        }

        // Save to storage
        await api.saveProblemWithSync(problem.id, {
            status: problem.status,
            reviewInterval: problem.reviewInterval,
            nextReviewDate: problem.nextReviewDate,
        });

        // Update sidebar stats
        renderers.updateStats();
        renderers.renderSidebar();
    },

    // Handle note toggle
    handleToggleNote: (button: HTMLElement, problem: Problem) => {
        problem.noteVisible = !problem.noteVisible;

        // Re-render the card
        const card = button.closest('.group') as HTMLElement;
        if (card) {
            const { className, innerHTML } = htmlGenerators.generateProblemCardHTML(problem);
            card.className = className;
            card.innerHTML = innerHTML;
        }

        // Re-attach listeners
        sqlViewRenderers.attachProblemCardListeners();
    },

    // Render specific SQL category view
    renderSQLCategoryView: async (container: HTMLElement, category: SQLCategory) => {
        // Render each topic
        category.topics.forEach((topic) => {
            const topicSection = sqlViewRenderers.renderSQLTopic(topic, category.title);
            container.appendChild(topicSection);
        });
    },

    // Render all SQL categories overview - follows "All Problems" design
    renderAllSQLView: async (container: HTMLElement) => {
        // Import data dynamically
        const { data } = await import('../data');

        // Render each category with its topics (similar to All Problems)
        data.sqlData.forEach((category) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'mb-10';

            // Category header - similar to topic header in All Problems
            const categoryHeader = document.createElement('h3');
            categoryHeader.className =
                'text-xl font-bold text-theme-bold border-b border-theme pb-2 mb-6';
            categoryHeader.textContent = category.title;
            categorySection.appendChild(categoryHeader);

            // Render all topics in this category
            category.topics.forEach((topic) => {
                const topicSection = sqlViewRenderers.renderSQLTopic(topic, category.title);
                categorySection.appendChild(topicSection);
            });

            container.appendChild(categorySection);
        });
    },

    // Render a SQL topic section - similar to pattern sections
    renderSQLTopic: (topic: SQLTopic, categoryTitle: string): HTMLElement => {
        const section = document.createElement('section');
        section.className = 'mb-8';

        // Topic header
        const topicHeader = document.createElement('div');
        topicHeader.className = 'mb-4';

        const topicTitle = document.createElement('h3');
        topicTitle.className = 'text-lg font-semibold text-theme-base';
        topicTitle.textContent = topic.name;
        topicHeader.appendChild(topicTitle);

        section.appendChild(topicHeader);

        // Render patterns
        topic.patterns.forEach((pattern) => {
            const patternSection = sqlViewRenderers.renderSQLPattern(
                pattern,
                topic.name,
                categoryTitle
            );
            section.appendChild(patternSection);
        });

        return section;
    },

    // Render a SQL pattern with its problems - using the same design as regular patterns
    renderSQLPattern: (
        pattern: SQLPattern,
        topicName: string,
        _categoryTitle: string
    ): HTMLElement => {
        const section = document.createElement('div');
        section.className = 'mb-6';

        // Pattern header - same style as regular patterns with solution button
        const patternHeader = document.createElement('div');
        patternHeader.className = 'flex items-center justify-between mb-3 mt-6';

        const patternTitle = document.createElement('h4');
        patternTitle.className = 'text-sm font-bold text-brand-400 uppercase tracking-wider';
        patternTitle.textContent = pattern.name;
        patternHeader.appendChild(patternTitle);

        // Add SQL solution button
        const patternSolutionButton = document.createElement('button');
        patternSolutionButton.className =
            'action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-blue-400 transition-colors inline-flex items-center justify-center';
        patternSolutionButton.dataset['action'] = 'sql-solution';
        patternSolutionButton.dataset['pattern'] = pattern.name;
        patternSolutionButton.title = 'View SQL Pattern Solution';
        patternSolutionButton.innerHTML = `
            <svg aria-hidden="true" fill="currentColor" class="w-4 h-4" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
            </svg>
        `;
        patternHeader.appendChild(patternSolutionButton);

        section.appendChild(patternHeader);

        // Problems grid - same as regular patterns
        const problemsGrid = document.createElement('div');
        problemsGrid.className = 'grid grid-cols-1 gap-3';

        pattern.problems.forEach((problemDef) => {
            // Initialize problem in state if not exists
            const problem = sqlViewRenderers.initializeSQLProblem(
                problemDef,
                topicName,
                pattern.name
            );

            // Use the same card generation as patterns
            const { className, innerHTML } = htmlGenerators.generateProblemCardHTML(problem);

            const card = document.createElement('div');
            card.className = className;
            card.setAttribute('data-problem-id', problem.id);
            card.innerHTML = innerHTML;

            problemsGrid.appendChild(card);
        });

        section.appendChild(problemsGrid);
        return section;
    },

    // Render SQL category for combined view (returns HTMLElement instead of appending to container)
    renderSQLCategoryViewForCombined: (category: SQLCategory): HTMLElement => {
        const section = document.createElement('div');
        section.className = 'mb-8';

        // Category header
        const categoryHeader = document.createElement('h3');
        categoryHeader.className =
            'text-xl font-bold text-theme-bold border-b border-theme pb-2 mb-4';
        categoryHeader.textContent = category.title;
        section.appendChild(categoryHeader);

        // Render all topics in this category
        category.topics.forEach((topic) => {
            const topicSection = sqlViewRenderers.renderSQLTopicForCombined(topic, category.title);
            section.appendChild(topicSection);
        });

        return section;
    },

    // Render SQL topic for combined view
    renderSQLTopicForCombined: (topic: SQLTopic, categoryTitle: string): HTMLElement => {
        const section = document.createElement('section');
        section.className = 'mb-6';

        // Topic header
        const topicHeader = document.createElement('div');
        topicHeader.className = 'mb-3';

        const topicTitle = document.createElement('h4');
        topicTitle.className = 'text-md font-semibold text-theme-base';
        topicTitle.textContent = topic.name;
        topicHeader.appendChild(topicTitle);

        section.appendChild(topicHeader);

        // Render patterns
        topic.patterns.forEach((pattern) => {
            const patternSection = sqlViewRenderers.renderSQLPatternForCombined(
                pattern,
                topic.name,
                categoryTitle
            );
            section.appendChild(patternSection);
        });

        return section;
    },

    // Render SQL pattern for combined view
    renderSQLPatternForCombined: (
        pattern: SQLPattern,
        topicName: string,
        _categoryTitle: string
    ): HTMLElement => {
        const section = document.createElement('div');
        section.className = 'mb-4';

        // Pattern header with solution button
        const patternHeader = document.createElement('div');
        patternHeader.className = 'flex items-center justify-between mb-2 mt-4';

        const patternTitle = document.createElement('h5');
        patternTitle.className = 'text-sm font-bold text-brand-400 uppercase tracking-wider';
        patternTitle.textContent = pattern.name;
        patternHeader.appendChild(patternTitle);

        // Add SQL solution button
        const patternSolutionButton = document.createElement('button');
        patternSolutionButton.className =
            'action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-blue-400 transition-colors inline-flex items-center justify-center';
        patternSolutionButton.dataset['action'] = 'sql-solution';
        patternSolutionButton.dataset['pattern'] = pattern.name;
        patternSolutionButton.title = 'View SQL Pattern Solution';
        patternSolutionButton.innerHTML = `
            <svg aria-hidden="true" fill="currentColor" class="w-4 h-4" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
            </svg>
        `;
        patternHeader.appendChild(patternSolutionButton);

        section.appendChild(patternHeader);

        // Problems grid
        const problemsGrid = document.createElement('div');
        problemsGrid.className = 'grid grid-cols-1 gap-3';

        pattern.problems.forEach((problemDef) => {
            const problem = sqlViewRenderers.initializeSQLProblem(
                problemDef,
                topicName,
                pattern.name
            );
            const { className, innerHTML } = htmlGenerators.generateProblemCardHTML(problem);
            const card = document.createElement('div');
            card.className = className;
            card.setAttribute('data-problem-id', problem.id);
            card.innerHTML = innerHTML;
            problemsGrid.appendChild(card);
        });

        section.appendChild(problemsGrid);
        return section;
    },

    // Remove existing action container
    _removeActionContainer: () => {
        const existingContainer = document.querySelector('.category-action-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    },

    // Create action button
    _createActionBtn: (
        iconSvg: string,
        title: string,
        bgClass: string,
        onClick: () => void
    ): HTMLElement => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `p-1.5 rounded ${bgClass} hover:opacity-80 transition-opacity`;
        btn.title = title;
        btn.innerHTML = iconSvg;
        btn.onclick = onClick;
        return btn;
    },

    // Add action buttons for SQL category
    _addSQLCategoryActionButtons: (categoryId: string) => {
        sqlViewRenderers._removeActionContainer();

        const container = document.createElement('div');
        container.className = 'category-action-container ml-2 flex gap-1';

        // Reset button
        container.appendChild(
            sqlViewRenderers._createActionBtn(
                ICONS.reset,
                'Reset Category',
                'bg-blue-500/10',
                async () => {
                    const { api } = await import('../api');
                    api.resetSQLCategory(categoryId);
                }
            )
        );

        // Delete button
        container.appendChild(
            sqlViewRenderers._createActionBtn(ICONS.delete, 'Delete Category', '', async () => {
                const { api } = await import('../api');
                api.deleteSQLCategory(categoryId);
            })
        );

        const viewTitle = document.getElementById('current-view-title');
        viewTitle?.insertAdjacentElement('afterend', container);
    },

    // Navigate to SQL category
    navigateToSQLCategory: (categoryId: string) => {
        sidebarRenderers.setActiveTopic(null);
        sidebarRenderers.setActiveAlgorithmCategory(null);
        sidebarRenderers.setActiveSQLCategory(categoryId);
        updateUrlParameter('sql', categoryId === 'all' ? null : categoryId);
        sqlViewRenderers.renderSQLView(categoryId);
        scrollToTop();
    },
};
