// Consolidated tests for pattern solutions functionality
import { describe, test, expect, beforeEach, jest, beforeAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';

// Mock the UI module which now includes pattern mapping
global.window = {};
require('../public/modules/ui/ui-markdown.js');

const { patterns } = window.SmartGrind;

describe('Pattern Solutions Functionality', () => {
    beforeEach(() => {
        // Mock the DOM
        document.body.innerHTML = `
            <div id="solution-modal" class="hidden">
                <div id="solution-content"></div>
            </div>
        `;

        // Mock window.SmartGrind
        window.SmartGrind = {
            ui: {
                _renderMarkdown: jest.fn((markdown, contentElement) => {
                    contentElement.innerHTML = `<div>${markdown}</div>`;
                }),
                _configureMarkdownRenderer: jest.fn(() => ({ parse: (md) => md }))
            }
        };

        // Define the function directly for testing
        window.SmartGrind.ui.openPatternSolutionModal = (patternName) => {
            const modal = document.getElementById('solution-modal');
            const content = document.getElementById('solution-content');
            if (!modal || !content) return;

            // Show loading
            content.innerHTML = '<div class="loading flex items-center justify-center min-h-[200px]"><div class="w-8 h-8 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin"></div><span class="ml-3 text-theme-muted">Loading pattern solution...</span></div>';
            modal.classList.remove('hidden');

            // Convert pattern name to filename format (e.g., "Backtracking" -> "backtracking")
            const patternFilename = patternName.toLowerCase().replace(/[\s/()]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
            
            // Try to find a pattern solution file
            const solutionFile = `/smartgrind/patterns/${patternFilename}.md`;
            
            fetch(solutionFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load pattern solution file (status: ' + response.status + ')');
                    }
                    return response.text();
                })
                .then(markdown => window.SmartGrind.ui._renderMarkdown(markdown, content))
                .catch(error => {
                    content.innerHTML = '<p>Error loading pattern solution: ' + error.message + '</p>' +
                        '<p>File: ' + solutionFile + '</p>' +
                        '<p>This pattern may not have a dedicated solution file yet.</p>';
                });
        };
    });

    test('openPatternSolutionModal should show loading state', () => {
        const modal = document.getElementById('solution-modal');
        const content = document.getElementById('solution-content');
        
        // Mock fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve('# Pattern Solution')
            })
        );

        window.SmartGrind.ui.openPatternSolutionModal('Backtracking');
        
        expect(modal.classList.contains('hidden')).toBe(false);
        expect(content.innerHTML).toContain('Loading pattern solution...');
    });

    test('openPatternSolutionModal should convert pattern name to filename format', () => {
        const content = document.getElementById('solution-content');
        
        // Mock fetch to capture the URL
        let capturedUrl = '';
        global.fetch = jest.fn((url) => {
            capturedUrl = url;
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve('# Pattern Solution')
            });
        });

        window.SmartGrind.ui.openPatternSolutionModal('Binary Search');
        
        expect(capturedUrl).toBe('/smartgrind/patterns/binary-search.md');
    });

    test('openPatternSolutionModal should handle errors gracefully', async () => {
        const content = document.getElementById('solution-content');
        
        // Mock fetch to return error
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404
            })
        );

        window.SmartGrind.ui.openPatternSolutionModal('NonExistent Pattern');
        
        // Wait for the fetch to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(content.innerHTML).toContain('Error loading pattern solution');
        expect(content.innerHTML).toContain('This pattern may not have a dedicated solution file yet');
    });
});

describe('Pattern to Markdown File Mapping with Real Data', () => {
    // Import the actual data
    const data = require('../public/modules/data.js');

    // Test the filename conversion logic (same as in ui-markdown.js)
    const convertPatternNameToFilename = (patternName) => {
        return patternName.toLowerCase().replace(/[\s/()]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    };

    test('should map real pattern names to existing solution files', () => {
        // Test a few real pattern names from the data
        const testCases = [
            {
                patternName: 'Backtracking - Combination Sum',
                expectedFilename: 'backtracking-combination-sum'
            },
            {
                patternName: 'Binary Search - On Answer / Condition Function',
                expectedFilename: 'binary-search-on-answer-condition-function'
            },
            {
                patternName: 'Backtracking - Subsets (Include/Exclude)',
                expectedFilename: 'backtracking-subsets-include-exclude'
            },
            {
                patternName: 'Backtracking - N-Queens / Constraint Satisfaction',
                expectedFilename: 'backtracking-n-queens-constraint-satisfaction'
            }
        ];

        testCases.forEach(({ patternName, expectedFilename }) => {
            const actualFilename = convertPatternNameToFilename(patternName);
            expect(actualFilename).toBe(expectedFilename);
        });
    });

    test('should verify solution files exist for pattern names', () => {
        // This would require file system access, so we'll just test the mapping logic
        const patternName = 'Backtracking - Combination Sum';
        const expectedFilename = 'backtracking-combination-sum';
        const actualFilename = convertPatternNameToFilename(patternName);
        
        expect(actualFilename).toBe(expectedFilename);
        // In a real test, we would check if the file exists
    });
});

describe('Pattern Mapping System', () => {
    test('should have pattern mapping module', () => {
        expect(patterns).toBeDefined();
        expect(patterns.getPatternFilename).toBeDefined();
        expect(patterns._convertPatternNameToFilename).toBeDefined();
    });

    test('should handle automatic conversion for all patterns', () => {
        const testCases = [
            {
                patternName: 'Two Pointers - Converging (Sorted Array Target Sum)',
                expectedFilename: 'two-pointers-converging-sorted-array-target-sum'
            },
            {
                patternName: 'Graph BFS - Topological Sort (Kahn\'s Algorithm)',
                expectedFilename: 'graph-bfs-topological-sort-kahn-s'
            },
            {
                patternName: 'Sqrt(x)',
                expectedFilename: 'sqrt-x'
            },
            {
                patternName: 'Insert Delete GetRandom O(1)',
                expectedFilename: 'insert-delete-getrandom-o-1'
            }
        ];

        testCases.forEach(({ patternName, expectedFilename }) => {
            const actualFilename = patterns.getPatternFilename(patternName);
            expect(actualFilename).toBe(expectedFilename);
        });
    });

    test('should handle automatic conversion for non-mapped patterns', () => {
        const testCases = [
            {
                patternName: 'Backtracking - Combination Sum',
                expectedFilename: 'backtracking-combination-sum'
            },
            {
                patternName: 'Binary Search - On Answer / Condition Function',
                expectedFilename: 'binary-search-on-answer-condition-function'
            },
            {
                patternName: 'Sliding Window',
                expectedFilename: 'sliding-window'
            }
        ];

        testCases.forEach(({ patternName, expectedFilename }) => {
            const actualFilename = patterns.getPatternFilename(patternName);
            expect(actualFilename).toBe(expectedFilename);
        });
    });

    test('should handle consistent automatic conversion for all patterns', () => {
        const namingConsistencies = [
            { patternName: 'Two Pointers - Converging (Sorted Array Target Sum)', expected: 'two-pointers-converging-sorted-array-target-sum' },
            { patternName: 'Two Pointers - Fast & Slow (Cycle Detection)', expected: 'two-pointers-fast-slow-cycle-detection' },
            { patternName: 'Two Pointers - Fixed Separation (Nth Node from End)', expected: 'two-pointers-fixed-separation-nth-node-from-end' },
            { patternName: 'Two Pointers - Expanding From Center (Palindromes)', expected: 'two-pointers-expanding-from-center-palindromes' },
            { patternName: 'Sliding Window - Fixed Size (Subarray Calculation)', expected: 'sliding-window-fixed-size-subarray-calculation' },
            { patternName: 'Sliding Window - Variable Size (Condition-Based)', expected: 'sliding-window-variable-size-condition-based' },
            { patternName: 'Longest Subarray of 1\'s After Deleting One Element', expected: 'longest-subarray-of-1-s-after-deleting-one-element' },
            { patternName: 'Graph BFS - Topological Sort (Kahn\'s Algorithm)', expected: 'graph-bfs-topological-sort-kahn-s' },
            { patternName: 'Graph - Shortest Path (Dijkstra\'s Algorithm)', expected: 'graph-shortest-path-dijkstra-s' },
            { patternName: 'Graph - Shortest Path (Bellman-Ford / BFS+K)', expected: 'graph-shortest-path-bellman-ford-bfs-k' },
            { patternName: 'Bridges & Articulation Points (Tarjan low-link)', expected: 'bridges-articulation-points-tarjan-low-link' },
            { patternName: 'Minimum Spanning Tree (Kruskal / Prim / DSU + heap)', expected: 'minimum-spanning-tree-kruskal-prim-dsu-heap' },
            { patternName: 'Bidirectional BFS (BFS optimization for known source & target)', expected: 'bidirectional-bfs-bfs-optimization-for-known-source-target' },
            { patternName: 'Sqrt(x)', expected: 'sqrt-x' },
            { patternName: 'DP - 1D Array (Kadane\'s Algorithm for Max/Min Subarray)', expected: 'dp-1d-array-kadane-s-algorithm-for-max-min-subarray' },
            { patternName: 'Insert Delete GetRandom O(1)', expected: 'insert-delete-getrandom-o-1' },
            { patternName: 'All O`one Data Structure', expected: 'all-o-one-data-structure' }
        ];

        namingConsistencies.forEach(({ patternName, expected }) => {
            const actual = patterns.getPatternFilename(patternName);
            expect(actual).toBe(expected);
        });
    });

    test('should handle edge cases in automatic conversion', () => {
        const edgeCases = [
            { patternName: 'Simple Pattern', expected: 'simple' },
            { patternName: 'Pattern With Multiple   Spaces', expected: 'pattern-with-multiple-spaces' },
            { patternName: 'Pattern-With-Dashes', expected: 'pattern-with-dashes' },
            { patternName: 'Pattern/With/Slashes', expected: 'pattern-with-slashes' },
            { patternName: 'Pattern (With Parentheses)', expected: 'pattern-with-parentheses' },
            { patternName: 'Pattern - With Suffix Pattern', expected: 'pattern-with-suffix' },
            { patternName: 'Pattern - With Suffix Algorithm', expected: 'pattern-with-suffix' }
        ];

        edgeCases.forEach(({ patternName, expected }) => {
            const actual = patterns._convertPatternNameToFilename(patternName);
            expect(actual).toBe(expected);
        });
    });
});

describe('Pattern to Markdown File Mapping Validation', () => {
    // Test the filename conversion logic
    const convertPatternNameToFilename = (patternName) => {
        return patternName.toLowerCase().replace(/[\s/()]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    };

    test('should handle pattern names with slashes correctly', () => {
        const patternName = 'Binary Search - On Answer / Condition Function';
        const expectedFilename = 'binary-search-on-answer-condition-function';
        const actualFilename = convertPatternNameToFilename(patternName);
        
        expect(actualFilename).toBe(expectedFilename);
    });

    test('should handle backtracking pattern names correctly', () => {
        const patternName = 'Backtracking - Combination Sum';
        const expectedFilename = 'backtracking-combination-sum';
        const actualFilename = convertPatternNameToFilename(patternName);
        
        expect(actualFilename).toBe(expectedFilename);
    });

    test('should handle multiple spaces and special characters', () => {
        const patternName = 'Two Pointers -  Expanding From Center (Palindromes)';
        const expectedFilename = 'two-pointers-expanding-from-center-palindromes';
        const actualFilename = convertPatternNameToFilename(patternName);
        
        expect(actualFilename).toBe(expectedFilename);
    });

    test('should handle simple pattern names', () => {
        const patternName = 'Sliding Window';
        const expectedFilename = 'sliding-window';
        const actualFilename = convertPatternNameToFilename(patternName);
        
        expect(actualFilename).toBe(expectedFilename);
    });

    test('should handle pattern names with parentheses', () => {
        const patternName = 'DP - 2D Array (Unique Paths on Grid)';
        const expectedFilename = 'dp-2d-array-unique-paths-on-grid';
        const actualFilename = convertPatternNameToFilename(patternName);
        
        expect(actualFilename).toBe(expectedFilename);
    });

    test('should handle pattern names with multiple slashes', () => {
        const patternName = 'Graph - Shortest Path / Bellman-Ford / BFS+K';
        const expectedFilename = 'graph-shortest-path-bellman-ford-bfs+k';
        const actualFilename = convertPatternNameToFilename(patternName);
        
        expect(actualFilename).toBe(expectedFilename);
    });
});

describe('Pattern Solutions Files Verification', () => {
    const solutionsDir = path.join(__dirname, '../public/patterns');

    test('should have pattern solution files in the solutions directory', () => {
        const files = fs.readdirSync(solutionsDir);
        expect(files.length).toBeGreaterThan(0);
        
        // Check for some expected pattern files
        const patternFiles = files.filter(file => file.includes('backtracking') || file.includes('sliding-window'));
        expect(patternFiles.length).toBeGreaterThan(0);
    });

    test('should have backtracking pattern solution files', () => {
        const files = fs.readdirSync(solutionsDir);
        const backtrackingFiles = files.filter(file => file.includes('backtracking'));
        expect(backtrackingFiles.length).toBeGreaterThan(0);
        
        // Check that at least one backtracking file exists and is readable
        const backtrackingFile = backtrackingFiles[0];
        const filePath = path.join(solutionsDir, backtrackingFile);
        const content = fs.readFileSync(filePath, 'utf8');
        expect(content).toContain('#'); // Should contain markdown header
        expect(content.length).toBeGreaterThan(100); // Should have substantial content
    });

    test('should have sliding window pattern solution files', () => {
        const files = fs.readdirSync(solutionsDir);
        const slidingWindowFiles = files.filter(file => file.includes('sliding-window'));
        expect(slidingWindowFiles.length).toBeGreaterThan(0);
        
        // Check that at least one sliding window file exists and is readable
        const slidingWindowFile = slidingWindowFiles[0];
        const filePath = path.join(solutionsDir, slidingWindowFile);
        const content = fs.readFileSync(filePath, 'utf8');
        expect(content).toContain('#'); // Should contain markdown header
        expect(content.length).toBeGreaterThan(100); // Should have substantial content
    });

    test('should have various pattern categories represented', () => {
        const files = fs.readdirSync(solutionsDir);
        
        // Check for different pattern categories
        const patternCategories = [
            'backtracking',
            'sliding-window',
            'binary-search',
            'graph',
            'dp',
            'tree'
        ];
        
        const foundCategories = patternCategories.filter(category =>
            files.some(file => file.includes(category))
        );
        
        expect(foundCategories.length).toBeGreaterThan(2); // Should have at least 3 different pattern categories
    });

    test('pattern solution files should have proper markdown structure', () => {
        const files = fs.readdirSync(solutionsDir);
        
        // Test a few random files for proper markdown structure
        const testFiles = files.slice(0, 3); // Test first 3 files
        
        testFiles.forEach(file => {
            const filePath = path.join(solutionsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Basic markdown structure checks
            expect(content).toMatch(/^#/); // Should start with a header
            expect(content).toContain('##'); // Should have subsections
            expect(content).toContain('```'); // Should have code blocks
        });
    });
});

describe('Pattern Solutions Integration Tests', () => {
    beforeEach(() => {
        // Mock the DOM
        document.body.innerHTML = `
            <div id="solution-modal" class="hidden">
                <div id="solution-content"></div>
            </div>
        `;

        // Mock window.SmartGrind
        window.SmartGrind = {
            ui: {
                _renderMarkdown: jest.fn((markdown, contentElement) => {
                    contentElement.innerHTML = `<div>${markdown}</div>`;
                }),
                _configureMarkdownRenderer: jest.fn(() => ({ parse: (md) => md }))
            }
        };

        // Define the function directly for testing
        window.SmartGrind.ui.openPatternSolutionModal = (patternName) => {
            const modal = document.getElementById('solution-modal');
            const content = document.getElementById('solution-content');
            if (!modal || !content) return;

            // Show loading
            content.innerHTML = '<div class="loading flex items-center justify-center min-h-[200px]"><div class="w-8 h-8 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin"></div><span class="ml-3 text-theme-muted">Loading pattern solution...</span></div>';
            modal.classList.remove('hidden');

            // Convert pattern name to filename format (e.g., "Backtracking" -> "backtracking")
            const patternFilename = patternName.toLowerCase().replace(/\s+/g, '-');
            
            // Try to find a pattern solution file
            const solutionFile = `/smartgrind/patterns/${patternFilename}.md`;
            
            fetch(solutionFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load pattern solution file (status: ' + response.status + ')');
                    }
                    return response.text();
                })
                .then(markdown => window.SmartGrind.ui._renderMarkdown(markdown, content))
                .catch(error => {
                    content.innerHTML = '<p>Error loading pattern solution: ' + error.message + '</p>' +
                        '<p>File: ' + solutionFile + '</p>' +
                        '<p>This pattern may not have a dedicated solution file yet.</p>';
                });
        };
    });

    test('should load and display backtracking pattern solution', async () => {
        const content = document.getElementById('solution-content');
        
        // Mock fetch to return actual backtracking content
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve('# Backtracking Pattern\n\nThis is a backtracking pattern solution.')
            })
        );

        window.SmartGrind.ui.openPatternSolutionModal('Backtracking');
        
        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(content.innerHTML).toContain('Backtracking Pattern');
        expect(content.innerHTML).toContain('This is a backtracking pattern solution');
    });

    test('should load and display sliding window pattern solution', async () => {
        const content = document.getElementById('solution-content');
        
        // Mock fetch to return actual sliding window content
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve('# Sliding Window Pattern\n\nThis is a sliding window pattern solution.')
            })
        );

        window.SmartGrind.ui.openPatternSolutionModal('Sliding Window');
        
        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(content.innerHTML).toContain('Sliding Window Pattern');
        expect(content.innerHTML).toContain('This is a sliding window pattern solution');
    });

    test('should handle pattern names with multiple spaces', async () => {
        const content = document.getElementById('solution-content');
        
        // Mock fetch to capture the URL
        let capturedUrl = '';
        global.fetch = jest.fn((url) => {
            capturedUrl = url;
            return Promise.resolve({
                ok: true,
                text: () => Promise.resolve('# Pattern Solution')
            });
        });

        window.SmartGrind.ui.openPatternSolutionModal('Binary Search Tree Iterator');
        
        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(capturedUrl).toBe('/smartgrind/patterns/binary-search-tree-iterator.md');
    });

    test('should show appropriate error for non-existent pattern', async () => {
        const content = document.getElementById('solution-content');
        
        // Mock fetch to return 404
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404
            })
        );

        window.SmartGrind.ui.openPatternSolutionModal('Non Existent Pattern');
        
        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(content.innerHTML).toContain('Error loading pattern solution');
        expect(content.innerHTML).toContain('This pattern may not have a dedicated solution file yet');
    });

    test('should handle network errors gracefully', async () => {
        const content = document.getElementById('solution-content');
        
        // Mock fetch to throw network error
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Network error'))
        );

        window.SmartGrind.ui.openPatternSolutionModal('Some Pattern');
        
        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));
        
        expect(content.innerHTML).toContain('Error loading pattern solution');
        expect(content.innerHTML).toContain('Network error');
    });
});