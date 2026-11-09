import {
    parseProblems,
    calculateCurrentRating,
    getFilteredProblems,
} from '../../../chrome-extension/ratings-utils.js';

describe('chrome-extension ratings utils', () => {
    const csv = [
        'Rating\tID\tTitle\tSlug\tContest\tContestID\tTags',
        '1500\t1\tTwo Sum\ttwo-sum\tWeekly\t1\tArray,Hash Table',
        '2100\t2\tMedian\tmedian-of-two-sorted-arrays\tWeekly\t2\tArray,Binary Search',
        '1800\t3\tLongest Substring\tlongest-substring\tWeekly\t3\tString,Sliding Window',
    ].join('\n');

    test('parseProblems reads TSV rows after the header', () => {
        const problems = parseProblems(csv);
        expect(problems).toHaveLength(3);
        expect(problems[0]).toEqual({
            rating: 1500,
            id: '1',
            title: 'Two Sum',
            slug: 'two-sum',
            contest: 'Weekly',
            tags: ['Array', 'Hash Table'],
        });
    });

    test('calculateCurrentRating returns a placeholder with no solves', () => {
        const problems = parseProblems(csv);
        expect(calculateCurrentRating(problems, [])).toBe('--');
    });

    test('calculateCurrentRating uses slug map and recency-weighted EMA', () => {
        const problems = parseProblems(csv);
        const now = Date.now();
        const solved = [
            { slug: 'two-sum', solvedAt: now - 1000 },
            { slug: 'median-of-two-sorted-arrays', solvedAt: now },
        ];
        const rating = calculateCurrentRating(problems, solved);
        expect(typeof rating).toBe('number');
        // Most recent solve is 2100; EMA should sit closer to that than 1500.
        expect(rating).toBeGreaterThan(1700);
        expect(rating).toBeLessThan(2100);
    });

    test('getFilteredProblems filters by rating range and tag', () => {
        const problems = parseProblems(csv);
        expect(getFilteredProblems(problems, 1400, 1600, '')).toHaveLength(1);
        expect(
            getFilteredProblems(problems, 1400, 2200, 'Binary Search').map((p) => p.slug)
        ).toEqual(['median-of-two-sorted-arrays']);
    });
});
