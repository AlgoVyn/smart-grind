/**
 * API Delete Module Tests
 * Tests for delete operations including categories, algorithm categories, and SQL categories
 */

import {
    _validateCategoryDeletion,
    _storeOriginalState,
    _removeCategoryAndProblems,
    _removeAlgorithmCategoryAndProblems,
    _removeSQLCategoryAndProblems,
    _handleActiveTopicSwitch,
    _restoreOriginalState,
    deleteCategory,
    deleteAlgorithmCategory,
    deleteSQLCategory,
} from '../../src/api/api-delete';
import { state } from '../../src/state';
import { data } from '../../src/data';
import { ALGORITHMS_DATA, AlgorithmCategory } from '../../src/data/algorithms-data';
import { SQL_DATA, SQLCategory } from '../../src/data/sql-data';
import { showAlert, showConfirm } from '../../src/ui/ui-modals';
import { renderSidebar, renderMainView, renderAlgorithmsView, renderSQLView } from '../../src/renderers';
import { updateUrlParameter, showToast } from '../../src/utils';
import { saveData } from '../../src/api/api-save';
import { Topic, Problem } from '../../src/types';

// Mock dependencies
jest.mock('../../src/state', () => ({
    markDeletedIdsDirty: jest.fn(),
    markProblemDirty: jest.fn(),
    markFlashCardsDirty: jest.fn(),
    state: {
        problems: new Map<string, Problem>(),
        deletedProblemIds: new Set<string>(),
        ui: {
            activeTopicId: '',
            activeAlgorithmCategoryId: null as string | null,
            activeSQLCategoryId: null as string | null,
        },
    },
}));

jest.mock('../../src/data', () => ({
    data: {
        topicsData: [] as Topic[],
    },
}));

jest.mock('../../src/data/algorithms-data', () => ({
    ALGORITHMS_DATA: [] as AlgorithmCategory[],
    AlgorithmCategory: jest.fn(),
}));

jest.mock('../../src/data/sql-data', () => ({
    SQL_DATA: [] as SQLCategory[],
    SQLCategory: jest.fn(),
}));

jest.mock('../../src/ui/ui-modals', () => ({
    showAlert: jest.fn(),
    showConfirm: jest.fn(),
}));

jest.mock('../../src/renderers', () => ({
    renderSidebar: jest.fn(),
    renderMainView: jest.fn(),
    renderAlgorithmsView: jest.fn(),
    renderSQLView: jest.fn(),
}));

jest.mock('../../src/utils', () => ({
    updateUrlParameter: jest.fn(),
    showToast: jest.fn(),
}));

jest.mock('../../src/api/api-save', () => ({
    saveData: jest.fn(),
}));

describe('API Delete Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Reset state
        state.problems = new Map<string, Problem>();
        state.deletedProblemIds = new Set<string>();
        state.ui.activeTopicId = '';
        state.ui.activeAlgorithmCategoryId = null;
        state.ui.activeSQLCategoryId = null;

        // Reset data
        data.topicsData = [];

        // Reset ALGORITHMS_DATA
        (ALGORITHMS_DATA as AlgorithmCategory[]) = [];

        // Reset SQL_DATA
        (SQL_DATA as SQLCategory[]) = [];
    });

    describe('_validateCategoryDeletion', () => {
        test('with valid topic - shows confirm, returns topic when confirmed', async () => {
            const topic: Topic = {
                id: 'arrays',
                title: 'Arrays & Strings',
                patterns: [],
            };
            data.topicsData = [topic];
            (showConfirm as jest.Mock).mockResolvedValue(true);

            const result = await _validateCategoryDeletion('arrays');

            expect(showConfirm).toHaveBeenCalledWith(
                'Are you sure you want to delete the category "<b>Arrays & Strings</b>" and all its associated problems? This action cannot be undone.'
            );
            expect(result).toEqual(topic);
        });

        test('with invalid topic - shows alert, returns null', async () => {
            data.topicsData = [];

            const result = await _validateCategoryDeletion('non-existent');

            expect(showAlert).toHaveBeenCalledWith('Category not found.');
            expect(result).toBeNull();
        });

        test('when not confirmed - returns null', async () => {
            const topic: Topic = {
                id: 'arrays',
                title: 'Arrays & Strings',
                patterns: [],
            };
            data.topicsData = [topic];
            (showConfirm as jest.Mock).mockResolvedValue(false);

            const result = await _validateCategoryDeletion('arrays');

            expect(showConfirm).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('_storeOriginalState', () => {
        test('stores all state correctly (topicsData, problems, deletedProblemIds, activeTopicId)', () => {
            const topic1: Topic = { id: 'arrays', title: 'Arrays', patterns: [] };
            const topic2: Topic = { id: 'dp', title: 'Dynamic Programming', patterns: [] };
            data.topicsData = [topic1, topic2];

            const problem1: Problem = {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://leetcode.com/1',
                status: 'solved',
                topic: 'Arrays',
                pattern: 'Pattern A',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: 'Note 1',
            };
            const problem2: Problem = {
                id: 'prob-2',
                name: 'Problem 2',
                url: 'https://leetcode.com/2',
                status: 'unsolved',
                topic: 'Arrays',
                pattern: 'Pattern A',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };
            state.problems.set('prob-1', problem1);
            state.problems.set('prob-2', problem2);

            state.deletedProblemIds.add('deleted-1');
            state.deletedProblemIds.add('deleted-2');

            state.ui.activeTopicId = 'arrays';

            const originalState = _storeOriginalState();

            // Verify topicsData is copied
            expect(originalState.topicsData).toEqual([topic1, topic2]);
            expect(originalState.topicsData).not.toBe(data.topicsData);

            // Verify problems Map is copied
            expect(originalState.problems.size).toBe(2);
            expect(originalState.problems.get('prob-1')).toEqual(problem1);
            expect(originalState.problems.get('prob-2')).toEqual(problem2);
            expect(originalState.problems).not.toBe(state.problems);

            // Verify problem objects are cloned
            expect(originalState.problems.get('prob-1')).not.toBe(problem1);

            // Verify deletedProblemIds is copied
            expect(originalState.deletedProblemIds).toEqual(new Set(['deleted-1', 'deleted-2']));
            expect(originalState.deletedProblemIds).not.toBe(state.deletedProblemIds);

            // Verify activeTopicId is copied
            expect(originalState.activeTopicId).toBe('arrays');
        });
    });

    describe('_removeCategoryAndProblems', () => {
        test('removes topic from topicsData and associated problems', () => {
            const topicToRemove: Topic = {
                id: 'arrays',
                title: 'Arrays & Strings',
                patterns: [],
            };
            const otherTopic: Topic = {
                id: 'dp',
                title: 'Dynamic Programming',
                patterns: [],
            };
            data.topicsData = [topicToRemove, otherTopic];

            // Add problems associated with the topic
            const problem1: Problem = {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://leetcode.com/1',
                status: 'solved',
                topic: 'Arrays & Strings',
                pattern: 'Pattern A',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            const problem2: Problem = {
                id: 'prob-2',
                name: 'Problem 2',
                url: 'https://leetcode.com/2',
                status: 'unsolved',
                topic: 'Arrays & Strings',
                pattern: 'Pattern B',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };
            const otherProblem: Problem = {
                id: 'prob-3',
                name: 'Problem 3',
                url: 'https://leetcode.com/3',
                status: 'solved',
                topic: 'Dynamic Programming',
                pattern: 'Pattern C',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            state.problems.set('prob-1', problem1);
            state.problems.set('prob-2', problem2);
            state.problems.set('prob-3', otherProblem);

            _removeCategoryAndProblems(topicToRemove);

            // Verify topic is removed from topicsData
            expect(data.topicsData).toHaveLength(1);
            expect(data.topicsData[0]).toEqual(otherTopic);

            // Verify associated problems are removed from state.problems
            expect(state.problems.has('prob-1')).toBe(false);
            expect(state.problems.has('prob-2')).toBe(false);

            // Verify associated problems are added to deletedProblemIds
            expect(state.deletedProblemIds.has('prob-1')).toBe(true);
            expect(state.deletedProblemIds.has('prob-2')).toBe(true);

            // Verify other problems are not affected
            expect(state.problems.has('prob-3')).toBe(true);
            expect(state.deletedProblemIds.has('prob-3')).toBe(false);
        });
    });

    describe('_removeAlgorithmCategoryAndProblems', () => {
        test("removes algorithms with pattern='Algorithms' and matching topic", () => {
            // Add algorithm problems with pattern='Algorithms'
            const algoProblem1: Problem = {
                id: 'algo-1',
                name: 'Algorithm 1',
                url: 'https://leetcode.com/a1',
                status: 'solved',
                topic: 'sorting-algorithms',
                pattern: 'Algorithms',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            const algoProblem2: Problem = {
                id: 'algo-2',
                name: 'Algorithm 2',
                url: 'https://leetcode.com/a2',
                status: 'unsolved',
                topic: 'sorting-algorithms',
                pattern: 'Algorithms',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };
            // Problem with same topic but different pattern
            const otherPatternProblem: Problem = {
                id: 'prob-3',
                name: 'Problem 3',
                url: 'https://leetcode.com/3',
                status: 'solved',
                topic: 'sorting-algorithms',
                pattern: 'Pattern A',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            // Algorithm with different topic
            const otherTopicAlgo: Problem = {
                id: 'algo-3',
                name: 'Algorithm 3',
                url: 'https://leetcode.com/a3',
                status: 'solved',
                topic: 'graph-algorithms',
                pattern: 'Algorithms',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };

            state.problems.set('algo-1', algoProblem1);
            state.problems.set('algo-2', algoProblem2);
            state.problems.set('prob-3', otherPatternProblem);
            state.problems.set('algo-3', otherTopicAlgo);

            _removeAlgorithmCategoryAndProblems('sorting-algorithms', 'Sorting Algorithms');

            // Verify algorithms with matching topic and pattern='Algorithms' are removed
            expect(state.problems.has('algo-1')).toBe(false);
            expect(state.problems.has('algo-2')).toBe(false);

            // Verify they are added to deletedProblemIds
            expect(state.deletedProblemIds.has('algo-1')).toBe(true);
            expect(state.deletedProblemIds.has('algo-2')).toBe(true);

            // Verify problem with different pattern is not affected
            expect(state.problems.has('prob-3')).toBe(true);
            expect(state.deletedProblemIds.has('prob-3')).toBe(false);

            // Verify algorithm with different topic is not affected
            expect(state.problems.has('algo-3')).toBe(true);
            expect(state.deletedProblemIds.has('algo-3')).toBe(false);
        });

        test('also matches by category title', () => {
            const algoProblem: Problem = {
                id: 'algo-1',
                name: 'Algorithm 1',
                url: 'https://leetcode.com/a1',
                status: 'solved',
                topic: 'Sorting Algorithms', // matches by title
                pattern: 'Algorithms',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };

            state.problems.set('algo-1', algoProblem);

            _removeAlgorithmCategoryAndProblems('sorting-algorithms', 'Sorting Algorithms');

            expect(state.problems.has('algo-1')).toBe(false);
            expect(state.deletedProblemIds.has('algo-1')).toBe(true);
        });
    });

    describe('_removeSQLCategoryAndProblems', () => {
        test("removes SQL problems with id starting with 'sql-' and matching topic", () => {
            // Add SQL problems with id starting with 'sql-'
            const sqlProblem1: Problem = {
                id: 'sql-175',
                name: 'SQL Problem 175',
                url: 'https://leetcode.com/sql175',
                status: 'solved',
                topic: 'sql-basics',
                pattern: 'SQL',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            const sqlProblem2: Problem = {
                id: 'sql-181',
                name: 'SQL Problem 181',
                url: 'https://leetcode.com/sql181',
                status: 'unsolved',
                topic: 'sql-basics',
                pattern: 'SQL',
                reviewInterval: 0,
                nextReviewDate: null,
                note: '',
            };
            // Problem with sql- prefix but different topic
            const otherTopicSql: Problem = {
                id: 'sql-200',
                name: 'SQL Problem 200',
                url: 'https://leetcode.com/sql200',
                status: 'solved',
                topic: 'sql-joins',
                pattern: 'SQL',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            // Problem with matching topic but no sql- prefix
            const nonSqlProblem: Problem = {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://leetcode.com/1',
                status: 'solved',
                topic: 'sql-basics',
                pattern: 'SQL',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };

            state.problems.set('sql-175', sqlProblem1);
            state.problems.set('sql-181', sqlProblem2);
            state.problems.set('sql-200', otherTopicSql);
            state.problems.set('prob-1', nonSqlProblem);

            _removeSQLCategoryAndProblems('sql-basics', 'SQL Basics');

            // Verify SQL problems with matching topic are removed
            expect(state.problems.has('sql-175')).toBe(false);
            expect(state.problems.has('sql-181')).toBe(false);

            // Verify they are added to deletedProblemIds
            expect(state.deletedProblemIds.has('sql-175')).toBe(true);
            expect(state.deletedProblemIds.has('sql-181')).toBe(true);

            // Verify SQL problem with different topic is not affected
            expect(state.problems.has('sql-200')).toBe(true);
            expect(state.deletedProblemIds.has('sql-200')).toBe(false);

            // Verify non-sql problem is not affected
            expect(state.problems.has('prob-1')).toBe(true);
            expect(state.deletedProblemIds.has('prob-1')).toBe(false);
        });

        test('also matches by category title', () => {
            const sqlProblem: Problem = {
                id: 'sql-175',
                name: 'SQL Problem 175',
                url: 'https://leetcode.com/sql175',
                status: 'solved',
                topic: 'SQL Basics', // matches by title
                pattern: 'SQL',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };

            state.problems.set('sql-175', sqlProblem);

            _removeSQLCategoryAndProblems('sql-basics', 'SQL Basics');

            expect(state.problems.has('sql-175')).toBe(false);
            expect(state.deletedProblemIds.has('sql-175')).toBe(true);
        });
    });

    describe('_handleActiveTopicSwitch', () => {
        test('when active topic is deleted - clears activeTopicId and updates URL', () => {
            state.ui.activeTopicId = 'arrays';

            _handleActiveTopicSwitch('arrays');

            expect(state.ui.activeTopicId).toBe('');
            expect(updateUrlParameter).toHaveBeenCalledWith('category', null);
        });

        test('when different topic deleted - does nothing', () => {
            state.ui.activeTopicId = 'dp';

            _handleActiveTopicSwitch('arrays');

            expect(state.ui.activeTopicId).toBe('dp');
            expect(updateUrlParameter).not.toHaveBeenCalled();
        });
    });

    describe('_restoreOriginalState', () => {
        test('restores all state correctly', () => {
            // Setup original data
            const originalTopics: Topic[] = [
                { id: 'arrays', title: 'Arrays', patterns: [] },
                { id: 'dp', title: 'Dynamic Programming', patterns: [] },
            ];

            const problem1: Problem = {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://leetcode.com/1',
                status: 'solved',
                topic: 'Arrays',
                pattern: 'Pattern A',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            const originalProblems = new Map<string, Problem>([['prob-1', problem1]]);

            const originalDeletedIds = new Set<string>(['deleted-1']);

            const originalState = {
                topicsData: originalTopics,
                problems: originalProblems,
                deletedProblemIds: originalDeletedIds,
                activeTopicId: 'arrays',
            };

            // Modify current state to simulate changes
            data.topicsData = [{ id: 'graphs', title: 'Graphs', patterns: [] }];
            state.problems = new Map<string, Problem>([
                [
                    'prob-2',
                    {
                        id: 'prob-2',
                        name: 'Problem 2',
                        url: 'https://leetcode.com/2',
                        status: 'unsolved',
                        topic: 'Graphs',
                        pattern: 'Pattern B',
                        reviewInterval: 0,
                        nextReviewDate: null,
                        note: '',
                    },
                ],
            ]);
            state.deletedProblemIds = new Set<string>(['deleted-2']);
            state.ui.activeTopicId = 'graphs';

            _restoreOriginalState(originalState);

            // Verify topicsData is restored
            expect(data.topicsData).toEqual(originalTopics);

            // Verify problems are restored
            expect(state.problems).toBe(originalProblems);
            expect(state.problems.get('prob-1')).toEqual(problem1);

            // Verify deletedProblemIds are restored
            expect(state.deletedProblemIds).toBe(originalDeletedIds);
            expect(state.deletedProblemIds.has('deleted-1')).toBe(true);

            // Verify activeTopicId is restored
            expect(state.ui.activeTopicId).toBe('arrays');
        });
    });

    describe('deleteCategory', () => {
        test('success flow', async () => {
            const topic: Topic = {
                id: 'arrays',
                title: 'Arrays & Strings',
                patterns: [],
            };
            data.topicsData = [topic];
            (showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockResolvedValue(undefined);

            await deleteCategory('arrays');

            // Verify category is removed
            expect(data.topicsData).toHaveLength(0);

            // Verify saveData is called
            expect(saveData).toHaveBeenCalled();

            // Verify re-render functions are called
            expect(renderSidebar).toHaveBeenCalled();
            expect(renderMainView).toHaveBeenCalledWith('');

            // Verify toast is shown
            expect(showToast).toHaveBeenCalledWith('Category and associated problems removed');
        });

        test('when validation fails - early return', async () => {
            data.topicsData = [];

            await deleteCategory('non-existent');

            // Verify alert is shown
            expect(showAlert).toHaveBeenCalledWith('Category not found.');

            // Verify saveData is not called
            expect(saveData).not.toHaveBeenCalled();

            // Verify re-render functions are not called
            expect(renderSidebar).not.toHaveBeenCalled();
        });

        test('with error - restores state and shows alert', async () => {
            const topic: Topic = {
                id: 'arrays',
                title: 'Arrays & Strings',
                patterns: [],
            };
            const otherTopic: Topic = {
                id: 'dp',
                title: 'Dynamic Programming',
                patterns: [],
            };
            data.topicsData = [topic, otherTopic];

            const problem: Problem = {
                id: 'prob-1',
                name: 'Problem 1',
                url: 'https://leetcode.com/1',
                status: 'solved',
                topic: 'Arrays & Strings',
                pattern: 'Pattern A',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            state.problems.set('prob-1', problem);
            state.ui.activeTopicId = 'arrays';

            (showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockRejectedValue(new Error('Network error'));

            await expect(deleteCategory('arrays')).rejects.toThrow('Network error');

            // Verify state is restored
            expect(data.topicsData).toHaveLength(2);
            expect(data.topicsData[0]).toEqual(topic);
            expect(state.problems.has('prob-1')).toBe(true);
            expect(state.ui.activeTopicId).toBe('arrays');

            // Verify alert is shown with error message
            expect(showAlert).toHaveBeenCalledWith('Failed to delete category: Network error');
        });
    });

    describe('deleteAlgorithmCategory', () => {
        test('success flow', async () => {
            const category: AlgorithmCategory = {
                id: 'sorting',
                title: 'Sorting Algorithms',
                algorithms: [],
            };
            (ALGORITHMS_DATA as AlgorithmCategory[]) = [category];
            (showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockResolvedValue(undefined);
            (renderAlgorithmsView as jest.Mock).mockResolvedValue(undefined);

            await deleteAlgorithmCategory('sorting');

            // Verify saveData is called
            expect(saveData).toHaveBeenCalled();

            // Verify re-render functions are called
            expect(renderSidebar).toHaveBeenCalled();
            expect(renderAlgorithmsView).toHaveBeenCalledWith('sorting');

            // Verify toast is shown
            expect(showToast).toHaveBeenCalledWith('Algorithm category and associated algorithms removed');
        });

        test('when category not found', async () => {
            (ALGORITHMS_DATA as AlgorithmCategory[]) = [];

            await deleteAlgorithmCategory('non-existent');

            // Verify alert is shown
            expect(showAlert).toHaveBeenCalledWith('Algorithm category not found.');

            // Verify saveData is not called
            expect(saveData).not.toHaveBeenCalled();
        });

        test('when not confirmed', async () => {
            const category: AlgorithmCategory = {
                id: 'sorting',
                title: 'Sorting Algorithms',
                algorithms: [],
            };
            (ALGORITHMS_DATA as AlgorithmCategory[]) = [category];
            (showConfirm as jest.Mock).mockResolvedValue(false);

            await deleteAlgorithmCategory('sorting');

            // Verify saveData is not called
            expect(saveData).not.toHaveBeenCalled();

            // Verify re-render functions are not called
            expect(renderSidebar).not.toHaveBeenCalled();
        });

        test('with error - restores state', async () => {
            const category: AlgorithmCategory = {
                id: 'sorting',
                title: 'Sorting Algorithms',
                algorithms: [],
            };
            (ALGORITHMS_DATA as AlgorithmCategory[]) = [category];

            const algoProblem: Problem = {
                id: 'algo-1',
                name: 'Algorithm 1',
                url: 'https://leetcode.com/a1',
                status: 'solved',
                topic: 'sorting',
                pattern: 'Algorithms',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            state.problems.set('algo-1', algoProblem);

            (showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockRejectedValue(new Error('Save failed'));

            await expect(deleteAlgorithmCategory('sorting')).rejects.toThrow('Save failed');

            // Verify state is restored
            expect(state.problems.has('algo-1')).toBe(true);
            expect(showAlert).toHaveBeenCalledWith('Failed to delete algorithm category: Save failed');
        });
    });

    describe('deleteSQLCategory', () => {
        test('success flow', async () => {
            const category: SQLCategory = {
                id: 'sql-basics',
                title: 'SQL Basics',
                icon: 'database',
                topics: [],
            };
            (SQL_DATA as SQLCategory[]) = [category];
            (showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockResolvedValue(undefined);
            (renderSQLView as jest.Mock).mockResolvedValue(undefined);

            await deleteSQLCategory('sql-basics');

            // Verify saveData is called
            expect(saveData).toHaveBeenCalled();

            // Verify re-render functions are called
            expect(renderSidebar).toHaveBeenCalled();
            expect(renderSQLView).toHaveBeenCalledWith('sql-basics');

            // Verify toast is shown
            expect(showToast).toHaveBeenCalledWith('SQL category and associated SQL problems removed');
        });

        test('when category not found', async () => {
            (SQL_DATA as SQLCategory[]) = [];

            await deleteSQLCategory('non-existent');

            // Verify alert is shown
            expect(showAlert).toHaveBeenCalledWith('SQL category not found.');

            // Verify saveData is not called
            expect(saveData).not.toHaveBeenCalled();
        });

        test('when not confirmed', async () => {
            const category: SQLCategory = {
                id: 'sql-basics',
                title: 'SQL Basics',
                icon: 'database',
                topics: [],
            };
            (SQL_DATA as SQLCategory[]) = [category];
            (showConfirm as jest.Mock).mockResolvedValue(false);

            await deleteSQLCategory('sql-basics');

            // Verify saveData is not called
            expect(saveData).not.toHaveBeenCalled();

            // Verify re-render functions are not called
            expect(renderSidebar).not.toHaveBeenCalled();
        });

        test('with error - restores state', async () => {
            const category: SQLCategory = {
                id: 'sql-basics',
                title: 'SQL Basics',
                icon: 'database',
                topics: [],
            };
            (SQL_DATA as SQLCategory[]) = [category];

            const sqlProblem: Problem = {
                id: 'sql-175',
                name: 'SQL Problem 175',
                url: 'https://leetcode.com/sql175',
                status: 'solved',
                topic: 'sql-basics',
                pattern: 'SQL',
                reviewInterval: 1,
                nextReviewDate: '2024-01-01',
                note: '',
            };
            state.problems.set('sql-175', sqlProblem);
            state.ui.activeTopicId = 'arrays'; // Set activeTopicId (stored in original state)

            (showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockRejectedValue(new Error('Delete failed'));

            await expect(deleteSQLCategory('sql-basics')).rejects.toThrow('Delete failed');

            // Verify state is restored (problems are restored)
            expect(state.problems.has('sql-175')).toBe(true);
            // activeTopicId is restored by _restoreOriginalState
            expect(state.ui.activeTopicId).toBe('arrays');
            expect(showAlert).toHaveBeenCalledWith('Failed to delete SQL category: Delete failed');
        });

        test('clears active SQL category when deleted category was active', async () => {
            const category: SQLCategory = {
                id: 'sql-basics',
                title: 'SQL Basics',
                icon: 'database',
                topics: [],
            };
            (SQL_DATA as SQLCategory[]) = [category];
            state.ui.activeSQLCategoryId = 'sql-basics';

            (showConfirm as jest.Mock).mockResolvedValue(true);
            (saveData as jest.Mock).mockResolvedValue(undefined);
            (renderSQLView as jest.Mock).mockResolvedValue(undefined);

            await deleteSQLCategory('sql-basics');

            // Verify active SQL category is cleared
            expect(state.ui.activeSQLCategoryId).toBe('');
            expect(updateUrlParameter).toHaveBeenCalledWith('sql', null);
        });
    });
});
