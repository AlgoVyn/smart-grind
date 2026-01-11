// --- STATS RENDERERS MODULE ---
// Statistics and filter rendering functions

export const statsRenderers = {
    // Update statistics display
    updateStats: () => {
        const stats = window.SmartGrind.utils.getUniqueProblemsForTopic(window.SmartGrind.state.ui.activeTopicId);
        const { total, solved, due } = stats;

        const targetTopicTitle = window.SmartGrind.state.ui.activeTopicId === 'all' ? null :
            window.SmartGrind.data.topicsData.find(t => t.id === window.SmartGrind.state.ui.activeTopicId)?.title;

        // Update main dashboard stats safely
        if (window.SmartGrind.state.elements.mainTotalText) window.SmartGrind.state.elements.mainTotalText.innerText = total;
        if (window.SmartGrind.state.elements.mainSolvedText) window.SmartGrind.state.elements.mainSolvedText.innerText = solved;
        if (window.SmartGrind.state.elements.mainDueText) window.SmartGrind.state.elements.mainDueText.innerText = due;
        if (window.SmartGrind.state.elements.mainSolvedBar) window.SmartGrind.state.elements.mainSolvedBar.style.width = `${total > 0 ? (solved / total) * 100 : 0}%`;
        if (window.SmartGrind.state.elements.mainDueBadge) {
            if (due > 0) window.SmartGrind.state.elements.mainDueBadge.classList.remove('hidden');
            else window.SmartGrind.state.elements.mainDueBadge.classList.add('hidden');
        }

        // Update "Current Category" text box
        if (window.SmartGrind.state.elements.currentFilterDisplay) {
            window.SmartGrind.state.elements.currentFilterDisplay.innerText = targetTopicTitle || "All Problems";
        }

        // Also calculate global stats for sidebar
        const globalStats = window.SmartGrind.utils.getUniqueProblemsForTopic('all');
        if (window.SmartGrind.state.elements.sidebarSolvedText) window.SmartGrind.state.elements.sidebarSolvedText.innerText = globalStats.total > 0 ? `${Math.round((globalStats.solved / globalStats.total) * 100)}%` : '0%';
        if (window.SmartGrind.state.elements.sidebarSolvedBar) window.SmartGrind.state.elements.sidebarSolvedBar.style.width = globalStats.total > 0 ? `${(globalStats.solved / globalStats.total) * 100}%` : '0%';

        if (due > 0) {
            window.SmartGrind.state.elements.reviewBanner.classList.remove('hidden');
            window.SmartGrind.state.elements.reviewCountBanner.innerText = due;
        } else {
            window.SmartGrind.state.elements.reviewBanner.classList.add('hidden');
        }

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