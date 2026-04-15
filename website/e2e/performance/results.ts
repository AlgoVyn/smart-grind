/**
 * Performance Benchmark Results Utilities
 * 
 * Functions for saving, loading, and printing benchmark results.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { BenchmarkResults } from './types';
import { RESULTS_DIR } from './config';

/**
 * Ensure results directory exists
 */
export function ensureResultsDir(): void {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
}

/**
 * Calculate statistics from an array of numbers
 */
export function calculateStats(values: number[]): { avg: number; min: number; max: number; p95: number } {
  if (values.length === 0) {
    return { avg: 0, min: 0, max: 0, p95: 0 };
  }
  
  const sorted = [...values].sort((a, b) => a - b);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const p95Index = Math.ceil(sorted.length * 0.95) - 1;
  const p95 = sorted[Math.max(0, p95Index)];
  return { avg, min, max, p95 };
}

/**
 * Calculate percentile from sorted array
 */
export function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const index = Math.ceil(sortedValues.length * (p / 100)) - 1;
  return sortedValues[Math.max(0, index)];
}

/**
 * Format console output with colors
 */
export function logWithColor(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}${message}${reset}`);
}

/**
 * Format table row for console output
 */
export function formatTableRow(label: string, value: string, unit: string = '', threshold?: number, actual?: number): string {
  const thresholdInfo = threshold !== undefined && actual !== undefined
    ? ` (threshold: ${threshold}${unit}) ${actual <= threshold ? '✓' : '✗'}`
    : '';
  return `${label.padEnd(25)} ${value.padStart(10)}${unit.padEnd(4)}${thresholdInfo}`;
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format duration to human readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Save benchmark results to JSON file
 */
export function saveResults(results: BenchmarkResults): string {
  ensureResultsDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `performance-benchmark-${timestamp}.json`;
  const filepath = path.join(RESULTS_DIR, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
  return filepath;
}

/**
 * Load previous benchmark results for comparison
 */
export function loadPreviousResults(): BenchmarkResults | null {
  if (!fs.existsSync(RESULTS_DIR)) return null;
  
  const files = fs.readdirSync(RESULTS_DIR)
    .filter(f => f.startsWith('performance-benchmark-') && f.endsWith('.json'))
    .sort()
    .reverse();
  
  if (files.length === 0) return null;
  
  try {
    const content = fs.readFileSync(path.join(RESULTS_DIR, files[0]), 'utf-8');
    return JSON.parse(content) as BenchmarkResults;
  } catch {
    return null;
  }
}

/**
 * Compare current results with baseline
 */
export function compareWithBaseline(
  current: BenchmarkResults,
  baseline: BenchmarkResults | null
): { comparisons: string[]; regressions: string[]; improvements: string[] } {
  const comparisons: string[] = [];
  const regressions: string[] = [];
  const improvements: string[] = [];
  
  if (!baseline) {
    return { comparisons: ['No baseline found for comparison'], regressions, improvements };
  }
  
  const metrics = [
    { name: 'Cold Start', current: current.pageLoad.averages.load.avg, baseline: baseline.pageLoad.averages.load.avg, threshold: 10 },
    { name: 'TTFB', current: current.pageLoad.averages.ttfb.avg, baseline: baseline.pageLoad.averages.ttfb.avg, threshold: 10 },
    { name: 'FCP', current: current.pageLoad.averages.fcp.avg, baseline: baseline.pageLoad.averages.fcp.avg, threshold: 10 },
    { name: 'LCP', current: current.pageLoad.averages.lcp.avg, baseline: baseline.pageLoad.averages.lcp.avg, threshold: 10 },
  ];
  
  metrics.forEach(m => {
    if (m.baseline === 0) return;
    const diff = ((m.current - m.baseline) / m.baseline) * 100;
    const direction = diff > 0 ? 'slower' : 'faster';
    const status = Math.abs(diff) > m.threshold ? (diff > 0 ? 'REGRESSION' : 'IMPROVEMENT') : 'stable';
    
    comparisons.push(`${m.name}: ${Math.abs(diff).toFixed(1)}% ${direction} (${m.current.toFixed(0)}ms vs ${m.baseline.toFixed(0)}ms) ${status}`);
    
    if (diff > m.threshold) regressions.push(`${m.name} regressed by ${diff.toFixed(1)}%`);
    if (diff < -m.threshold) improvements.push(`${m.name} improved by ${Math.abs(diff).toFixed(1)}%`);
  });
  
  return { comparisons, regressions, improvements };
}

/**
 * Print benchmark results to console
 */
export function printResults(results: BenchmarkResults, baseline: BenchmarkResults | null): void {
  console.log('\n' + '='.repeat(80));
  console.log('PERFORMANCE BENCHMARK RESULTS');
  console.log('='.repeat(80));
  console.log(`Timestamp: ${results.meta.timestamp}`);
  console.log(`URL: ${results.meta.url}`);
  console.log(`Iterations: ${results.meta.iterations}`);
  console.log(`Viewport: ${results.meta.viewport.width}x${results.meta.viewport.height}`);
  console.log();
  
  // Page Load Section
  console.log('-'.repeat(80));
  console.log('PAGE LOAD BENCHMARKS');
  console.log('-'.repeat(80));
  
  console.log('\n📊 Cold Start Metrics:');
  console.log(formatTableRow('  TTFB', results.pageLoad.averages.ttfb.avg.toFixed(1), 'ms'));
  console.log(formatTableRow('  FCP', results.pageLoad.averages.fcp.avg.toFixed(1), 'ms'));
  console.log(formatTableRow('  LCP', results.pageLoad.averages.lcp.avg.toFixed(1), 'ms'));
  console.log(formatTableRow('  Load Complete', results.pageLoad.averages.load.avg.toFixed(1), 'ms'));
  
  // Interaction Section
  console.log('\n' + '-'.repeat(80));
  console.log('INTERACTION BENCHMARKS');
  console.log('-'.repeat(80));
  
  Object.entries(results.interactions).forEach(([name, data]) => {
    if (data.iterations === 0) return;
    const status = data.passed ? '✓' : '✗';
    console.log(`\n${status} ${name.toUpperCase()}`);
    console.log(formatTableRow('  Average', data.avgDuration.toFixed(1), 'ms', data.threshold, data.avgDuration));
    console.log(formatTableRow('  Min', data.minDuration.toFixed(1), 'ms'));
    console.log(formatTableRow('  Max', data.maxDuration.toFixed(1), 'ms'));
    console.log(formatTableRow('  P95', data.p95Duration.toFixed(1), 'ms'));
  });
  
  // Memory Section
  console.log('\n' + '-'.repeat(80));
  console.log('MEMORY BENCHMARKS');
  console.log('-'.repeat(80));
  console.log(formatTableRow('Initial Heap', formatBytes(results.memory.initialHeap.usedJSHeapSize), ''));
  console.log(formatTableRow('After Interactions', formatBytes(results.memory.afterInteractions.usedJSHeapSize), ''));
  console.log(formatTableRow('Growth', formatBytes(results.memory.growthRateBytes), ''));
  console.log(formatTableRow('Growth Rate', results.memory.growthRate.toFixed(1), '%'));
  console.log(formatTableRow('Leak Detected', results.memory.leakDetected ? 'YES' : 'NO', ''));
  
  // Network Section
  console.log('\n' + '-'.repeat(80));
  console.log('NETWORK BENCHMARKS');
  console.log('-'.repeat(80));
  console.log(formatTableRow('Total Requests', results.network.totalRequests.toString(), ''));
  console.log(formatTableRow('Total Size', formatBytes(results.network.totalBytes), ''));
  
  if (results.network.apiResponseTimes.length > 0) {
    console.log('\nAPI Response Times:');
    results.network.apiResponseTimes.forEach(api => {
      console.log(formatTableRow(`  ${api.endpoint}`, `${api.avgDuration.toFixed(1)}ms`, ''));
    });
  }
  
  // Core Web Vitals
  console.log('\n' + '-'.repeat(80));
  console.log('CORE WEB VITALS');
  console.log('-'.repeat(80));
  const vitals = results.coreWebVitals;
  console.log(formatTableRow('LCP', vitals.lcp.value.toFixed(1), 'ms') + ` [${vitals.lcp.rating}]`);
  console.log(formatTableRow('FCP', vitals.fcp.value.toFixed(1), 'ms') + ` [${vitals.fcp.rating}]`);
  console.log(formatTableRow('TTFB', vitals.ttfb.value.toFixed(1), 'ms') + ` [${vitals.ttfb.rating}]`);
  console.log(formatTableRow('CLS', vitals.cls.value.toFixed(4), '') + ` [${vitals.cls.rating}]`);
  
  // Baseline Comparison
  if (baseline) {
    console.log('\n' + '-'.repeat(80));
    console.log('BASELINE COMPARISON');
    console.log('-'.repeat(80));
    const { comparisons } = compareWithBaseline(results, baseline);
    comparisons.forEach(c => console.log(c));
  }
  
  // Summary
  console.log('\n' + '-'.repeat(80));
  console.log('SUMMARY');
  console.log('-'.repeat(80));
  console.log(`Overall Score: ${results.summary.overallScore}/100`);
  console.log(`Passed: ${results.summary.totalPassed}, Failed: ${results.summary.totalFailed}`);
  
  if (results.summary.criticalIssues.length > 0) {
    console.log('\n⚠️ Critical Issues:');
    results.summary.criticalIssues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  if (results.summary.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    results.summary.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
  
  console.log('\n' + '='.repeat(80));
}
