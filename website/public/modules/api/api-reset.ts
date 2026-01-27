// --- API RESET MODULE ---
// Reset operations

import { Topic, Pattern, ProblemDef, Problem } from '../types.js';
import { state } from '../state.js';
import { data } from '../data.js';
import { ui } from '../ui/ui.js';
import { renderers } from '../renderers.js';
import { utils } from '../utils.js';
import { saveData } from './api-save.js';

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
      * Restores deleted problems for the given problem IDs if they are not custom.
      * @param {Set<string>} problemIds - Set of problem IDs to restore.
      */
export const _restoreDeletedProblems = (problemIds: Set<string>): void => {
    problemIds.forEach((id: string) => {
        if (state.deletedProblemIds.has(id) && !id.startsWith('custom-')) {
            state.deletedProblemIds.delete(id);
            // Find probDef across all topics
            let probDef: string | ProblemDef | null = null;
            let topicTitle = '';
            let patternName = '';
            for (const topic of data.topicsData) {
                for (const pattern of topic.patterns) {
                    const found = pattern.problems.find((prob: string | ProblemDef) => (typeof prob === 'string' ? prob : prob.id) === id);
                    if (found) {
                        probDef = found;
                        topicTitle = topic.title;
                        patternName = pattern.name;
                        break;
                    }
                }
                if (probDef) break;
            }
            if (probDef) {
                const newProb: Problem = {
                    id: id,
                    name: typeof probDef === 'string' ? probDef : probDef.name,
                    url: typeof probDef === 'string' ? `https://leetcode.com/problems/${id}/` : probDef.url,
                    status: 'unsolved',
                    topic: topicTitle,
                    pattern: patternName,
                    reviewInterval: 0,
                    nextReviewDate: null,
                    note: '',
                    loading: false
                };
                state.problems.set(id, newProb);
            }
        }
    });
};

/**
      * Restores all deleted problems except custom ones.
      */
export const _restoreAllDeletedProblems = (): void => {
    const deletedIds = Array.from(state.deletedProblemIds) as string[];
    deletedIds.forEach((id: string) => {
        if (id.startsWith('custom-')) return; // Skip restoring custom problems
        state.deletedProblemIds.delete(id);
        // Try to find probDef across all topics first
        let probDef: string | ProblemDef | null = null;
        let topicTitle = '';
        let patternName = '';
        for (const topic of data.topicsData) {
            for (const pattern of topic.patterns) {
                const found = pattern.problems.find((prob: string | ProblemDef) => (typeof prob === 'string' ? prob : prob.id) === id);
                if (found) {
                    probDef = found;
                    topicTitle = topic.title;
                    patternName = pattern.name;
                    break;
                }
            }
            if (probDef) break;
        }

        // If not found in topicsData, create a basic problem object
        // This handles cases where custom problems were deleted
        const newProb: Problem = {
            id: id,
            name: probDef ? (typeof probDef === 'string' ? probDef : probDef.name) : id,
            url: probDef ? (typeof probDef === 'string' ? `https://leetcode.com/problems/${id}/` : probDef.url) : `https://leetcode.com/problems/${id}/`,
            status: 'unsolved',
            topic: topicTitle || 'Unknown',
            pattern: patternName || 'Unknown',
            reviewInterval: 0,
            nextReviewDate: null,
            note: '',
            loading: false
        };
        state.problems.set(id, newProb);
    });
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
    renderers.renderMainView(state.ui.activeTopicId);
    utils.showToast(message);

    // If the current filter is 'solved', refresh the cards to reflect the changes
    if (currentFilter === 'solved') {
        renderers.renderMainView(state.ui.activeTopicId);
    }
};

/**
      * Resets all problems to unsolved state and restores deleted problems.
      * @throws {Error} Throws an error if the reset fails.
      */
export const resetAll = async (): Promise<void> => {
    const confirmed = await ui.showConfirm('Are you sure you want to reset <b>ALL Problems</b>?</br></br>This will mark all problems as unsolved and restore any deleted problems across all categories.');
    if (!confirmed) return;

    // Store original state for rollback (deep copy)
    const originalProblems = new Map(
        Array.from(state.problems.entries() as IterableIterator<[string, Problem]>).map(([id, p]) => [id, { ...p }])
    );
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
        console.error('Reset all error:', e);
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
    const confirmed = await ui.showConfirm(`Are you sure you want to reset all problems in the category "<b>${topic.title}</b>"?</br></br>This will mark all problems as unsolved and restore any deleted problems.`);
    if (!confirmed) return;

    // Store original state for rollback (deep copy)
    const originalProblems = new Map(
        Array.from(state.problems.entries() as IterableIterator<[string, Problem]>).map(([id, p]) => [id, { ...p }])
    );
    const originalDeletedIds = new Set(state.deletedProblemIds);

    try {
        const categoryProblemIds = _getProblemIdsForTopic(topic);
        _resetProblems(categoryProblemIds);
        _restoreDeletedProblems(categoryProblemIds);
        await _performResetAndRender('Category problems reset and restored');
    } catch (e) {
        console.error('Reset category error:', e);
        // Restore original state on failure
        state.problems = originalProblems;
        state.deletedProblemIds = originalDeletedIds;
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to reset category: ${message}`);
        throw e;
    }
};