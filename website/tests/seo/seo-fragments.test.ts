// --- SEO PRERENDER TESTS ---
import { readFileSync } from 'fs';
import path from 'path';
import {
    buildFragments,
    extractSummary,
    normaliseMarkdown,
    patternFilename,
    sqlPatternFilename,
    FRAGMENT_MARKER,
} from '../../scripts/seo-fragments';
import { patterns, sqlSolutions } from '../../src/ui/ui-pattern-solutions';
import { onRequest, SEO_FRAGMENT_MARKER } from '../../functions/[[path]]';
import { PROBLEMS_DATA } from '../../src/data/problems-data';

const PUBLIC = path.resolve(__dirname, '../../public');

describe('seo-fragments', () => {
    const frags = buildFragments(PUBLIC);
    const byFile = new Map(frags.map((f) => [f.file, f.html]));

    it('uses the same markdown filename rules as the app', () => {
        for (const t of PROBLEMS_DATA) {
            for (const p of t.patterns) {
                expect(patternFilename(p.name)).toBe(patterns.getPatternFilename(p.name));
                expect(sqlPatternFilename(p.name)).toBe(sqlSolutions.getSQLFilename(p.name));
            }
        }
    });

    it('marker matches the Function', () => {
        expect(FRAGMENT_MARKER).toBe(SEO_FRAGMENT_MARKER);
    });

    it('serves /seo fragments before the SPA fallback in _redirects', () => {
        const redirects = readFileSync(
            path.resolve(__dirname, '../../public/_redirects'),
            'utf-8'
        );
        const seoRule = redirects.indexOf('/seo/* /seo/:splat 200');
        const fallback = redirects.indexOf('/* /index.html 200');

        expect(seoRule).toBeGreaterThan(-1);
        expect(fallback).toBeGreaterThan(-1);
        expect(seoRule).toBeLessThan(fallback);
    });

    it('emits one fragment per category, top problem and home', () => {
        expect(byFile.has('seo/c/binary-search.txt')).toBe(true);
        expect(byFile.has('seo/c/stacks.txt')).toBe(true);
        expect(byFile.has('seo/a/graphs.txt')).toBe(true);
        expect(byFile.has('seo/s/sql-joins.txt')).toBe(true);
        expect(byFile.has('seo/p/two-sum.txt')).toBe(true);
        expect(byFile.has('seo/home.txt')).toBe(true);
        for (const html of byFile.values()) expect(html.startsWith(FRAGMENT_MARKER)).toBe(true);
    });

    it('category fragment has pattern headings, guide prose and crawlable links', () => {
        const html = byFile.get('seo/c/binary-search.txt')!;
        expect(html).toContain('<h2>Binary Search - On Sorted Array/List</h2>');
        expect(html).toContain('Binary search is one of the most fundamental');
        expect(html).toContain('href="https://leetcode.com/problems/binary-search/"');
        expect(html).toContain('href="/smartgrind/c/two-pointers"');
        expect(html).not.toContain('<script');
    });

    it('home fragment links to every category', () => {
        const html = byFile.get('seo/home.txt')!;
        expect(html).toContain('href="/smartgrind/c/stacks"');
        expect(html).toContain('href="/smartgrind/a/graphs"');
        expect(html).toContain('href="/smartgrind/s/sql-joins"');
    });

    it('problem fragment contains the full write-up', () => {
        const html = byFile.get('seo/p/two-sum.txt')!;
        // (marked is mocked in jest.setup.mjs; real HTML output is checked against the build)
        expect(html.length).toBeGreaterThan(5000);
        expect(html).toContain('Approach 2: Hash Map');
        expect(html).not.toContain('<!-- slide -->');
        expect(html).not.toContain('../patterns/');
    });

    it('normaliseMarkdown flattens carousels and .md links', () => {
        const out = normaliseMarkdown('````carousel\n```py\nx\n```\n<!-- slide -->\n```js\ny\n```\n````\nSee [Guide](../patterns/a.md) and [LC](https://leetcode.com/x)');
        expect(out).not.toMatch(/````|slide/);
        expect(out).toContain('```py');
        expect(out).toContain('See Guide and [LC](https://leetcode.com/x)');
    });

    it('extractSummary stops at the first rule / code block', () => {
        const md = '# T\n\n## Category\nX\n\n## Description\n\nFirst para.\n\nSecond para.\n\n---\n\n## Code\n```py\nx\n```';
        expect(extractSummary(md)).toBe('First para.\n\nSecond para.');
    });
});

describe('Function inlines fragments', () => {
    const shell = `<!DOCTYPE html><html lang="en"><head><title>x</title></head><body><main><!--SEO_HEADER--><div id="problems-container"></div><!--SEO_CONTENT--></main></body></html>`;
    const mk = (fragment: string | null) => ({
        ASSETS: {
            fetch: jest.fn(async (input: RequestInfo | URL) => {
                const u = new URL(String(input));
                if (u.pathname === '/index.html') return new Response(shell, { status: 200 });
                if (u.pathname === '/seo/c/binary-search.txt' && fragment !== null)
                    return new Response(fragment, { status: 200 });
                return new Response('nope', { status: 404 });
            }) as unknown as typeof fetch,
        },
    });
    const next = jest.fn(async () => new Response('next', { status: 404 }));

    it('renders h1 + intro + guide section', async () => {
        const res = await onRequest({
            request: new Request('https://smart-grind.pages.dev/c/binary-search'),
            env: mk(`${SEO_FRAGMENT_MARKER}<div class="seo-guide"><h2>Guide</h2></div>`),
            next,
        });
        const html = await res.text();
        expect(html).toMatch(/<h1[^>]*>Binary Search Patterns<\/h1>/);
        expect(html).toContain('<section id="seo-content" data-seo-content aria-label="Guide"><div class="seo-guide"><h2>Guide</h2>');
        expect(html).not.toContain('<!--SEO_');
    });

    it('ignores non-fragment responses (e.g. SPA fallback)', async () => {
        const res = await onRequest({
            request: new Request('https://smart-grind.pages.dev/c/binary-search'),
            env: mk('<!DOCTYPE html><html>index</html>'),
            next,
        });
        const html = await res.text();
        expect(html).not.toContain('id="seo-content"');
        expect(html).toMatch(/<h1[^>]*>Binary Search Patterns<\/h1>/);
    });
});
