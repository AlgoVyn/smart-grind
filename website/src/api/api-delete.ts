// --- API DELETE MODULE ---
// Delete operations

import { Topic, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { ALGORITHMS_DATA, AlgorithmCategory } from '../data/algorithms-data';
import { SQL_DATA, SQLCategory } from '../data/sql-data';
import { showAlert, showConfirm } from '../ui/ui-modals';
import { renderSidebar, renderMainView, renderAlgorithmsView, renderSQLView } from '../renderers';
import { updateUrlParameter, showToast } from '../utils';
import { saveData } from './api-save';

/**
 * Helper to validate and get confirmation for category deletion.
 * @param {string} topicId - The ID of the topic to validate.
 * @returns {Promise<Topic | null>} The topic object if confirmed, null otherwise.
 */
export const _validateCategoryDeletion = async (topicId: string): Promise<Topic | null> => {
    const topic = data.topicsData.find((t: Topic) => t.id === topicId);
    if (!topic) {
        showAlert('Category not found.');
        return null;
    }

    const confirmed = await showConfirm(
        `Are you sure you want to delete the category "<b>${topic.title}</b>" and all its associated problems? This action cannot be undone.`
    );

    return confirmed ? topic : null;
};

/**
 * Helper to store original state for rollback in case of deletion failure.
 * @returns {Object} The original state object containing topicsData, problems, deletedProblemIds, and activeTopicId.
 */
export const _storeOriginalState = (): {
    topicsData: Topic[];
    problems: Map<string, Problem>;
    deletedProblemIds: Set<string>;
    activeTopicId: string;
} => ({
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
export const _removeCategoryAndProblems = (topic: Topic): void => {
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
export const _removeAlgorithmCategoryAndProblems = (
    categoryId: string,
    categoryTitle: string
): void => {
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
 * Helper to remove SQL category and associated SQL problems from the data structures.
 * @param {string} categoryId - The ID of the SQL category to remove.
 * @param {string} categoryTitle - The title of the SQL category.
 */
export const _removeSQLCategoryAndProblems = (categoryId: string, categoryTitle: string): void => {
    // Remove associated SQL problems (SQL problems have IDs starting with 'sql-')
    const problemsToDelete: string[] = [];
    state.problems.forEach((p: Problem, id: string) => {
        if (p.id.startsWith('sql-') && (p.topic === categoryId || p.topic === categoryTitle)) {
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
export const _handleActiveTopicSwitch = (topicId: string): void => {
    if (state.ui.activeTopicId === topicId) {
        state.ui.activeTopicId = '';
        updateUrlParameter('category', null);
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
}): void => {
    // Clear and repopulate to maintain reference (don't reassign data.topicsData)
    data.topicsData.length = 0;
    data.topicsData.push(...originalState.topicsData);
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
        renderSidebar();
        renderMainView(state.ui.activeTopicId);
        showToast('Category and associated problems removed');
    } catch (e) {
        // Restore original state on failure
        _restoreOriginalState(originalState);
        const message = e instanceof Error ? e.message : String(e);
        showAlert(`Failed to delete category: ${message}`);
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
        showAlert('Algorithm category not found.');
        return;
    }

    const confirmed = await showConfirm(
        `Are you sure you want to delete the algorithm category "<b>${category.title}</b>" and all its associated algorithms? This action cannot be undone.`
    );
    if (!confirmed) return;

    const originalState = _storeOriginalState();

    try {
        _removeAlgorithmCategoryAndProblems(categoryId, category.title);

        // Save
        await saveData();

        // Re-render
        renderSidebar();
        // Re-render algorithms view to show updated state
        await renderAlgorithmsView(categoryId);
        showToast('Algorithm category and associated algorithms removed');
    } catch (e) {
        // Restore original state on failure
        _restoreOriginalState(originalState);
        const message = e instanceof Error ? e.message : String(e);
        showAlert(`Failed to delete algorithm category: ${message}`);
        throw e;
    }
};

/**
 * Deletes a SQL category and all its associated SQL problems.
 * @param {string} categoryId - The ID of the SQL category to delete.
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deleteSQLCategory = async (categoryId: string): Promise<void> => {
    const category = SQL_DATA.find((c: SQLCategory) => c.id === categoryId);
    if (!category) {
        showAlert('SQL category not found.');
        return;
    }

    const confirmed = await showConfirm(
        `Are you sure you want to delete the SQL category "<b>${category.title}</b>" and all its associated SQL problems? This action cannot be undone.`
    );
    if (!confirmed) return;

    const originalState = _storeOriginalState();

    try {
        _removeSQLCategoryAndProblems(categoryId, category.title);

        // Handle active SQL category switch
        if (state.ui.activeSQLCategoryId === categoryId) {
            state.ui.activeSQLCategoryId = '';
            updateUrlParameter('sql', null);
        }

        // Save
        await saveData();

        // Re-render
        renderSidebar();
        // Re-render SQL view to show updated state
        await renderSQLView(categoryId);
        showToast('SQL category and associated SQL problems removed');
    } catch (e) {
        // Restore original state on failure
        _restoreOriginalState(originalState);
        const message = e instanceof Error ? e.message : String(e);
        showAlert(`Failed to delete SQL category: ${message}`);
        throw e;
    }
};
