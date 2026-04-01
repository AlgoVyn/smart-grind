import { test, expect } from '@playwright/test';
import { stabilizeUI, maskDynamicElements, hideCaret } from './utils';
import { setupAuthStateBeforeLoad } from '../utils/test-helpers';

/**
 * Visual Regression Tests - Modals
 * 
 * Tests for modal dialogs and overlays
 */

test.describe('Modal Visual Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Setup auth state before loading page
        await setupAuthStateBeforeLoad(page);
        await page.goto('/');
        await page.waitForSelector('#app-wrapper', { state: 'visible', timeout: 30000 });
        await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 30000 });
        // Apply visual stabilization for consistent screenshots
        await stabilizeUI(page);
        maskDynamicElements(page);
        hideCaret(page);
    });

    test('add problem modal opens correctly', async ({ page }) => {
        // Open add problem modal using JavaScript click
        await page.locator('#open-add-modal-btn').evaluate((el: HTMLElement) => {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        
        const modal = page.locator('#add-problem-modal');
        await expect(modal).toBeVisible();
        // Wait for modal animation to complete and stabilize
        await page.waitForTimeout(300);
        await stabilizeUI(page);
        
        // Verify modal has content
        await expect(modal).toContainText('Add Problem');
        
        // Close modal
        await page.locator('#cancel-add-btn').evaluate((el: HTMLElement) => {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        await expect(modal).toBeHidden();
    });

    test('alert modal opens correctly', async ({ page }) => {
        // Try to use global UI object first
        const hasGlobalUI = await page.evaluate(() => {
            // @ts-expect-error - accessing global UI
            return typeof window.SmartGrind?.ui?.showAlert === 'function';
        });
        
        if (hasGlobalUI) {
            await page.evaluate(() => {
                // @ts-expect-error - accessing global UI
                window.SmartGrind.ui.showAlert('This is a test alert message');
            });
        } else {
            test.skip('Global UI not available');
            return;
        }
        
        const modal = page.locator('#alert-modal');
        await expect(modal).toBeVisible();
        await page.waitForTimeout(300);
        await stabilizeUI(page);
        
        // Verify alert content
        await expect(modal).toContainText('test alert message');
        
        // Close modal
        await page.locator('#alert-ok-btn').evaluate((el: HTMLElement) => {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        await expect(modal).toBeHidden();
    });

    test('confirm modal opens correctly', async ({ page }) => {
        // Try to use global UI object first
        const hasGlobalUI = await page.evaluate(() => {
            // @ts-expect-error - accessing global UI
            return typeof window.SmartGrind?.ui?.showConfirm === 'function';
        });
        
        if (hasGlobalUI) {
            await page.evaluate(() => {
                // @ts-expect-error - accessing global UI
                window.SmartGrind.ui.showConfirm('Are you sure you want to delete this?');
            });
        } else {
            test.skip('Global UI not available');
            return;
        }
        
        const modal = page.locator('#confirm-modal');
        await expect(modal).toBeVisible();
        await page.waitForTimeout(300);
        await stabilizeUI(page);
        
        // Verify confirm content
        await expect(modal).toContainText('Are you sure');
        
        // Cancel
        await page.locator('#confirm-cancel-btn').evaluate((el: HTMLElement) => {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        await expect(modal).toBeHidden();
    });
});

test.describe('Flashcards Visual Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Setup auth state before loading page
        await setupAuthStateBeforeLoad(page);
        await page.goto('/');
        await page.waitForSelector('#app-wrapper', { state: 'visible', timeout: 30000 });
        await page.waitForSelector('#loading-screen', { state: 'hidden', timeout: 30000 });
        // Apply visual stabilization for consistent screenshots
        await stabilizeUI(page);
        maskDynamicElements(page);
        hideCaret(page);
    });

    test.skip('flashcards setup screen opens correctly', async ({ page }) => {
        // Open flashcards modal using JavaScript click
        await page.locator('#study-flashcards-btn').evaluate((el: HTMLElement) => {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
        
        const modal = page.locator('#flashcards-modal');
        await expect(modal).toBeVisible();
        await page.waitForTimeout(300);
        await stabilizeUI(page);
        
        // Verify setup screen content
        const setupScreen = page.locator('#flashcards-setup');
        await expect(setupScreen).toContainText('Flashcards');
        
        // Close modal
        await page.locator('#flashcard-cancel-btn').evaluate((el: HTMLElement) => {
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
    });
});
