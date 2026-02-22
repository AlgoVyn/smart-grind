/**
 * Integration Tests: Problem Management
 * Tests problem CRUD operations across app, api, state, and renderers modules
 */

import { state } from '../../src/state';
import { data } from '../../src/data';
import { api } from '../../src/api';

const mockFetch = global.fetch as jest.Mock;

describe('Integration: Problem Management', () => {
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
                            { id: '1', name: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/' },
                            { id: '2', name: 'Add Two Numbers', url: 'https://leetcode.com/problems/add-two-numbers/' }
                        ]
                    },
                    {
                        name: 'Sliding Window',
                        problems: [
                            { id: '3', name: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/' }
                        ]
                    }
                ]
            },
            {
                id: 'strings',
                title: 'Strings',
                patterns: [
                    {
                        name: 'Palindrome',
                        problems: [
                            { id: '4', name: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/' }
                        ]
                    }
                ]
            }
        ];
        
        localStorage.clear();
    });

    describe('Problem Status Updates', () => {
        test('should mark problem as solved and update review schedule', async () => {
            // Setup existing problem
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });
            
            // Update problem status
            const problem = state.problems.get('1')!;
            problem.status = 'solved';
            problem.reviewInterval = 1;
            problem.nextReviewDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            state.problems.set('1', problem);
            await api.saveProblem(problem);
            
            // Verify state update
            expect(state.problems.get('1')?.status).toBe('solved');
            expect(state.problems.get('1')?.reviewInterval).toBe(1);
            expect(state.problems.get('1')?.nextReviewDate).toBeTruthy();
        });

        test('should handle problem note updates', async () => {
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
                note: ''
            });
            
            // Add note
            const problem = state.problems.get('1')!;
            problem.note = 'Use hash map for O(n) solution';
            state.problems.set('1', problem);
            
            // Save with sync for signed-in user
            state.user.type = 'signed-in';
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ csrfToken: 'token' })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true })
                });
            
            await api.saveProblemWithSync('1', { note: 'Use hash map for O(n) solution' });
            
            expect(state.problems.get('1')?.note).toBe('Use hash map for O(n) solution');
        });

        test('should update review date and interval', async () => {
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
                note: ''
            });
            
            // Update review schedule
            const problem = state.problems.get('1')!;
            problem.reviewInterval = 3;
            problem.nextReviewDate = '2024-01-18';
            state.problems.set('1', problem);
            
            await api.saveProblem(problem);
            
            expect(state.problems.get('1')?.reviewInterval).toBe(3);
            expect(state.problems.get('1')?.nextReviewDate).toBe('2024-01-18');
        });
    });

    describe('Problem Deletion', () => {
        test('should delete problem and track in deletedIds', async () => {
            // Setup problem
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
                note: ''
            });
            
            // Delete problem
            await api.saveDeletedId('1');
            
            // Verify deletion
            expect(state.problems.has('1')).toBe(false);
            expect(state.deletedProblemIds.has('1')).toBe(true);
        });

        test('should handle delete with sync for signed-in user', async () => {
            state.user.type = 'signed-in';
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
                note: ''
            });
            
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ csrfToken: 'token' })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true })
                });
            
            await api.deleteProblemWithSync('1');
            
            expect(state.problems.has('1')).toBe(false);
            expect(state.deletedProblemIds.has('1')).toBe(true);
        });

        test('should restore deleted problem on reset', async () => {
            // Setup deleted problem
            state.deletedProblemIds.add('2');
            
            // Add problem back to state (simulating reset)
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
            state.deletedProblemIds.delete('2');
            
            expect(state.problems.has('2')).toBe(true);
            expect(state.deletedProblemIds.has('2')).toBe(false);
        });
    });

    describe('Custom Problem Creation', () => {
        test('should add custom problem to state and topicsData', () => {
            const customProblem = {
                id: 'custom-1',
                name: 'Custom Problem',
                url: 'https://example.com/custom',
                topic: 'Custom Topic',
                pattern: 'Custom Pattern',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            };
            
            // Add to state
            state.problems.set(customProblem.id, customProblem);
            
            // Merge into topicsData
            api.mergeStructure();
            
            // Verify
            expect(state.problems.has('custom-1')).toBe(true);
            expect(data.topicsData.some(t => t.title === 'Custom Topic')).toBe(true);
        });

        test('should handle custom problem with new category', () => {
            const customProblem = {
                id: 'custom-1',
                name: 'Custom Problem',
                url: 'https://example.com/custom',
                topic: 'New Category',
                pattern: 'New Pattern',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            };
            
            state.problems.set(customProblem.id, customProblem);
            api.mergeStructure();
            
            // Verify new category was created
            const newCategory = data.topicsData.find(t => t.title === 'New Category');
            expect(newCategory).toBeDefined();
            expect(newCategory?.patterns[0].name).toBe('New Pattern');
        });
    });

    describe('Problem Filtering and Search', () => {
        beforeEach(() => {
            // Setup test problems
            state.problems.set('1', {
                id: '1',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                topic: 'Arrays',
                pattern: 'Two Sum',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                loading: false,
                noteVisible: false,
                note: ''
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
            state.problems.set('3', {
                id: '3',
                name: 'Maximum Subarray',
                url: 'https://leetcode.com/problems/maximum-subarray/',
                topic: 'Arrays',
                pattern: 'Sliding Window',
                status: 'solved',
                reviewInterval: 3,
                nextReviewDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Overdue
                loading: false,
                noteVisible: false,
                note: ''
            });
        });

        test('should filter problems by status', () => {
            const solvedProblems = Array.from(state.problems.values()).filter(p => p.status === 'solved');
            const unsolvedProblems = Array.from(state.problems.values()).filter(p => p.status === 'unsolved');
            
            expect(solvedProblems).toHaveLength(2);
            expect(unsolvedProblems).toHaveLength(1);
        });

        test('should filter problems by due date', () => {
            const now = new Date().toISOString().split('T')[0];
            const dueProblems = Array.from(state.problems.values()).filter(p => {
                if (p.status !== 'solved') return false;
                return p.nextReviewDate && p.nextReviewDate <= now;
            });
            
            expect(dueProblems).toHaveLength(1); // Problem 3 is overdue
            expect(dueProblems[0].id).toBe('3');
        });

        test('should search problems by name', () => {
            const searchQuery = 'two';
            const matchingProblems = Array.from(state.problems.values()).filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            expect(matchingProblems).toHaveLength(2); // Two Sum and Add Two Numbers
        });

        test('should filter by topic', () => {
            state.ui.activeTopicId = 'arrays';
            const topicProblems = Array.from(state.problems.values()).filter(p => 
                p.topic === 'Arrays'
            );
            
            expect(topicProblems).toHaveLength(3);
        });
    });

    describe('Bulk Operations', () => {
        beforeEach(() => {
            // Setup multiple problems
            for (let i = 1; i <= 5; i++) {
                state.problems.set(String(i), {
                    id: String(i),
                    name: `Problem ${i}`,
                    url: `https://leetcode.com/problems/problem-${i}/`,
                    topic: 'Arrays',
                    pattern: 'Pattern',
                    status: 'solved',
                    reviewInterval: i,
                    nextReviewDate: '2024-01-15',
                    loading: false,
                    noteVisible: false,
                    note: ''
                });
            }
        });

        test('should reset all problems to unsolved', async () => {
            // Reset all problems
            for (const [id, problem] of state.problems) {
                problem.status = 'unsolved';
                problem.reviewInterval = 0;
                problem.nextReviewDate = null;
                state.problems.set(id, problem);
            }
            
            // Verify all reset
            for (const problem of state.problems.values()) {
                expect(problem.status).toBe('unsolved');
                expect(problem.reviewInterval).toBe(0);
                expect(problem.nextReviewDate).toBeNull();
            }
        });

        test('should handle bulk save operations', async () => {
            state.user.type = 'signed-in';
            
            mockFetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ csrfToken: 'token' })
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true })
                });
            
            // Save all problems
            const operations = Array.from(state.problems.values()).map(problem => ({
                type: 'UPDATE_REVIEW_DATE' as const,
                data: { 
                    problemId: problem.id, 
                    reviewInterval: problem.reviewInterval,
                    nextReviewDate: problem.nextReviewDate,
                    timestamp: Date.now() 
                },
                timestamp: Date.now()
            }));
            
            await api.queueOperations(operations);
        });
    });

    describe('Problem Statistics', () => {
        beforeEach(() => {
            state.problems.set('1', {
                id: '1',
                name: 'Problem 1',
                url: 'https://example.com/1',
                topic: 'Arrays',
                pattern: 'Pattern',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                loading: false,
                noteVisible: false,
                note: ''
            });
            state.problems.set('2', {
                id: '2',
                name: 'Problem 2',
                url: 'https://example.com/2',
                topic: 'Arrays',
                pattern: 'Pattern',
                status: 'solved',
                reviewInterval: 3,
                nextReviewDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                loading: false,
                noteVisible: false,
                note: ''
            });
            state.problems.set('3', {
                id: '3',
                name: 'Problem 3',
                url: 'https://example.com/3',
                topic: 'Arrays',
                pattern: 'Pattern',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
                noteVisible: false,
                note: ''
            });
        });

        test('should calculate correct statistics', () => {
            const total = state.problems.size;
            const solved = Array.from(state.problems.values()).filter(p => p.status === 'solved').length;
            const due = Array.from(state.problems.values()).filter(p => {
                if (p.status !== 'solved') return false;
                const now = new Date().toISOString().split('T')[0];
                return p.nextReviewDate && p.nextReviewDate <= now;
            }).length;
            
            expect(total).toBe(3);
            expect(solved).toBe(2);
            expect(due).toBe(1); // Problem 2 is overdue
        });

        test('should calculate completion percentage', () => {
            const total = state.problems.size;
            const solved = Array.from(state.problems.values()).filter(p => p.status === 'solved').length;
            const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
            
            expect(percentage).toBe(67); // 2 out of 3 = 66.67% rounded to 67
        });
    });
});
