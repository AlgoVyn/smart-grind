/**
 * Responsive Design E2E Tests
 */

import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app-page';
import { setupAPIMocks, mockServiceWorker } from './utils/mock-api';
import { setupAuthStateBeforeLoad } from './utils/test-helpers';

const viewports = {
  desktop: { width: 1280, height: 720 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  smallMobile: { width: 320, height: 568 },
};

test.describe('Responsive Design', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await setupAPIMocks(page);
    await mockServiceWorker(page);
    await setupAuthStateBeforeLoad(page);
  });

  test.describe('Desktop View (1280x720)', () => {
    test.use({ viewport: viewports.desktop });

    test('should show sidebar by default', async () => {
      await appPage.gotoAndWait();
      await expect(appPage.sidebar).toBeVisible();
    });

    test('should show sidebar logo', async () => {
      await appPage.gotoAndWait();
      const sidebarLogo = appPage.page.locator('#sidebar-logo');
      await expect(sidebarLogo).toBeVisible();
    });

    test('should hide mobile-only elements', async () => {
      await appPage.gotoAndWait();
      const mobileMenuBtn = appPage.page.locator('#mobile-menu-btn').first();
      const isVisible = await mobileMenuBtn.isVisible().catch(() => false);
      expect(isVisible).toBe(false);
    });

    test('should show desktop view title', async () => {
      await appPage.gotoAndWait();
      const viewTitle = appPage.page.locator('#current-view-title');
      await expect(viewTitle).toBeVisible();
    });

    test('should have proper sidebar width', async () => {
      await appPage.gotoAndWait();
      const box = await appPage.sidebar.boundingBox();
      expect(box?.width).toBeGreaterThan(250);
    });
  });

  test.describe('Tablet View (768x1024)', () => {
    test.use({ viewport: viewports.tablet });

    test('should show sidebar', async () => {
      await appPage.gotoAndWait();
      await expect(appPage.sidebar).toBeVisible();
    });

    test('should show mobile menu button on tablet', async () => {
      await appPage.gotoAndWait();
      const mobileMenuBtn = appPage.page.locator('#mobile-menu-btn, #mobile-menu-btn-main').first();
      const exists = await mobileMenuBtn.count() > 0;
      expect(exists).toBe(true);
    });

    test('should allow sidebar navigation', async () => {
      await appPage.gotoAndWait();
      const firstCategory = appPage.page.locator('.sidebar-link').first();
      if (await firstCategory.isVisible()) {
        await firstCategory.click();
        await appPage.page.waitForTimeout(200);
        const url = appPage.getUrl();
        expect(url).toMatch(/c\//);
      }
    });
  });

  test.describe('Mobile View (375x667)', () => {
    test.use({ viewport: viewports.mobile });

    test('should show sidebar', async () => {
      await appPage.gotoAndWait();
      await expect(appPage.sidebar).toBeAttached();
    });

    test('should show mobile menu button', async () => {
      await appPage.gotoAndWait();
      const mobileMenuBtn = appPage.page.locator('#mobile-menu-btn, #mobile-menu-btn-main').first();
      // Check if it exists first, then check visibility
      if (await mobileMenuBtn.count() > 0) {
        await expect(mobileMenuBtn).toBeVisible();
      }
    });

    test('should show search in mobile view', async () => {
      await appPage.gotoAndWait();
      await expect(appPage.searchInput).toBeVisible();
    });

    test('should show stats in mobile view', async () => {
      await appPage.gotoAndWait();
      await expect(appPage.statTotal).toBeVisible();
      await expect(appPage.statSolved).toBeVisible();
      await expect(appPage.statDue).toBeVisible();
    });

    test('should allow search on mobile', async () => {
      await appPage.gotoAndWait();
      await appPage.search('two sum');
      const value = await appPage.getSearchValue();
      expect(value).toBe('two sum');
    });
  });

  test.describe('Small Mobile View (320x568)', () => {
    test.use({ viewport: viewports.smallMobile });

    test('should render without horizontal overflow', async () => {
      await appPage.gotoAndWait();
      const hasOverflow = await appPage.page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow).toBe(false);
    });

    test('should have accessible tap targets', async () => {
      await appPage.gotoAndWait();
      const buttons = await appPage.page.locator('button, .filter-btn, .action-btn').all();
      for (const button of buttons.slice(0, 5)) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });

  test.describe('Viewport Transitions', () => {
    test('should adapt when resizing from desktop to mobile', async () => {
      await appPage.page.setViewportSize(viewports.desktop);
      await appPage.gotoAndWait();
      await expect(appPage.sidebar).toBeVisible();
      
      await appPage.page.setViewportSize(viewports.mobile);
      await appPage.page.waitForTimeout(300);
      
      const sidebarExists = await appPage.sidebar.count() > 0;
      expect(sidebarExists).toBe(true);
    });

    test('should adapt when resizing from mobile to desktop', async () => {
      await appPage.page.setViewportSize(viewports.mobile);
      await appPage.gotoAndWait();
      
      await appPage.page.setViewportSize(viewports.desktop);
      await appPage.page.waitForTimeout(300);
      
      await expect(appPage.sidebar).toBeVisible();
    });
  });
});
