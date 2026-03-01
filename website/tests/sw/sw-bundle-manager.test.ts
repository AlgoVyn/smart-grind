/**
 * @jest-environment jsdom
 */

import {
    getBundleStatus,
    checkAndDownloadBundle,
    type BundleDownloadState,
} from '../../src/sw/sw-bundle-manager';

describe('SW Bundle Manager', () => {
    let mockFetch: jest.Mock;
    let mockCacheStorage: Map<string, Cache>;
    let originalLocation: Location;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch = jest.fn();
        global.fetch = mockFetch;

        // Reset IndexedDB
        (global.indexedDB as unknown as { _clearAll: () => void })._clearAll();

        // Setup mock cache storage
        mockCacheStorage = new Map();

        // Mock caches API
        global.caches = {
            open: jest.fn().mockImplementation((name: string) => {
                if (!mockCacheStorage.has(name)) {
                    const mockCache = {
                        put: jest.fn().mockResolvedValue(undefined),
                        match: jest.fn().mockResolvedValue(undefined),
                        delete: jest.fn().mockResolvedValue(true),
                        keys: jest.fn().mockResolvedValue([]),
                        add: jest.fn().mockResolvedValue(undefined),
                        addAll: jest.fn().mockResolvedValue(undefined),
                    } as unknown as Cache;
                    mockCacheStorage.set(name, mockCache);
                }
                return Promise.resolve(mockCacheStorage.get(name));
            }),
            match: jest.fn().mockResolvedValue(undefined),
            has: jest.fn().mockResolvedValue(false),
            delete: jest.fn().mockResolvedValue(true),
            keys: jest.fn().mockResolvedValue([]),
        } as unknown as CacheStorage;

        // Mock clients
        (global.self as unknown as ServiceWorkerGlobalScope).clients = {
            matchAll: jest.fn().mockResolvedValue([]),
            claim: jest.fn().mockResolvedValue(undefined),
            get: jest.fn().mockResolvedValue(null),
        };
    });

    describe('getBundleStatus', () => {
        it('should return default status when no state exists', async () => {
            const status = await getBundleStatus();

            expect(status).toEqual({
                status: 'idle',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
            });
        });
    });

    describe('BundleDownloadState', () => {
        it('should have correct state shape', () => {
            const state: BundleDownloadState = {
                status: 'downloading',
                progress: 50,
                totalFiles: 100,
                extractedFiles: 50,
                bundleVersion: '1.0.0',
                downloadedAt: Date.now(),
            };

            expect(state.status).toBe('downloading');
            expect(state.progress).toBe(50);
            expect(state.totalFiles).toBe(100);
        });

        it('should support all status values', () => {
            const statuses: BundleDownloadState['status'][] = [
                'idle',
                'downloading',
                'extracting',
                'complete',
                'error',
            ];

            for (const status of statuses) {
                const state: BundleDownloadState = {
                    status,
                    progress: 0,
                    totalFiles: 0,
                    extractedFiles: 0,
                };
                expect(state.status).toBe(status);
            }
        });
    });
});
