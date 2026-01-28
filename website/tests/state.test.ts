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

// Now import the modules
import { state } from '../public/modules/state.ts';
import { data as _data } from '../public/modules/data.ts';

describe('SmartGrind State', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Reset state properties
        state.problems.clear();
        state.deletedProblemIds.clear();
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
        };
        state.elements = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        test('init calls loadFromStorage and cacheElements', () => {
            const loadFromStorageSpy = jest.spyOn(state, 'loadFromStorage');
            const cacheElementsSpy = jest.spyOn(state, 'cacheElements');

            state.init();

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

            state.loadFromStorage();

            expect(state.problems.get('1')).toEqual({
                id: '1',
                name: 'Test Problem',
                loading: false,
            });
            expect(state.deletedProblemIds.has('2')).toBe(true);
            expect(state.deletedProblemIds.has('3')).toBe(true);
            expect(state.user.displayName).toBe('Test User');
            expect(state.user.type).toBe('signed-in');
        });

        test('handles invalid JSON gracefully', () => {
            mockGetItem.mockReturnValue('invalid json');

            expect(() => state.loadFromStorage()).not.toThrow();
        });
    });

    describe('saveToStorage', () => {
        test('saves problems, deletedIds, displayName, and userType to localStorage', () => {
            state.problems.set('1', { id: '1', name: 'Test Problem' });
            state.deletedProblemIds.add('2');
            state.user.displayName = 'Test User';
            state.user.type = 'signed-in';

            state.saveToStorage();

            // Verify setItem was called for each key
            expect(mockSetItem).toHaveBeenCalled();
        });
    });

    describe('cacheElements', () => {
        test('caches DOM elements using getElementById', () => {
            const mockElement = { id: 'test' };
            const originalGetElementById = document.getElementById;
            document.getElementById = jest.fn(() => mockElement);

            state.cacheElements();

            expect(state.elements.setupModal).toBe(mockElement);

            document.getElementById = originalGetElementById;
        });
    });

    describe('setUser', () => {
        test('updates user state and calls saveToStorage', () => {
            const saveToStorageSpy = jest.spyOn(state, 'saveToStorage');

            state.setUser({ displayName: 'New User', type: 'signed-in' });

            expect(state.user.displayName).toBe('New User');
            expect(state.user.type).toBe('signed-in');
            expect(saveToStorageSpy).toHaveBeenCalled();

            saveToStorageSpy.mockRestore();
        });
    });

    describe('setUI', () => {
        test('updates UI state', () => {
            state.setUI({ activeTopicId: 'arrays', currentFilter: 'solved' });

            expect(state.ui.activeTopicId).toBe('arrays');
            expect(state.ui.currentFilter).toBe('solved');
        });
    });
});
