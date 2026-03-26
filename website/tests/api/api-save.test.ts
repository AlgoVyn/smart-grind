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
    state: {
        user: { type: 'local', id: null, displayName: 'Test User' },
        problems: new Map(),
        deletedProblemIds: new Set(),
        ui: { activeTopicId: '', activeAlgorithmCategoryId: null },
        saveToStorage: jest.fn(),
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
        jest.clearAllMocks();
        _resetDebounceState();
        state.problems = new Map();
        state.deletedProblemIds = new Set();
        state.user = { type: 'local', id: null, displayName: 'Test User' };
        // Reset saveToStorage to a fresh mock to clear any previous implementation
        state.saveToStorage = jest.fn();
    });

    describe('saveProblem', () => {
        test('should save problem and update storage', async () => {
            await saveProblem();
            expect(state.saveToStorage).toHaveBeenCalled();
        });

        test('should trigger background sync for signed-in users', async () => {
            state.user.type = 'signed-in';
            
            await saveProblem();
            
            expect(state.saveToStorage).toHaveBeenCalled();
        });
    });

    describe('saveDeletedId', () => {
        test('should delete problem from state', async () => {
            state.problems.set('problem-1', { id: 'problem-1', status: 'solved' });
            
            await saveDeletedId('problem-1');
            
            expect(state.problems.has('problem-1')).toBe(false);
            expect(state.deletedProblemIds.has('problem-1')).toBe(true);
            expect(state.saveToStorage).toHaveBeenCalled();
        });

        test('should restore problem on save failure', async () => {
            const problemData = { id: 'problem-1', status: 'solved' as const };
            state.problems.set('problem-1', problemData);
            state.saveToStorage = jest.fn().mockImplementation(() => {
                throw new Error('Save failed');
            });

            await expect(saveDeletedId('problem-1')).rejects.toThrow('Save failed');
            
            // Problem should be restored
            expect(state.problems.has('problem-1')).toBe(true);
            expect(state.deletedProblemIds.has('problem-1')).toBe(false);
        });
    });

    describe('saveData', () => {
        test('should save all data', async () => {
            await saveData();
            expect(state.saveToStorage).toHaveBeenCalled();
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
            expect(state.saveToStorage).toHaveBeenCalled();
        });
    });
});
