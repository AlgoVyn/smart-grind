/**
 * IndexedDB Helper Tests
 * Comprehensive tests for IndexedDB operations with error handling
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

describe('IndexedDB Helper', () => {
    let mockIDB: any;
    let mockDB: any;
    let mockTransaction: any;
    let mockObjectStore: any;
    let mockRequest: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mock request
        mockRequest = {
            onerror: null,
            onsuccess: null,
            onupgradeneeded: null,
            onblocked: null,
            result: null,
            error: null,
        };

        // Setup mock object store
        mockObjectStore = {
            put: jest.fn().mockReturnValue(mockRequest),
            get: jest.fn().mockReturnValue(mockRequest),
            clear: jest.fn().mockReturnValue(mockRequest),
        };

        // Setup mock transaction
        mockTransaction = {
            objectStore: jest.fn().mockReturnValue(mockObjectStore),
            onabort: null,
            onerror: null,
            oncomplete: null,
            error: null,
        };

        // Setup mock database
        mockDB = {
            transaction: jest.fn().mockReturnValue(mockTransaction),
            objectStoreNames: {
                contains: jest.fn().mockReturnValue(true),
            },
            close: jest.fn(),
        };

        // Setup mock IndexedDB
        mockIDB = {
            open: jest.fn().mockReturnValue(mockRequest),
            databases: jest.fn().mockResolvedValue([{ name: 'test-db', version: 1 }]),
        };

        Object.defineProperty(window, 'indexedDB', {
            writable: true,
            value: mockIDB,
        });

        // Mock navigator.storage
        Object.defineProperty(navigator, 'storage', {
            writable: true,
            value: {
                estimate: jest.fn().mockResolvedValue({ usage: 100, quota: 1000 }),
            },
        });
    });

    describe('IDBOperationError', () => {
        test('should create error with correct properties', () => {
            const originalError = new Error('Original');
            const error = new IDBOperationError('Test message', IDBErrorType.QUOTA_EXCEEDED, originalError);

            expect(error.message).toBe('Test message');
            expect(error.name).toBe('IDBOperationError');
            expect(error.type).toBe(IDBErrorType.QUOTA_EXCEEDED);
            expect(error.originalError).toBe(originalError);
        });
    });

    describe('openDatabase', () => {
        test('should open database successfully', async () => {
            const onUpgrade = jest.fn();
            const openPromise = openDatabase('test-db', 1, onUpgrade);

            // Simulate success
            mockRequest.result = mockDB;
            if (mockRequest.onsuccess) {
                mockRequest.onsuccess({ target: mockRequest } as any);
            }

            const result = await openPromise;
            expect(result).toBe(mockDB);
        });

        test('should handle upgrade needed', async () => {
            const onUpgrade = jest.fn();
            const openPromise = openDatabase('test-db', 1, onUpgrade);

            // Simulate upgrade needed
            mockRequest.result = mockDB;
            if (mockRequest.onupgradeneeded) {
                mockRequest.onupgradeneeded({ target: mockRequest } as any);
            }
            if (mockRequest.onsuccess) {
                mockRequest.onsuccess({ target: mockRequest } as any);
            }

            await openPromise;
            expect(onUpgrade).toHaveBeenCalledWith(mockDB);
        });

        test('should handle blocked error', async () => {
            const onUpgrade = jest.fn();
            const openPromise = openDatabase('test-db', 1, onUpgrade);

            // Simulate blocked
            if (mockRequest.onblocked) {
                mockRequest.onblocked({ target: mockRequest } as any);
            }

            await expect(openPromise).rejects.toThrow('Database upgrade blocked');
        });
    });

    describe('safeStore', () => {
        test('should store data successfully', async () => {
            const storePromise = safeStore(mockDB, 'test-store', 'key1', { test: 'data' });

            // Simulate transaction complete
            if (mockTransaction.oncomplete) {
                mockTransaction.oncomplete();
            }

            await storePromise;
            expect(mockObjectStore.put).toHaveBeenCalledWith({ key: 'key1', value: { test: 'data' } });
        });

        test('should handle transaction error', async () => {
            const storePromise = safeStore(mockDB, 'test-store', 'key1', 'value');

            // Simulate transaction error
            mockTransaction.error = new Error('Transaction failed');
            if (mockTransaction.onerror) {
                mockTransaction.onerror({ target: mockTransaction } as any);
            }

            await expect(storePromise).rejects.toThrow('Transaction failed');
        });
    });

    describe('safeRetrieve', () => {
        test('should retrieve data successfully', async () => {
            const retrievePromise = safeRetrieve(mockDB, 'test-store', 'key1');

            // Simulate success with data
            mockRequest.result = { key: 'key1', value: { test: 'data' } };
            if (mockRequest.onsuccess) {
                mockRequest.onsuccess({ target: mockRequest } as any);
            }

            const result = await retrievePromise;
            expect(result).toEqual({ test: 'data' });
        });

        test('should return null when key not found', async () => {
            const retrievePromise = safeRetrieve(mockDB, 'test-store', 'key1');

            // Simulate success with no data
            mockRequest.result = undefined;
            if (mockRequest.onsuccess) {
                mockRequest.onsuccess({ target: mockRequest } as any);
            }

            const result = await retrievePromise;
            expect(result).toBeNull();
        });
    });

    describe('cleanupOldData', () => {
        test('should cleanup data successfully', async () => {
            // Override mockIDB.open to auto-resolve with mockDB
            mockIDB.open.mockImplementation(() => {
                const request: any = {
                    onerror: null,
                    onsuccess: null,
                    onupgradeneeded: null,
                    onblocked: null,
                    result: mockDB,
                    error: null,
                };

                // Auto-trigger success on next microtask
                Promise.resolve().then(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                });

                return request;
            });

            // Override mockObjectStore.clear to auto-resolve
            mockObjectStore.clear.mockImplementation(() => {
                const request: any = {
                    onerror: null,
                    onsuccess: null,
                    result: undefined,
                    error: null,
                };

                // Auto-trigger success on next microtask
                Promise.resolve().then(() => {
                    if (request.onsuccess) {
                        request.onsuccess({ target: request });
                    }
                });

                return request;
            });

            const result = await cleanupOldData('test-db', ['store1', 'store2']);

            expect(result).toBe(true);
            expect(mockObjectStore.clear).toHaveBeenCalledTimes(2);
        });

        test('should return false when database not found', async () => {
            mockIDB.databases = jest.fn().mockResolvedValue([]);

            const result = await cleanupOldData('nonexistent-db', ['store1']);

            expect(result).toBe(false);
        });
    });

    describe('getStorageEstimate', () => {
        test('should return storage estimate', async () => {
            const result = await getStorageEstimate();

            expect(result).toEqual({ usage: 100, quota: 1000 });
        });

        test('should return null when storage API not available', async () => {
            Object.defineProperty(navigator, 'storage', {
                writable: true,
                value: undefined,
            });

            const result = await getStorageEstimate();
            expect(result).toBeNull();
        });

        test('should return null when estimate fails', async () => {
            navigator.storage.estimate = jest.fn().mockRejectedValue(new Error('Estimate failed'));

            const result = await getStorageEstimate();
            expect(result).toBeNull();
        });
    });

    describe('isStorageNearLimit', () => {
        test('should return true when usage > 90%', async () => {
            navigator.storage.estimate = jest.fn().mockResolvedValue({ usage: 950, quota: 1000 });

            const result = await isStorageNearLimit();
            expect(result).toBe(true);
        });

        test('should return false when usage < 90%', async () => {
            navigator.storage.estimate = jest.fn().mockResolvedValue({ usage: 800, quota: 1000 });

            const result = await isStorageNearLimit();
            expect(result).toBe(false);
        });

        test('should return false when quota is 0', async () => {
            navigator.storage.estimate = jest.fn().mockResolvedValue({ usage: 0, quota: 0 });

            const result = await isStorageNearLimit();
            expect(result).toBe(false);
        });
    });

    describe('safeIDBOperation', () => {
        test('should execute operation successfully', async () => {
            const operation = jest.fn().mockResolvedValue('result');

            const result = await safeIDBOperation(operation);

            expect(result).toBe('result');
            expect(operation).toHaveBeenCalledTimes(1);
        });

        test('should retry on failure', async () => {
            const operation = jest.fn()
                .mockRejectedValueOnce(new Error('First failure'))
                .mockResolvedValueOnce('success');

            const result = await safeIDBOperation(operation, { maxRetries: 1 });

            expect(result).toBe('success');
            expect(operation).toHaveBeenCalledTimes(2);
        });

        test('should throw after max retries exceeded', async () => {
            const operation = jest.fn().mockRejectedValue(new Error('Persistent failure'));

            await expect(safeIDBOperation(operation, { maxRetries: 2 }))
                .rejects.toThrow('Persistent failure');

            expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
        });
    });
});
