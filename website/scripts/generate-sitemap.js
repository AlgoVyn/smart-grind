#!/usr/bin/env node

/**
 * Sitemap Generator Script
 * 
 * This script generates a sitemap.xml file with:
 * - Dynamic current date for lastmod
 * - All pattern categories (/c/*)
 * - All algorithm categories (/a/*)
 * - All SQL categories (/s/*)
 * - Proper changefreq and priority values
 * 
 * Usage: node scripts/generate-sitemap.js
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Output file path
const OUTPUT_FILE = join(process.cwd(), 'public', 'sitemap.xml');

// Base URL for the website
const BASE_URL = 'https://algovyn.com/smartgrind';

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

// Pattern categories (from problems-data.ts)
const PATTERN_CATEGORIES = [
    { id: 'two-pointers', name: 'Two Pointers' },
    { id: 'sliding-window', name: 'Sliding Window' },
    { id: 'arrays-hashing', name: 'Arrays & Hashing' },
    { id: 'linked-lists', name: 'Linked Lists' },
    { id: 'stacks', name: 'Stacks' },
    { id: 'heaps', name: 'Heaps' },
    { id: 'trees', name: 'Trees' },
    { id: 'graphs', name: 'Graphs' },
    { id: 'binary-search', name: 'Binary Search' },
    { id: 'backtracking', name: 'Backtracking' },
    { id: 'dp', name: 'Dynamic Programming' },
    { id: 'greedy', name: 'Greedy' },
    { id: 'bit-manipulation', name: 'Bit Manipulation' },
    { id: 'string-manipulation', name: 'String Manipulation' },
    { id: 'design', name: 'Design' },
];

// Algorithm categories (from algorithms-data.ts)
const ALGORITHM_CATEGORIES = [
    { id: 'arrays-strings', name: 'Arrays & Strings' },
    { id: 'linked-list', name: 'Linked List' },
    { id: 'trees-bsts', name: 'Trees & BSTs' },
    { id: 'graphs', name: 'Graphs' },
    { id: 'dynamic-programming', name: 'Dynamic Programming' },
    { id: 'greedy', name: 'Greedy' },
    { id: 'backtracking', name: 'Backtracking' },
    { id: 'bit-manipulation', name: 'Bit Manipulation' },
    { id: 'heap-priority-queue', name: 'Heap & Priority Queue' },
    { id: 'math-number-theory', name: 'Math & Number Theory' },
    { id: 'advanced', name: 'Advanced' },
];

// SQL categories (from sql-data.ts)
const SQL_CATEGORIES = [
    { id: 'sql-basics', name: 'SQL Basics' },
    { id: 'sql-joins', name: 'SQL Joins' },
    { id: 'sql-aggregation', name: 'SQL Aggregation' },
    { id: 'sql-subqueries', name: 'SQL Subqueries' },
    { id: 'sql-window-functions', name: 'SQL Window Functions' },
    { id: 'sql-cte', name: 'SQL CTEs' },
    { id: 'sql-set-operations', name: 'SQL Set Operations' },
    { id: 'sql-strings', name: 'SQL String Functions' },
    { id: 'sql-datetime', name: 'SQL Date/Time' },
    { id: 'sql-conditional', name: 'SQL Conditional Logic' },
    { id: 'sql-dml', name: 'SQL Data Modification' },
    { id: 'sql-advanced', name: 'SQL Advanced Patterns' },
    { id: 'sql-performance', name: 'SQL Performance' },
    { id: 'sql-design', name: 'SQL Database Design' },
];

/**
 * Generate a URL entry for the sitemap
 */
function generateUrlEntry(loc, lastmod, changefreq, priority) {
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate the complete sitemap XML
 */
function generateSitemap() {
    const currentDate = getCurrentDate();
    
    const urls = [];
    
    // Home page
    urls.push(generateUrlEntry(
        `${BASE_URL}/`,
        currentDate,
        'weekly',
        '1.0'
    ));
    
    // Pattern categories
    urls.push('  <!-- Problem Categories (Patterns) -->');
    for (const category of PATTERN_CATEGORIES) {
        urls.push(generateUrlEntry(
            `${BASE_URL}/c/${category.id}`,
            currentDate,
            'weekly',
            '0.8'
        ));
    }
    
    // Algorithm categories
    urls.push('  <!-- Algorithm Categories -->');
    for (const category of ALGORITHM_CATEGORIES) {
        urls.push(generateUrlEntry(
            `${BASE_URL}/a/${category.id}`,
            currentDate,
            'weekly',
            '0.8'
        ));
    }
    
    // SQL categories
    urls.push('  <!-- SQL Categories -->');
    for (const category of SQL_CATEGORIES) {
        urls.push(generateUrlEntry(
            `${BASE_URL}/s/${category.id}`,
            currentDate,
            'weekly',
            '0.8'
        ));
    }
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
    
    return xml;
}

/**
 * Main function
 */
function main() {
    console.log('🗺️  Generating sitemap.xml...\n');
    
    const currentDate = getCurrentDate();
    console.log(`📅 Using date: ${currentDate}`);
    
    // Generate sitemap
    const sitemap = generateSitemap();
    
    // Count URLs
    const urlCount = PATTERN_CATEGORIES.length + ALGORITHM_CATEGORIES.length + SQL_CATEGORIES.length + 1;
    console.log(`🔗 Total URLs: ${urlCount}`);
    console.log(`   - Home page: 1`);
    console.log(`   - Pattern categories: ${PATTERN_CATEGORIES.length}`);
    console.log(`   - Algorithm categories: ${ALGORITHM_CATEGORIES.length}`);
    console.log(`   - SQL categories: ${SQL_CATEGORIES.length}`);
    
    // Write file
    writeFileSync(OUTPUT_FILE, sitemap);
    console.log(`\n✅ Sitemap written to: ${OUTPUT_FILE}`);
    
    console.log('\n' + '='.repeat(50));
    console.log('📈 Summary');
    console.log('='.repeat(50));
    console.log(`  Generated:      ${currentDate}`);
    console.log(`  Total URLs:     ${urlCount}`);
    console.log(`  Output file:    ${OUTPUT_FILE}`);
    console.log('='.repeat(50));
}

main();
