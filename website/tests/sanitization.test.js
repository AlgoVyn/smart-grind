// Test suite for input sanitization functions
const assert = require('assert');

// Mock the SmartGrind namespace
global.window = {
    SmartGrind: {
        utils: require('../public/modules/utils.js')
    }
};

const utils = window.SmartGrind.utils;

describe('Input Sanitization Tests', () => {
    describe('sanitizeInput()', () => {
        it('should trim whitespace from input', () => {
            const result = utils.sanitizeInput('  test  ');
            assert.strictEqual(result, 'test');
        });

        it('should remove HTML tags', () => {
            const result = utils.sanitizeInput('<script>alert("xss")</script>');
            assert.strictEqual(result, 'alert(xss)');
        });

        it('should remove quotes and backslashes', () => {
            const result = utils.sanitizeInput('test\'s "quoted" \\backslash');
            assert.strictEqual(result, 'tests quoted backslash');
        });

        it('should remove script injection attempts', () => {
            const result = utils.sanitizeInput('javascript:alert(1)');
            assert.strictEqual(result, 'alert(1)');
        });

        it('should remove event handlers', () => {
            const result = utils.sanitizeInput('onclick=alert(1)');
            assert.strictEqual(result, 'alert(1)');
        });

        it('should limit input length to 200 characters', () => {
            const longInput = 'a'.repeat(250);
            const result = utils.sanitizeInput(longInput);
            assert.strictEqual(result.length, 200);
        });

        it('should handle empty input', () => {
            const result = utils.sanitizeInput('');
            assert.strictEqual(result, '');
        });

        it('should handle null/undefined input', () => {
            const result1 = utils.sanitizeInput(null);
            const result2 = utils.sanitizeInput(undefined);
            assert.strictEqual(result1, '');
            assert.strictEqual(result2, '');
        });
    });

    describe('sanitizeUrl()', () => {
        it('should add https:// prefix if missing', () => {
            const result = utils.sanitizeUrl('example.com');
            assert.strictEqual(result, 'https://example.com');
        });

        it('should preserve http:// and https:// prefixes', () => {
            const httpResult = utils.sanitizeUrl('http://example.com');
            const httpsResult = utils.sanitizeUrl('https://example.com');
            assert.strictEqual(httpResult, 'http://example.com');
            assert.strictEqual(httpsResult, 'https://example.com');
        });

        it('should remove javascript: protocol and return empty string', () => {
            const result = utils.sanitizeUrl('javascript:alert(1)');
            assert.strictEqual(result, '');
        });

        it('should remove data: protocol and return empty string', () => {
            const result = utils.sanitizeUrl('data:text/html,<script>alert(1)</script>');
            assert.strictEqual(result, '');
        });

        it('should limit URL length to 500 characters', () => {
            const longUrl = 'https://example.com/' + 'a'.repeat(600);
            const result = utils.sanitizeUrl(longUrl);
            assert.ok(result.length <= 500);
        });

        it('should return empty string for invalid URLs', () => {
            const result = utils.sanitizeUrl('not a valid url');
            assert.strictEqual(result, '');
        });

        it('should handle empty input', () => {
            const result = utils.sanitizeUrl('');
            assert.strictEqual(result, '');
        });
    });

    describe('Integration Tests', () => {
        it('should sanitize problem name correctly', () => {
            const maliciousName = '<script>alert("xss")</script> Test Problem';
            const result = utils.sanitizeInput(maliciousName);
            assert.strictEqual(result, 'alert(xss) Test Problem');
        });

        it('should sanitize URL correctly and return empty string for invalid URLs', () => {
            const maliciousUrl = 'javascript:alert(1)';
            const result = utils.sanitizeUrl(maliciousUrl);
            assert.strictEqual(result, '');
        });

        it('should handle valid LeetCode URL', () => {
            const leetcodeUrl = 'https://leetcode.com/problems/two-sum/';
            const result = utils.sanitizeUrl(leetcodeUrl);
            assert.strictEqual(result, leetcodeUrl);
        });

        it('should handle LeetCode URL without protocol', () => {
            const leetcodeUrl = 'leetcode.com/problems/two-sum/';
            const result = utils.sanitizeUrl(leetcodeUrl);
            assert.strictEqual(result, 'https://leetcode.com/problems/two-sum/');
        });
    });
});