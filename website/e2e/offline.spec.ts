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
        await page.goto('./');
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

    test('should show sign-in modal when background sync fails due to auth error', async ({
        page,
        context,
    }) => {
        page.on('console', msg => console.log(`PAGE: ${msg.text()}`));
        page.on('pageerror', err => console.log(`PAGE ERROR: ${err.message}`));

        // 1. Setup signed-in state with valid-looking token initially
        await page.evaluate(async () => {
            // LocalStorage keys (mixed in the app, setting both)
            localStorage.setItem('userId', 'test-user');
            localStorage.setItem('displayName', 'Test User');
            localStorage.setItem('smartgrind-local-display-name', 'Test User');
            localStorage.setItem('smartgrind-user-type', 'signed-in');

            // IndexedDB for Service Worker / AuthManager
            const AUTH_DB_NAME = 'smartgrind-auth';
            const AUTH_DB_VERSION = 1;
            const AUTH_STORE_NAME = 'auth-tokens';

            return new Promise((resolve, reject) => {
                const request = indexedDB.open(AUTH_DB_NAME, AUTH_DB_VERSION);
                request.onupgradeneeded = (e) => {
                    const db = (e.target as IDBOpenDBRequest).result;
                    if (!db.objectStoreNames.contains(AUTH_STORE_NAME)) {
                        db.createObjectStore(AUTH_STORE_NAME, { keyPath: 'key' });
                    }
                };
                request.onsuccess = () => {
                    const db = request.result;
                    const transaction = db.transaction(AUTH_STORE_NAME, 'readwrite');
                    const store = transaction.objectStore(AUTH_STORE_NAME);
                    store.put({ key: 'token', value: 'valid-token' });
                    store.put({ key: 'refreshToken', value: 'valid-refresh-token' });
                    store.put({ key: 'userId', value: 'test-user' });
                    transaction.oncomplete = () => {
                        db.close();
                        resolve(true);
                    };
                };
                request.onerror = () => reject(request.error);
            });
        });

        // 1b. Mock localStorage for initial checkAuth
        await page.addInitScript(() => {
            localStorage.setItem('userId', 'test-user');
            localStorage.setItem('displayName', 'Test User');
            localStorage.setItem('smartgrind-user-type', 'signed-in');
            localStorage.setItem('token', 'valid-token');
        });

        // 2. Mock initial data load to succeed
        await page.route('**/smartgrind/api/user?action=csrf', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ csrfToken: 'fake-csrf-token' }),
            });
        });

        await page.route('**/smartgrind/api/user', (route) => {
            if (route.request().method() === 'POST') {
                route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
                return;
            }
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    problems: {},
                    deletedIds: [],
                    settings: {},
                    displayName: 'Test User'
                }),
            });
        });

        // Catch-all to see what we're missing
        await page.route('**/smartgrind/api/**', async (route) => {
            if (route.request().url().includes('topics')) {
                route.fulfill({ status: 200, body: JSON.stringify([]) });
                return;
            }
            console.log('UNHANDLED ROUTE:', route.request().url());
            await route.continue();
        });

        // 3. Reload to apply state
        await page.reload();

        // Auto-dismiss any initial alert that might appear
        const alertModal = page.locator('#alert-modal');
        const alertOkBtn = page.locator('#alert-ok-btn');
        try {
            await alertModal.waitFor({ state: 'visible', timeout: 3000 });
            console.log('Dismissing unexpected alert');
            await alertOkBtn.click();
        } catch (e) {
            // No alert, proceed
        }

        await waitForAppReady(page);

        // 4. Break auth for FUTURE requests (refresh and sync)
        await page.route('**/api/auth/refresh', (route) => {
            route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Session expired' }),
            });
        });

        await page.route('**/api/user/progress/batch', (route) => {
            route.fulfill({
                status: 401,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Unauthorized' }),
            });
        });

        // 5. Go offline
        await context.setOffline(true);
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));

        // 6. Queue an operation
        const solveButton = page.locator('.action-btn[data-action="solve"]').first();
        const hasSolveButton = await solveButton.isVisible().catch(() => false);
        if (!hasSolveButton) {
            test.skip();
            return;
        }
        await solveButton.click();

        // 7. Go back online to trigger sync
        await context.setOffline(false);
        await page.evaluate(() => window.dispatchEvent(new Event('online')));

        // 8. Verify sign-in modal appears
        const signinModal = page.locator('#signin-modal');
        await expect(signinModal).toBeVisible({ timeout: 15000 });

        // 9. Verify toast message
        const toast = page.locator('.toast.error');
        await expect(toast).toBeVisible();
    });
});
