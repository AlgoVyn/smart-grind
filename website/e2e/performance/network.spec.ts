/**
 * Network Performance Benchmarks
 * 
 * Measures API response times, resource loading, and page weight.
 */

import { test, expect, Page, Request } from '@playwright/test';
import {
  measureResourceTiming,
  measureAPIResponseTime,
  setupAuthStateBeforeLoad,
} from '../utils';
import { setupAPIMocks, mockServiceWorker } from '../utils/mock-api';
import { THRESHOLDS, PERFORMANCE_TEST_TIMEOUT } from './config';
import { logWithColor, formatBytes } from './results';

test.describe.configure({ mode: 'serial' });

test.describe('Network Benchmarks', () => {
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

  test('API response times', async () => {
    logWithColor('\n🧪 Measuring API Response Times...', 'info');
    
    const apiTimings: Record<string, number[]> = {};
    const requestStartTimes = new Map<string, number>();
    
    page.on('request', (request: Request) => {
      const url = request.url();
      if (url.includes('/api/') || url.includes('supabase') || url.includes('googleapis')) {
        requestStartTimes.set(url, Date.now());
      }
    });
    
    page.on('requestfinished', async (request) => {
      const url = request.url();
      if (url.includes('/api/') || url.includes('supabase') || url.includes('googleapis')) {
        const response = await request.response();
        if (response && requestStartTimes.has(url)) {
          const startTime = requestStartTimes.get(url)!;
          const duration = Date.now() - startTime;
          
          const endpoint = new URL(url).pathname;
          if (!apiTimings[endpoint]) apiTimings[endpoint] = [];
          apiTimings[endpoint].push(duration);
        }
      }
    });
    
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    await page.waitForTimeout(2000);
    
    Object.entries(apiTimings).forEach(([endpoint, times]) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      logWithColor(`  ${endpoint}: avg=${avg.toFixed(1)}ms, min=${Math.min(...times).toFixed(1)}ms, max=${Math.max(...times).toFixed(1)}ms`, 
        avg < THRESHOLDS.apiResponseMs ? 'success' : 'warning');
      expect.soft(avg).toBeLessThan(THRESHOLDS.apiResponseMs);
    });
  });

  test('resource loading times', async () => {
    logWithColor('\n🧪 Analyzing Resource Loading...', 'info');
    
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    
    const resourceTiming = await measureResourceTiming(page);
    
    logWithColor(`  Total Resources: ${resourceTiming.totalCount}`, 'info');
    logWithColor(`  Cached Resources: ${resourceTiming.cachedCount}`, 'info');
    
    Object.entries(resourceTiming.avgDurations).forEach(([type, duration]) => {
      logWithColor(`  Avg ${type} duration: ${duration.toFixed(1)}ms`, 'info');
    });
    
    if (resourceTiming.slowestResources.length > 0) {
      logWithColor('\n  Slowest Resources:', 'warning');
      resourceTiming.slowestResources.slice(0, 5).forEach(r => {
        logWithColor(`    ${r.name.substring(0, 60)}...: ${r.duration.toFixed(1)}ms (${formatBytes(r.transferSize)})`, 'warning');
      });
    }
  });

  test('total page weight', async () => {
    logWithColor('\n🧪 Measuring Total Page Weight...', 'info');
    
    await page.goto('/smartgrind/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#app-wrapper', { state: 'visible' });
    
    const resourceTiming = await measureResourceTiming(page);
    const totalBytes = resourceTiming.totalTransferSize;
    const totalRequests = resourceTiming.totalCount;
    
    logWithColor(`  Total Size: ${formatBytes(totalBytes)}`, 
      totalBytes < THRESHOLDS.maxPageWeightMB * 1024 * 1024 ? 'success' : 'warning');
    logWithColor(`  Total Requests: ${totalRequests}`, 
      totalRequests < THRESHOLDS.maxResourceCount ? 'success' : 'warning');
    
    Object.entries(resourceTiming.sizes).forEach(([type, size]) => {
      logWithColor(`  ${type}: ${formatBytes(size)}`, 'info');
    });
    
    expect.soft(totalBytes).toBeLessThan(THRESHOLDS.maxPageWeightMB * 1024 * 1024);
    expect.soft(totalRequests).toBeLessThan(THRESHOLDS.maxResourceCount);
  });
});
