/**
 * Sync Conflict Resolver Unit Tests
 * Tests for merge strategies and conflict detection
 */

import { SyncConflictResolver } from '../../src/sw/sync-conflict-resolver';

describe('SyncConflictResolver', () => {
    let resolver: SyncConflictResolver;

    beforeEach(() => {
        resolver = new SyncConflictResolver();
        jest.clearAllMocks();
    });

    describe('Progress Conflict Resolution', () => {
        it('should resolve with last-write-wins when timestamps are equal', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 2,
                notes: 'Test notes',
                timestamp: now,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: false,
                solveCount: 0,
                lastReviewed: 0,
                nextReview: 0,
                difficulty: 3,
                notes: 'Server notes',
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            expect(resolution.status).toBe('resolved');
            expect(resolution.strategy).toBe('last-write-wins');
            expect(resolution.data).toEqual(serverData);
        });

        it('should merge solved status with OR operation', async () => {
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 2,
                timestamp: Date.now() - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: false,
                solveCount: 0,
                lastReviewed: 0,
                nextReview: 0,
                difficulty: 3,
                timestamp: Date.now(),
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            expect(resolution.status).toBe('resolved');
            expect(resolution.strategy).toBe('merge');
            const merged = resolution.data as typeof clientData;
            expect(merged.solved).toBe(true); // OR operation
        });

        it('should sum solve counts', async () => {
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 3,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 2,
                timestamp: Date.now() - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 2,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 3,
                timestamp: Date.now(),
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            expect(merged.solveCount).toBe(5); // SUM
        });

        it('should use MAX for lastReviewed', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now - 1000,
                nextReview: now,
                difficulty: 2,
                timestamp: now - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 3,
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            expect(merged.lastReviewed).toBe(now); // MAX
        });

        it('should recalculate nextReview based on merged lastReviewed', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now - 1000,
                nextReview: now,
                difficulty: 2,
                timestamp: now - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 3,
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            expect(merged.nextReview).toBeGreaterThan(now);
        });

        it('should merge difficulty with weighted average', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 2, // Easy
                timestamp: now - 86400000, // 1 day ago
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 4, // Hard
                timestamp: now, // Now
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            // Should be closer to 4 (server) since it's more recent
            expect(merged.difficulty).toBeGreaterThan(2);
            expect(merged.difficulty).toBeLessThanOrEqual(4);
        });

        it('should merge notes with timestamps when different', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 2,
                notes: 'Client notes',
                timestamp: now - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 3,
                notes: 'Server notes',
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            expect(merged.notes).toContain('Client notes');
            expect(merged.notes).toContain('Server notes');
            expect(merged.notes).toContain('--- Notes from');
        });

        it('should use single notes when identical', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 2,
                notes: 'Same notes',
                timestamp: now - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 3,
                notes: 'Same notes',
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            expect(merged.notes).toBe('Same notes');
        });

        it('should handle missing notes', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 2,
                timestamp: now - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 3,
                notes: 'Server notes',
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            expect(merged.notes).toBe('Server notes');
        });
    });

    describe('Custom Problem Conflict Resolution', () => {
        it('should use last-write-wins for minor conflicts', async () => {
            const now = Date.now();
            const clientData = {
                id: 'custom-1',
                name: 'My Problem',
                url: 'https://example.com',
                category: 'Arrays',
                pattern: 'Two Pointers',
                difficulty: 'Medium' as const,
                timestamp: now - 1000,
            };

            const serverData = {
                id: 'custom-1',
                name: 'My Problem',
                url: 'https://example.com/updated',
                category: 'Arrays',
                pattern: 'Two Pointers',
                difficulty: 'Medium' as const,
                timestamp: now,
            };

            const resolution = await resolver.resolveCustomProblemConflict(clientData, serverData);

            expect(resolution.status).toBe('resolved');
            expect(resolution.strategy).toBe('last-write-wins');
            expect(resolution.data).toEqual(serverData);
        });

        it('should require manual resolution for significant conflicts', async () => {
            const now = Date.now();
            const clientData = {
                id: 'custom-1',
                name: 'My Problem',
                url: 'https://example.com',
                category: 'Arrays',
                pattern: 'Two Pointers',
                difficulty: 'Easy' as const,
                timestamp: now,
            };

            const serverData = {
                id: 'custom-1',
                name: 'Different Name',
                url: 'https://other.com',
                category: 'Strings',
                pattern: 'Sliding Window',
                difficulty: 'Hard' as const,
                timestamp: now,
            };

            const resolution = await resolver.resolveCustomProblemConflict(clientData, serverData);

            expect(resolution.status).toBe('manual');
            expect(resolution.message).toContain('conflicting data');
        });
    });

    describe('Batch Conflict Resolution', () => {
        it('should resolve multiple conflicts', async () => {
            const now = Date.now();
            const conflicts = [
                {
                    problemId: 'two-sum',
                    clientData: {
                        problemId: 'two-sum',
                        solved: true,
                        solveCount: 1,
                        lastReviewed: now,
                        nextReview: now + 86400000,
                        difficulty: 2,
                        timestamp: now - 1000,
                    },
                    serverData: {
                        problemId: 'two-sum',
                        solved: true,
                        solveCount: 2,
                        lastReviewed: now,
                        nextReview: now + 86400000,
                        difficulty: 3,
                        timestamp: now,
                    },
                },
                {
                    problemId: 'three-sum',
                    clientData: {
                        problemId: 'three-sum',
                        solved: false,
                        solveCount: 0,
                        lastReviewed: 0,
                        nextReview: 0,
                        difficulty: 3,
                        timestamp: now - 1000,
                    },
                    serverData: {
                        problemId: 'three-sum',
                        solved: true,
                        solveCount: 1,
                        lastReviewed: now,
                        nextReview: now + 86400000,
                        difficulty: 4,
                        timestamp: now,
                    },
                },
            ];

            const results = await resolver.resolveBatchConflicts(conflicts);

            expect(results).toHaveLength(2);
            expect(results[0].problemId).toBe('two-sum');
            expect(results[1].problemId).toBe('three-sum');
            expect(results[0].resolution.status).toBe('resolved');
            expect(results[1].resolution.status).toBe('resolved');
        });
    });

    describe('Manual Resolution Detection', () => {
        it('should detect when notes are significantly different', () => {
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 2,
                notes: 'Binary search approach with O(log n) complexity',
                timestamp: Date.now(),
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 2,
                notes: 'Dynamic programming solution with memoization',
                timestamp: Date.now(),
            };

            const requiresManual = resolver.requiresManualResolution(clientData, serverData);
            expect(requiresManual).toBe(true);
        });

        it('should detect when difficulty differs significantly', () => {
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 1, // Easy
                timestamp: Date.now(),
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 5, // Hard
                timestamp: Date.now(),
            };

            const requiresManual = resolver.requiresManualResolution(clientData, serverData);
            expect(requiresManual).toBe(true);
        });

        it('should not require manual resolution for minor differences', () => {
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 2,
                notes: 'Use hash map for O(n) solution',
                timestamp: Date.now(),
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 3,
                notes: 'Use hash map for O(n) solution approach',
                timestamp: Date.now(),
            };

            const requiresManual = resolver.requiresManualResolution(clientData, serverData);
            expect(requiresManual).toBe(false);
        });
    });

    describe('Conflict Description Generation', () => {
        it('should generate description for solved status conflict', () => {
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 2,
                timestamp: Date.now(),
            };

            const serverData = {
                problemId: 'two-sum',
                solved: false,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 2,
                timestamp: Date.now(),
            };

            const description = resolver.generateConflictDescription(clientData, serverData);
            expect(description).toContain('Solved status');
        });

        it('should generate description for multiple differences', () => {
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 3,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 2,
                notes: 'Client notes',
                timestamp: Date.now(),
            };

            const serverData = {
                problemId: 'two-sum',
                solved: false,
                solveCount: 1,
                lastReviewed: Date.now(),
                nextReview: Date.now() + 86400000,
                difficulty: 4,
                notes: 'Server notes',
                timestamp: Date.now(),
            };

            const description = resolver.generateConflictDescription(clientData, serverData);
            expect(description).toContain('Solved status');
            expect(description).toContain('Difficulty');
            expect(description).toContain('Notes');
            expect(description).toContain('Solve count');
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined difficulty', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                timestamp: now - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 3,
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof serverData;
            expect(merged.difficulty).toBe(3);
        });

        it('should handle both undefined difficulty', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                timestamp: now - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as { difficulty: number };
            expect(merged.difficulty).toBe(3); // Default to medium
        });

        it('should handle zero solve counts', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: false,
                solveCount: 0,
                lastReviewed: 0,
                nextReview: 0,
                difficulty: 2,
                timestamp: now - 1000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: false,
                solveCount: 0,
                lastReviewed: 0,
                nextReview: 0,
                difficulty: 3,
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            expect(merged.solveCount).toBe(0);
        });

        it('should clamp difficulty to 1-5 range', async () => {
            const now = Date.now();
            const clientData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 1,
                timestamp: now - 86400000,
            };

            const serverData = {
                problemId: 'two-sum',
                solved: true,
                solveCount: 1,
                lastReviewed: now,
                nextReview: now + 86400000,
                difficulty: 5,
                timestamp: now,
            };

            const resolution = await resolver.resolveProgressConflict(clientData, serverData);

            const merged = resolution.data as typeof clientData;
            expect(merged.difficulty).toBeGreaterThanOrEqual(1);
            expect(merged.difficulty).toBeLessThanOrEqual(5);
        });
    });
});
