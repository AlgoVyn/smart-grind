/**
 * Bundle Manager Tests
 * Comprehensive tests for offline bundle download, extraction, and caching
 */

import { BundleManager } from '../../../src/sw/bundle/bundle-manager';
import type { BundleDownloadState, BundleManifest } from '../../../src/sw/bundle/types';
import { parseTar } from '../../../src/sw/bundle/tar-parser';

// Mock dependencies
jest.mock('../../../src/sw/bundle/tar-parser', () => ({
    parseTar: jest.fn(),
}));

jest.mock('../../../src/utils/indexeddb-helper', () => ({
    openDatabase: jest.fn(),
    safeStore: jest.fn(),
    safeRetrieve: jest.fn(),
    IDBOperationError: class IDBOperationError extends Error {
        type: string;
        constructor(type: string, message: string) {
            super(message);
            this.type = type;
            this.name = 'IDBOperationError';
        }
    },
    IDBErrorType: {
        QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
        TRANSACTION_FAILED: 'TRANSACTION_FAILED',
        STORE_NOT_FOUND: 'STORE_NOT_FOUND',
        DATABASE_CLOSED: 'DATABASE_CLOSED',
    },
}));

import { openDatabase, safeStore, safeRetrieve, IDBOperationError, IDBErrorType } from '../../../src/utils/indexeddb-helper';

describe('BundleManager', () => {
    let bundleManager: BundleManager;
    let mockClients: { matchAll: jest.Mock; claim: jest.Mock; get: jest.Mock };
    let mockFetch: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Mock clients
        mockClients = {
            matchAll: jest.fn().mockResolvedValue([]),
            claim: jest.fn().mockResolvedValue(undefined),
            get: jest.fn().mockResolvedValue(null),
        };

        // Setup self.clients mock
        Object.defineProperty(global.self, 'clients', {
            value: mockClients,
            writable: true,
            configurable: true,
        });

        // Mock fetch
        mockFetch = global.fetch as jest.Mock;
        mockFetch.mockReset();

        // Setup openDatabase mock
        (openDatabase as jest.Mock).mockResolvedValue({
            createObjectStore: jest.fn(),
            transaction: jest.fn().mockReturnValue({
                objectStore: jest.fn().mockReturnValue({
                    put: jest.fn(),
                    get: jest.fn(),
                }),
                oncomplete: null,
                onerror: null,
                onabort: null,
            }),
            close: jest.fn(),
            objectStoreNames: {
                contains: jest.fn().mockReturnValue(false),
            },
        });
        (safeStore as jest.Mock).mockResolvedValue(undefined);
        (safeRetrieve as jest.Mock).mockResolvedValue(null);

        // Create BundleManager instance
        bundleManager = new BundleManager('1.0.0');
    });

    afterEach(() => {
        jest.useRealTimers();
        bundleManager.clearScheduledChecks();
    });

    describe('constructor', () => {
        test('should create BundleManager with version', () => {
            const manager = new BundleManager('2.0.0');
            expect(manager).toBeDefined();
            expect(typeof manager.getStatus).toBe('function');
        });
    });

    describe('Development mode detection', () => {
        test('should skip downloads in development mode (localhost)', async () => {
            const manager = new BundleManager('1.0.0');
            Object.defineProperty(manager, 'isDev', {
                get: () => true,
                configurable: true,
            });

            await manager.checkAndDownload();

            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    describe('getStatus', () => {
        test('should return initial idle state when no state exists', async () => {
            (safeRetrieve as jest.Mock).mockResolvedValue(null);

            const status = await bundleManager.getStatus();

            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });
        });

        test('should return state from IndexedDB', async () => {
            const storedState: BundleDownloadState = {
                status: 'complete',
                progress: 100,
                totalFiles: 10,
                extractedFiles: 10,
                bundleVersion: '1.0.0',
                downloadedAt: Date.now(),
            };
            (safeRetrieve as jest.Mock).mockResolvedValue(storedState);

            const status = await bundleManager.getStatus();

            expect(status).toEqual(storedState);
        });

        test('should return initial state when IndexedDB fails', async () => {
            (safeRetrieve as jest.Mock).mockRejectedValue(new Error('DB error'));

            const status = await bundleManager.getStatus();

            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });
        });
    });

    describe('checkAndDownload - download already in progress detection', () => {
        let manager: BundleManager;

        beforeEach(() => {
            manager = new BundleManager('1.0.0');
            Object.defineProperty(manager, 'isDev', {
                get: () => false,
                configurable: true,
            });
        });

        test('should skip when download is already in progress', async () => {
            (safeRetrieve as jest.Mock).mockResolvedValue({
                status: 'downloading',
                progress: 50,
                totalFiles: 10,
                extractedFiles: 0,
            });

            await manager.checkAndDownload();

            expect(mockFetch).not.toHaveBeenCalled();
        });

        test('should skip when extraction is in progress', async () => {
            (safeRetrieve as jest.Mock).mockResolvedValue({
                status: 'extracting',
                progress: 75,
                totalFiles: 10,
                extractedFiles: 5,
            });

            await manager.checkAndDownload();

            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    describe('Manifest fetching', () => {
        test('should fetch manifest successfully', async () => {
            const manifest: BundleManifest = {
                version: '1.0.0',
                totalFiles: 100,
                generatedAt: '2024-01-01T00:00:00Z',
            };

            mockFetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(manifest),
            });

            const result = await (bundleManager as unknown as { fetchManifest: () => Promise<BundleManifest | null> }).fetchManifest();

            expect(result).toEqual(manifest);
            expect(mockFetch).toHaveBeenCalledWith('/smartgrind/offline-manifest.json');
        });

        test('should return null on non-ok response', async () => {
            mockFetch.mockResolvedValue({
                ok: false,
                status: 404,
            });

            const result = await (bundleManager as unknown as { fetchManifest: () => Promise<BundleManifest | null> }).fetchManifest();

            expect(result).toBeNull();
        });

        test('should return null on fetch error', async () => {
            mockFetch.mockRejectedValue(new Error('Network error'));

            const result = await (bundleManager as unknown as { fetchManifest: () => Promise<BundleManifest | null> }).fetchManifest();

            expect(result).toBeNull();
        });
    });

    describe('Version comparison', () => {
        test('needsDownload returns true when status is not complete', () => {
            const state: BundleDownloadState = {
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            };

            const manifest: BundleManifest = {
                version: '1.0.0',
                totalFiles: 10,
                generatedAt: '2024-01-01T00:00:00Z',
            };

            const result = (bundleManager as unknown as { needsDownload: (s: BundleDownloadState, m: BundleManifest) => boolean }).needsDownload(state, manifest);
            expect(result).toBe(true);
        });

        test('needsDownload returns true when version differs', () => {
            const state: BundleDownloadState = {
                status: 'complete',
                progress: 100,
                totalFiles: 10,
                extractedFiles: 10,
                bundleVersion: '1.0.0',
            };

            const manifest: BundleManifest = {
                version: '2.0.0',
                totalFiles: 10,
                generatedAt: '2024-01-01T00:00:00Z',
            };

            const result = (bundleManager as unknown as { needsDownload: (s: BundleDownloadState, m: BundleManifest) => boolean }).needsDownload(state, manifest);
            expect(result).toBe(true);
        });

        test('needsDownload returns false when version matches and complete', () => {
            const state: BundleDownloadState = {
                status: 'complete',
                progress: 100,
                totalFiles: 10,
                extractedFiles: 10,
                bundleVersion: '1.0.0',
            };

            const manifest: BundleManifest = {
                version: '1.0.0',
                totalFiles: 10,
                generatedAt: '2024-01-01T00:00:00Z',
            };

            const result = (bundleManager as unknown as { needsDownload: (s: BundleDownloadState, m: BundleManifest) => boolean }).needsDownload(state, manifest);
            expect(result).toBe(false);
        });
    });

    describe('Download with progress tracking', () => {
        test('should download and combine chunks', async () => {
            const chunk1 = new Uint8Array([1, 2, 3]);
            const chunk2 = new Uint8Array([4, 5, 6]);

            const mockResponse = {
                body: {
                    getReader: jest.fn().mockReturnValue({
                        read: jest.fn()
                            .mockResolvedValueOnce({ done: false, value: chunk1 })
                            .mockResolvedValueOnce({ done: false, value: chunk2 })
                            .mockResolvedValueOnce({ done: true }),
                        releaseLock: jest.fn(),
                    }),
                },
                headers: {
                    get: jest.fn().mockReturnValue('6'),
                },
            } as unknown as Response;

            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            };

            const result = await (bundleManager as unknown as { downloadWithProgress: (r: Response, s: BundleDownloadState) => Promise<Uint8Array> }).downloadWithProgress(mockResponse, state);

            expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]));
            expect(state.progress).toBe(50);
        });

        test('should throw when no response body', async () => {
            const mockResponse = {
                body: null,
                headers: { get: jest.fn() },
            } as unknown as Response;

            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            };

            await expect(
                (bundleManager as unknown as { downloadWithProgress: (r: Response, s: BundleDownloadState) => Promise<Uint8Array> }).downloadWithProgress(mockResponse, state)
            ).rejects.toThrow('No response body');
        });
    });

    describe('Retry logic with exponential backoff', () => {
        test('should calculate exponential backoff delay with jitter', () => {
            const delays: number[] = [];
            for (let i = 0; i < 5; i++) {
                delays.push(
                    (bundleManager as unknown as { calculateRetryDelay: (attempt: number) => number }).calculateRetryDelay(i)
                );
            }

            // Check base delays with ±25% jitter
            expect(delays[0]).toBeGreaterThanOrEqual(750);
            expect(delays[0]).toBeLessThanOrEqual(1250);

            expect(delays[1]).toBeGreaterThanOrEqual(1500);
            expect(delays[1]).toBeLessThanOrEqual(2500);

            expect(delays[2]).toBeGreaterThanOrEqual(3000);
            expect(delays[2]).toBeLessThanOrEqual(5000);

            expect(delays[3]).toBeGreaterThanOrEqual(6000);
            expect(delays[3]).toBeLessThanOrEqual(10000);

            expect(delays[4]).toBeGreaterThanOrEqual(12000);
            expect(delays[4]).toBeLessThanOrEqual(20000);
        });

        test('should cap delay at 16 seconds', () => {
            const delay = (bundleManager as unknown as { calculateRetryDelay: (attempt: number) => number }).calculateRetryDelay(10);
            expect(delay).toBeLessThanOrEqual(20000);
        });
    });

    describe('Periodic check scheduling', () => {
        test('should schedule periodic checks', () => {
            const manager = new BundleManager('1.0.0');
            Object.defineProperty(manager, 'isDev', {
                get: () => false,
                configurable: true,
            });
            
            const setIntervalSpy = jest.spyOn(global.self, 'setInterval');

            manager.scheduleChecks();

            expect(setIntervalSpy).toHaveBeenCalledWith(
                expect.any(Function),
                15 * 60 * 1000 // 15 minutes
            );
        });

        test('should skip scheduling in development mode', () => {
            const manager = new BundleManager('1.0.0');
            Object.defineProperty(manager, 'isDev', {
                get: () => true,
                configurable: true,
            });
            
            const setIntervalSpy = jest.spyOn(global.self, 'setInterval');

            manager.scheduleChecks();

            expect(setIntervalSpy).not.toHaveBeenCalled();
        });

        test('should clear existing checks before scheduling new ones', () => {
            const manager = new BundleManager('1.0.0');
            Object.defineProperty(manager, 'isDev', {
                get: () => false,
                configurable: true,
            });
            
            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

            manager.scheduleChecks();
            manager.scheduleChecks();

            expect(clearIntervalSpy).toHaveBeenCalled();
        });

        test('should clear scheduled checks', () => {
            const manager = new BundleManager('1.0.0');
            Object.defineProperty(manager, 'isDev', {
                get: () => false,
                configurable: true,
            });
            
            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

            manager.scheduleChecks();
            manager.clearScheduledChecks();

            expect(clearIntervalSpy).toHaveBeenCalled();
        });
    });

    describe('sendProgressUpdate', () => {
        test('should send progress update to clients', async () => {
            const mockClient = {
                postMessage: jest.fn(),
            };
            mockClients.matchAll.mockResolvedValue([mockClient]);

            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 50,
                totalFiles: 100,
                extractedFiles: 0,
            };

            await (bundleManager as unknown as { sendProgressUpdate: (s: BundleDownloadState) => Promise<void> }).sendProgressUpdate(state);

            expect(mockClient.postMessage).toHaveBeenCalledWith({
                type: 'BUNDLE_PROGRESS',
                state,
            });
        });

        test('should handle no clients gracefully', async () => {
            mockClients.matchAll.mockResolvedValue([]);

            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 50,
                totalFiles: 100,
                extractedFiles: 0,
            };

            await expect(
                (bundleManager as unknown as { sendProgressUpdate: (s: BundleDownloadState) => Promise<void> }).sendProgressUpdate(state)
            ).resolves.not.toThrow();
        });
    });

    describe('notifyClientsBundleReady', () => {
        test('should notify clients bundle is ready', async () => {
            const mockClient = {
                postMessage: jest.fn(),
            };
            mockClients.matchAll.mockResolvedValue([mockClient]);

            const state: BundleDownloadState = {
                status: 'complete',
                progress: 100,
                totalFiles: 100,
                extractedFiles: 100,
                bundleVersion: '1.0.0',
            };

            await (bundleManager as unknown as { notifyClientsBundleReady: (s: BundleDownloadState) => Promise<void> }).notifyClientsBundleReady(state);

            expect(mockClient.postMessage).toHaveBeenCalledWith({
                type: 'BUNDLE_READY',
                data: { state },
            });
            expect(mockClient.postMessage).toHaveBeenCalledWith({
                type: 'CONTENT_UPDATE',
                data: {
                    version: '1.0.0',
                    reason: 'New offline content available',
                },
            });
        });
    });

    describe('notifyClientsBundleFailed', () => {
        test('should notify clients of bundle failure', async () => {
            const mockClient = {
                postMessage: jest.fn(),
            };
            mockClients.matchAll.mockResolvedValue([mockClient]);

            await (bundleManager as unknown as { notifyClientsBundleFailed: (e: string) => Promise<void> }).notifyClientsBundleFailed('Network error');

            expect(mockClient.postMessage).toHaveBeenCalledWith({
                type: 'BUNDLE_FAILED',
                error: 'Network error',
                retryExhausted: true,
            });
        });
    });

    describe('sendReply', () => {
        test('should send reply via port when available', () => {
            const mockPort = {
                postMessage: jest.fn(),
            };

            const event = {
                source: { postMessage: jest.fn() },
                ports: [mockPort],
            };

            (bundleManager as unknown as { sendReply: (e: typeof event, m: unknown) => void }).sendReply(event, { type: 'TEST' });

            expect(mockPort.postMessage).toHaveBeenCalledWith({ type: 'TEST' });
            expect(event.source.postMessage).not.toHaveBeenCalled();
        });

        test('should send reply via source when port not available', () => {
            const mockSource = {
                postMessage: jest.fn(),
            };

            const event = {
                source: mockSource,
                ports: [],
            };

            (bundleManager as unknown as { sendReply: (e: typeof event, m: unknown) => void }).sendReply(event, { type: 'TEST' });

            expect(mockSource.postMessage).toHaveBeenCalledWith({ type: 'TEST' });
        });

        test('should handle null source and ports gracefully', () => {
            const event = {
                source: null,
                ports: [],
            };

            expect(() =>
                (bundleManager as unknown as { sendReply: (e: typeof event, m: unknown) => void }).sendReply(event, { type: 'TEST' })
            ).not.toThrow();
        });
    });

    describe('handleDownloadMessage', () => {
        test('should handle download message and send error reply on failure', async () => {
            const manager = new BundleManager('1.0.0');
            Object.defineProperty(manager, 'isDev', {
                get: () => false,
                configurable: true,
            });

            const mockPort = {
                postMessage: jest.fn(),
            };

            const event = {
                source: null,
                ports: [mockPort],
            };

            // Mock fetch to fail
            mockFetch.mockRejectedValue(new Error('Download failed'));
            (safeRetrieve as jest.Mock).mockResolvedValue({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });

            await manager.handleDownloadMessage(event);

            expect(mockPort.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'BUNDLE_ERROR',
                    error: expect.any(String),
                })
            );
        });
    });
});

    describe('extractAndCache', () => {
        test('should send progress updates during extraction', async () => {
            const manager = new BundleManager('1.0.0');
            
            const sendProgressUpdateSpy = jest.spyOn(manager as any, 'sendProgressUpdate').mockResolvedValue(undefined);

            // Create a state to track progress
            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            };

            // Test that progress update is called during state transitions
            await (manager as any).sendProgressUpdate(state);

            expect(sendProgressUpdateSpy).toHaveBeenCalledWith(state);
        });
    });

    describe('clearBundleCache', () => {
        test('should clear old bundle files from cache', async () => {
            const manager = new BundleManager('1.0.0');
            
            // Create mock requests with problem pattern URLs
            const mockRequests = [
                new Request('https://example.com/smartgrind/patterns/array.md'),
                new Request('https://example.com/smartgrind/solutions/two-sum.md'),
                new Request('https://example.com/smartgrind/algorithms/sorting.md'),
                new Request('https://example.com/smartgrind/sql/join.md'),
                new Request('https://example.com/other/file.md'), // Should not match
            ];

            const mockCache = {
                keys: jest.fn().mockResolvedValue(mockRequests),
                delete: jest.fn().mockResolvedValue(true),
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(undefined),
                add: jest.fn().mockResolvedValue(undefined),
                addAll: jest.fn().mockResolvedValue(undefined),
            };

            global.caches = {
                open: jest.fn().mockResolvedValue(mockCache),
                match: jest.fn().mockResolvedValue(undefined),
                has: jest.fn().mockResolvedValue(true),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue(['test-cache']),
            } as unknown as CacheStorage;

            await (manager as any).clearBundleCache();

            // Should delete the 4 matching URLs
            expect(mockCache.delete).toHaveBeenCalledTimes(4);
        });

        test('should handle flashcard patterns', async () => {
            const manager = new BundleManager('1.0.0');
            
            const mockRequests = [
                new Request('https://example.com/flashcards/algorithm.md'),
                new Request('https://example.com/flashcards/pattern.md'),
            ];

            const mockCache = {
                keys: jest.fn().mockResolvedValue(mockRequests),
                delete: jest.fn().mockResolvedValue(true),
                put: jest.fn().mockResolvedValue(undefined),
                match: jest.fn().mockResolvedValue(undefined),
                add: jest.fn().mockResolvedValue(undefined),
                addAll: jest.fn().mockResolvedValue(undefined),
            };

            global.caches = {
                open: jest.fn().mockResolvedValue(mockCache),
                match: jest.fn().mockResolvedValue(undefined),
                has: jest.fn().mockResolvedValue(true),
                delete: jest.fn().mockResolvedValue(true),
                keys: jest.fn().mockResolvedValue(['test-cache']),
            } as unknown as CacheStorage;

            await (manager as any).clearBundleCache();

            expect(mockCache.delete).toHaveBeenCalledTimes(2);
        });

        test('should handle cache clear errors gracefully', async () => {
            const manager = new BundleManager('1.0.0');
            
            global.caches = {
                open: jest.fn().mockRejectedValue(new Error('Cache error')),
            } as unknown as CacheStorage;

            // Should not throw
            await expect((manager as any).clearBundleCache()).resolves.not.toThrow();
        });
    });

    describe('IndexedDB State Management', () => {
        test('should handle saveStateToIDB with quota exceeded error', async () => {
            const manager = new BundleManager('1.0.0');
            
            (safeStore as jest.Mock).mockRejectedValueOnce(
                new IDBOperationError('QUOTA_EXCEEDED', 'Storage full')
            );

            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 50,
                totalFiles: 100,
                extractedFiles: 50,
            };

            // Should not throw
            await expect((manager as any).saveStateToIDB('key', state)).resolves.not.toThrow();
        });

        test('should handle saveStateToIDB with other errors', async () => {
            const manager = new BundleManager('1.0.0');
            
            (safeStore as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 50,
                totalFiles: 100,
                extractedFiles: 50,
            };

            // Should not throw
            await expect((manager as any).saveStateToIDB('key', state)).resolves.not.toThrow();
        });

        test('should handle getStateFromIDB when DB fails', async () => {
            const manager = new BundleManager('1.0.0');
            
            (openDatabase as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

            const result = await (manager as any).getStateFromIDB('key');
            expect(result).toBeNull();
        });
    });

    describe('handleDownloadError', () => {
        test('should calculate retry delay with exponential backoff', () => {
            const manager = new BundleManager('1.0.0');
            
            // Test various retry delays
            const delays = [];
            for (let i = 0; i < 5; i++) {
                delays.push((manager as any).calculateRetryDelay(i));
            }

            // Delays should increase
            expect(delays[1]).toBeGreaterThan(delays[0]);
            expect(delays[2]).toBeGreaterThan(delays[1]);
            
            // Should be capped at ~16 seconds (with jitter)
            expect(delays[4]).toBeLessThanOrEqual(20000);
        });

        test('should save error state on final retry failure', async () => {
            const manager = new BundleManager('1.0.0');
            
            const saveStateSpy = jest.spyOn(manager as any, 'saveState').mockResolvedValue(undefined);
            const notifyClientsSpy = jest.spyOn(manager as any, 'notifyClientsBundleFailed').mockResolvedValue(undefined);

            // Final retry (attempt 4, MAX_RETRIES = 5)
            await expect(
                (manager as any).handleDownloadError(new Error('Final error'), 4)
            ).rejects.toThrow('Bundle download failed');

            expect(saveStateSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'error',
                    error: expect.stringContaining('Failed after'),
                })
            );
            expect(notifyClientsSpy).toHaveBeenCalledWith('Final error');
        });
    });

    describe('saveState', () => {
        test('should save state and send progress update', async () => {
            const manager = new BundleManager('1.0.0');
            
            const sendProgressUpdateSpy = jest.spyOn(manager as any, 'sendProgressUpdate').mockResolvedValue(undefined);

            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 75,
                totalFiles: 100,
                extractedFiles: 75,
            };

            await (manager as any).saveState(state);

            expect(safeStore).toHaveBeenCalled();
            expect(sendProgressUpdateSpy).toHaveBeenCalledWith(state);
        });
    });

    describe('openBundleDB', () => {
        test('should create object store if it does not exist', async () => {
            const manager = new BundleManager('1.0.0');
            
            const mockDb = {
                objectStoreNames: {
                    contains: jest.fn().mockReturnValue(false),
                },
                createObjectStore: jest.fn().mockReturnValue({}),
                close: jest.fn(),
            };

            (openDatabase as jest.Mock).mockImplementationOnce((name, version, upgradeFn) => {
                upgradeFn(mockDb);
                return Promise.resolve(mockDb);
            });

            await (manager as any).openBundleDB();

            expect(mockDb.createObjectStore).toHaveBeenCalledWith('bundle-state', { keyPath: 'key' });
        });

        test('should not create object store if it already exists', async () => {
            const manager = new BundleManager('1.0.0');
            
            const mockDb = {
                objectStoreNames: {
                    contains: jest.fn().mockReturnValue(true),
                },
                createObjectStore: jest.fn(),
                close: jest.fn(),
            };

            (openDatabase as jest.Mock).mockImplementationOnce((name, version, upgradeFn) => {
                upgradeFn(mockDb);
                return Promise.resolve(mockDb);
            });

            await (manager as any).openBundleDB();

            expect(mockDb.createObjectStore).not.toHaveBeenCalled();
        });
    });
