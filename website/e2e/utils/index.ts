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

// Performance testing utilities
export {
  // Type definitions
  type PageLoadMetrics,
  type NavigationTiming,
  type ResourceTimingEntry,
  type ResourceTimingSummary,
  type FirstPaintMetrics,
  type MemoryMetrics,
  type MemoryLeakResult,
  type NetworkRequestAnalysis,
  type NetworkRequestDetails,
  type APIResponseTiming,
  type FrameRateMetrics,
  type LongTaskInfo,
  type LayoutShiftInfo,
  type CLSMetrics,
  type PaintMetrics,
  type ResourceCounts,
  type ResourceSizeInfo,
  type CoreWebVitals,
  type BenchmarkResult,
  type PerformanceComparison,
  type OptimizationSuggestion,
  type PerformanceReport,
  type PerformanceThresholds,
  
  // Constants
  DEFAULT_THRESHOLDS,
  
  // Performance measurement
  measurePageLoad,
  measureNavigationTiming,
  measureResourceTiming,
  measureFirstPaint,
  
  // Memory monitoring
  measureMemoryUsage,
  detectMemoryLeaks,
  trackMemoryOverTime,
  
  // Network analysis
  analyzeNetworkRequests,
  measureAPIResponseTime,
  countResourceTypes,
  checkResourceSizes,
  
  // Render performance
  measureFrameRate,
  detectLongTasks,
  measureLayoutShifts,
  measurePaintMetrics,
  
  // Assertions
  expectPageLoadUnder,
  expectNoMemoryLeak,
  expectResourceCountUnder,
  expectAPIResponseUnder,
  expectFPSAbove,
  expectCLSUnder,
  
  // Benchmarking
  benchmarkPage,
  comparePerformance,
  generatePerformanceReport,
  
  // Optimization helpers
  identifySlowResources,
  suggestOptimizations,
  checkCoreWebVitals,
  
  // Utility functions
  clearPerformanceEntries,
  formatBytes,
  formatDuration,
  waitForMetric,
  createPerformanceMark,
  measureBetweenMarks,
} from './performance';

// Visual regression testing utilities
export {
  // Type definitions
  type ScreenshotOptions,
  type ComparisonOptions,
  type DeviceConfig,
  type VisualRegressionResult,
  type MaskRegion,
  type VisualTestReport,
  
  // Constants and defaults
  DEFAULT_VISUAL_OPTIONS,
  STRICT_COMPARISON,
  LENIENT_COMPARISON,
  COMPARISON_STRATEGIES,
  DEVICE_CONFIGS,
  DYNAMIC_CONTENT_SELECTORS,
  
  // Path utilities
  getBaselinePath,
  getDiffPath,
  baselineExists,
  listBaselines,
  cleanOutdatedBaselines,
  
  // Masking utilities
  createMaskSelectors,
  maskElement,
  maskRegion,
  maskDynamicElements,
  
  // Screenshot utilities
  captureScreenshot,
  compareScreenshot,
  generateBaseline,
  updateBaseline,
  stabilizeUI,
  
  // Visual assertions
  expectToMatchScreenshot,
  expectElementToMatchScreenshot,
  expectNoVisualRegression,
  
  // Device-specific
  getDeviceBaselineName,
  captureForAllDevices,
  compareForDevice,
  
  // Reporting
  formatVisualDiff,
  generateVisualReport,
} from './visual-regression';
