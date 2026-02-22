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
    currentFilterDisplay: HTMLElement | null;
    // Auth elements
    googleLoginBtn: HTMLElement | null;
    modalGoogleLoginBtn: HTMLElement | null;
    setupError: HTMLElement | null;
    signinError: HTMLElement | null;
    userDisplay: HTMLElement | null;
    disconnectBtn: HTMLElement | null;
    headerDisconnectBtn: HTMLElement | null;
    // Stats elements
    sidebarSolvedText: HTMLElement | null;
    sidebarSolvedBar: HTMLElement | null;
    mainTotalText: HTMLElement | null;
    mainSolvedText: HTMLElement | null;
    mainSolvedBar: HTMLElement | null;
    mainDueText: HTMLElement | null;
    mainDueBadge: HTMLElement | null;
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

    // Cache DOM elements
    cacheElements(): void {
        // Element configurations: { id, type? }
        // type: 'input' -> HTMLInputElement, 'select' -> HTMLSelectElement, undefined -> HTMLElement
        const elementConfigs: Array<{ id: string; type?: 'input' | 'select' }> = [
            // Modals
            { id: 'setup-modal' },
            { id: 'add-problem-modal' },
            { id: 'signin-modal' },
            { id: 'signin-modal-content' },
            { id: 'alert-modal' },
            { id: 'confirm-modal' },
            { id: 'alert-message' },
            { id: 'confirm-message' },
            { id: 'alert-title' },
            { id: 'confirm-title' },
            { id: 'alert-ok-btn' },
            { id: 'confirm-ok-btn' },
            { id: 'confirm-cancel-btn' },
            { id: 'solution-modal' },
            { id: 'solution-close-btn' },
            // App structure
            { id: 'app-wrapper' },
            { id: 'loading-screen' },
            { id: 'topic-list' },
            { id: 'problems-container' },
            { id: 'content-scroll' },
            { id: 'empty-state' },
            { id: 'current-view-title' },
            { id: 'current-filter-display' },
            // Auth elements
            { id: 'google-login-button' },
            { id: 'modal-google-login-button' },
            { id: 'setup-error' },
            { id: 'signin-error' },
            { id: 'user-display' },
            { id: 'disconnect-btn' },
            { id: 'header-disconnect-btn' },
            // Stats elements
            { id: 'sidebar-total-stat' },
            { id: 'sidebar-total-bar' },
            { id: 'stat-total' },
            { id: 'stat-solved' },
            { id: 'progress-bar-solved' },
            { id: 'stat-due' },
            { id: 'stat-due-badge' },
            { id: 'review-banner' },
            { id: 'review-count-banner' },
            // Navigation & controls
            { id: 'mobile-menu-btn' },
            { id: 'mobile-menu-btn-main' },
            { id: 'open-add-modal-btn' },
            { id: 'cancel-add-btn' },
            { id: 'save-add-btn' },
            { id: 'theme-toggle-btn' },
            { id: 'scroll-to-top-btn' },
            { id: 'sidebar-logo' },
            { id: 'mobile-logo' },
            { id: 'main-sidebar' },
            { id: 'sidebar-resizer' },
            { id: 'sidebar-backdrop' },
            { id: 'date-filter-container' },
            { id: 'toast-container' },
            // Form inputs
            { id: 'add-prob-name', type: 'input' },
            { id: 'add-prob-url', type: 'input' },
            { id: 'add-prob-category-new', type: 'input' },
            { id: 'add-prob-pattern-new', type: 'input' },
            { id: 'problem-search', type: 'input' },
            // Form selects
            { id: 'add-prob-category', type: 'select' },
            { id: 'add-prob-pattern', type: 'select' },
            { id: 'review-date-filter', type: 'select' },
        ];

        const elements: Partial<ElementCache> = {};

        for (const { id, type } of elementConfigs) {
            const key = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) as keyof ElementCache;
            const el = document.getElementById(id);
            (elements as Record<string, HTMLElement | HTMLInputElement | HTMLSelectElement | null>)[
                key
            ] =
                type === 'input'
                    ? (el as HTMLInputElement | null)
                    : type === 'select'
                      ? (el as HTMLSelectElement | null)
                      : el;
        }

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
