/**
 * @jest-environment jsdom
 */

import { sharedIDBManager, promisifyRequest } from '../../src/utils/shared-idb';
import { IDB_CONFIG } from '../../src/config/idb-config';

describe('Shared IDB Manager', () => {
    beforeEach(() => {
        // Clear the IndexedDB mock before each test
        (global.indexedDB as unknown as { _clearAll: () => void })._clearAll();
    });

    describe('promisifyRequest', () => {
        it('should resolve with result on success', async () => {
            const mockRequest = {
                onsuccess: null as ((event: { target: typeof mockRequest }) => void) | null,
                onerror: null as ((event: { target: typeof mockRequest }) => void) | null,
                result: 'test-value',
                error: null,
            };

            const promise = promisifyRequest(mockRequest as unknown as IDBRequest<string>);
            
            // Simulate success
            if (mockRequest.onsuccess) {
                mockRequest.onsuccess({ target: mockRequest });
            }

            await expect(promise).resolves.toBe('test-value');
        });

        it('should reject with error on failure', async () => {
            const mockError = new Error('IDB Error');
            const mockRequest = {
                onsuccess: null as ((event: { target: typeof mockRequest }) => void) | null,
                onerror: null as ((event: { target: typeof mockRequest }) => void) | null,
                result: null,
                error: mockError,
            };

            const promise = promisifyRequest(mockRequest as unknown as IDBRequest<string>);
            
            // Simulate error
            if (mockRequest.onerror) {
                mockRequest.onerror({ target: mockRequest });
            }

            await expect(promise).rejects.toBe(mockError);
        });
    });

    describe('initDB', () => {
        it('should create all required object stores on first open', async () => {
            // Access the private initDB by using getStore which calls it
            await sharedIDBManager.getStore(IDB_CONFIG.STORES.AUTH_TOKENS, 'readonly');
            
            // Verify database was created with correct name and version
            const db = await new Promise<IDBDatabase>((resolve) => {
                const request = indexedDB.open(IDB_CONFIG.DATABASE_NAME, IDB_CONFIG.DATABASE_VERSION);
                request.onsuccess = () => resolve(request.result);
            });
            
            expect(db.name).toBe(IDB_CONFIG.DATABASE_NAME);
            expect(db.version).toBe(IDB_CONFIG.DATABASE_VERSION);
            
            // Verify all stores exist
            expect(db.objectStoreNames.contains(IDB_CONFIG.STORES.AUTH_TOKENS)).toBe(true);
            expect(db.objectStoreNames.contains(IDB_CONFIG.STORES.PROBLEM_METADATA)).toBe(true);
            expect(db.objectStoreNames.contains(IDB_CONFIG.STORES.OPERATION_QUEUE)).toBe(true);
            expect(db.objectStoreNames.contains(IDB_CONFIG.STORES.QUEUE_META)).toBe(true);
            expect(db.objectStoreNames.contains(IDB_CONFIG.STORES.BUNDLE_STATE)).toBe(true);
            expect(db.objectStoreNames.contains(IDB_CONFIG.STORES.SYNC_RETRY)).toBe(true);
            expect(db.objectStoreNames.contains(IDB_CONFIG.STORES.CACHE_INVENTORY)).toBe(true);
            
            db.close();
        });

        it('should reuse existing database connection', async () => {
            // First call should create database
            await sharedIDBManager.getStore(IDB_CONFIG.STORES.AUTH_TOKENS, 'readonly');
            
            // Second call should reuse connection
            await sharedIDBManager.getStore(IDB_CONFIG.STORES.PROBLEM_METADATA, 'readonly');
            
            // Both calls should succeed without error
        });
    });

    describe('getStore', () => {
        it('should return object store for valid store name', async () => {
            const store = await sharedIDBManager.getStore(IDB_CONFIG.STORES.AUTH_TOKENS, 'readonly');
            expect(store).toBeDefined();
            expect(store.name).toBe(IDB_CONFIG.STORES.AUTH_TOKENS);
        });

        it('should handle readwrite mode', async () => {
            const store = await sharedIDBManager.getStore(IDB_CONFIG.STORES.AUTH_TOKENS, 'readwrite');
            expect(store).toBeDefined();
        });

        it('should handle readonly mode', async () => {
            const store = await sharedIDBManager.getStore(IDB_CONFIG.STORES.PROBLEM_METADATA, 'readonly');
            expect(store).toBeDefined();
        });
    });

    describe('setItem and getItem', () => {
        it('should store and retrieve an item', async () => {
            const key = 'test-key';
            const value = { test: 'data', number: 123 };
            
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, key, value);
            const retrieved = await sharedIDBManager.getItem(IDB_CONFIG.STORES.AUTH_TOKENS, key);
            
            expect(retrieved).toEqual(value);
        });

        it('should return null for non-existent key', async () => {
            const retrieved = await sharedIDBManager.getItem(
                IDB_CONFIG.STORES.AUTH_TOKENS, 
                'non-existent-key'
            );
            expect(retrieved).toBeNull();
        });

        it('should handle string values', async () => {
            const key = 'string-key';
            const value = 'test-string-value';
            
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, key, value);
            const retrieved = await sharedIDBManager.getItem<string>(IDB_CONFIG.STORES.AUTH_TOKENS, key);
            
            expect(retrieved).toBe(value);
        });

        it('should handle number values', async () => {
            const key = 'number-key';
            const value = 42;
            
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, key, value);
            const retrieved = await sharedIDBManager.getItem<number>(IDB_CONFIG.STORES.AUTH_TOKENS, key);
            
            expect(retrieved).toBe(value);
        });

        it('should handle simple objects', async () => {
            const key = 'simple-obj-key';
            const value = { name: 'test', count: 42 };
            
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, key, value);
            const retrieved = await sharedIDBManager.getItem<typeof value>(
                IDB_CONFIG.STORES.AUTH_TOKENS,
                key
            );
            
            expect(retrieved).toEqual(value);
        });

        it('should handle items in different stores independently', async () => {
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key1', 'auth-value');
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.QUEUE_META, 'key1', 'meta-value');
            
            const authValue = await sharedIDBManager.getItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key1');
            const metaValue = await sharedIDBManager.getItem(IDB_CONFIG.STORES.QUEUE_META, 'key1');
            
            expect(authValue).toBe('auth-value');
            expect(metaValue).toBe('meta-value');
        });
    });

    describe('removeItem', () => {
        it('should remove an existing item', async () => {
            const key = 'remove-test-key';
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, key, 'value');
            
            await sharedIDBManager.removeItem(IDB_CONFIG.STORES.AUTH_TOKENS, key);
            
            const retrieved = await sharedIDBManager.getItem(IDB_CONFIG.STORES.AUTH_TOKENS, key);
            expect(retrieved).toBeNull();
        });

        it('should handle removing non-existent key gracefully', async () => {
            await expect(
                sharedIDBManager.removeItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'non-existent')
            ).resolves.toBeUndefined();
        });
    });

    describe('clearStore', () => {
        it('should clear all items from a store', async () => {
            // Add multiple items
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key1', 'value1');
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key2', 'value2');
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key3', 'value3');
            
            await sharedIDBManager.clearStore(IDB_CONFIG.STORES.AUTH_TOKENS);
            
            // All items should be gone
            expect(await sharedIDBManager.getItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key1')).toBeNull();
            expect(await sharedIDBManager.getItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key2')).toBeNull();
            expect(await sharedIDBManager.getItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key3')).toBeNull();
        });

        it('should only clear the specified store', async () => {
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key', 'auth-value');
            await sharedIDBManager.setItem(IDB_CONFIG.STORES.QUEUE_META, 'key', 'meta-value');
            
            await sharedIDBManager.clearStore(IDB_CONFIG.STORES.AUTH_TOKENS);
            
            // Auth store should be empty
            expect(await sharedIDBManager.getItem(IDB_CONFIG.STORES.AUTH_TOKENS, 'key')).toBeNull();
            
            // Meta store should still have the item
            expect(await sharedIDBManager.getItem(IDB_CONFIG.STORES.QUEUE_META, 'key')).toBe('meta-value');
        });
    });

    describe('deleteLegacyDatabases', () => {
        it('should delete all legacy databases', async () => {
            const deleteDatabaseSpy = jest.spyOn(indexedDB, 'deleteDatabase');
            
            await sharedIDBManager.deleteLegacyDatabases();
            
            // Should attempt to delete all legacy databases
            expect(deleteDatabaseSpy).toHaveBeenCalledTimes(IDB_CONFIG.LEGACY_DATABASES.length);
            
            for (const dbName of IDB_CONFIG.LEGACY_DATABASES) {
                expect(deleteDatabaseSpy).toHaveBeenCalledWith(dbName);
            }
            
            deleteDatabaseSpy.mockRestore();
        });

        it('should handle errors gracefully', async () => {
            // Mock deleteDatabase to fail
            const originalDeleteDatabase = indexedDB.deleteDatabase;
            indexedDB.deleteDatabase = jest.fn().mockImplementation(() => {
                const request = {
                    onsuccess: null as ((event: unknown) => void) | null,
                    onerror: null as ((event: unknown) => void) | null,
                };
                
                // Trigger error
                setTimeout(() => {
                    if (request.onerror) {
                        request.onerror({});
                    }
                }, 0);
                
                return request as unknown as IDBOpenDBRequest;
            });
            
            // Should not throw
            await expect(sharedIDBManager.deleteLegacyDatabases()).resolves.toBeUndefined();
            
            indexedDB.deleteDatabase = originalDeleteDatabase;
        });
    });

    describe('createObjectStores', () => {
        it('should initialize database with stores', async () => {
            // Initialize the database by accessing a store
            const store = await sharedIDBManager.getStore(IDB_CONFIG.STORES.AUTH_TOKENS, 'readonly');
            
            // Store should be defined and accessible
            expect(store).toBeDefined();
            expect(store.name).toBe(IDB_CONFIG.STORES.AUTH_TOKENS);
        });

        it('should create all stores defined in IDB_CONFIG', async () => {
            // Access each store to ensure they're all created
            const storeNames = Object.values(IDB_CONFIG.STORES);
            
            for (const storeName of storeNames) {
                const store = await sharedIDBManager.getStore(storeName, 'readonly');
                expect(store).toBeDefined();
                expect(store.name).toBe(storeName);
            }
        });
    });
});
