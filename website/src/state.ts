// --- STATE MANAGEMENT MODULE ---
// Centralized state management for the application

import { User, Problem, UIState, SyncStatusUpdate, FlashCardProgress } from './types';
import { data } from './data';
import { cacheElements, ElementCache } from './utils/elements';
import { safeGetItem, safeSetItem, getStringItem, setStringItem } from './utils/storage';

export const state = {
    // User state
    user: {
        type: 'local' as 'local' | 'signed-in',
        id: null as string | null,
        displayName: 'Local User',
    },

    // Problem data
    problems: new Map<string, Problem>(),
    deletedProblemIds: new Set<string>(),

    // Flash card progress data
    flashCardProgress: new Map<string, FlashCardProgress>(),

    // UI state
    ui: {
        activeTopicId: '',
        activeAlgorithmCategoryId: null as string | null,
        activeSQLCategoryId: null as string | null,
        currentFilter: 'all',
        searchQuery: '',
        preferredAI: null as string | null,
        reviewDateFilter: null as string | null,
    },

    // Sync state for offline/online tracking
    sync: {
        isOnline: true,
        isSyncing: false,
        pendingCount: 0,
        lastSyncAt: null as number | null,
        hasConflicts: false,
        conflictMessage: null as string | null,
    },

    // DOM elements cache
    elements: {} as Partial<ElementCache>,

    // Track if state has been loaded from storage
    hasLoadedFromStorage: false,

    // Initialize state
    init() {
        // Initialize user type from storage BEFORE loading other state
        const storedUserType = localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE);
        if (storedUserType === 'signed-in' || storedUserType === 'local') {
            this.user.type = storedUserType;
        }

        // Load preferred AI from storage (lazy initialization for SW compatibility)
        this.ui.preferredAI = localStorage.getItem('preferred-ai') || null;

        this.loadFromStorage();
        this.cacheElements();
    },

    // Helper to get storage keys based on user type
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

    // Load state from localStorage
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

    // Save state to localStorage
    saveToStorage(): void {
        const keys = this.getStorageKeys();

        // Strip transient properties before saving
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

    // Check if state has valid data (not empty)
    hasValidData(): boolean {
        return this.problems.size > 0 || this.deletedProblemIds.size > 0;
    },

    // Cache DOM elements
    cacheElements(): void {
        this.elements = cacheElements<ElementCache>();
    },

    // Update user state
    setUser(userData: Partial<User>): void {
        this.user = { ...this.user, ...userData };
        this.saveToStorage();
    },

    // Update UI state
    setUI(uiData: Partial<UIState>): void {
        this.ui = { ...this.ui, ...uiData };
    },

    // Update sync status
    setSyncStatus(status: Partial<SyncStatusUpdate>): void {
        this.sync = { ...this.sync, ...status };
        this.emitSyncStatusChange();
    },

    // Update online status
    setOnlineStatus(isOnline: boolean): void {
        this.sync.isOnline = isOnline;
        this.emitSyncStatusChange();
    },

    // Emit sync status change event for UI updates
    emitSyncStatusChange(): void {
        if (typeof window === 'undefined') return;
        window.dispatchEvent(new CustomEvent('sync-status-change', { detail: { ...this.sync } }));
    },

    // Get current sync status
    getSyncStatus(): typeof this.sync {
        return { ...this.sync };
    },

    // Get solved SQL problems count
    getSolvedSQLCount(): number {
        return Array.from(this.problems.values()).filter(
            (p) => p.status === 'solved' && p.id.startsWith('sql-')
        ).length;
    },

    // Get solved SQL count by category
    getSolvedSQLCountByCategory(_categoryId: string): number {
        return Array.from(this.problems.values()).filter(
            (p) => p.status === 'solved' && p.id.startsWith('sql-')
        ).length;
    },
};
