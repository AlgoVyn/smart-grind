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

    saveToStorage(): void {
        const keys = this.getStorageKeys();

        const problemsWithoutLoading = Object.fromEntries(
            [...this.problems.entries()].map(([id, { loading: _l, noteVisible: _n, ...rest }]) => [
                id,
                rest,
            ])
        );

        safeSetItem(keys.problems, problemsWithoutLoading);
        safeSetItem(keys.deletedIds, [...this.deletedProblemIds]);
        safeSetItem(keys.flashCardProgress, Object.fromEntries(this.flashCardProgress));
        setStringItem(keys.displayName, this.user.displayName);
        setStringItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, this.user.type);
    },

    saveToStorageDebounced(): void {
        debouncedSaveToStorage(() => this.saveToStorage());
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
