// Background Sync Manager for SmartGrind Service Worker
// Handles syncing user progress when connection is restored

import { OperationQueue, QueuedOperation } from './operation-queue';
import { SyncConflictResolver } from './sync-conflict-resolver';
import { AuthManager, getAuthManager } from './auth-manager';

// Sync configuration
const SYNC_TAGS = {
    USER_PROGRESS: 'sync-user-progress',
    CUSTOM_PROBLEMS: 'sync-custom-problems',
    USER_SETTINGS: 'sync-user-settings',
} as const;

const MAX_RETRY_ATTEMPTS = 5;
const SYNC_TIMEOUT_MS = 30000; // 30 seconds timeout for sync batch
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds timeout for individual requests

export class BackgroundSyncManager {
    private operationQueue: OperationQueue;
    private conflictResolver: SyncConflictResolver;
    private authManager: AuthManager;
    private isSyncing: boolean = false;
    private syncAbortController: AbortController | null = null;

    constructor() {
        this.operationQueue = new OperationQueue();
        this.conflictResolver = new SyncConflictResolver();
        this.authManager = getAuthManager();
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
        } catch {
            // Fallback: try immediate sync
            await this.performSync(tag);
        }
    }

    /**
     * Handle sync event from service worker
     */
    async syncUserProgress(): Promise<void> {
        if (this.isSyncing) {
            console.log('[BackgroundSync] Sync already in progress, skipping');
            return;
        }

        this.isSyncing = true;
        this.syncAbortController = new AbortController();

        // Set up timeout to prevent stuck sync
        const timeoutId = setTimeout(() => {
            console.warn('[BackgroundSync] Sync timeout reached, aborting');
            this.syncAbortController?.abort();
            this.isSyncing = false;
        }, SYNC_TIMEOUT_MS);

        try {
            // Get pending operations
            const pendingOps = await this.operationQueue.getPendingOperations();
            if (pendingOps.length === 0) {
                console.log('[BackgroundSync] No pending operations');
                return;
            }

            console.log(`[BackgroundSync] Starting sync of ${pendingOps.length} operations`);

            // Check authentication before syncing
            if (!this.authManager.isAuthenticated()) {
                console.log('[BackgroundSync] Not authenticated, attempting token refresh');
                const token = await this.authManager.refreshToken();
                if (!token) {
                    console.warn('[BackgroundSync] Authentication failed, cannot sync');
                    // Don't mark operations as failed, they will retry when auth is restored
                    return;
                }
            }

            // Group operations by type for efficient batching
            const groupedOps = this.groupOperations(pendingOps);

            // Sync each group with individual error handling
            const failedOps: QueuedOperation[] = [];

            try {
                await this.syncProblemProgressWithTimeout(groupedOps['problemProgress'] || []);
            } catch (error) {
                console.error('[BackgroundSync] Problem progress sync failed:', error);
                failedOps.push(...(groupedOps['problemProgress'] || []));
            }

            try {
                await this.syncCustomProblemsWithTimeout();
            } catch (error) {
                console.error('[BackgroundSync] Custom problems sync failed:', error);
                // Get operations that failed
                const customOps =
                    await this.operationQueue.getOperationsByType('ADD_CUSTOM_PROBLEM');
                failedOps.push(...customOps);
            }

            try {
                await this.syncUserSettingsWithTimeout();
            } catch (error) {
                console.error('[BackgroundSync] User settings sync failed:', error);
                const settingsOps =
                    await this.operationQueue.getOperationsByType('UPDATE_SETTINGS');
                failedOps.push(...settingsOps);
            }

            // Handle failed operations with exponential backoff
            for (const op of failedOps) {
                await this.handleFailedOperation(op);
            }

            // Update last sync time
            await this.operationQueue.updateLastSyncTime();

            // Notify clients of sync completion
            await this.notifyClients('SYNC_COMPLETED', {
                synced: pendingOps.length - failedOps.length,
                failed: failedOps.length,
                timestamp: Date.now(),
            });

            console.log(
                `[BackgroundSync] Sync completed: ${pendingOps.length - failedOps.length} synced, ${failedOps.length} failed`
            );
        } catch (error) {
            console.error('[BackgroundSync] Sync failed with error:', error);
            // Notify clients of sync failure
            await this.notifyClients('SYNC_FAILED', {
                error: error instanceof Error ? error.message : String(error),
                timestamp: Date.now(),
            });
        } finally {
            clearTimeout(timeoutId);
            this.isSyncing = false;
            this.syncAbortController = null;
        }
    }

    /**
     * Handle a failed operation with retry logic
     */
    private async handleFailedOperation(op: QueuedOperation): Promise<void> {
        await this.operationQueue.updateRetryCount(op.id);

        if (op.retryCount < MAX_RETRY_ATTEMPTS) {
            // Calculate exponential backoff delay
            const baseDelay = 1000; // 1 second
            const delay = baseDelay * Math.pow(2, op.retryCount);
            const maxDelay = 60000; // 1 minute max
            const actualDelay = Math.min(delay, maxDelay);

            console.log(
                `[BackgroundSync] Re-queueing operation ${op.id} with ${actualDelay}ms delay (attempt ${op.retryCount + 1}/${MAX_RETRY_ATTEMPTS})`
            );

            // Re-queue with delay
            setTimeout(async () => {
                await this.operationQueue.requeueOperation(op);
            }, actualDelay);
        } else {
            console.error(
                `[BackgroundSync] Operation ${op.id} exceeded max retries, marking as failed`
            );
            await this.operationQueue.markFailed(op.id, 'Max retries exceeded');
        }
    }

    /**
     * Sync custom problems with timeout
     */
    private async syncCustomProblemsWithTimeout(): Promise<void> {
        return this.executeWithTimeout(() => this.syncCustomProblems(), REQUEST_TIMEOUT_MS);
    }

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
                const authHeaders = await this.authManager.getAuthHeaders();

                const response = await fetch('/smartgrind/api/user/custom-problems', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...authHeaders,
                    },
                    credentials: 'include',
                    body: JSON.stringify(op.data),
                    signal: this.syncAbortController?.signal || null,
                });

                if (response.ok) {
                    await this.operationQueue.markCompleted(op.id);
                } else if (response.status === 401 || response.status === 403) {
                    // Auth error - try to refresh and retry once
                    const refreshed = await this.authManager.handleAuthError(response);
                    if (refreshed) {
                        // Retry this operation
                        const retryResponse = await this.authManager.retryWithFreshToken(
                            new Request('/smartgrind/api/user/custom-problems', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify(op.data),
                            }),
                            (req) => fetch(req)
                        );

                        if (retryResponse.ok) {
                            await this.operationQueue.markCompleted(op.id);
                        } else {
                            throw new Error(`Retry failed: ${retryResponse.status}`);
                        }
                    } else {
                        throw new Error('Authentication failed');
                    }
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
                console.error(`[BackgroundSync] Failed to sync custom problem ${op.id}:`, error);
                throw error; // Re-throw to trigger retry logic
            }
        }
    }

    /**
     * Sync user settings with timeout
     */
    private async syncUserSettingsWithTimeout(): Promise<void> {
        return this.executeWithTimeout(() => this.syncUserSettings(), REQUEST_TIMEOUT_MS);
    }

    /**
     * Sync user settings
     */
    async syncUserSettings(): Promise<void> {
        const pendingOps = await this.operationQueue.getOperationsByType('UPDATE_SETTINGS');
        if (pendingOps.length === 0) return;

        // Get the most recent settings operation
        const latestOp = pendingOps[pendingOps.length - 1];
        if (!latestOp) return;

        try {
            const authHeaders = await this.authManager.getAuthHeaders();

            const response = await fetch('/smartgrind/api/user/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders,
                },
                credentials: 'include',
                body: JSON.stringify(latestOp.data),
                signal: this.syncAbortController?.signal || null,
            });

            if (response.ok) {
                // Mark all settings operations as completed
                for (const op of pendingOps) {
                    await this.operationQueue.markCompleted(op.id);
                }
            } else if (response.status === 401 || response.status === 403) {
                // Auth error - try to refresh
                const refreshed = await this.authManager.handleAuthError(response);
                if (refreshed) {
                    // Retry with fresh token
                    const retryResponse = await this.authManager.retryWithFreshToken(
                        new Request('/smartgrind/api/user/settings', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify(latestOp.data),
                        }),
                        (req) => fetch(req)
                    );

                    if (retryResponse.ok) {
                        for (const op of pendingOps) {
                            await this.operationQueue.markCompleted(op.id);
                        }
                    } else {
                        throw new Error(`Retry failed: ${retryResponse.status}`);
                    }
                } else {
                    throw new Error('Authentication failed');
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw error;
            }
            console.error('[BackgroundSync] Failed to sync user settings:', error);
            throw error;
        }
    }

    /**
     * Group operations by type for efficient batching
     */
    private groupOperations(operations: QueuedOperation[]): Record<string, QueuedOperation[]> {
        return operations.reduce(
            (groups, op) => {
                // Map operation types to sync categories
                let category: string;
                switch (op.type) {
                    case 'MARK_SOLVED':
                    case 'UPDATE_DIFFICULTY':
                    case 'ADD_NOTE':
                    case 'UPDATE_REVIEW_DATE':
                        category = 'problemProgress';
                        break;
                    case 'ADD_CUSTOM_PROBLEM':
                    case 'DELETE_PROBLEM':
                        category = 'customProblems';
                        break;
                    case 'UPDATE_SETTINGS':
                        category = 'settings';
                        break;
                    default:
                        category = 'other';
                }

                if (!groups[category]) {
                    groups[category] = [];
                }
                groups[category]!.push(op);
                return groups;
            },
            {} as Record<string, QueuedOperation[]>
        );
    }

    /**
     * Sync problem progress with timeout
     */
    private async syncProblemProgressWithTimeout(operations: QueuedOperation[]): Promise<void> {
        return this.executeWithTimeout(
            () => this.syncProblemProgress(operations),
            REQUEST_TIMEOUT_MS
        );
    }

    /**
     * Execute a function with timeout
     */
    private async executeWithTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
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
            const authHeaders = await this.authManager.getAuthHeaders();

            const response = await fetch('/smartgrind/api/user/progress/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders,
                },
                credentials: 'include',
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
                await this.notifyClients('PROGRESS_SYNCED', {
                    count: deduplicated.length,
                    timestamp: Date.now(),
                });
            } else if (response.status === 401 || response.status === 403) {
                // Auth error - try to refresh and retry
                const refreshed = await this.authManager.handleAuthError(response);
                if (refreshed) {
                    // Retry the batch with fresh token
                    const retryResponse = await this.authManager.retryWithFreshToken(
                        new Request('/smartgrind/api/user/progress/batch', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                operations: batch,
                                clientVersion: 1,
                            }),
                        }),
                        (req) => fetch(req)
                    );

                    if (retryResponse.ok) {
                        for (const op of deduplicated) {
                            await this.operationQueue.markCompleted(op.id);
                        }
                    } else {
                        throw new Error(`Retry failed: ${retryResponse.status}`);
                    }
                } else {
                    throw new Error('Authentication failed');
                }
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
            console.warn(
                '[BackgroundSync] Batch sync failed, falling back to individual sync:',
                error
            );
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
                const authHeaders = await this.authManager.getAuthHeaders();

                const response = await fetch('/smartgrind/api/user/progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...authHeaders,
                    },
                    credentials: 'include',
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
                    // Auth error - try to refresh and retry once
                    const refreshed = await this.authManager.handleAuthError(response);
                    if (refreshed) {
                        const retryResponse = await this.authManager.retryWithFreshToken(
                            new Request('/smartgrind/api/user/progress', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({
                                    problemId: (op.data as { problemId: string }).problemId,
                                    operation: op.data,
                                    timestamp: op.timestamp,
                                    deviceId: op.deviceId,
                                }),
                            }),
                            (req) => fetch(req)
                        );

                        if (retryResponse.ok) {
                            await this.operationQueue.markCompleted(op.id);
                        } else {
                            throw new Error(`Retry failed: ${retryResponse.status}`);
                        }
                    } else {
                        throw new Error('Authentication failed');
                    }
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
                console.error(`[BackgroundSync] Failed to sync operation ${op.id}:`, error);
                // Don't mark as failed here, let the caller handle retry logic
                throw error;
            }
        }
    }

    /**
     * Handle conflict returned by server with auto-resolution
     */
    private async handleServerConflictWithAutoResolve(conflict: {
        operationId: string;
        problemId: string;
        clientData: unknown;
        serverData: unknown;
    }): Promise<void> {
        // Use the improved conflict resolver with auto-resolution
        const resolution = await this.conflictResolver.autoResolve(
            conflict.clientData as {
                problemId: string;
                timestamp: number;
                solved?: boolean;
                solveCount?: number;
                lastReviewed?: number;
                nextReview?: number;
                difficulty?: number;
                notes?: string;
            },
            conflict.serverData as {
                problemId: string;
                timestamp: number;
                solved?: boolean;
                solveCount?: number;
                lastReviewed?: number;
                nextReview?: number;
                difficulty?: number;
                notes?: string;
            },
            'progress' // Default operation type for progress conflicts
        );

        // Only apply if resolution is not an error
        if (resolution.status !== 'error') {
            await this.applyConflictResolution(conflict.operationId, resolution);
        } else {
            console.error(
                `[BackgroundSync] Conflict resolution failed for ${conflict.operationId}:`,
                resolution.message
            );
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
            // Unknown sync tag
        }
    }

    /**
     * Notify all clients of sync events
     */
    private async notifyClients(type: string, data: unknown): Promise<void> {
        const clients = await (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({
            type: 'window',
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

        return {
            pendingCount: pendingOps.length,
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
        } catch (_error) {
            return { success: false, synced: 0, failed: pendingOps.length };
        }
    }
}
