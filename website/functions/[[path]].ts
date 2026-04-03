/**
 * SSR (Server-Side Rendering) for SmartGrind
 * 
 * Injects dynamic meta tags into the static index.html for SEO.
 */

interface Env {
    ASSETS?: { fetch: typeof fetch };
}

// Escaping utilities
function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function escapeHtmlAttr(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function escapeJson(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

// Category data
const PATTERN_CATEGORIES: Record<string, { title: string; description: string; count: number }> = {
    'two-pointers': { title: 'Two Pointers Pattern', description: 'Master two pointer techniques for array and string problems.', count: 45 },
    'sliding-window': { title: 'Sliding Window Pattern', description: 'Learn sliding window techniques for substring problems.', count: 38 },
    'arrays-hashing': { title: 'Arrays & Hashing Patterns', description: 'Master fundamental array manipulation and hash map techniques.', count: 52 },
    'linked-lists': { title: 'Linked List Patterns', description: 'Learn fast & slow pointers and cycle detection.', count: 28 },
    'stacks': { title: 'Stack Patterns', description: 'Master monotonic stacks and expression evaluation.', count: 24 },
    'heaps': { title: 'Heap & Priority Queue Patterns', description: 'Learn min/max heap operations and top K elements.', count: 22 },
    'trees': { title: 'Tree Patterns', description: 'Master DFS, BFS, and recursive tree traversals.', count: 48 },
    'graphs': { title: 'Graph Patterns', description: 'Learn BFS, DFS, Dijkstra, and topological sort.', count: 42 },
    'binary-search': { title: 'Binary Search Patterns', description: 'Master binary search variations.', count: 35 },
    'backtracking': { title: 'Backtracking Patterns', description: 'Learn recursion and constraint satisfaction.', count: 31 },
    'dp': { title: 'Dynamic Programming Patterns', description: 'Master DP patterns and techniques.', count: 56 },
    'greedy': { title: 'Greedy Algorithm Patterns', description: 'Learn interval scheduling and greedy choices.', count: 18 },
    'bit-manipulation': { title: 'Bit Manipulation Patterns', description: 'Master bitwise operations and XOR tricks.', count: 20 },
    'string-manipulation': { title: 'String Manipulation Patterns', description: 'Learn string parsing and palindrome techniques.', count: 26 },
    'design': { title: 'System Design Patterns', description: 'Master LRU Cache and design problems.', count: 15 },
};

const ALGORITHM_CATEGORIES: Record<string, { title: string; description: string; count: number }> = {
    'arrays-strings': { title: 'Arrays & Strings Algorithms', description: 'Comprehensive algorithms for arrays and strings.', count: 10 },
    'linked-list': { title: 'Linked List Algorithms', description: 'Essential linked list algorithms.', count: 5 },
    'trees-bsts': { title: 'Trees & BST Algorithms', description: 'Tree traversal and BST operations.', count: 9 },
    'graphs': { title: 'Graph Algorithms', description: 'Graph theory algorithms.', count: 11 },
    'dynamic-programming': { title: 'Dynamic Programming Algorithms', description: 'DP algorithms and patterns.', count: 12 },
    'greedy': { title: 'Greedy Algorithms', description: 'Greedy approach algorithms.', count: 6 },
    'backtracking': { title: 'Backtracking Algorithms', description: 'Recursive backtracking patterns.', count: 7 },
    'bit-manipulation': { title: 'Bit Manipulation Algorithms', description: 'Bitwise operations and tricks.', count: 8 },
    'heap-priority-queue': { title: 'Heap & Priority Queue Algorithms', description: 'Heap-based algorithms.', count: 6 },
    'math-number-theory': { title: 'Math & Number Theory Algorithms', description: 'Mathematical algorithms.', count: 9 },
    'advanced': { title: 'Advanced Algorithms', description: 'Advanced techniques.', count: 8 },
};

const SQL_CATEGORIES: Record<string, { title: string; description: string; count: number }> = {
    'sql-basics': { title: 'SQL Basics', description: 'Learn SQL fundamentals.', count: 14 },
    'sql-joins': { title: 'SQL Joins', description: 'Master SQL JOIN operations.', count: 18 },
    'sql-aggregation': { title: 'SQL Aggregation', description: 'Learn GROUP BY and aggregate functions.', count: 16 },
    'sql-subqueries': { title: 'SQL Subqueries', description: 'Master subqueries.', count: 15 },
    'sql-window-functions': { title: 'SQL Window Functions', description: 'Advanced SQL with window functions.', count: 19 },
    'sql-cte': { title: 'SQL CTEs', description: 'Learn recursive and non-recursive CTEs.', count: 12 },
    'sql-set-operations': { title: 'SQL Set Operations', description: 'Master UNION, INTERSECT, EXCEPT.', count: 11 },
    'sql-strings': { title: 'SQL String Functions', description: 'String manipulation in SQL.', count: 14 },
    'sql-datetime': { title: 'SQL Date/Time Functions', description: 'Date arithmetic and extraction.', count: 17 },
    'sql-conditional': { title: 'SQL Conditional Logic', description: 'CASE expressions and COALESCE.', count: 13 },
    'sql-dml': { title: 'SQL Data Modification', description: 'INSERT, UPDATE, DELETE operations.', count: 10 },
    'sql-advanced': { title: 'SQL Advanced Patterns', description: 'Advanced SQL techniques.', count: 16 },
    'sql-performance': { title: 'SQL Performance Optimization', description: 'Query optimization strategies.', count: 8 },
    'sql-design': { title: 'SQL Database Design', description: 'Database design principles.', count: 9 },
};

// Structured data generators
const genStructuredData = (type: string, id: string, title: string, description: string, count: number): string => {
    const baseUrl = 'https://algovyn.com/smartgrind';
    const ct = type === 'c' ? 'Coding Interview Patterns' : type === 'a' ? 'Algorithms' : 'SQL';
    const bn = type === 'c' ? 'Patterns' : type === 'a' ? 'Algorithms' : 'SQL';
    return `<script type="application/ld+json">{"@context":"https://schema.org","@type":"LearningResource","name":"${escapeJson(title)}","description":"${escapeJson(description)}","url":"${baseUrl}/${type}/${id}","educationalLevel":"Advanced","learningResourceType":"ProblemSet","inLanguage":"en","provider":{"@type":"Organization","name":"AlgoVyn","url":"https://algovyn.com"},"about":{"@type":"Thing","name":"${escapeJson(ct)}"},"numberOfItems":${count}}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"SmartGrind","item":"${baseUrl}/"},{"@type":"ListItem","position":2,"name":"${escapeJson(bn)}","item":"${baseUrl}/${type}/"},{"@type":"ListItem","position":3,"name":"${escapeJson(title)}"}]}</script>`;
};

const genHomeStructuredData = (): string => `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"SmartGrind","description":"A web app for mastering coding patterns through spaced repetition.","url":"https://algovyn.com/smartgrind","applicationCategory":"EducationalApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"author":{"@type":"Organization","name":"AlgoVyn"}}</script>`;

// Meta tags generator
const genMetaTags = (title: string, desc: string, keywords: string, url: string, ogTitle: string, ogDesc: string): string => 
    `<title>${title}</title><meta name="description" content="${desc}"><meta name="keywords" content="${keywords}"><link rel="canonical" href="${url}"><meta property="og:site_name" content="AlgoVyn - SmartGrind"><meta property="og:title" content="${ogTitle}"><meta property="og:description" content="${ogDesc}"><meta property="og:image" content="https://algovyn.com/smartgrind/logo.svg"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${ogTitle}"><meta name="twitter:description" content="${ogDesc}"><meta name="twitter:image" content="https://algovyn.com/smartgrind/logo.svg">`;

// Generate initial state script
const genInitialState = (type: string, id: string): string => 
    `<script>window.__INITIAL_STATE__={route:{type:"${type}",id:"${id}"}};</script>`;

// Helper to serve static assets
async function serveAsset(env: Env, url: URL, path: string): Promise<Response | null> {
    if (!env.ASSETS) {
        return null;
    }
    
    try {
        const assetUrl = new URL(path, url.origin);
        const res = await env.ASSETS.fetch(assetUrl);
        if (res.ok) {
            return res;
        }
    } catch (e) {
        // Fall through to null
    }
    return null;
}

export async function onRequest(context: { request: Request; env: Env; next: () => Promise<Response> }): Promise<Response> {
    const { request, env, next } = context;
    const url = new URL(request.url);
    const path = url.pathname;
    
    // PASS THROUGH: All non-GET requests
    if (request.method !== 'GET') {
        return next();
    }
    
    // PASS THROUGH: Asset files by extension
    const assetExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.json', '.map', '.txt'];
    const isAsset = assetExtensions.some(ext => path.toLowerCase().endsWith(ext));
    if (isAsset) {
        // Try to serve the asset directly
        const assetResponse = await serveAsset(env, url, path);
        if (assetResponse) {
            return assetResponse;
        }
        return next();
    }
    
    // PASS THROUGH: Asset directories
    if (path.includes('/assets/') || path.includes('/static/')) {
        const assetResponse = await serveAsset(env, url, path);
        if (assetResponse) {
            return assetResponse;
        }
        return next();
    }
    
    // PASS THROUGH: API routes
    if (path.includes('/api/')) {
        return next();
    }
    
    // Only process specific routes for SSR
    // Clean the path (remove /smartgrind prefix if present)
    const cleanPath = path.replace(/^\/smartgrind\//, '/').replace(/^\/smartgrind$/, '/');
    
    // Determine if this is a route we should handle
    let cat: { type: string; id: string; data: { title: string; description: string; count: number } } | null = null;
    let isHome = cleanPath === '/' || cleanPath === '';
    
    if (!isHome) {
        const pm = cleanPath.match(/^\/c\/([^/]+)$/);
        if (pm && PATTERN_CATEGORIES[pm[1]]) cat = { type: 'c', id: pm[1], data: PATTERN_CATEGORIES[pm[1]] };
        
        const am = cleanPath.match(/^\/a\/([^/]+)$/);
        if (am && ALGORITHM_CATEGORIES[am[1]]) cat = { type: 'a', id: am[1], data: ALGORITHM_CATEGORIES[am[1]] };
        
        const sm = cleanPath.match(/^\/s\/([^/]+)$/);
        if (sm && SQL_CATEGORIES[sm[1]]) cat = { type: 's', id: sm[1], data: SQL_CATEGORIES[sm[1]] };
    }
    
    // If not a route we handle, pass through to static assets
    if (!cat && !isHome) {
        return next();
    }
    
    try {
        // Fetch index.html
        let html: string;
        try {
            if (env.ASSETS) {
                const res = await env.ASSETS.fetch(new URL('/index.html', url.origin));
                if (!res.ok) throw new Error(`ASSETS fetch failed: ${res.status}`);
                html = await res.text();
            } else {
                const res = await fetch(new URL('/index.html', url.origin).toString());
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                html = await res.text();
            }
            
            if (!html.includes('<!DOCTYPE html>') && !html.includes('<html')) {
                throw new Error('Response does not appear to be HTML');
            }
        } catch (e) {
            console.error('[SSR] Failed to fetch index.html:', e);
            return next();
        }
        
        const baseUrl = 'https://algovyn.com/smartgrind';
        let meta: string, structured: string, initialState: string = '';
        
        if (isHome) {
            meta = genMetaTags(
                escapeHtml('SmartGrind: Master Coding Patterns with Spaced Repetition'),
                escapeHtmlAttr('Master coding patterns with spaced repetition. Practice 500+ LeetCode problems.'),
                escapeHtmlAttr('coding patterns, LeetCode, spaced repetition'),
                baseUrl + '/',
                escapeHtmlAttr('SmartGrind: Master Coding Patterns with Spaced Repetition'),
                escapeHtmlAttr('Practice LeetCode problems efficiently. 500+ problems, 15+ patterns.')
            );
            structured = genHomeStructuredData();
        } else if (cat) {
            const { type, id, data: c } = cat;
            const ct = type === 'c' ? 'Pattern' : type === 'a' ? 'Algorithm' : 'SQL';
            const pageUrl = `${baseUrl}/${type}/${id}`;
            meta = genMetaTags(
                escapeHtml(`${c.title} - SmartGrind`),
                escapeHtmlAttr(c.description),
                escapeHtmlAttr(`${ct.toLowerCase()}, coding interview, leetcode, ${id.replace(/-/g, ' ')}`),
                pageUrl,
                escapeHtmlAttr(`${c.title} | SmartGrind`),
                escapeHtmlAttr(`Practice ${c.count}+ ${c.title.toLowerCase()} problems with spaced repetition.`)
            );
            structured = genStructuredData(type, id, c.title, c.description, c.count);
            initialState = genInitialState(type, id);
        }
        
        // Inject meta tags and structured data
        html = html.replace(/<head>/i, `<head>${meta}`);
        html = html.replace(/<\/head>/i, `${structured}${initialState}</head>`);
        
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
            },
        });
        
    } catch (err) {
        console.error('[SSR] Error:', err);
        return next();
    }
}
