// Service Worker Registration Module for SmartGrind
// Handles SW registration, updates, and communication

// Service Worker configuration
const SW_CONFIG = {
    path: '/smartgrind/sw.js',
    scope: '/smartgrind/',
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
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
        return false;
    }

    try {
        // Add cache-busting to force fresh download
        const swUrl = `${SW_CONFIG.path}?v=${Date.now()}`;
        const registration = await navigator.serviceWorker.register(swUrl, {
            scope: SW_CONFIG.scope,
            updateViaCache: 'none',
        });

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
            state.active = true;
            emit('activated', null);
        });

        state.registered = true;
        return true;
    } catch (error) {
        console.error('[SW] Registration failed:', error);
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
                    // First install
                    state.offlineReady = true;
                    emit('offlineReady', null);
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
            emit('swActivated', data);
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
 */
export async function syncUserProgress(): Promise<boolean> {
    return requestSync(SYNC_TAGS.USER_PROGRESS);
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
 * Listen for online/offline events
 */
export function listenForConnectivityChanges(callback: (_online: boolean) => void): () => void {
    const onlineCallback = callback;
    const handleOnline = () => {
        onlineCallback(true);
        // Trigger sync when coming back online
        syncUserProgress();
    };

    const handleOffline = () => {
        onlineCallback(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Return cleanup function
    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
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

// Export sync tags for use in other modules
export { SYNC_TAGS };
