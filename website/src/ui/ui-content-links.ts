/**
 * Internal content-link helpers for markdown written as root-absolute
 * `/patterns/...`, `/solutions/...`, etc.
 *
 * algovyn.com is a multi-app proxy: `/patterns` is NOT SmartGrind (it hits
 * the marketing site). SmartGrind lives at `/smartgrind`, and the
 * `algovyn-proxy` Worker strips that prefix before forwarding to the
 * smart-grind Pages project. Links must stay under `/smartgrind/...`.
 */

import { PROBLEMS_DATA } from '../data/problems-data';
import { ALGORITHMS_DATA } from '../data/algorithms-data';
import { SQL_DATA } from '../data/sql-data';
import { getBaseUrl } from '../utils';
import { _convertPatternNameToFilename } from './ui-pattern-solutions';

export const CONTENT_KINDS = [
    'patterns',
    'solutions',
    'algorithms',
    'flashcards',
    'sql/patterns',
    'sql/solutions',
] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];

export interface InternalContentRef {
    kind: ContentKind;
    stem: string;
}

/** Short in-content slugs that do not match a single filename. */
export const PATTERN_SLUG_ALIASES: Record<string, string> = {
    'union-find': 'graph-union-find-disjoint-set-union-dsu',
    'two-pointers': 'two-pointers-converging-sorted-array-target-sum',
    'two-pointer': 'two-pointers-converging-sorted-array-target-sum',
    'sliding-window': 'sliding-window-variable-size-condition-based',
    'binary-search': 'binary-search-on-sorted-array-list',
    greedy: 'greedy-interval-merging-scheduling',
    stack: 'stack-valid-parentheses-matching',
    'monotonic-stack': 'stack-monotonic-stack',
    'topological-sort': 'graph-bfs-topological-sort-kahn-s',
    'linked-list': 'linked-list-in-place-reversal',
    heap: 'heap-top-k-elements-selection-frequency',
    trie: 'tries',
    'trie-prefix-tree': 'tries',
    'kadane-algorithm': 'dp-1d-array-kadane-s-algorithm-for-max-min-subarray',
    'kadanes-algorithm': 'dp-1d-array-kadane-s-algorithm-for-max-min-subarray',
    'tree-dfs': 'tree-dfs-recursive-preorder-traversal',
    'tree-traversal': 'tree-dfs-recursive-preorder-traversal',
    'binary-tree-traversal': 'tree-dfs-recursive-preorder-traversal',
    backtracking: 'backtracking-subsets-include-exclude',
    'dynamic-programming': 'dp-1d-array-fibonacci',
    'data-structures': 'design-general-specific',
    'graph-traversal': 'graph-dfs-connected-components-island-counting',
    'graph-dfs': 'graph-dfs-connected-components-island-counting',
    'graph-bfs': 'graph-bfs-connected-components-island-counting',
    graph: 'graph-dfs-connected-components-island-counting',
    bfs: 'graph-bfs-connected-components-island-counting',
    'bfs-level-order-traversal': 'tree-bfs-level-order-traversal',
    interval: 'greedy-interval-merging-scheduling',
    'binary-search-on-answer': 'binary-search-on-answer-condition-function',
    'matrix-traversal': 'array-matrix-spiral-traversal',
    'bit-manipulation': 'bitwise-and-counting-set-bits-hamming-weight',
    string: 'string-palindrome-check-two-pointers-reverse',
    'dp-1d-array-fibonacci-style': 'dp-1d-array-fibonacci',
    'string-anagram-check': 'string-anagram-check-frequency-count-sort',
};

const KIND_RE = new RegExp(
    `^\\/?(?:smartgrind\\/)?((?:sql\\/)?(?:${CONTENT_KINDS.filter((k) => !k.includes('/')).join('|')}|sql\\/patterns|sql\\/solutions))\\/(.+)$`
);

export const parseInternalContentHref = (href: string): InternalContentRef | null => {
    if (!href) return null;
    let path = href.trim();
    try {
        if (/^https?:\/\//i.test(path)) {
            const url = new URL(path);
            const host = url.hostname.replace(/^www\./, '');
            if (host !== 'algovyn.com' && host !== 'smart-grind.pages.dev') {
                return null;
            }
            path = url.pathname;
        }
    } catch {
        return null;
    }
    const withoutHash = path.split('#')[0] ?? path;
    path = withoutHash.split('?')[0] ?? withoutHash;
    if (!path.startsWith('/')) return null;
    const match = path.match(KIND_RE);
    if (!match || !match[1] || !match[2]) return null;
    const kind = match[1] as ContentKind;
    if (!CONTENT_KINDS.includes(kind)) return null;
    const stem = match[2].replace(/\/+$/, '').replace(/\.md$/i, '');
    if (!stem || stem.includes('..')) return null;
    return { kind, stem };
};

export const knownPatternStems = (): string[] =>
    PROBLEMS_DATA.flatMap((topic) =>
        topic.patterns.map((pattern) => _convertPatternNameToFilename(pattern.name))
    );

export const knownAlgorithmStems = (): string[] =>
    ALGORITHMS_DATA.flatMap((cat) => cat.algorithms.map((algo) => algo.id.replace(/^algo-/, '')));

export const knownSolutionStems = (): string[] => {
    const ids = new Set<string>();
    for (const topic of PROBLEMS_DATA) {
        for (const pattern of topic.patterns) {
            for (const problem of pattern.problems) {
                ids.add(typeof problem === 'string' ? problem : problem.id);
            }
        }
    }
    return [...ids];
};

export const knownSqlPatternStems = (): string[] =>
    SQL_DATA.flatMap((category) =>
        category.topics.flatMap((topic) =>
            topic.patterns.map((pattern) =>
                _convertPatternNameToFilename(pattern.name)
                    .replace(/-pattern$/, '')
                    .replace(/-sql$/, '')
                    .replace(/-solution$/, '')
            )
        )
    );

const pickPrefixMatch = (stem: string, known: string[]): string | null => {
    const hits = known.filter((name) => name === stem || name.startsWith(`${stem}-`));
    if (hits.length === 0) return null;
    hits.sort((a, b) => a.length - b.length || a.localeCompare(b));
    return hits[0] ?? null;
};

export const resolveContentStem = (kind: ContentKind, stem: string): string => {
    const segments = stem.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || stem;
    if (kind === 'patterns') {
        if (PATTERN_SLUG_ALIASES[last]) return PATTERN_SLUG_ALIASES[last];
        return pickPrefixMatch(last, knownPatternStems()) || last;
    }
    if (kind === 'algorithms') {
        return pickPrefixMatch(last, knownAlgorithmStems()) || last;
    }
    if (kind === 'solutions') {
        return pickPrefixMatch(last, knownSolutionStems()) || last;
    }
    if (kind === 'sql/patterns') {
        return pickPrefixMatch(last, knownSqlPatternStems()) || last;
    }
    return last;
};

export const contentRelPath = (kind: ContentKind, stem: string): string =>
    `${kind}/${resolveContentStem(kind, stem)}.md`;

export const toAppContentHref = (ref: InternalContentRef): string =>
    `${getBaseUrl()}${ref.kind}/${ref.stem.replace(/\/+$/, '')}`;

export const rewriteAnchorHref = (href: string): string | null => {
    const ref = parseInternalContentHref(href);
    if (!ref) return null;
    return toAppContentHref(ref);
};

/** Path after /smartgrind is stripped, e.g. `/patterns/array-cyclic-sort`. */
export const matchContentDeepLink = (cleanPath: string): InternalContentRef | null =>
    parseInternalContentHref(cleanPath);
