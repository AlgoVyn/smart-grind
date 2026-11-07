/**
 * SEO prerender: build-time HTML fragments for SmartGrind category and problem pages.
 *
 * The app is a client-rendered SPA; the Pages Function (functions/[[path]].ts) only
 * injected <head> tags, so every /c|a|s/<id> and /p/<slug> URL served the same body.
 * This module turns the existing data files + markdown guides into small static
 * fragments (dist/seo/<type>/<id>.txt). At request time the Function inlines the
 * matching fragment into the HTML shell, so crawlers get unique, server-rendered
 * content (h1 comes from the Function, guide text + problem links from here).
 *
 * Run by the `seo-prerender` Vite plugin after `vite build` (see vite.config.ts).
 */
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { PROBLEMS_DATA } from '../src/data/problems-data';
import { ALGORITHMS_DATA } from '../src/data/algorithms-data';
import { SQL_DATA } from '../src/data/sql-data';
import { TOP_PROBLEMS } from '../src/data/top-problems';
import type { ProblemDef } from '../src/types';

export const FRAGMENT_MARKER = '<!--seo-fragment v1-->';
const BASE = '/smartgrind';
const SUMMARY_MAX_CHARS = 1400;

const esc = (t: string): string =>
    t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Must match src/ui/ui-pattern-solutions.ts (_convertPatternNameToFilename) - see test
export const patternFilename = (name: string): string =>
    name
        .toLowerCase()
        .replace(/[\s/()&`'+-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-pattern$/, '')
        .replace(/-algorithm$/, '')
        .replace(/-approach$/, '')
        .replace(/-method$/, '')
        .replace(/-technique$/, '')
        .replace(/-style$/, '');

// Must match sqlSolutions._convertPatternNameToFilename
export const sqlPatternFilename = (name: string): string =>
    name
        .toLowerCase()
        .replace(/[\s/()&`'+-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-pattern$/, '')
        .replace(/-sql$/, '')
        .replace(/-solution$/, '');

const SUMMARY_HEADINGS = /^(problem description|description|overview|introduction|what is)/i;
const SKIP_HEADINGS = /^(category|tags|difficulty)$/i;

/**
 * Pull the introductory prose out of a guide: the "Problem Description" /
 * "Description" / "Overview" section (or the first prose section), stopping at
 * the first horizontal rule, sub-section, code fence or table, capped by length.
 */
export const extractSummary = (md: string, maxChars = SUMMARY_MAX_CHARS): string => {
    const sections = md.replace(/\r\n/g, '\n').split(/\n(?=## )/);
    const body = (s: string) => s.replace(/^## .*\n/, '');
    const heading = (s: string) => (s.match(/^## (.*)/)?.[1] || '').trim();
    const candidates = sections.slice(1).filter((s) => !SKIP_HEADINGS.test(heading(s)));
    const chosen =
        candidates.find((s) => SUMMARY_HEADINGS.test(heading(s))) ||
        candidates[0] ||
        body((sections[0] || '').replace(/^# .*\n/, ''));
    const text = body(chosen).split(/\n(?:---+|### |```|\|)/)[0] || '';
    const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
    const out: string[] = [];
    let len = 0;
    for (const b of blocks) {
        if (len > 0 && len + b.length > maxChars) break;
        out.push(b);
        len += b.length;
    }
    return out.join('\n\n');
};

/**
 * Normalise SmartGrind's markdown dialect for static rendering:
 * - ````carousel ... <!-- slide --> ... ```` (multi-language code tabs) -> plain fenced blocks
 * - links to sibling .md files (../patterns/x.md) -> link text only (raw .md is not a page)
 * - drop HTML comments and any <script>/<iframe> defensively (content is first-party)
 */
export const normaliseMarkdown = (src: string): string =>
    src
        .replace(/^````\w*[ \t]*$/gm, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<(script|iframe|style)\b[\s\S]*?<\/\1>/gi, '')
        .replace(/\[([^\]]+)\]\((?!https?:)[^)]*\.md\)/g, '$1');

const md = (s: string): string => marked.parse(normaliseMarkdown(s), { async: false }) as string;

const readIf = (file: string): string | null => (fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : null);

const topSlugs = new Set(TOP_PROBLEMS.map((p) => p.slug));

const problemItem = (p: string | ProblemDef): string => {
    if (typeof p === 'string') return `<li>${esc(p)}</li>`;
    const solution = topSlugs.has(p.id)
        ? ` &middot; <a href="${BASE}/p/${esc(p.id)}">${esc(p.name)} solution</a>`
        : '';
    return `<li><a href="${esc(p.url)}" rel="noopener" target="_blank">${esc(p.name)}</a>${solution}</li>`;
};

const section = (title: string, summaryMd: string | null, problems: (string | ProblemDef)[], extra = ''): string =>
    `<section class="seo-guide-section"><h2>${esc(title)}</h2>${extra}${
        summaryMd ? `<div class="seo-guide-summary">${md(summaryMd)}</div>` : ''
    }${problems.length ? `<ul class="seo-guide-problems">${problems.map(problemItem).join('')}</ul>` : ''}</section>`;

const relatedNav = (label: string, items: { href: string; title: string }[]): string =>
    `<nav class="seo-guide-related" aria-label="${esc(label)}"><h2>${esc(label)}</h2><ul>${items
        .map((i) => `<li><a href="${esc(i.href)}">${esc(i.title)}</a></li>`)
        .join('')}</ul></nav>`;

const allCategoryLinks = () => [
    ...PROBLEMS_DATA.map((t) => ({ href: `${BASE}/c/${t.id}`, title: t.title })),
    ...ALGORITHMS_DATA.map((c) => ({ href: `${BASE}/a/${c.id}`, title: `${c.title} Algorithms` })),
    ...SQL_DATA.map((c) => ({ href: `${BASE}/s/${c.id}`, title: c.title })),
];

const wrap = (inner: string): string => `${FRAGMENT_MARKER}<div class="seo-guide">${inner}</div>`;

export interface Fragment {
    file: string; // relative to dist/, e.g. seo/c/binary-search.txt
    html: string;
}

export const buildFragments = (publicDir: string): Fragment[] => {
    const frags: Fragment[] = [];

    for (const topic of PROBLEMS_DATA) {
        const sections = topic.patterns.map((p) =>
            section(
                p.name,
                (() => {
                    const src = readIf(path.join(publicDir, 'patterns', `${patternFilename(p.name)}.md`));
                    return src ? extractSummary(src) : null;
                })(),
                p.problems
            )
        );
        const related = relatedNav(
            'More coding patterns',
            PROBLEMS_DATA.filter((t) => t.id !== topic.id).map((t) => ({ href: `${BASE}/c/${t.id}`, title: t.title }))
        );
        frags.push({ file: `seo/c/${topic.id}.txt`, html: wrap(sections.join('') + related) });
    }

    for (const cat of ALGORITHMS_DATA) {
        const sections = cat.algorithms.map((a) => {
            const src = readIf(path.join(publicDir, 'algorithms', `${a.id.replace(/^algo-/, '')}.md`));
            const practice = `<p>Practice problem: <a href="${esc(a.url)}" rel="noopener" target="_blank">${esc(a.url.replace(/^https:\/\/leetcode\.com\/problems\/|\/$/g, ''))}</a></p>`;
            return section(a.name, src ? extractSummary(src) : null, [], practice);
        });
        const related = relatedNav(
            'More algorithm categories',
            ALGORITHMS_DATA.filter((c) => c.id !== cat.id).map((c) => ({ href: `${BASE}/a/${c.id}`, title: c.title }))
        );
        frags.push({ file: `seo/a/${cat.id}.txt`, html: wrap(sections.join('') + related) });
    }

    for (const cat of SQL_DATA) {
        const sections = cat.topics.flatMap((t) =>
            t.patterns.map((p) => {
                const src = readIf(path.join(publicDir, 'sql', 'patterns', `${sqlPatternFilename(p.name)}.md`));
                const desc = p.description ? `<p>${esc(p.description)}</p>` : '';
                return section(`${t.name}: ${p.name}`, src ? extractSummary(src) : null, p.problems, desc);
            })
        );
        const related = relatedNav(
            'More SQL topics',
            SQL_DATA.filter((c) => c.id !== cat.id).map((c) => ({ href: `${BASE}/s/${c.id}`, title: c.title }))
        );
        frags.push({ file: `seo/s/${cat.id}.txt`, html: wrap(sections.join('') + related) });
    }

    for (const p of TOP_PROBLEMS) {
        const src =
            readIf(path.join(publicDir, 'solutions', `${p.slug}.md`)) ||
            (p.categoryType === 's' ? readIf(path.join(publicDir, 'sql', 'solutions', `${p.slug}.md`)) : null);
        // Full write-up is the unique content of a problem page; drop its own H1 (the Function renders the h1)
        const article = src ? md(src.replace(/^# .*\n/, '')) : `<p>${esc(p.description)}</p>`;
        const back = `<p class="seo-guide-back"><a href="${BASE}/${p.categoryType}/${p.category}">More ${esc(
            p.category.replace(/-/g, ' ')
        )} problems</a></p>`;
        frags.push({ file: `seo/p/${p.slug}.txt`, html: wrap(`<article>${article}</article>${back}`) });
    }

    // Home: crawlable hub linking every category page
    frags.push({ file: 'seo/home.txt', html: wrap(relatedNav('Browse all topics', allCategoryLinks())) });

    return frags;
};

export const writeFragments = (publicDir: string, outDir: string): number => {
    const frags = buildFragments(publicDir);
    for (const f of frags) {
        const target = path.join(outDir, f.file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, f.html);
    }
    return frags.length;
};
