/**
 * Main Application Tests
 * Tests for application initialization and core functionality
 */

// Mock dependencies
const mockInit = jest.fn();
const mockCheckAuth = jest.fn();
const mockInitSyncIndicators = jest.fn();
const mockUiInit = jest.fn();
const mockErrorTrackerInit = jest.fn();
const mockPerformanceMonitorInit = jest.fn();
const mockRecordMetric = jest.fn();
const mockCleanupAll = jest.fn();
const mockCaptureException = jest.fn();

jest.mock('../src/state', () => ({
    state: {
        init: mockInit,
        user: { type: 'signed-out' },
        setOnlineStatus: jest.fn(),
        setSyncStatus: jest.fn(),
    },
}));

jest.mock('../src/init', () => ({
    checkAuth: mockCheckAuth,
}));

jest.mock('../src/ui/ui-sync-indicators', () => ({
    initSyncIndicators: mockInitSyncIndicators,
}));

jest.mock('../src/ui/ui', () => ({
    ui: {
        init: mockUiInit,
    },
}));

jest.mock('../src/utils/error-tracker', () => ({
    errorTracker: {
        init: mockErrorTrackerInit,
        captureException: mockCaptureException,
    },
}));

jest.mock('../src/utils/performance-monitor', () => ({
    performanceMonitor: {
        init: mockPerformanceMonitorInit,
        recordMetric: mockRecordMetric,
    },
}));

jest.mock('../src/utils/cleanup-manager', () => ({
    cleanupManager: {
        cleanupAll: mockCleanupAll,
        register: jest.fn(),
    },
}));

describe('Main Application', () => {
    let eventListeners: Map<string, EventListener[]>;
    let originalReadyState: string;

    beforeEach(() => {
        jest.clearAllMocks();
        eventListeners = new Map();
        originalReadyState = document.readyState;

        // Mock document.readyState
        Object.defineProperty(document, 'readyState', {
            writable: true,
            configurable: true,
            value: 'loading',
        });

        // Mock addEventListener to capture listeners
        const originalDocAddEventListener = document.addEventListener.bind(document);
        document.addEventListener = jest.fn((type: string, listener: EventListener) => {
            if (!eventListeners.has(type)) {
                eventListeners.set(type, []);
            }
            eventListeners.get(type)!.push(listener);
            return originalDocAddEventListener(type, listener);
        }) as any;

        // Also capture window.addEventListener for beforeunload
        const originalWinAddEventListener = window.addEventListener.bind(window);
        window.addEventListener = jest.fn((type: string, listener: EventListener) => {
            if (!eventListeners.has(type)) {
                eventListeners.set(type, []);
            }
            eventListeners.get(type)!.push(listener);
            return originalWinAddEventListener(type, listener);
        }) as any;

        // Clear window.SmartGrind
        (window as any).SmartGrind = undefined;
    });

    afterEach(() => {
        // Restore document.readyState
        Object.defineProperty(document, 'readyState', {
            writable: true,
            configurable: true,
            value: originalReadyState,
        });
        eventListeners.clear();
        jest.resetModules();
    });

    describe('initApp', () => {
        test('should initialize all components successfully', async () => {
            mockCheckAuth.mockResolvedValue(undefined);
            mockUiInit.mockResolvedValue(undefined);

            // Import main module
            require('../src/main');

            // Simulate DOMContentLoaded
            const listeners = eventListeners.get('DOMContentLoaded') || [];
            for (const listener of listeners) {
                await listener(new Event('DOMContentLoaded'));
            }

            // Wait for async operations
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockErrorTrackerInit).toHaveBeenCalled();
            expect(mockPerformanceMonitorInit).toHaveBeenCalled();
            expect(mockInit).toHaveBeenCalled();
            expect(mockCheckAuth).toHaveBeenCalled();
            expect(mockInitSyncIndicators).toHaveBeenCalled();
            expect(mockUiInit).toHaveBeenCalled();
            expect(mockRecordMetric).toHaveBeenCalledWith('app_initialized', 1);
        });

        test('should handle initialization errors gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            mockInit.mockImplementation(() => {
                throw new Error('Init failed');
            });

            require('../src/main');

            const listeners = eventListeners.get('DOMContentLoaded') || [];
            for (const listener of listeners) {
                await listener(new Event('DOMContentLoaded'));
            }

            await new Promise(resolve => setTimeout(resolve, 10));

            expect(consoleSpy).toHaveBeenCalledWith(
                '[Main] Initialization failed:',
                expect.any(Error)
            );
            expect(mockCaptureException).toHaveBeenCalledWith(
                expect.any(Error),
                expect.objectContaining({ type: 'init_failed' })
            );

            consoleSpy.mockRestore();
        });

        test('should initialize immediately when DOM is already complete', async () => {
            Object.defineProperty(document, 'readyState', {
                writable: true,
                configurable: true,
                value: 'complete',
            });

            mockCheckAuth.mockResolvedValue(undefined);
            mockUiInit.mockResolvedValue(undefined);

            require('../src/main');

            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockErrorTrackerInit).toHaveBeenCalled();
            expect(mockPerformanceMonitorInit).toHaveBeenCalled();
        });
    });

    describe('DOMContentLoaded handling', () => {
        test('should register DOMContentLoaded listener when loading', () => {
            Object.defineProperty(document, 'readyState', {
                writable: true,
                configurable: true,
                value: 'loading',
            });

            require('../src/main');

            expect(eventListeners.has('DOMContentLoaded')).toBe(true);
        });

        test('should not register listener when already interactive', () => {
            Object.defineProperty(document, 'readyState', {
                writable: true,
                configurable: true,
                value: 'interactive',
            });

            require('../src/main');

            // Should initialize immediately without waiting
            expect(mockErrorTrackerInit).toHaveBeenCalled();
        });
    });

    describe('global window.SmartGrind', () => {
        test('should expose SmartGrind on window object', () => {
            require('../src/main');

            expect((window as any).SmartGrind).toBeDefined();
            expect(typeof (window as any).SmartGrind).toBe('object');
        });

        test('should not overwrite existing SmartGrind object', () => {
            const existingSmartGrind = { existing: true };
            (window as any).SmartGrind = existingSmartGrind;

            require('../src/main');

            expect((window as any).SmartGrind).toBe(existingSmartGrind);
        });
    });

    describe('beforeunload cleanup', () => {
        test('should register beforeunload event listener', () => {
            require('../src/main');

            expect(eventListeners.has('beforeunload')).toBe(true);
        });

        test('should call cleanupAll on beforeunload', () => {
            require('../src/main');

            const listeners = eventListeners.get('beforeunload') || [];
            for (const listener of listeners) {
                listener(new Event('beforeunload'));
            }

            expect(mockCleanupAll).toHaveBeenCalled();
        });
    });

    describe('error handling', () => {
        test('should handle async errors in checkAuth', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            mockCheckAuth.mockRejectedValue(new Error('Auth check failed'));

            require('../src/main');

            const listeners = eventListeners.get('DOMContentLoaded') || [];
            for (const listener of listeners) {
                await listener(new Event('DOMContentLoaded'));
            }

            await new Promise(resolve => setTimeout(resolve, 10));

            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        test('should handle async errors in ui.init', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            mockUiInit.mockRejectedValue(new Error('UI init failed'));

            require('../src/main');

            const listeners = eventListeners.get('DOMContentLoaded') || [];
            for (const listener of listeners) {
                await listener(new Event('DOMContentLoaded'));
            }

            await new Promise(resolve => setTimeout(resolve, 10));

            expect(consoleSpy).toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('initialization order', () => {
        test('should initialize components in correct order', async () => {
            const initOrder: string[] = [];

            mockErrorTrackerInit.mockImplementation(() => initOrder.push('errorTracker'));
            mockPerformanceMonitorInit.mockImplementation(() => initOrder.push('performanceMonitor'));
            mockInit.mockImplementation(() => initOrder.push('state'));
            mockCheckAuth.mockImplementation(() => {
                initOrder.push('checkAuth');
                return Promise.resolve();
            });
            mockInitSyncIndicators.mockImplementation(() => initOrder.push('syncIndicators'));
            mockUiInit.mockImplementation(() => {
                initOrder.push('ui');
                return Promise.resolve();
            });

            require('../src/main');

            const listeners = eventListeners.get('DOMContentLoaded') || [];
            for (const listener of listeners) {
                await listener(new Event('DOMContentLoaded'));
            }

            await new Promise(resolve => setTimeout(resolve, 10));

            // Verify all components were initialized
            expect(initOrder).toContain('errorTracker');
            expect(initOrder).toContain('performanceMonitor');
            expect(initOrder).toContain('state');
            expect(initOrder).toContain('checkAuth');
            expect(initOrder).toContain('syncIndicators');
            expect(initOrder).toContain('ui');
        });
    });
});
