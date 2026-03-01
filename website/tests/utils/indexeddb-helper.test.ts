/**
 * @jest-environment jsdom
 */

import {
    IDBErrorType,
    IDBOperationError,
    openDatabase,
    safeStore,
    safeRetrieve,
    cleanupOldData,
    getStorageEstimate,
    isStorageNearLimit,
    safeIDBOperation,
} from '../../src/utils/indexeddb-helper';

describe('IndexedDB Helper', () => {
    beforeEach(() => {
        (global.indexedDB as unknown as { _clearAll: () => void })._clearAll();
        jest.clearAllMocks();
    });

    describe('IDBErrorType', () => {
        it('should have correct error type values', () => {
            expect(IDBErrorType.QUOTA_EXCEEDED).toBe('QuotaExceededError');
            expect(IDBErrorType.VERSION_ERROR).toBe('VersionError');
            expect(IDBErrorType.ABORT).toBe('AbortError');
            expect(IDBErrorType.UNKNOWN).toBe('UnknownError');
        });
    });

    describe('IDBOperationError', () => {
        it('should create error with correct properties', () => {
            const originalError = new Error('Original error');
            const error = new IDBOperationError(
                'Test message',
                IDBErrorType.QUOTA_EXCEEDED,
                originalError
            );

            expect(error.message).toBe('Test message');
            expect(error.name).toBe('IDBOperationError');
            expect(error.type).toBe(IDBErrorType.QUOTA_EXCEEDED);
            expect(error.originalError).toBe(originalError);
        });

        it('should create error without original error', () => {
            const error = new IDBOperationError('Test message', IDBErrorType.UNKNOWN);

            expect(error.message).toBe('Test message');
            expect(error.originalError).toBeUndefined();
        });
    });

    describe('openDatabase', () => {
        it('should open database successfully', async () => {
            const onUpgrade = jest.fn();
            const dbPromise = openDatabase('test-db', 1, onUpgrade);

            const db = await dbPromise;
            expect(db).toBeDefined();
            expect(db.name).toBe('test-db');
            expect(db.version).toBe(1);
            db.close();
        });

        it('should call onUpgrade when database is created', async () => {
            const onUpgrade = jest.fn();

            await openDatabase('new-db', 1, onUpgrade);

            expect(onUpgrade).toHaveBeenCalled();
        });
    });

    describe('safeStore', () => {
        it('should store data successfully', async () => {
            const db = await openDatabase('store-test-db', 1, (db) => {
                if (!db.objectStoreNames.contains('test-store')) {
                    db.createObjectStore('test-store', { keyPath: 'key' });
                }
            });

            await expect(
                safeStore(db, 'test-store', 'test-key', { data: 'value' })
            ).resolves.toBeUndefined();

            db.close();
        });
    });

    describe('safeRetrieve', () => {
        it('should retrieve stored data', async () => {
            const db = await openDatabase('retrieve-test-db', 1, (db) => {
                if (!db.objectStoreNames.contains('test-store')) {
                    db.createObjectStore('test-store', { keyPath: 'key' });
                }
            });

            // First store some data
            await safeStore(db, 'test-store', 'retrieve-key', { test: 'data' });

            // Then retrieve it
            const result = await safeRetrieve<{ test: string }>(db, 'test-store', 'retrieve-key');
            expect(result).toEqual({ test: 'data' });

            db.close();
        });

        it('should return null for non-existent key', async () => {
            const db = await openDatabase('retrieve-null-db', 1, (db) => {
                if (!db.objectStoreNames.contains('test-store')) {
                    db.createObjectStore('test-store', { keyPath: 'key' });
                }
            });

            const result = await safeRetrieve(db, 'test-store', 'non-existent');
            expect(result).toBeNull();

            db.close();
        });
    });

    describe('getStorageEstimate', () => {
        it('should return null when storage API is not available', async () => {
            // Mock navigator.storage as undefined
            const originalNavigator = global.navigator;
            Object.defineProperty(global, 'navigator', {
                value: {},
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();
            expect(result).toBeNull();

            // Restore navigator
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true,
                configurable: true,
            });
        });

        it('should return storage estimate when available', async () => {
            const mockEstimate = {
                usage: 1000,
                quota: 10000,
                usageDetails: { indexedDB: 500 },
            };

            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockResolvedValue(mockEstimate),
                },
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();
            expect(result).toEqual({
                usage: 1000,
                quota: 10000,
                usageDetails: { indexedDB: 500 },
            });
        });

        it('should handle storage.estimate errors', async () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockRejectedValue(new Error('Estimate failed')),
                },
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();
            expect(result).toBeNull();

            consoleSpy.mockRestore();
        });
    });

    describe('isStorageNearLimit', () => {
        it('should return false when estimate is null', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockResolvedValue(null),
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();
            expect(result).toBe(false);
        });

        it('should return false when quota is 0', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockResolvedValue({
                        usage: 1000,
                        quota: 0,
                    }),
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();
            expect(result).toBe(false);
        });

        it('should return false when usage is below 90%', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockResolvedValue({
                        usage: 50,
                        quota: 100,
                    }),
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();
            expect(result).toBe(false);
        });

        it('should return true when usage is above 90%', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockResolvedValue({
                        usage: 95,
                        quota: 100,
                    }),
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();
            expect(result).toBe(true);
        });
    });

    describe('safeIDBOperation', () => {
        it('should return result on successful operation', async () => {
            const operation = jest.fn().mockResolvedValue('success');

            const result = await safeIDBOperation(operation);

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(1);
        });

        it('should throw error on failure', async () => {
            const error = new Error('Persistent error');
            const operation = jest.fn().mockRejectedValue(error);

            await expect(
                safeIDBOperation(operation, { maxRetries: 0 })
            ).rejects.toBe(error);

            expect(operation).toHaveBeenCalledTimes(1);
        });
    });
});
