// --- API RESET MODULE ---
// Reset operations

import { Topic, Pattern, ProblemDef, Problem } from '../types.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    /**
      * Gets all problem IDs for a given topic.
      * @param {Object} topic - The topic object.
      * @param {Object[]} topic.patterns - Array of patterns in the topic.
      * @returns {Set<string>} Set of problem IDs.
      */
    _getProblemIdsForTopic: (topic: Topic): Set<string> => {
        const ids = new Set<string>();
        topic.patterns.forEach((pattern: Pattern) => {
            pattern.problems.forEach((probDef: string | ProblemDef) => {
                ids.add(typeof probDef === 'string' ? probDef : probDef.id);
            });
        });
        return ids;
    },

    /**
      * Resets the specified problems to unsolved state.
      * @param {Set<string>} problemIds - Set of problem IDs to reset.
      */
    _resetProblems: (problemIds: Set<string>): void => {
        problemIds.forEach((id: string) => {
            const p = window.SmartGrind.state.problems.get(id);
            if (p) {
                p.status = 'unsolved';
                p.reviewInterval = 0;
                p.nextReviewDate = null;
            }
        });
    },

    /**
      * Restores deleted problems for the given problem IDs if they are not custom.
      * @param {Set<string>} problemIds - Set of problem IDs to restore.
      */
    _restoreDeletedProblems: (problemIds: Set<string>): void => {
        problemIds.forEach((id: string) => {
            if (window.SmartGrind.state.deletedProblemIds.has(id) && !id.startsWith('custom-')) {
                window.SmartGrind.state.deletedProblemIds.delete(id);
                // Find probDef across all topics
                let probDef: string | ProblemDef | null = null;
                let topicTitle = '';
                let patternName = '';
                for (const topic of window.SmartGrind.data.topicsData) {
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
                    window.SmartGrind.state.problems.set(id, newProb);
                }
            }
        });
    },

    /**
      * Restores all deleted problems except custom ones.
      */
    _restoreAllDeletedProblems: (): void => {
        const deletedIds = Array.from(window.SmartGrind.state.deletedProblemIds) as string[];
        deletedIds.forEach((id: string) => {
            if (id.startsWith('custom-')) return; // Skip restoring custom problems
            window.SmartGrind.state.deletedProblemIds.delete(id);
            // Try to find probDef across all topics first
            let probDef: string | ProblemDef | null = null;
            let topicTitle = '';
            let patternName = '';
            for (const topic of window.SmartGrind.data.topicsData) {
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
            window.SmartGrind.state.problems.set(id, newProb);
        });
    },

    /**
      * Performs the reset save operation and re-renders the UI with a toast message.
      * @param {string} message - The toast message to display.
      * @throws {Error} Throws an error if the save fails.
      */
    _performResetAndRender: async (message: string): Promise<void> => {
        await window.SmartGrind.api.saveData();
        const currentFilter = window.SmartGrind.state.ui.currentFilter;
        window.SmartGrind.renderers.updateFilterBtns();
        window.SmartGrind.renderers.renderSidebar();
        window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
        window.SmartGrind.utils.showToast(message);

        // If the current filter is 'solved', refresh the cards to reflect the changes
        if (currentFilter === 'solved') {
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
        }
    },

    /**
      * Resets all problems to unsolved state and restores deleted problems.
      * @throws {Error} Throws an error if the reset fails.
      */
    resetAll: async (): Promise<void> => {
        const confirmed = await window.SmartGrind.ui.showConfirm('Are you sure you want to reset <b>ALL Problems</b>?</br></br>This will mark all problems as unsolved and restore any deleted problems across all categories.');
        if (!confirmed) return;

        // Store original state for rollback (deep copy)
        const originalProblems = new Map(
            Array.from(window.SmartGrind.state.problems.entries() as IterableIterator<[string, Problem]>).map(([id, p]) => [id, { ...p }])
        );
        const originalDeletedIds = new Set(window.SmartGrind.state.deletedProblemIds);

        try {
            // Reset topicsData to original to restore deleted categories
            window.SmartGrind.data.resetTopicsData();
            // Reset ALL existing problems to unsolved state
            window.SmartGrind.state.problems.forEach((p: Problem) => {
                p.status = 'unsolved';
                p.reviewInterval = 0;
                p.nextReviewDate = null;
            });
            // Restore ALL deleted problems, not just the ones in current topicsData
            window.SmartGrind.api._restoreAllDeletedProblems();
            await window.SmartGrind.api._performResetAndRender('All problems reset and restored');
        } catch (e) {
            console.error('Reset all error:', e);
            // Restore original state on failure
            window.SmartGrind.state.problems = originalProblems;
            window.SmartGrind.state.deletedProblemIds = originalDeletedIds;
            const message = e instanceof Error ? e.message : 'Unknown error';
            window.SmartGrind.ui.showAlert(`Failed to reset all problems: ${message}`);
            throw e;
        }
    },

    /**
      * Resets all problems in a category to unsolved state and restores deleted problems.
      * @param {string} topicId - The ID of the topic to reset.
      * @throws {Error} Throws an error if the reset fails.
      */
    resetCategory: async (topicId: string): Promise<void> => {
        const topic = window.SmartGrind.data.topicsData.find((t: Topic) => t.id === topicId);
        if (!topic) {
            window.SmartGrind.ui.showAlert('Category not found.');
            return;
        }
        const confirmed = await window.SmartGrind.ui.showConfirm(`Are you sure you want to reset all problems in the category "<b>${topic.title}</b>"?</br></br>This will mark all problems as unsolved and restore any deleted problems.`);
        if (!confirmed) return;

        // Store original state for rollback (deep copy)
        const originalProblems = new Map(
            Array.from(window.SmartGrind.state.problems.entries() as IterableIterator<[string, Problem]>).map(([id, p]) => [id, { ...p }])
        );
        const originalDeletedIds = new Set(window.SmartGrind.state.deletedProblemIds);

        try {
            const categoryProblemIds = window.SmartGrind.api._getProblemIdsForTopic(topic);
            window.SmartGrind.api._resetProblems(categoryProblemIds);
            window.SmartGrind.api._restoreDeletedProblems(categoryProblemIds);
            await window.SmartGrind.api._performResetAndRender('Category problems reset and restored');
        } catch (e) {
            console.error('Reset category error:', e);
            // Restore original state on failure
            window.SmartGrind.state.problems = originalProblems;
            window.SmartGrind.state.deletedProblemIds = originalDeletedIds;
            const message = e instanceof Error ? e.message : String(e);
            window.SmartGrind.ui.showAlert(`Failed to reset category: ${message}`);
            throw e;
        }
    }
});