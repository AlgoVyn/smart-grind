/**
 * Visual Regression Testing Utilities
 * 
 * Comprehensive utilities for visual regression testing with Playwright.
 * Supports full page and element screenshots, masking, baseline management,
 * and detailed reporting.
 * 
 * @module visual-regression
 */

import { Page, Locator, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Options for screenshot capture
 */
export interface ScreenshotOptions {
  /** Capture full page or visible viewport */
  fullPage?: boolean;
  /** Element to capture instead of page */
  element?: Locator;
  /** CSS selectors to mask */
  mask?: string[];
  /** Specific mask selectors (Playwright style) */
  maskSelectors?: string[];
  /** Coordinate regions to mask [x, y, width, height] */
  maskRegions?: Array<{ x: number; y: number; width: number; height: number }>;
  /** Animation behavior */
  animations?: 'disabled' | 'allow';
  /** Caret visibility */
  caret?: 'hide' | 'initial';
  /** Scale factor for screenshot */
  scale?: 'css' | 'device';
  /** Timeout for screenshot operation */
  timeout?: number;
  /** Additional padding around element */
  padding?: { top?: number; right?: number; bottom?: number; left?: number };
  /** Device name for device-specific screenshot */
  device?: string;
}

/**
 * Options for visual comparison
 */
export interface ComparisonOptions {
  /** Maximum acceptable pixel difference ratio (0-1) */
  threshold?: number;
  /** Pixel matching threshold (0-1) */
  maxDiffPixelRatio?: number;
  /** Maximum different pixels allowed */
  maxDiffPixels?: number;
  /** Blur factor to reduce noise sensitivity */
  blur?: number;
  /** Whether to ignore anti-aliasing differences */
  ignoreAntialiasing?: boolean;
  /** Whether to ignore colors and compare only luminance */
  ignoreColors?: boolean;
  /** Comparison strategy */
  strategy?: 'pixel' | 'ssim' | 'histogram';
  /** Device name for device-specific comparison */
  device?: string;
}

/**
 * Device configuration for testing
 */
export interface DeviceConfig {
  name: string;
  viewport: { width: number; height: number };
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
  userAgent?: string;
}

/**
 * Result of a visual regression test
 */
export interface VisualRegressionResult {
  /** Test name */
  name: string;
  /** Whether the test passed */
  passed: boolean;
  /** Baseline file path */
  baselinePath: string;
  /** Actual screenshot path */
  actualPath?: string;
  /** Diff image path */
  diffPath?: string;
  /** Number of different pixels */
  diffPixels?: number;
  /** Pixel difference ratio (0-1) */
  diffRatio?: number;
  /** Threshold used for comparison */
  threshold: number;
  /** Device configuration used */
  device?: string;
  /** Timestamp of test execution */
  timestamp: string;
  /** Error message if test failed */
  error?: string;
  /** Dimensions of compared images */
  dimensions?: { width: number; height: number };
}

/**
 * Mask region definition
 */
export interface MaskRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Visual test report data
 */
export interface VisualTestReport {
  /** Total number of tests */
  total: number;
  /** Number of passed tests */
  passed: number;
  /** Number of failed tests */
  failed: number;
  /** Test results */
  results: VisualRegressionResult[];
  /** Test execution timestamp */
  timestamp: string;
  /** Test duration in milliseconds */
  duration: number;
  /** Project configuration */
  project?: {
    name: string;
    browser: string;
    viewport: string;
  };
}

// ============================================
// DEFAULTS AND CONSTANTS
// ============================================

/** Default visual comparison options */
export const DEFAULT_VISUAL_OPTIONS: ComparisonOptions = {
  threshold: 0.2,
  maxDiffPixelRatio: 0.02,
  maxDiffPixels: 100,
  blur: 0,
  ignoreAntialiasing: true,
  ignoreColors: false,
  strategy: 'pixel',
};

/** Strict comparison options for pixel-perfect matching */
export const STRICT_COMPARISON: ComparisonOptions = {
  threshold: 0.1,
  maxDiffPixelRatio: 0.01,
  maxDiffPixels: 50,
  blur: 0,
  ignoreAntialiasing: false,
  ignoreColors: false,
  strategy: 'pixel',
};

/** Lenient comparison options for flaky or dynamic areas */
export const LENIENT_COMPARISON: ComparisonOptions = {
  threshold: 0.3,
  maxDiffPixelRatio: 0.05,
  maxDiffPixels: 500,
  blur: 2,
  ignoreAntialiasing: true,
  ignoreColors: true,
  strategy: 'pixel',
};

/** Comparison strategies for different use cases */
export const COMPARISON_STRATEGIES: Record<string, ComparisonOptions> = {
  /** Strict pixel-perfect matching */
  strict: STRICT_COMPARISON,
  /** Default balanced approach */
  default: DEFAULT_VISUAL_OPTIONS,
  /** Lenient for dynamic content */
  lenient: LENIENT_COMPARISON,
  /** For text-heavy content (ignores minor font rendering differences) */
  text: {
    ...DEFAULT_VISUAL_OPTIONS,
    threshold: 0.25,
    ignoreAntialiasing: true,
    blur: 1,
  },
  /** For image-heavy content */
  images: {
    ...DEFAULT_VISUAL_OPTIONS,
    threshold: 0.15,
    ignoreColors: false,
  },
  /** For charts and data visualizations */
  charts: {
    ...LENIENT_COMPARISON,
    threshold: 0.25,
    maxDiffPixelRatio: 0.03,
  },
};

/** Standard device configurations for visual testing */
export const DEVICE_CONFIGS: Record<string, DeviceConfig> = {
  desktop: {
    name: 'desktop',
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  desktopLarge: {
    name: 'desktop-large',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  tablet: {
    name: 'tablet',
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  mobile: {
    name: 'mobile',
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  mobileLarge: {
    name: 'mobile-large',
    viewport: { width: 414, height: 896 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
};

/** Standard selectors for common dynamic content */
export const DYNAMIC_CONTENT_SELECTORS: Record<string, string[]> = {
  /** Timestamps and dates */
  timestamps: [
    '[data-testid="timestamp"]',
    '[data-testid="date"]',
    '.timestamp',
    '.date-time',
    '.current-time',
    'time',
    '[datetime]',
  ],
  /** Random or generated IDs */
  randomIds: [
    '[data-testid="random-id"]',
    '[id^="random-"]',
    '.random-id',
    '[data-random]',
  ],
  /** User-specific content */
  userContent: [
    '[data-testid="user-name"]',
    '[data-testid="user-avatar"]',
    '.user-specific',
    '[data-user]',
  ],
  /** Loading indicators */
  loading: [
    '.animate-spin',
    '.skeleton',
    '[class*="loading"]',
    '[class*="skeleton"]',
    '.spinner',
    '.loader',
    '[data-loading]',
  ],
  /** Animating elements */
  animations: [
    '[class*="animate-"]',
    '[class*="transition-"]',
    '.fade-in',
    '.slide-in',
  ],
  /** Charts and graphs with dynamic data */
  charts: [
    '[data-testid="chart"]',
    '.chart',
    'canvas',
    '[data-chart]',
  ],
  /** Carets and cursors */
  carets: [
    'input:focus',
    'textarea:focus',
    '[contenteditable]:focus',
    '.caret',
  ],
};

// ============================================
// PATH UTILITIES
// ============================================

/** Base directory for visual test artifacts */
const VISUAL_BASE_DIR = path.join(process.cwd(), 'e2e', '__visual__');

/** Directory for baseline screenshots */
const BASELINE_DIR = path.join(VISUAL_BASE_DIR, 'baselines');

/** Directory for actual screenshots during test runs */
const ACTUAL_DIR = path.join(VISUAL_BASE_DIR, 'actual');

/** Directory for diff images */
const DIFF_DIR = path.join(VISUAL_BASE_DIR, 'diff');

/** Directory for reports */
const REPORT_DIR = path.join(VISUAL_BASE_DIR, 'reports');

/**
 * Ensure visual test directories exist
 */
function ensureDirectories(): void {
  [BASELINE_DIR, ACTUAL_DIR, DIFF_DIR, REPORT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Get the baseline file path for a screenshot name
 * @param name - Screenshot name
 * @param device - Optional device suffix
 * @returns Absolute path to baseline file
 */
export function getBaselinePath(name: string, device?: string): string {
  const suffix = device ? `-${device}` : '';
  const filename = `${name}${suffix}.png`;
  return path.join(BASELINE_DIR, filename);
}

/**
 * Get the actual screenshot file path
 * @param name - Screenshot name
 * @param device - Optional device suffix
 * @returns Absolute path to actual file
 */
export function getActualPath(name: string, device?: string): string {
  const suffix = device ? `-${device}` : '';
  const timestamp = Date.now();
  const filename = `${name}${suffix}-${timestamp}.png`;
  return path.join(ACTUAL_DIR, filename);
}

/**
 * Get the diff output file path
 * @param name - Screenshot name
 * @param device - Optional device suffix
 * @returns Absolute path to diff file
 */
export function getDiffPath(name: string, device?: string): string {
  const suffix = device ? `-${device}` : '';
  const timestamp = Date.now();
  const filename = `${name}${suffix}-diff-${timestamp}.png`;
  return path.join(DIFF_DIR, filename);
}

/**
 * Check if a baseline exists
 * @param name - Screenshot name
 * @param device - Optional device suffix
 * @returns Whether the baseline file exists
 */
export function baselineExists(name: string, device?: string): boolean {
  const baselinePath = getBaselinePath(name, device);
  return fs.existsSync(baselinePath);
}

/**
 * List all baseline images
 * @returns Array of baseline file names
 */
export function listBaselines(): string[] {
  ensureDirectories();
  if (!fs.existsSync(BASELINE_DIR)) {
    return [];
  }
  return fs.readdirSync(BASELINE_DIR).filter(f => f.endsWith('.png'));
}

/**
 * Clean outdated baselines that haven't been accessed recently
 * @param maxAgeDays - Maximum age in days (default: 90)
 * @returns Number of baselines removed
 */
export function cleanOutdatedBaselines(maxAgeDays = 90): number {
  ensureDirectories();
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let removed = 0;

  if (!fs.existsSync(BASELINE_DIR)) {
    return 0;
  }

  const files = fs.readdirSync(BASELINE_DIR);
  for (const file of files) {
    const filePath = path.join(BASELINE_DIR, file);
    const stats = fs.statSync(filePath);
    if (now - stats.atimeMs > maxAgeMs) {
      fs.unlinkSync(filePath);
      removed++;
    }
  }

  return removed;
}

// ============================================
// MASKING UTILITIES
// ============================================

/**
 * Create standard mask selectors for common dynamic content
 * @returns Array of CSS selectors to mask
 */
export function createMaskSelectors(): string[] {
  return [
    ...DYNAMIC_CONTENT_SELECTORS.timestamps,
    ...DYNAMIC_CONTENT_SELECTORS.randomIds,
    ...DYNAMIC_CONTENT_SELECTORS.userContent,
    ...DYNAMIC_CONTENT_SELECTORS.loading,
  ];
}

/**
 * Apply CSS to mask elements by selector
 * @param page - Playwright page
 * @param selectors - CSS selectors to mask
 */
export async function maskElement(page: Page, selectors: string | string[]): Promise<void> {
  const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
  const css = selectorArray
    .map(s => `${s} { visibility: hidden !important; }`)
    .join('\n');
  
  await page.addStyleTag({ content: css });
}

/**
 * Apply CSS to mask a coordinate region
 * @param page - Playwright page
 * @param region - Region to mask { x, y, width, height }
 */
export async function maskRegion(page: Page, region: MaskRegion | MaskRegion[]): Promise<void> {
  const regions = Array.isArray(region) ? region : [region];
  const css = regions
    .map(r => `
      .visual-mask-${r.x}-${r.y} {
        position: absolute;
        left: ${r.x}px;
        top: ${r.y}px;
        width: ${r.width}px;
        height: ${r.height}px;
        background: white !important;
        z-index: 999999;
      }
    `)
    .join('\n');
  
  await page.addStyleTag({ content: css });
  
  // Add mask elements to page
  for (const r of regions) {
    await page.evaluate((coords) => {
      const div = document.createElement('div');
      div.className = `visual-mask-${coords.x}-${coords.y}`;
      div.style.cssText = `
        position: absolute;
        left: ${coords.x}px;
        top: ${coords.y}px;
        width: ${coords.width}px;
        height: ${coords.height}px;
        background: white !important;
        z-index: 999999;
      `;
      document.body.appendChild(div);
    }, r);
  }
}

/**
 * Auto-mask dynamic elements like timestamps, animations, and random content
 * @param page - Playwright page
 * @param additionalSelectors - Additional selectors to mask
 */
export async function maskDynamicElements(
  page: Page,
  additionalSelectors?: string[]
): Promise<void> {
  const selectors = createMaskSelectors();
  if (additionalSelectors) {
    selectors.push(...additionalSelectors);
  }

  // Hide dynamic elements
  const css = `
    ${selectors.join(', ')} {
      visibility: hidden !important;
    }
    /* Hide carets/cursors */
    * {
      caret-color: transparent !important;
    }
    /* Disable CSS animations */
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `;
  
  await page.addStyleTag({ content: css });
  
  // Wait for fonts to be ready
  await page.evaluate(() => document.fonts.ready);
}

// ============================================
// SCREENSHOT UTILITIES
// ============================================

/**
 * Wait for UI to stabilize before capturing screenshot
 * @param page - Playwright page
 * @param options - Stabilization options
 */
export async function stabilizeUI(
  page: Page,
  options: {
    waitForImages?: boolean;
    waitForFonts?: boolean;
    waitForLoaders?: boolean;
    additionalWait?: number;
  } = {}
): Promise<void> {
  const {
    waitForImages = true,
    waitForFonts = true,
    waitForLoaders = true,
    additionalWait = 100,
  } = options;

  // Wait for fonts
  if (waitForFonts) {
    await page.evaluate(() => document.fonts.ready);
  }

  // Wait for images
  if (waitForImages) {
    const images = await page.locator('img').all();
    await Promise.all(
      images.map(img =>
        img.evaluate(el => {
          if ((el as HTMLImageElement).complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            el.addEventListener('load', () => resolve(), { once: true });
            el.addEventListener('error', () => resolve(), { once: true });
          });
        })
      )
    );
  }

  // Wait for loading indicators to disappear
  if (waitForLoaders) {
    const loaders = page.locator(
      '.animate-spin, .skeleton, [class*="loading"], [class*="skeleton"], .spinner'
    );
    await loaders.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {
      // Loading indicators may not exist, that's ok
    });
  }

  // Additional wait for any remaining animations
  if (additionalWait > 0) {
    await page.waitForTimeout(additionalWait);
  }
}

/**
 * Capture a screenshot with full control over options
 * @param page - Playwright page
 * @param name - Screenshot name
 * @param options - Screenshot options
 * @returns Path to the captured screenshot
 */
export async function captureScreenshot(
  page: Page,
  name: string,
  options: ScreenshotOptions = {}
): Promise<string> {
  ensureDirectories();
  
  const {
    fullPage = true,
    element,
    mask,
    maskSelectors = [],
    maskRegions = [],
    animations = 'disabled',
    caret = 'hide',
    timeout = 30000,
    device,
  } = options;

  // Apply masks
  if (mask && mask.length > 0) {
    await maskElement(page, mask);
  }
  if (maskRegions.length > 0) {
    await maskRegion(page, maskRegions);
  }

  // Stabilize UI
  await stabilizeUI(page);

  // Determine output path
  const outputPath = getActualPath(name, device);

  // Prepare screenshot options
  const screenshotOpts: Parameters<Page['screenshot']>[0] = {
    path: outputPath,
    fullPage: element ? false : fullPage,
    animations,
    caret,
    timeout,
  };

  // Convert maskSelectors to Playwright locators
  if (maskSelectors.length > 0) {
    screenshotOpts.mask = maskSelectors.map(selector => page.locator(selector));
  }

  // Take screenshot
  if (element) {
    await element.screenshot(screenshotOpts as Parameters<Locator['screenshot']>[0]);
  } else {
    await page.screenshot(screenshotOpts);
  }

  return outputPath;
}

/**
 * Generate a new baseline screenshot
 * @param page - Playwright page
 * @param name - Screenshot name
 * @param options - Screenshot options
 * @returns Path to the generated baseline
 */
export async function generateBaseline(
  page: Page,
  name: string,
  options: ScreenshotOptions = {}
): Promise<string> {
  ensureDirectories();
  
  const device = options.device;
  const baselinePath = getBaselinePath(name, device);
  
  // Ensure directory exists
  const dir = path.dirname(baselinePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Stabilize and mask
  await maskDynamicElements(page, options.mask);
  await stabilizeUI(page);

  // Take screenshot
  const screenshotOpts: Parameters<Page['screenshot']>[0] = {
    path: baselinePath,
    fullPage: options.fullPage ?? true,
    animations: 'disabled',
    caret: 'hide',
  };

  if (options.element) {
    await options.element.screenshot(screenshotOpts as Parameters<Locator['screenshot']>[0]);
  } else {
    await page.screenshot(screenshotOpts);
  }

  return baselinePath;
}

/**
 * Update an existing baseline screenshot
 * @param name - Screenshot name
 * @param device - Optional device suffix
 * @returns Whether the update was successful
 */
export function updateBaseline(name: string, device?: string): boolean {
  const actualPath = getActualPath(name, device);
  const baselinePath = getBaselinePath(name, device);

  // Find the most recent actual screenshot
  const actualDir = path.dirname(actualPath);
  const prefix = path.basename(actualPath, '.png').replace(/-\d+$/, '');
  
  if (!fs.existsSync(actualDir)) {
    return false;
  }

  const files = fs.readdirSync(actualDir);
  const matchingFiles = files
    .filter(f => f.startsWith(prefix) && f.endsWith('.png'))
    .map(f => ({
      name: f,
      path: path.join(actualDir, f),
      mtime: fs.statSync(path.join(actualDir, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (matchingFiles.length === 0) {
    return false;
  }

  // Copy the most recent actual to baseline
  fs.copyFileSync(matchingFiles[0].path, baselinePath);
  return true;
}

// ============================================
// COMPARISON UTILITIES
// ============================================

/**
 * Compare a screenshot with its baseline using Playwright's built-in comparison
 * @param page - Playwright page
 * @param name - Screenshot name
 * @param options - Comparison options
 * @returns Visual regression result
 */
export async function compareScreenshot(
  page: Page,
  name: string,
  options: ComparisonOptions = {}
): Promise<VisualRegressionResult> {
  const timestamp = new Date().toISOString();
  const threshold = options.threshold ?? DEFAULT_VISUAL_OPTIONS.threshold!;
  const device = options.device;
  
  try {
    // Use Playwright's built-in visual comparison
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      threshold,
      maxDiffPixelRatio: options.maxDiffPixelRatio ?? DEFAULT_VISUAL_OPTIONS.maxDiffPixelRatio,
      maxDiffPixels: options.maxDiffPixels ?? DEFAULT_VISUAL_OPTIONS.maxDiffPixels,
      animations: 'disabled',
      caret: 'hide',
    });

    return {
      name,
      passed: true,
      baselinePath: getBaselinePath(name, device),
      threshold,
      device,
      timestamp,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      name,
      passed: false,
      baselinePath: getBaselinePath(name, device),
      threshold,
      device,
      timestamp,
      error: errorMessage,
    };
  }
}

// ============================================
// VISUAL ASSERTIONS
// ============================================

/**
 * Main visual assertion - expect page to match baseline screenshot
 * @param page - Playwright page
 * @param name - Screenshot name
 * @param options - Screenshot and comparison options
 */
export async function expectToMatchScreenshot(
  page: Page,
  name: string,
  options: ComparisonOptions & ScreenshotOptions = {}
): Promise<VisualRegressionResult> {
  // Apply masks and stabilize
  await maskDynamicElements(page, options.mask);
  await stabilizeUI(page);

  const result = await compareScreenshot(page, name, {
    ...DEFAULT_VISUAL_OPTIONS,
    ...options,
  });

  return result;
}

/**
 * Element-specific visual assertion
 * @param page - Playwright page
 * @param selector - Element selector
 * @param name - Screenshot name
 * @param options - Comparison options
 */
export async function expectElementToMatchScreenshot(
  page: Page,
  selector: string,
  name: string,
  options: ComparisonOptions & ScreenshotOptions = {}
): Promise<VisualRegressionResult> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });

  // Apply masks
  await maskDynamicElements(page, options.mask);
  await stabilizeUI(page);

  const timestamp = new Date().toISOString();
  const threshold = options.threshold ?? DEFAULT_VISUAL_OPTIONS.threshold!;
  const device = options.device;

  try {
    await expect(element).toHaveScreenshot(`${name}.png`, {
      threshold,
      maxDiffPixelRatio: options.maxDiffPixelRatio ?? DEFAULT_VISUAL_OPTIONS.maxDiffPixelRatio,
      maxDiffPixels: options.maxDiffPixels ?? DEFAULT_VISUAL_OPTIONS.maxDiffPixels,
      animations: 'disabled',
      caret: 'hide',
    });

    return {
      name,
      passed: true,
      baselinePath: getBaselinePath(name, device),
      threshold,
      device,
      timestamp,
      dimensions: await element.boundingBox().then(box => 
        box ? { width: Math.round(box.width), height: Math.round(box.height) } : undefined
      ),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      name,
      passed: false,
      baselinePath: getBaselinePath(name, device),
      threshold,
      device,
      timestamp,
      error: errorMessage,
    };
  }
}

/**
 * Custom threshold visual assertion
 * @param page - Playwright page
 * @param name - Screenshot name
 * @param threshold - Custom threshold (0-1)
 * @param options - Additional options
 */
export async function expectNoVisualRegression(
  page: Page,
  name: string,
  threshold: number = DEFAULT_VISUAL_OPTIONS.threshold!,
  options: Omit<ComparisonOptions & ScreenshotOptions, 'threshold'> = {}
): Promise<VisualRegressionResult> {
  return expectToMatchScreenshot(page, name, {
    ...options,
    threshold,
  });
}

// ============================================
// DEVICE-SPECIFIC BASELINES
// ============================================

/**
 * Generate device-specific baseline name
 * @param name - Base screenshot name
 * @param device - Device name or config
 * @returns Device-specific name
 */
export function getDeviceBaselineName(name: string, device: string | DeviceConfig): string {
  const deviceName = typeof device === 'string' ? device : device.name;
  return `${name}-${deviceName}`;
}

/**
 * Capture screenshot for all configured devices
 * @param page - Playwright page
 * @param name - Base screenshot name
 * @param devices - Device configs to capture for (defaults to all)
 * @returns Array of captured screenshot paths
 */
export async function captureForAllDevices(
  page: Page,
  name: string,
  devices: DeviceConfig[] = Object.values(DEVICE_CONFIGS)
): Promise<Array<{ device: string; path: string }>> {
  const results: Array<{ device: string; path: string }> = [];

  for (const device of devices) {
    // Set viewport
    await page.setViewportSize(device.viewport);
    
    // Set device scale factor if supported
    if (device.deviceScaleFactor) {
      await page.evaluate((scale) => {
        // Force re-render at new scale
        document.body.style.transform = 'scale(1)';
        document.body.style.transform = '';
        void scale; // Suppress unused warning
      }, device.deviceScaleFactor);
    }

    // Wait for layout to settle
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await page.waitForTimeout(100);

    // Capture screenshot
    const screenshotPath = await captureScreenshot(page, name, {
      fullPage: true,
      device: device.name,
    });

    results.push({ device: device.name, path: screenshotPath });
  }

  return results;
}

/**
 * Compare screenshot for specific device
 * @param page - Playwright page
 * @param name - Screenshot name
 * @param device - Device name or config
 * @param options - Comparison options
 * @returns Visual regression result
 */
export async function compareForDevice(
  page: Page,
  name: string,
  device: string | DeviceConfig,
  options: ComparisonOptions & ScreenshotOptions = {}
): Promise<VisualRegressionResult> {
  const deviceConfig = typeof device === 'string' 
    ? DEVICE_CONFIGS[device] 
    : device;
  
  if (!deviceConfig) {
    throw new Error(`Unknown device: ${device}`);
  }

  // Set viewport
  await page.setViewportSize(deviceConfig.viewport);
  
  // Wait for layout to settle
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(100);

  const deviceName = typeof device === 'string' ? device : device.name;
  return expectToMatchScreenshot(page, name, {
    ...options,
    device: deviceName,
  });
}

// ============================================
// REPORTING
// ============================================

/**
 * Format a visual diff result for human-readable output
 * @param result - Visual regression result
 * @returns Formatted diff description
 */
export function formatVisualDiff(result: VisualRegressionResult): string {
  const lines: string[] = [];
  
  lines.push(`Test: ${result.name}`);
  lines.push(`Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push(`Device: ${result.device || 'default'}`);
  lines.push(`Threshold: ${(result.threshold * 100).toFixed(1)}%`);
  
  if (result.diffPixels !== undefined) {
    lines.push(`Different pixels: ${result.diffPixels}`);
  }
  if (result.diffRatio !== undefined) {
    lines.push(`Difference ratio: ${(result.diffRatio * 100).toFixed(2)}%`);
  }
  if (result.dimensions) {
    lines.push(`Dimensions: ${result.dimensions.width}x${result.dimensions.height}`);
  }
  if (result.error) {
    lines.push(`Error: ${result.error}`);
  }
  
  lines.push(`Timestamp: ${result.timestamp}`);
  lines.push(`Baseline: ${result.baselinePath}`);
  
  return lines.join('\n');
}

/**
 * Generate an HTML report for visual test results
 * @param results - Visual regression results
 * @param options - Report options
 * @returns Path to the generated report
 */
export function generateVisualReport(
  results: VisualRegressionResult[],
  options: {
    title?: string;
    outputPath?: string;
    includeImages?: boolean;
  } = {}
): string {
  const {
    title = 'Visual Regression Test Report',
    outputPath = path.join(REPORT_DIR, `visual-report-${Date.now()}.html`),
    includeImages = true,
  } = options;

  ensureDirectories();

  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);
  const timestamp = new Date().toISOString();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    header {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    .summary-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      text-align: center;
    }
    .summary-card.passed { border-left: 4px solid #27ae60; }
    .summary-card.failed { border-left: 4px solid #e74c3c; }
    .summary-card.total { border-left: 4px solid #3498db; }
    .number {
      font-size: 2.5em;
      font-weight: bold;
      display: block;
    }
    .label {
      color: #7f8c8d;
      text-transform: uppercase;
      font-size: 0.9em;
    }
    .filters {
      background: white;
      padding: 15px 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .filters button {
      padding: 8px 16px;
      margin-right: 10px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
    }
    .filters button.active {
      background: #3498db;
      color: white;
      border-color: #3498db;
    }
    .results {
      display: grid;
      gap: 20px;
    }
    .result-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .result-card.passed { border-left: 4px solid #27ae60; }
    .result-card.failed { border-left: 4px solid #e74c3c; }
    .result-header {
      padding: 20px;
      background: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .result-title {
      font-size: 1.2em;
      font-weight: 600;
    }
    .result-status {
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 500;
      text-transform: uppercase;
    }
    .result-status.passed { background: #d4edda; color: #155724; }
    .result-status.failed { background: #f8d7da; color: #721c24; }
    .result-details {
      padding: 20px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #7f8c8d; }
    .detail-value { font-family: monospace; }
    .images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
      padding: 0 20px 20px;
    }
    .image-container {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
    }
    .image-container h4 {
      margin-bottom: 10px;
      font-size: 0.9em;
      color: #7f8c8d;
    }
    .image-container img {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      max-height: 400px;
      object-fit: contain;
    }
    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 4px;
      margin: 0 20px 20px;
      font-family: monospace;
      font-size: 0.9em;
      white-space: pre-wrap;
    }
    .timestamp {
      color: #7f8c8d;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${title}</h1>
      <p class="timestamp">Generated: ${timestamp}</p>
      <div class="summary">
        <div class="summary-card total">
          <span class="number">${results.length}</span>
          <span class="label">Total</span>
        </div>
        <div class="summary-card passed">
          <span class="number">${passed.length}</span>
          <span class="label">Passed</span>
        </div>
        <div class="summary-card failed">
          <span class="number">${failed.length}</span>
          <span class="label">Failed</span>
        </div>
      </div>
    </header>

    <div class="filters">
      <button class="active" onclick="filterResults('all')">All</button>
      <button onclick="filterResults('passed')">Passed</button>
      <button onclick="filterResults('failed')">Failed</button>
    </div>

    <div class="results">
      ${results.map(result => {
        const status = result.passed ? 'passed' : 'failed';
        return `
        <div class="result-card ${status}" data-status="${status}">
          <div class="result-header">
            <div class="result-title">${result.name}</div>
            <div class="result-status ${status}">${status}</div>
          </div>
          <div class="result-details">
            <div class="detail-row">
              <span class="detail-label">Device</span>
              <span class="detail-value">${result.device || 'default'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Threshold</span>
              <span class="detail-value">${(result.threshold * 100).toFixed(1)}%</span>
            </div>
            ${result.diffPixels !== undefined ? `
            <div class="detail-row">
              <span class="detail-label">Different Pixels</span>
              <span class="detail-value">${result.diffPixels}</span>
            </div>
            ` : ''}
            ${result.diffRatio !== undefined ? `
            <div class="detail-row">
              <span class="detail-label">Difference Ratio</span>
              <span class="detail-value">${(result.diffRatio * 100).toFixed(2)}%</span>
            </div>
            ` : ''}
            ${result.dimensions ? `
            <div class="detail-row">
              <span class="detail-label">Dimensions</span>
              <span class="detail-value">${result.dimensions.width}x${result.dimensions.height}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="detail-label">Timestamp</span>
              <span class="detail-value">${result.timestamp}</span>
            </div>
          </div>
          ${result.error ? `
          <div class="error-message">${result.error.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          ` : ''}
          ${includeImages ? `
          <div class="images">
            <div class="image-container">
              <h4>Baseline</h4>
              <img src="file://${result.baselinePath}" alt="Baseline" onerror="this.style.display='none'">
            </div>
          </div>
          ` : ''}
        </div>
        `;
      }).join('')}
    </div>
  </div>

  <script>
    function filterResults(status) {
      document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
      });
      event.target.classList.add('active');
      
      document.querySelectorAll('.result-card').forEach(card => {
        if (status === 'all' || card.dataset.status === status) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  return outputPath;
}
