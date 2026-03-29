/**
 * @jest-environment jsdom
 */

import {
    getToday,
    addDays,
    formatDate,
    getUrlParameter,
    getBaseUrl,
    updateUrlParameter,
    sanitizeInput,
    sanitizeUrl,
    escapeHtml,
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    getStringItem,
    setStringItem,
    countLines,
    cacheElements,
    getElement,
    type ElementCache,
} from '../src/utils-core';

describe('Utils Core', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    describe('Date utilities', () => {
        test('getToday returns current date in YYYY-MM-DD format', () => {
            const today = getToday();
            expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        test('addDays adds days correctly', () => {
            expect(addDays('2023-01-01', 5)).toBe('2023-01-06');
            expect(addDays('2023-01-31', 1)).toBe('2023-02-01');
            expect(addDays('2023-12-31', 1)).toBe('2024-01-01');
        });

        test('addDays handles negative days', () => {
            expect(addDays('2023-01-10', -5)).toBe('2023-01-05');
        });

        test('formatDate formats date correctly', () => {
            expect(formatDate('2023-01-15')).toBe('Jan 15');
            expect(formatDate('2023-12-25')).toBe('Dec 25');
        });
    });

    describe('URL utilities', () => {
        test('getUrlParameter returns correct value', () => {
            // Mock URLSearchParams
            const mockGet = jest.fn().mockReturnValue('test-value');
            const originalURLSearchParams = global.URLSearchParams;
            global.URLSearchParams = jest.fn(() => ({
                get: mockGet,
            })) as unknown as typeof URLSearchParams;

            const result = getUrlParameter('test');
            expect(result).toBe('test-value');
            expect(mockGet).toHaveBeenCalledWith('test');

            global.URLSearchParams = originalURLSearchParams;
        });

        test('getBaseUrl returns default value', () => {
            expect(getBaseUrl()).toBe('/smartgrind/');
        });

        test('getBaseUrl returns VITE_BASE_URL when set', () => {
            (global.window as { VITE_BASE_URL?: string }).VITE_BASE_URL = '/custom/';
            expect(getBaseUrl()).toBe('/custom/');
            delete (global.window as { VITE_BASE_URL?: string }).VITE_BASE_URL;
        });
    });

    describe('Sanitization utilities', () => {
        test('sanitizeInput removes HTML tags', () => {
            expect(sanitizeInput('<script>alert(1)</script>')).toBe('alert(1)');
            expect(sanitizeInput('<b>bold</b>')).toBe('bold');
        });

        test('sanitizeInput removes dangerous patterns', () => {
            expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
            expect(sanitizeInput('data:text/html,<script>')).toBe('text/html,');
        });

        test('sanitizeInput handles null and undefined', () => {
            expect(sanitizeInput(null)).toBe('');
            expect(sanitizeInput(undefined)).toBe('');
        });

        test('sanitizeInput limits length to 200 chars', () => {
            const longInput = 'a'.repeat(300);
            expect(sanitizeInput(longInput).length).toBe(200);
        });

        test('sanitizeUrl validates URLs', () => {
            expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
            expect(sanitizeUrl('example.com')).toBe('https://example.com');
            expect(sanitizeUrl('javascript:alert(1)')).toBe('');
        });

        test('sanitizeUrl limits length to 500 chars', () => {
            const longUrl = 'https://example.com/' + 'a'.repeat(600);
            expect(sanitizeUrl(longUrl).length).toBeLessThanOrEqual(500);
        });

        test('escapeHtml escapes special characters', () => {
            expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
            expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
            expect(escapeHtml("'single'")).toBe('&#039;single&#039;');
            expect(escapeHtml('a & b')).toBe('a &amp; b');
        });
    });

    describe('Storage utilities', () => {
        test('safeGetItem retrieves parsed value', () => {
            localStorage.setItem('test', JSON.stringify({ key: 'value' }));
            expect(safeGetItem('test', {})).toEqual({ key: 'value' });
        });

        test('safeGetItem returns default on parse error', () => {
            localStorage.setItem('test', 'invalid json');
            expect(safeGetItem('test', 'default')).toBe('default');
        });

        test('safeGetItem returns default when key missing', () => {
            expect(safeGetItem('missing', 'default')).toBe('default');
        });

        test('safeSetItem stores stringified value', () => {
            expect(safeSetItem('test', { key: 'value' })).toBe(true);
            expect(localStorage.getItem('test')).toBe('{"key":"value"}');
        });

        test('safeRemoveItem removes item', () => {
            localStorage.setItem('test', 'value');
            expect(safeRemoveItem('test')).toBe(true);
            expect(localStorage.getItem('test')).toBeNull();
        });

        test('getStringItem retrieves string value', () => {
            localStorage.setItem('test', 'stored value');
            expect(getStringItem('test', 'default')).toBe('stored value');
        });

        test('setStringItem stores string value', () => {
            expect(setStringItem('test', 'value')).toBe(true);
            expect(localStorage.getItem('test')).toBe('value');
        });

    
    });

    describe('Count utilities', () => {
        test('countLines counts lines correctly', () => {
            expect(countLines('Line 1\nLine 2\nLine 3')).toBe(3);
            expect(countLines('Single line')).toBe(1);
            expect(countLines('')).toBe(0);
        });

        test('countLines handles trailing newlines', () => {
            expect(countLines('Line 1\nLine 2\n')).toBe(2);
        });
    });

    describe('Element cache utilities', () => {
        test('getElement retrieves element by id', () => {
            const mockElement = document.createElement('div');
            mockElement.id = 'test-element';
            document.body.appendChild(mockElement);

            const result = getElement('testElement');
            expect(result).toBe(mockElement);

            document.body.removeChild(mockElement);
        });

        test('getElement handles camelCase to kebab conversion', () => {
            const mockElement = document.createElement('div');
            mockElement.id = 'my-test-element';
            document.body.appendChild(mockElement);

            const result = getElement('myTestElement');
            expect(result).toBe(mockElement);

            document.body.removeChild(mockElement);
        });

        test('cacheElements returns partial ElementCache', () => {
            const result = cacheElements();
            expect(typeof result).toBe('object');
            expect(result).toHaveProperty('filterBtns');
        });
    });
});
