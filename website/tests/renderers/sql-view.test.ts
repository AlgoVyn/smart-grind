// --- SQL VIEW RENDERER TESTS ---
// Comprehensive unit tests for sql-view.ts

// Mock dependencies - these are hoisted by Jest
jest.mock('../../src/state', () => ({
    markDeletedIdsDirty: jest.fn(),
    markProblemDirty: jest.fn(),
    markFlashCardsDirty: jest.fn(),
    state: {
        problems: new Map(),
        ui: {
            activeTopicId: '',
            activeAlgorithmCategoryId: null,
            activeSQLCategoryId: null,
            currentFilter: 'all',
            searchQuery: '',
            preferredAI: null,
            reviewDateFilter: null,
        },
        elements: {},
    },
}));

jest.mock('../../src/data/sql-data', () => ({
    getSQLCategoryById: jest.fn((id: string) => {
        const categories = [
            {
                id: 'sql-basics',
                title: 'SQL Basics',
                icon: 'database',
                topics: [
                    {
                        id: 'select-fundamentals',
                        name: 'SELECT Fundamentals',
                        patterns: [
                            {
                                name: 'Basic SELECT with WHERE',
                                description: 'Retrieve specific columns',
                                problems: [
                                    { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 'sql-joins',
                title: 'SQL Joins',
                icon: 'git-merge',
                topics: [
                    {
                        id: 'inner-join',
                        name: 'INNER JOIN',
                        patterns: [
                            {
                                name: 'Basic INNER JOIN',
                                problems: [
                                    { id: 'sql-181', name: 'Employees Earning More Than Their Managers', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/' },
                                ],
                            },
                        ],
                    },
                ],
            },
        ];
        return categories.find((cat) => cat.id === id);
    }),
    SQL_DATA: [
        {
            id: 'sql-basics',
            title: 'SQL Basics',
            icon: 'database',
            topics: [
                {
                    id: 'select-fundamentals',
                    name: 'SELECT Fundamentals',
                    patterns: [
                        {
                            name: 'Basic SELECT with WHERE',
                            problems: [
                                { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'sql-joins',
            title: 'SQL Joins',
            icon: 'git-merge',
            topics: [
                {
                    id: 'inner-join',
                    name: 'INNER JOIN',
                    patterns: [
                        {
                            name: 'Basic INNER JOIN',
                            problems: [
                                { id: 'sql-181', name: 'Employees Earning More Than Their Managers', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/' },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}));

jest.mock('../../src/utils', () => ({
    updateUrlParameter: jest.fn(),
    scrollToTop: jest.fn(),
    getToday: jest.fn(() => '2023-01-01'),
    getNextReviewDate: jest.fn((today: string, interval: number) => {
        const date = new Date(today);
        date.setDate(date.getDate() + (interval === 0 ? 1 : Math.pow(2, interval)));
        return date.toISOString().split('T')[0];
    }),
    formatDate: jest.fn((date: string) => date),
}));

jest.mock('../../src/renderers/sidebar', () => ({
    sidebarRenderers: {
        setActiveTopic: jest.fn(),
        setActiveAlgorithmCategory: jest.fn(),
        setActiveSQLCategory: jest.fn(),
    },
}));

jest.mock('../../src/renderers', () => ({
    renderers: {
        updateStats: jest.fn(),
        renderSidebar: jest.fn(),
    },
}));

jest.mock('../../src/renderers/html-generators', () => ({
    htmlGenerators: {
        generateProblemCardHTML: jest.fn((problem) => ({
            className: 'test-card-class',
            innerHTML: `<div class="test-card">${problem.name}</div>`,
        })),
    },
}));

jest.mock('../../src/renderers/icons', () => ({
    ICONS: {
        delete: '<svg class="delete-icon"></svg>',
        note: '<svg class="note-icon"></svg>',
        reset: '<svg class="reset-icon"></svg>',
    },
}));

jest.mock('../../src/ui/ui-markdown', () => ({
    openSQLSolutionModal: jest.fn(),
    openProblemSQLSolutionModal: jest.fn(),
}));

jest.mock('../../src/api', () => ({
    api: {
        saveProblemWithSync: jest.fn().mockResolvedValue(undefined),
        resetSQLCategory: jest.fn().mockResolvedValue(undefined),
        deleteSQLCategory: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock('../../src/data', () => ({
    data: {
        sqlData: [
            {
                id: 'sql-basics',
                title: 'SQL Basics',
                topics: [
                    {
                        id: 'select-fundamentals',
                        name: 'SELECT Fundamentals',
                        patterns: [
                            {
                                name: 'Basic SELECT with WHERE',
                                problems: [
                                    { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
}));

// Import the module under test and mocked dependencies
import { sqlViewRenderers } from '../../src/renderers/sql-view';
import { state } from '../../src/state';
import { getSQLCategoryById } from '../../src/data/sql-data';
import { updateUrlParameter, scrollToTop, getToday, getNextReviewDate } from '../../src/utils';
import { sidebarRenderers } from '../../src/renderers/sidebar';
import { renderers } from '../../src/renderers';
import { htmlGenerators } from '../../src/renderers/html-generators';
import { openSQLSolutionModal, openProblemSQLSolutionModal } from '../../src/ui/ui-markdown';
import { api } from '../../src/api';

describe('sqlViewRenderers', () => {
    // Store original methods before any mocking
    const originalGetElementById = document.getElementById.bind(document);
    const originalQuerySelector = document.querySelector.bind(document);
    const originalQuerySelectorAll = document.querySelectorAll.bind(document);
    const originalCreateElement = document.createElement.bind(document);

    // Mock element factory
    const createMockElement = (overrides: Partial<HTMLElement> = {}): HTMLElement => {
        const appendChildMock = jest.fn();
        const addEventListenerMock = jest.fn();
        const removeMock = jest.fn();
        const insertAdjacentElementMock = jest.fn();
        const classListAddMock = jest.fn();
        const classListRemoveMock = jest.fn();
        const classListToggleMock = jest.fn();
        const closestMock = jest.fn(() => null);
        const getAttributeMock = jest.fn();
        const querySelectorMock = jest.fn(() => null);

        const el = {
            tagName: 'DIV',
            className: '',
            innerHTML: '',
            innerText: '',
            textContent: '',
            style: {},
            dataset: {},
            title: '',
            disabled: false,
            type: 'button',
            onclick: null,
            addEventListener: addEventListenerMock,
            remove: removeMock,
            insertAdjacentElement: insertAdjacentElementMock,
            classList: {
                add: classListAddMock,
                remove: classListRemoveMock,
                toggle: classListToggleMock,
                contains: jest.fn(),
            },
            querySelector: querySelectorMock,
            querySelectorAll: jest.fn(() => []),
            closest: closestMock,
            getAttribute: getAttributeMock,
            setAttribute: jest.fn(),
            appendChild: appendChildMock,
            ...overrides,
        } as unknown as HTMLElement;
        return el;
    };

    let mockContainer: HTMLElement;
    let mockViewTitle: HTMLElement;

    beforeEach(() => {
        jest.clearAllMocks();
        state.problems.clear();

        // Setup mock DOM elements
        mockContainer = createMockElement({ id: 'problems-container' });
        mockViewTitle = createMockElement({ id: 'current-view-title' });

        // Setup document mocks using spyOn
        jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
            if (id === 'problems-container') return mockContainer;
            if (id === 'current-view-title') return mockViewTitle;
            return null;
        });

        jest.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
            if (selector === '.category-action-container') return null;
            return null;
        });

        jest.spyOn(document, 'querySelectorAll').mockImplementation(() => []);

        jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
            return createMockElement({ tagName: tag.toUpperCase() });
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('initializeSQLProblem', () => {
        test('1. creates new problem when not exists', () => {
            const problemDef = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
            };

            const result = sqlViewRenderers.initializeSQLProblem(problemDef, 'SELECT Fundamentals', 'Basic SELECT with WHERE');

            expect(result.id).toBe('sql-175');
            expect(result.name).toBe('Combine Two Tables');
            expect(result.url).toBe('https://leetcode.com/problems/combine-two-tables/');
            expect(result.status).toBe('unsolved');
            expect(result.topic).toBe('SELECT Fundamentals');
            expect(result.pattern).toBe('Basic SELECT with WHERE');
            expect(result.reviewInterval).toBe(0);
            expect(result.nextReviewDate).toBeNull();
            expect(result.note).toBe('');
            expect(state.problems.has('sql-175')).toBe(true);
        });

        test('2. returns existing problem when already exists', () => {
            const existingProblem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'solved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 2,
                nextReviewDate: '2023-01-15',
                note: 'My note',
            };
            state.problems.set('sql-175', existingProblem);

            const problemDef = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
            };

            const result = sqlViewRenderers.initializeSQLProblem(problemDef, 'SELECT Fundamentals', 'Basic SELECT with WHERE');

            expect(result).toBe(existingProblem);
            expect(state.problems.size).toBe(1);
        });

        test('3. sets correct default values for new problem', () => {
            const problemDef = {
                id: 'sql-999',
                name: 'Test Problem',
                url: 'https://leetcode.com/problems/test/',
            };

            const result = sqlViewRenderers.initializeSQLProblem(problemDef, 'Test Topic', 'Test Pattern');

            expect(result.status).toBe('unsolved');
            expect(result.reviewInterval).toBe(0);
            expect(result.nextReviewDate).toBeNull();
            expect(result.note).toBe('');
            expect(result.topic).toBe('Test Topic');
            expect(result.pattern).toBe('Test Pattern');
        });
    });

    describe('renderSQLView', () => {
        test('4. returns early when container not found', async () => {
            jest.spyOn(document, 'getElementById').mockImplementation(() => null);

            const result = await sqlViewRenderers.renderSQLView('sql-basics');

            expect(result).toBeUndefined();
            expect(mockContainer.innerHTML).toBe('');
        });

        test('5. with specific category ID - shows category title and buttons', async () => {
            await sqlViewRenderers.renderSQLView('sql-basics');

            expect(getSQLCategoryById).toHaveBeenCalledWith('sql-basics');
            expect(mockViewTitle.textContent).toBe('SQL Basics');
        });

        test('6. with all - shows All SQL Problems and reset button', async () => {
            await sqlViewRenderers.renderSQLView('all');

            expect(mockViewTitle.textContent).toBe('All SQL Problems');
            expect(mockViewTitle.insertAdjacentElement).toHaveBeenCalled();
        });

        test('handles undefined category gracefully', async () => {
            jest.mocked(getSQLCategoryById).mockReturnValueOnce(undefined);

            await sqlViewRenderers.renderSQLView('nonexistent');

            expect(mockViewTitle.textContent).toBe('SQL');
        });
    });

    describe('attachProblemCardListeners', () => {
        // DEPRECATED: attachProblemCardListeners is now a no-op because event delegation
        // is handled by bindProblemEvents() in ui-problems.ts on the problemsContainer.
        // This avoids duplicate listeners accumulating on re-render.
        test('attachProblemCardListeners is a no-op (event delegation is handled elsewhere)', () => {
            // Verify it doesn't throw
            expect(() => sqlViewRenderers.attachProblemCardListeners()).not.toThrow();
        });
    });

    describe('handleSolve', () => {
        test('11. toggles status from unsolved to solved', async () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };

            await sqlViewRenderers.handleSolve(mockButton, problem);

            expect(problem.status).toBe('solved');
        });

        test('11b. toggles status from solved to unsolved', async () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'solved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 2,
                nextReviewDate: '2023-01-15',
                note: '',
            };

            await sqlViewRenderers.handleSolve(mockButton, problem);

            expect(problem.status).toBe('unsolved');
        });

        test('12. updates review interval and next review date when solving', async () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };

            jest.mocked(getToday).mockReturnValue('2023-01-01');
            jest.mocked(getNextReviewDate).mockReturnValue('2023-01-02');

            await sqlViewRenderers.handleSolve(mockButton, problem);

            expect(problem.reviewInterval).toBe(0);
            expect(problem.nextReviewDate).toBe('2023-01-02');
            expect(getNextReviewDate).toHaveBeenCalledWith('2023-01-01', 0);
        });

        test('12b. clears next review date when unsolving', async () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'solved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 2,
                nextReviewDate: '2023-01-15',
                note: '',
            };

            await sqlViewRenderers.handleSolve(mockButton, problem);

            expect(problem.nextReviewDate).toBeNull();
        });

        test('13. re-renders card and saves to storage', async () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };

            await sqlViewRenderers.handleSolve(mockButton, problem);

            expect(htmlGenerators.generateProblemCardHTML).toHaveBeenCalledWith(problem);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                'sql-175',
                expect.objectContaining({
                    status: 'solved',
                    reviewInterval: 0,
                    nextReviewDate: expect.any(String),
                })
            );
        });

        test('13b. updates sidebar stats and re-renders', async () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };

            await sqlViewRenderers.handleSolve(mockButton, problem);

            expect(renderers.updateStats).toHaveBeenCalled();
            expect(renderers.renderSidebar).toHaveBeenCalled();
        });
    });

    describe('handleToggleNote', () => {
        test('14. toggles noteVisible from false to true', () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
                noteVisible: false,
            };

            sqlViewRenderers.handleToggleNote(mockButton, problem);

            expect(problem.noteVisible).toBe(true);
        });

        test('14b. toggles noteVisible from true to false', () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: 'Existing note',
                noteVisible: true,
            };

            sqlViewRenderers.handleToggleNote(mockButton, problem);

            expect(problem.noteVisible).toBe(false);
        });

        test('15. re-renders card after toggling note', () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
                noteVisible: false,
            };

            sqlViewRenderers.handleToggleNote(mockButton, problem);

            expect(htmlGenerators.generateProblemCardHTML).toHaveBeenCalledWith(problem);
            expect(mockCard.className).toBe('test-card-class');
            expect(mockCard.innerHTML).toContain('Combine Two Tables');
        });

        test('15b. handleToggleNote no longer re-attaches listeners (event delegation is used)', () => {
            const mockCard = createMockElement();
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => mockCard);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
                noteVisible: false,
            };

            const attachListenersSpy = jest.spyOn(sqlViewRenderers, 'attachProblemCardListeners');

            sqlViewRenderers.handleToggleNote(mockButton, problem);

            // Event delegation is now handled by bindProblemEvents() - no per-element re-attachment
            expect(attachListenersSpy).not.toHaveBeenCalled();
        });

        test('does nothing when card not found', () => {
            const mockButton = createMockElement();
            mockButton.closest = jest.fn(() => null);

            const problem = {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'unsolved' as const,
                topic: 'SELECT Fundamentals',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
                noteVisible: false,
            };

            expect(() => {
                sqlViewRenderers.handleToggleNote(mockButton, problem);
            }).not.toThrow();
        });
    });

    describe('renderSQLTopic', () => {
        test('16. creates correct structure', () => {
            const topic = {
                id: 'select-fundamentals',
                name: 'SELECT Fundamentals',
                patterns: [
                    {
                        name: 'Basic SELECT with WHERE',
                        description: 'Retrieve specific columns',
                        problems: [
                            { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                        ],
                    },
                ],
            };

            const result = sqlViewRenderers.renderSQLTopic(topic, 'SQL Basics');

            expect(result.tagName).toBe('SECTION');
            expect(result.className).toBe('mb-8');
            expect(result.appendChild).toHaveBeenCalled();
        });

        test('creates topic header with correct title', () => {
            const topic = {
                id: 'select-fundamentals',
                name: 'SELECT Fundamentals',
                patterns: [],
            };

            const result = sqlViewRenderers.renderSQLTopic(topic, 'SQL Basics');

            // Verify appendChild was called for topic header
            expect(result.appendChild).toHaveBeenCalled();
        });
    });

    describe('renderSQLPattern', () => {
        test('17. creates pattern with problems', () => {
            const pattern = {
                name: 'Basic SELECT with WHERE',
                description: 'Retrieve specific columns',
                problems: [
                    { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                ],
            };

            const result = sqlViewRenderers.renderSQLPattern(pattern, 'SELECT Fundamentals', 'SQL Basics');

            expect(result.className).toBe('mb-6');
            expect(result.appendChild).toHaveBeenCalled();
        });

        test('18. adds solution button', () => {
            const pattern = {
                name: 'Basic SELECT with WHERE',
                description: 'Retrieve specific columns',
                problems: [],
            };

            const result = sqlViewRenderers.renderSQLPattern(pattern, 'SELECT Fundamentals', 'SQL Basics');

            // Solution button is appended via appendChild
            expect(result.appendChild).toHaveBeenCalled();
        });

        test('initializes problems and creates cards', () => {
            const pattern = {
                name: 'Basic SELECT with WHERE',
                problems: [
                    { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                ],
            };

            const initializeSpy = jest.spyOn(sqlViewRenderers, 'initializeSQLProblem');

            sqlViewRenderers.renderSQLPattern(pattern, 'SELECT Fundamentals', 'SQL Basics');

            expect(initializeSpy).toHaveBeenCalledWith(
                { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                'SELECT Fundamentals',
                'Basic SELECT with WHERE'
            );
        });

        test('creates problems grid with correct class', () => {
            const pattern = {
                name: 'Basic SELECT with WHERE',
                problems: [],
            };

            const result = sqlViewRenderers.renderSQLPattern(pattern, 'SELECT Fundamentals', 'SQL Basics');

            // Verify the pattern section was created with correct class
            expect(result.className).toBe('mb-6');
        });
    });

    describe('renderSQLCategoryView', () => {
        test('renders category with all topics', async () => {
            const category = {
                id: 'sql-basics',
                title: 'SQL Basics',
                icon: 'database',
                topics: [
                    {
                        id: 'select-fundamentals',
                        name: 'SELECT Fundamentals',
                        patterns: [
                            {
                                name: 'Basic SELECT with WHERE',
                                problems: [
                                    { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                                ],
                            },
                        ],
                    },
                ],
            };

            const mockContainerEl = createMockElement();

            await sqlViewRenderers.renderSQLCategoryView(mockContainerEl, category);

            expect(mockContainerEl.appendChild).toHaveBeenCalled();
        });
    });

    describe('renderAllSQLView', () => {
        test('renders all SQL categories overview', async () => {
            const mockContainerEl = createMockElement();

            await sqlViewRenderers.renderAllSQLView(mockContainerEl);

            expect(mockContainerEl.appendChild).toHaveBeenCalled();
        });

        test('renders each category with topics', async () => {
            const mockContainerEl = createMockElement();

            await sqlViewRenderers.renderAllSQLView(mockContainerEl);

            expect(mockContainerEl.appendChild).toHaveBeenCalled();
        });
    });

    describe('renderSQLTopicForCombined', () => {
        test('renders topic section for combined view', () => {
            const topic = {
                id: 'select-fundamentals',
                name: 'SELECT Fundamentals',
                patterns: [
                    {
                        name: 'Basic SELECT with WHERE',
                        problems: [
                            { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                        ],
                    },
                ],
            };

            const result = sqlViewRenderers.renderSQLTopicForCombined(topic, 'SQL Basics');

            expect(result.className).toBe('mb-6');
            expect(result.appendChild).toHaveBeenCalled();
        });

        test('renders all patterns in topic', () => {
            const topic = {
                id: 'select-fundamentals',
                name: 'SELECT Fundamentals',
                patterns: [
                    {
                        name: 'Pattern 1',
                        problems: [{ id: 'sql-1', name: 'Problem 1', url: 'https://leetcode.com/problems/1/' }],
                    },
                    {
                        name: 'Pattern 2',
                        problems: [{ id: 'sql-2', name: 'Problem 2', url: 'https://leetcode.com/problems/2/' }],
                    },
                ],
            };

            const result = sqlViewRenderers.renderSQLTopicForCombined(topic, 'SQL Basics');

            // Should append 2 patterns + 1 topic header
            expect(result.appendChild).toHaveBeenCalled();
        });
    });

    describe('renderSQLPatternForCombined', () => {
        test('renders pattern section for combined view', () => {
            const pattern = {
                name: 'Basic SELECT with WHERE',
                problems: [
                    { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                ],
            };

            const result = sqlViewRenderers.renderSQLPatternForCombined(pattern, 'SELECT Fundamentals', 'SQL Basics');

            expect(result.className).toBe('mb-4');
            expect(result.appendChild).toHaveBeenCalled();
        });

        test('adds solution button for combined view', () => {
            const pattern = {
                name: 'Basic SELECT with WHERE',
                problems: [],
            };

            const result = sqlViewRenderers.renderSQLPatternForCombined(pattern, 'SELECT Fundamentals', 'SQL Basics');

            // Solution button should be appended
            expect(result.appendChild).toHaveBeenCalled();
        });

        test('initializes and creates cards for all problems', () => {
            const pattern = {
                name: 'Basic SELECT with WHERE',
                problems: [
                    { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                    { id: 'sql-181', name: 'Employees Earning More Than Their Managers', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/' },
                ],
            };

            const initializeSpy = jest.spyOn(sqlViewRenderers, 'initializeSQLProblem');

            sqlViewRenderers.renderSQLPatternForCombined(pattern, 'SELECT Fundamentals', 'SQL Basics');

            expect(initializeSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('renderSQLCategoryViewForCombined', () => {
        test('renders category section for combined view', () => {
            const category = {
                id: 'sql-basics',
                title: 'SQL Basics',
                icon: 'database',
                topics: [
                    {
                        id: 'select-fundamentals',
                        name: 'SELECT Fundamentals',
                        patterns: [
                            {
                                name: 'Basic SELECT with WHERE',
                                problems: [
                                    { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                                ],
                            },
                        ],
                    },
                ],
            };

            const result = sqlViewRenderers.renderSQLCategoryViewForCombined(category);

            expect(result.className).toBe('mb-8');
            expect(result.appendChild).toHaveBeenCalled();
        });

        test('renders all topics in category', () => {
            const category = {
                id: 'sql-basics',
                title: 'SQL Basics',
                icon: 'database',
                topics: [
                    {
                        id: 'topic-1',
                        name: 'Topic 1',
                        patterns: [],
                    },
                    {
                        id: 'topic-2',
                        name: 'Topic 2',
                        patterns: [],
                    },
                ],
            };

            const result = sqlViewRenderers.renderSQLCategoryViewForCombined(category);

            // Should append 2 topics + 1 category header
            expect(result.appendChild).toHaveBeenCalled();
        });
    });

    describe('_removeActionContainer', () => {
        test('19. removes existing action container', () => {
            const mockExistingContainer = createMockElement();
            jest.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
                if (selector === '.category-action-container') {
                    return mockExistingContainer;
                }
                return null;
            });

            sqlViewRenderers._removeActionContainer();

            expect(mockExistingContainer.remove).toHaveBeenCalled();
        });

        test('does nothing when no container exists', () => {
            jest.spyOn(document, 'querySelector').mockImplementation(() => null);

            expect(() => {
                sqlViewRenderers._removeActionContainer();
            }).not.toThrow();
        });
    });

    describe('_createActionBtn', () => {
        test('20. creates button with correct attributes', () => {
            const iconSvg = '<svg class="test-icon"></svg>';
            const title = 'Test Button';
            const bgClass = 'bg-test-class';
            const onClick = jest.fn();

            const result = sqlViewRenderers._createActionBtn(iconSvg, title, bgClass, onClick);

            expect(result.tagName).toBe('BUTTON');
            expect(result.type).toBe('button');
            expect(result.className).toContain('bg-test-class');
            expect(result.innerHTML).toBe(iconSvg);
            expect(result.title).toBe(title);
        });

        test('click triggers the onClick callback', () => {
            const iconSvg = '<svg class="test-icon"></svg>';
            const title = 'Test Button';
            const bgClass = 'bg-test-class';
            const onClick = jest.fn();

            const result = sqlViewRenderers._createActionBtn(iconSvg, title, bgClass, onClick);

            // Simulate click by calling onclick directly
            if (result.onclick) {
                result.onclick(new MouseEvent('click'));
            }

            expect(onClick).toHaveBeenCalled();
        });
    });

    describe('_addSQLCategoryActionButtons', () => {
        test('21. adds reset and delete buttons', () => {
            const mockTitle = createMockElement();
            jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
                if (id === 'current-view-title') return mockTitle;
                if (id === 'problems-container') return mockContainer;
                return null;
            });

            sqlViewRenderers._addSQLCategoryActionButtons('sql-basics');

            expect(mockTitle.insertAdjacentElement).toHaveBeenCalledWith(
                'afterend',
                expect.objectContaining({
                    className: expect.stringContaining('category-action-container'),
                })
            );
        });

        test('calls _removeActionContainer first', () => {
            const removeSpy = jest.spyOn(sqlViewRenderers, '_removeActionContainer');

            const mockTitle = createMockElement();
            jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
                if (id === 'current-view-title') return mockTitle;
                if (id === 'problems-container') return mockContainer;
                return null;
            });

            sqlViewRenderers._addSQLCategoryActionButtons('sql-basics');

            expect(removeSpy).toHaveBeenCalled();
        });
    });

    describe('navigateToSQLCategory', () => {
        test('22. updates state and renders', () => {
            sqlViewRenderers.navigateToSQLCategory('sql-basics');

            expect(sidebarRenderers.setActiveTopic).toHaveBeenCalledWith(null);
            expect(sidebarRenderers.setActiveAlgorithmCategory).toHaveBeenCalledWith(null);
            expect(sidebarRenderers.setActiveSQLCategory).toHaveBeenCalledWith('sql-basics');
            expect(updateUrlParameter).toHaveBeenCalledWith('sql', 'sql-basics');
            expect(scrollToTop).toHaveBeenCalled();
        });

        test('handles all category', () => {
            sqlViewRenderers.navigateToSQLCategory('all');

            expect(updateUrlParameter).toHaveBeenCalledWith('sql', null);
            expect(scrollToTop).toHaveBeenCalled();
        });

        test('calls renderSQLView', () => {
            const renderSpy = jest.spyOn(sqlViewRenderers, 'renderSQLView');

            sqlViewRenderers.navigateToSQLCategory('sql-basics');

            expect(renderSpy).toHaveBeenCalledWith('sql-basics');
        });
    });
});
