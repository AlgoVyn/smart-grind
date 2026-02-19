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

        // Don't use cache-busting on every load - it causes the SW to be re-downloaded
        // every time, which prevents it from ever controlling the page.
        // Use updateViaCache: 'none' to still check for updates from the network.
        const swUrl = SW_CONFIG.path;
        console.log(`[SW] Registering from ${swUrl} (attempt ${attempt})`);

        const registration = await navigator.serviceWorker.register(swUrl, {
            updateViaCache: 'none',
            scope: '/smartgrind/',
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

            // If this is the first install and we're not controlled yet,
            // a reload might be necessary to start intercepting requests immediately.
            if (!sessionStorage.getItem('sw-first-install-reloaded')) {
                sessionStorage.setItem('sw-first-install-reloaded', 'true');
                console.log('[SW] First install detected, reloading to ensure SW control...');
                window.location.reload();
            }
        });

        // Wait for the service worker to be ready and controlling
        const isControlling = await waitForController();

        if (isControlling) {
            console.log('[SW] Service Worker is controlling the page');
            sessionStorage.removeItem('sw-first-install-reloaded');
        } else {
            console.log(
                '[SW] Service Worker not controlling after registration. The app will work but may need another refresh for full offline support.'
            );
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
 * Wait for the service worker to take control with improved detection
 */
async function waitForController(): Promise<boolean> {
    // If we already have a controller, we're good
    if (navigator.serviceWorker.controller) {
        console.log('[SW] Controller already exists');
        return true;
    }

    console.log('[SW] No active controller - waiting for SW to take control...');

    // Create a promise that resolves when we get SW_ACTIVATED message
    const swActivatedPromise = new Promise<boolean>((resolve) => {
        const checkMessage = (event: MessageEvent) => {
            if (event.data?.type === 'SW_ACTIVATED') {
                console.log(
                    '[SW] Received SW_ACTIVATED message, controlling:',
                    event.data.controlling
                );
                navigator.serviceWorker.removeEventListener('message', checkMessage);
                // If SW says it's controlling, trust it
                resolve(event.data.controlling === true);
            }
        };
        navigator.serviceWorker.addEventListener('message', checkMessage);

        // Timeout after 15 seconds
        setTimeout(() => {
            navigator.serviceWorker.removeEventListener('message', checkMessage);
            resolve(false);
        }, 15000);
    });

    // Also listen for controllerchange event
    const controllerChangePromise = new Promise<boolean>((resolve) => {
        const onControllerChange = () => {
            console.log('[SW] Controller changed event fired');
            navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
            resolve(true);
        };
        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

        // Timeout after 15 seconds
        setTimeout(() => {
            navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
            resolve(false);
        }, 15000);
    });

    // Poll for controller as fallback
    const pollPromise = new Promise<boolean>((resolve) => {
        let attempts = 0;
        const maxAttempts = 30; // 30 * 500ms = 15 seconds
        const checkController = setInterval(() => {
            attempts++;
            if (navigator.serviceWorker.controller) {
                console.log('[SW] Service Worker is now controlling the page (poll)');
                clearInterval(checkController);
                resolve(true);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkController);
                resolve(false);
            }
        }, 500);
    });

    // Wait for any of the signals
    const result = await Promise.race([swActivatedPromise, controllerChangePromise, pollPromise]);

    // If we got a positive signal, verify with handshake
    if (result) {
        // Give the browser a moment to update navigator.serviceWorker.controller
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Send CLIENT_READY message to confirm control
        const handshakeResult = await performHandshake();
        return handshakeResult;
    }

    return false;
}

/**
 * Perform handshake with service worker to confirm control status
 */
async function performHandshake(): Promise<boolean> {
    return new Promise((resolve) => {
        const controller = navigator.serviceWorker.controller;
        if (!controller) {
            console.log('[SW] No controller for handshake');
            resolve(false);
            return;
        }

        const channel = new MessageChannel();

        // Listen for response
        channel.port1.onmessage = (event) => {
            if (event.data?.type === 'CLIENT_CONTROL_STATUS') {
                console.log('[SW] Handshake response, controlled:', event.data.controlled);
                resolve(event.data.controlled === true);
            }
        };

        // Send CLIENT_READY message
        console.log('[SW] Sending CLIENT_READY message');
        controller.postMessage({ type: 'CLIENT_READY' }, [channel.port2]);

        // Timeout after 5 seconds
        setTimeout(() => {
            resolve(false);
        }, 5000);
    });
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
 * Force the service worker to check for updates and install if available
 * This should be called when the user wants to update the app
 */
export async function checkForUpdates(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        return true;
    } catch (error) {
        console.error('[SW] Update check failed:', error);
        return false;
    }
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
                    // The main registration flow will handle waiting for control
                    state.offlineReady = true;
                    emit('offlineReady', null);
                    console.log('[SW] First install complete - waiting for activation...');
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
