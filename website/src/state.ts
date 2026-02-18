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
        const $ = (id: string) => document.getElementById(id);
        const $input = (id: string) => document.getElementById(id) as HTMLInputElement | null;
        const $select = (id: string) => document.getElementById(id) as HTMLSelectElement | null;

        // Element ID mappings: [property name, element ID, type]
        const elementIds: [string, string, 'el' | 'input' | 'select'][] = [
            ['setupModal', 'setup-modal', 'el'],
            ['addProblemModal', 'add-problem-modal', 'el'],
            ['signinModal', 'signin-modal', 'el'],
            ['signinModalContent', 'signin-modal-content', 'el'],
            ['alertModal', 'alert-modal', 'el'],
            ['confirmModal', 'confirm-modal', 'el'],
            ['alertMessage', 'alert-message', 'el'],
            ['confirmMessage', 'confirm-message', 'el'],
            ['alertTitle', 'alert-title', 'el'],
            ['confirmTitle', 'confirm-title', 'el'],
            ['alertOkBtn', 'alert-ok-btn', 'el'],
            ['confirmOkBtn', 'confirm-ok-btn', 'el'],
            ['confirmCancelBtn', 'confirm-cancel-btn', 'el'],
            ['appWrapper', 'app-wrapper', 'el'],
            ['loadingScreen', 'loading-screen', 'el'],
            ['googleLoginBtn', 'google-login-button', 'el'],
            ['modalGoogleLoginBtn', 'modal-google-login-button', 'el'],
            ['setupError', 'setup-error', 'el'],
            ['signinError', 'signin-error', 'el'],
            ['topicList', 'topic-list', 'el'],
            ['problemsContainer', 'problems-container', 'el'],
            ['mobileMenuBtn', 'mobile-menu-btn', 'el'],
            ['openAddModalBtn', 'open-add-modal-btn', 'el'],
            ['cancelAddBtn', 'cancel-add-btn', 'el'],
            ['saveAddBtn', 'save-add-btn', 'el'],
            ['sidebarSolvedText', 'sidebar-total-stat', 'el'],
            ['sidebarSolvedBar', 'sidebar-total-bar', 'el'],
            ['mainTotalText', 'stat-total', 'el'],
            ['mainSolvedText', 'stat-solved', 'el'],
            ['mainSolvedBar', 'progress-bar-solved', 'el'],
            ['mainDueText', 'stat-due', 'el'],
            ['mainDueBadge', 'stat-due-badge', 'el'],
            ['currentFilterDisplay', 'current-filter-display', 'el'],
            ['contentScroll', 'content-scroll', 'el'],
            ['emptyState', 'empty-state', 'el'],
            ['currentViewTitle', 'current-view-title', 'el'],
            ['reviewBanner', 'review-banner', 'el'],
            ['reviewCountBanner', 'review-count-banner', 'el'],
            ['toastContainer', 'toast-container', 'el'],
            ['userDisplay', 'user-display', 'el'],
            ['disconnectBtn', 'disconnect-btn', 'el'],
            ['themeToggleBtn', 'theme-toggle-btn', 'el'],
            ['mainSidebar', 'main-sidebar', 'el'],
            ['sidebarResizer', 'sidebar-resizer', 'el'],
            ['sidebarBackdrop', 'sidebar-backdrop', 'el'],
            ['mobileMenuBtnMain', 'mobile-menu-btn-main', 'el'],
            ['scrollToTopBtn', 'scroll-to-top-btn', 'el'],
            ['sidebarLogo', 'sidebar-logo', 'el'],
            ['mobileLogo', 'mobile-logo', 'el'],
            ['solutionModal', 'solution-modal', 'el'],
            ['solutionCloseBtn', 'solution-close-btn', 'el'],
            ['headerDisconnectBtn', 'header-disconnect-btn', 'el'],
            ['dateFilterContainer', 'date-filter-container', 'el'],
            ['addProbName', 'add-prob-name', 'input'],
            ['addProbUrl', 'add-prob-url', 'input'],
            ['addProbCategoryNew', 'add-prob-category-new', 'input'],
            ['addProbPatternNew', 'add-prob-pattern-new', 'input'],
            ['problemSearch', 'problem-search', 'input'],
            ['addProbCategory', 'add-prob-category', 'select'],
            ['addProbPattern', 'add-prob-pattern', 'select'],
            ['reviewDateFilter', 'review-date-filter', 'select'],
        ];

        const elements: Partial<ElementCache> = {};
        for (const [key, id, type] of elementIds) {
            (elements as Record<string, HTMLElement | HTMLInputElement | HTMLSelectElement | null>)[
                key
            ] = type === 'input' ? $input(id) : type === 'select' ? $select(id) : $(id);
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
