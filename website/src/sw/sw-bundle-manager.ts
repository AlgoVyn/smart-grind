/**
 * Service Worker Bundle Manager
 * Handles offline bundle download and extraction
 */

import { CACHE_NAMES } from './cache-strategies';
import {
    openDatabase,
    safeStore,
    safeRetrieve,
    IDBOperationError,
    IDBErrorType,
} from '../utils/indexeddb-helper';

// Bundle configuration
const BUNDLE_URL = '/smartgrind/offline-bundle.tar.gz';
const BUNDLE_MANIFEST_URL = '/smartgrind/offline-manifest.json';
const BUNDLE_STATE_KEY = 'smartgrind-bundle-state';
const INVENTORY_DB_NAME = 'smartgrind-sw-inventory';

// Maximum retry attempts
const MAX_BUNDLE_RETRIES = 5;

// Bundle download state
export interface BundleDownloadState {
    status: 'idle' | 'downloading' | 'extracting' | 'complete' | 'error';
    progress: number;
    totalFiles: number;
    extractedFiles: number;
    error?: string;
    bundleVersion?: string;
    downloadedAt?: number;
}

// Check if we're in development mode
const isDev = typeof location !== 'undefined' && location.hostname === 'localhost';

/**
 * Get the current bundle download status
 */
export async function getBundleStatus(): Promise<BundleDownloadState> {
    try {
        const state = await getStateFromIDB<BundleDownloadState>(BUNDLE_STATE_KEY);
        return state || { status: 'idle', progress: 0, totalFiles: 0, extractedFiles: 0 };
    } catch {
        return { status: 'idle', progress: 0, totalFiles: 0, extractedFiles: 0 };
    }
}

/**
 * Calculate delay for exponential backoff with jitter
 */
function getBundleRetryDelay(attempt: number): number {
    const baseDelay = Math.min(1000 * Math.pow(2, attempt), 16000);
    const jitter = baseDelay * 0.25 * (Math.random() * 2 - 1);
    return Math.floor(baseDelay + jitter);
}

/**
 * Check if bundle needs to be downloaded and download it
 */
export async function checkAndDownloadBundle(retryAttempt = 0): Promise<void> {
    if (isDev) return;

    try {
        const currentState = await getBundleStatus();

        const manifestResponse = await fetch(BUNDLE_MANIFEST_URL).catch((error) => {
            console.warn('[SW] Failed to fetch bundle manifest:', error);
            return null;
        });

        if (!manifestResponse || !manifestResponse.ok) {
            console.log('[SW] Bundle manifest not available, skipping download');
            return;
        }

        const manifest = await manifestResponse.json();
        const remoteVersion = manifest.version;

        if (currentState.status === 'complete' && currentState.bundleVersion === remoteVersion) {
            console.log('[SW] Bundle is up to date, skipping download');
            return;
        }

        if (currentState.bundleVersion && currentState.bundleVersion !== remoteVersion) {
            console.log(`[SW] Bundle version changed, clearing old cache`);
            await clearBundleCache();
        }

        await downloadAndExtractBundle();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[SW] Bundle download attempt ${retryAttempt + 1} failed:`, errorMessage);

        if (retryAttempt < MAX_BUNDLE_RETRIES - 1) {
            const delay = getBundleRetryDelay(retryAttempt);
            console.log(`[SW] Retrying bundle download in ${delay}ms...`);

            const errorState: BundleDownloadState = {
                status: 'error',
                progress: 0,
                totalFiles: 0,
                extractedFiles: 0,
                error: `${errorMessage} (retrying in ${Math.round(delay / 1000)}s...)`,
            };
            await saveStateToIDB(BUNDLE_STATE_KEY, errorState);
            await sendProgressUpdate(errorState);

            await new Promise((resolve) => setTimeout(resolve, delay));
            return checkAndDownloadBundle(retryAttempt + 1);
        }

        console.error('[SW] Bundle download failed after all retry attempts');

        const finalErrorState: BundleDownloadState = {
            status: 'error',
            progress: 0,
            totalFiles: 0,
            extractedFiles: 0,
            error: `Download failed after ${MAX_BUNDLE_RETRIES} attempts: ${errorMessage}`,
        };
        await saveStateToIDB(BUNDLE_STATE_KEY, finalErrorState);
        await sendProgressUpdate(finalErrorState);

        const clients = await (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({
            type: 'window',
        });
        clients.forEach((client) => {
            client.postMessage({
                type: 'BUNDLE_FAILED',
                error: errorMessage,
                retryExhausted: true,
            });
        });

        throw new Error(
            `Bundle download failed after ${MAX_BUNDLE_RETRIES} attempts: ${errorMessage}`
        );
    }
}

/**
 * Download and extract bundle
 */
async function downloadAndExtractBundle(): Promise<void> {
    const CACHE_VERSION = 'v1.0.0';
    const state: BundleDownloadState = {
        status: 'downloading',
        progress: 0,
        totalFiles: 0,
        extractedFiles: 0,
    };
    await saveStateToIDB(BUNDLE_STATE_KEY, state);
    await sendProgressUpdate(state);

    const response = await fetch(BUNDLE_URL);
    if (!response.ok) {
        throw new Error(`Failed to download bundle: ${response.status}`);
    }

    const contentLength = response.headers.get('content-length');
    const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('No response body');
    }

    const chunks: Uint8Array[] = [];
    let downloadedSize = 0;

    let readResult = await reader.read();
    while (!readResult.done) {
        const { value } = readResult;
        if (value) {
            chunks.push(value);
            downloadedSize += value.length;

            if (totalSize > 0) {
                state.progress = Math.round((downloadedSize / totalSize) * 50);
                await sendProgressUpdate(state);
            }
        }
        readResult = await reader.read();
    }

    state.status = 'extracting';
    state.progress = 50;
    await saveStateToIDB(BUNDLE_STATE_KEY, state);
    await sendProgressUpdate(state);

    const compressedData = new Uint8Array(downloadedSize);
    let offset = 0;
    for (const chunk of chunks) {
        compressedData.set(chunk, offset);
        offset += chunk.length;
    }

    const decompressedStream = new Response(compressedData).body?.pipeThrough(
        new DecompressionStream('gzip')
    );

    if (!decompressedStream) {
        throw new Error('Failed to create decompression stream');
    }

    const decompressedBuffer = await new Response(decompressedStream).arrayBuffer();
    const tarData = new Uint8Array(decompressedBuffer);

    const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);
    const files = parseTar(tarData);
    state.totalFiles = files.length;

    let manifest: { version?: string; totalFiles?: number } | null = null;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        if (file.name === 'manifest.json') {
            const manifestText = new TextDecoder().decode(file.content);
            manifest = JSON.parse(manifestText);
            continue;
        }

        const url = `${(self as unknown as ServiceWorkerGlobalScope).registration.scope}${file.name}`;
        const fileResponse = new Response(file.content.buffer as BodyInit, {
            headers: {
                'Content-Type': 'text/markdown',
                'X-SW-Cached-At': Date.now().toString(),
            },
        });
        await cache.put(url, fileResponse);

        state.extractedFiles = i + 1;
        state.progress = 50 + Math.round((i / files.length) * 50);

        if (i % 10 === 0 || i === files.length - 1) {
            await sendProgressUpdate(state);
        }
    }

    state.status = 'complete';
    state.progress = 100;
    if (manifest?.version) {
        state.bundleVersion = manifest.version;
    }
    state.downloadedAt = Date.now();
    await saveStateToIDB(BUNDLE_STATE_KEY, state);
    await sendProgressUpdate(state);

    console.log(`[SW] Bundle downloaded and extracted: ${state.extractedFiles} files`);

    const clients = await (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({
        type: 'window',
    });
    clients.forEach((client) => {
        client.postMessage({
            type: 'BUNDLE_READY',
            state,
        });
    });
}

/**
 * Parse a tar archive
 */
function parseTar(buffer: Uint8Array): Array<{ name: string; content: Uint8Array }> {
    const files: Array<{ name: string; content: Uint8Array }> = [];
    let offset = 0;

    while (offset < buffer.length - 512) {
        if (buffer.slice(offset, offset + 512).every((b) => b === 0)) {
            break;
        }

        const header = buffer.slice(offset, offset + 512);

        let nameEnd = 0;
        while (nameEnd < 100 && header[nameEnd] !== 0) {
            nameEnd++;
        }
        const name = new TextDecoder().decode(header.slice(0, nameEnd));

        const sizeStr = new TextDecoder().decode(header.slice(124, 136)).trim();
        const size = parseInt(sizeStr, 8) || 0;

        offset += 512;

        if (size > 0 && name) {
            const content = buffer.slice(offset, offset + size);
            files.push({ name, content });
        }

        offset += Math.ceil(size / 512) * 512;
    }

    return files;
}

/**
 * Clear the bundle cache
 */
async function clearBundleCache(): Promise<void> {
    const CACHE_VERSION = 'v1.0.0';
    const PROBLEM_PATTERNS = [
        /\/smartgrind\/patterns\/.+\.md$/,
        /\/smartgrind\/solutions\/.+\.md$/,
        /\/smartgrind\/algorithms\/.+\.md$/,
    ];

    try {
        const cache = await caches.open(`${CACHE_NAMES.PROBLEMS}-${CACHE_VERSION}`);
        const keys = await cache.keys();

        const deletionPromises = keys
            .filter((request) => {
                const url = new URL(request.url);
                return PROBLEM_PATTERNS.some((pattern) => pattern.test(url.pathname));
            })
            .map((request) => cache.delete(request));

        await Promise.all(deletionPromises);
        console.log(`[SW] Cleared ${deletionPromises.length} old bundle files from cache`);
    } catch (error) {
        console.error('[SW] Failed to clear bundle cache:', error);
    }
}

/**
 * Send progress update to all clients
 */
async function sendProgressUpdate(state: BundleDownloadState): Promise<void> {
    const clients = await (self as unknown as ServiceWorkerGlobalScope).clients.matchAll({
        type: 'window',
    });
    clients.forEach((client) => {
        client.postMessage({
            type: 'BUNDLE_PROGRESS',
            state,
        });
    });
}

/**
 * Open inventory database
 */
async function openInventoryDB(): Promise<IDBDatabase> {
    return openDatabase(INVENTORY_DB_NAME, 1, (db) => {
        if (!db.objectStoreNames.contains('bundle-state')) {
            db.createObjectStore('bundle-state', { keyPath: 'key' });
        }
    });
}

/**
 * Get state from IndexedDB
 */
async function getStateFromIDB<T>(key: string): Promise<T | null> {
    try {
        const db = await openInventoryDB();
        try {
            return await safeRetrieve<T>(db, 'bundle-state', key);
        } finally {
            db.close();
        }
    } catch (error) {
        console.warn('[SW] Failed to get bundle state from IndexedDB:', error);
        return null;
    }
}

/**
 * Save state to IndexedDB
 */
async function saveStateToIDB<T>(key: string, value: T): Promise<void> {
    try {
        const db = await openInventoryDB();
        try {
            await safeStore(db, 'bundle-state', key, value);
        } finally {
            db.close();
        }
    } catch (error) {
        if (error instanceof IDBOperationError && error.type === IDBErrorType.QUOTA_EXCEEDED) {
            console.warn('[SW] Storage quota exceeded, cannot save bundle state');
        } else {
            console.warn('[SW] Failed to save bundle state to IndexedDB:', error);
        }
    }
}
