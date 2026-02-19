// Service Worker Registration Module for SmartGrind
// Handles SW registration, updates, and communication

import { getConnectivityChecker } from './sw/connectivity-checker';

// Service Worker configuration
// Using default scope (script location /smartgrind/)
const SW_CONFIG = {
    path: '/smartgrind/sw.js',
    // scope defaults to /smartgrind/ (the script's directory)
};

// Registration retry configuration
const REGISTRATION_RETRY = {
    maxAttempts: 3,
    baseDelay: 1000, // 1 second
    backoffMultiplier: 2,
};

// Sync tags
const SYNC_TAGS = {
    USER_PROGRESS: 'sync-user-progress',
    CUSTOM_PROBLEMS: 'sync-custom-problems',
    USER_SETTINGS: 'sync-user-settings',
};

// Service Worker state
interface SWState {
    registered: boolean;
    installing: boolean;
    waiting: boolean;
    active: boolean;
    updateAvailable: boolean;
    offlineReady: boolean;
    syncPending: boolean;
    lastSyncAt: number | null;
}

const state: SWState = {
    registered: false,
    installing: false,
    waiting: false,
    active: false,
    updateAvailable: false,
    offlineReady: false,
    syncPending: false,
    lastSyncAt: null,
};

// Event listeners
const listeners: Map<string, Set<(_: unknown) => void>> = new Map();

/**
 * Register the service worker with retry logic
 */
export async function registerServiceWorker(attempt: number = 1): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
        console.log('[SW] Service Worker not supported');
        return false;
    }

    try {
        // Log current path for debugging
        console.log(`[SW] Current path: ${window.location.pathname}`);

        // Add cache-busting to force fresh download
        const swUrl = `${SW_CONFIG.path}?v=${Date.now()}`;
        console.log(`[SW] Registering from ${swUrl} (attempt ${attempt})`);

        const registration = await navigator.serviceWorker.register(swUrl, {
            updateViaCache: 'none',
        });

        // Verify registration was successful
        if (!registration) {
            throw new Error('Registration returned null');
        }

        console.log('[SW] Registration successful, scope:', registration.scope);

        // Handle registration state
        handleRegistration(registration);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
                handleInstallingWorker(newWorker);
            }
        });

        // Check for existing waiting worker
        if (registration.waiting) {
            handleWaitingWorker(registration.waiting);
        }

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', handleSWMessage);

        // Listen for controller changes (SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] Controller changed - new SW is now controlling the page');
            state.active = true;
            emit('activated', null);
        });

        // Check if we have an active controller (SW controlling this page)
        if (!navigator.serviceWorker.controller) {
            console.log('[SW] No active controller - waiting for SW to take control...');

            // Check if we've already reloaded to prevent loops
            const hasReloaded = sessionStorage.getItem('sw-first-install-reloaded');

            // Wait for the SW to activate and take control
            const checkController = setInterval(() => {
                if (navigator.serviceWorker.controller) {
                    console.log('[SW] Service Worker is now controlling the page');
                    clearInterval(checkController);
                    // Clear the reload flag since SW is now controlling
                    sessionStorage.removeItem('sw-first-install-reloaded');
                }
            }, 500);

            // Timeout after 15 seconds and reload if still no controller (only once)
            // Increased from 10s to give more time for claim() to propagate
            setTimeout(() => {
                if (!navigator.serviceWorker.controller) {
                    clearInterval(checkController);
                    if (!hasReloaded) {
                        console.warn(
                            '[SW] SW not controlling after timeout - reloading to activate'
                        );
                        sessionStorage.setItem('sw-first-install-reloaded', 'true');
                        window.location.reload();
                    } else {
                        console.error(
                            '[SW] SW still not controlling after reload. The page will work but offline features may be limited.'
                        );
                        // Don't show alert - just log the warning. The app can still work.
                        // The SW will control on the next page load.
                    }
                }
            }, 15000);
        } else {
            console.log('[SW] Service Worker is already controlling the page');
            // Clear any stale reload flag
            sessionStorage.removeItem('sw-first-install-reloaded');
        }

        // Set up periodic update checks (every 60 minutes)
        setupPeriodicUpdateChecks(registration);

        // Cache dynamic assets (scripts and styles)
        cacheDynamicAssets(registration);

        state.registered = true;
        return true;
    } catch (error) {
        console.error(`[SW] Registration failed (attempt ${attempt}):`, error);

        // Retry with exponential backoff
        if (attempt < REGISTRATION_RETRY.maxAttempts) {
            const delay =
                REGISTRATION_RETRY.baseDelay *
                Math.pow(REGISTRATION_RETRY.backoffMultiplier, attempt - 1);
            console.log(`[SW] Retrying registration in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return registerServiceWorker(attempt + 1);
        }

        console.error('[SW] Max registration attempts reached');
        return false;
    }
}

/**
 * Set up periodic checks for SW updates
 */
function setupPeriodicUpdateChecks(registration: ServiceWorkerRegistration): void {
    // Check for updates every 60 minutes
    const CHECK_INTERVAL = 60 * 60 * 1000; // 60 minutes

    setInterval(async () => {
        try {
            console.log('[SW] Checking for updates...');
            await registration.update();
        } catch (error) {
            console.error('[SW] Update check failed:', error);
        }
    }, CHECK_INTERVAL);
}

/**
 * Handle service worker registration state
 */
function handleRegistration(registration: ServiceWorkerRegistration): void {
    // Check if there's an active worker
    if (registration.active) {
        state.active = true;
    }

    // Check if there's an installing worker
    if (registration.installing) {
        state.installing = true;
        handleInstallingWorker(registration.installing);
    }
}

/**
 * Handle installing worker state changes
 */
function handleInstallingWorker(worker: ServiceWorker): void {
    worker.addEventListener('statechange', () => {
        switch (worker.state) {
            case 'installed':
                if (navigator.serviceWorker.controller) {
                    // New update available
                    state.updateAvailable = true;
                    state.waiting = true;
                    emit('updateAvailable', { worker });
                } else {
                    // First install - SW is installed but not controlling yet
                    state.offlineReady = true;
                    emit('offlineReady', null);

                    // Check if we've already reloaded once to prevent loops
                    const hasReloaded = sessionStorage.getItem('sw-first-install-reloaded');
                    if (!hasReloaded) {
                        console.log('[SW] First install complete, reloading to activate...');
                        sessionStorage.setItem('sw-first-install-reloaded', 'true');
                        // Force reload to let SW take control immediately
                        window.location.reload();
                    } else {
                        console.log(
                            '[SW] First install complete, already reloaded once. SW should control now.'
                        );
                    }
                }
                break;

            case 'activated':
                state.active = true;
                state.installing = false;
                emit('activated', null);
                break;

            case 'redundant':
                state.installing = false;
                break;
        }
    });
}

/**
 * Handle waiting worker
 */
function handleWaitingWorker(worker: ServiceWorker): void {
    state.waiting = true;
    state.updateAvailable = true;
    emit('updateAvailable', { worker });
}

/**
 * Skip waiting and activate new service worker
 */
export async function skipWaiting(): Promise<void> {
    if (!navigator.serviceWorker.controller) return;

    // Send message to SW to skip waiting
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });

    // Reload the page to use the new SW
    window.location.reload();
}

/**
 * Handle messages from service worker
 */
function handleSWMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    if (!type) return;

    switch (type) {
        case 'SW_ACTIVATED':
            state.active = true;
            // If SW reports it's controlling, clear the reload flag
            if (event.data.controlling === true) {
                sessionStorage.removeItem('sw-first-install-reloaded');
                console.log('[SW] SW reports it is controlling - reload flag cleared');
            } else if (event.data.controlling === false) {
                console.log(
                    '[SW] SW activated but not yet controlling - waiting for controllerchange'
                );
            }
            emit('swActivated', data);
            break;

        case 'CLEAR_RELOAD_FLAG':
            // SW has successfully claimed control, clear the reload flag
            sessionStorage.removeItem('sw-first-install-reloaded');
            console.log('[SW] Reload flag cleared - SW is now controlling');
            break;

        case 'SYNC_COMPLETED':
            state.syncPending = false;
            state.lastSyncAt = Date.now();
            emit('syncCompleted', data);
            break;

        case 'SYNC_FAILED':
            state.syncPending = false;
            emit('syncFailed', data);
            break;

        case 'PROGRESS_SYNCED':
            emit('progressSynced', data);
            break;

        case 'CONFLICT_RESOLVED':
            emit('conflictResolved', data);
            break;

        case 'CONFLICT_REQUIRES_MANUAL':
            emit('conflictRequiresManual', data);
            break;

        case 'ASSET_UPDATED':
            emit('assetUpdated', data);
            break;

        case 'OFFLINE_STATUS':
            state.offlineReady = data.offline;
            emit('offlineStatus', data);
            break;

        case 'BUNDLE_PROGRESS':
            emit('bundleProgress', data);
            break;

        case 'BUNDLE_READY':
            console.log('[SW] Offline bundle ready:', data);
            emit('bundleReady', data);
            break;

        default:
        // Unknown message type
    }
}

/**
 * Request background sync
 */
export async function requestSync(tag: string): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
        return false;
    }
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        // Check if Background Sync is supported
        if ('sync' in registration) {
            await (
                registration as ServiceWorkerRegistration & {
                    sync: { register(_tag: string): Promise<void> };
                }
            ).sync.register(tag);
            state.syncPending = true;
            return true;
        } else {
            // Fallback: send message to SW for immediate sync attempt
            controller.postMessage({
                type: 'REQUEST_SYNC',
                tag: tag,
            });
            return true;
        }
    } catch (error) {
        console.error('[SW] Sync request failed:', error);
        return false;
    }
}

/**
 * Request immediate sync of user progress
 * Returns true if sync was successfully triggered
 */
export async function syncUserProgress(): Promise<boolean> {
    console.log('[SW] Requesting user progress sync');
    const result = await requestSync(SYNC_TAGS.USER_PROGRESS);
    if (result) {
        console.log('[SW] User progress sync requested successfully');
    } else {
        console.warn('[SW] Failed to request user progress sync');
    }
    return result;
}

/**
 * Request immediate sync of custom problems
 */
export async function syncCustomProblems(): Promise<boolean> {
    return requestSync(SYNC_TAGS.CUSTOM_PROBLEMS);
}

/**
 * Cache specific problems for offline access
 */
export async function cacheProblemsForOffline(problemUrls: string[]): Promise<boolean> {
    if (!navigator.serviceWorker.controller) {
        return false;
    }

    navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_PROBLEMS',
        problemUrls,
    });

    return true;
}

/**
 * Get current sync status from service worker
 */
export async function getSyncStatus(): Promise<{
    pendingCount: number;
    isSyncing: boolean;
    lastSyncAt: number | null;
}> {
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
        return { pendingCount: 0, isSyncing: false, lastSyncAt: null };
    }

    return new Promise((resolve) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = (event) => {
            if (event.data.type === 'SYNC_STATUS') {
                resolve(event.data.status);
            }
        };

        controller.postMessage({ type: 'GET_SYNC_STATUS' }, [channel.port2]);

        // Timeout after 5 seconds
        setTimeout(() => {
            resolve({ pendingCount: 0, isSyncing: false, lastSyncAt: null });
        }, 5000);
    });
}

/**
 * Clear all caches (for debugging/logout)
 */
export async function clearAllCaches(): Promise<boolean> {
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
        return false;
    }

    controller.postMessage({ type: 'CLEAR_ALL_CACHES' });
    return true;
}

/**
 * Check if app is in offline mode
 */
export function isOffline(): boolean {
    return !navigator.onLine;
}

/**
 * Migrates operations stored in localStorage to the service worker queue.
 * This handles the case where operations were queued before the service worker was available.
 * @returns {Promise<number>} Number of operations migrated
 */
async function migrateLocalStorageOperations(): Promise<number> {
    const pendingOps = JSON.parse(localStorage.getItem('pending-operations') || '[]');
    if (pendingOps.length === 0) return 0;

    // Check if service worker is now available
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker) {
        console.log('[SW] Service Worker not available, keeping operations in localStorage');
        return 0;
    }

    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) {
        console.log('[SW] Service Worker not active, keeping operations in localStorage');
        return 0;
    }

    try {
        // Send operations to service worker
        await new Promise((resolve, reject) => {
            const channel = new MessageChannel();

            // Add timeout to prevent hanging
            const timeoutId = setTimeout(() => {
                reject(new Error('Migration timeout - no response from Service Worker'));
            }, 10000);

            channel.port1.onmessage = (event) => {
                clearTimeout(timeoutId);
                if (event.data && event.data.error) {
                    reject(new Error(event.data.error));
                } else {
                    resolve(event.data);
                }
            };

            registration.active?.postMessage(
                {
                    type: 'SYNC_OPERATIONS',
                    operations: pendingOps,
                },
                [channel.port2]
            );
        });

        // Clear localStorage after successful migration
        localStorage.removeItem('pending-operations');

        console.log(
            `[SW] Migrated ${pendingOps.length} operations from localStorage to service worker`
        );
        return pendingOps.length;
    } catch (error) {
        console.error('[SW] Failed to migrate localStorage operations:', error);
        // Don't clear localStorage on failure - keep them for next attempt
        return 0;
    }
}

/**
 * Listen for online/offline events with improved connectivity checking
 */
export function listenForConnectivityChanges(callback: (_online: boolean) => void): () => void {
    const onlineCallback = callback;
    const connectivityChecker = getConnectivityChecker();
    let isProcessingSync = false;
    let syncTimeoutId: number | null = null;

    /**
     * Safely trigger sync with proper error handling and state management
     */
    const triggerSync = async (source: string): Promise<void> => {
        // Prevent concurrent sync processing
        if (isProcessingSync) {
            console.log(`[SW] Sync already in progress from ${source}, skipping duplicate trigger`);
            return;
        }

        isProcessingSync = true;
        console.log(
            `[SW] Connection restored (${source}), migrating operations and triggering sync`
        );

        try {
            // First migrate any localStorage operations, then trigger sync
            await migrateLocalStorageOperations();
            // Wait for migration to complete before triggering sync
            const syncResult = await syncUserProgress();
            console.log('[SW] Sync triggered successfully:', syncResult);
        } catch (error) {
            console.error('[SW] Error during sync after coming online:', error);
            // Schedule a retry after delay on error
            if (syncTimeoutId !== null) {
                clearTimeout(syncTimeoutId);
            }
            syncTimeoutId = window.setTimeout(() => {
                isProcessingSync = false;
                triggerSync('retry-after-error').catch(console.error);
            }, 5000);
            return; // Keep isProcessingSync true until retry completes
        } finally {
            isProcessingSync = false;
            syncTimeoutId = null;
        }
    };

    const handleOnline = async () => {
        // Use connectivity checker to verify actual server reachability
        const isActuallyOnline = await connectivityChecker.forceFreshCheck();
        onlineCallback(isActuallyOnline);

        if (isActuallyOnline) {
            await triggerSync('online-event');
        }
    };

    const handleOffline = () => {
        onlineCallback(false);
        connectivityChecker.setOnlineStatus(false);
    };

    // Use connectivity checker for more reliable detection
    const unsubscribe = connectivityChecker.onConnectivityChange((online) => {
        onlineCallback(online);
        if (online) {
            triggerSync('connectivity-change').catch((error) => {
                console.error('[SW] Sync failed after connectivity change:', error);
            });
        }
    });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Start monitoring
    connectivityChecker.startMonitoring();

    // Return cleanup function
    return () => {
        if (syncTimeoutId !== null) {
            clearTimeout(syncTimeoutId);
        }
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        unsubscribe();
        connectivityChecker.stopMonitoring();
    };
}

/**
 * Subscribe to service worker events
 */
export function on(event: string, callback: (_data: unknown) => void): () => void {
    if (!listeners.has(event)) {
        listeners.set(event, new Set());
    }
    listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
        listeners.get(event)?.delete(callback);
    };
}

/**
 * Emit event to listeners
 */
function emit(event: string, data: unknown): void {
    listeners.get(event)?.forEach((callback) => {
        try {
            callback(data);
        } catch (error) {
            console.error(`[SW] Error in event listener for ${event}:`, error);
        }
    });
}

/**
 * Get current service worker state
 */
export function getState(): SWState {
    return { ...state };
}

/**
 * Check if service worker is supported
 */
export function isSupported(): boolean {
    return 'serviceWorker' in navigator;
}

/**
 * Check if background sync is supported
 */
export function isBackgroundSyncSupported(): boolean {
    return 'sync' in ServiceWorkerRegistration.prototype;
}

/**
 * Unregister service worker (for debugging)
 */
export async function unregister(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) return false;

    try {
        const registration = await navigator.serviceWorker.ready;
        const result = await registration.unregister();
        return result;
    } catch (error) {
        console.error('[SW] Unregister failed:', error);
        return false;
    }
}

export { SYNC_TAGS };

/**
 * Get the current bundle download status
 */
export async function getBundleStatus(): Promise<{
    status: 'idle' | 'downloading' | 'extracting' | 'complete' | 'error';
    progress: number;
    totalFiles: number;
    extractedFiles: number;
    error?: string;
    bundleVersion?: string;
    downloadedAt?: number;
}> {
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
        return { status: 'idle', progress: 0, totalFiles: 0, extractedFiles: 0 };
    }

    return new Promise((resolve) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = (event) => {
            if (event.data.type === 'BUNDLE_STATUS') {
                resolve(event.data.status);
            }
        };

        controller.postMessage({ type: 'GET_BUNDLE_STATUS' }, [channel.port2]);

        // Timeout after 5 seconds
        setTimeout(() => {
            resolve({ status: 'idle', progress: 0, totalFiles: 0, extractedFiles: 0 });
        }, 5000);
    });
}

/**
 * Manually trigger bundle download
 */
export async function downloadBundle(): Promise<boolean> {
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
        return false;
    }

    return new Promise((resolve) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = (event) => {
            if (event.data.type === 'BUNDLE_COMPLETE') {
                resolve(true);
            } else if (event.data.type === 'BUNDLE_ERROR') {
                resolve(false);
            }
        };

        controller.postMessage({ type: 'DOWNLOAD_BUNDLE' }, [channel.port2]);

        // Timeout after 60 seconds (bundle download can take time)
        setTimeout(() => {
            resolve(false);
        }, 60000);
    });
}

/**
 * Scan for dynamic assets (scripts, styles) and send to SW for caching
 */
function cacheDynamicAssets(registration: ServiceWorkerRegistration): void {
    if (!registration.active) return;

    try {
        const assetsToCache: string[] = [];

        // Scan for scripts
        document.querySelectorAll('script[src]').forEach((script) => {
            const src = (script as HTMLScriptElement).src;
            if (src && !src.startsWith('chrome-extension:') && !src.startsWith('data:')) {
                assetsToCache.push(src);
            }
        });

        // Scan for stylesheets
        document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
            const href = (link as HTMLLinkElement).href;
            if (href && !href.startsWith('chrome-extension:') && !href.startsWith('data:')) {
                assetsToCache.push(href);
            }
        });

        if (assetsToCache.length > 0) {
            console.log(`[SW] Sending ${assetsToCache.length} assets to cache`);
            registration.active.postMessage({
                type: 'CACHE_ASSETS',
                assets: assetsToCache,
            });
        }
    } catch (error) {
        console.error('[SW] Failed to cache dynamic assets:', error);
    }
}
