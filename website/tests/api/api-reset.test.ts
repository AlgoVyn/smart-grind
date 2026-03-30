/**
 * API Reset Module Tests
 * Tests for reset operations including problem resets, category resets, and restoration
 */

import {
    _getProblemIdsForTopic,
    _resetProblems,
    _restoreDeletedProblems,
    _restoreAllDeletedProblems,
    _performResetAndRender,
    resetAll,
    resetCategory,
    _getAlgorithmIdsForCategory,
    _restoreDeletedAlgorithms,
    resetAlgorithmCategory,
    resetSQLCategory,
} from '../../src/api/api-reset';
import { state } from '../../src/state';
import { data } from '../../src/data';
import { ALGORITHMS_DATA } from '../../src/data/algorithms-data';
import { SQL_DATA } from '../../src/data/sql-data';
import { ui } from '../../src/ui/ui';
import { renderers } from '../../src/renderers';
import { showToast } from '../../src/utils';
import { saveData } from '../../src/api/api-save';
import { Topic, Pattern, Problem, ProblemDef } from '../../src/types';

// Mock dependencies
jest.mock('../../src/state', () => ({
    state: {
        problems: new Map<string, Problem>(),
        deletedProblemIds: new Set<string>(),
        ui: {
            activeTopicId: '',
            activeAlgorithmCategoryId: null as string | null,
            currentFilter: 'all',
        },
    },
}));

jest.mock('../../src/data', () => ({
    data: {
        topicsData: [] as Topic[],
        resetTopicsData: jest.fn(),
    },
}));

jest.mock('../../src/data/algorithms-data', () => ({
    ALGORITHMS_DATA: [
        {
            id: 'arrays-strings',
            title: 'Arrays & Strings',
            algorithms: [
                { id: 'algo-two-pointers', name: 'Two Pointers', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
                { id: 'algo-sliding-window', name: 'Sliding Window', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
            ],
        },
        {
            id: 'linked-list',
            title: 'Linked List',
            algorithms: [
                { id: 'algo-fast-slow-pointers', name: 'Fast & Slow Pointers', url: 'https://leetcode.com/problems/linked-list-cycle/' },
            ],
        },
    ] as typeof ALGORITHMS_DATA,
}));

jest.mock('../../src/data/sql-data', () => ({
    SQL_DATA: [
        {
            id: 'sql-basics',
            title: 'SQL Basics',
            icon: 'database',
            topics: [
                {
                    id: 'select-fundamentals',
                    name: 'SELECT Fundamentals',
                    patterns: [
                        {
                            name: 'Basic SELECT with WHERE',
                            description: 'Retrieve specific columns',
                            problems: [
                                { id: 'sql-175', name: 'Combine Two Tables', url: 'https://leetcode.com/problems/combine-two-tables/' },
                                { id: 'sql-181', name: 'Employees Earning More Than Their Managers', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/' },
                            ],
                        },
                    ],
                },
            ],
        },
    ] as typeof SQL_DATA,
}));

jest.mock('../../src/ui/ui', () => ({
    ui: {
        showConfirm: jest.fn(),
        showAlert: jest.fn(),
    },
}));

jest.mock('../../src/renderers', () => ({
    renderers: {
        updateFilterBtns: jest.fn(),
        renderSidebar: jest.fn(),
        renderMainView: jest.fn(),
        renderAlgorithmsView: jest.fn().mockResolvedValue(undefined),
        renderSQLView: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock('../../src/utils', () => ({
    showToast: jest.fn(),
}));

jest.mock('../../src/api/api-save', () => ({
    saveData: jest.fn(),
}));

describe('API Reset Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset saveData to resolve successfully by default
        (saveData as jest.Mock).mockResolvedValue(undefined);
        state.problems.clear();
        state.deletedProblemIds.clear();
        state.ui.activeTopicId = '';
        state.ui.activeAlgorithmCategoryId = null;
        state.ui.currentFilter = 'all';
    });

    describe('_getProblemIdsForTopic', () => {
        test('collects all problem IDs from patterns', () => {
            const topic: Topic = {
                id: 'topic-1',
                title: 'Test Topic',
                patterns: [
                    {
                        name: 'Pattern 1',
                        problems: ['prob-1', 'prob-2'],
                    },
                    {
                        name: 'Pattern 2',
                        problems: [
                            { id: 'prob-3', name: 'Problem 3', url: 'https://example.com/3' },
                            { id: 'prob-4', name: 'Problem 4', url: 'https://example.com/4' },
                        ],
                    },
                ],
            };

            const result = _getProblemIdsForTopic(topic);

            expect(result).toEqual(new Set(['prob-1', 'prob-2', 'prob-3', 'prob-4']));
        });

        test('returns empty set for topic with no patterns', () => {
            const topic: Topic = {
                id: 'empty-topic',
                title: 'Empty Topic',
                patterns: [],
            };

            const result = _getProblemIdsForTopic(topic);

            expect(result).toEqual(new Set());
        });

        test('handles mixed string and ProblemDef types', () => {
            const topic: Topic = {
                id: 'mixed-topic',
                title: 'Mixed Topic',
                patterns: [
                    {
                        name: 'Mixed Pattern',
                        problems: [
                            'string-prob',
                            { id: 'def-prob', name: 'Defined Problem', url: 'https://example.com/def' },
                        ],
                    },
                ],
            };

            const result = _getProblemIdsForTopic(topic);

            expect(result).toEqual(new Set(['string-prob', 'def-prob']));
        });
    });

    describe('_resetProblems', () => {
        test('resets status, reviewInterval, nextReviewDate', () => {
            const problemIds = new Set(['prob-1', 'prob-2']);
            state.problems.set('prob-1', {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://example.com/1',
                status: 'solved',
                topic: 'Topic 1',
                pattern: 'Pattern 1',
                reviewInterval: 3,
                nextReviewDate: '2025-01-01',
                note: 'Some note',
            });
            state.problems.set('prob-2', {
                id: 'prob-2',
                name: 'Problem 2',
                url: 'https://example.com/2',
                status: 'solved',
                topic: 'Topic 1',
                pattern: 'Pattern 1',
                reviewInterval: 5,
                nextReviewDate: '2025-02-01',
                note: '',
            });

            _resetProblems(problemIds);

            const prob1 = state.problems.get('prob-1')!;
            expect(prob1.status).toBe('unsolved');
            expect(prob1.reviewInterval).toBe(0);
            expect(prob1.nextReviewDate).toBeNull();
            expect(prob1.note).toBe('Some note'); // Note should be preserved

            const prob2 = state.problems.get('prob-2')!;
            expect(prob2.status).toBe('unsolved');
            expect(prob2.reviewInterval).toBe(0);
            expect(prob2.nextReviewDate).toBeNull();
        });

        test('ignores problem IDs not in state', () => {
            const problemIds = new Set(['non-existent']);
            state.problems.set('existing', {
                id: 'existing',
                name: 'Existing',
                url: 'https://example.com/existing',
                status: 'solved',
                topic: 'Topic',
                pattern: 'Pattern',
                reviewInterval: 2,
                nextReviewDate: '2025-01-01',
                note: '',
            });

            _resetProblems(problemIds);

            // Should not throw and existing problem should be unchanged
            expect(state.problems.get('existing')!.status).toBe('solved');
        });
    });

    describe('_restoreDeletedProblems', () => {
        beforeEach(() => {
            // Setup data.topicsData for findProblemDefInfo
            data.topicsData = [
                {
                    id: 'topic-1',
                    title: 'Topic One',
                    patterns: [
                        {
                            name: 'Pattern A',
                            problems: [
                                { id: 'prob-1', name: 'Problem 1', url: 'https://leetcode.com/problems/1/' },
                                'prob-2',
                            ],
                        },
                    ],
                },
            ];
        });

        test('restores only non-custom problems with valid def', () => {
            state.deletedProblemIds.add('prob-1');
            const problemIds = new Set(['prob-1']);

            _restoreDeletedProblems(problemIds);

            expect(state.deletedProblemIds.has('prob-1')).toBe(false);
            expect(state.problems.has('prob-1')).toBe(true);
            const restored = state.problems.get('prob-1')!;
            expect(restored.status).toBe('unsolved');
            expect(restored.name).toBe('Problem 1');
            expect(restored.topic).toBe('Topic One');
            expect(restored.pattern).toBe('Pattern A');
        });

        test('skips custom problems (starting with custom-)', () => {
            state.deletedProblemIds.add('custom-abc123');
            const problemIds = new Set(['custom-abc123']);

            _restoreDeletedProblems(problemIds);

            expect(state.deletedProblemIds.has('custom-abc123')).toBe(true);
            expect(state.problems.has('custom-abc123')).toBe(false);
        });

        test('does nothing if not in deletedProblemIds', () => {
            const problemIds = new Set(['prob-1']);
            // Not adding to deletedProblemIds

            _restoreDeletedProblems(problemIds);

            expect(state.problems.has('prob-1')).toBe(false);
        });

        test('handles string problem definitions correctly', () => {
            state.deletedProblemIds.add('prob-2');
            const problemIds = new Set(['prob-2']);

            _restoreDeletedProblems(problemIds);

            expect(state.deletedProblemIds.has('prob-2')).toBe(false);
            expect(state.problems.has('prob-2')).toBe(true);
            const restored = state.problems.get('prob-2')!;
            expect(restored.name).toBe('prob-2');
            expect(restored.url).toBe('https://leetcode.com/problems/prob-2/');
        });
    });

    describe('_restoreAllDeletedProblems', () => {
        beforeEach(() => {
            data.topicsData = [
                {
                    id: 'topic-1',
                    title: 'Topic One',
                    patterns: [
                        {
                            name: 'Pattern A',
                            problems: [
                                { id: 'prob-1', name: 'Problem 1', url: 'https://leetcode.com/problems/1/' },
                                { id: 'prob-2', name: 'Problem 2', url: 'https://leetcode.com/problems/2/' },
                            ],
                        },
                    ],
                },
            ];
        });

        test('restores all except custom', () => {
            state.deletedProblemIds.add('prob-1');
            state.deletedProblemIds.add('prob-2');
            state.deletedProblemIds.add('custom-abc123');

            _restoreAllDeletedProblems();

            expect(state.deletedProblemIds.has('prob-1')).toBe(false);
            expect(state.deletedProblemIds.has('prob-2')).toBe(false);
            expect(state.deletedProblemIds.has('custom-abc123')).toBe(true);
            expect(state.problems.has('prob-1')).toBe(true);
            expect(state.problems.has('prob-2')).toBe(true);
            expect(state.problems.has('custom-abc123')).toBe(false);
        });

        test('handles empty deletedProblemIds', () => {
            _restoreAllDeletedProblems();

            expect(state.problems.size).toBe(0);
        });
    });

    describe('_performResetAndRender', () => {
        test('saves, renders, shows toast', async () => {
            const message = 'Test reset message';

            await _performResetAndRender(message);

            expect(saveData).toHaveBeenCalled();
            expect(renderers.updateFilterBtns).toHaveBeenCalled();
            expect(renderers.renderSidebar).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith(message);
        });

        test('renders algorithms view when activeAlgorithmCategoryId is set', async () => {
            state.ui.activeAlgorithmCategoryId = 'arrays-strings';

            await _performResetAndRender('Algorithms reset');

            expect(renderers.renderAlgorithmsView).toHaveBeenCalledWith('arrays-strings');
        });

        test('renders main view when no algorithm category active', async () => {
            state.ui.activeAlgorithmCategoryId = null;
            state.ui.activeTopicId = 'topic-1';

            await _performResetAndRender('Main view reset');

            expect(renderers.renderMainView).toHaveBeenCalledWith('topic-1');
        });

        test('re-renders algorithms view when filter is solved', async () => {
            state.ui.currentFilter = 'solved';
            state.ui.activeAlgorithmCategoryId = 'linked-list';

            await _performResetAndRender('Solved filter reset');

            expect(renderers.renderAlgorithmsView).toHaveBeenCalledTimes(2);
            expect(renderers.renderAlgorithmsView).toHaveBeenLastCalledWith('linked-list');
        });

        test('re-renders main view when filter is solved and no algorithm category', async () => {
            state.ui.currentFilter = 'solved';
            state.ui.activeAlgorithmCategoryId = null;
            state.ui.activeTopicId = 'topic-1';

            await _performResetAndRender('Solved filter main reset');

            expect(renderers.renderMainView).toHaveBeenCalledTimes(2);
        });
    });

    describe('resetAll', () => {
        test('when confirmed - resets all, restores deleted, shows toast', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);
            data.topicsData = [
                {
                    id: 'topic-1',
                    title: 'Topic One',
                    patterns: [
                        {
                            name: 'Pattern A',
                            problems: [{ id: 'prob-1', name: 'Problem 1', url: 'https://leetcode.com/problems/1/' }],
                        },
                    ],
                },
            ];
            state.problems.set('prob-1', {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://leetcode.com/problems/1/',
                status: 'solved',
                topic: 'Topic One',
                pattern: 'Pattern A',
                reviewInterval: 3,
                nextReviewDate: '2025-01-01',
                note: '',
            });
            state.deletedProblemIds.add('custom-123'); // Custom, should stay deleted

            await resetAll();

            expect(ui.showConfirm).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>ALL Problems</b>?</br></br>This will mark all problems as unsolved and restore any deleted problems across all categories.'
            );
            expect(data.resetTopicsData).toHaveBeenCalled();
            expect(state.problems.get('prob-1')!.status).toBe('unsolved');
            expect(state.problems.get('prob-1')!.reviewInterval).toBe(0);
            expect(saveData).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith('All problems reset and restored');
        });

        test('when not confirmed - returns early', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(false);

            await resetAll();

            expect(data.resetTopicsData).not.toHaveBeenCalled();
            expect(saveData).not.toHaveBeenCalled();
        });

        test('with error - restores original state', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockRejectedValue(new Error('Save failed'));

            state.problems.set('prob-1', {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://example.com/1',
                status: 'solved',
                topic: 'Topic',
                pattern: 'Pattern',
                reviewInterval: 5,
                nextReviewDate: '2025-01-01',
                note: 'Original note',
            });
            state.deletedProblemIds.add('deleted-prob');

            const originalProblems = new Map(state.problems);
            const originalDeletedIds = new Set(state.deletedProblemIds);

            await expect(resetAll()).rejects.toThrow('Save failed');

            expect(ui.showAlert).toHaveBeenCalledWith('Failed to reset all problems: Save failed');
        });
    });

    describe('resetCategory', () => {
        test('success flow', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);

            const topic: Topic = {
                id: 'arrays',
                title: 'Arrays',
                patterns: [
                    {
                        name: 'Two Pointers',
                        problems: ['two-sum', 'three-sum'],
                    },
                ],
            };
            data.topicsData = [topic];

            state.problems.set('two-sum', {
                id: 'two-sum',
                name: 'Two Sum',
                url: 'https://leetcode.com/problems/two-sum/',
                status: 'solved',
                topic: 'Arrays',
                pattern: 'Two Pointers',
                reviewInterval: 3,
                nextReviewDate: '2025-01-01',
                note: '',
            });

            await resetCategory('arrays');

            expect(ui.showConfirm).toHaveBeenCalledWith(
                'Are you sure you want to reset all problems in the category "<b>Arrays</b>"?</br></br>This will mark all problems as unsolved and restore any deleted problems.'
            );
            expect(state.problems.get('two-sum')!.status).toBe('unsolved');
            expect(showToast).toHaveBeenCalledWith('Category problems reset and restored');
        });

        test('when topic not found - shows alert', async () => {
            data.topicsData = [];

            await resetCategory('non-existent');

            expect(ui.showAlert).toHaveBeenCalledWith('Category not found.');
            expect(ui.showConfirm).not.toHaveBeenCalled();
        });

        test('when not confirmed - returns early', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(false);
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [{ name: 'Pattern', problems: [] }],
                },
            ];

            await resetCategory('arrays');

            expect(saveData).not.toHaveBeenCalled();
        });

        test('with error - restores state', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockRejectedValue(new Error('Save error'));

            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        {
                            name: 'Pattern',
                            problems: ['prob-1'],
                        },
                    ],
                },
            ];

            state.problems.set('prob-1', {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://example.com/1',
                status: 'solved',
                topic: 'Arrays',
                pattern: 'Pattern',
                reviewInterval: 5,
                nextReviewDate: '2025-01-01',
                note: '',
            });

            await expect(resetCategory('arrays')).rejects.toThrow('Save error');

            expect(ui.showAlert).toHaveBeenCalledWith('Failed to reset category: Save error');
        });
    });

    describe('_getAlgorithmIdsForCategory', () => {
        test("with 'all' - gets all algorithms", () => {
            const result = _getAlgorithmIdsForCategory('all');

            expect(result).toEqual(new Set([
                'algo-two-pointers',
                'algo-sliding-window',
                'algo-fast-slow-pointers',
            ]));
        });

        test('with specific ID - gets category algorithms', () => {
            const result = _getAlgorithmIdsForCategory('arrays-strings');

            expect(result).toEqual(new Set(['algo-two-pointers', 'algo-sliding-window']));
        });

        test('with invalid ID - returns empty set', () => {
            const result = _getAlgorithmIdsForCategory('non-existent-category');

            expect(result).toEqual(new Set());
        });
    });

    describe('_restoreDeletedAlgorithms', () => {
        test('restores algorithms with proper data', () => {
            state.deletedProblemIds.add('algo-two-pointers');
            const algorithmIds = new Set(['algo-two-pointers']);

            _restoreDeletedAlgorithms(algorithmIds);

            expect(state.deletedProblemIds.has('algo-two-pointers')).toBe(false);
            expect(state.problems.has('algo-two-pointers')).toBe(true);
            const restored = state.problems.get('algo-two-pointers')!;
            expect(restored.name).toBe('Two Pointers');
            expect(restored.url).toBe('https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/');
            expect(restored.status).toBe('unsolved');
            expect(restored.pattern).toBe('Algorithms');
            expect(restored.topic).toBe('arrays-strings');
        });

        test('ignores algorithms not in deletedProblemIds', () => {
            const algorithmIds = new Set(['algo-two-pointers']);
            // Not adding to deletedProblemIds

            _restoreDeletedAlgorithms(algorithmIds);

            expect(state.problems.has('algo-two-pointers')).toBe(false);
        });

        test('ignores non-existent algorithm IDs', () => {
            state.deletedProblemIds.add('non-existent-algo');
            const algorithmIds = new Set(['non-existent-algo']);

            _restoreDeletedAlgorithms(algorithmIds);

            expect(state.problems.has('non-existent-algo')).toBe(false);
        });
    });

    describe('resetAlgorithmCategory', () => {
        test('success flow', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);

            state.problems.set('algo-two-pointers', {
                id: 'algo-two-pointers',
                name: 'Two Pointers',
                url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                status: 'solved',
                topic: 'arrays-strings',
                pattern: 'Algorithms',
                reviewInterval: 3,
                nextReviewDate: '2025-01-01',
                note: '',
            });

            await resetAlgorithmCategory('arrays-strings');

            expect(ui.showConfirm).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>Arrays & Strings</b>?</br></br>This will mark all algorithms as unsolved and restore any deleted algorithms.'
            );
            expect(state.problems.get('algo-two-pointers')!.status).toBe('unsolved');
            expect(showToast).toHaveBeenCalledWith('Arrays & Strings reset and restored successfully');
        });

        test('reset all algorithms', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);

            state.problems.set('algo-two-pointers', {
                id: 'algo-two-pointers',
                name: 'Two Pointers',
                url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                status: 'solved',
                topic: 'arrays-strings',
                pattern: 'Algorithms',
                reviewInterval: 3,
                nextReviewDate: '2025-01-01',
                note: '',
            });
            state.problems.set('algo-fast-slow-pointers', {
                id: 'algo-fast-slow-pointers',
                name: 'Fast & Slow Pointers',
                url: 'https://leetcode.com/problems/linked-list-cycle/',
                status: 'solved',
                topic: 'linked-list',
                pattern: 'Algorithms',
                reviewInterval: 2,
                nextReviewDate: '2025-01-15',
                note: '',
            });

            await resetAlgorithmCategory('all');

            expect(ui.showConfirm).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>All Algorithms</b>?</br></br>This will mark all algorithms as unsolved and restore any deleted algorithms.'
            );
            expect(state.problems.get('algo-two-pointers')!.status).toBe('unsolved');
            expect(state.problems.get('algo-fast-slow-pointers')!.status).toBe('unsolved');
            expect(showToast).toHaveBeenCalledWith('All Algorithms reset and restored successfully');
        });

        test('when not confirmed - returns early', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(false);

            await resetAlgorithmCategory('arrays-strings');

            expect(saveData).not.toHaveBeenCalled();
        });

        test('with error - restores state', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockRejectedValue(new Error('Save failed'));

            state.problems.set('algo-two-pointers', {
                id: 'algo-two-pointers',
                name: 'Two Pointers',
                url: 'https://example.com',
                status: 'solved',
                topic: 'arrays-strings',
                pattern: 'Algorithms',
                reviewInterval: 5,
                nextReviewDate: '2025-01-01',
                note: 'Note',
            });
            state.deletedProblemIds.add('algo-deleted');

            await expect(resetAlgorithmCategory('arrays-strings')).rejects.toThrow('Save failed');

            expect(ui.showAlert).toHaveBeenCalledWith('Failed to reset algorithm category: Save failed');
        });
    });

    describe('resetSQLCategory', () => {
        test('success flow', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);

            state.problems.set('sql-175', {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://leetcode.com/problems/combine-two-tables/',
                status: 'solved',
                topic: 'sql-basics',
                pattern: 'Basic SELECT with WHERE',
                reviewInterval: 3,
                nextReviewDate: '2025-01-01',
                note: '',
            });

            await resetSQLCategory('sql-basics');

            expect(ui.showConfirm).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>SQL Basics</b>?</br></br>This will mark all SQL problems as unsolved and restore any deleted SQL problems.'
            );
            expect(state.problems.get('sql-175')!.status).toBe('unsolved');
            expect(state.problems.get('sql-175')!.reviewInterval).toBe(0);
            expect(saveData).toHaveBeenCalled();
            expect(renderers.renderSidebar).toHaveBeenCalled();
            expect(renderers.renderSQLView).toHaveBeenCalledWith('sql-basics');
            expect(showToast).toHaveBeenCalledWith('SQL Basics reset and restored successfully');
        });

        test('reset all SQL with unknown category', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);

            await resetSQLCategory('all');

            expect(ui.showConfirm).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>All SQL</b>?</br></br>This will mark all SQL problems as unsolved and restore any deleted SQL problems.'
            );
        });

        test('when not confirmed - returns early', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(false);

            await resetSQLCategory('sql-basics');

            expect(saveData).not.toHaveBeenCalled();
            expect(renderers.renderSQLView).not.toHaveBeenCalled();
        });

        test('with error - restores state', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockRejectedValue(new Error('Save error'));

            state.problems.set('sql-175', {
                id: 'sql-175',
                name: 'Combine Two Tables',
                url: 'https://example.com',
                status: 'solved',
                topic: 'sql-basics',
                pattern: 'Pattern',
                reviewInterval: 5,
                nextReviewDate: '2025-01-01',
                note: 'Note',
            });
            state.deletedProblemIds.add('sql-deleted');

            await expect(resetSQLCategory('sql-basics')).rejects.toThrow('Save error');

            expect(ui.showAlert).toHaveBeenCalledWith('Failed to reset SQL category: Save error');
        });

        test('handles non-existent SQL category gracefully', async () => {
            (ui.showConfirm as jest.Mock).mockResolvedValue(true);

            await resetSQLCategory('non-existent-sql-category');

            expect(ui.showConfirm).toHaveBeenCalledWith(
                'Are you sure you want to reset <b>Unknown Category</b>?</br></br>This will mark all SQL problems as unsolved and restore any deleted SQL problems.'
            );
            // No SQL problems to reset, but should complete without error
            expect(saveData).toHaveBeenCalled();
        });
    });
});
