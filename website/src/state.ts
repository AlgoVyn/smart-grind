// --- STATE MANAGEMENT MODULE ---
// Centralized state management for the application

import { User, Problem, UIState, SyncStatusUpdate, FlashCardProgress } from './types';
import { STORAGE_SAVE_DELAY, LIMITS } from './config/limits';
import { data } from './data';
import {
    cacheElements,
    safeGetItem,
    safeSetItem,
    getStringItem,
    setStringItem,
    type ElementCache,
} from './utils';

// ============================================================================
// PRIVATE STATE — Mutable collections backing the readonly public getters.
// These MUST NOT be accessed directly outside this module; use the wrapper
// methods (setProblem, deleteProblem, addDeletedId, etc.) instead.
// ============================================================================

const _problems = new Map<string, Problem>();
const _deletedProblemIds = new Set<string>();

// Debounce timer for localStorage writes
let storageSaveTimeout: ReturnType<typeof setTimeout> | null = null;

const debouncedSaveToStorage = (saveFn: () => void): void => {
    if (storageSaveTimeout) clearTimeout(storageSaveTimeout);
    storageSaveTimeout = setTimeout(() => {
        saveFn();
        storageSaveTimeout = null;
    }, STORAGE_SAVE_DELAY);
};

// Extended quota error check — includes message-based detection for broader compatibility
const isQuotaError = (error: unknown): boolean =>
    error instanceof Error &&
    (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.message.includes('quota') ||
        error.message.includes('exceeded'));

// ============================================================================
// DIRTY TRACKING FOR INCREMENTAL SAVES
// ============================================================================

/** Tracks which problem IDs have been modified since the last full save. */
const dirtyProblemIds = new Set<string>();

/** Whether deletedProblemIds has been modified since last full save. */
let dirtyDeletedIds = false;

/** Whether flashCardProgress has been modified since last full save. */
let dirtyFlashCards = false;

/** Whether user metadata has been modified since last full save. */
let dirtyUserMeta = false;

/**
 * Marks flash card progress as dirty for incremental saving.
 * Call this whenever state.flashCardProgress is mutated.
 */
export const markFlashCardsDirty = (): void => {
    dirtyFlashCards = true;
};

/**
 * Marks deleted problem IDs as dirty for incremental saving.
 * Call this whenever state.deletedProblemIds is mutated (add/delete).
 */
export const markDeletedIdsDirty = (): void => {
    dirtyDeletedIds = true;
};

/**
 * Marks a problem as dirty for incremental saving.
 * Call this whenever state.problems is mutated (set/delete/modify).
 */
export const markProblemDirty = (problemId: string): void => {
    dirtyProblemIds.add(problemId);
};

/**
 * Flushes the dirty tracking state after a successful full save.
 */
const flushDirtyState = (): void => {
    dirtyProblemIds.clear();
    dirtyDeletedIds = false;
    dirtyFlashCards = false;
    dirtyUserMeta = false;
};

/**
 * Checks whether any dirty tracking state is pending.
 */
const hasDirtyState = (): boolean =>
    dirtyProblemIds.size > 0 || dirtyDeletedIds || dirtyFlashCards || dirtyUserMeta;

export const state = {
    user: {
        type: 'local' as 'local' | 'signed-in',
        id: null as string | null,
        displayName: 'Local User',
    },

    /** Read-only view of problems Map. Use setProblem/deleteProblem for mutations. */
    get problems(): ReadonlyMap<string, Problem> {
        return _problems;
    },
    /** Read-only view of deleted problem IDs. Use addDeletedId/removeDeletedId for mutations. */
    get deletedProblemIds(): ReadonlySet<string> {
        return _deletedProblemIds;
    },
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

        _problems.clear();
        for (const [k, v] of Object.entries(problemsObj)) _problems.set(k, v);
        _problems.forEach((p) => (p.loading = false));
        _deletedProblemIds.clear();
        for (const id of deletedIdsArr) _deletedProblemIds.add(id);
        this.flashCardProgress = new Map(Object.entries(flashCardProgressObj));
        this.user.displayName = getStringItem(keys.displayName, isSignedIn ? '' : 'Local User');
        this.user.type = getStringItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local') as
            | 'local'
            | 'signed-in';
        this.hasLoadedFromStorage = true;
    },

    /**
     * Saves the full state to localStorage.
     * Uses dirty tracking to perform incremental saves when possible,
     * significantly reducing main-thread blocking for large datasets.
     */
    saveToStorage(options?: { silent?: boolean }): void {
        const keys = this.getStorageKeys();

        // PERFORMANCE: If only a few problems changed, do an incremental save
        // instead of serializing the entire problems Map.
        // Threshold: incremental is faster when dirty count < 20% of total
        // or when there are fewer than 30 dirty problems.
        const incrementalThreshold = Math.max(
            LIMITS.STATE.INCREMENTAL_SAVE_MAX_DIRTY,
            Math.floor(this.problems.size * LIMITS.STATE.INCREMENTAL_SAVE_PERCENTAGE)
        );
        const useIncremental =
            hasDirtyState() &&
            dirtyProblemIds.size > 0 &&
            dirtyProblemIds.size < incrementalThreshold &&
            !dirtyDeletedIds &&
            !dirtyFlashCards &&
            !dirtyUserMeta;

        try {
            // Build problems object based on save type
            let problemsClean: Record<string, Omit<Problem, 'loading' | 'noteVisible'>>;

            if (useIncremental) {
                // Incremental: merge dirty problems into existing data
                const existingProblems = safeGetItem<Record<string, Problem>>(keys.problems, {});
                problemsClean = { ...existingProblems };
                for (const id of dirtyProblemIds) {
                    const p = this.problems.get(id);
                    if (p) {
                        const { loading: _l, noteVisible: _n, ...rest } = p;
                        problemsClean[id] = rest;
                    } else {
                        delete problemsClean[id];
                    }
                }
            } else {
                // Full: serialize entire state
                problemsClean = Object.fromEntries(
                    [...this.problems.entries()].map(
                        ([id, { loading: _l, noteVisible: _n, ...rest }]) => [id, rest]
                    )
                );
            }

            // Common write operations for both paths
            safeSetItem(keys.problems, problemsClean);
            safeSetItem(keys.deletedIds, [...this.deletedProblemIds]);
            safeSetItem(keys.flashCardProgress, Object.fromEntries(this.flashCardProgress));
            setStringItem(keys.displayName, this.user.displayName);
            setStringItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, this.user.type);

            if (useIncremental) {
                dirtyProblemIds.clear();
            } else {
                flushDirtyState();
            }

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
        if (_deletedProblemIds.size > LIMITS.STORAGE.CLEANUP_THRESHOLD) {
            const ids = [..._deletedProblemIds];
            const toRemove = ids.slice(0, ids.length - LIMITS.STORAGE.MAX_DELETED_IDS);
            _deletedProblemIds.clear();
            for (const id of ids.slice(-LIMITS.STORAGE.MAX_DELETED_IDS)) _deletedProblemIds.add(id);
            freedCount += toRemove.length;
            toRemove.forEach((id) => deletedItems.push({ id, timestamp: Date.now() }));
            markDeletedIdsDirty();
        }

        // Remove old solved problems without notes if still needed
        if (freedCount === 0 && _problems.size > LIMITS.STORAGE.MIN_PROBLEMS_BEFORE_CLEANUP) {
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
                -Math.min(
                    Math.floor(this.problems.size * LIMITS.STORAGE.CLEANUP_BATCH_SIZE),
                    candidates.length
                )
            );
            toRemove.forEach(([id, problem]) => {
                this.deleteProblem(id);
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
            if (item.problem && !_problems.has(item.id)) {
                this.setProblem(item.id, item.problem);
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
        dirtyUserMeta = true;
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

    /**
     * Sets a problem in the problems Map and marks it dirty for incremental saving.
     * Use this instead of state.problems.set() to ensure proper dirty tracking.
     * @param id - The problem ID
     * @param problem - The problem object
     */
    setProblem(id: string, problem: Problem): void {
        _problems.set(id, problem);
        markProblemDirty(id);
    },

    /**
     * Deletes a problem from the problems Map and marks it dirty for incremental saving.
     * Use this instead of state.problems.delete() to ensure proper dirty tracking.
     * @param id - The problem ID
     * @returns true if the problem was deleted, false otherwise
     */
    deleteProblem(id: string): boolean {
        const result = _problems.delete(id);
        if (result) {
            markProblemDirty(id);
        }
        return result;
    },

    /**
     * Clears all problems from the problems Map and marks the collection dirty.
     * Use this instead of state.problems.clear() to ensure proper dirty tracking.
     */
    clearProblems(): void {
        // Mark all existing IDs as dirty before clearing
        for (const id of _problems.keys()) {
            markProblemDirty(id);
        }
        _problems.clear();
    },

    /**
     * Adds a problem ID to the deleted set and marks deleted IDs as dirty.
     * Use this instead of state.deletedProblemIds.add() to ensure proper dirty tracking.
     * @param id - The problem ID to mark as deleted
     */
    addDeletedId(id: string): void {
        _deletedProblemIds.add(id);
        markDeletedIdsDirty();
    },

    /**
     * Removes a problem ID from the deleted set and marks deleted IDs as dirty.
     * Use this instead of state.deletedProblemIds.delete() to ensure proper dirty tracking.
     * @param id - The problem ID to remove from deleted set
     * @returns true if the ID was in the set, false otherwise
     */
    removeDeletedId(id: string): boolean {
        const result = _deletedProblemIds.delete(id);
        if (result) {
            markDeletedIdsDirty();
        }
        return result;
    },

    /**
     * Sets flash card progress and marks flash cards as dirty for incremental saving.
     * Use this instead of state.flashCardProgress.set() to ensure proper dirty tracking.
     * @param cardId - The flash card ID
     * @param progress - The progress object
     */
    setFlashCardProgress(cardId: string, progress: FlashCardProgress): void {
        this.flashCardProgress.set(cardId, progress);
        dirtyFlashCards = true;
    },
    /**
     * Replaces the entire problems Map with a new one.
     * Use for rollback scenarios where the full Map must be swapped.
     * Marks all new entries as dirty for incremental saving.
     */
    replaceProblems(newMap: Map<string, Problem>): void {
        _problems.clear();
        for (const [k, v] of newMap) _problems.set(k, v);
        for (const id of _problems.keys()) markProblemDirty(id);
    },

    /**
     * Replaces the entire deletedProblemIds set with a new one.
     * Use for rollback scenarios where the full Set must be swapped.
     */
    replaceDeletedIds(newSet: Set<string>): void {
        _deletedProblemIds.clear();
        for (const id of newSet) _deletedProblemIds.add(id);
        markDeletedIdsDirty();
    },

    /**
     * Clears all deleted problem IDs and marks the collection as dirty.
     * Use this instead of state.deletedProblemIds.clear() to ensure proper dirty tracking.
     */
    clearDeletedIds(): void {
        _deletedProblemIds.clear();
        markDeletedIdsDirty();
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
