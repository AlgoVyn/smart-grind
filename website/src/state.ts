// --- STATE MANAGEMENT MODULE ---
// Centralized state management for the application

import { User, Problem, UIState } from './types';
import { data } from './data';

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

/**
 * Helper to safely parse JSON with fallback
 */
const safeJsonParse = <T>(data: string | null, defaultValue: T): T => {
    try {
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
};

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
        const prefix = isSignedIn ? 'SIGNED_IN_' : '';
        return {
            problems:
                data.LOCAL_STORAGE_KEYS[
                    `${prefix}PROBLEMS` as keyof typeof data.LOCAL_STORAGE_KEYS
                ],
            deletedIds:
                data.LOCAL_STORAGE_KEYS[
                    `${prefix}DELETED_IDS` as keyof typeof data.LOCAL_STORAGE_KEYS
                ],
            displayName:
                data.LOCAL_STORAGE_KEYS[
                    `${prefix}DISPLAY_NAME` as keyof typeof data.LOCAL_STORAGE_KEYS
                ],
        };
    },

    // Load state from localStorage
    loadFromStorage(): void {
        try {
            const keys = this._getStorageKeys();
            const problemsObj = safeJsonParse<Record<string, Problem>>(
                localStorage.getItem(keys.problems),
                {}
            );
            const deletedIdsArr = safeJsonParse<string[]>(
                localStorage.getItem(keys.deletedIds),
                []
            );

            this.problems = new Map(Object.entries(problemsObj));
            this.problems.forEach((p) => (p.loading = false));
            this.deletedProblemIds = new Set(deletedIdsArr);
            this.user.displayName =
                localStorage.getItem(keys.displayName) ||
                (this.user.type === 'signed-in' ? '' : 'Local User');
            this.user.type = (localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE) ||
                'local') as 'local' | 'signed-in';

            this._hasLoadedFromStorage = true;
        } catch {
            // ignore
        }
    },

    // Save state to localStorage
    saveToStorage(): void {
        try {
            const keys = this._getStorageKeys();
            const problemsWithoutLoading = Object.fromEntries(
                Array.from(this.problems.entries()).map(([id, p]) => {
                    const { loading: _, noteVisible: __, ...rest } = p;
                    return [id, rest];
                })
            );
            localStorage.setItem(keys.problems, JSON.stringify(problemsWithoutLoading));
            localStorage.setItem(
                keys.deletedIds,
                JSON.stringify(Array.from(this.deletedProblemIds))
            );
            localStorage.setItem(keys.displayName, this.user.displayName);
            localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, this.user.type);
        } catch {
            // ignore
        }
    },

    // Check if state has valid data (not empty)
    hasValidData(): boolean {
        return this.problems.size > 0 || this.deletedProblemIds.size > 0;
    },

    // Cache DOM elements
    cacheElements(): void {
        // Simple element IDs (HTMLElement)
        const elementIds = [
            'setup-modal',
            'add-problem-modal',
            'signin-modal',
            'signin-modal-content',
            'alert-modal',
            'confirm-modal',
            'alert-message',
            'confirm-message',
            'alert-title',
            'confirm-title',
            'alert-ok-btn',
            'confirm-ok-btn',
            'confirm-cancel-btn',
            'solution-modal',
            'solution-close-btn',
            'app-wrapper',
            'loading-screen',
            'topic-list',
            'problems-container',
            'content-scroll',
            'empty-state',
            'current-view-title',
            'google-login-button',
            'modal-google-login-button',
            'setup-error',
            'signin-error',
            'user-display',
            'disconnect-btn',
            'sidebar-total-stat',
            'sidebar-total-bar',
            'stat-total',
            'stat-solved',
            'progress-bar-solved',
            'stat-due',
            'stat-due-badge',
            'review-banner',
            'review-count-banner',
            'mobile-menu-btn',
            'mobile-menu-btn-main',
            'open-add-modal-btn',
            'cancel-add-btn',
            'save-add-btn',
            'theme-toggle-btn',
            'scroll-to-top-btn',
            'sidebar-logo',
            'mobile-logo',
            'main-sidebar',
            'sidebar-resizer',
            'sidebar-backdrop',
            'date-filter-container',
            'toast-container',
        ];

        // Input element IDs (HTMLInputElement)
        const inputIds = [
            'add-prob-name',
            'add-prob-url',
            'add-prob-category-new',
            'add-prob-pattern-new',
            'problem-search',
        ];

        // Select element IDs (HTMLSelectElement)
        const selectIds = ['add-prob-category', 'add-prob-pattern', 'review-date-filter'];

        const elements: Partial<ElementCache> = {};

        // Helper to convert kebab-case to camelCase
        const toCamelCase = (id: string) =>
            id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) as keyof ElementCache;

        // Cache simple elements
        for (const id of elementIds) {
            (elements as Record<string, HTMLElement | null>)[toCamelCase(id)] =
                document.getElementById(id);
        }

        // Cache input elements
        for (const id of inputIds) {
            (elements as Record<string, HTMLInputElement | null>)[toCamelCase(id)] =
                document.getElementById(id) as HTMLInputElement | null;
        }

        // Cache select elements
        for (const id of selectIds) {
            (elements as Record<string, HTMLSelectElement | null>)[toCamelCase(id)] =
                document.getElementById(id) as HTMLSelectElement | null;
        }

        // Cache collections
        elements['filterBtns'] = document.querySelectorAll('.filter-btn');
        this.elements = elements;
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
