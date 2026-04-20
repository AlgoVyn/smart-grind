/**
 * SSR (Server-Side Rendering) for SmartGrind
 * 
 * Injects dynamic meta tags into the static index.html for SEO.
 */

import { TOP_PROBLEMS, getProblemBySlug } from '../src/data/top-problems';

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

// Category data with SEO-optimized descriptions
const PATTERN_CATEGORIES: Record<string, { title: string; description: string; count: number }> = {
    'two-pointers': { title: 'Two Pointers Pattern', description: 'Master two pointer techniques for array and string problems. Practice 45+ LeetCode problems with detailed solutions in Python, Java, C++, and JavaScript. Perfect for coding interview prep.', count: 45 },
    'sliding-window': { title: 'Sliding Window Pattern', description: 'Learn sliding window techniques for substring and subarray problems. Solve 38+ LeetCode challenges with step-by-step explanations and optimized code solutions.', count: 38 },
    'arrays-hashing': { title: 'Arrays & Hashing Patterns', description: 'Master fundamental array manipulation and hash map techniques. Practice 52+ LeetCode problems essential for coding interviews at top tech companies.', count: 52 },
    'linked-lists': { title: 'Linked List Patterns', description: 'Learn fast & slow pointers, cycle detection, and list manipulation. Solve 28+ LeetCode linked list problems with comprehensive solutions and complexity analysis.', count: 28 },
    'stacks': { title: 'Stack Patterns', description: 'Master monotonic stacks, expression evaluation, and parenthesis matching. Practice 24+ LeetCode stack problems with detailed explanations for technical interviews.', count: 24 },
    'heaps': { title: 'Heap & Priority Queue Patterns', description: 'Learn min/max heap operations, top K elements, and median finding. Solve 22+ LeetCode heap problems with Python, Java, C++, and JavaScript implementations.', count: 22 },
    'trees': { title: 'Tree Patterns', description: 'Master DFS, BFS, recursive traversals, and binary search trees. Practice 48+ LeetCode tree problems with complete solutions and time/space complexity breakdowns.', count: 48 },
    'graphs': { title: 'Graph Patterns', description: 'Learn BFS, DFS, Dijkstra, topological sort, and union-find. Solve 42+ LeetCode graph problems with detailed explanations for software engineering interviews.', count: 42 },
    'binary-search': { title: 'Binary Search Patterns', description: 'Master binary search variations including rotated arrays and boundary search. Practice 35+ LeetCode binary search problems with optimized solutions.', count: 35 },
    'backtracking': { title: 'Backtracking Patterns', description: 'Learn recursion, constraint satisfaction, and permutation generation. Solve 31+ LeetCode backtracking problems with step-by-step solution walkthroughs.', count: 31 },
    'dp': { title: 'Dynamic Programming Patterns', description: 'Master DP patterns: memoization, tabulation, knapsack, and LIS. Practice 56+ LeetCode DP problems with detailed state transition explanations.', count: 56 },
    'greedy': { title: 'Greedy Algorithm Patterns', description: 'Learn interval scheduling, greedy choices, and activity selection. Solve 18+ LeetCode greedy problems with proof of correctness and complexity analysis.', count: 18 },
    'bit-manipulation': { title: 'Bit Manipulation Patterns', description: 'Master bitwise operations, XOR tricks, and bit masking. Practice 20+ LeetCode bit manipulation problems with low-level optimization techniques.', count: 20 },
    'string-manipulation': { title: 'String Manipulation Patterns', description: 'Learn string parsing, palindrome techniques, and KMP algorithm. Solve 26+ LeetCode string problems with efficient string handling solutions.', count: 26 },
    'design': { title: 'System Design Patterns', description: 'Master LRU Cache, LFU Cache, and iterator design patterns. Practice 15+ LeetCode design problems with object-oriented implementation examples.', count: 15 },
};

const ALGORITHM_CATEGORIES: Record<string, { title: string; description: string; count: number }> = {
    'arrays-strings': { title: 'Arrays & Strings Algorithms', description: 'Comprehensive algorithms for arrays and strings including sorting, searching, and two pointers. Learn 10+ essential algorithms for coding interviews with code examples.', count: 10 },
    'linked-list': { title: 'Linked List Algorithms', description: 'Essential linked list algorithms: reversal, merge, cycle detection, and rearrangement. Master 5+ fundamental operations with step-by-step visual explanations.', count: 5 },
    'trees-bsts': { title: 'Trees & BST Algorithms', description: 'Tree traversal (in-order, pre-order, post-order), BST operations, and balanced trees. Learn 9+ algorithms essential for technical interviews at FAANG companies.', count: 9 },
    'graphs': { title: 'Graph Algorithms', description: 'Graph theory algorithms: shortest path, MST, topological sort, and connected components. Master 11+ algorithms with complexity analysis and real-world applications.', count: 11 },
    'dynamic-programming': { title: 'Dynamic Programming Algorithms', description: 'DP algorithms and patterns: Fibonacci, knapsack, LCS, and matrix chain multiplication. Learn 12+ DP techniques with memoization and tabulation approaches.', count: 12 },
    'greedy': { title: 'Greedy Algorithms', description: 'Greedy approach algorithms: activity selection, Huffman coding, and fractional knapsack. Understand 6+ algorithms with proofs of optimality and use cases.', count: 6 },
    'backtracking': { title: 'Backtracking Algorithms', description: 'Recursive backtracking patterns: N-Queens, Sudoku solver, and permutation generation. Master 7+ algorithms with pruning techniques and state space exploration.', count: 7 },
    'bit-manipulation': { title: 'Bit Manipulation Algorithms', description: 'Bitwise operations and tricks: power of two, counting bits, and bitmasking. Learn 8+ efficient bit manipulation techniques for competitive programming.', count: 8 },
    'heap-priority-queue': { title: 'Heap & Priority Queue Algorithms', description: 'Heap-based algorithms: heap sort, median finder, and task scheduling. Master 6+ algorithms using binary heaps and priority queues with O(log n) operations.', count: 6 },
    'math-number-theory': { title: 'Math & Number Theory Algorithms', description: 'Mathematical algorithms: GCD, LCM, prime numbers, and modular arithmetic. Learn 9+ number theory concepts essential for coding competitions and interviews.', count: 9 },
    'advanced': { title: 'Advanced Algorithms', description: 'Advanced techniques: segment trees, tries, and disjoint set union. Master 8+ sophisticated data structures and algorithms for complex problem solving.', count: 8 },
};

const SQL_CATEGORIES: Record<string, { title: string; description: string; count: number }> = {
    'sql-basics': { title: 'SQL Basics', description: 'Learn SQL fundamentals: SELECT, WHERE, ORDER BY, and LIMIT. Practice 14+ essential SQL queries for data analyst and data science interviews with practical examples.', count: 14 },
    'sql-joins': { title: 'SQL Joins', description: 'Master SQL JOIN operations: INNER, LEFT, RIGHT, FULL, and CROSS joins. Solve 18+ join problems with Venn diagram explanations and real-world scenarios.', count: 18 },
    'sql-aggregation': { title: 'SQL Aggregation', description: 'Learn GROUP BY, HAVING, and aggregate functions: COUNT, SUM, AVG, MIN, MAX. Practice 16+ aggregation queries essential for business intelligence roles.', count: 16 },
    'sql-subqueries': { title: 'SQL Subqueries', description: 'Master correlated and non-correlated subqueries, EXISTS, and IN clauses. Solve 15+ subquery problems with query optimization techniques for interview success.', count: 15 },
    'sql-window-functions': { title: 'SQL Window Functions', description: 'Advanced SQL with ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, and window frames. Learn 19+ window function patterns for complex analytical queries.', count: 19 },
    'sql-cte': { title: 'SQL CTEs', description: 'Learn recursive and non-recursive Common Table Expressions for query organization. Master 12+ CTE patterns to simplify complex multi-step SQL queries.', count: 12 },
    'sql-set-operations': { title: 'SQL Set Operations', description: 'Master UNION, UNION ALL, INTERSECT, and EXCEPT for combining query results. Practice 11+ set operation problems with data deduplication techniques.', count: 11 },
    'sql-strings': { title: 'SQL String Functions', description: 'String manipulation in SQL: CONCAT, SUBSTRING, REPLACE, TRIM, and pattern matching. Learn 14+ string functions for data cleaning and text processing tasks.', count: 14 },
    'sql-datetime': { title: 'SQL Date/Time Functions', description: 'Date arithmetic, extraction, and formatting: DATE_ADD, DATEDIFF, DATE_FORMAT. Master 17+ date/time operations for temporal data analysis.', count: 17 },
    'sql-conditional': { title: 'SQL Conditional Logic', description: 'CASE expressions, COALESCE, NULLIF, and IIF for conditional data processing. Practice 13+ conditional logic problems for dynamic query building.', count: 13 },
    'sql-dml': { title: 'SQL Data Modification', description: 'INSERT, UPDATE, DELETE operations with transactions and conflict handling. Learn 10+ DML patterns for data manipulation and database maintenance.', count: 10 },
    'sql-advanced': { title: 'SQL Advanced Patterns', description: 'Advanced SQL techniques: pivoting, unpivoting, gaps and islands, and running totals. Master 16+ advanced patterns for senior data engineer interviews.', count: 16 },
    'sql-performance': { title: 'SQL Performance Optimization', description: 'Query optimization strategies: indexing, execution plans, and query rewriting. Learn 8+ performance tuning techniques for large-scale database systems.', count: 8 },
    'sql-design': { title: 'SQL Database Design', description: 'Database design principles: normalization, denormalization, and schema design. Master 9+ design concepts for system design and database architecture interviews.', count: 9 },
};

// Structured data generators
const genStructuredData = (type: string, id: string, title: string, description: string, count: number): string => {
    const baseUrl = 'https://algovyn.com/smartgrind';
    const ct = type === 'c' ? 'Coding Interview Patterns' : type === 'a' ? 'Algorithms' : 'SQL';
    const bn = type === 'c' ? 'Patterns' : type === 'a' ? 'Algorithms' : 'SQL';
    return `<script type="application/ld+json">{"@context":"https://schema.org","@type":"LearningResource","name":"${escapeJson(title)}","description":"${escapeJson(description)}","url":"${baseUrl}/${type}/${id}","educationalLevel":"Advanced","learningResourceType":"ProblemSet","inLanguage":"en","provider":{"@type":"Organization","name":"AlgoVyn","url":"https://algovyn.com"},"about":{"@type":"Thing","name":"${escapeJson(ct)}"},"numberOfItems":${count}}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"SmartGrind","item":"${baseUrl}/"},{"@type":"ListItem","position":2,"name":"${escapeJson(bn)}","item":"${baseUrl}/${type}/"},{"@type":"ListItem","position":3,"name":"${escapeJson(title)}"}]}</script>`;
};

const genHomeStructuredData = (): string => `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"SmartGrind","description":"A web app for mastering coding patterns through spaced repetition.","url":"https://algovyn.com/smartgrind","applicationCategory":"EducationalApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.8","ratingCount":"1500","bestRating":"5"},"featureList":"Spaced repetition, 500+ LeetCode problems, 15+ coding patterns, Offline mode, Progress sync across devices, Multiple language solutions","author":{"@type":"Organization","name":"AlgoVyn"}}</script>`;

// Problem structured data generator
const genProblemStructuredData = (problem: typeof TOP_PROBLEMS[0]): string => {
    const baseUrl = 'https://algovyn.com/smartgrind';
    const categoryTitles: Record<string, string> = {
        'c': 'Patterns', 'a': 'Algorithms', 's': 'SQL'
    };
    const categoryName = categoryTitles[problem.categoryType] || 'Problems';
    
    return `<script type="application/ld+json">{"@context":"https://schema.org","@type":"LearningResource","name":"${escapeJson(problem.title)} LeetCode Solution","description":"${escapeJson(problem.description)} Learn how to solve ${problem.title} with detailed explanations and code in Python, Java, C++, and JavaScript.","url":"${baseUrl}/p/${problem.slug}","educationalLevel":"${problem.difficulty === 'Hard' ? 'Expert' : problem.difficulty === 'Medium' ? 'Advanced' : 'Beginner'}","learningResourceType":"CodingProblem","inLanguage":"en","isPartOf":{"@type":"LearningResource","name":"SmartGrind ${categoryName}","url":"${baseUrl}/${problem.categoryType}/${problem.category}"},"educationalUse":"Coding interview preparation","teaches":"${escapeJson(problem.topics.join(', '))}","provider":{"@type":"Organization","name":"AlgoVyn","url":"https://algovyn.com"}}</script><script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"SmartGrind","item":"${baseUrl}/"},{"@type":"ListItem","position":2,"name":"${escapeJson(categoryName)}","item":"${baseUrl}/${problem.categoryType}/${problem.category}/"},{"@type":"ListItem","position":3,"name":"${escapeJson(problem.title)}"}]}</script>`;
};

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
    
    // PASS THROUGH: All non-GET and non-HEAD requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
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
    let problem: typeof TOP_PROBLEMS[0] | null = null;
    let isHome = cleanPath === '/' || cleanPath === '';
    
    if (!isHome) {
        const pm = cleanPath.match(/^\/c\/([^/]+)$/);
        if (pm && PATTERN_CATEGORIES[pm[1]]) cat = { type: 'c', id: pm[1], data: PATTERN_CATEGORIES[pm[1]] };
        
        const am = cleanPath.match(/^\/a\/([^/]+)$/);
        if (am && ALGORITHM_CATEGORIES[am[1]]) cat = { type: 'a', id: am[1], data: ALGORITHM_CATEGORIES[am[1]] };
        
        const sm = cleanPath.match(/^\/s\/([^/]+)$/);
        if (sm && SQL_CATEGORIES[sm[1]]) cat = { type: 's', id: sm[1], data: SQL_CATEGORIES[sm[1]] };
        
        // Check for problem page route: /p/:slug
        const probMatch = cleanPath.match(/^\/p\/([^/]+)$/);
        if (probMatch) {
            const problemSlug = probMatch[1];
            if (problemSlug) {
                const foundProblem = getProblemBySlug(problemSlug);
                if (foundProblem) {
                    problem = foundProblem;
                }
            }
        }
    }
    
    // If not a route we handle, pass through to static assets
    if (!cat && !isHome && !problem) {
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
                escapeHtmlAttr('Master coding interview patterns with SmartGrind\'s spaced repetition system. Practice 500+ LeetCode problems with detailed solutions in Python, Java, C++, and JavaScript. Track progress, learn 15+ essential patterns including Two Pointers, Dynamic Programming, Graphs, and more. Free coding interview prep tool with offline support.'),
                escapeHtmlAttr('leetcode patterns, coding interview prep, spaced repetition coding, algorithm patterns, data structures and algorithms, technical interview preparation, FAANG interview'),
                baseUrl + '/',
                escapeHtmlAttr('SmartGrind: Master Coding Patterns with Spaced Repetition'),
                escapeHtmlAttr('Master coding interview patterns with spaced repetition. Practice 500+ LeetCode problems with solutions in Python, Java, C++, and JavaScript. Free with offline support.')
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
        } else if (problem) {
            // Generate meta tags for problem page
            const pageUrl = `${baseUrl}/p/${problem.slug}`;
            const companiesStr = problem.companies.join(', ');
            const topicsStr = problem.topics.join(', ');
            
            meta = genMetaTags(
                escapeHtml(`${problem.title} LeetCode Solution - ${problem.difficulty} | SmartGrind`),
                escapeHtmlAttr(`${problem.description} Detailed solution with code in Python, Java, C++, JavaScript. Asked at ${companiesStr}.`),
                escapeHtmlAttr(`${problem.slug}, leetcode solution, ${problem.difficulty.toLowerCase()} leetcode, ${topicsStr.toLowerCase()}, coding interview`),
                pageUrl,
                escapeHtmlAttr(`${problem.title} LeetCode ${problem.difficulty} Solution`),
                escapeHtmlAttr(`${problem.description.substring(0, 120)}... Learn how to solve with detailed explanations.`)
            );
            structured = genProblemStructuredData(problem);
            initialState = genInitialState(problem.categoryType, problem.category);
        }
        
        // Inject meta tags and structured data
        html = html.replace(/<head>/i, `<head>${meta}`);
        html = html.replace(/<\/head>/i, `${structured}${initialState}</head>`);
        
        // For HEAD requests, return headers only without body
        const responseBody = request.method === 'HEAD' ? null : html;
        
        return new Response(responseBody, {
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
