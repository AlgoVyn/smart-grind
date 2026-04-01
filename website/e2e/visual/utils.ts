import { Page, Locator } from '@playwright/test';

/**
 * Visual Test Utilities
 * 
 * Helper functions for consistent visual regression testing
 */

/**
 * Wait for all images to load in a container
 */
export const waitForImages = async (page: Page, container?: Locator): Promise<void> => {
    const scope = container || page;
    const images = await scope.locator('img').all();
    
    await Promise.all(
        images.map(async (img) => {
            await img.evaluate((el) => {
                if ((el as HTMLImageElement).complete) return;
                return new Promise((resolve) => {
                    el.addEventListener('load', resolve, { once: true });
                    el.addEventListener('error', resolve, { once: true });
                });
            });
        })
    );
};

/**
 * Wait for fonts to be ready
 */
export const waitForFonts = async (page: Page): Promise<void> => {
    await page.evaluate(() => document.fonts.ready);
};

/**
 * Stabilize UI before screenshot
 * - Waits for fonts
 * - Waits for images
 * - Waits for any loading indicators to disappear
 */
export const stabilizeUI = async (page: Page): Promise<void> => {
    await waitForFonts(page);
    await waitForImages(page);
    
    // Wait for loading indicators to disappear
    const loaders = page.locator('.animate-spin, .skeleton, [class*="loading"]');
    await loaders.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
        // Loading indicators may not exist, that's ok
    });
};

/**
 * Mask dynamic content for consistent screenshots
 */
export const maskDynamicElements = (page: Page): void => {
    // Add CSS to mask dynamic elements
    page.addStyleTag({
        content: `
            /* Mask elements that change between runs */
            [data-testid="timestamp"],
            [data-testid="random-id"],
            .current-time,
            .random-value {
                visibility: hidden !important;
            }
        `,
    });
};

/**
 * Hide caret/blinking cursor for consistent screenshots
 */
export const hideCaret = (page: Page): void => {
    page.addStyleTag({
        content: `
            * {
                caret-color: transparent !important;
            }
        `,
    });
};
