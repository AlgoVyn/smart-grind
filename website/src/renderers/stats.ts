// --- STATS RENDERERS MODULE ---
// Statistics and filter rendering functions

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { utils } from '../utils';
import { renderers } from '../renderers';

export const statsRenderers = {
    // Helper to update main dashboard statistics
    _updateMainStats: (stats: { total: number; solved: number; due: number }) => {
        const { total, solved, due } = stats;
        const percentage = total > 0 ? (solved / total) * 100 : 0;

        // Update main dashboard stats safely
        const mainTotalText = state.elements['mainTotalText'];
        const mainSolvedText = state.elements['mainSolvedText'];
        const mainDueText = state.elements['mainDueText'];
        const mainSolvedBar = state.elements['mainSolvedBar'];
        const mainDueBadge = state.elements['mainDueBadge'];

        if (mainTotalText) mainTotalText.innerText = total.toString();
        if (mainSolvedText) mainSolvedText.innerText = solved.toString();
        if (mainDueText) mainDueText.innerText = due.toString();
        if (mainSolvedBar) mainSolvedBar.style.width = `${percentage}%`;
        if (mainDueBadge) {
            mainDueBadge.classList.toggle('hidden', due === 0);
        }
    },

    // Helper to update current filter display
    _updateCurrentFilterDisplay: () => {
        const currentFilterDisplay = state.elements['currentFilterDisplay'];
        if (!currentFilterDisplay) return;

        const targetTopicTitle =
            state.ui.activeTopicId === 'all'
                ? null
                : data.topicsData.find((t: Topic) => t.id === state.ui.activeTopicId)?.title;

        currentFilterDisplay.innerText = targetTopicTitle || 'All Problems';
    },

    // Helper to update sidebar statistics
    _updateSidebarStats: () => {
        const globalStats = utils.getUniqueProblemsForTopic('all');
        const percentage =
            globalStats.total > 0 ? Math.round((globalStats.solved / globalStats.total) * 100) : 0;

        const sidebarSolvedText = state.elements['sidebarSolvedText'];
        const sidebarSolvedBar = state.elements['sidebarSolvedBar'];

        if (sidebarSolvedText) {
            sidebarSolvedText.innerText = `${percentage}%`;
        }
        if (sidebarSolvedBar) {
            sidebarSolvedBar.style.width = `${globalStats.total > 0 ? (globalStats.solved / globalStats.total) * 100 : 0}%`;
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

    // Update statistics display
    updateStats: () => {
        const stats = utils.getUniqueProblemsForTopic(state.ui.activeTopicId);
        const { due } = stats;

        renderers._updateMainStats(stats);
        renderers._updateCurrentFilterDisplay();
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

        // Update all topic buttons in a single pass using dataset (compatible with mock)
        const topicBtns = document.querySelectorAll('.sidebar-link[data-topic-id]');
        topicBtns.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            const topicId = htmlBtn.dataset['topicId']; // Use dataset instead of getAttribute
            const stats = topicId ? statsCache.get(topicId) : null;
            if (stats) {
                const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
                const pctSpan = htmlBtn.querySelector('span:last-child');
                if (pctSpan) {
                    pctSpan.textContent = `${pct}%`;
                    pctSpan.className =
                        pct === 100
                            ? 'text-[10px] text-green-400 font-mono min-w-[24px] text-right transition-colors'
                            : 'text-[10px] text-theme-muted group-hover:text-theme-base font-mono min-w-[24px] text-right transition-colors';
                }
            }
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
