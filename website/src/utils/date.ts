// --- DATE UTILITIES MODULE ---
// Date manipulation and formatting helpers

import { data } from '../data';

/**
 * Gets today's date in ISO format (YYYY-MM-DD).
 * Used for calculating review dates and filtering problems.
 * @returns Today's date in YYYY-MM-DD format, or fallback date '2024-01-01' if parsing fails
 * @example
 * const today = getToday(); // Returns "2024-01-15"
 */
export const getToday = (): string => {
    const today = new Date().toISOString().split('T')[0];
    return today ?? '2024-01-01';
};

/**
 * Adds a specified number of days to a given date.
 * Used for calculating next review dates in the spaced repetition system.
 * @param date - The base date in ISO format (YYYY-MM-DD)
 * @param days - Number of days to add (can be negative for subtraction)
 * @returns The resulting date in YYYY-MM-DD format
 * @example
 * const nextReview = addDays('2024-01-15', 7); // Returns "2024-01-22"
 */
export const addDays = (date: string, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0] ?? date;
};

/**
 * Formats a date string into a human-readable format.
 * Displays month abbreviation and day number in UTC timezone.
 * @param date - The date string to format (ISO format recommended)
 * @returns Formatted date like "Jan 15"
 * @example
 * const formatted = formatDate('2024-01-15'); // Returns "Jan 15"
 */
export const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
    });

/**
 * Calculates the next review date based on the spaced repetition interval.
 * Uses the Leitner system intervals defined in data.SPACED_REPETITION_INTERVALS.
 * @param today - The current date in YYYY-MM-DD format
 * @param intervalIndex - Index into the intervals array (0-5)
 * @returns The next review date in YYYY-MM-DD format
 * @example
 * // First review (1 day later)
 * const next = getNextReviewDate('2024-01-15', 0); // Returns "2024-01-16"
 * // Final interval (60 days later)
 * const final = getNextReviewDate('2024-01-15', 5); // Returns "2024-03-15"
 */
export const getNextReviewDate = (today: string, intervalIndex: number): string => {
    const daysToAdd = data.SPACED_REPETITION_INTERVALS[intervalIndex] ?? 1;
    return addDays(today, daysToAdd);
};
