// --- API DELETE MODULE ---
// Delete operations

import { Topic, Problem } from '../types.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    /**
   * Helper to validate and get confirmation for category deletion.
   * @param {string} topicId - The ID of the topic to validate.
   * @returns {Promise<Topic | null>} The topic object if confirmed, null otherwise.
   */
    _validateCategoryDeletion: async (topicId: string): Promise<Topic | null> => {
        const topic = window.SmartGrind.data.topicsData.find((t: Topic) => t.id === topicId);
        if (!topic) {
            window.SmartGrind.ui.showAlert('Category not found.');
            return null;
        }

        const confirmed = await window.SmartGrind.ui.showConfirm(
            `Are you sure you want to delete the category "<b>${topic.title}</b>" and all its associated problems? This action cannot be undone.`
        );

        return confirmed ? topic : null;
    },

    /**
     * Helper to store original state for rollback in case of deletion failure.
     * @returns {Object} The original state object containing topicsData, problems, deletedProblemIds, and activeTopicId.
     */
    _storeOriginalState: () => ({
        topicsData: [...window.SmartGrind.data.topicsData],
        problems: new Map(
            Array.from(window.SmartGrind.state.problems.entries() as IterableIterator<[string, Problem]>).map(([id, p]) => [id, { ...p }])
        ),
        deletedProblemIds: new Set(window.SmartGrind.state.deletedProblemIds),
        activeTopicId: window.SmartGrind.state.ui.activeTopicId
    }),

    /**
     * Helper to remove category and associated problems from the data structures.
     * @param {Topic} topic - The topic object to remove.
     */
    _removeCategoryAndProblems: (topic: Topic) => {
    // Remove from topicsData
        const index = window.SmartGrind.data.topicsData.indexOf(topic);
        if (index > -1) window.SmartGrind.data.topicsData.splice(index, 1);

        // Remove associated problems
        const problemsToDelete: string[] = [];
        window.SmartGrind.state.problems.forEach((p: Problem, id: string) => {
            if (p.topic === topic.title) {
                problemsToDelete.push(id);
            }
        });
        problemsToDelete.forEach(id => {
            window.SmartGrind.state.problems.delete(id);
            window.SmartGrind.state.deletedProblemIds.add(id);
        });
    },

    /**
     * Helper to handle active topic switching when a topic is deleted.
     * @param {string} topicId - The ID of the deleted topic.
     */
    _handleActiveTopicSwitch: (topicId: string) => {
        if (window.SmartGrind.state.ui.activeTopicId === topicId) {
            window.SmartGrind.state.ui.activeTopicId = 'all';
            window.SmartGrind.utils.updateUrlParameter('category', null);
        }
    },

    /**
     * Helper to restore original state on error during deletion.
     * @param {Object} originalState - The original state object to restore.
     * @param {Topic[]} originalState.topicsData - The original topics data.
     * @param {Map<string, Problem>} originalState.problems - The original problems map.
     * @param {Set<string>} originalState.deletedProblemIds - The original deleted problem IDs set.
     * @param {string} originalState.activeTopicId - The original active topic ID.
     */
    _restoreOriginalState: (originalState: { topicsData: Topic[]; problems: Map<string, Problem>; deletedProblemIds: Set<string>; activeTopicId: string }) => {
        window.SmartGrind.data.topicsData = originalState.topicsData;
        window.SmartGrind.state.problems = originalState.problems;
        window.SmartGrind.state.deletedProblemIds = originalState.deletedProblemIds;
        window.SmartGrind.state.ui.activeTopicId = originalState.activeTopicId;
    },

    /**
      * Deletes an entire category and all its associated problems.
      * @param {string} topicId - The ID of the topic to delete.
      * @throws {Error} Throws an error if the deletion fails.
      */
    deleteCategory: async (topicId: string): Promise<void> => {
        const topic = await window.SmartGrind.api._validateCategoryDeletion(topicId);
        if (!topic) return;

        const originalState = window.SmartGrind.api._storeOriginalState();

        try {
            window.SmartGrind.api._removeCategoryAndProblems(topic);
            window.SmartGrind.api._handleActiveTopicSwitch(topicId);

            // Save
            await window.SmartGrind.api.saveData();

            // Re-render
            window.SmartGrind.renderers.renderSidebar();
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
            window.SmartGrind.utils.showToast('Category and associated problems removed');
        } catch (e) {
            console.error('Delete category error:', e);
            // Restore original state on failure
            window.SmartGrind.api._restoreOriginalState(originalState);
            const message = e instanceof Error ? e.message : String(e);
            window.SmartGrind.ui.showAlert(`Failed to delete category: ${message}`);
            throw e;
        }
    }
});