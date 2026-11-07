/**
 * Bundle Manager Types
 * Types for offline bundle download and extraction
 */

/** Bundle download state */
export interface BundleDownloadState {
    status: 'idle' | 'downloading' | 'extracting' | 'complete' | 'error';
    progress: number;
    totalFiles: number;
    extractedFiles: number;
    error?: string;
    bundleVersion?: string;
    downloadedAt?: number;
    /** When the current download attempt started (used to detect states left
     * stuck by service worker termination mid-download) */
    startedAt?: number;
}

/** Bundle manifest from server */
export interface BundleManifest {
    version: string;
    totalFiles: number;
    generatedAt: string;
}

/** Tar file entry */
export interface TarFile {
    name: string;
    content: Uint8Array;
}

/** Message event for bundle operations */
export interface BundleMessageEvent {
    source: Client | null;
    ports: ReadonlyArray<MessagePort>;
}
