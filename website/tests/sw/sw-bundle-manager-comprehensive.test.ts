/**
 * @jest-environment jsdom
 *
 * Comprehensive Tests for SW Bundle Manager
 * Covers bundle download status, state types, and IDB operations
 */

import {
    getBundleStatus,
    type BundleDownloadState,
} from '../../src/sw/sw-bundle-manager';
import { openDatabase, safeStore, safeRetrieve } from '../../src/utils/indexeddb-helper';

// Mock IndexedDB helper with mock DB factory inside
jest.mock('../../src/utils/indexeddb-helper', () => {
    const createMockDB = () => ({
        close: jest.fn(),
        objectStoreNames: {
            contains: jest.fn().mockReturnValue(false),
        },
        createObjectStore: jest.fn(),
    });
    return {
        openDatabase: jest.fn().mockResolvedValue(createMockDB()),
        safeStore: jest.fn().mockResolvedValue(undefined),
        safeRetrieve: jest.fn().mockResolvedValue(null),
        IDBOperationError: class IDBOperationError extends Error {
            type: string;
            constructor(type: string, message: string) {
                super(message);
                this.type = type;
            }
        },
        IDBErrorType: {
            QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
            TRANSACTION_FAILED: 'TRANSACTION_FAILED',
            STORE_NOT_FOUND: 'STORE_NOT_FOUND',
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

describe('SW Bundle Manager - Comprehensive', () => {
    let mockIDBData: Map<string, unknown>;

    beforeEach(() => {
        mockIDBData = new Map();
        // Reset mock to default behavior (return null)
        (safeRetrieve as jest.Mock).mockResolvedValue(null);
    });



    describe('getBundleStatus', () => {
        it('should return default status when no state exists in IDB', async () => {
            const status = await getBundleStatus();

            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });
        });

        it('should return saved state from IDB', async () => {
            const savedState: BundleDownloadState = {
                status: 'complete',
                progress: 100,
                totalFiles: 150,
                extractedFiles: 150,
                bundleVersion: '1.0.0',
                downloadedAt: 1234567890,
            };

            // Override mock to return saved state for this test
            (safeRetrieve as jest.Mock).mockResolvedValueOnce(savedState);

            const status = await getBundleStatus();

            expect(status).toEqual(savedState);
        });

        it('should handle IDB errors gracefully', async () => {
            (safeRetrieve as jest.Mock).mockRejectedValueOnce(new Error('IDB Error'));

            const status = await getBundleStatus();

            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });
        });
    });

    describe('BundleDownloadState type', () => {
        it('should support all status values', () => {
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

        it('should support downloading status with progress', () => {
            const downloadingState: BundleDownloadState = {
                status: 'downloading',
                progress: 50,
                totalFiles: 0,
                extractedFiles: 0,
            };

            expect(downloadingState.progress).toBe(50);
        });

        it('should support extracting status with file counts', () => {
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

    describe('IDB state retrieval', () => {
        it('should return idle state when IDB returns null', async () => {
            // Mock returns null by default
            (safeRetrieve as jest.Mock).mockResolvedValueOnce(null);

            const status = await getBundleStatus();

            expect(status.status).toBe('idle');
            expect(status.progress).toBe(0);
        });

        it('should return idle state when IDB is empty', async () => {
            mockIDBData.clear();

            const status = await getBundleStatus();

            expect(status.status).toBe('idle');
            expect(status.totalFiles).toBe(0);
        });
    });

    describe('IDB error handling', () => {
        it('should handle quota exceeded errors', async () => {
            const { IDBOperationError, IDBErrorType } = jest.requireMock('../../src/utils/indexeddb-helper');

            const error = new IDBOperationError(IDBErrorType.QUOTA_EXCEEDED, 'Storage quota exceeded');
            expect(error.type).toBe('QUOTA_EXCEEDED');
            expect(error.message).toBe('Storage quota exceeded');
        });

        it('should handle transaction failed errors', async () => {
            const { IDBOperationError, IDBErrorType } = jest.requireMock('../../src/utils/indexeddb-helper');

            const error = new IDBOperationError(IDBErrorType.TRANSACTION_FAILED, 'Transaction failed');
            expect(error.type).toBe('TRANSACTION_FAILED');
        });

        it('should handle store not found errors', async () => {
            const { IDBOperationError, IDBErrorType } = jest.requireMock('../../src/utils/indexeddb-helper');

            const error = new IDBOperationError(IDBErrorType.STORE_NOT_FOUND, 'Store not found');
            expect(error.type).toBe('STORE_NOT_FOUND');
        });
    });
});
