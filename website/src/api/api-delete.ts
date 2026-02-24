// --- API DELETE MODULE ---
// Delete operations

import { Topic, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { ALGORITHMS_DATA, AlgorithmCategory } from '../data/algorithms-data';
import { ui } from '../ui/ui';
import { renderers } from '../renderers';
import { utils } from '../utils';
import { saveData } from './api-save';

/**
 * Helper to validate and get confirmation for category deletion.
 * @param {string} topicId - The ID of the topic to validate.
 * @returns {Promise<Topic | null>} The topic object if confirmed, null otherwise.
 */
export const _validateCategoryDeletion = async (topicId: string): Promise<Topic | null> => {
    const topic = data.topicsData.find((t: Topic) => t.id === topicId);
    if (!topic) {
        ui.showAlert('Category not found.');
        return null;
    }

    const confirmed = await ui.showConfirm(
        `Are you sure you want to delete the category "<b>${topic.title}</b>" and all its associated problems? This action cannot be undone.`
    );

    return confirmed ? topic : null;
};

/**
 * Helper to store original state for rollback in case of deletion failure.
 * @returns {Object} The original state object containing topicsData, problems, deletedProblemIds, and activeTopicId.
 */
export const _storeOriginalState = () => ({
    topicsData: [...data.topicsData],
    problems: new Map(
        Array.from(state.problems.entries() as IterableIterator<[string, Problem]>).map(
            ([id, p]) => [id, { ...p }]
        )
    ),
    deletedProblemIds: new Set(state.deletedProblemIds),
    activeTopicId: state.ui.activeTopicId,
});

/**
 * Helper to remove category and associated problems from the data structures.
 * @param {Topic} topic - The topic object to remove.
 */
export const _removeCategoryAndProblems = (topic: Topic) => {
    // Remove from topicsData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index = (data.topicsData as unknown as Array<{ id: string }>).findIndex(
        (t) => t.id === topic.id
    );
    if (index > -1) data.topicsData.splice(index, 1);

    // Remove associated problems
    const problemsToDelete: string[] = [];
    state.problems.forEach((p: Problem, id: string) => {
        if (p.topic === topic.title) {
            problemsToDelete.push(id);
        }
    });
    problemsToDelete.forEach((id) => {
        state.problems.delete(id);
        state.deletedProblemIds.add(id);
    });
};

/**
 * Helper to remove algorithm category and associated algorithms from the data structures.
 * @param {string} categoryId - The ID of the algorithm category to remove.
 * @param {string} categoryTitle - The title of the algorithm category.
 */
export const _removeAlgorithmCategoryAndProblems = (categoryId: string, categoryTitle: string) => {
    // Remove associated algorithms (algorithms have pattern='Algorithms' and topic=categoryId)
    const problemsToDelete: string[] = [];
    state.problems.forEach((p: Problem, id: string) => {
        if (p.pattern === 'Algorithms' && (p.topic === categoryId || p.topic === categoryTitle)) {
            problemsToDelete.push(id);
        }
    });
    problemsToDelete.forEach((id) => {
        state.problems.delete(id);
        state.deletedProblemIds.add(id);
    });
};

/**
 * Helper to handle active topic switching when a topic is deleted.
 * @param {string} topicId - The ID of the deleted topic.
 */
export const _handleActiveTopicSwitch = (topicId: string) => {
    if (state.ui.activeTopicId === topicId) {
        state.ui.activeTopicId = 'all';
        utils.updateUrlParameter('category', null);
    }
};

/**
 * Helper to restore original state on error during deletion.
 * @param {Object} originalState - The original state object to restore.
 * @param {Topic[]} originalState.topicsData - The original topics data.
 * @param {Map<string, Problem>} originalState.problems - The original problems map.
 * @param {Set<string>} originalState.deletedProblemIds - The original deleted problem IDs set.
 * @param {string} originalState.activeTopicId - The original active topic ID.
 */
export const _restoreOriginalState = (originalState: {
    topicsData: Topic[];
    problems: Map<string, Problem>;
    deletedProblemIds: Set<string>;
    activeTopicId: string;
}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.topicsData = originalState.topicsData as unknown as typeof data.topicsData;
    state.problems = originalState.problems;
    state.deletedProblemIds = originalState.deletedProblemIds;
    state.ui.activeTopicId = originalState.activeTopicId;
};

/**
 * Deletes an entire category and all its associated problems.
 * @param {string} topicId - The ID of the topic to delete.
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deleteCategory = async (topicId: string): Promise<void> => {
    const topic = await _validateCategoryDeletion(topicId);
    if (!topic) return;

    const originalState = _storeOriginalState();

    try {
        _removeCategoryAndProblems(topic);
        _handleActiveTopicSwitch(topicId);

        // Save
        await saveData();

        // Re-render
        renderers.renderSidebar();
        renderers.renderMainView(state.ui.activeTopicId);
        utils.showToast('Category and associated problems removed');
    } catch (e) {
        // Restore original state on failure
        _restoreOriginalState(originalState);
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to delete category: ${message}`);
        throw e;
    }
};

/**
 * Deletes an algorithm category and all its associated algorithms.
 * @param {string} categoryId - The ID of the algorithm category to delete.
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deleteAlgorithmCategory = async (categoryId: string): Promise<void> => {
    const category = ALGORITHMS_DATA.find((c: AlgorithmCategory) => c.id === categoryId);
    if (!category) {
        ui.showAlert('Algorithm category not found.');
        return;
    }

    const confirmed = await ui.showConfirm(
        `Are you sure you want to delete the algorithm category "<b>${category.title}</b>" and all its associated algorithms? This action cannot be undone.`
    );
    if (!confirmed) return;

    const originalState = _storeOriginalState();

    try {
        _removeAlgorithmCategoryAndProblems(categoryId, category.title);

        // Save
        await saveData();

        // Re-render
        renderers.renderSidebar();
        // Re-render algorithms view to show updated state
        const { renderers: renderersModule } = await import('../renderers');
        await renderersModule.renderAlgorithmsView(categoryId);
        utils.showToast('Algorithm category and associated algorithms removed');
    } catch (e) {
        // Restore original state on failure
        _restoreOriginalState(originalState);
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to delete algorithm category: ${message}`);
        throw e;
    }
};
