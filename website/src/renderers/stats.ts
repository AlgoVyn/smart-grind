// --- STATS RENDERERS MODULE ---
// Statistics and filter rendering functions

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { utils } from '../utils';
import { renderers } from '../renderers';
import { AlgorithmCategory } from '../data/algorithms-data';

export const statsRenderers = {
    // Helper to update main dashboard statistics
    _updateMainStats: (stats: { total: number; solved: number; due: number }) => {
        const { total, solved, due } = stats;
        const percentage = total > 0 ? (solved / total) * 100 : 0;

        // Update main dashboard stats safely
        const mainTotalText = state.elements['statTotal'];
        const mainSolvedText = state.elements['statSolved'];
        const mainDueText = state.elements['statDue'];
        const mainSolvedBar = state.elements['progressBarSolved'];
        const mainDueBadge = state.elements['statDueBadge'];

        if (mainTotalText) mainTotalText.innerText = total.toString();
        if (mainSolvedText) mainSolvedText.innerText = solved.toString();
        if (mainDueText) mainDueText.innerText = due.toString();
        if (mainSolvedBar) mainSolvedBar.style.width = `${percentage}%`;
        if (mainDueBadge) {
            mainDueBadge.classList.toggle('hidden', due === 0);
        }
    },

    // Helper to update sidebar statistics
    _updateSidebarStats: () => {
        // Use only problems data (not including algorithms) for sidebar stats
        const allProblems = Array.from(state.problems.values());
        const total = allProblems.length;
        const solved = allProblems.filter((p) => p.status === 'solved').length;
        const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

        const sidebarTotalStat = state.elements['sidebarTotalStat'];
        const sidebarTotalBar = state.elements['sidebarTotalBar'];

        if (sidebarTotalStat) {
            sidebarTotalStat.innerText = `${percentage}%`;
        }
        if (sidebarTotalBar) {
            sidebarTotalBar.style.width = `${total > 0 ? (solved / total) * 100 : 0}%`;
        }
    },

    // Helper to update review banner
    _updateReviewBanner: (due: number) => {
        const reviewBanner = state.elements['reviewBanner'];
        const reviewCountBanner = state.elements['reviewCountBanner'];

        if (due > 0) {
            reviewBanner?.classList.remove('hidden');
            if (reviewCountBanner) {
                reviewCountBanner.innerText = due.toString();
            }
        } else {
            reviewBanner?.classList.add('hidden');
        }
    },

    // Get stats for algorithm category
    _getAlgorithmCategoryStats: (categoryId: string) => {
        let total = 0;
        let solved = 0;
        let due = 0;
        const today = utils.getToday();

        if (categoryId === 'all') {
            // All algorithms
            data.algorithmsData.forEach((category: AlgorithmCategory) => {
                category.algorithms.forEach((algo) => {
                    total++;
                    const problem = state.problems.get(algo.id);
                    if (problem && problem.status === 'solved') {
                        solved++;
                        if (problem.nextReviewDate && problem.nextReviewDate <= today) {
                            due++;
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
                    total++;
                    const problem = state.problems.get(algo.id);
                    if (problem && problem.status === 'solved') {
                        solved++;
                        if (problem.nextReviewDate && problem.nextReviewDate <= today) {
                            due++;
                        }
                    }
                });
            }
        }

        return { total, solved, due };
    },

    // Update statistics display
    updateStats: () => {
        // Check if we're viewing algorithms or patterns
        const isAlgorithmView =
            state.ui.activeAlgorithmCategoryId !== null &&
            state.ui.activeAlgorithmCategoryId !== '';

        let stats: { total: number; solved: number; due: number };

        if (isAlgorithmView) {
            stats = statsRenderers._getAlgorithmCategoryStats(
                state.ui.activeAlgorithmCategoryId || 'all'
            );
        } else if (state.ui.activeTopicId === 'all') {
            // For 'all' view, only count problems (not algorithms) to match sidebar stats
            stats = utils.getUniqueProblemsForTopic('all');
        } else {
            stats = utils.getUniqueProblemsForTopic(state.ui.activeTopicId);
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
            statsCache.set(topic.id, utils.getUniqueProblemsForTopic(topic.id));
        });

        // Update all topic buttons in a single pass
        const topicBtns = document.querySelectorAll('.sidebar-link[data-topic-id]');
        topicBtns.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            const topicId = htmlBtn.dataset['topicId'];
            const stats = topicId ? statsCache.get(topicId) : null;
            if (stats) {
                const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
                statsRenderers._updateButtonPercentage(htmlBtn, pct);
            }
        });

        // Update algorithm category buttons
        statsRenderers._updateAlgorithmSidebarStats();
    },

    // Helper to update percentage span on a button
    _updateButtonPercentage: (btn: HTMLElement, pct: number) => {
        const pctSpan = btn.querySelector('span:last-child');
        if (pctSpan) {
            pctSpan.textContent = `${pct}%`;
            pctSpan.className =
                pct === 100
                    ? 'text-[10px] text-green-400 font-mono min-w-[24px] text-right transition-colors'
                    : 'text-[10px] text-theme-muted group-hover:text-theme-base font-mono min-w-[24px] text-right transition-colors';
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
            statsRenderers._updateButtonPercentage(htmlBtn, pct);
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
