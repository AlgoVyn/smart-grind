// --- SANITIZATION UTILITIES ---
// Pure input sanitization with no application dependencies.
// Safe to import from any module (breaks circular dependency with state.ts).

import DOMPurify from 'dompurify';
import { LIMITS } from '../config/limits';

/**
 * Sanitizes user input by stripping all HTML tags and dangerous content.
 *
 * SECURITY: Uses DOMPurify (a well-audited sanitization library) instead of
 * regex-based patterns, which are notoriously fragile and have been the source
 * of many XSS bypasses. DOMPurify is configured to strip ALL HTML tags
 * (ALLOWED_TAGS: []) since this function is used for plain-text fields like
 * display names, problem names, and notes.
 *
 * Additional hardening:
 * - Removes control characters (except newlines for multi-line notes)
 * - Normalizes line endings
 * - Trims whitespace per line
 * - Enforces a 200-character limit to prevent abuse
 */
export const sanitizeInput = (input: string | null | undefined): string => {
    if (input == null) return '';

    // Normalize line endings and trim whitespace
    let sanitized = input
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        // Remove control characters (except newline \x0A)
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // SECURITY: Use DOMPurify to strip all HTML tags and dangerous content.
    // This is more robust than regex-based stripping which can be bypassed
    // with malformed HTML, encoding tricks, or nested tags.
    // DOMPurify with ALLOWED_TAGS: [] strips ALL HTML while preserving text content.
    sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] });

    // Enforce length limit
    return sanitized.slice(0, LIMITS.STATE.MAX_INPUT_LENGTH);
};

export const sanitizeUrl = (url: string | null | undefined): string => {
    if (!url) return '';

    const sanitized = url.trim();
    const lower = sanitized.toLowerCase();

    if (['javascript:', 'data:', 'vbscript:'].some((p) => lower.includes(p))) return '';

    try {
        const withScheme = /^https?:\/\//i.test(lower) ? sanitized : 'https://' + sanitized;
        new URL(withScheme);
        return withScheme.slice(0, LIMITS.STATE.MAX_URL_LENGTH);
    } catch {
        return '';
    }
};

export const escapeHtml = (str: string): string =>
    str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
