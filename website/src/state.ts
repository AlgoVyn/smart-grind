// --- STATE MANAGEMENT MODULE ---
// Centralized state management for the application

import { User, Problem, UIState } from './types';
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

    // UI state
    ui: {
        activeTopicId: 'all',
        activeAlgorithmCategoryId: null as string | null,
        currentFilter: 'all',
        searchQuery: '',
        preferredAI: localStorage.getItem('preferred-ai') || null,
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
        this.loadFromStorage();
        this.cacheElements();
    },

    // Helper to get storage keys based on user type
    getStorageKeys() {
        const isSignedIn = this.user.type === 'signed-in';
        return {
            problems: isSignedIn
                ? data.LOCAL_STORAGE_KEYS.SIGNED_IN_PROBLEMS
                : data.LOCAL_STORAGE_KEYS.PROBLEMS,
            deletedIds: isSignedIn
                ? data.LOCAL_STORAGE_KEYS.SIGNED_IN_DELETED_IDS
                : data.LOCAL_STORAGE_KEYS.DELETED_IDS,
            displayName: isSignedIn
                ? data.LOCAL_STORAGE_KEYS.SIGNED_IN_DISPLAY_NAME
                : data.LOCAL_STORAGE_KEYS.DISPLAY_NAME,
        };
    },

    // Load state from localStorage
    loadFromStorage(): void {
        const keys = this.getStorageKeys();

        const problemsObj = safeGetItem<Record<string, Problem>>(keys.problems, {});
        const deletedIdsArr = safeGetItem<string[]>(keys.deletedIds, []);

        this.problems = new Map(Object.entries(problemsObj));
        this.problems.forEach((p) => (p.loading = false));
        this.deletedProblemIds = new Set(deletedIdsArr);
        this.user.displayName = getStringItem(
            keys.displayName,
            this.user.type === 'signed-in' ? '' : 'Local User'
        );
        this.user.type = getStringItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, 'local') as
            | 'local'
            | 'signed-in';

        this.hasLoadedFromStorage = true;
    },

    // Save state to localStorage
    saveToStorage(): void {
        const keys = this.getStorageKeys();
        const problemsWithoutLoading = Object.fromEntries(
            [...this.problems.entries()].map(([id, p]) => {
                const { loading: _, noteVisible: __, ...rest } = p;
                return [id, rest];
            })
        );
        safeSetItem(keys.problems, problemsWithoutLoading);
        safeSetItem(keys.deletedIds, [...this.deletedProblemIds]);
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
        Object.assign(this.user, userData);
        this.saveToStorage();
    },

    // Update UI state
    setUI(uiData: Partial<UIState>): void {
        Object.assign(this.ui, uiData);
    },

    // Update sync status
    setSyncStatus(
        status: Partial<{
            pendingCount: number;
            isSyncing: boolean;
            lastSyncAt: number | null;
            hasConflicts: boolean;
            conflictMessage: string | null;
        }>
    ): void {
        Object.assign(this.sync, status);
        this.emitSyncStatusChange();
    },

    // Update online status
    setOnlineStatus(isOnline: boolean): void {
        this.sync.isOnline = isOnline;
        this.emitSyncStatusChange();
    },

    // Emit sync status change event for UI updates
    emitSyncStatusChange(): void {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('sync-status-change', { detail: { ...this.sync } })
            );
        }
    },

    // Get current sync status
    getSyncStatus(): typeof this.sync {
        return { ...this.sync };
    },
};
