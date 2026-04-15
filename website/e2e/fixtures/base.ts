/**
 * SmartGrind Comprehensive Test Fixtures
 * 
 * Provides worker-scoped and test-scoped fixtures for Playwright E2E tests.
 * Includes authentication, API mocking, performance metrics, and utility fixtures.
 * 
 * @module e2e/fixtures/base
 */

import { test as baseTest, expect as baseExpect, type Page, type BrowserContext, type PlaywrightTestArgs, type PlaywrightTestOptions, type PlaywrightWorkerArgs, type PlaywrightWorkerOptions, type TestInfo, type Route, type Request } from '@playwright/test';
import { setupAPIMocks, setupOfflineMode, restoreOnlineMode, mockServiceWorker, waitForAPICall, type MockScenario } from '../utils/mock-api';
import { mockUser, mockProblems, mockFlashcards, mockAPIResponses, mockLocalStorage, testScenarios, calculateStats } from './test-data';
import { setupAuthStateBeforeLoad, verifyTheme, SHORT_TIMEOUT, LONG_TIMEOUT } from '../utils/test-helpers';
import * as path from 'path';
import * as fs from 'fs';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

/**
 * Performance metrics collected during test execution
 */
export interface PerformanceMetrics {
  /** Time to first byte in milliseconds */
  timeToFirstByte: number;
  /** DOM content loaded time in milliseconds */
  domContentLoaded: number;
  /** Full page load time in milliseconds */
  loadComplete: number;
  /** First contentful paint time in milliseconds */
  firstContentfulPaint: number | null;
  /** Largest contentful paint time in milliseconds */
  largestContentfulPaint: number | null;
  /** Cumulative layout shift score */
  cumulativeLayoutShift: number | null;
  /** Total JavaScript execution time in milliseconds */
  jsExecutionTime: number;
  /** Number of network requests made */
  networkRequestCount: number;
  /** Total bytes transferred */
  totalBytesTransferred: number;
}

/**
 * Memory usage snapshot
 */
export interface MemorySnapshot {
  /** Timestamp when snapshot was taken */
  timestamp: number;
  /** JavaScript heap size in bytes */
  usedJSHeapSize: number;
  /** Total JS heap size in bytes */
  totalJSHeapSize: number;
  /** JS heap size limit in bytes */
  jsHeapSizeLimit: number;
  /** DOM node count */
  domNodeCount: number;
}

/**
 * Network activity record
 */
export interface NetworkActivity {
  /** Request URL */
  url: string;
  /** HTTP method */
  method: string;
  /** HTTP status code */
  status: number;
  /** Request duration in milliseconds */
  duration: number;
  /** Response size in bytes */
  responseSize: number;
  /** Timestamp when request was initiated */
  timestamp: number;
  /** Whether request was cached */
  fromCache: boolean;
  /** Resource type */
  resourceType: string;
}

/**
 * Cleanup task for automatic cleanup
 */
export type CleanupTask = () => Promise<void> | void;

/**
 * API mocking configuration
 */
export interface APIMockingConfig {
  /** Mock scenario to use */
  scenario: MockScenario;
  /** Custom response overrides */
  customResponses?: Record<string, unknown>;
  /** Response delay in milliseconds */
  delay?: number;
  /** Error rate for random failures (0-1) */
  errorRate?: number;
  /** Enable request logging */
  logRequests?: boolean;
  /** Routes to skip mocking */
  skipRoutes?: string[];
}

/**
 * Authentication configuration
 */
export interface AuthConfig {
  /** User ID */
  userId: string;
  /** Display name */
  displayName: string;
  /** Email address */
  email?: string;
  /** JWT token */
  token?: string;
  /** CSRF token */
  csrfToken?: string;
  /** Storage state path */
  storageState?: string;
}

/**
 * Test data factory configuration
 */
export interface TestDataFactory {
  /** Create a mock problem with optional overrides */
  createProblem: (overrides?: Partial<typeof mockProblems[0]>) => typeof mockProblems[0];
  /** Create a mock flashcard with optional overrides */
  createFlashcard: (overrides?: Partial<typeof mockFlashcards[0]>) => typeof mockFlashcards[0];
  /** Create a mock user with optional overrides */
  createUser: (overrides?: Partial<typeof mockUser>) => typeof mockUser;
  /** Create a complete test scenario */
  createScenario: (type: keyof typeof testScenarios) => typeof testScenarios[keyof typeof testScenarios];
  /** Calculate stats for a set of problems */
  calculateStats: typeof calculateStats;
}

// =============================================================================
// FIXTURE INTERFACES
// =============================================================================

/**
 * App-specific fixtures interface
 * Extends Playwright's test-scoped fixtures with custom app fixtures
 */
export interface AppFixtures {
  /** Pre-authenticated page with auth state pre-configured */
  authenticatedPage: Page;
  /** Page configured for offline testing */
  offlineContext: { page: Page; setOffline: (offline: boolean) => Promise<void> };
  /** API mocking with automatic route handling */
  apiMocking: {
    setup: (config?: Partial<APIMockingConfig>) => Promise<void>;
    reset: () => Promise<void>;
    setScenario: (scenario: MockScenario) => void;
  };
  /** Performance metrics collector */
  performanceMetrics: {
    start: () => Promise<void>;
    stop: () => Promise<PerformanceMetrics>;
    assert: (assertions: Partial<Record<keyof PerformanceMetrics, number>>) => Promise<void>;
  };
  /** Memory usage tracker */
  memoryUsage: {
    snapshot: () => Promise<MemorySnapshot>;
    track: (duration?: number, interval?: number) => Promise<MemorySnapshot[]>;
    assertNoLeak: (baseline: MemorySnapshot, threshold?: number) => Promise<void>;
  };
  /** Network activity monitor */
  networkActivity: {
    start: () => void;
    stop: () => NetworkActivity[];
    getRequests: () => NetworkActivity[];
    waitForRequest: (urlPattern: string | RegExp, timeout?: number) => Promise<NetworkActivity>;
    assertNoErrors: () => void;
  };
  /** Test data factory */
  testData: TestDataFactory;
  /** Cleanup registry */
  cleanup: {
    register: (task: CleanupTask) => void;
    runAll: () => Promise<void>;
  };
  /** Screenshot on failure handler */
  screenshotOnFailure: {
    setup: () => void;
    capture: (name?: string) => Promise<string | null>;
  };
}

/**
 * Worker-scoped fixtures for parallel test workers
 */
export interface AppWorkerArgs {
  /** Multi-user context for testing collaboration scenarios */
  multiUserContext: {
    createUser: (config: AuthConfig) => Promise<{ page: Page; context: BrowserContext }>;
    cleanupAll: () => Promise<void>;
    users: Map<string, { page: Page; context: BrowserContext; config: AuthConfig }>;
  };
  /** Storage state generator for reuse across tests */
  authStorageState: {
    generate: (config?: Partial<AuthConfig>) => Promise<string>;
    load: (path: string) => Promise<AuthConfig>;
    cleanup: () => Promise<void>;
  };


}

/**
 * Extended test args combining Playwright and app fixtures
 */
export interface AppTestArgs extends PlaywrightTestArgs, PlaywrightTestOptions, AppFixtures {}

/**
 * Extended worker args combining Playwright and app worker args
 */
export interface AppWorkerOptions extends PlaywrightWorkerArgs, PlaywrightWorkerOptions, AppWorkerArgs {}

// =============================================================================
// WORKER-SCOPED FIXTURES
// =============================================================================

/**
 * Multi-user context worker fixture
 * Manages multiple browser contexts for multi-user testing scenarios
 */
const multiUserContextFixture = baseTest.extend<AppFixtures, { multiUserContext: AppWorkerArgs['multiUserContext'] }>({
  multiUserContext: [
    async ({ browser }, use, workerInfo) => {
      const users = new Map<string, { page: Page; context: BrowserContext; config: AuthConfig }>();
      
      const multiUserContext: AppWorkerArgs['multiUserContext'] = {
        async createUser(config) {
          const context = await browser.newContext({
            storageState: config.storageState,
          });
          const page = await context.newPage();
          
          // Set up auth state if not using storage state
          if (!config.storageState) {
            await page.addInitScript((userConfig: AuthConfig) => {
              localStorage.setItem('userId', userConfig.userId);
              localStorage.setItem('displayName', userConfig.displayName);
              localStorage.setItem('smartgrind-user-type', 'signed-in');
              if (userConfig.token) {
                localStorage.setItem('token', userConfig.token);
              }
            }, config);
          }
          
          const userKey = config.userId || `user-${users.size}`;
          users.set(userKey, { page, context, config });
          
          return { page, context };
        },
        
        async cleanupAll() {
          for (const [, user] of Array.from(users)) {
            await user.context.close();
          }
          users.clear();
        },
        
        users,
      };
      
      await use(multiUserContext);
      
      // Cleanup after all tests in this worker
      await multiUserContext.cleanupAll();
    },
    { scope: 'worker' },
  ],
});

/**
 * Auth storage state worker fixture
 * Generates and manages authentication storage states
 */
const authStorageStateFixture = multiUserContextFixture.extend<AppFixtures, { authStorageState: AppWorkerArgs['authStorageState'] }>({
  authStorageState: [
    async ({}, use, workerInfo) => {
      const storageStatesDir = path.join(process.cwd(), 'e2e', '.storage-states');
      if (!fs.existsSync(storageStatesDir)) {
        fs.mkdirSync(storageStatesDir, { recursive: true });
      }
      
      const generatedStates: string[] = [];
      
      const authStorageState: AppWorkerArgs['authStorageState'] = {
        async generate(config = {}) {
          const fullConfig: AuthConfig = {
            userId: config.userId || `worker-${workerInfo.workerIndex}-user-${generatedStates.length}`,
            displayName: config.displayName || `Test User ${generatedStates.length + 1}`,
            email: config.email || `test${generatedStates.length}@example.com`,
            token: config.token || `mock-token-${Date.now()}`,
            csrfToken: config.csrfToken || `mock-csrf-${Date.now()}`,
            ...config,
          };
          
          const statePath = path.join(storageStatesDir, `auth-${fullConfig.userId}.json`);
          
          const storageState = {
            cookies: [],
            origins: [
              {
                origin: 'http://localhost:3001',
                localStorage: [
                  { name: 'userId', value: fullConfig.userId },
                  { name: 'displayName', value: fullConfig.displayName },
                  { name: 'smartgrind-user-type', value: 'signed-in' },
                  { name: 'token', value: fullConfig.token },
                  { name: 'theme', value: 'light' },
                  { name: 'smartgrind-local-display-name', value: fullConfig.displayName },
                ],
              },
            ],
          };
          
          fs.writeFileSync(statePath, JSON.stringify(storageState, null, 2));
          generatedStates.push(statePath);
          
          return statePath;
        },
        
        async load(statePath) {
          const content = fs.readFileSync(statePath, 'utf-8');
          const state = JSON.parse(content);
          
          const localStorage = state.origins?.[0]?.localStorage || [];
          const getValue = (name: string) => localStorage.find((item: { name: string; value: string }) => item.name === name)?.value;
          
          return {
            userId: getValue('userId') || '',
            displayName: getValue('displayName') || '',
            token: getValue('token'),
            csrfToken: getValue('csrfToken'),
          };
        },
        
        async cleanup() {
          for (const statePath of generatedStates) {
            if (fs.existsSync(statePath)) {
              fs.unlinkSync(statePath);
            }
          }
          generatedStates.length = 0;
        },
      };
      
      await use(authStorageState);
      await authStorageState.cleanup();
    },
    { scope: 'worker' },
  ],
});

// =============================================================================
// TEST-SCOPED FIXTURES
// =============================================================================

/**
 * Main test fixture extending base playwright test with all custom fixtures
 */
const testWithFixtures = authStorageStateFixture.extend<AppFixtures>({
  // ---------------------------------------------------------------------------
  // AUTHENTICATION FIXTURES
  // ---------------------------------------------------------------------------
  
  /**
   * Pre-authenticated page with auth state pre-configured
   */
  authenticatedPage: async ({ page, authStorageState }, use, testInfo) => {
    // Generate and use storage state for this test
    const storageStatePath = await authStorageState.generate({
      userId: `test-${testInfo.testId}`,
      displayName: 'Test User',
    });
    
    // Configure the page with auth state
    await page.addInitScript((state: AuthConfig) => {
      localStorage.setItem('userId', state.userId);
      localStorage.setItem('displayName', state.displayName);
      localStorage.setItem('smartgrind-user-type', 'signed-in');
      if (state.token) {
        localStorage.setItem('token', state.token);
      }
    }, await authStorageState.load(storageStatePath));
    
    await use(page);
  },
  
  // ---------------------------------------------------------------------------
  // OFFLINE CONTEXT FIXTURE
  // ---------------------------------------------------------------------------
  
  /**
   * Offline context fixture for offline testing
   */
  offlineContext: async ({ browser, context, page }, use, testInfo) => {
    const offlineContext = await browser.newContext();
    const offlinePage = await offlineContext.newPage();
    
    const offlineControl = {
      page: offlinePage,
      setOffline: async (offline: boolean) => {
        await offlineContext.setOffline(offline);
        await offlinePage.evaluate((isOffline) => {
          window.dispatchEvent(new Event(isOffline ? 'offline' : 'online'));
        }, offline);
      },
    };
    
    await use(offlineControl);
    
    // Cleanup
    await offlineContext.close();
  },
  
  // ---------------------------------------------------------------------------
  // API MOCKING FIXTURES
  // ---------------------------------------------------------------------------
  
  /**
   * API mocking fixture with automatic route handling
   */
  apiMocking: async ({ page }, use) => {
    let currentScenario: MockScenario = 'default';
    let currentConfig: APIMockingConfig = { scenario: 'default' };
    const routes: Route[] = [];
    
    const apiMocking = {
      async setup(config: Partial<APIMockingConfig> = {}) {
        currentConfig = { ...currentConfig, ...config, scenario: config.scenario || currentScenario };
        
        // Setup basic API mocks
        await setupAPIMocks(page, {
          scenario: currentConfig.scenario,
          customResponses: currentConfig.customResponses,
          delay: currentConfig.delay,
        });
        
        // Add request logging if enabled
        if (currentConfig.logRequests) {
          page.on('request', (request) => {
            if (request.url().includes('/api/')) {
              console.log(`[API] ${request.method()} ${request.url()}`);
            }
          });
        }
      },
      
      async reset() {
        await page.unroute('**/*');
        currentScenario = 'default';
        currentConfig = { scenario: 'default' };
      },
      
      setScenario(scenario: MockScenario) {
        currentScenario = scenario;
        currentConfig.scenario = scenario;
      },
    };
    
    await use(apiMocking);
    await apiMocking.reset();
  },
  
  // ---------------------------------------------------------------------------
  // PERFORMANCE FIXTURES
  // ---------------------------------------------------------------------------
  
  /**
   * Performance metrics collection fixture
   */
  performanceMetrics: async ({ page }, use) => {
    let metricsStartTime = 0;
    let requestLog: { url: string; startTime: number; endTime?: number; size: number }[] = [];
    
    const performanceMetrics = {
      async start() {
        metricsStartTime = Date.now();
        requestLog = [];
        
        // Track all network requests
        page.on('request', (request) => {
          if (!request.url().startsWith('data:')) {
            requestLog.push({
              url: request.url(),
              startTime: Date.now(),
              size: 0,
            });
          }
        });
        
        page.on('response', async (response) => {
          const requestIndex = requestLog.findIndex(r => r.url === response.url());
          if (requestIndex !== -1) {
            requestLog[requestIndex].endTime = Date.now();
            try {
              const body = await response.body().catch(() => Buffer.alloc(0));
              requestLog[requestIndex].size = body.length;
            } catch {
              requestLog[requestIndex].size = 0;
            }
          }
        });
        
        // Clear performance entries
        await page.evaluate(() => {
          performance.clearMarks();
          performance.clearMeasures();
          performance.mark('test-start');
        });
      },
      
      async stop(): Promise<PerformanceMetrics> {
        const perfData = await page.evaluate(() => {
          performance.mark('test-end');
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          const lcp = performance.getEntriesByType('largest-contentful-paint')[0] as PerformanceEntry & { startTime: number };
          
          return {
            timeToFirstByte: navigation?.responseStart - navigation?.startTime || 0,
            domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.startTime || 0,
            loadComplete: navigation?.loadEventEnd - navigation?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null,
            largestContentfulPaint: lcp?.startTime || null,
          };
        });
        
        // Calculate JS execution time (simplified)
        const jsExecutionTime = Date.now() - metricsStartTime;
        
        // Calculate total bytes transferred
        const totalBytes = requestLog.reduce((sum, req) => sum + req.size, 0);
        
        return {
          timeToFirstByte: perfData.timeToFirstByte,
          domContentLoaded: perfData.domContentLoaded,
          loadComplete: perfData.loadComplete,
          firstContentfulPaint: perfData.firstContentfulPaint,
          largestContentfulPaint: perfData.largestContentfulPaint,
          cumulativeLayoutShift: null, // Would need PerformanceObserver
          jsExecutionTime,
          networkRequestCount: requestLog.length,
          totalBytesTransferred: totalBytes,
        };
      },
      
      async assert(assertions: Partial<Record<keyof PerformanceMetrics, number>>) {
        const metrics = await this.stop();
        
        for (const [key, value] of Object.entries(assertions)) {
          const metricValue = metrics[key as keyof PerformanceMetrics];
          if (metricValue !== null && metricValue !== undefined) {
            expect(metricValue).toBeLessThanOrEqual(value);
          }
        }
      },
    };
    
    await use(performanceMetrics);
  },
  
  /**
   * Memory usage tracking fixture
   */
  memoryUsage: async ({ page }, use) => {
    const memoryUsage = {
      async snapshot(): Promise<MemorySnapshot> {
        const memory = await page.evaluate(() => {
          const perf = performance as Performance & { memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          }};
          return {
            usedJSHeapSize: perf.memory?.usedJSHeapSize || 0,
            totalJSHeapSize: perf.memory?.totalJSHeapSize || 0,
            jsHeapSizeLimit: perf.memory?.jsHeapSizeLimit || 0,
            domNodeCount: document.querySelectorAll('*').length,
          };
        });
        
        return {
          timestamp: Date.now(),
          ...memory,
        };
      },
      
      async track(duration = 5000, interval = 500): Promise<MemorySnapshot[]> {
        const snapshots: MemorySnapshot[] = [];
        const startTime = Date.now();
        
        while (Date.now() - startTime < duration) {
          snapshots.push(await this.snapshot());
          await page.waitForTimeout(interval);
        }
        
        return snapshots;
      },
      
      async assertNoLeak(baseline: MemorySnapshot, threshold = 1.5) {
        const current = await this.snapshot();
        const growthRatio = current.usedJSHeapSize / baseline.usedJSHeapSize;
        
        expect(growthRatio).toBeLessThan(threshold);
      },
    };
    
    await use(memoryUsage);
  },
  
  /**
   * Network activity monitoring fixture
   */
  networkActivity: async ({ page }, use) => {
    const activityLog: NetworkActivity[] = [];
    let isTracking = false;
    
    const requestHandler = (request: Request) => {
      if (!isTracking) return;
      
      activityLog.push({
        url: request.url(),
        method: request.method(),
        status: 0,
        duration: 0,
        responseSize: 0,
        timestamp: Date.now(),
        fromCache: false,
        resourceType: request.resourceType(),
      });
    };
    
    const responseHandler = async (response: import('@playwright/test').Response) => {
      if (!isTracking) return;
      
      const requestIndex = activityLog.findIndex(
        a => a.url === response.url() && a.status === 0
      );
      
      if (requestIndex !== -1) {
        const request = activityLog[requestIndex];
        request.status = response.status();
        request.duration = Date.now() - request.timestamp;
        
        try {
          const body = await response.body().catch(() => null);
          request.responseSize = body?.length || 0;
        } catch {
          request.responseSize = 0;
        }
        
        request.fromCache = response.fromServiceWorker();
      }
    };
    
    const networkActivity = {
      start() {
        isTracking = true;
        page.on('request', requestHandler);
        page.on('response', responseHandler);
      },
      
      stop() {
        isTracking = false;
        page.off('request', requestHandler);
        page.off('response', responseHandler);
        return [...activityLog];
      },
      
      getRequests() {
        return [...activityLog];
      },
      
      async waitForRequest(urlPattern: string | RegExp, timeout = 5000): Promise<NetworkActivity> {
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
          const match = activityLog.find(a => {
            if (typeof urlPattern === 'string') {
              return a.url.includes(urlPattern);
            }
            return urlPattern.test(a.url);
          });
          
          if (match) return match;
          await page.waitForTimeout(100);
        }
        
        throw new Error(`Request matching ${urlPattern} not found within ${timeout}ms`);
      },
      
      assertNoErrors() {
        const errors = activityLog.filter(a => a.status >= 400);
        if (errors.length > 0) {
          throw new Error(`Network errors found: ${errors.map(e => `${e.url} (${e.status})`).join(', ')}`);
        }
      },
    };
    
    await use(networkActivity);
    
    // Cleanup
    networkActivity.stop();
  },
  
  // ---------------------------------------------------------------------------
  // UTILITY FIXTURES
  // ---------------------------------------------------------------------------
  
  /**
   * Test data factory fixture
   */
  testData: async ({}, use) => {
    let problemCounter = 0;
    let flashcardCounter = 0;
    
    const testData: TestDataFactory = {
      createProblem(overrides = {}) {
        problemCounter++;
        return {
          id: `test-problem-${problemCounter}`,
          name: overrides.name || `Test Problem ${problemCounter}`,
          url: `https://leetcode.com/problems/test-${problemCounter}`,
          topic: overrides.topic || 'Arrays',
          pattern: overrides.pattern || 'Two Pointers',
          status: overrides.status || 'unsolved',
          reviewInterval: overrides.reviewInterval ?? 0,
          nextReviewDate: overrides.nextReviewDate || null,
          note: overrides.note || '',
          ...overrides,
        } as typeof mockProblems[0];
      },
      
      createFlashcard(overrides = {}) {
        flashcardCounter++;
        return {
          id: `fc-test-${flashcardCounter}`,
          type: overrides.type || 'algorithm',
          category: overrides.category || 'General',
          front: overrides.front || `Test question ${flashcardCounter}?`,
          back: overrides.answer || `Test answer ${flashcardCounter}.`,
          difficulty: overrides.difficulty || 'easy',
          tags: overrides.tags || ['test'],
          ...overrides,
        } as typeof mockFlashcards[0];
      },
      
      createUser(overrides = {}) {
        return {
          userId: overrides.userId || `test-user-${Date.now()}`,
          displayName: overrides.displayName || 'Test User',
          email: overrides.email || 'test@example.com',
          token: overrides.token || `mock-token-${Date.now()}`,
          csrfToken: overrides.csrfToken || `mock-csrf-${Date.now()}`,
          ...overrides,
        };
      },
      
      createScenario(type) {
        return testScenarios[type];
      },
      
      calculateStats,
    };
    
    await use(testData);
  },
  
  /**
   * Cleanup registry fixture
   */
  cleanup: async ({}, use, testInfo) => {
    const tasks: CleanupTask[] = [];
    
    const cleanup = {
      register(task: CleanupTask) {
        tasks.push(task);
      },
      
      async runAll() {
        // Run cleanup tasks in reverse order (LIFO)
        for (let i = tasks.length - 1; i >= 0; i--) {
          try {
            await tasks[i]();
          } catch (error) {
            console.error(`Cleanup task ${i} failed:`, error);
          }
        }
        tasks.length = 0;
      },
    };
    
    await use(cleanup);
    
    // Auto-run cleanup after test
    await cleanup.runAll();
  },
  
  /**
   * Screenshot on failure fixture
   */
  screenshotOnFailure: async ({ page }, use, testInfo) => {
    const screenshots: string[] = [];
    
    const screenshotOnFailure = {
      setup() {
        // Auto-capture is handled by Playwright's built-in screenshot: 'only-on-failure'
        // This fixture provides additional manual capture capabilities
      },
      
      async capture(name?: string): Promise<string | null> {
        const screenshotPath = testInfo.outputPath(
          `screenshot-${name || Date.now()}.png`
        );
        
        try {
          await page.screenshot({ path: screenshotPath, fullPage: true });
          screenshots.push(screenshotPath);
          return screenshotPath;
        } catch (error) {
          console.error('Screenshot capture failed:', error);
          return null;
        }
      },
    };
    
    await use(screenshotOnFailure);
  },
});
  

// =============================================================================
// EXPECT EXTENSIONS
// =============================================================================

/**
 * Extended expect with custom matchers
 */
export const expect = baseExpect;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type { Page, BrowserContext, TestInfo };

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Export the extended test
 */
export const test = testWithFixtures;

/**
 * Default export for convenience
 */
export default test;
