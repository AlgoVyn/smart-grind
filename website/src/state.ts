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
} from './utils-core';

// Debounce timer for localStorage writes
let storageSaveTimeout: ReturnType<typeof setTimeout> | null = null;
const STORAGE_SAVE_DELAY = 300;

const debouncedSaveToStorage = (saveFn: () => void): void => {
    if (storageSaveTimeout) {
        clearTimeout(storageSaveTimeout);
    }
    storageSaveTimeout = setTimeout(() => {
        saveFn();
        storageSaveTimeout = null;
    }, STORAGE_SAVE_DELAY);
};

/**
 * Check if an error is a storage quota exceeded error
 * @param error - The error to check
 * @returns True if quota exceeded
 */
const isQuotaExceededError = (error: unknown): boolean => {
    if (error instanceof Error) {
        return (
            error.name === 'QuotaExceededError' ||
            error.message.includes('quota') ||
            // Removed: too broad, matches unrelated errors
            error.message.includes('exceeded')
        );
    }
    return false;
};

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

    // Storage error tracking
    storage: {
        lastError: null as string | null,
        lastErrorAt: null as number | null,
        quotaExceeded: false,
        /** Whether automatic cleanup is enabled (disabled by default for safety) */
        autoCleanupEnabled: false,
        /** Recently deleted items during cleanup (for potential recovery) */
        lastCleanupDeleted: [] as Array<{ id: string; problem?: Problem; timestamp: number }>,
    },

    elements: {} as Partial<ElementCache>,
    hasLoadedFromStorage: false,

    init() {
        const storedUserType = localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE);
        if (storedUserType === 'signed-in' || storedUserType === 'local') {
            this.user.type = storedUserType;
        }
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

    /**
     * Saves state to localStorage with quota error handling
     * Emits storage-error event if save fails
     */
    saveToStorage(options?: { silent?: boolean }): void {
        const keys = this.getStorageKeys();

        const problemsWithoutLoading = Object.fromEntries(
            [...this.problems.entries()].map(([id, { loading: _l, noteVisible: _n, ...rest }]) => [
                id,
                rest,
            ])
        );

        try {
            // Attempt to save all data
            const problemsSaved = safeSetItem(keys.problems, problemsWithoutLoading);
            const deletedIdsSaved = safeSetItem(keys.deletedIds, [...this.deletedProblemIds]);
            const flashCardSaved = safeSetItem(
                keys.flashCardProgress,
                Object.fromEntries(this.flashCardProgress)
            );
            const displayNameSaved = setStringItem(keys.displayName, this.user.displayName);
            const userTypeSaved = setStringItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, this.user.type);

            // Check for any failures
            const allSaved =
                problemsSaved &&
                deletedIdsSaved &&
                flashCardSaved &&
                displayNameSaved &&
                userTypeSaved;

            if (!allSaved) {
                throw new Error('Failed to save to localStorage');
            }

            // Clear any previous error on success
            if (this.storage.lastError) {
                this.storage.lastError = null;
                this.storage.lastErrorAt = null;
                this.storage.quotaExceeded = false;
            }
        } catch (error) {
            const isQuotaError = isQuotaExceededError(error);
            const errorMessage = isQuotaError
                ? 'Storage quota exceeded. Please sync your data or export and clear some problems.'
                : 'Failed to save progress locally.';

            this.storage.lastError = errorMessage;
            this.storage.lastErrorAt = Date.now();
            this.storage.quotaExceeded = isQuotaError;

            // Emit storage error event for UI to handle (unless silent)
            if (!options?.silent) {
                this.emitStorageError(errorMessage, isQuotaError);
            }

            console.error('[State] Storage save failed:', error);
        }
    },

    saveToStorageDebounced(): void {
        debouncedSaveToStorage(() => this.saveToStorage());
    },

    /**
     * Emits a storage error event that the UI can listen to
     */
    emitStorageError(message: string, isQuotaError: boolean): void {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(
            new CustomEvent('storage-error', {
                detail: {
                    message,
                    isQuotaError,
                    timestamp: Date.now(),
                },
            })
        );
    },

    /**
     * Clears old/deleted problems to free up storage space
     * SAFETY: Only runs if autoCleanupEnabled is true (disabled by default)
     * Tracks deleted items for potential recovery
     * @param force - Override autoCleanupEnabled check (use with caution)
     * @returns Number of items freed
     */
    freeStorageSpace(force = false): number {
        // SAFETY: Don't auto-delete user data unless explicitly enabled or forced
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

        // First, try limiting deleted problem IDs to prevent unbounded growth
        // Since we cannot reliably determine deletion order from Set storage, limit to most recent 50 items
        if (this.deletedProblemIds.size > 100) {
            const idsArray = [...this.deletedProblemIds];
            const toRemove = idsArray.slice(0, idsArray.length - 50); // Remove excess items (order depends on insertion/storage)
            const toKeep = idsArray.slice(-50); // Keep last 50
            this.deletedProblemIds = new Set(toKeep);
            freedCount += toRemove.length;
            toRemove.forEach((id) => deletedItems.push({ id, timestamp: Date.now() }));
        }

        // If still having issues, remove old solved problems without notes
        if (freedCount === 0 && this.problems.size > 50) {
            const problemsArray = [...this.problems.entries()];
            const todayStr = new Date().toISOString().split('T')[0]!;
            const candidates = problemsArray
                .filter(([, p]) => {
                    // Must be solved without notes
                    if (p.status !== 'solved' || p.note) return false;
                    // Only consider problems that have been reviewed (past review date)
                    // and have a valid review date set
                    return typeof p.nextReviewDate === 'string' && p.nextReviewDate < todayStr;
                })
                .sort((a, b) => {
                    // Sort by review date descending (most recent first)
                    // This puts stale problems (old review dates) at the end for removal
                    const aDate = a[1].nextReviewDate || '0000';
                    const bDate = b[1].nextReviewDate || '0000';
                    return bDate.localeCompare(aDate); // Descending order
                });

            // Take only the stalest 20% from the end
            const removeCount = Math.min(Math.floor(problemsArray.length * 0.2), candidates.length);
            const problemsToRemove = candidates.slice(-removeCount);

            problemsToRemove.forEach(([id, problem]) => {
                this.problems.delete(id);
                freedCount++;
                deletedItems.push({ id, problem: { ...problem }, timestamp: Date.now() });
            });
        }

        if (freedCount > 0) {
            console.warn(
                `[State] Freed ${freedCount} items to save storage space`,
                deletedItems.map((d) => d.id)
            );
            // Store deleted items for potential recovery
            this.storage.lastCleanupDeleted = deletedItems;
            this.saveToStorage({ silent: true }); // Silent mode to avoid cascading error events

            // Emit event about the cleanup
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

    /**
     * Recovers problems deleted during the last cleanup
     * @returns Number of problems recovered
     */
    recoverCleanedUpProblems(): number {
        let recoveredCount = 0;

        for (const item of this.storage.lastCleanupDeleted) {
            if (item.problem && !this.problems.has(item.id)) {
                this.problems.set(item.id, item.problem);
                recoveredCount++;
            }
        }

        if (recoveredCount > 0) {
            console.log(`[State] Recovered ${recoveredCount} problems from cleanup`);
            this.saveToStorage();
        }

        // Clear the recovery list after attempting recovery
        this.storage.lastCleanupDeleted = [];

        return recoveredCount;
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
        return Array.from(this.problems.values()).filter(
            (p) => p.status === 'solved' && p.id.startsWith('sql-')
        ).length;
    },

    /**
     * Get a typed DOM element from the cache
     * @param key - The element key from ElementCache
     * @returns The typed element or null if not found
     *
     * @example
     * const modal = state.getEl('setupModal'); // HTMLElement | null
     * const input = state.getEl('addProbName'); // HTMLInputElement | null
     */
    getEl<K extends keyof ElementCache>(key: K): ElementCache[K] {
        return this.elements[key] as ElementCache[K];
    },
};
