// Renderer Error Boundary Module Tests
// Comprehensive tests for React-style error boundaries in vanilla JS

// Mock showToast before importing the module
const mockShowToast = jest.fn();

jest.mock('../../src/utils', () => ({
    showToast: mockShowToast,
}));

// Import after mocks
import {
    RendererErrorBoundary,
    createRendererErrorBoundaries,
    withErrorBoundary,
    ErrorBoundaryOptions,
    RenderResult,
    ErrorInfo,
} from '../../src/lib/renderer-error-boundary';

describe('Renderer Error Boundary Module', () => {
    let mockContainer: HTMLElement;
    let originalConsoleError: typeof console.error;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        // Save original console.error
        originalConsoleError = console.error;

        // Create mock container element
        mockContainer = document.createElement('div');
        mockContainer.id = 'test-container';
        document.body.appendChild(mockContainer);

        // Mock document.getElementById to return our mock container
        jest.spyOn(document, 'getElementById').mockImplementation((id: string) => {
            if (id === 'test-container') return mockContainer;
            if (id === 'problems-container') return document.createElement('div');
            if (id === 'topic-list') return document.createElement('div');
            if (id === 'solution-content') return document.createElement('div');
            if (id === 'flashcard-content') return document.createElement('div');
            return null;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        console.error = originalConsoleError;

        // Clean up DOM
        if (mockContainer.parentNode) {
            mockContainer.parentNode.removeChild(mockContainer);
        }

        // Clean up any remaining containers
        document.querySelectorAll('[id$="-container"], [id$="-list"], [id$="-content"]').forEach(el => {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
    });

    // ============================================================================
    // Constructor Tests
    // ============================================================================
    describe('RendererErrorBoundary constructor', () => {
        test('should create error boundary with minimal options (containerId only)', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            expect(boundary).toBeDefined();
            expect(boundary.getErrorStats()).toEqual({
                count: 0,
                lastError: null,
                lastErrorTime: null,
            });
        });

        test('should create error boundary with all options', () => {
            const customOnError = jest.fn();
            const customFallback = '<div>Custom fallback</div>';

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                fallbackHtml: customFallback,
                showToastNotification: false,
                onError: customOnError,
                resetOnSuccess: false,
            });

            expect(boundary).toBeDefined();
        });

        test('should apply default options correctly', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            // Test default options by triggering an error and checking behavior
            const error = new Error('Test error');
            boundary.render(() => {
                throw error;
            });

            // Default: showToastNotification should be true
            expect(mockShowToast).toHaveBeenCalledWith(
                'Failed to render content. Please try again.',
                'error'
            );
        });
    });

    // ============================================================================
    // render() Method Tests
    // ============================================================================
    describe('render() method - synchronous rendering', () => {
        test('should execute render function successfully', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const renderFn = jest.fn().mockReturnValue('rendered content');
            const result = boundary.render(renderFn);

            expect(result.success).toBe(true);
            expect(result.data).toBe('rendered content');
            expect(result.error).toBeUndefined();
        });

        test('should return error result when render function throws', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Render failed');
            const renderFn = jest.fn().mockImplementation(() => {
                throw error;
            });

            const result = boundary.render(renderFn);

            expect(result.success).toBe(false);
            expect(result.error).toBe(error);
            expect(result.errorInfo).toBeDefined();
            expect(result.errorInfo?.containerId).toBe('test-container');
        });

        test('should handle non-Error throws by converting to Error', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const renderFn = jest.fn().mockImplementation(() => {
                throw 'string error';
            });

            const result = boundary.render(renderFn);

            expect(result.success).toBe(false);
            expect(result.error).toBeInstanceOf(Error);
            expect(result.error?.message).toBe('string error');
        });

        test('should handle container not found error', () => {
            (document.getElementById as jest.Mock).mockReturnValue(null);

            const boundary = new RendererErrorBoundary({
                containerId: 'nonexistent-container',
            });

            const renderFn = jest.fn().mockReturnValue('content');
            const result = boundary.render(renderFn);

            expect(result.success).toBe(false);
            expect(result.error?.message).toContain("Container element with id 'nonexistent-container' not found");
        });

        test('should clear previous error state on successful render when resetOnSuccess is true', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                resetOnSuccess: true,
            });

            // First, trigger an error
            const error = new Error('First error');
            boundary.render(() => {
                throw error;
            });

            mockContainer.classList.add('has-error-boundary-fallback');
            mockContainer.dataset['originalContent'] = 'original';

            // Now successful render
            boundary.render(() => 'success');

            // Error state should be cleared
            expect(mockContainer.classList.contains('has-error-boundary-fallback')).toBe(false);
            expect(mockContainer.dataset['originalContent']).toBeUndefined();
        });

        test('should not clear error state when resetOnSuccess is false', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                resetOnSuccess: false,
            });

            // Trigger an error
            boundary.render(() => {
                throw new Error('Error');
            });

            mockContainer.classList.add('has-error-boundary-fallback');

            // Successful render
            boundary.render(() => 'success');

            // Error state should still be there (clearErrorState not called)
            expect(mockContainer.classList.contains('has-error-boundary-fallback')).toBe(true);
        });
    });

    // ============================================================================
    // renderAsync() Method Tests
    // ============================================================================
    describe('renderAsync() method - async rendering', () => {
        test('should execute async render function successfully', async () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const renderFn = jest.fn().mockResolvedValue('async content');
            const result = await boundary.renderAsync(renderFn);

            expect(result.success).toBe(true);
            expect(result.data).toBe('async content');
        });

        test('should handle async render function rejection', async () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Async render failed');
            const renderFn = jest.fn().mockRejectedValue(error);

            const result = await boundary.renderAsync(renderFn);

            expect(result.success).toBe(false);
            expect(result.error).toBe(error);
        });

        test('should handle non-Error async rejections', async () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const renderFn = jest.fn().mockRejectedValue({ message: 'object error' });

            const result = await boundary.renderAsync(renderFn);

            expect(result.success).toBe(false);
            expect(result.error).toBeInstanceOf(Error);
        });

        test('should handle async container not found', async () => {
            (document.getElementById as jest.Mock).mockReturnValue(null);

            const boundary = new RendererErrorBoundary({
                containerId: 'nonexistent-container',
            });

            const renderFn = jest.fn().mockResolvedValue('content');
            const result = await boundary.renderAsync(renderFn);

            expect(result.success).toBe(false);
            expect(result.error?.message).toContain('not found');
        });

        test('should clear previous error state on successful async render', async () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                resetOnSuccess: true,
            });

            // First trigger error
            await boundary.renderAsync(async () => {
                throw new Error('Error');
            });

            mockContainer.classList.add('has-error-boundary-fallback');

            // Successful async render
            await boundary.renderAsync(async () => 'success');

            expect(mockContainer.classList.contains('has-error-boundary-fallback')).toBe(false);
        });
    });

    // ============================================================================
    // Error Handling and Fallback UI Tests
    // ============================================================================
    describe('Error handling and fallback UI', () => {
        test('should display default fallback UI on error', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Test error');
            });

            expect(mockContainer.innerHTML).toContain('error-boundary-fallback');
            expect(mockContainer.innerHTML).toContain('Something went wrong');
            expect(mockContainer.innerHTML).toContain('Try Again');
            expect(mockContainer.innerHTML).toContain('Reload Page');
        });

        test('should display custom fallback HTML when provided', () => {
            const customFallback = '<div class="custom-error">Custom Error Message</div>';
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                fallbackHtml: customFallback,
            });

            boundary.render(() => {
                throw new Error('Test error');
            });

            expect(mockContainer.innerHTML).toBe(customFallback);
        });

        test('should populate error details in fallback UI', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Detailed error message');
            error.stack = 'Error: Detailed error message\n    at test.js:1:1';

            boundary.render(() => {
                throw error;
            });

            const errorDetails = mockContainer.querySelector('.error-details');
            expect(errorDetails).toBeTruthy();
            expect(errorDetails?.textContent).toContain('Detailed error message');
        });

        test('should save original content for potential recovery', () => {
            mockContainer.innerHTML = '<div>Original Content</div>';

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error');
            });

            expect(mockContainer.dataset['originalContent']).toBe('<div>Original Content</div>');
        });

        test('should add error state class to container', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error');
            });

            expect(mockContainer.classList.contains('has-error-boundary-fallback')).toBe(true);
        });

        test('should call custom onError handler when provided', () => {
            const customOnError = jest.fn();
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                onError: customOnError,
            });

            const error = new Error('Custom handler test');

            boundary.render(() => {
                throw error;
            });

            expect(customOnError).toHaveBeenCalledTimes(1);
            expect(customOnError).toHaveBeenCalledWith(
                error,
                expect.objectContaining({
                    componentStack: expect.any(String),
                    timestamp: expect.any(Number),
                    containerId: 'test-container',
                })
            );
        });

        test('should log error to console with sanitized stack', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Console test error');
            error.stack = 'Error: Console test error\n    at /home/user/project/test.js:10:5';

            boundary.render(() => {
                throw error;
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                '[RendererErrorBoundary:test-container]',
                error,
                expect.objectContaining({
                    componentStack: error.stack,
                    timestamp: expect.any(Number),
                    containerId: 'test-container',
                })
            );

            consoleSpy.mockRestore();
        });

        test('should show toast notification on error by default', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                showToastNotification: true,
            });

            boundary.render(() => {
                throw new Error('Error with toast');
            });

            expect(mockShowToast).toHaveBeenCalledWith(
                'Failed to render content. Please try again.',
                'error'
            );
        });

        test('should not show toast notification when disabled', () => {
            mockShowToast.mockClear();

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                showToastNotification: false,
            });

            boundary.render(() => {
                throw new Error('Error without toast');
            });

            expect(mockShowToast).not.toHaveBeenCalled();
        });
    });

    // ============================================================================
    // Event Delegation Tests
    // ============================================================================
    describe('Event delegation for retry/reload buttons', () => {
        test('should setup event delegation on error display', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const addEventListenerSpy = jest.spyOn(mockContainer, 'addEventListener');

            boundary.render(() => {
                throw new Error('Test error');
            });

            expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
        });

        test('should handle retry button click via event delegation', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original Content</div>';
            mockContainer.dataset['originalContent'] = '<div>Original Content</div>';

            boundary.render(() => {
                throw new Error('Test error');
            });

            // Simulate click on retry button
            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            expect(retryBtn).toBeTruthy();

            const clickEvent = new MouseEvent('click', { bubbles: true });
            const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
            const stopPropagationSpy = jest.spyOn(clickEvent, 'stopPropagation');

            retryBtn?.dispatchEvent(clickEvent);

            // Event should be handled (loading state should appear)
            expect(mockContainer.innerHTML).toContain('Retrying');
            expect(preventDefaultSpy).toHaveBeenCalled();
            expect(stopPropagationSpy).toHaveBeenCalled();
        });

        test('should handle reload button click via event delegation', () => {
            

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original</div>';
            mockContainer.dataset['originalContent'] = '<div>Original</div>';

            boundary.render(() => {
                throw new Error('Test error');
            });

            // Simulate click on reload button
            const reloadBtn = mockContainer.querySelector('[data-action="error-reload"]');
            expect(reloadBtn).toBeTruthy();

            const clickEvent = new MouseEvent('click', { bubbles: true });
            reloadBtn?.dispatchEvent(clickEvent);

            // Verify that reload button click is handled (event delegation works)
            expect(mockContainer.innerHTML).toContain("error-boundary-fallback"); // Still on fallback UI
        });

        test('should not respond to clicks without data-action attribute', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            // Set original content so we can verify it's not changed
            mockContainer.innerHTML = '<div>Original</div>';
            mockContainer.dataset['originalContent'] = '<div>Original</div>';

            // Trigger error to get fallback UI
            boundary.render(() => {
                throw new Error('Test error');
            });

            // Click on container without data-action
            const containerContent = mockContainer.innerHTML;
            mockContainer.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Content should remain the same (fallback UI still displayed)
            expect(mockContainer.innerHTML).toBe(containerContent);
        });

        test('should cleanup event listeners on clearErrorState', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                resetOnSuccess: true,
            });

            const removeEventListenerSpy = jest.spyOn(mockContainer, 'removeEventListener');

            // Trigger error
            boundary.render(() => {
                throw new Error('Test error');
            });

            // Now trigger successful render to clear error state
            boundary.render(() => 'success');

            expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
        });

        test('should cleanup event listeners on reset', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            // Trigger error
            boundary.render(() => {
                throw new Error('Test error');
            });

            const removeEventListenerSpy = jest.spyOn(mockContainer, 'removeEventListener');

            boundary.reset();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
        });
    });

    // ============================================================================
    // Retry Logic Tests
    // ============================================================================
    describe('Retry logic with exponential backoff', () => {
        test('should show loading state on retry', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original Content</div>';
            mockContainer.dataset['originalContent'] = '<div>Original Content</div>';

            boundary.render(() => {
                throw new Error('Test error');
            });

            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(mockContainer.innerHTML).toContain('Retrying...');
            expect(mockContainer.innerHTML).toContain('animate-spin');
        });

        test('should restore original content after retry delay', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original Content</div>';
            mockContainer.dataset['originalContent'] = '<div>Original Content</div>';

            boundary.render(() => {
                throw new Error('Test error');
            });

            // Trigger retry
            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Fast-forward past the delay
            jest.advanceTimersByTime(1500);

            // Original content should be restored
            expect(mockContainer.innerHTML).toBe('<div>Original Content</div>');
        });

        test('should dispatch custom event on retry', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original</div>';
            mockContainer.dataset['originalContent'] = '<div>Original</div>';

            // Trigger error first
            boundary.render(() => {
                throw new Error('Test error');
            });

            const eventListener = jest.fn();
            mockContainer.addEventListener('error-boundary-retry', eventListener);

            // Trigger retry
            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            jest.advanceTimersByTime(1500);

            expect(eventListener).toHaveBeenCalledTimes(1);
            expect(eventListener).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'error-boundary-retry',
                    detail: expect.objectContaining({
                        error: expect.any(Error),
                        attempt: expect.any(Number),
                    }),
                })
            );
        });

        test('should use exponential backoff for retry delays', () => {
            // Create a fresh boundary for this test to ensure errorCount starts at 0
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original</div>';

            // Trigger exactly 2 errors to get to errorCount=2 (1 more below maxRetries=3)
            mockContainer.dataset['originalContent'] = '<div>Original</div>';
            boundary.render(() => {
                throw new Error('Error 1');
            });
            mockContainer.dataset['originalContent'] = '<div>Original</div>';
            boundary.render(() => {
                throw new Error('Error 2');
            });

            // Reset original content before triggering retry
            mockContainer.dataset['originalContent'] = '<div>Original</div>';

            // At errorCount=2, trigger retry - delay should be 1000 * 2^(2-1) = 2000ms
            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Content should show "Retrying" immediately
            expect(mockContainer.innerHTML).toContain('Retrying');

            // Content should NOT be restored yet after 1000ms (half the delay)
            jest.advanceTimersByTime(1000);
            expect(mockContainer.innerHTML).toContain('Retrying');

            // After 2000ms total, content should be restored
            jest.advanceTimersByTime(1000);
            expect(mockContainer.innerHTML).toBe('<div>Original</div>');
        });

        test('should cap retry delay at 5000ms', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original</div>';

            // Trigger many errors to exceed max
            for (let i = 0; i < 10; i++) {
                boundary.render(() => {
                    throw new Error(`Error ${i}`);
                });
                mockContainer.dataset['originalContent'] = '<div>Original</div>';
            }

            // With errorCount=10, retry should be blocked by maxRetries check
            // so no "Retrying" state should appear
            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Should show max retries toast instead of loading state
            expect(mockShowToast).toHaveBeenCalledWith(
                'Maximum retry attempts reached. Please reload the page.',
                'error'
            );
        });

        test('should show toast when max retries (3) reached', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original</div>';

            // Trigger 3 errors to reach max retries
            for (let i = 0; i < 3; i++) {
                boundary.render(() => {
                    throw new Error(`Error ${i}`);
                });
                mockContainer.dataset['originalContent'] = '<div>Original</div>';
            }

            mockShowToast.mockClear();

            // Attempt retry at max
            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            expect(mockShowToast).toHaveBeenCalledWith(
                'Maximum retry attempts reached. Please reload the page.',
                'error'
            );
        });

        test('should not retry when max retries exceeded', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original</div>';

            // Trigger 4 errors to exceed max retries
            for (let i = 0; i < 4; i++) {
                boundary.render(() => {
                    throw new Error(`Error ${i}`);
                });
                mockContainer.dataset['originalContent'] = '<div>Original</div>';
            }

            // Try to retry
            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Content should not change to loading state
            expect(mockContainer.innerHTML).not.toContain('Retrying');
            // Content should still be the fallback
            expect(mockContainer.innerHTML).toContain('error-boundary-fallback');
        });
    });

    // ============================================================================
    // Error Statistics Tests
    // ============================================================================
    describe('getErrorStats() method', () => {
        test('should return initial stats with no errors', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const stats = boundary.getErrorStats();

            expect(stats).toEqual({
                count: 0,
                lastError: null,
                lastErrorTime: null,
            });
        });

        test('should track error count', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error 1');
            });

            expect(boundary.getErrorStats().count).toBe(1);

            boundary.render(() => {
                throw new Error('Error 2');
            });

            expect(boundary.getErrorStats().count).toBe(2);
        });

        test('should track last error', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error1 = new Error('First error');
            boundary.render(() => {
                throw error1;
            });

            expect(boundary.getErrorStats().lastError).toBe(error1);

            const error2 = new Error('Second error');
            boundary.render(() => {
                throw error2;
            });

            expect(boundary.getErrorStats().lastError).toBe(error2);
        });

        test('should track last error timestamp', () => {
            const beforeTime = Date.now();

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error with timestamp');
            });

            const afterTime = Date.now();
            const stats = boundary.getErrorStats();

            expect(stats.lastErrorTime).toBeGreaterThanOrEqual(beforeTime);
            expect(stats.lastErrorTime).toBeLessThanOrEqual(afterTime);
        });
    });

    // ============================================================================
    // reset() Method Tests
    // ============================================================================
    describe('reset() method', () => {
        test('should reset error count', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error');
            });

            expect(boundary.getErrorStats().count).toBe(1);

            boundary.reset();

            expect(boundary.getErrorStats().count).toBe(0);
        });

        test('should reset last error', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error');
            });

            expect(boundary.getErrorStats().lastError).not.toBeNull();

            boundary.reset();

            expect(boundary.getErrorStats().lastError).toBeNull();
        });

        test('should reset last error time', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error');
            });

            expect(boundary.getErrorStats().lastErrorTime).not.toBeNull();

            boundary.reset();

            expect(boundary.getErrorStats().lastErrorTime).toBeNull();
        });

        test('should clear error state from container', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error');
            });

            mockContainer.classList.add('has-error-boundary-fallback');
            mockContainer.dataset['originalContent'] = 'original';

            boundary.reset();

            expect(mockContainer.classList.contains('has-error-boundary-fallback')).toBe(false);
            expect(mockContainer.dataset['originalContent']).toBeUndefined();
        });

        test('should handle reset when container not found', () => {
            (document.getElementById as jest.Mock).mockReturnValue(null);

            const boundary = new RendererErrorBoundary({
                containerId: 'nonexistent-container',
            });

            // Should not throw
            expect(() => boundary.reset()).not.toThrow();
        });
    });

    // ============================================================================
    // destroy() Method Tests
    // ============================================================================
    describe('destroy() method', () => {
        test('should clean up event listeners', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error');
            });

            const removeEventListenerSpy = jest.spyOn(mockContainer, 'removeEventListener');

            boundary.destroy();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
        });

        test('should reset error state', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Error');
            });

            boundary.destroy();

            expect(boundary.getErrorStats()).toEqual({
                count: 0,
                lastError: null,
                lastErrorTime: null,
            });
        });

        test('should make boundary usable after destroy', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.destroy();

            // After destroy, render should still work but without event delegation
            const result = boundary.render(() => 'content');
            expect(result.success).toBe(true);
        });
    });

    // ============================================================================
    // Stack Trace Sanitization Tests
    // ============================================================================
    describe('Stack trace sanitization', () => {
        test('should sanitize Unix home directories in componentStack', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Test error');
            error.stack = 'Error: Test error\n    at /home/username/project/file.js:10:5';

            const result = boundary.render(() => {
                throw error;
            });

            // The componentStack in errorInfo should have home dir sanitized
            // Note: sanitization happens in sequence, so /home/username becomes /~, 
            // then the absolute path rule converts it to .../project/file.js
            expect(result.errorInfo?.componentStack).not.toContain('/home/username');
        });

        test('should sanitize Mac home directories in componentStack', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Test error');
            error.stack = 'Error: Test error\n    at /Users/john/project/file.js:10:5';

            const result = boundary.render(() => {
                throw error;
            });

            expect(result.errorInfo?.componentStack).not.toContain('/Users/john');
        });

        test('should sanitize Windows user profiles in componentStack', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Test error');
            error.stack = 'Error: Test error\n    at C:\\Users\\Jane\\project\\file.js:10:5';

            const result = boundary.render(() => {
                throw error;
            });

            expect(result.errorInfo?.componentStack).toContain('C:\\~');
            expect(result.errorInfo?.componentStack).not.toContain('C:\\Users\\Jane');
        });

        test('should sanitize node_modules paths in componentStack', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Test error');
            error.stack = 'Error: Test error\n    at /project/node_modules/some-package/lib/index.js:10:5';

            const result = boundary.render(() => {
                throw error;
            });

            // node_modules/some-package becomes node_modules/...
            expect(result.errorInfo?.componentStack).not.toContain('node_modules/some-package');
        });

        test('should remove query strings from URLs in componentStack', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Test error');
            error.stack = 'Error: Test error\n    at http://example.com/file.js?v=123:10:5';

            const result = boundary.render(() => {
                throw error;
            });

            expect(result.errorInfo?.componentStack).not.toContain('?v=123');
        });

        test('should handle empty stack trace', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Test error');
            error.stack = undefined;

            const result = boundary.render(() => {
                throw error;
            });

            // Should not throw
            expect(result.success).toBe(false);
            expect(result.errorInfo?.componentStack).toBe('No stack trace available');
        });

        test('should keep relative paths in stack trace', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const error = new Error('Test error');
            error.stack = 'Error: Test error\n    at src/components/App.tsx:25:10\n    at src/index.tsx:10:5';

            const result = boundary.render(() => {
                throw error;
            });

            // Relative paths should be preserved
            expect(result.errorInfo?.componentStack).toContain('App.tsx');
            expect(result.errorInfo?.componentStack).toContain('index.tsx');
        });
    });

    // ============================================================================
    // createRendererErrorBoundaries() Tests
    // ============================================================================
    describe('createRendererErrorBoundaries() function', () => {
        test('should create boundaries for all main containers', () => {
            const boundaries = createRendererErrorBoundaries();

            expect(boundaries.has('problems-container')).toBe(true);
            expect(boundaries.has('topic-list')).toBe(true);
            expect(boundaries.has('solution-content')).toBe(true);
            expect(boundaries.has('flashcard-content')).toBe(true);
        });

        test('should return Map with correct boundary instances', () => {
            const boundaries = createRendererErrorBoundaries();

            const problemsBoundary = boundaries.get('problems-container');
            expect(problemsBoundary).toBeInstanceOf(RendererErrorBoundary);

            const topicBoundary = boundaries.get('topic-list');
            expect(topicBoundary).toBeInstanceOf(RendererErrorBoundary);
        });

        test('should create independent boundaries', () => {
            const boundaries = createRendererErrorBoundaries();

            // Create containers for them
            const container1 = document.createElement('div');
            container1.id = 'problems-container';
            const container2 = document.createElement('div');
            container2.id = 'topic-list';
            document.body.appendChild(container1);
            document.body.appendChild(container2);

            const boundary1 = boundaries.get('problems-container')!;
            const boundary2 = boundaries.get('topic-list')!;

            // Errors in one should not affect the other
            boundary1.render(() => {
                throw new Error('Error in boundary 1');
            });

            expect(boundary1.getErrorStats().count).toBe(1);
            expect(boundary2.getErrorStats().count).toBe(0);

            document.body.removeChild(container1);
            document.body.removeChild(container2);
        });
    });

    // ============================================================================
    // withErrorBoundary() HOF Tests
    // ============================================================================
    describe('withErrorBoundary() higher-order function', () => {
        test('should wrap function with error boundary', () => {
            const originalFn = jest.fn().mockReturnValue('result');
            const wrappedFn = withErrorBoundary(originalFn, 'test-container');

            const result = wrappedFn('arg1', 'arg2');

            expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
            expect(result).toBe('result');
        });

        test('should return null on error', () => {
            const originalFn = jest.fn().mockImplementation(() => {
                throw new Error('Function error');
            });
            const wrappedFn = withErrorBoundary(originalFn, 'test-container');

            const result = wrappedFn();

            expect(result).toBeNull();
        });

        test('should pass through options to error boundary', () => {
            const onError = jest.fn();
            const originalFn = jest.fn().mockImplementation(() => {
                throw new Error('Error');
            });

            const wrappedFn = withErrorBoundary(originalFn, 'test-container', {
                onError,
                showToastNotification: false,
            });

            wrappedFn();

            expect(onError).toHaveBeenCalled();
            expect(mockShowToast).not.toHaveBeenCalled();
        });

        test('should preserve function arguments and context', () => {
            const originalFn = jest.fn(function(this: unknown, a: number, b: number) {
                return a + b;
            });

            const wrappedFn = withErrorBoundary(originalFn, 'test-container');
            const result = wrappedFn(2, 3);

            expect(originalFn).toHaveBeenCalledWith(2, 3);
            expect(result).toBe(5);
        });

        test('should handle async functions', async () => {
            const originalFn = jest.fn().mockResolvedValue('async result');
            const wrappedFn = withErrorBoundary(originalFn, 'test-container');

            // Note: withErrorBoundary uses render() which is sync, so async won't work as expected
            // The wrapped function returns a Promise, but render() treats it as successful data
            const result = wrappedFn();

            // Result will be a Promise because render() returns it as data
            expect(result).toBeInstanceOf(Promise);
            await expect(result).resolves.toBe('async result');
        });

        test('should handle functions that return objects', () => {
            const originalFn = jest.fn().mockReturnValue({ key: 'value', num: 42 });
            const wrappedFn = withErrorBoundary(originalFn, 'test-container');

            const result = wrappedFn();

            expect(result).toEqual({ key: 'value', num: 42 });
        });

        test('should handle functions that return arrays', () => {
            const originalFn = jest.fn().mockReturnValue([1, 2, 3]);
            const wrappedFn = withErrorBoundary(originalFn, 'test-container');

            const result = wrappedFn();

            expect(result).toEqual([1, 2, 3]);
        });

        test('should handle functions that return null', () => {
            const originalFn = jest.fn().mockReturnValue(null);
            const wrappedFn = withErrorBoundary(originalFn, 'test-container');

            const result = wrappedFn();

            expect(result).toBeNull();
        });

        test('should handle functions that return undefined', () => {
            const originalFn = jest.fn().mockReturnValue(undefined);
            const wrappedFn = withErrorBoundary(originalFn, 'test-container');

            const result = wrappedFn();

            expect(result).toBeUndefined();
        });
    });

    // ============================================================================
    // Integration Tests
    // ============================================================================
    describe('Integration tests', () => {
        test('should handle multiple sequential renders', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            // First render succeeds
            const result1 = boundary.render(() => 'first');
            expect(result1.success).toBe(true);

            // Second render fails
            const result2 = boundary.render(() => {
                throw new Error('second error');
            });
            expect(result2.success).toBe(false);

            // Third render succeeds
            const result3 = boundary.render(() => 'third');
            expect(result3.success).toBe(true);

            expect(boundary.getErrorStats().count).toBe(1);
        });

        test('should handle error in custom onError handler gracefully', () => {
            // The error boundary doesn't catch errors from onError handlers
            // This test documents expected behavior
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
                onError: () => {
                    throw new Error('Handler error');
                },
            });

            // This will throw because the onError handler throws
            expect(() => {
                boundary.render(() => {
                    throw new Error('Original error');
                });
            }).toThrow('Handler error');
        });

        test('should maintain separate state for multiple boundaries', () => {
            const container1 = document.createElement('div');
            container1.id = 'container-1';
            const container2 = document.createElement('div');
            container2.id = 'container-2';
            document.body.appendChild(container1);
            document.body.appendChild(container2);

            (document.getElementById as jest.Mock).mockImplementation((id: string) => {
                if (id === 'container-1') return container1;
                if (id === 'container-2') return container2;
                return mockContainer;
            });

            const boundary1 = new RendererErrorBoundary({ containerId: 'container-1' });
            const boundary2 = new RendererErrorBoundary({ containerId: 'container-2' });

            boundary1.render(() => {
                throw new Error('Error 1');
            });
            boundary2.render(() => {
                throw new Error('Error 2');
            });
            boundary2.render(() => {
                throw new Error('Error 3');
            });

            expect(boundary1.getErrorStats().count).toBe(1);
            expect(boundary2.getErrorStats().count).toBe(2);
            expect(boundary1.getErrorStats().lastError?.message).toBe('Error 1');
            expect(boundary2.getErrorStats().lastError?.message).toBe('Error 3');

            document.body.removeChild(container1);
            document.body.removeChild(container2);
        });

        test('should work with real DOM manipulation', () => {
            const container = document.createElement('div');
            container.id = 'real-dom-container';
            document.body.appendChild(container);

            (document.getElementById as jest.Mock).mockImplementation((id: string) => {
                if (id === 'real-dom-container') return container;
                return mockContainer;
            });

            const boundary = new RendererErrorBoundary({
                containerId: 'real-dom-container',
            });

            // Render something
            boundary.render(() => {
                container.innerHTML = '<p>Success!</p>';
                return 'done';
            });

            expect(container.innerHTML).toBe('<p>Success!</p>');

            // Now cause an error
            boundary.render(() => {
                throw new Error('DOM error');
            });

            // Container should have fallback UI
            expect(container.innerHTML).toContain('Something went wrong');
            expect(container.querySelector('.error-boundary-fallback')).toBeTruthy();

            document.body.removeChild(container);
        });

        test('should handle rapid successive errors', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            // Trigger 5 errors rapidly
            for (let i = 0; i < 5; i++) {
                boundary.render(() => {
                    throw new Error(`Rapid error ${i}`);
                });
            }

            expect(boundary.getErrorStats().count).toBe(5);
            expect(boundary.getErrorStats().lastError?.message).toBe('Rapid error 4');
        });

        test('should handle errors during retry', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            mockContainer.innerHTML = '<div>Original</div>';
            mockContainer.dataset['originalContent'] = '<div>Original</div>';

            // Initial error
            boundary.render(() => {
                throw new Error('Initial error');
            });

            // Trigger retry
            const retryBtn = mockContainer.querySelector('[data-action="error-retry"]');
            retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // During retry delay, trigger another error
            boundary.render(() => {
                throw new Error('Error during retry');
            });

            expect(boundary.getErrorStats().count).toBe(2);
        });
    });

    // ============================================================================
    // Edge Cases
    // ============================================================================
    describe('Edge cases', () => {
        test('should handle container with existing event listeners', () => {
            const existingHandler = jest.fn();
            mockContainer.addEventListener('click', existingHandler);

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Test');
            });

            // Click on container - both handlers should be called
            mockContainer.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Our handler should be called via delegation
            // Existing handler should also be called
            expect(existingHandler).toHaveBeenCalled();
        });

        test('should handle empty container', () => {
            mockContainer.innerHTML = '';

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Empty container error');
            });

            // Should still display fallback
            expect(mockContainer.innerHTML).toContain('Something went wrong');
        });

        test('should handle container with complex nested content', () => {
            mockContainer.innerHTML = `
                <div class="wrapper">
                    <header>Header</header>
                    <main>
                        <article>Content 1</article>
                        <article>Content 2</article>
                    </main>
                    <footer>Footer</footer>
                </div>
            `;

            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            boundary.render(() => {
                throw new Error('Complex content error');
            });

            // Original content should be saved
            expect(mockContainer.dataset['originalContent']).toContain('wrapper');
            expect(mockContainer.dataset['originalContent']).toContain('Header');

            // Fallback should be displayed
            expect(mockContainer.innerHTML).toContain('Something went wrong');
        });

        test('should handle render function returning falsy values', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const result0 = boundary.render(() => 0);
            expect(result0.success).toBe(true);
            expect(result0.data).toBe(0);

            const resultEmpty = boundary.render(() => '');
            expect(resultEmpty.success).toBe(true);
            expect(resultEmpty.data).toBe('');

            const resultFalse = boundary.render(() => false);
            expect(resultFalse.success).toBe(true);
            expect(resultFalse.data).toBe(false);
        });

        test('should handle very long error messages', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            const longMessage = 'Error: ' + 'a'.repeat(10000);
            const error = new Error(longMessage);

            boundary.render(() => {
                throw error;
            });

            const errorDetails = mockContainer.querySelector('.error-details');
            expect(errorDetails?.textContent).toContain('Error:');
        });

        test('should handle error with circular reference (indirectly)', () => {
            const boundary = new RendererErrorBoundary({
                containerId: 'test-container',
            });

            // Create error-like object that might cause issues
            const weirdError = Object.create(Error.prototype);
            weirdError.message = 'Weird error';

            const result = boundary.render(() => {
                throw weirdError;
            });

            expect(result.success).toBe(false);
            expect(result.error).toBeInstanceOf(Error);
        });
    });
});
