// --- API SAVE MODULE ---
// Data saving operations

import { UserData, Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { validateResponseOrigin, isBrowserOnline, getErrorMessage } from './api-utils';
import { getCachedCsrfToken } from '../app';
import { showToast } from '../utils';

// Event callbacks for UI updates (prevents circular dependency with renderers/ui)
let onStatsUpdate: (() => void) | null = null;
let onSaveError: ((message: string) => void) | null = null;
let onViewUpdate: (() => void) | null = null;

/**
 * Register callbacks for UI updates
 * This breaks the circular dependency between api-save and renderers/ui
 */
export const registerSaveCallbacks = (callbacks: {
    onStatsUpdate?: () => void;
    onSaveError?: (message: string) => void;
    onViewUpdate?: () => void;
}): void => {
    if (callbacks.onStatsUpdate) onStatsUpdate = callbacks.onStatsUpdate;
    if (callbacks.onSaveError) onSaveError = callbacks.onSaveError;
    if (callbacks.onViewUpdate) onViewUpdate = callbacks.onViewUpdate;
};

/**
 * Debounce configuration for remote sync
 * This batches multiple rapid changes into a single sync request
 */
const SYNC_DEBOUNCE_MS = 1000;
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingSyncData: UserData | null = null;

/**
 * Rate limiting configuration
 * Prevents hammering the server with too many sync requests
 */
const RATE_LIMIT = {
    MIN_INTERVAL_MS: 5000, // Minimum 5 seconds between syncs
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 1000,
};

// Track last sync time for rate limiting
let lastSyncTime: number = 0;
let rateLimitQueue: (() => void)[] = [];
let isRateLimitProcessing: boolean = false;

/**
 * Prepares the current problem data for saving by serializing the problems map and deleted IDs.
 */
const prepareDataForSave = (): UserData => ({
    problems: Object.fromEntries(
        [...state.problems.entries()].map(([id, { loading: _, noteVisible: __, ...rest }]) => [
            id,
            rest,
        ])
    ),
    deletedIds: [...state.deletedProblemIds],
});

/**
 * Gets cached CSRF token or fetches new one if needed.
 * Uses caching to avoid fetching before every request.
 */
const getCsrfTokenCached = async (): Promise<string> => {
    if (!isBrowserOnline()) {
        throw new Error('OFFLINE: Cannot fetch CSRF token while offline');
    }
    
    // Import from utils/csrf which has proper caching
    const { getCsrfToken } = await import('../utils/csrf');
    const token = await getCsrfToken();
    
    if (!token) {
        throw new Error('Failed to fetch CSRF token');
    }
    
    return token;
};

/**
 * Saves the provided data to the remote API.
 * Uses cached CSRF token to avoid fetching before every request.
 */
const saveRemotelyWithData = async (dataToSave: UserData | null): Promise<void> => {
    if (!isBrowserOnline()) throw new Error('OFFLINE: Cannot save remotely while offline');

    const dataToUse = dataToSave || prepareDataForSave();
    const csrfToken = await getCsrfTokenCached();
    const response = await fetch(`${data.API_BASE}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ data: dataToUse }),
    });

    validateResponseOrigin(response);
    if (!response.ok) {
        throw new Error(getErrorMessage(response.status, `Save failed: ${response.statusText}`));
    }
};

/**
 * Handles the save operation with error handling and UI updates.
 * Uses callbacks to prevent circular dependency with renderers/ui
 */
const handleSaveOperation = async (
    saveFn: () => Promise<void>,
    isOfflineMode = false
): Promise<void> => {
    try {
        await saveFn();
        // Use callback instead of direct renderers import (prevents circular dependency)
        onStatsUpdate?.();
    } catch (e) {
        if (isOfflineMode) throw e;

        const errorMessage =
            e instanceof TypeError && e.message.includes('fetch')
                ? 'Network error. Please check your internet connection and try again.'
                : e instanceof Error
                  ? e.message
                  : String(e);

        // Use callback instead of direct ui import (prevents circular dependency)
        onSaveError?.(`Failed to save data: ${errorMessage}`);
        showToast(`Failed to save data: ${errorMessage}`, 'error');
        throw e;
    }
};

/**
 * Check if we can execute a sync based on rate limiting
 * @returns true if sync is allowed, false if rate limited
 */
const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncTime;
    
    if (timeSinceLastSync < RATE_LIMIT.MIN_INTERVAL_MS) {
        // Rate limited - queue for later
        return false;
    }
    
    return true;
};

/**
 * Process queued sync operations after rate limit window
 */
const processRateLimitQueue = async (): Promise<void> => {
    if (isRateLimitProcessing || rateLimitQueue.length === 0) {
        return;
    }
    
    isRateLimitProcessing = true;
    
    // Wait for rate limit window
    const timeSinceLastSync = Date.now() - lastSyncTime;
    const waitTime = Math.max(0, RATE_LIMIT.MIN_INTERVAL_MS - timeSinceLastSync);
    
    if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Process all queued operations
    while (rateLimitQueue.length > 0) {
        const nextSync = rateLimitQueue.shift();
        if (nextSync) {
            try {
                await nextSync();
            } catch (error) {
                console.error('[Rate Limit] Queued sync failed:', error);
            }
        }
    }
    
    isRateLimitProcessing = false;
};

/**
 * Executes the actual background sync after debounce period.
 * Includes rate limiting to prevent server hammering.
 */
const executeBackgroundSync = async (): Promise<void> => {
    syncDebounceTimer = null;
    const dataToSync = pendingSyncData;
    pendingSyncData = null;

    // Check rate limit
    if (!checkRateLimit()) {
        // Queue the sync for later
        rateLimitQueue.push(async () => {
            await executeActualSync(dataToSync);
        });
        
        // Start processing queue if not already
        processRateLimitQueue();
        return;
    }

    await executeActualSync(dataToSync);
};

/**
 * Retry configuration with exponential backoff
 */
const RETRY_CONFIG = {
    MAX_ATTEMPTS: 3,
    BASE_DELAY_MS: 1000,    // Start with 1 second
    MAX_DELAY_MS: 30000,   // Cap at 30 seconds
    JITTER_FACTOR: 0.3,    // Add up to 30% jitter
};

/**
 * Calculate delay with exponential backoff and jitter
 */
const calculateRetryDelay = (attempt: number): number => {
    // Exponential backoff: 1s, 2s, 4s, 8s, etc.
    const exponentialDelay = RETRY_CONFIG.BASE_DELAY_MS * Math.pow(2, attempt - 1);
    const cappedDelay = Math.min(exponentialDelay, RETRY_CONFIG.MAX_DELAY_MS);
    
    // Add jitter (random factor to prevent thundering herd)
    const jitter = cappedDelay * RETRY_CONFIG.JITTER_FACTOR * (Math.random() - 0.5);
    return Math.max(100, Math.floor(cappedDelay + jitter)); // Minimum 100ms
};

/**
 * Performs the actual sync operation (without rate limiting check)
 * Includes retry logic with exponential backoff for failed attempts
 */
const executeActualSync = async (dataToSync: UserData | null, attempt: number = 1): Promise<void> => {
    // Update last sync time
    lastSyncTime = Date.now();

    try {
        if (isBrowserOnline()) {
            try {
                await saveRemotelyWithData(dataToSync);
                return;
            } catch (error) {
                // Direct remote save failed, retry with backoff if under max attempts
                if (attempt < RETRY_CONFIG.MAX_ATTEMPTS && isBrowserOnline()) {
                    const delay = calculateRetryDelay(attempt);
                    console.log(`[Sync] Attempt ${attempt} failed, retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return executeActualSync(dataToSync, attempt + 1);
                }
                // Max retries reached, fall through to SW queue
                console.warn('[Sync] Max retries reached, falling back to SW queue');
            }
        }

        const { queueOperation, forceSync } = await import('../api');
        await queueOperation({
            type: 'UPDATE_SETTINGS',
            data: dataToSync || prepareDataForSave(),
            timestamp: Date.now(),
        });

        if (isBrowserOnline()) await forceSync();
    } catch (error) {
        console.error('[Sync] Background sync trigger failed:', error);
        // Don't throw - let the operation queue handle retries via SW
    }
};

/**
 * Triggers background sync for signed-in users with debouncing.
 */
const triggerBackgroundSync = (): void => {
    pendingSyncData = prepareDataForSave();
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(executeBackgroundSync, SYNC_DEBOUNCE_MS);
};

/**
 * Performs the save operation based on the user type (local or remote).
 */
export const _performSave = async (): Promise<void> => {
    await handleSaveOperation(async () => state.saveToStorageDebounced(), true);
    if (state.user.type === 'signed-in') triggerBackgroundSync();
};

/**
 * Saves a problem to storage or API.
 */
export const saveProblem = async (_problem?: Problem): Promise<void> => {
    await _performSave();
};

/**
 * Saves the deletion of a problem by marking it and saving the state.
 */
export const saveDeletedId = async (id: string): Promise<void> => {
    const problem = state.problems.get(id);
    try {
        state.problems.delete(id);
        state.deletedProblemIds.add(id);
        await _performSave();
        // Use callback instead of direct renderers import (prevents circular dependency)
        onViewUpdate?.();
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        onSaveError?.(`Failed to delete problem: ${message}`);
        showToast(`Failed to delete problem: ${message}`, 'error');
        if (problem) {
            state.problems.set(id, problem);
            state.deletedProblemIds.delete(id);
        }
        throw e;
    }
};

/**
 * Saves all current data to storage or API.
 */
export const saveData = async (): Promise<void> => {
    await _performSave();
};

/**
 * Forces an immediate sync, bypassing the debounce timer.
 * Still respects rate limiting to prevent server hammering.
 */
export const flushPendingSync = async (): Promise<void> => {
    if (syncDebounceTimer) {
        clearTimeout(syncDebounceTimer);
        syncDebounceTimer = null;
    }

    if (pendingSyncData) {
        const dataToSync = pendingSyncData;
        pendingSyncData = null;

        // Check rate limit even for forced syncs
        if (!checkRateLimit()) {
            rateLimitQueue.push(async () => {
                await executeActualSync(dataToSync);
            });
            await processRateLimitQueue();
            return;
        }

        await executeActualSync(dataToSync);
    }
};

/**
 * Resets the debounce and rate limiting state. Used for testing.
 */
export const _resetDebounceState = (): void => {
    if (syncDebounceTimer) {
        clearTimeout(syncDebounceTimer);
        syncDebounceTimer = null;
    }
    pendingSyncData = null;
    lastSyncTime = 0;
    rateLimitQueue = [];
    isRateLimitProcessing = false;
};

/**
 * Saves the current state data to local storage.
 */
export const _saveLocally = async (): Promise<void> => {
    state.saveToStorageDebounced();
};

/**
 * Saves the prepared data to the remote API.
 */
export const _saveRemotely = async (): Promise<void> => {
    await saveRemotelyWithData(null);
};

// Set up page unload handler to flush pending syncs
// SECURITY: Uses synchronous token access since beforeunload must be synchronous
// The token is stored in memory (not localStorage) and passed in the request body
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (syncDebounceTimer && pendingSyncData) {
            if (isBrowserOnline()) {
                // Get CSRF token from memory (synchronously via the app module's cached token)
                // Note: We use a synchronous approach here since beforeunload doesn't support async
                // The token is included in the body, not the URL, to prevent log exposure
                const csrfToken = getCachedCsrfToken();
                if (csrfToken) {
                    try {
                        // SECURITY: CSRF token in body, not URL, to prevent exposure in server logs
                        const blob = new Blob(
                            [
                                JSON.stringify({
                                    data: pendingSyncData,
                                    _csrf: csrfToken, // Include CSRF in body instead of URL
                                }),
                            ],
                            { type: 'application/json' }
                        );
                        const success = navigator.sendBeacon(`${data.API_BASE}/user`, blob);
                        if (!success) {
                            // Beacon queued for delivery but may fail - data will be synced on next session
                            console.warn(
                                '[API Save] sendBeacon returned false, sync may have failed'
                            );
                        }
                    } catch (error) {
                        // sendBeacon failed - data will remain in localStorage for next session
                        console.error('[API Save] sendBeacon failed:', error);
                    }
                } else {
                    // No CSRF token available - data will be synced on next session
                    console.warn('[API Save] No CSRF token available for beforeunload sync');
                }
            }
        }
    });
}

// Export internal functions for testing
export const _triggerBackgroundSync = triggerBackgroundSync;
