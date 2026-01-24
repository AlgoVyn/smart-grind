// The jest.setup.js already sets up localStorage mock
// We need to use the mocked localStorage from jest.setup.js
// But the mock from jest.setup.js doesn't have jest.fn() methods
// So we need to set it up differently

// First, let's set up a proper localStorage mock before importing
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockRemoveItem = jest.fn();

Object.defineProperty(global, 'localStorage', {
    value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
        clear: jest.fn(),
    },
    writable: true,
});

// Now import the module
import '../public/modules/state.ts';

describe('SmartGrind State', () => {
    beforeEach(() => {
    // Reset mocks
        jest.clearAllMocks();

        // Set up SmartGrind data
        window.SmartGrind.data = {
            LOCAL_STORAGE_KEYS: {
                USER_TYPE: 'smartgrind-user-type',
                PROBLEMS: 'smartgrind-local-problems',
                DELETED_IDS: 'smartgrind-local-deleted-ids',
                DISPLAY_NAME: 'smartgrind-local-display-name'
            }
        };

        // Reset state properties
        window.SmartGrind.state.problems.clear();
        window.SmartGrind.state.deletedProblemIds.clear();
        window.SmartGrind.state.user = {
            type: 'local',
            id: null,
            displayName: 'Local User'
        };
        window.SmartGrind.state.ui = {
            activeTopicId: 'all',
            currentFilter: 'all',
            searchQuery: '',
            preferredAI: null
        };
        window.SmartGrind.state.elements = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        test('init calls loadFromStorage and cacheElements', () => {
            const loadFromStorageSpy = jest.spyOn(window.SmartGrind.state, 'loadFromStorage');
            const cacheElementsSpy = jest.spyOn(window.SmartGrind.state, 'cacheElements');

            window.SmartGrind.state.init();

            expect(loadFromStorageSpy).toHaveBeenCalled();
            expect(cacheElementsSpy).toHaveBeenCalled();

            loadFromStorageSpy.mockRestore();
            cacheElementsSpy.mockRestore();
        });
    });

    describe('loadFromStorage', () => {
        test('loads problems, deletedIds, displayName, and userType from localStorage', () => {
            const mockProblems = { '1': { id: '1', name: 'Test Problem' } };
            const mockDeletedIds = ['2', '3'];
            const mockDisplayName = 'Test User';
            const mockUserType = 'signed-in';

            // Use jest.fn() to make the mock functions chainable
            mockGetItem
                .mockReturnValueOnce(JSON.stringify(mockProblems))
                .mockReturnValueOnce(JSON.stringify(mockDeletedIds))
                .mockReturnValueOnce(mockDisplayName)
                .mockReturnValueOnce(mockUserType);

            window.SmartGrind.state.loadFromStorage();

            expect(window.SmartGrind.state.problems.get('1')).toEqual({ id: '1', name: 'Test Problem', loading: false });
            expect(window.SmartGrind.state.deletedProblemIds.has('2')).toBe(true);
            expect(window.SmartGrind.state.deletedProblemIds.has('3')).toBe(true);
            expect(window.SmartGrind.state.user.displayName).toBe('Test User');
            expect(window.SmartGrind.state.user.type).toBe('signed-in');
        });

        test('handles invalid JSON gracefully', () => {
            mockGetItem.mockReturnValue('invalid json');

            expect(() => window.SmartGrind.state.loadFromStorage()).not.toThrow();
        });
    });

    describe('saveToStorage', () => {
        test('saves problems, deletedIds, displayName, and userType to localStorage', () => {
            window.SmartGrind.state.problems.set('1', { id: '1', name: 'Test Problem' });
            window.SmartGrind.state.deletedProblemIds.add('2');
            window.SmartGrind.state.user.displayName = 'Test User';
            window.SmartGrind.state.user.type = 'signed-in';

            window.SmartGrind.state.saveToStorage();

            // Verify setItem was called for each key
            expect(mockSetItem).toHaveBeenCalled();
        });
    });

    describe('cacheElements', () => {
        test('caches DOM elements using getElementById', () => {
            const mockElement = { id: 'test' };
            const originalGetElementById = document.getElementById;
            document.getElementById = jest.fn(() => mockElement);

            window.SmartGrind.state.cacheElements();

            expect(window.SmartGrind.state.elements.setupModal).toBe(mockElement);

            document.getElementById = originalGetElementById;
        });
    });

    describe('setUser', () => {
        test('updates user state and calls saveToStorage', () => {
            const saveToStorageSpy = jest.spyOn(window.SmartGrind.state, 'saveToStorage');

            window.SmartGrind.state.setUser({ displayName: 'New User', type: 'signed-in' });

            expect(window.SmartGrind.state.user.displayName).toBe('New User');
            expect(window.SmartGrind.state.user.type).toBe('signed-in');
            expect(saveToStorageSpy).toHaveBeenCalled();

            saveToStorageSpy.mockRestore();
        });
    });

    describe('setUI', () => {
        test('updates UI state', () => {
            window.SmartGrind.state.setUI({ activeTopicId: 'arrays', currentFilter: 'solved' });

            expect(window.SmartGrind.state.ui.activeTopicId).toBe('arrays');
            expect(window.SmartGrind.state.ui.currentFilter).toBe('solved');
        });
    });
});
