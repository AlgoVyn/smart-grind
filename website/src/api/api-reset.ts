// --- API RESET MODULE ---
// Reset operations

import { Topic, Pattern, ProblemDef, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { ALGORITHMS_DATA, AlgorithmCategory, AlgorithmDef } from '../data/algorithms-data';
import { ui } from '../ui/ui';
import { renderers } from '../renderers';
import { showToast } from '../utils';
import { saveData } from './api-save';

/**
 * Gets all problem IDs for a given topic.
 * @param {Object} topic - The topic object.
 * @param {Object[]} topic.patterns - Array of patterns in the topic.
 * @returns {Set<string>} Set of problem IDs.
 */
export const _getProblemIdsForTopic = (topic: Topic): Set<string> => {
    const ids = new Set<string>();
    topic.patterns.forEach((pattern: Pattern) => {
        pattern.problems.forEach((probDef: string | ProblemDef) => {
            ids.add(typeof probDef === 'string' ? probDef : probDef.id);
        });
    });
    return ids;
};

/**
 * Creates a deep copy of the current problems map for rollback purposes.
 */
const createProblemsBackup = () =>
    new Map(Array.from(state.problems.entries()).map(([id, p]) => [id, { ...p }]));

/**
 * Resets the specified problems to unsolved state.
 * @param {Set<string>} problemIds - Set of problem IDs to reset.
 */
export const _resetProblems = (problemIds: Set<string>): void => {
    problemIds.forEach((id: string) => {
        const p = state.problems.get(id);
        if (p) {
            p.status = 'unsolved';
            p.reviewInterval = 0;
            p.nextReviewDate = null;
        }
    });
};

/**
 * Finds problem definition info across all topics.
 * @param {string} id - The problem ID to find.
 * @returns {{ probDef: string | ProblemDef | null, topicTitle: string, patternName: string }}
 */
const findProblemDefInfo = (
    id: string
): { probDef: string | ProblemDef | null; topicTitle: string; patternName: string } => {
    for (const topic of data.topicsData) {
        for (const pattern of topic.patterns) {
            const found = pattern.problems.find(
                (prob: string | ProblemDef) => (typeof prob === 'string' ? prob : prob.id) === id
            );
            if (found) {
                return {
                    probDef: found,
                    topicTitle: topic.title,
                    patternName: pattern.name,
                };
            }
        }
    }
    return { probDef: null, topicTitle: '', patternName: '' };
};

/**
 * Creates a problem object from definition info.
 */
const createProblemFromDef = (
    id: string,
    probDef: string | ProblemDef | null,
    topicTitle: string,
    patternName: string
): Problem => ({
    id,
    name: probDef ? (typeof probDef === 'string' ? probDef : probDef.name) : id,
    url: probDef
        ? typeof probDef === 'string'
            ? `https://leetcode.com/problems/${id}/`
            : probDef.url
        : `https://leetcode.com/problems/${id}/`,
    status: 'unsolved' as const,
    topic: topicTitle || 'Unknown',
    pattern: patternName || 'Unknown',
    reviewInterval: 0,
    nextReviewDate: null,
    note: '',
    loading: false,
});

/**
 * Restores a single deleted problem if it's not custom.
 * @param {string} id - The problem ID to restore.
 * @returns {boolean} True if the problem was restored.
 */
const restoreDeletedProblem = (id: string): boolean => {
    if (!state.deletedProblemIds.has(id) || id.startsWith('custom-')) {
        return false;
    }
    state.deletedProblemIds.delete(id);
    const { probDef, topicTitle, patternName } = findProblemDefInfo(id);
    if (probDef) {
        state.problems.set(id, createProblemFromDef(id, probDef, topicTitle, patternName));
    }
    return true;
};

/**
 * Restores deleted problems for the given problem IDs if they are not custom.
 * @param {Set<string>} problemIds - Set of problem IDs to restore.
 */
export const _restoreDeletedProblems = (problemIds: Set<string>): void => {
    problemIds.forEach(restoreDeletedProblem);
};

/**
 * Restores all deleted problems except custom ones.
 */
export const _restoreAllDeletedProblems = (): void => {
    const deletedIds = Array.from(state.deletedProblemIds);
    deletedIds.forEach(restoreDeletedProblem);
};

/**
 * Performs the reset save operation and re-renders the UI with a toast message.
 * @param {string} message - The toast message to display.
 * @throws {Error} Throws an error if the save fails.
 */
export const _performResetAndRender = async (message: string): Promise<void> => {
    await saveData();
    const currentFilter = state.ui.currentFilter;
    renderers.updateFilterBtns();
    renderers.renderSidebar();

    // Check if we're in algorithms view and render appropriately
    if (state.ui.activeAlgorithmCategoryId) {
        const { renderers: renderersModule } = await import('../renderers');
        await renderersModule.renderAlgorithmsView(state.ui.activeAlgorithmCategoryId);
    } else {
        renderers.renderMainView(state.ui.activeTopicId);
    }

    showToast(message);

    // If the current filter is 'solved', refresh the cards to reflect the changes
    if (currentFilter === 'solved') {
        if (state.ui.activeAlgorithmCategoryId) {
            const { renderers: renderersModule } = await import('../renderers');
            await renderersModule.renderAlgorithmsView(state.ui.activeAlgorithmCategoryId);
        } else {
            renderers.renderMainView(state.ui.activeTopicId);
        }
    }
};

/**
 * Resets all problems to unsolved state and restores deleted problems.
 * @throws {Error} Throws an error if the reset fails.
 */
export const resetAll = async (): Promise<void> => {
    const confirmed = await ui.showConfirm(
        'Are you sure you want to reset <b>ALL Problems</b>?</br></br>This will mark all problems as unsolved and restore any deleted problems across all categories.'
    );
    if (!confirmed) return;

    // Store original state for rollback
    const originalProblems = createProblemsBackup();
    const originalDeletedIds = new Set(state.deletedProblemIds);

    try {
        // Reset topicsData to original to restore deleted categories
        data.resetTopicsData();
        // Reset ALL existing problems to unsolved state
        state.problems.forEach((p: Problem) => {
            p.status = 'unsolved';
            p.reviewInterval = 0;
            p.nextReviewDate = null;
        });
        // Restore ALL deleted problems, not just the ones in current topicsData
        _restoreAllDeletedProblems();
        await _performResetAndRender('All problems reset and restored');
    } catch (e) {
        // Restore original state on failure
        state.problems = originalProblems;
        state.deletedProblemIds = originalDeletedIds;
        const message = e instanceof Error ? e.message : 'Unknown error';
        ui.showAlert(`Failed to reset all problems: ${message}`);
        throw e;
    }
};

/**
 * Resets all problems in a category to unsolved state and restores deleted problems.
 * @param {string} topicId - The ID of the topic to reset.
 * @throws {Error} Throws an error if the reset fails.
 */
export const resetCategory = async (topicId: string): Promise<void> => {
    const topic = data.topicsData.find((t: Topic) => t.id === topicId);
    if (!topic) {
        ui.showAlert('Category not found.');
        return;
    }
    const confirmed = await ui.showConfirm(
        `Are you sure you want to reset all problems in the category "<b>${topic.title}</b>"?</br></br>This will mark all problems as unsolved and restore any deleted problems.`
    );
    if (!confirmed) return;

    // Store original state for rollback
    const originalProblems = createProblemsBackup();
    const originalDeletedIds = new Set(state.deletedProblemIds);

    try {
        const categoryProblemIds = _getProblemIdsForTopic(topic);
        _resetProblems(categoryProblemIds);
        _restoreDeletedProblems(categoryProblemIds);
        await _performResetAndRender('Category problems reset and restored');
    } catch (e) {
        // Restore original state on failure
        state.problems = originalProblems;
        state.deletedProblemIds = originalDeletedIds;
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to reset category: ${message}`);
        throw e;
    }
};

/**
 * Gets all algorithm IDs for a given category.
 * @param {string} categoryId - The ID of the algorithm category.
 * @returns {Set<string>} Set of algorithm IDs.
 */
export const _getAlgorithmIdsForCategory = (categoryId: string): Set<string> => {
    const ids = new Set<string>();
    if (categoryId === 'all') {
        // Get all algorithm IDs across all categories
        ALGORITHMS_DATA.forEach((category: AlgorithmCategory) => {
            category.algorithms.forEach((algo) => {
                ids.add(algo.id);
            });
        });
    } else {
        // Get algorithm IDs for specific category
        const category = ALGORITHMS_DATA.find((c: AlgorithmCategory) => c.id === categoryId);
        if (category) {
            category.algorithms.forEach((algo) => {
                ids.add(algo.id);
            });
        }
    }
    return ids;
};

/**
 * Restores deleted algorithms for the given algorithm IDs.
 * @param {Set<string>} algorithmIds - Set of algorithm IDs to restore.
 */
export const _restoreDeletedAlgorithms = (algorithmIds: Set<string>): void => {
    algorithmIds.forEach((id: string) => {
        if (!state.deletedProblemIds.has(id)) {
            return;
        }
        state.deletedProblemIds.delete(id);

        // Find the algorithm definition
        let algoDef: AlgorithmDef | undefined;
        for (const category of ALGORITHMS_DATA) {
            algoDef = category.algorithms.find((a) => a.id === id);
            if (algoDef) break;
        }

        if (algoDef) {
            // Find which category this algorithm belongs to
            const category = ALGORITHMS_DATA.find((c) => c.algorithms.some((a) => a.id === id));
            state.problems.set(id, {
                id: algoDef.id,
                name: algoDef.name,
                url: algoDef.url,
                status: 'unsolved',
                topic: category?.id || 'unknown',
                pattern: 'Algorithms',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
                loading: false,
                noteVisible: false,
            });
        }
    });
};

/**
 * Resets all algorithms in a category to unsolved state and restores deleted algorithms.
 * @param {string} categoryId - The ID of the algorithm category to reset.
 * @throws {Error} Throws an error if the reset fails.
 */
export const resetAlgorithmCategory = async (categoryId: string): Promise<void> => {
    const category = ALGORITHMS_DATA.find((c: AlgorithmCategory) => c.id === categoryId);
    const title = categoryId === 'all' ? 'All Algorithms' : category?.title || 'Unknown Category';

    const confirmed = await ui.showConfirm(
        `Are you sure you want to reset <b>${title}</b>?</br></br>This will mark all algorithms as unsolved and restore any deleted algorithms.`
    );
    if (!confirmed) return;

    // Store original state for rollback
    const originalProblems = createProblemsBackup();
    const originalDeletedIds = new Set(state.deletedProblemIds);

    try {
        const algorithmIds = _getAlgorithmIdsForCategory(categoryId);
        _resetProblems(algorithmIds);
        _restoreDeletedAlgorithms(algorithmIds);
        await _performResetAndRender(`${title} reset and restored successfully`);
    } catch (e) {
        // Restore original state on failure
        state.problems = originalProblems;
        state.deletedProblemIds = originalDeletedIds;
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to reset algorithm category: ${message}`);
        throw e;
    }
};
