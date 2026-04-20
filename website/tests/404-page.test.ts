// --- 404 PAGE TESTS ---
// Tests for the 404 error page structure and content

import * as fs from 'fs';
import * as path from 'path';

describe('404 Error Page', () => {
    let htmlContent: string;

    beforeAll(() => {
        // Read the actual 404.html file
        const filePath = path.join(__dirname, '../public/404.html');
        htmlContent = fs.readFileSync(filePath, 'utf-8');
    });

    describe('Meta Tags and SEO', () => {
        it('should have noindex, follow robots tag', () => {
            expect(htmlContent).toContain('<meta name="robots" content="noindex, follow">');
        });

        it('should have proper title', () => {
            expect(htmlContent).toContain('<title>404 - Page Not Found | SmartGrind</title>');
        });

        it('should have description meta tag', () => {
            expect(htmlContent).toContain('<meta name="description" content="Page not found');
        });

        it('should have canonical link', () => {
            expect(htmlContent).toContain('<link rel="canonical" href="https://algovyn.com/smartgrind/">');
        });
    });

    describe('Page Structure', () => {
        it('should have DOCTYPE declaration', () => {
            expect(htmlContent).toContain('<!DOCTYPE html>');
        });

        it('should have html element with lang attribute', () => {
            expect(htmlContent).toMatch(/<html lang="en"/);
        });

        it('should contain logo image', () => {
            expect(htmlContent).toContain('src="/logo.svg"');
            expect(htmlContent).toContain('alt="SmartGrind Logo"');
        });

        it('should display 404 error code', () => {
            expect(htmlContent).toContain('class="error-code"');
            expect(htmlContent).toContain('>404<');
        });

        it('should have Page Not Found heading', () => {
            expect(htmlContent).toContain('<h1>Page Not Found</h1>');
        });
    });

    describe('Search Functionality', () => {
        it('should have search input', () => {
            expect(htmlContent).toContain('class="search-input"');
            expect(htmlContent).toContain('placeholder="Search problems');
        });

        it('should redirect to main app on Enter key', () => {
            expect(htmlContent).toContain("window.location.href='/smartgrind/?search='");
            expect(htmlContent).toContain('encodeURIComponent(this.value)');
        });
    });

    describe('Navigation Links', () => {
        it('should have link to home page', () => {
            expect(htmlContent).toContain('href="/smartgrind/"');
            expect(htmlContent).toContain('Back to Home');
        });

        it('should have link to review filter', () => {
            expect(htmlContent).toContain('href="/smartgrind/?filter=review"');
            expect(htmlContent).toContain('Due for Review');
        });
    });

    describe('Popular Categories', () => {
        it('should have suggestions section', () => {
            expect(htmlContent).toContain('class="suggestions"');
            expect(htmlContent).toContain('Popular Categories');
        });

        it('should have link to Two Pointers pattern', () => {
            expect(htmlContent).toContain('href="/smartgrind/c/two-pointers"');
            expect(htmlContent).toContain('Two Pointers Pattern');
        });

        it('should have link to Arrays & Hashing', () => {
            expect(htmlContent).toContain('href="/smartgrind/c/arrays-hashing"');
            expect(htmlContent).toContain('Arrays & Hashing');
        });

        it('should have link to Dynamic Programming', () => {
            expect(htmlContent).toContain('href="/smartgrind/c/dp"');
            expect(htmlContent).toContain('Dynamic Programming');
        });

        it('should have link to Tree Patterns', () => {
            expect(htmlContent).toContain('href="/smartgrind/c/trees"');
            expect(htmlContent).toContain('Tree Patterns');
        });

        it('should have link to Graph Algorithms', () => {
            expect(htmlContent).toContain('href="/smartgrind/c/graphs"');
            expect(htmlContent).toContain('Graph Algorithms');
        });

        it('should have link to SQL Fundamentals', () => {
            expect(htmlContent).toContain('href="/smartgrind/s/sql-basics"');
            expect(htmlContent).toContain('SQL Fundamentals');
        });
    });

    describe('Structured Data', () => {
        it('should have WebPage schema', () => {
            expect(htmlContent).toContain('"@type": "WebPage"');
        });

        it('should have schema.org context', () => {
            expect(htmlContent).toContain('"@context": "https://schema.org"');
        });

        it('should reference SmartGrind website in structured data', () => {
            expect(htmlContent).toContain('"name": "SmartGrind"');
            expect(htmlContent).toContain('"url": "https://algovyn.com/smartgrind"');
        });

        it('should indicate this is part of the main website', () => {
            expect(htmlContent).toContain('"isPartOf"');
        });
    });

    describe('Styling', () => {
        it('should have inline CSS', () => {
            expect(htmlContent).toContain('<style>');
            expect(htmlContent).toContain('</style>');
        });

        it('should have responsive design media queries', () => {
            expect(htmlContent).toContain('@media (min-width: 640px)');
        });

        it('should have branded color scheme', () => {
            // Check for SmartGrind brand colors
            expect(htmlContent).toContain('#0284c7'); // Brand blue
            expect(htmlContent).toContain('#38bdf8'); // Light blue
        });
    });

    describe('Accessibility', () => {
        it('should have alt text for logo', () => {
            expect(htmlContent).toContain('alt="SmartGrind Logo"');
        });

        it('should have proper heading hierarchy', () => {
            expect(htmlContent).toContain('<h1>');
            expect(htmlContent).toContain('<h2>');
        });
    });
});
