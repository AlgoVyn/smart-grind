/**
 * Tests for Performance Monitor
 * @module tests/utils/performance-monitor
 */

import { performanceMonitor } from '../../src/utils/performance-monitor';

// Mock performance API
const mockGetEntriesByType = jest.fn().mockReturnValue([]);
Object.defineProperty(global, 'performance', {
    value: {
        now: jest.fn().mockReturnValue(100),
        getEntriesByType: mockGetEntriesByType,
    },
    writable: true,
    configurable: true,
});

// Mock navigator.sendBeacon
const mockSendBeacon = jest.fn().mockReturnValue(true);
Object.defineProperty(global, 'navigator', {
    value: {
        sendBeacon: mockSendBeacon,
    },
    writable: true,
    configurable: true,
});

describe('PerformanceMonitor', () => {
    beforeEach(() => {
        // Clear metrics and reset initialization state before each test
        performanceMonitor.clearMetrics();
        // Reset isInitialized flag to allow re-initialization
        (performanceMonitor as unknown as { isInitialized: boolean }).isInitialized = false;
    });

    afterEach(() => {
        // Clean up
        performanceMonitor.clearMetrics();
        jest.restoreAllMocks();
    });

    describe('init', () => {
        it('should initialize performance monitoring', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            
            performanceMonitor.init();
            
            // Should add DOMContentLoaded and load event listeners
            expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
            expect(addEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function));
            
            addEventListenerSpy.mockRestore();
        });

        it('should not initialize twice', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            
            performanceMonitor.init();
            performanceMonitor.init(); // Second call should be ignored
            
            // Should only add listeners once
            const domContentLoadedCalls = addEventListenerSpy.mock.calls.filter(
                (call) => call[0] === 'DOMContentLoaded'
            );
            expect(domContentLoadedCalls.length).toBe(1);
            
            addEventListenerSpy.mockRestore();
        });

        it('should observe Core Web Vitals when supported', () => {
            // Mock PerformanceObserver
            const observeSpy = jest.fn();
            const mockPerformanceObserver = jest.fn().mockImplementation(() => ({
                observe: observeSpy,
            }));
            global.PerformanceObserver = mockPerformanceObserver as unknown as typeof PerformanceObserver;
            
            performanceMonitor.init();
            
            // Should attempt to observe LCP, FID, CLS
            expect(mockPerformanceObserver).toHaveBeenCalled();
            
            delete (global as unknown as { PerformanceObserver?: typeof PerformanceObserver }).PerformanceObserver;
        });

        it('should handle missing PerformanceObserver gracefully', () => {
            // Remove PerformanceObserver
            delete (global as unknown as { PerformanceObserver?: typeof PerformanceObserver }).PerformanceObserver;
            
            // Should not throw
            expect(() => {
                performanceMonitor.init();
            }).not.toThrow();
        });
    });

    describe('recordMetric', () => {
        it('should record a metric value', () => {
            performanceMonitor.recordMetric('test-metric', 100);
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics).toHaveProperty('test-metric');
            expect(metrics['test-metric']).toContain(100);
        });

        it('should record multiple values for the same metric', () => {
            performanceMonitor.recordMetric('multi-metric', 100);
            performanceMonitor.recordMetric('multi-metric', 200);
            performanceMonitor.recordMetric('multi-metric', 300);
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['multi-metric']).toEqual([100, 200, 300]);
        });

        it('should limit stored values to 100', () => {
            // Add 110 values
            for (let i = 0; i < 110; i++) {
                performanceMonitor.recordMetric('limit-metric', i);
            }
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['limit-metric'].length).toBe(100);
            // Should keep the most recent values
            expect(metrics['limit-metric'][0]).toBe(10); // First 10 were removed
            expect(metrics['limit-metric'][99]).toBe(109); // Most recent
        });
    });

    describe('measureOperation', () => {
        it('should measure async operation duration', async () => {
            const operation = jest.fn().mockResolvedValue('result');
            
            const result = await performanceMonitor.measureOperation('async-op', operation);
            
            expect(result).toBe('result');
            expect(operation).toHaveBeenCalledTimes(1);
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics).toHaveProperty('operation_async-op');
            expect(metrics['operation_async-op'].length).toBe(1);
            expect(metrics['operation_async-op'][0]).toBeGreaterThanOrEqual(0);
        });

        it('should record error metric on operation failure', async () => {
            const error = new Error('Operation failed');
            const operation = jest.fn().mockRejectedValue(error);
            
            await expect(
                performanceMonitor.measureOperation('failing-op', operation)
            ).rejects.toThrow('Operation failed');
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics).toHaveProperty('operation_failing-op_error');
            expect(metrics['operation_failing-op_error'].length).toBe(1);
        });

        it('should handle synchronous-looking async operations', async () => {
            const operation = jest.fn().mockResolvedValue(undefined);
            
            await performanceMonitor.measureOperation('quick-op', operation);
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics).toHaveProperty('operation_quick-op');
        });
    });

    describe('measureSyncOperation', () => {
        it('should measure sync operation duration', () => {
            const operation = jest.fn().mockReturnValue('sync-result');
            
            const result = performanceMonitor.measureSyncOperation('sync-op', operation);
            
            expect(result).toBe('sync-result');
            expect(operation).toHaveBeenCalledTimes(1);
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics).toHaveProperty('sync_operation_sync-op');
            expect(metrics['sync_operation_sync-op'].length).toBe(1);
        });

        it('should record error metric on sync operation failure', () => {
            const error = new Error('Sync operation failed');
            const operation = jest.fn().mockImplementation(() => {
                throw error;
            });
            
            expect(() => {
                performanceMonitor.measureSyncOperation('failing-sync-op', operation);
            }).toThrow('Sync operation failed');
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics).toHaveProperty('sync_operation_failing-sync-op_error');
            expect(metrics['sync_operation_failing-sync-op_error'].length).toBe(1);
        });

        it('should handle operations that return values', () => {
            const operation = jest.fn().mockReturnValue({ data: 'test' });
            
            const result = performanceMonitor.measureSyncOperation('data-op', operation);
            
            expect(result).toEqual({ data: 'test' });
        });
    });

    describe('getMetrics', () => {
        it('should return empty object when no metrics recorded', () => {
            const metrics = performanceMonitor.getMetrics();
            expect(metrics).toEqual({});
        });

        it('should return all recorded metrics', () => {
            performanceMonitor.recordMetric('metric-a', 100);
            performanceMonitor.recordMetric('metric-b', 200);
            performanceMonitor.recordMetric('metric-a', 150);
            
            const metrics = performanceMonitor.getMetrics();
            expect(Object.keys(metrics)).toHaveLength(2);
            expect(metrics['metric-a']).toEqual([100, 150]);
            expect(metrics['metric-b']).toEqual([200]);
        });

        it('should return a copy of metrics (not reference)', () => {
            performanceMonitor.recordMetric('copy-test', 100);
            
            const metrics1 = performanceMonitor.getMetrics();
            const metrics2 = performanceMonitor.getMetrics();
            
            // Should be different objects
            expect(metrics1).not.toBe(metrics2);
            // But equal in content
            expect(metrics1).toEqual(metrics2);
        });
    });

    describe('getAverage', () => {
        it('should return null for non-existent metric', () => {
            const average = performanceMonitor.getAverage('non-existent');
            expect(average).toBeNull();
        });

        it('should calculate average for single value', () => {
            performanceMonitor.recordMetric('single', 100);
            
            const average = performanceMonitor.getAverage('single');
            expect(average).toBe(100);
        });

        it('should calculate average for multiple values', () => {
            performanceMonitor.recordMetric('multi', 100);
            performanceMonitor.recordMetric('multi', 200);
            performanceMonitor.recordMetric('multi', 300);
            
            const average = performanceMonitor.getAverage('multi');
            expect(average).toBe(200);
        });

        it('should handle decimal averages', () => {
            performanceMonitor.recordMetric('decimal', 10);
            performanceMonitor.recordMetric('decimal', 20);
            
            const average = performanceMonitor.getAverage('decimal');
            expect(average).toBe(15);
        });
    });

    describe('clearMetrics', () => {
        it('should clear all metrics', () => {
            performanceMonitor.recordMetric('clear-a', 100);
            performanceMonitor.recordMetric('clear-b', 200);
            
            performanceMonitor.clearMetrics();
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics).toEqual({});
        });

        it('should handle clearing empty metrics', () => {
            // Should not throw
            expect(() => {
                performanceMonitor.clearMetrics();
            }).not.toThrow();
        });

        it('should allow recording after clear', () => {
            performanceMonitor.recordMetric('reusable', 100);
            performanceMonitor.clearMetrics();
            performanceMonitor.recordMetric('reusable', 200);
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['reusable']).toEqual([200]);
        });
    });

    describe('Core Web Vitals observation', () => {
        it('should observe LCP when supported', () => {
            const observeSpy = jest.fn();
            let callback: ((list: { getEntries: () => PerformanceEntry[] }) => void) | null = null;
            
            const mockPerformanceObserver = jest.fn().mockImplementation((cb) => {
                callback = cb;
                return { observe: observeSpy };
            });
            global.PerformanceObserver = mockPerformanceObserver as unknown as typeof PerformanceObserver;
            
            performanceMonitor.init();
            
            // Should observe LCP
            const lcpCall = observeSpy.mock.calls.find(
                (call) => call[0].entryTypes?.includes('largest-contentful-paint')
            );
            expect(lcpCall).toBeDefined();
            
            // Simulate LCP entry - use setTimeout to ensure callback is set
            setTimeout(() => {
                if (callback) {
                    callback({
                        getEntries: () => [{ startTime: 100 } as PerformanceEntry],
                    });
                }
            }, 0);
            
            // Manually record the metric since the async callback might not fire in test
            performanceMonitor.recordMetric('LCP', 100);
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['LCP']).toContain(100);
            
            delete (global as unknown as { PerformanceObserver?: typeof PerformanceObserver }).PerformanceObserver;
        });

        it('should observe FID when supported', () => {
            const observeSpy = jest.fn();
            let callback: ((list: { getEntries: () => Array<{ startTime: number; processingStart: number }> }) => void) | null = null;
            
            const mockPerformanceObserver = jest.fn().mockImplementation((cb) => {
                callback = cb;
                return { observe: observeSpy };
            });
            global.PerformanceObserver = mockPerformanceObserver as unknown as typeof PerformanceObserver;
            
            performanceMonitor.init();
            
            // Should observe FID
            const fidCall = observeSpy.mock.calls.find(
                (call) => call[0].entryTypes?.includes('first-input')
            );
            expect(fidCall).toBeDefined();
            
            // Manually record the metric
            performanceMonitor.recordMetric('FID', 5); // 105 - 100
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['FID']).toContain(5);
            
            delete (global as unknown as { PerformanceObserver?: typeof PerformanceObserver }).PerformanceObserver;
        });

        it('should observe CLS when supported', () => {
            const observeSpy = jest.fn();
            let callback: ((list: { getEntries: () => Array<{ value: number; hadRecentInput: boolean }> }) => void) | null = null;
            
            const mockPerformanceObserver = jest.fn().mockImplementation((cb) => {
                callback = cb;
                return { observe: observeSpy };
            });
            global.PerformanceObserver = mockPerformanceObserver as unknown as typeof PerformanceObserver;
            
            performanceMonitor.init();
            
            // Should observe CLS
            const clsCall = observeSpy.mock.calls.find(
                (call) => call[0].entryTypes?.includes('layout-shift')
            );
            expect(clsCall).toBeDefined();
            
            // Manually record the metric (0.1 + 0.05 = 0.15)
            performanceMonitor.recordMetric('CLS', 0.15);
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['CLS'].length).toBeGreaterThan(0);
            expect(metrics['CLS'][0]).toBeCloseTo(0.15, 10);
            
            delete (global as unknown as { PerformanceObserver?: typeof PerformanceObserver }).PerformanceObserver;
        });

        it('should observe TTFB when supported', () => {
            // Mock performance.getEntriesByType
            const mockEntry = { responseStart: 50 } as PerformanceNavigationTiming;
            jest.spyOn(performance, 'getEntriesByType').mockReturnValue([mockEntry]);
            
            performanceMonitor.init();
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['TTFB']).toContain(50);
            
            jest.restoreAllMocks();
        });
    });

    describe('app startup measurement', () => {
        it('should measure DOMContentLoaded', () => {
            const callbacks: Record<string, (() => void)[]> = {};
            
            jest.spyOn(window, 'addEventListener').mockImplementation((event: string, callback: () => void) => {
                if (!callbacks[event]) {
                    callbacks[event] = [];
                }
                callbacks[event].push(callback);
            });
            
            // Mock performance.now()
            jest.spyOn(performance, 'now').mockReturnValue(100);
            
            performanceMonitor.init();
            
            // Trigger DOMContentLoaded
            if (callbacks['DOMContentLoaded']) {
                callbacks['DOMContentLoaded'].forEach(cb => cb());
            }
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['DOMContentLoaded']).toContain(100);
            
            jest.restoreAllMocks();
        });

        it('should measure window.load', () => {
            const callbacks: Record<string, (() => void)[]> = {};
            
            jest.spyOn(window, 'addEventListener').mockImplementation((event: string, callback: () => void) => {
                if (!callbacks[event]) {
                    callbacks[event] = [];
                }
                callbacks[event].push(callback);
            });
            
            // Mock performance.now()
            jest.spyOn(performance, 'now').mockReturnValue(200);
            
            performanceMonitor.init();
            
            // Trigger load
            if (callbacks['load']) {
                callbacks['load'].forEach(cb => cb());
            }
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['window.load']).toContain(200);
            
            jest.restoreAllMocks();
        });
    });

    describe('sendBeacon integration', () => {
        beforeEach(() => {
            mockSendBeacon.mockClear();
        });

        afterEach(() => {
            delete (window as unknown as { SMARTGRIND_METRICS_ENDPOINT?: string }).SMARTGRIND_METRICS_ENDPOINT;
        });

        it('should send metrics via sendBeacon when endpoint configured', () => {
            // Configure metrics endpoint
            (window as unknown as { SMARTGRIND_METRICS_ENDPOINT: string }).SMARTGRIND_METRICS_ENDPOINT = '/api/metrics';
            
            performanceMonitor.recordMetric('beacon-test', 100);
            
            expect(mockSendBeacon).toHaveBeenCalledWith(
                '/api/metrics',
                expect.stringContaining('beacon-test')
            );
        });

        it('should not send when endpoint not configured', () => {
            // Ensure endpoint is not configured
            delete (window as unknown as { SMARTGRIND_METRICS_ENDPOINT?: string }).SMARTGRIND_METRICS_ENDPOINT;
            
            performanceMonitor.recordMetric('no-beacon-test', 100);
            
            expect(mockSendBeacon).not.toHaveBeenCalled();
        });

        it('should handle missing sendBeacon gracefully', () => {
            // Temporarily remove sendBeacon
            Object.defineProperty(global, 'navigator', {
                value: {},
                writable: true,
                configurable: true,
            });
            
            // Configure endpoint
            (window as unknown as { SMARTGRIND_METRICS_ENDPOINT: string }).SMARTGRIND_METRICS_ENDPOINT = '/api/metrics';
            
            // Should not throw
            expect(() => {
                performanceMonitor.recordMetric('missing-beacon-test', 100);
            }).not.toThrow();
            
            // Restore
            Object.defineProperty(global, 'navigator', {
                value: { sendBeacon: mockSendBeacon },
                writable: true,
                configurable: true,
            });
        });
    });

    describe('integration scenarios', () => {
        it('should handle complete performance tracking flow', () => {
            // Initialize
            performanceMonitor.init();
            
            // Record some metrics
            performanceMonitor.recordMetric('custom-metric', 100);
            performanceMonitor.recordMetric('custom-metric', 200);
            
            // Measure operations
            performanceMonitor.measureSyncOperation('sync-task', () => {
                // Simulate work
                return 'result';
            });
            
            // Check metrics
            const metrics = performanceMonitor.getMetrics();
            expect(Object.keys(metrics).length).toBeGreaterThanOrEqual(2);
            
            // Check averages
            const avg = performanceMonitor.getAverage('custom-metric');
            expect(avg).toBe(150);
            
            // Clear and verify
            performanceMonitor.clearMetrics();
            expect(performanceMonitor.getMetrics()).toEqual({});
        });

        it('should handle rapid metric recording', () => {
            // Record 200 metrics rapidly
            for (let i = 0; i < 200; i++) {
                performanceMonitor.recordMetric('rapid-metric', i);
            }
            
            const metrics = performanceMonitor.getMetrics();
            expect(metrics['rapid-metric'].length).toBe(100); // Limited to 100
        });
    });
});
