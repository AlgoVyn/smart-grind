/**
 * @jest-environment jsdom
 *
 * Tests for Shared IndexedDB Utility Module
 */

import { sharedIDBManager, promisifyRequest } from '../../src/utils/shared-idb';
import { IDB_CONFIG } from '../../src/config/idb-config';
import type { IDBStoreName } from '../../src/config/idb-config';

// Mock the IDB_CONFIG to use test-specific values
jest.mock('../../src/config/idb-config', () => ({
    IDB_CONFIG: {
        DATABASE_NAME: 'test-smartgrind',
        DATABASE_VERSION: 1,
        STORES: {
            AUTH_TOKENS: 'auth-tokens',
            PROBLEM_METADATA: 'problem-metadata',
            OPERATION_QUEUE: 'operation-queue',
            QUEUE_META: 'queue-meta',
            BUNDLE_STATE: 'bundle-state',
            SYNC_RETRY: 'sync-retry',
            CACHE_INVENTORY: 'cache-inventory',
        },
        LEGACY_DATABASES: [
            'legacy-db-1',
            'legacy-db-2',
        ] as const,
    },
}));

describe('promisifyRequest', () => {
    it('should resolve with result on success', async () => {
        const mockResult = { id: 1, data: 'test' };
        const mockRequest = {
            result: mockResult,
            onsuccess: null as ((this: IDBRequest, ev: Event) => any) | null,
            onerror: null as ((this: IDBRequest, ev: Event) => any) | null,
        } as IDBRequest<typeof mockResult>;

        const promise = promisifyRequest(mockRequest);

        // Simulate success
        if (mockRequest.onsuccess) {
            mockRequest.onsuccess.call(mockRequest, new Event('success'));
        }

        const result = await promise;
        expect(result).toEqual(mockResult);
    });

    it('should reject with error on failure', async () => {
        const mockError = new Error('IDB error');
        const mockRequest = {
            result: null,
            error: mockError,
            onsuccess: null as ((this: IDBRequest, ev: Event) => any) | null,
            onerror: null as ((this: IDBRequest, ev: Event) => any) | null,
        } as IDBRequest<unknown>;

        const promise = promisifyRequest(mockRequest);

        // Simulate error
        if (mockRequest.onerror) {
            mockRequest.onerror.call(mockRequest, new Event('error'));
        }

        await expect(promise).rejects.toBe(mockError);
    });
});

describe('SharedIDBManager', () => {
    let mockIndexedDB: jest.Mocked<IDBFactory>;
    let mockIDBDatabase: jest.Mocked<IDBDatabase>;
    let mockIDBObjectStore: jest.Mocked<IDBObjectStore>;
    let mockIDBTransaction: jest.Mocked<IDBTransaction>;
    let mockOpenRequest: jest.Mocked<IDBOpenDBRequest>;
    let mockIDBRequest: jest.Mocked<IDBRequest>;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});

        // Create mock IDBRequest
        mockIDBRequest = {
            result: undefined,
            error: null,
            onsuccess: null,
            onerror: null,
            source: null,
            transaction: null,
            readyState: 'pending',
        } as unknown as jest.Mocked<IDBRequest>;

        // Create mock object store
        mockIDBObjectStore = {
            get: jest.fn().mockReturnValue(mockIDBRequest),
            put: jest.fn().mockReturnValue(mockIDBRequest),
            delete: jest.fn().mockReturnValue(mockIDBRequest),
            clear: jest.fn().mockReturnValue(mockIDBRequest),
            createIndex: jest.fn(),
            name: '',
            autoIncrement: false,
            keyPath: null,
            transaction: {} as IDBTransaction,
            indexNames: [] as unknown as DOMStringList,
        } as unknown as jest.Mocked<IDBObjectStore>;

        // Create mock transaction
        mockIDBTransaction = {
            objectStore: jest.fn().mockReturnValue(mockIDBObjectStore),
            db: {} as IDBDatabase,
            error: null,
            mode: 'readonly',
            objectStoreNames: [] as unknown as DOMStringList,
            onabort: null,
            oncomplete: null,
            onerror: null,
            abort: jest.fn(),
            commit: jest.fn(),
        } as unknown as jest.Mocked<IDBTransaction>;

        // Create mock database
        mockIDBDatabase = {
            transaction: jest.fn().mockReturnValue(mockIDBTransaction),
            createObjectStore: jest.fn().mockReturnValue(mockIDBObjectStore),
            objectStoreNames: {
                contains: jest.fn().mockReturnValue(false),
                length: 0,
                item: jest.fn(),
            } as unknown as DOMStringList,
            close: jest.fn(),
            name: IDB_CONFIG.DATABASE_NAME,
            version: IDB_CONFIG.DATABASE_VERSION,
            onabort: null,
            onclose: null,
            onerror: null,
            onversionchange: null,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        } as unknown as jest.Mocked<IDBDatabase>;

        // Create mock open request
        mockOpenRequest = {
            result: mockIDBDatabase,
            error: null,
            onsuccess: null,
            onerror: null,
            onupgradeneeded: null,
            readyState: 'pending',
            source: null,
            transaction: null,
            blocked: null,
            onblocked: null,
        } as unknown as jest.Mocked<IDBOpenDBRequest>;

        // Create mock IndexedDB factory
        mockIndexedDB = {
            open: jest.fn().mockReturnValue(mockOpenRequest),
            deleteDatabase: jest.fn().mockReturnValue({
                onsuccess: null,
                onerror: null,
            } as unknown as IDBOpenDBRequest),
            cmp: jest.fn(),
            databases: jest.fn().mockResolvedValue([]),
        } as unknown as jest.Mocked<IDBFactory>;

        // Replace global indexedDB
        Object.defineProperty(global, 'indexedDB', {
            value: mockIndexedDB,
            writable: true,
            configurable: true,
        });

        // Reset the singleton's internal state
        (sharedIDBManager as unknown as { db: IDBDatabase | null; dbInitPromise: Promise<IDBDatabase> | null }).db = null;
        (sharedIDBManager as unknown as { db: IDBDatabase | null; dbInitPromise: Promise<IDBDatabase> | null }).dbInitPromise = null;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Singleton behavior', () => {
        it('should export the same instance on multiple imports', () => {
            // The sharedIDBManager is already imported at the top
            // We verify it's a singleton by checking the reference
            expect(sharedIDBManager).toBeDefined();
            expect(typeof sharedIDBManager.getItem).toBe('function');
            expect(typeof sharedIDBManager.setItem).toBe('function');
            expect(typeof sharedIDBManager.removeItem).toBe('function');
            expect(typeof sharedIDBManager.clearStore).toBe('function');
            expect(typeof sharedIDBManager.deleteLegacyDatabases).toBe('function');
        });
    });

    describe('initDB', () => {
        it('should initialize database on first call', async () => {
            const getStorePromise = sharedIDBManager.getStore('auth-tokens', 'readonly');

            // Simulate successful open
            setTimeout(() => {
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);

            await getStorePromise;

            expect(mockIndexedDB.open).toHaveBeenCalledWith(
                IDB_CONFIG.DATABASE_NAME,
                IDB_CONFIG.DATABASE_VERSION
            );
        });

        it('should reuse existing database connection', async () => {
            // First call to initialize
            const promise1 = sharedIDBManager.getStore('auth-tokens', 'readonly');
            setTimeout(() => {
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);
            await promise1;

            // Reset mock to track calls
            mockIndexedDB.open.mockClear();

            // Second call should not trigger a new open
            const promise2 = sharedIDBManager.getStore('auth-tokens', 'readonly');
            await promise2;

            expect(mockIndexedDB.open).not.toHaveBeenCalled();
        });

        it('should reject on database open error', async () => {
            const mockError = new Error('Database open failed');
            mockOpenRequest.error = mockError;

            const promise = sharedIDBManager.getStore('auth-tokens', 'readonly');

            setTimeout(() => {
                if (mockOpenRequest.onerror) {
                    mockOpenRequest.onerror.call(mockOpenRequest, new Event('error'));
                }
            }, 0);

            await expect(promise).rejects.toBe(mockError);
            expect(console.error).toHaveBeenCalledWith(
                '[SharedIDB] Database initialization error:',
                mockError
            );
        });
    });

    describe('createObjectStores', () => {
        it('should create all required object stores on upgrade', async () => {
            // Trigger database initialization
            const promise = sharedIDBManager.getStore('auth-tokens', 'readonly');

            setTimeout(() => {
                if (mockOpenRequest.onupgradeneeded) {
                    const event = {
                        target: { result: mockIDBDatabase },
                    } as unknown as IDBVersionChangeEvent;
                    mockOpenRequest.onupgradeneeded.call(mockOpenRequest, event);
                }
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);

            await promise;

            // Verify auth-tokens store
            expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith(
                'auth-tokens',
                { keyPath: 'key' }
            );

            // Verify problem-metadata store with indexes
            expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith(
                'problem-metadata',
                { keyPath: 'id' }
            );
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('category', 'category', { unique: false });
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('pattern', 'pattern', { unique: false });
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('cachedAt', 'cachedAt', { unique: false });
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('lastAccessed', 'lastAccessed', { unique: false });

            // Verify operation-queue store with indexes
            expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith(
                'operation-queue',
                { keyPath: 'id' }
            );
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('status', 'status', { unique: false });
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('type', 'type', { unique: false });
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('timestamp', 'timestamp', { unique: false });
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('problemId', 'data.problemId', { unique: false });

            // Verify other stores
            expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith(
                'queue-meta',
                { keyPath: 'key' }
            );
            expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith(
                'bundle-state',
                { keyPath: 'key' }
            );
            expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith(
                'sync-retry',
                { keyPath: 'id' }
            );
            expect(mockIDBObjectStore.createIndex).toHaveBeenCalledWith('scheduledFor', 'scheduledFor', { unique: false });
            expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith(
                'cache-inventory',
                { keyPath: 'key' }
            );
        });

        it('should not create stores that already exist', async () => {
            // Make objectStoreNames.contains return true for all stores
            (mockIDBDatabase.objectStoreNames.contains as jest.Mock).mockReturnValue(true);

            const promise = sharedIDBManager.getStore('auth-tokens', 'readonly');

            setTimeout(() => {
                if (mockOpenRequest.onupgradeneeded) {
                    const event = {
                        target: { result: mockIDBDatabase },
                    } as unknown as IDBVersionChangeEvent;
                    mockOpenRequest.onupgradeneeded.call(mockOpenRequest, event);
                }
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);

            await promise;

            expect(mockIDBDatabase.createObjectStore).not.toHaveBeenCalled();
        });
    });

    describe('getStore', () => {
        it('should return object store with readonly mode', async () => {
            const promise = sharedIDBManager.getStore('auth-tokens', 'readonly');

            setTimeout(() => {
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);

            const store = await promise;

            expect(mockIDBDatabase.transaction).toHaveBeenCalledWith('auth-tokens', 'readonly');
            expect(mockIDBTransaction.objectStore).toHaveBeenCalledWith('auth-tokens');
            expect(store).toBe(mockIDBObjectStore);
        });

        it('should return object store with readwrite mode', async () => {
            const promise = sharedIDBManager.getStore('auth-tokens', 'readwrite');

            setTimeout(() => {
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);

            const store = await promise;

            expect(mockIDBDatabase.transaction).toHaveBeenCalledWith('auth-tokens', 'readwrite');
            expect(store).toBe(mockIDBObjectStore);
        });
    });

    describe('getItem', () => {
        beforeEach(async () => {
            // Initialize database first
            const initPromise = sharedIDBManager.getStore('auth-tokens', 'readonly');
            setTimeout(() => {
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);
            await initPromise;
        });

        it('should return value for existing key with {key, value} wrapper format', async () => {
            const testValue = { key: 'test-key', value: { data: 'test-data' } };
            mockIDBRequest.result = testValue;

            const promise = sharedIDBManager.getItem<{ data: string }>('auth-tokens', 'test-key');

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            const result = await promise;

            expect(mockIDBObjectStore.get).toHaveBeenCalledWith('test-key');
            expect(result).toEqual({ data: 'test-data' });
        });

        it('should return direct value when not wrapped in {key, value} format', async () => {
            const testValue = { id: 1, name: 'direct-value' };
            mockIDBRequest.result = testValue;

            const promise = sharedIDBManager.getItem<typeof testValue>('problem-metadata', 'test-key');

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            const result = await promise;

            expect(result).toEqual(testValue);
        });

        it('should return null for non-existing key', async () => {
            mockIDBRequest.result = undefined;

            const promise = sharedIDBManager.getItem('auth-tokens', 'non-existing-key');

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            const result = await promise;

            expect(result).toBeNull();
        });

        it('should return null and log error on failure', async () => {
            const mockError = new Error('Get failed');
            mockIDBRequest.error = mockError;

            const promise = sharedIDBManager.getItem('auth-tokens', 'test-key');

            setTimeout(() => {
                if (mockIDBRequest.onerror) {
                    mockIDBRequest.onerror.call(mockIDBRequest, new Event('error'));
                }
            }, 0);

            const result = await promise;

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith(
                `[SharedIDB] Failed to get item 'test-key' from 'auth-tokens':`,
                mockError
            );
        });

        it('should handle primitive values stored directly', async () => {
            mockIDBRequest.result = 'string-value';

            const promise = sharedIDBManager.getItem<string>('auth-tokens', 'test-key');

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            const result = await promise;

            expect(result).toBe('string-value');
        });
    });

    describe('setItem', () => {
        beforeEach(async () => {
            const initPromise = sharedIDBManager.getStore('auth-tokens', 'readwrite');
            setTimeout(() => {
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);
            await initPromise;
        });

        it('should set item with key and value wrapped in object', async () => {
            const testValue = { data: 'test-data' };

            const promise = sharedIDBManager.setItem('auth-tokens', 'test-key', testValue);

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            await promise;

            expect(mockIDBObjectStore.put).toHaveBeenCalledWith({
                key: 'test-key',
                value: testValue,
            });
        });

        it('should handle primitive values', async () => {
            const promise = sharedIDBManager.setItem('auth-tokens', 'string-key', 'string-value');

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            await promise;

            expect(mockIDBObjectStore.put).toHaveBeenCalledWith({
                key: 'string-key',
                value: 'string-value',
            });
        });

        it('should handle null values', async () => {
            const promise = sharedIDBManager.setItem('auth-tokens', 'null-key', null);

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            await promise;

            expect(mockIDBObjectStore.put).toHaveBeenCalledWith({
                key: 'null-key',
                value: null,
            });
        });

        it('should log error on failure without throwing', async () => {
            const mockError = new Error('Set failed');
            mockIDBRequest.error = mockError;

            const promise = sharedIDBManager.setItem('auth-tokens', 'test-key', 'value');

            setTimeout(() => {
                if (mockIDBRequest.onerror) {
                    mockIDBRequest.onerror.call(mockIDBRequest, new Event('error'));
                }
            }, 0);

            // Should not throw
            await expect(promise).resolves.toBeUndefined();

            expect(console.error).toHaveBeenCalledWith(
                `[SharedIDB] Failed to set item 'test-key' in 'auth-tokens':`,
                mockError
            );
        });
    });

    describe('removeItem', () => {
        beforeEach(async () => {
            const initPromise = sharedIDBManager.getStore('auth-tokens', 'readwrite');
            setTimeout(() => {
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);
            await initPromise;
        });

        it('should remove item by key', async () => {
            const promise = sharedIDBManager.removeItem('auth-tokens', 'test-key');

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            await promise;

            expect(mockIDBObjectStore.delete).toHaveBeenCalledWith('test-key');
        });

        it('should log error on failure without throwing', async () => {
            const mockError = new Error('Delete failed');
            mockIDBRequest.error = mockError;

            const promise = sharedIDBManager.removeItem('auth-tokens', 'test-key');

            setTimeout(() => {
                if (mockIDBRequest.onerror) {
                    mockIDBRequest.onerror.call(mockIDBRequest, new Event('error'));
                }
            }, 0);

            // Should not throw
            await expect(promise).resolves.toBeUndefined();

            expect(console.error).toHaveBeenCalledWith(
                `[SharedIDB] Failed to remove item 'test-key' from 'auth-tokens':`,
                mockError
            );
        });
    });

    describe('clearStore', () => {
        beforeEach(async () => {
            const initPromise = sharedIDBManager.getStore('auth-tokens', 'readwrite');
            setTimeout(() => {
                if (mockOpenRequest.onsuccess) {
                    mockOpenRequest.onsuccess.call(mockOpenRequest, new Event('success'));
                }
            }, 0);
            await initPromise;
        });

        it('should clear all items from store', async () => {
            const promise = sharedIDBManager.clearStore('auth-tokens');

            setTimeout(() => {
                if (mockIDBRequest.onsuccess) {
                    mockIDBRequest.onsuccess.call(mockIDBRequest, new Event('success'));
                }
            }, 0);

            await promise;

            expect(mockIDBObjectStore.clear).toHaveBeenCalled();
        });

        it('should log error on failure without throwing', async () => {
            const mockError = new Error('Clear failed');
            mockIDBRequest.error = mockError;

            const promise = sharedIDBManager.clearStore('auth-tokens');

            setTimeout(() => {
                if (mockIDBRequest.onerror) {
                    mockIDBRequest.onerror.call(mockIDBRequest, new Event('error'));
                }
            }, 0);

            // Should not throw
            await expect(promise).resolves.toBeUndefined();

            expect(console.error).toHaveBeenCalledWith(
                `[SharedIDB] Failed to clear store 'auth-tokens':`,
                mockError
            );
        });
    });

    describe('deleteLegacyDatabases', () => {
        it('should delete all legacy databases successfully', async () => {
            let successCallback: (() => void) | null = null;

            mockIndexedDB.deleteDatabase = jest.fn().mockImplementation(() => {
                return {
                    set onsuccess(fn: (() => void) | null) {
                        if (fn) {
                            successCallback = fn;
                            // Immediately call the success handler
                            queueMicrotask(() => fn());
                        }
                    },
                    onerror: null,
                } as unknown as IDBOpenDBRequest;
            });

            await sharedIDBManager.deleteLegacyDatabases();

            expect(mockIndexedDB.deleteDatabase).toHaveBeenCalledTimes(2);
            expect(mockIndexedDB.deleteDatabase).toHaveBeenCalledWith('legacy-db-1');
            expect(mockIndexedDB.deleteDatabase).toHaveBeenCalledWith('legacy-db-2');
            expect(console.log).toHaveBeenCalledWith('[SharedIDB] Deleted legacy database: legacy-db-1');
            expect(console.log).toHaveBeenCalledWith('[SharedIDB] Deleted legacy database: legacy-db-2');
        });

        it('should silently ignore errors for non-existent databases', async () => {
            mockIndexedDB.deleteDatabase = jest.fn().mockImplementation(() => {
                return {
                    onsuccess: null,
                    set onerror(fn: (() => void) | null) {
                        if (fn) {
                            // Immediately call the error handler
                            queueMicrotask(() => fn());
                        }
                    },
                } as unknown as IDBOpenDBRequest;
            });

            // Should not throw even if all deletes fail
            await expect(sharedIDBManager.deleteLegacyDatabases()).resolves.toBeUndefined();
            expect(mockIndexedDB.deleteDatabase).toHaveBeenCalledTimes(2);
        });

        it('should handle mixed success and failures', async () => {
            let callCount = 0;

            mockIndexedDB.deleteDatabase = jest.fn().mockImplementation((dbName: string) => {
                callCount++;
                return {
                    set onsuccess(fn: (() => void) | null) {
                        if (fn && dbName === 'legacy-db-1') {
                            // First succeeds
                            queueMicrotask(() => fn());
                        }
                    },
                    set onerror(fn: (() => void) | null) {
                        if (fn && dbName === 'legacy-db-2') {
                            // Second fails
                            queueMicrotask(() => fn());
                        }
                    },
                } as unknown as IDBOpenDBRequest;
            });

            // Should not throw
            await expect(sharedIDBManager.deleteLegacyDatabases()).resolves.toBeUndefined();
            expect(mockIndexedDB.deleteDatabase).toHaveBeenCalledTimes(2);
            expect(console.log).toHaveBeenCalledWith('[SharedIDB] Deleted legacy database: legacy-db-1');
        });
    });
});
