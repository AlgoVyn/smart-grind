/**
 * Shared IndexedDB Helper
 * Provides centralized IndexedDB access using the consolidated database configuration
 * Replaces multiple separate database connections with a single unified database
 */

import { IDB_CONFIG, type IDBStoreName } from '../config/idb-config';

/** Promisify IndexedDB request */
function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Shared IndexedDB Manager
 * Manages a single database connection with multiple object stores
 */
class SharedIDBManager {
    private db: IDBDatabase | null = null;
    private dbInitPromise: Promise<IDBDatabase> | null = null;

    /**
     * Initialize the shared IndexedDB database
     */
    private async initDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;
        if (this.dbInitPromise) return this.dbInitPromise;

        this.dbInitPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(IDB_CONFIG.DATABASE_NAME, IDB_CONFIG.DATABASE_VERSION);

            request.onerror = () => {
                console.error('[SharedIDB] Database initialization error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                this.createObjectStores(db);
            };
        });

        try {
            return await this.dbInitPromise;
        } finally {
            this.dbInitPromise = null;
        }
    }

    /**
     * Create all required object stores
     */
    private createObjectStores(db: IDBDatabase): void {
        const stores = IDB_CONFIG.STORES;

        // Auth tokens store
        if (!db.objectStoreNames.contains(stores.AUTH_TOKENS)) {
            db.createObjectStore(stores.AUTH_TOKENS, { keyPath: 'key' });
        }

        // Problem metadata store
        if (!db.objectStoreNames.contains(stores.PROBLEM_METADATA)) {
            const store = db.createObjectStore(stores.PROBLEM_METADATA, { keyPath: 'id' });
            store.createIndex('category', 'category', { unique: false });
            store.createIndex('pattern', 'pattern', { unique: false });
            store.createIndex('cachedAt', 'cachedAt', { unique: false });
            store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        }

        // Operation queue store
        if (!db.objectStoreNames.contains(stores.OPERATION_QUEUE)) {
            const store = db.createObjectStore(stores.OPERATION_QUEUE, { keyPath: 'id' });
            store.createIndex('status', 'status', { unique: false });
            store.createIndex('type', 'type', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('problemId', 'data.problemId', { unique: false });
        }

        // Queue meta store
        if (!db.objectStoreNames.contains(stores.QUEUE_META)) {
            db.createObjectStore(stores.QUEUE_META, { keyPath: 'key' });
        }

        // Bundle state store
        if (!db.objectStoreNames.contains(stores.BUNDLE_STATE)) {
            db.createObjectStore(stores.BUNDLE_STATE, { keyPath: 'key' });
        }

        // Sync retry store
        if (!db.objectStoreNames.contains(stores.SYNC_RETRY)) {
            const store = db.createObjectStore(stores.SYNC_RETRY, { keyPath: 'id' });
            store.createIndex('scheduledFor', 'scheduledFor', { unique: false });
        }

        // Cache inventory store
        if (!db.objectStoreNames.contains(stores.CACHE_INVENTORY)) {
            db.createObjectStore(stores.CACHE_INVENTORY, { keyPath: 'key' });
        }
    }

    /**
     * Get a transaction for a specific store
     */
    async getStore(storeName: IDBStoreName, mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.initDB();
        return db.transaction(storeName, mode).objectStore(storeName);
    }

    /**
     * Get an item from a store
     */
    async getItem<T>(storeName: IDBStoreName, key: string): Promise<T | null> {
        try {
            const store = await this.getStore(storeName, 'readonly');
            const result = await promisifyRequest(store.get(key));
            // Handle both {key, value} wrapper format and direct value storage
            if (result && typeof result === 'object' && 'value' in result) {
                return result.value as T;
            }
            return (result as T) ?? null;
        } catch (error) {
            console.error(`[SharedIDB] Failed to get item '${key}' from '${storeName}':`, error);
            return null;
        }
    }

    /**
     * Set an item in a store
     */
    async setItem(storeName: IDBStoreName, key: string, value: unknown): Promise<void> {
        try {
            const store = await this.getStore(storeName, 'readwrite');
            await promisifyRequest(store.put({ key, value }));
        } catch (error) {
            console.error(`[SharedIDB] Failed to set item '${key}' in '${storeName}':`, error);
        }
    }

    /**
     * Remove an item from a store
     */
    async removeItem(storeName: IDBStoreName, key: string): Promise<void> {
        try {
            const store = await this.getStore(storeName, 'readwrite');
            await promisifyRequest(store.delete(key));
        } catch (error) {
            console.error(`[SharedIDB] Failed to remove item '${key}' from '${storeName}':`, error);
        }
    }

    /**
     * Clear all items from a store
     */
    async clearStore(storeName: IDBStoreName): Promise<void> {
        try {
            const store = await this.getStore(storeName, 'readwrite');
            await promisifyRequest(store.clear());
        } catch (error) {
            console.error(`[SharedIDB] Failed to clear store '${storeName}':`, error);
        }
    }

    /**
     * Delete legacy databases (cleanup)
     */
    async deleteLegacyDatabases(): Promise<void> {
        for (const dbName of IDB_CONFIG.LEGACY_DATABASES) {
            try {
                await new Promise<void>((resolve, reject) => {
                    const request = indexedDB.deleteDatabase(dbName);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
                console.log(`[SharedIDB] Deleted legacy database: ${dbName}`);
            } catch {
                // Ignore errors for databases that don't exist
            }
        }
    }
}

// Singleton instance
const sharedIDBManager = new SharedIDBManager();

export { sharedIDBManager, promisifyRequest };
