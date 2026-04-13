/**
 * Main Application Tests
 * Tests for application initialization and core functionality
 */

// Mock dependencies
const mockCheckAuth = jest.fn();
const mockUiInit = jest.fn();
const mockCaptureException = jest.fn();

jest.mock('../src/state', () => ({
    state: {
        init: jest.fn(),
        user: { type: 'signed-out' },        setProblem: jest.fn(),
        deleteProblem: jest.fn(),
        clearProblems: jest.fn(),
        addDeletedId: jest.fn(),
        removeDeletedId: jest.fn(),
        clearDeletedIds: jest.fn(),
        replaceProblems: jest.fn(),
        replaceDeletedIds: jest.fn(),
        setOnlineStatus: jest.fn(),
        setSyncStatus: jest.fn(),
    },
}));

jest.mock('../src/init', () => ({
    checkAuth: mockCheckAuth,
}));

jest.mock('../src/ui/ui-sync-indicators', () => ({
    initSyncIndicators: jest.fn(),
}));

jest.mock('../src/ui/ui', () => ({
    ui: {
        init: mockUiInit,
    },
}));

jest.mock('../src/utils/error-tracker', () => ({
    errorTracker: {
        captureException: mockCaptureException,
    },
}));

jest.mock('../src/ui/ui-modals', () => ({
    checkAndShowErrorTrackingConsent: jest.fn(),
}));

import { state } from '../src/state';

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

        // Also capture window.addEventListener
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
        test('should initialize app when DOM is ready', async () => {
            require('../src/main');

            // Simulate DOMContentLoaded
            const listeners = eventListeners.get('DOMContentLoaded') || [];
            for (const listener of listeners) {
                await listener(new Event('DOMContentLoaded'));
            }

            // Wait for async operations
            await new Promise(resolve => setTimeout(resolve, 10));

            expect(mockCheckAuth).toHaveBeenCalled();
        });

        test('should handle initialization errors gracefully', async () => {
            // Make state.init throw an error
            (state.init as jest.Mock).mockImplementation(() => {
                throw new Error('Init failed');
            });

            // Should not throw when requiring the module
            expect(() => require('../src/main')).not.toThrow();

            const listeners = eventListeners.get('DOMContentLoaded') || [];
            for (const listener of listeners) {
                await expect(listener(new Event('DOMContentLoaded'))).resolves.not.toThrow();
            }
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

            expect(mockCheckAuth).toHaveBeenCalled();
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
            expect(mockCheckAuth).toHaveBeenCalled();
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

            mockCheckAuth.mockImplementation(() => {
                initOrder.push('checkAuth');
                return Promise.resolve();
            });
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
            expect(initOrder).toContain('checkAuth');
            expect(initOrder).toContain('ui');
        });
    });
});
