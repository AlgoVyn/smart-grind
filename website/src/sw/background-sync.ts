// Background Sync Manager for SmartGrind Service Worker
// Handles syncing user progress when connection is restored

import { OperationQueue, QueuedOperation } from './operation-queue';
import { SyncConflictResolver } from './sync-conflict-resolver';

// Sync configuration
const SYNC_TAGS = {
    USER_PROGRESS: 'sync-user-progress',
    CUSTOM_PROBLEMS: 'sync-custom-problems',
    USER_SETTINGS: 'sync-user-settings',
} as const;

const MAX_RETRY_ATTEMPTS = 5;

export class BackgroundSyncManager {
    private operationQueue: OperationQueue;
    private conflictResolver: SyncConflictResolver;
    private isSyncing: boolean = false;

    constructor() {
        this.operationQueue = new OperationQueue();
        this.conflictResolver = new SyncConflictResolver();
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
            return;
        }

        this.isSyncing = true;

        try {
            // Get pending operations
            const pendingOps = await this.operationQueue.getPendingOperations();
            if (pendingOps.length === 0) {
                return;
            }

            // Group operations by type for efficient batching
            const groupedOps = this.groupOperations(pendingOps);

            // Sync each group
            const results = await Promise.allSettled([
                this.syncProblemProgress(groupedOps['problemProgress'] || []),
                this.syncCustomProblems(),
                this.syncUserSettings(),
            ]);

            // Handle results
            const failedOps: QueuedOperation[] = [];
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    // Add operations back to queue with increased retry count
                    const ops = Object.values(groupedOps)[index] || [];
                    failedOps.push(...ops);
                }
            });

            // Re-queue failed operations
            for (const op of failedOps) {
                await this.operationQueue.updateRetryCount(op.id);
                if (op.retryCount < MAX_RETRY_ATTEMPTS) {
                    await this.operationQueue.requeueOperation(op);
                } else {
                    await this.operationQueue.markFailed(op.id, 'Max retries exceeded');
                }
            }

            // Notify clients of sync completion
            await this.notifyClients('SYNC_COMPLETED', {
                synced: pendingOps.length - failedOps.length,
                failed: failedOps.length,
            });
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Sync custom problems
     */
    async syncCustomProblems(): Promise<void> {
        const pendingOps = await this.operationQueue.getOperationsByType('ADD_CUSTOM_PROBLEM');
        if (pendingOps.length === 0) return;

        for (const op of pendingOps) {
            try {
                const response = await fetch('/smartgrind/api/user/custom-problems', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(op.data),
                });

                if (response.ok) {
                    await this.operationQueue.markCompleted(op.id);
                } else if (response.status === 409) {
                    // Conflict - resolve
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
                    await this.applyConflictResolution(op.id, resolution);
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (_error) {
                await this.operationQueue.updateRetryCount(op.id);
            }
        }
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
            const response = await fetch('/smartgrind/api/user/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(latestOp.data),
            });

            if (response.ok) {
                // Mark all settings operations as completed
                for (const op of pendingOps) {
                    await this.operationQueue.markCompleted(op.id);
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (_error) {
            await this.operationQueue.updateRetryCount(latestOp.id);
        }
    }

    /**
     * Group operations by type for efficient batching
     */
    private groupOperations(operations: QueuedOperation[]): Record<string, QueuedOperation[]> {
        return operations.reduce(
            (groups, op) => {
                const type = op.type;
                if (!groups[type]) {
                    groups[type] = [];
                }
                groups[type].push(op);
                return groups;
            },
            {} as Record<string, QueuedOperation[]>
        );
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
            const response = await fetch('/smartgrind/api/user/progress/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    operations: batch,
                    clientVersion: 1,
                }),
            });

            if (response.ok) {
                const result = await response.json();

                // Mark successful operations as completed
                for (const op of deduplicated) {
                    await this.operationQueue.markCompleted(op.id);
                }

                // Handle any conflicts returned by server
                if (result.conflicts && result.conflicts.length > 0) {
                    for (const conflict of result.conflicts) {
                        await this.handleServerConflict(conflict);
                    }
                }

                // Notify clients of successful sync
                await this.notifyClients('PROGRESS_SYNCED', {
                    count: deduplicated.length,
                    timestamp: Date.now(),
                });
            } else if (response.status === 409) {
                // Batch conflict - handle individually
                await this.syncIndividualOperations(deduplicated);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (_error) {
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
            try {
                const response = await fetch('/smartgrind/api/user/progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        problemId: (op.data as { problemId: string }).problemId,
                        operation: op.data,
                        timestamp: op.timestamp,
                        deviceId: op.deviceId,
                    }),
                });

                if (response.ok) {
                    await this.operationQueue.markCompleted(op.id);
                } else if (response.status === 409) {
                    const serverData = await response.json();
                    await this.handleServerConflict({
                        operationId: op.id,
                        problemId: (op.data as { problemId: string }).problemId,
                        clientData: op.data,
                        serverData: serverData,
                    });
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (_error) {
                await this.operationQueue.updateRetryCount(op.id);
            }
        }
    }

    /**
     * Handle conflict returned by server
     */
    private async handleServerConflict(conflict: {
        operationId: string;
        problemId: string;
        clientData: unknown;
        serverData: unknown;
    }): Promise<void> {
        const resolution = await this.conflictResolver.resolveProgressConflict(
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
            }
        );

        await this.applyConflictResolution(conflict.operationId, resolution);
    }

    /**
     * Apply conflict resolution
     */
    private async applyConflictResolution(
        operationId: string,
        resolution: { status: 'resolved' | 'manual'; data?: unknown; message?: string }
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
    private async performSync(tag: string): Promise<void> {
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
