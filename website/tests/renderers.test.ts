// Save original createElement before mocking
const originalCreateElement = document.createElement.bind(document);

// Mock dependencies before importing the module
const mockCreateElement = jest.spyOn(document, 'createElement');
const mockCreateDocumentFragment = jest.spyOn(document, 'createDocumentFragment');
const mockQuerySelector = jest.spyOn(document, 'querySelector');
const mockQuerySelectorAll = jest.spyOn(document, 'querySelectorAll');
const mockAppendChild = jest.fn();
const mockAddEventListener = jest.fn();
const mockClassListAdd = jest.fn();
const mockClassListRemove = jest.fn();
const mockClassListToggle = jest.fn();
const mockClassListContains = jest.fn();
const mockStyle = {};
const mockRemove = jest.fn();
const mockInsertAdjacentElement = jest.fn();

// Mock utils module
jest.mock('../src/utils', () => ({
    getToday: jest.fn(() => '2023-01-01'),
    shouldShowProblem: jest.fn(() => true),
    getUniqueProblemsForTopic: jest.fn(() => ({ total: 2, solved: 1, due: 0 })),
    getAllUniqueProblemsIncludingAlgorithms: jest.fn(() => ({ total: 10, solved: 5, due: 0 })),
    updateUrlParameter: jest.fn(),
    scrollToTop: jest.fn(),
    formatDate: jest.fn(() => 'Jan 1'),
    showToast: jest.fn(),
    getNextReviewDate: jest.fn(() => '2023-01-02'),
    debounce: jest.fn((fn) => fn),
    getLeetCodeProblemId: jest.fn(),
    extractProblemName: jest.fn(),
    generateProblemUrl: jest.fn(),
    escapeHtml: jest.fn((str) => str),
    safeParseInt: jest.fn(),
    safeParseFloat: jest.fn(),
    isValidDate: jest.fn(),
    deepClone: jest.fn((obj) => JSON.parse(JSON.stringify(obj))),
    generateId: jest.fn(() => 'test-id'),
    truncate: jest.fn((str) => str),
    capitalize: jest.fn((str) => str.charAt(0).toUpperCase() + str.slice(1)),
    kebabToTitle: jest.fn((str) => str.replace(/-/g, ' ')),
    getDifficultyColor: jest.fn(),
    getStatusIcon: jest.fn(),
    parseMarkdown: jest.fn(),
    highlightCode: jest.fn(),
    setupEventListeners: jest.fn(),
    cacheElements: jest.fn(() => ({})),
    safeGetItem: jest.fn(),
    safeSetItem: jest.fn(),
    getStringItem: jest.fn(),
    setStringItem: jest.fn(),
    removeItem: jest.fn(),
    STORAGE_KEYS: {
        PROBLEMS: jest.fn(() => 'problems'),
        DELETED_IDS: jest.fn(() => 'deleted_ids'),
        DISPLAY_NAME: jest.fn(() => 'display_name'),
        USER_TYPE: 'user_type',
    },
}));

// Mock element template
const createMockElement = () => {
    const el = {
        className: '',
        innerHTML: '',
        innerText: '',
        style: { ...mockStyle },
        addEventListener: mockAddEventListener,
        remove: mockRemove,
        insertAdjacentElement: mockInsertAdjacentElement,
        classList: {
            add: mockClassListAdd,
            remove: mockClassListRemove,
            toggle: mockClassListToggle,
            contains: mockClassListContains,
        },
        dataset: {},
        onclick: null,
        title: '',
        disabled: false,
        querySelector: jest.fn(() => createMockElement()),
        closest: jest.fn(() => createMockElement()),
    };
    el.appendChild = (child) => {
        mockAppendChild(child);
        if (child && typeof child.innerHTML === 'string') {
            el.innerHTML += child.innerHTML;
        }
    };
    return el;
};

// Mock DocumentFragment
const createMockDocumentFragment = () => {
    const fragment = {
        appendChild: (child) => {
            mockAppendChild(child);
        },
    };
    return fragment;
};

const mockElement = createMockElement();

// Now import the module
import { renderers } from '../src/renderers';
import { htmlGenerators } from '../src/renderers/html-generators';
import { sidebarRenderers } from '../src/renderers/sidebar';
import { mainViewRenderers } from '../src/renderers/main-view';
import { problemCardRenderers } from '../src/renderers/problem-cards';
import { statsRenderers } from '../src/renderers/stats';
import { ICONS } from '../src/renderers/icons';
import { state } from '../src/state';
import { data } from '../src/data';
import * as utils from '../src/utils';
import { api } from '../src/api';
import { ui } from '../src/ui/ui';

describe('SmartGrind Renderers', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Set up SmartGrind state and data
        state.ui = {
            activeTopicId: 'all',
            currentFilter: 'all',
            activeAlgorithmCategoryId: null,
            searchQuery: '',
            preferredAI: null,
            reviewDateFilter: null,
        };
        state.elements = {
            topicList: { ...mockElement },
            problemsContainer: { ...mockElement },
            currentViewTitle: { ...mockElement },
            emptyState: { ...mockElement },
            problemSearch: { value: '' },
            reviewBanner: { ...mockElement },
            reviewCountBanner: { ...mockElement },
            mainTotalText: { ...mockElement },
            mainSolvedText: { ...mockElement },
            mainDueText: { ...mockElement },
            mainSolvedBar: { style: { width: '' } },
            mainDueBadge: { ...mockElement },
            currentFilterDisplay: { ...mockElement },
            sidebarSolvedText: { ...mockElement },
            sidebarSolvedBar: { style: { width: '' } },
        };
        state.problems = new Map();

        data.topicsData = [
            {
                id: 'arrays',
                title: 'Arrays',
                patterns: [
                    {
                        name: 'Two Sum',
                        problems: ['1', '2'],
                    },
                ],
            },
        ];

        // Mock utils functions
        jest.mocked(utils.getToday).mockReturnValue('2023-01-01');
        jest.mocked(utils.shouldShowProblem).mockReturnValue(true);
        jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValue({
            total: 2,
            solved: 1,
            due: 0,
        });
        jest.mocked(utils.getAllUniqueProblemsIncludingAlgorithms).mockReturnValue({
            total: 10,
            solved: 5,
            due: 0,
        });
        jest.mocked(utils.updateUrlParameter).mockImplementation(() => {});
        jest.mocked(utils.scrollToTop).mockImplementation(() => {});
        jest.mocked(utils.formatDate).mockReturnValue('Jan 1');
        jest.mocked(utils.showToast).mockImplementation(() => {});
        jest.mocked(utils.getNextReviewDate).mockReturnValue('2023-01-02');

        // Mock api
        jest.spyOn(api, 'deleteCategory').mockResolvedValue();
        jest.spyOn(api, 'resetCategory').mockResolvedValue();
        jest.spyOn(api, 'resetAll').mockResolvedValue();
        jest.spyOn(api, 'saveDeletedId').mockResolvedValue();
        jest.spyOn(api, 'saveProblem').mockResolvedValue();
        jest.spyOn(api, 'saveProblemWithSync').mockResolvedValue();

        // Mock ui
        jest.spyOn(ui, 'openSolutionModal').mockImplementation();
        jest.spyOn(ui, 'showConfirm').mockImplementation();

        // Mock createElement to return new mockElement
        mockCreateElement.mockImplementation(() => createMockElement());
        mockCreateDocumentFragment.mockImplementation(() => createMockDocumentFragment());
        mockQuerySelector.mockImplementation(() => createMockElement());
        mockQuerySelectorAll.mockImplementation(() => [createMockElement()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('ICONS', () => {
        test('defines delete, note, and reset icons', () => {
            expect(ICONS.delete).toContain('<svg');
            expect(ICONS.note).toContain('<svg');
            expect(ICONS.reset).toContain('<svg');
        });
    });

    describe('generateBadge', () => {
        test('returns Review badge for due solved problems', () => {
            const result = htmlGenerators.generateBadge(
                { status: 'solved', nextReviewDate: '2022-01-01' },
                '2023-01-01'
            );
            expect(result).toContain('Review');
        });

        test('returns Solved badge for solved problems not due', () => {
            const result = htmlGenerators.generateBadge(
                { status: 'solved', nextReviewDate: '2024-01-01' },
                '2023-01-01'
            );
            expect(result).toContain('Solved');
        });

        test('returns empty string for unsolved problems', () => {
            const result = htmlGenerators.generateBadge({ status: 'unsolved' }, '2023-01-01');
            expect(result).toBe('');
        });
    });

    describe('generateActionButton', () => {
        test('generates solve button for unsolved problems', () => {
            const result = htmlGenerators.generateActionButton({ status: 'unsolved', loading: false });
            expect(result).toContain('Solve');
            expect(result).toContain('bg-brand-600');
        });

        test('generates review button for due solved problems', () => {
            const result = htmlGenerators.generateActionButton({
                status: 'solved',
                nextReviewDate: '2022-01-01',
                loading: false,
            });
            expect(result).toContain('Review');
            expect(result).toContain('bg-amber-500');
        });

        test('generates reset button for solved problems not due', () => {
            const result = htmlGenerators.generateActionButton({
                status: 'solved',
                nextReviewDate: '2024-01-01',
                loading: false,
            });
            expect(result).toContain('Reset');
            expect(result).toContain('bg-dark-900');
        });

        test('shows loading state', () => {
            const result = htmlGenerators.generateActionButton({ status: 'unsolved', loading: true });
            expect(result).toContain('animate-spin');
            expect(result).toContain('disabled');
        });
    });

    describe('createTopicButton', () => {
        test('creates topic button with correct structure', () => {
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValue({ total: 10, solved: 5 });

            const button = renderers.createTopicButton('arrays', 'Arrays');

            expect(mockCreateElement).toHaveBeenCalledWith('button');
            expect(button.className).toContain('sidebar-link');
            expect(button.innerHTML).toContain('Arrays');
            expect(button.innerHTML).toContain('10');
            expect(button.innerHTML).toContain('50%');
        });

        test('marks active topic', () => {
            state.ui.activeTopicId = 'arrays';
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValue({ total: 10, solved: 10 });

            const button = renderers.createTopicButton('arrays', 'Arrays');

            expect(button.className).toContain('active');
            expect(button.innerHTML).toContain('100%');
            expect(button.innerHTML).toContain('text-green-400');
        });

        test('handles 100% completion styling', () => {
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValue({ total: 10, solved: 10 });

            const button = renderers.createTopicButton('arrays', 'Arrays');

            expect(button.innerHTML).toContain('100%');
            expect(button.innerHTML).toContain('text-green-400');
        });

        test('handles zero total problems', () => {
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValue({ total: 0, solved: 0 });

            const button = renderers.createTopicButton('arrays', 'Arrays');

            expect(button.innerHTML).toContain('0');
            expect(button.innerHTML).toContain('0%');
        });
    });

    describe('setActiveTopic', () => {
        test('removes active class from all links and adds to target', () => {
            const mockLink1 = { ...mockElement, classList: { remove: jest.fn(), add: jest.fn() } };
            const mockLink2 = { ...mockElement, classList: { remove: jest.fn(), add: jest.fn() } };
            mockQuerySelectorAll.mockImplementation(() => [mockLink1]);
            mockQuerySelector.mockImplementation(() => mockLink2);

            renderers.setActiveTopic('arrays');

            expect(mockLink1.classList.remove).toHaveBeenCalledWith('active');
            expect(mockLink2.classList.add).toHaveBeenCalledWith('active');
            expect(state.ui.activeTopicId).toBe('arrays');
        });

        test('falls back to first child when target not found', () => {
            const mockLink1 = { ...mockElement, classList: { remove: jest.fn(), add: jest.fn() } };
            const mockFirstChild = {
                ...mockElement,
                classList: { remove: jest.fn(), add: jest.fn() },
            };
            mockQuerySelectorAll.mockImplementation(() => [mockLink1]);
            mockQuerySelector
                .mockImplementationOnce(() => null)
                .mockImplementationOnce(() => mockFirstChild);

            renderers.setActiveTopic('nonexistent');

            expect(mockLink1.classList.remove).toHaveBeenCalledWith('active');
            expect(mockFirstChild.classList.add).toHaveBeenCalledWith('active');
        });
    });

    describe('renderMainView', () => {
        test('renders main view for all topics', () => {
            renderers.renderMainView('all');

            expect(state.elements.currentViewTitle.innerText).toBe('All Problems');
            expect(state.ui.activeTopicId).toBe('all');
        });

        test('renders main view for specific topic', () => {
            data.topicsData[0].id = 'arrays';
            data.topicsData[0].title = 'Arrays';

            renderers.renderMainView('arrays');

            expect(state.elements.currentViewTitle.innerText).toBe('Arrays');
        });

        test('adds action buttons for specific topics', () => {
            renderers.renderMainView('arrays');

            expect(mockInsertAdjacentElement).toHaveBeenCalledWith('afterend', expect.any(Object));
        });

        test('adds reset all button for all problems view', () => {
            renderers.renderMainView('all');

            expect(mockInsertAdjacentElement).toHaveBeenCalledWith('afterend', expect.any(Object));
        });

        test('handles unknown topic title', () => {
            data.topicsData.find = jest.fn(() => undefined);

            renderers.renderMainView('unknown');

            expect(state.elements.currentViewTitle.innerText).toBe('Unknown Topic');
        });

        test('uses provided filterTopicId when different from activeTopicId', () => {
            state.ui.activeTopicId = 'oldTopic';
            data.topicsData[0].id = 'arrays';
            data.topicsData[0].title = 'Arrays';

            renderers.renderMainView('arrays');

            expect(state.ui.activeTopicId).toBe('arrays');
        });
    });

    describe('createProblemCard', () => {
        test('creates problem card element', () => {
            const problem = {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                status: 'unsolved',
                nextReviewDate: null,
                note: '',
                loading: false,
            };

            const card = renderers.createProblemCard(problem);

            expect(mockCreateElement).toHaveBeenCalledWith('div');
            expect(card.className).toContain('group');
            expect(card.innerHTML).toContain('Two Sum');
            // Note: Event handling is now done via event delegation on problemsContainer
        });
    });

    describe('updateStats', () => {
        test('updates statistics display', () => {
            state.ui.activeTopicId = 'all';

            renderers.updateStats();

            expect(utils.getUniqueProblemsForTopic).toHaveBeenCalledWith('all');
        });

        test('shows review banner when due problems exist', () => {
            state.ui.activeTopicId = 'all';
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValueOnce({ total: 10, solved: 5, due: 3 });

            renderers.updateStats();

            expect(state.elements.reviewBanner?.classList.remove).toHaveBeenCalledWith('hidden');
            expect(state.elements.reviewCountBanner?.innerText).toBe('3');
        });

        test('hides review banner when no due problems', () => {
            state.ui.activeTopicId = 'all';
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValueOnce({ total: 10, solved: 10, due: 0 });

            renderers.updateStats();

            expect(state.elements.reviewBanner?.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('updates main due badge when due problems exist', () => {
            state.ui.activeTopicId = 'all';
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValueOnce({ total: 10, solved: 5, due: 2 });

            renderers.updateStats();

            expect(state.elements.mainDueBadge?.classList.remove).toHaveBeenCalledWith('hidden');
        });

        test('hides main due badge when no due problems', () => {
            state.ui.activeTopicId = 'all';
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValueOnce({ total: 10, solved: 10, due: 0 });

            renderers.updateStats();

            expect(state.elements.mainDueBadge?.classList.add).toHaveBeenCalledWith('hidden');
        });
    });

    describe('updateFilterBtns', () => {
        test('updates filter button states', () => {
            const mockBtn1 = {
                ...mockElement,
                dataset: { filter: 'all' },
                classList: { ...mockElement.classList },
            };
            const mockBtn2 = {
                ...mockElement,
                dataset: { filter: 'solved' },
                classList: { ...mockElement.classList },
            };
            state.elements.filterBtns = [mockBtn1, mockBtn2];

            renderers.updateFilterBtns();

            expect(mockBtn1.classList.add).toHaveBeenCalledWith('bg-brand-600', 'text-white');
            expect(mockBtn1.classList.remove).toHaveBeenCalledWith('text-theme-bold');
        });
    });

    describe('renderTopicSection', () => {
        test('renders topic section with visible problems', () => {
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                status: 'unsolved',
                nextReviewDate: null,
                note: '',
                loading: false,
            });
            data.topicsData[0].patterns[0].problems = ['1'];

            const result = htmlGenerators.renderTopicSection(data.topicsData[0], 'all', '2023-01-01', {
                count: 0,
            });

            expect(result).not.toBe(null);
            expect(result.innerHTML).toContain('Arrays');
            expect(result.innerHTML).toContain('Two Sum');
        });

        test('returns null when no visible problems', () => {
            state.problems.clear();

            const result = htmlGenerators.renderTopicSection(data.topicsData[0], 'all', '2023-01-01', {
                count: 0,
            });

            expect(result).toBe(null);
        });

        test('handles probDef as object with id property', () => {
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                status: 'unsolved',
                nextReviewDate: null,
                note: '',
                loading: false,
            });
            data.topicsData[0].patterns[0].problems = [{ id: '1' }];

            const result = htmlGenerators.renderTopicSection(data.topicsData[0], 'all', '2023-01-01', {
                count: 0,
            });

            expect(result).not.toBe(null);
            expect(result.innerHTML).toContain('Two Sum');
        });
    });

    describe('renderSidebar', () => {
        test('renders sidebar with all problems and topic buttons', () => {
            jest.mocked(utils.getUniqueProblemsForTopic).mockReturnValue({ total: 10, solved: 5 });

            renderers.renderSidebar();

            // Verify that topicList.innerHTML was cleared and fragment was appended
            // The sidebar now renders both Algorithms and Patterns sections
            // So we verify the last call is the fragment being appended to topicList
            expect(mockAppendChild).toHaveBeenCalled();
            
            // Find the fragment append call (it's the one without a className property)
            const fragmentCall = mockAppendChild.mock.calls.find(
                (call) => !call[0]?.className
            );
            expect(fragmentCall).toBeTruthy();
        });
    });

    describe('generateProblemCardHTML', () => {
        test('generates HTML for solved problem', () => {
            const problem = {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                status: 'solved',
                nextReviewDate: '2024-01-01',
                note: 'Easy',
                loading: false,
            };

            const result = htmlGenerators.generateProblemCardHTML(problem);

            expect(result.className).toContain('bg-dark-800');
            expect(result.className).toContain('border-brand-500/20');
            expect(result.innerHTML).toContain('Two Sum');
            expect(result.innerHTML).toContain('Solve');
        });

        test('generates HTML for unsolved problem', () => {
            const problem = {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                status: 'unsolved',
                nextReviewDate: null,
                note: '',
                loading: true,
            };

            const result = htmlGenerators.generateProblemCardHTML(problem);

            expect(result.className).toContain('bg-dark-800');
            expect(result.className).toContain('border-theme');
            expect(result.innerHTML).toContain('animate-spin');
        });

        test('generates HTML for due solved problem', () => {
            const problem = {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                status: 'solved',
                nextReviewDate: '2022-01-01',
                note: '',
                loading: false,
            };

            const result = htmlGenerators.generateProblemCardHTML(problem);

            expect(result.className).toContain('bg-amber-500/5');
            expect(result.className).toContain('border-amber-500/20');
            expect(result.innerHTML).toContain('Review');
        });
    });

    describe('reRenderCard', () => {
        test('re-renders the problem card with updated HTML', () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                status: 'solved',
                nextReviewDate: '2024-01-01',
                note: 'Easy',
                loading: false,
            };

            problemCardRenderers.reRenderCard(mockButton, problem);

            expect(mockButton.closest).toHaveBeenCalledWith('.group');
            expect(mockElement.className).toContain('bg-dark-800');
            expect(mockElement.innerHTML).toContain('Two Sum');
        });

        test('does nothing if card is not found', () => {
            const mockButton = { closest: jest.fn(() => null) };
            const problem = { id: '1' };

            problemCardRenderers.reRenderCard(mockButton, problem);

            expect(mockButton.closest).toHaveBeenCalledWith('.group');
            // No changes to mockElement
        });
    });

    describe('handleStatusChange', () => {
        test('updates problem status and saves', async () => {
            const problem = { id: '1', status: 'unsolved' };
            const mockButton = { closest: jest.fn(() => mockElement) };
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await problemCardRenderers.handleStatusChange(mockButton, problem, 'solved', 1, '2024-01-01');

            expect(problem.status).toBe('solved');
            expect(problem.reviewInterval).toBe(1);
            expect(problem.nextReviewDate).toBe('2024-01-01');
            expect(problem.loading).toBe(false);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    status: 'solved',
                    reviewInterval: 1,
                    nextReviewDate: '2024-01-01',
                })
            );
        });

        test('handles default parameters', async () => {
            const problem = { id: '1', status: 'unsolved' };
            const mockButton = { closest: jest.fn(() => mockElement) };
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await problemCardRenderers.handleStatusChange(mockButton, problem, 'solved');

            expect(problem.reviewInterval).toBe(0);
            expect(problem.nextReviewDate).toBe(null);
        });

        test('reverts changes and shows error toast on save failure', async () => {
            const problem = {
                id: '1',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
            };
            const mockButton = { closest: jest.fn(() => mockElement) };
            const error = new Error('Network error');
            api.saveProblemWithSync = jest.fn().mockRejectedValue(error);
            jest.mocked(utils.showToast).mockImplementation(() => {});

            await problemCardRenderers.handleStatusChange(mockButton, problem, 'solved', 1, '2024-01-01');

            expect(problem.status).toBe('unsolved'); // reverted
            expect(problem.reviewInterval).toBe(0); // reverted
            expect(problem.nextReviewDate).toBe(null); // reverted
            expect(problem.loading).toBe(false);
            expect(utils.showToast).toHaveBeenCalledWith(
                'Failed to update problem: Network error',
                'error'
            );
        });

        test('updates all instances of problem card when problem appears in multiple patterns', async () => {
            // Create multiple mock cards to simulate problem appearing in multiple patterns
            const mockCard1 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'solve' } })),
            };
            const mockCard2 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'solve' } })),
            };

            // Mock querySelectorAll to return multiple cards
            mockQuerySelectorAll.mockImplementationOnce((selector) => {
                if (selector === '[data-problem-id="multi-pattern-status-problem"]') {
                    return [mockCard1, mockCard2];
                }
                return [mockElement];
            });

            const mockButton = { closest: jest.fn(() => mockCard1) };
            const problem = { id: 'multi-pattern-status-problem', status: 'unsolved' };
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            problemCardRenderers.reRenderCard = jest.fn();

            await problemCardRenderers.handleStatusChange(mockButton, problem, 'solved', 1, '2024-01-01');

            expect(problem.status).toBe('solved');
            expect(problem.reviewInterval).toBe(1);
            expect(problem.nextReviewDate).toBe('2024-01-01');
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                'multi-pattern-status-problem',
                expect.objectContaining({
                    status: 'solved',
                    reviewInterval: 1,
                    nextReviewDate: '2024-01-01',
                })
            );

            // Verify that reRenderCard was called for all 2 card instances, plus 1 for loading state
            expect(problemCardRenderers.reRenderCard).toHaveBeenCalledTimes(3);

            // Verify each card was re-rendered with the updated problem
            expect(problemCardRenderers.reRenderCard).toHaveBeenCalledWith(expect.any(Object), problem);
        });
    });

    describe('handleSolve', () => {
        test('solves the problem and re-renders card', async () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = { id: '1', status: 'unsolved' };
            jest.mocked(utils.getToday).mockReturnValue('2023-01-01');
            jest.mocked(utils.getNextReviewDate).mockReturnValue('2023-01-02');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await problemCardRenderers.handleSolve(mockButton, problem);

            expect(utils.getToday).toHaveBeenCalled();
            expect(utils.getNextReviewDate).toHaveBeenCalledWith('2023-01-01', 0);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    status: 'solved',
                    nextReviewDate: '2023-01-02',
                    reviewInterval: 0,
                })
            );
            expect(problem.status).toBe('solved');
        });
    });

    describe('handleReview', () => {
        test('reviews the problem and re-renders card when not in review filter', async () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = { id: '1', status: 'solved', reviewInterval: 1 };
            state.ui.currentFilter = 'all';
            jest.mocked(utils.getToday).mockReturnValue('2023-01-01');
            jest.mocked(utils.getNextReviewDate).mockReturnValue('2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await problemCardRenderers.handleReview(mockButton, problem);

            expect(problem.reviewInterval).toBe(2);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    reviewInterval: 2,
                    nextReviewDate: '2023-01-03',
                })
            );
        });

        test('hides card when in review filter', async () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = { id: '1', status: 'solved', reviewInterval: 1, nextReviewDate: '2023-01-01' };
            state.ui.currentFilter = 'review';
            state.ui.reviewDateFilter = null; // No date filter selected
            jest.mocked(utils.getToday).mockReturnValue('2023-01-01');
            jest.mocked(utils.getNextReviewDate).mockReturnValue('2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            problemCardRenderers.hideCardIfFilteredOut = jest.fn();
            // Use actual shouldShowProblem - after review, nextReviewDate is in future so it won't match review filter
            jest.mocked(utils.shouldShowProblem).mockImplementation((p, filter, searchQuery, today) => {
                // After review, nextReviewDate is '2023-01-03' which is > '2023-01-01' (today)
                // So it should NOT pass the review filter
                if (filter === 'review') {
                    return p.status === 'solved' && p.nextReviewDate !== null && p.nextReviewDate <= today;
                }
                return true;
            });

            await problemCardRenderers.handleReview(mockButton, problem);

            expect(problemCardRenderers.hideCardIfFilteredOut).toHaveBeenCalledWith(expect.any(Object));
        });

        test('hides card when date filter is selected and nextReviewDate changes', async () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = { id: '1', status: 'solved', reviewInterval: 1, nextReviewDate: '2023-01-01' };
            state.ui.currentFilter = 'review';
            state.ui.reviewDateFilter = '2023-01-01'; // Date filter selected
            jest.mocked(utils.getToday).mockReturnValue('2023-01-01');
            jest.mocked(utils.getNextReviewDate).mockReturnValue('2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            problemCardRenderers.hideCardIfFilteredOut = jest.fn();
            // Use actual shouldShowProblem logic
            jest.mocked(utils.shouldShowProblem).mockImplementation((p, filter, searchQuery, today) => {
                // After review, nextReviewDate is '2023-01-03'
                // It doesn't match the date filter '2023-01-01'
                if (filter === 'review') {
                    const passesReviewFilter = p.status === 'solved' && p.nextReviewDate !== null && p.nextReviewDate <= today;
                    if (!passesReviewFilter) return false;
                }
                // Check date filter
                if ((filter === 'review' || filter === 'solved') && state.ui.reviewDateFilter) {
                    if (p.nextReviewDate !== state.ui.reviewDateFilter) return false;
                }
                return true;
            });

            await problemCardRenderers.handleReview(mockButton, problem);

            expect(problemCardRenderers.hideCardIfFilteredOut).toHaveBeenCalledWith(expect.any(Object));
        });

        test('updates all instances of problem card when problem appears in multiple patterns', async () => {
            // Create multiple mock cards to simulate problem appearing in multiple patterns
            const mockCard1 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'review' } })),
            };
            const mockCard2 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'review' } })),
            };
            const mockCard3 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'review' } })),
            };

            // Mock querySelectorAll to return multiple cards
            mockQuerySelectorAll.mockImplementationOnce((selector) => {
                if (selector === '[data-problem-id="multi-pattern-problem"]') {
                    return [mockCard1, mockCard2, mockCard3];
                }
                return [mockElement];
            });

            const mockButton = { closest: jest.fn(() => mockCard1) };
            const problem = { id: 'multi-pattern-problem', status: 'solved', reviewInterval: 1 };
            state.ui.currentFilter = 'all';
            jest.mocked(utils.getToday).mockReturnValue('2023-01-01');
            jest.mocked(utils.getNextReviewDate).mockReturnValue('2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            problemCardRenderers.reRenderCard = jest.fn();

            await problemCardRenderers.handleReview(mockButton, problem);

            expect(problem.reviewInterval).toBe(2);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                'multi-pattern-problem',
                expect.objectContaining({
                    reviewInterval: 2,
                    nextReviewDate: '2023-01-03',
                })
            );

            // Verify that reRenderCard was called for all 3 card instances, plus 1 for loading state
            expect(problemCardRenderers.reRenderCard).toHaveBeenCalledTimes(4);

            // Verify each card was re-rendered with the updated problem
            expect(problemCardRenderers.reRenderCard).toHaveBeenCalledWith(expect.any(Object), problem);
        });

        test('hides all instances of problem card when in review filter and problem appears in multiple patterns', async () => {
            // Create multiple mock cards to simulate problem appearing in multiple patterns
            const mockCard1 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'review' } })),
            };
            const mockCard2 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'review' } })),
            };

            // Mock querySelectorAll to return multiple cards
            mockQuerySelectorAll.mockImplementationOnce((selector) => {
                if (selector === '[data-problem-id="multi-pattern-due-problem"]') {
                    return [mockCard1, mockCard2];
                }
                return [mockElement];
            });

            const mockButton = { closest: jest.fn(() => mockCard1) };
            const problem = {
                id: 'multi-pattern-due-problem',
                status: 'solved',
                reviewInterval: 1,
            };
            state.ui.currentFilter = 'review';
            jest.mocked(utils.getToday).mockReturnValue('2023-01-01');
            jest.mocked(utils.getNextReviewDate).mockReturnValue('2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            problemCardRenderers.hideCardIfFilteredOut = jest.fn();
            // Mock shouldShowProblem to return false since problem no longer matches review filter
            jest.mocked(utils.shouldShowProblem).mockReturnValue(false);

            await problemCardRenderers.handleReview(mockButton, problem);

            expect(problem.reviewInterval).toBe(2);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                'multi-pattern-due-problem',
                expect.objectContaining({
                    reviewInterval: 2,
                    nextReviewDate: '2023-01-03',
                })
            );

            // Verify that hideCardIfFilteredOut was called for all 2 card instances
            expect(problemCardRenderers.hideCardIfFilteredOut).toHaveBeenCalledTimes(2);
        });
    });

    describe('handleReset', () => {
        test('resets the problem and re-renders card', async () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = { id: '1', status: 'solved' };
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await problemCardRenderers.handleReset(mockButton, problem);

            expect(problem.status).toBe('unsolved');
            expect(problem.reviewInterval).toBe(0);
            expect(problem.nextReviewDate).toBe(null);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    status: 'unsolved',
                    reviewInterval: 0,
                    nextReviewDate: null,
                })
            );
        });
    });

    describe('handleProblemCardClick', () => {
        test('handles solve action', async () => {
            const mockBtn = createMockElement();
            mockBtn.dataset = { action: 'solve' };
            const mockEvent = {
                target: { closest: jest.fn(() => mockBtn) },
            };
            const problem = { id: '1', status: 'unsolved' };

            problemCardRenderers.handleSolve = jest.fn();

            await renderers.handleProblemCardClick(mockEvent, problem);

            expect(problemCardRenderers.handleSolve).toHaveBeenCalledWith(
                expect.objectContaining({ dataset: { action: 'solve' } }),
                problem
            );
        });

        test('handles review action', async () => {
            const mockBtn = createMockElement();
            mockBtn.dataset = { action: 'review' };
            const mockEvent = {
                target: { closest: jest.fn(() => mockBtn) },
            };
            const problem = { id: '1', status: 'solved', reviewInterval: 1 };

            problemCardRenderers.handleReview = jest.fn();

            await renderers.handleProblemCardClick(mockEvent, problem);

            expect(problemCardRenderers.handleReview).toHaveBeenCalledWith(
                expect.objectContaining({ dataset: { action: 'review' } }),
                problem
            );
        });

        test('handles reset action', async () => {
            const mockBtn = createMockElement();
            mockBtn.dataset = { action: 'reset' };
            const mockEvent = {
                target: { closest: jest.fn(() => mockBtn) },
            };
            const problem = { id: '1', status: 'solved' };

            problemCardRenderers.handleReset = jest.fn();

            await renderers.handleProblemCardClick(mockEvent, problem);

            expect(problemCardRenderers.handleReset).toHaveBeenCalledWith(
                expect.objectContaining({ dataset: { action: 'reset' } }),
                problem
            );
        });

        test('handles note action', async () => {
            const mockBtn = createMockElement();
            mockBtn.dataset = { action: 'note' };
            const mockEvent = {
                target: { closest: jest.fn(() => mockBtn) },
            };
            const problem = { id: '1', status: 'unsolved', note: '' };

            await renderers.handleProblemCardClick(mockEvent, problem);

            // Note action toggles note visibility
            expect(mockBtn.classList.toggle).toHaveBeenCalledWith('hidden');
        });

        test('handles solution action', async () => {
            const mockBtn = createMockElement();
            mockBtn.dataset = { action: 'solution' };
            const mockEvent = {
                target: { closest: jest.fn(() => mockBtn) },
            };
            const problem = { id: '1', name: 'Two Sum', status: 'unsolved' };

            await renderers.handleProblemCardClick(mockEvent, problem);

            expect(ui.openSolutionModal).toHaveBeenCalledWith(problem.id);
        });

        test('ignores unknown actions', async () => {
            const mockBtn = createMockElement();
            mockBtn.dataset = { action: 'unknown' };
            const mockEvent = {
                target: { closest: jest.fn(() => mockBtn) },
            };
            const problem = { id: '1', status: 'unsolved' };

            // Should not throw
            await expect(renderers.handleProblemCardClick(mockEvent, problem)).resolves.not.toThrow();
        });

        test('ignores clicks outside action buttons', async () => {
            const mockEvent = {
                target: { closest: jest.fn(() => null) },
            };
            const problem = { id: '1', status: 'unsolved' };

            // Should not throw
            await expect(renderers.handleProblemCardClick(mockEvent, problem)).resolves.not.toThrow();
        });
    });

    describe('hideCardIfFilteredOut', () => {
        test('handles already hidden card gracefully', () => {
            const mockCard = {
                style: { display: 'none' },
                parentElement: {
                    style: {},
                    querySelectorAll: jest.fn(() => []),
                    parentElement: {
                        style: {},
                        querySelectorAll: jest.fn(() => []),
                        parentElement: null,
                    },
                },
            };
            
            // Create a mock button that returns the mock card
            const mockButton = {
                closest: jest.fn().mockReturnValue(mockCard),
            };

            // Should not throw when card is already hidden
            expect(() => {
                problemCardRenderers.hideCardIfFilteredOut(mockButton as unknown as HTMLElement);
            }).not.toThrow();
        });
    });
});
