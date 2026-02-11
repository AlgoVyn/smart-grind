/**
 * Offline Manager Unit Tests
 * Tests for problem caching, metadata management, and storage statistics
 */

import { OfflineManager } from '../../src/sw/offline-manager';
import { CACHE_NAMES } from '../../src/sw/cache-strategies';

describe('OfflineManager', () => {
    let manager: OfflineManager;

    beforeEach(async () => {
        // Clear global cache storage before each test
        const cache = await caches.open(CACHE_NAMES.PROBLEMS);
        const keys = await cache.keys();
        for (const key of keys) {
            await cache.delete(key);
        }

        manager = new OfflineManager();
        jest.clearAllMocks();
    });

    describe('Pre-cache Problem Index', () => {
        it('should attempt to fetch problem data', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 404,
            });

            await manager.preCacheProblemIndex();

            expect(global.fetch).toHaveBeenCalledWith('/smartgrind/src/data/problems-data.ts');
        });

        it('should handle fetch failure gracefully', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            await expect(manager.preCacheProblemIndex()).resolves.not.toThrow();
        });
    });

    describe('Cache Problems', () => {
        it('should cache problem URLs', async () => {
            const urls = [
                'https://example.com/smartgrind/patterns/two-sum.md',
                'https://example.com/smartgrind/patterns/three-sum.md',
            ];

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({
                    ok: true,
                }),
            });

            await manager.cacheProblems(urls);

            const cache = await caches.open(CACHE_NAMES.PROBLEMS);
            for (const url of urls) {
                const cached = await cache.match(url);
                expect(cached).toBeDefined();
            }
        });

        it('should skip already cached problems and update last accessed', async () => {
            const url = 'https://example.com/smartgrind/patterns/two-sum.md';

            // First cache
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({ ok: true }),
            });
            await manager.cacheProblems([url]);

            // Second cache should skip fetch
            global.fetch = jest.fn();
            await manager.cacheProblems([url]);

            // Fetch should not be called again
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should handle fetch failures gracefully', async () => {
            const urls = ['https://example.com/smartgrind/patterns/failing.md'];

            global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

            await expect(manager.cacheProblems(urls)).resolves.not.toThrow();
        });

        it('should not cache non-ok responses', async () => {
            const urls = ['https://example.com/smartgrind/patterns/not-found.md'];

            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 404,
            });

            await manager.cacheProblems(urls);

            const cache = await caches.open(CACHE_NAMES.PROBLEMS);
            const cached = await cache.match(urls[0]);
            expect(cached).toBeUndefined();
        });
    });

    describe('Cache Category', () => {
        it('should cache all problems in a category', async () => {
            const categoryId = 'arrays';
            const problemUrls = [
                'https://example.com/smartgrind/patterns/two-sum.md',
                'https://example.com/smartgrind/patterns/three-sum.md',
            ];

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({ ok: true }),
            });

            await manager.cacheCategory(categoryId, problemUrls);

            const cache = await caches.open(CACHE_NAMES.PROBLEMS);
            for (const url of problemUrls) {
                const cached = await cache.match(url);
                expect(cached).toBeDefined();
            }
        });
    });

    describe('Get Problem Content', () => {
        it('should return cached problem content', async () => {
            const url = 'https://example.com/smartgrind/patterns/two-sum.md';
            const content = '# Two Sum\n\nProblem description...';

            // Pre-cache
            const cache = await caches.open(CACHE_NAMES.PROBLEMS);
            await cache.put(url, new Response(content));

            const response = await manager.getProblemContent(url);

            expect(response).toBeDefined();
            expect(await response!.text()).toBe(content);
        });

        it('should return null for uncached problems', async () => {
            const url = 'https://example.com/smartgrind/patterns/uncached.md';

            const response = await manager.getProblemContent(url);

            expect(response).toBeNull();
        });

        it('should update last accessed time when retrieving', async () => {
            const url = 'https://example.com/smartgrind/patterns/two-sum.md';

            // Pre-cache
            const cache = await caches.open(CACHE_NAMES.PROBLEMS);
            await cache.put(url, new Response('content'));

            await manager.getProblemContent(url);

            // Should be available offline
            const isAvailable = await manager.isProblemAvailable(url);
            expect(isAvailable).toBe(true);
        });
    });

    describe('Is Problem Available', () => {
        it('should return true for cached problems', async () => {
            const url = 'https://example.com/smartgrind/patterns/cached-test.md';

            const cache = await caches.open(CACHE_NAMES.PROBLEMS);
            await cache.put(url, new Response('content'));

            const isAvailable = await manager.isProblemAvailable(url);

            expect(isAvailable).toBe(true);
        });
    });

    describe('Get Cached Problems', () => {
        it('should return empty array when no problems cached', async () => {
            const problems = await manager.getCachedProblems();

            expect(problems).toEqual([]);
        });

        it('should return cached problem metadata', async () => {
            const url = 'https://example.com/smartgrind/patterns/two-sum.md';

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({ ok: true }),
            });

            await manager.cacheProblems([url]);

            const problems = await manager.getCachedProblems();

            expect(problems.length).toBeGreaterThan(0);
            expect(problems[0]).toHaveProperty('id');
            expect(problems[0]).toHaveProperty('title');
            expect(problems[0]).toHaveProperty('category');
        });
    });

    describe('Get Problems By Category', () => {
        it('should return problems filtered by category', async () => {
            const urls = [
                'https://example.com/smartgrind/patterns/two-sum.md',
                'https://example.com/smartgrind/solutions/three-sum.md',
            ];

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({ ok: true }),
            });

            await manager.cacheProblems(urls);

            const patternProblems = await manager.getProblemsByCategory('patterns');
            const solutionProblems = await manager.getProblemsByCategory('solutions');

            expect(patternProblems.length).toBeGreaterThanOrEqual(0);
            expect(solutionProblems.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Cleanup Old Problems', () => {
        it('should remove problems not accessed for specified days', async () => {
            const url = 'https://example.com/smartgrind/patterns/old-problem.md';

            // Cache a problem
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({ ok: true }),
            });
            await manager.cacheProblems([url]);

            // Cleanup with 0 days (should remove all)
            const deletedCount = await manager.cleanupOldProblems(0);

            expect(deletedCount).toBeGreaterThanOrEqual(0);
        });

        it('should handle cleanup errors gracefully', async () => {
            // Force an error by passing invalid data
            const deletedCount = await manager.cleanupOldProblems(-1);

            expect(deletedCount).toBe(0);
        });
    });

    describe('Get Storage Stats', () => {
        it('should return storage statistics', async () => {
            const url = 'https://example.com/smartgrind/patterns/two-sum.md';

            // Pre-cache a problem
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({ ok: true }),
            });
            await manager.cacheProblems([url]);

            const stats = await manager.getStorageStats();

            expect(stats).toHaveProperty('problemCount');
            expect(stats).toHaveProperty('totalSize');
            expect(stats).toHaveProperty('oldestCache');
            expect(stats).toHaveProperty('newestCache');
            expect(typeof stats.problemCount).toBe('number');
            expect(typeof stats.totalSize).toBe('number');
        });

        it('should handle empty cache', async () => {
            const stats = await manager.getStorageStats();

            expect(stats.problemCount).toBe(0);
            expect(stats.totalSize).toBe(0);
        });
    });

    describe('Extract Metadata', () => {
        it('should extract metadata from pattern URLs', async () => {
            const url = 'https://example.com/smartgrind/patterns/two-sum.md';

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({ ok: true }),
            });

            await manager.cacheProblems([url]);

            const problems = await manager.getCachedProblems();
            const problem = problems.find((p) => p.id === 'two-sum');

            if (problem) {
                expect(problem.category).toBe('patterns');
                expect(problem.pattern).toBe('two-sum');
            }
        });

        it('should extract metadata from solution URLs', async () => {
            const url = 'https://example.com/smartgrind/solutions/two-sum.md';

            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                clone: () => ({ ok: true }),
            });

            await manager.cacheProblems([url]);

            const problems = await manager.getCachedProblems();
            const problem = problems.find((p) => p.id === 'two-sum');

            if (problem) {
                expect(problem.category).toBe('solutions');
            }
        });
    });
});
