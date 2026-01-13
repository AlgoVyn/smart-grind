// --- PROBLEM CARDS RENDERERS MODULE ---
// Problem card related rendering functions

export const problemCardRenderers = {
    // Helper to re-render a problem card
    _reRenderCard: (button, p) => {
        const card = button.closest('.group');
        if (card) {
            const { className, innerHTML } = window.SmartGrind.renderers._generateProblemCardHTML(p);
            card.className = className;
            card.innerHTML = innerHTML;
        }
    },

    // Helper to handle problem status changes
    _handleStatusChange: async (button, p, newStatus, interval = 0, nextDate = null) => {
        // Store original state for rollback on error
        const originalState = {
            status: p.status,
            reviewInterval: p.reviewInterval,
            nextReviewDate: p.nextReviewDate
        };

        p.status = newStatus;
        p.reviewInterval = interval;
        p.nextReviewDate = nextDate;
        p.loading = true;

        // Show loading state immediately
        window.SmartGrind.renderers._reRenderCard(button, p);

        // Add a slight delay so the spinner is visible even for fast local operations
        await new Promise(resolve => setTimeout(resolve, 400));

        try {
            await window.SmartGrind.api.saveProblem(p);
        } catch (error) {
            // Revert to original state on error
            p.status = originalState.status;
            p.reviewInterval = originalState.reviewInterval;
            p.nextReviewDate = originalState.nextReviewDate;
            window.SmartGrind.utils.showToast(`Failed to update problem: ${error.message}`, 'error');
        } finally {
            p.loading = false;
            // Card needs to be re-rendered again to show final state (and remove spinner)
            // But we need a fresh reference to the button/card since it was replaced
            // Use querySelectorAll to find all instances of this problem card across different patterns
            const newCards = document.querySelectorAll(`[data-problem-id="${p.id}"]`);
            newCards.forEach(newCard => {
                const btn = newCard.querySelector('.action-btn[data-action]');
                if (btn) window.SmartGrind.renderers._reRenderCard(btn, p);
            });
        }
    },

    // Handle solve action
    _handleSolve: async (button, p) => {
        const today = window.SmartGrind.utils.getToday();
        await window.SmartGrind.renderers._handleStatusChange(button, p, 'solved', 0, window.SmartGrind.utils.getNextReviewDate(today, 0));
    },

    // Handle review action
    _handleReview: async (button, p) => {
        const today = window.SmartGrind.utils.getToday();
        const newInterval = (p.reviewInterval || 0) + 1;

        // Store original state for rollback on error
        const originalState = {
            status: p.status,
            reviewInterval: p.reviewInterval,
            nextReviewDate: p.nextReviewDate
        };

        p.status = 'solved';
        p.reviewInterval = newInterval;
        p.nextReviewDate = window.SmartGrind.utils.getNextReviewDate(today, newInterval);
        p.loading = true;

        window.SmartGrind.renderers._reRenderCard(button, p);

        // Add delay for visibility
        await new Promise(resolve => setTimeout(resolve, 400));

        try {
            await window.SmartGrind.api.saveProblem(p);
        } catch (error) {
            // Revert to original state on error
            p.status = originalState.status;
            p.reviewInterval = originalState.reviewInterval;
            p.nextReviewDate = originalState.nextReviewDate;
            window.SmartGrind.utils.showToast(`Failed to review problem: ${error.message}`, 'error');
        } finally {
            p.loading = false;
            if (window.SmartGrind.state.ui.currentFilter === 'review') {
                // If in due view, hide all instances of the card
                const newCards = document.querySelectorAll(`[data-problem-id="${p.id}"]`);
                newCards.forEach(newCard => {
                    const btn = newCard.querySelector('.action-btn[data-action]');
                    if (btn) window.SmartGrind.renderers._hideCardIfDueFilter(btn);
                });
            } else {
                const newCards = document.querySelectorAll(`[data-problem-id="${p.id}"]`);
                newCards.forEach(newCard => {
                    const btn = newCard.querySelector('.action-btn[data-action]');
                    if (btn) window.SmartGrind.renderers._reRenderCard(btn, p);
                });
            }
        }
    },

    // Handle reset action
    _handleReset: async (button, p) => {
        await window.SmartGrind.renderers._handleStatusChange(button, p, 'unsolved', 0, null);
    },

    // Helper to hide card when due filter is active
    _hideCardIfDueFilter: (button) => {
        const card = button.closest('.group');
        if (!card) return;

        card.style.display = 'none';

        // Check if pattern section should be hidden
        const grid = card.parentElement;
        if (grid && grid.querySelectorAll('.group:not([style*="display: none"])').length === 0) {
            const patternSection = grid.parentElement;
            if (patternSection) {
                patternSection.style.display = 'none';

                // Check if topic section should be hidden
                const topicSection = patternSection.parentElement;
                if (topicSection && topicSection.querySelectorAll(':scope > div:not([style*="display: none"])').length === 0) {
                    topicSection.style.display = 'none';
                    window.SmartGrind.state.elements.emptyState.classList.remove('hidden');
                }
            }
        }

        window.SmartGrind.renderers.updateStats();
    },

    // Handle clicks on problem card buttons
    handleProblemCardClick: async (e, p) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.dataset.action;
        if (!action) return;

        switch (action) {
            case 'solve':
                window.SmartGrind.renderers._handleSolve(button, p);
                break;
            case 'review':
                window.SmartGrind.renderers._handleReview(button, p);
                break;
            case 'reset':
                window.SmartGrind.renderers._handleReset(button, p);
                break;
            case 'delete':
                const confirmed = await window.SmartGrind.ui.showConfirm(`Delete "<b>${p.name}</b>"?`);
                if (confirmed) {
                    window.SmartGrind.api.saveDeletedId(p.id);
                }
                break;
            case 'note':
                const noteArea = button.closest('.group').querySelector('.note-area');
                if (noteArea) {
                    const isHidden = noteArea.classList.toggle('hidden');
                    p.noteVisible = !isHidden;
                }
                break;
            case 'save-note':
                const textarea = button.closest('.note-area').querySelector('textarea');
                if (textarea) {
                    // Store original note for rollback on error
                    const originalNote = p.note;
                    p.note = textarea.value.trim();
                    p.loading = true;
                    window.SmartGrind.renderers._reRenderCard(button, p);

                    // Add delay for visibility
                    await new Promise(resolve => setTimeout(resolve, 400));

                    try {
                        await window.SmartGrind.api.saveProblem(p);
                    } catch (error) {
                        // Revert to original note on error
                        p.note = originalNote;
                        window.SmartGrind.utils.showToast(`Failed to save note: ${error.message}`, 'error');
                    } finally {
                        p.loading = false;
                        const newCards = document.querySelectorAll(`[data-problem-id="${p.id}"]`);
                        newCards.forEach(newCard => {
                            const btn = newCard.querySelector('button[data-action="save-note"]');
                            if (btn) window.SmartGrind.renderers._reRenderCard(btn, p);
                        });
                    }
                }
                break;
            case 'ask-chatgpt':
            case 'ask-aistudio':
            case 'ask-grok':
                const provider = action.split('-')[1];
                window.SmartGrind.utils.askAI(p.name, provider);
                break;
            case 'solution':
                window.SmartGrind.ui.openSolutionModal(p.id);
                break;
            case 'pattern-solution':
                const patternName = button.dataset.pattern;
                if (patternName) {
                    window.SmartGrind.ui.openPatternSolutionModal(patternName);
                }
                break;
        }
    },

    // Create a problem card element
    createProblemCard: (p) => {
        const el = document.createElement('div');
        const { className, innerHTML } = window.SmartGrind.renderers._generateProblemCardHTML(p);
        el.className = className;
        el.dataset.problemId = p.id;
        el.innerHTML = innerHTML;

        return el;
    }
};