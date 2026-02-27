// Test suite for input sanitization functions
import { expect } from '@jest/globals';
import { sanitizeInput, sanitizeUrl, escapeHtml } from '../src/utils';

describe('Input Sanitization Tests', () => {
    describe('sanitizeInput()', () => {
        it('should trim whitespace from input', () => {
            const result = sanitizeInput('  test  ');
            expect(result).toBe('test');
        });

        it('should remove HTML tags', () => {
            const result = sanitizeInput('<script>alert("xss")</script>');
            expect(result).toBe('alert(xss)');
        });

        it('should remove quotes and backslashes', () => {
            const result = sanitizeInput('test\'s "quoted" \\backslash');
            expect(result).toBe('tests quoted backslash');
        });

        it('should remove script injection attempts', () => {
            const result = sanitizeInput('javascript:alert(1)');
            expect(result).toBe('alert(1)');
        });

        it('should remove event handlers', () => {
            const result = sanitizeInput('onclick=alert(1)');
            expect(result).toBe('alert(1)');
        });

        it('should limit input length to 200 characters', () => {
            const longInput = 'a'.repeat(250);
            const result = sanitizeInput(longInput);
            expect(result.length).toBe(200);
        });

        it('should handle empty input', () => {
            const result = sanitizeInput('');
            expect(result).toBe('');
        });

        it('should handle null/undefined input', () => {
            const result1 = sanitizeInput(null);
            const result2 = sanitizeInput(undefined);
            expect(result1).toBe('');
            expect(result2).toBe('');
        });
    });

    describe('sanitizeUrl()', () => {
        it('should add https:// prefix if missing', () => {
            const result = sanitizeUrl('example.com');
            expect(result).toBe('https://example.com');
        });

        it('should preserve http:// and https:// prefixes', () => {
            const httpResult = sanitizeUrl('http://example.com');
            const httpsResult = sanitizeUrl('https://example.com');
            expect(httpResult).toBe('http://example.com');
            expect(httpsResult).toBe('https://example.com');
        });

        it('should remove javascript: protocol and return empty string', () => {
            const result = sanitizeUrl('javascript:alert(1)');
            expect(result).toBe('');
        });

        it('should remove data: protocol and return empty string', () => {
            const result = sanitizeUrl('data:text/html,<script>alert(1)</script>');
            expect(result).toBe('');
        });

        it('should limit URL length to 500 characters', () => {
            const longUrl = 'https://example.com/' + 'a'.repeat(600);
            const result = sanitizeUrl(longUrl);
            expect(result.length <= 500).toBe(true);
        });

        it('should return empty string for invalid URLs', () => {
            const result = sanitizeUrl('not a valid url');
            expect(result).toBe('');
        });

        it('should handle empty input', () => {
            const result = sanitizeUrl('');
            expect(result).toBe('');
        });
    });

    describe('Integration Tests', () => {
        it('should sanitize problem name correctly', () => {
            const maliciousName = '<script>alert("xss")</script> Test Problem';
            const result = sanitizeInput(maliciousName);
            expect(result).toBe('alert(xss) Test Problem');
        });

        it('should sanitize URL correctly and return empty string for invalid URLs', () => {
            const maliciousUrl = 'javascript:alert(1)';
            const result = sanitizeUrl(maliciousUrl);
            expect(result).toBe('');
        });

        it('should handle valid LeetCode URL', () => {
            const leetcodeUrl = 'https://leetcode.com/problems/two-sum/';
            const result = sanitizeUrl(leetcodeUrl);
            expect(result).toBe(leetcodeUrl);
        });

        it('should handle LeetCode URL without protocol', () => {
            const leetcodeUrl = 'leetcode.com/problems/two-sum/';
            const result = sanitizeUrl(leetcodeUrl);
            expect(result).toBe('https://leetcode.com/problems/two-sum/');
        });
    });

    describe('escapeHtml()', () => {
        it('should escape less-than sign', () => {
            const result = escapeHtml('<script>');
            expect(result).toBe('&lt;script&gt;');
        });

        it('should escape greater-than sign', () => {
            const result = escapeHtml('text>');
            expect(result).toBe('text&gt;');
        });

        it('should escape ampersand', () => {
            const result = escapeHtml('A & B');
            expect(result).toBe('A &amp; B');
        });

        it('should escape double quotes', () => {
            const result = escapeHtml('value="test"');
            expect(result).toBe('value=&quot;test&quot;');
        });

        it('should escape single quotes', () => {
            const result = escapeHtml("value='test'");
            expect(result).toBe('value=&#039;test&#039;');
        });

        it('should escape all HTML special characters', () => {
            const input = '<script>alert("XSS")</script>';
            const result = escapeHtml(input);
            expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
        });

        it('should handle XSS payload with event handler', () => {
            const input = '<img src=x onerror=alert(1)>';
            const result = escapeHtml(input);
            expect(result).toBe('&lt;img src=x onerror=alert(1)&gt;');
        });

        it('should escape multiple occurrences', () => {
            const input = '<<test>>';
            const result = escapeHtml(input);
            expect(result).toBe('&lt;&lt;test&gt;&gt;');
        });

        it('should handle empty string', () => {
            const result = escapeHtml('');
            expect(result).toBe('');
        });

        it('should handle string with no special characters', () => {
            const input = 'Hello World';
            const result = escapeHtml(input);
            expect(result).toBe('Hello World');
        });

        it('should prevent script injection via HTML entities', () => {
            const input = '<script>document.location="evil.com"</script>';
            const result = escapeHtml(input);
            expect(result).not.toContain('<script>');
            expect(result).toContain('&lt;script&gt;');
        });
    });
});
