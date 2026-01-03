// --- API MODULE ---
// Data operations and API communication

window.SmartGrind = window.SmartGrind || {};

window.SmartGrind.api = {
    // Helper function to perform save operation
    _performSave: async () => {
        try {
            if (window.SmartGrind.state.user.type === 'local') {
                window.SmartGrind.state.saveToStorage();
            } else {
                const token = localStorage.getItem('token');
                const data = {
                    problems: Object.fromEntries(window.SmartGrind.state.problems),
                    deletedIds: Array.from(window.SmartGrind.state.deletedProblemIds)
                };
                await fetch(`${window.SmartGrind.data.API_BASE}/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ data })
                });
            }
            window.SmartGrind.renderers.updateStats();
        } catch (e) {
            console.error(e);
        }
    },

    // Save problem to storage/API
    saveProblem: async (p) => {
        await window.SmartGrind.api._performSave();
    },

    // Save deleted problem ID
    saveDeletedId: async (id) => {
        try {
            window.SmartGrind.state.problems.delete(id);
            await window.SmartGrind.api._performSave();
        } catch (e) {
            console.error(e);
        }
    },

    // Save all data
    saveData: async () => {
        await window.SmartGrind.api._performSave();
    },

    // Load data from API
    loadData: async () => {
        window.SmartGrind.state.elements.loadingScreen.classList.remove('hidden');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${window.SmartGrind.data.API_BASE}/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            const userData = await response.json();
            window.SmartGrind.state.problems = new Map(Object.entries(userData.problems || {}));
            const deletedArr = userData.deletedIds || [];
            window.SmartGrind.state.deletedProblemIds = new Set(deletedArr);

            // Sync with static plan to ensure all problems exist
            await window.SmartGrind.api.syncPlan();

            // Merge dynamically added problems into topicsData structure
            window.SmartGrind.api.mergeStructure();

            window.SmartGrind.renderers.renderSidebar();
            window.SmartGrind.renderers.renderMainView('all'); // Show all by default
            window.SmartGrind.renderers.updateStats();

            // Initialize scroll button after DOM is ready
            window.SmartGrind.ui.initScrollButton();

            window.SmartGrind.state.elements.setupModal.classList.add('hidden');
            window.SmartGrind.state.elements.appWrapper.classList.remove('hidden');

        } catch (e) {
            console.error(e);
            window.SmartGrind.ui.showError("Error loading data. Check console.");
            window.SmartGrind.state.elements.setupModal.classList.remove('hidden');
            window.SmartGrind.state.elements.appWrapper.classList.add('hidden');
        } finally {
            window.SmartGrind.state.elements.loadingScreen.classList.add('hidden');
        }
    },

    // Sync with static problem plan
    syncPlan: async () => {
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
                            note: ''
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
            if (!existingIds.has(p.id)) {
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
    },

    // Delete entire category
    deleteCategory: async (topicId) => {
        const topic = window.SmartGrind.data.topicsData.find(t => t.id === topicId);
        if (!topic) return;
        if (!confirm(`Are you sure you want to delete the category "${topic.title}" and all its associated problems? This action cannot be undone.`)) return;

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
        }

        // Save
        await window.SmartGrind.api.saveData();

        // Re-render
        window.SmartGrind.renderers.renderSidebar();
        window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
        window.SmartGrind.utils.showToast('Category and associated problems removed');
    }
};