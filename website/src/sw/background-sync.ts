// Background Sync Manager for SmartGrind Service Worker

import { getAuthManager } from './auth-manager';
import { OperationQueue, QueuedOperation } from './operation-queue';
import { SyncConflictResolver } from './sync-conflict-resolver';
import { SYNC_TAGS } from '../sw-register';

/** Promisify IndexedDB request */
import { promisifyRequest } from '../utils/indexeddb-helper';

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
        // IndexedDB or auth not available (tests)
    }
    return { headers: extraHeaders, credentials: 'include' };
}

// Configuration
const CONFIG = {
    MAX_RETRY_ATTEMPTS: 5,
    SYNC_TIMEOUT_MS: 60000,
    REQUEST_TIMEOUT_MS: 15000,
    RETRY_CHECK_INTERVAL_MS: 30000,
    RETRY_BASE_DELAY_MS: 1000,
    RETRY_MAX_DELAY_MS: 60000,
    SCHEDULED_RETRY_DELAY_MS: 5000,
} as const;

// SYNC_TAGS imported from sw-register.ts - single source of truth

const RETRY_DB_NAME = 'smartgrind-sync-retry';
const RETRY_STORE_NAME = 'pending-retries';

/** How long a fetched CSRF token is reused by the service worker */
const CSRF_TOKEN_TTL_MS = 30 * 60 * 1000;

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
    private csrfToken: string | null = null;
    private csrfTokenExpiresAt: number = 0;
    private lastAuthRequiredNoticeAt: number = 0;

    /** Minimum gap between AUTH_REQUIRED notifications to clients */
    private static readonly AUTH_REQUIRED_NOTICE_INTERVAL_MS = 5 * 60 * 1000;

    constructor(operationQueue?: OperationQueue) {
        // Accept an injected queue so the service worker and the sync manager
        // share one OperationQueue instead of creating divergent instances
        this.operationQueue = operationQueue ?? new OperationQueue();
        this.conflictResolver = new SyncConflictResolver();
        this.initRetryDB().catch((error) => {
            console.warn(
                '[BackgroundSync] Retry DB init failed, continuing without persistence:',
                error
            );
        });
        this.startRetryCheckInterval();
    }

    /** Whether a sync run is currently in flight (used for GET_SYNC_STATUS) */
    get syncing(): boolean {
        return this.isSyncing;
    }

    /**
     * Initialize IndexedDB for persisting retry state
     */
    private async initRetryDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(RETRY_DB_NAME, 1);

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
            }, CONFIG.RETRY_CHECK_INTERVAL_MS);
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

        const transaction = this.retryDB.transaction(RETRY_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(RETRY_STORE_NAME);
        await promisifyRequest(store.put(retry));
    }

    /**
     * Remove a persisted retry after it's been processed
     */
    private async removePersistedRetry(id: string): Promise<void> {
        if (!this.retryDB) return;
        const transaction = this.retryDB.transaction(RETRY_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(RETRY_STORE_NAME);
        await promisifyRequest(store.delete(id));
    }

    /**
     * True when an operation's last failure looks transient (network error,
     * timeout, 429 or 5xx). Permanent failures (4xx, invalid payloads,
     * unresolvable conflicts) must not be retried forever.
     */
    private isRetryableFailure(errorMessage: string | undefined): boolean {
        if (!errorMessage) return false;

        const httpMatch = errorMessage.match(/HTTP\s+(\d{3})/i);
        if (httpMatch?.[1]) {
            const status = Number(httpMatch[1]);
            return status === 408 || status === 425 || status === 429 || status >= 500;
        }

        return /network|fetch|timeout|timed out|aborted|offline/i.test(errorMessage);
    }

    /**
     * Move transiently failed operations back into the pending queue so a
     * temporary outage cannot permanently lose offline data. Permanent
     * failures stay parked, and requeued operations keep their retry count so
     * they get one attempt per requeue cycle instead of a fresh
     * MAX_RETRY_ATTEMPTS burst every 30 seconds.
     */
    private async requeueFailedOperations(): Promise<void> {
        try {
            const failedOps = await this.operationQueue.getFailedOperations();
            for (const op of failedOps) {
                if (!this.isRetryableFailure(op.errorMessage)) continue;
                await this.operationQueue.requeueOperation(op);
            }
        } catch (error) {
            console.warn('[BackgroundSync] Requeueing failed operations error:', error);
        }
    }

    /** Invalidate the cached CSRF token after an auth rejection */
    private invalidateCsrfToken(): void {
        this.csrfToken = null;
        this.csrfTokenExpiresAt = 0;
    }

    /** Store a token returned by `GET /api/user?action=csrf` */
    private async captureCsrfToken(response: Response): Promise<void> {
        try {
            const { csrfToken } = (await this.parseJsonResponse(response)) as {
                csrfToken?: string;
            };
            if (csrfToken) {
                this.csrfToken = csrfToken;
                this.csrfTokenExpiresAt = Date.now() + CSRF_TOKEN_TTL_MS;
            }
        } catch {
            // Non-JSON response (e.g. tests): getCsrfToken() fetches on demand
        }
    }

    /**
     * Returns a valid CSRF token for state-changing requests. The incremental
     * sync endpoints require the same CSRF protection as the full-blob save.
     */
    private async getCsrfToken(): Promise<string> {
        if (this.csrfToken && Date.now() < this.csrfTokenExpiresAt) {
            return this.csrfToken;
        }

        const opts = await getAuthFetchOpts();
        const response = await fetch('/smartgrind/api/user?action=csrf', {
            headers: opts.headers,
            credentials: opts.credentials,
            signal: this.syncAbortController?.signal || null,
        });

        if (response.status === 401 || response.status === 403) {
            this.invalidateCsrfToken();
            await this.handleAuthError();
            throw new Error('Authentication failed');
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch CSRF token (HTTP ${response.status})`);
        }

        const { csrfToken } = (await this.parseJsonResponse(response)) as {
            csrfToken?: string;
        };
        if (!csrfToken) {
            throw new Error('Failed to fetch CSRF token');
        }

        this.csrfToken = csrfToken;
        this.csrfTokenExpiresAt = Date.now() + CSRF_TOKEN_TTL_MS;
        return csrfToken;
    }

    /**
     * Process any persisted retries that are due
     */
    private async processPersistedRetries(): Promise<void> {
        if (!this.retryDB) await this.initRetryDB();
        if (!this.retryDB) return;

        try {
            // Requeue parked failures first so the sync below gives them a
            // fresh attempt
            await this.requeueFailedOperations();

            const transaction = this.retryDB.transaction(RETRY_STORE_NAME, 'readwrite');
            const store = transaction.objectStore(RETRY_STORE_NAME);
            const index = store.index('scheduledFor');
            const retries = await promisifyRequest<PersistedRetry[]>(
                index.getAll(IDBKeyRange.upperBound(Date.now()))
            );

            // One sync run processes every due retry. The records are only
            // dropped when the sync actually succeeded — syncUserProgress
            // resolves even on total failure, so deleting unconditionally here
            // would defeat SW-termination recovery.
            const ok = await this.syncUserProgress();
            if (!ok) return;

            for (const retry of retries) {
                await this.removePersistedRetry(retry.id);
            }
        } catch (error) {
            // Database connection may be closing, ignore and retry later
            if (error instanceof Error && error.name === 'InvalidStateError') {
                this.retryDB = null; // Reset to reinitialize on next attempt
            }
        }
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
     * Semantics:
     * - Explicit 401/403 means the server rejected our credentials — the stored
     *   token is stale, so this reports unauthenticated (presence of a stored
     *   token is not proof of validity).
     * - Network errors are optimistic: with a stored token we assume the session
     *   is fine to avoid false AUTH_REQUIRED events while the network stabilizes.
     */
    private async verifyAuthentication(): Promise<boolean> {
        // A cached CSRF token proves the session was verified recently. Reuse
        // it instead of minting a new token on every probe.
        if (this.csrfToken && Date.now() < this.csrfTokenExpiresAt) {
            this.lastAuthRequiredNoticeAt = 0;
            return true;
        }

        try {
            const opts = await getAuthFetchOpts();
            const response = await fetch('/smartgrind/api/user?action=csrf', {
                method: 'GET',
                headers: opts.headers,
                credentials: opts.credentials,
            });

            if (response.ok) {
                // Keep the token so the incremental sync POSTs can use it
                await this.captureCsrfToken(response);
                this.lastAuthRequiredNoticeAt = 0;
                return true;
            }

            // Server explicitly rejected the session
            if (response.status === 401 || response.status === 403) {
                this.invalidateCsrfToken();
                return false;
            }
            // Other statuses (5xx, 429, ...) — server is reachable; let the
            // sync attempt proceed and handle failures per operation
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
     * Handle sync event from service worker.
     * @returns True when the run left no work behind (nothing pending, or all
     * pending work was sent successfully) — callers use this to decide whether
     * persisted retry records can be dropped.
     */
    async syncUserProgress(): Promise<boolean> {
        if (this.isSyncing) {
            // A run is already in flight; it will process these operations
            return true;
        }

        // Skip entirely when offline: avoids doomed network probes and spurious
        // AUTH_REQUIRED notifications (offline is not an auth problem)
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            console.log('[BackgroundSync] Offline, skipping sync');
            return false;
        }

        this.isSyncing = true;
        this.syncAbortController = new AbortController();

        // Set up timeout to prevent stuck sync. Note: isSyncing is NOT cleared
        // here — the aborted run is still unwinding, and clearing the flag now
        // would let a new sync interleave with it. The finally block clears it.
        const timeoutId = setTimeout(() => {
            console.warn('[BackgroundSync] Sync timeout reached, aborting');
            this.syncAbortController?.abort();
        }, CONFIG.SYNC_TIMEOUT_MS);

        try {
            // Get pending operations
            const pendingOps = await this.operationQueue.getPendingOperations();
            if (pendingOps.length === 0) {
                return true;
            }

            // Check authentication by making a lightweight request to verify session
            // The app uses cookie-based auth, so we verify the session is still valid
            const isAuthenticated = await this.verifyAuthentication();
            if (!isAuthenticated) {
                // Calculate truly pending ops (not yet synced, not being retried)
                const trulyPendingOps = pendingOps.filter((op) => op.retryCount === 0);
                const trulyPendingCount = trulyPendingOps.length;

                // Notify clients that authentication is required
                await this.notifyAuthRequired({ pendingCount: trulyPendingCount });
                return false;
            }

            // Group operations by type for efficient batching
            const groupedOps = this.groupOperations(pendingOps);

            // Sync each group with individual error handling. The failure
            // reason is kept so permanent errors can be parked instead of
            // being retried forever.
            const failedOps: Array<{ op: QueuedOperation; error: unknown }> = [];

            try {
                await this.syncProblemProgressWithTimeout(groupedOps['problemProgress'] || []);
            } catch (error) {
                console.warn('[BackgroundSync] Problem progress sync failed:', error);
                const progressOps = groupedOps['problemProgress'] || [];
                failedOps.push(...progressOps.map((op) => ({ op, error })));
            }

            try {
                await this.syncCustomProblemsWithTimeout();
            } catch (error) {
                console.warn('[BackgroundSync] Custom problems sync failed:', error);
                const customOps = groupedOps['customProblems'] || [];
                failedOps.push(...customOps.map((op) => ({ op, error })));
            }

            try {
                await this.syncUserSettingsWithTimeout();
            } catch (error) {
                console.warn('[BackgroundSync] User settings sync failed:', error);
                const settingsOps = groupedOps['settings'] || [];
                failedOps.push(...settingsOps.map((op) => ({ op, error })));
            }

            // Handle failed operations with exponential backoff
            for (const { op, error } of failedOps) {
                await this.handleFailedOperation(op, error);
            }

            // Update last sync time
            await this.operationQueue.updateLastSyncTime();

            // Get fresh pending operations count after marking completed
            const remainingPendingOps = await this.operationQueue.getPendingOperations();
            const trulyPendingCount = remainingPendingOps.filter(
                (op) => op.retryCount === 0
            ).length;

            // Notify clients of sync completion
            await this.notifyClients('COMPLETED', {
                synced: pendingOps.length - failedOps.length,
                failed: failedOps.length,
                pending: trulyPendingCount,
                timestamp: Date.now(),
            });

            // If there are still pending operations, schedule another sync
            if (remainingPendingOps.length > 0) {
                // Use setTimeout to allow other operations to complete
                setTimeout(() => {
                    this.syncUserProgress().catch((error) => {
                        console.warn('[BackgroundSync] Scheduled retry sync failed:', error);
                    });
                }, CONFIG.SCHEDULED_RETRY_DELAY_MS);
            }

            return failedOps.length === 0;
        } catch (error) {
            console.warn('[BackgroundSync] Sync operation failed:', error);
            return false;
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
    private async handleFailedOperation(op: QueuedOperation, error?: unknown): Promise<void> {
        const retryCount = await this.operationQueue.updateRetryCount(op.id);

        if (retryCount < CONFIG.MAX_RETRY_ATTEMPTS) {
            // Calculate exponential backoff delay
            const delay = CONFIG.RETRY_BASE_DELAY_MS * Math.pow(2, retryCount - 1);
            const actualDelay = Math.min(delay, CONFIG.RETRY_MAX_DELAY_MS);

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
            const detail =
                error instanceof Error
                    ? error.message
                    : error !== undefined
                      ? String(error)
                      : 'unknown error';
            await this.operationQueue.markFailed(op.id, `Max retries exceeded: ${detail}`);
        }
    }

    /**
     * Execute a function with timeout
     */
    private async executeWithTimeout<T>(
        fn: () => Promise<T>,
        timeoutMs: number = CONFIG.REQUEST_TIMEOUT_MS
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

    /** Handle auth error (401/403): the server explicitly rejected the
     * session, so always notify clients — a stale stored token must not
     * suppress the AUTH_REQUIRED signal. */
    private async handleAuthError(): Promise<void> {
        // The server rejected the session; do not keep presenting the old
        // token on the next sync attempt.
        this.invalidateCsrfToken();
        await this.notifyAuthRequired();
    }

    /**
     * Notify clients that sync needs authentication, throttled so a pending
     * queue with an expired session does not open the sign-in modal and show a
     * toast every retry cycle.
     */
    private async notifyAuthRequired(data: Record<string, unknown> = {}): Promise<void> {
        const now = Date.now();
        if (
            now - this.lastAuthRequiredNoticeAt <
            BackgroundSyncManager.AUTH_REQUIRED_NOTICE_INTERVAL_MS
        ) {
            return;
        }
        this.lastAuthRequiredNoticeAt = now;
        await this.notifyClients('AUTH_REQUIRED', {
            message: 'Authentication required for sync.',
            timestamp: now,
            ...data,
        });
    }

    /** Check if sync was aborted and throw if so */
    private checkAborted(): void {
        if (this.syncAbortController?.signal.aborted) {
            throw new Error('Sync aborted');
        }
    }

    /** Sync custom problems */
    async syncCustomProblems(): Promise<void> {
        const addOps = await this.operationQueue.getOperationsByType('ADD_CUSTOM_PROBLEM');
        const deleteOps = await this.operationQueue.getOperationsByType('DELETE_PROBLEM');
        if (addOps.length === 0 && deleteOps.length === 0) return;

        // Both op types are handled here: sending only adds left deletes
        // queued forever, producing an endless 5-second sync cycle while the
        // deletion never reached the server.
        for (const op of addOps) {
            await this.syncCustomProblemOperation(op, {
                action: 'upsert',
                problem: op.data as Record<string, unknown>,
            });
        }
        for (const op of deleteOps) {
            const problemId = (op.data as { problemId?: string }).problemId;
            await this.syncCustomProblemOperation(op, { action: 'delete', problemId });
        }
    }

    /**
     * Send one custom-problem operation to /api/user/custom-problems and
     * resolve the queue entry.
     */
    private async syncCustomProblemOperation(
        op: QueuedOperation,
        body: Record<string, unknown>
    ): Promise<void> {
        this.checkAborted();

        const csrfToken = await this.getCsrfToken();
        const opts = await getAuthFetchOpts({
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
        });
        const response = await fetch('/smartgrind/api/user/custom-problems', {
            method: 'POST',
            headers: opts.headers,
            credentials: opts.credentials,
            body: JSON.stringify(body),
            signal: this.syncAbortController?.signal || null,
        });

        if (response.ok) {
            // 200 + JSON proves the server actually processed the request
            await this.parseJsonResponse(response);
            await this.operationQueue.markCompleted(op.id);
        } else if (response.status === 401 || response.status === 403) {
            await this.handleAuthError();
            throw new Error('Authentication failed');
        } else if (response.status === 409) {
            const serverData = await this.parseJsonResponse(response);
            const resolution = await this.conflictResolver.resolveCustomProblemConflict(
                op.data as {
                    id: string;
                    name: string;
                    difficulty: 'Easy' | 'Medium' | 'Hard';
                } & Record<string, unknown>,
                serverData as Record<string, unknown>
            );
            if (resolution.status !== 'error') {
                await this.applyConflictResolution(op.id, resolution);
            } else {
                throw new Error(resolution.message || 'Conflict resolution failed');
            }
        } else {
            throw new Error(`HTTP ${response.status}`);
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

    /** Sync user settings - performs full data sync to /api/user */
    async syncUserSettings(): Promise<void> {
        const pendingOps = await this.operationQueue.getOperationsByType('UPDATE_SETTINGS');
        if (pendingOps.length === 0) return;

        const latestOp = pendingOps[pendingOps.length - 1]!;

        const csrfToken = await this.getCsrfToken();
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
            for (const op of pendingOps) {
                await this.operationQueue.markCompleted(op.id);
            }
        } else if (response.status === 401 || response.status === 403) {
            await this.handleAuthError();
            throw new Error('Authentication failed');
        } else {
            throw new Error(`HTTP ${response.status}`);
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

        // Merge partial updates per problem instead of dropping superseded
        // ops: a field-wise merge preserves data (e.g. a note set before a
        // status change) and avoids extra sync rounds for deferred ops.
        const { merged, skippedIds } = this.mergeByProblemId(operations);

        // Ops with no problemId can never be sent. Park them as failed so they
        // do not stay pending forever and trigger the 5-second resync loop.
        for (const id of skippedIds) {
            await this.operationQueue.markFailed(id, 'Queued operation is missing problemId');
        }
        if (merged.length === 0) return;

        // Batch operations
        const batch = merged.map(({ op }) => ({
            problemId: (op.data as { problemId: string }).problemId,
            operation: op.data,
            timestamp: op.timestamp,
            deviceId: op.deviceId,
        }));

        try {
            const csrfToken = await this.getCsrfToken();
            const opts = await getAuthFetchOpts({
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            });
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
                const result = (await this.parseJsonResponse(response)) as {
                    conflicts?: unknown[];
                };

                // Mark every operation folded into the merged ops as completed
                for (const { sourceIds } of merged) {
                    for (const id of sourceIds) {
                        await this.operationQueue.markCompleted(id);
                    }
                }

                // Handle any conflicts returned by server using improved resolver
                if (result.conflicts && result.conflicts.length > 0) {
                    for (const conflict of result.conflicts) {
                        await this.handleServerConflictWithAutoResolve(
                            conflict as {
                                operationId: string;
                                problemId: string;
                                clientData: unknown;
                                serverData: unknown;
                            }
                        );
                    }
                }

                // Notify clients of successful sync
                const currentStats = await this.operationQueue.getStats();
                await this.notifyClients('PROGRESS_SYNCED', {
                    count: merged.length,
                    pending: currentStats.pending,
                    timestamp: Date.now(),
                });
            } else if (response.status === 401 || response.status === 403) {
                await this.handleAuthError();
                throw new Error('Authentication failed');
            } else if (response.status === 409) {
                // Batch conflict - handle individually
                await this.syncIndividualOperations(merged.map((m) => m.op));
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw error;
            }
            // An auth rejection applies to every operation; retrying them
            // individually would only produce duplicate AUTH_REQUIRED events.
            if (error instanceof Error && error.message === 'Authentication failed') {
                throw error;
            }
            // Fall back to individual sync
            await this.syncIndividualOperations(merged.map((m) => m.op));
        }
    }

    /**
     * Merge progress operations per problem, combining partial updates
     * field-by-field. Operations are applied in timestamp order and later
     * operations win per field. Each merged op carries the ids of all
     * operations folded into it so every source op can be marked completed.
     * Operations without a problemId cannot be sent and are returned in
     * `skippedIds` so the caller can park them.
     */
    private mergeByProblemId(operations: QueuedOperation[]): {
        merged: Array<{ op: QueuedOperation; sourceIds: string[] }>;
        skippedIds: string[];
    } {
        const sorted = [...operations].sort((a, b) => a.timestamp - b.timestamp);
        const mergedByProblem = new Map<string, { op: QueuedOperation; sourceIds: string[] }>();
        const skippedIds: string[] = [];

        for (const op of sorted) {
            const problemId = (op.data as { problemId?: string }).problemId;
            if (!problemId) {
                skippedIds.push(op.id);
                continue;
            }

            const existing = mergedByProblem.get(problemId);
            if (!existing) {
                mergedByProblem.set(problemId, { op: { ...op }, sourceIds: [op.id] });
                continue;
            }

            existing.op = {
                ...existing.op,
                data: {
                    ...(existing.op.data as Record<string, unknown>),
                    ...(op.data as Record<string, unknown>),
                },
                timestamp: op.timestamp,
                deviceId: op.deviceId,
            };
            existing.sourceIds.push(op.id);
        }

        return { merged: Array.from(mergedByProblem.values()), skippedIds };
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
                const csrfToken = await this.getCsrfToken();
                const opts = await getAuthFetchOpts({
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                });
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
                    await this.parseJsonResponse(response);
                    await this.operationQueue.markCompleted(op.id);
                } else if (response.status === 401 || response.status === 403) {
                    await this.handleAuthError();
                    throw new Error('Authentication failed');
                } else if (response.status === 409) {
                    const serverData = await this.parseJsonResponse(response);
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
        // Give parked failures a fresh attempt on every sync trigger
        await this.requeueFailedOperations();

        const pendingOps = await this.operationQueue.getPendingOperations();
        if (pendingOps.length > 0) {
            await this.syncUserProgress();
        }
    }

    /**
     * Verify the response is actually JSON from our API before trusting it.
     * The SPA fallback in _redirects answers unknown paths with index.html and
     * HTTP 200, so an ok status alone does not prove the server processed the
     * request.
     */
    private async parseJsonResponse(response: Response): Promise<unknown> {
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            throw new Error(`Unexpected response content type: ${contentType || 'none'}`);
        }
        return response.json();
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
