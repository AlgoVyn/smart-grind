// Offline Manager for SmartGrind Service Worker
// Manages offline access to problem data and metadata

import { CACHE_NAMES } from './cache-strategies';

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

const DB_NAME = 'smartgrind-offline';
const DB_VERSION = 1;
const STORE_NAME = 'problem-metadata';

/** Promisify IndexedDB request */
function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export class OfflineManager {
    private db: IDBDatabase | null = null;

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

    private async getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
        const db = await this.initDB();
        return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME);
    }

    /** Pre-cache the problem index/metadata - called during SW install */
    async preCacheProblemIndex(): Promise<void> {
        try {
            const response = await fetch('/smartgrind/src/data/problems-data.ts').catch(() => null);
            if (!response?.ok) return;
            // Parse and cache problem metadata (production: JSON endpoint)
        } catch {
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

    /** Get list of all cached problems */
    async getCachedProblems(): Promise<ProblemMetadata[]> {
        const store = await this.getStore('readonly');
        return promisifyRequest(store.getAll());
    }

    /** Get cached problems by category */
    async getProblemsByCategory(category: string): Promise<ProblemMetadata[]> {
        const store = await this.getStore('readonly');
        return promisifyRequest(store.index('category').getAll(category));
    }

    /** Store problem metadata in IndexedDB */
    private async storeMetadata(metadata: ProblemMetadata): Promise<void> {
        const store = await this.getStore('readwrite');
        await promisifyRequest(store.put(metadata));
    }

    /** Update last accessed timestamp */
    private async updateLastAccessed(url: string): Promise<void> {
        const store = await this.getStore('readwrite');
        const id = this.extractIdFromUrl(url);
        const data = await promisifyRequest<ProblemMetadata | undefined>(store.get(id));
        if (data) {
            data.lastAccessed = Date.now();
            await promisifyRequest(store.put(data));
        }
    }

    /** Extract metadata from URL and response */
    private extractMetadata(url: string, _response: Response): ProblemMetadata {
        const id = this.extractIdFromUrl(url);
        const pathParts = new URL(url).pathname.split('/');

        let category = 'unknown';
        const lastPart = pathParts[pathParts.length - 1];
        const pattern = lastPart?.replace('.md', '') || 'unknown';

        if (pathParts.includes('patterns')) category = 'patterns';
        else if (pathParts.includes('solutions')) category = 'solutions';
        else if (pathParts.includes('algorithms')) category = 'algorithms';

        const title = pattern.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

        return {
            id,
            title,
            category,
            pattern,
            difficulty: 'Medium',
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

    /** Clean up old cached problems (LRU eviction) */
    async cleanupOldProblems(maxAgeDays = 30): Promise<number> {
        const store = await this.getStore('readonly');
        const maxAge = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
        const range = IDBKeyRange.upperBound(maxAge);
        const oldProblems = await promisifyRequest<ProblemMetadata[]>(
            store.index('lastAccessed').getAll(range)
        );

        const cache = await caches.open(CACHE_NAMES.PROBLEMS);
        let deletedCount = 0;

        for (const problem of oldProblems) {
            try {
                await cache.delete(this.reconstructUrl(problem));
                const writeStore = await this.getStore('readwrite');
                await promisifyRequest(writeStore.delete(problem.id));
                deletedCount++;
            } catch {
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

    /** Get offline storage statistics */
    async getStorageStats(): Promise<{
        problemCount: number;
        totalSize: number;
        oldestCache: number;
        newestCache: number;
    }> {
        const store = await this.getStore('readonly');
        const cache = await caches.open(CACHE_NAMES.PROBLEMS);
        const allProblems = await promisifyRequest<ProblemMetadata[]>(store.getAll());

        let totalSize = 0;
        let oldestCache = Date.now();
        let newestCache = 0;

        for (const problem of allProblems) {
            try {
                const response = await cache.match(this.reconstructUrl(problem));
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
                oldestCache = Math.min(oldestCache, problem.cachedAt);
                newestCache = Math.max(newestCache, problem.cachedAt);
            } catch {
                // Ignore errors for individual problems
            }
        }

        return { problemCount: allProblems.length, totalSize, oldestCache, newestCache };
    }
}
