// --- HTML GENERATORS MODULE ---
// HTML generation helper functions

export const htmlGenerators = {
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
                
                // Create pattern header with solution button
                const patternHeader = document.createElement('div');
                patternHeader.className = 'flex items-center justify-between mb-3 mt-6';
                
                const patternTitle = document.createElement('h4');
                patternTitle.className = 'text-sm font-bold text-brand-400 uppercase tracking-wider';
                patternTitle.textContent = pattern.name;
                
                // Add pattern solution button (only for non-custom patterns)
                const patternSolutionButton = document.createElement('button');
                patternSolutionButton.className = 'action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-blue-400 transition-colors inline-flex items-center justify-center';
                patternSolutionButton.dataset.action = 'pattern-solution';
                patternSolutionButton.dataset.pattern = pattern.name;
                patternSolutionButton.title = 'View Pattern Solution';
                patternSolutionButton.innerHTML = `
                    <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    </svg>
                `;
                
                patternHeader.appendChild(patternTitle);
                
                // Only show pattern solution button for non-custom patterns
                const isCustomPattern = !window.SmartGrind.data.ORIGINAL_TOPICS_DATA?.some(topic =>
                    topic.patterns.some(p => p.name === pattern.name)
                );
                
                if (!isCustomPattern) {
                    patternHeader.appendChild(patternSolutionButton);
                }
                
                patternEl.appendChild(patternHeader);
                
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
        
        // Check if this is a custom problem
        const isCustomProblem = !window.SmartGrind.data.ORIGINAL_TOPICS_DATA?.some(topic =>
            topic.patterns.some(pattern =>
                pattern.problems.some(prob => prob.id === p.id)
            )
        );
         
        return `
            <button class="action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-theme-bold transition-colors" data-action="note" title="Notes">
                ${window.SmartGrind.ICONS.note}
            </button>
            ${!isCustomProblem ? `
            <button class="action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-blue-400 transition-colors inline-flex items-center justify-center" data-action="solution" title="View Solution">
                <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                </svg>
            </button>
            ` : ''}
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
    }
};