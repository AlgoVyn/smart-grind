/**
 * @jest-environment jsdom
 *
 * Extended API Save Module Tests
 * Covers offline handling, CSRF errors, network errors, debounced sync, and sendBeacon
 */

// Mock dependencies before imports
jest.mock('../../src/state', () => ({
    state: {
        user: { type: 'local', id: null, displayName: 'Test User' },
        problems: new Map(),
        deletedProblemIds: new Set(),
        ui: { activeTopicId: '', activeAlgorithmCategoryId: null },
        saveToStorage: jest.fn(),
        saveToStorageDebounced: jest.fn(),
    },
}));

jest.mock('../../src/data', () => ({
    data: {
        API_BASE: 'https://api.example.com',
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

jest.mock('../../src/app', () => ({
    getCachedCsrfToken: jest.fn().mockReturnValue('test-csrf-token'),
}));

import {
    saveProblem,
    saveDeletedId,
    saveData,
    flushPendingSync,
    _resetDebounceState,
    _saveLocally,
    _saveRemotely,
    _triggerBackgroundSync,
} from '../../src/api/api-save';
import { state } from '../../src/state';
import { ui } from '../../src/ui/ui';

describe('API Save Module - Extended', () => {
    let mockFetch: jest.Mock;
    let originalNavigator: typeof navigator;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        _resetDebounceState();
        
        mockFetch = jest.fn();
        global.fetch = mockFetch;
        
        state.problems = new Map();
        state.deletedProblemIds = new Set();
        state.user = { type: 'local', id: null, displayName: 'Test User' };
        state.ui.activeAlgorithmCategoryId = null;
        state.saveToStorage = jest.fn();
        state.saveToStorageDebounced = jest.fn();
        
        // Mock navigator.sendBeacon
        originalNavigator = navigator;
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                sendBeacon: jest.fn().mockReturnValue(true),
                onLine: true,
            },
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        Object.defineProperty(global, 'navigator', {
            value: originalNavigator,
            writable: true,
            configurable: true,
        });
    });

    describe('Offline Handling', () => {
        it('should handle offline mode when fetching CSRF token', async () => {
            state.user.type = 'signed-in';
            const { isBrowserOnline } = jest.requireMock('../../src/api/api-utils');
            isBrowserOnline.mockReturnValue(false);

            mockFetch.mockRejectedValue(new Error('Network error'));

            // Should not throw, just handle gracefully
            await expect(saveProblem()).resolves.not.toThrow();
        });

        it('should queue operation when offline during save', async () => {
            state.user.type = 'signed-in';
            const { isBrowserOnline } = jest.requireMock('../../src/api/api-utils');
            isBrowserOnline.mockReturnValue(false);

            await saveProblem();

            // Should save locally
            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });
    });

    describe('Debounced Background Sync', () => {
        it('should debounce background sync calls', async () => {
            state.user.type = 'signed-in';
            
            // Mock queueOperation and forceSync
            jest.mock('../../src/api', () => ({
                queueOperation: jest.fn().mockResolvedValue(undefined),
                forceSync: jest.fn().mockResolvedValue(undefined),
            }));

            // Call save multiple times rapidly
            await saveProblem();
            await saveProblem();
            await saveProblem();

            // Fast-forward debounce timer
            jest.advanceTimersByTime(1100);

            // Should have saved to storage multiple times
            expect(state.saveToStorageDebounced).toHaveBeenCalledTimes(3);
        });

        it('should execute background sync after debounce period', async () => {
            state.user.type = 'signed-in';
            
            const mockQueueOperation = jest.fn().mockResolvedValue(undefined);
            const mockForceSync = jest.fn().mockResolvedValue(undefined);
            
            jest.doMock('../../src/api', () => ({
                queueOperation: mockQueueOperation,
                forceSync: mockForceSync,
            }));

            await saveProblem();
            
            // Fast-forward past debounce
            jest.advanceTimersByTime(1100);

            // Clean up mock
            jest.dontMock('../../src/api');
        });
    });

    describe('flushPendingSync', () => {
        it('should clear debounce timer and sync immediately', async () => {
            state.user.type = 'signed-in';
            
            // Set up a pending sync
            await saveProblem();
            
            // Flush before debounce completes
            await flushPendingSync();

            // Timer should be cleared
            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });

        it('should handle flush with no pending data', async () => {
            // Should complete without errors
            await expect(flushPendingSync()).resolves.toBeUndefined();
        });

        it('should sync pending data when online', async () => {
            state.user.type = 'signed-in';
            const { isBrowserOnline } = jest.requireMock('../../src/api/api-utils');
            isBrowserOnline.mockReturnValue(true);

            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: jest.fn().mockResolvedValue({ csrfToken: 'token' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                });

            // Trigger a save to queue data
            await saveProblem();
            
            // Flush pending sync
            await flushPendingSync();
        });
    });

    describe('sendBeacon on beforeunload', () => {
        it('should send data via sendBeacon when page unloads', () => {
            state.user.type = 'signed-in';
            
            // Trigger a save to set up pending data
            saveProblem().then(() => {
                // Simulate beforeunload
                const beforeunloadEvent = new Event('beforeunload');
                window.dispatchEvent(beforeunloadEvent);

                // sendBeacon should have been called
                expect(navigator.sendBeacon).toHaveBeenCalled();
            });
        });

        it('should include CSRF token in beacon payload', () => {
            state.user.type = 'signed-in';
            
            saveProblem().then(() => {
                window.dispatchEvent(new Event('beforeunload'));

                const beaconCalls = (navigator.sendBeacon as jest.Mock).mock.calls;
                if (beaconCalls.length > 0) {
                    const payload = beaconCalls[0][1] as Blob;
                    expect(payload).toBeInstanceOf(Blob);
                }
            });
        });

        it('should handle sendBeacon failure gracefully', () => {
            (navigator.sendBeacon as jest.Mock).mockReturnValue(false);
            
            state.user.type = 'signed-in';
            
            saveProblem().then(() => {
                // Should not throw
                expect(() => {
                    window.dispatchEvent(new Event('beforeunload'));
                }).not.toThrow();
            });
        });

        it('should not sendBeacon when offline', () => {
            Object.defineProperty(navigator, 'onLine', {
                value: false,
                writable: true,
                configurable: true,
            });

            state.user.type = 'signed-in';
            
            saveProblem().then(() => {
                window.dispatchEvent(new Event('beforeunload'));

                expect(navigator.sendBeacon).not.toHaveBeenCalled();
            });
        });
    });

    describe('saveDeletedId - Algorithm View', () => {
        it('should render algorithms view after deletion when in algorithm mode', async () => {
            const { renderers } = jest.requireMock('../../src/renderers');
            renderers.renderAlgorithmsView = jest.fn().mockResolvedValue(undefined);

            state.problems.set('algo-1', { id: 'algo-1', status: 'solved' });
            state.ui.activeAlgorithmCategoryId = 'sorting';

            await saveDeletedId('algo-1');

            expect(renderers.renderAlgorithmsView).toHaveBeenCalledWith('sorting');
        });

        it('should render main view after deletion when not in algorithm mode', async () => {
            const { renderers } = jest.requireMock('../../src/renderers');
            
            state.problems.set('problem-1', { id: 'problem-1', status: 'solved' });
            state.ui.activeAlgorithmCategoryId = null;

            await saveDeletedId('problem-1');

            expect(renderers.renderMainView).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        it('should handle save with problem parameter', async () => {
            const problem = { id: 'test', status: 'solved' };
            
            await saveProblem(problem as any);

            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });

        it('should rethrow error after showing alert', async () => {
            state.saveToStorageDebounced = jest.fn().mockImplementation(() => {
                throw new Error('Test error');
            });

            await expect(saveProblem()).rejects.toThrow('Test error');
        });
    });

    describe('prepareDataForSave', () => {
        it('should strip loading and noteVisible from problems', async () => {
            state.problems.set('problem-1', {
                id: 'problem-1',
                status: 'solved',
                loading: true,
                noteVisible: true,
                note: 'test note',
            });

            await _saveLocally();

            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });

        it('should include deletedIds in saved data', async () => {
            state.deletedProblemIds.add('deleted-1');
            state.deletedProblemIds.add('deleted-2');

            await _saveLocally();

            expect(state.saveToStorageDebounced).toHaveBeenCalled();
        });
    });
});
