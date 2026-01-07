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
const mockWriteText = jest.fn();
const mockToggle = jest.fn();
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockOpen = jest.fn();

// Mock element factory
const createMockElement = (overrides = {}) => ({
  addEventListener: mockAddEventListener,
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
  ...overrides,
});

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
document.body.classList = {
  add: mockClassListAdd,
  remove: mockClassListRemove,
};
document.documentElement.classList = {
  toggle: mockToggle,
};

// Mock window.open
window.open = mockOpen;

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

// Now import the module
import ui from '../public/modules/ui.js';

window.SmartGrind.ui = ui;

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

    // Reset spy implementations
    getElementByIdSpy.mockImplementation((id) => {
      if (id === 'app-wrapper') return mockAppWrapper;
      if (id === 'main-sidebar') return mockMainSidebar;
      return mockElement;
    });

    // Mock createElement to return mockElement
    mockCreateElement.mockReturnValue(mockElement);

    // Do NOT mock openSigninModal and showAlert - we want to test the actual implementations
    // window.SmartGrind.ui.openSigninModal = jest.fn();
    // window.SmartGrind.ui.showAlert = jest.fn();

    // Set up SmartGrind state and data
    window.SmartGrind.state = {
      init: jest.fn(),
      user: {
        type: 'local',
        id: null,
        displayName: 'Local User',
      },
      ui: {},
      elements: {
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
        confirmMessage: mockElement,
        mainSidebar: mockElement,
        sidebarResizer: mockElement,
        headerDisconnectBtn: mockElement,
        topicList: mockElement,
      },
      problems: new Map(),
      deletedProblemIds: new Set(),
    };
    window.SmartGrind.data = {
      topicsData: [{ id: 'arrays', title: 'Arrays' }],
      LOCAL_STORAGE_KEYS: { USER_TYPE: 'userType' },
      resetTopicsData: jest.fn(),
    };
    window.SmartGrind.utils = {
      showToast: jest.fn(),
      updateUrlParameter: jest.fn(),
      scrollToTop: jest.fn(),
      getUrlParameter: jest.fn(),
    };
    window.SmartGrind.api = {
      loadData: jest.fn(),
      deleteCategory: jest.fn(),
      saveProblem: jest.fn(),
      mergeStructure: jest.fn(),
    };
    window.SmartGrind.app = {
      initializeLocalUser: jest.fn(),
      exportProgress: jest.fn(),
    };
    window.SmartGrind.renderers = {
      renderSidebar: jest.fn(),
      renderMainView: jest.fn(),
      setActiveTopic: jest.fn(),
      updateFilterBtns: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('init', () => {
    test('initializes UI components', () => {
      const stateInitSpy = jest.spyOn(window.SmartGrind.state, 'init');
      const bindEventsSpy = jest.spyOn(window.SmartGrind.ui, 'bindEvents');
      const initScrollButtonSpy = jest.spyOn(window.SmartGrind.ui, 'initScrollButton');
      const updateAuthUISpy = jest.spyOn(window.SmartGrind.ui, 'updateAuthUI');

      window.SmartGrind.ui.init();

      expect(stateInitSpy).toHaveBeenCalled();
      expect(bindEventsSpy).toHaveBeenCalled();
      expect(initScrollButtonSpy).toHaveBeenCalled();
      expect(updateAuthUISpy).toHaveBeenCalled();
      expect(window.SmartGrind.renderers.updateFilterBtns).toHaveBeenCalled();
    });
  });

  describe('pullToRefresh', () => {
    test('handles touch start when at top', () => {
      const event = {
        touches: [{ clientY: 100 }],
        preventDefault: jest.fn(),
      };

      window.SmartGrind.ui.pullToRefresh.handleTouchStart(event);

      expect(window.SmartGrind.ui.pullToRefresh.startY).toBe(100);
      expect(window.SmartGrind.ui.pullToRefresh.isPulling).toBe(true);
    });

    test('handles touch move with pull down', () => {
      window.SmartGrind.ui.pullToRefresh.isPulling = true;
      window.SmartGrind.ui.pullToRefresh.startY = 50;

      const event = {
        touches: [{ clientY: 100 }],
        preventDefault: jest.fn(),
      };

      window.SmartGrind.ui.pullToRefresh.handleTouchMove(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('handles touch end with sufficient pull', () => {
      window.SmartGrind.ui.pullToRefresh.isPulling = true;
      window.SmartGrind.ui.pullToRefresh.startY = 0;

      const event = {
        changedTouches: [{ clientY: 150 }],
      };

      window.SmartGrind.ui.pullToRefresh.handleTouchEnd(event);

      // The code calls window.location.reload(), which is mocked by jest-environment-jsdom
      // We just verify the isPulling is reset
      expect(window.SmartGrind.ui.pullToRefresh.isPulling).toBe(false);
    });
  });

  describe('sidebarResizer', () => {
    test('starts resize on mousedown', () => {
      const event = {
        preventDefault: jest.fn(),
        clientX: 100,
      };

      window.SmartGrind.ui.sidebarResizer.startResize(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(window.SmartGrind.ui.sidebarResizer.isResizing).toBe(true);
    });

    test('resizes sidebar', () => {
      window.SmartGrind.ui.sidebarResizer.isResizing = true;
      window.SmartGrind.ui.sidebarResizer.startX = 50;
      window.SmartGrind.ui.sidebarResizer.startWidth = 200;

      const event = {
        preventDefault: jest.fn(),
        clientX: 100,
      };

      window.SmartGrind.ui.sidebarResizer.resize(event);

      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('stops resize', () => {
      window.SmartGrind.ui.sidebarResizer.isResizing = true;

      window.SmartGrind.ui.sidebarResizer.stopResize();

      expect(window.SmartGrind.ui.sidebarResizer.isResizing).toBe(false);
      expect(localStorageSetItem).toHaveBeenCalledWith('sidebarWidth', expect.any(Number));
    });

    test('loads width from localStorage', () => {
      localStorageGetItem.mockReturnValue('300');

      window.SmartGrind.ui.sidebarResizer.loadWidth();

      expect(mockMainSidebar.style.width).toBe('300px');
    });
  });

  describe('handleGoogleLogin', () => {
    test('opens popup and handles auth success', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      mockOpen.mockReturnValue({});

      window.SmartGrind.ui.handleGoogleLogin();

      expect(mockOpen).toHaveBeenCalledWith('/smartgrind/api/auth?action=login', 'auth', 'width=500,height=600');
      expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
      addEventListenerSpy.mockRestore();
    });
  });

  describe('handleLogout', () => {
    test('switches to local mode for signed-in users', () => {
      window.SmartGrind.state.user.type = 'signed-in';

      window.SmartGrind.ui.handleLogout();

      expect(window.SmartGrind.state.user.type).toBe('local');
      expect(window.SmartGrind.app.initializeLocalUser).toHaveBeenCalled();
      expect(window.SmartGrind.utils.showToast).toHaveBeenCalledWith('Switched to local mode');
    });

    test('opens signin modal for local users', () => {
      window.SmartGrind.state.user.type = 'local';
      const openSigninModalSpy = jest.spyOn(window.SmartGrind.ui, 'openSigninModal');

      window.SmartGrind.ui.handleLogout();

      expect(openSigninModalSpy).toHaveBeenCalled();
      openSigninModalSpy.mockRestore();
    });
  });

  describe('openAddModal', () => {
    test('populates category dropdown and clears inputs', () => {
      // The code sets innerHTML on addProbCategory element
      window.SmartGrind.state.elements.addProbCategory = createMockElement();

      window.SmartGrind.ui.openAddModal();

      // The actual dropdown content in the code
      expect(window.SmartGrind.state.elements.addProbCategory.innerHTML).toContain('-- Select or Type New --');
      expect(window.SmartGrind.state.elements.addProbCategory.value).toBe('');
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
        }
      };
      const urlEl = {
        value: 'https://example.com',
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      const categoryEl = {
        value: 'Arrays',
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      const patternEl = {
        value: 'Two Sum',
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      const categoryNewEl = {
        value: '',
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      const patternNewEl = {
        value: '',
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      const problemModalEl = {
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      
      window.SmartGrind.state.elements.addProbName = nameEl;
      window.SmartGrind.state.elements.addProbUrl = urlEl;
      window.SmartGrind.state.elements.addProbCategory = categoryEl;
      window.SmartGrind.state.elements.addProbPattern = patternEl;
      window.SmartGrind.state.elements.addProbCategoryNew = categoryNewEl;
      window.SmartGrind.state.elements.addProbPatternNew = patternNewEl;
      window.SmartGrind.state.elements.addProblemModal = problemModalEl;

      await window.SmartGrind.ui.saveNewProblem();

      expect(window.SmartGrind.api.saveProblem).toHaveBeenCalled();
      expect(window.SmartGrind.renderers.renderSidebar).toHaveBeenCalled();
      expect(window.SmartGrind.utils.showToast).toHaveBeenCalledWith('Problem added!');
    });

    test('shows alert when fields are missing', () => {
      const nameEl = {
        value: '',
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      window.SmartGrind.state.elements.addProbName = nameEl;

      const showAlertSpy = jest.spyOn(window.SmartGrind.ui, 'showAlert');
      showAlertSpy.mockImplementation(() => {});

      window.SmartGrind.ui.saveNewProblem();

      expect(showAlertSpy).toHaveBeenCalledWith("Please fill in Name, URL, Category and Pattern.");
      showAlertSpy.mockRestore();
    });
  });

  describe('toggleTheme', () => {
    test('toggles dark class and saves to localStorage', () => {
      document.documentElement.classList.toggle = mockToggle;

      window.SmartGrind.ui.toggleTheme();

      expect(mockToggle).toHaveBeenCalledWith('dark');
      expect(localStorageSetItem).toHaveBeenCalledWith('theme', expect.any(String));
    });
  });

  describe('toggleMobileMenu', () => {
    test('opens mobile menu when closed', () => {
      mockClassListContains.mockReturnValue(false);

      window.SmartGrind.ui.toggleMobileMenu();

      expect(mockClassListAdd).toHaveBeenCalledWith('translate-x-0');
      expect(mockClassListRemove).toHaveBeenCalledWith('-translate-x-full');
      expect(document.body.style.overflow).toBe('hidden');
    });

    test('closes mobile menu when open', () => {
      mockClassListContains.mockReturnValue(true);

      window.SmartGrind.ui.toggleMobileMenu();

      expect(mockClassListRemove).toHaveBeenCalledWith('translate-x-0');
      expect(mockClassListAdd).toHaveBeenCalledWith('-translate-x-full');
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('updateAuthUI', () => {
    test('updates disconnect button for local user', () => {
      window.SmartGrind.state.user.type = 'local';

      window.SmartGrind.ui.updateAuthUI();

      expect(mockElement.innerHTML).toContain('Sign In');
      expect(mockElement.title).toContain('Sign in to sync');
    });

    test('updates disconnect button for signed-in user', () => {
      window.SmartGrind.state.user.type = 'signed-in';

      window.SmartGrind.ui.updateAuthUI();

      expect(mockElement.innerHTML).toContain('Sign Out');
      expect(mockElement.title).toContain('Sign out');
    });
  });

  describe('showConfirm', () => {
    test('shows confirm modal and returns promise', async () => {
      const promise = window.SmartGrind.ui.showConfirm('Test message');

      expect(mockElement.textContent).toBe('Test message');
      expect(mockClassListRemove).toHaveBeenCalledWith('hidden');

      // Simulate OK click
      window.SmartGrind.ui.closeConfirmModal(true);
      const result = await promise;
      expect(result).toBe(true);
    });
  });

  describe('handleKeyboard', () => {
    test('focuses search on "/" key', () => {
      const event = {
        key: '/',
        target: { tagName: 'DIV' },
        preventDefault: jest.fn(),
      };

      window.SmartGrind.ui.handleKeyboard(event);

      expect(mockFocus).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    test('exports progress on "e" key', () => {
      const event = {
        key: 'e',
        target: { tagName: 'DIV' },
        preventDefault: jest.fn(),
      };

      window.SmartGrind.ui.handleKeyboard(event);

      expect(window.SmartGrind.app.exportProgress).toHaveBeenCalled();
    });
  });

  describe('createModalHandler', () => {
    test('creates modal close handler', () => {
      const closeCallback = jest.fn();
      const handler = window.SmartGrind.ui.createModalHandler(mockElement, null, closeCallback);

      const event = { target: mockElement };

      handler(event);

      expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
      expect(closeCallback).toHaveBeenCalled();
    });

    test('does not close if clicking content', () => {
      const contentEl = { ...mockElement };
      const handler = window.SmartGrind.ui.createModalHandler(mockElement, contentEl);

      const event = { target: contentEl, stopPropagation: jest.fn() };

      handler(event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(mockClassListAdd).not.toHaveBeenCalled();
    });
  });

  describe('closeSigninModal', () => {
    test('closes signin modal', () => {
      window.SmartGrind.ui.closeSigninModal();

      expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
    });
  });

  describe('closeAddModal', () => {
    test('closes add problem modal', () => {
      window.SmartGrind.ui.closeAddModal();

      expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
    });
  });

  describe('showAlert', () => {
    test('shows alert modal with message', () => {
      // Create a mock element that allows textContent to be set
      const alertMessageEl = { 
        textContent: '',
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      const alertModalEl = {
        classList: {
          add: mockClassListAdd,
          remove: mockClassListRemove,
          toggle: mockClassListToggle,
          contains: mockClassListContains,
        }
      };
      window.SmartGrind.state.elements.alertMessage = alertMessageEl;
      window.SmartGrind.state.elements.alertModal = alertModalEl;

      window.SmartGrind.ui.showAlert('Test message');

      expect(alertMessageEl.textContent).toBe('Test message');
      expect(mockClassListRemove).toHaveBeenCalledWith('hidden');
    });
  });

  describe('closeAlertModal', () => {
    test('closes alert modal', () => {
      window.SmartGrind.ui.closeAlertModal();

      expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
    });
  });

  describe('handleCategoryChange', () => {
    test('updates pattern dropdown when category selected', () => {
      window.SmartGrind.data.topicsData = [
        {
          title: 'Arrays',
          patterns: [{ name: 'Two Sum' }]
        }
      ];
      const event = { target: { value: 'Arrays' } };

      window.SmartGrind.ui.handleCategoryChange(event);

      expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
      expect(mockElement.innerHTML).toContain('Two Sum');
    });

    test('shows new category input when custom selected', () => {
      const event = { target: { value: '' } };

      window.SmartGrind.ui.handleCategoryChange(event);

      expect(mockClassListRemove).toHaveBeenCalledWith('hidden');
    });
  });

  describe('handlePatternChange', () => {
    test('hides new pattern input when pattern selected', () => {
      const event = { target: { value: 'Two Sum' } };

      window.SmartGrind.ui.handlePatternChange(event);

      expect(mockClassListAdd).toHaveBeenCalledWith('hidden');
    });

    test('shows new pattern input when custom selected', () => {
      const event = { target: { value: '' } };

      window.SmartGrind.ui.handlePatternChange(event);

      expect(mockClassListRemove).toHaveBeenCalledWith('hidden');
    });
  });

  describe('loadDefaultView', () => {
    test('loads default view and closes mobile menu', () => {
      // Simulate mobile width to trigger mobile menu toggle
      const originalInnerWidth = window.innerWidth;
      window.innerWidth = 375;
      window.SmartGrind.state.elements.mainSidebar.classList.contains = jest.fn(() => true);

      window.SmartGrind.ui.loadDefaultView();

      expect(window.SmartGrind.renderers.setActiveTopic).toHaveBeenCalledWith('all');
      expect(window.SmartGrind.utils.updateUrlParameter).toHaveBeenCalledWith('category', null);
      expect(window.SmartGrind.renderers.renderMainView).toHaveBeenCalledWith('all');
      expect(window.SmartGrind.utils.scrollToTop).toHaveBeenCalled();
      expect(mockClassListRemove).toHaveBeenCalledWith('translate-x-0');

      // Reset innerWidth
      window.innerWidth = originalInnerWidth;
    });
  });

  describe('initScrollButton', () => {
    test('adds scroll event listener', () => {
      window.SmartGrind.ui.initScrollButton();

      expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('handlePopState', () => {
    test('handles category from URL', () => {
      window.SmartGrind.utils.getUrlParameter = jest.fn(() => 'arrays');
      window.SmartGrind.data.topicsData = [{ id: 'arrays' }];

      window.SmartGrind.ui.handlePopState();

      expect(window.SmartGrind.state.ui.activeTopicId).toBe('arrays');
      expect(window.SmartGrind.renderers.renderSidebar).toHaveBeenCalled();
      expect(window.SmartGrind.renderers.renderMainView).toHaveBeenCalled();
    });

    test('defaults to all when no category', () => {
      window.SmartGrind.utils.getUrlParameter = jest.fn(() => null);

      window.SmartGrind.ui.handlePopState();

      expect(window.SmartGrind.state.ui.activeTopicId).toBe('all');
    });
  });

  describe('showError', () => {
    test('shows error message', () => {
      window.SmartGrind.ui.showError('Test error');

      expect(mockClassListToggle).toHaveBeenCalledWith('hidden', false);
      expect(mockElement.innerText).toBe('Test error');
    });

    test('hides error when no message', () => {
      window.SmartGrind.ui.showError(null);

      expect(mockClassListToggle).toHaveBeenCalledWith('hidden', true);
    });
  });

  describe('showSigninError', () => {
    test('shows signin error message', () => {
      window.SmartGrind.ui.showSigninError('Signin error');

      expect(mockClassListToggle).toHaveBeenCalledWith('hidden', false);
      expect(mockElement.innerText).toBe('Signin error');
    });
  });
});
