// Mock dependencies before importing the module
const mockPushState = jest.fn();
const mockScrollTo = jest.fn();
const mockAppendChild = jest.fn();
const mockContentScrollTo = jest.fn();

// Mock document
const mockDocument = {
  createElement: jest.fn(() => ({
    className: '',
    innerHTML: '',
    style: {},
    appendChild: jest.fn(),
    remove: jest.fn(),
  })),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
  execCommand: jest.fn(),
};

// Assign mocks to global before importing
global.window.document = mockDocument;
global.window.scrollTo = mockScrollTo;

// Now import the module
import '../public/modules/utils.js';

describe('SmartGrind Utils', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Set SmartGrind state and data
    window.SmartGrind.state = {
      ui: {},
      elements: {
        toastContainer: {
          appendChild: mockAppendChild,
        },
        contentScroll: {
          scrollTo: mockContentScrollTo,
        },
      },
      problems: new Map(),
    };
    window.SmartGrind.data = {
      SPACED_REPETITION_INTERVALS: [1, 3, 7, 14, 30],
      topicsData: [],
    };

    // Reset SmartGrind state
    window.SmartGrind.state.problems.clear();
    window.SmartGrind.state.ui = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Date helpers', () => {
    test('getToday returns current date in YYYY-MM-DD format', () => {
      const today = window.SmartGrind.utils.getToday();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('addDays adds days correctly', () => {
      const result = window.SmartGrind.utils.addDays('2023-01-01', 5);
      expect(result).toBe('2023-01-06');
    });

    test('formatDate formats date correctly', () => {
      const result = window.SmartGrind.utils.formatDate('2023-01-15');
      expect(result).toBe('Jan 15');
    });
  });

  describe('URL helpers', () => {
    test('getUrlParameter returns correct value', () => {
      const originalURLSearchParams = global.URLSearchParams;
      const mockGet = jest.fn();
      mockGet.mockReturnValueOnce('strings').mockReturnValueOnce('all').mockReturnValueOnce(null);
      global.URLSearchParams = jest.fn(() => ({
        get: mockGet
      }));

      expect(window.SmartGrind.utils.getUrlParameter('category')).toBe('strings');
      expect(window.SmartGrind.utils.getUrlParameter('filter')).toBe('all');
      expect(window.SmartGrind.utils.getUrlParameter('nonexistent')).toBe(null);

      global.URLSearchParams = originalURLSearchParams;
    });

    test('updateUrlParameter updates category in path', () => {
      const originalPushState = window.history.pushState;
      window.history.pushState = mockPushState;

      window.SmartGrind.utils.updateUrlParameter('category', 'strings');
      expect(mockPushState).toHaveBeenCalledWith(
        { path: '/smartgrind/c/strings' },
        '',
        '/smartgrind/c/strings'
      );

      window.history.pushState = originalPushState;
    });

    test('updateUrlParameter removes category when value is empty', () => {
      const originalPushState = window.history.pushState;
      window.history.pushState = mockPushState;

      window.SmartGrind.utils.updateUrlParameter('category', '');
      expect(mockPushState).toHaveBeenCalledWith(
        { path: '/smartgrind' },
        '',
        '/smartgrind'
      );

      window.history.pushState = originalPushState;
    });

    test('updateUrlParameter updates other parameters in query string', () => {
      const originalPushState = window.history.pushState;
      const originalURLSearchParams = global.URLSearchParams;
      const mockSet = jest.fn();
      const mockDelete = jest.fn();
      global.URLSearchParams = jest.fn(() => ({
        get: jest.fn(),
        set: mockSet,
        delete: mockDelete,
        toString: jest.fn(() => 'category=strings&filter=all')
      }));
      window.history.pushState = mockPushState;

      window.SmartGrind.utils.updateUrlParameter('filter', 'newfilter');

      expect(mockSet).toHaveBeenCalledWith('filter', 'newfilter');
      expect(mockPushState).toHaveBeenCalledWith(
        { path: '/?category=strings&filter=all' },
        '',
        '/?category=strings&filter=all'
      );

      global.URLSearchParams = originalURLSearchParams;
      window.history.pushState = originalPushState;
    });
  });

  describe('Scroll helpers', () => {
    test('scrollToTop scrolls smoothly', () => {
      window.SmartGrind.utils.scrollToTop(true);

      expect(window.SmartGrind.state.elements.contentScroll.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });
  });


  describe('Toast notifications', () => {
    test('showToast displays success message', () => {
      jest.useFakeTimers();

      window.SmartGrind.utils.showToast('Test message', 'success');

      expect(mockAppendChild).toHaveBeenCalled();
      const el = mockAppendChild.mock.calls[0][0];
      expect(el.className).toContain('bg-brand-600');
      expect(el.innerHTML).toContain('Test message');

      jest.runAllTimers();

      expect(el.style.opacity).toBe('0');
      expect(el.style.transform).toBe('translateY(10px)');

      jest.useRealTimers();
    });

    test('showToast displays error message', () => {
      window.SmartGrind.utils.showToast('Error message', 'error');

      expect(mockAppendChild).toHaveBeenCalled();
      const el = mockAppendChild.mock.calls[0][0];
      expect(el.className).toContain('bg-red-500');
    });
  });

  describe('Review date calculation', () => {
    test('getNextReviewDate calculates correct date', () => {
      const result = window.SmartGrind.utils.getNextReviewDate('2023-01-01', 2);
      expect(result).toBe('2023-01-08'); // 1 + 7 days
    });
  });

  describe('Problem filtering', () => {
    beforeEach(() => {
      window.SmartGrind.state.problems.set('1', {
        status: 'solved',
        nextReviewDate: '2023-01-01'
      });
      window.SmartGrind.state.problems.set('2', {
        status: 'unsolved',
        nextReviewDate: '2023-01-05'
      });
    });

    test('getUniqueProblemIdsForTopic returns all problems for "all"', () => {
      const result = window.SmartGrind.utils.getUniqueProblemIdsForTopic('all');
      expect(result.has('1')).toBe(true);
      expect(result.has('2')).toBe(true);
    });

    test('getUniqueProblemsForTopic calculates stats correctly', () => {
      const result = window.SmartGrind.utils.getUniqueProblemsForTopic('all');
      expect(result.total).toBe(2);
      expect(result.solved).toBe(1);
      expect(result.due).toBe(1); // Assuming today is after 2023-01-01
    });

    test('getUniqueProblemsForTopic handles due dates correctly', () => {
      // Add a solved problem with future review date
      window.SmartGrind.state.problems.set('3', {
        status: 'solved',
        nextReviewDate: '2030-01-01' // Future date
      });

      const result = window.SmartGrind.utils.getUniqueProblemsForTopic('all');
      expect(result.total).toBe(3);
      expect(result.solved).toBe(2);
      expect(result.due).toBe(1); // Only the one with past date is due

      window.SmartGrind.state.problems.delete('3');
    });

    test('shouldShowProblem filters correctly', () => {
      const problem = {
        name: 'Two Sum',
        status: 'solved',
        nextReviewDate: '2023-01-01',
        note: 'Easy problem'
      };

      expect(window.SmartGrind.utils.shouldShowProblem(problem, 'all', '', '2023-01-15')).toBe(true);
      expect(window.SmartGrind.utils.shouldShowProblem(problem, 'solved', '', '2023-01-15')).toBe(true);
      expect(window.SmartGrind.utils.shouldShowProblem(problem, 'review', '', '2023-01-15')).toBe(true);
      expect(window.SmartGrind.utils.shouldShowProblem(problem, 'unsolved', '', '2023-01-15')).toBe(false);

      // Search functionality
      expect(window.SmartGrind.utils.shouldShowProblem(problem, 'all', 'two', '2023-01-15')).toBe(true);
      expect(window.SmartGrind.utils.shouldShowProblem(problem, 'all', 'hard', '2023-01-15')).toBe(false);
    });
  });

  describe('copyToClipboard', () => {
    test('copies text using clipboard API', async () => {
      const text = 'Test prompt';
      const showToastSpy = jest.spyOn(window.SmartGrind.utils, 'showToast');

      await window.SmartGrind.utils.copyToClipboard(text);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
      expect(showToastSpy).toHaveBeenCalledWith('Prompt copied to clipboard', 'success');
    });

    test('falls back to execCommand on clipboard API failure', async () => {
      navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard not available'));
      const text = 'Test prompt';
      const showToastSpy = jest.spyOn(window.SmartGrind.utils, 'showToast');

      await window.SmartGrind.utils.copyToClipboard(text);

      expect(document.execCommand).toHaveBeenCalledWith('copy');
      expect(showToastSpy).toHaveBeenCalledWith('Prompt copied to clipboard', 'success');
    });

    test('shows error toast on complete failure', async () => {
      navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard not available'));
      const execCommandSpy = jest.spyOn(document, 'execCommand');
      execCommandSpy.mockReturnValue(false);
      const text = 'Test prompt';
      const showToastSpy = jest.spyOn(window.SmartGrind.utils, 'showToast');

      await window.SmartGrind.utils.copyToClipboard(text);

      expect(showToastSpy).toHaveBeenCalledWith('Failed to copy prompt', 'error');
    });
  });

  describe('askAI', () => {
    test('asks Gemini on desktop', async () => {
      // Ensure desktop user agent
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });

      const problemName = 'Two Sum';
      const provider = 'aistudio';
      const localStorageSpy = jest.spyOn(localStorage, 'setItem');
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => {});

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await window.SmartGrind.utils.askAI(problemName, provider);

      expect(window.SmartGrind.state.ui.preferredAI).toBe('aistudio');
      expect(window.open).toHaveBeenCalledWith('https://aistudio.google.com/prompts/new_chat?prompt=Explain%20the%20solution%20for%20LeetCode%20problem%3A%20%22Two%20Sum%22.%20Provide%20the%20detailed%20problem%20statement%2C%20examples%2C%20intuition%2C%20multiple%20approaches%2C%20and%20time%2Fspace%20complexity%20analysis.%20Include%20related%20problems%20and%20video%20tutorial%20links.', '_blank');

      consoleSpy.mockRestore();
      windowOpenSpy.mockRestore();

      // Restore original user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true
      });
    });

    test('asks Grok on desktop', async () => {
      // Ensure desktop user agent
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });

      const problemName = 'Two Sum';
      const provider = 'grok';
      const localStorageSpy = jest.spyOn(localStorage, 'setItem');
      const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => {});

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await window.SmartGrind.utils.askAI(problemName, provider);

      expect(window.SmartGrind.state.ui.preferredAI).toBe('grok');
      expect(window.open).toHaveBeenCalledWith('https://grok.com/?q=Explain%20the%20solution%20for%20LeetCode%20problem%3A%20%22Two%20Sum%22.%20Provide%20the%20detailed%20problem%20statement%2C%20examples%2C%20intuition%2C%20multiple%20approaches%2C%20and%20time%2Fspace%20complexity%20analysis.%20Include%20related%20problems%20and%20video%20tutorial%20links.', '_blank');

      consoleSpy.mockRestore();
      windowOpenSpy.mockRestore();

      // Restore original user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true
      });
    });
  });
});
