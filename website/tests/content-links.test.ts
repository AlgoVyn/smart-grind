import {
    parseInternalContentHref,
    resolveContentStem,
    rewriteAnchorHref,
    toAppContentHref,
    matchContentDeepLink,
} from '../src/ui/ui-content-links';
import { isContentDeepLink } from '../functions/[[path]]';

describe('internal content links', () => {
    beforeEach(() => {
        window.VITE_BASE_URL = '/smartgrind/';
    });

    test('parses root-absolute /patterns links that would otherwise hit the proxy root', () => {
        expect(parseInternalContentHref('/patterns/union-find')).toEqual({
            kind: 'patterns',
            stem: 'union-find',
        });
    });

    test('parses /smartgrind-prefixed and .md variants', () => {
        expect(parseInternalContentHref('/smartgrind/solutions/3sum.md')).toEqual({
            kind: 'solutions',
            stem: '3sum',
        });
        expect(parseInternalContentHref('/smartgrind/sql/patterns/set-comparison')).toEqual({
            kind: 'sql/patterns',
            stem: 'set-comparison',
        });
    });

    test('parses algovyn.com URLs and rejects other hosts', () => {
        expect(
            parseInternalContentHref('https://algovyn.com/smartgrind/algorithms/prefix-sum')
        ).toEqual({ kind: 'algorithms', stem: 'prefix-sum' });
        expect(parseInternalContentHref('https://leetcode.com/problems/3sum/')).toBeNull();
    });

    test('rewrites root-absolute hrefs under the /smartgrind base path', () => {
        expect(rewriteAnchorHref('/patterns/union-find')).toBe('/smartgrind/patterns/union-find');
        expect(rewriteAnchorHref('/solutions/3sum.md')).toBe('/smartgrind/solutions/3sum');
    });

    test('resolves short pattern slugs to a real filename', () => {
        expect(resolveContentStem('patterns', 'union-find')).toBe(
            'graph-union-find-disjoint-set-union-dsu'
        );
        expect(resolveContentStem('patterns', 'two-pointers')).toBe(
            'two-pointers-converging-sorted-array-target-sum'
        );
        expect(resolveContentStem('patterns', 'array-cyclic-sort')).toBe('array-cyclic-sort');
    });

    test('toAppContentHref stays under the base path', () => {
        expect(toAppContentHref({ kind: 'patterns', stem: 'array-cyclic-sort' })).toBe(
            '/smartgrind/patterns/array-cyclic-sort'
        );
    });
});

describe('content deep-link matching (after proxy strip)', () => {
    test('matches extensionless write-up paths', () => {
        expect(isContentDeepLink('/patterns/array-cyclic-sort')).toBe(true);
        expect(isContentDeepLink('/sql/patterns/set-comparison')).toBe(true);
        expect(isContentDeepLink('/solutions/3sum')).toBe(true);
        expect(matchContentDeepLink('/algorithms/prefix-sum')).toEqual({
            kind: 'algorithms',
            stem: 'prefix-sum',
        });
    });

    test('does not steal markdown assets or category routes', () => {
        expect(isContentDeepLink('/patterns/array-cyclic-sort.md')).toBe(false);
        expect(isContentDeepLink('/c/two-pointers')).toBe(false);
        expect(isContentDeepLink('/p/3sum')).toBe(false);
        expect(isContentDeepLink('/')).toBe(false);
    });
});
