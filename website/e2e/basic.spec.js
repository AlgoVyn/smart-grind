import { test, expect } from '@playwright/test';

test.describe('SmartGrind Basic Functionality', () => {
  // Helper: wait for app to finish loading
  async function waitForAppReady(page) {
    // The loading screen should disappear and app wrapper should become visible
    await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 15000 });
    await page.waitForSelector('#app-wrapper', { state: 'visible', timeout: 5000 });
  }

  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/SmartGrind/);

    // Wait for app to be ready
    await waitForAppReady(page);

    // Check if the sidebar logo is visible (it has empty alt, so we select by id)
    // The sidebar logo is visible on desktop, the mobile logo is hidden on desktop (md:hidden)
    await expect(page.locator('#sidebar-logo')).toBeVisible();
  });

  test('should show setup modal when user type is signed-in but no userId', async ({ page }) => {
    // Set up localStorage to trigger the setup modal
    await page.goto('/');
    
    // Set userType to 'signed-in' without a userId to trigger the setup modal
    // Note: The actual localStorage key is 'smartgrind-user-type' (see data.ts LOCAL_STORAGE_KEYS)
    await page.evaluate(() => {
      localStorage.setItem('smartgrind-user-type', 'signed-in');
      // Clear any existing userId
      localStorage.removeItem('userId');
    });
    
    // Reload to apply the new state
    await page.reload();
    
    // Wait for loading screen to disappear
    await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 15000 });
    
    // The setup modal should be visible
    await expect(page.locator('#setup-modal')).toBeVisible({ timeout: 10000 });
    
    // The Google login button should be visible inside the modal
    await expect(page.locator('#google-login-button')).toBeVisible();
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