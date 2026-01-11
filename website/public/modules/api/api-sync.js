// --- API SYNC MODULE ---
// Syncing and merging operations

window.SmartGrind = window.SmartGrind || {};
window.SmartGrind.api = window.SmartGrind.api || {};

Object.assign(window.SmartGrind.api, {
    // Sync with static problem plan
    syncPlan: async () => {
        try {
            let changed = false;
            let saveObj = Object.fromEntries(window.SmartGrind.state.problems);

            // Iterate through all predefined problems in topicsData
            window.SmartGrind.data.topicsData.forEach(topic => {
                topic.patterns.forEach(pat => {
                    pat.problems.forEach(probDef => {
                        const id = probDef.id;

                        // Add new problems if not present and not deleted
                        if (!window.SmartGrind.state.problems.has(id) && !window.SmartGrind.state.deletedProblemIds.has(id)) {
                            const newProb = {
                                id: id,
                                name: probDef.name,
                                url: probDef.url,
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
                            const p = window.SmartGrind.state.problems.get(id);
                            if (!p.topic || !p.url || p.url !== probDef.url || p.pattern !== pat.name) {
                                p.topic = topic.title;
                                p.pattern = pat.name;
                                p.url = probDef.url;
                                p.name = probDef.name;
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
            window.SmartGrind.ui.showAlert(`Failed to sync problem data: ${e.message}`);
            throw e;
        }
    },

    // Merge custom problems into topicsData structure
    mergeStructure: () => {
        // Build a set of existing problem IDs in topicsData for quick lookup
        const existingIds = new Set();
        window.SmartGrind.data.topicsData.forEach(topic => {
            topic.patterns.forEach(pattern => {
                pattern.problems.forEach(prob => {
                    existingIds.add(prob.id);
                });
            });
        });

        window.SmartGrind.state.problems.forEach(p => {
            if (!existingIds.has(p.id) && p.topic) {
                // It's a custom problem, add to topicsData
                let topic = window.SmartGrind.data.topicsData.find(t => t.title === p.topic);
                if (!topic) {
                    // Create new topic if needed
                    topic = { id: p.topic.toLowerCase().replace(/\s+/g, '-'), title: p.topic, patterns: [] };
                    window.SmartGrind.data.topicsData.push(topic);
                }

                let pattern = topic.patterns.find(pat => pat.name === p.pattern);
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