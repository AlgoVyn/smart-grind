// --- STATE SYNC TESTS ---
// Unit tests for Phase 3: Sync state tracking and offline indicators

import { state } from '../src/state';

describe('State Sync Module', () => {
    beforeEach(() => {
        // Reset sync state
        state.sync = {
            isOnline: true,
            isSyncing: false,
            pendingCount: 0,
            lastSyncAt: null,
            hasConflicts: false,
            conflictMessage: null,
        };

        // Clear any event listeners
        jest.clearAllMocks();
    });

    describe('sync state properties', () => {
        test('should have default sync state values', () => {
            expect(state.sync.isOnline).toBe(true);
            expect(state.sync.isSyncing).toBe(false);
            expect(state.sync.pendingCount).toBe(0);
            expect(state.sync.lastSyncAt).toBeNull();
            expect(state.sync.hasConflicts).toBe(false);
            expect(state.sync.conflictMessage).toBeNull();
        });
    });

    describe('setSyncStatus', () => {
        test('should update sync status properties', () => {
            state.setSyncStatus({
                pendingCount: 5,
                isSyncing: true,
                lastSyncAt: Date.now(),
            });

            expect(state.sync.pendingCount).toBe(5);
            expect(state.sync.isSyncing).toBe(true);
            expect(state.sync.lastSyncAt).not.toBeNull();
        });

        test('should update conflict status', () => {
            state.setSyncStatus({
                hasConflicts: true,
                conflictMessage: 'Manual resolution required',
            });

            expect(state.sync.hasConflicts).toBe(true);
            expect(state.sync.conflictMessage).toBe('Manual resolution required');
        });

        test('should emit sync-status-change event', () => {
            const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

            state.setSyncStatus({ pendingCount: 3 });

            expect(dispatchEventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'sync-status-change',
                    detail: expect.objectContaining({
                        pendingCount: 3,
                    }),
                })
            );
        });

        test('should handle partial updates', () => {
            state.sync.isOnline = false;
            state.sync.pendingCount = 10;

            state.setSyncStatus({ isSyncing: true });

            expect(state.sync.isOnline).toBe(false); // Unchanged
            expect(state.sync.pendingCount).toBe(10); // Unchanged
            expect(state.sync.isSyncing).toBe(true); // Updated
        });
    });

    describe('setOnlineStatus', () => {
        test('should set online status to true', () => {
            state.sync.isOnline = false;

            state.setOnlineStatus(true);

            expect(state.sync.isOnline).toBe(true);
        });

        test('should set online status to false', () => {
            state.sync.isOnline = true;

            state.setOnlineStatus(false);

            expect(state.sync.isOnline).toBe(false);
        });

        test('should emit sync-status-change event', () => {
            const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

            state.setOnlineStatus(false);

            expect(dispatchEventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'sync-status-change',
                    detail: expect.objectContaining({
                        isOnline: false,
                    }),
                })
            );
        });
    });

    describe('emitSyncStatusChange', () => {
        test('should dispatch custom event with sync state', () => {
            const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
            state.sync.isOnline = false;
            state.sync.pendingCount = 7;

            state.emitSyncStatusChange();

            expect(dispatchEventSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'sync-status-change',
                    detail: {
                        isOnline: false,
                        isSyncing: false,
                        pendingCount: 7,
                        lastSyncAt: null,
                        hasConflicts: false,
                        conflictMessage: null,
                    },
                })
            );
        });

        test('should not throw when window is undefined', () => {
            // Temporarily remove window
            const originalWindow = global.window;
            // @ts-expect-error - Testing undefined window scenario
            global.window = undefined;

            expect(() => state.emitSyncStatusChange()).not.toThrow();

            // Restore window
            global.window = originalWindow;
        });
    });

    describe('isOnline', () => {
        test('should return true when online', () => {
            state.sync.isOnline = true;
            expect(state.isOnline()).toBe(true);
        });

        test('should return false when offline', () => {
            state.sync.isOnline = false;
            expect(state.isOnline()).toBe(false);
        });
    });

    describe('isSyncing', () => {
        test('should return true when syncing', () => {
            state.sync.isSyncing = true;
            expect(state.isSyncing()).toBe(true);
        });

        test('should return false when not syncing', () => {
            state.sync.isSyncing = false;
            expect(state.isSyncing()).toBe(false);
        });
    });

    describe('getPendingCount', () => {
        test('should return current pending count', () => {
            state.sync.pendingCount = 15;
            expect(state.getPendingCount()).toBe(15);
        });

        test('should return 0 when no pending operations', () => {
            state.sync.pendingCount = 0;
            expect(state.getPendingCount()).toBe(0);
        });
    });

    describe('hasSyncConflicts', () => {
        test('should return true when conflicts exist', () => {
            state.sync.hasConflicts = true;
            expect(state.hasSyncConflicts()).toBe(true);
        });

        test('should return false when no conflicts', () => {
            state.sync.hasConflicts = false;
            expect(state.hasSyncConflicts()).toBe(false);
        });
    });

    describe('getSyncStatus', () => {
        test('should return complete sync status object', () => {
            state.sync = {
                isOnline: false,
                isSyncing: true,
                pendingCount: 8,
                lastSyncAt: 1234567890,
                hasConflicts: true,
                conflictMessage: 'Test conflict',
            };

            const status = state.getSyncStatus();

            expect(status).toEqual({
                isOnline: false,
                isSyncing: true,
                pendingCount: 8,
                lastSyncAt: 1234567890,
                hasConflicts: true,
                conflictMessage: 'Test conflict',
            });
        });

        test('should return a copy, not reference', () => {
            state.sync.pendingCount = 5;

            const status = state.getSyncStatus();
            status.pendingCount = 10;

            expect(state.sync.pendingCount).toBe(5); // Original unchanged
        });
    });

    describe('integration with existing state', () => {
        test('should maintain sync state independently of user state', () => {
            state.user = { type: 'signed-in', id: '123', displayName: 'Test' };
            state.sync.isOnline = false;

            expect(state.user.type).toBe('signed-in');
            expect(state.sync.isOnline).toBe(false);
        });

        test('should maintain sync state independently of UI state', () => {
            state.ui = {
                activeTopicId: 'arrays',
                currentFilter: 'solved',
                searchQuery: 'test',
                preferredAI: 'chatgpt',
                reviewDateFilter: 'today',
            };
            state.sync.pendingCount = 12;

            expect(state.ui.activeTopicId).toBe('arrays');
            expect(state.sync.pendingCount).toBe(12);
        });

        test('should maintain sync state independently of problems', () => {
            state.problems = new Map([
                [
                    '1',
                    {
                        id: '1',
                        name: 'Test',
                        url: 'https://example.com',
                        status: 'unsolved',
                        topic: 'Test Topic',
                        pattern: 'Test Pattern',
                        reviewInterval: 0,
                        nextReviewDate: null,
                        note: '',
                    },
                ],
            ]);
            state.sync.isSyncing = true;

            expect(state.problems.has('1')).toBe(true);
            expect(state.sync.isSyncing).toBe(true);
        });
    });
});
