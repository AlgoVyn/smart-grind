// --- TOP PROBLEMS DATA TESTS ---
// Tests for top LeetCode problems data and helper functions

import { TOP_PROBLEMS, getProblemBySlug, getAllProblemSlugs } from '../../src/data/top-problems';

describe('Top Problems Data', () => {
    describe('TOP_PROBLEMS array', () => {
        it('should contain problems', () => {
            expect(TOP_PROBLEMS.length).toBeGreaterThan(0);
        });

        it('should have unique slugs', () => {
            const slugs = TOP_PROBLEMS.map(p => p.slug);
            const uniqueSlugs = new Set(slugs);
            expect(uniqueSlugs.size).toBe(slugs.length);
        });

        it('should have unique IDs', () => {
            const ids = TOP_PROBLEMS.map(p => p.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it('should have valid difficulty values', () => {
            const validDifficulties = ['Easy', 'Medium', 'Hard'];
            TOP_PROBLEMS.forEach(problem => {
                expect(validDifficulties).toContain(problem.difficulty);
            });
        });

        it('should have valid category types', () => {
            const validTypes = ['c', 'a', 's'];
            TOP_PROBLEMS.forEach(problem => {
                expect(validTypes).toContain(problem.categoryType);
            });
        });

        it('should have non-empty required fields', () => {
            TOP_PROBLEMS.forEach(problem => {
                expect(problem.id).toBeTruthy();
                expect(problem.slug).toBeTruthy();
                expect(problem.title).toBeTruthy();
                expect(problem.description).toBeTruthy();
                expect(problem.category).toBeTruthy();
            });
        });

        it('should have at least one topic per problem', () => {
            TOP_PROBLEMS.forEach(problem => {
                expect(problem.topics.length).toBeGreaterThan(0);
            });
        });

        it('should have at least one company per problem', () => {
            TOP_PROBLEMS.forEach(problem => {
                expect(problem.companies.length).toBeGreaterThan(0);
            });
        });

        it('should contain popular problems like Two Sum', () => {
            const twoSum = TOP_PROBLEMS.find(p => p.slug === 'two-sum');
            expect(twoSum).toBeDefined();
            expect(twoSum?.title).toBe('Two Sum');
            expect(twoSum?.difficulty).toBe('Easy');
        });

        it('should contain medium difficulty problems', () => {
            const mediumProblems = TOP_PROBLEMS.filter(p => p.difficulty === 'Medium');
            expect(mediumProblems.length).toBeGreaterThan(0);
        });

        it('should contain hard difficulty problems', () => {
            const hardProblems = TOP_PROBLEMS.filter(p => p.difficulty === 'Hard');
            expect(hardProblems.length).toBeGreaterThan(0);
        });

        it('should cover all three category types', () => {
            const patterns = TOP_PROBLEMS.filter(p => p.categoryType === 'c');
            const algorithms = TOP_PROBLEMS.filter(p => p.categoryType === 'a');
            const sql = TOP_PROBLEMS.filter(p => p.categoryType === 's');

            expect(patterns.length).toBeGreaterThan(0);
            expect(algorithms.length).toBeGreaterThan(0);
            expect(sql.length).toBeGreaterThan(0);
        });

        it('should have slugs without spaces', () => {
            TOP_PROBLEMS.forEach(problem => {
                expect(problem.slug).not.toContain(' ');
                expect(problem.slug).toMatch(/^[a-z0-9-]+$/);
            });
        });
    });

    describe('getProblemBySlug', () => {
        it('should return problem for valid slug', () => {
            const problem = getProblemBySlug('two-sum');
            expect(problem).toBeDefined();
            expect(problem?.title).toBe('Two Sum');
        });

        it('should return undefined for invalid slug', () => {
            const problem = getProblemBySlug('non-existent-problem');
            expect(problem).toBeUndefined();
        });

        it('should be case sensitive', () => {
            const problem = getProblemBySlug('Two-Sum');
            expect(problem).toBeUndefined();
        });

        it('should return correct problem for various slugs', () => {
            const testCases = [
                { slug: '3sum', expectedTitle: '3Sum' },
                { slug: 'lru-cache', expectedTitle: 'LRU Cache' },
                { slug: 'binary-search', expectedTitle: 'Binary Search' },
            ];

            testCases.forEach(({ slug, expectedTitle }) => {
                const problem = getProblemBySlug(slug);
                expect(problem?.title).toBe(expectedTitle);
            });
        });
    });

    describe('getAllProblemSlugs', () => {
        it('should return array of all slugs', () => {
            const slugs = getAllProblemSlugs();
            expect(slugs.length).toBe(TOP_PROBLEMS.length);
        });

        it('should return slugs as strings', () => {
            const slugs = getAllProblemSlugs();
            slugs.forEach(slug => {
                expect(typeof slug).toBe('string');
            });
        });

        it('should contain specific slugs', () => {
            const slugs = getAllProblemSlugs();
            expect(slugs).toContain('two-sum');
            expect(slugs).toContain('3sum');
            expect(slugs).toContain('lru-cache');
        });
    });
});
