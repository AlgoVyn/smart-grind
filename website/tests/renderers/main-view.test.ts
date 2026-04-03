// --- MAIN VIEW RENDERERS TESTS ---
// Unit tests for main-view.ts renderers

// ============================================================================
// MOCK DEPENDENCIES (before importing the module)
// ============================================================================

// Mock utils module
jest.mock('../../src/utils', () => ({
    getToday: jest.fn(() => '2023-01-01'),
    shouldShowProblem: jest.fn(() => true),
    getNextReviewDate: jest.fn((today, interval) => '2023-01-02'),
    addDays: jest.fn((date, days) => '2023-01-02'),
    formatDate: jest.fn((date) => 'Jan 1'),
    updateUrlParameter: jest.fn(),
    scrollToTop: jest.fn(),
    showToast: jest.fn(),
    getUrlParameter: jest.fn(),
    getBaseUrl: jest.fn(() => 'http://localhost'),
    sanitizeInput: jest.fn((str) => str),
    sanitizeUrl: jest.fn((str) => str),
    escapeHtml: jest.fn((str) => str),
    safeGetItem: jest.fn(),
    safeSetItem: jest.fn(),
    safeRemoveItem: jest.fn(),
    getStringItem: jest.fn(),
    setStringItem: jest.fn(),
    cacheElements: jest.fn(() => ({})),
    getElement: jest.fn(),
    countLines: jest.fn(() => 0),
    askAI: jest.fn(),
    getUniqueProblemIdsForTopic: jest.fn(() => new Set()),
    getUniqueProblemsForTopic: jest.fn(() => ({ total: 10, solved: 5, due: 0 })),
    getAllUniqueProblemsIncludingAlgorithms: jest.fn(() => ({ total: 15, solved: 7, due: 2 })),
}));

// Mock state module
jest.mock('../../src/state', () => ({
    markDeletedIdsDirty: jest.fn(),
    markProblemDirty: jest.fn(),
    markFlashCardsDirty: jest.fn(),
    state: {
        ui: {
            activeTopicId: '',
            activeAlgorithmCategoryId: null as string | null,
            activeSQLCategoryId: null as string | null,
            currentFilter: 'all',
            searchQuery: '',
            preferredAI: null as string | null,
            reviewDateFilter: null as string | null,
        },
        elements: {} as Record<string, HTMLElement>,
        problems: new Map(),
        deletedProblemIds: new Set<string>(),
        user: {
            type: 'local' as const,
            id: null,
            displayName: 'Local User',
        },
        sync: {
            isOnline: true,
            isSyncing: false,
            pendingCount: 0,
            lastSyncAt: null as number | null,
            hasConflicts: false,
            conflictMessage: null as string | null,
        },
    },
}));

// Mock data module
jest.mock('../../src/data', () => ({
    data: {
        topicsData: [
            {
                id: 'arrays',
                title: 'Arrays & Hashing',
                patterns: [
                    {
                        name: 'Contains Duplicate',
                        problems: ['217'],
                    },
                ],
            },
            {
                id: 'two-pointers',
                title: 'Two Pointers',
                patterns: [
                    {
                        name: 'Valid Palindrome',
                        problems: ['125'],
                    },
                ],
            },
        ],
        algorithmsData: [
            {
                id: 'arrays-strings',
                title: 'Arrays & Strings',
                algorithms: [
                    { id: 'algo-two-pointers', name: 'Two Pointers', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
                    { id: 'algo-sliding-window', name: 'Sliding Window', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
                ],
            },
            {
                id: 'linked-list',
                title: 'Linked List',
                algorithms: [
                    { id: 'algo-reverse-linked-list', name: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/' },
                ],
            },
        ],
        sqlData: [],
        SPACED_REPETITION_INTERVALS: [1, 3, 7, 14, 30, 60],
        TOTAL_UNIQUE_PROBLEMS: 150,
        TOTAL_UNIQUE_ALGORITHMS: 100,
    },
}));

// Mock api module
jest.mock('../../src/api', () => ({
    api: {
        resetAll: jest.fn().mockResolvedValue(undefined),
        resetCategory: jest.fn().mockResolvedValue(undefined),
        resetAlgorithmCategory: jest.fn().mockResolvedValue(undefined),
        deleteCategory: jest.fn().mockResolvedValue(undefined),
        deleteAlgorithmCategory: jest.fn().mockResolvedValue(undefined),
        saveProblem: jest.fn().mockResolvedValue(undefined),
        saveProblemWithSync: jest.fn().mockResolvedValue(undefined),
        saveDeletedId: jest.fn().mockResolvedValue(undefined),
        loadData: jest.fn().mockResolvedValue(undefined),
    },
}));

// Mock ICONS
jest.mock('../../src/renderers/icons', () => ({
    ICONS: {
        delete: '<svg>delete</svg>',
        note: '<svg>note</svg>',
        reset: '<svg>reset</svg>',
    },
}));

// Mock htmlGenerators
jest.mock('../../src/renderers/html-generators', () => ({
    htmlGenerators: {
        renderTopicSection: jest.fn((topic, filterTopicId, today, visibleCountRef) => {
            const section = document.createElement('div');
            section.className = 'topic-section';
            section.dataset.topicId = topic.id;
            visibleCountRef.count += 1;
            return section;
        }),
        generateBadge: jest.fn(() => '<span>Solved</span>'),
        generateActionButton: jest.fn(() => '<button>Action</button>'),
        generateProblemCardHTML: jest.fn((p) => ({
            className: 'problem-card',
            innerHTML: `<div>${p.name}</div>`,
        })),
        getCardStyle: jest.fn(() => 'bg-dark-800'),
    },
}));

// Mock problemCardRenderers
jest.mock('../../src/renderers/problem-cards', () => ({
    problemCardRenderers: {
        createProblemCard: jest.fn((problem) => {
            const card = document.createElement('div');
            card.className = 'problem-card';
            card.dataset.problemId = problem.id;
            card.innerHTML = `<span>${problem.name}</span>`;
            return card;
        }),
        reRenderCard: jest.fn(),
        reRenderAllCards: jest.fn(),
        hideCardIfFilteredOut: jest.fn(),
        handleStatusChange: jest.fn(),
        handleSolve: jest.fn(),
        handleReview: jest.fn(),
        handleReset: jest.fn(),
        handleDeleteAction: jest.fn(),
        handleNoteToggle: jest.fn(),
        handleNoteSave: jest.fn(),
        handleAIActions: jest.fn(),
        handleSolutionActions: jest.fn(),
        handleProblemCardClick: jest.fn(),
        handleStatusAction: jest.fn(),
        performStatusChange: jest.fn(),
    },
}));

// Mock ui module for toggleDateFilterVisibility and populateDateFilter
jest.mock('../../src/ui/ui', () => ({
    ui: {
        toggleDateFilterVisibility: jest.fn(),
        populateDateFilter: jest.fn(),
        openSolutionModal: jest.fn(),
        showConfirm: jest.fn().mockResolvedValue(true),
    },
}));

// Mock renderers module for circular dependency
jest.mock('../../src/renderers', () => ({
    renderers: {
        updateStats: jest.fn(),
        renderMainView: jest.fn(),
        renderAlgorithmsView: jest.fn(),
    },
}));

// ============================================================================
// IMPORTS (after mocking)
// ============================================================================

import { mainViewRenderers } from '../../src/renderers/main-view';
import { state } from '../../src/state';
import { data } from '../../src/data';
import { api } from '../../src/api';
import { ICONS } from '../../src/renderers/icons';
import { htmlGenerators } from '../../src/renderers/html-generators';
import { problemCardRenderers } from '../../src/renderers/problem-cards';
import { ui } from '../../src/ui/ui';
import { shouldShowProblem, getToday } from '../../src/utils';
import { renderers } from '../../src/renderers';
import type { AlgorithmDef, AlgorithmCategory } from '../../src/data/algorithms-data';

// ============================================================================
// TEST SETUP
// ============================================================================

describe('mainViewRenderers', () => {
    // Store original implementations for cleanup
    let originalCreateElement: typeof document.createElement;

    beforeEach(() => {
        // Store original
        originalCreateElement = document.createElement.bind(document);

        // Reset all mocks
        jest.clearAllMocks();

        // Reset state to defaults
        state.ui = {
            activeTopicId: '',
            activeAlgorithmCategoryId: null,
            activeSQLCategoryId: null,
            currentFilter: 'all',
            searchQuery: '',
            preferredAI: null,
            reviewDateFilter: null,
        };
        state.problems = new Map();
        state.deletedProblemIds = new Set();

        // Reset DOM
        document.body.innerHTML = '';

        // Setup default elements in state
        const viewTitle = document.createElement('h2');
        viewTitle.id = 'current-view-title';
        state.elements['currentViewTitle'] = viewTitle;

        const container = document.createElement('div');
        container.id = 'problems-container';
        state.elements['problemsContainer'] = container;

        const emptyState = document.createElement('div');
        emptyState.id = 'empty-state';
        emptyState.className = 'hidden';
        state.elements['emptyState'] = emptyState;

        const searchInput = document.createElement('input');
        searchInput.id = 'problem-search';
        state.elements['problemSearch'] = searchInput;

        document.body.appendChild(viewTitle);
        document.body.appendChild(container);
        document.body.appendChild(emptyState);
        document.body.appendChild(searchInput);

        // Default mock returns
        jest.mocked(getToday).mockReturnValue('2023-01-01');
        jest.mocked(shouldShowProblem).mockReturnValue(true);
    });

    afterEach(() => {
        // Clean up DOM
        document.body.innerHTML = '';
    });

    // ============================================================================
    // _createActionBtn Tests
    // ============================================================================

    describe('_createActionBtn', () => {
        test('1. _createActionBtn creates button with correct attributes', () => {
            const mockOnClick = jest.fn();
            const btn = mainViewRenderers._createActionBtn(
                ICONS.reset,
                'Reset All Content',
                'bg-blue-500/10',
                mockOnClick
            );

            expect(btn.tagName).toBe('BUTTON');
            expect(btn.className).toContain('category-action-btn');
            expect(btn.className).toContain('p-1');
            expect(btn.className).toContain('rounded');
            expect(btn.className).toContain('hover:bg-blue-500/10');
            expect(btn.className).toContain('text-theme-muted');
            expect(btn.title).toBe('Reset All Content');
            expect(btn.innerHTML).toBe(ICONS.reset);
            expect(typeof btn.onclick).toBe('function');

            // Test click handler
            btn.click();
            expect(mockOnClick).toHaveBeenCalled();
        });

        test('1b. _createActionBtn uses different colors correctly', () => {
            const mockOnClick = jest.fn();
            const btn = mainViewRenderers._createActionBtn(
                ICONS.delete,
                'Delete Category',
                'bg-red-500/10',
                mockOnClick
            );

            expect(btn.className).toContain('hover:bg-red-500/10');
            expect(btn.className).toContain('hover:text-red-400');
        });
    });

    // ============================================================================
    // _removeActionContainer Tests
    // ============================================================================

    describe('_removeActionContainer', () => {
        test('2. _removeActionContainer removes existing container', () => {
            // Setup: create a container next to the title
            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            const container = document.createElement('div');
            container.className = 'category-action-container';
            viewTitle.insertAdjacentElement('afterend', container);

            expect(document.querySelector('.category-action-container')).not.toBeNull();

            mainViewRenderers._removeActionContainer();

            expect(document.querySelector('.category-action-container')).toBeNull();
        });

        test('2b. _removeActionContainer handles no existing container', () => {
            // Ensure no container exists
            expect(document.querySelector('.category-action-container')).toBeNull();

            // Should not throw
            expect(() => mainViewRenderers._removeActionContainer()).not.toThrow();
        });

        test('2c. _removeActionContainer only removes category-action-container class', () => {
            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;

            // Create a container with wrong class
            const wrongContainer = document.createElement('div');
            wrongContainer.className = 'some-other-container';
            viewTitle.insertAdjacentElement('afterend', wrongContainer);

            mainViewRenderers._removeActionContainer();

            // Should still be there
            expect(document.querySelector('.some-other-container')).not.toBeNull();
        });
    });

    // ============================================================================
    // _setViewTitle Tests
    // ============================================================================

    describe('_setViewTitle', () => {
        test('3. _setViewTitle with "all" shows "All Content" and reset all button', () => {
            mainViewRenderers._setViewTitle('all');

            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            expect(viewTitle.innerText).toBe('All Content');

            const container = document.querySelector('.category-action-container');
            expect(container).not.toBeNull();
            expect(container?.querySelectorAll('button').length).toBe(1);

            const btn = container?.querySelector('button');
            expect(btn?.title).toBe('Reset All Content');
        });

        test('4. _setViewTitle with specific topic shows topic title and buttons', () => {
            mainViewRenderers._setViewTitle('arrays');

            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            expect(viewTitle.innerText).toBe('Arrays & Hashing');

            const container = document.querySelector('.category-action-container');
            expect(container).not.toBeNull();

            const buttons = container?.querySelectorAll('button');
            expect(buttons?.length).toBe(2);

            // Reset button
            expect(buttons?.[0]?.title).toBe('Reset Category');
            // Delete button
            expect(buttons?.[1]?.title).toBe('Delete Category');
        });

        test('4b. _setViewTitle handles unknown topic', () => {
            mainViewRenderers._setViewTitle('unknown-topic');

            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            expect(viewTitle.innerText).toBe('Unknown Topic');
        });

        test('4c. _setViewTitle handles empty topicId by showing "All Content"', () => {
            mainViewRenderers._setViewTitle('');

            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            expect(viewTitle.innerText).toBe('All Content');
        });

        test('4d. _setViewTitle removes existing container before adding new one', () => {
            // First call to create container
            mainViewRenderers._setViewTitle('all');
            let container = document.querySelector('.category-action-container');
            expect(container).not.toBeNull();

            // Second call - should replace container
            mainViewRenderers._setViewTitle('arrays');
            const containers = document.querySelectorAll('.category-action-container');
            expect(containers.length).toBe(1);

            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            expect(viewTitle.innerText).toBe('Arrays & Hashing');
        });
    });

    // ============================================================================
    // renderMainView Tests
    // ============================================================================

    describe('renderMainView', () => {
        test('5. renderMainView updates activeTopicId', async () => {
            expect(state.ui.activeTopicId).toBe('');

            await mainViewRenderers.renderMainView('arrays');

            expect(state.ui.activeTopicId).toBe('arrays');
        });

        test('5b. renderMainView preserves activeTopicId when topicId is empty', async () => {
            state.ui.activeTopicId = 'existing-topic';

            await mainViewRenderers.renderMainView('');

            expect(state.ui.activeTopicId).toBe('existing-topic');
        });

        test('6. renderMainView clears container', async () => {
            const container = state.elements['problemsContainer'] as HTMLElement;
            container.innerHTML = '<div>existing content</div>';

            await mainViewRenderers.renderMainView('all');

            expect(container.innerHTML).not.toContain('existing content');
        });

        test('7. renderMainView shows date filter for review mode', async () => {
            state.ui.currentFilter = 'review';

            await mainViewRenderers.renderMainView('all');

            expect(ui.toggleDateFilterVisibility).toHaveBeenCalledWith(true);
            expect(ui.populateDateFilter).toHaveBeenCalled();
        });

        test('7b. renderMainView shows date filter for solved mode', async () => {
            state.ui.currentFilter = 'solved';

            await mainViewRenderers.renderMainView('all');

            expect(ui.toggleDateFilterVisibility).toHaveBeenCalledWith(true);
            expect(ui.populateDateFilter).toHaveBeenCalled();
        });

        test('7c. renderMainView hides date filter for other modes', async () => {
            state.ui.currentFilter = 'all';

            await mainViewRenderers.renderMainView('all');

            expect(ui.toggleDateFilterVisibility).toHaveBeenCalledWith(false);
        });

        test('8. renderMainView renders topics based on activeTopicId - all topics', async () => {
            await mainViewRenderers.renderMainView('all');

            expect(htmlGenerators.renderTopicSection).toHaveBeenCalledTimes(2); // arrays and two-pointers
            expect(htmlGenerators.renderTopicSection).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'arrays' }),
                'all',
                '2023-01-01',
                expect.any(Object)
            );
        });

        test('8b. renderMainView renders topics based on activeTopicId - specific topic', async () => {
            await mainViewRenderers.renderMainView('arrays');

            expect(htmlGenerators.renderTopicSection).toHaveBeenCalledTimes(1);
            expect(htmlGenerators.renderTopicSection).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'arrays' }),
                'arrays',
                '2023-01-01',
                expect.any(Object)
            );
        });

        test('9. renderMainView shows empty state when no visible problems in review mode', async () => {
            state.ui.currentFilter = 'review';
            jest.mocked(htmlGenerators.renderTopicSection).mockReturnValue(null);

            const emptyState = state.elements['emptyState'] as HTMLElement;
            emptyState.classList.add('hidden');

            await mainViewRenderers.renderMainView('all');

            expect(emptyState.classList.contains('hidden')).toBe(false);
        });

        test('9b. renderMainView hides empty state when there are visible problems', async () => {
            state.ui.currentFilter = 'review';
            // Setup mock to properly increment visible count
            let visibleCount = 0;
            jest.mocked(htmlGenerators.renderTopicSection).mockImplementation((topic, filterTopicId, today, visibleCountRef) => {
                const section = document.createElement('div');
                section.className = 'topic-section';
                section.dataset.topicId = topic.id;
                visibleCountRef.count += 5; // Add visible problems
                return section;
            });

            const emptyState = state.elements['emptyState'] as HTMLElement;
            emptyState.classList.remove('hidden');

            await mainViewRenderers.renderMainView('all');

            expect(emptyState.classList.contains('hidden')).toBe(true);
        });

        test('9c. renderMainView does not show empty state in non-review mode', async () => {
            state.ui.currentFilter = 'all';
            jest.mocked(htmlGenerators.renderTopicSection).mockReturnValue(null);

            const emptyState = state.elements['emptyState'] as HTMLElement;

            await mainViewRenderers.renderMainView('all');

            // Should remain hidden (not toggle to show)
            expect(emptyState.classList.contains('hidden')).toBe(true);
        });

        test('9d. renderMainView calls updateStats at the end', async () => {
            await mainViewRenderers.renderMainView('all');

            // Wait for the dynamic import to complete
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(renderers.updateStats).toHaveBeenCalled();
        });
    });

    // ============================================================================
    // _setAlgorithmViewTitle Tests
    // ============================================================================

    describe('_setAlgorithmViewTitle', () => {
        test('10. _setAlgorithmViewTitle with "all" shows "All Algorithms"', () => {
            mainViewRenderers._setAlgorithmViewTitle('all');

            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            expect(viewTitle.innerText).toBe('All Algorithms');
        });

        test('11. _setAlgorithmViewTitle with specific category shows category title', () => {
            mainViewRenderers._setAlgorithmViewTitle('arrays-strings');

            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            expect(viewTitle.innerText).toBe('Arrays & Strings');
        });

        test('11b. _setAlgorithmViewTitle shows "Algorithms" for unknown category', () => {
            mainViewRenderers._setAlgorithmViewTitle('unknown-category');

            const viewTitle = state.elements['currentViewTitle'] as HTMLElement;
            expect(viewTitle.innerText).toBe('Algorithms');
        });

        test('12. _setAlgorithmViewTitle adds delete button only for non-all categories', () => {
            // Test "all" category - only reset button
            mainViewRenderers._setAlgorithmViewTitle('all');
            let container = document.querySelector('.category-action-container');
            expect(container?.querySelectorAll('button').length).toBe(1);
            expect(container?.querySelector('button')?.title).toBe('Reset All Algorithms');

            // Clean up
            container?.remove();

            // Test specific category - reset and delete buttons
            mainViewRenderers._setAlgorithmViewTitle('arrays-strings');
            container = document.querySelector('.category-action-container');
            expect(container?.querySelectorAll('button').length).toBe(2);
        });

        test('12b. _setAlgorithmViewTitle uses correct reset label for all vs category', () => {
            // All algorithms
            mainViewRenderers._setAlgorithmViewTitle('all');
            let container = document.querySelector('.category-action-container');
            expect(container?.querySelector('button')?.title).toBe('Reset All Algorithms');

            container?.remove();

            // Specific category
            mainViewRenderers._setAlgorithmViewTitle('linked-list');
            container = document.querySelector('.category-action-container');
            const buttons = container?.querySelectorAll('button');
            expect(buttons?.[0]?.title).toBe('Reset Category');
            expect(buttons?.[1]?.title).toBe('Delete Category');
        });
    });

    // ============================================================================
    // _algorithmToProblem Tests
    // ============================================================================

    describe('_algorithmToProblem', () => {
        test('13. _algorithmToProblem returns existing problem from state', () => {
            const existingProblem = {
                id: 'algo-two-pointers',
                name: 'Two Pointers',
                url: 'https://example.com',
                status: 'solved' as const,
                topic: 'arrays-strings',
                pattern: 'Algorithms',
                reviewInterval: 2,
                nextReviewDate: '2023-01-15',
                note: 'My note',
                loading: false,
                noteVisible: false,
            };
            state.problems.set('algo-two-pointers', existingProblem);

            const algoDef: AlgorithmDef = {
                id: 'algo-two-pointers',
                name: 'Two Pointers',
                url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
            };

            const result = mainViewRenderers._algorithmToProblem(algoDef, 'arrays-strings');

            expect(result).toBe(existingProblem);
            expect(result.status).toBe('solved');
            expect(result.note).toBe('My note');
        });

        test('14. _algorithmToProblem creates new problem when not exists', () => {
            const algoDef: AlgorithmDef = {
                id: 'algo-new-algorithm',
                name: 'New Algorithm',
                url: 'https://leetcode.com/problems/new/',
            };

            const result = mainViewRenderers._algorithmToProblem(algoDef, 'arrays-strings');

            expect(result.id).toBe('algo-new-algorithm');
            expect(result.name).toBe('New Algorithm');
            expect(result.url).toBe('https://leetcode.com/problems/new/');
        });

        test('15. _algorithmToProblem sets correct default values', () => {
            const algoDef: AlgorithmDef = {
                id: 'algo-test',
                name: 'Test Algorithm',
                url: 'https://example.com',
            };

            const result = mainViewRenderers._algorithmToProblem(algoDef, 'linked-list');

            expect(result).toMatchObject({
                id: 'algo-test',
                name: 'Test Algorithm',
                url: 'https://example.com',
                status: 'unsolved',
                topic: 'linked-list',
                pattern: 'Algorithms',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
                loading: false,
                noteVisible: false,
            });
        });
    });

    // ============================================================================
    // renderAlgorithmsView Tests
    // ============================================================================

    describe('renderAlgorithmsView', () => {
        beforeEach(() => {
            // Reset problems map
            state.problems = new Map();
            state.deletedProblemIds = new Set();
        });

        test('16. renderAlgorithmsView sets activeAlgorithmCategoryId', async () => {
            expect(state.ui.activeAlgorithmCategoryId).toBeNull();

            await mainViewRenderers.renderAlgorithmsView('arrays-strings');

            expect(state.ui.activeAlgorithmCategoryId).toBe('arrays-strings');
        });

        test('17. renderAlgorithmsView clears container', async () => {
            const container = state.elements['problemsContainer'] as HTMLElement;
            container.innerHTML = '<div>existing content</div><span>more content</span>';

            await mainViewRenderers.renderAlgorithmsView('all');

            expect(container.innerHTML).not.toContain('existing content');
        });

        test('18. renderAlgorithmsView filters deleted problems', async () => {
            state.deletedProblemIds.add('algo-two-pointers');

            const container = state.elements['problemsContainer'] as HTMLElement;

            await mainViewRenderers.renderAlgorithmsView('all');

            // Should not create card for deleted problem
            expect(problemCardRenderers.createProblemCard).not.toHaveBeenCalledWith(
                expect.objectContaining({ id: 'algo-two-pointers' })
            );
        });

        test('19. renderAlgorithmsView applies shouldShowProblem filter', async () => {
            // Mock shouldShowProblem to return false
            jest.mocked(shouldShowProblem).mockReturnValue(false);

            await mainViewRenderers.renderAlgorithmsView('all');

            // shouldShowProblem should be called for each algorithm
            expect(shouldShowProblem).toHaveBeenCalled();
        });

        test('20. renderAlgorithmsView with "all" shows all matching categories', async () => {
            await mainViewRenderers.renderAlgorithmsView('all');

            const container = state.elements['problemsContainer'] as HTMLElement;

            // Should create a section with category headers (textContent will decode HTML entities)
            expect(container.textContent).toContain('Arrays & Strings');
            expect(container.textContent).toContain('Linked List');

            // Verify HTML structure has the headers
            const headers = container.querySelectorAll('h3');
            expect(headers.length).toBe(2);
            expect(headers[0].textContent).toBe('Arrays & Strings');
            expect(headers[1].textContent).toBe('Linked List');
        });

        test('20b. renderAlgorithmsView with "all" skips categories with no matching algorithms', async () => {
            // Mock shouldShowProblem to return false for everything
            jest.mocked(shouldShowProblem).mockReturnValue(false);

            await mainViewRenderers.renderAlgorithmsView('all');

            const container = state.elements['problemsContainer'] as HTMLElement;

            // Should not have category headers since nothing matches
            expect(container.querySelectorAll('h3').length).toBe(0);
        });

        test('21. renderAlgorithmsView with specific category shows only that category', async () => {
            await mainViewRenderers.renderAlgorithmsView('arrays-strings');

            const container = state.elements['problemsContainer'] as HTMLElement;

            // Should not have category header for single category view
            expect(container.querySelectorAll('h3').length).toBe(0);

            // But should have a grid with algorithms
            expect(container.querySelectorAll('.grid').length).toBeGreaterThan(0);
        });

        test('21b. renderAlgorithmsView returns early for unknown category', async () => {
            await mainViewRenderers.renderAlgorithmsView('unknown-category');

            const container = state.elements['problemsContainer'] as HTMLElement;

            // Container should be empty (just cleared, nothing added)
            expect(container.children.length).toBe(0);
        });

        test('22. renderAlgorithmsView shows empty state when no visible problems in review mode', async () => {
            state.ui.currentFilter = 'review';
            jest.mocked(shouldShowProblem).mockReturnValue(false);

            const emptyState = state.elements['emptyState'] as HTMLElement;
            emptyState.classList.add('hidden');

            await mainViewRenderers.renderAlgorithmsView('all');

            expect(emptyState.classList.contains('hidden')).toBe(false);
        });

        test('22b. renderAlgorithmsView hides empty state when there are visible problems', async () => {
            state.ui.currentFilter = 'review';
            jest.mocked(shouldShowProblem).mockReturnValue(true);

            const emptyState = state.elements['emptyState'] as HTMLElement;
            emptyState.classList.remove('hidden');

            await mainViewRenderers.renderAlgorithmsView('all');

            expect(emptyState.classList.contains('hidden')).toBe(true);
        });

        test('22c. renderAlgorithmsView does not show empty state in non-review mode', async () => {
            state.ui.currentFilter = 'all';
            jest.mocked(shouldShowProblem).mockReturnValue(false);

            const emptyState = state.elements['emptyState'] as HTMLElement;

            await mainViewRenderers.renderAlgorithmsView('all');

            // Should remain hidden
            expect(emptyState.classList.contains('hidden')).toBe(true);
        });

        test('22d. renderAlgorithmsView calls updateStats at the end', async () => {
            await mainViewRenderers.renderAlgorithmsView('all');

            // Wait for the dynamic import to complete
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(renderers.updateStats).toHaveBeenCalled();
        });

        test('renders algorithm cards with correct structure', async () => {
            await mainViewRenderers.renderAlgorithmsView('linked-list');

            // Should call createProblemCard for each visible algorithm
            expect(problemCardRenderers.createProblemCard).toHaveBeenCalled();
        });

        test('adds problems to state.problems when not already present', async () => {
            expect(state.problems.has('algo-reverse-linked-list')).toBe(false);

            await mainViewRenderers.renderAlgorithmsView('linked-list');

            expect(state.problems.has('algo-reverse-linked-list')).toBe(true);
            const problem = state.problems.get('algo-reverse-linked-list');
            expect(problem?.pattern).toBe('Algorithms');
            expect(problem?.topic).toBe('linked-list');
        });

        test('does not modify existing problems in state', async () => {
            const existingProblem = {
                id: 'algo-reverse-linked-list',
                name: 'Existing Problem',
                url: 'https://existing.com',
                status: 'solved' as const,
                topic: 'linked-list',
                pattern: 'Algorithms',
                reviewInterval: 3,
                nextReviewDate: '2023-02-01',
                note: 'Existing note',
                loading: false,
                noteVisible: true,
            };
            state.problems.set('algo-reverse-linked-list', existingProblem);

            await mainViewRenderers.renderAlgorithmsView('linked-list');

            expect(state.problems.get('algo-reverse-linked-list')).toBe(existingProblem);
        });

        test('shows date filter for review/solved modes', async () => {
            state.ui.currentFilter = 'solved';

            await mainViewRenderers.renderAlgorithmsView('all');

            expect(ui.toggleDateFilterVisibility).toHaveBeenCalledWith(true);
            expect(ui.populateDateFilter).toHaveBeenCalled();
        });

        test('hides date filter for other modes', async () => {
            state.ui.currentFilter = 'all';

            await mainViewRenderers.renderAlgorithmsView('all');

            expect(ui.toggleDateFilterVisibility).toHaveBeenCalledWith(false);
        });

        test('applies search query filter', async () => {
            const searchInput = state.elements['problemSearch'] as HTMLInputElement;
            searchInput.value = 'search term';

            await mainViewRenderers.renderAlgorithmsView('all');

            // shouldShowProblem should be called with search query
            expect(shouldShowProblem).toHaveBeenCalledWith(
                expect.any(Object),
                'all',
                'search term',
                '2023-01-01'
            );
        });

        test('handles algorithms with space-y-6 section class', async () => {
            await mainViewRenderers.renderAlgorithmsView('all');

            const container = state.elements['problemsContainer'] as HTMLElement;
            const section = container.querySelector('.space-y-6');
            expect(section).not.toBeNull();
        });
    });
});
