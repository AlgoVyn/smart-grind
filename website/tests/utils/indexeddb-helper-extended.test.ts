/**
 * @jest-environment jsdom
 *
 * Extended Tests for IndexedDB Helper
 * Covers error handling, quota exceeded scenarios, and cleanup operations
 */

import {
    openDatabase,
    safeStore,
    safeRetrieve,
    cleanupOldData,
    getStorageEstimate,
    isStorageNearLimit,
    safeIDBOperation,
    IDBOperationError,
    IDBErrorType,
} from '../../src/utils/indexeddb-helper';

describe('IndexedDB Helper - Extended', () => {
    let mockIDBRequest: any;
    let mockIDBTransaction: any;
    let mockIDBObjectStore: any;
    let mockIDBDatabase: any;
    let mockOpenDBRequest: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mock object store
        mockIDBObjectStore = {
            put: jest.fn().mockReturnValue({ onsuccess: null, onerror: null }),
            get: jest.fn().mockReturnValue({ onsuccess: null, onerror: null }),
            clear: jest.fn().mockReturnValue({ onsuccess: null, onerror: null }),
        };

        // Setup mock transaction
        mockIDBTransaction = {
            objectStore: jest.fn().mockReturnValue(mockIDBObjectStore),
            onabort: null,
            onerror: null,
            oncomplete: null,
            error: null,
        };

        // Setup mock database
        mockIDBDatabase = {
            close: jest.fn(),
            objectStoreNames: {
                contains: jest.fn().mockReturnValue(true),
            },
            createObjectStore: jest.fn(),
            transaction: jest.fn().mockReturnValue(mockIDBTransaction),
        };

        // Setup mock open request
        mockOpenDBRequest = {
            onsuccess: null,
            onerror: null,
            onupgradeneeded: null,
            onblocked: null,
            result: mockIDBDatabase,
            error: null,
        };

        // Mock indexedDB
        global.indexedDB = {
            open: jest.fn().mockReturnValue(mockOpenDBRequest),
            deleteDatabase: jest.fn(),
            databases: jest.fn().mockResolvedValue([{ name: 'test-db', version: 1 }]),
        } as unknown as IDBFactory;
    });

    describe('openDatabase - Error Handling', () => {
        it('should handle QuotaExceededError on request error', async () => {
            const promise = openDatabase('test-db', 1, () => {});

            // Simulate quota exceeded error
            mockOpenDBRequest.error = {
                name: 'QuotaExceededError',
                message: 'Quota exceeded',
            };
            mockOpenDBRequest.onerror?.(new Event('error'));

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toThrow(/quota/i);
        });

        it('should handle quota error via message', async () => {
            const promise = openDatabase('test-db', 1, () => {});

            mockOpenDBRequest.error = {
                name: 'Error',
                message: 'storage quota exceeded',
            };
            mockOpenDBRequest.onerror?.(new Event('error'));

            await expect(promise).rejects.toThrow(/quota/i);
        });

        it('should handle generic request errors', async () => {
            const promise = openDatabase('test-db', 1, () => {});

            mockOpenDBRequest.error = {
                name: 'UnknownError',
                message: 'Something went wrong',
            };
            mockOpenDBRequest.onerror?.(new Event('error'));

            await expect(promise).rejects.toThrow('Failed to open database test-db');
        });

        it('should handle upgrade errors', async () => {
            const upgradeFn = jest.fn().mockImplementation(() => {
                throw new Error('Upgrade failed');
            });

            const promise = openDatabase('test-db', 1, upgradeFn);

            const upgradeEvent = {
                target: { result: mockIDBDatabase },
            } as unknown as IDBVersionChangeEvent;

            mockOpenDBRequest.onupgradeneeded?.(upgradeEvent);

            await expect(promise).rejects.toThrow('Database upgrade failed');
        });

        it('should handle blocked events', async () => {
            const promise = openDatabase('test-db', 1, () => {});

            mockOpenDBRequest.onblocked?.(new Event('blocked'));

            await expect(promise).rejects.toThrow('Database upgrade blocked');
        });
    });

    describe('safeStore - Transaction Error Handling', () => {
        beforeEach(() => {
            // Setup successful database open
            setTimeout(() => {
                mockOpenDBRequest.onsuccess?.(new Event('success'));
            }, 0);
        });

        it('should handle quota exceeded on transaction abort', async () => {
            const promise = safeStore(mockIDBDatabase, 'test-store', 'key', { data: 'value' });

            // Trigger transaction abort with quota error
            setTimeout(() => {
                mockIDBTransaction.error = {
                    name: 'QuotaExceededError',
                    message: 'quota exceeded',
                };
                mockIDBTransaction.onabort?.(new Event('abort'));
            }, 10);

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toThrow(/quota/i);
        });

        it('should handle generic transaction abort', async () => {
            const promise = safeStore(mockIDBDatabase, 'test-store', 'key', { data: 'value' });

            setTimeout(() => {
                mockIDBTransaction.error = {
                    name: 'AbortError',
                    message: 'Transaction aborted',
                };
                mockIDBTransaction.onabort?.(new Event('abort'));
            }, 10);

            await expect(promise).rejects.toThrow('Transaction aborted');
        });

        it('should handle transaction errors', async () => {
            const promise = safeStore(mockIDBDatabase, 'test-store', 'key', { data: 'value' });

            setTimeout(() => {
                mockIDBTransaction.error = {
                    name: 'UnknownError',
                    message: 'Transaction failed',
                };
                mockIDBTransaction.onerror?.(new Event('error'));
            }, 10);

            await expect(promise).rejects.toThrow('Transaction failed');
        });

        it('should handle request errors with quota exceeded', async () => {
            const mockRequest = { onerror: null as any, onsuccess: null as any, error: null as any };
            mockIDBObjectStore.put.mockReturnValue(mockRequest);

            const promise = safeStore(mockIDBDatabase, 'test-store', 'key', { data: 'value' });

            setTimeout(() => {
                mockRequest.error = { name: 'QuotaExceededError', message: 'quota exceeded' };
                mockRequest.onerror?.(new Event('error'));
            }, 10);

            await expect(promise).rejects.toThrow(/quota/i);
        });

        it('should handle unexpected errors during store', async () => {
            mockIDBDatabase.transaction.mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            await expect(safeStore(mockIDBDatabase, 'test-store', 'key', {})).rejects.toThrow(
                'Unexpected error during store'
            );
        });

        it('should complete successfully on transaction complete', async () => {
            const promise = safeStore(mockIDBDatabase, 'test-store', 'key', { data: 'value' });

            setTimeout(() => {
                mockIDBTransaction.oncomplete?.(new Event('complete'));
            }, 10);

            await expect(promise).resolves.toBeUndefined();
        });
    });

    describe('safeRetrieve - Error Handling', () => {
        it('should handle request errors', async () => {
            const mockRequest = { onerror: null as any, onsuccess: null as any, error: null as any };
            mockIDBObjectStore.get.mockReturnValue(mockRequest);

            const promise = safeRetrieve(mockIDBDatabase, 'test-store', 'key');

            setTimeout(() => {
                mockRequest.error = { name: 'Error', message: 'Get failed' };
                mockRequest.onerror?.(new Event('error'));
            }, 10);

            await expect(promise).rejects.toThrow('Failed to retrieve data');
        });

        it('should handle unexpected errors during retrieve', async () => {
            mockIDBDatabase.transaction.mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            await expect(safeRetrieve(mockIDBDatabase, 'test-store', 'key')).rejects.toThrow(
                'Unexpected error during retrieve'
            );
        });
    });

    describe('cleanupOldData', () => {
        it('should return false when database is not found', async () => {
            (global.indexedDB.databases as jest.Mock).mockResolvedValue([]);

            const result = await cleanupOldData('non-existent-db', ['store1']);

            expect(result).toBe(false);
        });
    });

    describe('getStorageEstimate', () => {
        it('should return storage estimate when available', async () => {
            const mockEstimate = {
                usage: 1000000,
                quota: 10000000,
                usageDetails: { indexedDB: 500000 },
            };

            Object.defineProperty(navigator, 'storage', {
                value: { estimate: jest.fn().mockResolvedValue(mockEstimate) },
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();

            expect(result).toEqual(mockEstimate);
        });

        it('should return null when storage API is not available', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();

            expect(result).toBeNull();
        });

        it('should return null when estimate throws', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockRejectedValue(new Error('Estimate failed')),
                },
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();

            expect(result).toBeNull();
        });

        it('should handle estimate without usageDetails', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockResolvedValue({
                        usage: 1000000,
                        quota: 10000000,
                    }),
                },
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();

            expect(result).toEqual({
                usage: 1000000,
                quota: 10000000,
            });
            expect(result).not.toHaveProperty('usageDetails');
        });
    });

    describe('isStorageNearLimit', () => {
        it('should return true when usage is above 90%', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockResolvedValue({
                        usage: 950000000,
                        quota: 1000000000,
                    }),
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();

            expect(result).toBe(true);
        });

        it('should return false when usage is below 90%', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: {
                    estimate: jest.fn().mockResolvedValue({
                        usage: 500000000,
                        quota: 1000000000,
                    }),
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();

            expect(result).toBe(false);
        });

        it('should return false when estimate is null', async () => {
            Object.defineProperty(navigator, 'storage', {
                value: { estimate: jest.fn().mockResolvedValue(null) },
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
                        usage: 100,
                        quota: 0,
                    }),
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();

            expect(result).toBe(false);
        });
    });

    describe('safeIDBOperation', () => {
        it('should return result on successful operation', async () => {
            const operation = jest.fn().mockResolvedValue('success');

            const result = await safeIDBOperation(operation);

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(1);
        });

        it('should retry on failure and succeed', async () => {
            const operation = jest.fn()
                .mockRejectedValueOnce(new Error('Temporary failure'))
                .mockResolvedValueOnce('success');

            const result = await safeIDBOperation(operation, { maxRetries: 1 });

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(2);
        });

        it('should throw after max retries exceeded', async () => {
            const operation = jest.fn().mockRejectedValue(new Error('Persistent failure'));

            await expect(
                safeIDBOperation(operation, { maxRetries: 2 })
            ).rejects.toThrow('Persistent failure');

            expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
        });

        it('should retry on failure without cleanup options', async () => {
            const operation = jest.fn()
                .mockRejectedValueOnce(new Error('Temporary failure'))
                .mockResolvedValueOnce('success');

            const result = await safeIDBOperation(operation, { maxRetries: 1 });

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(2);
        }, 10000);

        it('should throw when cleanup fails on quota exceeded', async () => {
            const operation = jest.fn().mockRejectedValue(
                Object.assign(new Error('Quota exceeded'), { name: 'QuotaExceededError' })
            );

            (global.indexedDB.databases as jest.Mock).mockResolvedValue([]);

            await expect(
                safeIDBOperation(operation, {
                    maxRetries: 1,
                    cleanupStores: ['store1'],
                    dbName: 'test-db',
                })
            ).rejects.toThrow('Quota exceeded');
        });
    });

    describe('IDBOperationError', () => {
        it('should create error with type and message', () => {
            const error = new IDBOperationError('Test message', IDBErrorType.QUOTA_EXCEEDED);

            expect(error.message).toBe('Test message');
            expect(error.type).toBe(IDBErrorType.QUOTA_EXCEEDED);
            expect(error.name).toBe('IDBOperationError');
        });

        it('should store original error', () => {
            const originalError = new Error('Original');
            const error = new IDBOperationError(
                'Test message',
                IDBErrorType.UNKNOWN,
                originalError
            );

            expect(error.originalError).toBe(originalError);
        });

        it('should have all error types defined', () => {
            expect(IDBErrorType.QUOTA_EXCEEDED).toBe('QuotaExceededError');
            expect(IDBErrorType.VERSION_ERROR).toBe('VersionError');
            expect(IDBErrorType.ABORT).toBe('AbortError');
            expect(IDBErrorType.UNKNOWN).toBe('UnknownError');
        });
    });
});
