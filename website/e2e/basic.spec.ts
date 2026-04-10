/**
 * SmartGrind Basic Functionality E2E Tests
 * 
 * Core application functionality tests using Page Object Model pattern.
 */

import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app-page';
import { ModalsPage } from './page-objects/modals-page';
import { setupAPIMocks, mockServiceWorker } from './utils/mock-api';
import { setupAuthStateBeforeLoad, verifyTheme, SHORT_TIMEOUT } from './utils/test-helpers';

test.describe('SmartGrind Basic Functionality', () => {
  let appPage: AppPage;
  let modalsPage: ModalsPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    modalsPage = new ModalsPage(page);

    await setupAPIMocks(page);
    await mockServiceWorker(page);
  });

  test.describe('Page Load', () => {
    test('should load the homepage', async () => {
      await appPage.gotoAndWait();

      // Verify URL
      await expect(appPage.page).toHaveURL(/\/smartgrind\/?$/);

      // Verify title
      await expect(appPage.page).toHaveTitle(/SmartGrind/);

      // Verify sidebar logo is visible
      await expect(appPage.page.locator('#sidebar-logo')).toBeVisible();
    });

    test('should show correct meta tags', async () => {
      await appPage.gotoAndWait();

      // Check meta description
      const metaDescription = await appPage.page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toContain('SmartGrind');

      // Check Open Graph tags
      const ogTitle = await appPage.page.locator('meta[property="og:title"]').getAttribute('content');
      expect(ogTitle).toContain('SmartGrind');
    });

    test('should have proper favicon and manifest', async () => {
      await appPage.gotoAndWait();

      // Check favicon
      const favicon = await appPage.page.locator('link[rel="icon"]').getAttribute('href');
      expect(favicon).toContain('logo.svg');

      // Check manifest
      const manifest = await appPage.page.locator('link[rel="manifest"]').getAttribute('href');
      expect(manifest).toContain('manifest.json');
    });

    test('should apply theme on load', async () => {
      await appPage.gotoAndWait();

      // Verify theme class is applied
      const htmlClasses = await appPage.page.locator('html').getAttribute('class');
      expect(htmlClasses).toBeDefined();
    });
  });

  test.describe('Authentication', () => {
    test('should show setup modal when user type is signed-in but no userId', async () => {
      await appPage.goto();

      // Set userType to 'signed-in' without a userId
      await appPage.page.evaluate(() => {
        localStorage.setItem('smartgrind-user-type', 'signed-in');
        localStorage.removeItem('userId');
      });

      // Reload to apply the new state
      await appPage.reload();

      // Wait for loading screen to disappear
      await appPage.page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 15000 });

      // The setup modal should be visible
      await modalsPage.waitForSetupModal();

      // The Google login button should be visible
      await expect(modalsPage.googleLoginButton).toBeVisible();
    });

    test('should load app for authenticated user', async ({ page }) => {
      // Setup auth before navigation using init script
      await setupAuthStateBeforeLoad(page, 'test-user', 'Test User');
      await appPage.gotoAndWait();

      // App wrapper should be visible
      await expect(appPage.appWrapper).toBeVisible();

      // Setup modal should be hidden
      await expect(modalsPage.setupModal).toBeHidden();
    });
  });

  test.describe('Theme Switching', () => {
    test('should allow theme switching', async ({ page }) => {
      await setupAuthStateBeforeLoad(page);
      await appPage.gotoAndWait();

      // Toggle theme - this method verifies the theme actually changes
      await appPage.toggleTheme();
    });

    test('should persist theme preference', async ({ page }) => {
      await setupAuthStateBeforeLoad(page);
      await appPage.gotoAndWait();

      // Get initial theme state — default is light (no 'dark' class)
      const initialIsDark = await appPage.page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });

      // Toggle theme — this saves to localStorage and toggles the class
      await appPage.toggleTheme();

      // Verify the theme was toggled before reloading
      await verifyTheme(appPage.page, initialIsDark ? 'light' : 'dark');

      // Reload page — the inline theme script should restore from localStorage
      await appPage.page.reload({ timeout: 20000, waitUntil: 'networkidle' });
      await appPage.page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20000 });
      await appPage.page.waitForSelector('#app-wrapper', { state: 'visible', timeout: 10000 });

      // Verify theme persisted after reload using polling check
      await verifyTheme(appPage.page, initialIsDark ? 'light' : 'dark');
    });
  });

  test.describe('Search Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthStateBeforeLoad(page);
      await appPage.gotoAndWait();
    });

    test('should show search input', async () => {
      await expect(appPage.searchInput).toBeVisible();
    });

    test('should allow typing in search', async () => {
      await appPage.search('two sum');

      const searchValue = await appPage.getSearchValue();
      expect(searchValue).toBe('two sum');
    });

    test('should clear search', async () => {
      await appPage.search('test query');
      await appPage.clearSearch();

      const searchValue = await appPage.getSearchValue();
      expect(searchValue).toBe('');
    });
  });

  test.describe('Filter Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthStateBeforeLoad(page);
      await appPage.gotoAndWait();
    });

    test('should have filter buttons', async () => {
      await expect(appPage.filterAll).toBeVisible();
      await expect(appPage.filterDue).toBeVisible();
      await expect(appPage.filterSolved).toBeVisible();
    });

    test('should filter by All', async () => {
      await appPage.filterBy('all');
      // Check that the button has the active styling (bg-brand-600 indicates active)
      const classes = await appPage.filterAll.getAttribute('class');
      expect(classes).toContain('bg-brand-600');
    });

    test('should filter by Due', async () => {
      await appPage.filterBy('due');
      const classes = await appPage.filterDue.getAttribute('class');
      expect(classes).toContain('bg-brand-600');
    });

    test('should filter by Solved', async () => {
      await appPage.filterBy('solved');
      const classes = await appPage.filterSolved.getAttribute('class');
      expect(classes).toContain('bg-brand-600');
    });
  });

  test.describe('Stats Display', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthStateBeforeLoad(page);
      await appPage.gotoAndWait();
    });

    test('should show stats overview', async () => {
      await expect(appPage.statTotal).toBeVisible();
      await expect(appPage.statSolved).toBeVisible();
      await expect(appPage.statDue).toBeVisible();
    });

    test('should display valid stats numbers', async () => {
      const stats = await appPage.getStats();

      expect(stats.total).toBeGreaterThanOrEqual(0);
      expect(stats.solved).toBeGreaterThanOrEqual(0);
      expect(stats.due).toBeGreaterThanOrEqual(0);
      expect(stats.solved).toBeLessThanOrEqual(stats.total);
    });
  });

  test.describe('Sidebar Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthStateBeforeLoad(page);
      await appPage.gotoAndWait();
    });

    test('should display sidebar', async () => {
      await expect(appPage.sidebar).toBeVisible();
    });

    test('should show user display name', async () => {
      const displayName = await appPage.getUserDisplayName();
      expect(displayName).toBeTruthy();
    });

    test('should have progress bar', async () => {
      await expect(appPage.progressBar).toBeVisible();
    });

    test('should have action buttons', async () => {
      await expect(appPage.addProblemBtn).toBeVisible();
      await expect(appPage.flashcardsBtn).toBeVisible();
    });
  });

  test.describe('Sync Indicators', () => {
    test.beforeEach(async ({ page }) => {
      await setupAuthStateBeforeLoad(page);
      await appPage.gotoAndWait();
    });

    test('should show online indicator when connected', async () => {
      await expect(appPage.onlineIndicator).toBeVisible();
    });

    test('should hide offline indicator by default', async () => {
      await expect(appPage.offlineIndicator).toBeHidden();
    });

    test('should show correct online status', async () => {
      const onlineText = await appPage.onlineIndicator.textContent();
      expect(onlineText?.toLowerCase()).toContain('online');
    });
  });
});
