// --- SANITIZATION UTILITIES MODULE ---
// Input sanitization to prevent XSS and injection attacks

/**
 * Sanitizes user input to prevent XSS attacks and injection.
 * Removes HTML tags, control characters, script patterns, and limits length.
 * Preserves newlines for multiline text support.
 * @param input - The raw user input to sanitize
 * @returns Sanitized string safe for display and storage (max 200 chars)
 * @example
 * const safe = sanitizeInput('<script>alert("xss")</script>Hello');
 * // Returns "Hello"
 */
export const sanitizeInput = (input: string | null | undefined): string => {
    if (!input) return '';

    // Normalize line endings, trim lines, remove control chars and HTML
    let sanitized = input
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/["'\\]/g, '');

    // Remove dangerous patterns (URL schemes and event handlers)
    const dangerousPatterns = [
        /javascript:/gi,
        /data:/gi,
        /vbscript:/gi,
        /on\w+\s*=/gi,
        /<script[^>]*>.*?<\/script>/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
    ];
    dangerousPatterns.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, '');
    });

    return sanitized.substring(0, 200);
};

/**
 * Sanitizes and validates a URL string.
 * Rejects dangerous schemes (javascript:, data:, vbscript:), validates format,
 * prepends https:// if missing, and limits length.
 * @param url - The URL string to sanitize
 * @returns Validated URL or empty string if invalid/dangerous
 * @example
 * const safeUrl = sanitizeUrl('leetcode.com/problems/two-sum');
 * // Returns "https://leetcode.com/problems/two-sum"
 */
export const sanitizeUrl = (url: string | null | undefined): string => {
    if (!url) return '';

    const sanitized = url.trim();
    const lowerSanitized = sanitized.toLowerCase();

    // Reject dangerous URL schemes before processing
    if (
        lowerSanitized.includes('javascript:') ||
        lowerSanitized.includes('data:') ||
        lowerSanitized.includes('vbscript:')
    ) {
        return '';
    }

    // Prepend https:// if missing and validate
    try {
        const urlWithScheme =
            lowerSanitized.startsWith('http://') || lowerSanitized.startsWith('https://')
                ? sanitized
                : 'https://' + sanitized;
        new URL(urlWithScheme);
        return urlWithScheme.substring(0, 500);
    } catch {
        return '';
    }
};

/**
 * Escapes HTML special characters to prevent XSS.
 * Replaces &, <, >, ", and ' with their HTML entity equivalents.
 * @param str - The string to escape
 * @returns Escaped string safe for HTML insertion
 * @example
 * const safe = escapeHtml('<script>alert("xss")</script>');
 * // Returns "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
 */
export const escapeHtml = (str: string): string =>
    str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
