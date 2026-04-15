/**
 * Performance Benchmark Types
 * 
 * Type definitions for performance benchmark tests.
 */

import type { PageLoadMetrics, MemoryMetrics } from '../utils/performance';

/** Complete benchmark results structure */
export interface BenchmarkResults {
  meta: {
    timestamp: string;
    url: string;
    userAgent: string;
    viewport: { width: number; height: number };
    iterations: number;
  };
  pageLoad: {
    coldStart: BenchmarkRun[];
    warmStart: BenchmarkRun[];
    averages: PageLoadAverages;
  };
  interactions: InteractionBenchmarks;
  memory: MemoryBenchmarks;
  network: NetworkBenchmarks;
  coreWebVitals: CoreWebVitalsResult;
  summary: BenchmarkSummary;
}

/** Single benchmark run data */
export interface BenchmarkRun {
  iteration: number;
  metrics: PageLoadMetrics;
  navigationTiming?: NavigationTimingData;
}

/** Navigation timing data from Performance API */
export interface NavigationTimingData {
  responseStart: number;
  startTime: number;
  loadEventEnd: number;
  domContentLoadedEventEnd: number;
  // Add other fields as needed
  [key: string]: number;
}

/** Averaged page load metrics */
export interface PageLoadAverages {
  ttfb: MetricStats;
  fcp: MetricStats;
  lcp: MetricStats;
  load: MetricStats;
  totalDuration: MetricStats;
}

/** Statistics for a single metric */
export interface MetricStats {
  avg: number;
  min: number;
  max: number;
  p95: number;
}

/** Interaction benchmark results */
export interface InteractionBenchmarks {
  search: InteractionResult;
  filter: InteractionResult;
  modal: InteractionResult;
  theme: InteractionResult;
  navigation: InteractionResult;
}

/** Single interaction benchmark result */
export interface InteractionResult {
  name: string;
  iterations: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p95Duration: number;
  allRuns: number[];
  passed: boolean;
  threshold: number;
}

/** Memory benchmark results */
export interface MemoryBenchmarks {
  initialHeap: MemoryMetrics;
  afterInteractions: MemoryMetrics;
  growthRate: number;
  growthRateBytes: number;
  timeline: MemoryMetrics[];
  leakDetected: boolean;
}

/** Network benchmark results */
export interface NetworkBenchmarks {
  totalRequests: number;
  totalBytes: number;
  apiResponseTimes: ApiTimingResult[];
  resourceTiming: ResourceTimingData;
  slowestResources: SlowResourceInfo[];
}

/** Resource timing summary data */
export interface ResourceTimingData {
  totalCount: number;
  totalTransferSize: number;
  cachedCount: number;
  sizes: Record<string, number>;
  avgDurations: Record<string, number>;
  slowestResources: Array<{
    name: string;
    duration: number;
    transferSize: number;
  }>;
}

/** API timing result */
export interface ApiTimingResult {
  endpoint: string;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  iterations: number;
}

/** Slow resource information */
export interface SlowResourceInfo {
  url: string;
  duration: number;
  size: number;
}

/** Core Web Vitals results */
export interface CoreWebVitalsResult {
  lcp: WebVitalMetric;
  fcp: WebVitalMetric;
  ttfb: WebVitalMetric;
  cls: WebVitalMetric;
  allPass: boolean;
}

/** Individual Web Vital metric */
export interface WebVitalMetric {
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  threshold: number;
}

/** Final benchmark summary */
export interface BenchmarkSummary {
  totalPassed: number;
  totalFailed: number;
  overallScore: number;
  criticalIssues: string[];
  recommendations: string[];
}
