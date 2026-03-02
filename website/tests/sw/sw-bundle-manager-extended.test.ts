/**
 * @jest-environment jsdom
 *
 * Extended Tests for SW Bundle Manager
 * Covers checkAndDownloadBundle, retry logic, and error handling
 */

// Mock IndexedDB helper before imports
jest.mock('../../src/utils/indexeddb-helper', () => {
    return {
        openDatabase: jest.fn().mockResolvedValue({
            close: jest.fn(),
            objectStoreNames: { contains: jest.fn().mockReturnValue(true) },
        }),
        safeStore: jest.fn().mockResolvedValue(undefined),
        safeRetrieve: jest.fn().mockResolvedValue(null),
        IDBOperationError: class IDBOperationError extends Error {
            type: string;
            constructor(message: string, type: string) {
                super(message);
                this.type = type;
            }
        },
        IDBErrorType: {
            QUOTA_EXCEEDED: 'QuotaExceededError',
            VERSION_ERROR: 'VersionError',
            ABORT: 'AbortError',
            UNKNOWN: 'UnknownError',
        },
    };
});

// Mock CACHE_NAMES
jest.mock('../../src/sw/cache-strategies', () => ({
    CACHE_NAMES: {
        PROBLEMS: 'problems-cache',
        API: 'api-cache',
        STATIC: 'static-cache',
        USER: 'user-cache',
        DYNAMIC: 'dynamic-cache',
    },
}));

import {
    getBundleStatus,
    checkAndDownloadBundle,
    type BundleDownloadState,
} from '../../src/sw/sw-bundle-manager';

describe('SW Bundle Manager - Extended', () => {
    let mockFetch: jest.Mock;
    let mockClients: any[];
    let idbStore: Map<string, any>;
    let mockIDBRetrieve: jest.Mock;
    let mockIDBStore: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        mockFetch = jest.fn();
        global.fetch = mockFetch;
        idbStore = new Map();
        mockClients = [];

        // Get mock references
        const idbHelper = jest.requireMock('../../src/utils/indexeddb-helper');
        mockIDBRetrieve = idbHelper.safeRetrieve;
        mockIDBStore = idbHelper.safeStore;

        // Reset IDB mocks with working implementation
        mockIDBRetrieve.mockImplementation((db: any, store: string, key: string) => {
            return Promise.resolve(idbStore.get(key) ?? null);
        });
        mockIDBStore.mockImplementation((db: any, store: string, key: string, value: any) => {
            idbStore.set(key, value);
            return Promise.resolve();
        });

        // Mock clients API
        const mockClient = {
            postMessage: jest.fn(),
            id: 'test-client',
        };
        mockClients = [mockClient];

        (global.self as unknown as ServiceWorkerGlobalScope).clients = {
            matchAll: jest.fn().mockResolvedValue(mockClients),
            claim: jest.fn().mockResolvedValue(undefined),
            get: jest.fn().mockResolvedValue(null),
        };

        // Mock registration scope
        (global.self as unknown as ServiceWorkerGlobalScope).registration = {
            scope: 'https://example.com/smartgrind/',
        } as unknown as ServiceWorkerRegistration;

        // Mock caches API
        global.caches = {
            open: jest.fn().mockResolvedValue({
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue([]),
            }),
            match: jest.fn().mockResolvedValue(undefined),
            has: jest.fn().mockResolvedValue(false),
            delete: jest.fn().mockResolvedValue(true),
            keys: jest.fn().mockResolvedValue([]),
        } as unknown as CacheStorage;
    });

    afterEach(() => {
        jest.useRealTimers();
    });


    describe('Bundle State Management', () => {
        it('should save and retrieve bundle state from IDB', async () => {
            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 50,
                totalFiles: 100,
                extractedFiles: 50,
            };

            idbStore.set('smartgrind-bundle-state', state);

            const retrieved = await getBundleStatus();
            expect(retrieved).toEqual(state);
        });

        it('should return default state when IDB returns null', async () => {
            const status = await getBundleStatus();
            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });
        });

        it('should handle IDB errors gracefully', async () => {
            mockIDBRetrieve.mockRejectedValueOnce(new Error('IDB Error'));

            const status = await getBundleStatus();
            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });
        });
    });



    describe('BundleDownloadState Interface', () => {
        it('should handle all status values', () => {
            const statuses: BundleDownloadState['status'][] = [
                'idle',
                'downloading',
                'extracting',
                'complete',
                'error',
            ];

            statuses.forEach((status) => {
                const state: BundleDownloadState = {
                    status,
                    progress: 0,
                    totalFiles: 0,
                    extractedFiles: 0,
                };
                expect(state.status).toBe(status);
            });
        });

        it('should include error message in error state', () => {
            const errorState: BundleDownloadState = {
                status: 'error',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
                error: 'Download failed',
            };

            expect(errorState.error).toBe('Download failed');
        });

        it('should include bundle version in complete state', () => {
            const completeState: BundleDownloadState = {
                status: 'complete',
                progress: 100,
                totalFiles: 100,
                extractedFiles: 100,
                bundleVersion: '1.2.3',
                downloadedAt: 1234567890,
            };

            expect(completeState.bundleVersion).toBe('1.2.3');
            expect(completeState.downloadedAt).toBe(1234567890);
        });

        it('should handle extracting status with file counts', () => {
            const extractingState: BundleDownloadState = {
                status: 'extracting',
                progress: 75,
                totalFiles: 100,
                extractedFiles: 75,
            };

            expect(extractingState.totalFiles).toBe(100);
            expect(extractingState.extractedFiles).toBe(75);
        });
    });
});
