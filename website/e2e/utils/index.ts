/**
 * E2E Utilities Index
 * 
 * Central export for all e2e test utilities.
 */

// Test helpers
export {
  DEFAULT_TIMEOUT,
  SHORT_TIMEOUT,
  LONG_TIMEOUT,
  waitForAppReady,
  waitForModal,
  waitForModalToClose,
  closeModal,
  getTextContent,
  hasClass,
  waitForToast,
  getToastMessages,
  clearToasts,
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage,
  setupAuthState,
  setupAuthStateBeforeLoad,
  clearAuthState,
  waitForNetworkIdle,
  scrollIntoView,
  takeScreenshot,
  isInViewport,
  clickWithRetry,
  fillWithRetry,
  waitForAttribute,
  verifyTheme,
  getVisibleCount,
} from './test-helpers';

// API mocks
export {
  setupAPIMocks,
  setupOfflineMode,
  restoreOnlineMode,
  mockServiceWorker,
  waitForAPICall,
  getRequestCount,
  type MockScenario,
  type MockOptions,
} from './mock-api';

// Test data
export {
  mockUser,
  mockProblems,
  mockFlashcards,
  mockCategories,
  mockSQLCategories,
  mockAPIResponses,
  mockLocalStorage,
  testScenarios,
  calculateStats,
} from '../fixtures/test-data';
