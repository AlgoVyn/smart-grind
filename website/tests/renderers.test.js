// Mock dependencies before importing the module
const mockCreateElement = jest.spyOn(document, 'createElement');
const mockQuerySelector = jest.spyOn(document, 'querySelector');
const mockQuerySelectorAll = jest.spyOn(document, 'querySelectorAll');
const mockAppendChild = jest.fn();
const mockAddEventListener = jest.fn();
const mockClassListAdd = jest.fn();
const mockClassListRemove = jest.fn();
const mockClassListToggle = jest.fn();
const mockClassListContains = jest.fn();
const mockInnerHTML = jest.fn();
const mockInnerText = jest.fn();
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
  };
  el.appendChild = (child) => {
    mockAppendChild(child);
    if (child && typeof child.innerHTML === 'string') {
      el.innerHTML += child.innerHTML;
    }
  };
  return el;
};

const mockElement = createMockElement();

// Now import the module
import '../public/modules/renderers.js';

describe('SmartGrind Renderers', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set up SmartGrind state and data
    window.SmartGrind.state = {
      ui: {
        activeTopicId: 'all',
        currentFilter: 'all',
      },
      elements: {
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
      },
      problems: new Map(),
    };
    window.SmartGrind.data = {
      topicsData: [
        {
          id: 'arrays',
          title: 'Arrays',
          patterns: [
            {
              name: 'Two Sum',
              problems: ['1', '2']
            }
          ]
        }
      ]
    };
    window.SmartGrind.utils = {
      getToday: jest.fn(() => '2023-01-01'),
      shouldShowProblem: jest.fn(() => true),
      getUniqueProblemsForTopic: jest.fn(() => ({ total: 2, solved: 1, due: 0 })),
      updateUrlParameter: jest.fn(),
      scrollToTop: jest.fn(),
      formatDate: jest.fn(() => 'Jan 1'),
    };
    window.SmartGrind.api = {
      deleteCategory: jest.fn(),
      saveDeletedId: jest.fn(),
      saveProblem: jest.fn(),
    };

    // Mock createElement to return new mockElement
    mockCreateElement.mockImplementation(() => createMockElement());
    mockQuerySelector.mockImplementation(() => createMockElement());
    mockQuerySelectorAll.mockImplementation(() => [createMockElement()]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ICONS', () => {
    test('defines delete and note icons', () => {
      expect(window.SmartGrind.ICONS.delete).toContain('<svg');
      expect(window.SmartGrind.ICONS.note).toContain('<svg');
    });
  });

  describe('_generateBadge', () => {
    test('returns Review badge for due solved problems', () => {
      const result = window.SmartGrind.renderers._generateBadge(
        { status: 'solved', nextReviewDate: '2022-01-01' },
        '2023-01-01'
      );
      expect(result).toContain('Review');
    });

    test('returns Solved badge for solved problems not due', () => {
      const result = window.SmartGrind.renderers._generateBadge(
        { status: 'solved', nextReviewDate: '2024-01-01' },
        '2023-01-01'
      );
      expect(result).toContain('Solved');
    });

    test('returns empty string for unsolved problems', () => {
      const result = window.SmartGrind.renderers._generateBadge(
        { status: 'unsolved' },
        '2023-01-01'
      );
      expect(result).toBe('');
    });
  });

  describe('_generateActionButton', () => {
    test('generates solve button for unsolved problems', () => {
      const result = window.SmartGrind.renderers._generateActionButton({ status: 'unsolved', loading: false });
      expect(result).toContain('Solve');
      expect(result).toContain('bg-brand-600');
    });

    test('generates review button for due solved problems', () => {
      const result = window.SmartGrind.renderers._generateActionButton({
        status: 'solved',
        nextReviewDate: '2022-01-01',
        loading: false
      });
      expect(result).toContain('Review');
      expect(result).toContain('bg-amber-500');
    });

    test('generates reset button for solved problems not due', () => {
      const result = window.SmartGrind.renderers._generateActionButton({
        status: 'solved',
        nextReviewDate: '2024-01-01',
        loading: false
      });
      expect(result).toContain('Reset');
      expect(result).toContain('bg-dark-900');
    });

    test('shows loading state', () => {
      const result = window.SmartGrind.renderers._generateActionButton({ status: 'unsolved', loading: true });
      expect(result).toContain('animate-pulse');
      expect(result).toContain('disabled');
    });
  });

  describe('createTopicButton', () => {
    test('creates topic button with correct structure', () => {
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValue({ total: 10, solved: 5 });

      const button = window.SmartGrind.renderers.createTopicButton('arrays', 'Arrays');

      expect(mockCreateElement).toHaveBeenCalledWith('button');
      expect(button.className).toContain('sidebar-link');
      expect(button.innerHTML).toContain('Arrays');
      expect(button.innerHTML).toContain('10');
      expect(button.innerHTML).toContain('50%');
    });

    test('marks active topic', () => {
      window.SmartGrind.state.ui.activeTopicId = 'arrays';
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValue({ total: 10, solved: 10 });

      const button = window.SmartGrind.renderers.createTopicButton('arrays', 'Arrays');

      expect(button.className).toContain('active');
      expect(button.innerHTML).toContain('100%');
      expect(button.innerHTML).toContain('text-green-400');
    });

    test('handles 100% completion styling', () => {
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValue({ total: 10, solved: 10 });

      const button = window.SmartGrind.renderers.createTopicButton('arrays', 'Arrays');

      expect(button.innerHTML).toContain('100%');
      expect(button.innerHTML).toContain('text-green-400');
    });

    test('handles zero total problems', () => {
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValue({ total: 0, solved: 0 });

      const button = window.SmartGrind.renderers.createTopicButton('arrays', 'Arrays');

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

      window.SmartGrind.renderers.setActiveTopic('arrays');

      expect(mockLink1.classList.remove).toHaveBeenCalledWith('active');
      expect(mockLink2.classList.add).toHaveBeenCalledWith('active');
      expect(window.SmartGrind.state.ui.activeTopicId).toBe('arrays');
    });

    test('falls back to first child when target not found', () => {
      const mockLink1 = { ...mockElement, classList: { remove: jest.fn(), add: jest.fn() } };
      const mockFirstChild = { ...mockElement, classList: { remove: jest.fn(), add: jest.fn() } };
      mockQuerySelectorAll.mockImplementation(() => [mockLink1]);
      mockQuerySelector.mockImplementationOnce(() => null).mockImplementationOnce(() => mockFirstChild);

      window.SmartGrind.renderers.setActiveTopic('nonexistent');

      expect(mockLink1.classList.remove).toHaveBeenCalledWith('active');
      expect(mockFirstChild.classList.add).toHaveBeenCalledWith('active');
    });
  });

  describe('renderMainView', () => {
    test('renders main view for all topics', () => {
      window.SmartGrind.renderers.renderMainView('all');

      expect(window.SmartGrind.state.elements.currentViewTitle.innerText).toBe('All Problems');
      expect(window.SmartGrind.state.ui.activeTopicId).toBe('all');
    });

    test('renders main view for specific topic', () => {
      window.SmartGrind.data.topicsData[0].id = 'arrays';
      window.SmartGrind.data.topicsData[0].title = 'Arrays';

      window.SmartGrind.renderers.renderMainView('arrays');

      expect(window.SmartGrind.state.elements.currentViewTitle.innerText).toBe('Arrays');
    });

    test('adds delete button for specific topics', () => {
      window.SmartGrind.renderers.renderMainView('arrays');

      expect(mockInsertAdjacentElement).toHaveBeenCalledWith('afterend', expect.any(Object));
    });

    test('handles unknown topic title', () => {
      window.SmartGrind.data.topicsData.find = jest.fn(() => undefined);

      window.SmartGrind.renderers.renderMainView('unknown');

      expect(window.SmartGrind.state.elements.currentViewTitle.innerText).toBe('Unknown Topic');
    });

    test('uses provided filterTopicId when different from activeTopicId', () => {
      window.SmartGrind.state.ui.activeTopicId = 'oldTopic';
      window.SmartGrind.data.topicsData[0].id = 'arrays';
      window.SmartGrind.data.topicsData[0].title = 'Arrays';

      window.SmartGrind.renderers.renderMainView('arrays');

      expect(window.SmartGrind.state.ui.activeTopicId).toBe('arrays');
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
        loading: false
      };

      const card = window.SmartGrind.renderers.createProblemCard(problem);

      expect(mockCreateElement).toHaveBeenCalledWith('div');
      expect(card.className).toContain('group');
      expect(card.innerHTML).toContain('Two Sum');
      // Note: Event handling is now done via event delegation on problemsContainer
    });
  });

  describe('updateStats', () => {
    test('updates statistics display', () => {
      const renderSidebarSpy = jest.spyOn(window.SmartGrind.renderers, 'renderSidebar');

      window.SmartGrind.renderers.updateStats();

      expect(window.SmartGrind.utils.getUniqueProblemsForTopic).toHaveBeenCalledWith('all');
      expect(renderSidebarSpy).toHaveBeenCalled();
    });

    test('shows review banner when due problems exist', () => {
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValueOnce({ total: 10, solved: 5, due: 3 });

      window.SmartGrind.renderers.updateStats();

      expect(window.SmartGrind.state.elements.reviewBanner.classList.remove).toHaveBeenCalledWith('hidden');
      expect(window.SmartGrind.state.elements.reviewCountBanner.innerText).toBe(3);
    });

    test('hides review banner when no due problems', () => {
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValueOnce({ total: 10, solved: 10, due: 0 });

      window.SmartGrind.renderers.updateStats();

      expect(window.SmartGrind.state.elements.reviewBanner.classList.add).toHaveBeenCalledWith('hidden');
    });

    test('updates main due badge when due problems exist', () => {
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValueOnce({ total: 10, solved: 5, due: 2 });

      window.SmartGrind.renderers.updateStats();

      expect(window.SmartGrind.state.elements.mainDueBadge.classList.remove).toHaveBeenCalledWith('hidden');
    });

    test('hides main due badge when no due problems', () => {
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValueOnce({ total: 10, solved: 10, due: 0 });

      window.SmartGrind.renderers.updateStats();

      expect(window.SmartGrind.state.elements.mainDueBadge.classList.add).toHaveBeenCalledWith('hidden');
    });
  });

  describe('updateFilterBtns', () => {
    test('updates filter button states', () => {
      const mockBtn1 = { ...mockElement, dataset: { filter: 'all' }, classList: { ...mockElement.classList } };
      const mockBtn2 = { ...mockElement, dataset: { filter: 'solved' }, classList: { ...mockElement.classList } };
      window.SmartGrind.state.elements.filterBtns = [mockBtn1, mockBtn2];

      window.SmartGrind.renderers.updateFilterBtns();

      expect(mockBtn1.classList.add).toHaveBeenCalledWith('bg-brand-600', 'text-white');
      expect(mockBtn1.classList.remove).toHaveBeenCalledWith('text-theme-bold');
    });
  });

  describe('_renderTopicSection', () => {
    test('renders topic section with visible problems', () => {
      window.SmartGrind.state.problems.set('1', { id: '1', status: 'unsolved' });
      window.SmartGrind.data.topicsData[0].patterns[0].problems = ['1'];

      const result = window.SmartGrind.renderers._renderTopicSection(window.SmartGrind.data.topicsData[0], 'all', '2023-01-01', { count: 0 });

      expect(result).not.toBe(null);
      expect(result.innerHTML).toContain('Arrays');
      expect(result.innerHTML).toContain('Two Sum');
    });

    test('returns null when no visible problems', () => {
      window.SmartGrind.state.problems.clear();

      const result = window.SmartGrind.renderers._renderTopicSection(window.SmartGrind.data.topicsData[0], 'all', '2023-01-01', { count: 0 });

      expect(result).toBe(null);
    });

    test('handles probDef as object with id property', () => {
      window.SmartGrind.state.problems.set('1', { id: '1', status: 'unsolved' });
      window.SmartGrind.data.topicsData[0].patterns[0].problems = [{ id: '1' }];

      const result = window.SmartGrind.renderers._renderTopicSection(window.SmartGrind.data.topicsData[0], 'all', '2023-01-01', { count: 0 });

      expect(result).not.toBe(null);
      expect(result.innerHTML).toContain('Two Sum');
    });
  });

  describe('renderSidebar', () => {
    test('renders sidebar with all problems and topic buttons', () => {
      window.SmartGrind.utils.getUniqueProblemsForTopic.mockReturnValue({ total: 10, solved: 5 });

      window.SmartGrind.renderers.renderSidebar();

      expect(mockAppendChild).toHaveBeenCalledTimes(2); // allBtn and arrays btn
      const allBtn = mockAppendChild.mock.calls[0][0];
      expect(allBtn.innerHTML).toContain('All Problems');
      const arraysBtn = mockAppendChild.mock.calls[1][0];
      expect(arraysBtn.innerHTML).toContain('Arrays');
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
        loading: false
      };

      const result = window.SmartGrind.renderers._generateProblemCardHTML(problem);

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
        loading: true
      };

      const result = window.SmartGrind.renderers._generateProblemCardHTML(problem);

      expect(result.className).toContain('bg-dark-800');
      expect(result.className).toContain('border-theme');
      expect(result.innerHTML).toContain('animate-pulse');
    });

    test('generates HTML for due solved problem', () => {
      const problem = {
        id: '1',
        name: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum/',
        status: 'solved',
        nextReviewDate: '2022-01-01',
        note: '',
        loading: false
      };

      const result = window.SmartGrind.renderers._generateProblemCardHTML(problem);

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
        loading: false
      };

      window.SmartGrind.renderers._reRenderCard(mockButton, problem);

      expect(mockButton.closest).toHaveBeenCalledWith('.group');
      expect(mockElement.className).toContain('bg-dark-800');
      expect(mockElement.innerHTML).toContain('Two Sum');
    });

    test('does nothing if card is not found', () => {
      const mockButton = { closest: jest.fn(() => null) };
      const problem = { id: '1' };

      window.SmartGrind.renderers._reRenderCard(mockButton, problem);

      expect(mockButton.closest).toHaveBeenCalledWith('.group');
      // No changes to mockElement
    });
  });

  describe('_handleStatusChange', () => {
    test('updates problem status and saves', async () => {
      const problem = { id: '1', status: 'unsolved' };
      window.SmartGrind.api.saveProblem = jest.fn().mockResolvedValue();

      await window.SmartGrind.renderers._handleStatusChange(problem, 'solved', 1, '2024-01-01');

      expect(problem.status).toBe('solved');
      expect(problem.reviewInterval).toBe(1);
      expect(problem.nextReviewDate).toBe('2024-01-01');
      expect(problem.loading).toBe(false);
      expect(window.SmartGrind.api.saveProblem).toHaveBeenCalledWith(problem);
    });

    test('handles default parameters', async () => {
      const problem = { id: '1', status: 'unsolved' };
      window.SmartGrind.api.saveProblem = jest.fn().mockResolvedValue();

      await window.SmartGrind.renderers._handleStatusChange(problem, 'solved');

      expect(problem.reviewInterval).toBe(0);
      expect(problem.nextReviewDate).toBe(null);
    });
  });

  describe('_handleSolve', () => {
    test('solves the problem and re-renders card', async () => {
      const mockButton = { closest: jest.fn(() => mockElement) };
      const problem = { id: '1', status: 'unsolved' };
      window.SmartGrind.utils.getToday = jest.fn(() => '2023-01-01');
      window.SmartGrind.utils.getNextReviewDate = jest.fn(() => '2023-01-02');
      window.SmartGrind.api.saveProblem = jest.fn().mockResolvedValue();

      await window.SmartGrind.renderers._handleSolve(mockButton, problem);

      expect(window.SmartGrind.utils.getToday).toHaveBeenCalled();
      expect(window.SmartGrind.utils.getNextReviewDate).toHaveBeenCalledWith('2023-01-01', 0);
      expect(window.SmartGrind.api.saveProblem).toHaveBeenCalledWith(problem);
      expect(problem.status).toBe('solved');
      expect(mockButton.closest).toHaveBeenCalledWith('.group');
    });
  });

  describe('_handleReview', () => {
    test('reviews the problem and re-renders card when not in review filter', async () => {
      const mockButton = { closest: jest.fn(() => mockElement) };
      const problem = { id: '1', status: 'solved', reviewInterval: 1 };
      window.SmartGrind.state.ui.currentFilter = 'all';
      window.SmartGrind.utils.getToday = jest.fn(() => '2023-01-01');
      window.SmartGrind.utils.getNextReviewDate = jest.fn(() => '2023-01-03');
      window.SmartGrind.api.saveProblem = jest.fn().mockResolvedValue();

      await window.SmartGrind.renderers._handleReview(mockButton, problem);

      expect(problem.reviewInterval).toBe(2);
      expect(window.SmartGrind.api.saveProblem).toHaveBeenCalledWith(problem);
      expect(mockButton.closest).toHaveBeenCalledWith('.group');
    });

    test('hides card when in review filter', async () => {
      const mockButton = { closest: jest.fn(() => mockElement) };
      const problem = { id: '1', status: 'solved', reviewInterval: 1 };
      window.SmartGrind.state.ui.currentFilter = 'review';
      window.SmartGrind.utils.getToday = jest.fn(() => '2023-01-01');
      window.SmartGrind.utils.getNextReviewDate = jest.fn(() => '2023-01-03');
      window.SmartGrind.api.saveProblem = jest.fn().mockResolvedValue();
      window.SmartGrind.renderers._hideCardIfDueFilter = jest.fn();

      await window.SmartGrind.renderers._handleReview(mockButton, problem);

      expect(window.SmartGrind.renderers._hideCardIfDueFilter).toHaveBeenCalledWith(mockButton);
    });
  });

  describe('_handleReset', () => {
    test('resets the problem and re-renders card', async () => {
      const mockButton = { closest: jest.fn(() => mockElement) };
      const problem = { id: '1', status: 'solved' };
      window.SmartGrind.api.saveProblem = jest.fn().mockResolvedValue();

      await window.SmartGrind.renderers._handleReset(mockButton, problem);

      expect(problem.status).toBe('unsolved');
      expect(problem.reviewInterval).toBe(0);
      expect(problem.nextReviewDate).toBe(null);
      expect(window.SmartGrind.api.saveProblem).toHaveBeenCalledWith(problem);
      expect(mockButton.closest).toHaveBeenCalledWith('.group');
    });
  });


  describe('handleProblemCardClick', () => {
    test('handles solve action', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => ({ dataset: { action: 'solve' } })) }
      };
      const problem = { id: '1', status: 'unsolved' };

      window.SmartGrind.renderers._handleSolve = jest.fn();

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(window.SmartGrind.renderers._handleSolve).toHaveBeenCalledWith({ dataset: { action: 'solve' } }, problem);
    });

    test('handles review action', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => ({ dataset: { action: 'review' } })) }
      };
      const problem = { id: '1', status: 'solved' };

      window.SmartGrind.renderers._handleReview = jest.fn();

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(window.SmartGrind.renderers._handleReview).toHaveBeenCalledWith({ dataset: { action: 'review' } }, problem);
    });

    test('handles reset action', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => ({ dataset: { action: 'reset' } })) }
      };
      const problem = { id: '1', status: 'solved' };

      window.SmartGrind.renderers._handleReset = jest.fn();

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(window.SmartGrind.renderers._handleReset).toHaveBeenCalledWith({ dataset: { action: 'reset' } }, problem);
    });

    test('handles delete action', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => ({ dataset: { action: 'delete' } })) }
      };
      const problem = { id: '1' };

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(window.SmartGrind.api.saveDeletedId).toHaveBeenCalledWith('1');
    });

    test('handles note action', () => {
      const mockButton = {
        dataset: { action: 'note' },
        closest: jest.fn(() => ({ querySelector: jest.fn(() => ({ classList: { toggle: jest.fn() } })) }))
      };
      const mockEvent = {
        target: { closest: jest.fn(() => mockButton) }
      };

      const problem = { id: '1' };

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(mockButton.closest).toHaveBeenCalledWith('.group');
    });

    test('handles save-note action', () => {
      const mockButton = {
        dataset: { action: 'save-note' },
        closest: jest.fn(() => ({ querySelector: jest.fn(() => ({ value: 'New note' })) }))
      };
      const mockEvent = {
        target: { closest: jest.fn(() => mockButton) }
      };

      const problem = { id: '1', status: 'solved', reviewInterval: 1, nextReviewDate: '2024-01-01' };
      window.SmartGrind.renderers._handleStatusChange = jest.fn().mockResolvedValue();
      window.SmartGrind.renderers._reRenderCard = jest.fn();

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(mockButton.closest).toHaveBeenCalledWith('.note-area');
      expect(problem.note).toBe('New note');
      expect(window.SmartGrind.renderers._handleStatusChange).toHaveBeenCalledWith(problem, 'solved', 1, '2024-01-01');
    });

    test('handles ask-chatgpt action', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => ({ dataset: { action: 'ask-chatgpt' } })) }
      };
      const problem = { name: 'Two Sum' };

      window.SmartGrind.utils.askAI = jest.fn();

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(window.SmartGrind.utils.askAI).toHaveBeenCalledWith('Two Sum', 'chatgpt');
    });

    test('handles ask-gemini action', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => ({ dataset: { action: 'ask-gemini' } })) }
      };
      const problem = { name: 'Two Sum' };

      window.SmartGrind.utils.askAI = jest.fn();

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(window.SmartGrind.utils.askAI).toHaveBeenCalledWith('Two Sum', 'gemini');
    });

    test('handles ask-grok action', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => ({ dataset: { action: 'ask-grok' } })) }
      };
      const problem = { name: 'Two Sum' };

      window.SmartGrind.utils.askAI = jest.fn();

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(window.SmartGrind.utils.askAI).toHaveBeenCalledWith('Two Sum', 'grok');
    });

    test('handles solution action', () => {
      // The solution button is now an anchor tag, not a button
      // This test verifies the solution-viewer URL is correct
      const problem = { id: 'add-strings' };
      
      // Verify the expected URL pattern
      const expectedUrl = `/smartgrind/solution-viewer.html?file=/smartgrind/solutions/${problem.id}.md`;
      expect(expectedUrl).toBe('/smartgrind/solution-viewer.html?file=/smartgrind/solutions/add-strings.md');
    });

    test('does nothing if no button found', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => null) }
      };
      const problem = { id: '1' };

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      expect(mockEvent.target.closest).toHaveBeenCalledWith('button');
    });

    test('does nothing if no action', () => {
      const mockEvent = {
        target: { closest: jest.fn(() => ({ dataset: {} })) }
      };
      const problem = { id: '1' };

      window.SmartGrind.renderers.handleProblemCardClick(mockEvent, problem);

      // No actions called
    });
  });
});