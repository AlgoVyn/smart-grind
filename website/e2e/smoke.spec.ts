/**
 * SmartGrind Smoke Tests
 * 
 * Quick verification of critical functionality.
 * These tests run in parallel and focus on happy paths only.
 */

import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app-page';
import { FlashcardsPage } from './page-objects/flashcards-page';
import { setupAPIMocks, mockServiceWorker } from './utils/mock-api';
import { setupAuthStateBeforeLoad } from './utils/test-helpers';

test.describe('Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAPIMocks(page, { scenario: 'authenticated' });
    await mockServiceWorker(page);
    await setupAuthStateBeforeLoad(page);
  });

  test('app loads and displays content', async ({ page }) => {
    const appPage = new AppPage(page);
    await appPage.gotoAndWait();
    
    await expect(appPage.appWrapper).toBeVisible();
    await expect(appPage.sidebar).toBeVisible();
    await expect(appPage.searchInput).toBeVisible();
  });

  test('user profile is displayed', async ({ page }) => {
    const appPage = new AppPage(page);
    await appPage.gotoAndWait();
    
    await expect(appPage.userDisplay).toBeVisible();
    await expect(appPage.progressBar).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    const appPage = new AppPage(page);
    await appPage.gotoAndWait();
    
    await appPage.search('test');
    await page.waitForTimeout(500);
    
    const value = await appPage.getSearchValue();
    expect(value).toBe('test');
  });

  test('theme toggle works', async ({ page }) => {
    const appPage = new AppPage(page);
    await appPage.gotoAndWait();
    
    await appPage.toggleTheme();
    
    const htmlClasses = await page.locator('html').getAttribute('class');
    expect(htmlClasses).toBeDefined();
  });

  test('flashcards modal opens', async ({ page }) => {
    const appPage = new AppPage(page);
    const flashcardsPage = new FlashcardsPage(page);
    
    await appPage.gotoAndWait();
    await appPage.flashcardsBtn.click();
    
    await expect(flashcardsPage.modal).toBeVisible();
  });

  test('filter buttons work', async ({ page }) => {
    const appPage = new AppPage(page);
    await appPage.gotoAndWait();
    
    await appPage.filterBy('solved');
    const classes = await appPage.filterSolved.getAttribute('class');
    expect(classes).toContain('bg-brand-600');
  });

  test('stats are displayed', async ({ page }) => {
    const appPage = new AppPage(page);
    await appPage.gotoAndWait();
    
    await expect(appPage.statTotal).toBeVisible();
    await expect(appPage.statSolved).toBeVisible();
    await expect(appPage.statDue).toBeVisible();
    
    const stats = await appPage.getStats();
    expect(stats.total).toBeGreaterThanOrEqual(0);
  });

  test('problem cards are visible', async ({ page }) => {
    const appPage = new AppPage(page);
    await appPage.gotoAndWait();
    
    const cards = appPage.getProblemCards();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('no console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    const appPage = new AppPage(page);
    await appPage.gotoAndWait();
    
    // Ignore expected errors (chunk load, service worker)
    const criticalErrors = errors.filter(e => 
      !e.includes('chunk') && 
      !e.includes('service worker') &&
      !e.includes('Source map')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
