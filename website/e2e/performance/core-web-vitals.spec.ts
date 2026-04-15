/**
 * Core Web Vitals Benchmarks
 * 
 * Measures LCP, FCP, TTFB, and CLS metrics.
 */

import { test, expect, Page } from '@playwright/test';
import {
  checkCoreWebVitals,
  setupAuthStateBeforeLoad,
} from '../utils';
import { setupAPIMocks, mockServiceWorker } from '../utils/mock-api';
import { THRESHOLDS, PERFORMANCE_TEST_TIMEOUT } from './config';
import { logWithColor, formatTableRow } from './results';

test.describe.configure({ mode: 'serial' });

test.describe('Core Web Vitals Assessment', () => {
  test.setTimeout(PERFORMANCE_TEST_TIMEOUT);
  
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await setupAuthStateBeforeLoad(page, 'perf-test-user', 'Performance Test');
    await setupAPIMocks(page);
    await mockServiceWorker(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('measure Core Web Vitals', async () => {
    logWithColor('\n🧪 Measuring Core Web Vitals...', 'info');
    
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    
    const coreWebVitals = await checkCoreWebVitals(page);
    
    logWithColor(`  LCP: ${coreWebVitals.lcp.value.toFixed(1)}ms [${coreWebVitals.lcp.rating}]`, 
      coreWebVitals.lcp.rating === 'good' ? 'success' : 'warning');
    logWithColor(`  FCP: ${coreWebVitals.fcp.value.toFixed(1)}ms [${coreWebVitals.fcp.rating}]`, 
      coreWebVitals.fcp.rating === 'good' ? 'success' : 'warning');
    logWithColor(`  TTFB: ${coreWebVitals.ttfb.value.toFixed(1)}ms [${coreWebVitals.ttfb.rating}]`, 
      coreWebVitals.ttfb.rating === 'good' ? 'success' : 'warning');
    logWithColor(`  CLS: ${coreWebVitals.cls.value.toFixed(4)} [${coreWebVitals.cls.rating}]`, 
      coreWebVitals.cls.rating === 'good' ? 'success' : 'warning');
    
    expect(coreWebVitals.lcp.rating).not.toBe('poor');
    expect(coreWebVitals.fcp.rating).not.toBe('poor');
    expect(coreWebVitals.cls.rating).not.toBe('poor');
  });

  test('validate LCP threshold', async () => {
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    
    const vitals = await checkCoreWebVitals(page);
    
    logWithColor(`\n🧪 Validating LCP Threshold...`, 'info');
    logWithColor(formatTableRow('LCP', vitals.lcp.value.toFixed(1), 'ms', THRESHOLDS.lcpMs, vitals.lcp.value),
      vitals.lcp.value < THRESHOLDS.lcpMs ? 'success' : 'warning');
    
    expect.soft(vitals.lcp.value).toBeLessThan(THRESHOLDS.lcpMs);
  });

  test('validate FCP threshold', async () => {
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    
    const vitals = await checkCoreWebVitals(page);
    
    logWithColor(`\n🧪 Validating FCP Threshold...`, 'info');
    logWithColor(formatTableRow('FCP', vitals.fcp.value.toFixed(1), 'ms', THRESHOLDS.fcpMs, vitals.fcp.value),
      vitals.fcp.value < THRESHOLDS.fcpMs ? 'success' : 'warning');
    
    expect.soft(vitals.fcp.value).toBeLessThan(THRESHOLDS.fcpMs);
  });

  test('validate CLS threshold', async () => {
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    
    const vitals = await checkCoreWebVitals(page);
    
    logWithColor(`\n🧪 Validating CLS Threshold...`, 'info');
    logWithColor(formatTableRow('CLS', vitals.cls.value.toFixed(4), '', 0.1, vitals.cls.value),
      vitals.cls.value < 0.1 ? 'success' : 'warning');
    
    expect.soft(vitals.cls.value).toBeLessThan(0.1);
  });
});
