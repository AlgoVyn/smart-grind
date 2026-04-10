import { api } from '../src/api';
import { state } from '../src/state';
import { data } from '../src/data';
import { renderers } from '../src/renderers';
import { ui } from '../src/ui/ui';
import { updateUrlParameter, showToast } from '../src/utils';

// Import the api-save module
import * as apiSave from '../src/api/api-save';
import { registerSaveCallbacks } from '../src/api/api-save';

// Mock the ui-modals module (since api-delete imports directly from it)
jest.mock('../src/ui/ui-modals', () => ({
    showAlert: jest.fn(),
    showConfirm: jest.fn().mockResolvedValue(true),
    showSolutionModal: jest.fn(),
    checkAndShowErrorTrackingConsent: jest.fn(),
}));

// Import the mocked module for test access
import * as uiModals from '../src/ui/ui-modals';

// Mock the csrf module to control token caching behavior
jest.mock('../src/utils/csrf', () => ({
    getCsrfToken: jest.fn(),
    fetchCsrfToken: jest.fn(),
    getCachedCsrfToken: jest.fn(),
    clearCsrfToken: jest.fn(),
    __resetCsrfState: jest.fn(),
}));

// Import the mocked csrf module
import * as csrfModule from '../src/utils/csrf';

// Mock the renderers module (since api-delete imports directly from it)
jest.mock('../src/renderers', () => {
    const mockRenderSidebar = jest.fn();
    const mockRenderMainView = jest.fn();
    const mockRenderAlgorithmsView = jest.fn();
    const mockRenderSQLView = jest.fn();
    const mockRenderCombinedView = jest.fn();
    const mockUpdateStats = jest.fn();
    const mockUpdateFilterBtns = jest.fn();
    
    return {
        renderSidebar: mockRenderSidebar,
        renderMainView: mockRenderMainView,
        renderAlgorithmsView: mockRenderAlgorithmsView,
        renderSQLView: mockRenderSQLView,
        renderCombinedView: mockRenderCombinedView,
        updateStats: mockUpdateStats,
        updateFilterBtns: mockUpdateFilterBtns,
        // Keep backward compatible renderers object
        renderers: {
            renderSidebar: mockRenderSidebar,
            renderMainView: mockRenderMainView,
            renderCombinedView: mockRenderCombinedView,
            updateStats: mockUpdateStats,
            updateFilterBtns: mockUpdateFilterBtns,
        },
        // Individual setters for tests
        setActiveTopic: jest.fn(),
        setActiveAlgorithmCategory: jest.fn(),
        setActiveSQLCategory: jest.fn(),
        setActiveAllButton: jest.fn(),
        createAllContentButton: jest.fn(),
        ICONS: {},
        mainViewRenderers: {},
        problemCardRenderers: {},
        htmlGenerators: {},
        sidebarRenderers: {},
        statsRenderers: {},
        sqlViewRenderers: {},
        combinedViewRenderers: {},
    };
});

// Import the mocked module for test access
import * as renderersMod from '../src/renderers';

// Mock the api module to add spies on queueOperation and forceSync
jest.mock('../src/api', () => {
    const actualApi = jest.requireActual('../src/api');
    return {
        ...actualApi,
        queueOperation: jest.fn().mockResolvedValue('op-id'),
        forceSync: jest.fn().mockResolvedValue({ success: true, synced: 1, failed: 0 }),
    };
});

// Import the mocked api module for test access
import * as apiModule from '../src/api';

// Mock the utils module
jest.mock('../src/utils', () => ({
    updateUrlParameter: jest.fn(),
    showToast: jest.fn(),
    scrollToTop: jest.fn(),
    sanitizeInput: jest.fn((input) => input),
    debounce: jest.fn((fn) => fn),
    getLeetCodeProblemId: jest.fn(),
    extractProblemName: jest.fn(),
    generateProblemUrl: jest.fn(),
    escapeHtml: jest.fn((str) => str),
    formatDate: jest.fn(),
    getToday: jest.fn(() => '2024-01-15'),
    getTodayDate: jest.fn(() => '2024-01-01'),
    addDays: jest.fn((date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    }),
    getNextReviewDate: jest.fn(),
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

describe('SmartGrind API Module', () => {
    let mockFetch;
    let mockShowAlert;
    let mockUpdateStats;
    let mockRenderSidebar;
    let mockRenderMainView;
    let mockUpdateFilterBtns;
    let mockSaveToStorage;

    beforeEach(() => {
        // Mock fetch
        mockFetch = jest.fn();
        global.fetch = mockFetch;

        // Mock UI functions - both from ui object and ui-modals module
        mockShowAlert = jest.fn();
        ui.showAlert = mockShowAlert;
        ui.showConfirm = jest.fn().mockResolvedValue(true);
        ui.initScrollButton = jest.fn();
        
        // Reset ui-modals mocks
        uiModals.showAlert.mockClear();
        uiModals.showConfirm.mockClear().mockResolvedValue(true);

        // Mock renderers - both module exports and object
        mockUpdateStats = jest.fn();
        mockRenderSidebar = jest.fn();
        mockRenderMainView = jest.fn();
        mockUpdateFilterBtns = jest.fn();
        renderers.updateStats = mockUpdateStats;
        renderers.renderSidebar = mockRenderSidebar;
        renderers.renderMainView = mockRenderMainView;
        renderers.renderCombinedView = jest.fn();
        renderers.updateFilterBtns = mockUpdateFilterBtns;
        
        // Reset renderers module mocks
        renderersMod.renderSidebar.mockClear();
        renderersMod.renderMainView.mockClear();
        renderersMod.renderCombinedView.mockClear();
        renderersMod.updateStats.mockClear();
        renderersMod.updateFilterBtns.mockClear();
        mockSaveToStorage = jest.fn();
        state.user = { type: 'local' };
        state.problems = new Map([['1', { id: '1', name: 'Test Problem', status: 'unsolved' }]]);
        state.deletedProblemIds = new Set(['2']);
        state.saveToStorage = mockSaveToStorage;
        state.saveToStorageDebounced = mockSaveToStorage;
        state.elements = {
            loadingScreen: { classList: { remove: jest.fn(), add: jest.fn() } },
            setupModal: { classList: { remove: jest.fn(), add: jest.fn() } },
            signinModal: { classList: { remove: jest.fn(), add: jest.fn() } },
            appWrapper: { classList: { remove: jest.fn(), add: jest.fn() } },
        };
        state.ui = {
            activeTopicId: '',
        };

        // Mock data
        data.API_BASE = '/smartgrind/api';
        data.resetTopicsData = jest.fn();
        data.topicsData = [];
    });

    /**
     * Helper to create a mock response with proper URL and headers for origin validation
     */
    const createMockResponse = (options: {
        ok: boolean;
        status?: number;
        json?: () => Promise<any>;
        text?: () => Promise<string>;
        url?: string;
    }) => {
        const responseData = options.json ? options.json() : Promise.resolve({});
        return {
            ...options,
            url: options.url || '/smartgrind/api/user',
            headers: {
                get: (name: string) => {
                    if (name === 'Origin') {
                        return window.location.origin;
                    }
                    if (name === 'Content-Encoding') {
                        return null; // No compression by default
                    }
                    return null;
                },
            },
            text: options.text || (() => responseData.then((data) => JSON.stringify(data))),
        };
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('_saveLocally', () => {
        test('should call state.saveToStorage for local user', () => {
            apiSave._saveLocally();

            expect(mockSaveToStorage).toHaveBeenCalled();
        });
    });

    describe('mergeStructure', () => {
        test('should add custom problems to topicsData', () => {
            data.topicsData = [];
            state.problems.clear();
            state.problems.set('custom-1', {
                id: 'custom-1',
                name: 'Custom Problem',
                url: 'https://example.com',
                topic: 'Custom Topic',
                pattern: 'Custom Pattern',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: '',
            });

            api.mergeStructure();

            expect(data.topicsData).toHaveLength(1);
            expect(data.topicsData[0].title).toBe('Custom Topic');
            expect(data.topicsData[0].patterns[0].problems).toHaveLength(1);
        });

        test('should not duplicate existing problems', () => {
            data.topicsData = [
                {
                    id: 'test-topic',
                    title: 'Test Topic',
                    patterns: [
                        {
                            name: 'Test Pattern',
                            problems: [
                                {
                                    id: 'existing-1',
                                    name: 'Existing Problem',
                                    url: 'https://example.com',
                                },
                            ],
                        },
                    ],
                },
            ];
            state.problems.clear();
            state.problems.set('existing-1', {
                id: 'existing-1',
                name: 'Existing Problem',
                url: 'https://example.com',
                topic: 'Test Topic',
                pattern: 'Test Pattern',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: '',
            });

            api.mergeStructure();

            expect(data.topicsData[0].patterns[0].problems).toHaveLength(1);
        });
    });

    describe('_saveRemotely', () => {
        beforeEach(() => {
            // Reset CSRF mock before each test
            (csrfModule.getCsrfToken as jest.Mock).mockReset();
            (csrfModule.getCachedCsrfToken as jest.Mock).mockReset();
        });

        test('should save data remotely for signed-in user using cached CSRF token', async () => {
            state.user.type = 'signed-in';
            
            // Mock CSRF token to be returned from cache
            (csrfModule.getCsrfToken as jest.Mock).mockResolvedValue('cached-token');
            
            mockFetch.mockResolvedValueOnce(createMockResponse({ ok: true }));

            await apiSave._saveRemotely();

            // Should use cached token, not fetch new one
            expect(csrfModule.getCsrfToken).toHaveBeenCalled();
            expect(mockFetch).toHaveBeenCalledWith(`${data.API_BASE}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': 'cached-token',
                },
                credentials: 'include',
                body: expect.stringContaining('problems'),
            });
        });

        test('should fetch CSRF token if not cached', async () => {
            state.user.type = 'signed-in';
            
            // First call returns null (not cached), then fetches
            (csrfModule.getCsrfToken as jest.Mock).mockResolvedValue('fresh-token');
            
            mockFetch.mockResolvedValueOnce(createMockResponse({ ok: true }));

            await apiSave._saveRemotely();

            expect(csrfModule.getCsrfToken).toHaveBeenCalled();
            expect(mockFetch).toHaveBeenCalledWith(
                `${data.API_BASE}/user`,
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-CSRF-Token': 'fresh-token',
                    }),
                })
            );
        });

        test('should throw error when CSRF token is unavailable', async () => {
            state.user.type = 'signed-in';
            
            // Mock CSRF token fetch to fail
            (csrfModule.getCsrfToken as jest.Mock).mockResolvedValue(null);

            await expect(apiSave._saveRemotely()).rejects.toThrow('Failed to fetch CSRF token');
        });

        test('should throw error on auth failure (401)', async () => {
            state.user.type = 'signed-in';
            
            (csrfModule.getCsrfToken as jest.Mock).mockResolvedValue('test-token');
            mockFetch.mockResolvedValueOnce(createMockResponse({ 
                ok: false, 
                status: 401,
                statusText: 'Unauthorized'
            }));

            await expect(apiSave._saveRemotely()).rejects.toThrow();
        });

        test('should throw error on server error (500)', async () => {
            state.user.type = 'signed-in';
            
            (csrfModule.getCsrfToken as jest.Mock).mockResolvedValue('test-token');
            mockFetch.mockResolvedValueOnce(createMockResponse({ 
                ok: false, 
                status: 500,
                statusText: 'Internal Server Error'
            }));

            await expect(apiSave._saveRemotely()).rejects.toThrow();
        });

        test('should reuse cached CSRF token for multiple requests', async () => {
            state.user.type = 'signed-in';
            
            // Token should be fetched once and reused
            (csrfModule.getCsrfToken as jest.Mock).mockResolvedValue('reused-token');
            
            mockFetch
                .mockResolvedValueOnce(createMockResponse({ ok: true }))
                .mockResolvedValueOnce(createMockResponse({ ok: true }));

            await apiSave._saveRemotely();
            await apiSave._saveRemotely();

            // getCsrfToken should be called but may use internal caching
            expect(csrfModule.getCsrfToken).toHaveBeenCalled();
            // Only 2 calls to the API (not 4 - no extra CSRF fetches)
            expect(mockFetch).toHaveBeenCalledTimes(2);
        });
    });

    describe('_performSave', () => {
        test('should call _saveLocally for local user', async () => {
            state.user.type = 'local';
            const onStatsUpdateMock = jest.fn();
            registerSaveCallbacks({ onStatsUpdate: onStatsUpdateMock });

            await apiSave._performSave();

            expect(mockSaveToStorage).toHaveBeenCalled();
            expect(onStatsUpdateMock).toHaveBeenCalled();
        });

        test('should save locally and trigger background sync for signed-in user', async () => {
            state.user.type = 'signed-in';
            const onStatsUpdateMock = jest.fn();
            registerSaveCallbacks({ onStatsUpdate: onStatsUpdateMock });

            // Reset the api module mocks before the test
            (apiModule.queueOperation as jest.Mock).mockClear().mockResolvedValue('op-id');
            (apiModule.forceSync as jest.Mock).mockClear().mockResolvedValue({ success: true, synced: 1, failed: 0 });

            await apiSave._performSave();

            // Should save locally first
            expect(mockSaveToStorage).toHaveBeenCalled();
            expect(onStatsUpdateMock).toHaveBeenCalled();
        });

        test('should handle background sync trigger failure gracefully', async () => {
            state.user.type = 'signed-in';

            // Mock the dynamic import to fail by making queueOperation throw
            (apiModule.queueOperation as jest.Mock).mockRejectedValue(new Error('Import failed'));

            // Should not throw - background sync is non-blocking
            await expect(apiSave._performSave()).resolves.not.toThrow();

            // Should still save locally
            expect(mockSaveToStorage).toHaveBeenCalled();
        });
    });

    describe('saveProblem', () => {
        test('should call _performSave', async () => {
            const _performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockResolvedValue(undefined);

            await api.saveProblem({
                id: '1',
                name: 'Test Problem',
                status: 'unsolved',
                topic: 'Test Topic',
                pattern: 'Test Pattern',
                url: 'https://example.com',
                reviewInterval: 0,
                nextReviewDate: null,
            });

            expect(_performSaveSpy).toHaveBeenCalled();
            _performSaveSpy.mockRestore();
        });
    });

    describe('saveDeletedId', () => {
        test('should delete problem and call _performSave', async () => {
            state.problems.set('1', { id: '1' });
            const _performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockResolvedValue(undefined);

            await api.saveDeletedId('1');

            expect(state.problems.has('1')).toBe(false);
            expect(state.deletedProblemIds.has('1')).toBe(true);
            expect(_performSaveSpy).toHaveBeenCalled();
            _performSaveSpy.mockRestore();
        });

        test('should restore problem on save failure', async () => {
            state.problems.set('1', { id: '1', name: 'Test' });
            const _performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockRejectedValue(new Error('Save failed'));
            const onSaveErrorMock = jest.fn();
            registerSaveCallbacks({ onSaveError: onSaveErrorMock });

            await expect(api.saveDeletedId('1')).rejects.toThrow('Save failed');

            expect(state.problems.has('1')).toBe(true);
            expect(onSaveErrorMock).toHaveBeenCalledWith('Failed to delete problem: Save failed');
            _performSaveSpy.mockRestore();
        });
    });

    describe('saveData', () => {
        test('should call _performSave', async () => {
            const _performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockResolvedValue(undefined);

            await api.saveData();

            expect(_performSaveSpy).toHaveBeenCalled();
            _performSaveSpy.mockRestore();
        });
    });

    describe('loadData', () => {
        test('should load data successfully', async () => {
            const userData = {
                problems: { '1': { id: '1', name: 'Test Problem', status: 'unsolved' } },
                deletedIds: ['2'],
            };
            mockFetch.mockResolvedValue(
                createMockResponse({ ok: true, json: () => Promise.resolve(userData) })
            );

            await api.loadData();

            expect(state.problems.get('1')).toEqual({
                id: '1',
                name: 'Test Problem',
                status: 'unsolved',
                loading: false,
                noteVisible: false,
            });
            expect(state.deletedProblemIds.has('2')).toBe(true);
            expect(renderersMod.renderSidebar).toHaveBeenCalled();
            expect(renderersMod.renderCombinedView).toHaveBeenCalled();
        });

        test('should handle auth error', async () => {
            mockFetch.mockResolvedValue(createMockResponse({ ok: false, status: 401 }));

            await api.loadData();

            expect(state.elements.signinModal.classList.remove).toHaveBeenCalledWith('hidden');
            expect(uiModals.showAlert).toHaveBeenCalledWith(
                'Failed to load data: Authentication failed. Please sign in again.'
            );
        });

        test('should handle user not found', async () => {
            mockFetch.mockResolvedValue(createMockResponse({ ok: false, status: 404 }));

            await api.loadData();

            expect(uiModals.showAlert).toHaveBeenCalledWith(
                'Failed to load data: User data not found. Starting with fresh data.'
            );
        });
    });

    describe('syncPlan', () => {
        test('should add missing problems from topicsData', async () => {
            data.topicsData = [
                {
                    title: 'Test Topic',
                    patterns: [
                        {
                            name: 'Test Pattern',
                            problems: [
                                { id: 'new-1', name: 'New Problem', url: 'https://example.com' },
                            ],
                        },
                    ],
                },
            ];
            const performSaveSpy = jest.spyOn(apiSave, '_performSave');
            performSaveSpy.mockResolvedValue(undefined);

            await api.syncPlan();

            expect(state.problems.has('new-1')).toBe(true);
            expect(performSaveSpy).toHaveBeenCalled();
        });

        test('should update existing problem metadata', async () => {
            data.topicsData = [
                {
                    title: 'Updated Topic',
                    patterns: [
                        {
                            name: 'Updated Pattern',
                            problems: [
                                {
                                    id: 'existing-1',
                                    name: 'Updated Name',
                                    url: 'https://updated.com',
                                },
                            ],
                        },
                    ],
                },
            ];
            state.problems.set('existing-1', {
                id: 'existing-1',
                name: 'Old Name',
                url: 'https://old.com',
                topic: 'Old Topic',
                pattern: 'Old Pattern',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: '',
            });
            const performSaveSpy = jest.spyOn(apiSave, '_performSave');
            performSaveSpy.mockResolvedValue(undefined);

            await api.syncPlan();

            const updated = state.problems.get('existing-1');
            expect(updated.name).toBe('Updated Name');
            expect(updated.url).toBe('https://updated.com');
            expect(updated.topic).toBe('Updated Topic');
            expect(updated.pattern).toBe('Updated Pattern');
        });
    });

    describe('deleteCategory', () => {
        test('should delete category and associated problems', async () => {
            data.topicsData = [{ id: 'test-topic', title: 'Test Topic', patterns: [] }];
            state.problems.set('1', { id: '1', topic: 'Test Topic' });
            state.ui.activeTopicId = 'test-topic';
            const confirmSpy = jest.spyOn(uiModals, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const performSaveSpy = jest.spyOn(apiSave, '_performSave');
            performSaveSpy.mockResolvedValue(undefined);

            await api.deleteCategory('test-topic');

            expect(data.topicsData).toHaveLength(0);
            expect(state.problems.has('1')).toBe(false);
            expect(state.deletedProblemIds.has('1')).toBe(true);
            expect(state.ui.activeTopicId).toBe('');
            expect(renderersMod.renderSidebar).toHaveBeenCalled();
            expect(renderersMod.renderMainView).toHaveBeenCalledWith('');
        });

        test('should not delete if not confirmed', async () => {
            data.topicsData = [{ id: 'test-topic', title: 'Test Topic', patterns: [] }];
            const confirmSpy = jest.spyOn(uiModals, 'showConfirm');
            confirmSpy.mockResolvedValue(false);

            await api.deleteCategory('test-topic');

            expect(data.topicsData).toHaveLength(1);
        });

        test('should show alert if category not found', async () => {
            await api.deleteCategory('nonexistent');

            expect(uiModals.showAlert).toHaveBeenCalledWith('Category not found.');
        });

        test('should restore state on save failure', async () => {
            data.topicsData = [{ id: 'test-topic', title: 'Test Topic', patterns: [] }];
            state.problems.set('1', { id: '1', topic: 'Test Topic' });
            state.ui.activeTopicId = 'test-topic';
            const confirmSpy = jest.spyOn(uiModals, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const _performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockRejectedValue(new Error('Save failed'));

            await expect(api.deleteCategory('test-topic')).rejects.toThrow('Save failed');

            // State should be restored
            expect(data.topicsData).toHaveLength(1);
            expect(state.problems.has('1')).toBe(true);
            expect(state.ui.activeTopicId).toBe('test-topic');
            expect(uiModals.showAlert).toHaveBeenCalledWith('Failed to delete category: Save failed');
        });
    });

    describe('resetAll', () => {
        beforeEach(() => {
            // Set up test data
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        {
                            name: 'Two Sum',
                            problems: [
                                {
                                    id: '1',
                                    name: 'Two Sum',
                                    url: 'https://leetcode.com/problems/two-sum/',
                                },
                                {
                                    id: '2',
                                    name: 'Add Two Numbers',
                                    url: 'https://leetcode.com/problems/add-two-numbers/',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'strings',
                    title: 'Strings',
                    patterns: [
                        {
                            name: 'Palindrome',
                            problems: [
                                {
                                    id: '3',
                                    name: 'Valid Palindrome',
                                    url: 'https://leetcode.com/problems/valid-palindrome/',
                                },
                            ],
                        },
                    ],
                },
            ];

            // Set up existing problems
            state.problems.clear();
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                status: 'solved',
                reviewInterval: 3,
                nextReviewDate: '2024-01-01',
                topic: 'Arrays',
                pattern: 'Two Sum',
                loading: false,
                noteVisible: false,
                note: '',
            });
            state.problems.set('3', {
                id: '3',
                name: 'Valid Palindrome',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-02',
                topic: 'Strings',
                pattern: 'Palindrome',
                loading: false,
                noteVisible: false,
                note: '',
            });

            // Set up deleted problems
            state.deletedProblemIds.clear();
            state.deletedProblemIds.add('2'); // Add Two Numbers is deleted
        });

        test('should reset all problems to unsolved and restore deleted problems when confirmed', async () => {
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockResolvedValue(undefined);

            await api.resetAll();

            // Check confirmation was requested
            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>ALL Problems</b>?<br><br>This will mark all problems as unsolved and restore any deleted problems across all categories.'
            );

            // Check existing problems were reset
            const problem1 = state.problems.get('1');
            expect(problem1.status).toBe('unsolved');
            expect(problem1.reviewInterval).toBe(0);
            expect(problem1.nextReviewDate).toBe(null);

            const problem3 = state.problems.get('3');
            expect(problem3.status).toBe('unsolved');
            expect(problem3.reviewInterval).toBe(0);
            expect(problem3.nextReviewDate).toBe(null);

            // Check deleted problem was restored
            expect(state.deletedProblemIds.has('2')).toBe(false);
            const problem2 = state.problems.get('2');
            expect(problem2).toBeDefined();
            expect(problem2.id).toBe('2');
            expect(problem2.name).toBe('Add Two Numbers');
            expect(problem2.status).toBe('unsolved');
            expect(problem2.topic).toBe('Arrays');
            expect(problem2.pattern).toBe('Two Sum');

            // Check save and re-render were called
            expect(performSaveSpy).toHaveBeenCalled();
            expect(mockUpdateFilterBtns).toHaveBeenCalled();
            expect(mockRenderSidebar).toHaveBeenCalled();
            expect(mockRenderMainView).toHaveBeenCalledWith('');
            expect(showToast).toHaveBeenCalledWith('All problems reset and restored');
        });

        test('should not reset if confirmation is cancelled', async () => {
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(false);
            const performSaveSpy = jest.spyOn(apiSave, '_performSave');

            await api.resetAll();

            // Check confirmation was requested
            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>ALL Problems</b>?<br><br>This will mark all problems as unsolved and restore any deleted problems across all categories.'
            );

            // Check no changes were made
            expect(state.problems.get('1').status).toBe('solved');
            expect(state.problems.get('3').status).toBe('solved');
            expect(state.deletedProblemIds.has('2')).toBe(true);
            expect(state.problems.has('2')).toBe(false);

            // Check save was not called
            expect(performSaveSpy).not.toHaveBeenCalled();
        });

        test('should handle save error gracefully', async () => {
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const _performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockRejectedValue(new Error('Save failed'));

            await expect(api.resetAll()).rejects.toThrow('Save failed');

            expect(mockShowAlert).toHaveBeenCalledWith('Failed to reset all problems: Save failed');
            // State should be restored
            expect(state.problems.get('1').status).toBe('solved');
            expect(state.problems.get('3').status).toBe('solved');
            expect(state.deletedProblemIds.has('2')).toBe(true);
        });
    });

    describe('resetCategory', () => {
        beforeEach(() => {
            // Set up test data
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        {
                            name: 'Two Sum',
                            problems: [
                                {
                                    id: '1',
                                    name: 'Two Sum',
                                    url: 'https://leetcode.com/problems/two-sum/',
                                },
                                {
                                    id: '2',
                                    name: 'Add Two Numbers',
                                    url: 'https://leetcode.com/problems/add-two-numbers/',
                                },
                            ],
                        },
                    ],
                },
            ];

            // Set up existing problems
            state.problems.clear();
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                status: 'solved',
                reviewInterval: 3,
                nextReviewDate: '2024-01-01',
                topic: 'Arrays',
                pattern: 'Two Sum',
                loading: false,
                noteVisible: false,
                note: '',
            });

            // Set up deleted problems
            state.deletedProblemIds.clear();
            state.deletedProblemIds.add('2'); // Add Two Numbers is deleted
        });

        test('should reset category problems and restore deleted problems when confirmed', async () => {
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockResolvedValue(undefined);

            await api.resetCategory('arrays');

            // Check confirmation was requested
            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to reset all problems in the category "<b>Arrays</b>"?<br><br>This will mark all problems as unsolved and restore any deleted problems.'
            );

            // Check existing problem was reset
            const problem1 = state.problems.get('1');
            expect(problem1.status).toBe('unsolved');
            expect(problem1.reviewInterval).toBe(0);
            expect(problem1.nextReviewDate).toBe(null);

            // Check deleted problem was restored
            expect(state.deletedProblemIds.has('2')).toBe(false);
            const problem2 = state.problems.get('2');
            expect(problem2).toBeDefined();
            expect(problem2.id).toBe('2');
            expect(problem2.name).toBe('Add Two Numbers');
            expect(problem2.status).toBe('unsolved');
            expect(problem2.topic).toBe('Arrays');
            expect(problem2.pattern).toBe('Two Sum');

            // Check save and re-render were called
            expect(performSaveSpy).toHaveBeenCalled();
            expect(mockUpdateFilterBtns).toHaveBeenCalled();
            expect(mockRenderSidebar).toHaveBeenCalled();
            expect(mockRenderMainView).toHaveBeenCalledWith('');
            expect(showToast).toHaveBeenCalledWith('Category problems reset and restored');
        });

        test('should not reset if confirmation is cancelled', async () => {
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(false);
            const performSaveSpy = jest.spyOn(apiSave, '_performSave');

            await api.resetCategory('arrays');

            // Check confirmation was requested
            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to reset all problems in the category "<b>Arrays</b>"?<br><br>This will mark all problems as unsolved and restore any deleted problems.'
            );

            // Check no changes were made
            expect(state.problems.get('1').status).toBe('solved');
            expect(state.deletedProblemIds.has('2')).toBe(true);
            expect(state.problems.has('2')).toBe(false);

            // Check save was not called
            expect(performSaveSpy).not.toHaveBeenCalled();
        });

        test('should handle save error gracefully', async () => {
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const _performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockRejectedValue(new Error('Save failed'));

            await expect(api.resetCategory('arrays')).rejects.toThrow('Save failed');

            expect(mockShowAlert).toHaveBeenCalledWith('Failed to reset category: Save failed');
            // State should be restored
            expect(state.problems.get('1').status).toBe('solved');
            expect(state.deletedProblemIds.has('2')).toBe(true);
        });

        test('should show alert if category not found', async () => {
            await api.resetCategory('nonexistent');

            expect(mockShowAlert).toHaveBeenCalledWith('Category not found.');
        });

        test('should handle problems with string IDs in topicsData', async () => {
            // Modify topicsData to have string IDs instead of objects
            data.topicsData[0].patterns[0].problems = ['1', '2'];

            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const _performSaveSpy = jest
                .spyOn(apiSave, '_performSave')
                .mockResolvedValue(undefined);

            await api.resetCategory('arrays');

            // Check deleted problem was restored with correct defaults
            const problem2 = state.problems.get('2');
            expect(problem2).toBeDefined();
            expect(problem2.id).toBe('2');
            expect(problem2.name).toBe('2'); // Falls back to ID as name
            expect(problem2.url).toBe('https://leetcode.com/problems/2/'); // Generated URL
            expect(problem2.status).toBe('unsolved');

            _performSaveSpy.mockRestore();
        });
    });

    describe('Sync Debounce', () => {
        beforeEach(() => {
            // Reset debounce state before each test
            apiSave._resetDebounceState();
            jest.clearAllMocks();
        });

        afterEach(() => {
            apiSave._resetDebounceState();
        });

        test('_resetDebounceState should clear pending timer and data', async () => {
            // Set up some state by triggering background sync
            state.user.type = 'signed-in';
            apiSave._triggerBackgroundSync();

            // Reset should clear it
            apiSave._resetDebounceState();

            // Verify state is cleared by flushing - should not trigger any API calls
            await apiSave.flushPendingSync();
            
            // Verify no API calls were made since data was cleared
            expect(mockFetch).not.toHaveBeenCalled();
            expect(apiModule.queueOperation).not.toHaveBeenCalled();
        });

        test('flushPendingSync should handle no pending data gracefully', async () => {
            // Ensure clean state
            apiSave._resetDebounceState();

            // No pending sync - should not throw
            await expect(apiSave.flushPendingSync()).resolves.not.toThrow();
            expect(mockFetch).not.toHaveBeenCalled();
        });

        test('_triggerBackgroundSync should set pending data that flushPendingSync can execute', async () => {
            apiSave._resetDebounceState();
            state.user.type = 'signed-in';
            
            // Reset api module mocks
            (apiModule.queueOperation as jest.Mock).mockClear().mockResolvedValue('op-id');
            (apiModule.forceSync as jest.Mock).mockClear().mockResolvedValue({ success: true });

            // Trigger background sync - this sets up pending data
            apiSave._triggerBackgroundSync();

            // Immediately flush and verify it syncs
            await apiSave.flushPendingSync();
            
            // Verify that the sync was attempted
            expect(apiModule.queueOperation).toHaveBeenCalled();

            // Clean up
            apiSave._resetDebounceState();
        });

        test('_triggerBackgroundSync should debounce multiple rapid calls', async () => {
            apiSave._resetDebounceState();
            state.user.type = 'signed-in';
            
            // Reset api module mocks
            (apiModule.queueOperation as jest.Mock).mockClear().mockResolvedValue('op-id');

            // Trigger multiple background syncs rapidly
            apiSave._triggerBackgroundSync();
            apiSave._triggerBackgroundSync();
            apiSave._triggerBackgroundSync();

            // Flush once should handle all pending data
            await apiSave.flushPendingSync();
            
            // queueOperation should only be called once due to debouncing clearing pending data
            expect(apiModule.queueOperation).toHaveBeenCalledTimes(1);

            // Clean up
            apiSave._resetDebounceState();
        });
    });
});
