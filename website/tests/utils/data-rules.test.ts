import {
    isReservedObjectKey,
    isSafeProblemId,
    isSafeHttpUrl,
    isIsoDateString,
} from '../../src/utils/data-rules';
import { sanitizeProblemId } from '../../src/utils/validation';
import { LIMITS } from '../../src/config/limits';

describe('data-rules', () => {
    test('rejects reserved object keys', () => {
        expect(isReservedObjectKey('__proto__')).toBe(true);
        expect(isReservedObjectKey('constructor')).toBe(true);
        expect(isReservedObjectKey('prototype')).toBe(true);
        expect(isReservedObjectKey('two-sum')).toBe(false);
    });

    test('isSafeProblemId rejects reserved keys and unsafe characters', () => {
        const max = LIMITS.VALIDATION.MAX_PROBLEM_ID_LENGTH;
        expect(isSafeProblemId('two-sum', max)).toBe(true);
        expect(isSafeProblemId('sql-basic-joins-01', max)).toBe(true);
        expect(isSafeProblemId('__proto__', max)).toBe(false);
        expect(isSafeProblemId('foo/bar', max)).toBe(false);
        expect(isSafeProblemId('foo<script>', max)).toBe(false);
        expect(isSafeProblemId('', max)).toBe(false);
    });

    test('sanitizeProblemId matches validateProblemId charset rules', () => {
        expect(sanitizeProblemId('two-sum')).toBe('two-sum');
        expect(sanitizeProblemId('__proto__')).toBeNull();
        expect(sanitizeProblemId('constructor')).toBeNull();
        expect(sanitizeProblemId('foo/bar')).toBeNull();
        expect(sanitizeProblemId('foo<script>')).toBeNull();
    });

    test('isSafeHttpUrl rejects dangerous protocols', () => {
        expect(isSafeHttpUrl('https://leetcode.com/problems/two-sum', 500)).toBe(true);
        expect(isSafeHttpUrl('', 500)).toBe(true);
        expect(isSafeHttpUrl('javascript:alert(1)', 500)).toBe(false);
        expect(isSafeHttpUrl('data:text/html,hi', 500)).toBe(false);
        expect(isSafeHttpUrl('vbscript:msgbox(1)', 500)).toBe(false);
    });

    test('isIsoDateString accepts calendar dates only', () => {
        expect(isIsoDateString('2026-11-10')).toBe(true);
        expect(isIsoDateString('not-a-date')).toBe(false);
        expect(isIsoDateString('2026-13-40')).toBe(false);
    });
});
