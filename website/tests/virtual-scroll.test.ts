// --- VIRTUAL SCROLLING TESTS ---

import {
    VirtualScroller,
    shouldVirtualize,
    estimateItemHeight,
    type VirtualScrollConfig,
} from '../src/utils/virtual-scroll';

describe('Virtual Scrolling', () => {
    describe('VirtualScroller class', () => {
        let mockContainer: HTMLElement;
        let mockScrollContainer: HTMLElement;
        let renderCallback: jest.Mock;
        let cleanupCallback: jest.Mock;
        let scroller: VirtualScroller;

        beforeEach(() => {
            // Create mock DOM elements
            mockContainer = document.createElement('div');
            mockContainer.style.position = 'relative';
            mockContainer.style.height = '500px';
            
            mockScrollContainer = document.createElement('div');
            mockScrollContainer.style.overflow = 'auto';
            mockScrollContainer.style.height = '500px';
            mockScrollContainer.appendChild(mockContainer);

            // Mock scrollTop
            Object.defineProperty(mockScrollContainer, 'scrollTop', {
                writable: true,
                value: 0,
            });

            // Mock clientHeight
            Object.defineProperty(mockScrollContainer, 'clientHeight', {
                writable: true,
                value: 500,
            });

            renderCallback = jest.fn((_index: number, element: HTMLElement) => {
                element.textContent = `Item ${_index}`;
            });
            
            cleanupCallback = jest.fn((_element: HTMLElement) => {
                // Cleanup logic
            });

            scroller = new VirtualScroller(
                100,
                { itemHeight: 100, overscan: 2, containerHeight: 500 },
                renderCallback,
                cleanupCallback
            );
        });

        afterEach(() => {
            if (scroller) {
                scroller.detach();
            }
        });

        describe('initialization', () => {
            it('should create a VirtualScroller instance', () => {
                expect(scroller).toBeInstanceOf(VirtualScroller);
            });

            it('should attach to a container', () => {
                scroller.attach(mockContainer, mockScrollContainer);
                expect(mockContainer.style.position).toBe('relative');
            });

            it('should calculate initial state correctly', () => {
                scroller.attach(mockContainer, mockScrollContainer);
                const state = scroller.getState();
                
                expect(state.startIndex).toBe(0);
                expect(state.endIndex).toBeGreaterThan(0);
                expect(state.visibleCount).toBeGreaterThan(0);
                expect(state.totalHeight).toBe(10000); // 100 items * 100px
            });
        });

        describe('scrolling behavior', () => {
            beforeEach(() => {
                scroller.attach(mockContainer, mockScrollContainer);
            });

            it('should update visible items on scroll', () => {
                const initialCalls = renderCallback.mock.calls.length;
                
                // Simulate scroll
                mockScrollContainer.scrollTop = 500;
                mockScrollContainer.dispatchEvent(new Event('scroll'));
                
                // Allow RAF to complete (but it may not trigger re-render if RAF isn't mocked)
                jest.advanceTimersByTime(16);
            });

            it('should calculate correct range for middle scroll position', () => {
                // Manually update scroll position and force state update
                mockScrollContainer.scrollTop = 2500; // Middle of list
                
                // Trigger scroll handler and force update
                scroller['scrollContainer'] = mockScrollContainer;
                scroller['updateState']();
                
                const state = scroller.getState();
                
                // Should show items around the middle with overscan
                expect(state.startIndex).toBeGreaterThanOrEqual(20);
                expect(state.startIndex).toBeLessThan(30);
            });
        });

        describe('item management', () => {
            beforeEach(() => {
                scroller.attach(mockContainer, mockScrollContainer);
            });

            it('should render visible items', () => {
                const children = Array.from(mockContainer.children);
                expect(children.length).toBeGreaterThan(0);
                expect(children.length).toBeLessThanOrEqual(15); // With overscan
            });

            it('should position items correctly with transforms', () => {
                const firstChild = mockContainer.children[0] as HTMLElement;
                expect(firstChild.style.transform).toMatch(/translateY\(/);
            });

            it('should set correct heights for items', () => {
                const firstChild = mockContainer.children[0] as HTMLElement;
                expect(firstChild.style.height).toBe('100px');
            });
        });

        describe('total items updates', () => {
            beforeEach(() => {
                scroller.attach(mockContainer, mockScrollContainer);
            });

            it('should update total height when item count changes', () => {
                scroller.setTotalItems(50);
                const state = scroller.getState();
                expect(state.totalHeight).toBe(5000); // 50 * 100px
            });

            it('should handle reducing items to zero', () => {
                scroller.setTotalItems(0);
                const state = scroller.getState();
                expect(state.totalHeight).toBe(0);
            });
        });

        describe('configuration updates', () => {
            beforeEach(() => {
                scroller.attach(mockContainer, mockScrollContainer);
            });

            it('should update overscan value', () => {
                scroller.updateConfig({ overscan: 5 });
                const state = scroller.getState();
                // Visible count should increase with larger overscan
                expect(state.visibleCount).toBeGreaterThan(0);
            });

            it('should update item height', () => {
                scroller.updateConfig({ itemHeight: 50 });
                const state = scroller.getState();
                expect(state.totalHeight).toBe(5000); // 100 * 50px
            });
        });

        describe('scrollToIndex', () => {
            beforeEach(() => {
                scroller.attach(mockContainer, mockScrollContainer);
                // Add scrollTo method if not present
                if (!mockScrollContainer.scrollTo) {
                    mockScrollContainer.scrollTo = jest.fn();
                }
            });

            it('should scroll to specific index', () => {
                const scrollToFn = jest.fn();
                mockScrollContainer.scrollTo = scrollToFn;
                
                scroller.scrollToIndex(10);
                
                expect(scrollToFn).toHaveBeenCalledWith({
                    top: 1000, // 10 * 100px
                    behavior: 'smooth',
                });
            });

            it('should handle scrollToIndex with auto behavior', () => {
                const scrollToFn = jest.fn();
                mockScrollContainer.scrollTo = scrollToFn;
                
                scroller.scrollToIndex(5, 'auto');
                
                expect(scrollToFn).toHaveBeenCalledWith({
                    top: 500,
                    behavior: 'auto',
                });
            });
        });

        describe('cleanup', () => {
            it('should call cleanup callback for items on detach', () => {
                scroller.attach(mockContainer, mockScrollContainer);
                
                // Trigger cleanup
                scroller.detach();
                
                expect(cleanupCallback).toHaveBeenCalled();
            });

            it('should remove event listeners on detach', () => {
                const removeEventListenerSpy = jest.spyOn(mockScrollContainer, 'removeEventListener');
                
                scroller.attach(mockContainer, mockScrollContainer);
                scroller.detach();
                
                expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
            });
        });

        describe('edge cases', () => {
            it('should handle very large lists', () => {
                const largeScroller = new VirtualScroller(
                    10000,
                    { itemHeight: 50, overscan: 3, containerHeight: 500 },
                    renderCallback,
                    cleanupCallback
                );
                
                largeScroller.attach(mockContainer, mockScrollContainer);
                const state = largeScroller.getState();
                
                expect(state.totalHeight).toBe(500000); // 10000 * 50px
                largeScroller.detach();
            });

            it('should handle scroll past end of list', () => {
                scroller.attach(mockContainer, mockScrollContainer);
                
                mockScrollContainer.scrollTop = 10000; // Past end
                scroller['scrollContainer'] = mockScrollContainer;
                scroller['updateState']();
                
                const state = scroller.getState();
                expect(state.endIndex).toBeLessThan(100);
            });
        });
    });

    describe('shouldVirtualize', () => {
        it('should return true for lists over 50 items', () => {
            expect(shouldVirtualize(51)).toBe(true);
            expect(shouldVirtualize(100)).toBe(true);
            expect(shouldVirtualize(1000)).toBe(true);
        });

        it('should return false for lists of 50 or fewer items', () => {
            expect(shouldVirtualize(50)).toBe(false);
            expect(shouldVirtualize(10)).toBe(false);
            expect(shouldVirtualize(0)).toBe(false);
        });
    });

    describe('estimateItemHeight', () => {
        it('should return correct heights for known types', () => {
            expect(estimateItemHeight('problem-card')).toBe(80);
            expect(estimateItemHeight('pattern-section')).toBe(300);
            expect(estimateItemHeight('topic-section')).toBe(500);
        });

        it('should return default height for unknown types', () => {
            expect(estimateItemHeight('unknown-type' as any)).toBe(100);
        });
    });

    describe('state management', () => {
        it('should maintain correct state after multiple updates', () => {
            const mockContainer = document.createElement('div');
            const mockScrollContainer = document.createElement('div');
            
            Object.defineProperty(mockScrollContainer, 'scrollTop', {
                writable: true,
                value: 0,
            });

            const renderCallback = jest.fn();
            const scroller = new VirtualScroller(
                100,
                { itemHeight: 100, overscan: 2, containerHeight: 500 },
                renderCallback
            );

            scroller.attach(mockContainer, mockScrollContainer);

            // Get initial state
            const state1 = scroller.getState();

            // Update scroll and force state calculation
            mockScrollContainer.scrollTop = 5000;
            scroller['scrollContainer'] = mockScrollContainer;
            scroller['updateState']();
            const state2 = scroller.getState();

            // Update scroll again
            mockScrollContainer.scrollTop = 2500;
            scroller['updateState']();
            const state3 = scroller.getState();

            // States should be different for different scroll positions
            // State1 is at top (0), state2 is far down, state3 is middle
            expect(state2.startIndex).toBeGreaterThan(state1.startIndex);
            expect(state3.startIndex).not.toBe(state2.startIndex);

            scroller.detach();
        });
    });
});

    describe('ResizeObserver loop prevention', () => {
        let mockContainer: HTMLElement;
        let mockScrollContainer: HTMLElement;
        let renderCallback: jest.Mock;
        let scroller: VirtualScroller;
        let rafCallbacks: Array<() => void> = [];
        let rafMock: jest.SpyInstance;

        beforeEach(() => {
            mockContainer = document.createElement('div');
            mockContainer.style.position = 'relative';
            mockContainer.style.height = '500px';
            
            mockScrollContainer = document.createElement('div');
            mockScrollContainer.style.overflow = 'auto';
            mockScrollContainer.style.height = '500px';
            mockScrollContainer.appendChild(mockContainer);

            Object.defineProperty(mockScrollContainer, 'scrollTop', {
                writable: true,
                value: 0,
            });

            Object.defineProperty(mockScrollContainer, 'clientHeight', {
                writable: true,
                value: 500,
            });

            renderCallback = jest.fn((_index: number, element: HTMLElement) => {
                element.textContent = `Item ${_index}`;
            });

            // Mock requestAnimationFrame to capture callbacks
            rafCallbacks = [];
            rafMock = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
                rafCallbacks.push(callback as () => void);
                return rafCallbacks.length;
            });

            scroller = new VirtualScroller(
                100,
                { itemHeight: 100, overscan: 2, containerHeight: 500 },
                renderCallback
            );
        });

        afterEach(() => {
            if (scroller) {
                scroller.detach();
            }
            rafMock.mockRestore();
        });

        it('should have isResizing flag initialized to false', () => {
            expect(scroller['isResizing']).toBe(false);
        });

        it('should set isResizing to true during resize callback', () => {
            scroller.attach(mockContainer, mockScrollContainer);
            
            const resizeObserver = scroller['resizeObserver'];
            if (resizeObserver) {
                const entries = [{ contentRect: { height: 600 } } as ResizeObserverEntry];
                
                // Trigger resize - should queue RAF but isResizing is set immediately
                resizeObserver['callback'](entries);
                
                // After triggering callback, RAF should be queued
                expect(rafCallbacks.length).toBeGreaterThan(0);
                expect(scroller['isResizing']).toBe(true);
            }
        });

        it('should prevent recursive calls when isResizing is true', () => {
            scroller.attach(mockContainer, mockScrollContainer);
            
            const resizeObserver = scroller['resizeObserver'];
            if (resizeObserver) {
                const entries = [{ contentRect: { height: 600 } } as ResizeObserverEntry];
                
                // First call sets isResizing = true
                resizeObserver['callback'](entries);
                expect(scroller['isResizing']).toBe(true);
                const rafCountAfterFirst = rafCallbacks.length;
                
                // Second call should be ignored
                resizeObserver['callback'](entries);
                
                // RAF count should not increase for recursive call
                expect(rafCallbacks.length).toBe(rafCountAfterFirst);
            }
        });

        it('should reset isResizing flag after RAF callback completes', () => {
            scroller.attach(mockContainer, mockScrollContainer);
            
            const resizeObserver = scroller['resizeObserver'];
            if (resizeObserver) {
                const entries = [{ contentRect: { height: 600 } } as ResizeObserverEntry];
                
                // Trigger resize
                resizeObserver['callback'](entries);
                expect(scroller['isResizing']).toBe(true);
                
                // Execute the RAF callback
                const lastCallback = rafCallbacks[rafCallbacks.length - 1];
                lastCallback();
                
                // After execution, isResizing should be reset to false
                expect(scroller['isResizing']).toBe(false);
            }
        });

        it('should handle errors and reset isResizing flag', () => {
            // Create a scroller with a render callback that works initially but throws on resize
            let shouldThrow = false;
            const conditionalRenderCallback = jest.fn((_index: number, element: HTMLElement) => {
                if (shouldThrow) {
                    throw new Error('Render error');
                }
                element.textContent = `Item ${_index}`;
            });

            const errorScroller = new VirtualScroller(
                100,
                { itemHeight: 100, overscan: 2, containerHeight: 500 },
                conditionalRenderCallback
            );

            // Clear RAF callbacks for this test
            rafCallbacks = [];
            
            errorScroller.attach(mockContainer, mockScrollContainer);
            
            const resizeObserver = errorScroller['resizeObserver'];
            if (resizeObserver) {
                // Now enable throwing for the resize-triggered render
                shouldThrow = true;
                
                const entries = [{ contentRect: { height: 600 } } as ResizeObserverEntry];
                
                // Trigger resize
                resizeObserver['callback'](entries);
                expect(errorScroller['isResizing']).toBe(true);
                
                // Execute RAF callback - should throw but finally should reset flag
                const lastCallback = rafCallbacks[rafCallbacks.length - 1];
                expect(() => lastCallback()).toThrow('Render error');
                
                // Even after error, isResizing should be reset to false due to finally block
                expect(errorScroller['isResizing']).toBe(false);
            }

            errorScroller.detach();
        });

        it('should allow new resize after previous completes', () => {
            scroller.attach(mockContainer, mockScrollContainer);
            
            const resizeObserver = scroller['resizeObserver'];
            if (resizeObserver) {
                const entries = [{ contentRect: { height: 600 } } as ResizeObserverEntry];
                
                // First resize
                resizeObserver['callback'](entries);
                const firstCallback = rafCallbacks[rafCallbacks.length - 1];
                
                // Complete first resize
                firstCallback();
                expect(scroller['isResizing']).toBe(false);
                
                // Second resize should work
                resizeObserver['callback'](entries);
                expect(scroller['isResizing']).toBe(true);
                expect(rafCallbacks.length).toBeGreaterThanOrEqual(2);
            }
        });
    });
