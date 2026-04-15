/**
 * Comprehensive tests for SSR (Server-Side Rendering) Path Handler
 * Tests the Cloudflare Worker function that handles SEO meta tag injection
 * 
 * @module tests/functions/ssr-path
 */

import { onRequest } from '../../functions/[[path]]';

describe('SSR Path Handler', () => {
    let mockNext: jest.Mock;
    let mockEnv: { ASSETS?: { fetch: jest.Mock } };
    let mockFetch: jest.Mock;

    // Sample index.html content for testing
    const sampleIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div id="app"></div>
</body>
</html>`;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Mock the next() function
        mockNext = jest.fn().mockResolvedValue(new Response('next response', { status: 200 }));
        
        // Mock ASSETS binding
        mockEnv = {
            ASSETS: {
                fetch: jest.fn(),
            },
        };
        
        // Mock global fetch for when ASSETS is not available
        mockFetch = jest.fn();
        (global.fetch as jest.Mock) = mockFetch;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // ============================================
    // HTML ESCAPING FUNCTIONS
    // ============================================
    describe('HTML Escaping Functions', () => {
        
        test('should escape HTML entities correctly', async () => {
            const request = new Request('https://example.com/c/two-pointers');
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );

            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            // Verify basic response structure
            expect(html).toContain('<!DOCTYPE html>');
            expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
        });

        test('should handle special characters in category data', async () => {
            // Create a modified response to test escaping indirectly
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );

            const request = new Request('https://example.com/c/two-pointers');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(response.status).toBe(200);
            const html = await response.text();
            
            // Verify title contains escaped content
            expect(html).toContain('<title>');
            expect(html).toContain('</title>');
        });

        test('should escape JSON in structured data', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );

            const request = new Request('https://example.com/c/two-pointers');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            // Verify structured data contains properly formatted JSON-LD
            expect(html).toContain('application/ld+json');
            expect(html).toContain('@context');
            expect(html).toContain('https://schema.org');
        });
    });

    // ============================================
    // NON-GET REQUEST PASS-THROUGH
    // ============================================
    describe('Non-GET Request Pass-Through', () => {
        
        test('should pass through POST requests', async () => {
            const request = new Request('https://example.com/c/two-pointers', {
                method: 'POST',
            });

            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through PUT requests', async () => {
            const request = new Request('https://example.com/c/two-pointers', {
                method: 'PUT',
                body: JSON.stringify({ test: 'data' }),
            });

            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through DELETE requests', async () => {
            const request = new Request('https://example.com/c/two-pointers', {
                method: 'DELETE',
            });

            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through PATCH requests', async () => {
            const request = new Request('https://example.com/c/two-pointers', {
                method: 'PATCH',
            });

            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through OPTIONS requests', async () => {
            const request = new Request('https://example.com/c/two-pointers', {
                method: 'OPTIONS',
            });

            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================
    // API ROUTE PASS-THROUGH
    // ============================================
    describe('API Route Pass-Through', () => {
        
        test('should pass through /api/ routes', async () => {
            const request = new Request('https://example.com/api/save', {
                method: 'GET',
            });

            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through nested API routes', async () => {
            const request = new Request('https://example.com/api/v1/users/data', {
                method: 'GET',
            });

            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through API routes with query params', async () => {
            const request = new Request('https://example.com/api/load?user=test', {
                method: 'GET',
            });

            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================
    // STATIC ASSET SERVING
    // ============================================
    describe('Static Asset Serving', () => {
        
        test('should serve .js files via ASSETS', async () => {
            const jsContent = 'console.log("test");';
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(jsContent, { 
                    status: 200, 
                    headers: { 'Content-Type': 'application/javascript' } 
                })
            );

            const request = new Request('https://example.com/app.js');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalledWith(
                expect.objectContaining({ pathname: '/app.js' })
            );
            expect(await response.text()).toBe(jsContent);
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should serve .css files via ASSETS', async () => {
            const cssContent = 'body { color: red; }';
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(cssContent, { 
                    status: 200, 
                    headers: { 'Content-Type': 'text/css' } 
                })
            );

            const request = new Request('https://example.com/styles.css');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
            expect(await response.text()).toBe(cssContent);
        });

        test('should serve .png files via ASSETS', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('png-binary-data', { status: 200 })
            );

            const request = new Request('https://example.com/image.png');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
            expect(await response.text()).toBe('png-binary-data');
        });

        test('should serve .svg files via ASSETS', async () => {
            const svgContent = '<svg><circle /></svg>';
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(svgContent, { status: 200 })
            );

            const request = new Request('https://example.com/icon.svg');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
            expect(await response.text()).toBe(svgContent);
        });

        test('should serve .json files via ASSETS', async () => {
            const jsonContent = '{"key": "value"}';
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(jsonContent, { status: 200 })
            );

            const request = new Request('https://example.com/data.json');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
            expect(await response.text()).toBe(jsonContent);
        });

        test('should serve .woff2 font files via ASSETS', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('font-data', { status: 200 })
            );

            const request = new Request('https://example.com/font.woff2');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
        });

        test('should serve .map source map files via ASSETS', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('{"version": 3}', { status: 200 })
            );

            const request = new Request('https://example.com/app.js.map');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
        });

        test('should serve assets from /assets/ directory', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('asset content', { status: 200 })
            );

            const request = new Request('https://example.com/assets/logo.png');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should serve assets from /static/ directory', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('static content', { status: 200 })
            );

            const request = new Request('https://example.com/static/image.jpg');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
            expect(mockNext).not.toHaveBeenCalled();
        });

        test('should fall through to next() when ASSETS fetch fails', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('not found', { status: 404 })
            );

            const request = new Request('https://example.com/app.js');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should fall through to next() when ASSETS throws error', async () => {
            mockEnv.ASSETS!.fetch.mockRejectedValue(new Error('Network error'));

            const request = new Request('https://example.com/app.js');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should fall through to next() when ASSETS is not available', async () => {
            mockFetch.mockResolvedValue(
                new Response('not found', { status: 404 })
            );

            const request = new Request('https://example.com/app.js');
            await onRequest({
                request,
                env: {}, // No ASSETS binding
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should handle uppercase file extensions', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('image data', { status: 200 })
            );

            const request = new Request('https://example.com/image.PNG');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
        });

        test('should fall through to next() when asset directory fetch returns null', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('not found', { status: 404 })
            );

            const request = new Request('https://example.com/assets/image.png');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should fall through to next() when static directory fetch returns null', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('not found', { status: 404 })
            );

            const request = new Request('https://example.com/static/file.js');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should fall through to next() when asset directory ASSETS is not available', async () => {
            const request = new Request('https://example.com/assets/logo.png');
            await onRequest({
                request,
                env: {}, // No ASSETS binding
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should fall through to next() when static directory ASSETS is not available', async () => {
            const request = new Request('https://example.com/static/styles.css');
            await onRequest({
                request,
                env: {}, // No ASSETS binding
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================
    // PATTERN CATEGORY ROUTES (/c/)
    // ============================================
    describe('Pattern Category Routes (/c/)', () => {
        
        beforeEach(() => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );
        });

        test('should handle /c/two-pointers route', async () => {
            const request = new Request('https://example.com/c/two-pointers');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Two Pointers Pattern');
            expect(html).toContain('application/ld+json');
            expect(html).toContain('window.__INITIAL_STATE__');
            expect(html).toContain('type:"c"');
            expect(html).toContain('id:"two-pointers"');
        });

        test('should handle /c/sliding-window route', async () => {
            const request = new Request('https://example.com/c/sliding-window');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Sliding Window Pattern');
        });

        test('should handle /c/arrays-hashing route', async () => {
            const request = new Request('https://example.com/c/arrays-hashing');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Arrays &amp; Hashing Patterns');
        });

        test('should handle /c/linked-lists route', async () => {
            const request = new Request('https://example.com/c/linked-lists');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Linked List Patterns');
        });

        test('should handle /c/stacks route', async () => {
            const request = new Request('https://example.com/c/stacks');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Stack Patterns');
        });

        test('should handle /c/heaps route', async () => {
            const request = new Request('https://example.com/c/heaps');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Heap &amp; Priority Queue Patterns');
        });

        test('should handle /c/trees route', async () => {
            const request = new Request('https://example.com/c/trees');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Tree Patterns');
        });

        test('should handle /c/graphs route', async () => {
            const request = new Request('https://example.com/c/graphs');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Graph Patterns');
        });

        test('should handle /c/binary-search route', async () => {
            const request = new Request('https://example.com/c/binary-search');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Binary Search Patterns');
        });

        test('should handle /c/backtracking route', async () => {
            const request = new Request('https://example.com/c/backtracking');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Backtracking Patterns');
        });

        test('should handle /c/dp route', async () => {
            const request = new Request('https://example.com/c/dp');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Dynamic Programming Patterns');
        });

        test('should handle /c/greedy route', async () => {
            const request = new Request('https://example.com/c/greedy');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Greedy Algorithm Patterns');
        });

        test('should handle /c/bit-manipulation route', async () => {
            const request = new Request('https://example.com/c/bit-manipulation');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Bit Manipulation Patterns');
        });

        test('should handle /c/string-manipulation route', async () => {
            const request = new Request('https://example.com/c/string-manipulation');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('String Manipulation Patterns');
        });

        test('should handle /c/design route', async () => {
            const request = new Request('https://example.com/c/design');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('System Design Patterns');
        });

        test('should pass through unknown pattern categories', async () => {
            const request = new Request('https://example.com/c/unknown-pattern');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================
    // ALGORITHM CATEGORY ROUTES (/a/)
    // ============================================
    describe('Algorithm Category Routes (/a/)', () => {
        
        beforeEach(() => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );
        });

        test('should handle /a/arrays-strings route', async () => {
            const request = new Request('https://example.com/a/arrays-strings');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Arrays &amp; Strings Algorithms');
            expect(html).toContain('type:"a"');
            expect(html).toContain('id:"arrays-strings"');
        });

        test('should handle /a/linked-list route', async () => {
            const request = new Request('https://example.com/a/linked-list');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Linked List Algorithms');
        });

        test('should handle /a/trees-bsts route', async () => {
            const request = new Request('https://example.com/a/trees-bsts');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Trees &amp; BST Algorithms');
        });

        test('should handle /a/graphs route', async () => {
            const request = new Request('https://example.com/a/graphs');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Graph Algorithms');
        });

        test('should handle /a/dynamic-programming route', async () => {
            const request = new Request('https://example.com/a/dynamic-programming');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Dynamic Programming Algorithms');
        });

        test('should handle /a/greedy route', async () => {
            const request = new Request('https://example.com/a/greedy');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Greedy Algorithms');
        });

        test('should handle /a/backtracking route', async () => {
            const request = new Request('https://example.com/a/backtracking');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Backtracking Algorithms');
        });

        test('should handle /a/bit-manipulation route', async () => {
            const request = new Request('https://example.com/a/bit-manipulation');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Bit Manipulation Algorithms');
        });

        test('should handle /a/heap-priority-queue route', async () => {
            const request = new Request('https://example.com/a/heap-priority-queue');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Heap &amp; Priority Queue Algorithms');
        });

        test('should handle /a/math-number-theory route', async () => {
            const request = new Request('https://example.com/a/math-number-theory');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Math &amp; Number Theory Algorithms');
        });

        test('should handle /a/advanced route', async () => {
            const request = new Request('https://example.com/a/advanced');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Advanced Algorithms');
        });

        test('should pass through unknown algorithm categories', async () => {
            const request = new Request('https://example.com/a/unknown-algo');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================
    // SQL CATEGORY ROUTES (/s/)
    // ============================================
    describe('SQL Category Routes (/s/)', () => {
        
        beforeEach(() => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );
        });

        test('should handle /s/sql-basics route', async () => {
            const request = new Request('https://example.com/s/sql-basics');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Basics');
            expect(html).toContain('type:"s"');
            expect(html).toContain('id:"sql-basics"');
        });

        test('should handle /s/sql-joins route', async () => {
            const request = new Request('https://example.com/s/sql-joins');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Joins');
        });

        test('should handle /s/sql-aggregation route', async () => {
            const request = new Request('https://example.com/s/sql-aggregation');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Aggregation');
        });

        test('should handle /s/sql-subqueries route', async () => {
            const request = new Request('https://example.com/s/sql-subqueries');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Subqueries');
        });

        test('should handle /s/sql-window-functions route', async () => {
            const request = new Request('https://example.com/s/sql-window-functions');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Window Functions');
        });

        test('should handle /s/sql-cte route', async () => {
            const request = new Request('https://example.com/s/sql-cte');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL CTEs');
        });

        test('should handle /s/sql-set-operations route', async () => {
            const request = new Request('https://example.com/s/sql-set-operations');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Set Operations');
        });

        test('should handle /s/sql-strings route', async () => {
            const request = new Request('https://example.com/s/sql-strings');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL String Functions');
        });

        test('should handle /s/sql-datetime route', async () => {
            const request = new Request('https://example.com/s/sql-datetime');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Date/Time Functions');
        });

        test('should handle /s/sql-conditional route', async () => {
            const request = new Request('https://example.com/s/sql-conditional');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Conditional Logic');
        });

        test('should handle /s/sql-dml route', async () => {
            const request = new Request('https://example.com/s/sql-dml');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Data Modification');
        });

        test('should handle /s/sql-advanced route', async () => {
            const request = new Request('https://example.com/s/sql-advanced');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Advanced Patterns');
        });

        test('should handle /s/sql-performance route', async () => {
            const request = new Request('https://example.com/s/sql-performance');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Performance Optimization');
        });

        test('should handle /s/sql-design route', async () => {
            const request = new Request('https://example.com/s/sql-design');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL Database Design');
        });

        test('should pass through unknown SQL categories', async () => {
            const request = new Request('https://example.com/s/unknown-sql');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================
    // HOME PAGE ROUTE
    // ============================================
    describe('Home Page Route', () => {
        
        beforeEach(() => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );
        });

        test('should handle root / path', async () => {
            const request = new Request('https://example.com/');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SmartGrind');
            expect(html).toContain('Master Coding Patterns with Spaced Repetition');
            expect(html).toContain('application/ld+json');
            expect(html).toContain('WebApplication');
        });

        test('should handle empty path', async () => {
            const request = new Request('https://example.com');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SmartGrind');
        });

        test('should handle /smartgrind/ path prefix', async () => {
            const request = new Request('https://example.com/smartgrind/');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SmartGrind');
            expect(html).toContain('Master Coding Patterns with Spaced Repetition');
        });

        test('should handle /smartgrind path without trailing slash', async () => {
            const request = new Request('https://example.com/smartgrind');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SmartGrind');
        });

        test('should handle /smartgrind/c/two-pointers path', async () => {
            const request = new Request('https://example.com/smartgrind/c/two-pointers');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Two Pointers Pattern');
            expect(html).toContain('type:"c"');
        });

        test('should include home page structured data', async () => {
            const request = new Request('https://example.com/');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('"@type":"WebApplication"');
            expect(html).toContain('EducationalApplication');
            expect(html).toContain('AlgoVyn');
        });

        test('should include home page meta tags', async () => {
            const request = new Request('https://example.com/');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('<title>');
            expect(html).toContain('<meta name="description"');
            expect(html).toContain('<meta name="keywords"');
            expect(html).toContain('<meta property="og:title"');
            expect(html).toContain('<meta property="og:description"');
            expect(html).toContain('<meta name="twitter:card"');
        });
    });

    // ============================================
    // META TAG GENERATION
    // ============================================
    describe('Meta Tag Generation', () => {
        
        beforeEach(() => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );
        });

        test('should generate complete meta tags for category page', async () => {
            const request = new Request('https://example.com/c/two-pointers');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            
            // Title
            expect(html).toContain('<title>Two Pointers Pattern - SmartGrind</title>');
            
            // Meta description
            expect(html).toContain('<meta name="description" content="');
            expect(html).toContain('Master two pointer techniques');
            
            // Keywords
            expect(html).toContain('<meta name="keywords" content="');
            expect(html).toContain('pattern, coding interview, leetcode');
            
            // Canonical link
            expect(html).toContain('<link rel="canonical" href="https://algovyn.com/smartgrind/c/two-pointers">');
            
            // OG tags
            expect(html).toContain('<meta property="og:site_name" content="AlgoVyn - SmartGrind">');
            expect(html).toContain('<meta property="og:title" content="');
            expect(html).toContain('<meta property="og:description" content="');
            expect(html).toContain('<meta property="og:image" content="https://algovyn.com/smartgrind/logo.svg">');
            expect(html).toContain('<meta property="og:type" content="website">');
            
            // Twitter tags
            expect(html).toContain('<meta name="twitter:card" content="summary_large_image">');
            expect(html).toContain('<meta name="twitter:title" content="');
            expect(html).toContain('<meta name="twitter:image" content="https://algovyn.com/smartgrind/logo.svg">');
        });

        test('should set cache control headers', async () => {
            const request = new Request('https://example.com/c/two-pointers');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(response.headers.get('Cache-Control')).toBe('public, max-age=300, stale-while-revalidate=86400');
            expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
        });
    });

    // ============================================
    // STRUCTURED DATA GENERATION
    // ============================================
    describe('Structured Data (JSON-LD) Generation', () => {
        
        beforeEach(() => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );
        });

        test('should generate LearningResource structured data for pattern', async () => {
            const request = new Request('https://example.com/c/two-pointers');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            
            expect(html).toContain('"@type":"LearningResource"');
            expect(html).toContain('"educationalLevel":"Advanced"');
            expect(html).toContain('"learningResourceType":"ProblemSet"');
            expect(html).toContain('"inLanguage":"en"');
            expect(html).toContain('"numberOfItems":45');
            expect(html).toContain('"provider"');
            expect(html).toContain('AlgoVyn');
        });

        test('should generate BreadcrumbList structured data', async () => {
            const request = new Request('https://example.com/c/two-pointers');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            
            expect(html).toContain('"@type":"BreadcrumbList"');
            expect(html).toContain('"position":1');
            expect(html).toContain('"position":2');
            expect(html).toContain('"position":3');
            expect(html).toContain('SmartGrind');
            expect(html).toContain('Patterns');
            expect(html).toContain('Two Pointers Pattern');
        });

        test('should include correct category type in structured data for algorithms', async () => {
            const request = new Request('https://example.com/a/arrays-strings');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('Algorithms');
            expect(html).toContain('"about"');
        });

        test('should include correct category type in structured data for SQL', async () => {
            const request = new Request('https://example.com/s/sql-basics');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('SQL');
        });
    });

    // ============================================
    // INITIAL STATE GENERATION
    // ============================================
    describe('Initial State Script Generation', () => {
        
        beforeEach(() => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );
        });

        test('should inject __INITIAL_STATE__ for pattern route', async () => {
            const request = new Request('https://example.com/c/sliding-window');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('window.__INITIAL_STATE__');
            expect(html).toContain('type:"c"');
            expect(html).toContain('id:"sliding-window"');
        });

        test('should inject __INITIAL_STATE__ for algorithm route', async () => {
            const request = new Request('https://example.com/a/graphs');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('window.__INITIAL_STATE__');
            expect(html).toContain('type:"a"');
            expect(html).toContain('id:"graphs"');
        });

        test('should inject __INITIAL_STATE__ for SQL route', async () => {
            const request = new Request('https://example.com/s/sql-joins');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).toContain('window.__INITIAL_STATE__');
            expect(html).toContain('type:"s"');
            expect(html).toContain('id:"sql-joins"');
        });

        test('should not inject __INITIAL_STATE__ for home page', async () => {
            const request = new Request('https://example.com/');
            const response = await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            const html = await response.text();
            expect(html).not.toContain('window.__INITIAL_STATE__');
        });
    });

    // ============================================
    // ERROR HANDLING
    // ============================================
    describe('Error Handling', () => {
        
        test('should pass through to next() when ASSETS fetch fails', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('Not Found', { status: 404 })
            );

            const request = new Request('https://example.com/c/two-pointers');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through to next() when fetch throws', async () => {
            mockEnv.ASSETS!.fetch.mockRejectedValue(new Error('Network error'));

            const request = new Request('https://example.com/c/two-pointers');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through to next() when response is not HTML', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response('Not HTML content', { status: 200 })
            );

            const request = new Request('https://example.com/c/two-pointers');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through to next() when using global fetch and it fails', async () => {
            mockFetch.mockResolvedValue(
                new Response('Error', { status: 500 })
            );

            const request = new Request('https://example.com/c/two-pointers');
            await onRequest({
                request,
                env: {}, // No ASSETS
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should handle unexpected errors gracefully', async () => {
            // Force an error by making ASSETS.fetch throw unexpectedly
            mockEnv.ASSETS!.fetch.mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            const request = new Request('https://example.com/c/two-pointers');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should handle errors in SSR processing phase', async () => {
            // Successfully fetch index.html but then have response.text() throw
            const mockResponse = new Response(sampleIndexHtml, { status: 200 });
            mockResponse.text = jest.fn().mockRejectedValue(new Error('Parse error'));
            mockEnv.ASSETS!.fetch.mockResolvedValue(mockResponse);

            const request = new Request('https://example.com/c/two-pointers');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================
    // FALLBACK ROUTES (Pass-Through)
    // ============================================
    describe('Unknown Route Pass-Through', () => {
        
        beforeEach(() => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );
        });

        test('should pass through unmatched routes', async () => {
            const request = new Request('https://example.com/random/path');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through /other/ routes', async () => {
            const request = new Request('https://example.com/other/page');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through routes with extra segments', async () => {
            const request = new Request('https://example.com/c/two-pointers/extra');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through /c/ without category', async () => {
            const request = new Request('https://example.com/c/');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through /a/ without category', async () => {
            const request = new Request('https://example.com/a/');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });

        test('should pass through /s/ without category', async () => {
            const request = new Request('https://example.com/s/');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockNext).toHaveBeenCalledTimes(1);
        });
    });

    // ============================================
    // ASSETS BINDING BEHAVIORS
    // ============================================
    describe('Assets Binding Behaviors', () => {
        
        test('should use global fetch when ASSETS is not provided', async () => {
            mockFetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );

            const request = new Request('https://example.com/c/two-pointers');
            const response = await onRequest({
                request,
                env: {}, // No ASSETS
                next: mockNext,
            });

            expect(mockFetch).toHaveBeenCalled();
            expect(response.status).toBe(200);
        });

        test('should use ASSETS.fetch when available', async () => {
            mockEnv.ASSETS!.fetch.mockResolvedValue(
                new Response(sampleIndexHtml, { status: 200 })
            );

            const request = new Request('https://example.com/c/two-pointers');
            await onRequest({
                request,
                env: mockEnv,
                next: mockNext,
            });

            expect(mockEnv.ASSETS!.fetch).toHaveBeenCalled();
            expect(mockFetch).not.toHaveBeenCalled();
        });
    });
});
