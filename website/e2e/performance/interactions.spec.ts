/**
 * Interaction Performance Benchmarks
 * 
 * Measures search, filter, modal, theme toggle, and navigation response times.
 */

import { test, expect, Page } from '@playwright/test';
import {
  createPerformanceMark,
  measureBetweenMarks,
  clearPerformanceEntries,
  setupAuthStateBeforeLoad,
} from '../utils';
import { AppPage } from '../page-objects/app-page';
import { setupAPIMocks, mockServiceWorker } from '../utils/mock-api';
import { ITERATIONS, THRESHOLDS, PERFORMANCE_TEST_TIMEOUT } from './config';
import { logWithColor, calculateStats, percentile } from './results';

test.describe.configure({ mode: 'serial' });

test.describe('Interaction Benchmarks', () => {
  test.setTimeout(PERFORMANCE_TEST_TIMEOUT);
  
  let page: Page;
  let appPage: AppPage;

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

  test('search response time', async () => {
    logWithColor('\n🧪 Benchmarking Search Response Time...', 'info');
    
    const measurements: number[] = [];
    
    for (let i = 0; i < ITERATIONS; i++) {
      await appPage.clearSearch();
      await page.waitForTimeout(100);
      
      await createPerformanceMark(page, 'search-start');
      await appPage.search('performance test query');
      await page.waitForFunction(() => {
        const cards = document.querySelectorAll('.problem-card');
        return cards.length >= 0;
      }, { timeout: 2000 });
      await createPerformanceMark(page, 'search-end');
      
      const duration = await measureBetweenMarks(page, 'search-start', 'search-end');
      measurements.push(duration);
      
      logWithColor(`  Iteration ${i + 1}/${ITERATIONS}: ${duration.toFixed(1)}ms`, 'info');
      
      await clearPerformanceEntries(page);
    }
    
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    logWithColor(`  Average: ${avg.toFixed(1)}ms (threshold: ${THRESHOLDS.searchResponseMs}ms)`,
      avg < THRESHOLDS.searchResponseMs ? 'success' : 'warning');
    
    expect.soft(avg).toBeLessThan(THRESHOLDS.searchResponseMs);
  });

  test('filter toggle time', async () => {
    logWithColor('\n🧪 Benchmarking Filter Toggle Time...', 'info');
    
    const measurements: number[] = [];
    const filters: Array<'all' | 'due' | 'solved'> = ['all', 'due', 'solved'];
    
    for (let i = 0; i < ITERATIONS; i++) {
      const filter = filters[i % filters.length];
      
      await createPerformanceMark(page, 'filter-start');
      await appPage.filterBy(filter);
      await page.waitForLoadState('networkidle', { timeout: 1000 }).catch(() => {});
      await createPerformanceMark(page, 'filter-end');
      
      const duration = await measureBetweenMarks(page, 'filter-start', 'filter-end');
      measurements.push(duration);
      
      logWithColor(`  Iteration ${i + 1}/${ITERATIONS} (${filter}): ${duration.toFixed(1)}ms`, 'info');
      
      await clearPerformanceEntries(page);
      await page.waitForTimeout(200);
    }
    
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    logWithColor(`  Average: ${avg.toFixed(1)}ms (threshold: ${THRESHOLDS.filterToggleMs}ms)`,
      avg < THRESHOLDS.filterToggleMs ? 'success' : 'warning');
    
    expect.soft(avg).toBeLessThan(THRESHOLDS.filterToggleMs);
  });

  test('modal open time', async () => {
    logWithColor('\n🧪 Benchmarking Modal Open Time...', 'info');
    
    const measurements: number[] = [];
    
    for (let i = 0; i < ITERATIONS; i++) {
      await createPerformanceMark(page, 'modal-start');
      await appPage.openAddProblemModal();
      await page.waitForSelector('#add-problem-modal', { state: 'visible' });
      await createPerformanceMark(page, 'modal-end');
      
      const duration = await measureBetweenMarks(page, 'modal-start', 'modal-end');
      measurements.push(duration);
      
      logWithColor(`  Iteration ${i + 1}/${ITERATIONS}: ${duration.toFixed(1)}ms`, 'info');
      
      await page.keyboard.press('Escape');
      await page.waitForSelector('#add-problem-modal', { state: 'hidden' });
      
      await clearPerformanceEntries(page);
      await page.waitForTimeout(200);
    }
    
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    logWithColor(`  Average: ${avg.toFixed(1)}ms (threshold: ${THRESHOLDS.modalOpenMs}ms)`,
      avg < THRESHOLDS.modalOpenMs ? 'success' : 'warning');
    
    expect.soft(avg).toBeLessThan(THRESHOLDS.modalOpenMs);
  });

  test('theme toggle time', async () => {
    logWithColor('\n🧪 Benchmarking Theme Toggle Time...', 'info');
    
    const measurements: number[] = [];
    
    for (let i = 0; i < ITERATIONS; i++) {
      await createPerformanceMark(page, 'theme-start');
      await appPage.toggleTheme();
      await createPerformanceMark(page, 'theme-end');
      
      const duration = await measureBetweenMarks(page, 'theme-start', 'theme-end');
      measurements.push(duration);
      
      logWithColor(`  Iteration ${i + 1}/${ITERATIONS}: ${duration.toFixed(1)}ms`, 'info');
      
      await clearPerformanceEntries(page);
    }
    
    if (ITERATIONS % 2 === 1) {
      await appPage.toggleTheme();
    }
    
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    logWithColor(`  Average: ${avg.toFixed(1)}ms (threshold: ${THRESHOLDS.themeToggleMs}ms)`,
      avg < THRESHOLDS.themeToggleMs ? 'success' : 'warning');
    
    expect.soft(avg).toBeLessThan(THRESHOLDS.themeToggleMs);
  });
});
