/**
 * Bundle Manager
 * Handles offline bundle download, extraction, and caching
 */

import type { BundleDownloadState, BundleManifest } from './types.js';
import { parseTar } from './tar-parser.js';
import { CACHE_NAMES } from '../cache-strategies.js';
import {
    openDatabase,
    safeStore,
    safeRetrieve,
    IDBOperationError,
    IDBErrorType,
} from '../../utils/indexeddb-helper.js';

declare const self: ServiceWorkerGlobalScope;

/** Bundle configuration */
const BUNDLE_URL = '/smartgrind/offline-bundle.tar.gz';
const BUNDLE_MANIFEST_URL = '/smartgrind/offline-manifest.json';
const BUNDLE_STATE_KEY = 'smartgrind-bundle-state';
const BUNDLE_DB_NAME = 'smartgrind-offline';
const MAX_RETRIES = 5;
const CHECK_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Bundle Manager Class
 * Manages offline content bundle lifecycle
 */
export class BundleManager {
    private checkIntervalId: number | null = null;
    private readonly cacheVersion: string;

    constructor(swVersion: string) {
        this.cacheVersion = `v${swVersion}`;
    }

    /** Check if in development mode */
    private get isDev(): boolean {
        return typeof location !== 'undefined' && location.hostname === 'localhost';
    }

    /** Get current bundle status from IndexedDB */
    async getStatus(): Promise<BundleDownloadState> {
        try {
            const state = await this.getStateFromIDB<BundleDownloadState>(BUNDLE_STATE_KEY);
            return state || this.createInitialState();
        } catch {
            return this.createInitialState();
        }
    }

    /** Create initial idle state */
    private createInitialState(): BundleDownloadState {
        return {
            status: 'idle',
            progress: 0,
            totalFiles: 0,
            extractedFiles: 0,
        };
    }

    /** Check if download is in progress */
    private isDownloadInProgress(state: BundleDownloadState): boolean {
        return state.status === 'downloading' || state.status === 'extracting';
    }

    /** Check and download bundle if needed */
    async checkAndDownload(retryAttempt = 0): Promise<void> {
        if (this.isDev) return;

        try {
            const currentState = await this.getStatus();
            if (this.isDownloadInProgress(currentState)) {
                console.log('[BundleManager] Download already in progress, skipping');
                return;
            }

            const manifest = await this.fetchManifest();
            if (!manifest) return;

            if (!this.needsDownload(currentState, manifest)) {
                console.log('[BundleManager] Bundle is up to date');
                return;
            }

            if (currentState.bundleVersion) {
                await this.clearBundleCache();
            }

            console.log(
                `[BundleManager] Starting download... (attempt ${retryAttempt + 1}/${MAX_RETRIES})`
            );
            await this.downloadAndExtract(manifest);
        } catch (error) {
            await this.handleDownloadError(error, retryAttempt);
        }
    }

    /** Fetch bundle manifest from server */
    private async fetchManifest(): Promise<BundleManifest | null> {
        try {
            const response = await fetch(BUNDLE_MANIFEST_URL);
            if (!response.ok) {
                console.log('[BundleManager] Manifest not available');
                return null;
            }
            return (await response.json()) as BundleManifest;
        } catch (error) {
            console.warn('[BundleManager] Failed to fetch manifest:', error);
            return null;
        }
    }

    /** Check if bundle needs to be downloaded */
    private needsDownload(state: BundleDownloadState, manifest: BundleManifest): boolean {
        if (state.status !== 'complete') return true;
        return state.bundleVersion !== manifest.version;
    }

    /** Download and extract bundle */
    private async downloadAndExtract(manifest: BundleManifest): Promise<void> {
        const state = this.createDownloadingState();
        await this.saveState(state);

        try {
            const response = await fetch(BUNDLE_URL);
            if (!response.ok) {
                throw new Error(`Failed to download bundle: ${response.status}`);
            }

            const compressedData = await this.downloadWithProgress(response, state);
            await this.extractAndCache(compressedData, manifest, state);
        } catch (error) {
            state.status = 'error';
            state.error = error instanceof Error ? error.message : 'Unknown error';
            await this.saveState(state);
            throw error;
        }
    }

    /** Create downloading state */
    private createDownloadingState(): BundleDownloadState {
        return {
            status: 'downloading',
            progress: 0,
            totalFiles: 0,
            extractedFiles: 0,
        };
    }

    /** Download with progress tracking */
    private async downloadWithProgress(
        response: Response,
        state: BundleDownloadState
    ): Promise<Uint8Array> {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }

        const contentLength = response.headers.get('content-length');
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

        const chunks: Uint8Array[] = [];
        let downloadedSize = 0;

        try {
            let readResult = await reader.read();
            while (!readResult.done) {
                const { value } = readResult;
                if (value) {
                    chunks.push(value);
                    downloadedSize += value.length;

                    if (totalSize > 0) {
                        state.progress = Math.round((downloadedSize / totalSize) * 50);
                        await this.sendProgressUpdate(state);
                    }
                }
                readResult = await reader.read();
            }
        } finally {
            reader.releaseLock();
        }

        // Combine chunks
        const compressedData = new Uint8Array(downloadedSize);
        let offset = 0;
        for (const chunk of chunks) {
            compressedData.set(chunk, offset);
            offset += chunk.length;
        }

        return compressedData;
    }

    /** Extract and cache bundle files */
    private async extractAndCache(
        compressedData: Uint8Array,
        manifest: BundleManifest,
        state: BundleDownloadState
    ): Promise<void> {
        state.status = 'extracting';
        state.progress = 50;
        await this.sendProgressUpdate(state);

        // Decompress
        const decompressedStream = new Response(
            compressedData as unknown as BodyInit
        ).body?.pipeThrough(new DecompressionStream('gzip'));

        if (!decompressedStream) {
            throw new Error('Failed to create decompression stream');
        }

        const decompressedBuffer = await new Response(decompressedStream).arrayBuffer();
        const tarData = new Uint8Array(decompressedBuffer);

        // Parse and cache
        const files = parseTar(tarData);
        state.totalFiles = files.length;

        const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${this.cacheVersion}`);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file) continue;

            if (file.name === 'manifest.json') continue;

            const url = `${self.registration.scope}${file.name}`;
            const fileResponse = new Response(file.content.buffer as ArrayBuffer, {
                headers: {
                    'Content-Type': 'text/markdown',
                    'X-SW-Cached-At': Date.now().toString(),
                },
            });
            await cache.put(url, fileResponse);

            state.extractedFiles = i + 1;
            state.progress = 50 + Math.round((i / files.length) * 50);

            if (i % 10 === 0 || i === files.length - 1) {
                await this.sendProgressUpdate(state);
            }
        }

        // Complete
        state.status = 'complete';
        state.progress = 100;
        state.bundleVersion = manifest.version;
        state.downloadedAt = Date.now();
        await this.saveState(state);

        this.notifyClientsBundleReady(state);

        console.log(
            `[BundleManager] Bundle extracted: ${state.extractedFiles} files (version: ${manifest.version})`
        );
    }

    /** Handle download error with retry logic */
    private async handleDownloadError(error: unknown, retryAttempt: number): Promise<void> {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[BundleManager] Download attempt ${retryAttempt + 1} failed:`, errorMessage);

        if (retryAttempt < MAX_RETRIES - 1) {
            const delay = this.calculateRetryDelay(retryAttempt);
            console.log(`[BundleManager] Retrying in ${delay}ms...`);

            const errorState: BundleDownloadState = {
                status: 'error',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
                error: `Retrying in ${Math.round(delay / 1000)}s... (${retryAttempt + 1}/${MAX_RETRIES})`,
            };
            await this.saveState(errorState);

            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.checkAndDownload(retryAttempt + 1);
        }

        // All retries exhausted
        const finalState: BundleDownloadState = {
            status: 'error',
            progress: 0,
            totalFiles: 0,
            extractedFiles: 0,
            error: `Failed after ${MAX_RETRIES} attempts: ${errorMessage}`,
        };
        await this.saveState(finalState);
        this.notifyClientsBundleFailed(errorMessage);

        throw new Error(`Bundle download failed: ${errorMessage}`);
    }

    /** Calculate retry delay with exponential backoff and jitter */
    private calculateRetryDelay(attempt: number): number {
        const baseDelay = Math.min(1000 * Math.pow(2, attempt), 16000);
        const jitter = baseDelay * 0.25 * (Math.random() * 2 - 1);
        return Math.floor(baseDelay + jitter);
    }

    /** Clear old bundle cache */
    private async clearBundleCache(): Promise<void> {
        try {
            const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${this.cacheVersion}`);
            const keys = await cache.keys();

            const problemPatterns = [
                /\/smartgrind\/patterns\/.+\.md$/,
                /\/smartgrind\/solutions\/.+\.md$/,
                /\/smartgrind\/algorithms\/.+\.md$/,
                /\/smartgrind\/sql\/.+\.md$/,
            ];
            const flashcardPatterns = [/\/flashcards\/.+\.md$/];

            const deletions = keys
                .filter((request) => {
                    const url = new URL(request.url);
                    return (
                        problemPatterns.some((p) => p.test(url.pathname)) ||
                        flashcardPatterns.some((p) => p.test(url.pathname))
                    );
                })
                .map((request) => cache.delete(request));

            await Promise.all(deletions);
            console.log(`[BundleManager] Cleared ${deletions.length} old files from cache`);
        } catch (error) {
            console.error('[BundleManager] Failed to clear cache:', error);
        }
    }

    /** Save state to IndexedDB */
    private async saveState(state: BundleDownloadState): Promise<void> {
        await this.saveStateToIDB(BUNDLE_STATE_KEY, state);
        await this.sendProgressUpdate(state);
    }

    /** Get state from IndexedDB */
    private async getStateFromIDB<T>(key: string): Promise<T | null> {
        try {
            const db = await this.openBundleDB();
            try {
                return await safeRetrieve<T>(db, 'bundle-state', key);
            } finally {
                db.close();
            }
        } catch (error) {
            console.warn('[BundleManager] Failed to get state:', error);
            return null;
        }
    }

    /** Save state to IndexedDB */
    private async saveStateToIDB<T>(key: string, value: T): Promise<void> {
        try {
            const db = await this.openBundleDB();
            try {
                await safeStore(db, 'bundle-state', key, value);
            } finally {
                db.close();
            }
        } catch (error) {
            if (error instanceof IDBOperationError && error.type === IDBErrorType.QUOTA_EXCEEDED) {
                console.warn('[BundleManager] Storage quota exceeded');
            } else {
                console.warn('[BundleManager] Failed to save state:', error);
            }
        }
    }

    /** Open bundle IndexedDB */
    private async openBundleDB(): Promise<IDBDatabase> {
        return openDatabase(BUNDLE_DB_NAME, 1, (db) => {
            if (!db.objectStoreNames.contains('bundle-state')) {
                db.createObjectStore('bundle-state', { keyPath: 'key' });
            }
        });
    }

    /** Send progress update to all clients */
    private async sendProgressUpdate(state: BundleDownloadState): Promise<void> {
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => {
            client.postMessage({
                type: 'BUNDLE_PROGRESS',
                state,
            });
        });
    }

    /** Notify clients bundle is ready */
    private async notifyClientsBundleReady(state: BundleDownloadState): Promise<void> {
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => {
            client.postMessage({
                type: 'BUNDLE_READY',
                data: { state },
            });
            client.postMessage({
                type: 'CONTENT_UPDATE',
                data: {
                    version: state.bundleVersion,
                    reason: 'New offline content available',
                },
            });
        });
    }

    /** Notify clients bundle failed */
    private async notifyClientsBundleFailed(error: string): Promise<void> {
        const clients = await self.clients.matchAll({ type: 'window' });
        clients.forEach((client) => {
            client.postMessage({
                type: 'BUNDLE_FAILED',
                error,
                retryExhausted: true,
            });
        });
    }

    /** Schedule periodic bundle checks */
    scheduleChecks(): void {
        if (this.isDev) {
            console.log('[BundleManager] Skipping periodic checks in development');
            return;
        }

        this.clearScheduledChecks();

        this.checkIntervalId = self.setInterval(async () => {
            try {
                await this.checkAndDownload();
            } catch {
                // Silent failure - will retry next interval
                console.log('[BundleManager] Periodic check failed, will retry');
            }
        }, CHECK_INTERVAL_MS);

        console.log(
            `[BundleManager] Periodic checks scheduled (every ${CHECK_INTERVAL_MS / 60000} minutes)`
        );
    }

    /** Clear scheduled checks */
    clearScheduledChecks(): void {
        if (this.checkIntervalId !== null) {
            clearInterval(this.checkIntervalId);
            this.checkIntervalId = null;
        }
    }

    /** Handle download bundle message */
    async handleDownloadMessage(event: {
        source: Client | ServiceWorker | MessagePort | null;
        ports: ReadonlyArray<MessagePort>;
    }): Promise<void> {
        try {
            await this.downloadAndExtract(
                (await this.fetchManifest()) || {
                    version: 'unknown',
                    totalFiles: 0,
                    generatedAt: '',
                }
            );
            const state = await this.getStatus();
            this.sendReply(event, { type: 'BUNDLE_COMPLETE', state });
        } catch (error) {
            this.sendReply(event, {
                type: 'BUNDLE_ERROR',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    /** Send reply via message port or source */
    private sendReply(
        event: {
            source: Client | ServiceWorker | MessagePort | null;
            ports: ReadonlyArray<MessagePort>;
        },
        message: unknown
    ): void {
        if (event.ports?.[0]) {
            event.ports[0].postMessage(message);
        } else if (event.source) {
            event.source.postMessage(message);
        }
    }
}
