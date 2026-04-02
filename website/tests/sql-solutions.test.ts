/**
 * @jest-environment jsdom
 */

// Mock dependencies
const mockGetElementById = jest.spyOn(document, 'getElementById');
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock window.marked
window.marked = {
    setOptions: jest.fn(),
    parse: jest.fn((text) => text),
};

// Mock window.Prism
window.Prism = {
    highlightAllUnder: jest.fn(),
};

// Mock DOMPurify
jest.mock('dompurify', () => ({
    sanitize: jest.fn((html) => html),
}));

// Mock data module
jest.mock('../src/data', () => ({
    algorithmsData: [],
}));

// Import after mocking
import * as uiMarkdown from '../src/ui/ui-markdown';
import { getBaseUrl } from '../src/utils';

jest.mock('../src/utils', () => ({
    getBaseUrl: jest.fn().mockReturnValue('/smartgrind/'),
    getToday: jest.fn().mockReturnValue('2024-01-01'),
    debounce: jest.fn((fn) => fn),
    throttle: jest.fn((fn) => fn),
}));

describe('SQL Solutions', () => {
    let mockModal: HTMLElement;
    let mockContent: HTMLElement;

    beforeEach(() => {
        jest.clearAllMocks();

        mockModal = {
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
        } as unknown as HTMLElement;

        mockContent = {
            innerHTML: '',
            addEventListener: jest.fn(),
            classList: {
                add: jest.fn(),
                remove: jest.fn(),
            },
        } as unknown as HTMLElement;

        mockGetElementById.mockImplementation((id: string) => {
            if (id === 'solution-modal') return mockModal;
            if (id === 'solution-content') return mockContent;
            return null;
        });
    });

    describe('sqlSolutions.getSQLFilename', () => {
        test('converts pattern name to filename', () => {
            const filename = uiMarkdown.sqlSolutions.getSQLFilename('Basic SELECT with WHERE');
            expect(filename).toBe('basic-select-with-where');
        });

        test('removes special characters', () => {
            const filename = uiMarkdown.sqlSolutions.getSQLFilename('LEFT and RIGHT JOIN');
            expect(filename).toBe('left-and-right-join');
        });

        test('handles multiple spaces', () => {
            const filename = uiMarkdown.sqlSolutions.getSQLFilename('Joining 3+ Tables');
            expect(filename).toBe('joining-3-tables');
        });

        test('removes common suffixes', () => {
            const filename1 = uiMarkdown.sqlSolutions.getSQLFilename('Some Pattern');
            expect(filename1).toBe('some');

            const filename2 = uiMarkdown.sqlSolutions.getSQLFilename('Some SQL');
            expect(filename2).toBe('some');

            const filename3 = uiMarkdown.sqlSolutions.getSQLFilename('Some Solution');
            expect(filename3).toBe('some');
        });

        test('handles edge cases', () => {
            expect(uiMarkdown.sqlSolutions.getSQLFilename('')).toBe('');
            expect(uiMarkdown.sqlSolutions.getSQLFilename('   ')).toBe('');
            expect(uiMarkdown.sqlSolutions.getSQLFilename('a')).toBe('a');
        });
    });

    describe('sqlSolutions.checkSQLSolutionExists', () => {
        test('returns true when file exists', async () => {
            mockFetch.mockResolvedValue({ ok: true });

            const result = await uiMarkdown.sqlSolutions.checkSQLSolutionExists('Basic INNER JOIN');

            expect(result).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith(
                '/smartgrind/sql/patterns/basic-inner-join.md',
                { method: 'HEAD' }
            );
        });

        test('returns false when file does not exist', async () => {
            mockFetch.mockResolvedValue({ ok: false, status: 404 });

            const result = await uiMarkdown.sqlSolutions.checkSQLSolutionExists('Non Existent');

            expect(result).toBe(false);
        });

        test('returns false on network error', async () => {
            mockFetch.mockRejectedValue(new Error('Network error'));

            const result = await uiMarkdown.sqlSolutions.checkSQLSolutionExists('Some Pattern');

            expect(result).toBe(false);
        });
    });

    describe('openSQLSolutionModal', () => {
        test('loads pattern solution with correct URL', async () => {
            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue('# SQL Pattern'),
            };
            mockFetch.mockResolvedValue(mockResponse);

            uiMarkdown.openSQLSolutionModal('Basic INNER JOIN');

            // Wait for async operations
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(mockFetch).toHaveBeenCalledWith('/smartgrind/sql/patterns/basic-inner-join.md');
            expect(mockModal.classList.remove).toHaveBeenCalledWith('hidden');
        });
    });

    describe('openProblemSQLSolutionModal', () => {
        test('converts problem name to filename and loads', async () => {
            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue('# Problem Solution'),
            };
            mockFetch.mockResolvedValue(mockResponse);

            uiMarkdown.openProblemSQLSolutionModal('Combine Two Tables');

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(mockFetch).toHaveBeenCalledWith('/smartgrind/sql/solutions/combine-two-tables.md');
        });

        test('handles problem names with special characters', async () => {
            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue('# Solution'),
            };
            mockFetch.mockResolvedValue(mockResponse);

            uiMarkdown.openProblemSQLSolutionModal('Employees Earning More Than Their Managers');

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(mockFetch).toHaveBeenCalledWith(
                '/smartgrind/sql/solutions/employees-earning-more-than-their-managers.md'
            );
        });

        test('handles problem names with parentheses', async () => {
            const mockResponse = {
                ok: true,
                text: jest.fn().mockResolvedValue('# Solution'),
            };
            mockFetch.mockResolvedValue(mockResponse);

            uiMarkdown.openProblemSQLSolutionModal('Second Highest Salary');

            await new Promise(resolve => setTimeout(resolve, 0));

            expect(mockFetch).toHaveBeenCalledWith(
                '/smartgrind/sql/solutions/second-highest-salary.md'
            );
        });
    });
});
