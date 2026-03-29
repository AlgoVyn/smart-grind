/**
 * @jest-environment jsdom
 *
 * Tests for Storage Utility Module
 */

import {
    safeGetItem,
    safeSetItem,
    safeRemoveItem,
    getStringItem,
    setStringItem,
} from '../../src/utils';

describe('Storage Utility', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Restore all mocks to prevent interference between tests
        jest.restoreAllMocks();
    });

    describe('safeGetItem', () => {
        it('should retrieve and parse JSON value', () => {
            const testData = { name: 'test', value: 123 };
            localStorage.setItem('test-key', JSON.stringify(testData));

            const result = safeGetItem('test-key', { name: 'default', value: 0 });

            expect(result).toEqual(testData);
        });

        it('should return default value when key does not exist', () => {
            const defaultValue = { data: 'default' };

            const result = safeGetItem('non-existent-key', defaultValue);

            expect(result).toBe(defaultValue);
        });

        it('should return default value when JSON parsing fails', () => {
            localStorage.setItem('invalid-json', 'not valid json');
            const defaultValue = { error: true };

            const result = safeGetItem('invalid-json', defaultValue);

            expect(result).toBe(defaultValue);
        });

        it('should handle different data types', () => {
            localStorage.setItem('string', JSON.stringify('hello'));
            localStorage.setItem('number', JSON.stringify(42));
            localStorage.setItem('boolean', JSON.stringify(true));
            localStorage.setItem('array', JSON.stringify([1, 2, 3]));

            expect(safeGetItem('string', '')).toBe('hello');
            expect(safeGetItem('number', 0)).toBe(42);
            expect(safeGetItem('boolean', false)).toBe(true);
            expect(safeGetItem('array', [])).toEqual([1, 2, 3]);
        });

        it('should handle null values', () => {
            localStorage.setItem('null-value', JSON.stringify(null));

            const result = safeGetItem('null-value', 'default');

            expect(result).toBeNull();
        });
    });

    describe('safeSetItem', () => {
        it('should store JSON stringified value', () => {
            const testData = { name: 'test', value: 123 };

            const result = safeSetItem('test-key', testData);

            expect(result).toBe(true);
            expect(localStorage.getItem('test-key')).toBe(JSON.stringify(testData));
        });

        it('should handle different data types', () => {
            expect(safeSetItem('string', 'hello')).toBe(true);
            expect(safeSetItem('number', 42)).toBe(true);
            expect(safeSetItem('boolean', true)).toBe(true);
            expect(safeSetItem('array', [1, 2, 3])).toBe(true);
            expect(safeSetItem('object', { key: 'value' })).toBe(true);
        });

        it('should handle null and undefined', () => {
            expect(safeSetItem('null-value', null)).toBe(true);
            expect(safeSetItem('undefined-value', undefined)).toBe(true);
        });

        it('should return false when localStorage throws error', () => {
            jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('Storage quota exceeded');
            });

            const result = safeSetItem('test-key', 'value');

            expect(result).toBe(false);
        });
    });

    describe('safeRemoveItem', () => {
        it('should remove item from localStorage', () => {
            localStorage.setItem('test-key', 'test-value');

            const result = safeRemoveItem('test-key');

            expect(result).toBe(true);
            expect(localStorage.getItem('test-key')).toBeNull();
        });

        it('should return true when item does not exist', () => {
            const result = safeRemoveItem('non-existent-key');

            expect(result).toBe(true);
        });

        it('should return false when localStorage throws error', () => {
            jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
                throw new Error('Storage error');
            });

            const result = safeRemoveItem('test-key');

            expect(result).toBe(false);
        });
    });

    describe('getStringItem', () => {
        it('should retrieve string value', () => {
            localStorage.setItem('string-key', 'stored string');

            const result = getStringItem('string-key', 'default');

            expect(result).toBe('stored string');
        });

        it('should return default value when key does not exist', () => {
            const result = getStringItem('non-existent', 'default value');

            expect(result).toBe('default value');
        });

        it('should return default value when localStorage throws error', () => {
            jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
                throw new Error('Storage error');
            });

            const result = getStringItem('test-key', 'default');

            expect(result).toBe('default');
        });

        it('should retrieve JSON string without parsing', () => {
            const jsonString = '{"key": "value"}';
            localStorage.setItem('json-string', jsonString);

            const result = getStringItem('json-string', '');

            expect(result).toBe(jsonString);
        });
    });

    describe('setStringItem', () => {
        it('should store string value', () => {
            const result = setStringItem('string-key', 'test value');

            expect(result).toBe(true);
            expect(localStorage.getItem('string-key')).toBe('test value');
        });

        it('should store JSON string without extra stringification', () => {
            const jsonString = '{"key": "value"}';

            setStringItem('json-key', jsonString);

            expect(localStorage.getItem('json-key')).toBe(jsonString);
        });

        it('should return false when localStorage throws error', () => {
            jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new Error('Storage quota exceeded');
            });

            const result = setStringItem('test-key', 'value');

            expect(result).toBe(false);
        });
    });

    describe('Integration tests', () => {
        it('should round-trip data through safeSetItem and safeGetItem', () => {
            const testData = {
                problems: { 'prob-1': { status: 'solved' } },
                settings: { theme: 'dark' },
            };

            safeSetItem('round-trip-key', testData);
            const retrieved = safeGetItem('round-trip-key', {});

            expect(retrieved).toEqual(testData);
        });

        it('should handle multiple keys independently', () => {
            safeSetItem('key1', 'value1');
            safeSetItem('key2', 'value2');
            safeSetItem('key3', 'value3');

            expect(safeGetItem('key1', '')).toBe('value1');
            expect(safeGetItem('key2', '')).toBe('value2');
            expect(safeGetItem('key3', '')).toBe('value3');
        });

        it('should handle update operations', () => {
            safeSetItem('update-key', { version: 1 });
            safeSetItem('update-key', { version: 2 });

            const result = safeGetItem('update-key', { version: 0 });

            expect(result).toEqual({ version: 2 });
        });

        it('should handle complex nested objects', () => {
            const complexData = {
                user: {
                    id: '123',
                    preferences: {
                        theme: 'dark',
                        notifications: true,
                    },
                },
                problems: [
                    { id: 1, status: 'solved' },
                    { id: 2, status: 'unsolved' },
                ],
            };

            safeSetItem('complex-key', complexData);
            const retrieved = safeGetItem('complex-key', {});

            expect(retrieved).toEqual(complexData);
        });
    });
});
