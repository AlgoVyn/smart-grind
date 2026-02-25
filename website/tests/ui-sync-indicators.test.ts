// --- UI SYNC INDICATORS TESTS ---
// Unit tests for Phase 5: Offline status and sync pending indicators

import { syncIndicators } from '../src/ui/ui-sync-indicators';
import { state } from '../src/state';

// Mock DOM elements
const createMockElements = () => ({
    container: document.createElement('div'),
    offlineIndicator: document.createElement('div'),
    syncingIndicator: document.createElement('div'),
    pendingIndicator: document.createElement('div'),
    pendingCount: document.createElement('span'),
    conflictIndicator: document.createElement('div'),
});

describe('UI Sync Indicators Module', () => {
    let mockElements: ReturnType<typeof createMockElements>;

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

        // Create mock elements
        mockElements = createMockElements();

        // Set up DOM mock
        jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
            switch (id) {
                case 'sync-status-container':
                    return mockElements.container;
                case 'offline-indicator':
                    return mockElements.offlineIndicator;
                case 'syncing-indicator':
                    return mockElements.syncingIndicator;
                case 'pending-indicator':
                    return mockElements.pendingIndicator;
                case 'pending-count':
                    return mockElements.pendingCount;
                case 'conflict-indicator':
                    return mockElements.conflictIndicator;
                default:
                    return null;
            }
        });

        // Reset element classes
        mockElements.offlineIndicator.className = 'hidden';
        mockElements.syncingIndicator.className = 'hidden';
        mockElements.pendingIndicator.className = 'hidden';
        mockElements.conflictIndicator.className = 'hidden';
        mockElements.pendingCount.textContent = '0 pending';
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('updateOfflineIndicator', () => {
        test('should show indicator when offline', () => {
            syncIndicators.updateOfflineIndicator(false);
            expect(mockElements.offlineIndicator.classList.contains('hidden')).toBe(false);
        });

        test('should hide indicator when online', () => {
            mockElements.offlineIndicator.classList.remove('hidden');
            syncIndicators.updateOfflineIndicator(true);
            expect(mockElements.offlineIndicator.classList.contains('hidden')).toBe(true);
        });

        test('should handle null element gracefully', () => {
            jest.spyOn(document, 'getElementById').mockReturnValue(null);
            expect(() => syncIndicators.updateOfflineIndicator(false)).not.toThrow();
        });
    });

    describe('updateSyncingIndicator', () => {
        test('should show indicator when syncing', () => {
            syncIndicators.updateSyncingIndicator(true);
            expect(mockElements.syncingIndicator.classList.contains('hidden')).toBe(false);
        });

        test('should hide indicator when not syncing', () => {
            mockElements.syncingIndicator.classList.remove('hidden');
            syncIndicators.updateSyncingIndicator(false);
            expect(mockElements.syncingIndicator.classList.contains('hidden')).toBe(true);
        });

        test('should handle null element gracefully', () => {
            jest.spyOn(document, 'getElementById').mockReturnValue(null);
            expect(() => syncIndicators.updateSyncingIndicator(true)).not.toThrow();
        });
    });

    describe('updatePendingIndicator', () => {
        test('should show indicator with count when pending and online', () => {
            mockElements.pendingCount.textContent = '';
            syncIndicators.updatePendingIndicator(5, true);
            expect(mockElements.pendingIndicator.classList.contains('hidden')).toBe(false);
            expect(mockElements.pendingCount.textContent).toBe('5 pending');
        });

        test('should hide indicator when no pending operations', () => {
            mockElements.pendingIndicator.classList.remove('hidden');
            syncIndicators.updatePendingIndicator(0, true);
            expect(mockElements.pendingIndicator.classList.contains('hidden')).toBe(true);
        });

        test('should show indicator when offline with pending count', () => {
            mockElements.pendingIndicator.classList.add('hidden');
            syncIndicators.updatePendingIndicator(5, false);
            expect(mockElements.pendingIndicator.classList.contains('hidden')).toBe(false);
            expect(mockElements.pendingCount.textContent).toBe('5 pending');
        });

        test('should handle null element gracefully', () => {
            jest.spyOn(document, 'getElementById').mockReturnValue(null);
            expect(() => syncIndicators.updatePendingIndicator(3, true)).not.toThrow();
        });
    });

    describe('updateConflictIndicator', () => {
        test('should show indicator when conflicts exist', () => {
            syncIndicators.updateConflictIndicator(true);
            expect(mockElements.conflictIndicator.classList.contains('hidden')).toBe(false);
        });

        test('should hide indicator when no conflicts', () => {
            mockElements.conflictIndicator.classList.remove('hidden');
            syncIndicators.updateConflictIndicator(false);
            expect(mockElements.conflictIndicator.classList.contains('hidden')).toBe(true);
        });

        test('should handle null element gracefully', () => {
            jest.spyOn(document, 'getElementById').mockReturnValue(null);
            expect(() => syncIndicators.updateConflictIndicator(true)).not.toThrow();
        });
    });

    describe('initSyncIndicators', () => {
        test('should initialize without errors', () => {
            // Mock navigator.onLine
            Object.defineProperty(global, 'navigator', {
                value: { onLine: true },
                configurable: true,
            });

            // Spy on window.addEventListener
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

            expect(() => syncIndicators.init()).not.toThrow();

            addEventListenerSpy.mockRestore();
        });

        test('should set initial online status from navigator', () => {
            Object.defineProperty(global, 'navigator', {
                value: { onLine: false },
                configurable: true,
            });

            // Spy on window.addEventListener
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

            syncIndicators.init();

            expect(state.sync.isOnline).toBe(false);

            addEventListenerSpy.mockRestore();
        });
    });
});

describe('Sync Indicators Integration', () => {
    let mockElements: ReturnType<typeof createMockElements>;

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

        // Create mock elements
        mockElements = createMockElements();

        // Set up DOM mock
        jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
            switch (id) {
                case 'sync-status-container':
                    return mockElements.container;
                case 'offline-indicator':
                    return mockElements.offlineIndicator;
                case 'syncing-indicator':
                    return mockElements.syncingIndicator;
                case 'pending-indicator':
                    return mockElements.pendingIndicator;
                case 'pending-count':
                    return mockElements.pendingCount;
                case 'conflict-indicator':
                    return mockElements.conflictIndicator;
                default:
                    return null;
            }
        });

        // Reset element classes
        mockElements.offlineIndicator.className = 'hidden';
        mockElements.syncingIndicator.className = 'hidden';
        mockElements.pendingIndicator.className = 'hidden';
        mockElements.conflictIndicator.className = 'hidden';
        mockElements.pendingCount.textContent = '0 pending';
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should handle full sync status change', () => {
        // Set offline state and update UI
        state.setOnlineStatus(false);
        syncIndicators.updateOfflineIndicator(state.sync.isOnline);
        expect(mockElements.offlineIndicator.classList.contains('hidden')).toBe(false);

        // Reset to online and update UI
        state.setOnlineStatus(true);
        syncIndicators.updateOfflineIndicator(state.sync.isOnline);
        expect(mockElements.offlineIndicator.classList.contains('hidden')).toBe(true);

        // Set syncing state and update UI
        state.setSyncStatus({ isSyncing: true });
        syncIndicators.updateSyncingIndicator(state.sync.isSyncing);
        expect(mockElements.syncingIndicator.classList.contains('hidden')).toBe(false);

        // Set pending count and update UI
        state.setSyncStatus({ pendingCount: 5 });
        syncIndicators.updatePendingIndicator(state.sync.pendingCount, state.sync.isOnline);
        expect(mockElements.pendingIndicator.classList.contains('hidden')).toBe(false);
        expect(mockElements.pendingCount.textContent).toBe('5 pending');

        // Set conflicts and update UI
        state.setSyncStatus({ hasConflicts: true, conflictMessage: 'Conflict detected' });
        syncIndicators.updateConflictIndicator(state.sync.hasConflicts);
        expect(mockElements.conflictIndicator.classList.contains('hidden')).toBe(false);
    });

    test('should hide syncing when offline', () => {
        state.setSyncStatus({ isSyncing: true });
        syncIndicators.updateSyncingIndicator(state.sync.isSyncing);
        expect(mockElements.syncingIndicator.classList.contains('hidden')).toBe(false);

        // When going offline, syncing stops and offline indicator shows
        state.setOnlineStatus(false);
        state.setSyncStatus({ isSyncing: false }); // Syncing stops when offline
        syncIndicators.updateOfflineIndicator(state.sync.isOnline);
        syncIndicators.updateSyncingIndicator(state.sync.isSyncing);
        expect(mockElements.syncingIndicator.classList.contains('hidden')).toBe(true);
        expect(mockElements.offlineIndicator.classList.contains('hidden')).toBe(false);
    });

    test('should show pending when offline', () => {
        state.setSyncStatus({ pendingCount: 5 });
        syncIndicators.updatePendingIndicator(state.sync.pendingCount, state.sync.isOnline);
        expect(mockElements.pendingIndicator.classList.contains('hidden')).toBe(false);

        state.setOnlineStatus(false);
        syncIndicators.updateOfflineIndicator(state.sync.isOnline);
        syncIndicators.updatePendingIndicator(state.sync.pendingCount, state.sync.isOnline);
        // Pending should still show in offline mode to indicate queued changes
        expect(mockElements.pendingIndicator.classList.contains('hidden')).toBe(false);
        expect(mockElements.pendingCount.textContent).toBe('5 pending');
    });
});
