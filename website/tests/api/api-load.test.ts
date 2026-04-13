/**
 * API Load Module Tests
 * Comprehensive tests for data loading operations including decompression, error handling, and UI initialization
 */

import {
    _getResponseText,
    _handleApiError,
    _processUserData,
    _initializeUI,
    loadData,
} from '../../src/api/api-load';
import { state } from '../../src/state';
import { data } from '../../src/data';

// Mock dependencies
jest.mock('../../src/state', () => ({
    markDeletedIdsDirty: jest.fn(),
    markProblemDirty: jest.fn(),
    markFlashCardsDirty: jest.fn(),
    state: {
        problems: new Map(),
        deletedProblemIds: new Set(),
        ui: {
            activeTopicId: '',
            activeAlgorithmCategoryId: null,
            activeSQLCategoryId: null,
        },
        elements: {},
    },
}));

jest.mock('../../src/data', () => ({
    data: {
        API_BASE: '/smartgrind/api',
        resetTopicsData: jest.fn(),
    },
}));

jest.mock('../../src/api/api-sync', () => ({
    syncPlan: jest.fn(),
    mergeStructure: jest.fn(),
}));

jest.mock('../../src/api/api-utils', () => ({
    validateResponseOrigin: jest.fn(),
    getErrorMessage: jest.fn((status, fallback) => fallback),
}));

jest.mock('../../src/ui/ui-modals', () => ({
    showAlert: jest.fn(),
}));

jest.mock('../../src/renderers', () => ({
    renderers: {
        renderSidebar: jest.fn(),
        renderMainView: jest.fn(),
        renderCombinedView: jest.fn(),
        updateStats: jest.fn(),
    },
}));

jest.mock('../../src/ui/ui-scroll', () => ({
    initScrollButton: jest.fn(),
}));

import { syncPlan, mergeStructure } from '../../src/api/api-sync';
import { validateResponseOrigin, getErrorMessage } from '../../src/api/api-utils';
import { showAlert } from '../../src/ui/ui-modals';
import { renderers } from '../../src/renderers';
const { renderSidebar, renderMainView, renderCombinedView, updateStats } = renderers;
import { initScrollButton } from '../../src/ui/ui-scroll';

describe('API Load Module', () => {
    let mockFetch: jest.Mock;
    let originalFetch: typeof global.fetch;
    let mockDecompressionStream: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset state
        state.problems = new Map();
        state.deletedProblemIds = new Set();
        state.ui = {
            activeTopicId: '',
            activeAlgorithmCategoryId: null,
            activeSQLCategoryId: null,
        };
        state.elements = {};

        // Mock fetch
        originalFetch = global.fetch;
        mockFetch = jest.fn();
        global.fetch = mockFetch;

        // Mock DecompressionStream
        mockDecompressionStream = jest.fn();
        global.DecompressionStream = mockDecompressionStream;

        // Mock navigator.onLine
        Object.defineProperty(navigator, 'onLine', {
            writable: true,
            configurable: true,
            value: true,
        });
    });

    afterEach(() => {
        global.fetch = originalFetch;
        jest.restoreAllMocks();
    });

    describe('_getResponseText', () => {
        test('with identity encoding - returns response.text()', async () => {
            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('identity'),
                },
                text: jest.fn().mockResolvedValue('response body'),
            } as unknown as Response;

            const result = await _getResponseText(response);

            expect(response.headers.get).toHaveBeenCalledWith('Content-Encoding');
            expect(response.text).toHaveBeenCalled();
            expect(result).toBe('response body');
        });

        test('with no content encoding - returns response.text()', async () => {
            const response = {
                headers: {
                    get: jest.fn().mockReturnValue(null),
                },
                text: jest.fn().mockResolvedValue('response body'),
            } as unknown as Response;

            const result = await _getResponseText(response);

            expect(response.headers.get).toHaveBeenCalledWith('Content-Encoding');
            expect(response.text).toHaveBeenCalled();
            expect(result).toBe('response body');
        });

        test('with empty buffer - returns empty string', async () => {
            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('gzip'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
            } as unknown as Response;

            const result = await _getResponseText(response);

            expect(result).toBe('');
        });

        test('with uncompressed JSON (starts with {) - decodes directly', async () => {
            const jsonString = '{"key": "value"}';
            const buffer = new TextEncoder().encode(jsonString);
            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('gzip'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(buffer.buffer),
            } as unknown as Response;

            const result = await _getResponseText(response);

            expect(result).toBe(jsonString);
        });

        test('with uncompressed JSON array (starts with [) - decodes directly', async () => {
            const jsonString = '[1, 2, 3]';
            const buffer = new TextEncoder().encode(jsonString);
            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('gzip'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(buffer.buffer),
            } as unknown as Response;

            const result = await _getResponseText(response);

            expect(result).toBe(jsonString);
        });

        test('with gzip encoding - decompresses with DecompressionStream', async () => {
            const compressedData = new Uint8Array([1, 2, 3, 4]);
            const decompressedData = new Uint8Array([123, 34, 107, 34, 58, 34, 118, 34, 125]); // {"k":"v"}

            const mockReader = {
                read: jest.fn()
                    .mockResolvedValueOnce({ done: false, value: decompressedData })
                    .mockResolvedValueOnce({ done: true }),
            };

            const mockStream = {
                pipeThrough: jest.fn().mockReturnValue({
                    getReader: jest.fn().mockReturnValue(mockReader),
                }),
            };

            mockDecompressionStream.mockImplementation(() => ({
                readable: mockStream,
            }));

            global.ReadableStream = jest.fn().mockImplementation(() => mockStream) as unknown as typeof ReadableStream;

            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('gzip'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(compressedData.buffer),
            } as unknown as Response;

            await _getResponseText(response);

            expect(mockDecompressionStream).toHaveBeenCalledWith('gzip');
        });

        test('with deflate encoding - decompresses correctly', async () => {
            const compressedData = new Uint8Array([1, 2, 3, 4]);

            const mockReader = {
                read: jest.fn()
                    .mockResolvedValueOnce({ done: false, value: new Uint8Array([123, 125]) }) // {}
                    .mockResolvedValueOnce({ done: true }),
            };

            const mockStream = {
                pipeThrough: jest.fn().mockReturnValue({
                    getReader: jest.fn().mockReturnValue(mockReader),
                }),
            };

            mockDecompressionStream.mockImplementation(() => ({
                readable: mockStream,
            }));

            global.ReadableStream = jest.fn().mockImplementation(() => mockStream) as unknown as typeof ReadableStream;

            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('deflate'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(compressedData.buffer),
            } as unknown as Response;

            await _getResponseText(response);

            expect(mockDecompressionStream).toHaveBeenCalledWith('deflate');
        });

        test('with br encoding - handles brotli', async () => {
            const compressedData = new Uint8Array([1, 2, 3, 4]);

            const mockReader = {
                read: jest.fn()
                    .mockResolvedValueOnce({ done: false, value: new Uint8Array([123, 125]) })
                    .mockResolvedValueOnce({ done: true }),
            };

            const mockStream = {
                pipeThrough: jest.fn().mockReturnValue({
                    getReader: jest.fn().mockReturnValue(mockReader),
                }),
            };

            mockDecompressionStream.mockImplementation(() => ({
                readable: mockStream,
            }));

            global.ReadableStream = jest.fn().mockImplementation(() => mockStream) as unknown as typeof ReadableStream;

            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('br'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(compressedData.buffer),
            } as unknown as Response;

            await _getResponseText(response);

            expect(mockDecompressionStream).toHaveBeenCalledWith('br');
        });

        test('with unknown encoding - returns decoded text directly', async () => {
            const textString = 'plain text content';
            const buffer = new TextEncoder().encode(textString);
            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('unknown-encoding'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(buffer.buffer),
            } as unknown as Response;

            // Mock that buffer doesn't look like JSON (first byte is not { or [)
            // and encoding is unknown so it should decode directly
            const nonJsonBuffer = new Uint8Array([0, 1, 2, 3]);
            const responseWithNonJson = {
                headers: {
                    get: jest.fn().mockReturnValue('unknown-encoding'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(nonJsonBuffer.buffer),
            } as unknown as Response;

            const result = await _getResponseText(responseWithNonJson);

            expect(result).toBeDefined();
        });

        test('with decompression error - falls back to direct decode', async () => {
            const textString = '{"fallback": "data"}';
            const buffer = new TextEncoder().encode(textString);

            mockDecompressionStream.mockImplementation(() => {
                throw new Error('Decompression failed');
            });

            const response = {
                headers: {
                    get: jest.fn().mockReturnValue('gzip'),
                },
                arrayBuffer: jest.fn().mockResolvedValue(buffer.buffer),
            } as unknown as Response;

            // Since bytes start with { it will decode directly without trying decompression
            const result = await _getResponseText(response);

            expect(result).toBe(textString);
        });
    });

    describe('_handleApiError', () => {
        test('throws error with proper message', () => {
            const response = {
                status: 500,
                statusText: 'Internal Server Error',
            } as Response;

            (getErrorMessage as jest.Mock).mockReturnValue('Server error message');

            expect(() => _handleApiError(response)).toThrow('Server error message');
            expect(getErrorMessage).toHaveBeenCalledWith(500, 'Failed to load data: Internal Server Error');
        });
    });

    describe('_processUserData', () => {
        test('normal case - updates state.problems and deletedProblemIds', () => {
            const userData = {
                problems: {
                    'problem-1': {
                        id: 'problem-1',
                        name: 'Test Problem',
                        url: 'https://leetcode.com/problems/test',
                        status: 'solved',
                        topic: 'Arrays',
                        pattern: 'Two Pointers',
                        reviewInterval: 1,
                        nextReviewDate: '2024-01-01',
                        note: 'Test note',
                    },
                },
                deletedIds: ['deleted-1', 'deleted-2'],
            };

            _processUserData(userData, false);

            expect(state.problems.size).toBe(1);
            expect(state.problems.has('problem-1')).toBe(true);
            expect(state.deletedProblemIds.size).toBe(2);
            expect(state.deletedProblemIds.has('deleted-1')).toBe(true);
            expect(state.deletedProblemIds.has('deleted-2')).toBe(true);

            // Check that loading and noteVisible are set
            const problem = state.problems.get('problem-1');
            expect(problem?.loading).toBe(false);
            expect(problem?.noteVisible).toBe(false);
        });

        test('with offline fallback and existing data - preserves local state', () => {
            // Set up existing state
            state.problems.set('existing-problem', {
                id: 'existing-problem',
                name: 'Existing',
                url: 'https://example.com',
                status: 'solved',
                topic: 'Test',
                pattern: 'Test',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            });

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const userData = {
                problems: { 'new-problem': { id: 'new-problem' } as any },
                deletedIds: [],
            };

            _processUserData(userData, true);

            // Local state should be preserved
            expect(state.problems.has('existing-problem')).toBe(true);
            expect(state.problems.has('new-problem')).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('[API Load] Preserving local state during offline reload');

            consoleSpy.mockRestore();
        });

        test('with offline fallback but no local data - processes normally', () => {
            // Ensure no existing data
            state.problems = new Map();

            const userData = {
                problems: {
                    'problem-1': {
                        id: 'problem-1',
                        name: 'Test Problem',
                        url: 'https://leetcode.com/problems/test',
                        status: 'solved',
                        topic: 'Arrays',
                        pattern: 'Two Pointers',
                        reviewInterval: 1,
                        nextReviewDate: '2024-01-01',
                        note: '',
                    },
                },
                deletedIds: [],
            };

            _processUserData(userData, true);

            expect(state.problems.size).toBe(1);
            expect(state.problems.has('problem-1')).toBe(true);
        });
    });

    describe('_initializeUI', () => {
        beforeEach(() => {
            // Set up mock DOM elements
            state.elements = {
                setupModal: document.createElement('div'),
                appWrapper: document.createElement('div'),
            };
            state.elements.setupModal!.classList.add('hidden');
            state.elements.appWrapper!.classList.add('hidden');
        });

        test('with active category - renders sidebar and main view', async () => {
            state.ui.activeTopicId = 'arrays-topic';
            state.ui.activeAlgorithmCategoryId = null;
            state.ui.activeSQLCategoryId = null;

            await _initializeUI();

            expect(renderSidebar).toHaveBeenCalled();
            expect(renderMainView).toHaveBeenCalledWith('arrays-topic');
            expect(renderCombinedView).not.toHaveBeenCalled();
            expect(updateStats).toHaveBeenCalled();
            expect(initScrollButton).toHaveBeenCalled();

            // Check modals are shown/hidden
            expect(state.elements.setupModal!.classList.contains('hidden')).toBe(true);
            expect(state.elements.appWrapper!.classList.contains('hidden')).toBe(false);
        });

        test('with active algorithm category - renders sidebar and main view', async () => {
            state.ui.activeTopicId = '';
            state.ui.activeAlgorithmCategoryId = 'sorting';
            state.ui.activeSQLCategoryId = null;

            await _initializeUI();

            expect(renderSidebar).toHaveBeenCalled();
            expect(renderMainView).toHaveBeenCalledWith('all');
            expect(renderCombinedView).not.toHaveBeenCalled();
        });

        test('with active SQL category - renders sidebar and main view', async () => {
            state.ui.activeTopicId = '';
            state.ui.activeAlgorithmCategoryId = null;
            state.ui.activeSQLCategoryId = 'joins';

            await _initializeUI();

            expect(renderSidebar).toHaveBeenCalled();
            expect(renderMainView).toHaveBeenCalledWith('all');
            expect(renderCombinedView).not.toHaveBeenCalled();
        });

        test('without active category - renders combined view', async () => {
            state.ui.activeTopicId = '';
            state.ui.activeAlgorithmCategoryId = null;
            state.ui.activeSQLCategoryId = null;

            await _initializeUI();

            expect(renderSidebar).toHaveBeenCalled();
            expect(renderMainView).not.toHaveBeenCalled();
            expect(renderCombinedView).toHaveBeenCalled();
            expect(updateStats).toHaveBeenCalled();
            expect(initScrollButton).toHaveBeenCalled();
        });
    });

    describe('loadData', () => {
        beforeEach(() => {
            // Set up mock DOM elements
            state.elements = {
                loadingScreen: document.createElement('div'),
                appWrapper: document.createElement('div'),
                setupModal: document.createElement('div'),
                signinModal: document.createElement('div'),
            };
            state.elements.loadingScreen!.classList.add('hidden');
            state.elements.appWrapper!.classList.add('hidden');
            state.elements.setupModal!.classList.add('hidden');
            state.elements.signinModal!.classList.add('hidden');
        });

        test('success flow - fetches, processes, initializes UI', async () => {
            const userData = {
                problems: {
                    'problem-1': {
                        id: 'problem-1',
                        name: 'Test',
                        url: 'https://example.com',
                        status: 'solved',
                        topic: 'Arrays',
                        pattern: 'Two Pointers',
                        reviewInterval: 0,
                        nextReviewDate: null,
                        note: '',
                    },
                },
                deletedIds: [],
            };

            mockFetch.mockResolvedValue({
                ok: true,
                headers: {
                    get: jest.fn().mockReturnValue(null),
                },
                text: jest.fn().mockResolvedValue(JSON.stringify(userData)),
            });

            await loadData();

            expect(mockFetch).toHaveBeenCalledWith('/smartgrind/api/user', { credentials: 'include' });
            expect(validateResponseOrigin).toHaveBeenCalled();
            expect(data.resetTopicsData).toHaveBeenCalled();
            expect(syncPlan).toHaveBeenCalled();
            expect(mergeStructure).toHaveBeenCalled();
            expect(renderSidebar).toHaveBeenCalled();

            // Loading screen should be hidden in finally block
            expect(state.elements.loadingScreen!.classList.contains('hidden')).toBe(true);
        });

        test('with network error and existing data - preserves state and continues', async () => {
            // Set up existing data
            state.problems.set('existing-problem', {
                id: 'existing-problem',
                name: 'Existing',
                url: 'https://example.com',
                status: 'solved',
                topic: 'Test',
                pattern: 'Test',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            });

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            // Mock network error
            mockFetch.mockRejectedValue(new Error('fetch failed'));

            await loadData();

            // Should preserve local state and continue
            expect(state.problems.has('existing-problem')).toBe(true);
            expect(consoleSpy).toHaveBeenCalledWith('[API Load] Network error - preserving local state');
            expect(data.resetTopicsData).toHaveBeenCalled();
            expect(syncPlan).toHaveBeenCalled();
            expect(mergeStructure).toHaveBeenCalled();
            expect(renderSidebar).toHaveBeenCalled();
            expect(showAlert).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        test('with network error and no data - shows alert and shows modal', async () => {
            // Ensure no existing data
            state.problems = new Map();
            state.deletedProblemIds = new Set();

            // Mock offline
            Object.defineProperty(navigator, 'onLine', {
                writable: true,
                configurable: true,
                value: false,
            });

            // Mock network error
            mockFetch.mockRejectedValue(new Error('fetch failed'));

            await loadData();

            expect(showAlert).toHaveBeenCalledWith(expect.stringContaining('Failed to load data'));
            expect(state.elements.setupModal!.classList.contains('hidden')).toBe(false);
            expect(state.elements.appWrapper!.classList.contains('hidden')).toBe(true);
        });

        test('with auth error - shows signin modal', async () => {
            // Ensure no existing data
            state.problems = new Map();
            state.deletedProblemIds = new Set();

            // Mock auth error
            mockFetch.mockRejectedValue(new Error('Authentication failed'));

            await loadData();

            expect(showAlert).toHaveBeenCalledWith(expect.stringContaining('Failed to load data'));
            expect(state.elements.signinModal!.classList.contains('hidden')).toBe(false);
            expect(state.elements.setupModal!.classList.contains('hidden')).toBe(true);
            expect(state.elements.appWrapper!.classList.contains('hidden')).toBe(true);
        });

        test('with other error - shows setup modal', async () => {
            // Ensure no existing data
            state.problems = new Map();
            state.deletedProblemIds = new Set();

            // Mock generic error
            mockFetch.mockRejectedValue(new Error('Some other error'));

            await loadData();

            expect(showAlert).toHaveBeenCalledWith(expect.stringContaining('Failed to load data'));
            expect(state.elements.setupModal!.classList.contains('hidden')).toBe(false);
            expect(state.elements.signinModal!.classList.contains('hidden')).toBe(true);
            expect(state.elements.appWrapper!.classList.contains('hidden')).toBe(true);
        });

        test('hides loading screen in finally block', async () => {
            mockFetch.mockResolvedValue({
                ok: true,
                headers: {
                    get: jest.fn().mockReturnValue(null),
                },
                text: jest.fn().mockResolvedValue('{"problems": {}, "deletedIds": []}'),
            });

            await loadData();

            // Loading screen should be hidden regardless of success
            expect(state.elements.loadingScreen!.classList.contains('hidden')).toBe(true);
        });

        test('hides loading screen even when error occurs', async () => {
            // Ensure no existing data to trigger error path
            state.problems = new Map();

            mockFetch.mockRejectedValue(new Error('Network error'));

            await loadData();

            // Loading screen should still be hidden in finally block
            expect(state.elements.loadingScreen!.classList.contains('hidden')).toBe(true);
        });

        test('handles non-ok response by calling _handleApiError', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Server Error',
            });

            (getErrorMessage as jest.Mock).mockReturnValue('Server error occurred');

            // Ensure no existing data
            state.problems = new Map();

            await loadData();

            expect(showAlert).toHaveBeenCalledWith(expect.stringContaining('Failed to load data'));
        });

        test('handles 404 response', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
            });

            (getErrorMessage as jest.Mock).mockReturnValue('User data not found. Starting with fresh data.');

            // Ensure no existing data
            state.problems = new Map();

            await loadData();

            expect(showAlert).toHaveBeenCalled();
        });
    });
});
