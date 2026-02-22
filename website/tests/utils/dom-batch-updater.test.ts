/**
 * Tests for DOM Batch Updater
 * @module tests/utils/dom-batch-updater
 */

import { domBatchUpdater } from '../../src/utils/dom-batch-updater';

describe('DOMBatchUpdater', () => {
    beforeEach(() => {
        // Clear any pending updates
        domBatchUpdater.flushNow();
    });

    afterEach(() => {
        // Ensure all updates are flushed
        domBatchUpdater.flushNow();
    });

    describe('schedule', () => {
        it('should schedule a write update', (done) => {
            const updateFn = jest.fn();
            
            domBatchUpdater.schedule('test-write', updateFn, false);
            
            // Update should not be called immediately
            expect(updateFn).not.toHaveBeenCalled();
            
            // Wait for next animation frame
            requestAnimationFrame(() => {
                expect(updateFn).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should schedule a read update', (done) => {
            const updateFn = jest.fn();
            
            domBatchUpdater.schedule('test-read', updateFn, true);
            
            // Update should not be called immediately
            expect(updateFn).not.toHaveBeenCalled();
            
            // Wait for next animation frame
            requestAnimationFrame(() => {
                expect(updateFn).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should batch multiple updates', (done) => {
            const updateFn1 = jest.fn();
            const updateFn2 = jest.fn();
            const updateFn3 = jest.fn();
            
            domBatchUpdater.schedule('update-1', updateFn1);
            domBatchUpdater.schedule('update-2', updateFn2);
            domBatchUpdater.schedule('update-3', updateFn3);
            
            // None should be called immediately
            expect(updateFn1).not.toHaveBeenCalled();
            expect(updateFn2).not.toHaveBeenCalled();
            expect(updateFn3).not.toHaveBeenCalled();
            
            // Wait for next animation frame
            requestAnimationFrame(() => {
                expect(updateFn1).toHaveBeenCalledTimes(1);
                expect(updateFn2).toHaveBeenCalledTimes(1);
                expect(updateFn3).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should overwrite existing update with same id', (done) => {
            const updateFn1 = jest.fn();
            const updateFn2 = jest.fn();
            
            domBatchUpdater.schedule('same-id', updateFn1);
            domBatchUpdater.schedule('same-id', updateFn2);
            
            requestAnimationFrame(() => {
                expect(updateFn1).not.toHaveBeenCalled();
                expect(updateFn2).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should handle read and write updates separately', (done) => {
            const readFn = jest.fn();
            const writeFn = jest.fn();
            
            domBatchUpdater.schedule('test-read', readFn, true);
            domBatchUpdater.schedule('test-write', writeFn, false);
            
            requestAnimationFrame(() => {
                expect(readFn).toHaveBeenCalledTimes(1);
                expect(writeFn).toHaveBeenCalledTimes(1);
                done();
            });
        });
    });

    describe('cancel', () => {
        it('should cancel a scheduled write update', (done) => {
            const updateFn = jest.fn();
            
            domBatchUpdater.schedule('cancel-test', updateFn);
            domBatchUpdater.cancel('cancel-test');
            
            requestAnimationFrame(() => {
                expect(updateFn).not.toHaveBeenCalled();
                done();
            });
        });

        it('should cancel a scheduled read update', (done) => {
            const updateFn = jest.fn();
            
            domBatchUpdater.schedule('cancel-read-test', updateFn, true);
            domBatchUpdater.cancel('cancel-read-test');
            
            requestAnimationFrame(() => {
                expect(updateFn).not.toHaveBeenCalled();
                done();
            });
        });

        it('should handle canceling non-existent update', () => {
            // Should not throw
            expect(() => {
                domBatchUpdater.cancel('non-existent');
            }).not.toThrow();
        });
    });

    describe('flushNow', () => {
        it('should immediately execute all pending updates', () => {
            const updateFn1 = jest.fn();
            const updateFn2 = jest.fn();
            
            domBatchUpdater.schedule('flush-1', updateFn1);
            domBatchUpdater.schedule('flush-2', updateFn2);
            
            // Should not be called yet
            expect(updateFn1).not.toHaveBeenCalled();
            expect(updateFn2).not.toHaveBeenCalled();
            
            // Flush immediately
            domBatchUpdater.flushNow();
            
            // Should be called immediately
            expect(updateFn1).toHaveBeenCalledTimes(1);
            expect(updateFn2).toHaveBeenCalledTimes(1);
        });

        it('should cancel pending animation frame when flushing', (done) => {
            const updateFn = jest.fn();
            
            domBatchUpdater.schedule('flush-cancel', updateFn);
            domBatchUpdater.flushNow();
            
            // Wait for any pending animation frame
            requestAnimationFrame(() => {
                // Should only be called once (from flushNow, not from RAF)
                expect(updateFn).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should handle empty queue', () => {
            // Should not throw
            expect(() => {
                domBatchUpdater.flushNow();
            }).not.toThrow();
        });
    });

    describe('read/write ordering', () => {
        it('should execute reads before writes', () => {
            const executionOrder: string[] = [];
            
            domBatchUpdater.schedule('write-1', () => {
                executionOrder.push('write-1');
            }, false);
            
            domBatchUpdater.schedule('read-1', () => {
                executionOrder.push('read-1');
            }, true);
            
            domBatchUpdater.schedule('write-2', () => {
                executionOrder.push('write-2');
            }, false);
            
            domBatchUpdater.schedule('read-2', () => {
                executionOrder.push('read-2');
            }, true);
            
            domBatchUpdater.flushNow();
            
            // All reads should come before all writes
            expect(executionOrder.indexOf('read-1')).toBeLessThan(executionOrder.indexOf('write-1'));
            expect(executionOrder.indexOf('read-1')).toBeLessThan(executionOrder.indexOf('write-2'));
            expect(executionOrder.indexOf('read-2')).toBeLessThan(executionOrder.indexOf('write-1'));
            expect(executionOrder.indexOf('read-2')).toBeLessThan(executionOrder.indexOf('write-2'));
        });
    });

    describe('error handling', () => {
        it('should handle errors in read operations gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const errorFn = jest.fn().mockImplementation(() => {
                throw new Error('Read error');
            });
            const successFn = jest.fn();
            
            domBatchUpdater.schedule('error-read', errorFn, true);
            domBatchUpdater.schedule('success-read', successFn, true);
            
            domBatchUpdater.flushNow();
            
            expect(errorFn).toHaveBeenCalledTimes(1);
            expect(successFn).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith('[DOMBatchUpdater] Read error:', expect.any(Error));
            
            consoleSpy.mockRestore();
        });

        it('should handle errors in write operations gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const errorFn = jest.fn().mockImplementation(() => {
                throw new Error('Write error');
            });
            const successFn = jest.fn();
            
            domBatchUpdater.schedule('error-write', errorFn, false);
            domBatchUpdater.schedule('success-write', successFn, false);
            
            domBatchUpdater.flushNow();
            
            expect(errorFn).toHaveBeenCalledTimes(1);
            expect(successFn).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith('[DOMBatchUpdater] Write error:', expect.any(Error));
            
            consoleSpy.mockRestore();
        });

        it('should continue processing after error', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const errorFn = jest.fn().mockImplementation(() => {
                throw new Error('Error');
            });
            const successFn1 = jest.fn();
            const successFn2 = jest.fn();
            
            domBatchUpdater.schedule('success-1', successFn1);
            domBatchUpdater.schedule('error', errorFn);
            domBatchUpdater.schedule('success-2', successFn2);
            
            domBatchUpdater.flushNow();
            
            expect(successFn1).toHaveBeenCalledTimes(1);
            expect(errorFn).toHaveBeenCalledTimes(1);
            expect(successFn2).toHaveBeenCalledTimes(1);
            
            consoleSpy.mockRestore();
        });
    });

    describe('integration scenarios', () => {
        it('should handle rapid scheduling and flushing', () => {
            const updates: jest.Mock[] = [];
            
            // Schedule multiple updates rapidly
            for (let i = 0; i < 10; i++) {
                const fn = jest.fn();
                updates.push(fn);
                domBatchUpdater.schedule(`rapid-${i}`, fn);
            }
            
            domBatchUpdater.flushNow();
            
            // All should be called exactly once
            updates.forEach((fn) => {
                expect(fn).toHaveBeenCalledTimes(1);
            });
        });

        it('should handle schedule during flush', () => {
            const firstFn = jest.fn();
            const secondFn = jest.fn();
            
            domBatchUpdater.schedule('first', () => {
                firstFn();
                // Schedule another update during flush
                // Note: Updates scheduled during flush are currently cleared
                // This is a known limitation of the current implementation
                domBatchUpdater.schedule('second', secondFn);
            });
            
            domBatchUpdater.flushNow();
            
            // First should be called during flush
            expect(firstFn).toHaveBeenCalledTimes(1);
            
            // Second was scheduled during flush but gets cleared by updates.clear()
            // This is the current behavior - updates scheduled during flush are lost
            domBatchUpdater.flushNow();
            
            // Second is not called because it was cleared
            expect(secondFn).toHaveBeenCalledTimes(0);
        });

        it('should clear updates after flush', () => {
            const updateFn = jest.fn();
            
            domBatchUpdater.schedule('clear-test', updateFn);
            domBatchUpdater.flushNow();
            
            // Flush again - should not call the update again
            domBatchUpdater.flushNow();
            
            expect(updateFn).toHaveBeenCalledTimes(1);
        });
    });
});
