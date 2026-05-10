// --- DOM UTILITIES ---
// Pure DOM helpers with no application dependencies.
// Safe to import from any module (breaks circular dependency with state.ts).

/** Hide an element by adding the 'hidden' class. */
export const hideEl = (el: HTMLElement | null | undefined): void => el?.classList.add('hidden');

/** Show an element by removing the 'hidden' class. */
export const showEl = (el: HTMLElement | null | undefined): void => el?.classList.remove('hidden');

/** Toggle the 'hidden' class: shown when `visible` is true. */
export const toggleEl = (el: HTMLElement | null | undefined, visible: boolean): void => {
    if (el) el.classList.toggle('hidden', !visible);
};

// ============================================================================
// ELEMENT CACHE TYPE & UTILITIES
// ============================================================================

export interface ElementCache {
    setupModal: HTMLElement | null;
    addProblemModal: HTMLElement | null;
    signinModal: HTMLElement | null;
    signinModalContent: HTMLElement | null;
    alertModal: HTMLElement | null;
    confirmModal: HTMLElement | null;
    solutionModal: HTMLElement | null;
    alertMessage: HTMLElement | null;
    confirmMessage: HTMLElement | null;
    alertTitle: HTMLElement | null;
    confirmTitle: HTMLElement | null;
    alertOkBtn: HTMLElement | null;
    confirmOkBtn: HTMLElement | null;
    confirmCancelBtn: HTMLElement | null;
    solutionCloseBtn: HTMLElement | null;
    appWrapper: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    topicList: HTMLElement | null;
    problemsContainer: HTMLElement | null;
    contentScroll: HTMLElement | null;
    emptyState: HTMLElement | null;
    currentViewTitle: HTMLElement | null;
    googleLoginButton: HTMLElement | null;
    modalGoogleLoginButton: HTMLElement | null;
    setupError: HTMLElement | null;
    signinError: HTMLElement | null;
    userDisplay: HTMLElement | null;
    disconnectBtn: HTMLElement | null;
    sidebarTotalStat: HTMLElement | null;
    sidebarTotalBar: HTMLElement | null;
    statTotal: HTMLElement | null;
    statSolved: HTMLElement | null;
    progressBarSolved: HTMLElement | null;
    statDue: HTMLElement | null;
    statDueBadge: HTMLElement | null;
    reviewBanner: HTMLElement | null;
    reviewCountBanner: HTMLElement | null;
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
    dateFilterContainer: HTMLElement | null;
    toastContainer: HTMLElement | null;
    addProbName: HTMLInputElement | null;
    addProbUrl: HTMLInputElement | null;
    addProbCategoryNew: HTMLInputElement | null;
    addProbPatternNew: HTMLInputElement | null;
    problemSearch: HTMLInputElement | null;
    addProbCategory: HTMLSelectElement | null;
    addProbPattern: HTMLSelectElement | null;
    reviewDateFilter: HTMLSelectElement | null;
    filterBtns: NodeListOf<Element> | null;
    [key: string]: HTMLElement | HTMLInputElement | HTMLSelectElement | NodeListOf<Element> | null;
}

const ELEMENT_IDS: (keyof ElementCache)[] = [
    'setupModal',
    'addProblemModal',
    'signinModal',
    'signinModalContent',
    'alertModal',
    'confirmModal',
    'solutionModal',
    'alertMessage',
    'confirmMessage',
    'alertTitle',
    'confirmTitle',
    'alertOkBtn',
    'confirmOkBtn',
    'confirmCancelBtn',
    'solutionCloseBtn',
    'appWrapper',
    'loadingScreen',
    'topicList',
    'problemsContainer',
    'contentScroll',
    'emptyState',
    'currentViewTitle',
    'googleLoginButton',
    'modalGoogleLoginButton',
    'setupError',
    'signinError',
    'userDisplay',
    'disconnectBtn',
    'sidebarTotalStat',
    'sidebarTotalBar',
    'statTotal',
    'statSolved',
    'progressBarSolved',
    'statDue',
    'statDueBadge',
    'reviewBanner',
    'reviewCountBanner',
    'mobileMenuBtn',
    'mobileMenuBtnMain',
    'openAddModalBtn',
    'cancelAddBtn',
    'saveAddBtn',
    'themeToggleBtn',
    'scrollToTopBtn',
    'sidebarLogo',
    'mobileLogo',
    'mainSidebar',
    'sidebarResizer',
    'sidebarBackdrop',
    'dateFilterContainer',
    'toastContainer',
    'addProbName',
    'addProbUrl',
    'addProbCategoryNew',
    'addProbPatternNew',
    'problemSearch',
    'addProbCategory',
    'addProbPattern',
    'reviewDateFilter',
];

const toKebab = (str: string): string => str.replace(/([A-Z])/g, '-$1').toLowerCase();

export const cacheElements = (): Partial<ElementCache> => {
    const elements: Partial<ElementCache> = {};
    ELEMENT_IDS.forEach((id) => {
        (elements as Record<string, HTMLElement | null>)[id as string] = document.getElementById(
            toKebab(id as string)
        );
    });
    (elements as Record<string, NodeListOf<Element> | null>)['filterBtns'] =
        document.querySelectorAll('.filter-btn');
    return elements;
};

export const getElement = <T extends HTMLElement>(id: string): T | null =>
    document.getElementById(id.includes('-') ? id : toKebab(id)) as T | null;
