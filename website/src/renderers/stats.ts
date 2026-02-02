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

        // Refresh sidebar to update percentages
        renderers.renderSidebar();
    },

    // Update filter button states
    updateFilterBtns: () => {
        const filterBtns = state.elements['filterBtns'] as unknown as NodeListOf<HTMLElement>;
        filterBtns?.forEach((b: HTMLElement) => {
            if (b.dataset['filter'] === state.ui.currentFilter) {
                b.classList.add('bg-brand-600', 'text-white');
                b.classList.remove('text-theme-bold');
            } else {
                b.classList.remove('bg-brand-600', 'text-white');
                b.classList.add('text-theme-bold');
            }
        });
    },
};
