/**
 * Enhanced tests for State Management - covering storage error handling and cleanup
 * @module tests/state-enhanced
 */

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

import { state } from '../src/state';
import { Problem } from '../src/types';

describe('State Enhanced - Storage Management', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        
        // Reset state
        state.problems.clear();
        state.deletedProblemIds.clear();
        state.flashCardProgress.clear();
        state.user = {
            type: 'local',
            id: null,
            displayName: 'Local User',
        };
        state.ui = {
            activeTopicId: '',
            activeAlgorithmCategoryId: null,
            activeSQLCategoryId: null,
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
        state.storage = {
            lastError: null,
            lastErrorAt: null,
            quotaExceeded: false,
            autoCleanupEnabled: false,
            lastCleanupDeleted: [],
        };
        state.elements = {};
        state.hasLoadedFromStorage = false;
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    describe('freeStorageSpace', () => {
        test('should return 0 when autoCleanupEnabled is false and force is false', () => {
            const freed = state.freeStorageSpace();
            expect(freed).toBe(0);
        });

        test('should emit storage error when cleanup is disabled', () => {
            const emitSpy = jest.spyOn(state, 'emitStorageError');
            state.freeStorageSpace();
            expect(emitSpy).toHaveBeenCalledWith(
                'Storage full. Please export your data and clear some problems, or enable auto-cleanup.',
                true
            );
            emitSpy.mockRestore();
        });

        test('should cleanup deleted problem IDs when autoCleanupEnabled is true', () => {
            state.storage.autoCleanupEnabled = true;
            
            // Add 150 deleted IDs (more than 100 threshold)
            for (let i = 0; i < 150; i++) {
                state.deletedProblemIds.add(`problem-${i}`);
            }
            
            const freed = state.freeStorageSpace();
            
            // Should remove 100 items (150 - 50 kept = 100 removed)
            expect(freed).toBe(100);
            expect(state.deletedProblemIds.size).toBe(50);
        });

        test('should not cleanup deleted IDs when count is below threshold', () => {
            state.storage.autoCleanupEnabled = true;
            
            // Add only 50 deleted IDs (below 100 threshold)
            for (let i = 0; i < 50; i++) {
                state.deletedProblemIds.add(`problem-${i}`);
            }
            
            // Add 60 solved problems without notes
            for (let i = 0; i < 60; i++) {
                const problem: Problem = {
                    id: `solved-${i}`,
                    status: 'solved',
                    nextReviewDate: '2023-01-01', // Old review date
                    note: undefined,
                    loading: false,
                    noteVisible: false,
                };
                state.problems.set(problem.id, problem);
            }
            
            const freed = state.freeStorageSpace();
            
            // Should remove 20% of problems (60 * 0.2 = 12)
            expect(freed).toBe(12);
        });

        test('should only remove solved problems without notes', () => {
            state.storage.autoCleanupEnabled = true;
            
            // Add 60 solved problems without notes
            for (let i = 0; i < 60; i++) {
                const problem: Problem = {
                    id: `solved-no-note-${i}`,
                    status: 'solved',
                    nextReviewDate: '2023-01-01',
                    loading: false,
                    noteVisible: false,
                };
                state.problems.set(problem.id, problem);
            }
            
            // Add 10 solved problems with notes (should not be removed)
            for (let i = 0; i < 10; i++) {
                const problem: Problem = {
                    id: `solved-with-note-${i}`,
                    status: 'solved',
                    nextReviewDate: '2023-01-01',
                    note: 'This is a note',
                    loading: false,
                    noteVisible: false,
                };
                state.problems.set(problem.id, problem);
            }
            
            // Add 10 unsolved problems (should not be removed)
            for (let i = 0; i < 10; i++) {
                const problem: Problem = {
                    id: `unsolved-${i}`,
                    status: 'unsolved',
                    nextReviewDate: '2023-01-01',
                    loading: false,
                    noteVisible: false,
                };
                state.problems.set(problem.id, problem);
            }
            
            const freed = state.freeStorageSpace();
            
            // Should only remove solved problems without notes
            expect(freed).toBe(16); // 20% of 80 total
            expect(state.problems.has('solved-with-note-0')).toBe(true);
            expect(state.problems.has('unsolved-0')).toBe(true);
        });

        test('should emit storage-cleanup event when items are freed', () => {
            state.storage.autoCleanupEnabled = true;
            
            for (let i = 0; i < 150; i++) {
                state.deletedProblemIds.add(`problem-${i}`);
            }
            
            const eventListener = jest.fn();
            window.addEventListener('storage-cleanup', eventListener);
            
            state.freeStorageSpace();
            
            expect(eventListener).toHaveBeenCalled();
            const eventDetail = eventListener.mock.calls[0][0].detail;
            expect(eventDetail.freedCount).toBe(100);
            expect(eventDetail.deletedItems).toHaveLength(100);
            
            window.removeEventListener('storage-cleanup', eventListener);
        });

        test('should save to storage in silent mode after cleanup', () => {
            state.storage.autoCleanupEnabled = true;
            
            for (let i = 0; i < 150; i++) {
                state.deletedProblemIds.add(`problem-${i}`);
            }
            
            const saveSpy = jest.spyOn(state, 'saveToStorage');
            state.freeStorageSpace();
            
            expect(saveSpy).toHaveBeenCalledWith({ silent: true });
            saveSpy.mockRestore();
        });

        test('should work with force=true even when autoCleanupEnabled is false', () => {
            state.storage.autoCleanupEnabled = false;
            
            for (let i = 0; i < 150; i++) {
                state.deletedProblemIds.add(`problem-${i}`);
            }
            
            const freed = state.freeStorageSpace(true); // force=true
            
            expect(freed).toBe(100);
        });

        test('should track lastCleanupDeleted items', () => {
            state.storage.autoCleanupEnabled = true;
            
            for (let i = 0; i < 150; i++) {
                state.deletedProblemIds.add(`problem-${i}`);
            }
            
            state.freeStorageSpace();
            
            expect(state.storage.lastCleanupDeleted).toHaveLength(100);
            expect(state.storage.lastCleanupDeleted[0]).toHaveProperty('id');
            expect(state.storage.lastCleanupDeleted[0]).toHaveProperty('timestamp');
        });
    });

    describe('recoverCleanedUpProblems', () => {
        test('should recover problems from lastCleanupDeleted', () => {
            const problem: Problem = {
                id: 'recovered-problem',
                status: 'solved',
                nextReviewDate: '2023-12-31',
                loading: false,
                noteVisible: false,
            };
            
            state.storage.lastCleanupDeleted = [
                { id: 'recovered-problem', problem, timestamp: Date.now() },
            ];
            
            const recovered = state.recoverCleanedUpProblems();
            
            expect(recovered).toBe(1);
            expect(state.problems.has('recovered-problem')).toBe(true);
        });

        test('should not recover if problem already exists', () => {
            const problem: Problem = {
                id: 'existing-problem',
                status: 'solved',
                nextReviewDate: '2023-12-31',
                loading: false,
                noteVisible: false,
            };
            
            state.problems.set('existing-problem', problem);
            state.storage.lastCleanupDeleted = [
                { id: 'existing-problem', problem: { ...problem }, timestamp: Date.now() },
            ];
            
            const recovered = state.recoverCleanedUpProblems();
            
            expect(recovered).toBe(0);
        });

        test('should not recover if problem data is missing', () => {
            state.storage.lastCleanupDeleted = [
                { id: 'no-data-problem', timestamp: Date.now() },
            ];
            
            const recovered = state.recoverCleanedUpProblems();
            
            expect(recovered).toBe(0);
        });

        test('should clear lastCleanupDeleted after recovery', () => {
            const problem: Problem = {
                id: 'recovered-problem',
                status: 'solved',
                nextReviewDate: '2023-12-31',
                loading: false,
                noteVisible: false,
            };
            
            state.storage.lastCleanupDeleted = [
                { id: 'recovered-problem', problem, timestamp: Date.now() },
            ];
            
            state.recoverCleanedUpProblems();
            
            expect(state.storage.lastCleanupDeleted).toEqual([]);
        });

        test('should save to storage after recovery', () => {
            const problem: Problem = {
                id: 'recovered-problem',
                status: 'solved',
                nextReviewDate: '2023-12-31',
                loading: false,
                noteVisible: false,
            };
            
            state.storage.lastCleanupDeleted = [
                { id: 'recovered-problem', problem, timestamp: Date.now() },
            ];
            
            const saveSpy = jest.spyOn(state, 'saveToStorage');
            state.recoverCleanedUpProblems();
            
            expect(saveSpy).toHaveBeenCalled();
            saveSpy.mockRestore();
        });

        test('should return 0 when lastCleanupDeleted is empty', () => {
            state.storage.lastCleanupDeleted = [];
            
            const recovered = state.recoverCleanedUpProblems();
            
            expect(recovered).toBe(0);
        });
    });

    describe('saveToStorageDebounced', () => {
        test('should debounce saveToStorage calls', () => {
            const saveSpy = jest.spyOn(state, 'saveToStorage').mockImplementation(() => {});
            
            // Multiple rapid calls
            state.saveToStorageDebounced();
            state.saveToStorageDebounced();
            state.saveToStorageDebounced();
            
            // Should not have been called yet
            expect(saveSpy).not.toHaveBeenCalled();
            
            // Advance timers
            jest.advanceTimersByTime(300);
            
            // Should have been called exactly once
            expect(saveSpy).toHaveBeenCalledTimes(1);
            
            saveSpy.mockRestore();
        });

        test('should reset debounce timer on subsequent calls', () => {
            const saveSpy = jest.spyOn(state, 'saveToStorage').mockImplementation(() => {});
            
            state.saveToStorageDebounced();
            jest.advanceTimersByTime(100);
            
            // Another call resets the timer
            state.saveToStorageDebounced();
            jest.advanceTimersByTime(200);
            
            // Should not have been called yet (timer was reset)
            expect(saveSpy).not.toHaveBeenCalled();
            
            // Advance remaining time
            jest.advanceTimersByTime(100);
            expect(saveSpy).toHaveBeenCalledTimes(1);
            
            saveSpy.mockRestore();
        });
    });

    describe('emitStorageError', () => {
        test('should dispatch storage-error event', () => {
            const eventListener = jest.fn();
            window.addEventListener('storage-error', eventListener);
            
            state.emitStorageError('Test error message', true);
            
            expect(eventListener).toHaveBeenCalled();
            const eventDetail = eventListener.mock.calls[0][0].detail;
            expect(eventDetail.message).toBe('Test error message');
            expect(eventDetail.isQuotaError).toBe(true);
            expect(eventDetail.timestamp).toBeDefined();
            
            window.removeEventListener('storage-error', eventListener);
        });

        test('should return early if window is undefined', () => {
            // Mock window as undefined
            const originalWindow = global.window;
            // @ts-ignore
            global.window = undefined;
            
            // Should not throw
            expect(() => {
                // Access state.emitStorageError through a wrapper
                state.emitStorageError('Test', false);
            }).not.toThrow();
            
            global.window = originalWindow;
        });
    });

    describe('hasValidData', () => {
        test('should return false when no data exists', () => {
            state.problems.clear();
            state.deletedProblemIds.clear();
            
            expect(state.hasValidData()).toBe(false);
        });

        test('should return true when problems exist', () => {
            state.problems.set('test-problem', {
                id: 'test-problem',
                status: 'unsolved',
                loading: false,
                noteVisible: false,
            });
            
            expect(state.hasValidData()).toBe(true);
        });

        test('should return true when deleted problem IDs exist', () => {
            state.problems.clear();
            state.deletedProblemIds.add('deleted-problem');
            
            expect(state.hasValidData()).toBe(true);
        });
    });

    describe('getSolvedSQLCount', () => {
        test('should return 0 when no SQL problems are solved', () => {
            state.problems.set('regular-problem', {
                id: 'regular-problem',
                status: 'solved',
                loading: false,
                noteVisible: false,
            });
            
            expect(state.getSolvedSQLCount()).toBe(0);
        });

        test('should count only solved SQL problems', () => {
            state.problems.set('sql-1', {
                id: 'sql-1',
                status: 'solved',
                loading: false,
                noteVisible: false,
            });
            state.problems.set('sql-2', {
                id: 'sql-2',
                status: 'solved',
                loading: false,
                noteVisible: false,
            });
            state.problems.set('sql-3', {
                id: 'sql-3',
                status: 'unsolved',
                loading: false,
                noteVisible: false,
            });
            state.problems.set('regular', {
                id: 'regular',
                status: 'solved',
                loading: false,
                noteVisible: false,
            });
            
            expect(state.getSolvedSQLCount()).toBe(2);
        });

        test('should return 0 when problems map is empty', () => {
            state.problems.clear();
            expect(state.getSolvedSQLCount()).toBe(0);
        });
    });

    describe('Sync Status Management', () => {
        test('getSyncStatus should return copy of sync state', () => {
            state.sync.isOnline = false;
            state.sync.isSyncing = true;
            state.sync.pendingCount = 5;
            
            const status = state.getSyncStatus();
            
            expect(status.isOnline).toBe(false);
            expect(status.isSyncing).toBe(true);
            expect(status.pendingCount).toBe(5);
        });

        test('getSyncStatus should return independent copy', () => {
            const status = state.getSyncStatus();
            status.isOnline = !state.sync.isOnline;
            
            expect(state.sync.isOnline).not.toBe(status.isOnline);
        });

        test('setSyncStatus should update sync state', () => {
            state.setSyncStatus({ isSyncing: true, pendingCount: 10 });
            
            expect(state.sync.isSyncing).toBe(true);
            expect(state.sync.pendingCount).toBe(10);
        });

        test('setSyncStatus should emit sync-status-change event', () => {
            const eventListener = jest.fn();
            window.addEventListener('sync-status-change', eventListener);
            
            state.setSyncStatus({ isSyncing: true });
            
            expect(eventListener).toHaveBeenCalled();
            window.removeEventListener('sync-status-change', eventListener);
        });

        test('setOnlineStatus should update isOnline', () => {
            state.setOnlineStatus(false);
            expect(state.sync.isOnline).toBe(false);
            
            state.setOnlineStatus(true);
            expect(state.sync.isOnline).toBe(true);
        });

        test('setOnlineStatus should emit sync-status-change event', () => {
            const eventListener = jest.fn();
            window.addEventListener('sync-status-change', eventListener);
            
            state.setOnlineStatus(false);
            
            expect(eventListener).toHaveBeenCalled();
            window.removeEventListener('sync-status-change', eventListener);
        });
    });
});
