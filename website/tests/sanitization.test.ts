// Test suite for input sanitization functions
import { expect } from '@jest/globals';
import { utils } from '../public/modules/utils';

describe('Input Sanitization Tests', () => {
    describe('sanitizeInput()', () => {
        it('should trim whitespace from input', () => {
            const result = utils.sanitizeInput('  test  ');
            expect(result).toBe('test');
        });

        it('should remove HTML tags', () => {
            const result = utils.sanitizeInput('<script>alert("xss")</script>');
            expect(result).toBe('alert(xss)');
        });

        it('should remove quotes and backslashes', () => {
            const result = utils.sanitizeInput('test\'s "quoted" \\backslash');
            expect(result).toBe('tests quoted backslash');
        });

        it('should remove script injection attempts', () => {
            const result = utils.sanitizeInput('javascript:alert(1)');
            expect(result).toBe('alert(1)');
        });

        it('should remove event handlers', () => {
            const result = utils.sanitizeInput('onclick=alert(1)');
            expect(result).toBe('alert(1)');
        });

        it('should limit input length to 200 characters', () => {
            const longInput = 'a'.repeat(250);
            const result = utils.sanitizeInput(longInput);
            expect(result.length).toBe(200);
        });

        it('should handle empty input', () => {
            const result = utils.sanitizeInput('');
            expect(result).toBe('');
        });

        it('should handle null/undefined input', () => {
            const result1 = utils.sanitizeInput(null);
            const result2 = utils.sanitizeInput(undefined);
            expect(result1).toBe('');
            expect(result2).toBe('');
        });
    });

    describe('sanitizeUrl()', () => {
        it('should add https:// prefix if missing', () => {
            const result = utils.sanitizeUrl('example.com');
            expect(result).toBe('https://example.com');
        });

        it('should preserve http:// and https:// prefixes', () => {
            const httpResult = utils.sanitizeUrl('http://example.com');
            const httpsResult = utils.sanitizeUrl('https://example.com');
            expect(httpResult).toBe('http://example.com');
            expect(httpsResult).toBe('https://example.com');
        });

        it('should remove javascript: protocol and return empty string', () => {
            const result = utils.sanitizeUrl('javascript:alert(1)');
            expect(result).toBe('');
        });

        it('should remove data: protocol and return empty string', () => {
            const result = utils.sanitizeUrl('data:text/html,<script>alert(1)</script>');
            expect(result).toBe('');
        });

        it('should limit URL length to 500 characters', () => {
            const longUrl = 'https://example.com/' + 'a'.repeat(600);
            const result = utils.sanitizeUrl(longUrl);
            expect(result.length <= 500).toBe(true);
        });

        it('should return empty string for invalid URLs', () => {
            const result = utils.sanitizeUrl('not a valid url');
            expect(result).toBe('');
        });

        it('should handle empty input', () => {
            const result = utils.sanitizeUrl('');
            expect(result).toBe('');
        });
    });

    describe('Integration Tests', () => {
        it('should sanitize problem name correctly', () => {
            const maliciousName = '<script>alert("xss")</script> Test Problem';
            const result = utils.sanitizeInput(maliciousName);
            expect(result).toBe('alert(xss) Test Problem');
        });

        it('should sanitize URL correctly and return empty string for invalid URLs', () => {
            const maliciousUrl = 'javascript:alert(1)';
            const result = utils.sanitizeUrl(maliciousUrl);
            expect(result).toBe('');
        });

        it('should handle valid LeetCode URL', () => {
            const leetcodeUrl = 'https://leetcode.com/problems/two-sum/';
            const result = utils.sanitizeUrl(leetcodeUrl);
            expect(result).toBe(leetcodeUrl);
        });

        it('should handle LeetCode URL without protocol', () => {
            const leetcodeUrl = 'leetcode.com/problems/two-sum/';
            const result = utils.sanitizeUrl(leetcodeUrl);
            expect(result).toBe('https://leetcode.com/problems/two-sum/');
        });
    });
});