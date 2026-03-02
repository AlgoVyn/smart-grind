/**
 * Problem Management E2E Tests
 * Critical user flows for managing problems
 */

import { test, expect } from '@playwright/test';

test.describe('Problem Management', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for the app to load
        await page.waitForSelector('#app-wrapper', { state: 'visible' });
    });

    test('should display problem list', async ({ page }) => {
        // Check that problems container exists
        const problemsContainer = page.locator('#problems-container');
        await expect(problemsContainer).toBeVisible();
        
        // Check for problem cards
        const problemCards = page.locator('.problem-card');
        const count = await problemCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should filter problems by status', async ({ page }) => {
        // Click on "Solved" filter
        await page.click('button[data-filter="solved"]');
        
        // Wait for filter to apply
        await page.waitForTimeout(300);
        
        // Check that the filter button is active
        const solvedFilter = page.locator('button[data-filter="solved"]');
        await expect(solvedFilter).toHaveClass(/active/);
    });

    test('should search for problems', async ({ page }) => {
        // Type in search box
        const searchInput = page.locator('#problem-search');
        await searchInput.fill('two sum');
        await searchInput.press('Enter');
        
        // Wait for search to apply
        await page.waitForTimeout(300);
        
        // Check that search term is applied
        await expect(searchInput).toHaveValue('two sum');
    });

    test('should navigate between categories', async ({ page }) => {
        // Click on a category in sidebar
        await page.click('.sidebar-link[data-topic="arrays"]');
        
        // Wait for navigation
        await page.waitForTimeout(300);
        
        // Check URL changed
        await expect(page).toHaveURL(/c\/arrays/);
    });

    test('should toggle theme', async ({ page }) => {
        // Click theme toggle
        await page.click('#theme-toggle');
        
        // Check that dark class is applied
        const html = page.locator('html');
        await expect(html).toHaveClass(/dark/);
        
        // Toggle back
        await page.click('#theme-toggle');
        await expect(html).not.toHaveClass(/dark/);
    });
});

test.describe('Problem Interactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('#app-wrapper', { state: 'visible' });
    });

    test('should open solution modal', async ({ page }) => {
        // Click on solution button for first problem
        const solutionBtn = page.locator('button[data-action="solution"]').first();
        await solutionBtn.click();
        
        // Check modal is visible
        const modal = page.locator('#solution-modal');
        await expect(modal).toBeVisible();
        
        // Close modal
        await page.click('#solution-modal .close-btn');
        await expect(modal).toBeHidden();
    });

    test('should copy problem link', async ({ page }) => {
        // Click copy button for first problem
        const copyBtn = page.locator('button[data-action="copy"]').first();
        await copyBtn.click();
        
        // Check toast notification appears
        const toast = page.locator('.toast');
        await expect(toast).toBeVisible();
        await expect(toast).toContainText('copied');
    });
});
