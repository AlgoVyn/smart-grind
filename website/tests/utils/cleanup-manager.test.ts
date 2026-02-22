/**
 * Tests for Cleanup Manager
 * @module tests/utils/cleanup-manager
 */

import { cleanupManager } from '../../src/utils/cleanup-manager';

describe('CleanupManager', () => {
    beforeEach(() => {
        // Clean up any existing contexts before each test
        cleanupManager.cleanupAll();
    });

    afterEach(() => {
        // Ensure all cleanups are executed after each test
        cleanupManager.cleanupAll();
    });

    describe('register', () => {
        it('should register a cleanup function for a context', () => {
            const cleanupFn = jest.fn();
            
            cleanupManager.register('test-context', cleanupFn);
            
            expect(cleanupManager.hasContext('test-context')).toBe(true);
            expect(cleanupManager.getCleanupCount('test-context')).toBe(1);
        });

        it('should register multiple cleanup functions for the same context', () => {
            const cleanupFn1 = jest.fn();
            const cleanupFn2 = jest.fn();
            
            cleanupManager.register('multi-context', cleanupFn1);
            cleanupManager.register('multi-context', cleanupFn2);
            
            expect(cleanupManager.getCleanupCount('multi-context')).toBe(2);
        });

        it('should register cleanup functions for different contexts', () => {
            const cleanupFn1 = jest.fn();
            const cleanupFn2 = jest.fn();
            
            cleanupManager.register('context-a', cleanupFn1);
            cleanupManager.register('context-b', cleanupFn2);
            
            expect(cleanupManager.hasContext('context-a')).toBe(true);
            expect(cleanupManager.hasContext('context-b')).toBe(true);
            expect(cleanupManager.getCleanupCount('context-a')).toBe(1);
            expect(cleanupManager.getCleanupCount('context-b')).toBe(1);
        });
    });

    describe('cleanup', () => {
        it('should execute all cleanup functions for a context', () => {
            const cleanupFn1 = jest.fn();
            const cleanupFn2 = jest.fn();
            
            cleanupManager.register('cleanup-test', cleanupFn1);
            cleanupManager.register('cleanup-test', cleanupFn2);
            
            cleanupManager.cleanup('cleanup-test');
            
            expect(cleanupFn1).toHaveBeenCalledTimes(1);
            expect(cleanupFn2).toHaveBeenCalledTimes(1);
        });

        it('should remove the context after cleanup', () => {
            const cleanupFn = jest.fn();
            
            cleanupManager.register('remove-test', cleanupFn);
            expect(cleanupManager.hasContext('remove-test')).toBe(true);
            
            cleanupManager.cleanup('remove-test');
            
            expect(cleanupManager.hasContext('remove-test')).toBe(false);
            expect(cleanupManager.getCleanupCount('remove-test')).toBe(0);
        });

        it('should handle non-existent contexts gracefully', () => {
            // Should not throw
            expect(() => {
                cleanupManager.cleanup('non-existent-context');
            }).not.toThrow();
        });

        it('should handle cleanup function errors gracefully', () => {
            const errorCleanupFn = jest.fn().mockImplementation(() => {
                throw new Error('Cleanup error');
            });
            const normalCleanupFn = jest.fn();
            
            cleanupManager.register('error-test', errorCleanupFn);
            cleanupManager.register('error-test', normalCleanupFn);
            
            // Should not throw even when cleanup function errors
            expect(() => {
                cleanupManager.cleanup('error-test');
            }).not.toThrow();
            
            // Both functions should have been called
            expect(errorCleanupFn).toHaveBeenCalledTimes(1);
            expect(normalCleanupFn).toHaveBeenCalledTimes(1);
        });

        it('should execute cleanup functions in order', () => {
            const callOrder: number[] = [];
            
            cleanupManager.register('order-test', () => callOrder.push(1));
            cleanupManager.register('order-test', () => callOrder.push(2));
            cleanupManager.register('order-test', () => callOrder.push(3));
            
            cleanupManager.cleanup('order-test');
            
            expect(callOrder).toEqual([1, 2, 3]);
        });
    });

    describe('cleanupAll', () => {
        it('should execute all cleanup functions across all contexts', () => {
            const cleanupFn1 = jest.fn();
            const cleanupFn2 = jest.fn();
            const cleanupFn3 = jest.fn();
            
            cleanupManager.register('context-1', cleanupFn1);
            cleanupManager.register('context-2', cleanupFn2);
            cleanupManager.register('context-2', cleanupFn3);
            
            cleanupManager.cleanupAll();
            
            expect(cleanupFn1).toHaveBeenCalledTimes(1);
            expect(cleanupFn2).toHaveBeenCalledTimes(1);
            expect(cleanupFn3).toHaveBeenCalledTimes(1);
        });

        it('should remove all contexts after cleanupAll', () => {
            cleanupManager.register('ctx-1', jest.fn());
            cleanupManager.register('ctx-2', jest.fn());
            cleanupManager.register('ctx-3', jest.fn());
            
            cleanupManager.cleanupAll();
            
            expect(cleanupManager.hasContext('ctx-1')).toBe(false);
            expect(cleanupManager.hasContext('ctx-2')).toBe(false);
            expect(cleanupManager.hasContext('ctx-3')).toBe(false);
        });

        it('should handle errors in multiple contexts gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            
            cleanupManager.register('err-ctx-1', () => {
                throw new Error('Error 1');
            });
            cleanupManager.register('err-ctx-2', () => {
                throw new Error('Error 2');
            });
            
            // Should not throw
            expect(() => {
                cleanupManager.cleanupAll();
            }).not.toThrow();
            
            // Both errors should have been logged (check for specific error messages)
            const errorCalls = consoleSpy.mock.calls.filter(
                (call) => 
                    call[0]?.includes?.('[CleanupManager]') || 
                    call[1]?.message?.includes?.('Error')
            );
            expect(errorCalls.length).toBeGreaterThanOrEqual(2);
            
            consoleSpy.mockRestore();
        });
    });

    describe('hasContext', () => {
        it('should return true for existing context', () => {
            cleanupManager.register('existing', jest.fn());
            expect(cleanupManager.hasContext('existing')).toBe(true);
        });

        it('should return false for non-existing context', () => {
            expect(cleanupManager.hasContext('non-existing')).toBe(false);
        });

        it('should return false after context is cleaned up', () => {
            cleanupManager.register('temp', jest.fn());
            expect(cleanupManager.hasContext('temp')).toBe(true);
            
            cleanupManager.cleanup('temp');
            expect(cleanupManager.hasContext('temp')).toBe(false);
        });
    });

    describe('getCleanupCount', () => {
        it('should return 0 for non-existing context', () => {
            expect(cleanupManager.getCleanupCount('non-existing')).toBe(0);
        });

        it('should return correct count for single cleanup', () => {
            cleanupManager.register('single', jest.fn());
            expect(cleanupManager.getCleanupCount('single')).toBe(1);
        });

        it('should return correct count for multiple cleanups', () => {
            cleanupManager.register('multiple', jest.fn());
            cleanupManager.register('multiple', jest.fn());
            cleanupManager.register('multiple', jest.fn());
            expect(cleanupManager.getCleanupCount('multiple')).toBe(3);
        });

        it('should return 0 after cleanup', () => {
            cleanupManager.register('cleared', jest.fn());
            cleanupManager.register('cleared', jest.fn());
            expect(cleanupManager.getCleanupCount('cleared')).toBe(2);
            
            cleanupManager.cleanup('cleared');
            expect(cleanupManager.getCleanupCount('cleared')).toBe(0);
        });
    });

    describe('integration scenarios', () => {
        it('should handle complex cleanup scenarios', () => {
            const resources: string[] = [];
            
            // Simulate resource allocation and cleanup
            cleanupManager.register('resources', () => {
                resources.push('resource-1-cleaned');
            });
            cleanupManager.register('resources', () => {
                resources.push('resource-2-cleaned');
            });
            cleanupManager.register('resources', () => {
                resources.push('resource-3-cleaned');
            });
            
            cleanupManager.cleanup('resources');
            
            expect(resources).toEqual([
                'resource-1-cleaned',
                'resource-2-cleaned',
                'resource-3-cleaned',
            ]);
        });

        it('should handle re-registration after cleanup', () => {
            const cleanupFn1 = jest.fn();
            const cleanupFn2 = jest.fn();
            
            cleanupManager.register('reusable', cleanupFn1);
            cleanupManager.cleanup('reusable');
            
            // Re-register after cleanup
            cleanupManager.register('reusable', cleanupFn2);
            expect(cleanupManager.hasContext('reusable')).toBe(true);
            expect(cleanupManager.getCleanupCount('reusable')).toBe(1);
            
            cleanupManager.cleanup('reusable');
            expect(cleanupFn2).toHaveBeenCalledTimes(1);
        });

        it('should handle beforeunload event', () => {
            // The beforeunload handler is registered in the module
            // We can verify it doesn't throw by simulating the event
            const event = new Event('beforeunload');
            
            expect(() => {
                window.dispatchEvent(event);
            }).not.toThrow();
        });
    });
});
