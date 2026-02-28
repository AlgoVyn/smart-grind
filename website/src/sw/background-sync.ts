// Background Sync Manager for SmartGrind Service Worker
// Handles syncing user progress when connection is restored

import { getAuthManager } from './auth-manager';
import { OperationQueue, QueuedOperation } from './operation-queue';
import { SyncConflictResolver } from './sync-conflict-resolver';

/** Fetch options: use Bearer token from IndexedDB when present, else credentials (cookies). */
async function getAuthFetchOpts(
    extraHeaders: Record<string, string> = {}
): Promise<{ headers: Record<string, string>; credentials: RequestCredentials }> {
    try {
        const auth = getAuthManager();
        if (!auth || typeof auth.waitForLoad !== 'function') {
            return { headers: extraHeaders, credentials: 'include' };
        }
        await auth.waitForLoad();
        const authHeaders = await auth.getAuthHeaders();
        if (Object.keys(authHeaders).length > 0) {
            return { headers: { ...extraHeaders, ...authHeaders }, credentials: 'omit' };
        }
    } catch {
        // e.g. IndexedDB or auth not available (tests)
    }
    return { headers: extraHeaders, credentials: 'include' };
}

// Sync configuration
const SYNC_TAGS = {
    USER_PROGRESS: 'sync-user-progress',
    CUSTOM_PROBLEMS: 'sync-custom-problems',
    USER_SETTINGS: 'sync-user-settings',
} as const;

// Retry and timeout configuration
const MAX_RETRY_ATTEMPTS = 5;
const SYNC_TIMEOUT_MS = 60000; // 60 seconds timeout for sync batch (increased from 30)
const REQUEST_TIMEOUT_MS = 15000; // 15 seconds timeout for individual requests (increased from 10)
const PENDING_RETRY_CHECK_INTERVAL_MS = 30000; // Check for pending retries every 30 seconds

// Delay configuration for exponential backoff
const RETRY_BASE_DELAY_MS = 1000; // 1 second base delay for exponential backoff
const RETRY_MAX_DELAY_MS = 60000; // 1 minute maximum delay
const SCHEDULED_RETRY_DELAY_MS = 5000; // 5 seconds delay for scheduled retries

// IndexedDB configuration for persisting retry state
const RETRY_DB_NAME = 'smartgrind-sync-retry';
const RETRY_DB_VERSION = 1;
const RETRY_STORE_NAME = 'pending-retries';

interface PersistedRetry {
    id: string;
    operationId: string;
    scheduledFor: number;
    createdAt: number;
}

export class BackgroundSyncManager {
    private operationQueue: OperationQueue;
    private conflictResolver: SyncConflictResolver;
    private isSyncing: boolean = false;
    private syncAbortController: AbortController | null = null;
    private retryCheckInterval: number | null = null;
    private retryDB: IDBDatabase | null = null;

    constructor() {
        this.operationQueue = new OperationQueue();
        this.conflictResolver = new SyncConflictResolver();
        this.initRetryDB().catch((error) => {
            console.warn(
                '[BackgroundSync] Retry DB init failed, continuing without persistence:',
                error
            );
        });
        this.startRetryCheckInterval();
    }

    /**
     * Initialize IndexedDB for persisting retry state
     */
    private async initRetryDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(RETRY_DB_NAME, RETRY_DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.retryDB = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(RETRY_STORE_NAME)) {
                    const store = db.createObjectStore(RETRY_STORE_NAME, { keyPath: 'id' });
                    store.createIndex('scheduledFor', 'scheduledFor', { unique: false });
                }
            };
        });
    }

    /**
     * Start periodic check for pending retries
     * This ensures retries happen even if setTimeout fails due to SW termination
     */
    private startRetryCheckInterval(): void {
        if (this.retryCheckInterval !== null) return;

        // Check if we're in a ServiceWorker context with setInterval available
        const swSelf = self as unknown as ServiceWorkerGlobalScope;
        if (typeof swSelf.setInterval === 'function') {
            this.retryCheckInterval = swSelf.setInterval(() => {
                this.processPersistedRetries().catch((error) => {
                    console.warn('[BackgroundSync] Retry processing error:', error);
                });
            }, PENDING_RETRY_CHECK_INTERVAL_MS);
        }

        // Also process any persisted retries on startup
        this.processPersistedRetries().catch((error) => {
            console.warn('[BackgroundSync] Startup retry processing error:', error);
        });
    }

    /**
     * Persist a retry to IndexedDB so it survives SW termination
     */
    private async persistRetry(operationId: string, delayMs: number): Promise<void> {
        if (!this.retryDB) {
            await this.initRetryDB();
        }

        if (!this.retryDB) return;

        const retry: PersistedRetry = {
            id: `${operationId}-${Date.now()}`,
            operationId,
            scheduledFor: Date.now() + delayMs,
            createdAt: Date.now(),
        };

        return new Promise((resolve, reject) => {
            const transaction = this.retryDB!.transaction(RETRY_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(RETRY_STORE_NAME);
            const request = store.put(retry);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Remove a persisted retry after it's been processed
     */
    private async removePersistedRetry(id: string): Promise<void> {
        if (!this.retryDB) return;

        return new Promise((resolve, reject) => {
            const transaction = this.retryDB!.transaction(RETRY_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(RETRY_STORE_NAME);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Process any persisted retries that are due
     */
    private async processPersistedRetries(): Promise<void> {
        if (!this.retryDB) {
            await this.initRetryDB();
        }

        if (!this.retryDB) return;

        const now = Date.now();

        return new Promise((resolve, reject) => {
            const transaction = this.retryDB!.transaction(RETRY_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(RETRY_STORE_NAME);
            const index = store.index('scheduledFor');
            const range = IDBKeyRange.upperBound(now);
            const request = index.getAll(range);

            request.onsuccess = async () => {
                const retries: PersistedRetry[] = request.result;

                for (const retry of retries) {
                    try {
                        // Trigger sync for this operation
                        await this.syncUserProgress();
                        // Remove the persisted retry after processing
                        await this.removePersistedRetry(retry.id);
                    } catch (error) {
                        console.warn('[BackgroundSync] Individual retry processing failed:', error);
                    }
                }
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Check if we have a stored token in IndexedDB
     * This is used to avoid false AUTH_REQUIRED events when network is unstable
     */
    private async hasStoredToken(): Promise<boolean> {
        try {
            const auth = getAuthManager();
            if (!auth || typeof auth.waitForLoad !== 'function') {
                return false;
            }
            await auth.waitForLoad();
            const authHeaders = await auth.getAuthHeaders();
            return Object.keys(authHeaders).length > 0;
        } catch {
            return false;
        }
    }

    /**
     * Verify authentication: try Bearer token from IndexedDB (set by main app on sign-in),
     * then cookies. SW often does not receive HttpOnly cookies on fetch.
     *
     * If we have a stored token, we assume authentication is valid even if the network
     * request fails. This prevents false AUTH_REQUIRED events when coming back online
     * and the network is still stabilizing.
     */
    private async verifyAuthentication(): Promise<boolean> {
        try {
            const opts = await getAuthFetchOpts();
            const response = await fetch('/smartgrind/api/user?action=csrf', {
                method: 'GET',
                headers: opts.headers,
                credentials: opts.credentials,
            });

            if (response.ok) return true;

            // If we got 401/403, check if we have a stored token
            // If we do, assume it's a network issue and proceed
            if (response.status === 401 || response.status === 403) {
                const hasToken = await this.hasStoredToken();
                if (hasToken) {
                    // We have a stored token, assume network issue
                    return true;
                }
                return false;
            }
            return true;
        } catch {
            // Network error - if we have a stored token, assume authenticated
            const hasToken = await this.hasStoredToken();
            return hasToken;
        }
    }

    /**
     * Register sync tags for background sync
     */
    async registerSync(tag: string): Promise<void> {
        const swSelf = self as unknown as ServiceWorkerGlobalScope;
        const registration = swSelf.registration;
        if (!('sync' in registration)) {
            // Fallback: try immediate sync
            await this.performSync(tag);
            return;
        }

        try {
            await (
                registration as ServiceWorkerRegistration & {
                    sync: { register(_tag: string): Promise<void> };
                }
            ).sync.register(tag);
        } catch (error) {
            console.warn(
                '[BackgroundSync] Background sync registration failed, falling back to immediate sync:',
                error
            );
            // Fallback: try immediate sync
            await this.performSync(tag);
        }
    }

    /**
     * Handle sync event from service worker
     */
    async syncUserProgress(): Promise<void> {
        if (this.isSyncing) {
            return;
        }

        this.isSyncing = true;
        this.syncAbortController = new AbortController();

        // Set up timeout to prevent stuck sync
        const timeoutId = setTimeout(() => {
            this.isSyncing = false;
        }, SYNC_TIMEOUT_MS);

        try {
            // Get pending operations
            const pendingOps = await this.operationQueue.getPendingOperations();
            if (pendingOps.length === 0) {
                return;
            }

            // Check authentication by making a lightweight request to verify session
            // The app uses cookie-based auth, so we verify the session is still valid
            const isAuthenticated = await this.verifyAuthentication();
            if (!isAuthenticated) {
                // Calculate truly pending ops (not yet synced, not being retried)
                const trulyPendingOps = pendingOps.filter((op) => op.retryCount === 0);
                const trulyPendingCount = trulyPendingOps.length;

                // Notify clients that authentication is required
                await this.notifyClients('AUTH_REQUIRED', {
                    message: 'Authentication required for sync.',
                    pendingCount: trulyPendingCount,
                    timestamp: Date.now(),
                });
                return;
            }

            // Group operations by type for efficient batching
            const groupedOps = this.groupOperations(pendingOps);

            // Sync each group with individual error handling
            const failedOps: QueuedOperation[] = [];

            try {
                await this.syncProblemProgressWithTimeout(groupedOps['problemProgress'] || []);
            } catch (error) {
                console.warn('[BackgroundSync] Problem progress sync failed:', error);
                const progressOps = groupedOps['problemProgress'] || [];
                failedOps.push(...progressOps);
            }

            try {
                await this.syncCustomProblemsWithTimeout();
            } catch (error) {
                console.warn('[BackgroundSync] Custom problems sync failed:', error);
                const customOps = groupedOps['customProblems'] || [];
                failedOps.push(...customOps);
            }

            try {
                await this.syncUserSettingsWithTimeout();
            } catch (error) {
                console.warn('[BackgroundSync] User settings sync failed:', error);
                const settingsOps = groupedOps['settings'] || [];
                failedOps.push(...settingsOps);
            }

            // Handle failed operations with exponential backoff
            for (const op of failedOps) {
                await this.handleFailedOperation(op);
            }

            // Update last sync time
            await this.operationQueue.updateLastSyncTime();

            // Get final stats after handling failures
            const finalStats = await this.operationQueue.getStats();

            // Calculate truly pending ops (not yet synced, not being retried)
            // Operations with retryCount > 0 have already been synced at least once
            const trulyPendingOps = pendingOps.filter((op) => op.retryCount === 0);
            const trulyPendingCount = trulyPendingOps.length;

            // Notify clients of sync completion
            await this.notifyClients('COMPLETED', {
                synced: pendingOps.length - failedOps.length,
                failed: failedOps.length,
                pending: trulyPendingCount,
                timestamp: Date.now(),
            });

            // If there are still pending operations, schedule another sync
            if (finalStats.pending > 0) {
                // Use setTimeout to allow other operations to complete
                setTimeout(() => {
                    this.syncUserProgress().catch((error) => {
                        console.warn('[BackgroundSync] Scheduled retry sync failed:', error);
                    });
                }, SCHEDULED_RETRY_DELAY_MS);
            }
        } catch (error) {
            console.warn('[BackgroundSync] Sync operation failed:', error);
            // Sync failed, will be retried
        } finally {
            clearTimeout(timeoutId);
            this.isSyncing = false;
            this.syncAbortController = null;
        }
    }

    /**
     * Handle a failed operation with retry logic
     * Uses both setTimeout for immediate retry and IndexedDB persistence for SW termination recovery
     */
    private async handleFailedOperation(op: QueuedOperation): Promise<void> {
        const retryCount = await this.operationQueue.updateRetryCount(op.id);

        if (retryCount < MAX_RETRY_ATTEMPTS) {
            // Calculate exponential backoff delay
            const delay = RETRY_BASE_DELAY_MS * Math.pow(2, retryCount - 1); // retryCount is already incremented
            const actualDelay = Math.min(delay, RETRY_MAX_DELAY_MS);

            // Persist the retry to IndexedDB so it survives SW termination
            await this.persistRetry(op.id, actualDelay);

            // Also use setTimeout for immediate retry if SW is still running
            setTimeout(async () => {
                try {
                    await this.operationQueue.requeueOperation(op);
                    // Trigger a new sync to process the requeued operation
                    this.syncUserProgress().catch((error) => {
                        console.warn('[BackgroundSync] Requeue sync failed:', error);
                    });
                } catch (error) {
                    console.warn('[BackgroundSync] Requeue operation failed:', error);
                }
            }, actualDelay);
        } else {
            await this.operationQueue.markFailed(op.id, 'Max retries exceeded');
        }
    }

    /**
     * Execute a function with timeout
     */
    private async executeWithTimeout<T>(
        fn: () => Promise<T>,
        timeoutMs: number = REQUEST_TIMEOUT_MS
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Operation timed out after ${timeoutMs}ms`));
            }, timeoutMs);

            fn()
                .then((result) => {
                    clearTimeout(timeoutId);
                    resolve(result);
                })
                .catch((error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                });
        });
    }

    /**
     * Sync custom problems with timeout
     */
    private syncCustomProblemsWithTimeout = () =>
        this.executeWithTimeout(() => this.syncCustomProblems());

    /**
     * Sync user settings with timeout
     */
    private syncUserSettingsWithTimeout = () =>
        this.executeWithTimeout(() => this.syncUserSettings());

    /**
     * Sync custom problems
     */
    async syncCustomProblems(): Promise<void> {
        const pendingOps = await this.operationQueue.getOperationsByType('ADD_CUSTOM_PROBLEM');
        if (pendingOps.length === 0) return;

        for (const op of pendingOps) {
            // Check if sync was aborted
            if (this.syncAbortController?.signal.aborted) {
                throw new Error('Sync aborted');
            }

            try {
                const opts = await getAuthFetchOpts({ 'Content-Type': 'application/json' });
                const response = await fetch('/smartgrind/api/user/custom-problems', {
                    method: 'POST',
                    headers: opts.headers,
                    credentials: opts.credentials,
                    body: JSON.stringify(op.data),
                    signal: this.syncAbortController?.signal || null,
                });

                if (response.ok) {
                    await this.operationQueue.markCompleted(op.id);
                } else if (response.status === 401 || response.status === 403) {
                    // Auth error - check if we have a stored token before notifying
                    // If we do, it's likely a network issue, not an actual auth failure
                    const hasToken = await this.hasStoredToken();
                    if (!hasToken) {
                        await this.notifyClients('AUTH_REQUIRED', {
                            message: 'Authentication required for sync.',
                            timestamp: Date.now(),
                        });
                    }
                    throw new Error('Authentication failed');
                } else if (response.status === 409) {
                    // Conflict - resolve using improved resolver
                    const serverData = await response.json();
                    const resolution = await this.conflictResolver.resolveCustomProblemConflict(
                        op.data as {
                            id: string;
                            name: string;
                            url?: string;
                            category: string;
                            pattern: string;
                            difficulty: 'Easy' | 'Medium' | 'Hard';
                            timestamp: number;
                        },
                        serverData
                    );
                    // Only apply if resolution is not an error
                    if (resolution.status !== 'error') {
                        await this.applyConflictResolution(op.id, resolution);
                    } else {
                        throw new Error(resolution.message || 'Conflict resolution failed');
                    }
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    throw error; // Re-throw abort errors
                }
                // Re-throw other errors to be handled at higher level
                throw error;
            }
        }
    }

    /**
     * Group operations by type for efficient batching
     */
    private groupOperations(operations: QueuedOperation[]): Record<string, QueuedOperation[]> {
        return operations.reduce(
            (groups, op) => {
                let type: string;
                switch (op.type) {
                    case 'MARK_SOLVED':
                    case 'UPDATE_DIFFICULTY':
                    case 'ADD_NOTE':
                    case 'UPDATE_REVIEW_DATE':
                        type = 'problemProgress';
                        break;
                    case 'ADD_CUSTOM_PROBLEM':
                    case 'DELETE_PROBLEM':
                        type = 'customProblems';
                        break;
                    case 'UPDATE_SETTINGS':
                        type = 'settings';
                        break;
                    default:
                        type = 'other';
                }
                if (!groups[type]) groups[type] = [];
                groups[type]!.push(op);
                return groups;
            },
            {} as Record<string, QueuedOperation[]>
        );
    }

    /**
     * Sync user settings - this now performs a full data sync to /api/user
     * The UPDATE_SETTINGS operation contains the full user data
     */
    async syncUserSettings(): Promise<void> {
        const pendingOps = await this.operationQueue.getOperationsByType('UPDATE_SETTINGS');
        if (pendingOps.length === 0) return;

        // Get the most recent settings operation - it contains the full data
        const latestOp = pendingOps[pendingOps.length - 1]!;
        // Note: latestOp is guaranteed to exist because we checked pendingOps.length > 0 above

        try {
            const csrfOpts = await getAuthFetchOpts();
            const csrfResponse = await fetch('/smartgrind/api/user?action=csrf', {
                headers: csrfOpts.headers,
                credentials: csrfOpts.credentials,
            });

            if (!csrfResponse.ok) {
                if (csrfResponse.status === 401 || csrfResponse.status === 403) {
                    // Auth error - check if we have a stored token before notifying
                    const hasToken = await this.hasStoredToken();
                    if (!hasToken) {
                        await this.notifyClients('AUTH_REQUIRED', {
                            message: 'Authentication required for sync.',
                            timestamp: Date.now(),
                        });
                    }
                    throw new Error('Authentication failed');
                }
                throw new Error('Failed to fetch CSRF token');
            }

            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.csrfToken;

            const opts = await getAuthFetchOpts({
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            });
            const response = await fetch('/smartgrind/api/user', {
                method: 'POST',
                headers: opts.headers,
                credentials: opts.credentials,
                body: JSON.stringify({ data: latestOp.data }),
                signal: this.syncAbortController?.signal || null,
            });

            if (response.ok) {
                // Mark all settings operations as completed
                for (const op of pendingOps) {
                    await this.operationQueue.markCompleted(op.id);
                }
            } else if (response.status === 401 || response.status === 403) {
                // Auth error - check if we have a stored token before notifying
                const hasToken = await this.hasStoredToken();
                if (!hasToken) {
                    await this.notifyClients('AUTH_REQUIRED', {
                        message: 'Authentication required for sync.',
                        timestamp: Date.now(),
                    });
                }
                throw new Error('Authentication failed');
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw error;
            }
            // Re-throw other errors to be handled at higher level
            throw error;
        }
    }

    /**
     * Sync problem progress with timeout
     */
    private syncProblemProgressWithTimeout = (operations: QueuedOperation[]) =>
        this.executeWithTimeout(() => this.syncProblemProgress(operations));

    /**
     * Sync problem progress operations
     */
    private async syncProblemProgress(operations: QueuedOperation[]): Promise<void> {
        if (operations.length === 0) return;

        // Deduplicate: keep only the last operation per problem
        const deduplicated = this.deduplicateByProblemId(operations);

        // Batch operations
        const batch = deduplicated.map((op) => ({
            problemId: (op.data as { problemId: string }).problemId,
            operation: op.data,
            timestamp: op.timestamp,
            deviceId: op.deviceId,
        }));

        try {
            const opts = await getAuthFetchOpts({ 'Content-Type': 'application/json' });
            const response = await fetch('/smartgrind/api/user/progress/batch', {
                method: 'POST',
                headers: opts.headers,
                credentials: opts.credentials,
                body: JSON.stringify({
                    operations: batch,
                    clientVersion: 1,
                }),
                signal: this.syncAbortController?.signal || null,
            });

            if (response.ok) {
                const result = await response.json();

                // Mark successful operations as completed
                for (const op of deduplicated) {
                    await this.operationQueue.markCompleted(op.id);
                }

                // Handle any conflicts returned by server using improved resolver
                if (result.conflicts && result.conflicts.length > 0) {
                    for (const conflict of result.conflicts) {
                        await this.handleServerConflictWithAutoResolve(conflict);
                    }
                }

                // Notify clients of successful sync
                const currentStats = await this.operationQueue.getStats();
                await this.notifyClients('PROGRESS_SYNCED', {
                    count: deduplicated.length,
                    pending: currentStats.pending,
                    timestamp: Date.now(),
                });
            } else if (response.status === 401 || response.status === 403) {
                // Auth error - check if we have a stored token before notifying
                const hasToken = await this.hasStoredToken();
                if (!hasToken) {
                    await this.notifyClients('AUTH_REQUIRED', {
                        message: 'Authentication required for sync.',
                        timestamp: Date.now(),
                    });
                }
                throw new Error('Authentication failed');
            } else if (response.status === 409) {
                // Batch conflict - handle individually
                await this.syncIndividualOperations(deduplicated);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw error;
            }
            // Fall back to individual sync
            await this.syncIndividualOperations(deduplicated);
        }
    }

    /**
     * Deduplicate operations by problem ID, keeping the most recent
     */
    private deduplicateByProblemId(operations: QueuedOperation[]): QueuedOperation[] {
        const latestByProblem = new Map<string, QueuedOperation>();

        for (const op of operations) {
            const problemId = (op.data as { problemId: string }).problemId;
            const existing = latestByProblem.get(problemId);

            if (!existing || op.timestamp > existing.timestamp) {
                latestByProblem.set(problemId, op);
            }
        }

        return Array.from(latestByProblem.values());
    }

    /**
     * Sync operations individually (fallback when batch fails)
     */
    private async syncIndividualOperations(operations: QueuedOperation[]): Promise<void> {
        for (const op of operations) {
            // Check if sync was aborted
            if (this.syncAbortController?.signal.aborted) {
                throw new Error('Sync aborted');
            }

            try {
                const opts = await getAuthFetchOpts({ 'Content-Type': 'application/json' });
                const response = await fetch('/smartgrind/api/user/progress', {
                    method: 'POST',
                    headers: opts.headers,
                    credentials: opts.credentials,
                    body: JSON.stringify({
                        problemId: (op.data as { problemId: string }).problemId,
                        operation: op.data,
                        timestamp: op.timestamp,
                        deviceId: op.deviceId,
                    }),
                    signal: this.syncAbortController?.signal || null,
                });

                if (response.ok) {
                    await this.operationQueue.markCompleted(op.id);
                } else if (response.status === 401 || response.status === 403) {
                    // Auth error - check if we have a stored token before notifying
                    const hasToken = await this.hasStoredToken();
                    if (!hasToken) {
                        await this.notifyClients('AUTH_REQUIRED', {
                            message: 'Authentication required for sync.',
                            timestamp: Date.now(),
                        });
                    }
                    throw new Error('Authentication failed');
                } else if (response.status === 409) {
                    const serverData = await response.json();
                    await this.handleServerConflictWithAutoResolve({
                        operationId: op.id,
                        problemId: (op.data as { problemId: string }).problemId,
                        clientData: op.data,
                        serverData: serverData,
                    });
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    throw error;
                }
                // Re-throw other errors to be handled at higher level
                throw error;
            }
        }
    }

    /**
     * Handle server conflict with auto-resolution
     */
    private async handleServerConflictWithAutoResolve(conflict: {
        operationId: string;
        problemId: string;
        clientData: unknown;
        serverData: unknown;
    }): Promise<void> {
        const resolution = await this.conflictResolver.autoResolve(
            conflict.clientData as Record<string, unknown>,
            conflict.serverData as Record<string, unknown>,
            'progress'
        );

        // Only apply if resolution is not an error
        if (resolution.status !== 'error') {
            await this.applyConflictResolution(conflict.operationId, resolution);
        } else {
            // Mark as failed so it can be retried or handled manually
            await this.operationQueue.markFailed(
                conflict.operationId,
                resolution.message || 'Conflict resolution error'
            );
        }
    }

    /**
     * Apply conflict resolution
     */
    private async applyConflictResolution(
        operationId: string,
        resolution: { status: 'resolved' | 'manual' | 'error'; data?: unknown; message?: string }
    ): Promise<void> {
        if (resolution.status === 'resolved') {
            // Auto-resolved, mark as completed
            await this.operationQueue.markCompleted(operationId);

            // Notify clients of the resolution
            await this.notifyClients('CONFLICT_RESOLVED', {
                operationId,
                resolution: resolution.data,
            });
        } else {
            // Requires manual resolution
            await this.operationQueue.markPendingManualResolution(
                operationId,
                resolution.message || ''
            );

            // Notify clients that manual resolution is needed
            await this.notifyClients('CONFLICT_REQUIRES_MANUAL', {
                operationId,
                message: resolution.message,
            });
        }
    }

    /**
     * Perform immediate sync (fallback when Background Sync API is not available)
     */
    async performSync(tag: string): Promise<void> {
        switch (tag) {
            case SYNC_TAGS.USER_PROGRESS:
                await this.syncUserProgress();
                break;
            case SYNC_TAGS.CUSTOM_PROBLEMS:
                await this.syncCustomProblems();
                break;
            case SYNC_TAGS.USER_SETTINGS:
                await this.syncUserSettings();
                break;
            default:
                // Unknown tag, try to sync user progress anyway
                await this.syncUserProgress();
        }
    }

    /**
     * Check and sync if there are pending operations
     */
    async checkAndSync(): Promise<void> {
        const pendingOps = await this.operationQueue.getPendingOperations();
        if (pendingOps.length > 0) {
            await this.syncUserProgress();
        }
    }

    /**
     * Notify all clients of sync events
     */
    private async notifyClients(type: string, data: unknown): Promise<void> {
        const clients = await (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({
            type: 'window',
            includeUncontrolled: true,
        });
        clients.forEach((client: Client) => {
            client.postMessage({
                type: `SYNC_${type}`,
                data,
            });
        });
    }

    /**
     * Get current sync status
     */
    async getSyncStatus(): Promise<{
        pendingCount: number;
        isSyncing: boolean;
        lastSyncAt: number | null;
        failedCount: number;
    }> {
        const pendingOps = await this.operationQueue.getPendingOperations();
        const failedOps = await this.operationQueue.getFailedOperations();

        // Only count operations that haven't been synced yet (retryCount === 0)
        // Operations being retried have already been synced at least once
        const trulyPendingCount = pendingOps.filter((op) => op.retryCount === 0).length;

        return {
            pendingCount: trulyPendingCount,
            isSyncing: this.isSyncing,
            lastSyncAt: await this.operationQueue.getLastSyncTime(),
            failedCount: failedOps.length,
        };
    }

    /**
     * Force immediate sync
     */
    async forceSync(): Promise<{ success: boolean; synced: number; failed: number }> {
        const pendingOps = await this.operationQueue.getPendingOperations();
        if (pendingOps.length === 0) {
            return { success: true, synced: 0, failed: 0 };
        }

        try {
            await this.syncUserProgress();
            const remainingOps = await this.operationQueue.getPendingOperations();
            const failedOps = await this.operationQueue.getFailedOperations();

            return {
                success: remainingOps.length === 0,
                synced: pendingOps.length - remainingOps.length,
                failed: failedOps.length,
            };
        } catch (error) {
            console.warn('[BackgroundSync] Force sync failed:', error);
            return { success: false, synced: 0, failed: pendingOps.length };
        }
    }
}
