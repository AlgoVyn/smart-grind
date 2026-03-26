// --- SQL SECTION E2E TESTS ---

import { test, expect } from '@playwright/test';

test.describe('SQL Section', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Wait for app to load
        await page.waitForSelector('#sidebar', { timeout: 10000 });
    });

    test('SQL section should be visible in sidebar below Patterns', async ({ page }) => {
        // Find the SQL section header
        const sqlSectionHeader = page.locator('.sidebar-collapsible-section:has-text("SQL")');
        await expect(sqlSectionHeader).toBeVisible();

        // Check position - SQL should come after Patterns
        const patternsSection = page.locator('.sidebar-collapsible-section:has-text("Patterns")');
        const patternsBox = await patternsSection.boundingBox();
        const sqlBox = await sqlSectionHeader.boundingBox();

        expect(sqlBox?.y).toBeGreaterThan(patternsBox?.y || 0);
    });

    test('SQL categories should be visible after expanding section', async ({ page }) => {
        // Click to expand SQL section
        const sqlHeader = page.locator('.sidebar-collapsible-section:has-text("SQL") .sidebar-section-header');
        await sqlHeader.click();

        // Check for specific SQL categories
        await expect(page.locator('text=SQL Basics')).toBeVisible();
        await expect(page.locator('text=SQL Joins')).toBeVisible();
        await expect(page.locator('text=SQL Aggregation')).toBeVisible();
        await expect(page.locator('text=All SQL')).toBeVisible();
    });

    test('Clicking SQL category should navigate to category view', async ({ page }) => {
        // Expand SQL section
        const sqlHeader = page.locator('.sidebar-collapsible-section:has-text("SQL") .sidebar-section-header');
        await sqlHeader.click();

        // Click on SQL Basics
        await page.click('text=SQL Basics');

        // Check URL
        await expect(page).toHaveURL(/s\/sql-basics/);

        // Check view rendered
        await expect(page.locator('h1:has-text("SQL Basics")')).toBeVisible();
        await expect(page.locator('.sql-topic')).toBeVisible();
    });

    test('SQL problems should display without difficulty labels', async ({ page }) => {
        // Navigate to SQL category
        const sqlHeader = page.locator('.sidebar-collapsible-section:has-text("SQL") .sidebar-section-header');
        await sqlHeader.click();
        await page.click('text=SQL Basics');

        // Wait for problems to load
        await page.waitForSelector('.sql-problems');

        // Check that difficulty labels are NOT present
        const difficultyLabels = page.locator('.difficulty-label, [data-difficulty]');
        const count = await difficultyLabels.count();
        expect(count).toBe(0);
    });

    test('SQL problem cards should have toggle functionality', async ({ page }) => {
        // Navigate to SQL category
        const sqlHeader = page.locator('.sidebar-collapsible-section:has-text("SQL") .sidebar-section-header');
        await sqlHeader.click();
        await page.click('text=SQL Basics');

        // Wait for problems to load
        await page.waitForSelector('.sql-problem-card');

        // Find first problem card
        const firstProblem = page.locator('.sql-problem-card').first();
        await expect(firstProblem).toBeVisible();

        // Click to toggle status
        const statusToggle = firstProblem.locator('.sql-status-toggle');
        await statusToggle.click();

        // Check status changed to solved (should have green background class)
        await expect(firstProblem).toHaveClass(/bg-green-900/);
    });

    test('SQL flashcards should be accessible', async ({ page }) => {
        // Navigate to flashcards section
        await page.click('[data-nav="flashcards"], text=Flashcards');

        // Wait for flashcards to load
        await page.waitForSelector('.flashcard-container, .flashcards-container');

        // Filter by SQL type
        const typeFilter = page.locator('select[data-filter="type"], .flashcard-type-filter');
        if (await typeFilter.isVisible().catch(() => false)) {
            await typeFilter.selectOption('sql');

            // Check SQL cards are shown
            const sqlCards = page.locator('[data-card-type="sql"], .flashcard-card:has-text("SQL")');
            await expect(sqlCards.first()).toBeVisible();
        }
    });

    test('Progress tracking should work for SQL problems', async ({ page }) => {
        // Navigate to SQL category
        const sqlHeader = page.locator('.sidebar-collapsible-section:has-text("SQL") .sidebar-section-header');
        await sqlHeader.click();
        await page.click('text=SQL Basics');

        // Wait for problems to load
        await page.waitForSelector('.sql-problem-card');

        // Toggle 3 problems as solved
        for (let i = 0; i < 3; i++) {
            const problem = page.locator('.sql-problem-card').nth(i);
            const toggle = problem.locator('.sql-status-toggle');
            await toggle.click();
        }

        // Navigate away and back to verify persistence
        await page.click('text=All SQL');
        await page.click('text=SQL Basics');

        // Verify progress is saved (problems should still be marked as solved)
        const solvedCount = await page.locator('.sql-problem-card.bg-green-900').count();
        expect(solvedCount).toBeGreaterThanOrEqual(3);
    });

    test('SQL All view should display category cards', async ({ page }) => {
        // Expand SQL section
        const sqlHeader = page.locator('.sidebar-collapsible-section:has-text("SQL") .sidebar-section-header');
        await sqlHeader.click();

        // Click on All SQL
        await page.click('text=All SQL');

        // Check URL
        await expect(page).toHaveURL(/s\/$/);

        // Check category cards are displayed
        await expect(page.locator('.sql-category-card')).toHaveCount(14);
        await expect(page.locator('text=SQL Basics')).toBeVisible();
        await expect(page.locator('text=SQL Joins')).toBeVisible();
    });

    test('SQL problems should have working external links', async ({ page }) => {
        // Navigate to SQL category
        const sqlHeader = page.locator('.sidebar-collapsible-section:has-text("SQL") .sidebar-section-header');
        await sqlHeader.click();
        await page.click('text=SQL Basics');

        // Wait for problems to load
        await page.waitForSelector('.sql-problem-card');

        // Check that links open in new tab
        const firstLink = page.locator('.sql-problem-name').first();
        const href = await firstLink.getAttribute('href');
        const target = await firstLink.getAttribute('target');

        expect(href).toMatch(/^https:\/\/leetcode\.com\/problems\//);
        expect(target).toBe('_blank');
    });
});
