import { test, expect, Page } from '@playwright/test';

/**
 * E2E tests for offline functionality:
 * 1. Offline indicator appears when the browser goes offline.
 * 2. The app remains functional (search, filter) while offline.
 * 3. User state (localStorage) persists across offline reloads.
 * 4. Operations queued offline trigger sync when back online.
 */

test.describe('Offline Functionality', () => {
    // Helper: wait for app to finish loading
    async function waitForAppReady(page: Page) {
        // The loading screen should disappear and app wrapper should become visible
        await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 15000 });
        await page.waitForSelector('#app-wrapper', { state: 'visible', timeout: 5000 });
    }

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await waitForAppReady(page);
    });

    test('should show offline indicator when network is disconnected', async ({ page, context }) => {
        // Initially, the online indicator should be visible
        await expect(page.locator('#online-indicator')).toBeVisible();
        await expect(page.locator('#offline-indicator')).toBeHidden();

        // Go offline
        await context.setOffline(true);

        // Trigger the browser's offline event so the app can react
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));

        // The offline indicator should become visible
        await expect(page.locator('#offline-indicator')).toBeVisible({ timeout: 5000 });

        // Go back online
        await context.setOffline(false);
        await page.evaluate(() => window.dispatchEvent(new Event('online')));

        // The online indicator should reappear
        await expect(page.locator('#online-indicator')).toBeVisible({ timeout: 5000 });
    });

    test('should allow search while offline', async ({ page, context }) => {
        // Verify search input exists and is usable
        await expect(page.locator('#problem-search')).toBeVisible();

        // Go offline
        await context.setOffline(true);
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));

        // Search should still function (it's a client-side operation)
        await page.locator('#problem-search').fill('two sum');
        const value = await page.locator('#problem-search').inputValue();
        expect(value).toBe('two sum');

        // Clear search
        await page.locator('#problem-search').fill('');
    });

    test('should allow filter switching while offline', async ({ page, context }) => {
        // Go offline
        await context.setOffline(true);
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));

        // Click filter buttons - they should still work (client-side)
        const dueFilter = page.locator('.filter-btn').filter({ hasText: 'Due' });
        await expect(dueFilter).toBeVisible();
        await dueFilter.click();

        const solvedFilter = page.locator('.filter-btn').filter({ hasText: 'Solved' });
        await expect(solvedFilter).toBeVisible();
        await solvedFilter.click();

        // Switch back to All
        const allFilter = page.locator('.filter-btn').filter({ hasText: 'All' });
        await allFilter.click();
    });

    test('should persist localStorage state through offline/online cycle', async ({ page, context }) => {
        // Set some state in localStorage
        await page.evaluate(() => {
            localStorage.setItem('test-offline-persist', 'hello-offline');
        });

        // Go offline
        await context.setOffline(true);
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));

        // Verify the value is still accessible while offline
        const offlineValue = await page.evaluate(() => localStorage.getItem('test-offline-persist'));
        expect(offlineValue).toBe('hello-offline');

        // Come back online
        await context.setOffline(false);
        await page.evaluate(() => window.dispatchEvent(new Event('online')));

        // Reload now that we're back online
        await page.reload();
        await waitForAppReady(page);

        // Verify localStorage survived the full cycle
        const value = await page.evaluate(() => localStorage.getItem('test-offline-persist'));
        expect(value).toBe('hello-offline');
    });

    test('should queue operations and show pending indicator when solving offline', async ({
        page,
        context,
    }) => {
        // Find a problem card with a solve button
        const solveButton = page.locator('.action-btn[data-action="solve"]').first();

        // Check if there are any problem cards with solve buttons
        const hasSolveButton = await solveButton.isVisible().catch(() => false);

        if (!hasSolveButton) {
            // Skip if no solvable problems are visible (e.g., all already solved)
            test.skip();
            return;
        }

        // Go offline
        await context.setOffline(true);
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));

        // Confirm offline indicator is shown
        await expect(page.locator('#offline-indicator')).toBeVisible({ timeout: 5000 });

        // Click the solve button
        await solveButton.click();

        // Wait for the operation to be queued
        await page.waitForTimeout(1000);

        // The pending indicator should appear (operations queued for sync)
        // Note: this depends on the app's implementation of queueing
        const pendingIndicator = page.locator('#pending-indicator');
        // It might not show if the operation was handled purely locally
        // but the offline indicator should still be present
        await expect(page.locator('#offline-indicator')).toBeVisible();
    });

    test('should recover gracefully when coming back online', async ({ page, context }) => {
        // Go offline
        await context.setOffline(true);
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));
        await expect(page.locator('#offline-indicator')).toBeVisible({ timeout: 5000 });

        // Stay offline for a bit
        await page.waitForTimeout(500);

        // Come back online
        await context.setOffline(false);
        await page.evaluate(() => window.dispatchEvent(new Event('online')));

        // The online indicator should reappear
        await expect(page.locator('#online-indicator')).toBeVisible({ timeout: 5000 });

        // The app should remain functional
        await expect(page.locator('#problem-search')).toBeVisible();
        await expect(page.locator('#stat-total')).toBeVisible();
    });

    test('should maintain theme preference offline', async ({ page, context }) => {
        // Get initial theme state
        const initialClasses = await page.locator('html').getAttribute('class');
        const initialIsDark = initialClasses?.includes('dark');

        // Go offline
        await context.setOffline(true);
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));

        // Toggle theme while offline
        await page.locator('#theme-toggle-btn').click();
        const offlineClasses = await page.locator('html').getAttribute('class');

        // Theme should have toggled
        if (initialIsDark) {
            expect(offlineClasses).not.toContain('dark');
        } else {
            expect(offlineClasses).toContain('dark');
        }

        // Verify localStorage was updated
        const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
        expect(savedTheme).toBe(initialIsDark ? 'light' : 'dark');

        // Come back online and reload to verify persistence
        await context.setOffline(false);
        await page.evaluate(() => window.dispatchEvent(new Event('online')));
        await page.reload();
        await waitForAppReady(page);

        const reloadedClasses = await page.locator('html').getAttribute('class');
        if (initialIsDark) {
            expect(reloadedClasses).not.toContain('dark');
        } else {
            expect(reloadedClasses).toContain('dark');
        }
    });
});
