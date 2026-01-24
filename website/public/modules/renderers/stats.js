// --- STATS RENDERERS MODULE ---
// Statistics and filter rendering functions

export const statsRenderers = {
    // Helper to update main dashboard statistics
    _updateMainStats: (stats) => {
        const { total, solved, due } = stats;
        const percentage = total > 0 ? (solved / total) * 100 : 0;

        // Update main dashboard stats safely
        if (window.SmartGrind.state.elements.mainTotalText) window.SmartGrind.state.elements.mainTotalText.innerText = total;
        if (window.SmartGrind.state.elements.mainSolvedText) window.SmartGrind.state.elements.mainSolvedText.innerText = solved;
        if (window.SmartGrind.state.elements.mainDueText) window.SmartGrind.state.elements.mainDueText.innerText = due;
        if (window.SmartGrind.state.elements.mainSolvedBar) window.SmartGrind.state.elements.mainSolvedBar.style.width = `${percentage}%`;
        if (window.SmartGrind.state.elements.mainDueBadge) {
            window.SmartGrind.state.elements.mainDueBadge.classList.toggle('hidden', due === 0);
        }
    },

    // Helper to update current filter display
    _updateCurrentFilterDisplay: () => {
        if (!window.SmartGrind.state.elements.currentFilterDisplay) return;

        const targetTopicTitle = window.SmartGrind.state.ui.activeTopicId === 'all' ? null :
            window.SmartGrind.data.topicsData.find(t => t.id === window.SmartGrind.state.ui.activeTopicId)?.title;

        window.SmartGrind.state.elements.currentFilterDisplay.innerText = targetTopicTitle || "All Problems";
    },

    // Helper to update sidebar statistics
    _updateSidebarStats: () => {
        const globalStats = window.SmartGrind.utils.getUniqueProblemsForTopic('all');
        const percentage = globalStats.total > 0 ? Math.round((globalStats.solved / globalStats.total) * 100) : 0;

        if (window.SmartGrind.state.elements.sidebarSolvedText) {
            window.SmartGrind.state.elements.sidebarSolvedText.innerText = `${percentage}%`;
        }
        if (window.SmartGrind.state.elements.sidebarSolvedBar) {
            window.SmartGrind.state.elements.sidebarSolvedBar.style.width = `${globalStats.total > 0 ? (globalStats.solved / globalStats.total) * 100 : 0}%`;
        }
    },

    // Helper to update review banner
    _updateReviewBanner: (due) => {
        if (due > 0) {
            window.SmartGrind.state.elements.reviewBanner.classList.remove('hidden');
            window.SmartGrind.state.elements.reviewCountBanner.innerText = due;
        } else {
            window.SmartGrind.state.elements.reviewBanner.classList.add('hidden');
        }
    },

    // Update statistics display
    updateStats: () => {
        const stats = window.SmartGrind.utils.getUniqueProblemsForTopic(window.SmartGrind.state.ui.activeTopicId);
        const { due } = stats;

        window.SmartGrind.renderers._updateMainStats(stats);
        window.SmartGrind.renderers._updateCurrentFilterDisplay();
        window.SmartGrind.renderers._updateSidebarStats();
        window.SmartGrind.renderers._updateReviewBanner(due);

        // Refresh sidebar to update percentages
        window.SmartGrind.renderers.renderSidebar();
    },

    // Update filter button states
    updateFilterBtns: () => {
        window.SmartGrind.state.elements.filterBtns.forEach(b => {
            if (b.dataset.filter === window.SmartGrind.state.ui.currentFilter) {
                b.classList.add('bg-brand-600', 'text-white');
                b.classList.remove('text-theme-bold');
            } else {
                b.classList.remove('bg-brand-600', 'text-white');
                b.classList.add('text-theme-bold');
            }
        });
    }
};