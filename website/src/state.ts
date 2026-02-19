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
        console.error('JSON parse error');
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

    // Load state from localStorage
    loadFromStorage(): void {
        try {
            const problemsObj = safeJsonParse<Record<string, Problem>>(
                localStorage.getItem(data.LOCAL_STORAGE_KEYS.PROBLEMS),
                {}
            );
            const deletedIdsArr = safeJsonParse<string[]>(
                localStorage.getItem(data.LOCAL_STORAGE_KEYS.DELETED_IDS),
                []
            );

            this.problems = new Map(Object.entries(problemsObj));
            this.problems.forEach((p) => (p.loading = false));
            this.deletedProblemIds = new Set(deletedIdsArr);
            this.user.displayName =
                localStorage.getItem(data.LOCAL_STORAGE_KEYS.DISPLAY_NAME) || 'Local User';
            this.user.type = (localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE) ||
                'local') as 'local' | 'signed-in';
        } catch (e) {
            console.error('Error loading state from storage:', e);
        }
    },

    // Save state to localStorage
    saveToStorage(): void {
        try {
            const problemsWithoutLoading = Object.fromEntries(
                Array.from(this.problems.entries()).map(([id, p]) => {
                    const { loading: _, noteVisible: __, ...rest } = p;
                    return [id, rest];
                })
            );
            localStorage.setItem(
                data.LOCAL_STORAGE_KEYS.PROBLEMS,
                JSON.stringify(problemsWithoutLoading)
            );
            localStorage.setItem(
                data.LOCAL_STORAGE_KEYS.DELETED_IDS,
                JSON.stringify(Array.from(this.deletedProblemIds))
            );
            localStorage.setItem(data.LOCAL_STORAGE_KEYS.DISPLAY_NAME, this.user.displayName);
            localStorage.setItem(data.LOCAL_STORAGE_KEYS.USER_TYPE, this.user.type);
        } catch (e) {
            console.error('Error saving state to storage:', e);
        }
    },

    // Cache DOM elements
    cacheElements(): void {
        // Element ID mappings: property name -> [DOM ID, input type or null for regular elements]
        const elementMappings: Record<string, [string, 'input' | 'select' | null]> = {
            setupModal: ['setup-modal', null],
            addProblemModal: ['add-problem-modal', null],
            signinModal: ['signin-modal', null],
            signinModalContent: ['signin-modal-content', null],
            alertModal: ['alert-modal', null],
            confirmModal: ['confirm-modal', null],
            alertMessage: ['alert-message', null],
            confirmMessage: ['confirm-message', null],
            alertTitle: ['alert-title', null],
            confirmTitle: ['confirm-title', null],
            alertOkBtn: ['alert-ok-btn', null],
            confirmOkBtn: ['confirm-ok-btn', null],
            confirmCancelBtn: ['confirm-cancel-btn', null],
            appWrapper: ['app-wrapper', null],
            loadingScreen: ['loading-screen', null],
            googleLoginBtn: ['google-login-button', null],
            modalGoogleLoginBtn: ['modal-google-login-button', null],
            setupError: ['setup-error', null],
            signinError: ['signin-error', null],
            topicList: ['topic-list', null],
            problemsContainer: ['problems-container', null],
            mobileMenuBtn: ['mobile-menu-btn', null],
            openAddModalBtn: ['open-add-modal-btn', null],
            cancelAddBtn: ['cancel-add-btn', null],
            saveAddBtn: ['save-add-btn', null],
            sidebarSolvedText: ['sidebar-total-stat', null],
            sidebarSolvedBar: ['sidebar-total-bar', null],
            mainTotalText: ['stat-total', null],
            mainSolvedText: ['stat-solved', null],
            mainSolvedBar: ['progress-bar-solved', null],
            mainDueText: ['stat-due', null],
            mainDueBadge: ['stat-due-badge', null],
            currentFilterDisplay: ['current-filter-display', null],
            contentScroll: ['content-scroll', null],
            emptyState: ['empty-state', null],
            currentViewTitle: ['current-view-title', null],
            reviewBanner: ['review-banner', null],
            reviewCountBanner: ['review-count-banner', null],
            toastContainer: ['toast-container', null],
            userDisplay: ['user-display', null],
            disconnectBtn: ['disconnect-btn', null],
            themeToggleBtn: ['theme-toggle-btn', null],
            mainSidebar: ['main-sidebar', null],
            sidebarResizer: ['sidebar-resizer', null],
            sidebarBackdrop: ['sidebar-backdrop', null],
            mobileMenuBtnMain: ['mobile-menu-btn-main', null],
            scrollToTopBtn: ['scroll-to-top-btn', null],
            sidebarLogo: ['sidebar-logo', null],
            mobileLogo: ['mobile-logo', null],
            solutionModal: ['solution-modal', null],
            solutionCloseBtn: ['solution-close-btn', null],
            headerDisconnectBtn: ['header-disconnect-btn', null],
            dateFilterContainer: ['date-filter-container', null],
            addProbName: ['add-prob-name', 'input'],
            addProbUrl: ['add-prob-url', 'input'],
            addProbCategoryNew: ['add-prob-category-new', 'input'],
            addProbPatternNew: ['add-prob-pattern-new', 'input'],
            problemSearch: ['problem-search', 'input'],
            addProbCategory: ['add-prob-category', 'select'],
            addProbPattern: ['add-prob-pattern', 'select'],
            reviewDateFilter: ['review-date-filter', 'select'],
        };

        const elements: Partial<ElementCache> = {};
        for (const [key, [id, type]] of Object.entries(elementMappings)) {
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
