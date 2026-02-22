/**
 * DOM Batch Updater - Batches DOM reads and writes to prevent layout thrashing
 * Groups operations by type (read vs write) and executes them efficiently
 */

class DOMBatchUpdater {
    private updates: Map<string, () => void> = new Map();
    private rafId: number | null = null;

    /**
     * Schedule a DOM update to be batched
     * @param id - Unique identifier for this update
     * @param updateFn - Function to execute
     * @param isRead - Whether this is a read operation (affects execution order)
     */
    schedule(id: string, updateFn: () => void, isRead = false): void {
        const key = isRead ? `read-${id}` : `write-${id}`;
        this.updates.set(key, updateFn);
        this.scheduleFlush();
    }

    /**
     * Cancel a scheduled update
     * @param id - The update identifier to cancel
     */
    cancel(id: string): void {
        this.updates.delete(`read-${id}`);
        this.updates.delete(`write-${id}`);
    }

    private scheduleFlush(): void {
        if (this.rafId !== null) return;

        this.rafId = requestAnimationFrame(() => {
            this.flush();
        });
    }

    private flush(): void {
        this.rafId = null;

        // Separate reads and writes
        const reads: (() => void)[] = [];
        const writes: (() => void)[] = [];

        this.updates.forEach((fn, key) => {
            if (key.startsWith('read-')) {
                reads.push(fn);
            } else {
                writes.push(fn);
            }
        });

        // Execute all reads first (to avoid layout thrashing)
        reads.forEach((fn) => {
            try {
                fn();
            } catch (error) {
                console.error('[DOMBatchUpdater] Read error:', error);
            }
        });

        // Then execute all writes
        writes.forEach((fn) => {
            try {
                fn();
            } catch (error) {
                console.error('[DOMBatchUpdater] Write error:', error);
            }
        });

        this.updates.clear();
    }

    /**
     * Force immediate flush of all pending updates
     */
    flushNow(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.flush();
    }
}

export const domBatchUpdater = new DOMBatchUpdater();
