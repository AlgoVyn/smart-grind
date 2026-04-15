/**
 * Page Load Performance Benchmarks
 * 
 * Measures cold start, warm start, TTFB, FCP, and LCP metrics.
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';
import {
  measurePageLoad,
  measureResourceTiming,
  setupAuthStateBeforeLoad,
} from '../utils';
import { AppPage } from '../page-objects/app-page';
import { setupAPIMocks, mockServiceWorker } from '../utils/mock-api';
import { ITERATIONS, THRESHOLDS, PERFORMANCE_TEST_TIMEOUT, BASE_URL } from './config';
import type { BenchmarkResults, BenchmarkRun } from './types';
import { calculateStats, logWithColor, saveResults, loadPreviousResults, printResults } from './results';

// Initialize results object (shared via test context in real implementation)
const results: Partial<BenchmarkResults> = {
  meta: {
    timestamp: new Date().toISOString(),
    url: BASE_URL,
    userAgent: '',
    viewport: { width: 1280, height: 720 },
    iterations: ITERATIONS,
  },
  pageLoad: {
    coldStart: [],
    warmStart: [],
    averages: {
      ttfb: { avg: 0, min: 0, max: 0, p95: 0 },
      fcp: { avg: 0, min: 0, max: 0, p95: 0 },
      lcp: { avg: 0, min: 0, max: 0, p95: 0 },
      load: { avg: 0, min: 0, max: 0, p95: 0 },
      totalDuration: { avg: 0, min: 0, max: 0, p95: 0 },
    },
  },
};

test.describe.configure({ mode: 'serial' });

test.describe('Page Load Benchmarks', () => {
  test.setTimeout(PERFORMANCE_TEST_TIMEOUT);
  
  let page: Page;
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    page = await context.newPage();
    
    // Setup mocks
    await setupAPIMocks(page);
    await mockServiceWorker(page);
    
    // Store user agent
    results.meta!.userAgent = await page.evaluate(() => navigator.userAgent);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('cold start - measure without cache', async ({ browser }) => {
    logWithColor('\n🧪 Running Cold Start Benchmarks...', 'info');
    
    const coldContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    
    try {
      for (let i = 0; i < ITERATIONS; i++) {
        const coldPage = await coldContext.newPage();
        
        await setupAuthStateBeforeLoad(coldPage, 'perf-test-user', 'Performance Test');
        await setupAPIMocks(coldPage);
        await mockServiceWorker(coldPage);
        
        await coldPage.goto('/smartgrind/', { waitUntil: 'networkidle' });
        await coldPage.waitForSelector('#app-wrapper', { state: 'visible', timeout: 15000 });
        await coldPage.waitForSelector('#loading-screen', { state: 'hidden', timeout: 20000 });
        
        const metrics = await measurePageLoad(coldPage);
        
        results.pageLoad!.coldStart.push({
          iteration: i + 1,
          metrics,
        });
        
        logWithColor(`  Iteration ${i + 1}/${ITERATIONS}: TTFB=${metrics.ttfb.toFixed(0)}ms, FCP=${metrics.fcp.toFixed(0)}ms, LCP=${metrics.lcp.toFixed(0)}ms, Load=${metrics.load.toFixed(0)}ms`, 'info');
        
        await coldPage.close();
        await new Promise(r => setTimeout(r, 500));
      }
    } finally {
      await coldContext.close();
    }
    
    // Calculate averages
    const ttfbValues = results.pageLoad!.coldStart.map(r => r.metrics.ttfb);
    const fcpValues = results.pageLoad!.coldStart.map(r => r.metrics.fcp);
    const lcpValues = results.pageLoad!.coldStart.map(r => r.metrics.lcp);
    const loadValues = results.pageLoad!.coldStart.map(r => r.metrics.load);
    const durationValues = results.pageLoad!.coldStart.map(r => r.metrics.totalDuration);
    
    results.pageLoad!.averages.ttfb = calculateStats(ttfbValues);
    results.pageLoad!.averages.fcp = calculateStats(fcpValues);
    results.pageLoad!.averages.lcp = calculateStats(lcpValues);
    results.pageLoad!.averages.load = calculateStats(loadValues);
    results.pageLoad!.averages.totalDuration = calculateStats(durationValues);
    
    // Soft assertions
    expect.soft(results.pageLoad!.averages.ttfb.avg).toBeLessThan(THRESHOLDS.ttfbMs);
    expect.soft(results.pageLoad!.averages.fcp.avg).toBeLessThan(THRESHOLDS.fcpMs);
    expect.soft(results.pageLoad!.averages.lcp.avg).toBeLessThan(THRESHOLDS.lcpMs);
    expect.soft(results.pageLoad!.averages.load.avg).toBeLessThan(THRESHOLDS.coldStartMs);
    
    results.meta!.url = page.url();
  });

  test('warm start - measure with cache', async () => {
    logWithColor('\n🧪 Running Warm Start Benchmarks...', 'info');
    
    await setupAuthStateBeforeLoad(page, 'perf-test-user', 'Performance Test');
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    
    for (let i = 0; i < ITERATIONS; i++) {
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForSelector('#loading-screen', { state: 'hidden' });
      
      const metrics = await measurePageLoad(page);
      
      results.pageLoad!.warmStart.push({
        iteration: i + 1,
        metrics,
      });
      
      logWithColor(`  Iteration ${i + 1}/${ITERATIONS}: TTFB=${metrics.ttfb.toFixed(0)}ms, FCP=${metrics.fcp.toFixed(0)}ms, Load=${metrics.load.toFixed(0)}ms`, 'info');
      
      await page.waitForTimeout(300);
    }
    
    // Warm start should be significantly faster
    const warmLoadAvg = results.pageLoad!.warmStart.reduce((sum, r) => sum + r.metrics.load, 0) / ITERATIONS;
    expect.soft(warmLoadAvg).toBeLessThan(THRESHOLDS.warmStartMs);
  });

  test('TTFB measurement', async () => {
    logWithColor('\n🧪 Measuring Time to First Byte...', 'info');
    
    const ttfbValues = results.pageLoad!.coldStart.map(r => r.metrics.ttfb);
    const avgTTFB = ttfbValues.reduce((a, b) => a + b, 0) / ttfbValues.length;
    
    logWithColor(`  Average TTFB: ${avgTTFB.toFixed(1)}ms (threshold: ${THRESHOLDS.ttfbMs}ms)`, 
      avgTTFB < THRESHOLDS.ttfbMs ? 'success' : 'warning');
    
    expect.soft(avgTTFB).toBeLessThan(THRESHOLDS.ttfbMs);
  });

  test('FCP measurement', async () => {
    logWithColor('\n🧪 Measuring First Contentful Paint...', 'info');
    
    const fcpValues = results.pageLoad!.coldStart.map(r => r.metrics.fcp);
    const avgFCP = fcpValues.reduce((a, b) => a + b, 0) / fcpValues.length;
    
    logWithColor(`  Average FCP: ${avgFCP.toFixed(1)}ms (threshold: ${THRESHOLDS.fcpMs}ms)`, 
      avgFCP < THRESHOLDS.fcpMs ? 'success' : 'warning');
    
    expect.soft(avgFCP).toBeLessThan(THRESHOLDS.fcpMs);
  });

  test('LCP measurement', async () => {
    logWithColor('\n🧪 Measuring Largest Contentful Paint...', 'info');
    
    const lcpValues = results.pageLoad!.coldStart.map(r => r.metrics.lcp);
    const validLCPs = lcpValues.filter(v => v > 0);
    
    if (validLCPs.length > 0) {
      const avgLCP = validLCPs.reduce((a, b) => a + b, 0) / validLCPs.length;
      
      logWithColor(`  Average LCP: ${avgLCP.toFixed(1)}ms (threshold: ${THRESHOLDS.lcpMs}ms)`, 
        avgLCP < THRESHOLDS.lcpMs ? 'success' : 'warning');
      
      expect.soft(avgLCP).toBeLessThan(THRESHOLDS.lcpMs);
    }
  });
});
