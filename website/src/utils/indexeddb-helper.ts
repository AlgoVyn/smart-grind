// --- INDEXEDDB HELPER MODULE ---
// Safe IndexedDB operations with quota exceeded handling and error recovery

/* eslint-disable no-unused-vars */
/**
 * IndexedDB error types
 */
export enum IDBErrorType {
    QUOTA_EXCEEDED = 'QuotaExceededError',
    VERSION_ERROR = 'VersionError',
    ABORT = 'AbortError',
    UNKNOWN = 'UnknownError',
}
/* eslint-enable no-unused-vars */

/**
 * Custom error class for IndexedDB operations
 */
export class IDBOperationError extends Error {
    type: IDBErrorType;
    originalError: Error | undefined;

    constructor(message: string, type: IDBErrorType, originalError?: Error) {
        super(message);
        this.name = 'IDBOperationError';
        this.type = type;
        this.originalError = originalError;
    }
}

/**
 * Check if error is a quota exceeded error
 */
function isQuotaExceededError(error: unknown): boolean {
    if (error instanceof Error) {
        return (
            error.name === 'QuotaExceededError' ||
            error.message?.includes('quota') ||
            error.message?.includes('storage')
        );
    }
    return false;
}

/**
 * Safely open an IndexedDB database with error handling
 */
export function openDatabase(
    name: string,
    version: number,
    onUpgrade: (_db: IDBDatabase) => void
): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);

        request.onerror = () => {
            const error = request.error;
            if (isQuotaExceededError(error)) {
                reject(
                    new IDBOperationError(
                        'Storage quota exceeded. Please free up space and try again.',
                        IDBErrorType.QUOTA_EXCEEDED,
                        error || undefined
                    )
                );
            } else {
                reject(
                    new IDBOperationError(
                        `Failed to open database ${name}: ${error?.message || 'Unknown error'}`,
                        (error?.name as IDBErrorType) || IDBErrorType.UNKNOWN,
                        error || undefined
                    )
                );
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            try {
                onUpgrade(db);
            } catch (error) {
                reject(
                    new IDBOperationError(
                        `Database upgrade failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        IDBErrorType.VERSION_ERROR,
                        error instanceof Error ? error : undefined
                    )
                );
            }
        };

        request.onblocked = () => {
            reject(
                new IDBOperationError(
                    'Database upgrade blocked. Please close other tabs and try again.',
                    IDBErrorType.ABORT
                )
            );
        };
    });
}

/**
 * Safely store data in IndexedDB with quota handling
 */
export async function safeStore<T>(
    db: IDBDatabase,
    storeName: string,
    key: string,
    value: T
): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);

            // Handle quota exceeded errors on transaction
            transaction.onabort = () => {
                const error = transaction.error;
                if (isQuotaExceededError(error)) {
                    reject(
                        new IDBOperationError(
                            'Storage quota exceeded. Unable to save data.',
                            IDBErrorType.QUOTA_EXCEEDED,
                            error || undefined
                        )
                    );
                } else {
                    reject(
                        new IDBOperationError(
                            `Transaction aborted: ${error?.message || 'Unknown error'}`,
                            IDBErrorType.ABORT,
                            error || undefined
                        )
                    );
                }
            };

            transaction.onerror = () => {
                const error = transaction.error;
                reject(
                    new IDBOperationError(
                        `Transaction failed: ${error?.message || 'Unknown error'}`,
                        IDBErrorType.UNKNOWN,
                        error || undefined
                    )
                );
            };

            transaction.oncomplete = () => {
                resolve();
            };

            const request = store.put({ key, value });

            request.onerror = () => {
                const error = request.error;
                if (isQuotaExceededError(error)) {
                    reject(
                        new IDBOperationError(
                            'Storage quota exceeded while saving data.',
                            IDBErrorType.QUOTA_EXCEEDED,
                            error || undefined
                        )
                    );
                } else {
                    reject(
                        new IDBOperationError(
                            `Failed to store data: ${error?.message || 'Unknown error'}`,
                            IDBErrorType.UNKNOWN,
                            error || undefined
                        )
                    );
                }
            };
        } catch (error) {
            reject(
                new IDBOperationError(
                    `Unexpected error during store: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    IDBErrorType.UNKNOWN,
                    error instanceof Error ? error : undefined
                )
            );
        }
    });
}

/**
 * Safely retrieve data from IndexedDB
 */
export async function safeRetrieve<T>(
    db: IDBDatabase,
    storeName: string,
    key: string
): Promise<T | null> {
    return new Promise((resolve, reject) => {
        try {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result?.value ?? null);
            };

            request.onerror = () => {
                const error = request.error;
                reject(
                    new IDBOperationError(
                        `Failed to retrieve data: ${error?.message || 'Unknown error'}`,
                        IDBErrorType.UNKNOWN,
                        error || undefined
                    )
                );
            };
        } catch (error) {
            reject(
                new IDBOperationError(
                    `Unexpected error during retrieve: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    IDBErrorType.UNKNOWN,
                    error instanceof Error ? error : undefined
                )
            );
        }
    });
}

/**
 * Clear old data when quota is exceeded
 * Returns true if cleanup was successful, false otherwise
 */
export async function cleanupOldData(dbName: string, storesToClear: string[]): Promise<boolean> {
    try {
        const databases = await indexedDB.databases();
        const dbInfo = databases.find((dbInfo) => dbInfo.name === dbName);

        if (!dbInfo?.name) {
            return false;
        }

        // Open database and clear specified stores
        const db = await openDatabase(dbInfo.name, dbInfo.version || 1, () => {});

        for (const storeName of storesToClear) {
            if (db.objectStoreNames.contains(storeName)) {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                await new Promise<void>((resolve, reject) => {
                    const request = store.clear();
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
                console.log(`[IDB] Cleared store: ${storeName}`);
            }
        }

        db.close();
        return true;
    } catch (error) {
        console.error('[IDB] Failed to cleanup old data:', error);
        return false;
    }
}

/**
 * Get storage estimate information
 */
export async function getStorageEstimate(): Promise<{
    usage: number;
    quota: number;
    usageDetails?: Record<string, number> | undefined;
} | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
            const estimate = await navigator.storage.estimate();
            const result: {
                usage: number;
                quota: number;
                usageDetails?: Record<string, number>;
            } = {
                usage: estimate.usage || 0,
                quota: estimate.quota || 0,
            };
            // Only add usageDetails if it exists in the estimate
            if ('usageDetails' in estimate && estimate.usageDetails) {
                result.usageDetails = estimate.usageDetails as Record<string, number>;
            }
            return result;
        } catch (error) {
            console.warn('[IDB] Failed to get storage estimate:', error);
            return null;
        }
    }
    return null;
}

/**
 * Check if storage is near quota limit (> 90%)
 */
export async function isStorageNearLimit(): Promise<boolean> {
    const estimate = await getStorageEstimate();
    if (!estimate || estimate.quota === 0) return false;

    const usageRatio = estimate.usage / estimate.quota;
    return usageRatio > 0.9;
}

/**
 * Safe IndexedDB operation wrapper with automatic retry and quota cleanup
 */
export async function safeIDBOperation<T>(
    operation: () => Promise<T>,
    options: {
        maxRetries?: number;
        cleanupStores?: string[];
        dbName?: string;
    } = {}
): Promise<T> {
    const { maxRetries = 1, cleanupStores, dbName } = options;

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // If quota exceeded and we have cleanup options, try cleanup
            if (isQuotaExceededError(error) && cleanupStores && dbName && attempt < maxRetries) {
                console.warn('[IDB] Quota exceeded, attempting cleanup...');
                const cleaned = await cleanupOldData(dbName, cleanupStores);
                if (cleaned) {
                    console.log('[IDB] Cleanup successful, retrying operation...');
                    continue;
                }
            }

            throw error;
        }
    }

    throw lastError;
}
