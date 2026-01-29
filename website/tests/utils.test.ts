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
import { utils } from '../public/modules/utils';
import { state } from '../public/modules/state';
import { data } from '../public/modules/data';

describe('SmartGrind Utils', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Set state and data
        state.ui = {};
        state.elements = {
            toastContainer: {
                appendChild: mockAppendChild,
            },
            contentScroll: {
                scrollTo: mockContentScrollTo,
            },
        };
        state.problems = new Map();
        data.SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30];
        data.topicsData = [];

        // Reset state
        state.problems.clear();
        state.ui = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Date helpers', () => {
        test('getToday returns current date in YYYY-MM-DD format', () => {
            const today = utils.getToday();
            expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        test('addDays adds days correctly', () => {
            const result = utils.addDays('2023-01-01', 5);
            expect(result).toBe('2023-01-06');
        });

        test('formatDate formats date correctly', () => {
            const result = utils.formatDate('2023-01-15');
            expect(result).toBe('Jan 15');
        });
    });

    describe('URL helpers', () => {
        test('getUrlParameter returns correct value', () => {
            const originalURLSearchParams = global.URLSearchParams;
            const mockGet = jest.fn();
            mockGet
                .mockReturnValueOnce('strings')
                .mockReturnValueOnce('all')
                .mockReturnValueOnce(null);
            global.URLSearchParams = jest.fn(() => ({
                get: mockGet,
            }));

            expect(utils.getUrlParameter('category')).toBe('strings');
            expect(utils.getUrlParameter('filter')).toBe('all');
            expect(utils.getUrlParameter('nonexistent')).toBe(null);

            global.URLSearchParams = originalURLSearchParams;
        });

        test('updateUrlParameter updates category in path', () => {
            const originalPushState = window.history.pushState;
            window.history.pushState = mockPushState;

            utils.updateUrlParameter('category', 'strings');
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

            utils.updateUrlParameter('category', '');
            expect(mockPushState).toHaveBeenCalledWith({ path: '/smartgrind' }, '', '/smartgrind');

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
                toString: jest.fn(() => 'category=strings&filter=all'),
            }));
            window.history.pushState = mockPushState;

            utils.updateUrlParameter('filter', 'newfilter');

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
            utils.scrollToTop(true);

            expect(state.elements.contentScroll.scrollTo).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth',
            });
            expect(window.scrollTo).toHaveBeenCalledWith({
                top: 0,
                behavior: 'smooth',
            });
        });
    });

    describe('Toast notifications', () => {
        test('showToast displays success message', () => {
            jest.useFakeTimers();

            utils.showToast('Test message', 'success');

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
            utils.showToast('Error message', 'error');

            expect(mockAppendChild).toHaveBeenCalled();
            const el = mockAppendChild.mock.calls[0][0];
            expect(el.className).toContain('bg-red-500');
        });
    });

    describe('Review date calculation', () => {
        test('getNextReviewDate calculates correct date', () => {
            const result = utils.getNextReviewDate('2023-01-01', 2);
            expect(result).toBe('2023-01-08'); // 1 + 7 days
        });
    });

    describe('Problem filtering', () => {
        beforeEach(() => {
            state.problems.set('1', {
                status: 'solved',
                nextReviewDate: '2023-01-01',
            });
            state.problems.set('2', {
                status: 'unsolved',
                nextReviewDate: '2023-01-05',
            });
        });

        test('getUniqueProblemIdsForTopic returns all problems for "all"', () => {
            const result = utils.getUniqueProblemIdsForTopic('all');
            expect(result.has('1')).toBe(true);
            expect(result.has('2')).toBe(true);
        });

        test('getUniqueProblemsForTopic calculates stats correctly', () => {
            const result = utils.getUniqueProblemsForTopic('all');
            expect(result.total).toBe(2);
            expect(result.solved).toBe(1);
            expect(result.due).toBe(1); // Assuming today is after 2023-01-01
        });

        test('getUniqueProblemsForTopic handles due dates correctly', () => {
            // Add a solved problem with future review date
            state.problems.set('3', {
                status: 'solved',
                nextReviewDate: '2030-01-01', // Future date
            });

            const result = utils.getUniqueProblemsForTopic('all');
            expect(result.total).toBe(3);
            expect(result.solved).toBe(2);
            expect(result.due).toBe(1); // Only the one with past date is due

            state.problems.delete('3');
        });

        test('shouldShowProblem filters correctly', () => {
            const problem = {
                name: 'Two Sum',
                status: 'solved',
                nextReviewDate: '2023-01-01',
                note: 'Easy problem',
            };

            expect(utils.shouldShowProblem(problem, 'all', '', '2023-01-15')).toBe(true);
            expect(utils.shouldShowProblem(problem, 'solved', '', '2023-01-15')).toBe(true);
            expect(utils.shouldShowProblem(problem, 'review', '', '2023-01-15')).toBe(true);
            expect(utils.shouldShowProblem(problem, 'unsolved', '', '2023-01-15')).toBe(false);

            // Search functionality
            expect(utils.shouldShowProblem(problem, 'all', 'two', '2023-01-15')).toBe(true);
            expect(utils.shouldShowProblem(problem, 'all', 'hard', '2023-01-15')).toBe(false);
        });

        test('shouldShowProblem filters by date in review mode', () => {
            const problem1 = {
                id: '1',
                name: 'Two Sum',
                status: 'solved',
                nextReviewDate: '2023-01-01',
                note: '',
            };
            const problem2 = {
                id: '2',
                name: 'Three Sum',
                status: 'solved',
                nextReviewDate: '2023-01-15',
                note: '',
            };

            // Set date filter
            state.ui.reviewDateFilter = '2023-01-01';

            expect(utils.shouldShowProblem(problem1, 'review', '', '2023-01-15')).toBe(true);
            expect(utils.shouldShowProblem(problem2, 'review', '', '2023-01-15')).toBe(false);

            // Clear date filter
            state.ui.reviewDateFilter = null;
            expect(utils.shouldShowProblem(problem1, 'review', '', '2023-01-15')).toBe(true);
            expect(utils.shouldShowProblem(problem2, 'review', '', '2023-01-15')).toBe(true);
        });

        test('shouldShowProblem filters by date in solved mode', () => {
            const problem1 = {
                id: '1',
                name: 'Two Sum',
                status: 'solved',
                nextReviewDate: '2023-01-01',
                note: '',
            };
            const problem2 = {
                id: '2',
                name: 'Three Sum',
                status: 'solved',
                nextReviewDate: '2023-01-15',
                note: '',
            };

            // Set date filter
            state.ui.reviewDateFilter = '2023-01-01';

            expect(utils.shouldShowProblem(problem1, 'solved', '', '2023-01-15')).toBe(true);
            expect(utils.shouldShowProblem(problem2, 'solved', '', '2023-01-15')).toBe(false);

            // Clear date filter
            state.ui.reviewDateFilter = null;
            expect(utils.shouldShowProblem(problem1, 'solved', '', '2023-01-15')).toBe(true);
            expect(utils.shouldShowProblem(problem2, 'solved', '', '2023-01-15')).toBe(true);
        });
    });

    describe('getAvailableReviewDates', () => {
        beforeEach(() => {
            state.problems.clear();
            state.problems.set('1', {
                id: '1',
                name: 'Problem 1',
                url: 'https://leetcode.com/1',
                status: 'solved',
                topic: 'arrays',
                pattern: 'two-pointers',
                reviewInterval: 1,
                nextReviewDate: '2023-01-01',
                note: '',
            });
            state.problems.set('2', {
                id: '2',
                name: 'Problem 2',
                url: 'https://leetcode.com/2',
                status: 'solved',
                topic: 'arrays',
                pattern: 'two-pointers',
                reviewInterval: 1,
                nextReviewDate: '2023-01-15',
                note: '',
            });
            state.problems.set('3', {
                id: '3',
                name: 'Problem 3',
                url: 'https://leetcode.com/3',
                status: 'unsolved',
                topic: 'arrays',
                pattern: 'two-pointers',
                reviewInterval: 1,
                nextReviewDate: '2023-01-10',
                note: '',
            });
            state.problems.set('4', {
                id: '4',
                name: 'Problem 4',
                url: 'https://leetcode.com/4',
                status: 'solved',
                topic: 'arrays',
                pattern: 'sliding-window',
                reviewInterval: 1,
                nextReviewDate: '2030-01-01', // Future date - should not be included
                note: '',
            });
        });

        test('returns only due dates (today or earlier)', () => {
            const today = '2023-01-20';
            const dates = utils.getAvailableReviewDates(today, 'review');
            // Only dates on or before today should be included
            expect(dates).toEqual(['2023-01-01', '2023-01-15']);
        });

        test('excludes future dates', () => {
            const today = '2023-01-20';
            const dates = utils.getAvailableReviewDates(today, 'review');
            expect(dates).not.toContain('2030-01-01');
        });

        test('excludes unsolved problems', () => {
            const today = '2023-01-20';
            const dates = utils.getAvailableReviewDates(today, 'review');
            expect(dates).not.toContain('2023-01-10');
        });

        test('returns empty array when no due problems', () => {
            state.problems.clear();
            state.problems.set('1', {
                id: '1',
                name: 'Problem 1',
                url: 'https://leetcode.com/1',
                status: 'solved',
                topic: 'arrays',
                pattern: 'two-pointers',
                reviewInterval: 1,
                nextReviewDate: '2030-01-01', // Future date
                note: '',
            });
            const today = '2023-01-20';
            const dates = utils.getAvailableReviewDates(today, 'review');
            expect(dates).toEqual([]);
        });

        test('sorts dates in ascending order', () => {
            const today = '2023-01-20';
            const dates = utils.getAvailableReviewDates(today, 'review');
            expect(dates[0]).toBe('2023-01-01');
            expect(dates[1]).toBe('2023-01-15');
        });

        test('includes dates equal to today', () => {
            state.problems.clear();
            state.problems.set('1', {
                id: '1',
                name: 'Problem 1',
                url: 'https://leetcode.com/1',
                status: 'solved',
                topic: 'arrays',
                pattern: 'two-pointers',
                reviewInterval: 1,
                nextReviewDate: '2023-01-20', // Same as today
                note: '',
            });
            const today = '2023-01-20';
            const dates = utils.getAvailableReviewDates(today, 'review');
            expect(dates).toContain('2023-01-20');
        });
    });

    describe('copyToClipboard', () => {
        test('copies text using clipboard API', async () => {
            const text = 'Test prompt';
            const showToastSpy = jest.spyOn(utils, 'showToast');

            await utils.copyToClipboard(text);

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
            expect(showToastSpy).toHaveBeenCalledWith('Prompt copied to clipboard', 'success');
        });

        test('falls back to execCommand on clipboard API failure', async () => {
            navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard not available'));
            const text = 'Test prompt';
            const showToastSpy = jest.spyOn(utils, 'showToast');

            await utils.copyToClipboard(text);

            expect(document.execCommand).toHaveBeenCalledWith('copy');
            expect(showToastSpy).toHaveBeenCalledWith('Prompt copied to clipboard', 'success');
        });

        test('shows error toast on complete failure', async () => {
            navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard not available'));
            const execCommandSpy = jest.spyOn(document, 'execCommand');
            execCommandSpy.mockReturnValue(false);
            const text = 'Test prompt';
            const showToastSpy = jest.spyOn(utils, 'showToast');

            await utils.copyToClipboard(text);

            expect(showToastSpy).toHaveBeenCalledWith('Failed to copy prompt', 'error');
        });
    });

    describe('askAI', () => {
        test('asks Gemini on desktop', async () => {
            // Ensure desktop user agent
            const originalUserAgent = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                configurable: true,
            });

            const problemName = 'Two Sum';
            const provider = 'aistudio';
            const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => {});

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await utils.askAI(problemName, provider);

            expect(state.ui.preferredAI).toBe('aistudio');
            expect(window.open).toHaveBeenCalledWith(
                'https://aistudio.google.com/prompts/new_chat?prompt=Explain%20the%20solution%20for%20LeetCode%20problem%3A%20%22Two%20Sum%22.%20Provide%20the%20detailed%20problem%20statement%2C%20examples%2C%20intuition%2C%20multiple%20approaches%20with%20code%2C%20and%20time%2Fspace%20complexity%20analysis.%20Include%20related%20problems%2C%20video%20tutorial%20links%20and%20followup%20questions%20with%20brief%20answers%20without%20code.',
                '_blank'
            );

            consoleSpy.mockRestore();
            windowOpenSpy.mockRestore();

            // Restore original user agent
            Object.defineProperty(navigator, 'userAgent', {
                value: originalUserAgent,
                configurable: true,
            });
        });

        test('asks Grok on desktop', async () => {
            // Ensure desktop user agent
            const originalUserAgent = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                configurable: true,
            });

            const problemName = 'Two Sum';
            const provider = 'grok';
            const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => {});

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await utils.askAI(problemName, provider);

            expect(state.ui.preferredAI).toBe('grok');
            expect(window.open).toHaveBeenCalledWith(
                'https://grok.com/?q=Explain%20the%20solution%20for%20LeetCode%20problem%3A%20%22Two%20Sum%22.%20Provide%20the%20detailed%20problem%20statement%2C%20examples%2C%20intuition%2C%20multiple%20approaches%20with%20code%2C%20and%20time%2Fspace%20complexity%20analysis.%20Include%20related%20problems%2C%20video%20tutorial%20links%20and%20followup%20questions%20with%20brief%20answers%20without%20code.',
                '_blank'
            );

            consoleSpy.mockRestore();
            windowOpenSpy.mockRestore();

            // Restore original user agent
            Object.defineProperty(navigator, 'userAgent', {
                value: originalUserAgent,
                configurable: true,
            });
        });
    });
});
