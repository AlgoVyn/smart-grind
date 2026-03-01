/**
 * @jest-environment jsdom
 */

import { state } from '../../src/state';
import type { Problem } from '../../src/types';

describe('End-to-End User Flows', () => {
    let localStorageMock: { [key: string]: string };
    let setItemSpy: jest.SpyInstance;
    let getItemSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        (global.indexedDB as unknown as { _clearAll: () => void })._clearAll();
        
        // Setup localStorage mock
        localStorageMock = {};
        setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
            localStorageMock[key] = value;
        });
        getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
            return localStorageMock[key] || null;
        });
        jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
            delete localStorageMock[key];
        });
        jest.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
            localStorageMock = {};
        });
        
        // Reset state
        state.problems.clear();
        state.deletedProblemIds.clear();
        state.user = {
            type: 'local',
            id: null,
            displayName: 'Local User',
        };
        state.ui = {
            activeTopicId: 'all',
            activeAlgorithmCategoryId: null,
            currentFilter: 'all',
            searchQuery: '',
            preferredAI: null,
            reviewDateFilter: null,
        };
        state.sync = {
            isOnline: true,
            isSyncing: false,
            pendingCount: 0,
            lastSyncAt: null,
            hasConflicts: false,
            conflictMessage: null,
        };
        state.hasLoadedFromStorage = false;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        setItemSpy.mockRestore();
        getItemSpy.mockRestore();
    });

    describe('Complete Problem Solving Flow', () => {
        it('should handle user discovering and solving a problem', async () => {
            // 1. Create a problem
            const problem: Problem = {
                id: 'two-sum',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum',
                status: 'unsolved',
                topic: 'Arrays',
                pattern: 'Hash Map',
                reviewInterval: 1,
                nextReviewDate: null,
                note: '',
            };
            
            // 2. Add problem to state
            state.problems.set(problem.id, problem);
            expect(state.problems.has('two-sum')).toBe(true);
            expect(state.problems.get('two-sum')?.status).toBe('unsolved');
            
            // 3. User marks problem as solved
            const updatedProblem = { ...problem, status: 'solved' as const };
            state.problems.set('two-sum', updatedProblem);
            expect(state.problems.get('two-sum')?.status).toBe('solved');
            
            // 4. User adds notes
            const problemWithNote = { ...updatedProblem, note: 'Use hash map for O(n) solution' };
            state.problems.set('two-sum', problemWithNote);
            expect(state.problems.get('two-sum')?.note).toBe('Use hash map for O(n) solution');
            
            // 5. Save to storage
            state.saveToStorage();
            expect(setItemSpy).toHaveBeenCalled();
            
            // 6. Verify state has valid data
            expect(state.hasValidData()).toBe(true);
        });
    });

    describe('User Management Flow', () => {
        it('should handle local user creation and updates', () => {
            // Initial state
            expect(state.user.type).toBe('local');
            expect(state.user.displayName).toBe('Local User');
            
            // Update user
            state.setUser({ displayName: 'John Doe' });
            expect(state.user.displayName).toBe('John Doe');
            
            // Switch to signed-in user
            state.setUser({ type: 'signed-in', id: 'user123', displayName: 'Jane Smith' });
            expect(state.user.type).toBe('signed-in');
            expect(state.user.id).toBe('user123');
            expect(state.user.displayName).toBe('Jane Smith');
        });

        it('should use correct storage keys based on user type', () => {
            // Local user keys (no prefix)
            const localKeys = state.getStorageKeys();
            expect(localKeys.problems).toBe('smartgrind-problems');
            
            // Switch to signed-in (has SIGNED_IN_ prefix)
            state.user.type = 'signed-in';
            const signedInKeys = state.getStorageKeys();
            expect(signedInKeys.problems).toBe('SIGNED_IN_smartgrind-problems');
        });
    });

    describe('Progress Tracking Flow', () => {
        beforeEach(() => {
            // Create test problems
            const problems: Problem[] = [
                { id: 'p1', name: 'Problem 1', url: '', status: 'solved', topic: 'Arrays', pattern: '', reviewInterval: 1, nextReviewDate: null, note: '' },
                { id: 'p2', name: 'Problem 2', url: '', status: 'unsolved', topic: 'Arrays', pattern: '', reviewInterval: 1, nextReviewDate: null, note: '' },
                { id: 'p3', name: 'Problem 3', url: '', status: 'solved', topic: 'Trees', pattern: '', reviewInterval: 1, nextReviewDate: null, note: '' },
                { id: 'p4', name: 'Problem 4', url: '', status: 'unsolved', topic: 'DP', pattern: '', reviewInterval: 1, nextReviewDate: null, note: '' },
            ];
            problems.forEach(p => state.problems.set(p.id, p));
        });

        it('should track solved vs unsolved problems', () => {
            const solved = [...state.problems.values()].filter(p => p.status === 'solved');
            const unsolved = [...state.problems.values()].filter(p => p.status === 'unsolved');
            
            expect(solved).toHaveLength(2);
            expect(unsolved).toHaveLength(2);
        });

        it('should group problems by topic', () => {
            const topics = new Set([...state.problems.values()].map(p => p.topic));
            expect(topics.has('Arrays')).toBe(true);
            expect(topics.has('Trees')).toBe(true);
            expect(topics.has('DP')).toBe(true);
        });

        it('should calculate completion percentage', () => {
            const total = state.problems.size;
            const solved = [...state.problems.values()].filter(p => p.status === 'solved').length;
            const percentage = (solved / total) * 100;
            
            expect(total).toBe(4);
            expect(solved).toBe(2);
            expect(percentage).toBe(50);
        });
    });

    describe('Filter and Search Flow', () => {
        beforeEach(() => {
            const problems: Problem[] = [
                { id: 'p1', name: 'Two Sum', url: '', status: 'solved', topic: 'Arrays', pattern: 'Hash Map', reviewInterval: 1, nextReviewDate: null, note: '' },
                { id: 'p2', name: 'Three Sum', url: '', status: 'unsolved', topic: 'Arrays', pattern: 'Two Pointers', reviewInterval: 1, nextReviewDate: null, note: '' },
                { id: 'p3', name: 'Binary Search', url: '', status: 'solved', topic: 'Binary Search', pattern: 'Binary Search', reviewInterval: 1, nextReviewDate: null, note: '' },
                { id: 'p4', name: 'Tree Traversal', url: '', status: 'unsolved', topic: 'Trees', pattern: 'DFS', reviewInterval: 1, nextReviewDate: null, note: '' },
            ];
            problems.forEach(p => state.problems.set(p.id, p));
        });

        it('should filter by status', () => {
            const solved = [...state.problems.values()].filter(p => p.status === 'solved');
            expect(solved).toHaveLength(2);
        });

        it('should filter by topic', () => {
            const arrays = [...state.problems.values()].filter(p => p.topic === 'Arrays');
            expect(arrays).toHaveLength(2);
        });

        it('should filter by pattern', () => {
            const hashMap = [...state.problems.values()].filter(p => p.pattern === 'Hash Map');
            expect(hashMap).toHaveLength(1);
            expect(hashMap[0].name).toBe('Two Sum');
        });

        it('should search by name', () => {
            const searchTerm = 'sum';
            const results = [...state.problems.values()].filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            expect(results).toHaveLength(2);
            expect(results.map(p => p.name)).toContain('Two Sum');
            expect(results.map(p => p.name)).toContain('Three Sum');
        });

        it('should update UI filter state', () => {
            state.setUI({ currentFilter: 'solved' });
            expect(state.ui.currentFilter).toBe('solved');
            
            state.setUI({ searchQuery: 'binary' });
            expect(state.ui.searchQuery).toBe('binary');
        });
    });

    describe('Data Persistence Flow', () => {
        it('should persist data to localStorage', () => {
            const problem: Problem = {
                id: 'persist-test',
                name: 'Persistence Test',
                url: '',
                status: 'solved',
                topic: 'Test',
                pattern: '',
                reviewInterval: 1,
                nextReviewDate: null,
                note: 'Test note',
            };
            
            state.problems.set(problem.id, problem);
            state.saveToStorage();
            
            expect(setItemSpy).toHaveBeenCalled();
        });

        it('should load data from localStorage', () => {
            // Setup mock localStorage data
            const mockProblems = {
                'loaded-problem': {
                    id: 'loaded-problem',
                    name: 'Loaded Problem',
                    url: '',
                    status: 'unsolved',
                    topic: 'Arrays',
                    pattern: '',
                    reviewInterval: 1,
                    nextReviewDate: null,
                    note: '',
                },
            };
            
            localStorageMock['smartgrind-problems'] = JSON.stringify(mockProblems);
            
            state.loadFromStorage();
            
            expect(state.problems.has('loaded-problem')).toBe(true);
            expect(state.problems.get('loaded-problem')?.name).toBe('Loaded Problem');
            expect(state.hasLoadedFromStorage).toBe(true);
        });

        it('should handle deleted problem IDs', () => {
            state.deletedProblemIds.add('deleted-1');
            state.deletedProblemIds.add('deleted-2');
            
            state.saveToStorage();
            
            expect(setItemSpy).toHaveBeenCalled();
            // Check that one of the calls was for deleted IDs
            const deletedCalls = setItemSpy.mock.calls.filter(call => 
                call[0].includes('deleted') || call[0].includes('DELETED')
            );
            expect(deletedCalls.length).toBeGreaterThan(0);
        });
    });

    describe('Sync Status Flow', () => {
        it('should track online/offline status', () => {
            expect(state.sync.isOnline).toBe(true);
            
            state.setOnlineStatus(false);
            expect(state.sync.isOnline).toBe(false);
            
            state.setOnlineStatus(true);
            expect(state.sync.isOnline).toBe(true);
        });

        it('should track sync status', () => {
            state.setSyncStatus({ isSyncing: true, pendingCount: 5 });
            expect(state.sync.isSyncing).toBe(true);
            expect(state.sync.pendingCount).toBe(5);
            
            state.setSyncStatus({ isSyncing: false, lastSyncAt: Date.now() });
            expect(state.sync.isSyncing).toBe(false);
            expect(state.sync.lastSyncAt).toBeTruthy();
        });

        it('should track sync conflicts', () => {
            state.setSyncStatus({ 
                hasConflicts: true, 
                conflictMessage: 'Data conflict detected' 
            });
            expect(state.sync.hasConflicts).toBe(true);
            expect(state.sync.conflictMessage).toBe('Data conflict detected');
        });

        it('should emit sync status change events', () => {
            const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
            
            state.setSyncStatus({ isSyncing: true });
            
            expect(dispatchEventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'sync-status-change',
                })
            );
            
            dispatchEventSpy.mockRestore();
        });
    });

    describe('Bulk Operations Flow', () => {
        beforeEach(() => {
            for (let i = 1; i <= 5; i++) {
                state.problems.set(`bulk-${i}`, {
                    id: `bulk-${i}`,
                    name: `Bulk Problem ${i}`,
                    url: '',
                    status: 'unsolved',
                    topic: 'Arrays',
                    pattern: '',
                    reviewInterval: 1,
                    nextReviewDate: null,
                    note: '',
                });
            }
        });

        it('should bulk update problem statuses', () => {
            const problemIds = ['bulk-1', 'bulk-2', 'bulk-3'];
            
            problemIds.forEach(id => {
                const problem = state.problems.get(id);
                if (problem) {
                    state.problems.set(id, { ...problem, status: 'solved' });
                }
            });
            
            expect(state.problems.get('bulk-1')?.status).toBe('solved');
            expect(state.problems.get('bulk-2')?.status).toBe('solved');
            expect(state.problems.get('bulk-3')?.status).toBe('solved');
            expect(state.problems.get('bulk-4')?.status).toBe('unsolved');
        });

        it('should bulk delete problems', () => {
            const problemIds = ['bulk-1', 'bulk-2'];
            
            problemIds.forEach(id => {
                state.problems.delete(id);
                state.deletedProblemIds.add(id);
            });
            
            expect(state.problems.has('bulk-1')).toBe(false);
            expect(state.problems.has('bulk-2')).toBe(false);
            expect(state.deletedProblemIds.has('bulk-1')).toBe(true);
            expect(state.deletedProblemIds.has('bulk-2')).toBe(true);
        });

        it('should reset all progress', () => {
            // Mark some as solved first
            ['bulk-1', 'bulk-3'].forEach(id => {
                const problem = state.problems.get(id);
                if (problem) {
                    state.problems.set(id, { ...problem, status: 'solved' });
                }
            });
            
            // Reset all
            state.problems.forEach((problem, id) => {
                state.problems.set(id, { ...problem, status: 'unsolved' });
            });
            
            // All should be unsolved
            state.problems.forEach(problem => {
                expect(problem.status).toBe('unsolved');
            });
        });
    });

    describe('Error Recovery Flow', () => {
        it('should handle corrupted localStorage gracefully', () => {
            // Mock JSON.parse to throw for a specific key
            const originalParse = JSON.parse;
            getItemSpy.mockImplementation((key: string) => {
                if (key.includes('problems')) {
                    return 'not-valid-json{{';
                }
                return localStorageMock[key] || null;
            });
            
            // Should not throw
            expect(() => state.loadFromStorage()).not.toThrow();
            
            // State should be reset
            expect(state.problems.size).toBe(0);
        });

        it('should handle storage quota errors', () => {
            setItemSpy.mockImplementation(() => {
                throw new Error('QuotaExceededError');
            });
            
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            
            // Should not throw, should log error
            state.saveToStorage();
            
            consoleSpy.mockRestore();
        });

        it('should validate data before operations', () => {
            expect(state.hasValidData()).toBe(false);
            
            state.problems.set('test', {
                id: 'test',
                name: 'Test',
                url: '',
                status: 'unsolved',
                topic: 'Test',
                pattern: '',
                reviewInterval: 1,
                nextReviewDate: null,
                note: '',
            });
            
            expect(state.hasValidData()).toBe(true);
        });
    });

    describe('UI State Flow', () => {
        it('should update active topic', () => {
            expect(state.ui.activeTopicId).toBe('all');
            
            state.setUI({ activeTopicId: 'arrays' });
            expect(state.ui.activeTopicId).toBe('arrays');
        });

        it('should update review date filter', () => {
            const date = '2024-01-01';
            state.setUI({ reviewDateFilter: date });
            expect(state.ui.reviewDateFilter).toBe(date);
        });

        it('should cache DOM elements', () => {
            document.body.innerHTML = '<div id="test-element"></div>';
            
            state.cacheElements();
            
            // Elements should be cached
            expect(state.elements).toBeDefined();
        });
    });
});
