// Sync Conflict Resolver for SmartGrind
// Handles conflict resolution between client and server data

export interface ConflictResolution {
    status: 'resolved' | 'manual' | 'error';
    strategy: 'last-write-wins' | 'server-wins' | 'client-wins' | 'merge' | 'manual';
    data?: unknown;
    message?: string;
}

export interface BatchConflict {
    problemId: string;
    clientData: unknown;
    serverData: unknown;
}

export class SyncConflictResolver {
    /**
     * Resolve progress conflict between client and server data
     */
    async resolveProgressConflict(
        clientData: Record<string, unknown>,
        serverData: Record<string, unknown>
    ): Promise<ConflictResolution> {
        // Check if timestamps are equal - use last-write-wins
        if (clientData['timestamp'] === serverData['timestamp']) {
            return {
                status: 'resolved',
                strategy: 'last-write-wins',
                data: serverData,
            };
        }

        // Merge the data first (needed for both auto and manual resolution)
        const merged = this.mergeProgressData(clientData, serverData);

        // Check if manual resolution is required
        if (this.requiresManualResolution(clientData, serverData)) {
            return {
                status: 'manual',
                strategy: 'manual',
                data: merged,
                message: this.generateConflictDescription(clientData, serverData),
            };
        }

        return {
            status: 'resolved',
            strategy: 'merge',
            data: merged,
        };
    }

    /**
     * Merge progress data with intelligent strategies
     */
    private mergeProgressData(
        clientData: Record<string, unknown>,
        serverData: Record<string, unknown>
    ): Record<string, unknown> {
        const clientTime = (clientData['timestamp'] as number) || 0;
        const serverTime = (serverData['timestamp'] as number) || 0;

        // Weight based on recency (more recent = higher weight)
        const clientWeight = clientTime > serverTime ? 0.7 : 0.3;
        const serverWeight = 1 - clientWeight;

        // OR operation for solved status (if either solved, mark as solved)
        const solved = (clientData['solved'] as boolean) || (serverData['solved'] as boolean);

        // SUM for solve counts
        const clientCount = (clientData['solveCount'] as number) || 0;
        const serverCount = (serverData['solveCount'] as number) || 0;
        const solveCount = clientCount + serverCount;

        // MAX for lastReviewed
        const clientReviewed = (clientData['lastReviewed'] as number) || 0;
        const serverReviewed = (serverData['lastReviewed'] as number) || 0;
        const lastReviewed = Math.max(clientReviewed, serverReviewed);

        // Weighted average for difficulty
        const clientDifficulty = (clientData['difficulty'] as number) || 3;
        const serverDifficulty = (serverData['difficulty'] as number) || 3;
        const difficulty = Math.round(
            clientDifficulty * clientWeight + serverDifficulty * serverWeight
        );
        const clampedDifficulty = Math.max(1, Math.min(5, difficulty));

        // Recalculate nextReview based on merged lastReviewed
        const nextReview = this.calculateNextReview(lastReviewed, solveCount, clampedDifficulty);

        // Merge notes with timestamps
        const notes = this.mergeNotes(
            (clientData['notes'] as string) || '',
            (serverData['notes'] as string) || '',
            clientTime,
            serverTime
        );

        return {
            problemId: clientData['problemId'] || serverData['problemId'],
            solved,
            solveCount,
            lastReviewed,
            nextReview,
            difficulty: clampedDifficulty,
            notes,
            timestamp: Math.max(clientTime, serverTime),
        };
    }

    /**
     * Calculate next review date based on spaced repetition
     */
    private calculateNextReview(
        lastReviewed: number,
        solveCount: number,
        difficulty: number
    ): number {
        if (!lastReviewed || solveCount === 0) {
            return 0;
        }

        // Base intervals in days
        const intervals = [1, 3, 7, 14, 30, 60];
        const intervalIndex = Math.min(solveCount - 1, intervals.length - 1);
        const days = intervals[intervalIndex] || 1;

        // Adjust based on difficulty (harder = shorter interval)
        const difficultyMultiplier = 1 - (difficulty - 1) * 0.1;
        const adjustedDays = Math.max(1, Math.round(days * difficultyMultiplier));

        return lastReviewed + adjustedDays * 24 * 60 * 60 * 1000;
    }

    /**
     * Merge notes from client and server
     */
    private mergeNotes(
        clientNotes: string,
        serverNotes: string,
        clientTime: number,
        _serverTime: number
    ): string {
        // If notes are identical, return one
        if (clientNotes === serverNotes) {
            return clientNotes;
        }

        // If one is empty, return the other
        if (!clientNotes) return serverNotes;
        if (!serverNotes) return clientNotes;

        // Combine both notes with timestamps
        const clientDate = new Date(clientTime).toLocaleDateString();

        return `${clientNotes}\n\n--- Notes from ${clientDate} ---\n${serverNotes}`;
    }

    /**
     * Resolve custom problem conflict
     */
    async resolveCustomProblemConflict(
        clientData: Record<string, unknown>,
        serverData: Record<string, unknown>
    ): Promise<ConflictResolution> {
        // Check for significant conflicts
        const significantChanges = this.detectSignificantChanges(clientData, serverData);

        if (significantChanges.length >= 3) {
            return {
                status: 'manual',
                strategy: 'manual',
                message: `Multiple conflicting data fields (${significantChanges.join(', ')}) require manual resolution.`,
            };
        }

        // Use last-write-wins for minor conflicts
        const clientTime = (clientData['timestamp'] as number) || 0;
        const serverTime = (serverData['timestamp'] as number) || 0;

        return {
            status: 'resolved',
            strategy: 'last-write-wins',
            data: serverTime >= clientTime ? serverData : clientData,
        };
    }

    /**
     * Detect significant changes between client and server data
     */
    private detectSignificantChanges(
        clientData: Record<string, unknown>,
        serverData: Record<string, unknown>
    ): string[] {
        const changes: string[] = [];
        const significantFields = ['name', 'url', 'category', 'pattern', 'difficulty'];

        for (const field of significantFields) {
            if (clientData[field] !== serverData[field]) {
                changes.push(field);
            }
        }

        return changes;
    }

    /**
     * Check if manual resolution is required
     */
    requiresManualResolution(
        clientData: Record<string, unknown>,
        serverData: Record<string, unknown>
    ): boolean {
        // Check for significant note differences
        const clientNotes = (clientData['notes'] as string) || '';
        const serverNotes = (serverData['notes'] as string) || '';

        if (clientNotes && serverNotes && clientNotes !== serverNotes) {
            // Check if notes are substantially different (more than 50% different)
            const similarity = this.calculateSimilarity(clientNotes, serverNotes);
            if (similarity < 0.5) {
                return true;
            }
        }

        // Check for significant difficulty differences
        const clientDifficulty = (clientData['difficulty'] as number) || 3;
        const serverDifficulty = (serverData['difficulty'] as number) || 3;

        if (Math.abs(clientDifficulty - serverDifficulty) >= 2) {
            return true;
        }

        // Check for multiple significant field changes
        const significantChanges = this.detectSignificantChanges(clientData, serverData);
        if (significantChanges.length >= 2) {
            return true;
        }

        return false;
    }

    /**
     * Calculate string similarity (0-1)
     */
    private calculateSimilarity(str1: string, str2: string): number {
        if (str1 === str2) return 1;
        if (!str1 || !str2) return 0;

        // Simple Jaccard similarity for words
        const words1 = new Set(str1.toLowerCase().split(/\s+/));
        const words2 = new Set(str2.toLowerCase().split(/\s+/));

        const intersection = new Set([...words1].filter((x) => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return intersection.size / union.size;
    }

    /**
     * Generate conflict description for UI display
     */
    generateConflictDescription(
        clientData: Record<string, unknown>,
        serverData: Record<string, unknown>
    ): string {
        const differences: string[] = [];

        if (clientData['solved'] !== serverData['solved']) {
            differences.push('Solved status');
        }

        if (clientData['difficulty'] !== serverData['difficulty']) {
            differences.push('Difficulty');
        }

        if (clientData['notes'] !== serverData['notes']) {
            differences.push('Notes');
        }

        if (clientData['solveCount'] !== serverData['solveCount']) {
            differences.push('Solve count');
        }

        if (differences.length === 0) {
            return 'Data conflict detected';
        }

        return `Conflict in: ${differences.join(', ')}`;
    }

    /**
     * Resolve batch of conflicts
     */
    async resolveBatchConflicts(
        conflicts: BatchConflict[]
    ): Promise<Array<{ problemId: string; resolution: ConflictResolution }>> {
        const results: Array<{ problemId: string; resolution: ConflictResolution }> = [];

        for (const conflict of conflicts) {
            const resolution = await this.resolveProgressConflict(
                conflict.clientData as Record<string, unknown>,
                conflict.serverData as Record<string, unknown>
            );

            results.push({
                problemId: conflict.problemId,
                resolution,
            });
        }

        return results;
    }

    /**
     * Auto-resolve conflict using appropriate strategy
     */
    async autoResolve(
        clientData: Record<string, unknown>,
        serverData: Record<string, unknown>,
        type: 'progress' | 'custom-problem' | 'settings' = 'progress'
    ): Promise<ConflictResolution> {
        // Check if manual resolution is required
        if (this.requiresManualResolution(clientData, serverData)) {
            return {
                status: 'manual',
                strategy: 'manual',
                message: this.generateConflictDescription(clientData, serverData),
            };
        }

        // Use appropriate resolver based on type
        switch (type) {
            case 'progress':
                return this.resolveProgressConflict(clientData, serverData);
            case 'custom-problem':
                return this.resolveCustomProblemConflict(clientData, serverData);
            case 'settings': {
                // For settings, use last-write-wins
                const clientTime = (clientData['timestamp'] as number) || 0;
                const serverTime = (serverData['timestamp'] as number) || 0;
                return {
                    status: 'resolved',
                    strategy: 'last-write-wins',
                    data: serverTime >= clientTime ? serverData : clientData,
                };
            }
            default:
                return {
                    status: 'error',
                    strategy: 'manual',
                    message: 'Unknown conflict type',
                };
        }
    }
}
