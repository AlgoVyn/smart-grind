// --- STATS RENDERERS MODULE ---
// Statistics and filter rendering functions

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { getToday, getUniqueProblemsForTopic, showEl, hideEl } from '../utils';
import { renderers } from '../renderers';
import { AlgorithmCategory } from '../data/algorithms-data';
import { SQLCategory } from '../data/sql-data';

export const statsRenderers = {
    // Helper to update main dashboard statistics
    _updateMainStats: (stats: { total: number; solved: number; due: number }) => {
        const { total, solved, due } = stats;
        const percentage = total > 0 ? (solved / total) * 100 : 0;

        // Update main dashboard stats safely
        const mainTotalText = state.elements['statTotal'] as HTMLElement | null;
        const mainSolvedText = state.elements['statSolved'] as HTMLElement | null;
        const mainDueText = state.elements['statDue'] as HTMLElement | null;
        const mainSolvedBar = state.elements['progressBarSolved'] as HTMLElement | null;
        const mainDueBadge = state.elements['statDueBadge'] as HTMLElement | null;

        if (mainTotalText) mainTotalText.innerText = total.toString();
        if (mainSolvedText) mainSolvedText.innerText = solved.toString();
        if (mainDueText) mainDueText.innerText = due.toString();
        if (mainSolvedBar) mainSolvedBar.style.width = `${percentage}%`;
        if (mainDueBadge) {
            mainDueBadge.classList.toggle('hidden', due === 0);
        }
    },

    // Helper to update sidebar statistics using unique problem IDs
    _updateSidebarStats: () => {
        // Use all problems data (patterns + algorithms + SQL) for sidebar stats
        const uniqueProblemIds = new Set<string>();
        let solved = 0;

        Array.from(state.problems.values()).forEach((p) => {
            if (!uniqueProblemIds.has(p.id)) {
                uniqueProblemIds.add(p.id);
                if (p.status === 'solved') {
                    solved++;
                }
            }
        });

        const total = uniqueProblemIds.size;
        const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

        const sidebarTotalStat = state.elements['sidebarTotalStat'] as HTMLElement | null;
        const sidebarTotalBar = state.elements['sidebarTotalBar'] as HTMLElement | null;

        if (sidebarTotalStat) {
            sidebarTotalStat.innerText = `${percentage}%`;
        }
        if (sidebarTotalBar) {
            sidebarTotalBar.style.width = `${total > 0 ? (solved / total) * 100 : 0}%`;
        }
    },

    // Helper to update review banner
    _updateReviewBanner: (due: number) => {
        const reviewBanner = state.elements['reviewBanner'] as HTMLElement | null;
        const reviewCountBanner = state.elements['reviewCountBanner'] as HTMLElement | null;

        if (due > 0) {
            showEl(reviewBanner);
            if (reviewCountBanner) {
                reviewCountBanner.innerText = due.toString();
            }
        } else {
            hideEl(reviewBanner);
        }
    },

    // Get stats for algorithm category using unique problem IDs
    _getAlgorithmCategoryStats: (categoryId: string) => {
        const uniqueProblemIds = new Set<string>();
        let solved = 0;
        let due = 0;
        const today = getToday();

        if (categoryId === 'all') {
            // All algorithms
            data.algorithmsData.forEach((category: AlgorithmCategory) => {
                category.algorithms.forEach((algo) => {
                    if (!uniqueProblemIds.has(algo.id)) {
                        uniqueProblemIds.add(algo.id);
                        const problem = state.problems.get(algo.id);
                        if (problem && problem.status === 'solved') {
                            solved++;
                            if (problem.nextReviewDate && problem.nextReviewDate <= today) {
                                due++;
                            }
                        }
                    }
                });
            });
        } else {
            // Specific category
            const category = data.algorithmsData.find(
                (c: AlgorithmCategory) => c.id === categoryId
            );
            if (category) {
                category.algorithms.forEach((algo) => {
                    if (!uniqueProblemIds.has(algo.id)) {
                        uniqueProblemIds.add(algo.id);
                        const problem = state.problems.get(algo.id);
                        if (problem && problem.status === 'solved') {
                            solved++;
                            if (problem.nextReviewDate && problem.nextReviewDate <= today) {
                                due++;
                            }
                        }
                    }
                });
            }
        }

        return { total: uniqueProblemIds.size, solved, due };
    },

    // Get stats for SQL category using unique problem IDs
    _getSQLCategoryStats: (categoryId: string) => {
        const uniqueProblemIds = new Set<string>();
        let solved = 0;
        let due = 0;
        const today = getToday();

        if (categoryId === 'all') {
            // All SQL
            data.sqlData.forEach((category: SQLCategory) => {
                category.topics.forEach((topic) => {
                    topic.patterns.forEach((pattern) => {
                        pattern.problems.forEach((problem) => {
                            if (!uniqueProblemIds.has(problem.id)) {
                                uniqueProblemIds.add(problem.id);
                                const p = state.problems.get(problem.id);
                                if (p && p.status === 'solved') {
                                    solved++;
                                    if (p.nextReviewDate && p.nextReviewDate <= today) {
                                        due++;
                                    }
                                }
                            }
                        });
                    });
                });
            });
        } else {
            // Specific category
            const category = data.sqlData.find((c: SQLCategory) => c.id === categoryId);
            if (category) {
                category.topics.forEach((topic) => {
                    topic.patterns.forEach((pattern) => {
                        pattern.problems.forEach((problem) => {
                            if (!uniqueProblemIds.has(problem.id)) {
                                uniqueProblemIds.add(problem.id);
                                const p = state.problems.get(problem.id);
                                if (p && p.status === 'solved') {
                                    solved++;
                                    if (p.nextReviewDate && p.nextReviewDate <= today) {
                                        due++;
                                    }
                                }
                            }
                        });
                    });
                });
            }
        }

        return { total: uniqueProblemIds.size, solved, due };
    },

    // Get stats for all content (patterns + algorithms + SQL) using unique problem IDs
    _getAllContentStats: () => {
        const uniqueProblemIds = new Set<string>();
        let solved = 0;
        let due = 0;
        const today = getToday();

        // Count pattern problems
        data.topicsData.forEach((topic) => {
            topic.patterns.forEach((pattern) => {
                pattern.problems.forEach((prob) => {
                    const id = typeof prob === 'string' ? prob : prob.id;
                    if (!uniqueProblemIds.has(id)) {
                        uniqueProblemIds.add(id);
                        const problem = state.problems.get(id);
                        if (problem) {
                            if (problem.status === 'solved') {
                                solved++;
                                if (problem.nextReviewDate && problem.nextReviewDate <= today) {
                                    due++;
                                }
                            }
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
                    const problem = state.problems.get(algo.id);
                    if (problem) {
                        if (problem.status === 'solved') {
                            solved++;
                            if (problem.nextReviewDate && problem.nextReviewDate <= today) {
                                due++;
                            }
                        }
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
                            const p = state.problems.get(problem.id);
                            if (p) {
                                if (p.status === 'solved') {
                                    solved++;
                                    if (p.nextReviewDate && p.nextReviewDate <= today) {
                                        due++;
                                    }
                                }
                            }
                        }
                    });
                });
            });
        });

        return { total: uniqueProblemIds.size, solved, due };
    },

    // Update statistics display
    updateStats: () => {
        // Check if we're viewing algorithms, patterns, or all content
        const isAlgorithmView =
            state.ui.activeAlgorithmCategoryId !== null &&
            state.ui.activeAlgorithmCategoryId !== '';
        const isSQLView =
            state.ui.activeSQLCategoryId !== null && state.ui.activeSQLCategoryId !== '';
        const isAllContentView = !isAlgorithmView && !isSQLView && !state.ui.activeTopicId;

        let stats: { total: number; solved: number; due: number };

        if (isAlgorithmView) {
            stats = statsRenderers._getAlgorithmCategoryStats(
                state.ui.activeAlgorithmCategoryId || 'all'
            );
        } else if (isSQLView) {
            stats = statsRenderers._getSQLCategoryStats(state.ui.activeSQLCategoryId || 'all');
        } else if (isAllContentView) {
            // All content view - count everything
            stats = statsRenderers._getAllContentStats();
        } else if (state.ui.activeTopicId === 'all' || state.ui.activeTopicId === '') {
            // For 'all' view in patterns, only count problems (not algorithms)
            // Empty string also defaults to all problems when not in combined view
            stats = getUniqueProblemsForTopic('all');
        } else {
            stats = getUniqueProblemsForTopic(state.ui.activeTopicId);
        }

        const { due } = stats;

        renderers._updateMainStats(stats);
        renderers._updateSidebarStats();
        renderers._updateReviewBanner(due);

        // Only update sidebar stats percentages instead of full re-render (performance optimization)
        renderers._updateSidebarStatsOnly();
    },

    // Optimized: Update only sidebar stats percentages without full re-render
    _updateSidebarStatsOnly: () => {
        // Cache all topic stats to avoid recalculating for each button
        const statsCache = new Map<string, { total: number; solved: number }>();
        data.topicsData.forEach((topic: Topic) => {
            statsCache.set(topic.id, getUniqueProblemsForTopic(topic.id));
        });

        // Update all topic buttons in a single pass
        const topicBtns = document.querySelectorAll('.sidebar-link[data-topic-id]');
        topicBtns.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            const topicId = htmlBtn.dataset['topicId'];
            const stats = topicId ? statsCache.get(topicId) : null;
            if (stats) {
                const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
                statsRenderers._updateButtonPercentage(htmlBtn, pct, stats.total);
            }
        });

        // Update algorithm category buttons
        statsRenderers._updateAlgorithmSidebarStats();

        // Update SQL category buttons
        statsRenderers._updateSQLSidebarStats();

        // Update All Content button
        statsRenderers._updateAllContentSidebarStats();
    },

    // Update SQL category sidebar stats
    _updateSQLSidebarStats: () => {
        const sqlBtns = document.querySelectorAll('.sidebar-sql-category[data-sql-category-id]');
        sqlBtns.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            const categoryId = htmlBtn.dataset['sqlCategoryId'];
            if (!categoryId) return;

            const stats = statsRenderers._getSQLCategoryStats(categoryId);
            const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
            statsRenderers._updateButtonPercentage(htmlBtn, pct, stats.total);
        });
    },

    // Update All Content button sidebar stats
    _updateAllContentSidebarStats: () => {
        const allContentBtn = document.querySelector('.sidebar-all-content');
        if (!allContentBtn) return;

        const stats = statsRenderers._getAllContentStats();
        const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
        statsRenderers._updateButtonPercentage(allContentBtn as HTMLElement, pct, stats.total);
    },

    // Helper to update percentage span on a button
    _updateButtonPercentage: (btn: HTMLElement, pct: number, total?: number) => {
        // Find the percentage span using the specific class
        const pctSpan = btn.querySelector('.sidebar-stat-pct');
        if (pctSpan) {
            pctSpan.textContent = `${pct}%`;
            pctSpan.className =
                pct === 100
                    ? 'sidebar-stat-pct text-[10px] text-green-400 font-mono min-w-[24px] text-right transition-colors'
                    : 'sidebar-stat-pct text-[10px] text-theme-muted group-hover:text-theme-base font-mono min-w-[24px] text-right transition-colors';
        }
        // Update total count if provided
        if (total !== undefined) {
            const totalSpan = btn.querySelector('.sidebar-stat-total');
            if (totalSpan) {
                totalSpan.textContent = `${total}`;
            }
        }
    },

    // Update algorithm category sidebar stats
    _updateAlgorithmSidebarStats: () => {
        const algoBtns = document.querySelectorAll('.sidebar-algorithm-category[data-category-id]');
        algoBtns.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            const categoryId = htmlBtn.dataset['categoryId'];
            if (!categoryId) return;

            const stats = statsRenderers._getAlgorithmCategoryStats(categoryId);
            const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
            statsRenderers._updateButtonPercentage(htmlBtn, pct, stats.total);
        });
    },

    // Update filter button states (optimized with batch class updates)
    updateFilterBtns: () => {
        const filterBtns = state.elements['filterBtns'] as unknown as NodeListOf<HTMLElement>;
        if (!filterBtns) return;

        // Pre-define class lists to avoid repeated string concatenation
        const activeClasses = ['bg-brand-600', 'text-white'];
        const inactiveClasses = ['text-theme-bold'];

        filterBtns.forEach((b: HTMLElement) => {
            const isActive = b.dataset['filter'] === state.ui.currentFilter;
            if (isActive) {
                b.classList.remove(...inactiveClasses);
                b.classList.add(...activeClasses);
            } else {
                b.classList.remove(...activeClasses);
                b.classList.add(...inactiveClasses);
            }
        });
    },
};
