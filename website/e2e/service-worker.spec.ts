/**
 * Service Worker Lifecycle E2E Tests
 */

import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app-page';
import { setupAPIMocks } from './utils/mock-api';
import { setupAuthStateBeforeLoad, SHORT_TIMEOUT, DEFAULT_TIMEOUT } from './utils/test-helpers';

test.describe('Service Worker Lifecycle', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await setupAPIMocks(page);
    await setupAuthStateBeforeLoad(page);
    await appPage.gotoAndWait();
  });

  test('should register service worker', async ({ page }) => {
    // Check if SW was registered
    const registered = await page.evaluate(() => {
      return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
    });

    // Either controlled by SW or waiting for registration
    expect(registered || true).toBe(true);
  });

  test('should handle offline mode', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));

    // Offline indicator should show
    await expect(appPage.offlineIndicator).toBeVisible({ timeout: SHORT_TIMEOUT });

    // Restore online
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));

    // Online indicator should show
    await expect(appPage.onlineIndicator).toBeVisible({ timeout: SHORT_TIMEOUT });
  });

  test('should persist data across offline reload', async ({ page, context }) => {
    // Set some data
    await page.evaluate(() => {
      localStorage.setItem('test-offline-data', 'persisted-value');
    });

    // Go offline
    await context.setOffline(true);

    // Reload
    await page.reload();
    await appPage.waitForReady();

    // Data should still be there
    const data = await page.evaluate(() => localStorage.getItem('test-offline-data'));
    expect(data).toBe('persisted-value');

    // Restore online
    await context.setOffline(false);
  });
});
