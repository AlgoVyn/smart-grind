/**
 * Cleanup Manager - Tracks and manages resource cleanup
 * Prevents memory leaks by ensuring event listeners, intervals, and timeouts are properly cleaned up
 */

class CleanupManager {
    private cleanups: Map<string, (() => void)[]> = new Map();

    /**
     * Register a cleanup function for a specific context
     * @param context - Unique identifier for the cleanup context
     * @param cleanup - Function to call during cleanup
     */
    register(context: string, cleanup: () => void): void {
        if (!this.cleanups.has(context)) {
            this.cleanups.set(context, []);
        }
        this.cleanups.get(context)!.push(cleanup);
    }

    /**
     * Execute all cleanup functions for a specific context
     * @param context - The context to clean up
     */
    cleanup(context: string): void {
        const cleanups = this.cleanups.get(context);
        if (cleanups) {
            cleanups.forEach((fn) => {
                try {
                    fn();
                } catch (error) {
                    console.error(`[CleanupManager] Error in ${context}:`, error);
                }
            });
            this.cleanups.delete(context);
        }
    }

    /**
     * Execute all cleanup functions across all contexts
     */
    cleanupAll(): void {
        this.cleanups.forEach((_, context) => this.cleanup(context));
    }

    /**
     * Check if a context has registered cleanups
     * @param context - The context to check
     */
    hasContext(context: string): boolean {
        return this.cleanups.has(context);
    }

    /**
     * Get number of registered cleanups for a context
     * @param context - The context to check
     */
    getCleanupCount(context: string): number {
        return this.cleanups.get(context)?.length || 0;
    }
}

export const cleanupManager = new CleanupManager();

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        cleanupManager.cleanupAll();
    });
}
