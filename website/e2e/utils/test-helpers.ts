/**
 * Test Helpers
 * 
 * Common utility functions for e2e tests.
 * Includes DOM helpers, wait conditions, and state management.
 */

import { Page, Locator, expect } from '@playwright/test';

// Default timeouts
export const DEFAULT_TIMEOUT = 15000;
export const SHORT_TIMEOUT = 5000;
export const LONG_TIMEOUT = 30000;

/**
 * Wait for the application to be fully loaded and ready
 */
export async function waitForAppReady(page: Page, timeout = DEFAULT_TIMEOUT): Promise<void> {
  // Wait for loading screen to disappear
  await page.waitForSelector('#loading-screen', { state: 'hidden', timeout });
  
  // Wait for app wrapper to be visible
  await page.waitForSelector('#app-wrapper', { state: 'visible', timeout });
  
  // Wait for main content to be ready
  await page.waitForSelector('#main-scroll', { state: 'visible', timeout });
}

/**
 * Wait for modal to appear and be fully rendered
 */
export async function waitForModal(page: Page, modalId: string, timeout = SHORT_TIMEOUT): Promise<Locator> {
  const modal = page.locator(`#${modalId}`);
  await modal.waitFor({ state: 'visible', timeout });
  return modal;
}

/**
 * Wait for modal to close
 */
export async function waitForModalToClose(page: Page, modalId: string, timeout = SHORT_TIMEOUT): Promise<void> {
  const modal = page.locator(`#${modalId}`);
  await modal.waitFor({ state: 'hidden', timeout });
}

/**
 * Close any open modal by clicking the close button or backdrop
 */
export async function closeModal(page: Page, modalId: string): Promise<void> {
  const modal = page.locator(`#${modalId}`);
  
  // Try close button first
  const closeBtn = modal.locator('[aria-label*="Close"], .close-btn, [data-action="close"]').first();
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click();
  } else {
    // Press Escape to close
    await page.keyboard.press('Escape');
  }
  
  await waitForModalToClose(page, modalId);
}

/**
 * Get text content of an element safely
 */
export async function getTextContent(locator: Locator): Promise<string> {
  const text = await locator.textContent();
  return text?.trim() || '';
}

/**
 * Check if element has specific class
 */
export async function hasClass(locator: Locator, className: string): Promise<boolean> {
  const classes = await locator.getAttribute('class');
  return classes?.includes(className) || false;
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, type: 'success' | 'error' | 'info' = 'success', timeout = SHORT_TIMEOUT): Promise<Locator> {
  const toast = page.locator(`#toast-container .toast.${type}`).first();
  await toast.waitFor({ state: 'visible', timeout });
  return toast;
}

/**
 * Get all toast messages
 */
export async function getToastMessages(page: Page): Promise<string[]> {
  const toasts = page.locator('#toast-container .toast');
  const count = await toasts.count();
  const messages: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const text = await toasts.nth(i).textContent();
    if (text) messages.push(text.trim());
  }
  
  return messages;
}

/**
 * Clear all toast notifications
 */
export async function clearToasts(page: Page): Promise<void> {
  const toasts = page.locator('#toast-container .toast');
  const count = await toasts.count();
  
  for (let i = 0; i < count; i++) {
    await toasts.nth(i).click(); // Click to dismiss
  }
}

/**
 * Set localStorage values - requires page to be on a valid origin
 */
export async function setLocalStorage(page: Page, keyValues: Record<string, string>): Promise<void> {
  // Ensure page has a valid origin
  const url = page.url();
  if (url === 'about:blank' || !url.startsWith('http')) {
    throw new Error(`Cannot set localStorage on invalid page: ${url}. Navigate to a valid page first.`);
  }
  
  await page.evaluate((data) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  }, keyValues);
}

/**
 * Get localStorage value
 */
export async function getLocalStorage(page: Page, key: string): Promise<string | null> {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

/**
 * Clear localStorage
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Setup authenticated user state - navigates to page first if needed
 */
export async function setupAuthState(
  page: Page, 
  userId = 'test-user', 
  displayName = 'Test User',
  baseUrl = 'http://localhost:3000/smartgrind/'
): Promise<void> {
  // Ensure we're on a valid page
  const currentUrl = page.url();
  if (currentUrl === 'about:blank' || !currentUrl.startsWith('http')) {
    await page.goto(baseUrl);
  }
  
  await setLocalStorage(page, {
    'userId': userId,
    'displayName': displayName,
    'smartgrind-user-type': 'signed-in',
    'smartgrind-local-display-name': displayName,
    'token': 'mock-token',
  });
}

/**
 * Setup authenticated state before page load using init script
 */
export async function setupAuthStateBeforeLoad(
  page: Page,
  userId = 'test-user',
  displayName = 'Test User'
): Promise<void> {
  await page.addInitScript((data) => {
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('displayName', data.displayName);
    localStorage.setItem('smartgrind-user-type', 'signed-in');
    localStorage.setItem('smartgrind-local-display-name', data.displayName);
    localStorage.setItem('token', 'mock-token');
  }, { userId, displayName });
}

/**
 * Clear authentication state
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('displayName');
    localStorage.removeItem('smartgrind-user-type');
    localStorage.removeItem('smartgrind-local-display-name');
    localStorage.removeItem('token');
  });
}

/**
 * Wait for network idle (no network requests for specified duration)
 */
export async function waitForNetworkIdle(page: Page, idleTime = 500): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: DEFAULT_TIMEOUT });
}

/**
 * Scroll element into view smoothly
 */
export async function scrollIntoView(locator: Locator): Promise<void> {
  await locator.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
}

/**
 * Take screenshot with optional prefix
 */
export async function takeScreenshot(page: Page, name: string, fullPage = false): Promise<void> {
  await page.screenshot({ 
    path: `test-results/screenshots/${name}.png`,
    fullPage 
  });
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, locator: Locator): Promise<boolean> {
  return locator.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  });
}

/**
 * Click with retry on potential flakiness
 */
export async function clickWithRetry(locator: Locator, maxRetries = 3): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await locator.click({ timeout: SHORT_TIMEOUT });
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await locator.page().waitForTimeout(100);
    }
  }
}

/**
 * Fill input with retry
 */
export async function fillWithRetry(locator: Locator, value: string, maxRetries = 3): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await locator.fill(value, { timeout: SHORT_TIMEOUT });
      // Verify value was set
      const actualValue = await locator.inputValue();
      if (actualValue === value) return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
    await locator.page().waitForTimeout(100);
  }
}

/**
 * Wait for element to have specific attribute value
 */
export async function waitForAttribute(
  locator: Locator, 
  attribute: string, 
  value: string | RegExp,
  timeout = SHORT_TIMEOUT
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const attrValue = await locator.getAttribute(attribute);
    
    if (typeof value === 'string') {
      if (attrValue === value) return;
    } else {
      if (value.test(attrValue || '')) return;
    }
    
    await locator.page().waitForTimeout(100);
  }
  
  throw new Error(`Timeout waiting for attribute ${attribute} to match ${value}`);
}

/**
 * Verify theme is set correctly using polling
 */
export async function verifyTheme(page: Page, expectedTheme: 'light' | 'dark'): Promise<void> {
  const htmlLocator = page.locator('html');
  
  await expect.poll(
    async () => {
      try {
        const htmlClasses = await htmlLocator.getAttribute('class', { timeout: 2000 });
        const hasDarkClass = htmlClasses?.includes('dark') || false;
        return hasDarkClass;
      } catch {
        // If getAttribute fails, return current expectation's inverse to trigger retry
        return expectedTheme === 'light';
      }
    },
    {
      message: `Expected ${expectedTheme} theme but theme did not change in time`,
      timeout: 15000,
      intervals: [100, 200, 500, 1000],
    }
  ).toBe(expectedTheme === 'dark');
}

/**
 * Get count of visible elements
 */
export async function getVisibleCount(locator: Locator): Promise<number> {
  const elements = await locator.all();
  let count = 0;
  
  for (const el of elements) {
    if (await el.isVisible().catch(() => false)) {
      count++;
    }
  }
  
  return count;
}
