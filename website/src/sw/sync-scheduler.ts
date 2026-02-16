// Sync Scheduler Module for SmartGrind
// Manages sync execution with exponential backoff, circuit breaker, and priority levels

import { ConnectivityChecker } from './connectivity-checker';

export type SyncPriority = 'high' | 'normal' | 'low';

interface SyncTask {
    id: string;
    tag: string;
    priority: SyncPriority;
    execute: () => Promise<void>;
    retryCount: number;
    maxRetries: number;
    createdAt: number;
    lastAttempt: number | null;
}

interface SyncSchedulerOptions {
    maxConcurrentSyncs: number;
    defaultMaxRetries: number;
    circuitBreakerThreshold: number;
    circuitBreakerResetTime: number;
    highPriorityInterval: number;
    normalPriorityInterval: number;
    lowPriorityInterval: number;
}

const DEFAULT_OPTIONS: SyncSchedulerOptions = {
    maxConcurrentSyncs: 1,
    defaultMaxRetries: 5,
    circuitBreakerThreshold: 5,
    circuitBreakerResetTime: 60000, // 1 minute
    highPriorityInterval: 5000, // 5 seconds
    normalPriorityInterval: 30000, // 30 seconds
    lowPriorityInterval: 300000, // 5 minutes
};

interface CircuitBreakerState {
    failures: number;
    lastFailure: number;
    isOpen: boolean;
}

export class SyncScheduler {
    private options: SyncSchedulerOptions;
    private queue: Map<string, SyncTask> = new Map();
    private runningSyncs: Set<string> = new Set();
    private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
    private connectivityChecker: ConnectivityChecker;
    private isProcessing: boolean = false;
    private processIntervalId: number | null = null;

    constructor(
        connectivityChecker: ConnectivityChecker,
        options: Partial<SyncSchedulerOptions> = {}
    ) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.connectivityChecker = connectivityChecker;
    }

    /**
     * Start the sync scheduler
     */
    start(): void {
        if (this.processIntervalId !== null) return;

        this.processIntervalId = window.setInterval(() => {
            this.processQueue();
        }, 1000); // Check queue every second
    }

    /**
     * Stop the sync scheduler
     */
    stop(): void {
        if (this.processIntervalId !== null) {
            clearInterval(this.processIntervalId);
            this.processIntervalId = null;
        }
    }

    /**
     * Schedule a sync task
     */
    schedule(
        tag: string,
        execute: () => Promise<void>,
        options: {
            priority?: SyncPriority;
            maxRetries?: number;
        } = {}
    ): string {
        const id = `${tag}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const task: SyncTask = {
            id,
            tag,
            priority: options.priority || 'normal',
            execute,
            retryCount: 0,
            maxRetries: options.maxRetries || this.options.defaultMaxRetries,
            createdAt: Date.now(),
            lastAttempt: null,
        };

        this.queue.set(id, task);
        this.sortQueue();

        // Trigger immediate processing for high priority tasks
        if (task.priority === 'high') {
            this.processQueue();
        }

        return id;
    }

    /**
     * Cancel a scheduled sync task
     */
    cancel(taskId: string): boolean {
        return this.queue.delete(taskId);
    }

    /**
     * Cancel all tasks with a specific tag
     */
    cancelByTag(tag: string): number {
        let count = 0;
        for (const [id, task] of this.queue.entries()) {
            if (task.tag === tag) {
                this.queue.delete(id);
                count++;
            }
        }
        return count;
    }

    /**
     * Process the sync queue
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessing) return;
        if (this.runningSyncs.size >= this.options.maxConcurrentSyncs) return;

        // Check connectivity first
        const isOnline = await this.connectivityChecker.isOnline();
        if (!isOnline) return;

        this.isProcessing = true;

        try {
            // Get next eligible task
            const task = this.getNextTask();
            if (!task) return;

            // Check circuit breaker
            if (this.isCircuitBreakerOpen(task.tag)) {
                console.log(`[SyncScheduler] Circuit breaker open for ${task.tag}, skipping`);
                return;
            }

            // Execute the task
            this.runningSyncs.add(task.id);
            this.queue.delete(task.id);

            try {
                await this.executeWithTimeout(task);

                // Success - reset circuit breaker
                this.resetCircuitBreaker(task.tag);
                task.retryCount = 0;
            } catch (error) {
                // Failure - handle retry
                await this.handleTaskFailure(task, error as Error);
            } finally {
                this.runningSyncs.delete(task.id);
            }
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Get the next eligible task from the queue
     */
    private getNextTask(): SyncTask | null {
        const now = Date.now();

        for (const task of this.queue.values()) {
            // Check if enough time has passed since last attempt
            const minInterval = this.getPriorityInterval(task.priority);
            if (task.lastAttempt && now - task.lastAttempt < minInterval) {
                continue;
            }

            // Check if task is not already running
            if (this.runningSyncs.has(task.id)) {
                continue;
            }

            return task;
        }

        return null;
    }

    /**
     * Execute task with timeout
     */
    private async executeWithTimeout(task: SyncTask): Promise<void> {
        const timeoutMs = 30000; // 30 seconds timeout for sync batch

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Sync task ${task.id} timed out after ${timeoutMs}ms`));
            }, timeoutMs);

            task.execute()
                .then(() => {
                    clearTimeout(timeoutId);
                    resolve();
                })
                .catch((error) => {
                    clearTimeout(timeoutId);
                    reject(error);
                });
        });
    }

    /**
     * Handle task failure with retry logic
     */
    private async handleTaskFailure(task: SyncTask, error: Error): Promise<void> {
        console.error(`[SyncScheduler] Task ${task.id} failed:`, error);

        // Record circuit breaker failure
        this.recordCircuitBreakerFailure(task.tag);

        if (task.retryCount < task.maxRetries) {
            task.retryCount++;
            task.lastAttempt = Date.now();

            // Calculate exponential backoff delay
            const baseDelay = 1000; // 1 second
            const delay = baseDelay * Math.pow(2, task.retryCount - 1);
            const maxDelay = 60000; // 1 minute max
            const actualDelay = Math.min(delay, maxDelay);

            console.log(
                `[SyncScheduler] Retrying task ${task.id} in ${actualDelay}ms (attempt ${task.retryCount}/${task.maxRetries})`
            );

            // Re-queue with delay
            setTimeout(() => {
                this.queue.set(task.id, task);
                this.sortQueue();
            }, actualDelay);
        } else {
            console.error(`[SyncScheduler] Task ${task.id} exceeded max retries, giving up`);
            // Task failed permanently - could emit event for UI notification
        }
    }

    /**
     * Sort queue by priority
     */
    private sortQueue(): void {
        const priorityOrder: Record<SyncPriority, number> = {
            high: 0,
            normal: 1,
            low: 2,
        };

        const sorted = new Map(
            Array.from(this.queue.entries()).sort((a, b) => {
                const priorityDiff = priorityOrder[a[1].priority] - priorityOrder[b[1].priority];
                if (priorityDiff !== 0) return priorityDiff;
                return a[1].createdAt - b[1].createdAt;
            })
        );

        this.queue = sorted;
    }

    /**
     * Get interval for priority level
     */
    private getPriorityInterval(priority: SyncPriority): number {
        switch (priority) {
            case 'high':
                return this.options.highPriorityInterval;
            case 'normal':
                return this.options.normalPriorityInterval;
            case 'low':
                return this.options.lowPriorityInterval;
            default:
                return this.options.normalPriorityInterval;
        }
    }

    /**
     * Check if circuit breaker is open for a tag
     */
    private isCircuitBreakerOpen(tag: string): boolean {
        const cb = this.circuitBreakers.get(tag);
        if (!cb) return false;

        if (cb.isOpen) {
            // Check if enough time has passed to try again
            if (Date.now() - cb.lastFailure > this.options.circuitBreakerResetTime) {
                // Reset circuit breaker
                this.resetCircuitBreaker(tag);
                return false;
            }
            return true;
        }

        return false;
    }

    /**
     * Record a circuit breaker failure
     */
    private recordCircuitBreakerFailure(tag: string): void {
        const cb = this.circuitBreakers.get(tag) || {
            failures: 0,
            lastFailure: 0,
            isOpen: false,
        };

        cb.failures++;
        cb.lastFailure = Date.now();

        if (cb.failures >= this.options.circuitBreakerThreshold) {
            cb.isOpen = true;
            console.warn(`[SyncScheduler] Circuit breaker opened for ${tag}`);
        }

        this.circuitBreakers.set(tag, cb);
    }

    /**
     * Reset circuit breaker for a tag
     */
    private resetCircuitBreaker(tag: string): void {
        this.circuitBreakers.delete(tag);
    }

    /**
     * Get current queue statistics
     */
    getStats(): {
        queued: number;
        running: number;
        circuitBreakersOpen: number;
    } {
        return {
            queued: this.queue.size,
            running: this.runningSyncs.size,
            circuitBreakersOpen: Array.from(this.circuitBreakers.values()).filter((cb) => cb.isOpen)
                .length,
        };
    }

    /**
     * Force immediate execution of all pending tasks
     */
    async forceSync(): Promise<{ completed: number; failed: number }> {
        let completed = 0;
        let failed = 0;

        const tasks = Array.from(this.queue.values());
        this.queue.clear();

        for (const task of tasks) {
            try {
                await this.executeWithTimeout(task);
                completed++;
            } catch (_error) {
                failed++;
                // Don't retry on force sync
            }
        }

        return { completed, failed };
    }
}

// Singleton instance
let syncScheduler: SyncScheduler | null = null;

export function getSyncScheduler(connectivityChecker: ConnectivityChecker): SyncScheduler {
    if (!syncScheduler) {
        syncScheduler = new SyncScheduler(connectivityChecker);
    }
    return syncScheduler;
}
