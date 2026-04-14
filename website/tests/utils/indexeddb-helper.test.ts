/**
 * @jest-environment jsdom
 *
 * Tests for IndexedDB Helper Module
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
    let mockIndexedDB: {
        open: jest.Mock;
        databases: jest.Mock;
    };

    let mockIDBDatabase: {
        close: jest.Mock;
        transaction: jest.Mock;
        objectStoreNames: { contains: jest.Mock };
    };

    let mockIDBTransaction: {
        objectStore: jest.Mock;
        onabort: ((() => void) | null);
        onerror: ((() => void) | null);
        oncomplete: ((() => void) | null);
        abort: jest.Mock;
    };

    let mockIDBObjectStore: {
        put: jest.Mock;
        get: jest.Mock;
        clear: jest.Mock;
    };

    let mockIDBRequest: {
        onsuccess: ((() => void) | null);
        onerror: ((() => void) | null);
        onupgradeneeded: ((() => void) | null);
        onblocked: ((() => void) | null);
        result: unknown;
        error: Error | null;
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockIDBRequest = {
            onsuccess: null,
            onerror: null,
            onupgradeneeded: null,
            onblocked: null,
            result: null,
            error: null,
        };

        mockIDBObjectStore = {
            put: jest.fn(() => mockIDBRequest),
            get: jest.fn(() => mockIDBRequest),
            clear: jest.fn(() => mockIDBRequest),
        };

        mockIDBTransaction = {
            objectStore: jest.fn(() => mockIDBObjectStore),
            onabort: null,
            onerror: null,
            oncomplete: null,
            abort: jest.fn(),
        };

        mockIDBDatabase = {
            close: jest.fn(),
            transaction: jest.fn(() => mockIDBTransaction),
            objectStoreNames: {
                contains: jest.fn(() => true),
            },
        };

        mockIndexedDB = {
            open: jest.fn(() => mockIDBRequest),
            databases: jest.fn(async () => [{ name: 'test-db', version: 1 }]),
        };

        (global as Record<string, unknown>).indexedDB = mockIndexedDB;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('IDBErrorType', () => {
        it('should have correct enum values', () => {
            expect(IDBErrorType.QUOTA_EXCEEDED).toBe('QuotaExceededError');
            expect(IDBErrorType.VERSION_ERROR).toBe('VersionError');
            expect(IDBErrorType.ABORT).toBe('AbortError');
            expect(IDBErrorType.UNKNOWN).toBe('UnknownError');
        });
    });

    describe('IDBOperationError', () => {
        it('should create error with all properties', () => {
            const originalError = new Error('Original error');
            const error = new IDBOperationError(
                'Custom message',
                IDBErrorType.QUOTA_EXCEEDED,
                originalError
            );

            expect(error.name).toBe('IDBOperationError');
            expect(error.message).toBe('Custom message');
            expect(error.type).toBe(IDBErrorType.QUOTA_EXCEEDED);
            expect(error.originalError).toBe(originalError);
        });

        it('should create error without original error', () => {
            const error = new IDBOperationError('Custom message', IDBErrorType.UNKNOWN);

            expect(error.name).toBe('IDBOperationError');
            expect(error.message).toBe('Custom message');
            expect(error.type).toBe(IDBErrorType.UNKNOWN);
            expect(error.originalError).toBeUndefined();
        });
    });

    describe('openDatabase', () => {
        it('should resolve with database on success', async () => {
            const onUpgrade = jest.fn();
            const promise = openDatabase('test-db', 1, onUpgrade);

            // Simulate success
            setTimeout(() => {
                mockIDBRequest.result = mockIDBDatabase;
                mockIDBRequest.onsuccess?.();
            }, 0);

            const result = await promise;
            expect(result).toBe(mockIDBDatabase);
        });

        it('should call onUpgrade when upgrade needed', async () => {
            const onUpgrade = jest.fn();

            // Set up the mock to trigger onupgradeneeded synchronously when open is called
            mockIndexedDB.open.mockImplementation(() => {
                setTimeout(() => {
                    mockIDBRequest.result = mockIDBDatabase;
                    mockIDBRequest.onupgradeneeded?.({
                        target: { result: mockIDBDatabase },
                    } as unknown as IDBVersionChangeEvent);
                    // Also trigger success
                    setTimeout(() => {
                        mockIDBRequest.onsuccess?.();
                    }, 0);
                }, 0);
                return mockIDBRequest;
            });

            await openDatabase('test-db', 2, onUpgrade);
            expect(onUpgrade).toHaveBeenCalledWith(mockIDBDatabase);
        });

        it('should reject with QUOTA_EXCEEDED error', async () => {
            const onUpgrade = jest.fn();
            const promise = openDatabase('test-db', 1, onUpgrade);

            setTimeout(() => {
                mockIDBRequest.error = new Error('The quota has been exceeded');
                mockIDBRequest.onerror?.();
            }, 0);

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toMatchObject({
                type: IDBErrorType.QUOTA_EXCEEDED,
                message: expect.stringContaining('Storage quota exceeded'),
            });
        });

        it('should reject with ABORT error when blocked', async () => {
            const onUpgrade = jest.fn();
            const promise = openDatabase('test-db', 2, onUpgrade);

            setTimeout(() => {
                mockIDBRequest.onblocked?.();
            }, 0);

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toMatchObject({
                type: IDBErrorType.ABORT,
                message: expect.stringContaining('Database upgrade blocked'),
            });
        });

        it('should reject with unknown error', async () => {
            const onUpgrade = jest.fn();
            const promise = openDatabase('test-db', 1, onUpgrade);

            setTimeout(() => {
                mockIDBRequest.error = new Error('Some random error');
                mockIDBRequest.onerror?.();
            }, 0);

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toMatchObject({
                message: expect.stringContaining('Failed to open database'),
            });
        });
    });

    describe('safeStore', () => {
        it('should resolve on success', async () => {
            const promise = safeStore(mockIDBDatabase as unknown as IDBDatabase, 'store1', 'key1', { data: 'value' });

            setTimeout(() => {
                mockIDBTransaction.oncomplete?.();
            }, 0);

            await expect(promise).resolves.toBeUndefined();
        });

        it('should reject with QUOTA_EXCEEDED on transaction abort', async () => {
            const promise = safeStore(mockIDBDatabase as unknown as IDBDatabase, 'store1', 'key1', { data: 'value' });

            setTimeout(() => {
                (mockIDBTransaction as unknown as { error: Error }).error = new Error('quota exceeded');
                mockIDBTransaction.onabort?.();
            }, 0);

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toMatchObject({
                type: IDBErrorType.QUOTA_EXCEEDED,
            });
        });

        it('should reject with transaction error', async () => {
            const promise = safeStore(mockIDBDatabase as unknown as IDBDatabase, 'store1', 'key1', { data: 'value' });

            setTimeout(() => {
                (mockIDBTransaction as unknown as { error: Error }).error = new Error('transaction failed');
                mockIDBTransaction.onerror?.();
            }, 0);

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toMatchObject({
                message: expect.stringContaining('Transaction failed'),
            });
        });

        it('should reject with request error', async () => {
            const promise = safeStore(mockIDBDatabase as unknown as IDBDatabase, 'store1', 'key1', { data: 'value' });

            setTimeout(() => {
                mockIDBRequest.error = new Error('request failed');
                mockIDBRequest.onerror?.();
            }, 0);

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toMatchObject({
                message: expect.stringContaining('Failed to store data'),
            });
        });
    });

    describe('safeRetrieve', () => {
        it('should return value on success', async () => {
            const testValue = { data: 'retrieved' };

            const promise = safeRetrieve(mockIDBDatabase as unknown as IDBDatabase, 'store1', 'key1');

            setTimeout(() => {
                mockIDBRequest.result = { value: testValue };
                mockIDBRequest.onsuccess?.();
            }, 0);

            const result = await promise;
            expect(result).toEqual(testValue);
        });

        it('should return null when result is undefined', async () => {
            const promise = safeRetrieve(mockIDBDatabase as unknown as IDBDatabase, 'store1', 'key1');

            setTimeout(() => {
                mockIDBRequest.result = undefined;
                mockIDBRequest.onsuccess?.();
            }, 0);

            const result = await promise;
            expect(result).toBeNull();
        });

        it('should return result.value format', async () => {
            const promise = safeRetrieve(mockIDBDatabase as unknown as IDBDatabase, 'store1', 'key1');

            setTimeout(() => {
                mockIDBRequest.result = { value: 'direct-value' };
                mockIDBRequest.onsuccess?.();
            }, 0);

            const result = await promise;
            expect(result).toBe('direct-value');
        });

        it('should reject with error', async () => {
            const promise = safeRetrieve(mockIDBDatabase as unknown as IDBDatabase, 'store1', 'key1');

            setTimeout(() => {
                mockIDBRequest.error = new Error('retrieve failed');
                mockIDBRequest.onerror?.();
            }, 0);

            await expect(promise).rejects.toThrow(IDBOperationError);
            await expect(promise).rejects.toMatchObject({
                message: expect.stringContaining('Failed to retrieve data'),
            });
        });
    });

    describe('cleanupOldData', () => {
        it('should return true on successful cleanup', async () => {
            mockIndexedDB.databases.mockResolvedValue([{ name: 'test-db', version: 1 }]);

            // Create a fresh mock request for the clear operation
            const clearRequest = {
                onsuccess: null as (() => void) | null,
                onerror: null as (() => void) | null,
            };

            const mockStore = {
                clear: jest.fn(() => clearRequest),
            };

            const mockTx = {
                objectStore: jest.fn(() => mockStore),
            };

            const mockDb = {
                close: jest.fn(),
                transaction: jest.fn(() => mockTx),
                objectStoreNames: { contains: jest.fn(() => true) },
            };

            mockIndexedDB.open.mockImplementation(() => {
                const request = {
                    onsuccess: null as (() => void) | null,
                    onerror: null as (() => void) | null,
                    result: mockDb,
                };
                setTimeout(() => {
                    request.onsuccess?.();
                }, 0);
                return request;
            });

            const promise = cleanupOldData('test-db', ['store1', 'store2']);

            // Wait for the clear operations to be set up and resolve them
            await new Promise(resolve => setTimeout(resolve, 50));

            // Resolve both clear operations (one for each store)
            clearRequest.onsuccess?.();
            await new Promise(resolve => setTimeout(resolve, 50));
            clearRequest.onsuccess?.();

            const result = await promise;
            expect(result).toBe(true);
        });

        it('should return false when database not found', async () => {
            mockIndexedDB.databases.mockResolvedValue([{ name: 'other-db', version: 1 }]);

            const result = await cleanupOldData('test-db', ['store1']);
            expect(result).toBe(false);
        });

        it('should return false on error', async () => {
            mockIndexedDB.databases.mockRejectedValue(new Error('Database error'));

            const result = await cleanupOldData('test-db', ['store1']);
            expect(result).toBe(false);
        });
    });

    describe('getStorageEstimate', () => {
        const originalNavigator = global.navigator;

        afterEach(() => {
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true,
                configurable: true,
            });
        });

        it('should return estimate when supported', async () => {
            const mockEstimate = {
                usage: 1000,
                quota: 10000,
                usageDetails: { indexedDB: 500 },
            };

            Object.defineProperty(global, 'navigator', {
                value: {
                    storage: {
                        estimate: jest.fn().mockResolvedValue(mockEstimate),
                    },
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

        it('should return estimate without usageDetails when not present', async () => {
            const mockEstimate = {
                usage: 1000,
                quota: 10000,
            };

            Object.defineProperty(global, 'navigator', {
                value: {
                    storage: {
                        estimate: jest.fn().mockResolvedValue(mockEstimate),
                    },
                },
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();
            expect(result).toEqual({
                usage: 1000,
                quota: 10000,
            });
            expect(result).not.toHaveProperty('usageDetails');
        });

        it('should return null when not supported', async () => {
            Object.defineProperty(global, 'navigator', {
                value: {},
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();
            expect(result).toBeNull();
        });

        it('should return null on error', async () => {
            Object.defineProperty(global, 'navigator', {
                value: {
                    storage: {
                        estimate: jest.fn().mockRejectedValue(new Error('Storage error')),
                    },
                },
                writable: true,
                configurable: true,
            });

            const result = await getStorageEstimate();
            expect(result).toBeNull();
        });
    });

    describe('isStorageNearLimit', () => {
        const originalNavigator = global.navigator;

        afterEach(() => {
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true,
                configurable: true,
            });
        });

        it('should return true when usage > 90%', async () => {
            Object.defineProperty(global, 'navigator', {
                value: {
                    storage: {
                        estimate: jest.fn().mockResolvedValue({
                            usage: 9500,
                            quota: 10000,
                        }),
                    },
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();
            expect(result).toBe(true);
        });

        it('should return false when usage < 90%', async () => {
            Object.defineProperty(global, 'navigator', {
                value: {
                    storage: {
                        estimate: jest.fn().mockResolvedValue({
                            usage: 8000,
                            quota: 10000,
                        }),
                    },
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();
            expect(result).toBe(false);
        });

        it('should return false when estimate is null', async () => {
            Object.defineProperty(global, 'navigator', {
                value: {},
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();
            expect(result).toBe(false);
        });

        it('should return false when quota is 0', async () => {
            Object.defineProperty(global, 'navigator', {
                value: {
                    storage: {
                        estimate: jest.fn().mockResolvedValue({
                            usage: 0,
                            quota: 0,
                        }),
                    },
                },
                writable: true,
                configurable: true,
            });

            const result = await isStorageNearLimit();
            expect(result).toBe(false);
        });
    });

    describe('safeIDBOperation', () => {
        it('should succeed on first attempt', async () => {
            const operation = jest.fn().mockResolvedValue('success');

            const result = await safeIDBOperation(operation);
            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(1);
        });

        it('should throw after retry exhaustion', async () => {
            const error = new Error('persistent error');
            const operation = jest.fn().mockRejectedValue(error);

            await expect(
                safeIDBOperation(operation, { maxRetries: 1 })
            ).rejects.toThrow('persistent error');
            expect(operation).toHaveBeenCalledTimes(2);
        });

        it('should work without cleanup options', async () => {
            const error = new Error('quota exceeded');
            const operation = jest.fn()
                .mockRejectedValueOnce(error)
                .mockResolvedValueOnce('success');

            const result = await safeIDBOperation(operation, { maxRetries: 1 });
            expect(result).toBe('success');
        });

        it('should not cleanup when error is not quota related', async () => {
            const error = new Error('some other error');
            const operation = jest.fn()
                .mockRejectedValueOnce(error)
                .mockResolvedValueOnce('success');

            const result = await safeIDBOperation(operation, {
                maxRetries: 1,
                cleanupStores: ['store1'],
                dbName: 'test-db',
            });
            expect(result).toBe('success');
            expect(mockIndexedDB.databases).not.toHaveBeenCalled();
        });
    });
});
