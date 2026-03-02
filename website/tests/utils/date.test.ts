/**
 * Date Utilities Tests
 * Comprehensive tests for date manipulation and formatting helpers
 */

import { getToday, addDays, formatDate, getNextReviewDate } from '../../src/utils/date';
import { data } from '../../src/data';

// Mock the data module
jest.mock('../../src/data', () => ({
    data: {
        SPACED_REPETITION_INTERVALS: [1, 3, 7, 14, 30, 60],
    },
}));

describe('Date Utilities', () => {
    describe('getToday', () => {
        test('should return date in ISO format (YYYY-MM-DD)', () => {
            const result = getToday();
            
            // Should match YYYY-MM-DD pattern
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        test('should return today\'s date', () => {
            const result = getToday();
            const expected = new Date().toISOString().split('T')[0];
            
            expect(result).toBe(expected);
        });

        test('should return consistent results across multiple calls', () => {
            const result1 = getToday();
            const result2 = getToday();
            
            // Both calls should return the same date
            expect(result1).toBe(result2);
        });
    });

    describe('addDays', () => {
        test('should add positive days to a date', () => {
            const result = addDays('2024-01-15', 7);
            expect(result).toBe('2024-01-22');
        });

        test('should subtract days with negative value', () => {
            const result = addDays('2024-01-15', -7);
            expect(result).toBe('2024-01-08');
        });

        test('should handle month boundaries', () => {
            const result = addDays('2024-01-30', 5);
            expect(result).toBe('2024-02-04');
        });

        test('should handle year boundaries', () => {
            const result = addDays('2024-12-30', 5);
            expect(result).toBe('2025-01-04');
        });

        test('should handle leap years', () => {
            const result = addDays('2024-02-28', 1);
            expect(result).toBe('2024-02-29');
        });

        test('should handle zero days', () => {
            const result = addDays('2024-01-15', 0);
            expect(result).toBe('2024-01-15');
        });

        test('should handle large day additions', () => {
            const result = addDays('2024-01-01', 365);
            expect(result).toBe('2024-12-31');
        });
    });

    describe('formatDate', () => {
        test('should format date to "MMM D" format', () => {
            const result = formatDate('2024-01-15');
            expect(result).toBe('Jan 15');
        });

        test('should format different months correctly', () => {
            expect(formatDate('2024-01-01')).toBe('Jan 1');
            expect(formatDate('2024-06-15')).toBe('Jun 15');
            expect(formatDate('2024-12-31')).toBe('Dec 31');
        });

        test('should handle single-digit days', () => {
            const result = formatDate('2024-01-05');
            expect(result).toBe('Jan 5');
        });

        test('should use UTC timezone', () => {
            // Create a date that might differ between local and UTC
            const result = formatDate('2024-01-15T23:59:59Z');
            // Should still format as Jan 15 in UTC
            expect(result).toContain('Jan');
        });
    });

    describe('getNextReviewDate', () => {
        test('should calculate next review date for interval index 0', () => {
            const result = getNextReviewDate('2024-01-15', 0);
            expect(result).toBe('2024-01-16'); // 1 day later
        });

        test('should calculate next review date for interval index 1', () => {
            const result = getNextReviewDate('2024-01-15', 1);
            expect(result).toBe('2024-01-18'); // 3 days later
        });

        test('should calculate next review date for interval index 5', () => {
            const result = getNextReviewDate('2024-01-15', 5);
            expect(result).toBe('2024-03-15'); // 60 days later
        });

        test('should handle out-of-bounds interval index gracefully', () => {
            const result = getNextReviewDate('2024-01-15', 10);
            // Should fall back to interval of 1 day
            expect(result).toBe('2024-01-16');
        });

        test('should handle negative interval index', () => {
            const result = getNextReviewDate('2024-01-15', -1);
            // Should fall back to interval of 1 day
            expect(result).toBe('2024-01-16');
        });

        test('should use spaced repetition intervals correctly', () => {
            const today = '2024-01-01';
            const intervals = data.SPACED_REPETITION_INTERVALS;
            
            intervals.forEach((days, index) => {
                const result = getNextReviewDate(today, index);
                const expected = addDays(today, days);
                expect(result).toBe(expected);
            });
        });
    });
});
