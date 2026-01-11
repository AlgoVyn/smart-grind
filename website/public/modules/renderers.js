// --- RENDERERS MODULE ---
// UI rendering functions

window.SmartGrind = window.SmartGrind || {};

// Shared icon templates
window.SmartGrind.ICONS = {
    delete: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>',
    note: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>',
    reset: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>'
};

window.SmartGrind.renderers = {
    // Helper to get spinner HTML
    _getSpinner: (size = 'h-4 w-4', color = 'text-current') => {
        return `
            <div class="flex items-center justify-center">
                <svg class="animate-spin ${size} ${color}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        `;
    },

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

    // Helper to generate badge HTML
    _generateBadge: (p, today) => {
        const isSolved = p.status === 'solved';
        const isDue = isSolved && p.nextReviewDate <= today;
        return isDue ?
            `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 uppercase tracking-wide">Review</span>` :
            isSolved ?
                `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 uppercase tracking-wide">Solved</span>` : '';
    },

    // Helper to generate action button HTML
    _generateActionButton: (p) => {
        const isSolved = p.status === 'solved';
        const isDue = isSolved && p.nextReviewDate <= window.SmartGrind.utils.getToday();
        const action = isSolved ? (isDue ? 'review' : 'reset') : 'solve';
        const buttonClass = isSolved ? (isDue ? 'bg-amber-500 text-white hover:bg-amber-400' : 'bg-dark-900 text-theme-muted hover:bg-dark-800 hover:text-theme-bold') : 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/20';

        const buttonText = p.loading ? window.SmartGrind.renderers._getSpinner() : (isDue ? 'Review' : isSolved ? 'Reset' : 'Solve');
        return `<button class="action-btn px-4 py-2 rounded-lg text-xs font-bold transition-colors min-w-[70px] ${buttonClass}" ${p.loading ? 'disabled' : ''} data-action="${action}">${buttonText}</button>`;
    },

    // Helper to generate problem link HTML
    _generateProblemLink: (p) => {
        const badge = window.SmartGrind.renderers._generateBadge(p, window.SmartGrind.utils.getToday());
        return `
            <div class="flex items-center gap-2 mb-1">
                <a href="${p.url}" target="_blank" class="text-base font-medium text-theme-bold group-hover:text-brand-400 transition-colors truncate cursor-pointer">
                    ${p.name}
                </a>
                ${badge}
            </div>
        `;
    },

    // Helper to generate problem metadata HTML
    _generateProblemMeta: (p) => `
        <div class="flex items-center gap-4 text-xs text-theme-muted font-mono">
            <span>Next: ${p.nextReviewDate ? window.SmartGrind.utils.formatDate(p.nextReviewDate) : '--'}</span>
            <span class="${p.note ? 'text-brand-400' : ''}">${p.note ? 'Has Note' : ''}</span>
        </div>
    `,

    // Helper to generate AI helper buttons HTML
    _generateAIButtons: () => `
        <div class="flex items-center bg-dark-900 rounded-lg border border-slate-800">
            <button class="action-btn p-2 rounded-l-lg hover:bg-dark-800 text-theme-base hover:text-green-500 transition-colors border-r border-slate-800" data-action="ask-chatgpt" title="Ask ChatGPT (Pre-loads query & opens)">
                <svg fill="currentColor" class="w-4 h-4 transition-colors" viewBox="0 0 24 24">
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                </svg>
            </button>
            <button class="action-btn p-2 hover:bg-dark-800 text-theme-muted hover:text-blue-400 transition-colors border-r border-slate-800" data-action="ask-aistudio" title="Ask AI Studio (Pre-loads query & opens)">
                <svg class="w-4 h-4 transition-colors" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g clip-path="url(#prefix__clip0_5_13)" fill-rule="evenodd" clip-rule="evenodd"><path d="M211.648 89.515h-76.651A57.707 57.707 0 0077.291 147.2v242.389a57.707 57.707 0 0057.706 57.707h242.411a57.707 57.707 0 0057.707-57.707V288.128l34.624-23.744v125.227a92.35 92.35 0 01-92.331 92.33H134.997a92.349 92.349 0 01-92.33-92.33v-242.39A92.336 92.336 0 0169.702 81.92a92.33 92.33 0 0165.295-27.05h96.96l-20.309 34.645z"/><path d="M380.16 0c3.093 0 5.717 2.219 6.379 5.248a149.328 149.328 0 0040.533 74.325 149.332 149.332 0 0074.347 40.555c3.029.661 5.248 3.285 5.248 6.4a6.574 6.574 0 01-5.248 6.357 149.338 149.338 0 00-74.326 40.555 149.338 149.338 0 00-40.789 75.413 6.334 6.334 0 01-6.144 5.078 6.334 6.334 0 01-6.144-5.078 149.338 149.338 0 00-40.789-75.413 149.326 149.326 0 00-75.414-40.79 6.338 6.338 0 01-5.077-6.144c0-2.987 2.133-5.547 5.077-6.144a149.336 149.336 0 0075.414-40.79 149.354 149.354 0 0040.554-74.325A6.573 6.573 0 01380.16 0z"/></g><defs><clipPath id="prefix__clip0_5_13"><path fill="#fff" d="M0 0h512v512H0z"/></clipPath></defs></svg>
            </button>
            <button class="action-btn p-2 rounded-r-lg hover:bg-dark-800 text-theme-muted hover:text-theme-bold transition-colors border-l border-slate-800" data-action="ask-grok" title="Ask Grok (Pre-loads query & opens)">
                <svg fill="currentColor" fill-rule="evenodd" class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path></svg>
            </button>
        </div>
    `,

    // Helper to generate action buttons HTML
    _generateActionButtons: (p) => {
        const actionButton = window.SmartGrind.renderers._generateActionButton(p);
        return `
            <button class="action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-theme-bold transition-colors" data-action="note" title="Notes">
                ${window.SmartGrind.ICONS.note}
            </button>
            <button class="action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-blue-400 transition-colors inline-flex items-center justify-center" data-action="solution" title="View Solution">
                <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                </svg>
            </button>
            ${actionButton}
            <button class="action-btn p-2 rounded-lg hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-colors" data-action="delete" title="Delete Problem">
                ${window.SmartGrind.ICONS.delete}
            </button>
        `;
    },

    // Helper to generate note area HTML
    _generateNoteArea: (p) => `
        <div class="note-area ${p.noteVisible ? '' : 'hidden'} mt-3 pt-3 border-t border-theme">
            <textarea class="w-full bg-dark-950 border border-theme rounded-lg p-3 text-sm text-theme-base focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none" rows="3" placeholder="Notes..." ${p.loading ? 'disabled' : ''}>${p.note || ''}</textarea>
            <div class="flex justify-end mt-2">
                <button class="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors min-w-[60px] bg-slate-700 hover:bg-slate-600 text-white" ${p.loading ? 'disabled' : ''} data-action="save-note">
                    ${p.loading ? window.SmartGrind.renderers._getSpinner('h-3 w-3') : 'Save'}
                </button>
            </div>
        </div>
    `,

    // Render sidebar navigation (consolidated click handlers)
    renderSidebar: () => {
        const topicList = window.SmartGrind.state.elements.topicList;
        topicList.innerHTML = '';

        // Helper for topic navigation
        const navigateToTopic = (topicId) => {
            window.SmartGrind.renderers.setActiveTopic(topicId);
            window.SmartGrind.utils.updateUrlParameter('category', topicId === 'all' ? null : topicId);
            window.SmartGrind.renderers.renderMainView(topicId);
            window.SmartGrind.utils.scrollToTop();
        };

        // "All Problems" Link
        const allBtn = window.SmartGrind.renderers.createTopicButton('all', 'All Problems');
        allBtn.onclick = () => navigateToTopic('all');
        topicList.appendChild(allBtn);

        // Topic buttons
        window.SmartGrind.data.topicsData.forEach(topic => {
            const btn = window.SmartGrind.renderers.createTopicButton(topic.id, topic.title);
            btn.onclick = () => navigateToTopic(topic.id);
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

    // Helper to set view title and action buttons
    _setViewTitle: (filterTopicId) => {
        const title = filterTopicId === 'all' ? 'All Problems' :
            window.SmartGrind.data.topicsData.find(t => t.id === filterTopicId)?.title || 'Unknown Topic';
        window.SmartGrind.state.elements.currentViewTitle.innerText = title;

        // Remove existing action button container
        const existingContainer = window.SmartGrind.state.elements.currentViewTitle.nextElementSibling;
        if (existingContainer?.classList.contains('category-action-container')) {
            existingContainer.remove();
        }

        // Add action buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'category-action-container ml-2 flex gap-1';

        if (filterTopicId === 'all') {
            // Reset All button for "All Problems" view
            const resetAllBtn = document.createElement('button');
            resetAllBtn.className = 'category-action-btn p-1 rounded hover:bg-blue-500/10 text-theme-muted hover:text-blue-400 transition-colors';
            resetAllBtn.title = 'Reset All Problems';
            resetAllBtn.innerHTML = window.SmartGrind.ICONS.reset;
            resetAllBtn.onclick = () => window.SmartGrind.api.resetAll();
            buttonContainer.appendChild(resetAllBtn);
        } else {
            // Reset and Delete buttons for specific topics
            // Reset button
            const resetBtn = document.createElement('button');
            resetBtn.className = 'category-action-btn p-1 rounded hover:bg-blue-500/10 text-theme-muted hover:text-blue-400 transition-colors';
            resetBtn.title = 'Reset Category Problems';
            resetBtn.innerHTML = window.SmartGrind.ICONS.reset;
            resetBtn.onclick = () => window.SmartGrind.api.resetCategory(filterTopicId);
            buttonContainer.appendChild(resetBtn);

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'category-action-btn p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-colors';
            deleteBtn.title = 'Delete Category';
            deleteBtn.innerHTML = window.SmartGrind.ICONS.delete;
            deleteBtn.onclick = () => window.SmartGrind.api.deleteCategory(filterTopicId);
            buttonContainer.appendChild(deleteBtn);
        }

        window.SmartGrind.state.elements.currentViewTitle.insertAdjacentElement('afterend', buttonContainer);
    },

    // Render main problem view
    renderMainView: (filterTopicId) => {
        window.SmartGrind.state.ui.activeTopicId = filterTopicId || window.SmartGrind.state.ui.activeTopicId;
        const container = window.SmartGrind.state.elements.problemsContainer;
        container.innerHTML = '';

        window.SmartGrind.renderers._setViewTitle(window.SmartGrind.state.ui.activeTopicId);

        const today = window.SmartGrind.utils.getToday();
        const visibleCountRef = { count: 0 };

        const relevantTopics = window.SmartGrind.state.ui.activeTopicId === 'all' ?
            window.SmartGrind.data.topicsData :
            window.SmartGrind.data.topicsData.filter(t => t.id === window.SmartGrind.state.ui.activeTopicId);

        relevantTopics.forEach(topic => {
            const topicSection = window.SmartGrind.renderers._renderTopicSection(topic, window.SmartGrind.state.ui.activeTopicId, today, visibleCountRef);
            if (topicSection) container.appendChild(topicSection);
        });

        window.SmartGrind.state.elements.emptyState.classList.toggle('hidden', visibleCountRef.count > 0);
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

        const problemLink = window.SmartGrind.renderers._generateProblemLink(p);
        const problemMeta = window.SmartGrind.renderers._generateProblemMeta(p);
        const aiButtons = window.SmartGrind.renderers._generateAIButtons();
        const actionButtons = window.SmartGrind.renderers._generateActionButtons(p);
        const noteArea = window.SmartGrind.renderers._generateNoteArea(p);

        return {
            className, innerHTML: `
            <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="flex-1 overflow-hidden">
                    ${problemLink}
                    ${problemMeta}
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    ${aiButtons}
                    ${actionButtons}
                </div>
            </div>
            ${noteArea}
        ` };
    },

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
        } finally {
            p.loading = false;
            // Card needs to be re-rendered again to show final state (and remove spinner)
            // But we need a fresh reference to the button/card since it was replaced
            const newCard = document.querySelector(`[data-problem-id="${p.id}"]`);
            if (newCard) {
                const btn = newCard.querySelector('.action-btn[data-action]');
                if (btn) window.SmartGrind.renderers._reRenderCard(btn, p);
            }
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

        p.status = 'solved';
        p.reviewInterval = newInterval;
        p.nextReviewDate = window.SmartGrind.utils.getNextReviewDate(today, newInterval);
        p.loading = true;

        window.SmartGrind.renderers._reRenderCard(button, p);

        // Add delay for visibility
        await new Promise(resolve => setTimeout(resolve, 400));

        try {
            await window.SmartGrind.api.saveProblem(p);
        } finally {
            p.loading = false;
            if (window.SmartGrind.state.ui.currentFilter === 'review') {
                // If in due view, hide the card
                const newCard = document.querySelector(`[data-problem-id="${p.id}"]`);
                if (newCard) {
                    const btn = newCard.querySelector('.action-btn[data-action]');
                    if (btn) window.SmartGrind.renderers._hideCardIfDueFilter(btn);
                }
            } else {
                const newCard = document.querySelector(`[data-problem-id="${p.id}"]`);
                if (newCard) {
                    const btn = newCard.querySelector('.action-btn[data-action]');
                    if (btn) window.SmartGrind.renderers._reRenderCard(btn, p);
                }
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
                const confirmed = await window.SmartGrind.ui.showConfirm(`Delete "${p.name}"?`);
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
                    p.note = textarea.value.trim();
                    p.loading = true;
                    window.SmartGrind.renderers._reRenderCard(button, p);

                    // Add delay for visibility
                    await new Promise(resolve => setTimeout(resolve, 400));

                    try {
                        await window.SmartGrind.api.saveProblem(p);
                    } finally {
                        p.loading = false;
                        const newCard = document.querySelector(`[data-problem-id="${p.id}"]`);
                        if (newCard) {
                            const btn = newCard.querySelector('button[data-action="save-note"]');
                            if (btn) window.SmartGrind.renderers._reRenderCard(btn, p);
                        }
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
                b.classList.remove('text-theme-bold');
            } else {
                b.classList.remove('bg-brand-600', 'text-white');
                b.classList.add('text-theme-bold');
            }
        });
    }
};