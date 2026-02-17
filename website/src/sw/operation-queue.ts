// Operation Queue for SmartGrind Service Worker
// Manages pending operations for background sync with deduplication

// IndexedDB configuration
const DB_NAME = 'smartgrind-sync';
const DB_VERSION = 1;
const STORE_NAME = 'operation-queue';

// Operation types
export type OperationType =
    | 'MARK_SOLVED'
    | 'UPDATE_REVIEW_DATE'
    | 'UPDATE_DIFFICULTY'
    | 'ADD_NOTE'
    | 'ADD_CUSTOM_PROBLEM'
    | 'DELETE_PROBLEM'
    | 'UPDATE_SETTINGS';

export interface QueuedOperation {
    id: string;
    type: OperationType;
    data: unknown;
    timestamp: number;
    deviceId: string;
    retryCount: number;
    status: 'pending' | 'completed' | 'failed' | 'manual-resolution';
    errorMessage?: string;
    createdAt: number;
}

interface OperationQueueStats {
    pending: number;
    completed: number;
    failed: number;
    manual: number;
}

export class OperationQueue {
    private db: IDBDatabase | null = null;
    private dbInitPromise: Promise<IDBDatabase> | null = null;

    /**
     * Initialize IndexedDB connection with proper locking to prevent race conditions
     */
    private async initDB(): Promise<IDBDatabase> {
        // If already initialized, return the DB
        if (this.db) return this.db;

        // If initialization is in progress, wait for it
        if (this.dbInitPromise) return this.dbInitPromise;

        // Start initialization
        this.dbInitPromise = this.performDBInit();

        try {
            return await this.dbInitPromise;
        } finally {
            // Clear the promise after completion so future calls can reinitialize if needed
            this.dbInitPromise = null;
        }
    }

    /**
     * Perform the actual DB initialization
     */
    private async performDBInit(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('status', 'status', { unique: false });
                    store.createIndex('type', 'type', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('problemId', 'data.problemId', { unique: false });
                }
                // Create meta store for device ID and sync time
                if (!db.objectStoreNames.contains('meta')) {
                    db.createObjectStore('meta', { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * Generate unique operation ID
     */
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get device ID (stored in IndexedDB or generate new)
     */
    private async getDeviceId(): Promise<string> {
        const db = await this.initDB();
        const transaction = db.transaction('meta', 'readonly');
        const store = transaction.objectStore('meta');
        const request = store.get('deviceId');

        return new Promise((resolve) => {
            request.onsuccess = () => {
                if (request.result) {
                    resolve(request.result.value);
                } else {
                    // Generate and store new device ID
                    const newDeviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const writeTransaction = db.transaction('meta', 'readwrite');
                    const writeStore = writeTransaction.objectStore('meta');
                    writeStore.put({ key: 'deviceId', value: newDeviceId });
                    resolve(newDeviceId);
                }
            };
            request.onerror = () => {
                // Fallback to temporary device ID
                resolve(`temp-${Date.now()}`);
            };
        });
    }

    /**
     * Add a single operation to the queue
     */
    async addOperation(
        type: OperationType,
        data: unknown,
        options: { deduplicate?: boolean; dedupeKey?: string } = {}
    ): Promise<string> {
        const db = await this.initDB();

        // Check for duplicates if requested
        if (options.deduplicate && options.dedupeKey) {
            const existing = await this.findDuplicate(type, options.dedupeKey);
            if (existing) {
                // Update existing operation with new data
                await this.updateOperation(existing.id, { data, timestamp: Date.now() });
                return existing.id;
            }
        }

        const operation: QueuedOperation = {
            id: this.generateId(),
            type,
            data,
            timestamp: Date.now(),
            deviceId: await this.getDeviceId(),
            retryCount: 0,
            status: 'pending',
            createdAt: Date.now(),
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(operation);

            request.onsuccess = () => {
                resolve(operation.id);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Add multiple operations to the queue
     */
    async addOperations(
        operations: Array<{ type: OperationType; data: unknown }>
    ): Promise<string[]> {
        const ids: string[] = [];
        for (const op of operations) {
            const id = await this.addOperation(op.type, op.data);
            ids.push(id);
        }
        return ids;
    }

    /**
     * Find duplicate operation by type and key
     */
    private async findDuplicate(type: OperationType, key: string): Promise<QueuedOperation | null> {
        const pending = await this.getPendingOperations();
        return pending.find((op) => op.type === type && this.getDedupeKey(op) === key) || null;
    }

    /**
     * Get deduplication key for an operation
     */
    private getDedupeKey(operation: QueuedOperation): string {
        // Extract a unique key based on operation type and data
        const data = operation.data as Record<string, unknown>;
        switch (operation.type) {
            case 'MARK_SOLVED':
            case 'UPDATE_REVIEW_DATE':
            case 'UPDATE_DIFFICULTY':
            case 'ADD_NOTE':
                return `${operation.type}-${data?.['problemId']}`;
            case 'ADD_CUSTOM_PROBLEM':
                return `${operation.type}-${data?.['name']}`;
            case 'DELETE_PROBLEM':
                return `${operation.type}-${data?.['problemId']}`;
            case 'UPDATE_SETTINGS':
                return operation.type;
            default:
                return `${operation.type}-${Date.now()}`;
        }
    }

    /**
     * Update an existing operation
     */
    private async updateOperation(id: string, updates: Partial<QueuedOperation>): Promise<void> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const operation = getRequest.result;
                if (operation) {
                    Object.assign(operation, updates);
                    const putRequest = store.put(operation);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    reject(new Error(`Operation ${id} not found`));
                }
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    /**
     * Get all pending operations
     */
    async getPendingOperations(): Promise<QueuedOperation[]> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('status');
            const request = index.getAll('pending');

            request.onsuccess = () => {
                // Sort by timestamp (oldest first)
                const ops = request.result.sort(
                    (a: QueuedOperation, b: QueuedOperation) => a.timestamp - b.timestamp
                );
                resolve(ops);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get operations by type
     */
    async getOperationsByType(type: OperationType): Promise<QueuedOperation[]> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('type');
            const request = index.getAll(type);

            request.onsuccess = () => {
                const ops = request.result.filter((op: QueuedOperation) => op.status === 'pending');
                resolve(ops);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get failed operations
     */
    async getFailedOperations(): Promise<QueuedOperation[]> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('status');
            const request = index.getAll('failed');

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Mark operation as completed
     */
    async markCompleted(id: string): Promise<void> {
        await this.updateOperation(id, { status: 'completed' });
    }

    /**
     * Mark operation as failed
     */
    async markFailed(id: string, errorMessage: string): Promise<void> {
        await this.updateOperation(id, { status: 'failed', errorMessage });
    }

    /**
     * Mark operation for manual resolution
     */
    async markPendingManualResolution(id: string, message: string): Promise<void> {
        await this.updateOperation(id, {
            status: 'manual-resolution',
            errorMessage: message,
        });
    }

    /**
     * Update retry count for an operation
     */
    async updateRetryCount(id: string): Promise<number> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const operation = getRequest.result;
                if (operation) {
                    operation.retryCount = (operation.retryCount || 0) + 1;
                    const putRequest = store.put(operation);
                    putRequest.onsuccess = () => resolve(operation.retryCount);
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    reject(new Error(`Operation ${id} not found`));
                }
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    /**
     * Requeue a failed operation
     */
    async requeueOperation(operation: QueuedOperation): Promise<void> {
        await this.updateOperation(operation.id, {
            status: 'pending',
            timestamp: Date.now(), // Update timestamp to move to end of queue
        });
    }

    /**
     * Remove completed operations older than a certain age
     */
    async cleanupOldOperations(maxAgeDays: number = 7): Promise<number> {
        const db = await this.initDB();
        const maxAge = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

        const oldOps = await new Promise<QueuedOperation[]>((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('timestamp');
            const range = IDBKeyRange.upperBound(maxAge);
            const request = index.getAll(range);

            request.onsuccess = () => {
                const completed = request.result.filter(
                    (op: QueuedOperation) => op.status === 'completed' || op.status === 'failed'
                );
                resolve(completed);
            };
            request.onerror = () => reject(request.error);
        });

        let deletedCount = 0;
        for (const op of oldOps) {
            try {
                await new Promise<void>((resolve, reject) => {
                    const transaction = db.transaction(STORE_NAME, 'readwrite');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.delete(op.id);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
                deletedCount++;
            } catch (_error) {
                // Silent fail for cleanup
            }
        }

        return deletedCount;
    }

    /**
     * Get queue statistics
     */
    async getStats(): Promise<OperationQueueStats> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const ops: QueuedOperation[] = request.result;
                const stats: OperationQueueStats = {
                    pending: ops.filter((op) => op.status === 'pending').length,
                    completed: ops.filter((op) => op.status === 'completed').length,
                    failed: ops.filter((op) => op.status === 'failed').length,
                    manual: ops.filter((op) => op.status === 'manual-resolution').length,
                };
                resolve(stats);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get last successful sync time
     */
    async getLastSyncTime(): Promise<number | null> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction('meta', 'readonly');
            const store = transaction.objectStore('meta');
            const request = store.get('lastSyncAt');

            request.onsuccess = () => {
                resolve(request.result?.value || null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update last sync time
     */
    async updateLastSyncTime(): Promise<void> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction('meta', 'readwrite');
            const store = transaction.objectStore('meta');
            const request = store.put({ key: 'lastSyncAt', value: Date.now() });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get current status for UI display
     */
    async getStatus(): Promise<{
        pendingCount: number;
        isSyncing: boolean;
        lastSyncAt: number | null;
        stats: OperationQueueStats;
    }> {
        const [pendingOps, stats, lastSyncAt] = await Promise.all([
            this.getPendingOperations(),
            this.getStats(),
            this.getLastSyncTime(),
        ]);

        return {
            pendingCount: pendingOps.length,
            isSyncing: false, // This would be set by the sync manager
            lastSyncAt,
            stats,
        };
    }

    /**
     * Clear all operations (for logout/reset)
     */
    async clearAll(): Promise<void> {
        const db = await this.initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => {
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
}
