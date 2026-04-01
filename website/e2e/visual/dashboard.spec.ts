import { test, expect } from '@playwright/test';
import { stabilizeUI, maskDynamicElements, hideCaret } from './utils';

/**
 * Visual Regression Tests - Dashboard
 * 
 * These tests capture screenshots of the dashboard in various states
 * and compare them against baseline images to detect unintended UI changes.
 */

test.describe('Dashboard Visual Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the app and wait for it to load
        await page.goto('/');
        await page.waitForSelector('#app-wrapper', { state: 'visible', timeout: 30000 });
        // Wait for loading screen to disappear
        await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 30000 });
        
        // Close signin modal if present
        const signinModal = page.locator('#signin-modal');
        if (await signinModal.isVisible().catch(() => false)) {
            await page.keyboard.press('Escape');
            await signinModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        }
        
        // Wait for any animations to complete
        await page.waitForLoadState('networkidle').catch(() => {});
    });

    test('dashboard initial state', async ({ page }) => {
        // Capture full page screenshot
        await expect(page).toHaveScreenshot('dashboard-initial.png', {
            fullPage: true,
            threshold: 0.2,
        });
    });

    test('dashboard with sidebar open', async ({ page }) => {
        // Ensure sidebar is visible (desktop default)
        const sidebar = page.locator('#main-sidebar');
        await expect(sidebar).toBeVisible();
        
        await expect(page).toHaveScreenshot('dashboard-sidebar-open.png', {
            fullPage: true,
            threshold: 0.2,
        });
    });

    test('stats cards visual appearance', async ({ page }) => {
        // Focus on stats section
        const statsSection = page.locator('.grid.grid-cols-1.md\\:grid-cols-3');
        await expect(statsSection).toBeVisible();
        
        await expect(statsSection).toHaveScreenshot('stats-cards.png', {
            threshold: 0.2,
        });
    });
});

test.describe('Dashboard Responsive Visual Tests', () => {
    test('mobile viewport dashboard', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        
        await page.goto('/');
        await page.waitForSelector('#app-wrapper', { state: 'visible', timeout: 30000 });
        await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 30000 });
        
        // Close signin modal if present
        const signinModal = page.locator('#signin-modal');
        if (await signinModal.isVisible().catch(() => false)) {
            await page.keyboard.press('Escape');
            await signinModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        }
        
        // Wait for layout to settle after viewport change
        await page.waitForLoadState('domcontentloaded').catch(() => {});
      
      await expect(page).toHaveScreenshot('dashboard-mobile.png', {
            fullPage: true,
            threshold: 0.2,
        });
    });

    test('tablet viewport dashboard', async ({ page }) => {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });
        
        await page.goto('/');
        await page.waitForSelector('#app-wrapper', { state: 'visible', timeout: 30000 });
        await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 30000 });
        
        // Close signin modal if present
        const signinModal = page.locator('#signin-modal');
        if (await signinModal.isVisible().catch(() => false)) {
            await page.keyboard.press('Escape');
            await signinModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        }
        
        // Wait for layout to settle after viewport change
        await page.waitForLoadState('domcontentloaded').catch(() => {});
      
      await expect(page).toHaveScreenshot('dashboard-tablet.png', {
            fullPage: true,
            threshold: 0.2,
        });
    });
});
