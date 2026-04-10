// --- API SAVE MODULE ---
import { UserData, Problem } from '../types';
import { state, markProblemDirty, markDeletedIdsDirty } from '../state';
import { data } from '../data';
import { validateResponseOrigin, isBrowserOnline, getErrorMessage } from './api-utils';
import { getCachedCsrfToken } from '../app';
import { showToast } from '../utils';

// Callbacks for UI updates (breaks circular dependency with renderers/ui)
const callbacks: {
    onStatsUpdate?: () => void;
    onSaveError?: (_msg: string) => void;
    onViewUpdate?: () => void;
} = {};
export const registerSaveCallbacks = (cb: Partial<typeof callbacks>): void => {
    if (cb.onStatsUpdate) callbacks.onStatsUpdate = cb.onStatsUpdate;
    if (cb.onSaveError) callbacks.onSaveError = cb.onSaveError;
    if (cb.onViewUpdate) callbacks.onViewUpdate = cb.onViewUpdate;
};

// Debounce & rate limit state
let syncTimer: ReturnType<typeof setTimeout> | null = null;
let pendingData: UserData | null = null;
let lastSync = 0;
const SYNC_DEBOUNCE = 1000;
const MIN_SYNC_INTERVAL = 5000;
const MAX_RETRIES = 3;

const prepareData = (): UserData => ({
    problems: Object.fromEntries(
        [...state.problems.entries()].map(([id, { loading: _, noteVisible: __, ...rest }]) => [
            id,
            rest,
        ])
    ),
    deletedIds: [...state.deletedProblemIds],
});

const getCsrfToken = async (): Promise<string> => {
    if (!isBrowserOnline()) throw new Error('OFFLINE: Cannot fetch CSRF token');
    const { getCsrfToken } = await import('../utils/csrf');
    const token = await getCsrfToken();
    if (!token) throw new Error('Failed to fetch CSRF token');
    return token;
};

const saveRemote = async (dataToSave: UserData | null): Promise<void> => {
    if (!isBrowserOnline()) throw new Error('OFFLINE: Cannot save remotely');

    const csrfToken = await getCsrfToken();
    const response = await fetch(`${data.API_BASE}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
        credentials: 'include',
        body: JSON.stringify({ data: dataToSave || prepareData() }),
    });

    validateResponseOrigin(response);
    if (!response.ok)
        throw new Error(getErrorMessage(response.status, `Save failed: ${response.statusText}`));
};

const trySave = async (fn: () => Promise<void>, isOfflineMode = false): Promise<void> => {
    try {
        await fn();
        callbacks.onStatsUpdate?.();
    } catch (e) {
        if (isOfflineMode) throw e;
        const msg =
            e instanceof TypeError && e.message.includes('fetch')
                ? 'Network error. Check connection and try again.'
                : e instanceof Error
                  ? e.message
                  : String(e);
        callbacks.onSaveError?.(`Failed to save: ${msg}`);
        showToast(`Failed to save: ${msg}`, 'error');
        throw e;
    }
};

const executeSync = async (dataToSync: UserData | null, attempt = 1): Promise<void> => {
    lastSync = Date.now();

    if (isBrowserOnline()) {
        try {
            await saveRemote(dataToSync);
            return;
        } catch (_error) {
            if (attempt < MAX_RETRIES) {
                // Exponential backoff with jitter to prevent thundering herd
                const baseDelay = Math.min(1000 * 2 ** (attempt - 1), 30000);
                const jitter = baseDelay * 0.3 * (Math.random() - 0.5);
                const delay = Math.max(100, Math.floor(baseDelay + jitter));
                console.warn(`[Sync] Attempt ${attempt} failed, retrying in ${delay}ms...`);
                await new Promise((r) => setTimeout(r, delay));
                return executeSync(dataToSync, attempt + 1);
            }
            console.error('[Sync] Max retries reached, falling back to SW queue');
        }
    }

    const { queueOperation, forceSync } = await import('../api');
    await queueOperation({
        type: 'UPDATE_SETTINGS',
        data: dataToSync || prepareData(),
        timestamp: Date.now(),
    });
    if (isBrowserOnline()) await forceSync();
};

const debouncedSync = (): void => {
    // Merge new data into pending rather than replacing it, so that rapid
    // successive calls don't lose the data from the first call.
    const newData = prepareData();
    if (pendingData) {
        // Merge: newer problems overwrite older ones; deletedIds are unioned
        pendingData = {
            problems: { ...pendingData.problems, ...newData.problems },
            deletedIds: [...new Set([...pendingData.deletedIds, ...newData.deletedIds])],
        };
    } else {
        pendingData = newData;
    }
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
        syncTimer = null;
        const dataToSync = pendingData;
        pendingData = null;
        if (Date.now() - lastSync < MIN_SYNC_INTERVAL) {
            setTimeout(() => executeSync(dataToSync), MIN_SYNC_INTERVAL - (Date.now() - lastSync));
        } else {
            executeSync(dataToSync).catch((e) =>
                console.error('[Sync] Background sync failed:', e)
            );
        }
    }, SYNC_DEBOUNCE);
};

export const _performSave = async (): Promise<void> => {
    await trySave(() => {
        state.saveToStorageDebounced();
        return Promise.resolve();
    }, true);
    if (state.user.type === 'signed-in') debouncedSync();
};

export const saveProblem = async (_problem?: Problem): Promise<void> => _performSave();

export const saveDeletedId = async (id: string): Promise<void> => {
    const problem = state.problems.get(id);
    try {
        markProblemDirty(id);
        state.problems.delete(id);
        state.deletedProblemIds.add(id);
        markDeletedIdsDirty();
        await _performSave();
        callbacks.onViewUpdate?.();
    } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        callbacks.onSaveError?.(`Failed to delete problem: ${msg}`);
        showToast(`Failed to delete problem: ${msg}`, 'error');
        if (problem) {
            state.problems.set(id, problem);
            markProblemDirty(id);
            state.deletedProblemIds.delete(id);
            markDeletedIdsDirty();
        }
        throw e;
    }
};

export const saveData = async (): Promise<void> => _performSave();

export const flushPendingSync = async (): Promise<void> => {
    if (syncTimer) {
        clearTimeout(syncTimer);
        syncTimer = null;
    }
    if (pendingData) {
        const dataToSync = pendingData;
        pendingData = null;
        if (Date.now() - lastSync < MIN_SYNC_INTERVAL) {
            await new Promise((r) => setTimeout(r, MIN_SYNC_INTERVAL - (Date.now() - lastSync)));
        }
        await executeSync(dataToSync);
    }
};

export const _resetDebounceState = (): void => {
    if (syncTimer) {
        clearTimeout(syncTimer);
        syncTimer = null;
    }
    pendingData = null;
    lastSync = 0;
};

export const _saveLocally = async (): Promise<void> => state.saveToStorageDebounced();
export const _saveRemotely = async (): Promise<void> => saveRemote(null);
export const _triggerBackgroundSync = debouncedSync;

// Page unload handler — uses fetch with keepalive for reliable CSRF-compliant saves.
// sendBeacon cannot set custom headers (X-CSRF-Token), so fetch+keepalive is preferred.
// Falls back to sendBeacon with _csrf in body only if keepalive is unavailable.
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        if (syncTimer && pendingData && isBrowserOnline()) {
            const token = getCachedCsrfToken();
            if (token) {
                const payload = JSON.stringify({ data: pendingData, _csrf: token });
                try {
                    // SECURITY: Include CSRF token both as X-CSRF-Token header (primary)
                    // and in request body (fallback for sendBeacon).
                    // fetch+keepalive sends the header; sendBeacon only sends the body field.
                    fetch(`${data.API_BASE}/user`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': token,
                        },
                        credentials: 'include',
                        keepalive: true,
                        body: payload,
                    }).catch(() => {
                        // Best-effort save on page unload; errors are expected and acceptable
                    });
                } catch (_e) {
                    // Fallback for browsers that throw on fetch+keepalive
                    try {
                        const blob = new Blob([payload], { type: 'application/json' });
                        navigator.sendBeacon(`${data.API_BASE}/user`, blob);
                    } catch (beaconError) {
                        console.error('[API Save] Page-unload save failed:', beaconError);
                    }
                }
            } else {
                console.warn('[API Save] No CSRF token available for beforeunload sync');
            }
        }
    });
}
