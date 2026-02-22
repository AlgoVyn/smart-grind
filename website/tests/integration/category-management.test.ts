/**
 * Integration Tests: Category Management
 * Tests category operations across app, api, and state modules
 */

// Mock UI module before importing API
const mockShowConfirm = jest.fn().mockResolvedValue(true);
const mockShowAlert = jest.fn();
const mockToggleDateFilterVisibility = jest.fn();
const mockPopulateDateFilter = jest.fn();
const mockUpdateFilterBtns = jest.fn();
const mockToggleTheme = jest.fn();
const mockToggleMobileMenu = jest.fn();
const mockLoadDefaultView = jest.fn();
const mockInitScrollButton = jest.fn();
const mockCloseSigninModal = jest.fn();
const mockOpenSigninModal = jest.fn();
const mockCloseAddModal = jest.fn();
const mockOpenAddModal = jest.fn();
const mockCloseAlertModal = jest.fn();
const mockHandleCategoryChange = jest.fn();
const mockHandlePatternChange = jest.fn();
const mockSaveNewProblem = jest.fn();
const mockSetButtonLoading = jest.fn();
const mockHandleGoogleLogin = jest.fn();
const mockHandleLogout = jest.fn();
const mockUpdateAuthUI = jest.fn();
const mockShowError = jest.fn();
const mockShowSigninError = jest.fn();
const mockBindNavigationEvents = jest.fn();

jest.mock('../../src/ui/ui', () => ({
    // Individual exports
    showConfirm: mockShowConfirm,
    showAlert: mockShowAlert,
    closeSigninModal: mockCloseSigninModal,
    openSigninModal: mockOpenSigninModal,
    closeAddModal: mockCloseAddModal,
    openAddModal: mockOpenAddModal,
    closeAlertModal: mockCloseAlertModal,
    showAlertCalled: false,
    getShowAlertHistory: () => ({ called: false }),
    clearShowAlertHistory: jest.fn(),
    handleCategoryChange: mockHandleCategoryChange,
    handlePatternChange: mockHandlePatternChange,
    saveNewProblem: mockSaveNewProblem,
    setButtonLoading: mockSetButtonLoading,
    handleGoogleLogin: mockHandleGoogleLogin,
    handleLogout: mockHandleLogout,
    updateAuthUI: mockUpdateAuthUI,
    showError: mockShowError,
    showSigninError: mockShowSigninError,
    bindNavigationEvents: mockBindNavigationEvents,
    toggleDateFilterVisibility: mockToggleDateFilterVisibility,
    populateDateFilter: mockPopulateDateFilter,
    updateFilterBtns: mockUpdateFilterBtns,
    toggleTheme: mockToggleTheme,
    toggleMobileMenu: mockToggleMobileMenu,
    loadDefaultView: mockLoadDefaultView,
    initScrollButton: mockInitScrollButton,
    pullToRefresh: {
        startY: 0,
        isPulling: false,
        init: jest.fn(),
        cleanup: jest.fn(),
    },
    sidebarResizer: {
        isResizing: false,
        init: jest.fn(),
        cleanup: jest.fn(),
    },
    // Combined ui object
    ui: {
        showConfirm: mockShowConfirm,
        showAlert: mockShowAlert,
        closeSigninModal: mockCloseSigninModal,
        openSigninModal: mockOpenSigninModal,
        closeAddModal: mockCloseAddModal,
        openAddModal: mockOpenAddModal,
        closeAlertModal: mockCloseAlertModal,
        handleCategoryChange: mockHandleCategoryChange,
        handlePatternChange: mockHandlePatternChange,
        saveNewProblem: mockSaveNewProblem,
        setButtonLoading: mockSetButtonLoading,
        handleGoogleLogin: mockHandleGoogleLogin,
        handleLogout: mockHandleLogout,
        updateAuthUI: mockUpdateAuthUI,
        showError: mockShowError,
        showSigninError: mockShowSigninError,
        bindNavigationEvents: mockBindNavigationEvents,
        toggleDateFilterVisibility: mockToggleDateFilterVisibility,
        populateDateFilter: mockPopulateDateFilter,
        updateFilterBtns: mockUpdateFilterBtns,
        toggleTheme: mockToggleTheme,
        toggleMobileMenu: mockToggleMobileMenu,
        loadDefaultView: mockLoadDefaultView,
        initScrollButton: mockInitScrollButton,
        pullToRefresh: {
            startY: 0,
            isPulling: false,
            init: jest.fn(),
            cleanup: jest.fn(),
        },
        sidebarResizer: {
            isResizing: false,
            init: jest.fn(),
            cleanup: jest.fn(),
        },
    },
}));

// Set up localStorage mock before importing modules
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

import { state } from '../../src/state';
import { data } from '../../src/data';
import { api } from '../../src/api';
import { app } from '../../src/app';

// Use global fetch mock from jest.setup.mjs
const mockFetch = global.fetch as jest.Mock;

// Mock minimal DOM elements
const mockElements = {
    topicList: { innerHTML: '', appendChild: jest.fn() },
    problemsContainer: { innerHTML: '', appendChild: jest.fn() },
    emptyState: { classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() } },
    currentViewTitle: { textContent: '', insertAdjacentElement: jest.fn() },
    filterBtns: { forEach: jest.fn() },
    statTotal: { textContent: '0' },
    statSolved: { textContent: '0' },
    statDue: { textContent: '0' },
    progressBarSolved: { style: { width: '0%' } },
    statDueBadge: { textContent: '0', classList: { add: jest.fn(), remove: jest.fn() } },
    reviewBanner: { classList: { add: jest.fn(), remove: jest.fn() } },
    reviewCountBanner: { textContent: '0' },
    sidebarTotalStat: { textContent: '0' },
    sidebarTotalBar: { style: { width: '0%' } },
    mobileMenuBtn: { classList: { remove: jest.fn(), add: jest.fn() } },
    mobileMenuBtnMain: { classList: { remove: jest.fn(), add: jest.fn() } },
    mainSidebar: { classList: { remove: jest.fn(), add: jest.fn() } },
    sidebarBackdrop: { classList: { remove: jest.fn(), add: jest.fn() } },
    contentScroll: { scrollTop: 0, addEventListener: jest.fn() },
    scrollToTopBtn: { classList: { add: jest.fn(), remove: jest.fn() }, style: {} },
    toastContainer: { innerHTML: '', appendChild: jest.fn() },
};

describe('Integration: Category Management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Reset state
        state.problems.clear();
        state.deletedProblemIds.clear();
        state.user = { type: 'local', id: null, displayName: 'Local User' };
        state.ui = { activeTopicId: 'all', currentFilter: 'all', searchQuery: '', preferredAI: null, reviewDateFilter: null };
        state.sync = { isOnline: true, isSyncing: false, pendingCount: 0, lastSyncAt: null, hasConflicts: false, conflictMessage: null };
        state.elements = { ...mockElements } as any;
        
        // Reset data
        data.topicsData = [
            {
                id: 'arrays',
                title: 'Arrays',
                patterns: [
                    {
                        name: 'Two Sum',
                        problems: [
                            { id: '1', name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/' },
                            { id: '2', name: 'Add Two Numbers', url: 'https://leetcode.com/problems/add-two-numbers/' }
                        ]
                    }
                ]
            },
            {
                id: 'linked-lists',
                title: 'Linked Lists',
                patterns: [
                    {
                        name: 'Reverse Linked List',
                        problems: [
                            { id: '3', name: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/' }
                        ]
                    }
                ]
            }
        ];
        
        // Reset localStorage mock
        mockGetItem.mockReturnValue(null);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Category Deletion', () => {
        test('should delete category and all associated problems', async () => {
            // Setup problems in state
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: 'Note 1'
            });
            state.problems.set('2', {
                id: '2',
                name: 'Add Two Numbers',
                url: 'https://leetcode.com/problems/add-two-numbers/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });
            state.problems.set('3', {
                id: '3',
                name: 'Reverse Linked List',
                url: 'https://leetcode.com/problems/reverse-linked-list/',
                topic: 'Linked Lists',
                pattern: 'Reverse Linked List',
                status: 'solved',
                reviewInterval: 2,
                nextReviewDate: '2024-01-20',
                loading: false,
                noteVisible: false,
                note: 'Note 3'
            });

            // Delete Arrays category
            await api.deleteCategory('arrays');

            // Verify problems from Arrays category are deleted
            expect(state.problems.has('1')).toBe(false);
            expect(state.problems.has('2')).toBe(false);
            
            // Verify problems from other categories remain
            expect(state.problems.has('3')).toBe(true);
            
            // Verify deleted IDs are tracked
            expect(state.deletedProblemIds.has('1')).toBe(true);
            expect(state.deletedProblemIds.has('2')).toBe(true);
            expect(state.deletedProblemIds.has('3')).toBe(false);
        });

        test('should handle delete category with no problems', async () => {
            // Delete category with no problems in state
            await api.deleteCategory('linked-lists');
            
            // Should not throw and state should remain valid
            expect(state.problems).toBeInstanceOf(Map);
            expect(state.deletedProblemIds).toBeInstanceOf(Set);
        });

        test('should update topicsData after category deletion', async () => {
            // Delete category
            await api.deleteCategory('arrays');
            
            // Verify topicsData is updated
            expect(data.topicsData).toHaveLength(1);
            expect(data.topicsData[0].id).toBe('linked-lists');
        });
    });

    describe('Category Reset', () => {
        test('should reset all problems in category to unsolved', async () => {
            // Setup solved problems
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 3,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: 'Solved note'
            });
            state.problems.set('2', {
                id: '2',
                name: 'Add Two Numbers',
                url: 'https://leetcode.com/problems/add-two-numbers/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 2,
                nextReviewDate: '2024-01-10',
                loading: false,
                noteVisible: false,
                note: 'Another note'
            });

            // Reset Arrays category
            await api.resetCategory('arrays');

            // Verify problems are reset
            expect(state.problems.get('1')?.status).toBe('unsolved');
            expect(state.problems.get('1')?.reviewInterval).toBe(0);
            expect(state.problems.get('1')?.nextReviewDate).toBeNull();
            
            expect(state.problems.get('2')?.status).toBe('unsolved');
            expect(state.problems.get('2')?.reviewInterval).toBe(0);
            expect(state.problems.get('2')?.nextReviewDate).toBeNull();
        });

        test('should restore deleted problems when resetting category', async () => {
            // Add deleted problem ID
            state.deletedProblemIds.add('1');
            
            // Reset category
            await api.resetCategory('arrays');
            
            // Verify deleted problem is restored
            expect(state.deletedProblemIds.has('1')).toBe(false);
            expect(state.problems.has('1')).toBe(true);
            expect(state.problems.get('1')?.status).toBe('unsolved');
        });

        test('should handle reset on non-existent category', async () => {
            // Reset non-existent category - should return without throwing
            const result = await api.resetCategory('nonexistent');
            expect(result).toBeUndefined();
        });
    });

    describe('Category Statistics', () => {
        test('should calculate correct statistics for category', () => {
            // Setup problems
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            });
            state.problems.set('2', {
                id: '2',
                name: 'Add Two Numbers',
                url: 'https://leetcode.com/problems/add-two-numbers/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });

            // Get category stats
            const stats = app.getCategoryStats('arrays');
            
            // Verify stats
            expect(stats.total).toBe(2);
            expect(stats.solved).toBe(1);
            expect(stats.unsolved).toBe(1);
            expect(stats.progress).toBe(50);
        });

        test('should handle empty category statistics', () => {
            const stats = app.getCategoryStats('empty-category');
            
            expect(stats.total).toBe(0);
            expect(stats.solved).toBe(0);
            expect(stats.progress).toBe(0);
        });
    });

    describe('Category Navigation', () => {
        test('should switch to category view', () => {
            // Set active topic
            state.setUI({ activeTopicId: 'arrays' });
            
            // Verify UI state
            expect(state.ui.activeTopicId).toBe('arrays');
        });

        test('should filter problems by category', () => {
            // Setup problems in different categories
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            });
            state.problems.set('3', {
                id: '3',
                name: 'Reverse Linked List',
                url: 'https://leetcode.com/problems/reverse-linked-list/',
                topic: 'Linked Lists',
                pattern: 'Reverse Linked List',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });

            // Get problems for Arrays category
            const arraysProblems = app.getProblemsByCategory('arrays');
            
            // Verify filtering
            expect(arraysProblems).toHaveLength(1);
            expect(arraysProblems[0].id).toBe('1');
        });

        test('should show all problems when no category selected', () => {
            // Setup problems
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            });
            state.problems.set('3', {
                id: '3',
                name: 'Reverse Linked List',
                url: 'https://leetcode.com/problems/reverse-linked-list/',
                topic: 'Linked Lists',
                pattern: 'Reverse Linked List',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });

            // Get all problems
            const allProblems = app.getAllProblems();
            
            // Verify all problems returned
            expect(allProblems).toHaveLength(2);
        });
    });

    describe('Category Persistence', () => {
        test('should persist category data across sessions', () => {
            // Setup category data
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            });
            
            // Save to storage
            state.saveToStorage();
            
            // Verify localStorage was called
            expect(localStorage.setItem).toHaveBeenCalled();
        });

        test('should load category data from storage', () => {
            // Mock localStorage with saved data
            const savedProblems = {
                '1': {
                    id: '1',
                    name: 'Two Sum',
                    url: 'https://leetcode.com/problems/two-sum/',
                    topic: 'Arrays',
                    pattern: 'Two Sum',
                    status: 'solved',
                    reviewInterval: 1,
                    nextReviewDate: '2024-01-15',
                    note: ''
                }
            };
            
            (localStorage.getItem as jest.Mock)
                .mockReturnValueOnce(JSON.stringify(savedProblems))
                .mockReturnValueOnce('[]')
                .mockReturnValueOnce('Test User')
                .mockReturnValueOnce('local');
            
            // Load from storage
            state.loadFromStorage();
            
            // Verify loaded data
            expect(state.problems.get('1')).toBeDefined();
            expect(state.problems.get('1')?.topic).toBe('Arrays');
        });
    });

    describe('Custom Categories', () => {
        test('should handle custom problems in categories', () => {
            // Add custom problem
            state.problems.set('custom-1', {
                id: 'custom-1',
                name: 'Custom Problem',
                url: 'https://example.com/custom',
                topic: 'Custom Category',
                pattern: 'Custom Pattern',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: 'Custom note'
            });

            // Merge structure
            api.mergeStructure();

            // Verify custom category was created
            const customTopic = data.topicsData.find(t => t.id === 'custom-category');
            expect(customTopic).toBeDefined();
            expect(customTopic?.title).toBe('Custom Category');
        });

        test('should preserve custom category data during sync', async () => {
            // Add custom problem
            state.problems.set('custom-1', {
                id: 'custom-1',
                name: 'Custom Problem',
                url: 'https://example.com/custom',
                topic: 'Custom Category',
                pattern: 'Custom Pattern',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: 'Custom note'
            });

            // Merge structure to create custom category
            api.mergeStructure();

            // Verify custom category was created
            const customTopic = data.topicsData.find(t => t.title === 'Custom Category');
            expect(customTopic).toBeDefined();
            expect(customTopic?.id).toBe('custom-category');
        });
    });
});
