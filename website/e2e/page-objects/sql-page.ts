/**
 * SQL Section Page Object
 * 
 * Represents the SQL section UI components.
 */

import { Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { SHORT_TIMEOUT } from '../utils/test-helpers';

export class SQLPage extends BasePage {
  // Sidebar SQL section
  readonly sqlSectionHeader: Locator;
  readonly sqlCategories: Locator;
  
  // Main SQL view
  readonly sqlView: Locator;
  readonly sqlTopic: Locator;
  readonly sqlProblems: Locator;
  readonly sqlCategoryCards: Locator;
  
  // SQL problem cards
  readonly sqlProblemCards: Locator;
  readonly sqlProblemNames: Locator;
  readonly sqlStatusToggles: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    
    // Sidebar
    this.sqlSectionHeader = page.locator('.sidebar-collapsible-section:has-text("SQL")');
    this.sqlCategories = page.locator('[data-topic^="sql-"], a[href*="/s/"]');
    
    // Main view
    this.sqlView = page.locator('.sql-view, [data-view="sql"]');
    this.sqlTopic = page.locator('.sql-topic');
    this.sqlProblems = page.locator('.sql-problems');
    this.sqlCategoryCards = page.locator('.sql-category-card');
    
    // Problem cards
    this.sqlProblemCards = page.locator('.sql-problem-card');
    this.sqlProblemNames = page.locator('.sql-problem-name');
    this.sqlStatusToggles = page.locator('.sql-status-toggle');
  }

  /**
   * Expand SQL section in sidebar
   */
  async expandSQLSection(): Promise<void> {
    const header = this.sqlSectionHeader.locator('.sidebar-section-header').first();
    await header.click();
    // Wait for section to expand
    await this.page.waitForSelector('.sidebar-collapsible-section.expanded, [aria-expanded="true"]', { timeout: 1000 }).catch(() => {});
  }

  /**
   * Click SQL category in sidebar
   */
  async clickSQLCategory(categoryId: string): Promise<void> {
    const link = this.page.locator(`.sidebar-link[data-topic="${categoryId}"], a[href*="/s/${categoryId}"]`).first();
    await link.click();
    // Wait for navigation
    await this.page.waitForURL(new RegExp(`s/${categoryId}`), { timeout: 3000 }).catch(() => {});
  }

  /**
   * Click "All SQL" in sidebar
   */
  async clickAllSQL(): Promise<void> {
    const link = this.page.locator('text=All SQL').first();
    await link.click();
    // Wait for SQL view to load
    await this.page.waitForSelector('.sql-view, [data-view="sql"]', { timeout: 3000 }).catch(() => {});
  }

  /**
   * Get SQL category cards count
   */
  async getSQLCategoryCount(): Promise<number> {
    return this.sqlCategoryCards.count();
  }

  /**
   * Get SQL problem cards count
   */
  async getSQLProblemCount(): Promise<number> {
    return this.sqlProblemCards.count();
  }

  /**
   * Get SQL problems
   */
  getSQLProblems(): Locator {
    return this.sqlProblemCards;
  }

  /**
   * Toggle SQL problem status
   */
  async toggleProblemStatus(index: number): Promise<void> {
    const toggle = this.sqlStatusToggles.nth(index);
    await toggle.click();
    // Wait for status change to be reflected in UI
    await this.page.waitForLoadState('domcontentloaded', { timeout: 500 }).catch(() => {});
  }

  /**
   * Click on SQL problem link
   */
  async clickProblemLink(index: number): Promise<string | null> {
    const link = this.sqlProblemNames.nth(index);
    const href = await link.getAttribute('href');
    const target = await link.getAttribute('target');
    
    // Verify it opens in new tab
    expect(target).toBe('_blank');
    
    return href;
  }

  /**
   * Check if SQL view is displayed
   */
  async isSQLViewDisplayed(): Promise<boolean> {
    return this.sqlView.isVisible();
  }

  /**
   * Check if problem is marked as solved
   */
  async isProblemSolved(index: number): Promise<boolean> {
    const card = this.sqlProblemCards.nth(index);
    const classes = await card.getAttribute('class');
    return classes?.includes('bg-green-900') || classes?.includes('solved') || false;
  }

  /**
   * Wait for SQL problems to load
   */
  async waitForProblems(): Promise<void> {
    await expect(this.sqlProblems).toBeVisible({ timeout: SHORT_TIMEOUT });
    await expect(this.sqlProblemCards.first()).toBeVisible({ timeout: SHORT_TIMEOUT });
  }

  /**
   * Get solved problem count
   */
  async getSolvedCount(): Promise<number> {
    const cards = await this.sqlProblemCards.all();
    let solvedCount = 0;
    
    for (let i = 0; i < cards.length; i++) {
      if (await this.isProblemSolved(i)) {
        solvedCount++;
      }
    }
    
    return solvedCount;
  }

  /**
   * Verify no difficulty labels exist on SQL problems
   */
  async verifyNoDifficultyLabels(): Promise<void> {
    const difficultyLabels = this.page.locator('.sql-problem-card .difficulty-label, .sql-problem-card [data-difficulty]');
    const count = await difficultyLabels.count();
    expect(count).toBe(0);
  }

  /**
   * Get all SQL category names from sidebar
   */
  async getSQLCategoryNames(): Promise<string[]> {
    const links = this.page.locator('.sidebar-link[href*="/s/"], .sidebar-link[data-topic^="sql-"]');
    const names: string[] = [];
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      if (text) names.push(text.trim());
    }
    
    return names;
  }
}
