import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * SmartGrind E2E Testing Configuration
 * 
 * This configuration supports:
 * - Multiple browsers (Chromium, Firefox, WebKit)
 * - Mobile devices (iPhone, Android)
 * - Different viewports (Desktop, Tablet, Mobile)
 * - Parallel execution options
 * - Comprehensive reporting
 */

// Environment detection
const IS_CI = !!process.env.CI;
const TEST_WORKERS = parseInt(process.env.TEST_WORKERS || '8', 10);
const TEST_TIMEOUT = parseInt(process.env.TEST_TIMEOUT || '60000', 10);

// Select projects based on environment or command line
const ALL_PROJECTS = [
  // Desktop browsers
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      viewport: { width: 1280, height: 720 },
    },
  },
  {
    name: 'firefox',
    use: { 
      ...devices['Desktop Firefox'],
      viewport: { width: 1280, height: 720 },
    },
  },
  {
    name: 'webkit',
    use: { 
      ...devices['Desktop Safari'],
      viewport: { width: 1280, height: 720 },
    },
  },
  
  // Mobile devices
  {
    name: 'mobile-chrome',
    use: { 
      ...devices['Pixel 5'],
    },
  },
  {
    name: 'mobile-safari',
    use: { 
      ...devices['iPhone 14'],
    },
  },
  
  // Tablet
  {
    name: 'tablet-chrome',
    use: { 
      ...devices['Galaxy Tab S4'],
    },
  },
];

// Default to just chromium for local dev, all for CI
const ACTIVE_PROJECTS = process.env.TEST_ALL_BROWSERS 
  ? ALL_PROJECTS 
  : ALL_PROJECTS.filter(p => p.name === 'chromium');

export default defineConfig({
  testDir: './e2e',
  
  // Global test timeout
  timeout: TEST_TIMEOUT,
  
  // Expect assertion timeout
  expect: {
    timeout: 10000,
  },
  
  // Run tests in files in parallel
  fullyParallel: !IS_CI,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: IS_CI,
  
  // Retry on CI only
  retries: IS_CI ? 2 : 1,
  
  // Workers for parallel execution
  workers: IS_CI ? 1 : TEST_WORKERS,
  
  // Reporter configuration
  reporter: [
    // HTML report with screenshots and traces
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    // Console output with list format
    ['list'],
    // JUnit report for CI integration
    IS_CI ? ['junit', { outputFile: 'test-results/junit-report.xml' }] : ['null'],
    // JSON report for programmatic analysis
    ['json', { outputFile: 'test-results/test-results.json' }],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3000/smartgrind/',
    
    // Collect trace when retrying failed tests
    trace: 'on-first-retry',
    
    // Capture screenshots on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'on-first-retry',
    
    // Action timeout for clicks, fills, etc.
    actionTimeout: 5000,
    
    // Navigation timeout
    navigationTimeout: 10000,
    
    // Viewport settings (can be overridden per project)
    viewport: { width: 1280, height: 720 },
    
    // Context options
    contextOptions: {
      // Reduce animation for more stable tests
      reducedMotion: 'reduce',
      // Accept permissions automatically
      permissions: ['clipboard-read', 'clipboard-write'],
    },
  },
  
  // Configure projects for major browsers
  projects: ACTIVE_PROJECTS,
  
  // Run local dev server before starting the tests
  webServer: {
    command: 'npm run dev -- --port 3000',
    url: 'http://localhost:3000/smartgrind/',
    reuseExistingServer: !IS_CI,
    timeout: 120000,
    env: {
      NODE_ENV: 'test',
    },
  },
  
  // Global setup for authentication state
  // globalSetup: './e2e/utils/global-setup.ts',
  
  // Global teardown
  // globalTeardown: './e2e/utils/global-teardown.ts',
  
  // Output directory for test artifacts
  outputDir: 'test-results/',
  
  // Snapshot directory for visual comparisons
  snapshotDir: 'e2e/__snapshots__/',
  
  // Metadata for the test run
  metadata: {
    title: 'SmartGrind E2E Tests',
    version: '1.0.0',
  },
});
