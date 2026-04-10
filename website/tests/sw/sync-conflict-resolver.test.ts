/**
 * Sync Conflict Resolver Tests
 * Tests for conflict resolution between client and server data
 */

import { SyncConflictResolver, ConflictResolution, BatchConflict } from '../../src/sw/sync-conflict-resolver';

describe('SyncConflictResolver', () => {
    let resolver: SyncConflictResolver;

    beforeEach(() => {
        resolver = new SyncConflictResolver();
    });

    describe('resolveProgressConflict', () => {
        test('should use last-write-wins when timestamps are equal', async () => {
            const clientData = { timestamp: 1000, solved: true };
            const serverData = { timestamp: 1000, solved: false };

            const result = await resolver.resolveProgressConflict(clientData, serverData);

            expect(result.status).toBe('resolved');
            expect(result.strategy).toBe('last-write-wins');
        });

        test('should merge data when timestamps differ', async () => {
            const clientData = {
                problemId: 'p1',
                timestamp: 2000,
                solved: true,
                solveCount: 1,
                difficulty: 3,
            };
            const serverData = {
                problemId: 'p1',
                timestamp: 1000,
                solved: false,
                solveCount: 2,
                difficulty: 4,
            };

            const result = await resolver.resolveProgressConflict(clientData, serverData);

            expect(result.status).toBe('resolved');
            expect(result.strategy).toBe('merge');
            expect(result.data).toMatchObject({
                problemId: 'p1',
                solved: true, // OR operation
                solveCount: 2, // MAX (takes the higher of client=1 and server=2)
            });
        });

        test('should require manual resolution for significant conflicts', async () => {
            const clientData = {
                timestamp: 2000,
                solved: true,
                difficulty: 5,
                notes: 'My detailed notes about the solution',
            };
            const serverData = {
                timestamp: 1000,
                solved: false,
                difficulty: 1,
                notes: 'Completely different approach notes',
            };

            const result = await resolver.resolveProgressConflict(clientData, serverData);

            expect(result.status).toBe('manual');
            expect(result.strategy).toBe('manual');
        });
    });

    describe('resolveCustomProblemConflict', () => {
        test('should use last-write-wins for minor conflicts', async () => {
            const clientData = {
                timestamp: 2000,
                name: 'Two Sum',
                difficulty: 3,
            };
            const serverData = {
                timestamp: 1000,
                name: 'Two Sum',
                difficulty: 4,
            };

            const result = await resolver.resolveCustomProblemConflict(clientData, serverData);

            expect(result.status).toBe('resolved');
            expect(result.strategy).toBe('last-write-wins');
            expect(result.data).toBe(clientData); // Client wins (newer)
        });

        test('should require manual resolution for significant changes', async () => {
            const clientData = {
                timestamp: 2000,
                name: 'Two Sum Modified',
                url: 'https://new-url.com',
                category: 'Arrays',
                difficulty: 3,
            };
            const serverData = {
                timestamp: 1000,
                name: 'Two Sum',
                url: 'https://old-url.com',
                category: 'Hash Table',
                difficulty: 2,
            };

            const result = await resolver.resolveCustomProblemConflict(clientData, serverData);

            expect(result.status).toBe('manual');
            expect(result.strategy).toBe('manual');
        });
    });

    describe('requiresManualResolution', () => {
        test('should return true for substantially different notes', () => {
            const clientData = {
                notes: 'This is a completely different solution approach',
                timestamp: 1000,
            };
            const serverData = {
                notes: 'Using hash map for O(n) solution',
                timestamp: 2000,
            };

            expect(resolver.requiresManualResolution(clientData, serverData)).toBe(true);
        });

        test('should return true for large difficulty differences', () => {
            const clientData = { difficulty: 1, timestamp: 1000 };
            const serverData = { difficulty: 5, timestamp: 2000 };

            expect(resolver.requiresManualResolution(clientData, serverData)).toBe(true);
        });

        test('should return false for minor differences', () => {
            const clientData = { difficulty: 3, solved: true, timestamp: 1000 };
            const serverData = { difficulty: 4, solved: true, timestamp: 2000 };

            expect(resolver.requiresManualResolution(clientData, serverData)).toBe(false);
        });
    });

    describe('generateConflictDescription', () => {
        test('should describe solved status conflict', () => {
            const clientData = { solved: true };
            const serverData = { solved: false };

            const description = resolver.generateConflictDescription(clientData, serverData);

            expect(description).toContain('Solved status');
        });

        test('should describe multiple conflicts', () => {
            const clientData = { solved: true, difficulty: 5, notes: 'Notes 1' };
            const serverData = { solved: false, difficulty: 2, notes: 'Notes 2' };

            const description = resolver.generateConflictDescription(clientData, serverData);

            expect(description).toContain('Solved status');
            expect(description).toContain('Difficulty');
            expect(description).toContain('Notes');
        });

        test('should return default message when no differences', () => {
            const clientData = { solved: true };
            const serverData = { solved: true };

            const description = resolver.generateConflictDescription(clientData, serverData);

            expect(description).toBe('Data conflict detected');
        });
    });

    describe('resolveBatchConflicts', () => {
        test('should resolve multiple conflicts', async () => {
            const conflicts: BatchConflict[] = [
                {
                    problemId: 'p1',
                    clientData: { timestamp: 2000, solved: true },
                    serverData: { timestamp: 1000, solved: false },
                },
                {
                    problemId: 'p2',
                    clientData: { timestamp: 1000, difficulty: 1 },
                    serverData: { timestamp: 2000, difficulty: 5 },
                },
            ];

            const results = await resolver.resolveBatchConflicts(conflicts);

            expect(results).toHaveLength(2);
            expect(results[0].problemId).toBe('p1');
            expect(results[1].problemId).toBe('p2');
        });
    });

    describe('autoResolve', () => {
        test('should auto-resolve progress conflicts', async () => {
            const clientData = { timestamp: 2000, solved: true };
            const serverData = { timestamp: 1000, solved: false };

            const result = await resolver.autoResolve(clientData, serverData, 'progress');

            expect(result.status).toBe('resolved');
        });

        test('should auto-resolve settings with last-write-wins', async () => {
            const clientData = { timestamp: 2000, theme: 'dark' };
            const serverData = { timestamp: 1000, theme: 'light' };

            const result = await resolver.autoResolve(clientData, serverData, 'settings');

            expect(result.status).toBe('resolved');
            expect(result.strategy).toBe('last-write-wins');
            expect(result.data).toEqual(clientData);
        });

        test('should require manual resolution when needed', async () => {
            const clientData = {
                timestamp: 2000,
                notes: 'Completely different notes',
                difficulty: 1,
            };
            const serverData = {
                timestamp: 1000,
                notes: 'Original notes',
                difficulty: 5,
            };

            const result = await resolver.autoResolve(clientData, serverData, 'progress');

            expect(result.status).toBe('manual');
        });

        test('should return error for unknown conflict type', async () => {
            const result = await resolver.autoResolve({}, {}, 'unknown' as any);

            expect(result.status).toBe('error');
        });
    });
});
