/**
 * App Page Object
 * 
 * Represents the main application page and its components.
 * Provides methods for interacting with the main app UI.
 */

import { Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { SHORT_TIMEOUT, verifyTheme } from '../utils/test-helpers';

export class AppPage extends BasePage {
  // Main containers
  readonly appWrapper: Locator;
  readonly loadingScreen: Locator;
  readonly mainScroll: Locator;
  readonly sidebar: Locator;
  
  // Header elements
  readonly searchInput: Locator;
  readonly themeToggle: Locator;
  readonly viewTitle: Locator;
  
  // Stats elements
  readonly statTotal: Locator;
  readonly statSolved: Locator;
  readonly statDue: Locator;
  
  // Filter buttons
  readonly filterAll: Locator;
  readonly filterDue: Locator;
  readonly filterSolved: Locator;
  readonly filterUnsolved: Locator;
  
  // Sync indicators
  readonly onlineIndicator: Locator;
  readonly offlineIndicator: Locator;
  readonly syncingIndicator: Locator;
  readonly pendingIndicator: Locator;
  
  // User elements
  readonly userDisplay: Locator;
  readonly disconnectBtn: Locator;
  readonly progressBar: Locator;
  
  // Action buttons
  readonly addProblemBtn: Locator;
  readonly flashcardsBtn: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    
    // Containers
    this.appWrapper = page.locator('#app-wrapper');
    this.loadingScreen = page.locator('#loading-screen');
    this.mainScroll = page.locator('#main-scroll');
    this.sidebar = page.locator('#main-sidebar');
    
    // Header
    this.searchInput = page.locator('#problem-search');
    this.themeToggle = page.locator('#theme-toggle-btn');
    this.viewTitle = page.locator('#current-view-title');
    
    // Stats
    this.statTotal = page.locator('#stat-total');
    this.statSolved = page.locator('#stat-solved');
    this.statDue = page.locator('#stat-due');
    
    // Filters
    this.filterAll = page.locator('.filter-btn').filter({ hasText: /All/i });
    this.filterDue = page.locator('.filter-btn').filter({ hasText: /Due/i });
    this.filterSolved = page.locator('.filter-btn').filter({ hasText: /Solved/i });
    this.filterUnsolved = page.locator('.filter-btn').filter({ hasText: /Unsolved/i });
    
    // Sync indicators
    this.onlineIndicator = page.locator('#online-indicator');
    this.offlineIndicator = page.locator('#offline-indicator');
    this.syncingIndicator = page.locator('#syncing-indicator');
    this.pendingIndicator = page.locator('#pending-indicator');
    
    // User
    this.userDisplay = page.locator('#user-display');
    this.disconnectBtn = page.locator('#disconnect-btn');
    this.progressBar = page.locator('#sidebar-total-bar');
    
    // Actions
    this.addProblemBtn = page.locator('#open-add-modal-btn');
    this.flashcardsBtn = page.locator('#study-flashcards-btn');
  }

  /**
   * Navigate to app and wait for it to be ready
   */
  async gotoAndWait(): Promise<void> {
    await this.goto();
    await this.waitForReady();
  }

  /**
   * Search for problems
   */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    // Wait for debounce and search to apply using networkidle instead of fixed timeout
    await this.page.waitForLoadState('networkidle', { timeout: 1000 }).catch(() => {});
  }

  /**
   * Clear search input
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  /**
   * Get search value
   */
  async getSearchValue(): Promise<string> {
    return this.searchInput.inputValue();
  }

  /**
   * Toggle theme between light and dark
   */
  async toggleTheme(): Promise<void> {
    // Get initial theme state
    const initialClasses = await this.page.locator('html').getAttribute('class');
    const initialIsDark = initialClasses?.includes('dark') || false;
    
    // Wait for any loading to complete
    await this.page.waitForLoadState('networkidle').catch(() => {});
    
    // Click the theme toggle
    await this.themeToggle.evaluate((el: HTMLElement) => {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    });
    
    // Wait for theme change with polling instead of fixed timeout
    await expect.poll(
      async () => {
        const classes = await this.page.locator('html').getAttribute('class');
        return classes?.includes('dark') || false;
      },
      {
        message: 'Theme did not change after toggle',
        timeout: 5000,
        intervals: [50, 100, 200],
      }
    ).toBe(!initialIsDark);
  }
  /**
   * Verify current theme
   */
  async verifyTheme(expectedTheme: 'light' | 'dark'): Promise<void> {
    await verifyTheme(this.page, expectedTheme);
  }

  /**
   * Click filter button
   */
  async filterBy(filter: 'all' | 'due' | 'solved' | 'unsolved'): Promise<void> {
    const button = {
      'all': this.filterAll,
      'due': this.filterDue,
      'solved': this.filterSolved,
      'unsolved': this.filterUnsolved,
    }[filter];
    
    await button.click();
    // Wait for filter to apply using networkidle instead of fixed timeout
    await this.page.waitForLoadState('networkidle', { timeout: 1000 }).catch(() => {});
  }

  /**
   * Get problem cards
   */
  getProblemCards(): Locator {
    return this.page.locator('.problem-card');
  }

  /**
   * Get count of problem cards
   */
  async getProblemCount(): Promise<number> {
    return this.getProblemCards().count();
  }

  /**
   * Get visible problem count (excluding filtered out)
   * Optimized using Playwright's :visible pseudo-class
   */
  async getVisibleProblemCount(): Promise<number> {
    // Use native Playwright visible selector for better performance
    return this.page.locator('.problem-card:visible').count();
  }

  /**
   * Click on a problem card by index
   */
  async clickProblemCard(index: number): Promise<void> {
    await this.getProblemCards().nth(index).click();
  }

  /**
   * Check if offline indicator is visible
   */
  async isOffline(): Promise<boolean> {
    return this.offlineIndicator.isVisible();
  }

  /**
   * Check if online indicator is visible
   */
  async isOnline(): Promise<boolean> {
    return this.onlineIndicator.isVisible();
  }

  /**
   * Check if syncing indicator is visible
   */
  async isSyncing(): Promise<boolean> {
    return this.syncingIndicator.isVisible();
  }

  /**
   * Open add problem modal
   */
  async openAddProblemModal(): Promise<void> {
    await this.addProblemBtn.click();
    await this.page.locator('#add-problem-modal').waitFor({ state: 'visible', timeout: SHORT_TIMEOUT });
  }

  /**
   * Open flashcards modal
   */
  async openFlashcardsModal(): Promise<void> {
    await this.flashcardsBtn.click();
    await this.page.locator('#flashcards-modal').waitFor({ state: 'visible', timeout: SHORT_TIMEOUT });
  }

  /**
   * Click sidebar category
   */
  async clickCategory(categoryId: string): Promise<void> {
    const categoryLink = this.page.locator(`.sidebar-link[data-topic-id="${categoryId}"]`);
    await categoryLink.click();
    // Wait for navigation to complete
    await this.page.waitForURL(new RegExp(`c/${categoryId}`), { timeout: 3000 }).catch(() => {});
  }

  /**
   * Navigate to SQL section
   * Returns true if navigation successful, false if SQL section not found
   */
  async navigateToSQLSection(): Promise<boolean> {
    const sqlLink = this.page.locator('.sidebar-link').filter({ hasText: /SQL/i }).first();
    const count = await sqlLink.count();
    
    if (count === 0) {
      return false;
    }
    
    await sqlLink.click();
    
    // Wait for navigation using URL pattern instead of arbitrary timeout
    try {
      await this.page.waitForURL(/s\//, { timeout: 3000 });
      await this.page.waitForSelector('.sql-view, [data-view="sql"], .sql-problems', { 
        state: 'visible', 
        timeout: 3000 
      });
    } catch (error) {
      // Navigation or selector failed
      return false;
    }
    
    return true;
  }

  /**
   * Get SQL section link locator (for checking existence)
   */
  getSQLSectionLink(): Locator {
    return this.page.locator('.sidebar-link').filter({ hasText: /SQL/i }).first();
  }

  /**
   * Get current view title
   */
  async getViewTitle(): Promise<string> {
    const text = await this.viewTitle.textContent();
    return text?.trim() || '';
  }

  /**
   * Get stats values
   */
  async getStats(): Promise<{ total: number; solved: number; due: number }> {
    const total = await this.statTotal.textContent() || '0';
    const solved = await this.statSolved.textContent() || '0';
    const due = await this.statDue.textContent() || '0';
    
    return {
      total: parseInt(total, 10) || 0,
      solved: parseInt(solved, 10) || 0,
      due: parseInt(due, 10) || 0,
    };
  }

  /**
   * Get user display name
   */
  async getUserDisplayName(): Promise<string> {
    const text = await this.userDisplay.textContent();
    return text?.trim() || '';
  }

  /**
   * Click sign out button
   */
  async signOut(): Promise<void> {
    await this.disconnectBtn.click();
  }

  /**
   * Scroll to bottom of main content
   */
  async scrollToBottom(): Promise<void> {
    await this.mainScroll.evaluate(el => el.scrollTo(0, el.scrollHeight));
  }

  /**
   * Check if mobile view is active
   */
  async isMobileView(): Promise<boolean> {
    const size = this.getViewportSize();
    return size ? size.width < 768 : false;
  }

  /**
   * Open mobile menu (if in mobile view)
   */
  async openMobileMenu(): Promise<void> {
    const mobileMenuBtn = this.page.locator('#mobile-menu-btn, #mobile-menu-btn-main').first();
    if (await mobileMenuBtn.isVisible()) {
      // Scroll into view if needed and force click
      await mobileMenuBtn.scrollIntoViewIfNeeded().catch((error) => {
        console.error('[AppPage] Error scrolling mobile menu into view:', error);
      });
      await mobileMenuBtn.click({ force: true });
    }
  }

  /**
   * Close mobile menu
   */
  async closeMobileMenu(): Promise<void> {
    const backdrop = this.page.locator('#sidebar-backdrop');
    if (await backdrop.isVisible()) {
      await backdrop.click();
    } else {
      // Press Escape as fallback
      await this.page.keyboard.press('Escape');
    }
  }
}
