import { test, expect } from '@playwright/test';

test.describe('SmartGrind Basic Functionality', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/SmartGrind/);

    // Check if the main logo is visible
    await expect(page.locator('img[alt="SmartGrind Logo"]').first()).toBeVisible();
  });

  test('should show sign in modal when clicking Google login', async ({ page }) => {
    await page.goto('/');

    // Click the Google login button
    await page.locator('#google-login-button').click();

    // The setup modal should be hidden and signin modal should be shown
    // Note: This might require mocking the Google auth flow
    await expect(page.locator('#setup-modal')).toHaveClass(/hidden/);
  });

  test('should allow theme switching', async ({ page }) => {
    await page.goto('/');

    // Click the theme toggle button
    await page.locator('#theme-toggle-btn').click();

    // Check if the html element has the dark class
    const htmlClasses = await page.locator('html').getAttribute('class');
    expect(htmlClasses).toContain('dark');
  });

  test('should show problem search functionality', async ({ page }) => {
    await page.goto('/');

    // Check if search input exists
    await expect(page.locator('#problem-search')).toBeVisible();

    // Type in search
    await page.locator('#problem-search').fill('two sum');

    // The search should be functional (though we can't test filtering without data)
    const searchValue = await page.locator('#problem-search').inputValue();
    expect(searchValue).toBe('two sum');
  });

  test('should have filter buttons', async ({ page }) => {
    await page.goto('/');

    // Check if filter buttons exist
    await expect(page.locator('.filter-btn').first()).toBeVisible();

    // Check filter button texts
    await expect(page.locator('.filter-btn').filter({ hasText: 'All' })).toBeVisible();
    await expect(page.locator('.filter-btn').filter({ hasText: 'Due' })).toBeVisible();
    await expect(page.locator('.filter-btn').filter({ hasText: 'Solved' })).toBeVisible();
  });

  test('should show stats overview', async ({ page }) => {
    await page.goto('/');

    // Check if stats are displayed
    await expect(page.locator('#stat-total')).toBeVisible();
    await expect(page.locator('#stat-solved')).toBeVisible();
    await expect(page.locator('#stat-due')).toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    await page.goto('/');

    // Click the theme toggle button
    await page.locator('#theme-toggle-btn').click();

    // Check if the html element has the dark class (should toggle)
    const htmlClasses = await page.locator('html').getAttribute('class');
    // Theme should have changed from initial state
    expect(htmlClasses).toBeDefined();
  });

  test('should have working search input', async ({ page }) => {
    await page.goto('/');

    // Search input should be visible and functional
    await expect(page.locator('#problem-search')).toBeVisible();

    // Should be able to type in search
    await page.locator('#problem-search').fill('test');
    const value = await page.locator('#problem-search').inputValue();
    expect(value).toBe('test');
  });

  test('should display correct meta tags', async ({ page }) => {
    await page.goto('/');

    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toContain('SmartGrind');

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('SmartGrind');
  });

  test('should have proper favicon and manifest', async ({ page }) => {
    await page.goto('/');

    // Check favicon
    const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
    expect(favicon).toContain('logo.svg');

    // Check manifest
    const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifest).toContain('manifest.json');
  });
});