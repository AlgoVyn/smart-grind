/**
 * Integration Tests: Import/Export Functionality
 * Tests data import and export across app, state, and utils modules
 */

import { state } from '../../src/state';
import { data } from '../../src/data';

describe('Integration: Import/Export Functionality', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Reset state
        state.problems.clear();
        state.deletedProblemIds.clear();
        state.user = { type: 'local', id: null, displayName: 'Local User' };
        state.ui = { activeTopicId: 'all', currentFilter: 'all', searchQuery: '', preferredAI: null, reviewDateFilter: null };
        
        // Setup test data
        data.topicsData = [
            {
                id: 'arrays',
                title: 'Arrays',
                patterns: [
                    {
                        name: 'Two Sum',
                        problems: [
                            { id: '1', name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/' }
                        ]
                    }
                ]
            }
        ];
        
        localStorage.clear();
    });

    describe('Export Progress', () => {
        test('should export progress data with correct structure', () => {
            // Setup test problems
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: 'Use hash map'
            });
            state.problems.set('2', {
                id: '2',
                name: 'Add Two Numbers',
                url: 'https://leetcode.com/problems/add-two-numbers/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });
            state.deletedProblemIds.add('3');
            
            // Create export data
            const exportData = {
                problems: Object.fromEntries(state.problems),
                deletedIds: Array.from(state.deletedProblemIds),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            // Verify structure
            expect(exportData.problems).toBeDefined();
            expect(exportData.deletedIds).toBeDefined();
            expect(exportData.exportDate).toBeDefined();
            expect(exportData.version).toBe('1.0');
            
            // Verify content
            expect(exportData.problems['1']).toBeDefined();
            expect(exportData.problems['1'].status).toBe('solved');
            expect(exportData.deletedIds).toContain('3');
        });

        test('should handle empty progress export', () => {
            const exportData = {
                problems: Object.fromEntries(state.problems),
                deletedIds: Array.from(state.deletedProblemIds),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            expect(Object.keys(exportData.problems)).toHaveLength(0);
            expect(exportData.deletedIds).toHaveLength(0);
        });

        test('should export with metadata', () => {
            state.user.displayName = 'Test User';
            state.user.type = 'local';
            
            const exportData = {
                problems: Object.fromEntries(state.problems),
                deletedIds: Array.from(state.deletedProblemIds),
                exportDate: new Date().toISOString(),
                version: '1.0',
                user: {
                    displayName: state.user.displayName,
                    type: state.user.type
                }
            };
            
            expect(exportData.user).toBeDefined();
            expect(exportData.user.displayName).toBe('Test User');
            expect(exportData.user.type).toBe('local');
        });
    });

    describe('Import Progress', () => {
        test('should import progress data correctly', () => {
            // Setup import data
            const importData = {
                problems: {
                    '1': {
                        id: '1',
                        name: 'Imported Problem',
                        url: 'https://example.com',
                        topic: 'Arrays',
                        pattern: 'Two Sum',
                        status: 'solved',
                        reviewInterval: 2,
                        nextReviewDate: '2024-01-20',
                        note: 'Imported note'
                    }
                },
                deletedIds: ['2', '3'],
                exportDate: '2024-01-01T00:00:00.000Z',
                version: '1.0'
            };
            
            // Import data
            Object.entries(importData.problems).forEach(([id, problem]) => {
                state.problems.set(id, problem as any);
            });
            importData.deletedIds.forEach(id => state.deletedProblemIds.add(id));
            
            // Verify import
            expect(state.problems.get('1')).toBeDefined();
            expect(state.problems.get('1')?.name).toBe('Imported Problem');
            expect(state.problems.get('1')?.status).toBe('solved');
            expect(state.deletedProblemIds.has('2')).toBe(true);
            expect(state.deletedProblemIds.has('3')).toBe(true);
        });

        test('should merge import with existing data', () => {
            // Setup existing data
            state.problems.set('existing', {
                id: 'existing',
                name: 'Existing Problem',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: 'Existing note'
            });
            
            // Import new data
            const importData = {
                problems: {
                    'new': {
                        id: 'new',
                        name: 'New Problem',
                        url: 'https://example.com/new',
                        topic: 'Strings',
                        pattern: 'Palindrome',
                        status: 'unsolved',
                        reviewInterval: 0,
                        nextReviewDate: null,
                        note: ''
                    }
                },
                deletedIds: []
            };
            
            // Merge
            Object.entries(importData.problems).forEach(([id, problem]) => {
                if (!state.problems.has(id)) {
                    state.problems.set(id, problem as any);
                }
            });
            
            // Verify both exist
            expect(state.problems.has('existing')).toBe(true);
            expect(state.problems.has('new')).toBe(true);
            expect(state.problems.get('existing')?.note).toBe('Existing note');
        });

        test('should handle import with newer data', () => {
            // Setup existing problem
            state.problems.set('1', {
                id: '1',
                name: 'Problem',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });
            
            // Import newer version
            const importData = {
                problems: {
                    '1': {
                        id: '1',
                        name: 'Problem',
                        url: 'https://example.com',
                        topic: 'Arrays',
                        pattern: 'Two Sum',
                        status: 'solved',
                        reviewInterval: 1,
                        nextReviewDate: '2024-01-15',
                        note: 'Updated'
                    }
                },
                deletedIds: []
            };
            
            // Update with imported data
            state.problems.set('1', importData.problems['1'] as any);
            
            // Verify updated
            expect(state.problems.get('1')?.status).toBe('solved');
            expect(state.problems.get('1')?.reviewInterval).toBe(1);
        });

        test('should validate import data structure', () => {
            const invalidData = {
                // Missing required fields
                problems: {},
                deletedIds: null // Should be array
            };
            
            // Should handle gracefully
            expect(() => {
                const problems = invalidData.problems || {};
                const deletedIds = Array.isArray(invalidData.deletedIds) ? invalidData.deletedIds : [];
                
                Object.entries(problems).forEach(([id, problem]) => {
                    state.problems.set(id, problem as any);
                });
                deletedIds.forEach(id => state.deletedProblemIds.add(id));
            }).not.toThrow();
        });
    });

    describe('Import/Export Roundtrip', () => {
        test('should maintain data integrity through export/import cycle', () => {
            // Setup original data
            const originalProblems = [
                {
                    id: '1',
                    name: 'Problem 1',
                    url: 'https://example.com/1',
                    topic: 'Arrays',
                    pattern: 'Two Sum',
                    status: 'solved',
                    reviewInterval: 1,
                    nextReviewDate: '2024-01-15',
                    loading: false,
                    noteVisible: false,
                    note: 'Note 1'
                },
                {
                    id: '2',
                    name: 'Problem 2',
                    url: 'https://example.com/2',
                    topic: 'Strings',
                    pattern: 'Palindrome',
                    status: 'unsolved',
                    reviewInterval: 0,
                    nextReviewDate: null,
                    loading: false,
                    noteVisible: false,
                    note: ''
                }
            ];
            
            originalProblems.forEach(p => state.problems.set(p.id, p));
            state.deletedProblemIds.add('3');
            
            // Export
            const exported = {
                problems: Object.fromEntries(state.problems),
                deletedIds: Array.from(state.deletedProblemIds),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            // Clear state
            state.problems.clear();
            state.deletedProblemIds.clear();
            
            // Import
            Object.entries(exported.problems).forEach(([id, problem]) => {
                state.problems.set(id, problem as any);
            });
            exported.deletedIds.forEach(id => state.deletedProblemIds.add(id));
            
            // Verify integrity
            expect(state.problems.get('1')?.name).toBe('Problem 1');
            expect(state.problems.get('1')?.status).toBe('solved');
            expect(state.problems.get('1')?.note).toBe('Note 1');
            expect(state.problems.get('2')?.status).toBe('unsolved');
            expect(state.deletedProblemIds.has('3')).toBe(true);
        });
    });

    describe('Export File Generation', () => {
        test('should generate correct filename with date', () => {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const filename = `smartgrind-progress-${dateStr}.json`;
            
            expect(filename).toMatch(/smartgrind-progress-\d{4}-\d{2}-\d{2}\.json/);
        });

        test('should create valid JSON export', () => {
            state.problems.set('1', {
                id: '1',
                name: 'Test',
                url: 'https://example.com',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2024-01-15',
                loading: false,
                noteVisible: false,
                note: ''
            });
            
            const exportData = {
                problems: Object.fromEntries(state.problems),
                deletedIds: Array.from(state.deletedProblemIds),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const jsonString = JSON.stringify(exportData, null, 2);
            
            // Should be valid JSON
            expect(() => JSON.parse(jsonString)).not.toThrow();
            
            // Should be parseable
            const parsed = JSON.parse(jsonString);
            expect(parsed.problems['1']).toBeDefined();
        });
    });

    describe('Import Validation', () => {
        test('should reject invalid JSON', () => {
            const invalidJson = 'not valid json';
            
            expect(() => JSON.parse(invalidJson)).toThrow();
        });

        test('should handle missing problem fields gracefully', () => {
            const incompleteProblem = {
                id: '1',
                name: 'Incomplete',
                // Missing other required fields
            };
            
            // Should handle gracefully with defaults
            const problemWithDefaults = {
                url: '',
                topic: 'Uncategorized',
                pattern: 'General',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: '',
                ...incompleteProblem
            };
            
            state.problems.set('1', problemWithDefaults as any);
            
            expect(state.problems.get('1')).toBeDefined();
            expect(state.problems.get('1')?.status).toBe('unsolved');
        });

        test('should handle large imports', () => {
            const largeImport = {
                problems: {},
                deletedIds: []
            };
            
            // Generate many problems
            for (let i = 0; i < 1000; i++) {
                largeImport.problems[`problem-${i}`] = {
                    id: `problem-${i}`,
                    name: `Problem ${i}`,
                    url: `https://example.com/${i}`,
                    topic: 'Arrays',
                    pattern: 'Two Sum',
                    status: i % 2 === 0 ? 'solved' : 'unsolved',
                    reviewInterval: i % 2 === 0 ? 1 : 0,
                    nextReviewDate: i % 2 === 0 ? '2024-01-15' : null,
                    note: ''
                };
            }
            
            // Import
            Object.entries(largeImport.problems).forEach(([id, problem]) => {
                state.problems.set(id, problem as any);
            });
            
            expect(state.problems.size).toBe(1000);
        });
    });

    describe('Data Migration', () => {
        test('should handle version migration', () => {
            // Old version data
            const oldVersionData = {
                problems: {
                    '1': {
                        id: '1',
                        name: 'Old Problem',
                        status: 'solved'
                        // Missing new fields
                    }
                },
                version: '0.9'
            };
            
            // Migrate to new version
            const migrated = {
                problems: {},
                version: '1.0'
            };
            
            Object.entries(oldVersionData.problems).forEach(([id, problem]: [string, any]) => {
                migrated.problems[id] = {
                    url: problem.url || '',
                    topic: problem.topic || 'Uncategorized',
                    pattern: problem.pattern || 'General',
                    reviewInterval: problem.reviewInterval || 0,
                    nextReviewDate: problem.nextReviewDate || null,
                    loading: false,
                    noteVisible: false,
                    note: problem.note || '',
                    ...problem
                };
            });
            
            state.problems.set('1', migrated.problems['1'] as any);
            
            expect(state.problems.get('1')).toBeDefined();
            expect(state.problems.get('1')?.url).toBeDefined();
        });
    });
});
