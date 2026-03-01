/**
 * @jest-environment jsdom
 */

import {
    calculateRetryDelay,
    sleep,
    withRetry,
    createRetryWrapper,
    DEFAULT_RETRY_OPTIONS,
    type RetryOptions,
} from '../../src/utils/retry';

describe('Retry Utilities', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('DEFAULT_RETRY_OPTIONS', () => {
        it('should have correct default values', () => {
            expect(DEFAULT_RETRY_OPTIONS).toEqual({
                maxAttempts: 5,
                baseDelay: 1000,
                maxDelay: 60000,
                multiplier: 2,
            });
        });
    });

    describe('calculateRetryDelay', () => {
        it('should calculate exponential backoff for attempt 0', () => {
            const delay = calculateRetryDelay(0);
            // Base: 1000ms, with ±25% jitter
            expect(delay).toBeGreaterThanOrEqual(750);
            expect(delay).toBeLessThanOrEqual(1250);
        });

        it('should calculate exponential backoff for attempt 1', () => {
            const delay = calculateRetryDelay(1);
            // Base: 2000ms, with ±25% jitter
            expect(delay).toBeGreaterThanOrEqual(1500);
            expect(delay).toBeLessThanOrEqual(2500);
        });

        it('should calculate exponential backoff for attempt 2', () => {
            const delay = calculateRetryDelay(2);
            // Base: 4000ms, with ±25% jitter
            expect(delay).toBeGreaterThanOrEqual(3000);
            expect(delay).toBeLessThanOrEqual(5000);
        });

        it('should cap delay at maxDelay', () => {
            // With high attempt number, delay should be capped at maxDelay
            // Note: jitter can add up to 25%, so we check base calculation is capped
            const delay = calculateRetryDelay(10);
            // maxDelay + 25% jitter = 75000 max possible
            expect(delay).toBeLessThanOrEqual(75000);
            // But base calculation should be capped at maxDelay
            expect(delay).toBeLessThanOrEqual(60000 * 1.25);
        });

        it('should respect custom options', () => {
            const options: Partial<RetryOptions> = {
                baseDelay: 500,
                maxDelay: 5000,
                multiplier: 3,
            };
            const delay = calculateRetryDelay(2, options);
            // Base: 500 * 3^2 = 4500ms, with ±25% jitter
            // Max possible: 4500 * 1.25 = 5625, but capped at 5000 * 1.25 = 6250
            expect(delay).toBeGreaterThanOrEqual(3375);
            expect(delay).toBeLessThanOrEqual(6250); // maxDelay + 25% jitter
        });

        it('should add random jitter to prevent thundering herd', () => {
            // Run multiple times to ensure jitter is applied
            const delays: number[] = [];
            for (let i = 0; i < 10; i++) {
                delays.push(calculateRetryDelay(1));
            }
            // Not all delays should be exactly the same
            const uniqueDelays = new Set(delays);
            expect(uniqueDelays.size).toBeGreaterThan(1);
        });
    });

    describe('sleep', () => {
        it('should resolve after specified duration', async () => {
            const startTime = Date.now();
            await sleep(50);
            const elapsed = Date.now() - startTime;
            expect(elapsed).toBeGreaterThanOrEqual(45); // Allow small margin
        });

        it('should handle zero delay', async () => {
            await expect(sleep(0)).resolves.toBeUndefined();
        });
    });

    describe('withRetry', () => {
        it('should return result on first successful attempt', async () => {
            const fn = jest.fn().mockResolvedValue('success');
            
            const result = await withRetry(fn, { maxAttempts: 3, baseDelay: 10 });
            
            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(1);
        });

        it('should retry on failure and eventually succeed', async () => {
            const fn = jest.fn()
                .mockRejectedValueOnce(new Error('Attempt 1 failed'))
                .mockRejectedValueOnce(new Error('Attempt 2 failed'))
                .mockResolvedValue('success');
            
            const onRetry = jest.fn();
            const result = await withRetry(fn, { onRetry, maxAttempts: 3, baseDelay: 10 });
            
            expect(result).toBe('success');
            expect(fn).toHaveBeenCalledTimes(3);
            expect(onRetry).toHaveBeenCalledTimes(2);
        });

        it('should throw last error after all attempts exhausted', async () => {
            const error = new Error('Persistent failure');
            const fn = jest.fn().mockRejectedValue(error);
            
            await expect(withRetry(fn, { maxAttempts: 2, baseDelay: 10 })).rejects.toBe(error);
            expect(fn).toHaveBeenCalledTimes(2);
        });

        it('should not retry on final attempt', async () => {
            const fn = jest.fn().mockRejectedValue(new Error('Failure'));
            
            await expect(withRetry(fn, { maxAttempts: 2, baseDelay: 10 })).rejects.toThrow('Failure');
            expect(fn).toHaveBeenCalledTimes(2);
        });

        it('should call onRetry callback for each retry', async () => {
            const fn = jest.fn()
                .mockRejectedValueOnce(new Error('Error 1'))
                .mockRejectedValueOnce(new Error('Error 2'))
                .mockResolvedValue('success');
            
            const onRetry = jest.fn();
            
            await withRetry(fn, { onRetry, maxAttempts: 3, baseDelay: 10 });
            
            expect(onRetry).toHaveBeenCalledTimes(2);
            expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.any(Error), expect.any(Number));
            expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.any(Error), expect.any(Number));
        });

        it('should use custom retry options', async () => {
            const fn = jest.fn()
                .mockRejectedValueOnce(new Error('Error'))
                .mockResolvedValue('success');
            
            const options: Partial<RetryOptions> = {
                maxAttempts: 2,
                baseDelay: 10,
                maxDelay: 100,
            };
            
            await withRetry(fn, options);
            
            expect(fn).toHaveBeenCalledTimes(2);
        }, 10000);

        it('should handle different error types', async () => {
            const errors = [
                new TypeError('Type error'),
                new RangeError('Range error'),
                new Error('Generic error'),
            ];
            const fn = jest.fn()
                .mockRejectedValueOnce(errors[0])
                .mockRejectedValueOnce(errors[1])
                .mockRejectedValueOnce(errors[2]);
            
            await expect(withRetry(fn, { maxAttempts: 3, baseDelay: 10 })).rejects.toBe(errors[2]);
        }, 10000);

        it('should handle async errors', async () => {
            const fn = jest.fn().mockImplementation(async () => {
                await Promise.resolve();
                throw new Error('Async error');
            });
            
            await expect(withRetry(fn, { maxAttempts: 2, baseDelay: 10 })).rejects.toThrow('Async error');
        }, 10000);

        it('should handle non-Error rejections', async () => {
            const fn = jest.fn()
                .mockRejectedValueOnce('string error')
                .mockRejectedValueOnce(123)
                .mockRejectedValueOnce({ error: 'object' });
            
            await expect(withRetry(fn, { maxAttempts: 3, baseDelay: 10 })).rejects.toEqual({ error: 'object' });
        }, 10000);
    });

    describe('createRetryWrapper', () => {
        it('should create a wrapped function that retries on failure', async () => {
            const originalFn = jest.fn()
                .mockRejectedValueOnce(new Error('Failed'))
                .mockResolvedValue('success');
            
            const wrappedFn = createRetryWrapper(originalFn, { maxAttempts: 2, baseDelay: 10 });
            const result = await wrappedFn();
            
            expect(result).toBe('success');
            expect(originalFn).toHaveBeenCalledTimes(2);
        }, 10000);

        it('should pass arguments to the wrapped function', async () => {
            const originalFn = jest.fn().mockResolvedValue('success');
            
            const wrappedFn = createRetryWrapper(originalFn, { maxAttempts: 2, baseDelay: 10 });
            await wrappedFn('arg1', 123, { key: 'value' });
            
            expect(originalFn).toHaveBeenCalledWith('arg1', 123, { key: 'value' });
        });

        it('should preserve return type', async () => {
            const originalFn = jest.fn().mockResolvedValue({ id: 1, name: 'test' });
            
            const wrappedFn = createRetryWrapper(originalFn, { maxAttempts: 2, baseDelay: 10 });
            const result = await wrappedFn();
            
            expect(result).toEqual({ id: 1, name: 'test' });
        });

        it('should handle functions with multiple parameters', async () => {
            const originalFn = jest.fn((a: number, b: string, c: boolean) => 
                Promise.resolve(`${a}-${b}-${c}`)
            );
            
            const wrappedFn = createRetryWrapper(originalFn, { maxAttempts: 2, baseDelay: 10 });
            const result = await wrappedFn(42, 'test', true);
            
            expect(result).toBe('42-test-true');
        });

        it('should apply default options when none provided', async () => {
            const originalFn = jest.fn()
                .mockRejectedValue(new Error('Always fails'));
            
            const wrappedFn = createRetryWrapper(originalFn);
            
            await expect(wrappedFn()).rejects.toThrow('Always fails');
            // Note: This will take time with 5 default attempts, so we allow longer timeout
        }, 60000);

        it('should use custom options when provided', async () => {
            const originalFn = jest.fn()
                .mockRejectedValue(new Error('Always fails'));
            
            const wrappedFn = createRetryWrapper(originalFn, { maxAttempts: 2, baseDelay: 10 });
            
            await expect(wrappedFn()).rejects.toThrow('Always fails');
            expect(originalFn).toHaveBeenCalledTimes(2);
        }, 10000);
    });
});
