import { api } from '../src/api';
import { state } from '../src/state';
import { data } from '../src/data';
import { renderers } from '../src/renderers';
import { ui } from '../src/ui/ui';
import { utils } from '../src/utils';

// Import the api-save module
import * as apiSave from '../src/api/api-save';

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

        // Mock UI functions
        mockShowAlert = jest.fn();
        ui.showAlert = mockShowAlert;
        ui.showConfirm = jest.fn().mockResolvedValue(true);
        ui.initScrollButton = jest.fn();

        // Mock renderers
        mockUpdateStats = jest.fn();
        mockRenderSidebar = jest.fn();
        mockRenderMainView = jest.fn();
        mockUpdateFilterBtns = jest.fn();
        renderers.updateStats = mockUpdateStats;
        renderers.renderSidebar = mockRenderSidebar;
        renderers.renderMainView = mockRenderMainView;
        renderers.updateFilterBtns = mockUpdateFilterBtns;

        // Mock state
        mockSaveToStorage = jest.fn();
        state.user = { type: 'local' };
        state.problems = new Map([['1', { id: '1', name: 'Test Problem', status: 'unsolved' }]]);
        state.deletedProblemIds = new Set(['2']);
        state.saveToStorage = mockSaveToStorage;
        state.elements = {
            loadingScreen: { classList: { remove: jest.fn(), add: jest.fn() } },
            setupModal: { classList: { remove: jest.fn(), add: jest.fn() } },
            signinModal: { classList: { remove: jest.fn(), add: jest.fn() } },
            appWrapper: { classList: { remove: jest.fn(), add: jest.fn() } },
        };
        state.ui = {
            activeTopicId: 'all',
        };

        // Mock data
        data.API_BASE = '/smartgrind/api';
        data.resetTopicsData = jest.fn();
        data.topicsData = [];

        // Mock utils
        utils.updateUrlParameter = jest.fn();
        utils.showToast = jest.fn();
    });

    /**
     * Helper to create a mock response with proper URL and headers for origin validation
     */
    const createMockResponse = (options: {
        ok: boolean;
        status?: number;
        json?: () => Promise<any>;
        url?: string;
    }) => ({
        ...options,
        url: options.url || '/smartgrind/api/user',
        headers: {
            get: (name: string) => {
                if (name === 'Origin') {
                    return window.location.origin;
                }
                return null;
            },
        },
    });

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
        test('should save data remotely for signed-in user', async () => {
            state.user.type = 'signed-in';
            mockFetch
                .mockResolvedValueOnce(
                    createMockResponse({
                        ok: true,
                        json: () => Promise.resolve({ csrfToken: 'test-token' }),
                    })
                )
                .mockResolvedValueOnce(createMockResponse({ ok: true }));

            await apiSave._saveRemotely();

            expect(mockFetch).toHaveBeenCalledWith(`${data.API_BASE}/user?action=csrf`, {
                credentials: 'include',
            });
            expect(mockFetch).toHaveBeenCalledWith(`${data.API_BASE}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': 'test-token',
                },
                credentials: 'include',
                body: JSON.stringify({
                    data: {
                        problems: { '1': { id: '1', name: 'Test Problem', status: 'unsolved' } },
                        deletedIds: ['2'],
                    },
                }),
            });
        });

        test('should throw error on auth failure', async () => {
            mockFetch
                .mockResolvedValueOnce(
                    createMockResponse({
                        ok: true,
                        json: () => Promise.resolve({ csrfToken: 'test-token' }),
                    })
                )
                .mockResolvedValueOnce(createMockResponse({ ok: false, status: 401 }));

            await expect(apiSave._saveRemotely()).rejects.toThrow(
                'Authentication failed. Please sign in again.'
            );
        });

        test('should throw error on server error', async () => {
            mockFetch
                .mockResolvedValueOnce(
                    createMockResponse({
                        ok: true,
                        json: () => Promise.resolve({ csrfToken: 'test-token' }),
                    })
                )
                .mockResolvedValueOnce(createMockResponse({ ok: false, status: 500 }));

            await expect(apiSave._saveRemotely()).rejects.toThrow(
                'Server error. Please try again later.'
            );
        });
    });

    describe('_performSave', () => {
        test('should call _saveLocally for local user', async () => {
            state.user.type = 'local';

            await apiSave._performSave();

            expect(mockSaveToStorage).toHaveBeenCalled();
            expect(mockUpdateStats).toHaveBeenCalled();
        });

        test('should call _saveRemotely for signed-in user', async () => {
            state.user.type = 'signed-in';
            mockFetch
                .mockResolvedValueOnce(
                    createMockResponse({
                        ok: true,
                        json: () => Promise.resolve({ csrfToken: 'test-token' }),
                    })
                )
                .mockResolvedValueOnce(createMockResponse({ ok: true }));

            await apiSave._performSave();

            expect(mockFetch).toHaveBeenCalled();
            expect(mockUpdateStats).toHaveBeenCalled();
        });

        test('should show alert on save error', async () => {
            state.user.type = 'signed-in';
            mockFetch
                .mockResolvedValueOnce(
                    createMockResponse({
                        ok: true,
                        json: () => Promise.resolve({ csrfToken: 'test-token' }),
                    })
                )
                .mockResolvedValueOnce(createMockResponse({ ok: false, status: 500 }));

            await expect(apiSave._performSave()).rejects.toThrow(
                'Server error. Please try again later.'
            );

            expect(mockShowAlert).toHaveBeenCalledWith(
                'Failed to save data: Server error. Please try again later.'
            );
        });
    });

    describe('saveProblem', () => {
        test('should call _performSave', async () => {
            const _performSaveSpy = jest
                .spyOn(apiSave.apiSave, '_performSave')
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
                .spyOn(apiSave.apiSave, '_performSave')
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
                .spyOn(apiSave.apiSave, '_performSave')
                .mockRejectedValue(new Error('Save failed'));

            await expect(api.saveDeletedId('1')).rejects.toThrow('Save failed');

            expect(state.problems.has('1')).toBe(true);
            expect(mockShowAlert).toHaveBeenCalledWith('Failed to delete problem: Save failed');
            _performSaveSpy.mockRestore();
        });
    });

    describe('saveData', () => {
        test('should call _performSave', async () => {
            const _performSaveSpy = jest
                .spyOn(apiSave.apiSave, '_performSave')
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
            expect(mockRenderSidebar).toHaveBeenCalled();
            expect(mockRenderMainView).toHaveBeenCalledWith('all');
        });

        test('should handle auth error', async () => {
            mockFetch.mockResolvedValue(createMockResponse({ ok: false, status: 401 }));

            await api.loadData();

            expect(state.elements.signinModal.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockShowAlert).toHaveBeenCalledWith(
                'Failed to load data: Authentication failed. Please sign in again.'
            );
        });

        test('should handle user not found', async () => {
            mockFetch.mockResolvedValue(createMockResponse({ ok: false, status: 404 }));

            await api.loadData();

            expect(mockShowAlert).toHaveBeenCalledWith(
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
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const performSaveSpy = jest.spyOn(apiSave, '_performSave');
            performSaveSpy.mockResolvedValue(undefined);

            await api.deleteCategory('test-topic');

            expect(data.topicsData).toHaveLength(0);
            expect(state.problems.has('1')).toBe(false);
            expect(state.deletedProblemIds.has('1')).toBe(true);
            expect(state.ui.activeTopicId).toBe('all');
            expect(mockRenderSidebar).toHaveBeenCalled();
            expect(mockRenderMainView).toHaveBeenCalledWith('all');
        });

        test('should not delete if not confirmed', async () => {
            data.topicsData = [{ id: 'test-topic', title: 'Test Topic', patterns: [] }];
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(false);

            await api.deleteCategory('test-topic');

            expect(data.topicsData).toHaveLength(1);
        });

        test('should show alert if category not found', async () => {
            await api.deleteCategory('nonexistent');

            expect(mockShowAlert).toHaveBeenCalledWith('Category not found.');
        });

        test('should restore state on save failure', async () => {
            data.topicsData = [{ id: 'test-topic', title: 'Test Topic', patterns: [] }];
            state.problems.set('1', { id: '1', topic: 'Test Topic' });
            state.ui.activeTopicId = 'test-topic';
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(true);
            const _performSaveSpy = jest
                .spyOn(apiSave.apiSave, '_performSave')
                .mockRejectedValue(new Error('Save failed'));

            await expect(api.deleteCategory('test-topic')).rejects.toThrow('Save failed');

            // State should be restored
            expect(data.topicsData).toHaveLength(1);
            expect(state.problems.has('1')).toBe(true);
            expect(state.ui.activeTopicId).toBe('test-topic');
            expect(mockShowAlert).toHaveBeenCalledWith('Failed to delete category: Save failed');
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
                .spyOn(apiSave.apiSave, '_performSave')
                .mockResolvedValue(undefined);

            await api.resetAll();

            // Check confirmation was requested
            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>ALL Problems</b>?</br></br>This will mark all problems as unsolved and restore any deleted problems across all categories.'
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
            expect(mockRenderMainView).toHaveBeenCalledWith('all');
            expect(utils.showToast).toHaveBeenCalledWith('All problems reset and restored');
        });

        test('should not reset if confirmation is cancelled', async () => {
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(false);
            const performSaveSpy = jest.spyOn(apiSave, '_performSave');

            await api.resetAll();

            // Check confirmation was requested
            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>ALL Problems</b>?</br></br>This will mark all problems as unsolved and restore any deleted problems across all categories.'
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
                .spyOn(apiSave.apiSave, '_performSave')
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
                .spyOn(apiSave.apiSave, '_performSave')
                .mockResolvedValue(undefined);

            await api.resetCategory('arrays');

            // Check confirmation was requested
            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to reset all problems in the category "<b>Arrays</b>"?</br></br>This will mark all problems as unsolved and restore any deleted problems.'
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
            expect(mockRenderMainView).toHaveBeenCalledWith('all');
            expect(utils.showToast).toHaveBeenCalledWith('Category problems reset and restored');
        });

        test('should not reset if confirmation is cancelled', async () => {
            const confirmSpy = jest.spyOn(ui, 'showConfirm');
            confirmSpy.mockResolvedValue(false);
            const performSaveSpy = jest.spyOn(apiSave, '_performSave');

            await api.resetCategory('arrays');

            // Check confirmation was requested
            expect(confirmSpy).toHaveBeenCalledWith(
                'Are you sure you want to reset all problems in the category "<b>Arrays</b>"?</br></br>This will mark all problems as unsolved and restore any deleted problems.'
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
                .spyOn(apiSave.apiSave, '_performSave')
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
                .spyOn(apiSave.apiSave, '_performSave')
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
});
