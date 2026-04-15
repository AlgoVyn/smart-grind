# E2E Test Optimization Guide

Comprehensive guide for optimizing Playwright E2E tests with performance best practices, fixture patterns, and debugging techniques.

## Table of Contents

1. [Performance Best Practices](#1-performance-best-practices)
2. [Fixture Usage Patterns](#2-fixture-usage-patterns)
3. [Selector Optimization](#3-selector-optimization)
4. [Waiting Strategies](#4-waiting-strategies)
5. [API Mocking Best Practices](#5-api-mocking-best-practices)
6. [Visual Testing](#6-visual-testing)
7. [CI/CD Optimization](#7-cicd-optimization)
8. [Debugging Techniques](#8-debugging-techniques)

---

## 1. Performance Best Practices

### Use Worker-Scoped Fixtures for Shared Setup

Worker-scoped fixtures run once per worker process, not per test. Use them for expensive operations like authentication state preparation.

```typescript
// fixtures.ts
import { test as base, expect } from '@playwright/test';

// ❌ Bad: Test-scoped (runs for every test)
export const test = base.extend({
  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await authenticate(page); // Runs for EVERY test
    await use(page);
  },
});

// ✅ Good: Worker-scoped (runs once per worker)
export const test = base.extend<{}, { authenticatedContext: BrowserContext }>({
  // Worker-scoped fixture
  authenticatedContext: [async ({ browser }, use, workerInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await authenticate(page);
    await page.context().storageState({ path: `auth-${workerInfo.workerIndex}.json` });
    await use(context);
    await context.close();
  }, { scope: 'worker' }],

  // Test-scoped fixture that uses worker-scoped context
  page: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  },
});
```

### Minimize beforeEach Work

Move setup to worker fixtures or test-scoped fixtures instead of `beforeEach` hooks.

```typescript
// ❌ Bad: beforeEach with heavy setup
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await setupTestData(page);
    await page.waitForSelector('[data-testid="dashboard-ready"]');
  });

  test('test 1', async ({ page }) => { /* ... */ });
  test('test 2', async ({ page }) => { /* ... */ });
});

// ✅ Good: Fixture-based setup
export const test = base.extend({
  dashboardPage: async ({ page }, use) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await use(page);
  },
});

test('test 1', async ({ dashboardPage }) => { /* ... */ });
test('test 2', async ({ dashboardPage }) => { /* ... */ });
```

### Use storageState for Authentication

Pre-authenticate once and reuse the storage state across tests.

```typescript
// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });
  
  // Authenticate once
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
  
  // Save storage state
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
```

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: './global-setup.ts',
  use: {
    storageState: 'playwright/.auth/user.json',
  },
});

// Test file - automatically authenticated
test('dashboard loads', async ({ page }) => {
  await page.goto('/dashboard'); // Already logged in!
  await expect(page).toHaveURL('/dashboard');
});
```

### Parallel Test Execution Strategies

Configure parallel execution based on test characteristics.

```typescript
// playwright.config.ts
export default defineConfig({
  // Fully parallel mode
  fullyParallel: true,
  
  // Workers based on CPU cores
  workers: process.env.CI ? '100%' : Math.max(2, os.cpus().length - 1),
  
  // Shard configuration for CI
  shard: {
    total: Number(process.env.SHARD_TOTAL) || 1,
    current: Number(process.env.SHARD_INDEX) || 0,
  },
  
  // Serial tests that modify shared state
  projects: [
    {
      name: 'parallel',
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*serial\.spec\.ts/,
    },
    {
      name: 'serial',
      testMatch: /.*serial\.spec\.ts/,
      fullyParallel: false,
    },
  ],
});
```

```typescript
// database-modifying.spec.ts
import { test } from '@playwright/test';

// Force serial execution for tests that modify shared resources
test.describe.configure({ mode: 'serial' });

test('modifies database', async ({ page }) => {
  // This test modifies shared state
});

test('reads modified state', async ({ page }) => {
  // Depends on previous test's changes
});
```

### Test Isolation Patterns

Ensure test isolation while maintaining performance.

```typescript
// fixtures.ts - Isolated test data per test
export const test = base.extend<{
  testUser: TestUser;
  testData: TestData;
}>({
  // Isolated user per test
  testUser: async ({ apiRequest }, use, testInfo) => {
    const user = await createTestUser({
      email: `test-${testInfo.testId}@example.com`,
      prefix: testInfo.workerIndex,
    });
    await use(user);
    await cleanupTestUser(user.id);
  },

  // Isolated test data
  testData: async ({ testUser }, use, testInfo) => {
    const data = await seedTestData(testUser.id, {
      suffix: testInfo.retry,
    });
    await use(data);
    await cleanupTestData(data.id);
  },
});

// Usage in tests
test('user can modify own data', async ({ page, testUser, testData }) => {
  await page.goto(`/users/${testUser.id}/data`);
  // Test with isolated data - no conflicts with other tests
});
```

---

## 2. Fixture Usage Patterns

### When to Use authenticatedPage vs Manual Auth

```typescript
// fixtures.ts
export const test = base.extend<{
  authenticatedPage: Page;
  unauthenticatedPage: Page;
}>({
  // For tests that ALWAYS need authentication
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // For tests that need clean state
  unauthenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext(); // No storage state
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

// Usage
// ✅ Use authenticatedPage for tests that always need auth
test('user sees personalized dashboard', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  await expect(authenticatedPage.locator('[data-testid="welcome-message"]')).
    toContainText('Welcome back');
});

// ✅ Use unauthenticatedPage for auth flow tests
test('user can log in', async ({ unauthenticatedPage }) => {
  await unauthenticatedPage.goto('/login');
  // Test login flow from scratch
});

// ✅ Use manual auth for edge cases

test('expired session redirects to login', async ({ page }) => {
  // Manually set expired token
  await page.context().addCookies([{
    name: 'session',
    value: 'expired-token',
    domain: 'localhost',
    path: '/',
  }]);
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login?redirect=/dashboard');
});
```

### Using apiMocking for Consistent Responses

```typescript
// fixtures.ts
export const test = base.extend<{
  apiMocking: ApiMockingFixture;
}>({
  apiMocking: async ({ page }, use) => {
    const mocks = new Map<string, MockConfig>();
    
    const apiMocking = {
      mock: async (url: string, response: unknown, options?: MockOptions) => {
        await page.route(url, async (route, request) => {
          const key = `${request.method()}:${url}`;
          const mock = mocks.get(key);
          
          if (mock) {
            await route.fulfill({
              status: mock.status || 200,
              contentType: 'application/json',
              body: JSON.stringify(mock.response),
              ...options,
            });
          } else {
            await route.continue();
          }
        });
        
        mocks.set(url, { response, status: options?.status });
      },
      
      unmock: async (url: string) => {
        mocks.delete(url);
        await page.unroute(url);
      },
      
      clearAll: async () => {
        for (const url of mocks.keys()) {
          await page.unroute(url);
        }
        mocks.clear();
      },
    };
    
    await use(apiMocking);
    await apiMocking.clearAll();
  },
});

// Usage in tests
test('dashboard shows user stats', async ({ page, apiMocking }) => {
  await apiMocking.mock('**/api/user/stats', {
    totalProjects: 5,
    completedTasks: 42,
    streakDays: 7,
  });
  
  await page.goto('/dashboard');
  await expect(page.locator('[data-testid="project-count"]')).
    toHaveText('5');
});
```

### Performance Metrics Collection

```typescript
// fixtures.ts
export const test = base.extend<{
  performanceMetrics: PerformanceMetrics;
}>({
  performanceMetrics: async ({ page }, use, testInfo) => {
    const metrics: PerformanceData = {
      navigationTiming: [],
      resourceTiming: [],
      memoryUsage: [],
      customMetrics: {},
    };

    // Collect Web Vitals
    page.on('console', async (msg) => {
      if (msg.type() === 'debug') {
        const text = msg.text();
        if (text.startsWith('web-vital:')) {
          const [, name, value] = text.split(':');
          metrics.customMetrics[name] = parseFloat(value);
        }
      }
    });

    await use({
      recordNavigation: async () => {
        const timing = await page.evaluate(() =>
          JSON.stringify(performance.getEntriesByType('navigation')[0])
        );
        metrics.navigationTiming.push(JSON.parse(timing));
      },
      
      getMetrics: () => metrics,
      
      assertThreshold: (metric: string, threshold: number) => {
        const value = metrics.customMetrics[metric];
        expect(value).toBeLessThan(threshold);
      },
    });

    // Attach metrics to test report
    testInfo.attach('performance-metrics.json', {
      body: JSON.stringify(metrics, null, 2),
      contentType: 'application/json',
    });
  },
});

// Usage
test('page loads within performance budget', async ({ 
  page, 
  performanceMetrics 
}) => {
  await page.goto('/heavy-page');
  await performanceMetrics.recordNavigation();
  
  performanceMetrics.assertThreshold('LCP', 2500);
  performanceMetrics.assertThreshold('FID', 100);
  performanceMetrics.assertThreshold('CLS', 0.1);
});
```

### Test Data Factories

```typescript
// factories/user.factory.ts
export interface UserFactoryOptions {
  role?: 'admin' | 'user' | 'guest';
  withProjects?: number;
  verified?: boolean;
}

export async function createUserFactory(
  api: APIRequestContext,
  options: UserFactoryOptions = {},
  testInfo?: TestInfo
): Promise<TestUser> {
  const suffix = testInfo ? `${testInfo.workerIndex}-${Date.now()}` : Date.now();
  
  const user = await api.post('/api/users', {
    data: {
      email: `user-${suffix}@test.com`,
      name: `Test User ${suffix}`,
      role: options.role || 'user',
      verified: options.verified ?? true,
    },
  }).then(r => r.json());

  if (options.withProjects) {
    await Promise.all(
      Array.from({ length: options.withProjects }, (_, i) =>
        api.post('/api/projects', {
          data: {
            name: `Project ${i + 1}`,
            ownerId: user.id,
          },
        })
      )
    );
  }

  return user;
}

// fixtures.ts
export const test = base.extend<{
  userFactory: (opts?: UserFactoryOptions) => Promise<TestUser>;
}>({
  userFactory: async ({ request }, use, testInfo) => {
    const createdUsers: string[] = [];
    
    const factory = async (options?: UserFactoryOptions) => {
      const user = await createUserFactory(request, options, testInfo);
      createdUsers.push(user.id);
      return user;
    };
    
    await use(factory);
    
    // Cleanup all created users
    await Promise.all(
      createdUsers.map(id => request.delete(`/api/users/${id}`))
    );
  },
});

// Usage
test('admin can delete any project', async ({ page, userFactory }) => {
  const admin = await userFactory({ role: 'admin' });
  const regularUser = await userFactory({ 
    role: 'user', 
    withProjects: 3 
  });
  
  await page.goto('/admin/projects');
  // Test admin deletion capabilities
});
```

### Cleanup Patterns

```typescript
// fixtures.ts - Automatic cleanup with disposal pattern
export const test = base.extend<{
  tempFile: (content: string) => Promise<string>;
  database: DatabaseFixture;
}>({
  tempFile: async ({}, use, testInfo) => {
    const createdFiles: string[] = [];
    
    const createTempFile = async (content: string): Promise<string> => {
      const path = `./temp/${testInfo.testId}-${Date.now()}.txt`;
      await fs.mkdir('./temp', { recursive: true });
      await fs.writeFile(path, content);
      createdFiles.push(path);
      return path;
    };
    
    await use(createTempFile);
    
    // Cleanup: runs even if test fails
    await Promise.all(
      createdFiles.map(file => 
        fs.unlink(file).catch(() => {}) // Ignore errors
      )
    );
  },

  database: async ({}, use) => {
    const connection = await createTestDatabase();
    
    await use({
      query: (sql: string) => connection.query(sql),
      transaction: async (fn: (trx: Transaction) => Promise<void>) => {
        const trx = await connection.beginTransaction();
        try {
          await fn(trx);
          await trx.commit();
        } catch (e) {
          await trx.rollback();
          throw e;
        }
      },
    });
    
    // Always cleanup connection
    await connection.close();
  },
});

// Cleanup with retry logic for flaky resources
async function cleanupWithRetry(
  cleanupFn: () => Promise<void>,
  maxRetries = 3
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await cleanupFn();
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 100 * (i + 1)));
    }
  }
}
```

---

## 3. Selector Optimization

### Prefer data-testid over CSS Classes

```typescript
// ❌ Bad: Brittle selectors prone to breaking
await page.click('.btn-primary'); // Class name changes
await page.fill('input[name="email"]'); // Name attribute changes
await page.click('#submit-button'); // ID might not be unique

// ✅ Good: Stable data-testid selectors
await page.click('[data-testid="login-submit"]');
await page.fill('[data-testid="email-input"]');
await page.click('[data-testid="create-project-button"]');

// ✅ Even better: Use custom locator helpers
// selectors.ts
export const selectors = {
  login: {
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    submitButton: '[data-testid="login-submit"]',
  },
  dashboard: {
    projectList: '[data-testid="project-list"]',
    projectItem: (name: string) => `[data-testid="project-item-${name}"]`,
    createButton: '[data-testid="create-project-button"]',
  },
} as const;

// Usage
import { selectors } from './selectors';

await page.fill(selectors.login.emailInput, 'test@example.com');
await page.click(selectors.dashboard.projectItem('My Project'));
```

### Use Playwright's Built-in Locators

```typescript
// ❌ Bad: Generic selector methods
await page.click('text=Submit'); // Ambiguous
await page.fill('.form input', 'value'); // Not specific

// ✅ Good: Semantic locators
// By role (preferred - accessible and robust)
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
await page.getByRole('checkbox', { name: 'Accept terms' }).check();

// By label text
await page.getByLabel('Password').fill('secret');

// By placeholder
await page.getByPlaceholder('Search projects...').fill('query');

// By text (exact or partial)
await page.getByText('Welcome back');
await page.getByText(/welcome back/i); // Case-insensitive regex

// By title
await page.getByTitle('Close dialog').click();

// By alt text (images)
await page.getByAltText('User avatar');

// By test ID (your custom data-testid)
await page.getByTestId('submit-button').click();
```

### Avoid XPath When Possible

```typescript
// ❌ Bad: XPath - hard to read, slow, brittle
await page.click('//div[@class="container"]//button[contains(text(), "Submit")]');

// ✅ Good: Playwright locators - readable, fast, resilient
await page
  .locator('[data-testid="form-container"]')
  .getByRole('button', { name: 'Submit' })
  .click();

// If you must use XPath, limit scope first
const table = page.getByTestId('users-table');
await table.locator('xpath=.//tr[contains(@class, "active")]').first().click();
```

### Chain Locators for Specificity

```typescript
// ❌ Bad: Vague global selectors
await page.click('button'); // Clicks first button on page

// ✅ Good: Scoped, specific locators
// Narrow scope progressively
const projectCard = page.getByTestId('project-card-123');
const actionsMenu = projectCard.getByRole('button', { name: 'Actions' });
await actionsMenu.click();

const deleteOption = projectCard.getByRole('menuitem', { name: 'Delete' });
await deleteOption.click();

// Complex chained example
const notification = page
  .getByTestId('notification-toast')
  .filter({ hasText: 'Success' })
  .getByRole('button', { name: 'Dismiss' });

await notification.click();

// Using has: for parent-child relationships
const activeProject = page
  .getByTestId('project-item')
  .filter({ has: page.getByText('Active') });

await activeProject.click();

// Combining multiple filters
const urgentTask = page
  .getByTestId('task-item')
  .filter({ has: page.getByTestId('urgent-badge') })
  .filter({ hasText: /due today/i });

await urgentTask.getByRole('button', { name: 'Complete' }).click();
```

---

## 4. Waiting Strategies

### Use Web-First Assertions

```typescript
// ❌ Bad: Manual waits with expect
await page.waitForTimeout(1000); // Never do this
await expect(page.locator('[data-testid="item"]')).toHaveCount(5);

// ✅ Good: Auto-retrying assertions
// These automatically retry until condition is met or timeout
await expect(page.getByTestId('item')).toHaveCount(5);
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByText('Loading...')).toBeHidden();

// With custom timeout for slower operations
await expect(page.getByTestId('report-generated')).toBeVisible({ 
  timeout: 30000 
});

// Assertion list
await expect(page.getByTestId('user-name')).toHaveText('John Doe');
await expect(page.getByTestId('user-name')).toContainText('John');
await expect(page.getByTestId('user-name')).toHaveAttribute('data-id', '123');
await expect(page.getByTestId('user-name')).toHaveClass('highlighted');
await expect(page.getByTestId('count')).toHaveValue('42');
await expect(page.getByTestId('checkbox')).toBeChecked();
await expect(page.getByRole('link', { name: 'Next' })).toHaveURL(/page=2/);
```

### Prefer waitForLoadState over Timeouts

```typescript
// ❌ Bad: Fixed timeout
await page.waitForTimeout(2000);

// ✅ Good: Wait for specific load states
await page.goto('/page');
await page.waitForLoadState('load');      // Wait for load event
await page.waitForLoadState('domcontentloaded'); // Wait for DOM
await page.waitForLoadState('networkidle'); // Wait for network to be idle

// Combined with navigation
await page.goto('/page', { waitUntil: 'networkidle' });

// Wait for specific element after load
await page.goto('/dashboard');
await page.waitForLoadState('networkidle');
await expect(page.getByTestId('dashboard-ready')).toBeVisible();

// Wait for API response after action
await page.getByRole('button', { name: 'Save' }).click();
await page.waitForResponse('**/api/save');
await expect(page.getByText('Saved successfully')).toBeVisible();
```

### Use expect.poll for Dynamic Content

```typescript
// ❌ Bad: Multiple assertions with delays
let value = 0;
for (let i = 0; i < 10; i++) {
  value = await page.getByTestId('counter').textContent();
  if (value === '5') break;
  await page.waitForTimeout(500);
}

// ✅ Good: expect.poll for polling dynamic values
await expect.poll(
  async () => {
    return await page.getByTestId('counter').textContent();
  },
  {
    message: 'Counter should reach 5',
    timeout: 10000,
    intervals: [100, 250, 500, 1000], // Progressive backoff
  }
).toBe('5');

// Polling with complex conditions
await expect.poll(
  async () => {
    const response = await page.request.get('/api/status');
    return response.json();
  },
  {
    timeout: 60000,
  }
).toEqual(expect.objectContaining({
  status: 'completed',
  progress: 100,
}));

// expect.toPass for retrying blocks
await expect(async () => {
  await page.getByRole('button', { name: 'Refresh' }).click();
  const response = await page.waitForResponse('**/api/data');
  expect(await response.json()).toHaveProperty('updated');
}).toPass({ timeout: 30000 });
```

### Avoid Fixed Wait Times

```typescript
// ❌ Bad: Never use fixed timeouts
await page.waitForTimeout(1000); // Flaky and slow

// ✅ Good: Wait for specific conditions
// Instead of waiting for animation
await page.waitForFunction(() => {
  const element = document.querySelector('[data-testid="modal"]');
  return element && getComputedStyle(element).opacity === '1';
});

// Or use CSS transitionend event
await page.locator('[data-testid="modal"]').evaluate(el => {
  return Promise.race([
    new Promise(resolve => {
      el.addEventListener('transitionend', resolve, { once: true });
    }),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Animation timeout')), 5000)
    ),
  ]);
});

// Wait for element to be stable (not animating)
await page.getByTestId('tooltip').waitFor({ state: 'visible' });

// Custom wait with polling
async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout = 10000,
  interval = 100
): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) return;
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error('Condition not met within timeout');
}
```

---

## 5. API Mocking Best Practices

### Mock at Worker Level When Possible

```typescript
// fixtures.ts - Worker-scoped API mocking
export const test = base.extend<{}, { apiMocks: ApiMockRegistry }>({
  apiMocks: [async ({}, use, workerInfo) => {
    // Setup once per worker
    const mocks = new Map<string, MockHandler>();
    
    const registry = {
      register: (pattern: string, handler: MockHandler) => {
        mocks.set(pattern, handler);
      },
      apply: async (page: Page) => {
        for (const [pattern, handler] of mocks) {
          await page.route(pattern, handler);
        }
      },
      clear: async (page: Page) => {
        for (const pattern of mocks.keys()) {
          await page.unroute(pattern);
        }
      },
    };
    
    await use(registry);
  }, { scope: 'worker' }],

  // Apply worker mocks + test-specific mocks
  page: async ({ apiMocks, browser }, use, testInfo) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Apply worker-scoped mocks
    await apiMocks.apply(page);
    
    // Apply test-specific mocks via testInfo
    const testMocks = testInfo.project.use.testMocks || [];
    for (const mock of testMocks) {
      await page.route(mock.pattern, mock.handler);
    }
    
    await use(page);
    
    await apiMocks.clear(page);
    await context.close();
  },
});
```

### Use Scenarios for Different States

```typescript
// scenarios.ts - Reusable mock scenarios
export const scenarios = {
  emptyState: async (page: Page) => {
    await page.route('**/api/projects', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: [], total: 0 }),
      });
    });
    await page.route('**/api/dashboard/stats', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ projects: 0, tasks: 0 }),
      });
    });
  },

  loadingState: async (page: Page) => {
    await page.route('**/api/projects', async route => {
      await new Promise(r => setTimeout(r, 5000)); // Simulate slow API
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ data: mockProjects }),
      });
    });
  },

  errorState: async (page: Page, errorType: 'network' | 'server' | 'auth') => {
    const responses = {
      network: () => route => route.abort('timedout'),
      server: () => async route => {
        await route.fulfill({ status: 500, body: 'Server Error' });
      },
      auth: () => async route => {
        await route.fulfill({ status: 401, body: 'Unauthorized' });
      },
    };
    
    await page.route('**/api/**', responses[errorType]());
  },

  paginatedData: async (page: Page, { page: pageNum, perPage = 10 }) => {
    await page.route('**/api/projects**', async route => {
      const url = new URL(route.request().url());
      const start = (parseInt(url.searchParams.get('page') || '1') - 1) * perPage;
      
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: mockProjects.slice(start, start + perPage),
          total: mockProjects.length,
          page: pageNum,
          perPage,
        }),
      });
    });
  },
};

// Usage in tests
test.describe('Project List States', () => {
  test('shows empty state when no projects', async ({ page }) => {
    await scenarios.emptyState(page);
    await page.goto('/projects');
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('handles network errors gracefully', async ({ page }) => {
    await scenarios.errorState(page, 'network');
    await page.goto('/projects');
    await expect(page.getByTestId('error-message')).toContainText('network');
  });

  test('paginates through large datasets', async ({ page }) => {
    await scenarios.paginatedData(page, { page: 2, perPage: 10 });
    await page.goto('/projects?page=2');
    await expect(page.getByTestId('project-item')).toHaveCount(10);
  });
});
```

### Unmock After Tests

```typescript
// fixtures.ts - Proper cleanup pattern
export const test = base.extend<{
  withMocking: (mocks: MockConfig[]) => Promise<void>;
}>({
  withMocking: async ({ page }, use) => {
    const activeRoutes: string[] = [];
    
    const setupMocks = async (mocks: MockConfig[]) => {
      for (const mock of mocks) {
        await page.route(mock.url, mock.handler);
        activeRoutes.push(mock.url);
      }
    };
    
    await use(setupMocks);
    
    // Cleanup: unroute all active routes
    for (const url of activeRoutes) {
      try {
        await page.unroute(url);
      } catch (e) {
        console.warn(`Failed to unroute ${url}:`, e);
      }
    }
  },
});

// Alternative: Auto-cleanup with page.route helper
test('with temporary mock', async ({ page }) => {
  // Setup mock
  const unroute = await page.route('**/api/temp', async route => {
    await route.fulfill({ body: JSON.stringify({ temp: true }) });
  });
  
  try {
    await page.goto('/temp-page');
    // Test with mock
  } finally {
    // Always cleanup
    await page.unroute('**/api/temp');
  }
});
```

### Handle Network Race Conditions

```typescript
// fixtures.ts - Race condition handling
export const test = base.extend<{
  waitForApiCall: (url: string, action: () => Promise<void>) => Promise<Response>;
}>({
  waitForApiCall: async ({ page }, use) => {
    const waitForApiCall = async (
      urlPattern: string, 
      action: () => Promise<void>
    ): Promise<Response> => {
      // Start waiting BEFORE the action
      const responsePromise = page.waitForResponse(response => 
        response.url().includes(urlPattern) && response.status() === 200
      );
      
      // Execute the action
      await action();
      
      // Wait for response with timeout
      return await responsePromise;
    };
    
    await use(waitForApiCall);
  },
});

// Usage
test('saves form data', async ({ page, waitForApiCall }) => {
  await page.goto('/form');
  await page.fill('[data-testid="name"]', 'John');
  
  const response = await waitForApiCall('/api/save', async () => {
    await page.click('[data-testid="submit"]');
  });
  
  expect(await response.json()).toEqual({ saved: true });
});

// Handle multiple concurrent requests
test('loads dashboard with parallel requests', async ({ page }) => {
  const [userResponse, statsResponse, projectsResponse] = await Promise.all([
    page.waitForResponse('**/api/user'),
    page.waitForResponse('**/api/stats'),
    page.waitForResponse('**/api/projects'),
    page.goto('/dashboard'),
  ]);
  
  expect(userResponse.status()).toBe(200);
  expect(statsResponse.status()).toBe(200);
  expect(projectsResponse.status()).toBe(200);
});

// Debounce handling
async function waitForDebounce(
  page: Page,
  action: () => Promise<void>,
  debounceMs = 300
): Promise<void> {
  await action();
  await page.waitForTimeout(debounceMs + 50); // Wait for debounce + buffer
}

test('search with debounce', async ({ page }) => {
  await page.goto('/search');
  
  // Type rapidly
  await page.fill('[data-testid="search"]', 'test query');
  
  // Wait for debounce
  await page.waitForTimeout(350);
  
  // Now wait for results
  await expect(page.getByTestId('search-results')).toBeVisible();
});
```

---

## 6. Visual Testing

### When to Use Visual Regression

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Enable screenshots on failure
    screenshot: 'only-on-failure',
    
    // Enable video recording for debugging
    video: 'retain-on-failure',
    
    // Enable trace for detailed debugging
    trace: 'on-first-retry',
  },
  
  // Visual comparison configuration
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
});

// Visual tests - use sparingly for critical UI components
test.describe('Critical UI Components', () => {
  test('button states', async ({ page }) => {
    await page.goto('/components/buttons');
    
    const button = page.getByTestId('primary-button');
    
    // Default state
    await expect(button).toHaveScreenshot('button-default.png');
    
    // Hover state
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');
    
    // Disabled state
    await page.check('[data-testid="disable-checkbox"]');
    await expect(button).toHaveScreenshot('button-disabled.png');
  });

  test('responsive layout @desktop @mobile', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-desktop.png');
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-mobile.png');
  });
});
```

### Masking Dynamic Content

```typescript
// Mask dynamic content in visual tests
test('dashboard layout', async ({ page }) => {
  await page.goto('/dashboard');
  
  await expect(page).toHaveScreenshot('dashboard.png', {
    // Mask elements that change (timestamps, random IDs, etc.)
    mask: [
      page.getByTestId('current-time'),
      page.getByTestId('user-id'),
      page.getByTestId('session-token'),
      page.locator('.timestamp'),
    ],
    
    // Or mask by CSS selector
    maskColor: '#FF00FF', // Bright color for debugging
  });
});

// Clip to specific region
test('chart component', async ({ page }) => {
  const chart = page.getByTestId('revenue-chart');
  const box = await chart.boundingBox();
  
  await expect(page).toHaveScreenshot('chart.png', {
    clip: box,
  });
});

// Full page with specific exclusions
test('full page layout', async ({ page }) => {
  await page.goto('/report');
  
  await expect(page).toHaveScreenshot('report-full.png', {
    fullPage: true,
    mask: [
      // Dynamic content
      page.locator('[data-dynamic="true"]'),
      // Third-party widgets
      page.frameLocator('[data-testid="analytics-widget"]').locator('body'),
    ],
  });
});
```

### Handling Animations

```typescript
// Disable animations for consistent screenshots
test.beforeEach(async ({ page }) => {
  // Disable CSS animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0ms !important;
        animation-delay: 0ms !important;
        transition-duration: 0ms !important;
        transition-delay: 0ms !important;
      }
    `,
  });
  
  // Or via JavaScript
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      * { 
        animation-play-state: paused !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  });
});

// Wait for specific animation end
test('modal animation', async ({ page }) => {
  await page.click('[data-testid="open-modal"]');
  
  const modal = page.getByTestId('modal');
  
  // Wait for animation to complete
  await modal.waitFor({ state: 'visible' });
  await modal.evaluate(el => {
    return new Promise(resolve => {
      const onTransitionEnd = () => {
        el.removeEventListener('transitionend', onTransitionEnd);
        resolve(undefined);
      };
      el.addEventListener('transitionend', onTransitionEnd);
    });
  });
  
  await expect(modal).toHaveScreenshot('modal-open.png');
});
```

### Cross-Browser Visual Testing

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    // Chromium
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // Firefox
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // WebKit
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },
    // Mobile
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Different thresholds per browser (if needed)
  expect: {
    toHaveScreenshot: {
      _comparator: 'pixelmatch',
      threshold: 0.2,
      maxDiffPixels: 100,
    },
  },
});

// Browser-specific test logic
test('component renders correctly', async ({ page, browserName }) => {
  await page.goto('/component');
  
  // Handle browser-specific differences
  if (browserName === 'webkit') {
    // WebKit-specific adjustments
    await page.waitForTimeout(100); // Font loading
  }
  
  await expect(page).toHaveScreenshot(`component-${browserName}.png`);
});
```

---

## 7. CI/CD Optimization

### Shard Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  // Automatic sharding for CI
  shard: process.env.CI ? {
    total: Number(process.env.SHARD_TOTAL) || 1,
    current: Number(process.env.SHARD_INDEX) || 0,
  } : undefined,
  
  // Or manual shard groups
  projects: [
    {
      name: 'shard-1',
      testMatch: /.*\.spec\.ts/,
      grepInvert: [/@slow/, /@flaky/],
    },
    {
      name: 'shard-2-slow',
      testMatch: /.*\.spec\.ts/,
      grep: /@slow/,
    },
    {
      name: 'shard-3-flaky',
      testMatch: /.*\.spec\.ts/,
      grep: /@flaky/,
      retries: 3,
    },
  ],
});
```

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      shard-total: ${{ steps.setup.outputs.shard-total }}
    steps:
      - id: setup
        run: echo "shard-total=4" >> $GITHUB_OUTPUT

  test:
    needs: setup
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      
      - name: Run E2E tests
        run: npx playwright test --shard=${{ matrix.shard }}/${{ needs.setup.outputs.shard-total }}
        env:
          CI: true
          BASE_URL: http://localhost:3000
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results-shard-${{ matrix.shard }}
          path: |
            playwright-report/
            test-results/
          retention-days: 7

  merge-reports:
    needs: test
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/download-artifact@v4
        with:
          path: all-reports
          pattern: test-results-shard-*
      
      - name: Merge reports
        run: npx playwright merge-reports all-reports --reporter html
      
      - name: Upload merged report
        uses: actions/upload-artifact@v4
        with:
          name: merged-report
          path: playwright-report/
```

### Worker Count Tuning

```typescript
// playwright.config.ts
import os from 'os';

function getOptimalWorkers(): number {
  if (process.env.CI) {
    // CI environment - use all available resources
    return '100%' as any;
  }
  
  // Local development - leave resources for other tasks
  const cpus = os.cpus().length;
  const memoryGB = os.totalmem() / 1024 / 1024 / 1024;
  
  // Estimate: each worker needs ~1GB RAM + 1 CPU core
  const cpuWorkers = Math.max(1, cpus - 1);
  const memoryWorkers = Math.floor(memoryGB / 1.5);
  
  return Math.min(cpuWorkers, memoryWorkers, 8);
}

export default defineConfig({
  workers: getOptimalWorkers(),
  
  // Limit concurrent tests per worker for heavy tests
  fullyParallel: true,
  
  // Per-project worker settings
  projects: [
    {
      name: 'lightweight',
      testMatch: /.*unit\.spec\.ts/,
      // Default workers
    },
    {
      name: 'heavyweight',
      testMatch: /.*integration\.spec\.ts/,
      use: {
        // Reduce parallel tests in this project
        actionTimeout: 60000,
      },
    },
  ],
});
```

### Artifact Management

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Artifact configuration
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    
    // Storage for auth state
    storageState: process.env.CI ? undefined : 'playwright/.auth/user.json',
  },
  
  // Reporter configuration with artifacts
  reporter: [
    ['list'],
    ['html', { 
      open: 'never',
      outputFolder: 'playwright-report',
    }],
    ['json', { 
      outputFile: 'playwright-report/results.json',
    }],
    process.env.CI ? ['github'] : ['null'],
    [
      'monocart-reporter', 
      { 
        name: 'E2E Test Report',
        outputFile: './playwright-report/monocart-report.html',
        attachmentPath: (relativePath) => {
          // Handle path for different environments
          return `https://ci-artifacts.example.com/${process.env.BUILD_ID}/${relativePath}`;
        },
      },
    ],
  ],
  
  // Preserve output for debugging
  preserveOutput: 'failures-only',
});
```

```yaml
# .github/workflows/e2e.yml - Artifact optimization
- name: Upload test artifacts
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: test-failures-${{ github.run_id }}-${{ matrix.shard }}
    path: |
      test-results/
      playwright-report/
    retention-days: 3  # Short retention for large artifacts
    compression-level: 9

- name: Upload traces on demand
  uses: actions/upload-artifact@v4
  if: failure() && contains(github.event.head_commit.message, '[trace]')
  with:
    name: detailed-traces-${{ github.run_id }}
    path: test-results/**/*.zip
    retention-days: 7
```

### Parallel Job Setup

```yaml
# .github/workflows/e2e-parallel.yml
name: Parallel E2E Suite

on: [push, pull_request]

jobs:
  # Job 1: Build application
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/

  # Job 2: Unit-like E2E (fast, parallel)
  e2e-fast:
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: npm ci
      - run: npx playwright install chromium
      - run: |
          npx playwright test 
            --grep-invert /@slow|@flaky/
            --shard=${{ matrix.shard }}/4

  # Job 3: Slow tests (sequential, longer timeout)
  e2e-slow:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: npm ci
      - run: npx playwright install
      - run: |
          npx playwright test 
            --grep=@slow
            --workers=2
            --timeout=120000

  # Job 4: Cross-browser (matrix)
  e2e-cross-browser:
    needs: build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
        shard: [1, 2]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: dist/
      - run: npm ci
      - run: npx playwright install ${{ matrix.browser }}
      - run: |
          npx playwright test 
            --project=${{ matrix.browser }}
            --shard=${{ matrix.shard }}/2
```

---

## 8. Debugging Techniques

### Trace Viewer Usage

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Trace collection strategies
    trace: 'on',              // Collect for all tests
    trace: 'on-first-retry',  // Collect only on first retry
    trace: 'retain-on-failure', // Keep only failed tests
    trace: 'off',             // Disable for performance
    
    // Fine-grained trace options
    trace: {
      mode: 'on-first-retry',
      snapshots: true,
      screenshots: true,
      sources: true,
    },
  },
});
```

```bash
# Run tests with trace
cd website/e2e
npx playwright test --trace on

# Open trace viewer
npx playwright show-trace test-results/trace.zip

# Open trace from URL
npx playwright show-trace https://example.com/trace.zip

# Run specific test with trace
npx playwright test my-test.spec.ts --trace on --reporter line

# Show trace for failed tests only
npx playwright test --trace retain-on-failure
```

```typescript
// Add custom trace annotations
test('complex workflow', async ({ page }, testInfo) => {
  // Add annotation
  testInfo.annotations.push({ 
    type: 'test-data', 
    description: JSON.stringify({ userId: '123', scenario: 'premium' }),
  });
  
  // Add timeline marker
  await page.evaluate(() => {
    performance.mark('test-step-1-start');
  });
  
  await page.goto('/workflow');
  
  await page.evaluate(() => {
    performance.mark('test-step-1-end');
    performance.measure('step-1', 'test-step-1-start', 'test-step-1-end');
  });
  
  // Add screenshot at specific point
  await testInfo.attach('midpoint-screenshot', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
```

### Screenshot Capture Strategies

```typescript
// fixtures.ts - Enhanced screenshot capabilities
export const test = base.extend<{
  screenshotOnFailure: ScreenshotHelper;
}>({
  screenshotOnFailure: async ({ page }, use, testInfo) => {
    const screenshots: Buffer[] = [];
    
    const helper = {
      capture: async (name: string, options?: PageScreenshotOptions) => {
        const screenshot = await page.screenshot({
          fullPage: true,
          ...options,
        });
        
        await testInfo.attach(`screenshot-${name}.png`, {
          body: screenshot,
          contentType: 'image/png',
        });
        
        screenshots.push(screenshot);
      },
      
      captureElement: async (selector: string, name: string) => {
        const element = page.locator(selector);
        const screenshot = await element.screenshot();
        
        await testInfo.attach(`element-${name}.png`, {
          body: screenshot,
          contentType: 'image/png',
        });
      },
    };
    
    await use(helper);
    
    // Auto-capture on failure
    if (testInfo.status !== 'passed' && testInfo.status !== 'skipped') {
      await helper.capture('failure-state', { timeout: 5000 });
      
      // Capture console logs
      const logs = await page.evaluate(() => {
        return (window as any).testLogs || [];
      });
      
      await testInfo.attach('console-logs.txt', {
        body: Buffer.from(JSON.stringify(logs, null, 2)),
        contentType: 'text/plain',
      });
    }
  },
});

// Manual screenshot at key points
test('checkout flow', async ({ page, screenshotOnFailure }) => {
  await page.goto('/cart');
  await screenshotOnFailure.capture('cart-page');
  
  await page.click('[data-testid="checkout"]');
  await screenshotOnFailure.capture('checkout-page');
  
  await page.fill('[data-testid="address"]', '123 Test St');
  await screenshotOnFailure.captureElement(
    '[data-testid="address-form"]', 
    'filled-address'
  );
});
```

### Console Log Monitoring

```typescript
// fixtures.ts - Console log capture
export const test = base.extend<{
  consoleLogs: ConsoleLogFixture;
}>({
  consoleLogs: async ({ page }, use, testInfo) => {
    const logs: ConsoleMessage[] = [];
    const errors: ConsoleMessage[] = [];
    const warnings: ConsoleMessage[] = [];
    
    page.on('console', msg => {
      const entry = {
        type: msg.type(),
        text: msg.text(),
        location: msg.location(),
        time: new Date().toISOString(),
      };
      
      logs.push(entry);
      
      if (msg.type() === 'error') {
        errors.push(entry);
      } else if (msg.type() === 'warning') {
        warnings.push(entry);
      }
    });
    
    page.on('pageerror', error => {
      errors.push({
        type: 'pageerror',
        text: error.message,
        stack: error.stack,
        time: new Date().toISOString(),
      });
    });
    
    await use({
      getLogs: () => logs,
      getErrors: () => errors,
      getWarnings: () => warnings,
      hasErrors: () => errors.length > 0,
      assertNoErrors: () => {
        expect(errors).toHaveLength(0);
      },
    });
    
    // Attach logs to test report
    if (logs.length > 0) {
      await testInfo.attach('console-logs.json', {
        body: Buffer.from(JSON.stringify({
          logs,
          errors,
          warnings,
        }, null, 2)),
        contentType: 'application/json',
      });
    }
  },
});

// Usage
test('page has no console errors', async ({ page, consoleLogs }) => {
  await page.goto('/app');
  await page.waitForLoadState('networkidle');
  
  consoleLogs.assertNoErrors();
});

test('specific error is logged', async ({ page, consoleLogs }) => {
  await page.goto('/error-page');
  
  await page.waitForTimeout(1000);
  
  const errorLogs = consoleLogs.getErrors();
  expect(errorLogs).toContainEqual(
    expect.objectContaining({
      text: expect.stringContaining('Expected error'),
    })
  );
});
```

### Network Inspection

```typescript
// fixtures.ts - Network monitoring
export const test = base.extend<{
  networkMonitor: NetworkMonitorFixture;
}>({
  networkMonitor: async ({ page }, use, testInfo) => {
    const requests: Request[] = [];
    const responses: Response[] = [];
    const failedRequests: { request: Request; failure: string }[] = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        time: Date.now(),
      });
    });
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers(),
        time: Date.now(),
      });
    });
    
    page.on('requestfailed', request => {
      failedRequests.push({
        request: {
          url: request.url(),
          method: request.method(),
        },
        failure: request.failure()?.errorText || 'Unknown',
      });
    });
    
    await use({
      getRequests: (filter?: string) => 
        filter ? requests.filter(r => r.url.includes(filter)) : requests,
      
      getResponses: (filter?: string) =>
        filter ? responses.filter(r => r.url.includes(filter)) : responses,
      
      getFailedRequests: () => failedRequests,
      
      findRequest: (predicate: (req: Request) => boolean) =>
        requests.find(predicate),
      
      assertNoFailedRequests: () => {
        expect(failedRequests).toHaveLength(0);
      },
      
      getTimingReport: () => {
        const report = responses.map(r => ({
          url: r.url,
          status: r.status,
          duration: r.time - (requests.find(q => q.url === r.url)?.time || r.time),
        }));
        
        return {
          total: report.length,
          byStatus: report.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
          }, {} as Record<number, number>),
          slowRequests: report.filter(r => r.duration > 1000),
        };
      },
    });
    
    // Attach network report
    await testInfo.attach('network-report.json', {
      body: Buffer.from(JSON.stringify({
        requests: requests.length,
        responses: responses.length,
        failed: failedRequests,
        timing: responses.map(r => ({
          url: r.url.split('?')[0], // Strip query params
          status: r.status,
        })),
      }, null, 2)),
      contentType: 'application/json',
    });
  },
});

// Usage
test('API calls succeed', async ({ page, networkMonitor }) => {
  await page.goto('/data-page');
  await page.waitForLoadState('networkidle');
  
  networkMonitor.assertNoFailedRequests();
  
  const apiCalls = networkMonitor.getRequests('/api/');
  expect(apiCalls.length).toBeGreaterThan(0);
  
  const timing = networkMonitor.getTimingReport();
  expect(timing.slowRequests).toHaveLength(0);
});

test('specific API is called', async ({ page, networkMonitor }) => {
  await page.click('[data-testid="fetch-data"]');
  
  await page.waitForTimeout(100);
  
  const saveRequest = networkMonitor.findRequest(
    r => r.url.includes('/api/save') && r.method === 'POST'
  );
  
  expect(saveRequest).toBeDefined();
  expect(saveRequest?.postData).toContain('expectedData');
});
```

---

## Troubleshooting Tips

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Flaky tests | Race conditions, timing issues | Use auto-retrying assertions, avoid `waitForTimeout` |
| Slow tests | Excessive setup, no parallelism | Use worker fixtures, configure `fullyParallel` |
| Timeout errors | Network delays, slow selectors | Increase `timeout`, use more specific selectors |
| Auth failures | Expired tokens, race conditions | Use `storageState`, implement proper login flow |
| Memory issues | Leaked contexts/pages | Always close contexts in fixtures |
| Screenshot differences | Animations, dynamic content | Disable animations, use masking |

### Debug Mode Commands

```bash
# Run in debug mode (step-through)
npx playwright test --debug

# Run with inspector
PWDEBUG=1 npx playwright test

# Run specific test with verbose output
npx playwright test my-test.spec.ts --reporter=list --verbose

# Run with slow motion (for visual debugging)
npx playwright test --headed --workers=1

# Generate and view trace
npx playwright test --trace on && npx playwright show-trace test-results/

# Debug specific browser only
npx playwright test --project=chromium --debug
```

### Performance Profiling

```typescript
// fixtures.ts - Performance profiling
export const test = base.extend<{
  profiler: PerformanceProfiler;
}>({
  profiler: async ({ page }, use, testInfo) => {
    const marks: { name: string; time: number }[] = [];
    
    const profiler = {
      mark: (name: string) => {
        marks.push({ name, time: performance.now() });
      },
      
      measure: (startMark: string, endMark: string): number => {
        const start = marks.find(m => m.name === startMark)?.time;
        const end = marks.find(m => m.name === endMark)?.time;
        return start && end ? end - start : 0;
      },
      
      getReport: () => {
        const report = [];
        for (let i = 1; i < marks.length; i++) {
          report.push({
            step: marks[i].name,
            duration: marks[i].time - marks[i - 1].time,
          });
        }
        return report;
      },
      
      profilePage: async () => {
        return await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          return {
            dns: nav.domainLookupEnd - nav.domainLookupStart,
            connect: nav.connectEnd - nav.connectStart,
            ttfb: nav.responseStart - nav.requestStart,
            download: nav.responseEnd - nav.responseStart,
            domReady: nav.domContentLoadedEventEnd - nav.startTime,
            loadComplete: nav.loadEventEnd - nav.startTime,
          };
        });
      },
    };
    
    await use(profiler);
    
    // Attach profile report
    if (marks.length > 0) {
      await testInfo.attach('performance-profile.json', {
        body: Buffer.from(JSON.stringify({
          marks,
          steps: profiler.getReport(),
        }, null, 2)),
        contentType: 'application/json',
      });
    }
  },
});

// Usage
test('page loads efficiently', async ({ page, profiler }) => {
  profiler.mark('navigation-start');
  
  await page.goto('/heavy-page');
  
  profiler.mark('navigation-end');
  
  await page.waitForLoadState('networkidle');
  
  profiler.mark('network-idle');
  
  const navigationTime = profiler.measure('navigation-start', 'navigation-end');
  const totalLoadTime = profiler.measure('navigation-start', 'network-idle');
  
  expect(navigationTime).toBeLessThan(3000);
  expect(totalLoadTime).toBeLessThan(5000);
  
  const pageMetrics = await profiler.profilePage();
  console.log('Page metrics:', pageMetrics);
});
```

### Test Isolation Verification

```typescript
// Verify test isolation
test.describe('Isolation Check', () => {
  test('test A sets value', async ({ page }) => {
    await page.goto('/test');
    await page.evaluate(() => {
      (window as any).testValue = 'A';
    });
    expect(await page.evaluate(() => (window as any).testValue)).toBe('A');
  });
  
  test('test B should not see A\'s value', async ({ page }) => {
    await page.goto('/test');
    // Should be undefined - fresh page
    expect(await page.evaluate(() => (window as any).testValue)).toBeUndefined();
  });
});
```

---

## Quick Reference

### Selector Priority (Best to Worst)

1. `getByRole()` - Accessible, semantic
2. `getByLabel()` - Form fields
3. `getByTestId()` - Custom test hooks
4. `getByText()` - Visible text
5. `locator()` - CSS/ XPath fallback

### Assertion Priority

1. `toBeVisible()` - Element presence
2. `toHaveText()` - Content verification
3. `toHaveCount()` - List length
4. `toHaveURL()` - Navigation
5. `toHaveScreenshot()` - Visual (use sparingly)

### Fixture Scopes

| Scope | Lifetime | Use For |
|-------|----------|---------|
| `test` | Per test | Test data, isolated state |
| `worker` | Per worker process | Auth state, expensive setup |
| `automatic` | Managed by Playwright | Browser, context, page |

### Retry Strategies

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  
  // Per-test retry configuration
  expect: {
    timeout: 5000,
  },
});

// Retry with custom logic
test('flaky operation', async ({ page }) => {
  test.setTimeout(60000);
  test.slow(); // Triples the timeout
  
  await expect.poll(async () => {
    await page.goto('/status');
    return await page.textContent('[data-testid="status"]');
  }).toBe('ready');
});
```
