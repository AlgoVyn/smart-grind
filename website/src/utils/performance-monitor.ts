/**
 * Performance Monitor - Tracks Core Web Vitals and custom performance metrics
 * Uses PerformanceObserver API for efficient metric collection
 */

interface PerformanceMetric {
    name: string;
    value: number;
    timestamp: number;
    url: string;
}

class PerformanceMonitor {
    private metrics: Map<string, number[]> = new Map();
    private isInitialized = false;

    init(): void {
        if (this.isInitialized) return;

        // Core Web Vitals
        this.observeLCP();
        this.observeFID();
        this.observeCLS();
        this.observeTTFB();

        // Custom metrics
        this.measureAppStartup();

        this.isInitialized = true;
    }

    private observeLCP(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1] as PerformanceEntry;
                this.reportMetric('LCP', lastEntry.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] as const });
        } catch {
            // LCP not supported
        }
    }

    private observeFID(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const fidEntry = entry as PerformanceEventTiming;
                    const value = fidEntry.processingStart - fidEntry.startTime;
                    this.reportMetric('FID', value);
                }
            });
            observer.observe({ entryTypes: ['first-input'] as const });
        } catch {
            // FID not supported
        }
    }

    private observeCLS(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const layoutShift = entry as LayoutShift;
                    if (!layoutShift.hadRecentInput) {
                        clsValue += layoutShift.value;
                    }
                }
                this.reportMetric('CLS', clsValue);
            });
            observer.observe({ entryTypes: ['layout-shift'] as const });
        } catch {
            // CLS not supported
        }
    }

    private observeTTFB(): void {
        if (!('performance' in window)) return;

        const navigation = performance.getEntriesByType(
            'navigation'
        )[0] as PerformanceNavigationTiming;
        if (navigation) {
            this.reportMetric('TTFB', navigation.responseStart);
        }
    }

    private measureAppStartup(): void {
        if (!('performance' in window)) return;

        // Measure when DOM is ready
        window.addEventListener('DOMContentLoaded', () => {
            const timing = performance.now();
            this.reportMetric('DOMContentLoaded', timing);
        });

        // Measure when everything is loaded
        window.addEventListener('load', () => {
            const timing = performance.now();
            this.reportMetric('window.load', timing);
        });
    }

    /**
     * Measure the duration of an async operation
     * @param name - Name of the operation
     * @param operation - The operation to measure
     * @returns The result of the operation
     */
    async measureOperation<T>(name: string, operation: () => Promise<T>): Promise<T> {
        const start = performance.now();
        try {
            const result = await operation();
            const duration = performance.now() - start;
            this.reportMetric(`operation_${name}`, duration);
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            this.reportMetric(`operation_${name}_error`, duration);
            throw error;
        }
    }

    /**
     * Measure the duration of a sync operation
     * @param name - Name of the operation
     * @param operation - The operation to measure
     * @returns The result of the operation
     */
    measureSyncOperation<T>(name: string, operation: () => T): T {
        const start = performance.now();
        try {
            const result = operation();
            const duration = performance.now() - start;
            this.reportMetric(`sync_operation_${name}`, duration);
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            this.reportMetric(`sync_operation_${name}_error`, duration);
            throw error;
        }
    }

    /**
     * Record a custom metric value
     * @param name - Metric name
     * @param value - Metric value
     */
    recordMetric(name: string, value: number): void {
        this.reportMetric(name, value);
    }

    private reportMetric(name: string, value: number): void {
        // Store locally
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        const values = this.metrics.get(name)!;
        values.push(value);
        // Keep last 100 values
        if (values.length > 100) {
            values.shift();
        }

        // Send to analytics if endpoint is configured and available
        // Only send in production environments where metrics endpoint exists
        const metricsEndpoint = (window as { SMARTGRIND_METRICS_ENDPOINT?: string })
            .SMARTGRIND_METRICS_ENDPOINT;
        if (!metricsEndpoint) {
            // Metrics endpoint not configured, skip remote reporting
            return;
        }

        const metric: PerformanceMetric = {
            name,
            value,
            timestamp: Date.now(),
            url: window.location.href,
        };

        // Use sendBeacon for reliable delivery (fire-and-forget, no error handling needed)
        if (navigator.sendBeacon) {
            navigator.sendBeacon(metricsEndpoint, JSON.stringify(metric));
        }
    }

    /**
     * Get all recorded metrics
     */
    getMetrics(): Record<string, number[]> {
        const result: Record<string, number[]> = {};
        this.metrics.forEach((values, name) => {
            result[name] = [...values];
        });
        return result;
    }

    /**
     * Get average value for a metric
     */
    getAverage(name: string): number | null {
        const values = this.metrics.get(name);
        if (!values || values.length === 0) return null;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    /**
     * Clear all metrics
     */
    clearMetrics(): void {
        this.metrics.clear();
    }
}

// LayoutShift interface for TypeScript
interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
}

export const performanceMonitor = new PerformanceMonitor();
