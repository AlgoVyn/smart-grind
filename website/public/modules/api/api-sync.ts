// --- API SYNC MODULE ---
// Syncing and merging operations

import { Topic, Pattern, ProblemDef, Problem } from '../types.js';
import { state } from '../state.js';
import { data } from '../data.js';
import { ui } from '../ui/ui.js';
import { _performSave } from './api-save.js';

/**
 * Syncs the current problems with the static problem plan, adding new problems and updating metadata.
 * @throws {Error} Throws an error if syncing fails.
 */
export const syncPlan = async (): Promise<void> => {
    try {
        let changed = false;
        const saveObj = Object.fromEntries(state.problems);

        // Build a Map of problem definitions for O(1) lookup
        const problemDefMap = new Map<
            string,
            { name: string; url: string; topic: string; pattern: string }
        >();

        data.topicsData.forEach((topic: Topic) => {
            topic.patterns.forEach((pat: Pattern) => {
                pat.problems.forEach((probDef: string | ProblemDef) => {
                    const id = typeof probDef === 'string' ? probDef : probDef.id;
                    const name = typeof probDef === 'string' ? probDef : probDef.name;
                    const url =
                        typeof probDef === 'string'
                            ? `https://leetcode.com/problems/${id}/`
                            : probDef.url;

                    problemDefMap.set(id, {
                        name,
                        url,
                        topic: topic.title,
                        pattern: pat.name,
                    });
                });
            });
        });

        // Process problems using O(1) lookups
        problemDefMap.forEach((def, id) => {
            // Add new problems if not present and not deleted
            if (!state.problems.has(id) && !state.deletedProblemIds.has(id)) {
                const newProb: Problem = {
                    id: id,
                    name: def.name,
                    url: def.url,
                    status: 'unsolved',
                    topic: def.topic,
                    pattern: def.pattern,
                    reviewInterval: 0,
                    nextReviewDate: null,
                    note: '',
                    loading: false,
                };
                state.problems.set(id, newProb);
                saveObj[id] = newProb;
                changed = true;
            }
            // Sync metadata for existing problems to ensure consistency
            else if (state.problems.has(id)) {
                const p = state.problems.get(id)!;
                if (!p.topic || !p.url || p.url !== def.url || p.pattern !== def.pattern) {
                    p.topic = def.topic;
                    p.pattern = def.pattern;
                    p.url = def.url;
                    p.name = def.name;
                    state.problems.set(id, p);
                    saveObj[id] = p;
                    changed = true;
                }
            }
        });

        // Save changes if any were made
        if (changed) {
            await _performSave();
        }
    } catch (e) {
        console.error('Sync plan error:', e);
        const message = e instanceof Error ? e.message : String(e);
        ui.showAlert(`Failed to sync problem data: ${message}`);
        throw e;
    }
};

/**
 * Merges custom problems into the topicsData structure by adding them to appropriate topics and patterns.
 */
export const mergeStructure = (): void => {
    // Build a set of existing problem IDs in topicsData for quick lookup
    const existingIds = new Set<string>();
    data.topicsData.forEach((topic: Topic) => {
        topic.patterns.forEach((pattern: Pattern) => {
            pattern.problems.forEach((prob: string | ProblemDef) => {
                existingIds.add(typeof prob === 'string' ? prob : prob.id);
            });
        });
    });

    state.problems.forEach((p: Problem) => {
        if (!existingIds.has(p.id) && p.topic) {
            // It's a custom problem, add to topicsData
            let topic = data.topicsData.find((t: Topic) => t.title === p.topic);
            if (!topic) {
                // Create new topic if needed
                topic = {
                    id: p.topic.toLowerCase().replace(/\s+/g, '-'),
                    title: p.topic,
                    patterns: [],
                };
                data.topicsData.push(topic);
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
};
