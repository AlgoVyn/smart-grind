/**
 * Performance Testing Utilities
 * 
 * Comprehensive utilities for measuring web performance metrics using Playwright.
 * Includes Core Web Vitals, memory monitoring, network analysis, and benchmarking.
 */

import { Page, expect, Request, Response } from '@playwright/test';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Page load timing metrics */
export interface PageLoadMetrics {
  /** Time to First Byte in milliseconds */
  ttfb: number;
  /** First Contentful Paint in milliseconds */
  fcp: number;
  /** Largest Contentful Paint in milliseconds */
  lcp: number;
  /** Cumulative Layout Shift score */
  cls: number;
  /** Time to Interactive in milliseconds */
  tti: number;
  /** First Paint in milliseconds */
  fp: number;
  /** DOM Content Loaded in milliseconds */
  dcl: number;
  /** Load complete time in milliseconds */
  load: number;
  /** Total page load duration */
  totalDuration: number;
  /** Timestamp when metrics were collected */
  timestamp: number;
  /** URL of the page measured */
  url: string;
}

/** Navigation timing details from PerformanceNavigationTiming */
export interface NavigationTiming {
  /** Navigation start timestamp */
  navigationStart: number;
  /** Unload event start */
  unloadEventStart: number;
  /** Unload event end */
  unloadEventEnd: number;
  /** Redirect start */
  redirectStart: number;
  /** Redirect end */
  redirectEnd: number;
  /** Fetch start */
  fetchStart: number;
  /** Domain lookup start */
  domainLookupStart: number;
  /** Domain lookup end */
  domainLookupEnd: number;
  /** Connection start */
  connectStart: number;
  /** Connection end */
  connectEnd: number;
  /** Secure connection start (for HTTPS) */
  secureConnectionStart: number;
  /** Request start */
  requestStart: number;
  /** Response start */
  responseStart: number;
  /** Response end */
  responseEnd: number;
  /** DOM loading */
  domLoading: number;
  /** DOM interactive */
  domInteractive: number;
  /** DOM content loaded event start */
  domContentLoadedEventStart: number;
  /** DOM content loaded event end */
  domContentLoadedEventEnd: number;
  /** DOM complete */
  domComplete: number;
  /** Load event start */
  loadEventStart: number;
  /** Load event end */
  loadEventEnd: number;
  /** Calculated durations */
  durations: {
    dnsLookup: number;
    tcpConnection: number;
    sslHandshake: number;
    ttfb: number;
    download: number;
    domProcessing: number;
    resourceLoading: number;
    totalNavigation: number;
  };
}

/** Individual resource timing entry */
export interface ResourceTimingEntry {
  /** Resource name (URL) */
  name: string;
  /** Resource type (script, stylesheet, image, etc.) */
  type: string;
  /** Initiator type */
  initiatorType: string;
  /** Start time */
  startTime: number;
  /** Response end time */
  responseEnd: number;
  /** Duration */
  duration: number;
  /** Transfer size in bytes */
  transferSize: number;
  /** Encoded body size */
  encodedBodySize: number;
  /** Decoded body size */
  decodedBodySize: number;
  /** Whether resource was cached */
  fromCache: boolean;
  /** DNS lookup time */
  dnsTime: number;
  /** TCP connection time */
  tcpTime: number;
  /** SSL handshake time */
  sslTime: number;
  /** Time to first byte */
  ttfb: number;
  /** Download time */
  downloadTime: number;
}

/** Resource timing summary */
export interface ResourceTimingSummary {
  /** All resource entries */
  entries: ResourceTimingEntry[];
  /** Count by resource type */
  counts: Record<string, number>;
  /** Total size by type */
  sizes: Record<string, number>;
  /** Average duration by type */
  avgDurations: Record<string, number>;
  /** Slowest resources */
  slowestResources: ResourceTimingEntry[];
  /** Largest resources */
  largestResources: ResourceTimingEntry[];
  /** Total resource count */
  totalCount: number;
  /** Total transfer size */
  totalTransferSize: number;
  /** Resources from cache */
  cachedCount: number;
}

/** First paint metrics */
export interface FirstPaintMetrics {
  /** First Paint timestamp */
  firstPaint: number | null;
  /** First Contentful Paint timestamp */
  firstContentfulPaint: number | null;
  /** Paint timing entries */
  paintEntries: {
    name: string;
    startTime: number;
  }[];
}

/** Memory usage metrics */
export interface MemoryMetrics {
  /** JavaScript heap size used in bytes */
  usedJSHeapSize: number;
  /** Total JavaScript heap size in bytes */
  totalJSHeapSize: number;
  /** JavaScript heap size limit in bytes */
  jsHeapSizeLimit: number;
  /** Used heap percentage */
  usedHeapPercentage: number;
  /** Timestamp */
  timestamp: number;
}

/** Memory leak detection result */
export interface MemoryLeakResult {
  /** Whether a memory leak was detected */
  hasLeak: boolean;
  /** Initial memory measurement */
  before: MemoryMetrics;
  /** Final memory measurement */
  after: MemoryMetrics;
  /** Memory difference in bytes */
  difference: number;
  /** Percentage increase */
  percentageIncrease: number;
  /** Threshold used for detection */
  threshold: number;
  /** Operations performed */
  operationCount: number;
  /** Timeline of measurements */
  timeline: MemoryMetrics[];
}

/** Network request analysis */
export interface NetworkRequestAnalysis {
  /** Total number of requests */
  totalRequests: number;
  /** Requests by type */
  byType: Record<string, number>;
  /** Requests by domain */
  byDomain: Record<string, number>;
  /** Total bytes transferred */
  totalBytes: number;
  /** Bytes by type */
  bytesByType: Record<string, number>;
  /** Failed requests */
  failedRequests: number;
  /** Average response time */
  avgResponseTime: number;
  /** Slowest requests */
  slowestRequests: NetworkRequestDetails[];
  /** Request timeline */
  timeline: NetworkRequestDetails[];
}

/** Individual network request details */
export interface NetworkRequestDetails {
  /** Request URL */
  url: string;
  /** Request method */
  method: string;
  /** Resource type */
  resourceType: string;
  /** Response status */
  status: number;
  /** Response size */
  size: number;
  /** Start time */
  startTime: number;
  /** End time */
  endTime: number;
  /** Duration */
  duration: number;
  /** Whether from cache (detected from response headers) */
  fromCache: boolean;
  /** Request headers */
  requestHeaders?: Record<string, string>;
  /** Response headers */
  responseHeaders?: Record<string, string>;
}

/** API response timing */
export interface APIResponseTiming {
  /** API endpoint URL */
  url: string;
  /** HTTP method */
  method: string;
  /** Start timestamp */
  startTime: number;
  /** End timestamp */
  endTime: number;
  /** Total duration in milliseconds */
  duration: number;
  /** Response status */
  status: number;
  /** Response size in bytes */
  responseSize: number;
  /** Whether cached (detected from headers) */
  fromCache: boolean;
}

/** Frame rate measurement */
export interface FrameRateMetrics {
  /** Frames per second samples */
  fpsSamples: number[];
  /** Average FPS */
  averageFPS: number;
  /** Minimum FPS */
  minFPS: number;
  /** Maximum FPS */
  maxFPS: number;
  /** Dropped frames count */
  droppedFrames: number;
  /** Total frames rendered */
  totalFrames: number;
  /** Duration of measurement */
  duration: number;
  /** FPS below 30 count (jank) */
  jankCount: number;
  /** FPS below 60 count */
  below60Count: number;
}

/** Long task information */
export interface LongTaskInfo {
  /** Task duration in milliseconds */
  duration: number;
  /** Start time */
  startTime: number;
  /** Attribution information */
  attribution: {
    type: string;
    name: string;
    container: string;
  }[];
}

/** Layout shift information */
export interface LayoutShiftInfo {
  /** Layout shift value */
  value: number;
  /** Time of shift */
  time: number;
  /** Whether had recent input */
  hadRecentInput: boolean;
  /** Sources of layout shift */
  sources: {
    node: string;
    previousRect: DOMRectReadOnly;
    currentRect: DOMRectReadOnly;
  }[];
}

/** Cumulative Layout Shift metrics */
export interface CLSMetrics {
  /** CLS score */
  score: number;
  /** Individual layout shifts */
  shifts: LayoutShiftInfo[];
  /** Session windows */
  sessionWindows: {
    start: number;
    end: number;
    score: number;
  }[];
}

/** Paint timing metrics */
export interface PaintMetrics {
  /** First Paint */
  firstPaint: number | null;
  /** First Contentful Paint */
  firstContentfulPaint: number | null;
  /** Largest Contentful Paint */
  largestContentfulPaint: number | null;
  /** Element rendering LCP */
  lcpElement: string | null;
  /** Paint entries timeline */
  paintEntries: {
    name: string;
    startTime: number;
    entryType: string;
  }[];
}

/** Resource type counts */
export interface ResourceCounts {
  /** Total resources */
  total: number;
  /** Document/HTML count */
  document: number;
  /** Stylesheet count */
  stylesheet: number;
  /** Image count */
  image: number;
  /** Script count */
  script: number;
  /** Font count */
  font: number;
  /** XHR/Fetch count */
  xhr: number;
  /** Media count */
  media: number;
  /** Other resources */
  other: number;
}

/** Resource size information */
export interface ResourceSizeInfo {
  /** Resource URL */
  url: string;
  /** Resource type */
  type: string;
  /** Transfer size in bytes */
  transferSize: number;
  /** Encoded size */
  encodedSize: number;
  /** Decoded size */
  decodedSize: number;
  /** Compression ratio */
  compressionRatio: number;
  /** Size category */
  category: 'small' | 'medium' | 'large' | 'xlarge';
}

/** Core Web Vitals assessment */
export interface CoreWebVitals {
  /** Largest Contentful Paint */
  lcp: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    element?: string;
  };
  /** First Input Delay (using TBT as proxy) */
  fid: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  /** Cumulative Layout Shift */
  cls: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  /** First Contentful Paint */
  fcp: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  /** Time to First Byte */
  ttfb: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  /** Interaction to Next Paint (if available) */
  inp?: {
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  };
  /** Overall pass/fail */
  allPass: boolean;
}

/** Performance benchmark result */
export interface BenchmarkResult {
  /** Number of iterations */
  iterations: number;
  /** Average metrics */
  averages: Partial<PageLoadMetrics>;
  /** Median metrics */
  medians: Partial<PageLoadMetrics>;
  /** Minimum metrics */
  min: Partial<PageLoadMetrics>;
  /** Maximum metrics */
  max: Partial<PageLoadMetrics>;
  /** Standard deviations */
  standardDeviations: Partial<Record<keyof PageLoadMetrics, number>>;
  /** All iterations data */
  allRuns: PageLoadMetrics[];
  /** Coefficient of variation */
  stability: number;
}

/** Performance comparison result */
export interface PerformanceComparison {
  /** Scenario names */
  scenarios: string[];
  /** Metrics for each scenario */
  results: Record<string, Partial<PageLoadMetrics>>;
  /** Best performing scenario per metric */
  winners: Partial<Record<keyof PageLoadMetrics, string>>;
  /** Percentage differences */
  differences: Record<string, Partial<Record<keyof PageLoadMetrics, number>>>;
  /** Statistical significance */
  significant: Record<string, Partial<Record<keyof PageLoadMetrics, boolean>>>;
}

/** Optimization suggestion */
export interface OptimizationSuggestion {
  /** Type of optimization */
  type: 'critical' | 'important' | 'suggestion';
  /** Category */
  category: string;
  /** Description */
  description: string;
  /** Affected resources */
  resources?: string[];
  /** Potential savings */
  potentialSavings?: string;
  /** Implementation guidance */
  guidance?: string;
}

/** Complete performance report */
export interface PerformanceReport {
  /** Timestamp */
  timestamp: number;
  /** URL */
  url: string;
  /** Page load metrics */
  pageLoad: PageLoadMetrics;
  /** Core Web Vitals */
  coreWebVitals: CoreWebVitals;
  /** Resource summary */
  resources: ResourceTimingSummary;
  /** Network analysis */
  network: NetworkRequestAnalysis;
  /** Memory usage */
  memory: MemoryMetrics;
  /** Paint metrics */
  paint: PaintMetrics;
  /** Recommendations */
  recommendations: OptimizationSuggestion[];
  /** Overall score (0-100) */
  overallScore: number;
}

/** Performance thresholds for assertions */
export interface PerformanceThresholds {
  /** Page load time limit */
  pageLoadMs: number;
  /** API response time limit */
  apiResponseMs: number;
  /** Resource count limit */
  resourceCount: number;
  /** Total page size limit */
  pageSizeBytes: number;
  /** Memory leak threshold percentage */
  memoryLeakPercent: number;
  /** FPS minimum */
  minFPS: number;
  /** CLS maximum */
  maxCLS: number;
  /** LCP maximum */
  maxLCP: number;
  /** FCP maximum */
  maxFCP: number;
  /** TTFB maximum */
  maxTTFB: number;
}

/** Default performance thresholds */
export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  pageLoadMs: 3000,
  apiResponseMs: 500,
  resourceCount: 100,
  pageSizeBytes: 2 * 1024 * 1024, // 2MB
  memoryLeakPercent: 10,
  minFPS: 30,
  maxCLS: 0.1,
  maxLCP: 2500,
  maxFCP: 1800,
  maxTTFB: 800,
};

// ============================================================================
// PERFORMANCE MEASUREMENT
// ============================================================================

/**
 * Measure full page load metrics including Core Web Vitals
 * @param page - Playwright Page object
 * @returns Complete page load metrics
 */
export async function measurePageLoad(page: Page): Promise<PageLoadMetrics> {
  const url = page.url();
  
  // Collect all performance entries and metrics
  const metrics = await page.evaluate(() => {
    const perf = performance;
    const navEntry = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = perf.getEntriesByType('paint');
    const lcpEntries = perf.getEntriesByType('largest-contentful-paint');
    const clsEntries = perf.getEntriesByType('layout-shift') as any[];
    
    // Calculate TTFB
    const ttfb = navEntry ? navEntry.responseStart - navEntry.startTime : 0;
    
    // Get FCP
    const fcpEntry = paintEntries.find(p => p.name === 'first-contentful-paint');
    const fcp = fcpEntry ? fcpEntry.startTime : 0;
    
    // Get FP
    const fpEntry = paintEntries.find(p => p.name === 'first-paint');
    const fp = fpEntry ? fpEntry.startTime : 0;
    
    // Get LCP
    let lcp = 0;
    let lcpElement = '';
    if (lcpEntries.length > 0) {
      const lastLCP = lcpEntries[lcpEntries.length - 1] as any;
      lcp = lastLCP.startTime;
      lcpElement = lastLCP.element?.tagName || '';
    }
    
    // Calculate CLS
    let cls = 0;
    clsEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });
    
    // Calculate TTI (Time to Interactive)
    // Using domInteractive as a proxy, or FCP + 500ms buffer
    const tti = navEntry ? 
      Math.max((navEntry as any).domInteractive, fcp || 0) : 
      (fcp || 0) + 500;
    
    // DCL and Load
    const dcl = navEntry ? navEntry.domContentLoadedEventEnd - navEntry.startTime : 0;
    const load = navEntry ? navEntry.loadEventEnd - navEntry.startTime : 0;
    
    return {
      ttfb,
      fcp,
      lcp,
      cls,
      tti,
      fp,
      dcl,
      load,
      totalDuration: load || (navEntry as any)?.duration || perf.now(),
      timestamp: Date.now(),
      url: window.location.href,
    };
  });
  
  return { ...metrics, url };
}

/**
 * Get detailed navigation timing from Performance API
 * @param page - Playwright Page object
 * @returns Detailed navigation timing metrics
 */
export async function measureNavigationTiming(page: Page): Promise<NavigationTiming> {
  return page.evaluate(() => {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!navEntry) {
      throw new Error('Navigation timing not available');
    }
    
    const start = navEntry.startTime;
    const entry = navEntry as any;
    
    // Calculate durations
    const durations = {
      dnsLookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
      tcpConnection: navEntry.connectEnd - navEntry.connectStart,
      sslHandshake: navEntry.secureConnectionStart > 0 
        ? navEntry.connectEnd - navEntry.secureConnectionStart 
        : 0,
      ttfb: navEntry.responseStart - start,
      download: navEntry.responseEnd - navEntry.responseStart,
      domProcessing: entry.domComplete - entry.domLoading,
      resourceLoading: navEntry.loadEventEnd - entry.domComplete,
      totalNavigation: navEntry.loadEventEnd - start,
    };
    
    return {
      navigationStart: entry.navigationStart,
      unloadEventStart: navEntry.unloadEventStart,
      unloadEventEnd: navEntry.unloadEventEnd,
      redirectStart: navEntry.redirectStart,
      redirectEnd: navEntry.redirectEnd,
      fetchStart: navEntry.fetchStart,
      domainLookupStart: navEntry.domainLookupStart,
      domainLookupEnd: navEntry.domainLookupEnd,
      connectStart: navEntry.connectStart,
      connectEnd: navEntry.connectEnd,
      secureConnectionStart: navEntry.secureConnectionStart,
      requestStart: navEntry.requestStart,
      responseStart: navEntry.responseStart,
      responseEnd: navEntry.responseEnd,
      domLoading: entry.domLoading,
      domInteractive: entry.domInteractive,
      domContentLoadedEventStart: navEntry.domContentLoadedEventStart,
      domContentLoadedEventEnd: navEntry.domContentLoadedEventEnd,
      domComplete: entry.domComplete,
      loadEventStart: navEntry.loadEventStart,
      loadEventEnd: navEntry.loadEventEnd,
      durations,
    };
  });
}

/**
 * Analyze resource loading performance
 * @param page - Playwright Page object
 * @returns Resource timing summary
 */
export async function measureResourceTiming(page: Page): Promise<ResourceTimingSummary> {
  const entries = await page.evaluate(() => {
    return (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).map(r => {
      const dnsTime = r.domainLookupEnd - r.domainLookupStart;
      const tcpTime = r.connectEnd - r.connectStart;
      const sslTime = r.secureConnectionStart > 0 
        ? r.connectEnd - r.secureConnectionStart 
        : 0;
      const ttfb = r.responseStart - r.startTime;
      const downloadTime = r.responseEnd - r.responseStart;
      const fromCache = r.transferSize === 0 && r.encodedBodySize > 0;
      
      // Determine resource type from initiator or extension
      let type = r.initiatorType;
      if (type === 'link' || type === 'css') type = 'stylesheet';
      if (type === 'img' || type === 'image') type = 'image';
      if (type === 'script' || r.name.endsWith('.js')) type = 'script';
      if (r.name.endsWith('.css')) type = 'stylesheet';
      if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(r.name)) type = 'image';
      if (/\.(woff2?|ttf|otf|eot)$/i.test(r.name)) type = 'font';
      
      return {
        name: r.name,
        type,
        initiatorType: r.initiatorType,
        startTime: r.startTime,
        responseEnd: r.responseEnd,
        duration: r.duration,
        transferSize: r.transferSize,
        encodedBodySize: r.encodedBodySize,
        decodedBodySize: r.decodedBodySize,
        fromCache,
        dnsTime,
        tcpTime,
        sslTime,
        ttfb,
        downloadTime,
      };
    });
  });
  
  // Calculate summary statistics
  const counts: Record<string, number> = {};
  const sizes: Record<string, number> = {};
  const durations: Record<string, number[]> = {};
  let totalTransferSize = 0;
  let cachedCount = 0;
  
  entries.forEach(entry => {
    counts[entry.type] = (counts[entry.type] || 0) + 1;
    sizes[entry.type] = (sizes[entry.type] || 0) + entry.transferSize;
    if (!durations[entry.type]) durations[entry.type] = [];
    durations[entry.type].push(entry.duration);
    totalTransferSize += entry.transferSize;
    if (entry.fromCache) cachedCount++;
  });
  
  // Calculate averages
  const avgDurations: Record<string, number> = {};
  Object.entries(durations).forEach(([type, values]) => {
    avgDurations[type] = values.reduce((a, b) => a + b, 0) / values.length;
  });
  
  // Get slowest and largest resources
  const slowestResources = [...entries]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);
  
  const largestResources = [...entries]
    .filter(e => e.transferSize > 0)
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 10);
  
  return {
    entries,
    counts,
    sizes,
    avgDurations,
    slowestResources,
    largestResources,
    totalCount: entries.length,
    totalTransferSize,
    cachedCount,
  };
}

/**
 * Measure first paint metrics
 * @param page - Playwright Page object
 * @returns First paint timing information
 */
export async function measureFirstPaint(page: Page): Promise<FirstPaintMetrics> {
  return page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    
    const paintData = paintEntries.map(p => ({
      name: p.name,
      startTime: p.startTime,
    }));
    
    const firstPaint = paintData.find(p => p.name === 'first-paint')?.startTime || null;
    const firstContentfulPaint = paintData.find(p => p.name === 'first-contentful-paint')?.startTime || null;
    
    return {
      firstPaint,
      firstContentfulPaint,
      paintEntries: paintData,
    };
  });
}

// ============================================================================
// MEMORY MONITORING
// ============================================================================

/**
 * Measure JavaScript memory usage
 * @param page - Playwright Page object
 * @returns Memory usage metrics
 */
export async function measureMemoryUsage(page: Page): Promise<MemoryMetrics> {
  const memory = await page.evaluate(() => {
    // @ts-ignore - memory property exists in Chrome
    const mem = (performance as any).memory;
    
    if (!mem) {
      return null;
    }
    
    return {
      usedJSHeapSize: mem.usedJSHeapSize,
      totalJSHeapSize: mem.totalJSHeapSize,
      jsHeapSizeLimit: mem.jsHeapSizeLimit,
    };
  });
  
  if (!memory) {
    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      usedHeapPercentage: 0,
      timestamp: Date.now(),
    };
  }
  
  return {
    ...memory,
    usedHeapPercentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    timestamp: Date.now(),
  };
}

/**
 * Detect memory leaks by running operations and comparing before/after
 * @param page - Playwright Page object
 * @param operations - Async function to perform operations
 * @param options - Detection options
 * @returns Memory leak detection result
 */
export async function detectMemoryLeaks(
  page: Page,
  operations: (page: Page) => Promise<void>,
  options: {
    threshold?: number;
    iterations?: number;
    gcBetweenRuns?: boolean;
    /** 
     * Minimum ratio of measurements that must show increasing memory
     * to trigger a leak detection (0.0 - 1.0). Default 0.7 (70%).
     * Higher values reduce false positives but may miss subtle leaks.
     */
    trendRatio?: number;
  } = {}
): Promise<MemoryLeakResult> {
  const { threshold = 10, iterations = 5, gcBetweenRuns = true, trendRatio = 0.7 } = options;
  
  // Initial measurement after GC
  if (gcBetweenRuns) {
    await page.evaluate(() => {
      // @ts-ignore - gc exists in Chrome with flag
      if (window.gc) window.gc();
    });
  }
  
  await page.waitForTimeout(100);
  const before = await measureMemoryUsage(page);
  
  const timeline: MemoryMetrics[] = [before];
  
  // Run operations multiple times
  for (let i = 0; i < iterations; i++) {
    await operations(page);
    
    if (gcBetweenRuns) {
      await page.evaluate(() => {
        // @ts-ignore
        if (window.gc) window.gc();
      });
      await page.waitForTimeout(100);
    }
    
    const measurement = await measureMemoryUsage(page);
    timeline.push(measurement);
  }
  
  const after = timeline[timeline.length - 1];
  
  // Calculate difference
  const difference = after.usedJSHeapSize - before.usedJSHeapSize;
  const percentageIncrease = (difference / before.usedJSHeapSize) * 100;
  
  // Detect leak based on trend
  let hasLeak = false;
  if (iterations > 1) {
    // Check if memory is consistently increasing
    let increasingCount = 0;
    for (let i = 1; i < timeline.length; i++) {
      if (timeline[i].usedJSHeapSize > timeline[i - 1].usedJSHeapSize) {
        increasingCount++;
      }
    }
    hasLeak = increasingCount >= timeline.length * trendRatio && percentageIncrease > threshold;
  } else {
    hasLeak = percentageIncrease > threshold;
  }
  
  return {
    hasLeak,
    before,
    after,
    difference,
    percentageIncrease,
    threshold,
    operationCount: iterations,
    timeline,
  };
}

/**
 * Track memory usage over time
 * @param page - Playwright Page object
 * @param duration - Duration to track in milliseconds
 * @param options - Tracking options
 * @returns Timeline of memory measurements
 */
export async function trackMemoryOverTime(
  page: Page,
  duration: number,
  options: {
    interval?: number;
    gcBeforeStart?: boolean;
  } = {}
): Promise<MemoryMetrics[]> {
  const { interval = 1000, gcBeforeStart = true } = options;
  
  if (gcBeforeStart) {
    await page.evaluate(() => {
      // @ts-ignore
      if (window.gc) window.gc();
    });
    await page.waitForTimeout(100);
  }
  
  const timeline: MemoryMetrics[] = [];
  const startTime = Date.now();
  
  while (Date.now() - startTime < duration) {
    const measurement = await measureMemoryUsage(page);
    timeline.push(measurement);
    await page.waitForTimeout(interval);
  }
  
  return timeline;
}

// ============================================================================
// NETWORK ANALYSIS
// ============================================================================

/**
 * Analyze all network requests during a page session
 * @param page - Playwright Page object
 * @returns Network request analysis
 */
export async function analyzeNetworkRequests(page: Page): Promise<NetworkRequestAnalysis> {
  // Collect all network requests
  const requests: NetworkRequestDetails[] = [];
  
  page.on('request', (request: Request) => {
    // Store request start time
    (request as any).__startTime = Date.now();
  });
  
  page.on('requestfinished', async (request: Request) => {
    const response = await request.response().catch(() => null);
    if (response) {
      const startTime = (request as any).__startTime || Date.now();
      const endTime = Date.now();
      
      // Check cache from response headers
      const cacheControl = await response.headerValue('cache-control').catch(() => null);
      const age = await response.headerValue('age').catch(() => null);
      const fromCache = !!(cacheControl || age);
      
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        status: response.status(),
        size: await response.body().then(b => b.length).catch(() => 0),
        startTime,
        endTime,
        duration: endTime - startTime,
        fromCache,
      });
    }
  });
  
  page.on('requestfailed', (request: Request) => {
    const startTime = (request as any).__startTime || Date.now();
    requests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      status: 0,
      size: 0,
      startTime,
      endTime: Date.now(),
      duration: Date.now() - startTime,
      fromCache: false,
    });
  });
  
  // Wait for any pending requests to complete
  await page.waitForLoadState('networkidle');
  
  // Calculate summary
  const byType: Record<string, number> = {};
  const byDomain: Record<string, number> = {};
  const bytesByType: Record<string, number> = {};
  let totalBytes = 0;
  let failedRequests = 0;
  
  requests.forEach(req => {
    byType[req.resourceType] = (byType[req.resourceType] || 0) + 1;
    bytesByType[req.resourceType] = (bytesByType[req.resourceType] || 0) + req.size;
    
    try {
      const domain = new URL(req.url).hostname;
      byDomain[domain] = (byDomain[domain] || 0) + 1;
    } catch {
      byDomain['invalid'] = (byDomain['invalid'] || 0) + 1;
    }
    
    totalBytes += req.size;
    if (req.status === 0 || req.status >= 400) {
      failedRequests++;
    }
  });
  
  const avgResponseTime = requests.length > 0 
    ? requests.reduce((sum, r) => sum + r.duration, 0) / requests.length 
    : 0;
  
  const slowestRequests = [...requests]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);
  
  return {
    totalRequests: requests.length,
    byType,
    byDomain,
    totalBytes,
    bytesByType,
    failedRequests,
    avgResponseTime,
    slowestRequests,
    timeline: requests,
  };
}

/**
 * Measure API response time for specific URL patterns
 * @param page - Playwright Page object
 * @param urlPattern - URL pattern to match (string or RegExp)
 * @returns API response timing
 */
export async function measureAPIResponseTime(
  page: Page,
  urlPattern: string | RegExp
): Promise<APIResponseTiming> {
  const startTime = Date.now();
  
  const response = await page.waitForResponse(urlPattern, { timeout: 10000 });
  const endTime = Date.now();
  
  // Check cache from headers
  const cacheControl = await response.headerValue('cache-control').catch(() => null);
  const fromCache = !!cacheControl;
  
  return {
    url: response.url(),
    method: response.request().method(),
    startTime,
    endTime,
    duration: endTime - startTime,
    status: response.status(),
    responseSize: await response.body().then(b => b.length).catch(() => 0),
    fromCache,
  };
}

/**
 * Count resources by type
 * @param page - Playwright Page object
 * @returns Resource counts by type
 */
export async function countResourceTypes(page: Page): Promise<ResourceCounts> {
  const counts = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const result: ResourceCounts = {
      total: resources.length,
      document: 0,
      stylesheet: 0,
      image: 0,
      script: 0,
      font: 0,
      xhr: 0,
      media: 0,
      other: 0,
    };
    
    resources.forEach(r => {
      let type = r.initiatorType;
      
      // Normalize type
      if (type === 'link' || type === 'css' || r.name.endsWith('.css')) type = 'stylesheet';
      if (type === 'img' || type === 'image' || /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(r.name)) type = 'image';
      if (type === 'script' || r.name.endsWith('.js')) type = 'script';
      if (/\.(woff2?|ttf|otf|eot)$/i.test(r.name)) type = 'font';
      if (type === 'xmlhttprequest' || type === 'fetch') type = 'xhr';
      if (type === 'audio' || type === 'video' || type === 'track') type = 'media';
      if (type === 'navigation' || type === 'html') type = 'document';
      
      if (type in result) {
        result[type as keyof ResourceCounts]++;
      } else {
        result.other++;
      }
    });
    
    return result;
  });
  
  return counts;
}

/**
 * Check resource sizes and identify large resources
 * @param page - Playwright Page object
 * @returns Resource size information
 */
export async function checkResourceSizes(page: Page): Promise<ResourceSizeInfo[]> {
  const resources = await page.evaluate(() => {
    return (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).map(r => {
      const compressionRatio = r.encodedBodySize > 0 
        ? (r.encodedBodySize - r.transferSize) / r.encodedBodySize 
        : 0;
      
      let category: ResourceSizeInfo['category'] = 'small';
      if (r.transferSize > 1000000) category = 'xlarge';
      else if (r.transferSize > 500000) category = 'large';
      else if (r.transferSize > 100000) category = 'medium';
      
      return {
        url: r.name,
        type: r.initiatorType,
        transferSize: r.transferSize,
        encodedSize: r.encodedBodySize,
        decodedSize: r.decodedBodySize,
        compressionRatio,
        category,
      };
    });
  });
  
  return resources;
}

// ============================================================================
// RENDER PERFORMANCE
// ============================================================================

/**
 * Measure frame rate during interactions
 * @param page - Playwright Page object
 * @param duration - Duration to measure in milliseconds
 * @returns Frame rate metrics
 */
export async function measureFrameRate(
  page: Page,
  duration: number
): Promise<FrameRateMetrics> {
  const result = await page.evaluate((measureDuration) => {
    return new Promise<FrameRateMetrics>((resolve) => {
      const fpsSamples: number[] = [];
      let lastTime = performance.now();
      let frameCount = 0;
      let droppedFrames = 0;
      let jankCount = 0;
      let below60Count = 0;
      let totalFrames = 0;
      const startTime = performance.now();
      
      const measureFrame = () => {
        const now = performance.now();
        const elapsed = now - lastTime;
        
        if (elapsed >= 1000) {
          const fps = Math.round((frameCount * 1000) / elapsed);
          fpsSamples.push(fps);
          
          if (fps < 30) jankCount++;
          if (fps < 60) below60Count++;
          
          // Estimate dropped frames based on target 60fps
          const expectedFrames = Math.round(elapsed / (1000 / 60));
          if (frameCount < expectedFrames) {
            droppedFrames += expectedFrames - frameCount;
          }
          
          totalFrames += frameCount;
          frameCount = 0;
          lastTime = now;
        }
        
        frameCount++;
        
        if (now - startTime < measureDuration) {
          requestAnimationFrame(measureFrame);
        } else {
          const avgFPS = fpsSamples.length > 0 
            ? fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length 
            : 0;
          
          resolve({
            fpsSamples,
            averageFPS: Math.round(avgFPS * 10) / 10,
            minFPS: Math.min(...fpsSamples, 60),
            maxFPS: Math.max(...fpsSamples, 0),
            droppedFrames,
            totalFrames,
            duration: measureDuration,
            jankCount,
            below60Count,
          });
        }
      };
      
      requestAnimationFrame(measureFrame);
    });
  }, duration);
  
  return result;
}

/**
 * Detect long JavaScript tasks using Long Tasks API
 * @param page - Playwright Page object
 * @returns List of long tasks detected
 */
export async function detectLongTasks(page: Page): Promise<LongTaskInfo[]> {
  const tasks = await page.evaluate(() => {
    return new Promise<LongTaskInfo[]>((resolve) => {
      const longTasks: LongTaskInfo[] = [];
      
      // Check if Long Tasks API is supported
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const taskEntry = entry as any;
            longTasks.push({
              duration: taskEntry.duration,
              startTime: taskEntry.startTime,
              attribution: taskEntry.attribution?.map((a: any) => ({
                type: a.type,
                name: a.name,
                container: a.containerName || a.containerType || 'unknown',
              })) || [],
            });
          }
        });
        
        try {
          observer.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          // Long task observer not supported
        }
        
        // Collect for 5 seconds then resolve
        setTimeout(() => {
          observer.disconnect();
          resolve(longTasks);
        }, 5000);
      } else {
        resolve([]);
      }
    });
  });
  
  return tasks;
}

/**
 * Measure Cumulative Layout Shift
 * @param page - Playwright Page object
 * @returns CLS metrics
 */
export async function measureLayoutShifts(page: Page): Promise<CLSMetrics> {
  const cls = await page.evaluate(() => {
    return new Promise<CLSMetrics>((resolve) => {
      let score = 0;
      const shifts: LayoutShiftInfo[] = [];
      const sessionWindows: { start: number; end: number; score: number }[] = [];
      let currentWindowStart = 0;
      let currentWindowScore = 0;
      
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const lsEntry = entry as any;
            
            if (!lsEntry.hadRecentInput) {
              score += lsEntry.value;
              
              const shift: LayoutShiftInfo = {
                value: lsEntry.value,
                time: lsEntry.startTime,
                hadRecentInput: lsEntry.hadRecentInput,
                sources: lsEntry.sources?.map((s: any) => ({
                  node: s.node?.nodeName || 'unknown',
                  previousRect: s.previousRect,
                  currentRect: s.currentRect,
                })) || [],
              };
              shifts.push(shift);
              
              // Session window logic (1 second gap between shifts)
              if (currentWindowStart === 0) {
                currentWindowStart = lsEntry.startTime;
              }
              
              const gap = lsEntry.startTime - (shifts[shifts.length - 2]?.time || 0);
              if (gap > 1000) {
                // New session window
                if (currentWindowScore > 0) {
                  sessionWindows.push({
                    start: currentWindowStart,
                    end: shifts[shifts.length - 2]?.time || lsEntry.startTime,
                    score: currentWindowScore,
                  });
                }
                currentWindowStart = lsEntry.startTime;
                currentWindowScore = lsEntry.value;
              } else {
                currentWindowScore += lsEntry.value;
              }
            }
          }
        });
        
        try {
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // Layout shift observer not supported
        }
        
        // Collect for 5 seconds
        setTimeout(() => {
          observer.disconnect();
          
          // Add final session window
          if (currentWindowScore > 0 && shifts.length > 0) {
            sessionWindows.push({
              start: currentWindowStart,
              end: shifts[shifts.length - 1].time,
              score: currentWindowScore,
            });
          }
          
          resolve({
            score,
            shifts,
            sessionWindows,
          });
        }, 5000);
      } else {
        resolve({ score: 0, shifts: [], sessionWindows: [] });
      }
    });
  });
  
  return cls;
}

/**
 * Measure paint-related metrics
 * @param page - Playwright Page object
 * @returns Paint metrics
 */
export async function measurePaintMetrics(page: Page): Promise<PaintMetrics> {
  return page.evaluate(() => {
    const paintEntries = performance.getEntriesByType('paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    
    const paintData = paintEntries.map(p => ({
      name: p.name,
      startTime: p.startTime,
      entryType: p.entryType,
    }));
    
    const firstPaint = paintData.find(p => p.name === 'first-paint')?.startTime || null;
    const firstContentfulPaint = paintData.find(p => p.name === 'first-contentful-paint')?.startTime || null;
    
    // Get LCP
    let largestContentfulPaint: number | null = null;
    let lcpElement: string | null = null;
    
    if (lcpEntries.length > 0) {
      const lastLCP = lcpEntries[lcpEntries.length - 1] as any;
      largestContentfulPaint = lastLCP.startTime;
      lcpElement = lastLCP.element?.tagName || null;
    }
    
    return {
      firstPaint,
      firstContentfulPaint,
      largestContentfulPaint,
      lcpElement,
      paintEntries: paintData,
    };
  });
}

// ============================================================================
// ASSERTIONS
// ============================================================================

/**
 * Assert that page loads within a specified time threshold
 * @param page - Playwright Page object
 * @param ms - Maximum allowed load time in milliseconds
 * @param options - Assertion options
 */
export async function expectPageLoadUnder(
  page: Page,
  ms: number,
  options: {
    measureFCP?: boolean;
    measureLCP?: boolean;
  } = {}
): Promise<void> {
  const metrics = await measurePageLoad(page);
  
  const { measureFCP = true, measureLCP = false } = options;
  
  // Check load time
  expect(
    metrics.load,
    `Page load time (${metrics.load}ms) should be under ${ms}ms`
  ).toBeLessThan(ms);
  
  if (measureFCP) {
    expect(
      metrics.fcp,
      `FCP (${metrics.fcp}ms) should be under ${ms}ms`
    ).toBeLessThan(ms);
  }
  
  if (measureLCP) {
    expect(
      metrics.lcp,
      `LCP (${metrics.lcp}ms) should be under ${ms}ms`
    ).toBeLessThan(ms);
  }
}

/**
 * Assert no significant memory leak detected
 * @param before - Memory metrics before operations
 * @param after - Memory metrics after operations
 * @param threshold - Percentage threshold for leak detection (default 10%)
 */
export function expectNoMemoryLeak(
  before: MemoryMetrics,
  after: MemoryMetrics,
  threshold: number = 10
): void {
  const difference = after.usedJSHeapSize - before.usedJSHeapSize;
  const percentageIncrease = (difference / before.usedJSHeapSize) * 100;
  
  expect(
    percentageIncrease,
    `Memory increase (${percentageIncrease.toFixed(2)}%) should be under threshold (${threshold}%)`
  ).toBeLessThan(threshold);
}

/**
 * Assert resource count is under specified limit
 * @param count - Current resource count
 * @param maxCount - Maximum allowed resources
 * @param type - Resource type for error message
 */
export function expectResourceCountUnder(
  count: number,
  maxCount: number,
  type: string = 'resources'
): void {
  expect(
    count,
    `${type} count (${count}) should be under ${maxCount}`
  ).toBeLessThanOrEqual(maxCount);
}

/**
 * Assert API response time is under threshold
 * @param responseTime - Actual response time in milliseconds
 * @param ms - Maximum allowed response time
 */
export function expectAPIResponseUnder(responseTime: number, ms: number): void {
  expect(
    responseTime,
    `API response time (${responseTime}ms) should be under ${ms}ms`
  ).toBeLessThan(ms);
}

/**
 * Assert FPS stays above threshold during measurement
 * @param fpsMetrics - Frame rate metrics
 * @param minFPS - Minimum acceptable FPS
 */
export function expectFPSAbove(fpsMetrics: FrameRateMetrics, minFPS: number = 30): void {
  expect(
    fpsMetrics.averageFPS,
    `Average FPS (${fpsMetrics.averageFPS}) should be above ${minFPS}`
  ).toBeGreaterThanOrEqual(minFPS);
  
  expect(
    fpsMetrics.minFPS,
    `Minimum FPS (${fpsMetrics.minFPS}) should be above ${minFPS * 0.5}`
  ).toBeGreaterThanOrEqual(minFPS * 0.5);
}

/**
 * Assert CLS score is under threshold
 * @param clsMetrics - CLS metrics
 * @param maxScore - Maximum acceptable CLS score
 */
export function expectCLSUnder(clsMetrics: CLSMetrics, maxScore: number = 0.1): void {
  expect(
    clsMetrics.score,
    `CLS score (${clsMetrics.score.toFixed(4)}) should be under ${maxScore}`
  ).toBeLessThan(maxScore);
}

// ============================================================================
// BENCHMARKING
// ============================================================================

/**
 * Benchmark page performance across multiple iterations
 * @param page - Playwright Page object
 * @param iterations - Number of iterations to run
 * @param options - Benchmark options
 * @returns Benchmark results with statistics
 */
export async function benchmarkPage(
  page: Page,
  iterations: number = 5,
  options: {
    url?: string;
    warmupIterations?: number;
    gcBetweenRuns?: boolean;
  } = {}
): Promise<BenchmarkResult> {
  const { url, warmupIterations = 1, gcBetweenRuns = true } = options;
  
  const results: PageLoadMetrics[] = [];
  const targetUrl = url || page.url();
  
  // Warmup runs
  for (let i = 0; i < warmupIterations; i++) {
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
  }
  
  // Actual benchmark runs
  for (let i = 0; i < iterations; i++) {
    if (gcBetweenRuns) {
      await page.evaluate(() => {
        // @ts-ignore
        if (window.gc) window.gc();
      });
    }
    
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    const metrics = await measurePageLoad(page);
    results.push(metrics);
    
    await page.waitForTimeout(500);
  }
  
  // Calculate statistics
  const keys: (keyof PageLoadMetrics)[] = ['ttfb', 'fcp', 'lcp', 'cls', 'tti', 'fp', 'dcl', 'load', 'totalDuration'];
  
  const averages: Partial<PageLoadMetrics> = {};
  const medians: Partial<PageLoadMetrics> = {};
  const min: Partial<PageLoadMetrics> = {};
  const max: Partial<PageLoadMetrics> = {};
  const standardDeviations: Partial<Record<keyof PageLoadMetrics, number>> = {};
  
  keys.forEach(key => {
    const values = results.map(r => r[key] as number).filter(v => v > 0);
    
    if (values.length === 0) return;
    
    // Average
    averages[key] = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Median
    const sorted = [...values].sort((a, b) => a - b);
    medians[key] = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 
      : sorted[Math.floor(sorted.length / 2)];
    
    // Min/Max
    min[key] = Math.min(...values);
    max[key] = Math.max(...values);
    
    // Standard deviation
    const mean = averages[key] as number;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    standardDeviations[key] = Math.sqrt(variance);
  });
  
  // Calculate stability (coefficient of variation for load time)
  const loadTimes = results.map(r => r.load).filter(v => v > 0);
  const avgLoad = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
  const loadStdDev = Math.sqrt(
    loadTimes.reduce((sum, v) => sum + Math.pow(v - avgLoad, 2), 0) / loadTimes.length
  );
  const stability = (loadStdDev / avgLoad) * 100;
  
  return {
    iterations,
    averages,
    medians,
    min,
    max,
    standardDeviations,
    allRuns: results,
    stability,
  };
}

/**
 * Compare performance across different scenarios
 * @param scenarios - Object with scenario name and async function pairs
 * @returns Comparison results
 */
export async function comparePerformance(
  scenarios: Record<string, (page: Page) => Promise<Partial<PageLoadMetrics>>>
): Promise<PerformanceComparison> {
  const scenarioNames = Object.keys(scenarios);
  const results: Record<string, Partial<PageLoadMetrics>> = {};
  
  // Run all scenarios
  for (const [name, fn] of Object.entries(scenarios)) {
    results[name] = await fn({} as Page);
  }
  
  // Determine winners for each metric
  const winners: Partial<Record<keyof PageLoadMetrics, string>> = {};
  const numericKeys: (keyof PageLoadMetrics)[] = ['ttfb', 'fcp', 'lcp', 'cls', 'load'];
  
  numericKeys.forEach(key => {
    let bestScenario = '';
    let bestValue = key === 'cls' ? -1 : Infinity;
    
    for (const [name, metrics] of Object.entries(results)) {
      const value = metrics[key] as number;
      if (value === undefined || value === 0) continue;
      
      if (key === 'cls') {
        // Higher CLS is worse, so find minimum
        if (value < bestValue || bestValue === -1) {
          bestValue = value;
          bestScenario = name;
        }
      } else {
        // Lower is better
        if (value < bestValue) {
          bestValue = value;
          bestScenario = name;
        }
      }
    }
    
    if (bestScenario) {
      winners[key] = bestScenario;
    }
  });
  
  // Calculate differences
  const differences: Record<string, Partial<Record<keyof PageLoadMetrics, number>>> = {};
  const significant: Record<string, Partial<Record<keyof PageLoadMetrics, boolean>>> = {};
  
  const baseline = results[scenarioNames[0]];
  
  for (let i = 1; i < scenarioNames.length; i++) {
    const name = scenarioNames[i];
    const current = results[name];
    const diff: Partial<Record<keyof PageLoadMetrics, number>> = {};
    const sig: Partial<Record<keyof PageLoadMetrics, boolean>> = {};
    
    numericKeys.forEach(key => {
      const baselineValue = baseline[key] as number;
      const currentValue = current[key] as number;
      
      if (baselineValue && currentValue) {
        const pctDiff = ((currentValue - baselineValue) / baselineValue) * 100;
        diff[key] = pctDiff;
        sig[key] = Math.abs(pctDiff) > 10; // 10% difference is significant
      }
    });
    
    differences[name] = diff;
    significant[name] = sig;
  }
  
  return {
    scenarios: scenarioNames,
    results,
    winners,
    differences,
    significant,
  };
}

/**
 * Generate a formatted performance report
 * @param metrics - Performance metrics to include
 * @returns Formatted performance report
 */
export async function generatePerformanceReport(
  metrics: {
    page: Page;
    pageLoad?: boolean;
    resources?: boolean;
    memory?: boolean;
    network?: boolean;
    paint?: boolean;
  }
): Promise<PerformanceReport> {
  const { page } = metrics;
  const url = page.url();
  
  // Gather all metrics
  const pageLoad = await measurePageLoad(page);
  const resourceTiming = await measureResourceTiming(page);
  const memoryUsage = await measureMemoryUsage(page);
  const networkAnalysis = await analyzeNetworkRequests(page);
  const paintMetrics = await measurePaintMetrics(page);
  
  // Calculate Core Web Vitals
  const coreWebVitals = await checkCoreWebVitals(page);
  
  // Generate recommendations
  const recommendations = await suggestOptimizations({
    pageLoad,
    resources: resourceTiming,
    network: networkAnalysis,
  });
  
  // Calculate overall score
  const scores: number[] = [];
  
  // Page load score (0-25)
  if (pageLoad.load < 2000) scores.push(25);
  else if (pageLoad.load < 3000) scores.push(20);
  else if (pageLoad.load < 5000) scores.push(15);
  else scores.push(10);
  
  // FCP score (0-20)
  if (pageLoad.fcp < 1000) scores.push(20);
  else if (pageLoad.fcp < 1800) scores.push(15);
  else if (pageLoad.fcp < 3000) scores.push(10);
  else scores.push(5);
  
  // LCP score (0-25)
  if (pageLoad.lcp < 2500) scores.push(25);
  else if (pageLoad.lcp < 4000) scores.push(15);
  else scores.push(5);
  
  // CLS score (0-15)
  if (pageLoad.cls < 0.1) scores.push(15);
  else if (pageLoad.cls < 0.25) scores.push(10);
  else scores.push(5);
  
  // Resource score (0-15)
  const totalSizeMB = resourceTiming.totalTransferSize / (1024 * 1024);
  if (totalSizeMB < 1) scores.push(15);
  else if (totalSizeMB < 2) scores.push(10);
  else if (totalSizeMB < 5) scores.push(5);
  else scores.push(0);
  
  const overallScore = scores.reduce((a, b) => a + b, 0);
  
  return {
    timestamp: Date.now(),
    url,
    pageLoad,
    coreWebVitals,
    resources: resourceTiming,
    network: networkAnalysis,
    memory: memoryUsage,
    paint: paintMetrics,
    recommendations,
    overallScore,
  };
}

// ============================================================================
// OPTIMIZATION HELPERS
// ============================================================================

/**
 * Identify slow-loading resources
 * @param metrics - Performance metrics
 * @returns List of slow resources with details
 */
export function identifySlowResources(metrics: {
  resources: ResourceTimingSummary;
  threshold?: number;
}): { resource: ResourceTimingEntry; issue: string; suggestion: string }[] {
  const { resources, threshold = 1000 } = metrics;
  const slowResources: { resource: ResourceTimingEntry; issue: string; suggestion: string }[] = [];
  
  resources.entries.forEach(resource => {
    if (resource.duration > threshold) {
      let issue = '';
      let suggestion = '';
      
      if (resource.ttfb > 500) {
        issue = 'Slow server response time (TTFB)';
        suggestion = 'Optimize server-side rendering, use CDN, or implement caching';
      } else if (resource.downloadTime > 500) {
        issue = 'Large file size causing slow download';
        suggestion = 'Enable compression, optimize content, or split into smaller chunks';
      } else if (resource.dnsTime > 100) {
        issue = 'Slow DNS lookup';
        suggestion = 'Consider DNS prefetching or using a faster DNS provider';
      } else if (resource.tcpTime > 100) {
        issue = 'Slow TCP connection';
        suggestion = 'Enable HTTP/2 or HTTP/3 for connection reuse';
      } else {
        issue = 'General slow loading';
        suggestion = 'Review resource loading priority and consider lazy loading';
      }
      
      slowResources.push({ resource, issue, suggestion });
    }
  });
  
  return slowResources.sort((a, b) => b.resource.duration - a.resource.duration);
}

/**
 * Provide optimization suggestions based on metrics
 * @param metrics - Performance metrics
 * @returns List of optimization suggestions
 */
export async function suggestOptimizations(metrics: {
  pageLoad?: PageLoadMetrics;
  resources?: ResourceTimingSummary;
  network?: NetworkRequestAnalysis;
}): Promise<OptimizationSuggestion[]> {
  const suggestions: OptimizationSuggestion[] = [];
  
  // Check LCP
  if (metrics.pageLoad) {
    if (metrics.pageLoad.lcp > 2500) {
      suggestions.push({
        type: 'critical',
        category: 'Largest Contentful Paint',
        description: `LCP is ${metrics.pageLoad.lcp.toFixed(0)}ms, exceeding the 2.5s threshold`,
        guidance: 'Optimize the LCP element: use responsive images, preload critical resources, or implement server-side rendering.',
      });
    }
    
    // Check CLS
    if (metrics.pageLoad.cls > 0.1) {
      suggestions.push({
        type: 'critical',
        category: 'Cumulative Layout Shift',
        description: `CLS score is ${metrics.pageLoad.cls.toFixed(3)}, exceeding the 0.1 threshold`,
        guidance: 'Reserve space for images and ads, avoid inserting content above existing content, and use font-display: optional.',
      });
    }
    
    // Check FCP
    if (metrics.pageLoad.fcp > 1800) {
      suggestions.push({
        type: 'important',
        category: 'First Contentful Paint',
        description: `FCP is ${metrics.pageLoad.fcp.toFixed(0)}ms, exceeding the 1.8s threshold`,
        guidance: 'Eliminate render-blocking resources, inline critical CSS, and defer non-critical JavaScript.',
      });
    }
    
    // Check TTFB
    if (metrics.pageLoad.ttfb > 800) {
      suggestions.push({
        type: 'important',
        category: 'Time to First Byte',
        description: `TTFB is ${metrics.pageLoad.ttfb.toFixed(0)}ms, exceeding the 800ms threshold`,
        guidance: 'Optimize server response time, use a CDN, enable caching, and reduce server-side processing.',
      });
    }
  }
  
  // Check resources
  if (metrics.resources) {
    const totalSizeMB = metrics.resources.totalTransferSize / (1024 * 1024);
    
    if (totalSizeMB > 3) {
      suggestions.push({
        type: 'critical',
        category: 'Page Size',
        description: `Total page size is ${totalSizeMB.toFixed(2)}MB, exceeding 3MB recommendation`,
        guidance: 'Compress images, minify CSS/JS, remove unused code, and implement code splitting.',
      });
    }
    
    // Check for uncompressed resources
    const uncompressedResources = metrics.resources.entries.filter(r => {
      return r.encodedBodySize > 0 && 
             r.transferSize >= r.encodedBodySize * 0.95 &&
             (r.name.endsWith('.js') || r.name.endsWith('.css') || r.name.endsWith('.html'));
    });
    
    if (uncompressedResources.length > 0) {
      suggestions.push({
        type: 'important',
        category: 'Compression',
        description: `${uncompressedResources.length} text resources are not compressed`,
        resources: uncompressedResources.slice(0, 5).map(r => r.name),
        guidance: 'Enable gzip or Brotli compression on your server for text-based resources.',
      });
    }
    
    // Check for render-blocking resources
    const renderBlockingScripts = metrics.resources.entries.filter(r => {
      return r.type === 'script' && 
             !r.name.includes('async') && 
             !r.name.includes('defer') &&
             r.startTime < 1000;
    });
    
    if (renderBlockingScripts.length > 2) {
      suggestions.push({
        type: 'suggestion',
        category: 'Render Blocking',
        description: `${renderBlockingScripts.length} scripts may be blocking rendering`,
        guidance: 'Add async or defer attributes to non-critical scripts, or load them at the end of body.',
      });
    }
  }
  
  // Check network
  if (metrics.network) {
    if (metrics.network.failedRequests > 0) {
      suggestions.push({
        type: 'critical',
        category: 'Failed Requests',
        description: `${metrics.network.failedRequests} network requests failed`,
        guidance: 'Check for 404 errors, fix broken links, and implement proper error handling.',
      });
    }
    
    if (metrics.network.totalRequests > 100) {
      suggestions.push({
        type: 'suggestion',
        category: 'Request Count',
        description: `Page makes ${metrics.network.totalRequests} requests, exceeding 100 recommendation`,
        guidance: 'Combine files where possible, use sprite sheets for images, and implement HTTP/2 server push.',
      });
    }
  }
  
  return suggestions;
}

/**
 * Check Core Web Vitals compliance
 * @param page - Playwright Page object or metrics object
 * @returns Core Web Vitals assessment
 */
export async function checkCoreWebVitals(
  page: Page | { pageLoad: PageLoadMetrics }
): Promise<CoreWebVitals> {
  let pageLoad: PageLoadMetrics;
  
  if ('pageLoad' in page) {
    pageLoad = page.pageLoad;
  } else {
    pageLoad = await measurePageLoad(page as Page);
  }
  
  // Determine ratings
  const getLCPRating = (value: number): CoreWebVitals['lcp']['rating'] => {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  };
  
  const getFCPRating = (value: number): CoreWebVitals['fcp']['rating'] => {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  };
  
  const getCLSRating = (value: number): CoreWebVitals['cls']['rating'] => {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  };
  
  const getTTFBRating = (value: number): CoreWebVitals['ttfb']['rating'] => {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  };
  
  // FID is not directly measurable without user interaction
  // Using TBT proxy (Total Blocking Time)
  const tbt = pageLoad.tti - pageLoad.fcp;
  
  const getFIDRating = (value: number): CoreWebVitals['fid']['rating'] => {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  };
  
  const result: CoreWebVitals = {
    lcp: {
      value: pageLoad.lcp,
      rating: getLCPRating(pageLoad.lcp),
    },
    fid: {
      value: tbt,
      rating: getFIDRating(tbt),
    },
    cls: {
      value: pageLoad.cls,
      rating: getCLSRating(pageLoad.cls),
    },
    fcp: {
      value: pageLoad.fcp,
      rating: getFCPRating(pageLoad.fcp),
    },
    ttfb: {
      value: pageLoad.ttfb,
      rating: getTTFBRating(pageLoad.ttfb),
    },
    allPass: false,
  };
  
  // Check if all Core Web Vitals pass
  result.allPass = 
    result.lcp.rating === 'good' &&
    result.fid.rating === 'good' &&
    result.cls.rating === 'good';
  
  return result;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear performance entries to start fresh measurements
 * @param page - Playwright Page object
 */
export async function clearPerformanceEntries(page: Page): Promise<void> {
  await page.evaluate(() => {
    performance.clearResourceTimings();
    performance.clearMarks();
    performance.clearMeasures();
    
    // Note: clearEntriesByType is not universally supported
    // We use clearResourceTimings instead for resources
  });
}

/**
 * Format bytes to human-readable format
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format milliseconds to human-readable duration
 * @param ms - Milliseconds
 * @returns Formatted string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}m`;
}

/**
 * Wait for a specific metric to reach a threshold
 * @param page - Playwright Page object
 * @param metric - Metric to wait for
 * @param threshold - Threshold value
 * @param timeout - Maximum wait time
 */
export async function waitForMetric(
  page: Page,
  metric: 'fcp' | 'lcp' | 'load',
  threshold: number,
  timeout: number = 30000
): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const metrics = await measurePageLoad(page);
    
    if (metrics[metric] > 0 && metrics[metric] <= threshold) {
      return true;
    }
    
    await page.waitForTimeout(100);
  }
  
  return false;
}

/**
 * Create a performance mark (for custom timing)
 * @param page - Playwright Page object
 * @param markName - Name of the mark
 */
export async function createPerformanceMark(page: Page, markName: string): Promise<void> {
  await page.evaluate((name: string) => {
    performance.mark(name);
  }, markName);
}

/**
 * Measure between two performance marks
 * @param page - Playwright Page object
 * @param startMark - Starting mark name
 * @param endMark - Ending mark name
 * @returns Duration in milliseconds
 */
export async function measureBetweenMarks(
  page: Page,
  startMark: string,
  endMark: string
): Promise<number> {
  return page.evaluate(({ start, end }) => {
    const startEntry = performance.getEntriesByName(start, 'mark')[0];
    const endEntry = performance.getEntriesByName(end, 'mark')[0];
    
    if (!startEntry || !endEntry) {
      throw new Error(`Mark not found: ${!startEntry ? start : end}`);
    }
    
    return endEntry.startTime - startEntry.startTime;
  }, { start: startMark, end: endMark });
}
