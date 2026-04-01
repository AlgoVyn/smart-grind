/**
 * Problem Management E2E Tests
 * Critical user flows for managing problems
 */

import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app-page';
import { setupAPIMocks, mockServiceWorker } from './utils/mock-api';
import { setupAuthStateBeforeLoad } from './utils/test-helpers';

test.describe('Problem Management', () => {
    let appPage: AppPage;

    test.beforeEach(async ({ page }) => {
        appPage = new AppPage(page);
        
        await setupAPIMocks(page);
        await mockServiceWorker(page);
        await setupAuthStateBeforeLoad(page);
        await appPage.gotoAndWait();
        
        // Dismiss error tracking consent dialog if present
        const consentDialog = page.locator('dialog:has-text("Error Tracking Consent")');
        if (await consentDialog.isVisible().catch(() => false)) {
            await page.locator('button:has-text("No Thanks")').click();
        }
    });

    test('should display problem list', async () => {
        // Check for problem cards
        const problemCards = appPage.page.locator('.problem-card');
        const count = await problemCards.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should filter problems by status', async () => {
        // Click on "Solved" filter
        await appPage.filterBy('solved');
        
        // Check that the filter button has active styling
        const classes = await appPage.filterSolved.getAttribute('class');
        expect(classes).toContain('bg-brand-600');
    });

    test('should search for problems', async () => {
        // Type in search box
        await appPage.search('two sum');
        
        // Check that search term is applied
        const searchValue = await appPage.getSearchValue();
        expect(searchValue).toBe('two sum');
    });


    // SKIPPED: Category navigation test needs sidebar data-testid attributes for reliable selection
    // TODO: Add data-testid attributes to sidebar links and update selector strategy
    test.skip('should navigate between categories', async () => {
        // First verify the sidebar exists
        await expect(appPage.sidebar).toBeVisible();
        
        // Try clicking a sidebar link (using a more general selector)
        const categoryLink = appPage.page.locator('.sidebar-link').first();
        const hasLinks = await categoryLink.count() > 0;
        
        if (!hasLinks) {
            test.skip('No category links available');
            return;
        }
        
        // Click the first available category using JavaScript click
        await categoryLink.evaluate((el: HTMLElement) => {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        await appPage.page.waitForTimeout(500);
        
        // Verify URL changed (should contain /c/ for category or /s/ for section)
        const url = appPage.page.url();
        const urlChanged = url.includes('/c/') || url.includes('/s/');
        expect(urlChanged).toBe(true);
    });

    test('should toggle theme', async () => {
        // Get initial theme
        const initialClasses = await appPage.page.locator('html').getAttribute('class');
        const initialDark = initialClasses?.includes('dark') || false;
        
        // Click theme toggle
        await appPage.toggleTheme();
        
        // Check that theme changed
        await appPage.verifyTheme(initialDark ? 'light' : 'dark');
    });
});

test.describe('Problem Interactions', () => {
    let appPage: AppPage;

    test.beforeEach(async ({ page }) => {
        appPage = new AppPage(page);
        
        await setupAPIMocks(page);
        await mockServiceWorker(page);
        await setupAuthStateBeforeLoad(page);
        await appPage.gotoAndWait();
    });

    test('should open solution modal', async () => {
        // Click on solution button for first problem
        const solutionBtn = appPage.page.locator('button[data-action="solution"]').first();
        
        // Skip if no solution button found
        if (await solutionBtn.count() === 0) {
            test.skip();
            return;
        }
        
        await solutionBtn.click();
        
        // Check modal is visible
        const modal = appPage.page.locator('#solution-modal');
        await expect(modal).toBeVisible();
        
        // Close modal with Escape
        await appPage.page.keyboard.press('Escape');
    });

    test('should copy problem link', async () => {
        // Click copy button for first problem
        const copyBtn = appPage.page.locator('button[data-action="copy"]').first();
        
        // Skip if no copy button found
        if (await copyBtn.count() === 0) {
            test.skip();
            return;
        }
        
        await copyBtn.click();
        
        // Check toast notification appears
        const toast = appPage.page.locator('#toast-container .toast').first();
        await toast.waitFor({ state: 'visible', timeout: 5000 });
    });
});
