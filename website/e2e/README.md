# SmartGrind E2E Tests

Comprehensive end-to-end testing suite for SmartGrind using [Playwright](https://playwright.dev/).

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Configuration](#test-configuration)
- [Page Object Model](#page-object-model)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

This E2E test suite covers:

- **Basic Functionality**: Page load, navigation, theme switching
- **Authentication**: Login flows, auth state management
- **Flashcards**: Complete study session flows
- **Problem Management**: CRUD operations, filtering, search
- **SQL Section**: SQL-specific functionality
- **Responsive Design**: Mobile, tablet, and desktop views
- **Accessibility**: ARIA attributes, keyboard navigation, screen reader support
- **Service Worker**: Registration, caching, offline support
- **Data Sync**: Conflict resolution, offline queue, retry mechanisms

## Getting Started

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Variables

Create a `.env` file in the project root (optional):

```env
# Run tests on all browsers (default: Chromium only)
TEST_ALL_BROWSERS=true

# Number of parallel workers
TEST_WORKERS=4

# Test timeout in milliseconds
TEST_TIMEOUT=60000
```

## Test Structure

```
e2e/
├── page-objects/          # Page Object Model classes
│   ├── base-page.ts       # Base page with common methods
│   ├── app-page.ts        # Main app page
│   ├── flashcards-page.ts # Flashcards modal
│   ├── modals-page.ts     # All modal dialogs
│   └── sql-page.ts        # SQL section
├── fixtures/              # Test data
│   └── test-data.ts       # Mock data and scenarios
├── utils/                 # Test utilities
│   ├── mock-api.ts        # API mocking helpers
│   ├── test-helpers.ts    # Common test helpers
│   └── index.ts           # Utilities export
├── *.spec.ts              # Test files
└── README.md              # This file
```

## Running Tests

### Run all tests

```bash
npm run test:e2e
```

### Run with UI mode (for debugging)

```bash
npm run test:e2e:ui
```

### Run specific test file

```bash
npx playwright test e2e/flashcards.spec.ts
```

### Run tests on specific browser

```bash
# Run on Firefox
TEST_ALL_BROWSERS=true npx playwright test --project=firefox

# Run on WebKit
TEST_ALL_BROWSERS=true npx playwright test --project=webkit

# Run on mobile
TEST_ALL_BROWSERS=true npx playwright test --project=mobile-chrome
```

### Run with headed browser (visible)

```bash
npx playwright test --headed
```

### Debug a specific test

```bash
npx playwright test --debug
```

### Generate and view report

```bash
npx playwright test
npx playwright show-report
```

## Test Configuration

### Playwright Configuration

The main configuration is in `playwright.config.ts`:

- **Projects**: Desktop (Chromium, Firefox, WebKit), Mobile (iPhone, Android), Tablet
- **Parallel execution**: Enabled locally, disabled in CI
- **Retries**: 2 retries in CI, 1 locally
- **Artifacts**: Screenshots, videos, and traces on failure
- **WebServer**: Automatically starts dev server

### Test Tags

Use tags to run specific test groups:

```typescript
test('mobile specific test @mobile', async () => {
  // Test code
});
```

Run with tag:
```bash
npx playwright test --grep '@mobile'
```

## Page Object Model

The Page Object Model (POM) pattern provides maintainable, reusable test code.

### Available Page Objects

#### AppPage

Main application page interactions:

```typescript
const appPage = new AppPage(page);
await appPage.gotoAndWait();
await appPage.search('two sum');
await appPage.filterBy('solved');
const stats = await appPage.getStats();
```

#### FlashcardsPage

Flashcards study session:

```typescript
const flashcardsPage = new FlashcardsPage(page);
await flashcardsPage.selectType('algorithm');
await flashcardsPage.startStudy();
await flashcardsPage.studyOneCard('good');
```

#### ModalsPage

All modal dialogs:

```typescript
const modalsPage = new ModalsPage(page);
await modalsPage.waitForSetupModal();
await modalsPage.addNewProblem('Name', 'URL', 'Category');
await modalsPage.closeSolutionModal();
```

#### SQLPage

SQL section functionality:

```typescript
const sqlPage = new SQLPage(page);
await sqlPage.expandSQLSection();
await sqlPage.clickSQLCategory('sql-basics');
await sqlPage.toggleProblemStatus(0);
```

### Creating New Page Objects

1. Extend `BasePage`
2. Define locators in constructor
3. Add action methods
4. Add verification methods

Example:

```typescript
import { BasePage } from './base-page';

export class NewFeaturePage extends BasePage {
  readonly featureButton: Locator;

  constructor(page: Page) {
    super(page);
    this.featureButton = page.locator('#feature-btn');
  }

  async clickFeature(): Promise<void> {
    await this.featureButton.click();
  }
}
```

## Test Helpers

### API Mocking

```typescript
import { setupAPIMocks, mockServiceWorker } from './utils/mock-api';

// Setup standard mocks
await setupAPIMocks(page, { scenario: 'authenticated' });

// Mock service worker
await mockServiceWorker(page);

// Setup offline mode
await setupOfflineMode(page, context);
```

### Authentication

```typescript
import { setupAuthState } from './utils/test-helpers';

// Setup authenticated user
await setupAuthState(page, 'user-id', 'Display Name');

// Clear auth state
await clearAuthState(page);
```

### Wait Helpers

```typescript
import { waitForAppReady, waitForToast, SHORT_TIMEOUT } from './utils/test-helpers';

// Wait for app to be ready
await waitForAppReady(page);

// Wait for toast notification
const toast = await waitForToast(page, 'success');
```

## Best Practices

### 1. Use Page Objects

Always use Page Objects for maintainability:

```typescript
// ✅ Good
const appPage = new AppPage(page);
await appPage.search('query');

// ❌ Bad
await page.fill('#problem-search', 'query');
```

### 2. Mock External Dependencies

Mock APIs and services for consistent tests:

```typescript
await setupAPIMocks(page, { scenario: 'authenticated' });
await mockServiceWorker(page);
```

### 3. Use Data Attributes

Prefer data attributes over CSS classes for selectors:

```typescript
// ✅ Good
page.locator('[data-action="solve"]')

// ❌ Bad
page.locator('.btn-primary.action-btn')
```

### 4. Handle Async Operations

Always await async operations:

```typescript
// ✅ Good
await expect(element).toBeVisible();

// ❌ Bad
expect(element).toBeVisible();
```

### 5. Clean State

Clean up state between tests:

```typescript
test.beforeEach(async ({ page }) => {
  await clearLocalStorage(page);
  await setupAuthState(page);
});
```

### 6. Add Descriptive Test Names

Use clear, descriptive test names:

```typescript
// ✅ Good
test('should display error when API returns 500', async () => { });

// ❌ Bad
test('error test', async () => { });
```

## Troubleshooting

### Tests fail due to timeout

```bash
# Increase timeout
TEST_TIMEOUT=120000 npm run test:e2e
```

### Port already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run test:e2e
```

### Tests pass locally but fail in CI

1. Check for race conditions (add more `await` statements)
2. Verify API mocks are set up correctly
3. Check if tests depend on specific timing
4. Add retries: `retries: process.env.CI ? 2 : 0`

### Screenshots and Traces

Artifacts are saved on failure:

```
test-results/
├── screenshots/
├── videos/
└── traces/
```

View traces:
```bash
npx playwright show-trace test-results/trace.zip
```

### Debug Mode

```bash
# Run with debugger
npx playwright test --debug

# Or use UI mode
npm run test:e2e:ui
```

## CI Integration

### GitHub Actions

```yaml
- name: Run E2E Tests
  run: npm run test:e2e
  env:
    CI: true

- name: Upload Test Results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

### Docker

```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app
COPY . .
RUN npm install
RUN npx playwright install

CMD ["npm", "run", "test:e2e"]
```

## Contributing

1. Write tests using Page Object Model
2. Add mock data to `fixtures/test-data.ts`
3. Use existing helpers when possible
4. Run tests locally before pushing
5. Update this README if adding new features

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Testing Patterns](https://playwright.dev/docs/pom)
