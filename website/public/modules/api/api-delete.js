// --- API DELETE MODULE ---
// Delete operations

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    /**
     * Deletes an entire category and all its associated problems.
     * @param {string} topicId - The ID of the topic to delete.
     * @throws {Error} Throws an error if the deletion fails.
     */
    deleteCategory: async (topicId) => {
        const topic = window.SmartGrind.data.topicsData.find(t => t.id === topicId);
        if (!topic) {
            window.SmartGrind.ui.showAlert('Category not found.');
            return;
        }
        const confirmed = await window.SmartGrind.ui.showConfirm(`Are you sure you want to delete the category "<b>${topic.title}</b>" and all its associated problems? This action cannot be undone.`);
        if (!confirmed) return;

        // Store original state for rollback
        const originalTopicsData = [...window.SmartGrind.data.topicsData];
        const originalProblems = new Map(
            Array.from(window.SmartGrind.state.problems.entries()).map(([id, p]) => [id, { ...p }])
        );
        const originalDeletedIds = new Set(window.SmartGrind.state.deletedProblemIds);
        const originalActiveTopicId = window.SmartGrind.state.ui.activeTopicId;

        try {
            // Remove from topicsData
            const index = window.SmartGrind.data.topicsData.indexOf(topic);
            if (index > -1) window.SmartGrind.data.topicsData.splice(index, 1);

            // Remove associated problems
            const problemsToDelete = [];
            window.SmartGrind.state.problems.forEach((p, id) => {
                if (p.topic === topic.title) {
                    problemsToDelete.push(id);
                }
            });
            problemsToDelete.forEach(id => {
                window.SmartGrind.state.problems.delete(id);
                window.SmartGrind.state.deletedProblemIds.add(id);
            });

            // If active, switch to all
            if (window.SmartGrind.state.ui.activeTopicId === topicId) {
                window.SmartGrind.state.ui.activeTopicId = 'all';
                window.SmartGrind.utils.updateUrlParameter('category', null);
            }

            // Save
            await window.SmartGrind.api.saveData();

            // Re-render
            window.SmartGrind.renderers.renderSidebar();
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
            window.SmartGrind.utils.showToast('Category and associated problems removed');
        } catch (e) {
            console.error('Delete category error:', e);
            // Restore original state on failure
            window.SmartGrind.data.topicsData = originalTopicsData;
            window.SmartGrind.state.problems = originalProblems;
            window.SmartGrind.state.deletedProblemIds = originalDeletedIds;
            window.SmartGrind.state.ui.activeTopicId = originalActiveTopicId;
            window.SmartGrind.ui.showAlert(`Failed to delete category: ${e.message}`);
            throw e;
        }
    }
});