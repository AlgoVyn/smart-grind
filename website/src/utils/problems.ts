// --- PROBLEM UTILITIES MODULE ---
// Problem filtering, statistics, and ID management

import { Problem, Topic, ProblemDef } from '../types';
import { state } from '../state';
import { data } from '../data';
import { getToday } from './date';

/**
 * Counts the number of lines in a string, excluding trailing empty lines.
 * Used for determining textarea height and validating note content.
 * @param input - The string to count lines in
 * @returns The number of non-empty lines (0 if input is null/undefined/empty)
 * @example
 * const lines = countLines('Line 1\nLine 2\n'); // Returns 2
 * const empty = countLines(null); // Returns 0
 */
export const countLines = (input: string | null | undefined): number => {
    if (!input) return 0;
    // Trim trailing newlines to avoid counting empty trailing lines
    const trimmed = input.trimEnd();
    if (!trimmed) return 0;
    return trimmed.split('\n').length;
};

/**
 * Retrieves all unique problem IDs associated with a specific topic.
 * For 'all', returns all problem IDs in state (excluding algorithms).
 * For specific topics, filters to only problems defined in that topic's patterns.
 * @param topicId - The topic identifier, or 'all' for all problems
 * @returns Set of unique problem IDs
 * @example
 * const allIds = getUniqueProblemIdsForTopic('all');
 * const arrayIds = getUniqueProblemIdsForTopic('arrays');
 */
export const getUniqueProblemIdsForTopic = (topicId: string): Set<string> => {
    const ids = new Set<string>();
    if (topicId === 'all') {
        // For 'all', only include pattern problems (exclude algorithms)
        state.problems.forEach((problem: Problem, id: string) => {
            if (problem.pattern !== 'Algorithms') {
                ids.add(id);
            }
        });
    } else {
        const topicObj = data.topicsData.find((t: Topic) => t.id === topicId);
        if (topicObj) {
            topicObj.patterns.forEach((pattern: { problems: (string | ProblemDef)[] }) =>
                pattern.problems.forEach((pid: string | ProblemDef) => {
                    const id = typeof pid === 'string' ? pid : pid.id;
                    if (state.problems.has(id)) {
                        ids.add(id);
                    }
                })
            );
        }
    }
    return ids;
};

/**
 * Calculates statistics for problems in a specific topic.
 * Returns total count, solved count, and due-for-review count.
 * @param topicId - The topic identifier to calculate stats for
 * @returns Statistics object with total, solved, and due counts
 * @example
 * const stats = getUniqueProblemsForTopic('arrays');
 * // Returns { total: 50, solved: 30, due: 5 }
 */
export const getUniqueProblemsForTopic = (
    topicId: string
): { total: number; solved: number; due: number } => {
    const today = getToday();
    const uniqueIds = getUniqueProblemIdsForTopic(topicId);
    let solved = 0;
    let due = 0;

    uniqueIds.forEach((id: string) => {
        const problem = state.problems.get(id);
        if (problem && problem.status === 'solved' && problem.nextReviewDate) {
            solved++;
            if (problem.nextReviewDate <= today) due++;
        }
    });

    return {
        total: uniqueIds.size,
        solved,
        due,
    };
};

/**
 * Retrieves all unique problem IDs including both pattern problems and algorithms.
 * Used for calculating total progress across all content.
 * @returns Set of unique problem IDs including algorithms
 * @example
 * const allIds = getAllUniqueProblemIdsIncludingAlgorithms();
 * // Returns Set of all problem and algorithm IDs
 */
export const getAllUniqueProblemIdsIncludingAlgorithms = (): Set<string> => {
    const ids = new Set<string>();
    // Add all pattern problems
    state.problems.forEach((_problem: Problem, id: string) => {
        ids.add(id);
    });
    return ids;
};

/**
 * Calculates statistics for all problems including algorithms.
 * Returns total count, solved count, and due-for-review count across all content.
 * @returns Statistics object with total, solved, and due counts
 * @example
 * const stats = getAllUniqueProblemsIncludingAlgorithms();
 * // Returns { total: 385, solved: 200, due: 10 } - includes both problems and algorithms
 */
export const getAllUniqueProblemsIncludingAlgorithms = (): {
    total: number;
    solved: number;
    due: number;
} => {
    const today = getToday();
    const uniqueIds = getAllUniqueProblemIdsIncludingAlgorithms();
    let solved = 0;
    let due = 0;

    uniqueIds.forEach((id: string) => {
        const problem = state.problems.get(id);
        if (problem && problem.status === 'solved' && problem.nextReviewDate) {
            solved++;
            if (problem.nextReviewDate <= today) due++;
        }
    });

    return {
        total: uniqueIds.size,
        solved,
        due,
    };
};

/**
 * Determines whether a problem should be displayed based on current filters.
 * Applies status filter, date filter (for review/solved modes), and search query.
 * @param problem - The problem object to evaluate
 * @param filter - The current filter mode ('all', 'unsolved', 'solved', 'review')
 * @param searchQuery - The user's search query (case-insensitive)
 * @param today - Today's date in YYYY-MM-DD format
 * @returns True if the problem should be displayed
 */
export const shouldShowProblem = (
    problem: Problem,
    filter: string,
    searchQuery: string,
    today: string
): boolean => {
    // Status filter check
    if (filter === 'unsolved' && problem.status !== 'unsolved') return false;
    if (filter === 'solved' && problem.status !== 'solved') return false;
    if (
        filter === 'review' &&
        (problem.status !== 'solved' || !problem.nextReviewDate || problem.nextReviewDate > today)
    ) {
        return false;
    }

    // Date filter for review/solved modes
    if (
        (filter === 'review' || filter === 'solved') &&
        state.ui.reviewDateFilter &&
        problem.nextReviewDate !== state.ui.reviewDateFilter
    ) {
        return false;
    }

    // Search query filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
        problem.name.toLowerCase().includes(query) ||
        problem.note?.toLowerCase().includes(query) ||
        false
    );
};

/**
 * Extracts all unique review dates from solved problems for the date filter dropdown.
 * For 'review' filter: only includes dates that are due (today or earlier).
 * For 'solved' filter: includes all future review dates.
 * @param today - Today's date in YYYY-MM-DD format
 * @param filter - The current filter mode ('review' or 'solved')
 * @returns Sorted array of unique dates (oldest first) in YYYY-MM-DD format
 * @example
 * const dates = getAvailableReviewDates('2024-01-15', 'review');
 * // Returns ['2024-01-10', '2024-01-15'] - only due dates
 */
export const getAvailableReviewDates = (today: string, filter: string): string[] => {
    const dates = new Set<string>();
    state.problems.forEach((problem: Problem) => {
        if (problem.status === 'solved' && problem.nextReviewDate !== null) {
            const isDue = problem.nextReviewDate <= today;
            // For review filter: only include due dates; for solved: include all
            if (filter !== 'review' || isDue) {
                dates.add(problem.nextReviewDate);
            }
        }
    });
    return Array.from(dates).sort();
};
