// --- STATE MANAGEMENT MODULE ---
// Centralized state management for the application

import { User, Problem, UIState, SyncStatusUpdate, FlashCardProgress } from './types';
import { data } from './data';
import {
    cacheElements,
    safeGetItem,
    safeSetItem,
    getStringItem,
    setStringItem,
    type ElementCache,
} from './utils';

// Debounce timer for localStorage writes
let storageSaveTimeout: ReturnType<typeof setTimeout> | null = null;
const STORAGE_SAVE_DELAY = 300;

const debouncedSaveToStorage = (saveFn: () => void): void => {
    if (storageSaveTimeout) clearTimeout(storageSaveTimeout);
    storageSaveTimeout = setTimeout(() => {
        saveFn();
        storageSaveTimeout = null;
    }, STORAGE_SAVE_DELAY);
};

const isQuotaError = (error: unknown): boolean =>
    error instanceof Error &&
    (error.name === 'QuotaExceededError' ||
        error.message.includes('quota') ||
        error.message.includes('exceeded'));

export const state = {
    user: {
        type: 'local' as 'local' | 'signed-in',
        id: null as string | null,
        displayName: 'Local User',
    },

    problems: new Map<string, Problem>(),
    deletedProblemIds: new Set<string>(),
    flashCardProgress: new Map<string, FlashCardProgress>(),

    ui: {
        activeTopicId: '',
        activeAlgorithmCategoryId: null as string | null,
        activeSQLCategoryId: null as string | null,
        currentFilter: 'all',
        searchQuery: '',
        preferredAI: null as string | null,
        reviewDateFilter: null as string | null,
    },

    sync: {
        isOnline: true,
        isSyncing: false,
        pendingCount: 0,
        lastSyncAt: null as number | null,
        hasConflicts: false,
        conflictMessage: null as string | null,
    },

    storage: {
        lastError: null as string | null,
        lastErrorAt: null as number | null,
        quotaExceeded: false,
        autoCleanupEnabled: false,
        lastCleanupDeleted: [] as Array<{ id: string; problem?: Problem; timestamp: number }>,
    },

    elements: {} as Partial<ElementCache>,
    hasLoadedFromStorage: false,

    init() {
        const storedUserType = localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE);
        if (storedUserType === 'signed-in' || storedUserType === 'local')
            this.user.type = storedUserType;
        this.ui.preferredAI = localStorage.getItem('preferred-ai') || null;
        this.loadFromStorage();
        this.cacheElements();
    },

    getStorageKeys() {
        const keys = data.LOCAL_STORAGE_KEYS;
        const isSignedIn = this.user.type === 'signed-in';
        return {
            problems: isSignedIn ? keys.SIGNED_IN_PROBLEMS : keys.PROBLEMS,
            deletedIds: isSignedIn ? keys.SIGNED_IN_DELETED_IDS : keys.DELETED_IDS,
            displayName: isSignedIn ? keys.SIGNED_IN_DISPLAY_NAME : keys.DISPLAY_NAME,
            flashCardProgress: isSignedIn
                ? keys.SIGNED_IN_FLASHCARD_PROGRESS
                : keys.FLASHCARD_PROGRESS,
        };
    },

    loadFromStorage(): void {
        const keys = this.getStorageKeys();
        const isSignedIn = this.user.type === 'signed-in';

        const problemsObj = safeGetItem<Record<string, Problem>>(keys.problems, {});
        const deletedIdsArr = safeGetItem<string[]>(keys.deletedIds, []);
        const flashCardProgressObj = safeGetItem<Record<string, FlashCardProgress>>(
            keys.flashCardProgress,
            {}
        );

        this.problems = new Map(Object.entries(problemsObj));
        this.problems.forEach((p) => (p.loading = false));
        this.deletedProblemIds = new Set(deletedIdsArr);
        this.flashCardProgress = new Map(Object.entries(flashCardProgressObj));
        this.user.displayName = getStringItem(keys.displayName, isSignedIn ? '' : 'Local User');
        this.user.type = getStringItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local') as
            | 'local'
            | 'signed-in';
        this.hasLoadedFromStorage = true;
    },

    saveToStorage(options?: { silent?: boolean }): void {
        const keys = this.getStorageKeys();
        const problemsClean = Object.fromEntries(
            [...this.problems.entries()].map(([id, { loading: _l, noteVisible: _n, ...rest }]) => [
                id,
                rest,
            ])
        );

        try {
            const allSaved =
                safeSetItem(keys.problems, problemsClean) &&
                safeSetItem(keys.deletedIds, [...this.deletedProblemIds]) &&
                safeSetItem(keys.flashCardProgress, Object.fromEntries(this.flashCardProgress)) &&
                setStringItem(keys.displayName, this.user.displayName) &&
                setStringItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, this.user.type);

            if (!allSaved) throw new Error('Failed to save to localStorage');

            if (this.storage.lastError) {
                this.storage.lastError = null;
                this.storage.lastErrorAt = null;
                this.storage.quotaExceeded = false;
            }
        } catch (error) {
            const isQuota = isQuotaError(error);
            const msg = isQuota
                ? 'Storage quota exceeded. Please sync your data or export and clear some problems.'
                : 'Failed to save progress locally.';

            this.storage.lastError = msg;
            this.storage.lastErrorAt = Date.now();
            this.storage.quotaExceeded = isQuota;

            if (!options?.silent) this.emitStorageError(msg, isQuota);
            console.error('[State] Storage save failed:', error);
        }
    },

    saveToStorageDebounced(): void {
        debouncedSaveToStorage(() => this.saveToStorage());
    },

    emitStorageError(message: string, isQuotaError: boolean): void {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(
            new CustomEvent('storage-error', {
                detail: { message, isQuotaError, timestamp: Date.now() },
            })
        );
    },

    freeStorageSpace(force = false): number {
        if (!force && !this.storage.autoCleanupEnabled) {
            console.warn(
                '[State] Automatic cleanup disabled. Enable autoCleanupEnabled or pass force=true'
            );
            this.emitStorageError(
                'Storage full. Please export your data and clear some problems, or enable auto-cleanup.',
                true
            );
            return 0;
        }

        let freedCount = 0;
        const deletedItems: Array<{ id: string; problem?: Problem; timestamp: number }> = [];

        // Limit deleted IDs to most recent 50
        if (this.deletedProblemIds.size > 100) {
            const ids = [...this.deletedProblemIds];
            const toRemove = ids.slice(0, ids.length - 50);
            this.deletedProblemIds = new Set(ids.slice(-50));
            freedCount += toRemove.length;
            toRemove.forEach((id) => deletedItems.push({ id, timestamp: Date.now() }));
        }

        // Remove old solved problems without notes if still needed
        if (freedCount === 0 && this.problems.size > 50) {
            const today = new Date().toISOString().split('T')[0]!;
            const candidates = [...this.problems.entries()]
                .filter(
                    ([, p]) =>
                        p.status === 'solved' &&
                        !p.note &&
                        p.nextReviewDate &&
                        p.nextReviewDate < today
                )
                .sort((a, b) =>
                    (b[1].nextReviewDate || '0000').localeCompare(a[1].nextReviewDate || '0000')
                );

            const toRemove = candidates.slice(
                -Math.min(Math.floor(this.problems.size * 0.2), candidates.length)
            );
            toRemove.forEach(([id, problem]) => {
                this.problems.delete(id);
                freedCount++;
                deletedItems.push({ id, problem: { ...problem }, timestamp: Date.now() });
            });
        }

        if (freedCount > 0) {
            console.warn(
                `[State] Freed ${freedCount} items`,
                deletedItems.map((d) => d.id)
            );
            this.storage.lastCleanupDeleted = deletedItems;
            this.saveToStorage({ silent: true });

            if (typeof window !== 'undefined') {
                window.dispatchEvent(
                    new CustomEvent('storage-cleanup', {
                        detail: {
                            freedCount,
                            deletedItems: deletedItems.map((d) => ({
                                id: d.id,
                                timestamp: d.timestamp,
                            })),
                            timestamp: Date.now(),
                        },
                    })
                );
            }
        }

        return freedCount;
    },

    recoverCleanedUpProblems(): number {
        let recovered = 0;
        for (const item of this.storage.lastCleanupDeleted) {
            if (item.problem && !this.problems.has(item.id)) {
                this.problems.set(item.id, item.problem);
                recovered++;
            }
        }

        if (recovered > 0) {
            console.log(`[State] Recovered ${recovered} problems from cleanup`);
            this.saveToStorage();
        }

        this.storage.lastCleanupDeleted = [];
        return recovered;
    },

    hasValidData(): boolean {
        return this.problems.size > 0 || this.deletedProblemIds.size > 0;
    },

    cacheElements(): void {
        this.elements = cacheElements();
    },

    setUser(userData: Partial<User>): void {
        this.user = { ...this.user, ...userData };
        this.saveToStorage();
    },

    setUI(uiData: Partial<UIState>): void {
        this.ui = { ...this.ui, ...uiData };
    },

    setSyncStatus(status: Partial<SyncStatusUpdate>): void {
        this.sync = { ...this.sync, ...status };
        this.emitSyncStatusChange();
    },

    setOnlineStatus(isOnline: boolean): void {
        this.sync.isOnline = isOnline;
        this.emitSyncStatusChange();
    },

    emitSyncStatusChange(): void {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(new CustomEvent('sync-status-change', { detail: { ...this.sync } }));
    },

    getSyncStatus(): typeof this.sync {
        return { ...this.sync };
    },

    getSolvedSQLCount(): number {
        return [...this.problems.values()].filter(
            (p) => p.status === 'solved' && p.id.startsWith('sql-')
        ).length;
    },

    getEl<K extends keyof ElementCache>(key: K): ElementCache[K] {
        return this.elements[key] as ElementCache[K];
    },
};
