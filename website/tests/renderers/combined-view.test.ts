/**
 * Combined View Renderer Tests
 * Tests for the combined view that renders patterns, algorithms, and SQL sections
 */

// Mock dependencies before importing the module - use path alias for consistent resolution
jest.mock('@/state', () => ({
    state: {
        problems: new Map(),
    },
}));

jest.mock('@/data', () => ({
    data: {
        topicsData: [],
        algorithmsData: [],
        sqlData: [],
    },
}));

jest.mock('@/utils', () => ({
    getToday: jest.fn(() => '2025-06-15'),
}));

jest.mock('@/renderers/html-generators', () => ({
    htmlGenerators: {
        renderTopicSection: jest.fn(),
        generateProblemCardHTML: jest.fn(),
    },
}));

jest.mock('@/renderers/problem-cards', () => ({
    problemCardRenderers: {
        handleSolve: jest.fn(),
        handleNoteToggle: jest.fn(),
    },
}));

jest.mock('@/renderers/sql-view', () => ({
    sqlViewRenderers: {
        renderSQLCategoryViewForCombined: jest.fn(),
    },
}));

jest.mock('@/renderers/main-view', () => ({
    mainViewRenderers: {
        _removeActionContainer: jest.fn(),
        _createActionBtn: jest.fn(),
    },
}));

jest.mock('@/renderers/icons', () => ({
    ICONS: {
        reset: '<svg class="icon-reset"></svg>',
    },
}));

jest.mock('@/api', () => ({
    api: {
        resetAll: jest.fn().mockResolvedValue(undefined),
    },
}));

// Now import the module - use path alias
import { combinedViewRenderers } from '@/renderers/combined-view';
import { state } from '@/state';
import { data } from '@/data';
import { Topic, Problem } from '@/types';
import { AlgorithmCategory } from '@/data/algorithms-data';
import { SQLCategory } from '@/data/sql-data';
import { getToday } from '@/utils';
import { htmlGenerators } from '@/renderers/html-generators';
import { problemCardRenderers } from '@/renderers/problem-cards';
import { sqlViewRenderers } from '@/renderers/sql-view';
import { mainViewRenderers } from '@/renderers/main-view';
import { ICONS } from '@/renderers/icons';
import { api } from '@/api';

describe('combinedViewRenderers', () => {
    // Mock data structures
    const mockTopics: Topic[] = [
        {
            id: 'arrays',
            title: 'Arrays',
            patterns: [
                { name: 'Two Sum', problems: ['1', '2'] },
            ],
        },
        {
            id: 'strings',
            title: 'Strings',
            patterns: [
                { name: 'Palindrome', problems: ['3'] },
            ],
        },
    ];

    const mockAlgorithmCategories: AlgorithmCategory[] = [
        {
            id: 'sorting',
            title: 'Sorting Algorithms',
            algorithms: [
                { id: 'algo-1', name: 'Bubble Sort', url: '/algo/bubble-sort' },
                { id: 'algo-2', name: 'Quick Sort', url: '/algo/quick-sort' },
            ],
        },
    ];

    const mockSQLCategories: SQLCategory[] = [
        {
            id: 'joins',
            title: 'SQL Joins',
            problems: [
                { id: 'sql-1', name: 'Inner Join', url: '/sql/inner-join' },
            ],
        },
    ];

    const mockProblems: Map<string, Problem> = new Map([
        ['1', { id: '1', name: 'Two Sum', status: 'unsolved', url: '/problems/two-sum' } as Problem],
        ['2', { id: '2', name: 'Two Sum II', status: 'solved', nextReviewDate: '2025-12-31', url: '/problems/two-sum-ii' } as Problem],
        ['3', { id: '3', name: 'Valid Palindrome', status: 'unsolved', url: '/problems/valid-palindrome' } as Problem],
        ['algo-1', { id: 'algo-1', name: 'Bubble Sort', status: 'unsolved', url: '/algo/bubble-sort' } as Problem],
        ['algo-2', { id: 'algo-2', name: 'Quick Sort', status: 'solved', nextReviewDate: '2025-12-31', url: '/algo/quick-sort' } as Problem],
    ]);

    let mockContainer: HTMLElement;
    let mockViewTitle: HTMLElement;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup DOM
        document.body.innerHTML = `
            <div id="problems-container"></div>
            <h1 id="current-view-title">Original Title</h1>
        `;
        mockContainer = document.getElementById('problems-container') as HTMLElement;
        mockViewTitle = document.getElementById('current-view-title') as HTMLElement;

        // Setup mock state data
        (state as any).problems = mockProblems;
        (data as any).topicsData = mockTopics;
        (data as any).algorithmsData = mockAlgorithmCategories;
        (data as any).sqlData = mockSQLCategories;

        // Setup mock implementations
        (getToday as jest.Mock).mockReturnValue('2025-06-15');

        (htmlGenerators.renderTopicSection as jest.Mock).mockImplementation((topic: Topic) => {
            const section = document.createElement('div');
            section.className = 'topic-section';
            section.setAttribute('data-topic-id', topic.id);
            return section;
        });

        (htmlGenerators.generateProblemCardHTML as jest.Mock).mockImplementation((problem: Problem) => ({
            className: 'problem-card',
            innerHTML: `<div class="card-content">${problem.name}</div>`,
        }));

        (sqlViewRenderers.renderSQLCategoryViewForCombined as jest.Mock).mockImplementation((category: SQLCategory) => {
            const section = document.createElement('div');
            section.className = 'sql-category';
            section.setAttribute('data-category-id', category.id);
            return section;
        });

        (mainViewRenderers._createActionBtn as jest.Mock).mockImplementation(
            (icon: string, title: string, bgClass: string, onClick: () => void) => {
                const btn = document.createElement('button');
                btn.className = `action-btn ${bgClass}`;
                btn.innerHTML = icon;
                btn.title = title;
                btn.addEventListener('click', onClick);
                return btn;
            }
        );
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('renderCombinedView', () => {
        test('returns early when container not found', async () => {
            document.body.innerHTML = '';
            
            const result = await combinedViewRenderers.renderCombinedView();
            
            expect(result).toBeUndefined();
            expect(htmlGenerators.renderTopicSection).not.toHaveBeenCalled();
        });

        test('clears existing content from container before rendering', async () => {
            // Set up a spy to verify innerHTML is cleared
            const innerHTMLSpy = jest.spyOn(mockContainer, 'innerHTML', 'set');
            mockContainer.innerHTML = '<div class="old-content">Old</div>';
            
            await combinedViewRenderers.renderCombinedView();
            
            // Verify innerHTML was set to empty string at least once (the clear operation)
            const clearCall = innerHTMLSpy.mock.calls.find(call => call[0] === '');
            expect(clearCall).toBeDefined();
            innerHTMLSpy.mockRestore();
        });

        test('removes action buttons from previous views', async () => {
            await combinedViewRenderers.renderCombinedView();
            
            expect(mainViewRenderers._removeActionContainer).toHaveBeenCalled();
        });

        test('updates view title to All Content', async () => {
            await combinedViewRenderers.renderCombinedView();
            
            expect(mockViewTitle.textContent).toBe('All Content');
        });

        test('adds reset button for All Content', async () => {
            await combinedViewRenderers.renderCombinedView();
            
            const actionContainer = document.querySelector('.category-action-container');
            expect(actionContainer).toBeTruthy();
            expect(mainViewRenderers._createActionBtn).toHaveBeenCalledWith(
                ICONS.reset,
                'Reset All Content',
                'bg-blue-500/10',
                expect.any(Function)
            );
        });

        test('reset button calls api.resetAll when clicked', async () => {
            await combinedViewRenderers.renderCombinedView();
            
            const createBtnCall = (mainViewRenderers._createActionBtn as jest.Mock).mock.calls[0];
            const onClickHandler = createBtnCall[3];
            
            await onClickHandler();
            
            expect(api.resetAll).toHaveBeenCalled();
        });

        test('renders patterns section with all topics', async () => {
            await combinedViewRenderers.renderCombinedView();
            
            expect(htmlGenerators.renderTopicSection).toHaveBeenCalledTimes(mockTopics.length);
            expect(htmlGenerators.renderTopicSection).toHaveBeenCalledWith(
                mockTopics[0],
                'all',
                '2025-06-15',
                expect.any(Object)
            );
            expect(htmlGenerators.renderTopicSection).toHaveBeenCalledWith(
                mockTopics[1],
                'all',
                '2025-06-15',
                expect.any(Object)
            );
        });

        test('renders algorithms section with all categories', async () => {
            await combinedViewRenderers.renderCombinedView();
            
            const headers = mockContainer.querySelectorAll('h2');
            const algorithmsHeader = Array.from(headers).find(h => h.textContent === 'Algorithms');
            expect(algorithmsHeader).toBeTruthy();
        });

        test('renders SQL section with all categories', async () => {
            await combinedViewRenderers.renderCombinedView();
            
            expect(sqlViewRenderers.renderSQLCategoryViewForCombined).toHaveBeenCalledTimes(mockSQLCategories.length);
            expect(sqlViewRenderers.renderSQLCategoryViewForCombined).toHaveBeenCalledWith(mockSQLCategories[0]);
            
            const headers = mockContainer.querySelectorAll('h2');
            const sqlHeader = Array.from(headers).find(h => h.textContent === 'SQL');
            expect(sqlHeader).toBeTruthy();
        });

        test('calls attachEventListeners at the end', async () => {
            const attachSpy = jest.spyOn(combinedViewRenderers, 'attachEventListeners');
            
            await combinedViewRenderers.renderCombinedView();
            
            expect(attachSpy).toHaveBeenCalled();
            attachSpy.mockRestore();
        });
    });

    describe('renderAlgorithmCategory', () => {
        test('creates section with correct structure', () => {
            const category = mockAlgorithmCategories[0];
            
            const result = combinedViewRenderers.renderAlgorithmCategory(category);
            
            expect(result).toBeInstanceOf(HTMLElement);
            expect(result.className).toBe('mb-8');
            expect(result.tagName).toBe('DIV');
        });

        test('renders category header', () => {
            const category = mockAlgorithmCategories[0];
            
            const result = combinedViewRenderers.renderAlgorithmCategory(category);
            
            const header = result.querySelector('h3');
            expect(header).toBeTruthy();
            expect(header?.textContent).toBe(category.title);
        });

        test('renders only existing problems from state', () => {
            const categoryWithMissingProblem: AlgorithmCategory = {
                id: 'test',
                title: 'Test Category',
                algorithms: [
                    { id: 'algo-1', name: 'Exists', url: '/exists' },
                    { id: 'non-existent', name: 'Missing', url: '/missing' },
                ],
            };
            
            const result = combinedViewRenderers.renderAlgorithmCategory(categoryWithMissingProblem);
            
            // Should only render cards for existing problems (algo-1 exists, non-existent does not)
            const cards = result.querySelectorAll('[data-problem-id]');
            expect(cards.length).toBe(1);
            expect(cards[0].getAttribute('data-problem-id')).toBe('algo-1');
        });

        test('creates problem cards with correct attributes', () => {
            const category = mockAlgorithmCategories[0];
            
            const result = combinedViewRenderers.renderAlgorithmCategory(category);
            
            const cards = result.querySelectorAll('[data-problem-id]');
            expect(cards.length).toBe(2);
            
            // Check first card
            expect(cards[0].getAttribute('data-problem-id')).toBe('algo-1');
            expect(cards[0].className).toBe('problem-card');
            
            // Check htmlGenerators.generateProblemCardHTML was called
            expect(htmlGenerators.generateProblemCardHTML).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'algo-1' })
            );
        });

        test('creates grid container for algorithms', () => {
            const category = mockAlgorithmCategories[0];
            
            const result = combinedViewRenderers.renderAlgorithmCategory(category);
            
            const grid = result.querySelector('.grid');
            expect(grid).toBeTruthy();
            expect(grid?.className).toContain('grid-cols-1');
            expect(grid?.className).toContain('gap-3');
        });
    });

    describe('attachEventListeners', () => {
        beforeEach(() => {
            // Create mock action buttons in the DOM
            document.body.innerHTML = `
                <div id="test-container">
                    <button class="action-btn" data-action="solve" data-problem-id="1">Solve</button>
                    <button class="action-btn" data-action="reset" data-problem-id="2">Reset</button>
                    <button class="action-btn" data-action="review" data-problem-id="3">Review</button>
                    <button class="action-btn" data-action="toggle-note" data-problem-id="1">Note</button>
                </div>
                <div data-problem-id="1" id="card-1">
                    <button class="action-btn" data-action="solve">Solve</button>
                </div>
            `;
        });

        test('attaches click handlers to action buttons', () => {
            const buttons = document.querySelectorAll('.action-btn[data-action]');
            const addEventListenerSpy = jest.spyOn(buttons[0], 'addEventListener');
            
            combinedViewRenderers.attachEventListeners();
            
            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
            addEventListenerSpy.mockRestore();
        });

        test('handles solve action by calling handleSolve', () => {
            combinedViewRenderers.attachEventListeners();
            
            const solveButton = document.querySelector('[data-action="solve"]');
            solveButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            expect(problemCardRenderers.handleSolve).toHaveBeenCalled();
        });

        test('handles reset action by calling handleSolve', () => {
            combinedViewRenderers.attachEventListeners();
            
            const resetButton = document.querySelector('[data-action="reset"]');
            resetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            expect(problemCardRenderers.handleSolve).toHaveBeenCalled();
        });

        test('handles review action by calling handleSolve', () => {
            combinedViewRenderers.attachEventListeners();
            
            const reviewButton = document.querySelector('[data-action="review"]');
            reviewButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            expect(problemCardRenderers.handleSolve).toHaveBeenCalled();
        });

        test('handles toggle-note action by calling handleNoteToggle', () => {
            combinedViewRenderers.attachEventListeners();
            
            const noteButton = document.querySelector('[data-action="toggle-note"]');
            noteButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            expect(problemCardRenderers.handleNoteToggle).toHaveBeenCalled();
        });

        test('does nothing when problem not found in state', () => {
            document.body.innerHTML = `
                <div data-problem-id="non-existent">
                    <button class="action-btn" data-action="solve">Solve</button>
                </div>
            `;
            
            combinedViewRenderers.attachEventListeners();
            
            const button = document.querySelector('[data-action="solve"]');
            button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            expect(problemCardRenderers.handleSolve).not.toHaveBeenCalled();
        });

        test('does nothing when problem-id attribute is missing', () => {
            document.body.innerHTML = `
                <div>
                    <button class="action-btn" data-action="solve">Solve</button>
                </div>
            `;
            
            combinedViewRenderers.attachEventListeners();
            
            const button = document.querySelector('[data-action="solve"]');
            button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            expect(problemCardRenderers.handleSolve).not.toHaveBeenCalled();
        });

        test('gets correct problem from state based on clicked button', () => {
            combinedViewRenderers.attachEventListeners();
            
            const solveButton = document.querySelector('[data-action="solve"][data-problem-id="1"]');
            solveButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            // Check that handleSolve was called with the correct problem
            const problemArg = (problemCardRenderers.handleSolve as jest.Mock).mock.calls[0][1];
            expect(problemArg.id).toBe('1');
        });

        test('passes button element to handler functions', () => {
            combinedViewRenderers.attachEventListeners();
            
            const solveButton = document.querySelector('[data-action="solve"][data-problem-id="1"]');
            solveButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            
            const buttonArg = (problemCardRenderers.handleSolve as jest.Mock).mock.calls[0][0];
            expect(buttonArg).toBe(solveButton);
        });
    });
});
