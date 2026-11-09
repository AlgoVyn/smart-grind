/**
 * DOM-free identifiers and field rules shared by the client and
 * Cloudflare Pages Functions (no DOMPurify / browser APIs).
 */

export const RESERVED_OBJECT_KEYS = ['__proto__', 'constructor', 'prototype'] as const;

export const PROBLEM_ID_REGEX = /^[a-zA-Z0-9\-_.:]+$/;

const DANGEROUS_URL_PROTOCOLS = ['javascript:', 'data:', 'vbscript:'] as const;

export function isReservedObjectKey(key: string): boolean {
    return (RESERVED_OBJECT_KEYS as readonly string[]).includes(key);
}

/**
 * True if `id` is a safe map key: allowed charset, length, and not a
 * reserved prototype key.
 */
export function isSafeProblemId(id: unknown, maxLength: number): id is string {
    return (
        typeof id === 'string' &&
        id.length > 0 &&
        id.length <= maxLength &&
        PROBLEM_ID_REGEX.test(id) &&
        !isReservedObjectKey(id)
    );
}

/**
 * True if `url` is empty or a non-dangerous http(s) URL that cannot break
 * out of an HTML attribute.
 */
export function isSafeHttpUrl(url: string, maxLength: number): boolean {
    if (url.length === 0) return true;
    if (url.length > maxLength) return false;
    if (/[<>"`]/.test(url)) return false;

    const trimmed = url.trim();
    const lower = trimmed.toLowerCase();
    if (DANGEROUS_URL_PROTOCOLS.some((p) => lower.startsWith(p) || lower.includes(p))) {
        return false;
    }

    try {
        const withScheme = /^https?:\/\//i.test(lower) ? trimmed : 'https://' + trimmed;
        new URL(withScheme);
        return true;
    } catch {
        return false;
    }
}

export function isIsoDateString(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
}
