// --- VIRTUAL SCROLLING MODULE ---
// Efficiently render large lists by only showing visible items

export interface VirtualScrollConfig {
    itemHeight: number;
    overscan: number;
    containerHeight: number;
}

export interface VirtualScrollState {
    startIndex: number;
    endIndex: number;
    visibleCount: number;
    totalHeight: number;
    offsetY: number;
}

/**
 * Virtual Scroller - Efficiently renders large lists
 * Only renders items that are visible in the viewport
 */
export class VirtualScroller {
    private config: VirtualScrollConfig;
    private totalItems: number;
    private container: HTMLElement | null = null;
    private scrollContainer: HTMLElement | null = null;
    private onRender: (_index: number, _element: HTMLElement) => void;
    private onCleanup: ((_element: HTMLElement) => void) | null = null;
    private itemElements: Map<number, HTMLElement> = new Map();
    private state: VirtualScrollState = {
        startIndex: 0,
        endIndex: 0,
        visibleCount: 0,
        totalHeight: 0,
        offsetY: 0,
    };
    private rafId: number | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private isResizing = false; // Flag to prevent recursive ResizeObserver loops

    constructor(
        totalItems: number,
        config: Partial<VirtualScrollConfig>,
        onRender: (_index: number, _element: HTMLElement) => void,
        onCleanup?: (_element: HTMLElement) => void
    ) {
        this.totalItems = totalItems;
        this.config = {
            itemHeight: config.itemHeight || 100,
            overscan: config.overscan || 5,
            containerHeight: config.containerHeight || 500,
        };
        this.onRender = onRender;
        this.onCleanup = onCleanup || null;
        this.updateState();
    }

    /**
     * Attach to a container element
     */
    attach(container: HTMLElement, scrollContainer?: HTMLElement): void {
        this.container = container;
        this.scrollContainer = scrollContainer || container;

        // Set up scroll listener
        this.scrollContainer.addEventListener('scroll', this.handleScroll, { passive: true });

        // Set up resize observer for container
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver((entries) => {
                // Prevent recursive ResizeObserver loops
                if (this.isResizing) return;
                this.isResizing = true;

                requestAnimationFrame(() => {
                    try {
                        for (const entry of entries) {
                            this.config.containerHeight = entry.contentRect.height;
                            this.updateState();
                            this.render();
                        }
                    } finally {
                        this.isResizing = false;
                    }
                });
            });
            this.resizeObserver.observe(this.container);
        }

        // Initial render
        this.updateState();
        this.render();
    }

    /**
     * Detach and clean up
     */
    detach(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
        }

        if (this.scrollContainer) {
            this.scrollContainer.removeEventListener('scroll', this.handleScroll);
        }

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        // Clean up all items
        this.itemElements.forEach((element) => {
            if (this.onCleanup) {
                this.onCleanup(element);
            }
            element.remove();
        });
        this.itemElements.clear();
    }

    /**
     * Update the total number of items
     */
    setTotalItems(count: number): void {
        this.totalItems = count;
        this.updateState();
        this.render();
    }

    /**
     * Update configuration
     */
    updateConfig(config: Partial<VirtualScrollConfig>): void {
        this.config = { ...this.config, ...config };
        this.updateState();
        this.render();
    }

    /**
     * Scroll to a specific item
     */
    scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth'): void {
        if (!this.scrollContainer) return;

        const scrollTop = index * this.config.itemHeight;
        this.scrollContainer.scrollTo({
            top: scrollTop,
            behavior,
        });
    }

    /**
     * Get current scroll state
     */
    getState(): VirtualScrollState {
        return { ...this.state };
    }

    private handleScroll = (): void => {
        if (this.rafId !== null) return;

        this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            this.updateState();
            this.render();
        });
    };

    private updateState(): void {
        if (!this.scrollContainer) return;

        const scrollTop = this.scrollContainer.scrollTop;
        const { itemHeight, overscan, containerHeight } = this.config;

        // Calculate visible range
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
        const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
        const endIndex = Math.min(this.totalItems - 1, startIndex + visibleCount);

        this.state = {
            startIndex,
            endIndex,
            visibleCount: endIndex - startIndex + 1,
            totalHeight: this.totalItems * itemHeight,
            offsetY: startIndex * itemHeight,
        };
    }

    private render(): void {
        if (!this.container) return;

        const { startIndex, endIndex, totalHeight } = this.state;

        // Set container height to match total content
        this.container.style.height = `${totalHeight}px`;

        // Determine which items to remove
        const toRemove: number[] = [];
        this.itemElements.forEach((_, index) => {
            if (index < startIndex || index > endIndex) {
                toRemove.push(index);
            }
        });

        // Remove items that are no longer visible
        toRemove.forEach((index) => {
            const element = this.itemElements.get(index);
            if (element) {
                if (this.onCleanup) {
                    this.onCleanup(element);
                }
                element.remove();
                this.itemElements.delete(index);
            }
        });

        // Create or update visible items
        for (let i = startIndex; i <= endIndex; i++) {
            let element = this.itemElements.get(i);

            if (!element) {
                element = document.createElement('div');
                element.style.position = 'absolute';
                element.style.top = '0';
                element.style.left = '0';
                element.style.right = '0';
                element.style.height = `${this.config.itemHeight}px`;
                element.style.transform = `translateY(${i * this.config.itemHeight}px)`;
                element.dataset['index'] = String(i);
                this.onRender(i, element);
                this.container.appendChild(element);
                this.itemElements.set(i, element);
            }
        }

        // Ensure container has relative positioning
        if (this.container.style.position !== 'relative') {
            this.container.style.position = 'relative';
        }
    }
}

/**
 * Simple virtual scroll helper for problem lists
 * Automatically detects when virtualization is needed (50+ items)
 */
export function shouldVirtualize(itemCount: number): boolean {
    return itemCount > 50;
}

/**
 * Estimate item height based on content type
 */
export function estimateItemHeight(
    type: 'problem-card' | 'pattern-section' | 'topic-section'
): number {
    const heights = {
        'problem-card': 80,
        'pattern-section': 300,
        'topic-section': 500,
    };
    return heights[type] || 100;
}
