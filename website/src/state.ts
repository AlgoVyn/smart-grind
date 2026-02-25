// --- STATE MANAGEMENT MODULE ---
// Centralized state management for the application

import { User, Problem, UIState } from './types';
import { data } from './data';
import { cacheElements } from './utils/elements';
import { safeGetItem, safeSetItem, getStringItem, setStringItem } from './utils/storage';

/**
 * Interface for DOM element cache
 * Elements are cached on init for fast access throughout the app
 */
interface ElementCache {
    // Modals
    setupModal: HTMLElement | null;
    addProblemModal: HTMLElement | null;
    signinModal: HTMLElement | null;
    signinModalContent: HTMLElement | null;
    alertModal: HTMLElement | null;
    confirmModal: HTMLElement | null;
    solutionModal: HTMLElement | null;
    // Modal content elements
    alertMessage: HTMLElement | null;
    confirmMessage: HTMLElement | null;
    alertTitle: HTMLElement | null;
    confirmTitle: HTMLElement | null;
    alertOkBtn: HTMLElement | null;
    confirmOkBtn: HTMLElement | null;
    confirmCancelBtn: HTMLElement | null;
    solutionCloseBtn: HTMLElement | null;
    // App structure
    appWrapper: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    topicList: HTMLElement | null;
    problemsContainer: HTMLElement | null;
    contentScroll: HTMLElement | null;
    emptyState: HTMLElement | null;
    currentViewTitle: HTMLElement | null;
    // Auth elements
    googleLoginButton: HTMLElement | null;
    modalGoogleLoginButton: HTMLElement | null;
    setupError: HTMLElement | null;
    signinError: HTMLElement | null;
    userDisplay: HTMLElement | null;
    disconnectBtn: HTMLElement | null;
    // Stats elements
    sidebarTotalStat: HTMLElement | null;
    sidebarTotalBar: HTMLElement | null;
    statTotal: HTMLElement | null;
    statSolved: HTMLElement | null;
    progressBarSolved: HTMLElement | null;
    statDue: HTMLElement | null;
    statDueBadge: HTMLElement | null;
    reviewBanner: HTMLElement | null;
    reviewCountBanner: HTMLElement | null;
    // Navigation & controls
    mobileMenuBtn: HTMLElement | null;
    mobileMenuBtnMain: HTMLElement | null;
    openAddModalBtn: HTMLElement | null;
    cancelAddBtn: HTMLElement | null;
    saveAddBtn: HTMLElement | null;
    themeToggleBtn: HTMLElement | null;
    scrollToTopBtn: HTMLElement | null;
    sidebarLogo: HTMLElement | null;
    mobileLogo: HTMLElement | null;
    mainSidebar: HTMLElement | null;
    sidebarResizer: HTMLElement | null;
    sidebarBackdrop: HTMLElement | null;
    // Form inputs
    addProbName: HTMLInputElement | null;
    addProbUrl: HTMLInputElement | null;
    addProbCategory: HTMLSelectElement | null;
    addProbCategoryNew: HTMLInputElement | null;
    addProbPattern: HTMLSelectElement | null;
    addProbPatternNew: HTMLInputElement | null;
    problemSearch: HTMLInputElement | null;
    reviewDateFilter: HTMLSelectElement | null;
    dateFilterContainer: HTMLElement | null;
    // Collections
    filterBtns: NodeListOf<Element>;
    toastContainer: HTMLElement | null;
}

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
    _hasLoadedFromStorage: false,

    // Initialize state
    init() {
        this.loadFromStorage();
        this.cacheElements();
    },

    // Helper to get storage keys based on user type
    _getStorageKeys() {
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
        const keys = this._getStorageKeys();

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

        this._hasLoadedFromStorage = true;
    },

    // Save state to localStorage
    saveToStorage(): void {
        const keys = this._getStorageKeys();
        const problemsWithoutLoading = Object.fromEntries(
            Array.from(this.problems.entries()).map(([id, p]) => {
                const { loading: _, noteVisible: __, ...rest } = p;
                return [id, rest];
            })
        );
        safeSetItem(keys.problems, problemsWithoutLoading);
        safeSetItem(keys.deletedIds, Array.from(this.deletedProblemIds));
        setStringItem(keys.displayName, this.user.displayName);
        setStringItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, this.user.type);
    },

    // Check if state has valid data (not empty)
    hasValidData(): boolean {
        return this.problems.size > 0 || this.deletedProblemIds.size > 0;
    },

    // Cache DOM elements
    cacheElements(): void {
        this.elements = cacheElements<Partial<ElementCache>>();
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

    // Convenience getters for sync status
    isOnline: () => state.sync.isOnline,
    isSyncing: () => state.sync.isSyncing,
    getPendingCount: () => state.sync.pendingCount,
    hasSyncConflicts: () => state.sync.hasConflicts,
    getSyncStatus: () => ({ ...state.sync }),
};
