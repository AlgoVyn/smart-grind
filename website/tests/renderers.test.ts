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
import { ICONS } from '../src/renderers/icons';
import { state } from '../src/state';
import { data } from '../src/data';
import { utils } from '../src/utils';
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

        // Mock utils
        jest.spyOn(utils, 'getToday').mockReturnValue('2023-01-01');
        jest.spyOn(utils, 'shouldShowProblem').mockReturnValue(true);
        jest.spyOn(utils, 'getUniqueProblemsForTopic').mockReturnValue({
            total: 2,
            solved: 1,
            due: 0,
        });
        jest.spyOn(utils, 'updateUrlParameter').mockImplementation();
        jest.spyOn(utils, 'scrollToTop').mockImplementation();
        jest.spyOn(utils, 'formatDate').mockReturnValue('Jan 1');

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

    describe('_generateBadge', () => {
        test('returns Review badge for due solved problems', () => {
            const result = renderers._generateBadge(
                { status: 'solved', nextReviewDate: '2022-01-01' },
                '2023-01-01'
            );
            expect(result).toContain('Review');
        });

        test('returns Solved badge for solved problems not due', () => {
            const result = renderers._generateBadge(
                { status: 'solved', nextReviewDate: '2024-01-01' },
                '2023-01-01'
            );
            expect(result).toContain('Solved');
        });

        test('returns empty string for unsolved problems', () => {
            const result = renderers._generateBadge({ status: 'unsolved' }, '2023-01-01');
            expect(result).toBe('');
        });
    });

    describe('_generateActionButton', () => {
        test('generates solve button for unsolved problems', () => {
            const result = renderers._generateActionButton({ status: 'unsolved', loading: false });
            expect(result).toContain('Solve');
            expect(result).toContain('bg-brand-600');
        });

        test('generates review button for due solved problems', () => {
            const result = renderers._generateActionButton({
                status: 'solved',
                nextReviewDate: '2022-01-01',
                loading: false,
            });
            expect(result).toContain('Review');
            expect(result).toContain('bg-amber-500');
        });

        test('generates reset button for solved problems not due', () => {
            const result = renderers._generateActionButton({
                status: 'solved',
                nextReviewDate: '2024-01-01',
                loading: false,
            });
            expect(result).toContain('Reset');
            expect(result).toContain('bg-dark-900');
        });

        test('shows loading state', () => {
            const result = renderers._generateActionButton({ status: 'unsolved', loading: true });
            expect(result).toContain('animate-spin');
            expect(result).toContain('disabled');
        });
    });

    describe('createTopicButton', () => {
        test('creates topic button with correct structure', () => {
            utils.getUniqueProblemsForTopic.mockReturnValue({ total: 10, solved: 5 });

            const button = renderers.createTopicButton('arrays', 'Arrays');

            expect(mockCreateElement).toHaveBeenCalledWith('button');
            expect(button.className).toContain('sidebar-link');
            expect(button.innerHTML).toContain('Arrays');
            expect(button.innerHTML).toContain('10');
            expect(button.innerHTML).toContain('50%');
        });

        test('marks active topic', () => {
            state.ui.activeTopicId = 'arrays';
            utils.getUniqueProblemsForTopic.mockReturnValue({ total: 10, solved: 10 });

            const button = renderers.createTopicButton('arrays', 'Arrays');

            expect(button.className).toContain('active');
            expect(button.innerHTML).toContain('100%');
            expect(button.innerHTML).toContain('text-green-400');
        });

        test('handles 100% completion styling', () => {
            utils.getUniqueProblemsForTopic.mockReturnValue({ total: 10, solved: 10 });

            const button = renderers.createTopicButton('arrays', 'Arrays');

            expect(button.innerHTML).toContain('100%');
            expect(button.innerHTML).toContain('text-green-400');
        });

        test('handles zero total problems', () => {
            utils.getUniqueProblemsForTopic.mockReturnValue({ total: 0, solved: 0 });

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
            const updateSidebarStatsOnlySpy = jest.spyOn(renderers, '_updateSidebarStatsOnly');

            renderers.updateStats();

            expect(utils.getUniqueProblemsForTopic).toHaveBeenCalledWith('all');
            expect(updateSidebarStatsOnlySpy).toHaveBeenCalled();
        });

        test('shows review banner when due problems exist', () => {
            utils.getUniqueProblemsForTopic.mockReturnValueOnce({ total: 10, solved: 5, due: 3 });

            renderers.updateStats();

            expect(state.elements.reviewBanner.classList.remove).toHaveBeenCalledWith('hidden');
            expect(state.elements.reviewCountBanner.innerText).toBe('3');
        });

        test('hides review banner when no due problems', () => {
            utils.getUniqueProblemsForTopic.mockReturnValueOnce({ total: 10, solved: 10, due: 0 });

            renderers.updateStats();

            expect(state.elements.reviewBanner.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('updates main due badge when due problems exist', () => {
            utils.getUniqueProblemsForTopic.mockReturnValueOnce({ total: 10, solved: 5, due: 2 });

            renderers.updateStats();

            expect(state.elements.mainDueBadge.classList.remove).toHaveBeenCalledWith('hidden');
        });

        test('hides main due badge when no due problems', () => {
            utils.getUniqueProblemsForTopic.mockReturnValueOnce({ total: 10, solved: 10, due: 0 });

            renderers.updateStats();

            expect(state.elements.mainDueBadge.classList.add).toHaveBeenCalledWith('hidden');
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

    describe('_renderTopicSection', () => {
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

            const result = renderers._renderTopicSection(data.topicsData[0], 'all', '2023-01-01', {
                count: 0,
            });

            expect(result).not.toBe(null);
            expect(result.innerHTML).toContain('Arrays');
            expect(result.innerHTML).toContain('Two Sum');
        });

        test('returns null when no visible problems', () => {
            state.problems.clear();

            const result = renderers._renderTopicSection(data.topicsData[0], 'all', '2023-01-01', {
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

            const result = renderers._renderTopicSection(data.topicsData[0], 'all', '2023-01-01', {
                count: 0,
            });

            expect(result).not.toBe(null);
            expect(result.innerHTML).toContain('Two Sum');
        });
    });

    describe('renderSidebar', () => {
        test('renders sidebar with all problems and topic buttons', () => {
            utils.getUniqueProblemsForTopic.mockReturnValue({ total: 10, solved: 5 });

            renderers.renderSidebar();

            // Verify calls: allBtn to fragment, topic btn to fragment, fragment to topicList = 3 calls
            expect(mockAppendChild).toHaveBeenCalledTimes(3);
            // First call should be to fragment with All Problems button
            const allBtnCall = mockAppendChild.mock.calls[0][0];
            expect(allBtnCall.className).toContain('sidebar-link');
            // Second call should be to fragment with topic button
            const topicBtnCall = mockAppendChild.mock.calls[1][0];
            expect(topicBtnCall.className).toContain('sidebar-link');
            // Third call should be to topicList with fragment
            expect(mockAppendChild.mock.calls[2][0]).not.toHaveProperty('className');
        });
    });

    describe('_generateProblemCardHTML', () => {
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

            const result = renderers._generateProblemCardHTML(problem);

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

            const result = renderers._generateProblemCardHTML(problem);

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

            const result = renderers._generateProblemCardHTML(problem);

            expect(result.className).toContain('bg-amber-500/5');
            expect(result.className).toContain('border-amber-500/20');
            expect(result.innerHTML).toContain('Review');
        });
    });

    describe('_reRenderCard', () => {
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

            renderers._reRenderCard(mockButton, problem);

            expect(mockButton.closest).toHaveBeenCalledWith('.group');
            expect(mockElement.className).toContain('bg-dark-800');
            expect(mockElement.innerHTML).toContain('Two Sum');
        });

        test('does nothing if card is not found', () => {
            const mockButton = { closest: jest.fn(() => null) };
            const problem = { id: '1' };

            renderers._reRenderCard(mockButton, problem);

            expect(mockButton.closest).toHaveBeenCalledWith('.group');
            // No changes to mockElement
        });
    });

    describe('_handleStatusChange', () => {
        test('updates problem status and saves', async () => {
            const problem = { id: '1', status: 'unsolved' };
            const mockButton = { closest: jest.fn(() => mockElement) };
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await renderers._handleStatusChange(mockButton, problem, 'solved', 1, '2024-01-01');

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

            await renderers._handleStatusChange(mockButton, problem, 'solved');

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
            utils.showToast = jest.fn();

            await renderers._handleStatusChange(mockButton, problem, 'solved', 1, '2024-01-01');

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
            renderers._reRenderCard = jest.fn();

            await renderers._handleStatusChange(mockButton, problem, 'solved', 1, '2024-01-01');

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

            // Verify that _reRenderCard was called for all 2 card instances, plus 1 for loading state
            expect(renderers._reRenderCard).toHaveBeenCalledTimes(3);

            // Verify each card was re-rendered with the updated problem
            expect(renderers._reRenderCard).toHaveBeenCalledWith(expect.any(Object), problem);
        });
    });

    describe('_handleSolve', () => {
        test('solves the problem and re-renders card', async () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = { id: '1', status: 'unsolved' };
            utils.getToday = jest.fn(() => '2023-01-01');
            utils.getNextReviewDate = jest.fn(() => '2023-01-02');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await renderers._handleSolve(mockButton, problem);

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

    describe('_handleReview', () => {
        test('reviews the problem and re-renders card when not in review filter', async () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = { id: '1', status: 'solved', reviewInterval: 1 };
            state.ui.currentFilter = 'all';
            utils.getToday = jest.fn(() => '2023-01-01');
            utils.getNextReviewDate = jest.fn(() => '2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await renderers._handleReview(mockButton, problem);

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
            const problem = { id: '1', status: 'solved', reviewInterval: 1 };
            state.ui.currentFilter = 'review';
            utils.getToday = jest.fn(() => '2023-01-01');
            utils.getNextReviewDate = jest.fn(() => '2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            renderers._hideCardIfDueFilter = jest.fn();

            await renderers._handleReview(mockButton, problem);

            expect(renderers._hideCardIfDueFilter).toHaveBeenCalledWith(expect.any(Object));
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
            utils.getToday = jest.fn(() => '2023-01-01');
            utils.getNextReviewDate = jest.fn(() => '2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            renderers._reRenderCard = jest.fn();

            await renderers._handleReview(mockButton, problem);

            expect(problem.reviewInterval).toBe(2);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                'multi-pattern-problem',
                expect.objectContaining({
                    reviewInterval: 2,
                    nextReviewDate: '2023-01-03',
                })
            );

            // Verify that _reRenderCard was called for all 3 card instances, plus 1 for loading state
            expect(renderers._reRenderCard).toHaveBeenCalledTimes(4);

            // Verify each card was re-rendered with the updated problem
            expect(renderers._reRenderCard).toHaveBeenCalledWith(expect.any(Object), problem);
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
            utils.getToday = jest.fn(() => '2023-01-01');
            utils.getNextReviewDate = jest.fn(() => '2023-01-03');
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            renderers._hideCardIfDueFilter = jest.fn();

            await renderers._handleReview(mockButton, problem);

            expect(problem.reviewInterval).toBe(2);
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                'multi-pattern-due-problem',
                expect.objectContaining({
                    reviewInterval: 2,
                    nextReviewDate: '2023-01-03',
                })
            );

            // Verify that _hideCardIfDueFilter was called for all 2 card instances
            expect(renderers._hideCardIfDueFilter).toHaveBeenCalledTimes(2);
        });
    });

    describe('_handleReset', () => {
        test('resets the problem and re-renders card', async () => {
            const mockButton = { closest: jest.fn(() => mockElement) };
            const problem = { id: '1', status: 'solved' };
            api.saveProblemWithSync = jest.fn().mockResolvedValue();

            await renderers._handleReset(mockButton, problem);

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
        test('handles solve action', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'solve' } })) },
            };
            const problem = { id: '1', status: 'unsolved' };

            renderers._handleSolve = jest.fn();

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(renderers._handleSolve).toHaveBeenCalledWith(
                { dataset: { action: 'solve' } },
                problem
            );
        });

        test('handles review action', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'review' } })) },
            };
            const problem = { id: '1', status: 'solved' };

            renderers._handleReview = jest.fn();

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(renderers._handleReview).toHaveBeenCalledWith(
                { dataset: { action: 'review' } },
                problem
            );
        });

        test('handles reset action', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'reset' } })) },
            };
            const problem = { id: '1', status: 'solved' };

            renderers._handleReset = jest.fn();

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(renderers._handleReset).toHaveBeenCalledWith(
                { dataset: { action: 'reset' } },
                problem
            );
        });

        test('handles delete action when confirmed', async () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'delete' } })) },
            };
            const problem = { id: '1', name: 'Test Problem' };

            ui.showConfirm = jest.fn().mockResolvedValue(true);

            await renderers.handleProblemCardClick(mockEvent, problem);

            expect(ui.showConfirm).toHaveBeenCalledWith('Delete "<b>Test Problem</b>"?');
            expect(api.saveDeletedId).toHaveBeenCalledWith('1');
        });

        test('does not delete when confirmation is cancelled', async () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'delete' } })) },
            };
            const problem = { id: '1', name: 'Test Problem' };

            ui.showConfirm = jest.fn().mockResolvedValue(false);

            await renderers.handleProblemCardClick(mockEvent, problem);

            expect(ui.showConfirm).toHaveBeenCalledWith('Delete "<b>Test Problem</b>"?');
            expect(api.saveDeletedId).not.toHaveBeenCalled();
        });

        test('handles note action', () => {
            const mockButton = {
                dataset: { action: 'note' },
                closest: jest.fn(() => ({
                    querySelector: jest.fn(() => ({ classList: { toggle: jest.fn() } })),
                })),
            };
            const mockEvent = {
                target: { closest: jest.fn(() => mockButton) },
            };

            const problem = { id: '1' };

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(mockButton.closest).toHaveBeenCalledWith('.group');
        });

        test('handles save-note action', async () => {
            const mockButton = {
                dataset: { action: 'save-note' },
                closest: jest.fn(() => ({ querySelector: jest.fn(() => ({ value: 'New note' })) })),
            };
            const mockEvent = {
                target: { closest: jest.fn(() => mockButton) },
            };

            const problem = {
                id: '1',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
            };
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            renderers._reRenderCard = jest.fn();

            await renderers.handleProblemCardClick(mockEvent, problem);

            expect(mockButton.closest).toHaveBeenCalledWith('.note-area');
            expect(problem.note).toBe('New note');
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                '1',
                expect.objectContaining({
                    note: 'New note',
                })
            );
        });

        test('handles save-note action and updates all instances when problem appears in multiple patterns', async () => {
            // Create multiple mock cards to simulate problem appearing in multiple patterns
            const mockCard1 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'save-note' } })),
            };
            const mockCard2 = {
                ...mockElement,
                querySelector: jest.fn(() => ({ dataset: { action: 'save-note' } })),
            };

            // Mock querySelectorAll to return multiple cards
            mockQuerySelectorAll.mockImplementationOnce((selector) => {
                if (selector === '[data-problem-id="multi-pattern-note-problem"]') {
                    return [mockCard1, mockCard2];
                }
                return [mockElement];
            });

            const mockButton = {
                dataset: { action: 'save-note' },
                closest: jest.fn(() => ({
                    querySelector: jest.fn(() => ({ value: 'Note for multi-pattern problem' })),
                })),
            };
            const mockEvent = {
                target: { closest: jest.fn(() => mockButton) },
            };

            const problem = {
                id: 'multi-pattern-note-problem',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
            };
            api.saveProblemWithSync = jest.fn().mockResolvedValue();
            renderers._reRenderCard = jest.fn();

            await renderers.handleProblemCardClick(mockEvent, problem);

            expect(mockButton.closest).toHaveBeenCalledWith('.note-area');
            expect(problem.note).toBe('Note for multi-pattern problem');
            expect(api.saveProblemWithSync).toHaveBeenCalledWith(
                'multi-pattern-note-problem',
                expect.objectContaining({
                    note: 'Note for multi-pattern problem',
                })
            );

            // Verify that _reRenderCard was called for all 2 card instances, plus 1 for loading state
            expect(renderers._reRenderCard).toHaveBeenCalledTimes(3);

            // Verify each card was re-rendered with the updated problem
            expect(renderers._reRenderCard).toHaveBeenCalledWith(expect.any(Object), problem);
        });

        test('handles ask-chatgpt action', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'ask-chatgpt' } })) },
            };
            const problem = { name: 'Two Sum' };

            utils.askAI = jest.fn();

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(utils.askAI).toHaveBeenCalledWith('Two Sum', 'chatgpt');
        });

        test('handles ask-aistudio action', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'ask-aistudio' } })) },
            };
            const problem = { name: 'Two Sum' };

            utils.askAI = jest.fn();

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(utils.askAI).toHaveBeenCalledWith('Two Sum', 'aistudio');
        });

        test('handles ask-grok action', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'ask-grok' } })) },
            };
            const problem = { name: 'Two Sum' };

            utils.askAI = jest.fn();

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(utils.askAI).toHaveBeenCalledWith('Two Sum', 'grok');
        });

        test('handles solution action', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: { action: 'solution' } })) },
            };
            const problem = { id: 'add-strings' };

            ui.openSolutionModal = jest.fn();

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(ui.openSolutionModal).toHaveBeenCalledWith('add-strings');
        });

        test('does nothing if no button found', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => null) },
            };
            const problem = { id: '1' };

            renderers.handleProblemCardClick(mockEvent, problem);

            expect(mockEvent.target.closest).toHaveBeenCalledWith('button');
        });

        test('does nothing if no action', () => {
            const mockEvent = {
                target: { closest: jest.fn(() => ({ dataset: {} })) },
            };
            const problem = { id: '1' };

            renderers.handleProblemCardClick(mockEvent, problem);

            // No actions called
        });
    });
});
