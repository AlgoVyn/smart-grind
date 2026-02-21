// Mock dependencies before importing the module
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockClassListAdd = jest.fn();
const mockClassListRemove = jest.fn();
const mockClassListToggle = jest.fn();
const mockClassListContains = jest.fn();
const mockStyle = {};
const mockDisabled = false;
const mockValue = '';
const mockFocus = jest.fn();
const mockClick = jest.fn();
const mockScrollTop = 0;
const mockOffsetWidth = 200;
const mockExecCommand = jest.fn();
const mockToggle = jest.fn();
const mockOpen = jest.fn();

// Mock element factory
const createMockElement = (overrides = {}) => {
    const eventListeners = {};
    return {
        addEventListener: jest.fn((event, handler) => {
            if (!eventListeners[event]) eventListeners[event] = [];
            eventListeners[event].push(handler);
            mockAddEventListener(event, handler);
        }),
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: (event) => {
            const handlers = eventListeners[event.type] || [];
            handlers.forEach((handler) => handler(event));
        },
        closest: jest.fn(),
        classList: {
            add: mockClassListAdd,
            remove: mockClassListRemove,
            toggle: mockClassListToggle,
            contains: mockClassListContains,
        },
        innerHTML: '',
        innerText: '',
        style: { ...mockStyle },
        disabled: mockDisabled,
        value: mockValue,
        focus: mockFocus,
        click: mockClick,
        scrollTop: mockScrollTop,
        offsetWidth: mockOffsetWidth,
        textContent: '',
        nextElementSibling: null,
        dataset: {},
        querySelectorAll: jest.fn(() => []),
        ...overrides,
    };
};

// Create mock elements
const mockElement = createMockElement();

// Create mock elements for specific IDs
const mockAppWrapper = createMockElement({ style: {} });
const mockMainSidebar = createMockElement({ offsetWidth: 200, style: {} });

// Spy on document.getElementById
const getElementByIdSpy = jest.spyOn(document, 'getElementById');
getElementByIdSpy.mockImplementation((id) => {
    if (id === 'app-wrapper') return mockAppWrapper;
    if (id === 'main-sidebar') return mockMainSidebar;
    return mockElement;
});

// Mock document methods
document.createElement = mockCreateElement;
document.execCommand = mockExecCommand;
document.body.appendChild = mockAppendChild;
document.body.removeChild = jest.fn();
document.body.classList = {
    add: mockClassListAdd,
    remove: mockClassListRemove,
};
document.documentElement.classList = {
    toggle: mockToggle,
};

// Mock window.open
window.open = mockOpen;

// Mock URL
global.URL = {
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn(),
};

// Mock localStorage - use jest.fn() for proper mocking
const localStorageGetItem = jest.fn();
const localStorageSetItem = jest.fn();
const localStorageRemoveItem = jest.fn();

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: localStorageGetItem,
        setItem: localStorageSetItem,
        removeItem: localStorageRemoveItem,
    },
    writable: true,
});

// Mock sessionStorage - use jest.fn() for proper mocking
const sessionStorageGetItem = jest.fn();
const sessionStorageSetItem = jest.fn();
const sessionStorageRemoveItem = jest.fn();

Object.defineProperty(window, 'sessionStorage', {
    value: {
        getItem: sessionStorageGetItem,
        setItem: sessionStorageSetItem,
        removeItem: sessionStorageRemoveItem,
    },
    writable: true,
});

// Mock SmartGrind namespace before importing modules
window.SmartGrind = {
    state: {
        init: jest.fn(() => {}),
        user: {},
        ui: {},
        elements: {},
        problems: new Map(),
        deletedProblemIds: new Set(),
    },
    data: { LOCAL_STORAGE_KEYS: { USER_TYPE: 'userType' } },
    utils: {},
    api: {
        loadData: jest.fn(() => {}),
    },
    app: {
        initializeLocalUser: jest.fn(() => {}),
    },
    renderers: {},
};

jest.mock('../src/sw-auth-storage', () => ({
    storeTokenForServiceWorker: jest.fn().mockResolvedValue(undefined),
    clearTokenForServiceWorker: jest.fn().mockResolvedValue(undefined),
}));

// Now import the module
import { ui } from '../src/ui/ui';
import { state } from '../src/state';
import { data } from '../src/data';
import { utils } from '../src/utils';
import { api } from '../src/api';
import { app } from '../src/app';
import { renderers } from '../src/renderers';

describe('SmartGrind UI', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Reset mockElement state
        mockElement.innerHTML = '';
        mockElement.value = '';
        mockElement.textContent = '';
        mockStyle.width = '';
        mockStyle.transform = '';
        mockClassListContains.mockReturnValue(true);
        mockMainSidebar.style.width = '';

        // Reset spy implementations
        getElementByIdSpy.mockImplementation((id) => {
            if (id === 'app-wrapper') return mockAppWrapper;
            if (id === 'main-sidebar') return mockMainSidebar;
            return mockElement;
        });

        // Mock createElement to return mockElement
        mockCreateElement.mockReturnValue(mockElement);

        // Do NOT mock openSigninModal and showAlert - we want to test the actual implementations
        // ui.openSigninModal = jest.fn();
        // ui.showAlert = jest.fn();

        // Set up SmartGrind state and data
        state.init = jest.fn();
        state.user = {
            type: 'local',
            id: null,
            displayName: 'Local User',
        };
        state.ui = {
            activeTopicId: 'all',
        };
        state.elements = {
            googleLoginBtn: mockElement,
            modalGoogleLoginBtn: mockElement,
            signinModal: mockElement,
            signinModalContent: mockElement,
            alertModal: mockElement,
            alertOkBtn: mockElement,
            confirmModal: mockElement,
            confirmOkBtn: mockElement,
            confirmCancelBtn: mockElement,
            disconnectBtn: mockElement,
            openAddModalBtn: mockElement,
            cancelAddBtn: mockElement,
            saveAddBtn: mockElement,
            addProbName: mockElement,
            addProbUrl: mockElement,
            addProbCategory: mockElement,
            addProbCategoryNew: mockElement,
            addProbPattern: mockElement,
            addProbPatternNew: mockElement,
            addProblemModal: mockElement,
            filterBtns: [mockElement],
            problemSearch: mockElement,
            themeToggleBtn: mockElement,
            mobileMenuBtn: mockElement,
            mobileMenuBtnMain: mockElement,
            sidebarBackdrop: mockElement,
            sidebarLogo: mockElement,
            mobileLogo: mockElement,
            contentScroll: mockElement,
            scrollToTopBtn: mockElement,
            setupModal: mockElement,
            setupError: mockElement,
            signinError: mockElement,
            appWrapper: mockElement,
            loadingScreen: mockElement,
            userDisplay: mockElement,
            alertMessage: mockElement,
            confirmMessage: createMockElement(),
            alertTitle: mockElement,
            confirmTitle: createMockElement(),
            mainSidebar: mockElement,
            sidebarResizer: mockElement,
            headerDisconnectBtn: mockElement,
            topicList: mockElement,
            problemsContainer: mockElement,
        };
        state.problems = new Map();
        state.deletedProblemIds = new Set();

        data.topicsData = [{ id: 'arrays', title: 'Arrays' }];
        data.LOCAL_STORAGE_KEYS = { USER_TYPE: 'userType' };
        data.resetTopicsData = jest.fn();
        // Mock URL constructor and methods for tests
        const URLConstructor = class URL {
            constructor(url) {
                if (
                    !url ||
                    typeof url !== 'string' ||
                    (!url.startsWith('http://') && !url.startsWith('https://'))
                ) {
                    throw new Error('Invalid URL');
                }
                this.href = url;
            }
        };

        // Add static methods to the constructor
        URLConstructor.createObjectURL = jest.fn(() => 'mock-url');
        URLConstructor.revokeObjectURL = jest.fn();

        window.URL = URLConstructor;

        utils = {
            showToast: jest.fn(),
            updateUrlParameter: jest.fn(),
            scrollToTop: jest.fn(),
            getUrlParameter: jest.fn(),
            getBaseUrl: jest.fn(() => '/smartgrind/'),
            sanitizeInput: (input) => {
                if (!input) return '';
                let sanitized = input.trim();
                sanitized = sanitized.replace(/<[^>]*>/g, '');
                sanitized = sanitized.replace(/["'\\]/g, '');
                sanitized = sanitized.replace(/javascript:/gi, '');
                sanitized = sanitized.replace(/on\w+\s*=/gi, '');
                if (sanitized.length > 200) {
                    sanitized = sanitized.substring(0, 200);
                }
                return sanitized;
            },
            sanitizeUrl: (url) => {
                if (!url) return '';
                let sanitized = url.trim();
                try {
                    // If it doesn't start with http:// or https://, prepend https://
                    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
                        sanitized = 'https://' + sanitized;
                    }

                    // Create URL object to validate
                    new URL(sanitized);

                    // Remove any script-related content from URL
                    sanitized = sanitized.replace(/javascript:/gi, '');
                    sanitized = sanitized.replace(/data:/gi, '');

                    // Limit URL length
                    if (sanitized.length > 500) {
                        sanitized = sanitized.substring(0, 500);
                    }

                    return sanitized;
                } catch (_e) {
                    // If URL parsing fails, return empty string
                    return '';
                }
            },
        };
        api = {
            loadData: jest.fn(),
            deleteCategory: jest.fn(),
            saveProblem: jest.fn(),
            mergeStructure: jest.fn(),
            syncPlan: jest.fn(),
        };
        app = {
            initializeLocalUser: jest.fn(() => {
                state.user.type = 'local';
                localStorage.setItem('userType', 'local');
                data.resetTopicsData();
                api.syncPlan();
                api.mergeStructure();
                renderers.renderSidebar();
                renderers.renderMainView('all');
                renderers.updateStats();
                ui.updateAuthUI();
            }),
            exportProgress: jest.fn(() => {
                const exportData = {
                    exportDate: new Date().toISOString(),
                    version: '1.0',
                    problems: Object.fromEntries(state.problems),
                    deletedIds: Array.from(state.deletedProblemIds),
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                    type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `smartgrind-progress-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                utils.showToast('Progress exported successfully!', 'success');
            }),
        };
        renderers = {
            renderSidebar: jest.fn(),
            renderMainView: jest.fn(),
            setActiveTopic: jest.fn(),
            updateFilterBtns: jest.fn(),
            updateStats: jest.fn(),
            handleProblemCardClick: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        test('initializes UI components', async () => {
            renderers.updateFilterBtns = jest.fn();

            await ui.init();

            // state.init() is called once from ui.ts before init(); not from ui.init()
            expect(renderers.updateFilterBtns).toHaveBeenCalled();
        });
    });

    describe('pullToRefresh', () => {
        test('handles touch start when at top', () => {
            // Mock sidebar not open
            state.elements.mainSidebar.classList.contains = jest.fn(() => false);

            // Mock modals as hidden
            const hiddenModal = createMockElement();
            hiddenModal.classList.contains = jest.fn(() => true); // contains 'hidden' returns true
            state.elements.setupModal = hiddenModal;
            state.elements.addProblemModal = hiddenModal;
            state.elements.signinModal = hiddenModal;
            state.elements.alertModal = hiddenModal;
            state.elements.confirmModal = hiddenModal;
            state.elements.solutionModal = hiddenModal;

            const event = {
                touches: [{ clientY: 100 }],
                preventDefault: jest.fn(),
            };

            ui.pullToRefresh.handleTouchStart(event);

            expect(ui.pullToRefresh.startY).toBe(100);
            expect(ui.pullToRefresh.isPulling).toBe(true);
        });

        test('handles touch move with pull down', () => {
            ui.pullToRefresh.isPulling = true;
            ui.pullToRefresh.startY = 50;

            const event = {
                touches: [{ clientY: 100 }],
                preventDefault: jest.fn(),
            };

            ui.pullToRefresh.handleTouchMove(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        test('handles touch end with sufficient pull', () => {
            ui.pullToRefresh.isPulling = true;
            ui.pullToRefresh.startY = 0;

            const event = {
                changedTouches: [{ clientY: 150 }],
            };

            ui.pullToRefresh.handleTouchEnd(event);

            // The code calls window.location.reload(), which is mocked by jest-environment-jsdom
            // We just verify the isPulling is reset
            expect(ui.pullToRefresh.isPulling).toBe(false);
        });

        test('handles mouse down when at top', () => {
            // Mock sidebar not open
            state.elements.mainSidebar.classList.contains = jest.fn(() => false);

            // Mock modals as hidden
            const hiddenModal = createMockElement();
            hiddenModal.classList.contains = jest.fn(() => true); // contains 'hidden' returns true
            state.elements.setupModal = hiddenModal;
            state.elements.addProblemModal = hiddenModal;
            state.elements.signinModal = hiddenModal;
            state.elements.alertModal = hiddenModal;
            state.elements.confirmModal = hiddenModal;
            state.elements.solutionModal = hiddenModal;

            const event = {
                button: 0,
                clientY: 100,
                preventDefault: jest.fn(),
            };

            ui.pullToRefresh.handleMouseDown(event);

            expect(ui.pullToRefresh.startY).toBe(100);
            expect(ui.pullToRefresh.isMousePulling).toBe(true);
        });

        test('handles mouse move with pull down', () => {
            ui.pullToRefresh.isMousePulling = true;
            ui.pullToRefresh.startY = 50;

            const event = {
                clientY: 100,
                preventDefault: jest.fn(),
            };

            ui.pullToRefresh.handleMouseMove(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        test('handles mouse end with sufficient pull', () => {
            ui.pullToRefresh.isMousePulling = true;
            ui.pullToRefresh.startY = 0;

            const event = {
                clientY: 150,
            };

            ui.pullToRefresh.handleMouseEnd(event);

            // We just verify the isPulling is reset
            expect(ui.pullToRefresh.isMousePulling).toBe(false);
        });

        test('handles mouse leave when pulling', () => {
            ui.pullToRefresh.isMousePulling = true;

            ui.pullToRefresh.handleMouseLeave();

            expect(ui.pullToRefresh.isMousePulling).toBe(false);
        });
    });

    describe('sidebarResizer', () => {
        test('starts resize on mousedown', () => {
            const event = {
                preventDefault: jest.fn(),
                clientX: 100,
            };

            ui.sidebarResizer.startResize(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(ui.sidebarResizer.isResizing).toBe(true);
        });

        test('resizes sidebar', () => {
            ui.sidebarResizer.isResizing = true;
            ui.sidebarResizer.startX = 50;
            ui.sidebarResizer.startWidth = 200;

            const event = {
                preventDefault: jest.fn(),
                clientX: 100,
            };

            ui.sidebarResizer.resize(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        test('stops resize', () => {
            ui.sidebarResizer.isResizing = true;

            ui.sidebarResizer.stopResize();

            expect(ui.sidebarResizer.isResizing).toBe(false);
            expect(localStorageSetItem).toHaveBeenCalledWith('sidebarWidth', expect.any(String));
        });

        test('loads width from localStorage', () => {
            localStorageGetItem.mockReturnValue('300');

            ui.sidebarResizer.loadWidth();

            expect(mockMainSidebar.style.width).toBe('300px');
        });

        test('does not load width when no saved width', () => {
            localStorageGetItem.mockReturnValue(null);

            ui.sidebarResizer.loadWidth();

            expect(mockMainSidebar.style.width).toBe('');
        });

        test('resize does nothing when not resizing', () => {
            ui.sidebarResizer.isResizing = false;

            const event = {
                preventDefault: jest.fn(),
                clientX: 100,
            };

            ui.sidebarResizer.resize(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        test('stopResize does nothing when not resizing', () => {
            ui.sidebarResizer.isResizing = false;

            ui.sidebarResizer.stopResize();

            expect(localStorageSetItem).not.toHaveBeenCalled();
        });
    });

    describe('handleGoogleLogin', () => {
        test('opens popup and handles auth success', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            mockOpen.mockReturnValue({});

            ui.handleGoogleLogin();

            expect(mockOpen).toHaveBeenCalledWith(
                '/smartgrind/api/auth?action=login',
                'auth',
                'width=500,height=600'
            );
            expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
            addEventListenerSpy.mockRestore();
        });

        test('ignores messages with non-auth-success type', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            mockOpen.mockReturnValue({});

            ui.handleGoogleLogin();

            const messageEvent = {
                origin: window.location.origin,
                data: { type: 'other-type' },
            };

            const messageHandler = addEventListenerSpy.mock.calls.find(
                (call) => call[0] === 'message'
            )[1];
            messageHandler(messageEvent);

            expect(localStorageSetItem).not.toHaveBeenCalledWith('userId', expect.any(String));

            addEventListenerSpy.mockRestore();
        });
    });

    describe('setButtonLoading', () => {
        test('sets loading state on button', () => {
            const button = mockElement;

            ui.setButtonLoading(button, true, 'Loading...');

            expect(button.disabled).toBe(true);
            expect(button.innerHTML).toBe('Loading...');
        });

        test('resets loading state on button', () => {
            const button = mockElement;

            ui.setButtonLoading(button, false);

            expect(button.disabled).toBe(false);
            expect(button.innerHTML).toContain('Sign in with Google');
        });

        test('does nothing when button is null', () => {
            const originalDisabled = mockElement.disabled;
            ui.setButtonLoading(null, true);

            expect(mockElement.disabled).toBe(originalDisabled);
        });
    });

    describe('handleLogout', () => {
        test('switches to local mode for signed-in users', async () => {
            state.user.type = 'signed-in';

            await ui.handleLogout();

            expect(state.user.type).toBe('local');
            expect(app.initializeLocalUser).toHaveBeenCalled();
            expect(utils.showToast).toHaveBeenCalledWith('Switched to local mode');
        });

        test('opens signin modal for local users', () => {
            // Import openSigninModal directly and spy on it
            const { openSigninModal: _openSigninModal } = require('../src/ui/ui-modals');
            const openSigninModalSpy = jest.spyOn(
                require('../src/ui/ui-modals'),
                'openSigninModal'
            );

            ui.handleLogout();

            expect(openSigninModalSpy).toHaveBeenCalled();
        });
    });

    describe('openAddModal', () => {
        test('populates category dropdown and clears inputs', () => {
            // The code sets innerHTML on addProbCategory element
            state.elements.addProbCategory = createMockElement();

            ui.openAddModal();

            // The actual dropdown content in the code
            expect(state.elements.addProbCategory.innerHTML).toContain('-- Select or Type New --');
            expect(state.elements.addProbCategory.value).toBe('');
        });
    });

    describe('saveNewProblem', () => {
        test('saves new problem when all fields filled', async () => {
            // Create separate mock elements for each field with proper mock structure
            const nameEl = {
                value: 'Test Problem',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const urlEl = {
                value: 'https://example.com',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const categoryEl = {
                value: 'Arrays',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const patternEl = {
                value: 'Two Sum',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const categoryNewEl = {
                value: '',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const patternNewEl = {
                value: '',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const problemModalEl = {
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };

            state.elements.addProbName = nameEl;
            state.elements.addProbUrl = urlEl;
            state.elements.addProbCategory = categoryEl;
            state.elements.addProbPattern = patternEl;
            state.elements.addProbCategoryNew = categoryNewEl;
            state.elements.addProbPatternNew = patternNewEl;
            state.elements.addProblemModal = problemModalEl;

            await ui.saveNewProblem();

            expect(api.saveProblem).toHaveBeenCalled();
            expect(renderers.renderSidebar).toHaveBeenCalled();
            expect(utils.showToast).toHaveBeenCalledWith('Problem added!');
        });

        test('does not save problem when fields are missing', async () => {
            // Mock the input fields to have empty name
            state.elements.addProbName = { value: '' };
            state.elements.addProbUrl = { value: 'https://example.com' };
            state.elements.addProbCategory = { value: 'Arrays' };
            state.elements.addProbPattern = { value: 'Two Sum' };
            state.elements.addProbCategoryNew = { value: '' };
            state.elements.addProbPatternNew = { value: '' };

            // Call the private functions directly
            const uiModals = require('../src/ui/ui-modals');
            const inputs = uiModals._getSanitizedInputs();
            const isValid = uiModals._validateInputs(inputs);

            // Verify validation fails
            expect(isValid).toBe(false);
        });

        test('debug saveNewProblem function call', async () => {
            // Create separate mock elements for each field with proper mock structure
            const nameEl = {
                value: 'Test Problem',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const urlEl = {
                value: 'https://example.com',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const categoryEl = {
                value: 'Arrays',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const patternEl = {
                value: 'Two Sum',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const categoryNewEl = {
                value: '',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const patternNewEl = {
                value: '',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const problemModalEl = {
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };

            state.elements.addProbName = nameEl;
            state.elements.addProbUrl = urlEl;
            state.elements.addProbCategory = categoryEl;
            state.elements.addProbPattern = patternEl;
            state.elements.addProbCategoryNew = categoryNewEl;
            state.elements.addProbPatternNew = patternNewEl;
            state.elements.addProblemModal = problemModalEl;

            // Spy on the sanitization functions and API calls to see what they return
            const sanitizeInputSpy = jest.spyOn(utils, 'sanitizeInput');
            const sanitizeUrlSpy = jest.spyOn(utils, 'sanitizeUrl');
            const apiSaveSpy = jest.spyOn(api, 'saveProblem');
            const showAlertSpy = jest.spyOn(ui, 'showAlert');

            await ui.saveNewProblem();

            sanitizeInputSpy.mockRestore();
            sanitizeUrlSpy.mockRestore();
            apiSaveSpy.mockRestore();
            showAlertSpy.mockRestore();
        });

        test('saves new problem with custom pattern when category selected but pattern not', async () => {
            const nameEl = {
                value: 'Test Problem',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const urlEl = {
                value: 'https://example.com',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const categoryEl = {
                value: 'Arrays',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const patternEl = {
                value: '',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const patternNewEl = {
                value: 'Custom Pattern',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const problemModalEl = {
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };

            state.elements.addProbName = nameEl;
            state.elements.addProbUrl = urlEl;
            state.elements.addProbCategory = categoryEl;
            state.elements.addProbPattern = patternEl;
            state.elements.addProbPatternNew = patternNewEl;
            state.elements.addProblemModal = problemModalEl;

            await ui.saveNewProblem();

            expect(api.saveProblem).toHaveBeenCalled();
            const savedProblem = api.saveProblem.mock.calls[0][0];
            expect(savedProblem.pattern).toBe('Custom Pattern');
        });
    });

    describe('toggleTheme', () => {
        test('toggles dark class and saves to localStorage', () => {
            document.documentElement.classList.toggle = mockToggle;

            ui.toggleTheme();

            expect(mockToggle).toHaveBeenCalledWith('dark');
            expect(localStorageSetItem).toHaveBeenCalledWith('theme', expect.any(String));
        });
    });

    describe('toggleMobileMenu', () => {
        test('opens mobile menu when closed', () => {
            state.elements.mainSidebar.classList.contains = jest.fn(() => false);

            ui.toggleMobileMenu();

            // isOpen=false means menu is closed, so we open it
            // toggle('translate-x-0', !isOpen=true) adds the class
            // toggle('-translate-x-full', isOpen=false) removes the class
            expect(mockClassListToggle).toHaveBeenCalledWith('translate-x-0', true);
            expect(mockClassListToggle).toHaveBeenCalledWith('-translate-x-full', false);
            expect(document.body.style.overflow).toBe('hidden');
        });

        test('closes mobile menu when open', () => {
            state.elements.mainSidebar.classList.contains = jest.fn(() => true);

            ui.toggleMobileMenu();

            // isOpen=true means menu is open, so we close it
            // toggle('translate-x-0', !isOpen=false) removes the class
            // toggle('-translate-x-full', isOpen=true) adds the class
            expect(mockClassListToggle).toHaveBeenCalledWith('translate-x-0', false);
            expect(mockClassListToggle).toHaveBeenCalledWith('-translate-x-full', true);
            expect(document.body.style.overflow).toBe('');
        });
    });

    describe('updateAuthUI', () => {
        test('updates disconnect button for local user', () => {
            state.user.type = 'local';

            ui.updateAuthUI();

            expect(mockElement.innerHTML).toContain('Sign In');
            expect(mockElement.title).toContain('Sign in to sync');
        });

        test('updates disconnect button for signed-in user', () => {
            state.user.type = 'signed-in';

            ui.updateAuthUI();

            expect(mockElement.innerHTML).toContain('Sign Out');
            expect(mockElement.title).toContain('Sign out');
        });
    });

    describe('showConfirm', () => {
        test('shows confirm modal and returns promise', async () => {
            const promise = ui.showConfirm('Test message');

            expect(state.elements.confirmMessage.innerHTML).toBe('Test message');
            expect(state.elements.confirmTitle.textContent).toBe('Confirm Action');
            expect(mockClassListRemove).toHaveBeenCalledWith('hidden');

            // Simulate OK click
            ui.closeConfirmModal(true);
            const result = await promise;
            expect(result).toBe(true);
        });

        test('showConfirm resolves with false on cancel', async () => {
            const promise = ui.showConfirm('Test message');

            expect(state.elements.confirmMessage.innerHTML).toBe('Test message');
            expect(state.elements.confirmTitle.textContent).toBe('Confirm Action');
            expect(mockClassListRemove).toHaveBeenCalledWith('hidden');

            // Simulate Cancel click
            ui.closeConfirmModal(false);
            const result = await promise;
            expect(result).toBe(false);
        });

        test('allows HTML formatting tags in message', async () => {
            const promise = ui.showConfirm('<b>Bold</b> and <i>italic</i> text');

            expect(state.elements.confirmMessage.innerHTML).toBe(
                '<b>Bold</b> and <i>italic</i> text'
            );

            ui.closeConfirmModal(true);
            await promise;
        });
    });

    describe('handleKeyboard', () => {
        test('focuses search on "/" key', () => {
            const event = {
                key: '/',
                target: { tagName: 'DIV' },
                preventDefault: jest.fn(),
            };

            ui.handleKeyboard(event);

            expect(mockFocus).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });

        test('exports progress on "e" key', () => {
            const event = {
                key: 'e',
                target: { tagName: 'DIV' },
                preventDefault: jest.fn(),
            };

            ui.handleKeyboard(event);

            expect(app.exportProgress).toHaveBeenCalled();
        });
    });

    describe('createModalHandler', () => {
        test('creates modal close handler', () => {
            const closeCallback = jest.fn();
            const handler = ui.createModalHandler(mockElement, null, closeCallback);

            const event = { target: mockElement };

            handler(event);

            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
            expect(closeCallback).toHaveBeenCalled();
        });

        test('does not close if clicking content', () => {
            const contentEl = { ...mockElement };
            const handler = ui.createModalHandler(mockElement, contentEl);

            const event = { target: contentEl, stopPropagation: jest.fn() };

            handler(event);

            expect(event.stopPropagation).toHaveBeenCalled();
            expect(mockClassListAdd).not.toHaveBeenCalled();
        });

        test('closes modal when clicking outside content', () => {
            jest.clearAllMocks();
            const contentEl = { ...mockElement };
            const handler = ui.createModalHandler(mockElement, contentEl);

            const event = { target: mockElement, stopPropagation: jest.fn() };

            handler(event);

            expect(event.stopPropagation).not.toHaveBeenCalled();
            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
        });

        test('handles null event', () => {
            const handler = ui.createModalHandler(mockElement, null, jest.fn());

            handler(null);

            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
        });

        test('handles modal click without content element', () => {
            const handler = ui.createModalHandler(mockElement, null);

            const event = { target: mockElement };

            handler(event);

            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
        });
    });

    describe('closeSigninModal', () => {
        test('closes signin modal', () => {
            ui.closeSigninModal();

            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
        });
    });

    describe('closeAddModal', () => {
        test('closes add problem modal', () => {
            ui.closeAddModal();

            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
        });
    });

    describe('showAlert', () => {
        test('shows alert modal with message', () => {
            // Create a mock element that allows textContent and innerHTML to be set
            const alertMessageEl = {
                textContent: '',
                innerHTML: '',
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            const alertModalEl = {
                classList: {
                    add: mockClassListAdd,
                    remove: mockClassListRemove,
                    toggle: mockClassListToggle,
                    contains: mockClassListContains,
                },
            };
            state.elements.alertMessage = alertMessageEl;
            state.elements.alertModal = alertModalEl;

            ui.showAlert('Test message');

            expect(alertMessageEl.textContent).toBe('Test message');
            expect(state.elements.alertTitle.textContent).toBe('Alert');
            expect(mockClassListRemove).toHaveBeenCalledWith('hidden');
        });
    });

    describe('closeAlertModal', () => {
        test('closes alert modal', () => {
            ui.closeAlertModal();

            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
        });
    });

    describe('handleCategoryChange', () => {
        test('updates pattern dropdown when category selected', () => {
            data.topicsData = [
                {
                    title: 'Arrays',
                    patterns: [{ name: 'Two Sum' }],
                },
            ];
            const event = { target: { value: 'Arrays' } };

            ui.handleCategoryChange(event);

            // _toggleElementVisibility uses toggle('hidden', hide)
            // When category is selected (val='Arrays'), categoryNewEl is hidden (hide=true)
            expect(mockClassListToggle).toHaveBeenCalledWith('hidden', true);
            expect(mockElement.innerHTML).toContain('Two Sum');
        });

        test('shows new category input when custom selected', () => {
            const event = { target: { value: '' } };

            ui.handleCategoryChange(event);

            // When category is empty (val=''), categoryNewEl is shown (hide=false)
            expect(mockClassListToggle).toHaveBeenCalledWith('hidden', false);
        });
    });

    describe('handlePatternChange', () => {
        test('hides new pattern input when pattern selected', () => {
            const event = { target: { value: 'Two Sum' } };

            ui.handlePatternChange(event);

            // When pattern is selected, patternNewEl is hidden (hide=true)
            expect(mockClassListToggle).toHaveBeenCalledWith('hidden', true);
        });

        test('shows new pattern input when custom selected', () => {
            const event = { target: { value: '' } };

            ui.handlePatternChange(event);

            // When pattern is empty, patternNewEl is shown (hide=false)
            expect(mockClassListToggle).toHaveBeenCalledWith('hidden', false);
        });
    });

    describe('loadDefaultView', () => {
        test('loads default view and closes mobile menu', () => {
            // Simulate mobile width to trigger mobile menu toggle
            const originalInnerWidth = window.innerWidth;
            window.innerWidth = 375;
            state.elements.mainSidebar.classList.contains = jest.fn(() => true);

            ui.loadDefaultView();

            expect(renderers.setActiveTopic).toHaveBeenCalledWith('all');
            expect(utils.updateUrlParameter).toHaveBeenCalledWith('category', null);
            expect(renderers.renderMainView).toHaveBeenCalledWith('all');
            expect(utils.scrollToTop).toHaveBeenCalled();
            // toggleMobileMenu is called which uses toggle, not remove
            expect(mockClassListToggle).toHaveBeenCalledWith('translate-x-0', false);

            // Reset innerWidth
            window.innerWidth = originalInnerWidth;
        });

        test('loads default view without closing mobile menu on desktop', () => {
            // Simulate desktop width
            const originalInnerWidth = window.innerWidth;
            window.innerWidth = 1024;

            ui.loadDefaultView();

            expect(renderers.setActiveTopic).toHaveBeenCalledWith('all');
            expect(utils.updateUrlParameter).toHaveBeenCalledWith('category', null);
            expect(renderers.renderMainView).toHaveBeenCalledWith('all');
            expect(utils.scrollToTop).toHaveBeenCalled();
            // On desktop, toggleMobileMenu is not called
            expect(mockClassListToggle).not.toHaveBeenCalledWith('translate-x-0', false);

            // Reset innerWidth
            window.innerWidth = originalInnerWidth;
        });
    });

    describe('initScrollButton', () => {
        test('adds scroll event listener', () => {
            ui.initScrollButton();

            expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
        });
    });

    describe('handlePopState', () => {
        test('handles category from URL', () => {
            utils.getUrlParameter = jest.fn(() => 'arrays');
            data.topicsData = [{ id: 'arrays' }];

            ui.handlePopState();

            expect(state.ui.activeTopicId).toBe('arrays');
            expect(renderers.renderSidebar).toHaveBeenCalled();
            expect(renderers.renderMainView).toHaveBeenCalled();
        });

        test('defaults to all when no category', () => {
            utils.getUrlParameter = jest.fn(() => null);

            ui.handlePopState();

            expect(state.ui.activeTopicId).toBe('all');
        });
    });

    describe('showError', () => {
        test('shows error message', () => {
            ui.showError('Test error');

            expect(mockClassListToggle).toHaveBeenCalledWith('hidden', false);
            expect(mockElement.innerText).toBe('Test error');
        });

        test('hides error when no message', () => {
            ui.showError(null);

            expect(mockClassListToggle).toHaveBeenCalledWith('hidden', true);
        });
    });

    describe('showSigninError', () => {
        test('shows signin error message', () => {
            ui.showSigninError('Signin error');

            expect(mockClassListToggle).toHaveBeenCalledWith('hidden', false);
            expect(mockElement.innerText).toBe('Signin error');
        });
    });

    describe('pullToRefresh edge cases', () => {
        test('handleTouchStart does not start pulling when not at top', () => {
            window.scrollY = 100;
            state.elements.contentScroll.scrollTop = 0;

            const event = {
                touches: [{ clientY: 100 }],
            };

            ui.pullToRefresh.handleTouchStart(event);

            expect(ui.pullToRefresh.isPulling).toBe(false);
        });

        test('handleTouchStart does not start pulling when sidebar is open', () => {
            window.scrollY = 0;
            state.elements.contentScroll.scrollTop = 0;
            state.elements.mainSidebar.classList.contains = jest.fn(() => true);

            const event = {
                touches: [{ clientY: 100 }],
            };

            ui.pullToRefresh.handleTouchStart(event);

            expect(ui.pullToRefresh.isPulling).toBe(false);
        });

        test('handleTouchStart does not start pulling when modal is open', () => {
            window.scrollY = 0;
            state.elements.contentScroll.scrollTop = 0;
            state.elements.mainSidebar.classList.contains = jest.fn(() => false);
            const openModal = createMockElement();
            openModal.classList.contains = jest.fn(() => false); // not hidden
            state.elements.setupModal = openModal;

            const event = {
                touches: [{ clientY: 100 }],
            };

            ui.pullToRefresh.handleTouchStart(event);

            expect(ui.pullToRefresh.isPulling).toBe(false);
        });

        test('handleTouchMove does nothing when not pulling', () => {
            ui.pullToRefresh.isPulling = false;

            const event = {
                touches: [{ clientY: 100 }],
                preventDefault: jest.fn(),
            };

            ui.pullToRefresh.handleTouchMove(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        test('handleTouchMove stops pulling when deltaY <= 0', () => {
            ui.pullToRefresh.isPulling = true;
            ui.pullToRefresh.startY = 50;

            const event = {
                touches: [{ clientY: 40 }],
                preventDefault: jest.fn(),
            };

            ui.pullToRefresh.handleTouchMove(event);

            expect(ui.pullToRefresh.isPulling).toBe(false);
            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        test('handleTouchEnd does nothing when not pulling', () => {
            ui.pullToRefresh.isPulling = false;

            const event = {
                changedTouches: [{ clientY: 100 }],
            };

            ui.pullToRefresh.handleTouchEnd(event);

            expect(ui.pullToRefresh.isPulling).toBe(false);
        });

        test('handleTouchEnd does not reload when deltaY below threshold', () => {
            ui.pullToRefresh.isPulling = true;
            ui.pullToRefresh.startY = 0;

            const event = {
                changedTouches: [{ clientY: 50 }],
            };

            ui.pullToRefresh.handleTouchEnd(event);

            expect(ui.pullToRefresh.isPulling).toBe(false);
        });

        test('handleMouseDown does not start pulling when not at top', () => {
            window.scrollY = 100;
            state.elements.contentScroll.scrollTop = 0;

            const event = {
                button: 0,
                clientY: 100,
            };

            ui.pullToRefresh.handleMouseDown(event);

            expect(ui.pullToRefresh.isMousePulling).toBe(false);
        });

        test('handleMouseDown does not start pulling when sidebar is open', () => {
            window.scrollY = 0;
            state.elements.contentScroll.scrollTop = 0;
            state.elements.mainSidebar.classList.contains = jest.fn(() => true);

            const event = {
                button: 0,
                clientY: 100,
            };

            ui.pullToRefresh.handleMouseDown(event);

            expect(ui.pullToRefresh.isMousePulling).toBe(false);
        });

        test('handleMouseDown does not start pulling when modal is open', () => {
            window.scrollY = 0;
            state.elements.contentScroll.scrollTop = 0;
            state.elements.mainSidebar.classList.contains = jest.fn(() => false);
            const openModal = createMockElement();
            openModal.classList.contains = jest.fn(() => false); // not hidden
            state.elements.setupModal = openModal;

            const event = {
                button: 0,
                clientY: 100,
            };

            ui.pullToRefresh.handleMouseDown(event);

            expect(ui.pullToRefresh.isMousePulling).toBe(false);
        });

        test('handleMouseDown ignores non-left button', () => {
            const event = {
                button: 1,
                clientY: 100,
            };

            ui.pullToRefresh.handleMouseDown(event);

            expect(ui.pullToRefresh.isMousePulling).toBe(false);
        });

        test('handleMouseMove does nothing when not pulling', () => {
            ui.pullToRefresh.isMousePulling = false;

            const event = {
                clientY: 100,
                preventDefault: jest.fn(),
            };

            ui.pullToRefresh.handleMouseMove(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        test('handleMouseMove stops pulling when deltaY <= 0', () => {
            ui.pullToRefresh.isMousePulling = true;
            ui.pullToRefresh.startY = 50;

            const event = {
                clientY: 40,
                preventDefault: jest.fn(),
            };

            ui.pullToRefresh.handleMouseMove(event);

            expect(ui.pullToRefresh.isMousePulling).toBe(false);
            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        test('handleMouseEnd does nothing when not pulling', () => {
            ui.pullToRefresh.isMousePulling = false;

            const event = {
                clientY: 150,
            };

            ui.pullToRefresh.handleMouseEnd(event);

            expect(ui.pullToRefresh.isMousePulling).toBe(false);
        });

        test('handleMouseEnd does not reload when deltaY below threshold', () => {
            ui.pullToRefresh.isMousePulling = true;
            ui.pullToRefresh.startY = 0;

            const event = {
                clientY: 50,
            };

            ui.pullToRefresh.handleMouseEnd(event);

            expect(ui.pullToRefresh.isMousePulling).toBe(false);
        });
    });

    describe('handleKeyboard edge cases', () => {
        test('handles Escape key in input field', () => {
            const event = {
                key: 'Escape',
                target: { tagName: 'INPUT' },
                preventDefault: jest.fn(),
            };

            ui.handleKeyboard(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        test('handles uppercase E key', () => {
            const event = {
                key: 'E',
                target: { tagName: 'DIV' },
                preventDefault: jest.fn(),
            };

            ui.handleKeyboard(event);

            expect(app.exportProgress).toHaveBeenCalled();
        });

        test('ignores unknown keys', () => {
            const event = {
                key: 'X',
                target: { tagName: 'DIV' },
                preventDefault: jest.fn(),
            };

            ui.handleKeyboard(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        test('handles textarea input', () => {
            const event = {
                key: '/',
                target: { tagName: 'TEXTAREA' },
                preventDefault: jest.fn(),
            };

            ui.handleKeyboard(event);

            expect(event.preventDefault).not.toHaveBeenCalled();
        });
    });

    describe('handleCategoryChange edge cases', () => {
        test('handles category change when topic not found', () => {
            data.topicsData = [];

            const event = { target: { value: 'NonExistent' } };

            ui.handleCategoryChange(event);

            expect(mockElement.innerHTML).toBe('<option value="">-- No Patterns Found --</option>');
        });
    });

    describe('initScrollButton scroll behavior', () => {
        test('shows scroll button when scrolled past threshold', () => {
            ui.initScrollButton();
            state.elements.contentScroll.scrollTop = 400;

            // Trigger the scroll event listener
            const scrollEvent = new Event('scroll');
            state.elements.contentScroll.dispatchEvent(scrollEvent);

            expect(mockClassListRemove).toHaveBeenCalledWith(
                'opacity-0',
                'translate-y-4',
                'pointer-events-none'
            );
        });

        test('hides scroll button when scrolled above threshold', () => {
            ui.initScrollButton();
            state.elements.contentScroll.scrollTop = 200;

            const scrollEvent = new Event('scroll');
            state.elements.contentScroll.dispatchEvent(scrollEvent);

            expect(mockClassListAdd).toHaveBeenCalledWith(
                'opacity-0',
                'translate-y-4',
                'pointer-events-none'
            );
        });

        test('initScrollButton does nothing when elements are null', () => {
            state.elements.contentScroll = null;
            state.elements.scrollToTopBtn = null;

            ui.initScrollButton();

            expect(mockAddEventListener).not.toHaveBeenCalled();
        });
    });

    describe('app', () => {
        describe('initializeLocalUser', () => {
            test('initializes local user correctly', () => {
                // Create a mock for updateAuthUI
                const originalUpdateAuthUI = ui.updateAuthUI;
                const updateAuthUISpy = jest.fn();
                ui.updateAuthUI = updateAuthUISpy;

                app.initializeLocalUser();

                expect(state.user.type).toBe('local');
                expect(localStorageSetItem).toHaveBeenCalledWith('userType', 'local');
                expect(data.resetTopicsData).toHaveBeenCalled();
                expect(api.syncPlan).toHaveBeenCalled();
                expect(api.mergeStructure).toHaveBeenCalled();
                expect(renderers.renderSidebar).toHaveBeenCalled();
                expect(renderers.renderMainView).toHaveBeenCalledWith('all');
                expect(renderers.updateStats).toHaveBeenCalled();
                expect(updateAuthUISpy).toHaveBeenCalled();

                // Restore the original updateAuthUI
                ui.updateAuthUI = originalUpdateAuthUI;
            });
        });

        describe('exportProgress', () => {
            test('exports progress data', () => {
                const createElementSpy = jest.spyOn(document, 'createElement');
                const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
                const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');

                app.exportProgress();

                expect(createElementSpy).toHaveBeenCalledWith('a');
                expect(createObjectURLSpy).toHaveBeenCalled();
                expect(mockClick).toHaveBeenCalled();
                expect(revokeObjectURLSpy).toHaveBeenCalled();
                expect(utils.showToast).toHaveBeenCalledWith(
                    'Progress exported successfully!',
                    'success'
                );

                createElementSpy.mockRestore();
                createObjectURLSpy.mockRestore();
                revokeObjectURLSpy.mockRestore();
            });
        });
    });

    describe('bindEvents event delegation', () => {
        test('closes sidebar on mobile topic click', () => {
            jest.clearAllMocks();
            ui.bindEvents();
            window.innerWidth = 375; // Mobile width
            state.elements.mainSidebar.classList.contains = jest.fn(() => false);
            const link = {
                classList: { contains: () => true },
                closest: jest.fn((selector) => {
                    if (selector === 'button' || selector === 'button[data-action]') return null;

                    if (selector === '.sidebar-link') return link;

                    return null;
                }),
            };
            const event = {
                type: 'click',
                target: link,
                stopPropagation: jest.fn(),
            };

            state.elements.topicList.dispatchEvent(event);

            // toggleMobileMenu is called which uses toggle
            expect(mockClassListToggle).toHaveBeenCalledWith('translate-x-0', true);
        });

        test('handles problem card button click', () => {
            ui.bindEvents();
            const button = {
                dataAction: 'some-action',
                closest: jest.fn((selector) => {
                    if (selector === 'button[data-action]') return button;

                    if (selector === '.group') return card;

                    return null;
                }),
            };
            const card = {
                dataset: { problemId: 'test-problem' },
                closest: jest.fn((selector) => (selector === '.group' ? card : null)),
            };
            const event = {
                type: 'click',
                target: button,
                stopPropagation: jest.fn(),
            };

            state.problems.set('test-problem', { id: 'test-problem' });

            state.elements.problemsContainer.dispatchEvent(event);

            expect(renderers.handleProblemCardClick).toHaveBeenCalled();
        });

        test('handles problem card click when button not found', () => {
            ui.bindEvents();
            const event = {
                type: 'click',
                target: document.body,
                stopPropagation: jest.fn(),
            };

            state.elements.problemsContainer.dispatchEvent(event);

            expect(renderers.handleProblemCardClick).not.toHaveBeenCalled();
        });

        test('handles problem card click when card not found', () => {
            ui.bindEvents();
            const button = { dataAction: 'some-action', closest: jest.fn((_selector) => null) };
            const event = {
                type: 'click',
                target: button,
                stopPropagation: jest.fn(),
            };

            state.elements.problemsContainer.dispatchEvent(event);

            expect(renderers.handleProblemCardClick).not.toHaveBeenCalled();
        });

        test('handles problem card click when problemId not found', () => {
            ui.bindEvents();
            const card = {
                dataset: {},
                closest: jest.fn((selector) => (selector === '.group' ? card : null)),
            };
            const button = {
                dataAction: 'some-action',
                closest: jest.fn((selector) => {
                    if (selector === 'button[data-action]') return button;
                    if (selector === '.group') return card;
                    return null;
                }),
            };
            const event = {
                type: 'click',
                target: button,
                stopPropagation: jest.fn(),
            };

            state.elements.problemsContainer.dispatchEvent(event);

            expect(renderers.handleProblemCardClick).not.toHaveBeenCalled();
        });

        test('handles problem card click when problem not found in state', () => {
            ui.bindEvents();
            const card = {
                dataset: { problemId: 'nonexistent' },
                closest: jest.fn((selector) => (selector === '.group' ? card : null)),
            };
            const button = {
                dataAction: 'some-action',
                closest: jest.fn((selector) => {
                    if (selector === 'button[data-action]') return button;
                    if (selector === '.group') return card;
                    return null;
                }),
            };
            const event = {
                type: 'click',
                target: button,
                stopPropagation: jest.fn(),
            };

            state.elements.problemsContainer.dispatchEvent(event);

            expect(renderers.handleProblemCardClick).not.toHaveBeenCalled();
        });
    });

    describe('handleGoogleLogin message handling', () => {
        test('handles auth success message', async () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            mockOpen.mockReturnValue({});

            ui.handleGoogleLogin();

            const messageEvent = {
                origin: window.location.origin,
                data: {
                    type: 'auth-success',
                    token: 'test-token',
                    userId: 'test-user',
                    displayName: 'Test User',
                },
            };

            const messageHandler = addEventListenerSpy.mock.calls.find(
                (call) => call[0] === 'message'
            )[1];
            const result = messageHandler(messageEvent);
            if (result && typeof (result as Promise<unknown>).then === 'function') {
                await result;
            }

            expect(localStorageSetItem).toHaveBeenCalledWith('userId', 'test-user');
            expect(localStorageSetItem).toHaveBeenCalledWith('displayName', 'Test User');
            expect(localStorageSetItem).toHaveBeenCalledWith('smartgrind-user-type', 'signed-in');
            expect(state.user.id).toBe('test-user');
            expect(state.user.displayName).toBe('Test User');
            expect(api.loadData).toHaveBeenCalled();

            addEventListenerSpy.mockRestore();
        });

        test('ignores messages from wrong origin', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            mockOpen.mockReturnValue({});

            ui.handleGoogleLogin();

            const messageEvent = {
                origin: 'wrong-origin',
                data: { type: 'auth-success' },
            };

            const messageHandler = addEventListenerSpy.mock.calls.find(
                (call) => call[0] === 'message'
            )[1];
            messageHandler(messageEvent);

            expect(localStorageSetItem).not.toHaveBeenCalledWith('token', expect.any(String));

            addEventListenerSpy.mockRestore();
        });
    });

    describe('markdown renderer functions', () => {
        test('_configureMarkdownRenderer returns null when marked undefined', () => {
            const originalMarked = window.marked;
            delete window.marked;

            const result = ui._configureMarkdownRenderer();

            expect(result).toBeNull();

            window.marked = originalMarked;
        });

        test('_configureMarkdownRenderer configures marked when available', () => {
            const mockMarked = {
                setOptions: jest.fn(),
                Renderer: jest.fn(() => ({
                    code: jest.fn(),
                })),
            };
            window.marked = mockMarked;

            const result = ui._configureMarkdownRenderer();

            expect(mockMarked.setOptions).toHaveBeenCalledWith({
                breaks: true,
                gfm: true,
            });
            expect(result).toBe(mockMarked);

            delete window.marked;
        });

        test('_renderMarkdown renders content', () => {
            const mockMarked = {
                setOptions: jest.fn(),
                parse: jest.fn(() => '<p>rendered</p>'),
                Renderer: jest.fn(() => ({ code: jest.fn() })),
            };
            window.marked = mockMarked;
            window.Prism = { highlightAllUnder: jest.fn() };

            const contentElement = { innerHTML: '' };
            ui._renderMarkdown('markdown', contentElement);

            expect(mockMarked.setOptions).toHaveBeenCalledWith({
                breaks: true,
                gfm: true,
            });
            expect(mockMarked.parse).toHaveBeenCalledWith('markdown');
            expect(contentElement.innerHTML).toBe('<p>rendered</p>');
            expect(window.Prism.highlightAllUnder).toHaveBeenCalledWith(contentElement);

            delete window.marked;
            delete window.Prism;
        });

        test('_renderMarkdown shows error when marked not loaded', () => {
            delete window.marked;

            const contentElement = { innerHTML: '' };
            ui._renderMarkdown('markdown', contentElement);

            expect(contentElement.innerHTML).toContain('Error: Markdown renderer not loaded');

            window.marked = { parse: jest.fn(() => '<p>test</p>') };
        });

        test('copyCode copies code to clipboard', async () => {
            const mockPre = {
                querySelector: jest.fn(() => ({ innerText: 'code content' })),
            };
            const mockBtn = {
                classList: { add: jest.fn(), remove: jest.fn() },
                innerHTML: '',
                closest: jest.fn(() => mockPre),
            };
            navigator.clipboard = { writeText: jest.fn(() => Promise.resolve()) };

            await ui.copyCode(mockBtn);

            expect(mockBtn.closest).toHaveBeenCalledWith('pre');
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('code content');
            expect(mockBtn.classList.add).toHaveBeenCalledWith('copied');
        });

        test('copyCode shows toast on failure', async () => {
            const mockPre = {
                querySelector: jest.fn(() => ({ innerText: 'code content' })),
            };
            const mockBtn = {
                classList: { add: jest.fn(), remove: jest.fn() },
                innerHTML: '',
                closest: jest.fn(() => mockPre),
            };
            navigator.clipboard = { writeText: jest.fn(() => Promise.reject(new Error('fail'))) };

            const showToastSpy = jest.spyOn(utils, 'showToast');

            await ui.copyCode(mockBtn);
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(showToastSpy).toHaveBeenCalledWith('Failed to copy code');

            showToastSpy.mockRestore();
        });

        test('openSolutionModal loads and renders solution', async () => {
            const mockModal = { classList: { remove: jest.fn() } };
            const mockContent = createMockElement({ innerHTML: '' });
            getElementByIdSpy.mockImplementation((id) => {
                if (id === 'solution-modal') return mockModal;
                if (id === 'solution-content') return mockContent;
                return mockElement;
            });

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    text: () => Promise.resolve('# Solution'),
                })
            );

            window.marked = {
                setOptions: jest.fn(),
                parse: jest.fn(() => '<h1>Solution</h1>'),
                Renderer: jest.fn(() => ({ code: jest.fn() })),
            };
            window.Prism = { highlightAllUnder: jest.fn() };

            await ui.openSolutionModal('test-problem');
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockModal.classList.remove).toHaveBeenCalledWith('hidden');
            expect(mockContent.innerHTML).toBe('<h1>Solution</h1>');

            delete global.fetch;
            delete window.marked;
            delete window.Prism;
        });

        test('openSolutionModal shows error on fetch failure', async () => {
            const mockModal = { classList: { remove: jest.fn() } };
            const mockContent = { innerHTML: '' };
            getElementByIdSpy.mockImplementation((id) => {
                if (id === 'solution-modal') return mockModal;
                if (id === 'solution-content') return mockContent;
                return mockElement;
            });

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 404,
                })
            );

            await ui.openSolutionModal('test-problem');
            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(mockContent.innerHTML).toContain('Error loading solution');

            delete global.fetch;
        });

        test('closeSolutionModal hides modal', () => {
            const mockModal = { classList: { add: jest.fn() } };
            const mockContent = createMockElement();
            const mockProgressBar = createMockElement();
            getElementByIdSpy.mockImplementation((id) => {
                if (id === 'solution-modal') return mockModal;
                if (id === 'solution-content') return mockContent;
                if (id === 'solution-scroll-progress') return mockProgressBar;
                return mockElement;
            });

            ui.closeSolutionModal();

            expect(mockModal.classList.add).toHaveBeenCalledWith('hidden');
        });
    });

    describe('filter button click', () => {
        test('handles filter button click', () => {
            const btn = {
                dataset: { filter: 'solved' },
                addEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            };
            state.elements.filterBtns = [btn];

            ui.bindNavigationEvents();

            // Get the click handler
            const clickHandler = btn.addEventListener.mock.calls.find(
                (call) => call[0] === 'click'
            )[1];

            // Simulate click
            clickHandler();

            expect(state.ui.currentFilter).toBe('solved');
            expect(renderers.updateFilterBtns).toHaveBeenCalled();
            expect(renderers.renderMainView).toHaveBeenCalledWith(state.ui.activeTopicId);
        });
    });

    describe('handleKeyboard edge cases', () => {
        test('closes add problem modal on Escape', () => {
            jest.clearAllMocks();
            state.elements.addProblemModal = {
                classList: { contains: jest.fn(() => true), add: jest.fn() },
            };
            const event = {
                key: 'Escape',
                target: { tagName: 'DIV' },
                preventDefault: jest.fn(),
            };

            ui.handleKeyboard(event);

            expect(state.elements.addProblemModal.classList.add).not.toHaveBeenCalled();
        });
    });

    describe('pullToRefresh handleTouchEnd reload', () => {
        test('resets pulling state when threshold met and not in test env', () => {
            // Temporarily mock jest as undefined to simulate production
            const originalJest = global.jest;
            delete global.jest;

            ui.pullToRefresh.isPulling = true;
            ui.pullToRefresh.startY = 0;

            const event = {
                changedTouches: [{ clientY: 150 }],
            };

            ui.pullToRefresh.handleTouchEnd(event);

            expect(ui.pullToRefresh.isPulling).toBe(false);

            // Restore
            global.jest = originalJest;
        });
    });

    describe('bindModalEvents close callbacks', () => {
        test('confirm modal close callback calls closeConfirmModal', () => {
            ui.bindModalEvents();

            // The handler is attached to confirmModal
            const handler = state.elements.confirmModal.addEventListener.mock.calls[0][1];
            const event = { target: state.elements.confirmModal };

            handler(event);

            expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
        });
    });

    describe('handleGoogleLogin timeout', () => {
        test('resets buttons after timeout', () => {
            const { UI_CONSTANTS } = require('../src/ui/ui-constants');
            const _uiAuthModule = require('../src/ui/ui-auth');
            jest.useFakeTimers();
            const setButtonLoadingSpy = jest.spyOn(ui, 'setButtonLoading');
            setButtonLoadingSpy.mockImplementation(() => {});
            const mockPopup = { closed: false, close: jest.fn() };
            mockOpen.mockReturnValue(mockPopup);

            // Mock utils.showToast to prevent DOM operations
            const utilsModule = require('../src/utils');
            jest.spyOn(utilsModule.utils, 'showToast').mockImplementation(() => {});

            // Call handleGoogleLogin to start the timeout
            ui.handleGoogleLogin();

            jest.advanceTimersByTime(UI_CONSTANTS.AUTH_TIMEOUT);

            expect(setButtonLoadingSpy).toHaveBeenCalledWith(expect.anything(), false);
            expect(mockPopup.close).toHaveBeenCalled();

            setButtonLoadingSpy.mockRestore();
            jest.useRealTimers();
        });
    });

    describe('handleGoogleLogin popup blocked', () => {
        test('shows toast when popup is blocked', () => {
            mockOpen.mockReturnValue(null);
            const showToastSpy = jest.spyOn(utils, 'showToast');
            const setButtonLoadingSpy = jest.spyOn(ui, 'setButtonLoading');
            setButtonLoadingSpy.mockImplementation(() => {});

            ui.handleGoogleLogin();

            expect(showToastSpy).toHaveBeenCalledWith(
                'Sign-in popup was blocked. Please allow popups for this site and try again.',
                'error'
            );
            expect(setButtonLoadingSpy).toHaveBeenCalledWith(state.elements.googleLoginBtn, false);
            expect(setButtonLoadingSpy).toHaveBeenCalledWith(
                state.elements.modalGoogleLoginBtn,
                false
            );

            showToastSpy.mockRestore();
            setButtonLoadingSpy.mockRestore();
        });
    });

    describe('handleGoogleLogin auth-failure message', () => {
        test('handles auth-failure message', () => {
            jest.useFakeTimers();
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            mockOpen.mockReturnValue({});
            const showToastSpy = jest.spyOn(utils, 'showToast');
            const setButtonLoadingSpy = jest.spyOn(ui, 'setButtonLoading');
            setButtonLoadingSpy.mockImplementation(() => {});

            ui.handleGoogleLogin();

            const messageEvent = {
                origin: window.location.origin,
                data: {
                    type: 'auth-failure',
                    message: 'Test failure message',
                },
            };

            const messageHandler = addEventListenerSpy.mock.calls.find(
                (call) => call[0] === 'message'
            )[1];
            messageHandler(messageEvent);

            // Advance timers to execute setTimeout
            jest.advanceTimersByTime(100);

            expect(showToastSpy).toHaveBeenCalledWith(
                'Sign-in failed: Test failure message',
                'error'
            );
            expect(setButtonLoadingSpy).toHaveBeenCalledWith(state.elements.googleLoginBtn, false);
            expect(setButtonLoadingSpy).toHaveBeenCalledWith(
                state.elements.modalGoogleLoginBtn,
                false
            );

            addEventListenerSpy.mockRestore();
            showToastSpy.mockRestore();
            setButtonLoadingSpy.mockRestore();
            jest.useRealTimers();
        });
    });

    describe('handleGoogleLogin popup closed', () => {
        test('resets buttons immediately when popup is closed without auth', () => {
            jest.useFakeTimers();
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            const mockPopup = { closed: false, close: jest.fn() };
            mockOpen.mockReturnValue(mockPopup);
            const showToastSpy = jest.spyOn(utils, 'showToast');
            const setButtonLoadingSpy = jest.spyOn(ui, 'setButtonLoading');
            setButtonLoadingSpy.mockImplementation(() => {});

            ui.handleGoogleLogin();

            // Simulate popup closing - this should trigger immediate reset via interval check
            mockPopup.closed = true;
            // Advance timers to trigger the interval check
            jest.advanceTimersByTime(500);

            // Buttons should be reset immediately, no timeout toast
            expect(setButtonLoadingSpy).toHaveBeenCalledWith(state.elements.googleLoginBtn, false);
            expect(setButtonLoadingSpy).toHaveBeenCalledWith(
                state.elements.modalGoogleLoginBtn,
                false
            );
            // No timeout toast should be shown when popup is closed
            expect(showToastSpy).not.toHaveBeenCalledWith(
                'Sign-in timed out. Please try again.',
                'error'
            );

            addEventListenerSpy.mockRestore();
            showToastSpy.mockRestore();
            setButtonLoadingSpy.mockRestore();
            jest.useRealTimers();
        });
    });
});
