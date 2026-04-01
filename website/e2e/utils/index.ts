/**
 * E2E Utilities Index
 * 
 * Central export for all e2e test utilities.
 */

// Test helpers
export {
  // Timeouts
  DEFAULT_TIMEOUT,
  SHORT_TIMEOUT,
  LONG_TIMEOUT,
  
  // Wait utilities
  waitForAppReady,
  waitForModal,
  waitForModalToClose,
  waitForNetworkIdle,
  waitForAPIResponse,
  waitForElementVisible,
  waitForAttribute,
  
  // Modal utilities
  closeModal,
  
  // Element utilities
  getTextContent,
  hasClass,
  getVisibleCount,
  isElementPresent,
  isInViewport,
  scrollIntoView,
  
  // Toast utilities
  waitForToast,
  getToastMessages,
  clearToasts,
  
  // Storage utilities
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage,
  
  // Auth utilities
  setupAuthState,
  setupAuthStateBeforeLoad,
  setupUserTypeBeforeLoad,
  clearAuthState,
  cleanupTestState,
  
  // Action utilities
  clickWithRetry,
  fillWithRetry,
  takeScreenshot,
  verifyTheme,
  
  // Navigation utilities
  navigateToSQLSection,
  
  // Utility functions
  logError,
  raceWithTimeout,
} from './test-helpers';

// API mocks
export {
  setupAPIMocks,
  unmockAPIMocks,
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
