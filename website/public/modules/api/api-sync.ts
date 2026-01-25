// --- API SYNC MODULE ---
// Syncing and merging operations

import { Topic, Pattern, ProblemDef, Problem } from '../types.js';

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    /**
      * Syncs the current problems with the static problem plan, adding new problems and updating metadata.
      * @throws {Error} Throws an error if syncing fails.
      */
    syncPlan: async (): Promise<void> => {
        try {
            let changed = false;
            const saveObj = Object.fromEntries(window.SmartGrind.state.problems);

            // Iterate through all predefined problems in topicsData
            window.SmartGrind.data.topicsData.forEach((topic: Topic) => {
                topic.patterns.forEach((pat: Pattern) => {
                    pat.problems.forEach((probDef: string | ProblemDef) => {
                        const id = typeof probDef === 'string' ? probDef : probDef.id;

                        // Add new problems if not present and not deleted
                        if (!window.SmartGrind.state.problems.has(id) && !window.SmartGrind.state.deletedProblemIds.has(id)) {
                            const newProb: Problem = {
                                id: id,
                                name: typeof probDef === 'string' ? probDef : probDef.name,
                                url: typeof probDef === 'string' ? `https://leetcode.com/problems/${id}/` : probDef.url,
                                status: 'unsolved',
                                topic: topic.title,
                                pattern: pat.name,
                                reviewInterval: 0,
                                nextReviewDate: null,
                                note: '',
                                loading: false
                            };
                            window.SmartGrind.state.problems.set(id, newProb);
                            saveObj[id] = newProb;
                            changed = true;
                        }
                        // Sync metadata for existing problems to ensure consistency
                        else if (window.SmartGrind.state.problems.has(id)) {
                            const p = window.SmartGrind.state.problems.get(id)!;
                            if (!p.topic || !p.url || p.url !== (typeof probDef === 'string' ? `https://leetcode.com/problems/${id}/` : probDef.url) || p.pattern !== pat.name) {
                                p.topic = topic.title;
                                p.pattern = pat.name;
                                p.url = typeof probDef === 'string' ? `https://leetcode.com/problems/${id}/` : probDef.url;
                                p.name = typeof probDef === 'string' ? probDef : probDef.name;
                                window.SmartGrind.state.problems.set(id, p);
                                saveObj[id] = p;
                                changed = true;
                            }
                        }
                    });
                });
            });

            // Save changes if any were made
            if (changed) {
                await window.SmartGrind.api._performSave();
            }
        } catch (e) {
            console.error('Sync plan error:', e);
            const message = e instanceof Error ? e.message : String(e);
            window.SmartGrind.ui.showAlert(`Failed to sync problem data: ${message}`);
            throw e;
        }
    },

    /**
     * Merges custom problems into the topicsData structure by adding them to appropriate topics and patterns.
     */
    mergeStructure: (): void => {
    // Build a set of existing problem IDs in topicsData for quick lookup
        const existingIds = new Set<string>();
        window.SmartGrind.data.topicsData.forEach((topic: Topic) => {
            topic.patterns.forEach((pattern: Pattern) => {
                pattern.problems.forEach((prob: string | ProblemDef) => {
                    existingIds.add(typeof prob === 'string' ? prob : prob.id);
                });
            });
        });

        window.SmartGrind.state.problems.forEach((p: Problem) => {
            if (!existingIds.has(p.id) && p.topic) {
                // It's a custom problem, add to topicsData
                let topic = window.SmartGrind.data.topicsData.find((t: Topic) => t.title === p.topic);
                if (!topic) {
                    // Create new topic if needed
                    topic = { id: p.topic.toLowerCase().replace(/\s+/g, '-'), title: p.topic, patterns: [] };
                    window.SmartGrind.data.topicsData.push(topic);
                }

                let pattern = topic.patterns.find((pat: Pattern) => pat.name === p.pattern);
                if (!pattern) {
                    pattern = { name: p.pattern, problems: [] };
                    topic.patterns.push(pattern);
                }

                // Add simple object structure for topicsData
                pattern.problems.push({ id: p.id, name: p.name, url: p.url });
            }
        });
    }
});