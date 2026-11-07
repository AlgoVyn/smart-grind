// --- SEO FIX REGRESSION TESTS ---
// Covers: duplicate head tags, canonical redirects, breadcrumbs, og:image, ratings

import { onRequest, stripDefaultSeoTags, getCanonicalRedirect, OG_IMAGE } from '../../functions/[[path]]';

const TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="description"
        content="Generic description">
    <meta name="keywords"
        content="generic, keywords">
    <title>Generic Title</title>
    <link rel="canonical" href="https://algovyn.com/smartgrind">
    <meta property="og:site_name" content="AlgoVyn - SmartGrind">
    <meta property="og:title" content="Generic OG">
    <meta property="og:description"
        content="Generic OG description">
    <meta property="og:image" content="https://algovyn.com/smartgrind/logo.svg">
    <meta property="og:url" content="https://algovyn.com/smartgrind">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Generic TW">
    <meta name="twitter:image" content="https://algovyn.com/smartgrind/logo.svg">
    <meta name="theme-color" content="#0085d0">
</head>
<body><main><h1 id="current-view-title">Dashboard</h1><div id="problems-container" class="space-y-10 pb-20"></div></main></body>
</html>`;

const env = {
    ASSETS: {
        fetch: jest.fn(async (input: RequestInfo | URL) => {
            const u = new URL(String(input));
            if (u.pathname === '/index.html') {
                return new Response(TEMPLATE, { status: 200, headers: { 'Content-Type': 'text/html' } });
            }
            return new Response('Not found', { status: 404 });
        }) as unknown as typeof fetch,
    },
};
const next = jest.fn(async () => new Response('next', { status: 404 }));

const count = (html: string, re: RegExp) => (html.match(re) || []).length;

describe('stripDefaultSeoTags', () => {
    it('removes multi-line template SEO tags but keeps unrelated meta', () => {
        const out = stripDefaultSeoTags(TEMPLATE);
        expect(out).not.toMatch(/<title>/);
        expect(out).not.toMatch(/rel="canonical"/);
        expect(out).not.toMatch(/name="description"/);
        expect(out).not.toMatch(/property="og:/);
        expect(out).not.toMatch(/name="twitter:/);
        expect(out).toContain('name="theme-color"');
        expect(out).toContain('<meta charset="UTF-8">');
    });
});

describe.each([
    ['/smartgrind/', 'https://algovyn.com/smartgrind/'],
    ['/smartgrind/c/binary-search', 'https://algovyn.com/smartgrind/c/binary-search'],
    ['/smartgrind/a/graphs', 'https://algovyn.com/smartgrind/a/graphs'],
    ['/smartgrind/s/sql-joins', 'https://algovyn.com/smartgrind/s/sql-joins'],
    ['/smartgrind/p/two-sum', 'https://algovyn.com/smartgrind/p/two-sum'],
])('SSR head for %s', (path, canonical) => {
    let html = '';
    beforeAll(async () => {
        const res = await onRequest({ request: new Request(`https://smart-grind.pages.dev${path}`), env, next });
        html = await res.text();
    });
    it('has exactly one title, description, canonical and og:url', () => {
        expect(count(html, /<title>/g)).toBe(1);
        expect(count(html, /name="description"/g)).toBe(1);
        expect(count(html, /rel="canonical"/g)).toBe(1);
        expect(count(html, /property="og:url"/g)).toBe(1);
        expect(count(html, /property="og:title"/g)).toBe(1);
        expect(count(html, /name="twitter:title"/g)).toBe(1);
        expect(html).toContain(`<link rel="canonical" href="${canonical}">`);
    });
    it('uses a PNG social image and AlgoVyn SmartGrind branding', () => {
        expect(html).toContain(`<meta property="og:image" content="${OG_IMAGE}">`);
        expect(html).not.toContain('logo.svg');
        expect(html).toMatch(/<title>[^<]*AlgoVyn SmartGrind[^<]*<\/title>/);
    });
    it('has no self-declared ratings and no 404 breadcrumb targets', () => {
        expect(html).not.toContain('aggregateRating');
        expect(html).not.toMatch(/"item":"https:\/\/algovyn\.com\/smartgrind\/[casp]\/"/);
        expect(html).not.toMatch(/"item":"https:\/\/algovyn\.com\/smartgrind\/[cas]\/[^"]+\/"/);
    });
});

describe('getCanonicalRedirect', () => {
    it.each([
        ['/c/two-pointers/', '/c/two-pointers'],
        ['/c/Binary-Search', '/c/binary-search'],
        ['/c/monotonic-stack', '/c/stacks'],
        ['/C/MONOTONIC-STACK/', '/c/stacks'],
        ['/s/SQL-Joins', '/s/sql-joins'],
        ['/p/Two-Sum/', '/p/two-sum'],
    ])('%s -> %s', (from, to) => {
        expect(getCanonicalRedirect(from)).toBe(to);
    });
    it.each(['/c/two-pointers', '/c/not-a-category', '/c/nope/', '/', '/assets/x.js'])(
        'leaves %s alone',
        (p) => {
            expect(getCanonicalRedirect(p)).toBeNull();
        }
    );
    it('returns a 301 to the algovyn.com canonical URL', async () => {
        const res = await onRequest({
            request: new Request('https://smart-grind.pages.dev/c/monotonic-stack?x=1'),
            env,
            next,
        });
        expect(res.status).toBe(301);
        expect(res.headers.get('Location')).toBe('https://algovyn.com/smartgrind/c/stacks?x=1');
    });
});
