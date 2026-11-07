/**
 * Background Sync Manager Unit Tests
 * Tests for sync registration, user progress sync, custom problems sync, and conflict resolution
 */

// Create mock instances (must include waitForLoad - used by getAuthFetchOpts in background-sync)
const createMockAuthManager = () => ({
    waitForLoad: jest.fn().mockResolvedValue(undefined),
    isAuthenticated: jest.fn().mockReturnValue(true),
    refreshToken: jest.fn().mockResolvedValue('mock-token'),
    getAuthHeaders: jest.fn().mockResolvedValue({}),
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

// Set up module mocks (factory runs hoisted; inline mock so getAuthManager() returns waitForLoad)
jest.mock('../../src/sw/auth-manager', () => ({
    getAuthManager: jest.fn().mockImplementation(() => ({
        waitForLoad: jest.fn().mockResolvedValue(undefined),
        isAuthenticated: jest.fn().mockReturnValue(true),
        refreshToken: jest.fn().mockResolvedValue('mock-token'),
        getAuthHeaders: jest.fn().mockResolvedValue({}),
        handleAuthError: jest.fn().mockResolvedValue(false),
        retryWithFreshToken: jest.fn().mockResolvedValue({ ok: true }),
    })),
    AuthManager: jest.fn(),
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

    // Mock fetch response with a JSON content type — the sync manager verifies
    // the content type before trusting a response body (a 200 from the SPA
    // fallback is HTML, not server data)
    const jsonResponse = (body: unknown, overrides: Record<string, unknown> = {}) => ({
        ok: true,
        headers: {
            get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
        },
        json: () => Promise.resolve(body),
        ...overrides,
    });

    // Create mock auth manager to inject into the manager (waitForLoad used by getAuthFetchOpts)
    const createMockAuthManagerInstance = () => ({
        waitForLoad: jest.fn().mockResolvedValue(undefined),
        isAuthenticated: jest.fn().mockReturnValue(true),
        refreshToken: jest.fn().mockResolvedValue('mock-token'),
        getAuthHeaders: jest.fn().mockResolvedValue({}),
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

            // Mock: first call is verifyAuthentication (csrf), then batch sync
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
                .mockResolvedValue(jsonResponse({ conflicts: [] })); // batch sync

            await manager.syncUserProgress();

            expect(global.fetch).toHaveBeenCalled();
            // The incremental endpoint requires the same CSRF protection as
            // the full-blob save endpoint.
            expect(global.fetch).toHaveBeenCalledWith(
                '/smartgrind/api/user/progress/batch',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-CSRF-Token': 'test-csrf-token',
                    }),
                })
            );
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

            // Mock: first call is verifyAuthentication (csrf) - succeeds, then batch sync fails
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
                .mockRejectedValue(new Error('Network error')); // batch sync fails

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

            // Mock: first call is verifyAuthentication (csrf) - succeeds, then batch sync fails
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
                .mockRejectedValue(new Error('Network error')); // batch sync fails

            await manager.syncUserProgress();

            // Verify that failed operations are handled and the failure reason
            // is recorded so permanent errors can be told apart later.
            expect(mockOperationQueue.updateRetryCount).toHaveBeenCalledWith('op1');
            expect(mockOperationQueue.markFailed).toHaveBeenCalledWith(
                'op1',
                expect.stringContaining('Network error')
            );
        });

        it('should park progress operations that have no problemId', async () => {
            const mockOps: QueuedOperation[] = [
                {
                    id: 'op1',
                    type: 'MARK_SOLVED' as OperationType,
                    data: { solved: true },
                    timestamp: Date.now(),
                    deviceId: 'device1',
                    retryCount: 0,
                    status: 'pending',
                    createdAt: Date.now(),
                },
            ];
            mockOperationQueue.getPendingOperations
                .mockResolvedValueOnce(mockOps)
                .mockResolvedValue([]);
            jest.spyOn(manager as any, 'verifyAuthentication').mockResolvedValue(true);
            global.fetch = jest.fn();

            await manager.syncUserProgress();

            // The op cannot be sent, so it is parked instead of remaining
            // pending and re-triggering a sync every 5 seconds.
            expect(mockOperationQueue.markFailed).toHaveBeenCalledWith(
                'op1',
                expect.stringContaining('problemId')
            );
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should skip sync entirely when navigator.onLine is false', async () => {
            // Simulate offline browser state
            Object.defineProperty(navigator, 'onLine', {
                value: false,
                writable: true,
                configurable: true,
            });

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

            await manager.syncUserProgress();

            // Offline is not an auth problem: no fetch and no AUTH_REQUIRED
            // notification — the ops simply wait for the next online sync
            expect(global.fetch).not.toHaveBeenCalled();
            expect(mockClients.matchAll).not.toHaveBeenCalled();

            // Restore online state
            Object.defineProperty(navigator, 'onLine', {
                value: true,
                writable: true,
                configurable: true,
            });
        });

        it('should abort sync and reset isSyncing only after the run unwinds', async () => {
            jest.useFakeTimers();

            mockOperationQueue.getPendingOperations
                .mockResolvedValueOnce([{ id: 'op1' }] as QueuedOperation[])
                .mockResolvedValue([]);

            // Fast-path auth so we reach the sync operations
            jest.spyOn(manager as any, 'verifyAuthentication').mockResolvedValue(true);

            // Make the inner sync hang until we release it, so the outer 60s
            // timeout fires first
            let releaseInner: () => void = () => {};
            const innerHang = new Promise<void>((resolve) => {
                releaseInner = resolve;
            });
            jest
                .spyOn(manager as any, 'syncProblemProgressWithTimeout')
                .mockImplementation(() => innerHang);
            jest
                .spyOn(manager as any, 'syncCustomProblemsWithTimeout')
                .mockResolvedValue(undefined);
            jest
                .spyOn(manager as any, 'syncUserSettingsWithTimeout')
                .mockResolvedValue(undefined);

            const syncPromise = manager.syncUserProgress();

            expect((manager as any).isSyncing).toBe(true);
            expect((manager as any).syncAbortController).not.toBeNull();

            // Advance past the 60s outer sync timeout: the abort fires while
            // the run is still unwinding, so isSyncing stays true to prevent
            // a new sync from interleaving with the dying run
            jest.advanceTimersByTime(60001);
            expect((manager as any).syncAbortController?.signal.aborted).toBe(true);
            expect((manager as any).isSyncing).toBe(true);

            // Let the aborted run unwind; the finally block resets the flag
            releaseInner();
            await syncPromise;
            expect((manager as any).isSyncing).toBe(false);

            jest.useRealTimers();
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
            mockOperationQueue.getOperationsByType.mockImplementation(async (type: string) =>
                type === 'ADD_CUSTOM_PROBLEM' ? mockOps : []
            );
            mockOperationQueue.markCompleted.mockResolvedValue();

            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
                .mockResolvedValue(jsonResponse({ applied: 1 }));

            await manager.syncCustomProblems();

            expect(global.fetch).toHaveBeenCalledWith(
                '/smartgrind/api/user/custom-problems',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'X-CSRF-Token': 'test-csrf-token',
                    }),
                })
            );
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
            mockOperationQueue.getOperationsByType.mockImplementation(async (type: string) =>
                type === 'ADD_CUSTOM_PROBLEM' ? mockOps : []
            );
            mockConflictResolver.resolveCustomProblemConflict.mockResolvedValue({
                status: 'resolved',
                data: { id: 'custom1', name: 'Custom Problem' },
            });
            mockOperationQueue.markCompleted.mockResolvedValue();

            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
                .mockResolvedValue(
                    jsonResponse(
                        { id: 'custom1', name: 'Server Version' },
                        { ok: false, status: 409 }
                    )
                );

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

            // CSRF fetch succeeds, then the sync request fails with a network error
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
                .mockRejectedValue(new Error('Network error'));

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
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
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
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
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

            // First call: verifyAuthentication (csrf). Then batch 409, then individual 409.
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
                .mockResolvedValueOnce(
                    jsonResponse({ problemId: 'two-sum', solved: false }, { ok: false, status: 409 })
                )
                .mockResolvedValue(
                    jsonResponse({ problemId: 'two-sum', solved: false }, { ok: false, status: 409 })
                );

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

            // First call: csrf. Then batch 409, then individual 409.
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce(jsonResponse({ csrfToken: 'test-csrf-token' }))
                .mockResolvedValueOnce(
                    jsonResponse({ problemId: 'two-sum', solved: false }, { ok: false, status: 409 })
                )
                .mockResolvedValue(
                    jsonResponse({ problemId: 'two-sum', solved: false }, { ok: false, status: 409 })
                );

            await manager.syncUserProgress();

            // The implementation uses autoResolve() for conflict resolution
            expect(mockConflictResolver.autoResolve).toHaveBeenCalled();
            expect(mockOperationQueue.markPendingManualResolution).toHaveBeenCalledWith(
                'op1',
                'Manual resolution required'
            );
        });
    });

    describe('Requeue policy', () => {
        it('requeues transient failures without resetting the retry count', async () => {
            mockOperationQueue.getFailedOperations.mockResolvedValue([
                { id: 'op1', errorMessage: 'HTTP 503' },
                { id: 'op2', errorMessage: 'Failed to fetch' },
            ] as unknown as QueuedOperation[]);
            mockOperationQueue.getPendingOperations.mockResolvedValue([]);

            await manager.checkAndSync();

            expect(mockOperationQueue.requeueOperation).toHaveBeenCalledTimes(2);
            for (const call of mockOperationQueue.requeueOperation.mock.calls) {
                // No resetRetryCount: one attempt per requeue cycle, not a
                // fresh five-attempt burst every 30 seconds.
                expect(call[1]).toBeUndefined();
            }
        });

        it('does not requeue permanent failures', async () => {
            mockOperationQueue.getFailedOperations.mockResolvedValue([
                { id: 'op1', errorMessage: 'Max retries exceeded: HTTP 400' },
                { id: 'op2', errorMessage: 'Max retries exceeded: Conflict resolution error' },
            ] as unknown as QueuedOperation[]);
            mockOperationQueue.getPendingOperations.mockResolvedValue([]);

            await manager.checkAndSync();

            expect(mockOperationQueue.requeueOperation).not.toHaveBeenCalled();
        });
    });

    describe('Get Sync Status', () => {
        it('should return current sync status', async () => {
            mockOperationQueue.getPendingOperations.mockResolvedValue([
                { id: 'op1', retryCount: 0 },
            ] as unknown as QueuedOperation[]);
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

        it('should not count operations with retryCount > 0 as pending', async () => {
            mockOperationQueue.getPendingOperations.mockResolvedValue([
                { id: 'op1', retryCount: 0 }, // Truly pending (not yet synced)
                { id: 'op2', retryCount: 1 }, // Being retried (already synced once)
                { id: 'op3', retryCount: 2 }, // Being retried (already synced once)
            ] as unknown as QueuedOperation[]);
            mockOperationQueue.getFailedOperations.mockResolvedValue([]);
            mockOperationQueue.getLastSyncTime.mockResolvedValue(1234567890);

            const status = await manager.getSyncStatus();

            // Only op1 should count as truly pending
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
