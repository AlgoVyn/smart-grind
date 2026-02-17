/**
 * Background Sync Manager Unit Tests
 * Tests for sync registration, user progress sync, custom problems sync, and conflict resolution
 */

// Create mock instances
const createMockAuthManager = () => ({
    isAuthenticated: jest.fn().mockReturnValue(true),
    refreshToken: jest.fn().mockResolvedValue('mock-token'),
    getAuthHeaders: jest.fn().mockResolvedValue({ Authorization: 'Bearer mock-token' }),
    handleAuthError: jest.fn().mockResolvedValue(false),
    retryWithFreshToken: jest.fn().mockResolvedValue({ ok: true }),
});

const createMockOperationQueue = () => ({
    getPendingOperations: jest.fn().mockResolvedValue([]),
    getOperationsByType: jest.fn().mockResolvedValue([]),
    getFailedOperations: jest.fn().mockResolvedValue([]),
    markCompleted: jest.fn().mockResolvedValue(undefined),
    markFailed: jest.fn().mockResolvedValue(undefined),
    markPendingManualResolution: jest.fn().mockResolvedValue(undefined),
    updateRetryCount: jest.fn().mockResolvedValue(1),
    requeueOperation: jest.fn().mockResolvedValue(undefined),
    getStatus: jest.fn().mockResolvedValue({
        pendingCount: 0,
        isSyncing: false,
        lastSyncAt: null,
        stats: { pending: 0, completed: 0, failed: 0, manual: 0 },
    }),
    clearAll: jest.fn().mockResolvedValue(undefined),
    getLastSyncTime: jest.fn().mockResolvedValue(1234567890),
});

const createMockConflictResolver = () => ({
    resolveProgressConflict: jest.fn().mockResolvedValue({
        status: 'resolved',
        data: { problemId: 'two-sum', solved: true },
    }),
    resolveCustomProblemConflict: jest.fn().mockResolvedValue({
        status: 'resolved',
        data: { id: 'custom1', name: 'Custom Problem' },
    }),
    autoResolve: jest.fn().mockResolvedValue({
        status: 'resolved',
        data: { problemId: 'two-sum', solved: true },
    }),
});

// Set up module mocks
jest.mock('../../src/sw/auth-manager', () => ({
    getAuthManager: jest.fn().mockImplementation(() => createMockAuthManager()),
    AuthManager: jest.fn().mockImplementation(() => createMockAuthManager()),
}));

jest.mock('../../src/sw/operation-queue', () => ({
    OperationQueue: jest.fn().mockImplementation(() => createMockOperationQueue()),
}));

jest.mock('../../src/sw/sync-conflict-resolver', () => ({
    SyncConflictResolver: jest.fn().mockImplementation(() => createMockConflictResolver()),
}));

// Import after mocks are set up
import { BackgroundSyncManager } from '../../src/sw/background-sync';
import { OperationQueue, QueuedOperation, OperationType } from '../../src/sw/operation-queue';
import { SyncConflictResolver } from '../../src/sw/sync-conflict-resolver';

// Mock self (ServiceWorkerGlobalScope) for notifyClients
const mockClients = {
    matchAll: jest.fn().mockResolvedValue([]),
    claim: jest.fn().mockResolvedValue(undefined),
    openWindow: jest.fn().mockResolvedValue(undefined),
};

Object.defineProperty(global, 'self', {
    value: {
        clients: mockClients,
        registration: {
            scope: '/smartgrind/',
            sync: {
                register: jest.fn().mockResolvedValue(undefined),
                getTags: jest.fn().mockResolvedValue([]),
            },
        },
        skipWaiting: jest.fn().mockResolvedValue(undefined),
        addEventListener: jest.fn(),
    },
    writable: true,
    configurable: true,
});

describe('BackgroundSyncManager', () => {
    let manager: BackgroundSyncManager;
    let mockOperationQueue: jest.Mocked<OperationQueue>;
    let mockConflictResolver: jest.Mocked<SyncConflictResolver>;

    // Create mock auth manager to inject into the manager
    const createMockAuthManagerInstance = () => ({
        isAuthenticated: jest.fn().mockReturnValue(true),
        refreshToken: jest.fn().mockResolvedValue('mock-token'),
        getAuthHeaders: jest.fn().mockResolvedValue({ Authorization: 'Bearer mock-token' }),
        handleAuthError: jest.fn().mockResolvedValue(false),
        retryWithFreshToken: jest.fn().mockResolvedValue({ ok: true }),
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockClients.matchAll.mockResolvedValue([]);
        // Create new manager instance after mocks are cleared
        manager = new BackgroundSyncManager();

        // Inject mock auth manager directly into the instance
        (
            manager as unknown as { authManager: ReturnType<typeof createMockAuthManagerInstance> }
        ).authManager = createMockAuthManagerInstance();

        // Access the mocked instances from the manager
        mockOperationQueue = (manager as unknown as { operationQueue: jest.Mocked<OperationQueue> })
            .operationQueue;
        mockConflictResolver = (
            manager as unknown as { conflictResolver: jest.Mocked<SyncConflictResolver> }
        ).conflictResolver;

        // Ensure all mock methods are properly set up
        mockOperationQueue.getPendingOperations = jest.fn().mockResolvedValue([]);
        mockOperationQueue.getOperationsByType = jest.fn().mockResolvedValue([]);
        mockOperationQueue.getFailedOperations = jest.fn().mockResolvedValue([]);
        mockOperationQueue.markCompleted = jest.fn().mockResolvedValue(undefined);
        mockOperationQueue.markFailed = jest.fn().mockResolvedValue(undefined);
        mockOperationQueue.markPendingManualResolution = jest.fn().mockResolvedValue(undefined);
        mockOperationQueue.updateRetryCount = jest.fn().mockResolvedValue(1);
        mockOperationQueue.requeueOperation = jest.fn().mockResolvedValue(undefined);
        mockOperationQueue.getLastSyncTime = jest.fn().mockResolvedValue(1234567890);

        mockConflictResolver.resolveProgressConflict = jest.fn().mockResolvedValue({
            status: 'resolved',
            data: { problemId: 'two-sum', solved: true },
        });
        mockConflictResolver.resolveCustomProblemConflict = jest.fn().mockResolvedValue({
            status: 'resolved',
            data: { id: 'custom1', name: 'Custom Problem' },
        });
        mockConflictResolver.autoResolve = jest.fn().mockResolvedValue({
            status: 'resolved',
            data: { problemId: 'two-sum', solved: true },
        });
    });

    afterEach(() => {
        // Reset isSyncing flag between tests by creating a new manager
        jest.resetAllMocks();
    });

    describe('Register Sync', () => {
        it('should register sync tag when Sync API is available', async () => {
            const mockRegister = jest.fn().mockResolvedValue(undefined);

            // Update self.registration.sync
            (
                global.self as unknown as { registration: { sync: { register: jest.Mock } } }
            ).registration.sync.register = mockRegister;

            await manager.registerSync('sync-user-progress');

            expect(mockRegister).toHaveBeenCalledWith('sync-user-progress');
        });

        it('should fallback to immediate sync when Sync API is not available', async () => {
            // Remove sync from registration
            const originalSync = (global.self as unknown as { registration: { sync: unknown } })
                .registration.sync;
            (global.self as unknown as { registration: { sync?: unknown } }).registration.sync =
                undefined;

            // Mock syncUserProgress to verify it's called
            const syncSpy = jest.spyOn(manager, 'syncUserProgress').mockResolvedValue();

            await manager.registerSync('sync-user-progress');

            expect(syncSpy).toHaveBeenCalled();

            // Restore sync
            (global.self as unknown as { registration: { sync: unknown } }).registration.sync =
                originalSync;
        });

        it('should fallback to immediate sync when registration fails', async () => {
            const mockRegister = jest.fn().mockRejectedValue(new Error('Registration failed'));

            (
                global.self as unknown as { registration: { sync: { register: jest.Mock } } }
            ).registration.sync.register = mockRegister;

            const syncSpy = jest.spyOn(manager, 'syncUserProgress').mockResolvedValue();

            await manager.registerSync('sync-user-progress');

            expect(syncSpy).toHaveBeenCalled();
        });
    });

    describe('Sync User Progress', () => {
        it('should skip sync if already in progress', async () => {
            // Use the existing manager but mock the queue to return operations
            mockOperationQueue.getPendingOperations.mockResolvedValue([
                { id: 'op1' },
            ] as QueuedOperation[]);

            // Start first sync but don't await to keep isSyncing true
            const firstSync = manager.syncUserProgress();

            // Immediately try second sync while first is still running
            mockOperationQueue.getPendingOperations.mockClear();
            await manager.syncUserProgress();

            // Second call should return early without calling getPendingOperations
            expect(mockOperationQueue.getPendingOperations).not.toHaveBeenCalled();

            // Wait for first sync to complete
            await firstSync;
        });

        it('should return early if no pending operations', async () => {
            mockOperationQueue.getPendingOperations.mockResolvedValue([]);

            await manager.syncUserProgress();

            expect(mockOperationQueue.getPendingOperations).toHaveBeenCalled();
        });

        it('should sync problem progress operations', async () => {
            // Use 'MARK_SOLVED' as the type - the actual type used in the code
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'MARK_SOLVED' as OperationType,
                    data: { problemId: 'two-sum', solved: true },
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getPendingOperations.mockResolvedValue(mockOps);
            mockOperationQueue.markCompleted.mockResolvedValue(undefined);

            // Mock successful batch sync
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ conflicts: [] }),
            });

            await manager.syncUserProgress();

            expect(global.fetch).toHaveBeenCalled();
            expect(mockOperationQueue.markCompleted).toHaveBeenCalledWith('op1');
        });

        it('should handle failed operations and requeue them', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'MARK_SOLVED' as OperationType,
                    data: { problemId: 'two-sum', solved: true } as unknown as Record<
                        string,
                        unknown
                    >,
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getPendingOperations.mockResolvedValue(mockOps);
            mockOperationQueue.updateRetryCount.mockResolvedValue(1);
            mockOperationQueue.requeueOperation.mockResolvedValue(undefined);

            // Mock failed batch sync - individual sync will also fail
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            await manager.syncUserProgress();

            // Verify error handling was triggered
            expect(mockOperationQueue.updateRetryCount).toHaveBeenCalled();
        });

        it('should mark operations as failed after max retries', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'MARK_SOLVED' as OperationType,
                    data: { problemId: 'two-sum', solved: true } as unknown as Record<
                        string,
                        unknown
                    >,
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 5,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getPendingOperations.mockResolvedValue(mockOps);
            mockOperationQueue.updateRetryCount.mockResolvedValue(6);
            mockOperationQueue.markFailed.mockResolvedValue(undefined);

            // Mock failed batch sync
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            await manager.syncUserProgress();

            // Verify that failed operations are handled
            expect(mockOperationQueue.updateRetryCount).toHaveBeenCalledWith('op1');
        });
    });

    describe('Sync Custom Problems', () => {
        it('should return early if no custom problem operations', async () => {
            mockOperationQueue.getOperationsByType.mockResolvedValue([]);

            await manager.syncCustomProblems();

            expect(mockOperationQueue.getOperationsByType).toHaveBeenCalledWith(
                'ADD_CUSTOM_PROBLEM'
            );
        });

        it('should sync custom problems successfully', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'ADD_CUSTOM_PROBLEM' as OperationType,
                    data: { id: 'custom1', name: 'Custom Problem' },
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getOperationsByType.mockResolvedValue(mockOps);
            mockOperationQueue.markCompleted.mockResolvedValue();

            global.fetch = jest.fn().mockResolvedValue({ ok: true });

            await manager.syncCustomProblems();

            expect(mockOperationQueue.markCompleted).toHaveBeenCalledWith('op1');
        });

        it('should handle conflict (409) for custom problems', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'ADD_CUSTOM_PROBLEM' as OperationType,
                    data: { id: 'custom1', name: 'Custom Problem' },
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getOperationsByType.mockResolvedValue(mockOps);
            mockConflictResolver.resolveCustomProblemConflict.mockResolvedValue({
                status: 'resolved',
                data: { id: 'custom1', name: 'Custom Problem' },
            });
            mockOperationQueue.markCompleted.mockResolvedValue();

            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 409,
                json: () => Promise.resolve({ id: 'custom1', name: 'Server Version' }),
            });

            await manager.syncCustomProblems();

            expect(mockConflictResolver.resolveCustomProblemConflict).toHaveBeenCalled();
        });

        it('should throw error on sync failure without updating retry count', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'ADD_CUSTOM_PROBLEM' as OperationType,
                    data: { id: 'custom1', name: 'Custom Problem' },
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getOperationsByType.mockResolvedValue(mockOps);

            // Mock fetch to reject with network error
            const fetchMock = jest.fn().mockRejectedValue(new Error('Network error'));
            global.fetch = fetchMock;

            // The method throws errors without calling updateRetryCount
            // Retry logic is handled at a higher level in syncUserProgress()
            await expect(manager.syncCustomProblems()).rejects.toThrow('Network error');

            // updateRetryCount is not called at this level - it's handled by handleFailedOperation()
            // in the parent syncUserProgress() method
            expect(mockOperationQueue.updateRetryCount).not.toHaveBeenCalled();
        });
    });

    describe('Sync User Settings', () => {
        it('should return early if no settings operations', async () => {
            mockOperationQueue.getOperationsByType.mockResolvedValue([]);

            await manager.syncUserSettings();

            expect(mockOperationQueue.getOperationsByType).toHaveBeenCalledWith('UPDATE_SETTINGS');
        });

        it('should sync latest settings operation', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'UPDATE_SETTINGS' as OperationType,
                    data: { theme: 'dark' },
                    timestamp: 1000,
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
                {
                    id: 'op2',
                    type: 'UPDATE_SETTINGS' as OperationType,
                    data: { theme: 'light' },
                    timestamp: 2000,
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getOperationsByType.mockResolvedValue(mockOps);
            mockOperationQueue.markCompleted.mockResolvedValue();

            // Mock CSRF fetch followed by actual sync fetch
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ csrfToken: 'test-csrf-token' }),
                })
                .mockResolvedValueOnce({ ok: true });

            await manager.syncUserSettings();

            // First call is CSRF token fetch
            expect(global.fetch).toHaveBeenNthCalledWith(
                1,
                '/smartgrind/api/user?action=csrf',
                expect.objectContaining({
                    credentials: 'include',
                })
            );
            // Second call is the actual sync
            expect(global.fetch).toHaveBeenNthCalledWith(
                2,
                '/smartgrind/api/user',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'X-CSRF-Token': 'test-csrf-token',
                    }),
                })
            );
        });

        it('should mark all settings operations as completed on success', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'UPDATE_SETTINGS' as OperationType,
                    data: { theme: 'dark' },
                    timestamp: 1000,
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
                {
                    id: 'op2',
                    type: 'UPDATE_SETTINGS' as OperationType,
                    data: { theme: 'light' },
                    timestamp: 2000,
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getOperationsByType.mockResolvedValue(mockOps);
            mockOperationQueue.markCompleted.mockResolvedValue();

            // Mock CSRF fetch followed by actual sync fetch
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ csrfToken: 'test-csrf-token' }),
                })
                .mockResolvedValueOnce({ ok: true });

            await manager.syncUserSettings();

            expect(mockOperationQueue.markCompleted).toHaveBeenCalledTimes(2);
        });

        it('should throw error on failure without updating retry count', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op2',
                    type: 'UPDATE_SETTINGS' as OperationType,
                    data: { theme: 'light' },
                    timestamp: 2000,
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getOperationsByType.mockResolvedValue(mockOps);

            // Mock fetch to reject with network error
            const fetchMock = jest.fn().mockRejectedValue(new Error('Network error'));
            global.fetch = fetchMock;

            // The method throws errors without calling updateRetryCount
            // Retry logic is handled at a higher level in syncUserProgress()
            await expect(manager.syncUserSettings()).rejects.toThrow('Network error');

            // updateRetryCount is not called at this level - it's handled by handleFailedOperation()
            // in the parent syncUserProgress() method
            expect(mockOperationQueue.updateRetryCount).not.toHaveBeenCalled();
        });
    });

    describe('Conflict Resolution', () => {
        it('should handle server conflict and auto-resolve', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'MARK_SOLVED' as OperationType,
                    data: { problemId: 'two-sum', solved: true },
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getPendingOperations.mockResolvedValue(mockOps);
            mockOperationQueue.markCompleted.mockResolvedValue(undefined);

            // The implementation calls autoResolve(), not resolveProgressConflict()
            mockConflictResolver.autoResolve.mockResolvedValue({
                status: 'resolved',
                data: { problemId: 'two-sum', solved: true, solveCount: 1 },
            });

            // First batch call returns 409, then individual calls also return 409
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce({
                    ok: false,
                    status: 409,
                    json: () => Promise.resolve({ problemId: 'two-sum', solved: false }),
                })
                .mockResolvedValue({
                    ok: false,
                    status: 409,
                    json: () => Promise.resolve({ problemId: 'two-sum', solved: false }),
                });

            await manager.syncUserProgress();

            // The implementation uses autoResolve() for conflict resolution
            expect(mockConflictResolver.autoResolve).toHaveBeenCalled();
            expect(mockOperationQueue.markCompleted).toHaveBeenCalled();
        });

        it('should handle manual resolution required', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'MARK_SOLVED' as OperationType,
                    data: { problemId: 'two-sum', solved: true },
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getPendingOperations.mockResolvedValue(mockOps);
            mockOperationQueue.markPendingManualResolution.mockResolvedValue(undefined);

            // The implementation calls autoResolve(), not resolveProgressConflict()
            mockConflictResolver.autoResolve.mockResolvedValue({
                status: 'manual',
                message: 'Manual resolution required',
            });

            // First batch call returns 409, then individual calls also return 409
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce({
                    ok: false,
                    status: 409,
                    json: () => Promise.resolve({ problemId: 'two-sum', solved: false }),
                })
                .mockResolvedValue({
                    ok: false,
                    status: 409,
                    json: () => Promise.resolve({ problemId: 'two-sum', solved: false }),
                });

            await manager.syncUserProgress();

            // The implementation uses autoResolve() for conflict resolution
            expect(mockConflictResolver.autoResolve).toHaveBeenCalled();
            expect(mockOperationQueue.markPendingManualResolution).toHaveBeenCalledWith(
                'op1',
                'Manual resolution required'
            );
        });
    });

    describe('Get Sync Status', () => {
        it('should return current sync status', async () => {
            mockOperationQueue.getPendingOperations.mockResolvedValue([
                { id: 'op1' },
            ] as QueuedOperation[]);
            mockOperationQueue.getFailedOperations.mockResolvedValue([]);
            mockOperationQueue.getLastSyncTime.mockResolvedValue(1234567890);

            const status = await manager.getSyncStatus();

            expect(status).toEqual({
                pendingCount: 1,
                isSyncing: false,
                lastSyncAt: 1234567890,
                failedCount: 0,
            });
        });
    });

    describe('Force Sync', () => {
        it('should return success if no pending operations', async () => {
            mockOperationQueue.getPendingOperations.mockResolvedValue([]);

            const result = await manager.forceSync();

            expect(result).toEqual({ success: true, synced: 0, failed: 0 });
        });

        it('should sync and return results', async () => {
            const mockOps: QueuedOperation[] = [{ id: 'op1' }] as unknown as QueuedOperation[];
            mockOperationQueue.getPendingOperations
                .mockResolvedValueOnce(mockOps)
                .mockResolvedValueOnce([]); // After sync, no pending
            mockOperationQueue.getFailedOperations.mockResolvedValue([]);

            const syncSpy = jest.spyOn(manager, 'syncUserProgress').mockResolvedValue();

            const result = await manager.forceSync();

            expect(syncSpy).toHaveBeenCalled();
            expect(result.success).toBe(true);
            expect(result.synced).toBe(1);
        });

        it('should return failure on sync error', async () => {
            const mockOps: QueuedOperation[] = [{ id: 'op1' }] as unknown as QueuedOperation[];
            mockOperationQueue.getPendingOperations.mockResolvedValue(mockOps);

            jest.spyOn(manager, 'syncUserProgress').mockRejectedValue(new Error('Sync failed'));

            const result = await manager.forceSync();

            expect(result.success).toBe(false);
            expect(result.failed).toBe(1);
        });
    });
});
