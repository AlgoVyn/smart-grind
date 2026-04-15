/**
 * Memory Performance Benchmarks
 * 
 * Measures heap usage, growth rate, and leak detection.
 */

import { test, expect, Page } from '@playwright/test';
import {
  measureMemoryUsage,
  detectMemoryLeaks,
  setupAuthStateBeforeLoad,
} from '../utils';
import { AppPage } from '../page-objects/app-page';
import { setupAPIMocks, mockServiceWorker } from '../utils/mock-api';
import { THRESHOLDS, PERFORMANCE_TEST_TIMEOUT } from './config';
import { logWithColor, formatBytes } from './results';

test.describe.configure({ mode: 'serial' });

test.describe('Memory Benchmarks', () => {
  test.setTimeout(PERFORMANCE_TEST_TIMEOUT);
  
  let page: Page;
  let appPage: AppPage;
  let initialHeap: Awaited<ReturnType<typeof measureMemoryUsage>>;
  let afterInteractions: Awaited<ReturnType<typeof measureMemoryUsage>>;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    await setupAuthStateBeforeLoad(page, 'perf-test-user', 'Performance Test');
    await setupAPIMocks(page);
    await mockServiceWorker(page);
    
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    await page.waitForSelector('#loading-screen', { state: 'hidden' });
    
    appPage = new AppPage(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('initial heap size', async () => {
    logWithColor('\n🧪 Measuring Initial Heap Size...', 'info');
    
    await page.evaluate(() => {
      if (window.gc) (window as unknown as { gc: () => void }).gc();
    });
    await page.waitForTimeout(100);
    
    initialHeap = await measureMemoryUsage(page);
    
    logWithColor(`  Initial Heap: ${formatBytes(initialHeap.usedJSHeapSize)} / ${formatBytes(initialHeap.totalJSHeapSize)} (${initialHeap.usedHeapPercentage.toFixed(1)}%)`, 
      initialHeap.usedHeapPercentage < 80 ? 'success' : 'warning');
    
    expect.soft(initialHeap.usedJSHeapSize).toBeLessThan(THRESHOLDS.maxHeapSizeMB * 1024 * 1024);
  });

  test('heap size after interactions', async () => {
    logWithColor('\n🧪 Measuring Heap After Interactions...', 'info');
    
    await appPage.search('test query');
    await appPage.filterBy('solved');
    await appPage.filterBy('due');
    await appPage.toggleTheme();
    await page.waitForTimeout(500);
    
    afterInteractions = await measureMemoryUsage(page);
    
    logWithColor(`  After Interactions: ${formatBytes(afterInteractions.usedJSHeapSize)} / ${formatBytes(afterInteractions.totalJSHeapSize)} (${afterInteractions.usedHeapPercentage.toFixed(1)}%)`, 
      afterInteractions.usedHeapPercentage < 85 ? 'success' : 'warning');
  });

  test('memory growth rate', async () => {
    logWithColor('\n🧪 Calculating Memory Growth Rate...', 'info');
    
    const growthBytes = afterInteractions.usedJSHeapSize - initialHeap.usedJSHeapSize;
    const growthPercent = (growthBytes / initialHeap.usedJSHeapSize) * 100;
    
    logWithColor(`  Growth: ${formatBytes(growthBytes)} (${growthPercent.toFixed(2)}%)`, 
      growthPercent < THRESHOLDS.memoryGrowthPercent ? 'success' : 'warning');
    
    expect.soft(growthPercent).toBeLessThan(THRESHOLDS.memoryGrowthPercent);
  });

  test('memory leak detection', async () => {
    logWithColor('\n🧪 Running Memory Leak Detection...', 'info');
    
    const leakResult = await detectMemoryLeaks(
      page,
      async (p) => {
        const ap = new AppPage(p);
        await ap.openAddProblemModal();
        await p.waitForTimeout(200);
        await p.keyboard.press('Escape');
        await p.waitForTimeout(200);
        await ap.filterBy('all');
        await ap.filterBy('solved');
        await ap.filterBy('all');
      },
      {
        threshold: THRESHOLDS.memoryGrowthPercent,
        iterations: 5,
        gcBetweenRuns: true,
      }
    );
    
    logWithColor(`  Timeline: ${leakResult.timeline.length} measurements`, 'info');
    logWithColor(`  Has Leak: ${leakResult.hasLeak ? 'YES' : 'NO'}`, 
      leakResult.hasLeak ? 'error' : 'success');
    logWithColor(`  Growth: ${leakResult.percentageIncrease.toFixed(2)}%`, 
      leakResult.percentageIncrease > THRESHOLDS.memoryGrowthPercent ? 'warning' : 'success');
    
    expect.soft(leakResult.hasLeak).toBe(false);
  });
});
