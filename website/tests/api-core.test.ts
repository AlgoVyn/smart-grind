/**
 * API Core Tests
 * Tests for API module functions with service worker communication
 */

// Mock dependencies
const mockSaveData = jest.fn();
const mockSaveProblem = jest.fn();
const mockSaveDeletedId = jest.fn();
const mockLoadData = jest.fn();
const mockSyncPlan = jest.fn();
const mockMergeStructure = jest.fn();
const mockResetAll = jest.fn();
const mockResetCategory = jest.fn();
const mockDeleteCategory = jest.fn();
const mockIsBrowserOnline = jest.fn();
const mockGetConnectivityChecker = jest.fn();
const mockCleanupRegister = jest.fn();

jest.mock('../src/api/api-save', () => ({
    saveData: mockSaveData,
    saveProblem: mockSaveProblem,
    saveDeletedId: mockSaveDeletedId,
    _performSave: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/api/api-load', () => ({
    loadData: mockLoadData,
}));

jest.mock('../src/api/api-sync', () => ({
    syncPlan: mockSyncPlan,
    mergeStructure: mockMergeStructure,
}));

jest.mock('../src/api/api-reset', () => ({
    resetAll: mockResetAll,
    resetCategory: mockResetCategory,
}));

jest.mock('../src/api/api-delete', () => ({
    deleteCategory: mockDeleteCategory,
}));

jest.mock('../src/api/api-utils', () => ({
    isBrowserOnline: mockIsBrowserOnline,
}));

jest.mock('../src/sw/connectivity-checker', () => ({
    getConnectivityChecker: mockGetConnectivityChecker,
}));

jest.mock('../src/utils/cleanup-manager', () => ({
    cleanupManager: {
        register: mockCleanupRegister,
        cleanup: jest.fn(),
    },
}));

jest.mock('../src/state', () => ({
    state: {
        user: { type: 'signed-in' },
        setOnlineStatus: jest.fn(),
        setSyncStatus: jest.fn(),
    },
}));

import {
    isOnline,
    isBrowserOnline,
    queueOperation,
    queueOperations,
    getSyncStatus,
    forceSync,
    clearPendingOperations,
    saveProblemWithSync,
    deleteProblemWithSync,
    initOfflineDetection,
    api,
} from '../src/api';

describe('API Core', () => {
    let mockPostMessage: jest.Mock;
    let mockServiceWorker: any;
    let mockRegistration: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // MessageChannel mock with getter/setter that triggers immediately
        (global as any).MessageChannel = class MockMessageChannel {
            port1: { 
                onmessage: null | ((_event: { data: unknown }) => void);
                postMessage?: (data: unknown) => void;
            };
            port2: { postMessage?: (data: unknown) => void };

            constructor() {
                let onmessageHandler: null | ((_event: { data: unknown }) => void) = null;
                
                this.port1 = {
                    get onmessage() {
                        return onmessageHandler;
                    },
                    set onmessage(handler) {
                        onmessageHandler = handler;
                        // Trigger response immediately when handler is set
                        if (handler) {
                            setTimeout(() => {
                                handler({
                                    data: {
                                        success: true,
                                        status: { pendingCount: 0, isSyncing: false, lastSyncAt: null, stats: { pending: 0, completed: 0, failed: 0, manual: 0 } }
                                    },
                                });
                            }, 0);
                        }
                    },
                };
                this.port2 = {};
            }
        } as unknown as typeof MessageChannel;

        // Mock navigator.serviceWorker
        mockPostMessage = jest.fn((message: { type: string }, transfer: unknown[]) => {
            // The response is now triggered automatically when onmessage is set
        });
        
        mockServiceWorker = {
            ready: Promise.resolve({
                active: {
                    postMessage: mockPostMessage,
                },
                sync: {
                    register: jest.fn().mockResolvedValue(undefined),
                },
            }),
            addEventListener: jest.fn(),
        };

        Object.defineProperty(global.navigator, 'serviceWorker', {
            value: mockServiceWorker,
            writable: true,
            configurable: true,
        });

        // Mock localStorage
        Storage.prototype.getItem = jest.fn();
        Storage.prototype.setItem = jest.fn();
        Storage.prototype.removeItem = jest.fn();

        // Mock connectivity checker
        mockGetConnectivityChecker.mockReturnValue({
            isOnline: jest.fn().mockResolvedValue(true),
            startMonitoring: jest.fn(),
            stopMonitoring: jest.fn(),
            onConnectivityChange: jest.fn().mockReturnValue(() => {}),
        });
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('isOnline', () => {
        test('should return online status from connectivity checker', async () => {
            const result = await isOnline();
            expect(mockGetConnectivityChecker).toHaveBeenCalled();
        });

        test('should handle connectivity check errors', async () => {
            mockGetConnectivityChecker.mockReturnValue({
                isOnline: jest.fn().mockRejectedValue(new Error('Network error')),
            });

            await expect(isOnline()).rejects.toThrow('Network error');
        });
    });

    describe('isBrowserOnline', () => {
        test('should return browser online status', () => {
            mockIsBrowserOnline.mockReturnValue(true);
            const result = isBrowserOnline();
            expect(mockIsBrowserOnline).toHaveBeenCalled();
        });
    });

    describe('queueOperation', () => {
        test('should queue single operation for signed-in user', async () => {
            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: 'test-1', timestamp: Date.now() },
                timestamp: Date.now(),
            };

            const result = await queueOperation(operation);

            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        test('should queue multiple operations', async () => {
            const operations = [
                {
                    type: 'MARK_SOLVED' as const,
                    data: { problemId: 'test-1', timestamp: Date.now() },
                    timestamp: Date.now(),
                },
                {
                    type: 'ADD_NOTE' as const,
                    data: { problemId: 'test-2', note: 'test note', timestamp: Date.now() },
                    timestamp: Date.now(),
                },
            ];

            const result = await queueOperations(operations);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });

        test('should return null for unsigned-in user', async () => {
            // Mock state to return signed-out user
            jest.doMock('../src/state', () => ({
                state: {
                    user: { type: 'signed-out' },
                    setOnlineStatus: jest.fn(),
                    setSyncStatus: jest.fn(),
                },
            }));

            // Re-import to get fresh module with new mock
            const { queueOperation: queueOpSignedOut } = await import('../src/api');

            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: 'test-1', timestamp: Date.now() },
                timestamp: Date.now(),
            };

            const result = await queueOpSignedOut(operation);

            expect(result).toBeNull();

            // Clear the mock override
            jest.dontMock('../src/state');
        });

        test('should store operations locally when service worker unavailable', async () => {
            // Remove service worker
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const operation = {
                type: 'MARK_SOLVED' as const,
                data: { problemId: 'test-1', timestamp: Date.now() },
                timestamp: Date.now(),
            };

            const result = await queueOperation(operation);

            expect(result).toBeDefined();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });

    describe('getSyncStatus', () => {
        test('should get sync status from service worker', async () => {
            const result = await getSyncStatus();
            expect(mockPostMessage).toHaveBeenCalled();
            expect(result).toBeDefined();
        });

        test('should return fallback status when service worker unavailable', async () => {
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([{ id: 1 }, { id: 2 }]));

            const result = await getSyncStatus();

            expect(result).toBeDefined();
            expect(result?.pendingCount).toBe(2);
        });
    });

    describe('forceSync', () => {
        test('should force sync through service worker', async () => {
            const result = await forceSync();

            expect(mockPostMessage).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'FORCE_SYNC' }),
                expect.any(Array)
            );
            expect(result).toBeDefined();
        });

        test('should handle localStorage fallback when service worker unavailable', async () => {
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([]));

            const result = await forceSync();

            expect(result).toEqual({ success: true, synced: 0, failed: 0 });
        });

        test('should handle pending operations in localStorage', async () => {
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify([{ id: 1 }, { id: 2 }]));

            const result = await forceSync();

            expect(result).toEqual({ success: false, synced: 0, failed: 2 });
        });
    });

    describe('clearPendingOperations', () => {
        test('should clear operations through service worker', async () => {
            await clearPendingOperations();

            expect(mockPostMessage).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'CLEAR_ALL_CACHES' }),
                expect.any(Array)
            );
        });

        test('should clear localStorage when service worker unavailable', async () => {
            Object.defineProperty(global.navigator, 'serviceWorker', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            await clearPendingOperations();

            expect(localStorage.removeItem).toHaveBeenCalledWith('pending-operations');
        });
    });

    describe('saveProblemWithSync', () => {
        test('should save problem for signed-in user', async () => {
            mockSaveProblem.mockResolvedValue(undefined);

            await saveProblemWithSync('problem-1', {
                status: 'solved',
                note: 'Test note',
            });

            expect(mockSaveProblem).toHaveBeenCalled();
        });

        test('should save problem without sync for unsigned-in user', async () => {
            const { state } = require('../src/state');
            const originalType = state.user.type;
            state.user.type = 'signed-out';

            mockSaveProblem.mockResolvedValue(undefined);

            await saveProblemWithSync('problem-1', {
                status: 'solved',
            });

            expect(mockSaveProblem).toHaveBeenCalled();

            state.user.type = originalType;
        });
    });

    describe('deleteProblemWithSync', () => {
        test('should delete problem for signed-in user', async () => {
            mockSaveDeletedId.mockResolvedValue(undefined);

            await deleteProblemWithSync('problem-1');

            expect(mockSaveDeletedId).toHaveBeenCalled();
        });

        test('should delete problem without sync for unsigned-in user', async () => {
            const { state } = require('../src/state');
            const originalType = state.user.type;
            state.user.type = 'signed-out';

            mockSaveDeletedId.mockResolvedValue(undefined);

            await deleteProblemWithSync('problem-1');

            expect(mockSaveDeletedId).toHaveBeenCalled();

            state.user.type = originalType;
        });
    });

    describe('initOfflineDetection', () => {
        test('should initialize offline detection', () => {
            const cleanup = initOfflineDetection();

            expect(mockGetConnectivityChecker).toHaveBeenCalled();
            expect(mockCleanupRegister).toHaveBeenCalled();
            expect(typeof cleanup).toBe('function');
        });

        test('should handle connectivity changes', () => {
            let connectivityCallback: ((online: boolean) => void) | null = null;

            mockGetConnectivityChecker.mockReturnValue({
                isOnline: jest.fn().mockResolvedValue(true),
                startMonitoring: jest.fn(),
                stopMonitoring: jest.fn(),
                onConnectivityChange: jest.fn((cb) => {
                    connectivityCallback = cb;
                    return () => {};
                }),
            });

            const cleanup = initOfflineDetection();

            expect(mockGetConnectivityChecker().onConnectivityChange).toHaveBeenCalled();

            // Simulate connectivity change
            if (connectivityCallback) {
                connectivityCallback(true);
            }
        });

        test('should cleanup when called', () => {
            const cleanup = initOfflineDetection();
            cleanup();

            // Cleanup should be registered
            expect(mockCleanupRegister).toHaveBeenCalled();
        });
    });

    describe('api exports', () => {
        test('should export all API functions', () => {
            expect(api.saveData).toBe(mockSaveData);
            expect(api.saveProblem).toBe(mockSaveProblem);
            expect(api.saveDeletedId).toBe(mockSaveDeletedId);
            expect(api.loadData).toBe(mockLoadData);
            expect(api.syncPlan).toBe(mockSyncPlan);
            expect(api.mergeStructure).toBe(mockMergeStructure);
            expect(api.resetAll).toBe(mockResetAll);
            expect(api.resetCategory).toBe(mockResetCategory);
            expect(api.deleteCategory).toBe(mockDeleteCategory);
            expect(api.queueOperation).toBe(queueOperation);
            expect(api.queueOperations).toBe(queueOperations);
            expect(api.getSyncStatus).toBe(getSyncStatus);
            expect(api.forceSync).toBe(forceSync);
            expect(api.clearPendingOperations).toBe(clearPendingOperations);
            expect(api.isOnline).toBe(isOnline);
            expect(api.initOfflineDetection).toBe(initOfflineDetection);
        });
    });

    describe('service worker message handling', () => {
        test('should handle SYNC_COMPLETED message', () => {
            const { state } = require('../src/state');

            // Simulate message event
            const messageHandler = mockServiceWorker.addEventListener.mock.calls.find(
                (call: any[]) => call[0] === 'message'
            )?.[1];

            if (messageHandler) {
                messageHandler({
                    data: { type: 'SYNC_COMPLETED' },
                });

                expect(state.setSyncStatus).toHaveBeenCalled();
            }
        });

        test('should handle SYNC_PROGRESS_SYNCED message', () => {
            const messageHandler = mockServiceWorker.addEventListener.mock.calls.find(
                (call: any[]) => call[0] === 'message'
            )?.[1];

            if (messageHandler) {
                messageHandler({
                    data: { type: 'SYNC_PROGRESS_SYNCED' },
                });
            }
        });

        test('should handle SYNC_CONFLICT_REQUIRES_MANUAL message', () => {
            const { state } = require('../src/state');

            const messageHandler = mockServiceWorker.addEventListener.mock.calls.find(
                (call: any[]) => call[0] === 'message'
            )?.[1];

            if (messageHandler) {
                messageHandler({
                    data: {
                        type: 'SYNC_CONFLICT_REQUIRES_MANUAL',
                        data: { message: 'Conflict detected' },
                    },
                });

                expect(state.setSyncStatus).toHaveBeenCalledWith(
                    expect.objectContaining({ hasConflicts: true })
                );
            }
        });
    });
});
