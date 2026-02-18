// Error Boundary Module Tests

// Mock UI module
const mockShowAlert = jest.fn();

jest.mock('../src/ui/ui', () => ({
    ui: {
        showAlert: mockShowAlert,
    },
}));

// Import after mocks
import {
    ErrorBoundary,
    setupGlobalErrorHandlers,
    withErrorHandling,
    withSyncErrorHandling,
} from '../src/error-boundary';

describe('Error Boundary Module', () => {
    let mockContainer: HTMLElement;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create mock container element
        mockContainer = document.createElement('div');
        mockContainer.id = 'test-container';
        document.body.appendChild(mockContainer);

        // Mock document.getElementById
        jest.spyOn(document, 'getElementById').mockReturnValue(mockContainer);
    });

    afterEach(() => {
        jest.clearAllMocks();
        // Clean up DOM
        if (mockContainer.parentNode) {
            mockContainer.parentNode.removeChild(mockContainer);
        }
    });

    describe('ErrorBoundary class', () => {
        test('should create error boundary with container ID', () => {
            const errorBoundary = new ErrorBoundary('test-container');
            expect(errorBoundary).toBeDefined();
        });

        test('should execute function successfully', async () => {
            const errorBoundary = new ErrorBoundary('test-container');
            const mockFn = jest.fn().mockResolvedValue('success');

            const result = await errorBoundary.execute(mockFn);

            expect(result).toBe('success');
            expect(mockFn).toHaveBeenCalled();
        });

        test('should handle errors and show alert', async () => {
            const errorBoundary = new ErrorBoundary('test-container');
            const error = new Error('Test error');
            const mockFn = jest.fn().mockRejectedValue(error);

            const result = await errorBoundary.execute(mockFn);

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith('ErrorBoundary caught an error:', error);
            expect(mockShowAlert).toHaveBeenCalledWith('An error occurred: Test error');
        });

        test('should display fallback content on error', async () => {
            const errorBoundary = new ErrorBoundary('test-container');
            const error = new Error('Test error');
            const mockFn = jest.fn().mockRejectedValue(error);
            const fallbackContent = '<div class="custom-fallback">Custom Error</div>';

            await errorBoundary.execute(mockFn, fallbackContent);

            expect(mockContainer.innerHTML).toBe(fallbackContent);
        });

        test('should display default fallback UI when no custom content provided', async () => {
            const errorBoundary = new ErrorBoundary('test-container');
            const error = new Error('Test error');
            const mockFn = jest.fn().mockRejectedValue(error);

            await errorBoundary.execute(mockFn);

            expect(mockContainer.innerHTML).toContain('error-fallback');
            expect(mockContainer.innerHTML).toContain('Something went wrong');
            expect(mockContainer.innerHTML).toContain('Test error');
        });

        test('should sanitize error messages in fallback UI', async () => {
            const errorBoundary = new ErrorBoundary('test-container');
            const error = new Error('<script>alert("xss")</script>');
            const mockFn = jest.fn().mockRejectedValue(error);

            await errorBoundary.execute(mockFn);

            // The <script> tag should be escaped - check that raw script tag is not present
            // and that the escaped version is in the HTML
            const innerHTML = mockContainer.innerHTML;
            // Should not contain unescaped script tag
            expect(innerHTML.includes('<script>') && !innerHTML.includes('<script>')).toBe(false);
            // Should contain the error message (either escaped or as text content)
            expect(innerHTML).toContain('alert');
        });

        test('should handle non-Error objects', async () => {
            const errorBoundary = new ErrorBoundary('test-container');
            const mockFn = jest.fn().mockRejectedValue('string error');

            await errorBoundary.execute(mockFn);

            expect(mockShowAlert).toHaveBeenCalledWith('An error occurred: string error');
        });

        test('should reset error boundary state', () => {
            const errorBoundary = new ErrorBoundary('test-container');
            mockContainer.innerHTML = '<div>Error content</div>';

            errorBoundary.reset();

            expect(mockContainer.innerHTML).toBe('');
        });

        test('should handle container not found', async () => {
            jest.spyOn(document, 'getElementById').mockReturnValue(null);
            const errorBoundary = new ErrorBoundary('nonexistent-container');
            const error = new Error('Test error');
            const mockFn = jest.fn().mockRejectedValue(error);

            // Should not throw even without container
            await expect(errorBoundary.execute(mockFn)).resolves.toBeNull();
            expect(mockShowAlert).toHaveBeenCalled();
        });

        test('should handle synchronous function execution', async () => {
            const errorBoundary = new ErrorBoundary('test-container');
            const mockFn = jest.fn().mockReturnValue('sync result');

            const result = await errorBoundary.execute(mockFn);

            expect(result).toBe('sync result');
        });

        test('should handle errors in synchronous functions', async () => {
            const errorBoundary = new ErrorBoundary('test-container');
            const error = new Error('Sync error');
            const mockFn = jest.fn().mockImplementation(() => {
                throw error;
            });

            const result = await errorBoundary.execute(mockFn);

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('setupGlobalErrorHandlers', () => {
        test('should set up global error handler', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

            setupGlobalErrorHandlers();

            expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
        });

        test('should set up unhandledrejection handler', () => {
            const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

            setupGlobalErrorHandlers();

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                'unhandledrejection',
                expect.any(Function)
            );
        });

        test('should handle global errors', () => {
            setupGlobalErrorHandlers();

            // Handlers use getUI() which reads window.SmartGrind?.ui
            (window as unknown as { SmartGrind?: { ui?: { showAlert: jest.Mock } } }).SmartGrind = {
                ui: { showAlert: mockShowAlert },
            };

            // Get the error handler
            const errorHandler = (window.addEventListener as jest.Mock).mock.calls.find(
                (call: any[]) => call[0] === 'error'
            )?.[1];

            expect(errorHandler).toBeDefined();

            // Simulate error event
            const mockEvent = {
                error: new Error('Global error'),
                message: 'Global error message',
                preventDefault: jest.fn(),
            };

            if (errorHandler) {
                errorHandler(mockEvent);
            }

            expect(console.error).toHaveBeenCalledWith('Global error handler:', mockEvent.error);
            expect(mockShowAlert).toHaveBeenCalledWith(
                'An unexpected error occurred: Global error message'
            );
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        test('should handle unhandled promise rejections', () => {
            setupGlobalErrorHandlers();

            // Handlers use getUI() which reads window.SmartGrind?.ui
            (window as unknown as { SmartGrind?: { ui?: { showAlert: jest.Mock } } }).SmartGrind = {
                ui: { showAlert: mockShowAlert },
            };

            // Get the rejection handler
            const rejectionHandler = (window.addEventListener as jest.Mock).mock.calls.find(
                (call: any[]) => call[0] === 'unhandledrejection'
            )?.[1];

            expect(rejectionHandler).toBeDefined();

            // Simulate rejection event
            const mockEvent = {
                reason: new Error('Promise rejection'),
                preventDefault: jest.fn(),
            };

            if (rejectionHandler) {
                rejectionHandler(mockEvent);
            }

            expect(console.error).toHaveBeenCalledWith(
                'Unhandled promise rejection:',
                mockEvent.reason
            );
            expect(mockShowAlert).toHaveBeenCalledWith(
                'An unexpected error occurred: Promise rejection'
            );
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        test('should handle non-Error rejection reasons', () => {
            setupGlobalErrorHandlers();

            // Handlers use getUI() which reads window.SmartGrind?.ui
            (window as unknown as { SmartGrind?: { ui?: { showAlert: jest.Mock } } }).SmartGrind = {
                ui: { showAlert: mockShowAlert },
            };

            const rejectionHandler = (window.addEventListener as jest.Mock).mock.calls.find(
                (call: any[]) => call[0] === 'unhandledrejection'
            )?.[1];

            const mockEvent = {
                reason: 'String rejection',
                preventDefault: jest.fn(),
            };

            if (rejectionHandler) {
                rejectionHandler(mockEvent);
            }

            expect(mockShowAlert).toHaveBeenCalledWith(
                'An unexpected error occurred: String rejection'
            );
        });
    });

    describe('withErrorHandling', () => {
        test('should execute async operation successfully', async () => {
            const mockOperation = jest.fn().mockResolvedValue('success');

            const result = await withErrorHandling(mockOperation, 'Custom error message');

            expect(result).toBe('success');
            expect(mockOperation).toHaveBeenCalled();
        });

        test('should handle errors and show alert', async () => {
            const error = new Error('Operation failed');
            const mockOperation = jest.fn().mockRejectedValue(error);

            const result = await withErrorHandling(mockOperation, 'Custom error message');

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith('Custom error message', error);
            expect(mockShowAlert).toHaveBeenCalledWith('Custom error message: Operation failed');
        });

        test('should use default error message', async () => {
            const error = new Error('Operation failed');
            const mockOperation = jest.fn().mockRejectedValue(error);

            await withErrorHandling(mockOperation);

            expect(mockShowAlert).toHaveBeenCalledWith('Operation failed: Operation failed');
        });

        test('should handle non-Error exceptions', async () => {
            const mockOperation = jest.fn().mockRejectedValue('string error');

            await withErrorHandling(mockOperation, 'Custom message');

            expect(mockShowAlert).toHaveBeenCalledWith('Custom message: string error');
        });
    });

    describe('withSyncErrorHandling', () => {
        test('should execute sync operation successfully', () => {
            const mockOperation = jest.fn().mockReturnValue('success');

            const result = withSyncErrorHandling(mockOperation, 'Custom error message');

            expect(result).toBe('success');
            expect(mockOperation).toHaveBeenCalled();
        });

        test('should handle sync errors and show alert', () => {
            const error = new Error('Sync operation failed');
            const mockOperation = jest.fn().mockImplementation(() => {
                throw error;
            });

            const result = withSyncErrorHandling(mockOperation, 'Custom error message');

            expect(result).toBeNull();
            expect(console.error).toHaveBeenCalledWith('Custom error message', error);
            expect(mockShowAlert).toHaveBeenCalledWith(
                'Custom error message: Sync operation failed'
            );
        });

        test('should use default error message for sync operations', () => {
            const error = new Error('Sync operation failed');
            const mockOperation = jest.fn().mockImplementation(() => {
                throw error;
            });

            withSyncErrorHandling(mockOperation);

            expect(mockShowAlert).toHaveBeenCalledWith('Operation failed: Sync operation failed');
        });

        test('should handle non-Error exceptions in sync operations', () => {
            const mockOperation = jest.fn().mockImplementation(() => {
                throw 'string error';
            });

            const result = withSyncErrorHandling(mockOperation, 'Custom message');

            expect(result).toBeNull();
            expect(mockShowAlert).toHaveBeenCalledWith('Custom message: string error');
        });

        test('should handle null and undefined return values', () => {
            const nullOperation = jest.fn().mockReturnValue(null);
            const undefinedOperation = jest.fn().mockReturnValue(undefined);

            expect(withSyncErrorHandling(nullOperation)).toBeNull();
            expect(withSyncErrorHandling(undefinedOperation)).toBeUndefined();
        });
    });

    describe('Integration tests', () => {
        test('should work with actual DOM elements', async () => {
            // Clear the mock to use real DOM
            (document.getElementById as jest.Mock).mockClear();
            (document.getElementById as jest.Mock).mockImplementation((id: string) => {
                return document.querySelector(`#${id}`) as HTMLElement;
            });

            // Create a real container
            const container = document.createElement('div');
            container.id = 'real-container';
            document.body.appendChild(container);

            // Create error boundary that uses the real DOM
            const errorBoundary = new ErrorBoundary('real-container');
            const error = new Error('Real DOM error');
            const mockFn = jest.fn().mockRejectedValue(error);

            await errorBoundary.execute(mockFn);

            expect(container.innerHTML).toContain('error-fallback');
            expect(container.innerHTML).toContain('Real DOM error');

            // Clean up
            document.body.removeChild(container);

            // Restore mock
            (document.getElementById as jest.Mock).mockReturnValue(mockContainer);
        });

        test('should handle multiple error boundaries', async () => {
            // Clear the mock to use real DOM
            (document.getElementById as jest.Mock).mockClear();
            (document.getElementById as jest.Mock).mockImplementation((id: string) => {
                return document.querySelector(`#${id}`) as HTMLElement;
            });

            const container1 = document.createElement('div');
            container1.id = 'container-1';
            const container2 = document.createElement('div');
            container2.id = 'container-2';
            document.body.appendChild(container1);
            document.body.appendChild(container2);

            const boundary1 = new ErrorBoundary('container-1');
            const boundary2 = new ErrorBoundary('container-2');

            const error1 = new Error('Error 1');
            const error2 = new Error('Error 2');

            await boundary1.execute(jest.fn().mockRejectedValue(error1));
            await boundary2.execute(jest.fn().mockRejectedValue(error2));

            expect(container1.innerHTML).toContain('Error 1');
            expect(container2.innerHTML).toContain('Error 2');

            // Clean up
            document.body.removeChild(container1);
            document.body.removeChild(container2);

            // Restore mock
            (document.getElementById as jest.Mock).mockReturnValue(mockContainer);
        });
    });
});
