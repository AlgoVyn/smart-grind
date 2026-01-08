// --- API MODULE ---
// Data operations and API communication

window.SmartGrind = window.SmartGrind || {};

window.SmartGrind.api = {
    // Save data locally
    _saveLocally: () => {
        window.SmartGrind.state.saveToStorage();
    },

    // Save data remotely
    _saveRemotely: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found. Please sign in again.');
        }
        const data = {
            problems: Object.fromEntries(
                Array.from(window.SmartGrind.state.problems.entries()).map(([id, p]) => {
                    const { loading, ...rest } = p;
                    return [id, rest];
                })
            ),
            deletedIds: Array.from(window.SmartGrind.state.deletedProblemIds)
        };
        const response = await fetch(`${window.SmartGrind.data.API_BASE}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data })
        });
        if (!response.ok) {
            const errorMessages = {
                401: 'Authentication failed. Please sign in again.',
                500: 'Server error. Please try again later.'
            };
            throw new Error(errorMessages[response.status] || `Save failed: ${response.statusText}`);
        }
    },

    // Helper function to perform save operation
    _performSave: async () => {
        try {
            if (window.SmartGrind.state.user.type === 'local') {
                window.SmartGrind.api._saveLocally();
            } else {
                await window.SmartGrind.api._saveRemotely();
            }
            window.SmartGrind.renderers.updateStats();
        } catch (e) {
            console.error('Save error:', e);
            window.SmartGrind.ui.showAlert(`Failed to save data: ${e.message}`);
            throw e;
        }
    },

    // Save problem to storage/API
    saveProblem: async (p) => {
        await window.SmartGrind.api._performSave();
    },

    // Save deleted problem ID
    saveDeletedId: async (id) => {
        const problem = window.SmartGrind.state.problems.get(id);
        try {
            window.SmartGrind.state.problems.delete(id);
            window.SmartGrind.state.deletedProblemIds.add(id);
            await window.SmartGrind.api._performSave();
            // Re-render the view to remove the deleted problem
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
        } catch (e) {
            console.error('Delete save error:', e);
            window.SmartGrind.ui.showAlert(`Failed to delete problem: ${e.message}`);
            // Restore the problem if save failed
            if (problem) {
                window.SmartGrind.state.problems.set(id, problem);
                window.SmartGrind.state.deletedProblemIds.delete(id);
            }
            throw e;
        }
    },

    // Save all data
    saveData: async () => {
        await window.SmartGrind.api._performSave();
    },

    // Helper to handle API response errors
    _handleApiError: (response) => {
        const errorMap = {
            401: 'Authentication failed. Please sign in again.',
            404: 'User data not found. Starting with fresh data.',
            500: 'Server error. Please try again later.'
        };
        throw new Error(errorMap[response.status] || `Failed to load data: ${response.statusText}`);
    },

    // Helper to process loaded user data
    _processUserData: (userData) => {
        window.SmartGrind.state.problems = new Map(Object.entries(userData.problems || {}));
        window.SmartGrind.state.problems.forEach(p => p.loading = false);
        window.SmartGrind.state.deletedProblemIds = new Set(userData.deletedIds || []);
    },

    // Helper to initialize UI after data load
    _initializeUI: () => {
        window.SmartGrind.renderers.renderSidebar();
        window.SmartGrind.renderers.renderMainView('all');
        window.SmartGrind.renderers.updateStats();
        window.SmartGrind.ui.initScrollButton();
        window.SmartGrind.state.elements.setupModal.classList.add('hidden');
        window.SmartGrind.state.elements.appWrapper.classList.remove('hidden');
    },

    // Load data from API
    loadData: async () => {
        window.SmartGrind.state.elements.loadingScreen.classList.remove('hidden');

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found. Please sign in again.');

            const response = await fetch(`${window.SmartGrind.data.API_BASE}/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) window.SmartGrind.api._handleApiError(response);

            const userData = await response.json();
            window.SmartGrind.api._processUserData(userData);

            window.SmartGrind.data.resetTopicsData();
            await window.SmartGrind.api.syncPlan();
            window.SmartGrind.api.mergeStructure();

            window.SmartGrind.api._initializeUI();

        } catch (e) {
            console.error('Load data error:', e);
            window.SmartGrind.ui.showAlert(`Failed to load data: ${e.message}`);
            const isAuthError = e.message.includes('Authentication failed') || e.message.includes('No authentication token');
            window.SmartGrind.state.elements[isAuthError ? 'signinModal' : 'setupModal'].classList.remove('hidden');
            window.SmartGrind.state.elements.appWrapper.classList.add('hidden');
        } finally {
            window.SmartGrind.state.elements.loadingScreen.classList.add('hidden');
        }
    },

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
    },

    // Delete entire category
    deleteCategory: async (topicId) => {
        try {
            const topic = window.SmartGrind.data.topicsData.find(t => t.id === topicId);
            if (!topic) {
                window.SmartGrind.ui.showAlert('Category not found.');
                return;
            }
            const confirmed = await window.SmartGrind.ui.showConfirm(`Are you sure you want to delete the category "${topic.title}" and all its associated problems? This action cannot be undone.`);
            if (!confirmed) return;

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
                window.SmartGrind.utils.updateUrlParameter('category', null);
            }

            // Save
            await window.SmartGrind.api.saveData();

            // Re-render
            window.SmartGrind.renderers.renderSidebar();
            window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
            window.SmartGrind.utils.showToast('Category and associated problems removed');
        } catch (e) {
            console.error('Delete category error:', e);
            window.SmartGrind.ui.showAlert(`Failed to delete category: ${e.message}`);
        }
    }
};