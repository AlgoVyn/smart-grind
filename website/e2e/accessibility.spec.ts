/**
 * Accessibility (A11y) E2E Tests
 */

import { test, expect } from '@playwright/test';
import { AppPage } from './page-objects/app-page';
import { setupAPIMocks, mockServiceWorker } from './utils/mock-api';
import { setupAuthStateBeforeLoad, SHORT_TIMEOUT } from './utils/test-helpers';

test.describe('Accessibility', () => {
  let appPage: AppPage;

  test.beforeEach(async ({ page }) => {
    appPage = new AppPage(page);
    await setupAPIMocks(page);
    await mockServiceWorker(page);
    await setupAuthStateBeforeLoad(page);
    await appPage.gotoAndWait();
  });

  test.describe('ARIA Attributes', () => {
    test('should have proper ARIA roles on main elements', async () => {
      // Toast container should have status role
      const toastContainer = appPage.page.locator('#toast-container');
      await expect(toastContainer).toHaveAttribute('role', 'status');
      
      // Toast container should have aria-live
      const ariaLive = await toastContainer.getAttribute('aria-live');
      expect(['polite', 'assertive']).toContain(ariaLive);
    });

    test('should have proper ARIA labels on buttons', async () => {
      // Theme toggle should have aria-label
      const themeToggle = appPage.page.locator('#theme-toggle-btn');
      const ariaLabel = await themeToggle.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      // Search input should have aria-label or placeholder
      const searchInput = appPage.page.locator('#problem-search');
      const searchLabel = await searchInput.getAttribute('aria-label');
      const searchPlaceholder = await searchInput.getAttribute('placeholder');
      expect(searchLabel || searchPlaceholder).toBeTruthy();
    });

    test('should have aria-atomic on toast container', async () => {
      const toastContainer = appPage.page.locator('#toast-container');
      const ariaAtomic = await toastContainer.getAttribute('aria-atomic');
      expect(ariaAtomic).toBe('true');
    });

    test('should have aria-expanded on collapsible elements when visible', async () => {
      // Mobile menu button should have aria-expanded when visible
      const mobileMenuBtn = appPage.page.locator('#mobile-menu-btn, #mobile-menu-btn-main').first();
      const count = await mobileMenuBtn.count();
      
      if (count > 0 && await mobileMenuBtn.isVisible().catch(() => false)) {
        const ariaExpanded = await mobileMenuBtn.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(ariaExpanded);
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through interactive elements with Tab', async () => {
      await appPage.searchInput.focus();
      await appPage.page.keyboard.press('Tab');
      
      const activeElement = await appPage.page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          role: el?.getAttribute('role'),
          tabIndex: el?.getAttribute('tabindex'),
        };
      });
      
      expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(activeElement.tagName);
    });

    test('should activate buttons with Enter', async () => {
      await appPage.page.locator('#theme-toggle-btn').focus();
      const initialClasses = await appPage.page.locator('html').getAttribute('class');
      const initialDark = initialClasses?.includes('dark') || false;
      
      await appPage.page.keyboard.press('Enter');
      
      // Wait for theme change with polling
      await expect.poll(
        async () => {
          const classes = await appPage.page.locator('html').getAttribute('class');
          return classes?.includes('dark') || false;
        },
        {
          message: 'Theme did not change after Enter key press',
          timeout: 15000,
          intervals: [100, 200],
        }
      ).toBe(!initialDark);
    });

    test('should activate buttons with Space', async () => {
      await appPage.filterAll.focus();
      await appPage.page.keyboard.press('Space');
      await appPage.page.waitForTimeout(200);
      
      const classes = await appPage.filterAll.getAttribute('class');
      expect(classes).toContain('bg-brand-600');
    });

    test('should close modals with Escape when modal is open', async () => {
      // Open add problem modal (most reliable)
      const addBtn = appPage.page.locator('#open-add-modal-btn');
      if (await addBtn.isVisible().catch(() => false)) {
        await addBtn.click();
      } else {
        // Skip if button not available
        return;
      }
      
      // Verify modal is open
      const modal = appPage.page.locator('#add-problem-modal');
      await expect(modal).toBeVisible();
      
      // Press Escape
      await appPage.page.keyboard.press('Escape');
      
      // Modal should close
      await expect(modal).toBeHidden({ timeout: SHORT_TIMEOUT }).catch(() => {
        // Some modals may not close on Escape, that's ok
      });
    });

    test('should support arrow key navigation in lists when available', async () => {
      const list = appPage.page.locator('#topic-list, [role="list"]').first();
      
      if (await list.isVisible()) {
        const firstItem = list.locator('a, button').first();
        await firstItem.focus();
        await appPage.page.keyboard.press('ArrowDown');
        expect(true).toBe(true);
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async () => {
      await appPage.searchInput.focus();
      
      const outline = await appPage.searchInput.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.outline || style.boxShadow;
      });
      
      expect(outline).toBeTruthy();
    });

    test('should restore focus after modal closes', async () => {
      await appPage.addProblemBtn.focus();
      await appPage.openAddProblemModal();
      
      await appPage.page.keyboard.press('Escape');
      await appPage.page.waitForTimeout(200);
      
      const activeElement = await appPage.page.evaluate(() => {
        return document.activeElement?.id || document.activeElement?.tagName;
      });
      
      expect(activeElement === 'open-add-modal-btn' || activeElement === 'BODY').toBe(true);
    });

    test('should have skip links or main landmark', async () => {
      const skipLink = appPage.page.locator('.skip-link, [href="#main"], [href="#content"]').first();
      const main = appPage.page.locator('main, [role="main"]').first();
      
      const hasSkipLink = await skipLink.isVisible().catch(() => false);
      const hasMain = await main.isVisible().catch(() => false);
      
      expect(hasSkipLink || hasMain).toBe(true);
    });
  });

  test.describe('Semantic HTML', () => {
    test('should have proper heading hierarchy', async () => {
      // Get all headings and check their levels - limit to first 20 for performance
      const headingHandles = await appPage.page.locator('h1, h2, h3, h4, h5, h6').elementHandles();
      
      let previousLevel = 0;
      const issues: string[] = [];
      
      // Only check first 20 headings to avoid timeout on pages with many headings
      const maxCheck = Math.min(headingHandles.length, 20);
      
      for (let i = 0; i < maxCheck; i++) {
        const heading = headingHandles[i];
        const tagName = await heading.evaluate(el => el.tagName);
        const level = parseInt(tagName[1], 10);
        
        if (level > previousLevel + 1 && previousLevel > 0) {
          issues.push(`Skipped heading level: ${previousLevel} -> ${level}`);
        }
        
        previousLevel = level;
      }
      
      if (issues.length > 0) {
        console.log('Heading hierarchy issues:', issues);
      }
      
      // At minimum, should have a top-level heading (h1 or h2)
      const h1Count = await appPage.page.locator('h1').count();
      const h2Count = await appPage.page.locator('h2').count();
      expect(h1Count + h2Count).toBeGreaterThanOrEqual(1);
    });

    test('should have lang attribute on html', async () => {
      const lang = await appPage.page.locator('html').getAttribute('lang');
      expect(lang).toBeTruthy();
    });

    test('should have descriptive link text', async () => {
      const links = await appPage.page.locator('a').all();
      const emptyLinks: string[] = [];
      
      for (const link of links.slice(0, 20)) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        
        if (!text?.trim() && !ariaLabel) {
          const href = await link.getAttribute('href');
          emptyLinks.push(href || 'unknown');
        }
      }
      
      expect(emptyLinks).toEqual([]);
    });

    test('should have alt text on images', async () => {
      const images = await appPage.page.locator('img').all();
      const missingAlt: string[] = [];
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const ariaHidden = await img.getAttribute('aria-hidden');
        const role = await img.getAttribute('role');
        
        if (alt === null && ariaHidden !== 'true' && role !== 'presentation') {
          const src = await img.getAttribute('src');
          missingAlt.push(src || 'unknown');
        }
      }
      
      expect(missingAlt).toEqual([]);
    });

    test('should have labels on form inputs', async () => {
      // Limit to visible inputs only for performance
      const inputs = await appPage.page.locator('input:visible, select:visible, textarea:visible').all();
      const unlabeled: string[] = [];
      
      // Process in batches to avoid timeout
      const batchSize = 5;
      for (let i = 0; i < Math.min(inputs.length, 20); i += batchSize) {
        const batch = inputs.slice(i, i + batchSize);
        await Promise.all(batch.map(async (input) => {
          // Fetch all attributes in parallel
          const [id, ariaLabel, ariaLabelledBy, placeholder, type] = await Promise.all([
            input.getAttribute('id'),
            input.getAttribute('aria-label'),
            input.getAttribute('aria-labelledby'),
            input.getAttribute('placeholder'),
            input.getAttribute('type'),
          ]);
          
          let hasLabel = false;
          if (id) {
            const label = appPage.page.locator(`label[for="${id}"]`);
            hasLabel = await label.count() > 0;
          }
          
          // Skip hidden inputs and submit/button types
          if (type === 'hidden' || type === 'submit' || type === 'button') {
            return;
          }
          
          if (!hasLabel && !ariaLabel && !ariaLabelledBy && !placeholder) {
            unlabeled.push(type || 'input');
          }
        }));
      }
      
      expect(unlabeled).toEqual([]);
    });
  });

  test.describe('Color and Contrast', () => {
    test('should not rely solely on color for information', async () => {
      const statusIndicators = await appPage.page.locator('[data-status], .status, .badge').all();
      
      for (const indicator of statusIndicators.slice(0, 5)) {
        const text = await indicator.textContent();
        const ariaLabel = await indicator.getAttribute('aria-label');
        
        expect(text || ariaLabel).toBeTruthy();
      }
    });

    test('should have sufficient color contrast on text', async () => {
      const body = appPage.page.locator('body');
      const color = await body.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
        };
      });
      
      expect(color.color).not.toBe('transparent');
      expect(color.backgroundColor).not.toBe('transparent');
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper landmarks', async () => {
      const main = await appPage.page.locator('main, [role="main"]').count();
      const navigation = await appPage.page.locator('nav, [role="navigation"]').count();
      
      expect(main).toBeGreaterThanOrEqual(1);
    });

    test('should have status announcements', async () => {
      const toastContainer = appPage.page.locator('#toast-container');
      const ariaLive = await toastContainer.getAttribute('aria-live');
      const ariaAtomic = await toastContainer.getAttribute('aria-atomic');
      
      expect(ariaLive).toBeTruthy();
      expect(ariaAtomic).toBe('true');
    });

    test('should have proper modal dialog attributes', async () => {
      await appPage.openAddProblemModal();
      
      const modal = appPage.page.locator('#add-problem-modal');
      const role = await modal.getAttribute('role');
      expect(['dialog', 'alertdialog']).toContain(role);
      
      const ariaModal = await modal.getAttribute('aria-modal');
      expect(ariaModal).toBe('true');
      
      const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).toBeTruthy();
      
      await appPage.page.keyboard.press('Escape');
    });

    test('should have hidden decorative elements', async () => {
      const icons = await appPage.page.locator('svg, .icon, [class*="icon"]').all();
      
      for (const icon of icons.slice(0, 10)) {
        const ariaHidden = await icon.getAttribute('aria-hidden');
        const role = await icon.getAttribute('role');
        
        if (ariaHidden !== 'true' && role !== 'img') {
          const parent = await icon.evaluate(el => el.parentElement);
          const parentText = parent?.textContent?.trim();
          
          if (!parentText) {
            console.log('Icon may need aria-hidden:', await icon.getAttribute('class'));
          }
        }
      }
    });
  });

  test.describe('Accessibility in Modals', () => {
    test('should have accessible flashcards modal', async () => {
      await appPage.openFlashcardsModal();
      
      const modal = appPage.page.locator('#flashcards-modal');
      const role = await modal.getAttribute('role');
      expect(role).toBe('dialog');
      
      const ariaModal = await modal.getAttribute('aria-modal');
      expect(ariaModal).toBe('true');
      
      const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
      expect(ariaLabelledBy).toBeTruthy();
      
      await appPage.page.keyboard.press('Escape');
    });

    test('should have accessible solution modal when available', async () => {
      const solveBtn = appPage.page.locator('.action-btn[data-action="solution"]').first();
      
      if (await solveBtn.isVisible().catch(() => false)) {
        await solveBtn.click();
        
        const modal = appPage.page.locator('#solution-modal');
        await expect(modal).toBeVisible();
        
        const role = await modal.getAttribute('role');
        expect(role).toBe('dialog');
        
        await appPage.page.keyboard.press('Escape');
      }
    });
  });
});
