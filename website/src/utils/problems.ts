// --- PROBLEM UTILITIES MODULE ---
// Problem filtering, statistics, and ID management

import { Problem } from '../types';
import { state } from '../state';
import { data } from '../data';
import { getToday } from './date';

/**
 * Counts the number of lines in a string, excluding trailing empty lines.
 * @param input - The string to count lines in
 * @returns The number of non-empty lines
 */
export const countLines = (input: string | null | undefined): number => {
    if (!input) return 0;
    const trimmed = input.trimEnd();
    return trimmed ? trimmed.split('\n').length : 0;
};

/**
 * Retrieves all unique problem IDs associated with a specific topic.
 * @param topicId - The topic identifier, or 'all' for all problems
 * @returns Set of unique problem IDs
 */
export const getUniqueProblemIdsForTopic = (topicId: string): Set<string> => {
    if (topicId === 'all') {
        return new Set(
            [...state.problems.entries()]
                .filter(([, p]) => p.pattern !== 'Algorithms')
                .map(([id]) => id)
        );
    }

    const topic = data.topicsData.find((t) => t.id === topicId);
    if (!topic) return new Set();

    return new Set(
        topic.patterns
            .flatMap((p) => p.problems.map((pid) => (typeof pid === 'string' ? pid : pid.id)))
            .filter((id) => state.problems.has(id))
    );
};

/**
 * Calculates statistics for a set of problem IDs.
 * @param ids - Set of problem IDs to calculate stats for
 * @returns Statistics object with total, solved, and due counts
 */
const calculateStats = (ids: Set<string>): { total: number; solved: number; due: number } => {
    const today = getToday();
    let solved = 0;
    let due = 0;

    for (const id of ids) {
        const p = state.problems.get(id);
        if (p?.status === 'solved' && p.nextReviewDate) {
            solved++;
            if (p.nextReviewDate <= today) due++;
        }
    }

    return { total: ids.size, solved, due };
};

/**
 * Calculates statistics for problems in a specific topic.
 * @param topicId - The topic identifier to calculate stats for
 * @returns Statistics object with total, solved, and due counts
 */
export const getUniqueProblemsForTopic = (topicId: string) =>
    calculateStats(getUniqueProblemIdsForTopic(topicId));

/**
 * Retrieves all unique problem IDs including both pattern problems and algorithms.
 * @returns Set of unique problem IDs including algorithms
 */
export const getAllUniqueProblemIdsIncludingAlgorithms = (): Set<string> =>
    new Set(state.problems.keys());

/**
 * Calculates statistics for all problems including algorithms.
 * @returns Statistics object with total, solved, and due counts
 */
export const getAllUniqueProblemsIncludingAlgorithms = () =>
    calculateStats(getAllUniqueProblemIdsIncludingAlgorithms());

/**
 * Determines whether a problem should be displayed based on current filters.
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
    // Status filter checks
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
        (problem.note?.toLowerCase().includes(query) ?? false)
    );
};

/**
 * Extracts all unique review dates from solved problems for the date filter dropdown.
 * @param today - Today's date in YYYY-MM-DD format
 * @param filter - The current filter mode ('review' or 'solved')
 * @returns Sorted array of unique dates (oldest first) in YYYY-MM-DD format
 */
export const getAvailableReviewDates = (today: string, filter: string): string[] => {
    const dates = new Set<string>();
    for (const p of state.problems.values()) {
        if (p.status === 'solved' && p.nextReviewDate !== null) {
            if (filter !== 'review' || p.nextReviewDate <= today) {
                dates.add(p.nextReviewDate);
            }
        }
    }
    return [...dates].sort();
};
