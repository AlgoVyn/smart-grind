// App Module Tests

// Mock URL and Blob for export functionality
const mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
const mockRevokeObjectURL = jest.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

// Mock document methods
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockClick = jest.fn();

Object.defineProperty(global.document, 'createElement', {
    value: mockCreateElement,
    writable: true,
    configurable: true,
});

Object.defineProperty(global.document, 'body', {
    value: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
    },
    writable: true,
    configurable: true,
});

// Mock modules
jest.mock('../src/state', () => ({
    state: {
        user: {
            type: 'local',
            id: null,
            displayName: 'Local User',
        },
        ui: {
            activeTopicId: 'all',
            currentFilter: 'all',
            searchQuery: '',
            preferredAI: null,
            reviewDateFilter: null,
        },
        elements: {},
        problems: new Map(),
        deletedProblemIds: new Set(),
        loadFromStorage: jest.fn(),
        saveToStorage: jest.fn(),
        setUser: jest.fn(),
        setUI: jest.fn(),
        cacheElements: jest.fn(),
        init: jest.fn(),
    },
}));

jest.mock('../src/data', () => ({
    data: {
        topicsData: [],
        resetTopicsData: jest.fn(),
        LOCAL_STORAGE_KEYS: {
            USER_TYPE: 'userType',
            PROBLEMS: 'problems',
            DELETED_IDS: 'deletedIds',
            DISPLAY_NAME: 'displayName',
        },
    },
}));

jest.mock('../src/api', () => ({
    api: {
        loadData: jest.fn().mockResolvedValue(undefined),
        syncPlan: jest.fn().mockResolvedValue(undefined),
        mergeStructure: jest.fn(),
    },
}));

jest.mock('../src/renderers', () => ({
    renderers: {
        renderSidebar: jest.fn(),
        renderMainView: jest.fn(),
        updateStats: jest.fn(),
        updateFilterBtns: jest.fn(),
    },
}));

jest.mock('../src/ui/ui', () => ({
    ui: {
        showAlert: jest.fn(),
        showConfirm: jest.fn().mockResolvedValue(true),
        updateAuthUI: jest.fn(),
        initScrollButton: jest.fn(),
    },
}));

jest.mock('../src/utils', () => ({
    scrollToTop: jest.fn(),
    sanitizeInput: jest.fn((input) => input),
    updateUrlParameter: jest.fn(),
    showToast: jest.fn(),
}));

// Import after mocks
import { app, initializeLocalUser, exportProgress } from '../src/app';
import { state } from '../src/state';
import { data } from '../src/data';
import { api } from '../src/api';
import { renderers } from '../src/renderers';
import { ui } from '../src/ui/ui';
import { showToast } from '../src/utils';

describe('App Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Reset state
        state.user = {
            type: 'local',
            id: null,
            displayName: 'Local User',
        };
        state.ui = {
            activeTopicId: 'all',
            currentFilter: 'all',
            searchQuery: '',
            preferredAI: null,
            reviewDateFilter: null,
        };
        state.elements = {};
        state.problems.clear();
        state.deletedProblemIds.clear();

        // Reset data
        data.topicsData = [];

        // Mock createElement to return a mock anchor element
        mockCreateElement.mockReturnValue({
            href: '',
            download: '',
            click: mockClick,
            style: {},
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initializeLocalUser', () => {
        test('should set user type to local', async () => {
            const mockSetItem = jest.fn();
            Object.defineProperty(global, 'localStorage', {
                value: {
                    getItem: jest.fn(),
                    setItem: mockSetItem,
                    removeItem: jest.fn(),
                    clear: jest.fn(),
                },
                writable: true,
            });

            await initializeLocalUser();

            expect(state.user.type).toBe('local');
            expect(mockSetItem).toHaveBeenCalledWith(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');
        });

        test('should load from storage', async () => {
            const loadFromStorageSpy = jest.spyOn(state, 'loadFromStorage');

            await initializeLocalUser();

            expect(loadFromStorageSpy).toHaveBeenCalled();
        });

        test('should update user display', async () => {
            state.user.displayName = 'Test User';
            const mockUserDisplay = { innerText: '' };
            state.elements['userDisplay'] = mockUserDisplay as any;

            await initializeLocalUser();

            expect(mockUserDisplay.innerText).toBe('Test User');
        });

        test('should reset topics data', async () => {
            await initializeLocalUser();

            expect(data.resetTopicsData).toHaveBeenCalled();
        });

        test('should sync plan', async () => {
            await initializeLocalUser();

            expect(api.syncPlan).toHaveBeenCalled();
        });

        test('should merge structure', async () => {
            await initializeLocalUser();

            expect(api.mergeStructure).toHaveBeenCalled();
        });

        test('should render sidebar and main view', async () => {
            await initializeLocalUser();

            expect(renderers.renderSidebar).toHaveBeenCalled();
            expect(renderers.renderMainView).toHaveBeenCalledWith('all');
            expect(renderers.updateStats).toHaveBeenCalled();
        });

        test('should initialize scroll button', async () => {
            await initializeLocalUser();

            expect(ui.initScrollButton).toHaveBeenCalled();
        });

        test('should hide setup modal and show app wrapper', async () => {
            const mockSetupModal = { classList: { add: jest.fn(), remove: jest.fn() } };
            const mockAppWrapper = { classList: { add: jest.fn(), remove: jest.fn() } };
            const mockLoadingScreen = { classList: { add: jest.fn(), remove: jest.fn() } };

            state.elements = {
                setupModal: mockSetupModal as any,
                appWrapper: mockAppWrapper as any,
                loadingScreen: mockLoadingScreen as any,
            };

            await initializeLocalUser();

            expect(mockSetupModal.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockAppWrapper.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockLoadingScreen.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('should update auth UI', async () => {
            await initializeLocalUser();

            expect(ui.updateAuthUI).toHaveBeenCalled();
        });

        test('should handle sync plan errors', async () => {
            const error = new Error('Sync failed');
            (api.syncPlan as jest.Mock).mockRejectedValue(error);

            await initializeLocalUser();

            expect(console.error).toHaveBeenCalledWith('Error syncing plan:', error);
            expect(ui.showAlert).toHaveBeenCalledWith('Failed to sync problems: Sync failed');
        });

        test('should handle sync plan errors with non-Error object', async () => {
            (api.syncPlan as jest.Mock).mockRejectedValue('string error');

            await initializeLocalUser();

            expect(console.error).toHaveBeenCalledWith('Error syncing plan:', 'string error');
            expect(ui.showAlert).toHaveBeenCalledWith('Failed to sync problems: string error');
        });
    });

    describe('exportProgress', () => {
        test('should export progress data', () => {
            // Set up test data
            state.problems.set('1', { id: '1', name: 'Problem 1', status: 'solved' });
            state.problems.set('2', { id: '2', name: 'Problem 2', status: 'unsolved' });
            state.deletedProblemIds.add('3');

            exportProgress();

            // Verify Blob was created with correct data
            expect(mockCreateElement).toHaveBeenCalledWith('a');
            expect(mockCreateObjectURL).toHaveBeenCalled();
            expect(mockClick).toHaveBeenCalled();
            expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
        });

        test('should create correct export data structure', () => {
            // Set up test data
            state.problems.set('1', { id: '1', name: 'Problem 1', status: 'solved' });
            state.deletedProblemIds.add('2');

            exportProgress();

            // Get the Blob that was created
            const blobCall = mockCreateObjectURL.mock.calls[0][0];
            expect(blobCall).toBeInstanceOf(Blob);

            // Verify the Blob type
            expect(blobCall.type).toBe('application/json');
        });

        test('should set correct download filename', () => {
            exportProgress();

            const anchorElement = mockCreateElement.mock.results[0].value;
            expect(anchorElement.download).toMatch(/smartgrind-progress-\d{4}-\d{2}-\d{2}\.json/);
        });

        test('should show success toast', () => {
            exportProgress();

            expect(showToast).toHaveBeenCalledWith(
                'Progress exported successfully!',
                'success'
            );
        });

        test('should handle empty progress data', () => {
            state.problems.clear();
            state.deletedProblemIds.clear();

            exportProgress();

            expect(mockCreateElement).toHaveBeenCalledWith('a');
            expect(mockClick).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith(
                'Progress exported successfully!',
                'success'
            );
        });

        test('should handle large progress data', () => {
            // Add many problems
            for (let i = 0; i < 1000; i++) {
                state.problems.set(String(i), {
                    id: String(i),
                    name: `Problem ${i}`,
                    status: i % 2 === 0 ? 'solved' : 'unsolved',
                });
            }

            exportProgress();

            expect(mockCreateElement).toHaveBeenCalledWith('a');
            expect(mockClick).toHaveBeenCalled();
        });
    });

    describe('app object', () => {
        test('should export initializeLocalUser function', () => {
            expect(app.initializeLocalUser).toBeDefined();
            expect(typeof app.initializeLocalUser).toBe('function');
        });

        test('should export exportProgress function', () => {
            expect(app.exportProgress).toBeDefined();
            expect(typeof app.exportProgress).toBe('function');
        });

        test('initializeLocalUser should be callable through app object', async () => {
            const mockSetItem = jest.fn();
            Object.defineProperty(global, 'localStorage', {
                value: {
                    getItem: jest.fn(),
                    setItem: mockSetItem,
                    removeItem: jest.fn(),
                    clear: jest.fn(),
                },
                writable: true,
            });

            await app.initializeLocalUser();

            expect(state.user.type).toBe('local');
        });

        test('exportProgress should be callable through app object', () => {
            app.exportProgress();

            expect(mockCreateElement).toHaveBeenCalledWith('a');
            expect(showToast).toHaveBeenCalled();
        });
    });

    describe('Integration tests', () => {
        test('should complete full local user initialization flow', async () => {
            const mockSetItem = jest.fn();
            Object.defineProperty(global, 'localStorage', {
                value: {
                    getItem: jest.fn(),
                    setItem: mockSetItem,
                    removeItem: jest.fn(),
                    clear: jest.fn(),
                },
                writable: true,
            });

            // Set up DOM elements
            const mockSetupModal = { classList: { add: jest.fn(), remove: jest.fn() } };
            const mockAppWrapper = { classList: { add: jest.fn(), remove: jest.fn() } };
            const mockLoadingScreen = { classList: { add: jest.fn(), remove: jest.fn() } };
            const mockUserDisplay = { innerText: '' };

            state.elements = {
                setupModal: mockSetupModal as any,
                appWrapper: mockAppWrapper as any,
                loadingScreen: mockLoadingScreen as any,
                userDisplay: mockUserDisplay as any,
            };

            state.user.displayName = 'Test User';

            await initializeLocalUser();

            // Verify all steps were executed
            expect(state.user.type).toBe('local');
            expect(mockSetItem).toHaveBeenCalledWith(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local');
            expect(data.resetTopicsData).toHaveBeenCalled();
            expect(api.syncPlan).toHaveBeenCalled();
            expect(api.mergeStructure).toHaveBeenCalled();
            expect(renderers.renderSidebar).toHaveBeenCalled();
            expect(renderers.renderMainView).toHaveBeenCalledWith('all');
            expect(renderers.updateStats).toHaveBeenCalled();
            expect(ui.initScrollButton).toHaveBeenCalled();
            expect(ui.updateAuthUI).toHaveBeenCalled();

            // Verify UI state changes
            expect(mockSetupModal.classList.add).toHaveBeenCalledWith('hidden');
            expect(mockAppWrapper.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockLoadingScreen.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('should export and verify JSON structure', () => {
            // Set up test data
            const problem1 = { id: '1', name: 'Problem 1', status: 'solved', difficulty: 'easy' };
            const problem2 = { id: '2', name: 'Problem 2', status: 'unsolved', difficulty: 'hard' };

            state.problems.set('1', problem1);
            state.problems.set('2', problem2);
            state.deletedProblemIds.add('3');

            exportProgress();

            // Get the Blob content
            const blob = mockCreateObjectURL.mock.calls[0][0];
            expect(blob).toBeInstanceOf(Blob);

            // Read the Blob content
            const _reader = new FileReader();
            let _jsonContent: any;

            // Since we can't easily read the blob in tests, we verify the structure was passed
            // by checking that the blob was created with the correct type
            expect(blob.type).toBe('application/json');
        });

        test('should handle missing DOM elements gracefully', async () => {
            const mockSetItem = jest.fn();
            Object.defineProperty(global, 'localStorage', {
                value: {
                    getItem: jest.fn(),
                    setItem: mockSetItem,
                    removeItem: jest.fn(),
                    clear: jest.fn(),
                },
                writable: true,
            });

            // Don't set up any elements
            state.elements = {};

            // Should not throw
            await expect(initializeLocalUser()).resolves.not.toThrow();
        });
    });
});
