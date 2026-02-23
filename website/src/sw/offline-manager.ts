// Offline Manager for SmartGrind Service Worker
// Manages offline access to problem data and metadata

import { CACHE_NAMES } from './cache-strategies';

// Problem metadata stored in IndexedDB
interface ProblemMetadata {
    id: string;
    title: string;
    category: string;
    pattern: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    url?: string;
    cachedAt: number;
    lastAccessed: number;
}

// IndexedDB configuration
const DB_NAME = 'smartgrind-offline';
const DB_VERSION = 1;
const STORE_NAME = 'problem-metadata';

export class OfflineManager {
    private db: IDBDatabase | null = null;

    /**
     * Initialize IndexedDB connection
     */
    private async initDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('category', 'category', { unique: false });
                    store.createIndex('pattern', 'pattern', { unique: false });
                    store.createIndex('cachedAt', 'cachedAt', { unique: false });
                    store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                }
            };
        });
    }

    /**
     * Pre-cache the problem index/metadata
     * This should be called during SW install to cache the list of all problems
     */
    async preCacheProblemIndex(): Promise<void> {
        try {
            // Fetch the problem data from the main app
            const response = await fetch('/smartgrind/src/data/problems-data.ts').catch(() => null);
            if (!response || !response.ok) {
                return;
            }

            // Parse and cache problem metadata
            // Note: In production, this would be a JSON endpoint
        } catch (_error) {
            // Pre-cache index failed (expected in dev)
        }
    }

    /**
     * Cache specific problem markdown files
     */
    async cacheProblems(problemUrls: string[]): Promise<void> {
        const cache = await caches.open(CACHE_NAMES.PROBLEMS);
        await this.initDB();

        const promises = problemUrls.map(async (url) => {
            try {
                // Check if already cached
                const existing = await cache.match(url);
                if (existing) {
                    // Update last accessed time
                    await this.updateLastAccessed(url);
                    return;
                }

                // Fetch and cache
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response.clone());

                    // Extract metadata and store in IndexedDB
                    const metadata = this.extractMetadata(url, response);
                    await this.storeMetadata(metadata);
                }
            } catch (_error) {
                // Silent fail for individual problem cache
            }
        });

        await Promise.all(promises);
    }

    /**
     * Cache all problems in a category
     */
    async cacheCategory(_categoryId: string, problemUrls: string[]): Promise<void> {
        await this.cacheProblems(problemUrls);
    }

    /**
     * Get cached problem content
     */
    async getProblemContent(url: string): Promise<Response | null> {
        const cache = await caches.open(CACHE_NAMES.PROBLEMS);
        const response = await cache.match(url);

        if (response) {
            // Update last accessed time
            await this.updateLastAccessed(url);
        }

        return response || null;
    }

    /**
     * Check if a problem is available offline
     */
    async isProblemAvailable(url: string): Promise<boolean> {
        const cache = await caches.open(CACHE_NAMES.PROBLEMS);
        const response = await cache.match(url);
        return response !== null;
    }

    /**
     * Get list of all cached problems
     */
    async getCachedProblems(): Promise<ProblemMetadata[]> {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get cached problems by category
     */
    async getProblemsByCategory(category: string): Promise<ProblemMetadata[]> {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('category');
            const request = index.getAll(category);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Store problem metadata in IndexedDB
     */
    private async storeMetadata(metadata: ProblemMetadata): Promise<void> {
        const db = await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(metadata);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update last accessed timestamp
     */
    private async updateLastAccessed(url: string): Promise<void> {
        const db = await this.initDB();
        const id = this.extractIdFromUrl(url);

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const data = getRequest.result;
                if (data) {
                    data.lastAccessed = Date.now();
                    const putRequest = store.put(data);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    resolve();
                }
            };

            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    /**
     * Extract metadata from URL and response
     */
    private extractMetadata(url: string, _response: Response): ProblemMetadata {
        const id = this.extractIdFromUrl(url);
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');

        // Determine category and pattern from URL path
        let category = 'unknown';
        let pattern = 'unknown';

        if (pathParts.includes('patterns')) {
            category = 'patterns';
            pattern = pathParts[pathParts.length - 1]?.replace('.md', '') || 'unknown';
        } else if (pathParts.includes('solutions')) {
            category = 'solutions';
            pattern = pathParts[pathParts.length - 1]?.replace('.md', '') || 'unknown';
        } else if (pathParts.includes('algorithms')) {
            category = 'algorithms';
            pattern = pathParts[pathParts.length - 1]?.replace('.md', '') || 'unknown';
        }

        // Extract title from response or URL
        const title = pattern.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

        return {
            id,
            title,
            category,
            pattern,
            difficulty: 'Medium', // Default, would be extracted from content
            cachedAt: Date.now(),
            lastAccessed: Date.now(),
        };
    }

    /**
     * Extract ID from URL
     */
    private extractIdFromUrl(url: string): string {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const filename = pathParts[pathParts.length - 1] || '';
        return filename.replace('.md', '');
    }

    /**
     * Clean up old cached problems (LRU eviction)
     */
    async cleanupOldProblems(maxAgeDays: number = 30): Promise<number> {
        const db = await this.initDB();
        const maxAge = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

        const oldProblems = await new Promise<ProblemMetadata[]>((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('lastAccessed');
            const range = IDBKeyRange.upperBound(maxAge);
            const request = index.getAll(range);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        // Delete old problems from cache and IndexedDB
        const cache = await caches.open(CACHE_NAMES.PROBLEMS);
        let deletedCount = 0;

        for (const problem of oldProblems) {
            try {
                // Reconstruct URL from ID
                const url = this.reconstructUrl(problem);
                await cache.delete(url);

                // Delete from IndexedDB
                await new Promise<void>((resolve, reject) => {
                    const transaction = db.transaction(STORE_NAME, 'readwrite');
                    const store = transaction.objectStore(STORE_NAME);
                    const request = store.delete(problem.id);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });

                deletedCount++;
            } catch (_error) {
                // Silent fail for individual cleanup
            }
        }

        return deletedCount;
    }

    /**
     * Reconstruct URL from metadata
     */
    private reconstructUrl(metadata: ProblemMetadata): string {
        const base = '/smartgrind';
        if (metadata.category === 'patterns') {
            return `${base}/patterns/${metadata.id}.md`;
        } else if (metadata.category === 'solutions') {
            return `${base}/solutions/${metadata.id}.md`;
        } else if (metadata.category === 'algorithms') {
            return `${base}/algorithms/${metadata.id}.md`;
        }
        return `${base}/${metadata.id}.md`;
    }

    /**
     * Get offline storage statistics
     */
    async getStorageStats(): Promise<{
        problemCount: number;
        totalSize: number;
        oldestCache: number;
        newestCache: number;
    }> {
        const db = await this.initDB();
        const cache = await caches.open(CACHE_NAMES.PROBLEMS);

        const allProblems = await new Promise<ProblemMetadata[]>((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        let totalSize = 0;
        let oldestCache = Date.now();
        let newestCache = 0;

        for (const problem of allProblems) {
            try {
                const url = this.reconstructUrl(problem);
                const response = await cache.match(url);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }

                if (problem.cachedAt < oldestCache) oldestCache = problem.cachedAt;
                if (problem.cachedAt > newestCache) newestCache = problem.cachedAt;
            } catch (_error) {
                // Ignore errors for individual problems
            }
        }

        return {
            problemCount: allProblems.length,
            totalSize,
            oldestCache,
            newestCache,
        };
    }
}
