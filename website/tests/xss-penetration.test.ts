/**
 * XSS Penetration Tests
 * 
 * These tests verify that DOMPurify and our sanitization functions properly
 * handle various XSS attack vectors, including edge cases and encoding tricks.
 * 
 * SECURITY: These tests are critical for preventing XSS vulnerabilities.
 * Any failure in these tests indicates a potential security vulnerability.
 */

import { sanitizeInput, sanitizeUrl, escapeHtml } from '../src/utils';

// Mock DOMPurify to simulate proper sanitization behavior in test environment
// This mock approximates DOMPurify's default behavior of stripping all HTML tags
jest.mock('dompurify', () => ({
    __esModule: true,
    default: {
        sanitize: jest.fn((input: string, options: { ALLOWED_TAGS?: string[]; ALLOWED_ATTR?: string[] } = {}) => {
            // If ALLOWED_TAGS is explicitly empty array, strip all tags (secure mode)
            if (options.ALLOWED_TAGS?.length === 0) {
                return input.replace(/<[^>]*>/g, '');
            }
            // Default: strip common dangerous tags and attributes
            // This is a simplified approximation - real DOMPurify has more complex rules
            let result = input;
            // Remove script and event handler attributes
            result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            result = result.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
            result = result.replace(/on\w+\s*=\s*[^\s>]+/gi, '');
            // Remove javascript: protocols
            result = result.replace(/javascript\s*:\s*[^"']*/gi, '');
            return result;
        }),
    },
}));

describe('XSS Penetration Tests', () => {
    describe('sanitizeInput() - DOMPurify Integration', () => {
        test('should strip basic script tags', () => {
            const input = '<script>alert("XSS")</script>';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<script>');
            expect(result).not.toContain('</script>');
            expect(result).toBe('alert("XSS")');
        });

        test('should strip JavaScript protocol from anchors', () => {
            const input = '<a href="javascript:alert(\'XSS\')">Click me</a>';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<a');
            expect(result).not.toContain('href');
        });

        test('should handle malicious onload attributes', () => {
            const input = '<img src="x" onload="alert(\'XSS\')">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<img');
            expect(result).not.toContain('onload');
        });

        test('should handle onerror attributes', () => {
            const input = '<img src="invalid" onerror="alert(\'XSS\')">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('onerror');
        });

        test('should strip all event handlers', () => {
            const handlers = [
                'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover',
                'onmousemove', 'onmouseout', 'onkeydown', 'onkeypress', 'onkeyup',
                'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset', 'onselect',
                'onload', 'onunload', 'onerror', 'onresize', 'onscroll'
            ];
            
            for (const handler of handlers) {
                const input = `<div ${handler}="alert('XSS')">test</div>`;
                const result = sanitizeInput(input);
                expect(result).not.toContain(handler);
                expect(result).not.toContain('<div');
            }
        });

        test('should handle HTML entity encoding', () => {
            const input = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<script>');
        });

        test('should handle decimal HTML entities', () => {
            const input = '&#60;&#115;&#99;&#114;&#105;&#112;&#116;&#62;alert("XSS")&#60;/&#115;&#99;&#114;&#105;&#112;&#116;&#62;';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<script>');
        });

        test('should handle hexadecimal HTML entities', () => {
            const input = '&#x3C;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3E;alert("XSS")&#x3C;/script&#x3E;';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<script>');
        });

        test('should handle unicode escapes in script tags', () => {
            const input = '\\u003cscript\\u003ealert(1)\\u003c/script\\u003e';
            const result = sanitizeInput(input);
            // Should treat this as plain text, not execute
            expect(result).toContain('script');
        });

        test('should handle malformed HTML tags', () => {
            const inputs = [
                '<script >alert(1)</script >',
                '<SCRIPT>alert(1)</SCRIPT>',
                '<ScRiPt>alert(1)</ScRiPt>',
                '<script/src="http://evil.com/xss.js">',
            ];
            
            for (const input of inputs) {
                const result = sanitizeInput(input);
                expect(result.toLowerCase()).not.toContain('<script');
            }
        });

        test('should handle SVG-based XSS', () => {
            const input = '<svg onload="alert(\'XSS\')">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<svg');
            expect(result).not.toContain('onload');
        });

        test('should handle math element XSS', () => {
            const input = '<math href="javascript:alert(1)">CLICKME</math>';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<math');
            expect(result).not.toContain('href');
        });

        test('should handle data URI with JavaScript', () => {
            const input = '<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgiWFNTIik8L3NjcmlwdD4=">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<object');
            expect(result).not.toContain('data:');
        });

        test('should handle style tag with expression', () => {
            const input = '<style>body{background-image: url("javascript:alert(\'XSS\')")}</style>';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<style>');
            expect(result).not.toContain('</style>');
        });

        test('should handle iframe with JavaScript', () => {
            const input = '<iframe src="javascript:alert(\'XSS\')">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<iframe');
            expect(result).not.toContain('src=');
        });

        test('should handle form action JavaScript', () => {
            const input = '<form action="javascript:alert(1)"><input type="submit"></form>';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<form');
            expect(result).not.toContain('action=');
        });

        test('should handle input with formaction', () => {
            const input = '<input type="submit" formaction="javascript:alert(1)">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<input');
            expect(result).not.toContain('formaction=');
        });

        test('should handle link elements with JavaScript', () => {
            const input = '<link rel="stylesheet" href="javascript:alert(1)">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<link');
            expect(result).not.toContain('href=');
        });

        test('should handle meta refresh to JavaScript', () => {
            const input = '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<meta');
            expect(result).not.toContain('http-equiv=');
        });

        test('should handle table elements with background', () => {
            const input = '<table background="javascript:alert(1)">';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<table');
            expect(result).not.toContain('background=');
        });

        test('should handle template elements', () => {
            const input = '<template><script>alert(1)</script></template>';
            const result = sanitizeInput(input);
            expect(result).not.toContain('<template');
            expect(result).not.toContain('<script>');
        });

        test('should enforce length limits', () => {
            const longInput = 'a'.repeat(1000);
            const result = sanitizeInput(longInput);
            expect(result.length).toBeLessThanOrEqual(200); // MAX_INPUT_LENGTH
        });

        test('should handle control characters', () => {
            const input = 'test\x00\x01\x02\x03script';
            const result = sanitizeInput(input);
            expect(result).not.toContain('\x00');
            expect(result).toBe('testscript');
        });

        test('should handle null bytes', () => {
            const input = '<scr\\x00ipt>alert(1)</script>';
            const result = sanitizeInput(input);
            expect(result).toBeTruthy();
            expect(result).not.toContain('<script>');
        });
    });

    describe('sanitizeUrl() - URL Security', () => {
        test('should block javascript: protocol', () => {
            const input = 'javascript:alert("XSS")';
            const result = sanitizeUrl(input);
            expect(result).toBe('');
        });

        test('should block data: URI', () => {
            const input = 'data:text/html,<script>alert(1)</script>';
            const result = sanitizeUrl(input);
            expect(result).toBe('');
        });

        test('should block vbscript: protocol', () => {
            const input = 'vbscript:msgbox("XSS")';
            const result = sanitizeUrl(input);
            expect(result).toBe('');
        });

        test('should block case-variant JavaScript protocols', () => {
            const inputs = [
                'JavaScript:alert(1)',
                'JAVASCRIPT:alert(1)',
                'javascript:alert(1)',
                'javascript:alert(1)',
            ];
            
            for (const input of inputs) {
                const result = sanitizeUrl(input);
                expect(result).toBe('');
            }
        });

        test('should allow valid HTTP URLs', () => {
            const input = 'https://example.com/path?query=value';
            const result = sanitizeUrl(input);
            expect(result).toBe(input);
        });

        test('should add https:// to URLs without protocol', () => {
            const input = 'example.com/path';
            const result = sanitizeUrl(input);
            expect(result).toBe('https://example.com/path');
        });

        test('should handle invalid URLs gracefully', () => {
            const input = 'not a valid url';
            const result = sanitizeUrl(input);
            expect(result).toBe('');
        });

        test('should enforce URL length limits', () => {
            const longUrl = 'https://example.com/' + 'a'.repeat(1000);
            const result = sanitizeUrl(longUrl);
            expect(result.length).toBeLessThanOrEqual(500); // MAX_URL_LENGTH
        });
    });

    describe('escapeHtml() - HTML Entity Encoding', () => {
        test('should escape ampersands', () => {
            const input = 'a & b';
            const result = escapeHtml(input);
            expect(result).toBe('a &amp; b');
        });

        test('should escape less than signs', () => {
            const input = '1 < 2';
            const result = escapeHtml(input);
            expect(result).toBe('1 &lt; 2');
        });

        test('should escape greater than signs', () => {
            const input = '2 > 1';
            const result = escapeHtml(input);
            expect(result).toBe('2 &gt; 1');
        });

        test('should escape double quotes', () => {
            const input = 'value="test"';
            const result = escapeHtml(input);
            expect(result).toBe('value=&quot;test&quot;');
        });

        test('should escape single quotes', () => {
            const input = "value='test'";
            const result = escapeHtml(input);
            expect(result).toBe('value=&#039;test&#039;');
        });

        test('should handle multiple special characters', () => {
            const input = '<script>alert("XSS")</script>';
            const result = escapeHtml(input);
            expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        });

        test('should preserve plain text', () => {
            const input = 'Hello World 123';
            const result = escapeHtml(input);
            expect(result).toBe('Hello World 123');
        });
    });

    describe('Combined Security - Real-world Scenarios', () => {
        test('should handle comment with embedded script', () => {
            const comment = 'Great solution! <script>fetch("/api/steal?cookie="+document.cookie)</script>';
            const sanitized = sanitizeInput(comment);
            expect(sanitized).not.toContain('<script>');
            // fetch is text content, not a tag, so it remains after sanitization
        });

        test('should handle problem name with HTML injection attempt', () => {
            const name = 'Two Sum <img src=x onerror=alert(1)>';
            const sanitized = sanitizeInput(name);
            expect(sanitized).not.toContain('<img');
            expect(sanitized).not.toContain('onerror');
        });

        test('should handle note with multi-line script attempt', () => {
            const note = `This is my solution.
            <script>
                // Steal cookies
                fetch('/evil?data=' + document.cookie);
            </script>`;
            const sanitized = sanitizeInput(note);
            expect(sanitized).not.toContain('<script>');
        });

        test('should handle URL with line breaks', () => {
            const url = 'https://leetcode.com/problems/two-sum\njavascript:alert(1)';
            const sanitized = sanitizeUrl(url);
            // Should either be empty or sanitized
            expect(sanitized === '' || !sanitized.includes('javascript:')).toBe(true);
        });

        test('should handle base64 encoded script in URL', () => {
            // This is a base64 encoded simple script tag
            const url = 'data:text/html;base64,PHNjcmlwdD5hbGVydCgiWFNTIik8L3NjcmlwdD4=';
            const sanitized = sanitizeUrl(url);
            expect(sanitized).toBe('');
        });
    });
});
