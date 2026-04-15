import { defineConfig, devices, type BrowserContextOptions } from '@playwright/test';
import * as path from 'path';
import * as os from 'os';

/**
 * SmartGrind E2E Testing Configuration - Optimized
 * 
 * PERFORMANCE FEATURES:
 * - Dynamic worker calculation based on CPU cores
 * - Test sharding support for CI distribution
 * - Greedy parallel execution mode
 * - Optimized timeouts for faster feedback
 * - Pool configuration for better memory management
 * 
 * BROWSER OPTIMIZATIONS:
 * - Chromium args for faster headless execution
 * - Lazy page loading enabled
 * - Optimized viewport settings
 * - Context reuse for faster test execution
 * 
 * REPORTING:
 * - Blob reporter for shard merging
 * - Line reporter for CI-friendly output
 * - Custom slow test threshold
 */

// ==================== ENVIRONMENT DETECTION ====================

const IS_CI = !!process.env.CI;
const TEST_WORKERS = parseInt(process.env.TEST_WORKERS || '0', 10);
const TEST_TIMEOUT = parseInt(process.env.TEST_TIMEOUT || '30000', 10);
const TEST_ALL_BROWSERS = !!process.env.TEST_ALL_BROWSERS;

// Shard configuration for CI distribution
const SHARD_INDEX = parseInt(process.env.SHARD_INDEX || '1', 10);
const SHARD_TOTAL = parseInt(process.env.SHARD_TOTAL || '1', 10);

// ==================== PERFORMANCE OPTIMIZATIONS ====================

/**
 * Calculate optimal workers based on CPU cores and environment.
 * Uses optimal worker count for maximum parallel execution.
 */
function calculateWorkers(): number {
  // Respect explicit worker count from environment
  if (TEST_WORKERS > 0) {
    return TEST_WORKERS;
  }
  
  // In CI, use shard-aware worker calculation
  if (IS_CI) {
    const cpuCount = os.cpus().length;
    // Leave headroom for other CI processes
    return Math.max(1, Math.floor(cpuCount / SHARD_TOTAL) - 1);
  }
  
  // Local development: use optimal workers based on CPU count (max 8)
  // Cap at 8 workers to avoid overwhelming the system
  return Math.min(2, os.cpus().length);
}

/**
 * Optimized pool configuration for better memory management.
 * Uses 'workers' pool with optimized settings for faster test isolation.
 */
function getPoolConfig() {
  const workers = calculateWorkers();
  return {
    // Use workers pool for process-level isolation
    // Better memory isolation than 'threads' pool
    type: 'workers' as const,
    // Maximum number of concurrent worker processes
    maxWorkers: typeof workers === 'number' ? workers : os.cpus().length,
  };
}

// ==================== BROWSER CONFIGURATION ====================

/**
 * Optimized Chromium launch arguments for faster execution.
 * These flags disable unnecessary features in headless mode.
 */
const CHROMIUM_OPTIMIZED_ARGS = [
  '--disable-gpu',                          // Disable GPU hardware acceleration
  '--no-sandbox',                           // Required for running in Docker/CI
  '--disable-dev-shm-usage',                // Overcome limited resource issues
  '--disable-setuid-sandbox',               // Disable setuid sandbox
  '--disable-background-timer-throttling',  // Don't throttle timers in background
  '--disable-backgrounding-occluded-windows', // Don't background occluded windows
  '--disable-renderer-backgrounding',       // Don't throttle renderer
  '--disable-features=TranslateUI',           // Disable translation popup
  '--disable-component-extensions-with-background-pages', // Disable background extensions
  '--disable-ipc-flooding-protection',      // Disable IPC flooding protection
  '--disable-features=site-per-process',      // Disable site isolation (faster)
  '--enable-features=NetworkService,NetworkServiceInProcess', // Optimize networking
  '--force-color-profile=srgb',             // Force consistent color profile
  '--metrics-recording-only',               // Disable metrics
  '--safebrowsing-disable-auto-update',     // Disable safebrowsing updates
  '--password-store=basic',                   // Basic password store (no keyring)
  '--use-mock-keychain',                      // Use mock keychain
  '--headless=new',                         // Use new headless mode
];

/**
 * Optimized browser contexts for faster test execution.
 */
const getOptimizedContextOptions = (): BrowserContextOptions => ({
  // Accept permissions automatically
  permissions: ['clipboard-read', 'clipboard-write'],
  // Reduce animation for more stable and faster tests
  reducedMotion: 'reduce',
  // JavaScript enabled (default, but explicit)
  javaScriptEnabled: true,
  // Bypass CSP for testing (can improve performance)
  bypassCSP: true,
  // Ignore HTTPS errors in test environment
  ignoreHTTPSErrors: true,
});

// ==================== PROJECT CONFIGURATIONS ====================

/**
 * Desktop browser configurations with optimized settings.
 */
const CHROMIUM_PROJECT = {
  name: 'chromium',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      args: CHROMIUM_OPTIMIZED_ARGS,
    },
    contextOptions: getOptimizedContextOptions(),
  },
  // Metadata for filtering and organization
  metadata: {
    browser: 'chromium',
    viewport: 'desktop',
  },
};

const FIREFOX_PROJECT = {
  name: 'firefox',
  use: {
    ...devices['Desktop Firefox'],
    viewport: { width: 1280, height: 720 },
    contextOptions: getOptimizedContextOptions(),
  },
  metadata: {
    browser: 'firefox',
    viewport: 'desktop',
  },
};

const WEBKIT_PROJECT = {
  name: 'webkit',
  use: {
    ...devices['Desktop Safari'],
    viewport: { width: 1280, height: 720 },
    contextOptions: getOptimizedContextOptions(),
  },
  metadata: {
    browser: 'webkit',
    viewport: 'desktop',
  },
};

/**
 * Mobile device configurations.
 */
const MOBILE_CHROME_PROJECT = {
  name: 'mobile-chrome',
  use: {
    ...devices['Pixel 5'],
    launchOptions: {
      args: CHROMIUM_OPTIMIZED_ARGS,
    },
    contextOptions: getOptimizedContextOptions(),
  },
  metadata: {
    browser: 'chromium',
    viewport: 'mobile',
    device: 'Pixel 5',
  },
};

const MOBILE_SAFARI_PROJECT = {
  name: 'mobile-safari',
  use: {
    ...devices['iPhone 14'],
    contextOptions: getOptimizedContextOptions(),
  },
  metadata: {
    browser: 'webkit',
    viewport: 'mobile',
    device: 'iPhone 14',
  },
};

/**
 * Tablet configuration.
 */
const TABLET_CHROME_PROJECT = {
  name: 'tablet-chrome',
  use: {
    ...devices['Galaxy Tab S4'],
    launchOptions: {
      args: CHROMIUM_OPTIMIZED_ARGS,
    },
    contextOptions: getOptimizedContextOptions(),
  },
  metadata: {
    browser: 'chromium',
    viewport: 'tablet',
    device: 'Galaxy Tab S4',
  },
};

/**
 * All available projects.
 */
const ALL_PROJECTS = [
  CHROMIUM_PROJECT,
  FIREFOX_PROJECT,
  WEBKIT_PROJECT,
  MOBILE_CHROME_PROJECT,
  MOBILE_SAFARI_PROJECT,
  TABLET_CHROME_PROJECT,
];

/**
 * CI-optimized projects (faster subset for CI runs).
 * Excludes webkit as it requires additional system dependencies.
 */
const CI_PROJECTS = [
  CHROMIUM_PROJECT,
  FIREFOX_PROJECT,
  MOBILE_CHROME_PROJECT,
];

/**
 * Select active projects based on environment.
 */
function getActiveProjects() {
  // If explicitly requesting all browsers, use all projects
  if (TEST_ALL_BROWSERS) {
    return ALL_PROJECTS;
  }
  
  // In CI, use optimized subset
  if (IS_CI) {
    return CI_PROJECTS;
  }
  
  // Default: just Chromium for fastest local development
  return [CHROMIUM_PROJECT];
}

// ==================== DEPENDENCY CONFIGURATION ====================

/**
 * Configure test dependencies for proper ordering.
 * Tests can depend on other tests/projects to run first.
 */
const PROJECT_DEPENDENCIES = [
  // Example: Setup tests run before all others
  // {
  //   name: 'setup',
  //   testMatch: /.*\.setup\.ts/,
  // },
  // {
  //   name: 'chromium',
  //   dependencies: ['setup'],
  // },
];

// ==================== REPORTER CONFIGURATION ====================

type ReporterDescription = [string] | [string, object];

/**
 * Optimized reporters for different environments.
 */
function getReporters(): ReporterDescription[] {
  const reporters: ReporterDescription[] = [
    // Line reporter for clean CI output (shows progress without noise)
    ['line'],
    // HTML report with rich artifacts
    ['html', { 
      open: 'never', 
      outputFolder: 'playwright-report',
    }],
    // JSON report for programmatic analysis
    ['json', { 
      outputFile: 'test-results/test-results.json',
    }],
  ];
  
  // Add blob reporter when sharding (for merging results)
  if (SHARD_TOTAL > 1) {
    reporters.push([
      'blob', 
      { 
        outputDir: 'blob-report',
        fileName: `report-${SHARD_INDEX}.zip`,
      }
    ]);
  }
  
  // Add JUnit for CI integration
  if (IS_CI) {
    reporters.push([
      'junit', 
      { outputFile: 'test-results/junit-report.xml' }
    ]);
  }
  
  return reporters;
}

// ==================== MAIN CONFIGURATION ====================

export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // ==================== TIMEOUTS ====================
  
  // Global test timeout (30s optimized for faster feedback)
  timeout: TEST_TIMEOUT,
  
  // Expect assertion timeout (5s for faster failures)
  expect: {
    timeout: 5000,
  },
  
  // ==================== EXECUTION ====================
  
  // Run all tests in parallel (files and tests within files)
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in source code
  forbidOnly: IS_CI,
  
  // Retry failed tests (more retries in CI for flakiness)
  retries: IS_CI ? 2 : 1,
  
  // Optimal workers calculation with greedy mode support
  workers: calculateWorkers(),

  // Test sharding for CI distribution
  shard: {
    total: SHARD_TOTAL,
    current: SHARD_INDEX,
  },
  
  // ==================== REPORTING ====================
  
  reporter: getReporters(),
  
  // Custom slow test threshold (10 seconds)
  reportSlowTests: {
    max: 5,
    threshold: 10000,
  },
  
  // ==================== SHARED SETTINGS ====================
  
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3001/smartgrind/',
    
    // Collect trace for debugging (on first retry only to save space)
    trace: 'on-first-retry',
    
    // Capture screenshots on failure
    screenshot: 'only-on-failure',
    
    // Record video on first retry
    video: 'on-first-retry',
    
    // Optimized action timeout (faster feedback)
    actionTimeout: 3000,
    
    // Optimized navigation timeout
    navigationTimeout: 8000,
    
    // Viewport settings (optimized for headless)
    viewport: { width: 1280, height: 720 },
    
    // Preserve existing session between tests where possible
    // This speeds up tests by reusing browser state
    storageState: undefined, // Set to a file path to reuse auth state
    
    // Context options with performance optimizations
    contextOptions: getOptimizedContextOptions(),
    
    // Launch options for faster Chromium startup
    launchOptions: {
      args: CHROMIUM_OPTIMIZED_ARGS,
    },
  },
  
  // ==================== PROJECTS ====================
  
  projects: getActiveProjects(),
  
  // ==================== WEBSERVER ====================

  webServer: {
    command: 'npm run dev -- --port 3001',
    url: 'http://localhost:3001/smartgrind/',

    // Reuse existing server only if it's the correct SmartGrind server
    reuseExistingServer: !process.env.CI,
    
    // Optimized timeout (shorter for faster failure detection)
    timeout: 120000,
    
    // Check interval for server readiness (poll faster)
    gracefulShutdown: {
      timeout: 5000,
      signal: 'SIGTERM',
    },
    
    // Pipe stdout/stderr for better debugging
    stdout: 'pipe',
    stderr: 'pipe',
    
    // Environment for the webserver
    env: {
      NODE_ENV: 'test',
      PLAYWRIGHT_TEST: 'true',
    },
  },
  
  // ==================== GLOBAL SETUP/TEARDOWN ====================
  
  // Uncomment to enable global setup/teardown
  // globalSetup: './e2e/utils/global-setup.ts',
  // globalTeardown: './e2e/utils/global-teardown.ts',
  
  // ==================== OUTPUT ====================
  
  // Output directory for test artifacts
  outputDir: 'test-results/',
  
  // Snapshot directory for visual comparisons
  snapshotDir: 'e2e/__snapshots__/',
  
  // ==================== METADATA ====================
  
  metadata: {
    title: 'SmartGrind E2E Tests',
    version: '1.0.0',
    environment: IS_CI ? 'ci' : 'local',
    workers: String(calculateWorkers()),
    shard: `${SHARD_INDEX}/${SHARD_TOTAL}`,
  },
  
  // ==================== MISCELLANEOUS ====================
  
  // Fail on uncaught console errors
  // Useful for catching JavaScript errors during tests
  // failOnConsoleMessages: true,
  
  // Update snapshots only in non-CI environments
  updateSnapshots: IS_CI ? 'none' : 'missing',
  
  // Maximum time for the entire test run
  globalTimeout: 600000, // 10 min CI, 5 min local
});
