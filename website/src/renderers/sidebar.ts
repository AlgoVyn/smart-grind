// --- SIDEBAR RENDERERS MODULE ---
// Sidebar rendering functions

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { updateUrlParameter, scrollToTop } from '../utils';
import { AlgorithmCategory } from '../data/algorithms-data';
import { SQLCategory } from '../data/sql-data';
import { ICONS } from './icons';
import { toggleMobileMenu } from '../ui/ui-navigation';

export const sidebarRenderers = {
    // Render sidebar navigation (consolidated click handlers)
    renderSidebar: () => {
        const topicList = state.elements['topicList'];
        if (topicList) {
            // Use DocumentFragment for batch DOM insertion (performance optimization)
            const fragment = document.createDocumentFragment();

            // Helper for topic navigation
            const navigateToTopic = async (topicId: string) => {
                sidebarRenderers.setActiveTopic(topicId);
                sidebarRenderers.setActiveAlgorithmCategory(null);
                sidebarRenderers.setActiveSQLCategory(null);
                sidebarRenderers.setActiveAllButton(false);
                // Only update URL once - set category path (clears algorithm path automatically)
                updateUrlParameter('category', topicId === 'all' ? null : topicId);
                const { renderers } = await import('../renderers');
                await renderers.renderMainView(topicId);
                renderers.updateStats();
                scrollToTop();
                // Close mobile menu when a category is selected
                if (window.innerWidth < 768) {
                    toggleMobileMenu();
                }
            };

            // Helper for algorithm category navigation
            const navigateToAlgorithmCategory = async (categoryId: string) => {
                sidebarRenderers.setActiveTopic(null);
                sidebarRenderers.setActiveAlgorithmCategory(categoryId);
                sidebarRenderers.setActiveSQLCategory(null);
                sidebarRenderers.setActiveAllButton(false);
                // Only update URL once - set algorithm path (clears category path automatically)
                updateUrlParameter('algorithms', categoryId === 'all' ? null : categoryId);
                const { renderers } = await import('../renderers');
                await renderers.renderAlgorithmsView(categoryId);
                renderers.updateStats();
                scrollToTop();
                // Close mobile menu when a category is selected
                if (window.innerWidth < 768) {
                    toggleMobileMenu();
                }
            };

            // Helper for SQL category navigation
            const navigateToSQLCategory = async (categoryId: string) => {
                sidebarRenderers.setActiveTopic(null);
                sidebarRenderers.setActiveAlgorithmCategory(null);
                sidebarRenderers.setActiveAllButton(false);
                sidebarRenderers.setActiveSQLCategory(categoryId);
                // Only update URL once - set SQL path
                updateUrlParameter('sql', categoryId === 'all' ? null : categoryId);
                const { renderers } = await import('../renderers');
                await renderers.renderSQLView(categoryId);
                renderers.updateStats();
                scrollToTop();
                // Close mobile menu when a category is selected
                if (window.innerWidth < 768) {
                    toggleMobileMenu();
                }
            };

            // Helper for combined view navigation
            const navigateToAll = async () => {
                sidebarRenderers.setActiveTopic(null);
                sidebarRenderers.setActiveAlgorithmCategory(null);
                sidebarRenderers.setActiveSQLCategory(null);
                sidebarRenderers.setActiveAllButton(true);
                // Clear URL params
                updateUrlParameter('category', null);
                updateUrlParameter('algorithms', null);
                updateUrlParameter('sql', null);
                const { renderers } = await import('../renderers');
                await renderers.renderCombinedView();
                renderers.updateStats();
                scrollToTop();
                // Close mobile menu when All Content is selected
                if (window.innerWidth < 768) {
                    toggleMobileMenu();
                }
            };

            // Determine which sections should be expanded based on active view
            // All sections collapsed by default
            const algorithmsExpanded = false;
            const patternsExpanded = false;
            const sqlExpanded = false;

            // ===========================================
            // ALL CONTENT BUTTON (at the top)
            // ===========================================
            const allContentBtn = sidebarRenderers.createAllContentButton();
            allContentBtn.onclick = () => navigateToAll();
            fragment.appendChild(allContentBtn);

            // ===========================================
            // PATTERNS SECTION (collapsible) - FIRST
            // ===========================================
            const patternsSection = sidebarRenderers.createCollapsibleSection(
                'patterns-section',
                'Patterns',
                patternsExpanded
            );
            fragment.appendChild(patternsSection.container);

            // "All Problems" Link
            const allBtn = sidebarRenderers.createTopicButton('all', 'All Problems');
            allBtn.onclick = () => navigateToTopic('all');
            patternsSection.content.appendChild(allBtn);

            // Topic buttons
            data.topicsData.forEach((topic: Topic) => {
                const btn = sidebarRenderers.createTopicButton(topic.id, topic.title);
                btn.onclick = () => navigateToTopic(topic.id);
                patternsSection.content.appendChild(btn);
            });

            // ===========================================
            // ALGORITHMS SECTION (collapsible) - SECOND
            // ===========================================
            const algorithmsSection = sidebarRenderers.createCollapsibleSection(
                'algorithms-section',
                'Algorithms',
                algorithmsExpanded
            );
            fragment.appendChild(algorithmsSection.container);

            // "All Algorithms" Link
            const allAlgorithmsBtn = sidebarRenderers.createAlgorithmAllButton();
            allAlgorithmsBtn.onclick = () => navigateToAlgorithmCategory('all');
            algorithmsSection.content.appendChild(allAlgorithmsBtn);

            // Algorithm category buttons
            data.algorithmsData.forEach((category: AlgorithmCategory) => {
                const btn = sidebarRenderers.createAlgorithmCategoryButton(category);
                btn.onclick = () => navigateToAlgorithmCategory(category.id);
                algorithmsSection.content.appendChild(btn);
            });

            // ===========================================
            // SQL SECTION (collapsible) - THIRD
            // ===========================================
            const sqlSection = sidebarRenderers.createCollapsibleSection(
                'sql-section',
                'SQL',
                sqlExpanded
            );
            fragment.appendChild(sqlSection.container);

            // "All SQL" Link
            const allSQLBtn = sidebarRenderers.createSQLAllButton();
            allSQLBtn.onclick = () => navigateToSQLCategory('all');
            sqlSection.content.appendChild(allSQLBtn);

            // SQL category buttons
            data.sqlData.forEach((category: SQLCategory) => {
                const btn = sidebarRenderers.createSQLCategoryButton(category);
                btn.onclick = () => navigateToSQLCategory(category.id);
                sqlSection.content.appendChild(btn);
            });

            // Batch append all at once (single reflow)
            (topicList as HTMLElement).innerHTML = '';
            (topicList as HTMLElement).appendChild(fragment);
        }
    },

    // Create a collapsible section with header and content
    createCollapsibleSection: (id: string, title: string, expanded: boolean) => {
        const container = document.createElement('div');
        container.className = 'sidebar-collapsible-section';
        container.id = id;

        // Create header
        const header = document.createElement('button');
        header.type = 'button';
        header.className =
            'sidebar-section-header w-full flex items-center justify-between cursor-pointer';
        header.dataset['testid'] = 'sidebar-section-header';
        header.innerHTML = `
            <div class="flex items-center gap-2">
                <svg aria-hidden="true" class="sidebar-chevron w-4 h-4 text-theme-muted transition-transform duration-200 ${expanded ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <span class="sidebar-section-title">${title}</span>
            </div>
        `;

        // Create content container
        const content = document.createElement('div');
        content.className = `sidebar-section-content ${expanded ? '' : 'hidden'}`;

        // Toggle functionality
        header.onclick = () => {
            const isExpanded = !content.classList.contains('hidden');
            content.classList.toggle('hidden');
            const chevron = header.querySelector('.sidebar-chevron');
            if (chevron) {
                chevron.classList.toggle('rotate-90', !isExpanded);
            }
        };

        container.appendChild(header);
        container.appendChild(content);

        return { container, content };
    },

    // Helper to generate progress stats HTML
    _generateProgressHTML: (total: number, solved: number): string => {
        const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
        const pctClass = pct === 100 ? 'text-green-400' : 'text-theme-muted';
        return `
            <div class="flex items-center gap-3 shrink-0">
                <span class="sidebar-stat-total text-[10px] font-mono text-theme-muted">${total}</span>
                <span class="sidebar-stat-pct text-[10px] ${pctClass} font-mono min-w-[24px] text-right">${pct}%</span>
            </div>
        `;
    },

    // Get icon for a topic
    getTopicIcon: (topicId: string): string => {
        const icon = ICONS.topicIcons[topicId as keyof typeof ICONS.topicIcons];
        return icon || ICONS.topicIcons.default;
    },

    // Calculate unique pattern problems from data structure (not from state)
    _getPatternStats: (topicId: string): { total: number; solved: number } => {
        const uniqueProblemIds = new Set<string>();
        let solved = 0;

        if (topicId === 'all') {
            // Count all unique problems across all pattern topics
            data.topicsData.forEach((topic) => {
                topic.patterns.forEach((pattern) => {
                    pattern.problems.forEach((prob) => {
                        const id = typeof prob === 'string' ? prob : prob.id;
                        // Skip SQL problems
                        if (id.startsWith('sql-')) return;
                        if (!uniqueProblemIds.has(id)) {
                            uniqueProblemIds.add(id);
                            if (state.problems.get(id)?.status === 'solved') {
                                solved++;
                            }
                        }
                    });
                });
            });
        } else {
            // Count unique problems for specific topic
            const topic = data.topicsData.find((t) => t.id === topicId);
            if (topic) {
                topic.patterns.forEach((pattern) => {
                    pattern.problems.forEach((prob) => {
                        const id = typeof prob === 'string' ? prob : prob.id;
                        // Skip SQL problems
                        if (id.startsWith('sql-')) return;
                        if (!uniqueProblemIds.has(id)) {
                            uniqueProblemIds.add(id);
                            if (state.problems.get(id)?.status === 'solved') {
                                solved++;
                            }
                        }
                    });
                });
            }
        }

        return { total: uniqueProblemIds.size, solved };
    },

    // Create a topic button for sidebar
    createTopicButton: (topicId: string, title: string) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive =
            state.ui.activeTopicId === topicId ||
            (state.ui.activeTopicId === 'all' && topicId === 'all');
        btn.className = `sidebar-link ${isActive ? 'active' : ''} w-full text-left px-3 py-3 text-sm font-medium text-theme-base transition-colors border-r-2 border-transparent flex justify-between items-center group cursor-pointer`;
        btn.dataset['topicId'] = topicId;

        const stats = sidebarRenderers._getPatternStats(topicId);
        const icon = sidebarRenderers.getTopicIcon(topicId);
        btn.innerHTML = `
            <span class="flex items-center min-w-0 flex-1 overflow-hidden">
                ${icon}
                <span class="truncate ml-2 sidebar-btn-text">${title}</span>
            </span>
            ${sidebarRenderers._generateProgressHTML(stats.total, stats.solved)}
        `;

        return btn;
    },

    // Create an algorithm category button (simple button, not collapsible)
    createAlgorithmCategoryButton: (category: AlgorithmCategory) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = state.ui.activeAlgorithmCategoryId === category.id;
        btn.className = `sidebar-algorithm-category ${isActive ? 'active' : ''} w-full text-left px-3 py-3 text-sm font-medium text-theme-base transition-colors flex justify-between items-center group cursor-pointer`;
        btn.dataset['categoryId'] = category.id;

        // Calculate progress for this category using unique problem IDs
        const uniqueProblemIds = new Set<string>();
        let solved = 0;
        category.algorithms.forEach((algo) => {
            if (!uniqueProblemIds.has(algo.id)) {
                uniqueProblemIds.add(algo.id);
                if (state.problems.get(algo.id)?.status === 'solved') {
                    solved++;
                }
            }
        });

        const icon = ICONS.getAlgorithmCategoryIcon(category.id);
        btn.innerHTML = `
            <span class="flex items-center min-w-0 flex-1 overflow-hidden">
                ${icon}
                <span class="truncate ml-2 sidebar-btn-text">${category.title}</span>
            </span>
            ${sidebarRenderers._generateProgressHTML(uniqueProblemIds.size, solved)}
        `;

        return btn;
    },

    // Create "All Algorithms" button for sidebar
    createAlgorithmAllButton: () => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = state.ui.activeAlgorithmCategoryId === 'all';
        btn.className = `sidebar-algorithm-category ${isActive ? 'active' : ''} w-full text-left px-3 py-3 text-sm font-medium text-theme-base transition-colors border-r-2 border-transparent flex justify-between items-center group cursor-pointer`;
        btn.dataset['categoryId'] = 'all';

        // Calculate progress for all algorithms using unique problem IDs
        const uniqueProblemIds = new Set<string>();
        let solved = 0;
        data.algorithmsData.forEach((category) => {
            category.algorithms.forEach((algo) => {
                if (!uniqueProblemIds.has(algo.id)) {
                    uniqueProblemIds.add(algo.id);
                    if (state.problems.get(algo.id)?.status === 'solved') {
                        solved++;
                    }
                }
            });
        });

        const icon = ICONS.topicIcons.algorithms;
        btn.innerHTML = `
            <span class="flex items-center min-w-0 flex-1 overflow-hidden">
                ${icon}
                <span class="truncate ml-2 sidebar-btn-text">All Algorithms</span>
            </span>
            ${sidebarRenderers._generateProgressHTML(uniqueProblemIds.size, solved)}
        `;

        return btn;
    },

    // Create SQL category button
    createSQLCategoryButton: (category: SQLCategory) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = state.ui.activeSQLCategoryId === category.id;
        btn.className = `sidebar-sql-category ${isActive ? 'active' : ''} w-full text-left px-3 py-3 text-sm font-medium text-theme-base transition-colors flex justify-between items-center group cursor-pointer`;
        btn.dataset['sqlCategoryId'] = category.id;

        // Calculate progress for this category using unique problem IDs
        const uniqueProblemIds = new Set<string>();
        let solved = 0;
        category.topics.forEach((topic) => {
            topic.patterns.forEach((pattern) => {
                pattern.problems.forEach((problem) => {
                    if (!uniqueProblemIds.has(problem.id)) {
                        uniqueProblemIds.add(problem.id);
                        if (state.problems.get(problem.id)?.status === 'solved') {
                            solved++;
                        }
                    }
                });
            });
        });

        const icon = ICONS.getSQLCategoryIcon(category.id);
        btn.innerHTML = `
            <span class="flex items-center min-w-0 flex-1 overflow-hidden">
                ${icon}
                <span class="truncate ml-2 sidebar-btn-text">${category.title}</span>
            </span>
            ${sidebarRenderers._generateProgressHTML(uniqueProblemIds.size, solved)}
        `;

        return btn;
    },

    // Create "All SQL" button for sidebar
    createSQLAllButton: () => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = state.ui.activeSQLCategoryId === 'all';
        btn.className = `sidebar-sql-category ${isActive ? 'active' : ''} w-full text-left px-3 py-3 text-sm font-medium text-theme-base transition-colors border-r-2 border-transparent flex justify-between items-center group cursor-pointer`;
        btn.dataset['sqlCategoryId'] = 'all';

        // Calculate progress for all SQL problems using unique problem IDs
        const uniqueProblemIds = new Set<string>();
        let solved = 0;
        data.sqlData.forEach((category) => {
            category.topics.forEach((topic) => {
                topic.patterns.forEach((pattern) => {
                    pattern.problems.forEach((problem) => {
                        if (!uniqueProblemIds.has(problem.id)) {
                            uniqueProblemIds.add(problem.id);
                            if (state.problems.get(problem.id)?.status === 'solved') {
                                solved++;
                            }
                        }
                    });
                });
            });
        });

        const icon = ICONS.topicIcons.sql || ICONS.topicIcons.database;
        btn.innerHTML = `
            <span class="flex items-center min-w-0 flex-1 overflow-hidden">
                ${icon}
                <span class="truncate ml-2 sidebar-btn-text">All SQL</span>
            </span>
            ${sidebarRenderers._generateProgressHTML(uniqueProblemIds.size, solved)}
        `;

        return btn;
    },

    // Set active SQL category in sidebar
    setActiveSQLCategory: (categoryId: string | null) => {
        document
            .querySelectorAll('.sidebar-sql-category')
            .forEach((l) => l.classList.remove('active'));
        if (categoryId) {
            const activeBtn = document.querySelector(
                `[data-sql-category-id="${categoryId}"].sidebar-sql-category`
            );
            if (activeBtn) activeBtn.classList.add('active');
        }
        state.ui.activeSQLCategoryId = categoryId;
        // Clear active topic and algorithm when viewing SQL
        if (categoryId) {
            state.ui.activeTopicId = '';
            state.ui.activeAlgorithmCategoryId = '';
        }
    },

    // Set active topic in sidebar
    setActiveTopic: (topicId: string | null) => {
        document.querySelectorAll('.sidebar-link').forEach((l) => l.classList.remove('active'));
        if (topicId) {
            const activeBtn =
                document.querySelector(`[data-topic-id="${topicId}"]`) ||
                document.querySelector('.sidebar-link:first-child'); // All problems
            if (activeBtn) activeBtn.classList.add('active');
        }
        state.ui.activeTopicId = topicId || '';
        // Clear SQL when viewing patterns
        if (topicId) {
            state.ui.activeSQLCategoryId = null;
        }
    },

    // Set active algorithm category in sidebar
    setActiveAlgorithmCategory: (categoryId: string | null) => {
        document
            .querySelectorAll('.sidebar-algorithm-category')
            .forEach((l) => l.classList.remove('active'));
        if (categoryId) {
            const activeBtn = document.querySelector(
                `[data-category-id="${categoryId}"].sidebar-algorithm-category`
            );
            if (activeBtn) activeBtn.classList.add('active');
        }
        state.ui.activeAlgorithmCategoryId = categoryId;
        // Clear active topic and SQL when viewing algorithms
        if (categoryId) {
            state.ui.activeTopicId = '';
            state.ui.activeSQLCategoryId = '';
        }
    },

    // Create "All Content" button for sidebar (at the top)
    createAllContentButton: () => {
        const btn = document.createElement('button');
        btn.type = 'button';
        // Check if all view is active (no specific category selected)
        const isActive =
            !state.ui.activeTopicId &&
            !state.ui.activeAlgorithmCategoryId &&
            !state.ui.activeSQLCategoryId;
        btn.className = `sidebar-all-content ${isActive ? 'active' : ''} w-full text-left px-3 py-3 text-sm font-medium text-theme-base transition-colors border-r-2 border-transparent flex justify-between items-center group cursor-pointer mb-4`;
        btn.dataset['allContent'] = 'true';

        // Calculate total progress across all content using unique problem IDs
        const uniqueProblemIds = new Set<string>();
        let solvedProblems = 0;

        // Count pattern problems
        data.topicsData.forEach((topic) => {
            topic.patterns.forEach((pattern) => {
                pattern.problems.forEach((prob) => {
                    const id = typeof prob === 'string' ? prob : prob.id;
                    if (!uniqueProblemIds.has(id)) {
                        uniqueProblemIds.add(id);
                        if (state.problems.get(id)?.status === 'solved') {
                            solvedProblems++;
                        }
                    }
                });
            });
        });

        // Count algorithm problems
        data.algorithmsData.forEach((category) => {
            category.algorithms.forEach((algo) => {
                if (!uniqueProblemIds.has(algo.id)) {
                    uniqueProblemIds.add(algo.id);
                    if (state.problems.get(algo.id)?.status === 'solved') {
                        solvedProblems++;
                    }
                }
            });
        });

        // Count SQL problems
        data.sqlData.forEach((category) => {
            category.topics.forEach((topic) => {
                topic.patterns.forEach((pattern) => {
                    pattern.problems.forEach((problem) => {
                        if (!uniqueProblemIds.has(problem.id)) {
                            uniqueProblemIds.add(problem.id);
                            if (state.problems.get(problem.id)?.status === 'solved') {
                                solvedProblems++;
                            }
                        }
                    });
                });
            });
        });

        const icon =
            '<svg aria-hidden="true" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>';
        btn.innerHTML = `
            <span class="flex items-center min-w-0 flex-1 overflow-hidden gap-2">
                ${icon}
                <span class="truncate sidebar-btn-text">All Content</span>
            </span>
            ${sidebarRenderers._generateProgressHTML(uniqueProblemIds.size, solvedProblems)}
        `;

        return btn;
    },

    // Set active state for All Content button
    setActiveAllButton: (isActive: boolean) => {
        document
            .querySelectorAll('.sidebar-all-content')
            .forEach((l) => l.classList.remove('active'));
        if (isActive) {
            const activeBtn = document.querySelector('.sidebar-all-content');
            if (activeBtn) activeBtn.classList.add('active');
        }
    },
};
