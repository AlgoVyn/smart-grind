import { test, expect, Page } from '@playwright/test';

test.describe('Auth Sync UI Feedback', () => {
    async function waitForAppReady(page: Page) {
        await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 15000 });
        // After loading screen, either app-wrapper or setup-modal should be visible
    }

    test('should show sign-in modal when SYNC_AUTH_REQUIRED message is received', async ({ page }) => {
        page.on('console', msg => console.log(`PAGE: ${msg.text()}`));
        page.on('pageerror', err => console.log(`PAGE ERROR: ${err.message}`));

        // 1. Setup signed-in state in localStorage
        await page.addInitScript(() => {
            localStorage.setItem('userId', 'test-user');
            localStorage.setItem('displayName', 'Test User');
            localStorage.setItem('smartgrind-user-type', 'signed-in');

            // Mock navigator.serviceWorker.register to prevent 404 errors in dev
            if (navigator.serviceWorker) {
                const originalRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
                navigator.serviceWorker.register = async (url, options) => {
                    const urlString = url.toString();
                    if (urlString.includes('sw.js')) {
                        return {
                            scope: '/smartgrind/',
                            active: { postMessage: () => { } },
                            addEventListener: () => { },
                            sync: { register: () => Promise.resolve() }
                        } as any;
                    }
                    return originalRegister(url, options);
                };
            }
        });

        // 2. Mock API calls
        await page.route('**/smartgrind/api/user', (route) => {
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

        await page.route('**/smartgrind/api/user?action=csrf', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ csrfToken: 'fake-csrf' }),
            });
        });

        // 3. Go to app
        await page.goto('./');
        await waitForAppReady(page);

        // 4. Dispatch the message that sw-register.ts listens for
        await page.evaluate(() => {
            const event = new MessageEvent('message', {
                data: {
                    type: 'AUTH_REQUIRED',
                    data: { message: 'Session expired' }
                }
            });
            navigator.serviceWorker.dispatchEvent(event);
        });

        // 5. Verify sign-in modal appears
        const signinModal = page.locator('#signin-modal');
        await expect(signinModal).toBeVisible({ timeout: 5000 });

        // 6. Verify toast message
        const toast = page.locator('.toast.error');
        await expect(toast).toBeVisible();
    });
});
