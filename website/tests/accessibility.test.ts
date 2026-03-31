// --- ACCESSIBILITY ENHANCEMENTS TESTS ---

import { ICONS } from '../src/renderers/icons';
import { GOOGLE_BUTTON_HTML, SPINNER_HTML, SOLUTION_BUTTON_HTML } from '../src/ui/ui-constants';

describe('Accessibility Enhancements', () => {
    describe('ARIA attributes on icons', () => {
        it('should have aria-hidden on all icon SVGs in ICONS object', () => {
            const iconValues = [
                ICONS.delete,
                ICONS.note,
                ICONS.reset,
                ...Object.values(ICONS.topicIcons),
            ];

            iconValues.forEach((svg) => {
                expect(svg).toContain('aria-hidden="true"');
            });
        });

        it('should have aria-hidden on all topic icons', () => {
            const topicIconKeys = Object.keys(ICONS.topicIcons);
            
            topicIconKeys.forEach((key) => {
                const svg = ICONS.topicIcons[key as keyof typeof ICONS.topicIcons];
                expect(svg).toContain('aria-hidden="true"');
            });
        });

        it('should have aria-hidden on utility icons', () => {
            const utilIcons = [
                ICONS.database,
                ICONS['git-merge'],
                ICONS['bar-chart-2'],
                ICONS.layers,
                ICONS['layout-grid'],
                ICONS['git-branch'],
                ICONS.type,
                ICONS.calendar,
                ICONS['git-pull-request'],
                ICONS['edit-3'],
                ICONS.cpu,
                ICONS.zap,
                ICONS.box,
            ];

            utilIcons.forEach((svg) => {
                if (svg) {
                    expect(svg).toContain('aria-hidden="true"');
                }
            });
        });
    });

    describe('UI Constants - ARIA attributes', () => {
        it('should have aria-hidden on Google button SVG', () => {
            expect(GOOGLE_BUTTON_HTML).toContain('aria-hidden="true"');
        });

        it('should have aria-hidden on spinner SVG', () => {
            const spinner = SPINNER_HTML();
            expect(spinner).toContain('aria-hidden="true"');
        });

        it('should have aria-hidden on solution button SVG', () => {
            expect(SOLUTION_BUTTON_HTML).toContain('aria-hidden="true"');
        });
    });

    describe('Icon helper methods', () => {
        it('getAlgorithmCategoryIcon should return icons with aria-hidden', () => {
            const testCategories = [
                'arrays-strings',
                'linked-list',
                'trees-bsts',
                'graphs',
                'dynamic-programming',
                'greedy',
                'backtracking',
                'bit-manipulation',
                'heap-priority-queue',
                'math-number-theory',
                'advanced',
            ];

            testCategories.forEach((category) => {
                const icon = ICONS.getAlgorithmCategoryIcon(category);
                expect(icon).toContain('aria-hidden="true"');
            });
        });

        it('getAlgorithmCategoryIcon should fallback to algorithms icon', () => {
            const unknownCategory = 'unknown-category';
            const icon = ICONS.getAlgorithmCategoryIcon(unknownCategory);
            expect(icon).toContain('aria-hidden="true"');
        });

        it('getSQLCategoryIcon should return icons with aria-hidden', () => {
            const testCategories = [
                'sql-basics',
                'sql-joins',
                'sql-aggregation',
                'sql-subqueries',
                'sql-window-functions',
                'sql-cte',
                'sql-set-operations',
                'sql-strings',
                'sql-datetime',
                'sql-conditional',
                'sql-dml',
                'sql-advanced',
                'sql-performance',
                'sql-design',
            ];

            testCategories.forEach((category) => {
                const icon = ICONS.getSQLCategoryIcon(category);
                expect(icon).toContain('aria-hidden="true"');
            });
        });
    });

    describe('Focus management utilities', () => {
        describe('shouldVirtualize', () => {
            it('should recommend virtualization for large lists', () => {
                const { shouldVirtualize } = require('../src/utils/virtual-scroll');
                
                expect(shouldVirtualize(51)).toBe(true);
                expect(shouldVirtualize(100)).toBe(true);
                expect(shouldVirtualize(50)).toBe(false);
                expect(shouldVirtualize(10)).toBe(false);
            });
        });

        describe('estimateItemHeight', () => {
            it('should provide reasonable height estimates', () => {
                const { estimateItemHeight } = require('../src/utils/virtual-scroll');
                
                expect(estimateItemHeight('problem-card')).toBeGreaterThan(0);
                expect(estimateItemHeight('pattern-section')).toBeGreaterThan(0);
                expect(estimateItemHeight('topic-section')).toBeGreaterThan(0);
            });
        });
    });

    describe('HTML structure verification', () => {
        it('all generated icons should be valid SVG elements', () => {
            const allIcons = [
                ...Object.values(ICONS.topicIcons),
                ICONS.delete,
                ICONS.note,
                ICONS.reset,
            ];

            allIcons.forEach((iconHtml) => {
                // Should start with <svg and end with </svg>
                expect(iconHtml).toMatch(/^<svg/);
                expect(iconHtml).toMatch(/<\/svg>$/);
                
                // Should contain aria-hidden
                expect(iconHtml).toContain('aria-hidden="true"');
                
                // Should have viewBox for accessibility/scaling
                expect(iconHtml).toContain('viewBox=');
            });
        });

        it('icons should have appropriate CSS classes', () => {
            // Topic icons should have topic-icon class
            Object.values(ICONS.topicIcons).forEach((svg) => {
                expect(svg).toContain('class="topic-icon"');
            });

            // Action icons should have sizing classes
            expect(ICONS.delete).toContain('w-4 h-4');
            expect(ICONS.note).toContain('w-4 h-4');
            expect(ICONS.reset).toContain('w-4 h-4');
        });
    });

    describe('Accessibility patterns', () => {
        it('should use semantic HTML patterns in icon definitions', () => {
            // Check for common accessibility patterns
            const allIcons = Object.values(ICONS.topicIcons);
            
            allIcons.forEach((icon) => {
                // Should not have title element (use aria-label on parent instead)
                expect(icon).not.toContain('<title>');
                
                // Should not have desc element (icons are decorative)
                expect(icon).not.toContain('<desc>');
                
                // Should have aria-hidden
                expect(icon).toContain('aria-hidden="true"');
            });
        });

        it('should use currentColor for icon fills where appropriate', () => {
            // Many icons should use currentColor to inherit text color
            const fillCurrentColorIcons = [
                ICONS.delete,
                ICONS.note,
                ICONS.reset,
            ];

            fillCurrentColorIcons.forEach((icon) => {
                expect(icon).toContain('stroke="currentColor"');
            });
        });
    });
});
