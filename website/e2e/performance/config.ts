/**
 * Performance Benchmark Configuration
 * 
 * Shared configuration for all performance benchmark tests.
 */

/** Number of iterations for each benchmark */
export const ITERATIONS = 5;

/** Warmup iterations before actual measurements */
export const WARMUP_ITERATIONS = 1;

/** Results directory path */
export const RESULTS_DIR = './performance-results';

/** Thresholds for performance assertions (in milliseconds unless noted) */
export const THRESHOLDS = {
  // Page load thresholds
  coldStartMs: 8000,
  warmStartMs: 4000,
  ttfbMs: 2000,
  fcpMs: 4000,
  lcpMs: 6000,
  
  // Interaction thresholds
  searchResponseMs: 5000,
  filterToggleMs: 10000,
  modalOpenMs: 10000,
  themeToggleMs: 10000,
  navigationMs: 10000,
  
  // Memory thresholds
  memoryGrowthPercent: 50,
  maxHeapSizeMB: 200,
  
  // Network thresholds
  apiResponseMs: 2000,
  maxPageWeightMB: 10,
  maxResourceCount: 150,
} as const;

/** Test timeout for performance tests (2 minutes) */
export const PERFORMANCE_TEST_TIMEOUT = 120000;

/** Base URL for performance tests */
export const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001/smartgrind/';
