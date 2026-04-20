// --- SSR FUNCTION INTEGRATION TESTS ---
// Tests for the SEO SSR Cloudflare Pages Function

// Mock the top-problems module
jest.mock('../../src/data/top-problems', () => ({
    TOP_PROBLEMS: [
        {
            id: '1',
            slug: 'two-sum',
            title: 'Two Sum',
            difficulty: 'Easy',
            category: 'arrays-hashing',
            categoryType: 'c',
            description: 'Find two numbers that add up to target.',
            topics: ['Array', 'Hash Table'],
            companies: ['Amazon', 'Google'],
        },
        {
            id: '146',
            slug: 'lru-cache',
            title: 'LRU Cache',
            difficulty: 'Medium',
            category: 'design',
            categoryType: 'c',
            description: 'Design LRU cache with O(1) operations.',
            topics: ['Design', 'Hash Table', 'Linked List'],
            companies: ['Amazon', 'Facebook'],
        },
    ],
    getProblemBySlug: jest.fn((slug: string) => {
        const problems = [
            {
                id: '1',
                slug: 'two-sum',
                title: 'Two Sum',
                difficulty: 'Easy',
                category: 'arrays-hashing',
                categoryType: 'c',
                description: 'Find two numbers that add up to target.',
                topics: ['Array', 'Hash Table'],
                companies: ['Amazon', 'Google'],
            },
            {
                id: '146',
                slug: 'lru-cache',
                title: 'LRU Cache',
                difficulty: 'Medium',
                category: 'design',
                categoryType: 'c',
                description: 'Design LRU cache with O(1) operations.',
                topics: ['Design', 'Hash Table', 'Linked List'],
                companies: ['Amazon', 'Facebook'],
            },
        ];
        return problems.find(p => p.slug === slug);
    }),
}));

// Import after mocking
import { onRequest } from '../../functions/[[path]]';

describe('SSR Function - SEO Integration Tests', () => {
    const mockNext = jest.fn();
    const mockIndexHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Default Title</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

    beforeEach(() => {
        jest.clearAllMocks();
        mockNext.mockResolvedValue(new Response('Static content', { status: 200 }));
    });

    const createMockEnv = (hasAssets: boolean = true): { ASSETS?: { fetch: typeof fetch } } => {
        if (!hasAssets) return {};
        
        return {
            ASSETS: {
                fetch: jest.fn().mockResolvedValue(
                    new Response(mockIndexHtml, { 
                        status: 200,
                        headers: { 'Content-Type': 'text/html' }
                    })
                ),
            },
        };
    };

    describe('Route Handling', () => {
        it('should pass through non-GET and non-HEAD requests', async () => {
            const request = new Request('https://algovyn.com/smartgrind/', { method: 'POST' });
            const env = createMockEnv();
            
            await onRequest({ request, env, next: mockNext });
            
            expect(mockNext).toHaveBeenCalled();
        });

        it('should process HEAD requests for SSR', async () => {
            const request = new Request('https://algovyn.com/smartgrind/', { method: 'HEAD' });
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            
            // HEAD requests should be processed (not passed through)
            expect(response.status).toBe(200);
            expect(mockNext).not.toHaveBeenCalled();
            // HEAD response should have no body
            const body = await response.text();
            expect(body).toBe('');
        });

        it('should process HEAD requests for category pages', async () => {
            const request = new Request('https://algovyn.com/smartgrind/c/two-pointers', { method: 'HEAD' });
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            
            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
            const body = await response.text();
            expect(body).toBe('');
        });

        it('should serve asset files directly when ASSETS.fetch succeeds', async () => {
            const request = new Request('https://algovyn.com/smartgrind/main.js');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            
            // When ASSETS.fetch succeeds, it returns the asset directly
            expect(response.status).toBe(200);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should serve asset directories directly when ASSETS.fetch succeeds', async () => {
            const request = new Request('https://algovyn.com/smartgrind/assets/logo.svg');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            
            // When ASSETS.fetch succeeds, it returns the asset directly
            expect(response.status).toBe(200);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should pass through asset files when ASSETS.fetch fails', async () => {
            const request = new Request('https://algovyn.com/smartgrind/main.js');
            const env = {
                ASSETS: {
                    fetch: jest.fn().mockResolvedValue(new Response('Not found', { status: 404 })),
                },
            };
            
            await onRequest({ request, env, next: mockNext });
            
            expect(mockNext).toHaveBeenCalled();
        });

        it('should pass through API routes', async () => {
            const request = new Request('https://algovyn.com/smartgrind/api/user');
            const env = createMockEnv();
            
            await onRequest({ request, env, next: mockNext });
            
            expect(mockNext).toHaveBeenCalled();
        });

        it('should pass through unknown routes', async () => {
            const request = new Request('https://algovyn.com/smartgrind/unknown-route');
            const env = createMockEnv();
            
            await onRequest({ request, env, next: mockNext });
            
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('Home Page SSR', () => {
        it('should inject SEO meta tags for home page', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('SmartGrind: Master Coding Patterns');
            expect(html).toContain('500+ LeetCode problems');
            expect(html).toContain('@type":"WebApplication"');
        });

        it('should include SoftwareApplication schema with ratings', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('"ratingValue":"4.8"');
            expect(html).toContain('"ratingCount":"1500"');
            expect(html).toContain('featureList');
        });
    });

    describe('Category Page SSR', () => {
        it('should inject meta tags for pattern category', async () => {
            const request = new Request('https://algovyn.com/smartgrind/c/two-pointers');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('Two Pointers Pattern');
            expect(html).toContain('Master two pointer techniques');
            expect(html).toContain('@type":"LearningResource"');
        });

        it('should inject meta tags for algorithm category', async () => {
            const request = new Request('https://algovyn.com/smartgrind/a/dynamic-programming');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('Dynamic Programming Algorithms');
            expect(html).toContain('DP algorithms and patterns');
        });

        it('should inject meta tags for SQL category', async () => {
            const request = new Request('https://algovyn.com/smartgrind/s/sql-joins');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('SQL Joins');
            expect(html).toContain('Master SQL JOIN operations');
        });

        it('should include BreadcrumbList schema for categories', async () => {
            const request = new Request('https://algovyn.com/smartgrind/c/trees');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('@type":"BreadcrumbList"');
            expect(html).toContain('"position":1');
            expect(html).toContain('"position":2');
            expect(html).toContain('"position":3');
        });
    });

    describe('Problem Page SSR', () => {
        it('should inject meta tags for problem page', async () => {
            const request = new Request('https://algovyn.com/smartgrind/p/two-sum');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('Two Sum LeetCode Solution');
            expect(html).toContain('Easy');
            expect(html).toContain('Amazon');
            expect(html).toContain('Google');
        });

        it('should include LearningResource schema for problems', async () => {
            const request = new Request('https://algovyn.com/smartgrind/p/two-sum');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('@type":"LearningResource"');
            expect(html).toContain('"educationalLevel":"Beginner"');
            expect(html).toContain('"learningResourceType":"CodingProblem"');
        });

        it('should include problem description in meta', async () => {
            const request = new Request('https://algovyn.com/smartgrind/p/two-sum');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('Find two numbers that add up to target');
        });

        it('should pass through for unknown problem slugs', async () => {
            const request = new Request('https://algovyn.com/smartgrind/p/unknown-problem');
            const env = createMockEnv();
            
            await onRequest({ request, env, next: mockNext });
            
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('Canonical URLs', () => {
        it('should include canonical URL for home page', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('<link rel="canonical" href="https://algovyn.com/smartgrind/">');
        });

        it('should include canonical URL for category pages', async () => {
            const request = new Request('https://algovyn.com/smartgrind/c/two-pointers');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('<link rel="canonical" href="https://algovyn.com/smartgrind/c/two-pointers">');
        });

        it('should include canonical URL for problem pages', async () => {
            const request = new Request('https://algovyn.com/smartgrind/p/two-sum');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('<link rel="canonical" href="https://algovyn.com/smartgrind/p/two-sum">');
        });
    });

    describe('Open Graph and Twitter Cards', () => {
        it('should include Open Graph tags for home page', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('property="og:title"');
            expect(html).toContain('property="og:description"');
            expect(html).toContain('property="og:image"');
            expect(html).toContain('property="og:url"');
            expect(html).toContain('property="og:type" content="website"');
        });

        it('should include Twitter Card tags', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('name="twitter:card"');
            expect(html).toContain('name="twitter:title"');
            expect(html).toContain('name="twitter:description"');
            expect(html).toContain('name="twitter:image"');
        });
    });

    describe('Cache Headers', () => {
        it('should set appropriate cache headers', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            
            expect(response.headers.get('Cache-Control')).toContain('public');
            expect(response.headers.get('Cache-Control')).toContain('max-age=300');
            expect(response.headers.get('Cache-Control')).toContain('stale-while-revalidate=86400');
        });
    });

    describe('Error Handling', () => {
        it('should fall through to next when index.html fetch fails', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = {
                ASSETS: {
                    fetch: jest.fn().mockResolvedValue(
                        new Response('Not found', { status: 404 })
                    ),
                },
            };
            
            await onRequest({ request, env, next: mockNext });
            
            expect(mockNext).toHaveBeenCalled();
        });

        it('should handle missing ASSETS binding gracefully', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = {};
            
            await onRequest({ request, env, next: mockNext });
            
            expect(mockNext).toHaveBeenCalled();
        });

        it('should fall through when HTML response is invalid', async () => {
            const request = new Request('https://algovyn.com/smartgrind/');
            const env = {
                ASSETS: {
                    fetch: jest.fn().mockResolvedValue(
                        new Response('Invalid content', { status: 200 })
                    ),
                },
            };
            
            await onRequest({ request, env, next: mockNext });
            
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('Initial State Injection', () => {
        it('should inject initial state for category pages', async () => {
            const request = new Request('https://algovyn.com/smartgrind/c/two-pointers');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('window.__INITIAL_STATE__');
            // Handle both escaped and unescaped quotes
            expect(html).toMatch(/type[:=]\\?"c\\?"/);
            expect(html).toMatch(/id[:=]\\?"two-pointers\\?"/);
        });

        it('should inject initial state for problem pages', async () => {
            const request = new Request('https://algovyn.com/smartgrind/p/two-sum');
            const env = createMockEnv();
            
            const response = await onRequest({ request, env, next: mockNext });
            const html = await response.text();
            
            expect(html).toContain('window.__INITIAL_STATE__');
        });
    });
});
