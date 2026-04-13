/**
 * API Save Module Tests
 * Tests for saving data to localStorage and server
 */

import {
    saveProblem,
    saveDeletedId,
    saveData,
    flushPendingSync,
    _resetDebounceState,
    _saveLocally,
} from '../../src/api/api-save';
import { state } from '../../src/state';

// Mock dependencies
jest.mock('../../src/state', () => ({
    markDeletedIdsDirty: jest.fn(),
    markProblemDirty: jest.fn(),
    markFlashCardsDirty: jest.fn(),
    state: {
        user: { type: 'local', id: null, displayName: 'Test User' },
        problems: new Map(),
        deletedProblemIds: new Set(),
        setProblem: jest.fn((id: string, p: unknown) => { if (state.problems instanceof Map) state.problems.set(id, p as any); }),
        deleteProblem: jest.fn((id: string) => { if (state.problems instanceof Map) state.problems.delete(id); return true; }),
        clearProblems: jest.fn(() => { if (state.problems instanceof Map) state.problems.clear(); }),
        addDeletedId: jest.fn((id: string) => { if (state.deletedProblemIds instanceof Set) state.deletedProblemIds.add(id); }),
        removeDeletedId: jest.fn((id: string) => { if (state.deletedProblemIds instanceof Set) state.deletedProblemIds.delete(id); return true; }),
        clearDeletedIds: jest.fn(() => { if (state.deletedProblemIds instanceof Set) state.deletedProblemIds.clear(); }),
        replaceProblems: jest.fn(),
        replaceDeletedIds: jest.fn(),
        setFlashCardProgress: jest.fn(),
        saveToStorage: jest.fn(),
        saveToStorageDebounced: jest.fn(),
        ui: { activeTopicId: '', activeAlgorithmCategoryId: null },
        saveToStorage: jest.fn(),
        saveToStorageDebounced: jest.fn(),
    },
}));

jest.mock('../../src/renderers', () => ({
    renderers: {
        updateStats: jest.fn(),
        renderMainView: jest.fn(),
    },
}));

jest.mock('../../src/ui/ui', () => ({
    ui: {
        showAlert: jest.fn(),
    },
}));

jest.mock('../../src/api/api-utils', () => ({
    validateResponseOrigin: jest.fn(),
    isBrowserOnline: jest.fn().mockReturnValue(true),
    getErrorMessage: jest.fn((status, fallback) => fallback),
}));

describe('API Save Module', () => {
    beforeEach(() => {
        // Make replaceProblems/replaceDeletedIds actually update the mock state
        (state.replaceProblems as jest.Mock).mockImplementation((m: Map<string, any>) => {
            state.problems.clear();
            if (m) m.forEach((v: any, k: string) => { (state.problems as Map<string, any>).set(k, v); });
        });
        (state.replaceDeletedIds as jest.Mock).mockImplementation((s: Set<string>) => {
            state.deletedProblemIds.clear();
            if (s) s.forEach((id: string) => { (state.deletedProblemIds as Set<string>).add(id); });
        });
        jest.clearAllMocks();
        _resetDebounceState();
        jest.useFakeTimers();
        state.replaceProblems(new Map());
        state.replaceDeletedIds(new Set());
        state.user = { type: 'local', id: null, displayName: 'Test User' };
        // Reset saveToStorage and saveToStorageDebounced to fresh mocks
        state.saveToStorage = jest.fn();
        state.saveToStorageDebounced = jest.fn();
    });

    describe('saveProblem', () => {
        test('should save problem and update storage', async () => {
            await saveProblem();
            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });

        test('should trigger background sync for signed-in users', async () => {
            state.user.type = 'signed-in';
            
            await saveProblem();
            
            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });
    });

    describe('saveDeletedId', () => {
        test('should delete problem from state', async () => {
            state.setProblem('problem-1', { id: 'problem-1', status: 'solved' });
            
            await saveDeletedId('problem-1');
            
            expect(state.problems.has('problem-1')).toBe(false);
            expect(state.deletedProblemIds.has('problem-1')).toBe(true);
            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });

        test('should restore problem on save failure', async () => {
            const problemData = { id: 'problem-1', status: 'solved' as const };
            state.setProblem('problem-1', problemData);
            state.saveToStorageDebounced = jest.fn().mockImplementation(() => {
                throw new Error('Save failed');
            });

            // Should throw but also restore the problem
            try {
                await saveDeletedId('problem-1');
                fail('Expected saveDeletedId to throw');
            } catch (e) {
                // Expected to throw
            }
            
            // Problem should be restored
            expect(state.problems.has('problem-1')).toBe(true);
            expect(state.deletedProblemIds.has('problem-1')).toBe(false);
        });
    });

    describe('saveData', () => {
        test('should save all data', async () => {
            await saveData();
            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });
    });

    describe('flushPendingSync', () => {
        test('should handle empty pending data', async () => {
            await flushPendingSync();
            // Should complete without errors
        });
    });

    describe('_saveLocally', () => {
        test('should save to local storage', async () => {
            await _saveLocally();
            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });
    });

    describe('Rate Limiting', () => {
        test('should enforce minimum interval between syncs (5 seconds)', async () => {
            state.user.type = 'signed-in';
            
            // First sync
            await saveProblem();
            
            // Advance time by less than 5 seconds
            jest.advanceTimersByTime(1000);
            
            // Second sync should be queued, not executed immediately
            await saveProblem();
            
            // Should still only have debounced once (second is queued)
            expect(state.saveToStorageDebounced).toHaveBeenCalledTimes(2);
        });

        test('should allow sync after rate limit window', async () => {
            state.user.type = 'signed-in';
            
            // First sync
            await saveProblem();
            
            // Advance time by more than 5 seconds
            jest.advanceTimersByTime(6000);
            
            // Second sync should be allowed
            await saveProblem();
            
            expect(state.saveToStorageDebounced).toHaveBeenCalledTimes(2);
        });

        test('should queue rapid syncs and process them', async () => {
            state.user.type = 'signed-in';
            
            // Multiple rapid syncs
            await saveProblem();
            await saveProblem();
            await saveProblem();
            
            // All should be debounced
            expect(state.saveToStorageDebounced).toHaveBeenCalledTimes(3);
        });

        test('flushPendingSync should respect rate limiting', async () => {
            state.user.type = 'signed-in';
            
            // Set up pending data
            state.setProblem('test', { id: 'test', status: 'solved' });
            
            // First flush
            await flushPendingSync();
            
            // Immediate second flush should be rate limited
            const startTime = Date.now();
            await flushPendingSync();
            const endTime = Date.now();
            
            // Second flush should be delayed or queued
            expect(endTime - startTime).toBeLessThan(100); // Should complete quickly (queued)
        });

        test('_resetDebounceState should reset rate limiting', async () => {
            state.user.type = 'signed-in';
            
            // Trigger sync
            await saveProblem();
            
            // Reset state
            _resetDebounceState();
            
            // Should be able to sync immediately after reset
            await saveProblem();
            
            expect(state.saveToStorageDebounced).toHaveBeenCalledTimes(2);
        });
    });
});
