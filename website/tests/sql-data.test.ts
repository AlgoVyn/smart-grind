// --- SQL DATA UNIT TESTS ---

import {
    SQL_DATA,
    TOTAL_UNIQUE_SQL_PROBLEMS,
    getAllSQLProblems,
    getSQLCategoryById,
    flattenSQLData,
} from '../src/data/sql-data';

describe('SQL Data', () => {
    test('SQL_DATA should have 14 categories', () => {
        expect(SQL_DATA).toHaveLength(14);
    });

    test('Each category should have required fields', () => {
        SQL_DATA.forEach((category) => {
            expect(category).toHaveProperty('id');
            expect(category).toHaveProperty('title');
            expect(category).toHaveProperty('icon');
            expect(category).toHaveProperty('topics');
            expect(category.topics).toBeInstanceOf(Array);
            expect(category.topics.length).toBeGreaterThan(0);
        });
    });

    test('Each topic should have required fields', () => {
        SQL_DATA.forEach((category) => {
            category.topics.forEach((topic) => {
                expect(topic).toHaveProperty('id');
                expect(topic).toHaveProperty('name');
                expect(topic).toHaveProperty('patterns');
                expect(topic.patterns).toBeInstanceOf(Array);
                expect(topic.patterns.length).toBeGreaterThan(0);
            });
        });
    });

    test('Each pattern should have problems', () => {
        SQL_DATA.forEach((category) => {
            category.topics.forEach((topic) => {
                topic.patterns.forEach((pattern) => {
                    expect(pattern).toHaveProperty('name');
                    expect(pattern).toHaveProperty('problems');
                    expect(pattern.problems).toBeInstanceOf(Array);
                    // Each pattern should have at least 2 problems (allowing for flexibility with available LeetCode problems)
                    expect(pattern.problems.length).toBeGreaterThanOrEqual(2);
                    // Cap at 5 problems maximum as per requirements
                    expect(pattern.problems.length).toBeLessThanOrEqual(5);
                });
            });
        });
    });

    test('All SQL problem IDs should start with sql-', () => {
        const problems = getAllSQLProblems();
        problems.forEach((problem) => {
            expect(problem.id).toMatch(/^sql-/);
        });
    });

    test('All SQL problems should have valid URLs', () => {
        const problems = getAllSQLProblems();
        problems.forEach((problem) => {
            expect(problem.url).toMatch(/^https:\/\/leetcode\.com\/problems\//);
        });
    });

    test('getSQLCategoryById should return correct category', () => {
        const category = getSQLCategoryById('sql-basics');
        expect(category).toBeDefined();
        expect(category?.title).toBe('SQL Basics');
    });

    test('getSQLCategoryById should return undefined for invalid id', () => {
        const category = getSQLCategoryById('invalid-id');
        expect(category).toBeUndefined();
    });

    test('flattenSQLData should return all problems with context', () => {
        const flattened = flattenSQLData();
        expect(flattened.length).toBe(TOTAL_UNIQUE_SQL_PROBLEMS);

        flattened.forEach((item) => {
            expect(item).toHaveProperty('category');
            expect(item).toHaveProperty('topic');
            expect(item).toHaveProperty('pattern');
            expect(item).toHaveProperty('problem');
        });
    });

    test('Category IDs should be unique', () => {
        const ids = SQL_DATA.map((c) => c.id);
        const uniqueIds = [...new Set(ids)];
        expect(ids).toHaveLength(uniqueIds.length);
    });

    test('Topic IDs should be unique within a category', () => {
        SQL_DATA.forEach((category) => {
            const ids = category.topics.map((t) => t.id);
            const uniqueIds = [...new Set(ids)];
            expect(ids).toHaveLength(uniqueIds.length);
        });
    });

    test('TOTAL_UNIQUE_SQL_PROBLEMS should match actual count', () => {
        const actualCount = getAllSQLProblems().length;
        expect(TOTAL_UNIQUE_SQL_PROBLEMS).toBe(actualCount);
    });

    test('SQL categories should have valid icons', () => {
        const validIcons = [
            'database',
            'git-merge',
            'bar-chart-2',
            'layers',
            'layout-grid',
            'git-branch',
            'layers',
            'type',
            'calendar',
            'git-pull-request',
            'edit-3',
            'cpu',
            'zap',
            'box',
        ];

        SQL_DATA.forEach((category) => {
            expect(validIcons).toContain(category.icon);
        });
    });
});
