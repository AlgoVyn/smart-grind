/**
 * Base Page Object
 * 
 * Provides common functionality for all page objects.
 * All other page objects should extend this class.
 */

import { Page, Locator } from '@playwright/test';
import { waitForAppReady, SHORT_TIMEOUT, DEFAULT_TIMEOUT } from '../utils/test-helpers';

// Base URL for the application
const BASE_URL = 'http://localhost:3000/smartgrind/';

export abstract class BasePage {
  constructor(public page: Page) {}

  /**
   * Navigate to the base URL
   */
  async goto(): Promise<void> {
    await this.page.goto(BASE_URL);
  }

  /**
   * Wait for app to be ready
   */
  async waitForReady(timeout = DEFAULT_TIMEOUT): Promise<void> {
    await waitForAppReady(this.page, timeout);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Get current URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForUrl(pattern: string | RegExp, timeout = SHORT_TIMEOUT): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Reload the page
   */
  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForReady();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Get locator for an element
   */
  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(selector: string, timeout = SHORT_TIMEOUT): Promise<Locator> {
    const element = this.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(selector: string, timeout = SHORT_TIMEOUT): Promise<void> {
    const element = this.locator(selector);
    await element.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Press key on keyboard
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Take screenshot
   */
  async screenshot(name: string, fullPage = false): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage 
    });
  }

  /**
   * Get viewport size
   */
  getViewportSize(): { width: number; height: number } | null {
    return this.page.viewportSize();
  }

  /**
   * Check if element exists in DOM
   */
  async exists(selector: string): Promise<boolean> {
    const count = await this.locator(selector).count();
    return count > 0;
  }

  /**
   * Get element count
   */
  async getCount(selector: string): Promise<number> {
    return this.locator(selector).count();
  }
}
