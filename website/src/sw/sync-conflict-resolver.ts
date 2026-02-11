// Sync Conflict Resolver for SmartGrind Service Worker
// Handles conflict resolution between client and server data

// Conflict resolution strategies
type ResolutionStrategy = 'last-write-wins' | 'merge' | 'manual';

interface ConflictResolution {
    status: 'resolved' | 'manual';
    data?: unknown;
    message?: string;
    strategy?: ResolutionStrategy;
}

interface ProgressData {
    problemId: string;
    solved?: boolean;
    solveCount?: number;
    lastReviewed?: number;
    nextReview?: number;
    difficulty?: number;
    notes?: string;
    timestamp: number;
}

interface CustomProblemData {
    id: string;
    name: string;
    url?: string;
    category: string;
    pattern: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timestamp: number;
}

export class SyncConflictResolver {
    /**
     * Resolve progress conflict between client and server
     * Uses merge strategy with smart rules for different fields
     */
    async resolveProgressConflict(
        clientData: ProgressData,
        serverData: ProgressData
    ): Promise<ConflictResolution> {
        // If timestamps are equal, no conflict
        if (clientData.timestamp === serverData.timestamp) {
            return {
                status: 'resolved',
                strategy: 'last-write-wins',
                data: serverData,
            };
        }

        // Merge fields using appropriate strategies
        const mergedNotes = this.mergeNotes(
            clientData.notes,
            serverData.notes,
            clientData.timestamp,
            serverData.timestamp
        );

        const mergedData: ProgressData = {
            problemId: clientData.problemId,
            timestamp: Date.now(), // New timestamp for the merged result

            // solved: OR operation (if marked solved on any device, it's solved)
            solved: (clientData.solved || serverData.solved) ?? false,

            // solveCount: SUM (count solves from all devices)
            solveCount: (clientData.solveCount || 0) + (serverData.solveCount || 0),

            // lastReviewed: MAX (most recent review)
            lastReviewed: Math.max(clientData.lastReviewed || 0, serverData.lastReviewed || 0),

            // nextReview: Recalculate based on lastReviewed + spaced repetition
            // This will be recalculated server-side based on the merged lastReviewed
            nextReview: this.calculateNextReview(
                Math.max(clientData.lastReviewed || 0, serverData.lastReviewed || 0),
                (clientData.solveCount || 0) + (serverData.solveCount || 0)
            ),

            // difficulty: Weighted average by recency
            difficulty:
                this.mergeDifficulty(
                    clientData.difficulty,
                    serverData.difficulty,
                    clientData.timestamp,
                    serverData.timestamp
                ) ?? 3, // Default to medium difficulty (3) if undefined
        };

        // Only add notes if they exist
        if (mergedNotes) {
            mergedData.notes = mergedNotes;
        }

        return {
            status: 'resolved',
            strategy: 'merge',
            data: mergedData,
        };
    }

    /**
     * Resolve custom problem conflict
     */
    async resolveCustomProblemConflict(
        clientData: CustomProblemData,
        serverData: CustomProblemData
    ): Promise<ConflictResolution> {
        // Check if names are different (significant conflict)
        if (clientData.name !== serverData.name) {
            // Check if other fields are also different
            const fieldsDifferent = [
                clientData.category !== serverData.category,
                clientData.pattern !== serverData.pattern,
                clientData.difficulty !== serverData.difficulty,
            ].filter(Boolean).length;

            if (fieldsDifferent >= 2) {
                // Significant conflict - requires manual resolution
                return {
                    status: 'manual',
                    message: `Custom problem "${clientData.name}" has conflicting data with server version "${serverData.name}". Multiple fields differ.`,
                };
            }
        }

        // Minor conflict - use last-write-wins
        const winner = clientData.timestamp > serverData.timestamp ? clientData : serverData;

        return {
            status: 'resolved',
            strategy: 'last-write-wins',
            data: winner,
        };
    }

    /**
     * Calculate next review date based on last review and solve count
     * Uses spaced repetition intervals
     */
    private calculateNextReview(lastReviewed: number, solveCount: number): number {
        // Spaced repetition intervals in days
        const intervals = [1, 3, 7, 14, 30, 60];
        const intervalIndex = Math.min(solveCount, intervals.length - 1);
        const daysToAdd = intervals[intervalIndex] ?? 60; // Default to 60 days if undefined

        return lastReviewed + daysToAdd * 24 * 60 * 60 * 1000;
    }

    /**
     * Merge difficulty ratings using weighted average by recency
     */
    private mergeDifficulty(
        clientDifficulty: number | undefined,
        serverDifficulty: number | undefined,
        clientTimestamp: number,
        serverTimestamp: number
    ): number | undefined {
        // If only one has difficulty, use that
        if (clientDifficulty === undefined) return serverDifficulty;
        if (serverDifficulty === undefined) return clientDifficulty;

        // Calculate weights based on recency
        const now = Date.now();
        const clientAge = now - clientTimestamp;
        const serverAge = now - serverTimestamp;
        const totalAge = clientAge + serverAge;

        if (totalAge === 0) {
            // Same timestamp, average them
            return Math.round((clientDifficulty + serverDifficulty) / 2);
        }

        // More recent = higher weight
        const clientWeight = serverAge / totalAge;
        const serverWeight = clientAge / totalAge;

        const merged = Math.round(
            clientDifficulty * clientWeight + serverDifficulty * serverWeight
        );
        return Math.max(1, Math.min(5, merged)); // Clamp to 1-5 range
    }

    /**
     * Merge notes from both versions
     */
    private mergeNotes(
        clientNotes: string | undefined,
        serverNotes: string | undefined,
        clientTimestamp: number,
        serverTimestamp: number
    ): string | undefined {
        // If only one has notes, use that
        if (!clientNotes) return serverNotes;
        if (!serverNotes) return clientNotes;

        // If notes are the same, return one
        if (clientNotes === serverNotes) return clientNotes;

        // If notes are different, concatenate with timestamps
        const clientDate = new Date(clientTimestamp).toLocaleDateString();
        const serverDate = new Date(serverTimestamp).toLocaleDateString();

        const merged = [
            `--- Notes from ${clientDate} ---`,
            clientNotes,
            `--- Notes from ${serverDate} ---`,
            serverNotes,
        ].join('\n\n');

        return merged;
    }

    /**
     * Resolve batch conflicts
     */
    async resolveBatchConflicts(
        conflicts: Array<{
            problemId: string;
            clientData: ProgressData;
            serverData: ProgressData;
        }>
    ): Promise<Array<{ problemId: string; resolution: ConflictResolution }>> {
        const results = await Promise.all(
            conflicts.map(async (conflict) => {
                const resolution = await this.resolveProgressConflict(
                    conflict.clientData,
                    conflict.serverData
                );
                return {
                    problemId: conflict.problemId,
                    resolution,
                };
            })
        );

        return results;
    }

    /**
     * Check if conflict requires manual resolution
     */
    requiresManualResolution(clientData: ProgressData, serverData: ProgressData): boolean {
        // Check for significant conflicts that need manual resolution

        // 1. Problem marked as solved on one device but deleted on another
        // (This would require checking deleted status separately)

        // 2. Notes have significant differences (more than 50% different)
        if (clientData.notes && serverData.notes) {
            const similarity = this.calculateSimilarity(clientData.notes, serverData.notes);
            if (similarity < 0.5) {
                return true;
            }
        }

        // 3. Difficulty ratings are vastly different (more than 2 points)
        if (clientData.difficulty && serverData.difficulty) {
            if (Math.abs(clientData.difficulty - serverData.difficulty) > 2) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calculate text similarity using simple Jaccard index
     */
    private calculateSimilarity(text1: string, text2: string): number {
        const set1 = new Set(text1.toLowerCase().split(/\s+/));
        const set2 = new Set(text2.toLowerCase().split(/\s+/));

        const intersection = new Set([...set1].filter((x) => set2.has(x)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    }

    /**
     * Generate conflict description for UI
     */
    generateConflictDescription(clientData: ProgressData, serverData: ProgressData): string {
        const differences: string[] = [];

        if (clientData.solved !== serverData.solved) {
            differences.push(`Solved status: ${clientData.solved} vs ${serverData.solved}`);
        }

        if (clientData.difficulty !== serverData.difficulty) {
            differences.push(`Difficulty: ${clientData.difficulty} vs ${serverData.difficulty}`);
        }

        if (clientData.notes !== serverData.notes) {
            differences.push('Notes are different');
        }

        if (clientData.solveCount !== serverData.solveCount) {
            differences.push(`Solve count: ${clientData.solveCount} vs ${serverData.solveCount}`);
        }

        return differences.join(', ') || 'Unknown conflict';
    }
}
