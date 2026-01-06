// --- RENDERERS MODULE ---
// UI rendering functions

window.SmartGrind = window.SmartGrind || {};

window.SmartGrind.renderers = {
    // Helper to render a topic section
    _renderTopicSection: (topic, filterTopicId, today, visibleCountRef) => {
        const topicSection = document.createElement('div');
        topicSection.className = 'space-y-6';

        // Only show header if viewing all
        if (filterTopicId === 'all') {
            topicSection.innerHTML = `<h3 class="text-xl font-bold text-theme-bold border-b border-theme pb-2">${topic.title}</h3>`;
        }

        let hasVisiblePattern = false;

        topic.patterns.forEach(pattern => {
            let patternProblems = [];

            pattern.problems.forEach(probDef => {
                const id = typeof probDef === 'string' ? probDef : probDef.id;
                const p = window.SmartGrind.state.problems.get(id);
                if (!p) return; // Skip if deleted

                const searchQuery = window.SmartGrind.state.elements.problemSearch.value.toLowerCase().trim();
                if (window.SmartGrind.utils.shouldShowProblem(p, window.SmartGrind.state.ui.currentFilter, searchQuery, today)) {
                    patternProblems.push(p);
                }
            });

            if (patternProblems.length > 0) {
                hasVisiblePattern = true;
                visibleCountRef.count += patternProblems.length;
                const patternEl = document.createElement('div');
                patternEl.innerHTML = `<h4 class="text-sm font-bold text-brand-400 uppercase tracking-wider mb-3 mt-6">${pattern.name}</h4>`;
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-1 gap-3';

                patternProblems.forEach(p => {
                    grid.appendChild(window.SmartGrind.renderers.createProblemCard(p));
                });

                patternEl.appendChild(grid);
                topicSection.appendChild(patternEl);
            }
        });

        return hasVisiblePattern ? topicSection : null;
    },

    // Render sidebar navigation
    renderSidebar: () => {
        const topicList = window.SmartGrind.state.elements.topicList;
        topicList.innerHTML = '';

        // "All Problems" Link
        const allBtn = window.SmartGrind.renderers.createTopicButton('all', 'All Problems');
        allBtn.onclick = () => {
            window.SmartGrind.renderers.setActiveTopic('all');
            window.SmartGrind.utils.updateUrlParameter('category', null);
            window.SmartGrind.renderers.renderMainView('all');
            window.SmartGrind.utils.scrollToTop();
        };
        topicList.appendChild(allBtn);

        // Topic buttons
        window.SmartGrind.data.topicsData.forEach(topic => {
            const btn = window.SmartGrind.renderers.createTopicButton(topic.id, topic.title);
            btn.onclick = () => {
                window.SmartGrind.renderers.setActiveTopic(topic.id);
                window.SmartGrind.utils.updateUrlParameter('category', topic.id);
                window.SmartGrind.renderers.renderMainView(topic.id);
                window.SmartGrind.utils.scrollToTop();
            };
            topicList.appendChild(btn);
        });
    },

    // Create a topic button for sidebar
    createTopicButton: (topicId, title) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = window.SmartGrind.state.ui.activeTopicId === topicId || (!window.SmartGrind.state.ui.activeTopicId && topicId === 'all');
        btn.className = `sidebar-link ${isActive ? 'active' : ''} w-full text-left px-5 py-3 text-sm font-medium text-theme-base hover:text-theme-bold hover:bg-dark-800 transition-colors border-r-2 border-transparent flex justify-between items-center group cursor-pointer`;
        btn.dataset.topicId = topicId;

        // Calculate progress
        const stats = window.SmartGrind.utils.getUniqueProblemsForTopic(topicId);
        const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

        btn.innerHTML = `
            <span class="truncate mr-2">${title}</span>
            <div class="flex items-center gap-3 shrink-0">
                <span class="text-[10px] font-mono text-theme-muted bg-dark-800 group-hover:bg-dark-900 px-2 py-0.5 rounded border border-transparent group-hover:border-theme transition-all">${stats.total}</span>
                <span class="text-[10px] ${pct === 100 ? 'text-green-400' : 'text-theme-muted group-hover:text-theme-base'} font-mono min-w-[24px] text-right transition-colors">${pct}%</span>
            </div>
        `;

        return btn;
    },

    // Set active topic in sidebar
    setActiveTopic: (topicId) => {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-topic-id="${topicId}"]`) ||
                         document.querySelector('.sidebar-link:first-child'); // All problems
        if (activeBtn) activeBtn.classList.add('active');
        window.SmartGrind.state.ui.activeTopicId = topicId;
    },

    // Render main problem view
    renderMainView: (filterTopicId) => {
        window.SmartGrind.state.ui.activeTopicId = filterTopicId || window.SmartGrind.state.ui.activeTopicId;
        const container = window.SmartGrind.state.elements.problemsContainer;
        container.innerHTML = '';

        const title = window.SmartGrind.state.ui.activeTopicId === 'all' ?
            'All Problems' :
            window.SmartGrind.data.topicsData.find(t => t.id === window.SmartGrind.state.ui.activeTopicId)?.title;

        window.SmartGrind.state.elements.currentViewTitle.innerText = title;

        // Remove existing delete button
        let existingBtn = window.SmartGrind.state.elements.currentViewTitle.nextElementSibling;
        if (existingBtn && existingBtn.classList.contains('delete-category-btn')) {
            existingBtn.remove();
        }

        // Add delete button for specific topics
        if (filterTopicId !== 'all') {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-category-btn ml-2 p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-colors';
            deleteBtn.title = 'Delete Category';
            deleteBtn.innerHTML = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>';
            deleteBtn.onclick = () => window.SmartGrind.api.deleteCategory(filterTopicId);
            window.SmartGrind.state.elements.currentViewTitle.insertAdjacentElement('afterend', deleteBtn);
        }

        const today = window.SmartGrind.utils.getToday();
        const visibleCountRef = { count: 0 };

        const relevantTopics = filterTopicId === 'all' ?
            window.SmartGrind.data.topicsData :
            window.SmartGrind.data.topicsData.filter(t => t.id === filterTopicId);

        relevantTopics.forEach(topic => {
            const topicSection = window.SmartGrind.renderers._renderTopicSection(topic, filterTopicId, today, visibleCountRef);
            if (topicSection) {
                container.appendChild(topicSection);
            }
        });

        const visibleCount = visibleCountRef.count;

        window.SmartGrind.state.elements.emptyState.classList.toggle('hidden', visibleCount > 0);
        window.SmartGrind.renderers.updateStats();
    },

    // Helper to generate problem card HTML
    _generateProblemCardHTML: (p) => {
        const isSolved = p.status === 'solved';
        const isDue = isSolved && p.nextReviewDate <= window.SmartGrind.utils.getToday();

        const className = `group p-4 rounded-xl border transition-all duration-200 overflow-hidden ${isDue ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40' :
            isSolved ? 'bg-dark-800 border-brand-500/20 hover:border-brand-500/40' :
                'bg-dark-800 border-theme hover:border-slate-400'
            }`;

        const badge = isDue ?
            `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 uppercase tracking-wide">Review</span>` :
            isSolved ?
                `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 uppercase tracking-wide">Solved</span>` : '';

        const actionButton = isSolved ? `
            <button class="action-btn px-4 py-2 rounded-lg text-xs font-bold transition-colors ${isDue ? 'bg-amber-500 text-dark-950 hover:bg-amber-400' : 'bg-dark-900 text-theme-muted hover:bg-dark-800 hover:text-theme-bold'}" ${p.loading ? 'disabled' : ''} data-action="${isDue ? 'review' : 'reset'}">
                ${p.loading ? '<div class="flex items-center justify-center gap-1"><div class="w-3 h-3 rounded-full animate-pulse" style="background-color: var(--theme-text-muted)"></div><div class="w-3 h-3 rounded-full animate-pulse" style="background-color: var(--theme-text-muted); animation-delay: 0.1s"></div><div class="w-3 h-3 rounded-full animate-pulse" style="background-color: var(--theme-text-muted); animation-delay: 0.2s"></div></div>' : (isDue ? 'Review' : 'Reset')}
            </button>
        ` : `
            <button class="action-btn px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all" ${p.loading ? 'disabled' : ''} data-action="solve">
                ${p.loading ? '<div class="flex items-center justify-center gap-1"><div class="w-3 h-3 bg-white rounded-full animate-pulse"></div><div class="w-3 h-3 bg-white rounded-full animate-pulse" style="animation-delay: 0.1s"></div><div class="w-3 h-3 bg-white rounded-full animate-pulse" style="animation-delay: 0.2s"></div></div>' : 'Solve'}
            </button>
        `;

        return { className, innerHTML: `
            <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="flex-1 overflow-hidden">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="${p.url}" target="_blank" class="text-base font-medium text-theme-bold group-hover:text-brand-400 transition-colors truncate cursor-pointer">
                            ${p.name}
                        </a>
                        ${badge}
                    </div>
                    <div class="flex items-center gap-4 text-xs text-theme-muted font-mono">
                        <span>Next: ${p.nextReviewDate ? window.SmartGrind.utils.formatDate(p.nextReviewDate) : '--'}</span>
                        <span class="${p.note ? 'text-brand-400' : ''}">${p.note ? 'Has Note' : ''}</span>
                    </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <!-- AI Helper Group -->
                    <div class="flex items-center bg-dark-900 rounded-lg border border-slate-800">
                        <button class="action-btn p-2 rounded-l-lg hover:bg-dark-800 text-theme-muted hover:text-blue-400 transition-colors" data-action="ask-gemini" title="Ask Gemini (Copies prompt & opens)">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68q.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58a12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68q-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96q2.19.93 3.81 2.55t2.55 3.81"/>
                            </svg>
                        </button>
                        <button class="action-btn p-2 rounded-r-lg hover:bg-dark-800 text-theme-muted hover:text-theme-bold transition-colors border-l border-slate-800" data-action="ask-grok" title="Ask Grok (Copies prompt & opens)">
                            <svg fill="currentColor" fill-rule="evenodd" class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path></svg>
                        </button>
                    </div>

                    <button class="action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-theme-bold transition-colors" data-action="note" title="Notes">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>

                    ${actionButton}

                    <!-- Delete Button -->
                    <button class="action-btn p-2 rounded-lg hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-colors" data-action="delete" title="Delete Problem">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>

            <!-- Note Input -->
            <div class="note-area hidden mt-3 pt-3 border-t border-theme">
                <textarea class="w-full bg-dark-950 border border-theme rounded-lg p-3 text-sm text-theme-base focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none" rows="3" placeholder="Notes...">${p.note || ''}</textarea>
                <div class="flex justify-end mt-2">
                    <button class="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md transition-colors" data-action="save-note">Save</button>
                </div>
            </div>
        ` };
    },

    // Create a problem card element
    createProblemCard: (p) => {
        const el = document.createElement('div');
        const { className, innerHTML } = window.SmartGrind.renderers._generateProblemCardHTML(p);
        el.className = className;
        el.innerHTML = innerHTML;

        // Add event listeners
        el.addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.dataset.action;

            if (action === 'ask-gemini' || action === 'ask-grok') {
                window.SmartGrind.utils.askAI(p.name, action === 'ask-gemini' ? 'gemini' : 'grok');
            } else if (action === 'note') {
                el.querySelector('.note-area').classList.toggle('hidden');
            } else if (action === 'save-note') {
                const val = el.querySelector('textarea').value;
                p.note = val;
                await window.SmartGrind.api.saveProblem(p);
                window.SmartGrind.utils.showToast('Note saved');
                el.querySelector('.note-area').classList.add('hidden');
                // Smart refresh
                window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
            } else if (action === 'solve' || action === 'review' || action === 'reset') {
                if (p.loading) return; // prevent multiple clicks
                p.loading = true;
                window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
                try {
                    if (action === 'reset') {
                        p.status = 'unsolved';
                        p.nextReviewDate = null;
                        p.reviewInterval = 0;
                    } else {
                        p.status = 'solved';
                        const idx = action === 'review' ? Math.min(p.reviewInterval + 1, window.SmartGrind.data.SPACED_REPETITION_INTERVALS.length - 1) : 0;
                        p.reviewInterval = idx;
                        p.nextReviewDate = window.SmartGrind.utils.getNextReviewDate(window.SmartGrind.utils.getToday(), idx);
                    }
                    await Promise.all([
                        window.SmartGrind.api.saveData(),
                        new Promise(resolve => setTimeout(resolve, 500))
                    ]);
                } catch (e) {
                    // revert
                    if (action === 'reset') {
                        p.status = 'solved';
                    } else {
                        p.status = 'unsolved';
                        p.nextReviewDate = null;
                        p.reviewInterval = 0;
                    }
                    window.SmartGrind.ui.showAlert(`Failed to update problem: ${e.message}`);
                } finally {
                    p.loading = false;
                    window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
                }
            } else if (action === 'delete') {
                const confirmed = await window.SmartGrind.ui.showConfirm(`Are you sure you want to remove "${p.name}" from your tracker?`);
                if (confirmed) {
                    window.SmartGrind.state.problems.delete(p.id);
                    window.SmartGrind.state.deletedProblemIds.add(p.id);
                    await window.SmartGrind.api.saveDeletedId(p.id);
                    window.SmartGrind.utils.showToast("Problem removed");
                    window.SmartGrind.renderers.renderMainView(window.SmartGrind.state.ui.activeTopicId);
                    window.SmartGrind.renderers.renderSidebar();
                }
            }
        });

        return el;
    },

    // Update statistics display
    updateStats: () => {
        const stats = window.SmartGrind.utils.getUniqueProblemsForTopic(window.SmartGrind.state.ui.activeTopicId);
        const { total, solved, due } = stats;

        const targetTopicTitle = window.SmartGrind.state.ui.activeTopicId === 'all' ? null :
            window.SmartGrind.data.topicsData.find(t => t.id === window.SmartGrind.state.ui.activeTopicId)?.title;

        // Update main dashboard stats safely
        if (window.SmartGrind.state.elements.mainTotalText) window.SmartGrind.state.elements.mainTotalText.innerText = total;
        if (window.SmartGrind.state.elements.mainSolvedText) window.SmartGrind.state.elements.mainSolvedText.innerText = solved;
        if (window.SmartGrind.state.elements.mainDueText) window.SmartGrind.state.elements.mainDueText.innerText = due;
        if (window.SmartGrind.state.elements.mainSolvedBar) window.SmartGrind.state.elements.mainSolvedBar.style.width = `${total > 0 ? (solved / total) * 100 : 0}%`;
        if (window.SmartGrind.state.elements.mainDueBadge) {
            if (due > 0) window.SmartGrind.state.elements.mainDueBadge.classList.remove('hidden');
            else window.SmartGrind.state.elements.mainDueBadge.classList.add('hidden');
        }

        // Update "Current Category" text box
        if (window.SmartGrind.state.elements.currentFilterDisplay) {
            window.SmartGrind.state.elements.currentFilterDisplay.innerText = targetTopicTitle || "All Problems";
        }

        // Also calculate global stats for sidebar
        const globalStats = window.SmartGrind.utils.getUniqueProblemsForTopic('all');
        if (window.SmartGrind.state.elements.sidebarSolvedText) window.SmartGrind.state.elements.sidebarSolvedText.innerText = globalStats.total > 0 ? `${Math.round((globalStats.solved / globalStats.total) * 100)}%` : '0%';
        if (window.SmartGrind.state.elements.sidebarSolvedBar) window.SmartGrind.state.elements.sidebarSolvedBar.style.width = globalStats.total > 0 ? `${(globalStats.solved / globalStats.total) * 100}%` : '0%';

        if (due > 0) {
            window.SmartGrind.state.elements.reviewBanner.classList.remove('hidden');
            window.SmartGrind.state.elements.reviewCountBanner.innerText = due;
        } else {
            window.SmartGrind.state.elements.reviewBanner.classList.add('hidden');
        }

        // Refresh sidebar to update percentages
        window.SmartGrind.renderers.renderSidebar();
    },

    // Update filter button states
    updateFilterBtns: () => {
        window.SmartGrind.state.elements.filterBtns.forEach(b => {
            if (b.dataset.filter === window.SmartGrind.state.ui.currentFilter) {
                b.classList.add('bg-brand-600', 'text-white');
                b.classList.remove('text-slate-400');
            } else {
                b.classList.remove('bg-brand-600', 'text-white');
                b.classList.add('text-slate-400');
            }
        });
    }
};