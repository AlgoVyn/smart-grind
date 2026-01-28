// --- STATE MANAGEMENT MODULE ---
// Centralized state management for the application

import { User, Problem, UIState } from './types.js';
import { data } from './data.js';

/**
 * Interface for DOM element cache
 */
interface ElementCache {
    setupModal: HTMLElement | null;
    addProblemModal: HTMLElement | null;
    signinModal: HTMLElement | null;
    signinModalContent: HTMLElement | null;
    alertModal: HTMLElement | null;
    confirmModal: HTMLElement | null;
    alertMessage: HTMLElement | null;
    confirmMessage: HTMLElement | null;
    alertTitle: HTMLElement | null;
    confirmTitle: HTMLElement | null;
    alertOkBtn: HTMLElement | null;
    confirmOkBtn: HTMLElement | null;
    confirmCancelBtn: HTMLElement | null;
    appWrapper: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    googleLoginBtn: HTMLElement | null;
    modalGoogleLoginBtn: HTMLElement | null;
    setupError: HTMLElement | null;
    signinError: HTMLElement | null;
    topicList: HTMLElement | null;
    problemsContainer: HTMLElement | null;
    mobileMenuBtn: HTMLElement | null;
    openAddModalBtn: HTMLElement | null;
    cancelAddBtn: HTMLElement | null;
    saveAddBtn: HTMLElement | null;
    addProbName: HTMLInputElement | null;
    addProbUrl: HTMLInputElement | null;
    addProbCategory: HTMLSelectElement | null;
    addProbCategoryNew: HTMLInputElement | null;
    addProbPattern: HTMLSelectElement | null;
    addProbPatternNew: HTMLInputElement | null;
    sidebarSolvedText: HTMLElement | null;
    sidebarSolvedBar: HTMLElement | null;
    mainTotalText: HTMLElement | null;
    mainSolvedText: HTMLElement | null;
    mainSolvedBar: HTMLElement | null;
    mainDueText: HTMLElement | null;
    mainDueBadge: HTMLElement | null;
    currentFilterDisplay: HTMLElement | null;
    contentScroll: HTMLElement | null;
    emptyState: HTMLElement | null;
    currentViewTitle: HTMLElement | null;
    filterBtns: NodeListOf<Element>;
    reviewBanner: HTMLElement | null;
    reviewCountBanner: HTMLElement | null;
    toastContainer: HTMLElement | null;
    userDisplay: HTMLElement | null;
    disconnectBtn: HTMLElement | null;
    themeToggleBtn: HTMLElement | null;
    problemSearch: HTMLInputElement | null;
    mainSidebar: HTMLElement | null;
    sidebarResizer: HTMLElement | null;
    sidebarBackdrop: HTMLElement | null;
    mobileMenuBtnMain: HTMLElement | null;
    scrollToTopBtn: HTMLElement | null;
    sidebarLogo: HTMLElement | null;
    mobileLogo: HTMLElement | null;
    solutionModal: HTMLElement | null;
    solutionCloseBtn: HTMLElement | null;
    headerDisconnectBtn: HTMLElement | null;
}

export const state = {
    // User state
    user: {
        type: 'local', // 'local' or 'signed-in'
        id: null,
        displayName: 'Local User',
    } as User,

    // Problem data
    problems: new Map<string, Problem>(),
    deletedProblemIds: new Set<string>(),

    // UI state
    ui: {
        activeTopicId: 'all',
        currentFilter: 'all',
        searchQuery: '',
        preferredAI: localStorage.getItem('preferred-ai') || null,
    } as UIState,

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
            const problemsData = localStorage.getItem(data.LOCAL_STORAGE_KEYS.PROBLEMS);
            const deletedIdsData = localStorage.getItem(data.LOCAL_STORAGE_KEYS.DELETED_IDS);
            const displayName =
                localStorage.getItem(data.LOCAL_STORAGE_KEYS.DISPLAY_NAME) || 'Local User';
            const userType = localStorage.getItem(data.LOCAL_STORAGE_KEYS.USER_TYPE) || 'local';

            // Safe JSON parsing with validation
            const safeJsonParse = <T>(data: string | null, defaultValue: T): T => {
                try {
                    return data ? JSON.parse(data) : defaultValue;
                } catch (e) {
                    console.error('JSON parse error:', e);
                    return defaultValue;
                }
            };

            const problemsObj = safeJsonParse<Record<string, Problem>>(problemsData, {});
            const deletedIdsArr = safeJsonParse<string[]>(deletedIdsData, []);

            this.problems = new Map(Object.entries(problemsObj));
            // Reset loading state for all problems on load
            this.problems.forEach((p: Problem) => (p.loading = false));
            this.deletedProblemIds = new Set(deletedIdsArr);
            this.user.displayName = displayName;
            this.user.type = userType as 'local' | 'signed-in';
        } catch (e) {
            console.error('Error loading state from storage:', e);
        }
    },

    // Save state to localStorage
    saveToStorage(): void {
        try {
            // Exclude loading state's temporary
            const problemsWithoutLoading = Object.fromEntries(
                Array.from(this.problems.entries() as IterableIterator<[string, Problem]>).map(
                    ([id, p]) => {
                        const { loading: _loading, ...rest } = p;
                        return [id, rest];
                    }
                )
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
        this.elements = {
            setupModal: document.getElementById('setup-modal'),
            addProblemModal: document.getElementById('add-problem-modal'),
            signinModal: document.getElementById('signin-modal'),
            signinModalContent: document.getElementById('signin-modal-content'),
            alertModal: document.getElementById('alert-modal'),
            confirmModal: document.getElementById('confirm-modal'),
            alertMessage: document.getElementById('alert-message'),
            confirmMessage: document.getElementById('confirm-message'),
            alertTitle: document.getElementById('alert-title'),
            confirmTitle: document.getElementById('confirm-title'),
            alertOkBtn: document.getElementById('alert-ok-btn'),
            confirmOkBtn: document.getElementById('confirm-ok-btn'),
            confirmCancelBtn: document.getElementById('confirm-cancel-btn'),
            appWrapper: document.getElementById('app-wrapper'),
            loadingScreen: document.getElementById('loading-screen'),
            googleLoginBtn: document.getElementById('google-login-button'),
            modalGoogleLoginBtn: document.getElementById('modal-google-login-button'),
            setupError: document.getElementById('setup-error'),
            signinError: document.getElementById('signin-error'),
            topicList: document.getElementById('topic-list'),
            problemsContainer: document.getElementById('problems-container'),
            mobileMenuBtn: document.getElementById('mobile-menu-btn'),

            // Add Modal
            openAddModalBtn: document.getElementById('open-add-modal-btn'),
            cancelAddBtn: document.getElementById('cancel-add-btn'),
            saveAddBtn: document.getElementById('save-add-btn'),
            addProbName: document.getElementById('add-prob-name') as HTMLInputElement | null,
            addProbUrl: document.getElementById('add-prob-url') as HTMLInputElement | null,
            addProbCategory: document.getElementById(
                'add-prob-category'
            ) as HTMLSelectElement | null,
            addProbCategoryNew: document.getElementById(
                'add-prob-category-new'
            ) as HTMLInputElement | null,
            addProbPattern: document.getElementById('add-prob-pattern') as HTMLSelectElement | null,
            addProbPatternNew: document.getElementById(
                'add-prob-pattern-new'
            ) as HTMLInputElement | null,

            // Sidebar Stats
            sidebarSolvedText: document.getElementById('sidebar-total-stat'),
            sidebarSolvedBar: document.getElementById('sidebar-total-bar'),

            // Main Dashboard Stats
            mainTotalText: document.getElementById('stat-total'),
            mainSolvedText: document.getElementById('stat-solved'),
            mainSolvedBar: document.getElementById('progress-bar-solved'),
            mainDueText: document.getElementById('stat-due'),
            mainDueBadge: document.getElementById('stat-due-badge'),
            currentFilterDisplay: document.getElementById('current-filter-display'),

            contentScroll: document.getElementById('content-scroll'),
            emptyState: document.getElementById('empty-state'),
            currentViewTitle: document.getElementById('current-view-title'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            reviewBanner: document.getElementById('review-banner'),
            reviewCountBanner: document.getElementById('review-count-banner'),
            toastContainer: document.getElementById('toast-container'),
            userDisplay: document.getElementById('user-display'),
            disconnectBtn: document.getElementById('disconnect-btn'),
            themeToggleBtn: document.getElementById('theme-toggle-btn'),
            problemSearch: document.getElementById('problem-search') as HTMLInputElement | null,
            mainSidebar: document.getElementById('main-sidebar'),
            sidebarResizer: document.getElementById('sidebar-resizer'),
            sidebarBackdrop: document.getElementById('sidebar-backdrop'),
            mobileMenuBtnMain: document.getElementById('mobile-menu-btn-main'),
            scrollToTopBtn: document.getElementById('scroll-to-top-btn'),
            sidebarLogo: document.getElementById('sidebar-logo'),
            mobileLogo: document.getElementById('mobile-logo'),

            // Solution Modal
            solutionModal: document.getElementById('solution-modal'),
            solutionCloseBtn: document.getElementById('solution-close-btn'),

            headerDisconnectBtn: document.getElementById('header-disconnect-btn'),
        };
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
};
