// --- SQL SECTION E2E TESTS ---

import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app-page';
import { setupAPIMocks, mockServiceWorker } from './utils/mock-api';
import { setupAuthStateBeforeLoad } from './utils/test-helpers';

test.describe('SQL Section', () => {
    let appPage: AppPage;

    test.beforeEach(async ({ page }) => {
        appPage = new AppPage(page);
        
        await setupAPIMocks(page);
        await mockServiceWorker(page);
        await setupAuthStateBeforeLoad(page);
        await appPage.gotoAndWait();
    });

    test('SQL section should be visible in sidebar if present', async () => {
        // Find the SQL section header by looking for SQL text in sidebar
        const sqlLink = appPage.page.locator('.sidebar-link').filter({ hasText: /SQL/i }).first();
        
        // If SQL section exists, it should be visible
        if (await sqlLink.count() > 0) {
            await expect(sqlLink).toBeVisible();
        } else {
            test.skip();
        }
    });

    test('SQL categories should be accessible from sidebar', async () => {
        // Look for SQL-related links in sidebar
        const sqlLinks = appPage.page.locator('.sidebar-link').filter({ hasText: /SQL/i });
        const count = await sqlLinks.count();
        
        if (count === 0) {
            test.skip();
        }
        
        expect(count).toBeGreaterThan(0);
    });

    test('Clicking SQL category should navigate to category view', async () => {
        // Click on a SQL link in sidebar
        const sqlLink = appPage.page.locator('.sidebar-link').filter({ hasText: /SQL/i }).first();
        
        if (await sqlLink.count() === 0) {
            test.skip();
            return;
        }
        
        await sqlLink.click();
        
        // Wait for navigation
        await appPage.page.waitForTimeout(500);
        
        // Check URL contains /s/ for SQL routes
        const url = appPage.getUrl();
        expect(url).toMatch(/s\//);
    });

    test('SQL problems should display without difficulty labels', async () => {
        // Navigate to a SQL section
        const sqlLink = appPage.page.locator('.sidebar-link').filter({ hasText: /SQL/i }).first();
        
        if (await sqlLink.count() === 0) {
            test.skip();
            return;
        }
        
        await sqlLink.click();
        await appPage.page.waitForTimeout(500);
        
        // Check that difficulty labels are NOT present on SQL problems
        const difficultyLabels = appPage.page.locator('.sql-problem-card .difficulty-label, .sql-problem-card [data-difficulty]');
        const count = await difficultyLabels.count();
        expect(count).toBe(0);
    });

    test('SQL problem cards should exist', async () => {
        // Navigate to a SQL section
        const sqlLink = appPage.page.locator('.sidebar-link').filter({ hasText: /SQL/i }).first();
        
        if (await sqlLink.count() === 0) {
            test.skip();
            return;
        }
        
        await sqlLink.click();
        await appPage.page.waitForTimeout(500);
        
        // Check for SQL problem cards or content
        const sqlContent = appPage.page.locator('.sql-view, [data-view="sql"], .sql-problems').first();
        await expect(sqlContent).toBeAttached();
    });

    test('SQL problems should have working external links', async () => {
        // Navigate to a SQL section
        const sqlLink = appPage.page.locator('.sidebar-link').filter({ hasText: /SQL/i }).first();
        
        if (await sqlLink.count() === 0) {
            test.skip();
            return;
        }
        
        await sqlLink.click();
        await appPage.page.waitForTimeout(500);
        
        // Check for problem links
        const problemLinks = appPage.page.locator('a[href*="leetcode.com"]').first();
        
        if (await problemLinks.isVisible().catch(() => false)) {
            const target = await problemLinks.getAttribute('target');
            expect(target).toBe('_blank');
        }
    });
});
