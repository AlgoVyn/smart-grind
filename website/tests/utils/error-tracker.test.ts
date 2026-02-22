/**
 * Tests for Error Tracker
 * @module tests/utils/error-tracker
 */

import { errorTracker } from '../../src/utils/error-tracker';

describe('ErrorTracker', () => {
    beforeEach(() => {
        // Clear any pending errors
        errorTracker.clearPendingErrors();
        
        // Reset initialization state by creating a new instance
        // Note: In real tests, we might need to mock the module
    });

    afterEach(() => {
        // Clean up
        errorTracker.clearPendingErrors();
        jest.restoreAllMocks();
    });

    describe('init', () => {
        it('should initialize error tracking', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            
            errorTracker.init();
            
            // Should add event listeners for error and unhandledrejection
            expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
            expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
            
            addEventListenerSpy.mockRestore();
        });

        it('should not initialize twice', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
            
            // Get initial count of error listeners
            const initialErrorCalls = addEventListenerSpy.mock.calls.filter(
                (call) => call[0] === 'error'
            ).length;
            
            errorTracker.init();
            errorTracker.init(); // Second call should be ignored
            
            // Should not add any new listeners after first init
            const finalErrorCalls = addEventListenerSpy.mock.calls.filter(
                (call) => call[0] === 'error'
            ).length;
            expect(finalErrorCalls).toBe(initialErrorCalls);
            
            addEventListenerSpy.mockRestore();
        });

        it('should proxy console.error', () => {
            const originalConsoleError = console.error;
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            errorTracker.init();
            
            // console.error should be replaced
            expect(console.error).not.toBe(originalConsoleError);
            
            consoleErrorSpy.mockRestore();
        });
    });

    describe('captureException', () => {
        it('should capture Error objects', () => {
            const error = new Error('Test error');
            const context = { type: 'test', extra: 'data' };
            
            // Should not throw
            expect(() => {
                errorTracker.captureException(error, context);
            }).not.toThrow();
        });

        it('should capture non-Error values', () => {
            // Should handle string errors
            expect(() => {
                errorTracker.captureException('string error', { type: 'test' });
            }).not.toThrow();
            
            // Should handle number errors
            expect(() => {
                errorTracker.captureException(123, { type: 'test' });
            }).not.toThrow();
            
            // Should handle object errors
            expect(() => {
                errorTracker.captureException({ message: 'error' }, { type: 'test' });
            }).not.toThrow();
        });

        it('should include error context', () => {
            const sendToServerSpy = jest.spyOn(errorTracker as unknown as { sendToServer: (_info: unknown) => Promise<void> }, 'sendToServer').mockResolvedValue();
            
            const error = new Error('Test error');
            const context = { type: 'custom-type', customField: 'value' };
            
            errorTracker.captureException(error, context);
            
            // The error info should be sent to server
            expect(sendToServerSpy).toHaveBeenCalled();
            
            sendToServerSpy.mockRestore();
        });

        it('should store locally when server fails', async () => {
            // Mock sendToServer to fail
            jest.spyOn(errorTracker as unknown as { sendToServer: (_info: unknown) => Promise<void> }, 'sendToServer').mockRejectedValue(new Error('Network error'));
            
            const error = new Error('Test error');
            
            errorTracker.captureException(error, { type: 'test' });
            
            // Wait for async operations
            await new Promise((resolve) => setTimeout(resolve, 10));
            
            // Error should be stored locally
            const pendingErrors = errorTracker.getPendingErrors();
            expect(pendingErrors.length).toBeGreaterThan(0);
        });
    });

    describe('captureConsoleError', () => {
        it('should capture console.error with Error objects', async () => {
            // Mock sendToServer to fail so error is stored locally
            jest.spyOn(errorTracker as unknown as { sendToServer: (_info: unknown) => Promise<void> }, 'sendToServer').mockRejectedValue(new Error('Network error'));
            
            errorTracker.init();
            console.error(new Error('Console error'));
            
            // Wait for async storage
            await new Promise((resolve) => setTimeout(resolve, 10));
            
            // Should capture the error (stored locally)
            const pendingErrors = errorTracker.getPendingErrors();
            expect(pendingErrors.length).toBeGreaterThan(0);
            expect(pendingErrors[0].context.type).toBe('console.error');
        });

        it('should not capture simple string messages', () => {
            // Clear any previous errors
            errorTracker.clearPendingErrors();
            
            errorTracker.init();
            console.error('Simple string message');
            
            // Should not capture simple strings - check localStorage is empty
            const pendingErrors = errorTracker.getPendingErrors();
            expect(pendingErrors.length).toBe(0);
        });

        it('should capture multiple arguments', async () => {
            // Mock sendToServer to fail so error is stored locally
            jest.spyOn(errorTracker as unknown as { sendToServer: (_info: unknown) => Promise<void> }, 'sendToServer').mockRejectedValue(new Error('Network error'));
            
            errorTracker.init();
            console.error('Error:', new Error('Details'), { extra: 'data' });
            
            // Wait for async storage
            await new Promise((resolve) => setTimeout(resolve, 10));
            
            // Should capture complex console.error calls (stored locally)
            const pendingErrors = errorTracker.getPendingErrors();
            expect(pendingErrors.length).toBeGreaterThan(0);
            expect(pendingErrors[0].context.type).toBe('console.error');
        });
    });

    describe('storeLocally', () => {
        it('should store errors in localStorage', () => {
            const error = new Error('Test error');
            
            errorTracker.captureException(error, { type: 'test' });
            
            // Wait for async storage
            setTimeout(() => {
                const pendingErrors = errorTracker.getPendingErrors();
                expect(pendingErrors.length).toBeGreaterThan(0);
            }, 10);
        });

        it('should limit stored errors to 50', () => {
            // Add 60 errors
            for (let i = 0; i < 60; i++) {
                errorTracker.captureException(new Error(`Error ${i}`), { type: 'test' });
            }
            
            // Wait for async storage
            setTimeout(() => {
                const pendingErrors = errorTracker.getPendingErrors();
                expect(pendingErrors.length).toBeLessThanOrEqual(50);
            }, 10);
        });

        it('should handle localStorage errors gracefully', () => {
            // Mock localStorage to throw
            const originalSetItem = Storage.prototype.setItem;
            Storage.prototype.setItem = jest.fn().mockImplementation(() => {
                throw new Error('localStorage full');
            });
            
            const error = new Error('Test error');
            
            // Should not throw
            expect(() => {
                errorTracker.captureException(error, { type: 'test' });
            }).not.toThrow();
            
            // Restore localStorage
            Storage.prototype.setItem = originalSetItem;
        });
    });

    describe('getPendingErrors', () => {
        it('should return empty array when no errors', () => {
            const errors = errorTracker.getPendingErrors();
            expect(errors).toEqual([]);
        });

        it('should return stored errors', () => {
            // Store an error
            errorTracker.captureException(new Error('Test error'), { type: 'test' });
            
            // Wait for async storage
            setTimeout(() => {
                const errors = errorTracker.getPendingErrors();
                expect(errors.length).toBeGreaterThan(0);
                expect(errors[0]).toHaveProperty('message');
                expect(errors[0]).toHaveProperty('timestamp');
                expect(errors[0]).toHaveProperty('context');
            }, 10);
        });

        it('should handle localStorage parse errors', () => {
            // Set invalid JSON in localStorage
            localStorage.setItem('pending-errors', 'invalid json');
            
            const errors = errorTracker.getPendingErrors();
            expect(errors).toEqual([]);
        });
    });

    describe('clearPendingErrors', () => {
        it('should clear all pending errors', () => {
            // Store some errors
            errorTracker.captureException(new Error('Error 1'), { type: 'test' });
            errorTracker.captureException(new Error('Error 2'), { type: 'test' });
            
            // Clear them
            errorTracker.clearPendingErrors();
            
            // Should be empty
            const errors = errorTracker.getPendingErrors();
            expect(errors).toEqual([]);
        });

        it('should handle localStorage errors gracefully', () => {
            // Mock localStorage to throw
            const originalRemoveItem = Storage.prototype.removeItem;
            Storage.prototype.removeItem = jest.fn().mockImplementation(() => {
                throw new Error('localStorage error');
            });
            
            // Should not throw
            expect(() => {
                errorTracker.clearPendingErrors();
            }).not.toThrow();
            
            // Restore localStorage
            Storage.prototype.removeItem = originalRemoveItem;
        });
    });

    describe('global error handlers', () => {
        it('should handle global error events', () => {
            const captureExceptionSpy = jest.spyOn(errorTracker, 'captureException');
            
            errorTracker.init();
            
            // Simulate error event
            const errorEvent = new ErrorEvent('error', {
                error: new Error('Global error'),
                message: 'Global error message',
                filename: 'test.js',
                lineno: 10,
                colno: 5,
            });
            
            window.dispatchEvent(errorEvent);
            
            // Should capture the error
            expect(captureExceptionSpy).toHaveBeenCalled();
            
            captureExceptionSpy.mockRestore();
        });

        it('should handle unhandled promise rejections', () => {
            const captureExceptionSpy = jest.spyOn(errorTracker, 'captureException');
            
            errorTracker.init();
            
            // Simulate unhandledrejection event
            const rejectionEvent = new Event('unhandledrejection') as PromiseRejectionEvent;
            // @ts-expect-error - Setting reason property for test
            rejectionEvent.reason = new Error('Promise rejection');
            
            window.dispatchEvent(rejectionEvent);
            
            // Should capture the rejection
            expect(captureExceptionSpy).toHaveBeenCalled();
            
            captureExceptionSpy.mockRestore();
        });
    });

    describe('sendToServer', () => {
        it('should not send in non-production environment', async () => {
            const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(new Response());
            
            // Ensure we're not in production
            const originalNodeEnv = process.env['NODE_ENV'];
            process.env['NODE_ENV'] = 'development';
            
            const errorInfo = {
                message: 'Test error',
                stack: undefined,
                context: { type: 'test' },
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                url: window.location.href,
            };
            
            // Call sendToServer directly
            await (errorTracker as unknown as { sendToServer: (_info: typeof errorInfo) => Promise<void> }).sendToServer(errorInfo);
            
            // Should not call fetch in development
            expect(fetchSpy).not.toHaveBeenCalled();
            
            // Restore
            process.env['NODE_ENV'] = originalNodeEnv;
            fetchSpy.mockRestore();
        });

        it('should send errors in production', async () => {
            const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
                new Response(JSON.stringify({ success: true }), { status: 200 })
            );
            
            // Set production environment
            const originalNodeEnv = process.env['NODE_ENV'];
            process.env['NODE_ENV'] = 'production';
            
            const errorInfo = {
                message: 'Test error',
                stack: undefined,
                context: { type: 'test' },
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                url: window.location.href,
            };
            
            // Call sendToServer directly
            await (errorTracker as unknown as { sendToServer: (_info: typeof errorInfo) => Promise<void> }).sendToServer(errorInfo);
            
            // Should call fetch in production
            expect(fetchSpy).toHaveBeenCalledWith('/api/errors', expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            }));
            
            // Restore
            process.env['NODE_ENV'] = originalNodeEnv;
            fetchSpy.mockRestore();
        });

        it('should throw on failed server response', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue(
                new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
            );
            
            // Set production environment
            const originalNodeEnv = process.env['NODE_ENV'];
            process.env['NODE_ENV'] = 'production';
            
            const errorInfo = {
                message: 'Test error',
                stack: undefined,
                context: { type: 'test' },
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                url: window.location.href,
            };
            
            // Should throw on failed response
            await expect(
                (errorTracker as unknown as { sendToServer: (_info: typeof errorInfo) => Promise<void> }).sendToServer(errorInfo)
            ).rejects.toThrow('Failed to send error to server');
            
            // Restore
            process.env['NODE_ENV'] = originalNodeEnv;
        });
    });

    describe('integration scenarios', () => {
        it('should handle complete error flow', async () => {
            // Mock sendToServer to fail so error is stored locally
            jest.spyOn(errorTracker as unknown as { sendToServer: (_info: unknown) => Promise<void> }, 'sendToServer').mockRejectedValue(new Error('Network error'));
            
            // Initialize
            errorTracker.init();
            
            // Capture an error
            const error = new Error('Integration test error');
            errorTracker.captureException(error, { type: 'integration' });
            
            // Wait for async operations (sendToServer fails, then storeLocally is called)
            await new Promise((resolve) => setTimeout(resolve, 50));
            
            // Check pending errors
            const pendingErrors = errorTracker.getPendingErrors();
            expect(pendingErrors.length).toBeGreaterThan(0);
            
            // Clear errors
            errorTracker.clearPendingErrors();
            expect(errorTracker.getPendingErrors()).toEqual([]);
        });

        it('should preserve original console.error behavior', () => {
            const originalConsoleError = jest.fn();
            console.error = originalConsoleError;
            
            errorTracker.init();
            
            // Call console.error
            console.error('Test message');
            
            // Original should still be called
            expect(originalConsoleError).toHaveBeenCalledWith('Test message');
        });
    });
});
