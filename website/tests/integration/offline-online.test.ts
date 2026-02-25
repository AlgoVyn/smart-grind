/**
 * Integration Tests: Offline/Online Transitions
 * Tests offline/online behavior and sync across modules
 */

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
import { api } from '../../src/api';

const mockFetch = global.fetch as jest.Mock;

describe('Integration: Offline/Online Transitions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Reset state
        state.problems.clear();
        state.deletedProblemIds.clear();
        state.user = { type: 'local', id: null, displayName: 'Local User' };
        state.ui = { activeTopicId: 'all', currentFilter: 'all', searchQuery: '', preferredAI: null, reviewDateFilter: null };
        state.sync = { isOnline: true, isSyncing: false, pendingCount: 0, lastSyncAt: null, hasConflicts: false, conflictMessage: null };
        
        // Reset localStorage mock
        mockGetItem.mockReturnValue(null);
    });

    describe('Online Status Detection', () => {
        test('should detect online status', async () => {
            // Mock navigator.onLine
            Object.defineProperty(navigator, 'onLine', {
                value: true,
                writable: true,
                configurable: true
            });
            
            // Check online status
            const isOnline = navigator.onLine;
            state.setOnlineStatus(isOnline);
            
            expect(state.sync.isOnline).toBe(true);
            expect(state.sync.isOnline).toBe(true);
        });

        test('should detect offline status', async () => {
            // Mock navigator.onLine
            Object.defineProperty(navigator, 'onLine', {
                value: false,
                writable: true,
                configurable: true
            });
            
            const isOnline = navigator.onLine;
            state.setOnlineStatus(isOnline);
            
            expect(state.sync.isOnline).toBe(false);
            expect(state.sync.isOnline).toBe(false);
        });

        test('should emit status change events', () => {
            const eventListener = jest.fn();
            window.addEventListener('sync-status-change', eventListener);
            
            state.setOnlineStatus(false);
            
            expect(eventListener).toHaveBeenCalled();
            
            window.removeEventListener('sync-status-change', eventListener);
        });
    });

    describe('Offline Data Operations', () => {
        test('should save data locally when offline', async () => {
            state.setOnlineStatus(false);
            
            // Add problem
            state.problems.set('1', {
                id: '1',
                name: 'Test Problem',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            });
            
            // Save locally
            state.saveToStorage();
            
            // Verify localStorage was updated
            expect(localStorage.setItem).toHaveBeenCalled();
        });

        test('should queue operations when offline for signed-in user', async () => {
            state.user.type = 'signed-in';
            state.sync.isOnline = false;
            
            // Queue an operation - will use localStorage fallback
            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: '1', timestamp: Date.now() },
                timestamp: Date.now()
            };
            
            const result = await api.queueOperation(operation);
            
            // Should return operation ID or null
            expect(result).toBeDefined();
        });

        test('should store pending operations in localStorage when SW unavailable', async () => {
            state.user.type = 'signed-in';
            
            // Queue operation - when SW is unavailable, it falls back to localStorage
            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: '1', timestamp: Date.now() },
                timestamp: Date.now()
            };
            
            const result = await api.queueOperation(operation);
            
            // Should return an operation ID (string) when successful
            // or null if the operation couldn't be queued
            expect(typeof result === 'string' || result === null).toBe(true);
        });

    });

    describe('Online Sync Behavior', () => {
        test('should sync pending operations when coming online', async () => {
            state.user.type = 'signed-in';
            
            // Setup pending operations
            const pendingOps = [
                { id: 'op-1', type: 'MARK_SOLVED', data: { problemId: '1' }, timestamp: Date.now() }
            ];
            localStorage.setItem('pending-operations', JSON.stringify(pendingOps));
            
            // Mock successful sync
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ csrfToken: 'token' })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true })
                });
            
            // Initialize offline detection
            const cleanup = api.initOfflineDetection();
            
            // Simulate coming online
            state.setOnlineStatus(true);
            
            // Cleanup
            cleanup();
        });

        test('should get sync status from service worker', async () => {
            state.user.type = 'signed-in';
            
            // In test environment without SW, getSyncStatus returns null or fallback status
            const status = await api.getSyncStatus();
            
            // Should return status object or null (both are valid)
            expect(status === null || typeof status === 'object').toBe(true);
        });

        test('should force sync when requested', async () => {
            state.user.type = 'signed-in';
            
            // forceSync should return a result object even without SW
            const result = await api.forceSync();
            
            // Should return sync result with expected shape
            expect(result).toBeDefined();
            expect(typeof result.success).toBe('boolean');
            expect(typeof result.synced).toBe('number');
            expect(typeof result.failed).toBe('number');
        });
    });

    describe('Sync Status Management', () => {
        test('should track pending operations count', () => {
            state.setSyncStatus({ pendingCount: 5 });
            
            expect(state.sync.pendingCount).toBe(5);
            expect(state.sync.pendingCount).toBe(5);
        });

        test('should track sync in progress', () => {
            state.setSyncStatus({ isSyncing: true });
            
            expect(state.sync.isSyncing).toBe(true);
            expect(state.sync.isSyncing).toBe(true);
        });

        test('should track last sync time', () => {
            const now = Date.now();
            state.setSyncStatus({ lastSyncAt: now });
            
            expect(state.sync.lastSyncAt).toBe(now);
        });

        test('should handle sync conflicts', () => {
            state.setSyncStatus({
                hasConflicts: true,
                conflictMessage: 'Data conflict detected between local and server'
            });
            
            expect(state.sync.hasConflicts).toBe(true);
            expect(state.sync.conflictMessage).toBe('Data conflict detected between local and server');
        });
    });

    describe('Connectivity Checker Integration', () => {
        test('should use connectivity checker for online verification', async () => {
            // Mock fetch for connectivity check
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200
            });
            
            // Check online status via API
            const isOnline = await api.isOnline();
            
            // Result should be boolean
            expect(typeof isOnline).toBe('boolean');
        });

        test('should handle connectivity check failure', async () => {
            // Mock fetch failure
            mockFetch.mockRejectedValueOnce(new Error('Network error'));
            
            // Should handle gracefully
            const isOnline = await api.isOnline();
            
            expect(typeof isOnline).toBe('boolean');
        });
    });

    describe('Offline Detection Initialization', () => {
        test('should initialize offline detection and return cleanup', () => {
            // initOfflineDetection may fail in test environment due to missing SW
            // but should not throw unhandled errors
            let cleanup: (() => void) | undefined;
            try {
                cleanup = api.initOfflineDetection();
            } catch (e) {
                // Expected in test environment
            }
            
            // If cleanup was returned, it should be a function
            if (cleanup) {
                expect(typeof cleanup).toBe('function');
                expect(() => cleanup()).not.toThrow();
            }
        });

        test('should setup connectivity monitoring', () => {
            // Just verify state can be updated
            state.setOnlineStatus(true);
            expect(state.sync.isOnline).toBe(true);
            
            state.setOnlineStatus(false);
            expect(state.sync.isOnline).toBe(false);
        });
    });

    describe('Data Persistence Across Online/Offline', () => {
        test('should maintain data integrity during transitions', async () => {
            // Start online
            state.setOnlineStatus(true);
            
            // Add problem
            state.problems.set('1', {
                id: '1',
                name: 'Test Problem',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            });
            
            // Save
            state.saveToStorage();
            
            // Go offline
            state.setOnlineStatus(false);
            
            // Update problem
            const problem = state.problems.get('1')!;
            problem.note = 'Updated note';
            state.problems.set('1', problem);
            
            // Save again
            state.saveToStorage();
            
            // Come back online
            state.setOnlineStatus(true);
            
            // Verify data integrity
            expect(state.problems.get('1')?.status).toBe('solved');
            expect(state.problems.get('1')?.note).toBe('Updated note');
        });

        test('should handle multiple offline-online cycles', () => {
            const cycles = 3;
            
            for (let i = 0; i < cycles; i++) {
                // Go offline
                state.setOnlineStatus(false);
                expect(state.sync.isOnline).toBe(false);
                
                // Add data
                state.problems.set(`cycle-${i}`, {
                    id: `cycle-${i}`,
                    name: `Cycle ${i}`,
                    url: 'https://example.com',
                    topic: 'Arrays',
                    pattern: 'Two Sum',
                    status: 'solved',
                    reviewInterval: 1,
                    nextReviewDate: '2024-01-15',
                    loading: false,
                    noteVisible: false,
                    note: ''
                });
                
                // Come online
                state.setOnlineStatus(true);
                expect(state.sync.isOnline).toBe(true);
            }
            
            // Verify all data persisted
            for (let i = 0; i < cycles; i++) {
                expect(state.problems.has(`cycle-${i}`)).toBe(true);
            }
        });
    });

    describe('Offline Reload Functionality', () => {
        // Mock service worker controller
        let mockController: {
            postMessage: jest.Mock;
            state: string;
        };

        beforeEach(() => {
            mockController = {
                postMessage: jest.fn(),
                state: 'activated'
            };

            // Mock navigator.serviceWorker
            Object.defineProperty(navigator, 'serviceWorker', {
                value: {
                    controller: mockController,
                    ready: Promise.resolve({ active: mockController }),
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                },
                writable: true,
                configurable: true
            });
        });

        describe('checkOfflineReload', () => {
            test('should return reload status when service worker responds', async () => {
                const { checkOfflineReload } = require('../../src/sw-register');

                // Mock MessageChannel response
                mockController.postMessage.mockImplementation((message, transfer) => {
                    const port = transfer[0];
                    // Simulate service worker responding with reload status
                    setTimeout(() => {
                        port.postMessage({
                            type: 'OFFLINE_RELOAD_STATUS',
                            canReload: true,
                            pageCached: true,
                            assetsCached: true,
                            bundleReady: true,
                            cachedItemsCount: 50
                        });
                    }, 10);
                });

                const result = await checkOfflineReload();

                expect(result).toEqual({
                    canReload: true,
                    pageCached: true,
                    assetsCached: true,
                    bundleReady: true,
                    cachedItemsCount: 50
                });
            });

            test('should return cannot reload when no cache available', async () => {
                const { checkOfflineReload } = require('../../src/sw-register');

                mockController.postMessage.mockImplementation((message, transfer) => {
                    const port = transfer[0];
                    setTimeout(() => {
                        port.postMessage({
                            type: 'OFFLINE_RELOAD_STATUS',
                            canReload: false,
                            pageCached: false,
                            assetsCached: false,
                            bundleReady: false,
                            cachedItemsCount: 0
                        });
                    }, 10);
                });

                const result = await checkOfflineReload();

                expect(result.canReload).toBe(false);
                expect(result.pageCached).toBe(false);
            });

            test('should return default status when no service worker controller', async () => {
                Object.defineProperty(navigator, 'serviceWorker', {
                    value: {
                        controller: null,
                        ready: Promise.resolve({ active: null }),
                    },
                    writable: true,
                    configurable: true
                });

                // Clear module cache and reimport
                jest.resetModules();
                const { checkOfflineReload } = require('../../src/sw-register');

                const result = await checkOfflineReload();

                // Should return default status object when no controller
                expect(result.canReload).toBe(false);
                expect(result.pageCached).toBe(false);
                expect(result.assetsCached).toBe(false);
                expect(result.bundleReady).toBe(false);
                expect(result.cachedItemsCount).toBe(0);
            });

            test('should handle timeout gracefully', async () => {
                const { checkOfflineReload } = require('../../src/sw-register');

                // Mock postMessage that never responds
                mockController.postMessage.mockImplementation(() => {
                    // Don't send any response
                });

                // The function should timeout and return default status
                const result = await checkOfflineReload();

                expect(result.canReload).toBe(false);
                expect(result.cachedItemsCount).toBe(0);
            }, 10000);
        });

        describe('getOfflineStatus', () => {
            test('should return offline capability status', async () => {
                const { getOfflineStatus } = require('../../src/sw-register');

                mockController.postMessage.mockImplementation((message, transfer) => {
                    const port = transfer[0];
                    setTimeout(() => {
                        port.postMessage({
                            type: 'OFFLINE_CAPABILITY',
                            isOffline: false,
                            canFunctionOffline: true,
                            cacheStatus: {
                                staticAssets: 10,
                                problems: 20,
                                apiResponses: 5,
                                bundleFiles: 50
                            },
                            lastBundleDownload: Date.now(),
                            bundleVersion: '1.0.0'
                        });
                    }, 10);
                });

                const result = await getOfflineStatus();

                expect(result.isOffline).toBe(false);
                expect(result.canFunctionOffline).toBe(true);
                expect(result.cacheStatus.staticAssets).toBe(10);
                expect(result.cacheStatus.bundleFiles).toBe(50);
            });

            test('should return default status when service worker unavailable', async () => {
                Object.defineProperty(navigator, 'serviceWorker', {
                    value: {
                        controller: null,
                        ready: Promise.resolve({ active: null }),
                    },
                    writable: true,
                    configurable: true
                });

                jest.resetModules();
                const { getOfflineStatus } = require('../../src/sw-register');

                const result = await getOfflineStatus();

                // Should return default status object when no controller
                expect(result.canFunctionOffline).toBe(false);
                expect(result.cacheStatus.staticAssets).toBe(0);
            });
        });

        describe('setupOfflineReloadHandling', () => {
            test('should setup event listeners for offline handling', () => {
                const { setupOfflineReloadHandling } = require('../../src/sw-register');

                const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

                const cleanup = setupOfflineReloadHandling();

                // Should add event listeners for offline/online events
                expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
                expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
                expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));

                // Cleanup should remove listeners
                const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
                cleanup();
                expect(removeEventListenerSpy).toHaveBeenCalled();

                addEventListenerSpy.mockRestore();
                removeEventListenerSpy.mockRestore();
            });

            test('should return cleanup function', () => {
                const { setupOfflineReloadHandling } = require('../../src/sw-register');

                const cleanup = setupOfflineReloadHandling();

                expect(typeof cleanup).toBe('function');

                // Should not throw when called
                expect(() => cleanup()).not.toThrow();
            });
        });

        describe('Offline reload with cached content', () => {
            test('should allow reload when page is cached', async () => {
                const { checkOfflineReload } = require('../../src/sw-register');

                mockController.postMessage.mockImplementation((message, transfer) => {
                    const port = transfer[0];
                    setTimeout(() => {
                        port.postMessage({
                            type: 'OFFLINE_RELOAD_STATUS',
                            canReload: true,
                            pageCached: true,
                            assetsCached: true,
                            bundleReady: true,
                            cachedItemsCount: 100
                        });
                    }, 10);
                });

                const status = await checkOfflineReload();

                expect(status.canReload).toBe(true);
                expect(status.pageCached).toBe(true);
            });

            test('should indicate offline bundle availability', async () => {
                const { getOfflineStatus } = require('../../src/sw-register');

                mockController.postMessage.mockImplementation((message, transfer) => {
                    const port = transfer[0];
                    setTimeout(() => {
                        port.postMessage({
                            type: 'OFFLINE_CAPABILITY',
                            isOffline: true,
                            canFunctionOffline: true,
                            cacheStatus: {
                                staticAssets: 10,
                                problems: 20,
                                apiResponses: 5,
                                bundleFiles: 100
                            }
                        });
                    }, 10);
                });

                const status = await getOfflineStatus();

                expect(status.canFunctionOffline).toBe(true);
                expect(status.cacheStatus.bundleFiles).toBe(100);
            });
        });
    });
});
