// --- HTML GENERATORS MODULE ---
// HTML generation helper functions

import { Problem, Topic, Pattern, ProblemDef } from '../types';
import { data } from '../data';
import { state } from '../state';
import { shouldShowProblem, getToday, formatDate } from '../utils';
import { problemCardRenderers } from './problem-cards';
import { ICONS } from './icons';
import { SPINNER_HTML, AI_BUTTONS_HTML, SOLUTION_BUTTON_HTML } from '../ui/ui-constants';

/**
 * Escapes HTML special characters to prevent XSS.
 * Replaces &, <, >, ", and ' with their HTML entity equivalents.
 */
const escapeHtml = (str: string): string =>
    str
        .replace(/&/g, '&amp;')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');

export const htmlGenerators = {
    // Helper to check if an item exists in original data
    // For patterns: checks by pattern name
    // For problems: checks by problem ID
    isCustomItem: (type: 'pattern' | 'problem', identifier: string) => {
        const originalData = data.getOriginalTopicsData();
        if (!originalData) return true;
        return !originalData.some((topic: Topic) =>
            topic.patterns.some((pattern: Pattern) =>
                type === 'pattern'
                    ? pattern.name === identifier
                    : pattern.problems.some((prob: string | ProblemDef) =>
                          typeof prob === 'string' ? prob === identifier : prob.id === identifier
                      )
            )
        );
    },

    // Legacy helpers for backward compatibility
    isCustomPattern: (patternName: string) => htmlGenerators.isCustomItem('pattern', patternName),
    isCustomProblem: (problemId: string) => htmlGenerators.isCustomItem('problem', problemId),

    // Helper to sort problems for review filter
    sortReviewProblems: (problems: Problem[]) => {
        return problems.sort((a, b) => {
            if (a.nextReviewDate === b.nextReviewDate) return 0;
            if (!a.nextReviewDate) return 1;
            if (!b.nextReviewDate) return -1;
            return a.nextReviewDate < b.nextReviewDate ? -1 : 1;
        });
    },

    // Helper to get spinner HTML
    getSpinner: (size = 'h-4 w-4', color = 'text-current') => SPINNER_HTML(size, color),

    // Helper to filter visible problems for a pattern
    getVisibleProblemsForPattern: (pattern: Pattern, today: string) => {
        const problems: Problem[] = [];
        const searchQuery =
            (state.elements['problemSearch'] as HTMLInputElement | null)?.value
                .toLowerCase()
                .trim() || '';

        pattern.problems.forEach((probDef: string | ProblemDef) => {
            const id = typeof probDef === 'string' ? probDef : probDef.id;
            const p = state.problems.get(id);
            if (!p) return; // Skip if deleted

            if (shouldShowProblem(p, state.ui.currentFilter, searchQuery, today)) {
                problems.push(p);
            }
        });

        // Sort review problems by next review date (ascending: oldest/overdue first)
        if (state.ui.currentFilter === 'review') {
            return htmlGenerators.sortReviewProblems(problems);
        }

        return problems;
    },

    // Helper to create pattern header with solution button
    createPatternHeader: (pattern: Pattern) => {
        const patternHeader = document.createElement('div');
        patternHeader.className = 'flex items-center justify-between mb-3 mt-6';

        const patternTitle = document.createElement('h4');
        patternTitle.className = 'text-sm font-bold text-brand-400 uppercase tracking-wider';
        // Use textContent to prevent XSS (already safe, but good practice)
        patternTitle.textContent = pattern.name;

        patternHeader.appendChild(patternTitle);

        // Only show pattern solution button for non-custom patterns
        if (!htmlGenerators.isCustomPattern(pattern.name)) {
            const patternSolutionButton = document.createElement('button');
            patternSolutionButton.className =
                'action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-blue-400 transition-colors inline-flex items-center justify-center';
            patternSolutionButton.dataset['action'] = 'pattern-solution';
            patternSolutionButton.dataset['pattern'] = pattern.name;
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
            patternHeader.appendChild(patternSolutionButton);
        }

        return patternHeader;
    },

    // Helper to render a topic section
    renderTopicSection: (
        topic: Topic,
        filterTopicId: string,
        today: string,
        visibleCountRef: { count: number }
    ) => {
        const topicSection = document.createElement('div');
        topicSection.className = 'space-y-6';

        // Only show header if viewing all
        if (filterTopicId === 'all') {
            topicSection.innerHTML = `<h3 class="text-xl font-bold text-theme-bold border-b border-theme pb-2">${escapeHtml(topic.title || '')}</h3>`;
        }

        let hasVisiblePattern = false;

        topic.patterns.forEach((pattern: Pattern) => {
            const patternProblems = htmlGenerators.getVisibleProblemsForPattern(pattern, today);

            if (patternProblems.length > 0) {
                hasVisiblePattern = true;
                visibleCountRef.count += patternProblems.length;
                const patternEl = document.createElement('div');

                // Create pattern header with solution button
                const patternHeader = htmlGenerators.createPatternHeader(pattern);
                patternEl.appendChild(patternHeader);

                // Create grid for problem cards
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-1 gap-3';

                patternProblems.forEach((p: Problem) => {
                    grid.appendChild(problemCardRenderers.createProblemCard(p));
                });

                patternEl.appendChild(grid);
                topicSection.appendChild(patternEl);
            }
        });

        return hasVisiblePattern ? topicSection : null;
    },

    // Helper to generate badge HTML
    generateBadge: (p: Problem, today: string) => {
        if (p.status !== 'solved') return '';
        const isDue = p.nextReviewDate !== null && p.nextReviewDate <= today;
        const badgeClass = isDue
            ? 'bg-amber-500/20 text-amber-500'
            : 'bg-brand-500/20 text-brand-400';
        return `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass} uppercase tracking-wide">${isDue ? 'Review' : 'Solved'}</span>`;
    },

    // Helper to generate action button HTML
    generateActionButton: (p: Problem) => {
        const isSolved = p.status === 'solved';
        const today = getToday();
        const isDue = isSolved && p.nextReviewDate !== null && p.nextReviewDate <= today;

        // Determine action type and styling using early returns pattern
        const getActionConfig = () => {
            if (!isSolved) {
                return {
                    action: 'solve',
                    class: 'bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-500/20',
                    text: 'Solve',
                };
            }
            if (isDue) {
                return {
                    action: 'review',
                    class: 'bg-amber-500 text-white hover:bg-amber-400',
                    text: 'Review',
                };
            }
            return {
                action: 'reset',
                class: 'bg-dark-900 text-theme-muted hover:bg-dark-800 hover:text-theme-bold',
                text: 'Reset',
            };
        };

        const actionConfig = getActionConfig();
        const buttonText = p.loading ? htmlGenerators.getSpinner() : actionConfig.text;
        return `<button class="action-btn px-4 py-2 rounded-lg text-xs font-bold transition-colors min-w-[70px] ${actionConfig.class}" ${p.loading ? 'disabled' : ''} data-action="${actionConfig.action}">${buttonText}</button>`;
    },

    // Helper to generate problem link HTML
    generateProblemLink: (p: Problem) => {
        const today = getToday();
        const badge = htmlGenerators.generateBadge(p, today);
        return `
            <div class="flex items-center gap-2 mb-1">
                <a href="${p.url}" target="_blank" class="text-base font-medium text-theme-bold group-hover:text-brand-400 transition-colors truncate cursor-pointer">
                    ${escapeHtml(p.name || '')}
                </a>
                ${badge}
            </div>
        `;
    },

    // Helper to generate problem metadata HTML
    generateProblemMeta: (p: Problem) => `
        <div class="flex items-center gap-4 text-xs text-theme-muted font-mono">
            <span>Next: ${p.nextReviewDate ? formatDate(p.nextReviewDate) : '--'}</span>
            <span class="${p.note ? 'text-brand-400' : ''}">${p.note ? 'Has Note' : ''}</span>
        </div>
    `,

    // Helper to generate AI helper buttons HTML
    generateAIButtons: () => AI_BUTTONS_HTML,

    // Helper to generate action buttons HTML
    generateActionButtons: (p: Problem) => {
        const actionButton = htmlGenerators.generateActionButton(p);
        const isCustomProblem = htmlGenerators.isCustomProblem(p.id);
        // Show solution button for non-custom problems OR for algorithms (check if ID exists in algorithms data)
        const isAlgorithm = data.algorithmsData.some((cat) =>
            cat.algorithms.some((algo) => algo.id === p.id)
        );
        const showSolutionButton = !isCustomProblem || isAlgorithm;

        return `
            <button class="action-btn p-2 rounded-lg bg-dark-900 text-theme-muted hover:text-theme-bold transition-colors" data-action="note" title="Notes">
                ${ICONS.note}
            </button>
            ${showSolutionButton ? SOLUTION_BUTTON_HTML : ''}
            ${actionButton}
            <button class="action-btn p-2 rounded-lg hover:bg-red-500/10 text-theme-muted hover:text-red-400 transition-colors" data-action="delete" title="Delete Problem">
                ${ICONS.delete}
            </button>
        `;
    },

    // Helper to generate note area HTML
    generateNoteArea: (p: Problem) => `
        <div class="note-area ${p.noteVisible ? '' : 'hidden'} mt-3 pt-3 border-t border-theme">
            <textarea name="note-${p.id}" class="w-full bg-dark-950 border border-theme rounded-lg p-3 text-sm text-theme-base focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-y" rows="6" placeholder="Notes..." ${p.loading ? 'disabled' : ''}>${escapeHtml(p.note || '')}</textarea>
            <div class="flex justify-end mt-2">
                <button class="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors min-w-[60px] bg-slate-700 hover:bg-slate-600 text-white" ${p.loading ? 'disabled' : ''} data-action="save-note">
                    ${p.loading ? htmlGenerators.getSpinner('h-3 w-3') : 'Save'}
                </button>
            </div>
        </div>
    `,

    // Helper to get card style based on problem status
    getCardStyle: (p: Problem): string => {
        const isSolved = p.status === 'solved';
        const today = getToday();
        const isDue = isSolved && p.nextReviewDate !== null && p.nextReviewDate <= today;

        if (isDue) return 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40';
        if (isSolved) return 'bg-dark-800 border-brand-500/20 hover:border-brand-500/40';
        return 'bg-dark-800 border-theme hover:border-slate-400';
    },

    // Helper to generate problem card HTML
    generateProblemCardHTML: (p: Problem) => {
        const cardStyle = htmlGenerators.getCardStyle(p);
        const className = `group p-4 rounded-xl border transition-all duration-200 overflow-hidden ${cardStyle}`;

        return {
            className,
            innerHTML: `
            <div class="flex flex-col sm:flex-row justify-between gap-4">
                <div class="flex-1 overflow-hidden">
                    ${htmlGenerators.generateProblemLink(p)}
                    ${htmlGenerators.generateProblemMeta(p)}
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    ${htmlGenerators.generateAIButtons()}
                    ${htmlGenerators.generateActionButtons(p)}
                </div>
            </div>
            ${htmlGenerators.generateNoteArea(p)}
        `,
        };
    },
};
