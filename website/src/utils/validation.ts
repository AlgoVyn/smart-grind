// --- VALIDATION MODULE ---
// Input validation utilities for user data

import type { Problem, FlashCardProgress } from '../types';
import { LIMITS } from '../config/limits';
import DOMPurify from 'dompurify';

// Local sanitize function to avoid circular dependencies and mocking issues
const sanitizeInput = (input: string | null | undefined): string => {
    if (input === null || input === undefined) {
        return '';
    }
    const str = String(input);
    // Use DOMPurify to remove HTML tags
    const clean = DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    // Limit length to prevent abuse
    return clean.slice(0, LIMITS.STATE.MAX_INPUT_LENGTH);
};

/**
 * Validation result with error messages
 */
export interface ValidationResult<T> {
    valid: boolean;
    data: T | null;
    errors: string[];
}

/**
 * Validates that a value is one of the allowed enum values
 */
const validateEnum = <T extends string>(value: unknown, allowed: readonly T[]): T | null => {
    if (typeof value !== 'string') {
        return null;
    }
    return allowed.includes(value as T) ? (value as T) : null;
};

/**
 * Validates that a value is a valid date string (YYYY-MM-DD format or null)
 */
const validateDateString = (value: unknown, fieldName: string): string | null => {
    if (value === null) return null;
    if (typeof value !== 'string') {
        return `${fieldName} must be a string or null`;
    }
    // Allow empty string or validate YYYY-MM-DD format
    if (value === '') return null;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
        return `${fieldName} must be in YYYY-MM-DD format`;
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return `${fieldName} is not a valid date`;
    }
    return value;
};

/**
 * Validates a problem ID format
 * Expected formats:
 * - Standard: "two-sum", "valid-anagram"
 * - SQL: "sql-basic-joins-01", "sql-aggregations-05"
 * - Numbered: "problem-001", etc.
 */
const validateProblemId = (id: unknown): string | null => {
    if (typeof id !== 'string') {
        return 'Problem ID must be a string';
    }
    if (id.length === 0 || id.length > 100) {
        return 'Problem ID must be between 1 and 100 characters';
    }
    // Allow alphanumeric, hyphens, and some common special characters
    const validIdRegex = /^[a-zA-Z0-9\-_.:]+$/;
    if (!validIdRegex.test(id)) {
        return 'Problem ID contains invalid characters';
    }
    return null;
};

/**
 * Validates a URL is safe (no javascript:, data:, vbscript: protocols)
 */
const validateUrl = (url: unknown): string | null => {
    if (url === undefined || url === null) {
        return null; // Missing URL is allowed (defaults to empty)
    }
    if (typeof url !== 'string') {
        return 'URL must be a string';
    }
    if (url.length === 0) {
        return null; // Empty URL is allowed
    }
    if (url.length > LIMITS.STATE.MAX_URL_LENGTH) {
        return `URL exceeds maximum length of ${LIMITS.STATE.MAX_URL_LENGTH}`;
    }

    const lower = url.toLowerCase();
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
    if (dangerousProtocols.some((p) => lower.startsWith(p))) {
        return 'URL contains dangerous protocol';
    }

    try {
        // Validate it's a valid URL (with or without protocol)
        const withScheme = /^https?:\/\//i.test(lower) ? url : 'https://' + url;
        new URL(withScheme);
        return null;
    } catch {
        return 'URL is not valid';
    }
};

/**
 * Validates and sanitizes a problem object
 * Returns validated problem or null with error messages
 */
export const validateProblem = (input: unknown): ValidationResult<Problem> => {
    const errors: string[] = [];

    if (!input || typeof input !== 'object') {
        return { valid: false, data: null, errors: ['Problem must be an object'] };
    }

    const raw = input as Record<string, unknown>;

    // Validate required string fields using bracket notation for index signature
    const idError = validateProblemId(raw['id']);
    if (idError) errors.push(idError);

    // Name defaults to ID if not provided or empty
    const rawName = typeof raw['name'] === 'string' ? raw['name'] : '';
    const sanitizedName =
        sanitizeInput(rawName) || sanitizeInput((raw['id'] as string) || 'unknown');

    // Topic defaults to empty string
    const rawTopic = typeof raw['topic'] === 'string' ? raw['topic'] : '';
    const sanitizedTopic = sanitizeInput(rawTopic);

    // Pattern defaults to empty string
    const rawPattern = typeof raw['pattern'] === 'string' ? raw['pattern'] : '';
    const sanitizedPattern = sanitizeInput(rawPattern);

    // Validate URL
    const urlError = validateUrl(raw['url']);
    if (urlError) errors.push(urlError);

    // Validate status enum - defaults to 'unsolved'
    const validStatus = validateEnum(raw['status'], ['solved', 'unsolved'] as const) || 'unsolved';

    // Validate review interval (must be non-negative integer)
    const reviewInterval =
        typeof raw['reviewInterval'] === 'number'
            ? Math.max(0, Math.floor(raw['reviewInterval']))
            : 0;

    // Validate next review date
    const nextReviewDate = validateDateString(raw['nextReviewDate'], 'Next review date');
    if (
        nextReviewDate === null &&
        raw['nextReviewDate'] !== null &&
        raw['nextReviewDate'] !== undefined
    ) {
        if (typeof raw['nextReviewDate'] === 'string' && raw['nextReviewDate'] !== '') {
            errors.push('Next review date is not valid');
        }
    }

    // Validate and sanitize note
    const rawNote = typeof raw['note'] === 'string' ? raw['note'] : '';
    const sanitizedNote = sanitizeInput(rawNote);

    // Validate transient UI fields
    const loading = typeof raw['loading'] === 'boolean' ? raw['loading'] : false;
    const noteVisible = typeof raw['noteVisible'] === 'boolean' ? raw['noteVisible'] : false;

    if (errors.length > 0) {
        return { valid: false, data: null, errors };
    }

    const problem: Problem = {
        id: sanitizeInput(((raw['id'] as string) || '').trim()),
        name: sanitizedName,
        url: ((raw['url'] as string) || '').trim(),
        status: validStatus,
        topic: sanitizedTopic,
        pattern: sanitizedPattern,
        reviewInterval,
        nextReviewDate,
        note: sanitizedNote,
        loading,
        noteVisible,
    };

    return { valid: true, data: problem, errors: [] };
};

/**
 * Validates a batch of problems, returning only valid ones with error reporting
 */
export const validateProblemsBatch = (
    inputs: unknown[]
): { valid: Problem[]; invalid: Array<{ index: number; errors: string[] }> } => {
    const valid: Problem[] = [];
    const invalid: Array<{ index: number; errors: string[] }> = [];

    inputs.forEach((input, index) => {
        const result = validateProblem(input);
        if (result.valid && result.data) {
            valid.push(result.data);
        } else {
            invalid.push({ index, errors: result.errors });
        }
    });

    return { valid, invalid };
};

/**
 * Validates flash card progress data
 */
export const validateFlashCardProgress = (input: unknown): ValidationResult<FlashCardProgress> => {
    const errors: string[] = [];

    if (!input || typeof input !== 'object') {
        return { valid: false, data: null, errors: ['Flash card progress must be an object'] };
    }

    const raw = input as Record<string, unknown>;

    // Validate cardId
    if (typeof raw['cardId'] !== 'string' || (raw['cardId'] as string).length === 0) {
        errors.push('Card ID must be a non-empty string');
    }

    // Validate review interval
    const reviewInterval =
        typeof raw['reviewInterval'] === 'number'
            ? Math.max(0, Math.min(5, Math.floor(raw['reviewInterval'])))
            : 0;

    // Validate dates
    const nextReviewDate = validateDateString(raw['nextReviewDate'], 'Next review date');
    const lastReviewedAt = validateDateString(raw['lastReviewedAt'], 'Last reviewed at');

    // Validate counters
    const timesReviewed =
        typeof raw['timesReviewed'] === 'number'
            ? Math.max(0, Math.floor(raw['timesReviewed']))
            : 0;
    const timesCorrect =
        typeof raw['timesCorrect'] === 'number' ? Math.max(0, Math.floor(raw['timesCorrect'])) : 0;

    if (errors.length > 0) {
        return { valid: false, data: null, errors };
    }

    const progress: FlashCardProgress = {
        cardId: ((raw['cardId'] as string) || '').trim(),
        reviewInterval,
        nextReviewDate,
        timesReviewed,
        timesCorrect,
        lastReviewedAt,
    };

    return { valid: true, data: progress, errors: [] };
};

/**
 * Sanitizes and validates a problem ID for use in storage keys
 * Returns null if the ID is invalid
 */
export const sanitizeProblemId = (id: unknown): string | null => {
    if (typeof id !== 'string') return null;
    const trimmed = id.trim();
    if (trimmed.length === 0 || trimmed.length > 100) return null;
    // Remove any potentially dangerous characters
    return trimmed.replace(/[<>'"&]/g, '');
};
