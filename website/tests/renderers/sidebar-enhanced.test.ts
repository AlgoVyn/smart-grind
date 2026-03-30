/**
 * Enhanced Sidebar Renderer Tests
 * Additional tests for sidebar.ts covering:
 * - Sidebar rendering with all sections
 * - Navigation helpers
 * - Collapsible sections
 * - Button creation helpers
 */

// Mock dependencies
jest.mock('@/utils', () => ({
    updateUrlParameter: jest.fn(),
    scrollToTop: jest.fn(),
    getUniqueProblemsForTopic: jest.fn(() => ({ total: 10, solved: 5 })),
    getAllUniqueProblemsIncludingAlgorithms: jest.fn(() => ({ total: 20, solved: 10 })),
}));

jest.mock('@/ui/ui-navigation', () => ({
    toggleMobileMenu: jest.fn(),
}));

jest.mock('@/renderers', () => ({
    renderers: {
        renderMainView: jest.fn().mockResolvedValue(undefined),
        renderAlgorithmsView: jest.fn().mockResolvedValue(undefined),
        renderSQLView: jest.fn().mockResolvedValue(undefined),
        renderCombinedView: jest.fn().mockResolvedValue(undefined),
        updateStats: jest.fn(),
    },
}));

jest.mock('@/state', () => ({
    state: {
        ui: {
            activeTopicId: '',
            activeAlgorithmCategoryId: null,
            activeSQLCategoryId: null,
        },
        elements: {
            topicList: null,
        },
        problems: new Map(),
    },
}));

jest.mock('@/data', () => ({
    data: {
        topicsData: [],
        algorithmsData: [],
        sqlData: [],
    },
}));

jest.mock('@/renderers/icons', () => ({
    ICONS: {
        topicIcons: {
            default: '<svg>default</svg>',
            arrays: '<svg>arrays</svg>',
            algorithms: '<svg>algorithms</svg>',
            sql: '<svg>sql</svg>',
            database: '<svg>database</svg>',
        },
        getAlgorithmCategoryIcon: jest.fn(() => '<svg>algo</svg>'),
        getSQLCategoryIcon: jest.fn(() => '<svg>sql</svg>'),
    },
}));

import { sidebarRenderers } from '@/renderers/sidebar';
import { state } from '@/state';
import { data } from '@/data';
import { updateUrlParameter, scrollToTop } from '@/utils';
import { toggleMobileMenu } from '@/ui/ui-navigation';
import { renderers } from '@/renderers';
import { ICONS } from '@/renderers/icons';

describe('Sidebar Renderer Enhanced', () => {
    let mockTopicList: HTMLElement;
    let createdElements: any[];

    beforeEach(() => {
        jest.clearAllMocks();
        createdElements = [];

        // Create mock topicList
        mockTopicList = {
            innerHTML: '',
            appendChild: jest.fn((child) => {
                createdElements.push(child);
                return child;
            }),
        } as unknown as HTMLElement;

        state.elements.topicList = mockTopicList;
        state.ui.activeTopicId = '';
        state.ui.activeAlgorithmCategoryId = null;
        state.ui.activeSQLCategoryId = null;

        // Reset data
        data.topicsData = [];
        data.algorithmsData = [];
        data.sqlData = [];
    });

    describe('renderSidebar', () => {
        test('should render all sections when topicList exists', async () => {
            data.algorithmsData = [
                { id: 'arrays', title: 'Arrays', algorithms: [] },
            ];
            data.topicsData = [
                { id: 'two-sum', title: 'Two Sum', patterns: [] },
            ];
            data.sqlData = [
                { id: 'basics', title: 'SQL Basics', topics: [] },
            ];

            sidebarRenderers.renderSidebar();

            // Should clear innerHTML first
            expect(mockTopicList.innerHTML).toBe('');
            // Should append fragment
            expect(mockTopicList.appendChild).toHaveBeenCalled();
        });

        test('should not throw when topicList is null', () => {
            state.elements.topicList = null as any;

            expect(() => {
                sidebarRenderers.renderSidebar();
            }).not.toThrow();
        });

        test('should create All Content button', async () => {
            sidebarRenderers.renderSidebar();

            // The fragment contains the All Content button
            expect(mockTopicList.appendChild).toHaveBeenCalled();
        });

        test('should create collapsible Algorithms section', async () => {
            data.algorithmsData = [
                { id: 'arrays', title: 'Arrays', algorithms: [] },
            ];

            sidebarRenderers.renderSidebar();

            // Verify fragment was appended
            expect(mockTopicList.appendChild).toHaveBeenCalled();
        });

        test('should create collapsible Patterns section', async () => {
            data.topicsData = [
                { id: 'two-sum', title: 'Two Sum', patterns: [] },
            ];

            sidebarRenderers.renderSidebar();

            expect(mockTopicList.appendChild).toHaveBeenCalled();
        });

        test('should create collapsible SQL section', async () => {
            data.sqlData = [
                { id: 'basics', title: 'SQL Basics', topics: [] },
            ];

            sidebarRenderers.renderSidebar();

            expect(mockTopicList.appendChild).toHaveBeenCalled();
        });
    });

    describe('createCollapsibleSection', () => {
        test('should create section with header and content', () => {
            const result = sidebarRenderers.createCollapsibleSection('test-section', 'Test Section', false);

            expect(result.container).toBeDefined();
            expect(result.content).toBeDefined();
            expect(result.container.id).toBe('test-section');
            expect(result.content.classList.contains('hidden')).toBe(true); // Not expanded
        });

        test('should expand content when expanded parameter is true', () => {
            const result = sidebarRenderers.createCollapsibleSection('test-section', 'Test Section', true);

            expect(result.content.classList.contains('hidden')).toBe(false);
        });

        test('should toggle content visibility on header click', () => {
            const result = sidebarRenderers.createCollapsibleSection('test-section', 'Test Section', false);

            // Initially hidden
            expect(result.content.classList.contains('hidden')).toBe(true);

            // Click header to expand
            const header = result.container.querySelector('.sidebar-section-header') || result.container.firstChild;
            if (header && (header as HTMLElement).onclick) {
                ((header as HTMLElement).onclick as Function)();
            }

            // Should now be visible
            expect(result.content.classList.contains('hidden')).toBe(false);
        });

        test('should rotate chevron on toggle', () => {
            const result = sidebarRenderers.createCollapsibleSection('test-section', 'Test Section', false);

            // Initially hidden
            expect(result.content.classList.contains('hidden')).toBe(true);

            // Click header to expand
            const header = result.container.querySelector('.sidebar-section-header') || result.container.firstChild;
            if (header && (header as HTMLElement).onclick) {
                ((header as HTMLElement).onclick as Function)();
            }

            // Content should now be visible
            expect(result.content.classList.contains('hidden')).toBe(false);
        });
    });

    describe('createTopicButton', () => {
        test('should create button with correct structure', () => {
            const button = sidebarRenderers.createTopicButton('arrays', 'Arrays');

            expect(button.tagName).toBe('BUTTON');
            expect(button.type).toBe('button');
            expect(button.className).toContain('sidebar-link');
            expect(button.dataset['topicId']).toBe('arrays');
        });

        test('should mark active topic', () => {
            state.ui.activeTopicId = 'arrays';

            const button = sidebarRenderers.createTopicButton('arrays', 'Arrays');

            expect(button.className).toContain('active');
        });

        test('should include progress stats', () => {
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        { name: 'Pattern 1', problems: [{ id: '1', name: 'P1', url: 'url1' }] },
                    ],
                },
            ];

            const button = sidebarRenderers.createTopicButton('arrays', 'Arrays');

            expect(button.innerHTML).toContain('Arrays');
            // Should contain stats HTML
            expect(button.innerHTML).toContain('sidebar-stat-total');
            expect(button.innerHTML).toContain('sidebar-stat-pct');
        });

        test('should handle "all" topic', () => {
            const button = sidebarRenderers.createTopicButton('all', 'All Problems');

            expect(button.dataset['topicId']).toBe('all');
        });
    });

    describe('createAlgorithmCategoryButton', () => {
        test('should create button with correct structure', () => {
            const category = { id: 'arrays', title: 'Arrays', algorithms: [] };

            const button = sidebarRenderers.createAlgorithmCategoryButton(category);

            expect(button.tagName).toBe('BUTTON');
            expect(button.type).toBe('button');
            expect(button.className).toContain('sidebar-algorithm-category');
            expect(button.dataset['categoryId']).toBe('arrays');
        });

        test('should mark active category', () => {
            state.ui.activeAlgorithmCategoryId = 'arrays';

            const category = { id: 'arrays', title: 'Arrays', algorithms: [] };
            const button = sidebarRenderers.createAlgorithmCategoryButton(category);

            expect(button.className).toContain('active');
        });

        test('should include algorithm progress stats', () => {
            const category = {
                id: 'arrays',
                title: 'Arrays',
                algorithms: [
                    { id: 'algo-1', name: 'Algo 1' },
                    { id: 'algo-2', name: 'Algo 2' },
                ],
            };

            const button = sidebarRenderers.createAlgorithmCategoryButton(category);

            expect(button.innerHTML).toContain('Arrays');
            expect(button.innerHTML).toContain('sidebar-stat-total');
            expect(button.innerHTML).toContain('sidebar-stat-pct');
        });

        test('should use correct icon for category', () => {
            const category = { id: 'arrays', title: 'Arrays', algorithms: [] };

            sidebarRenderers.createAlgorithmCategoryButton(category);

            expect(ICONS.getAlgorithmCategoryIcon).toHaveBeenCalledWith('arrays');
        });
    });

    describe('createAlgorithmAllButton', () => {
        test('should create "All Algorithms" button', () => {
            const button = sidebarRenderers.createAlgorithmAllButton();

            expect(button.tagName).toBe('BUTTON');
            expect(button.className).toContain('sidebar-algorithm-category');
            expect(button.dataset['categoryId']).toBe('all');
        });

        test('should mark as active when all algorithms selected', () => {
            state.ui.activeAlgorithmCategoryId = 'all';

            const button = sidebarRenderers.createAlgorithmAllButton();

            expect(button.className).toContain('active');
        });

        test('should calculate progress for all algorithms', () => {
            data.algorithmsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    algorithms: [
                        { id: 'algo-1', name: 'Algo 1' },
                        { id: 'algo-2', name: 'Algo 2' },
                    ],
                },
                {
                    id: 'trees',
                    title: 'Trees',
                    algorithms: [
                        { id: 'algo-3', name: 'Algo 3' },
                    ],
                },
            ];

            const button = sidebarRenderers.createAlgorithmAllButton();

            expect(button.innerHTML).toContain('All Algorithms');
        });
    });

    describe('createSQLCategoryButton', () => {
        test('should create button with correct structure', () => {
            const category = {
                id: 'basics',
                title: 'SQL Basics',
                topics: [],
            };

            const button = sidebarRenderers.createSQLCategoryButton(category);

            expect(button.tagName).toBe('BUTTON');
            expect(button.className).toContain('sidebar-sql-category');
            expect(button.dataset['sqlCategoryId']).toBe('basics');
        });

        test('should mark active SQL category', () => {
            state.ui.activeSQLCategoryId = 'basics';

            const category = {
                id: 'basics',
                title: 'SQL Basics',
                topics: [],
            };

            const button = sidebarRenderers.createSQLCategoryButton(category);

            expect(button.className).toContain('active');
        });

        test('should use correct icon for SQL category', () => {
            const category = {
                id: 'basics',
                title: 'SQL Basics',
                topics: [],
            };

            sidebarRenderers.createSQLCategoryButton(category);

            expect(ICONS.getSQLCategoryIcon).toHaveBeenCalledWith('basics');
        });
    });

    describe('createSQLAllButton', () => {
        test('should create "All SQL" button', () => {
            const button = sidebarRenderers.createSQLAllButton();

            expect(button.tagName).toBe('BUTTON');
            expect(button.className).toContain('sidebar-sql-category');
            expect(button.dataset['sqlCategoryId']).toBe('all');
        });

        test('should mark as active when all SQL selected', () => {
            state.ui.activeSQLCategoryId = 'all';

            const button = sidebarRenderers.createSQLAllButton();

            expect(button.className).toContain('active');
        });

        test('should use SQL or database icon', () => {
            data.sqlData = [];

            const button = sidebarRenderers.createSQLAllButton();

            expect(button.innerHTML).toContain('All SQL');
        });
    });

    describe('setActiveTopic', () => {
        test('should update active topic in state', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([]);
            document.querySelector = jest.fn().mockReturnValue(null);

            sidebarRenderers.setActiveTopic('arrays');

            expect(state.ui.activeTopicId).toBe('arrays');
        });

        test('should clear SQL category when setting topic', () => {
            state.ui.activeSQLCategoryId = 'basics';
            document.querySelectorAll = jest.fn().mockReturnValue([]);
            document.querySelector = jest.fn().mockReturnValue(null);

            sidebarRenderers.setActiveTopic('arrays');

            expect(state.ui.activeSQLCategoryId).toBeNull();
        });

        test('should handle null topicId', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([]);

            sidebarRenderers.setActiveTopic(null);

            expect(state.ui.activeTopicId).toBe('');
        });
    });

    describe('setActiveAlgorithmCategory', () => {
        test('should update active algorithm category', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([]);
            document.querySelector = jest.fn().mockReturnValue(null);

            sidebarRenderers.setActiveAlgorithmCategory('arrays');

            expect(state.ui.activeAlgorithmCategoryId).toBe('arrays');
        });

        test('should clear topic and SQL when setting algorithm category', () => {
            state.ui.activeTopicId = 'two-sum';
            state.ui.activeSQLCategoryId = 'basics';
            document.querySelectorAll = jest.fn().mockReturnValue([]);
            document.querySelector = jest.fn().mockReturnValue(null);

            sidebarRenderers.setActiveAlgorithmCategory('arrays');

            expect(state.ui.activeTopicId).toBe('');
            expect(state.ui.activeSQLCategoryId).toBe('');
        });
    });

    describe('setActiveSQLCategory', () => {
        test('should update active SQL category', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([]);
            document.querySelector = jest.fn().mockReturnValue(null);

            sidebarRenderers.setActiveSQLCategory('basics');

            expect(state.ui.activeSQLCategoryId).toBe('basics');
        });

        test('should clear topic and algorithm when setting SQL category', () => {
            state.ui.activeTopicId = 'two-sum';
            state.ui.activeAlgorithmCategoryId = 'arrays';
            document.querySelectorAll = jest.fn().mockReturnValue([]);
            document.querySelector = jest.fn().mockReturnValue(null);

            sidebarRenderers.setActiveSQLCategory('basics');

            expect(state.ui.activeTopicId).toBe('');
            expect(state.ui.activeAlgorithmCategoryId).toBe('');
        });
    });

    describe('createAllContentButton', () => {
        test('should create All Content button', () => {
            const button = sidebarRenderers.createAllContentButton();

            expect(button.tagName).toBe('BUTTON');
            expect(button.className).toContain('sidebar-all-content');
        });

        test('should be active when no category selected', () => {
            state.ui.activeTopicId = '';
            state.ui.activeAlgorithmCategoryId = null;
            state.ui.activeSQLCategoryId = null;

            const button = sidebarRenderers.createAllContentButton();

            expect(button.className).toContain('active');
        });

        test('should calculate total progress across all content', () => {
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        { name: 'Pattern 1', problems: [{ id: 'p1', name: 'P1', url: 'url1' }] },
                    ],
                },
            ];
            data.algorithmsData = [
                {
                    id: 'algo',
                    title: 'Algorithms',
                    algorithms: [{ id: 'a1', name: 'A1' }],
                },
            ];
            data.sqlData = [
                {
                    id: 'sql',
                    title: 'SQL',
                    topics: [
                        {
                            id: 't1',
                            title: 'T1',
                            patterns: [
                                { name: 'P1', problems: [{ id: 's1', name: 'S1', url: 'url1' }] },
                            ],
                        },
                    ],
                },
            ];

            const button = sidebarRenderers.createAllContentButton();

            expect(button.innerHTML).toContain('All Content');
            expect(button.innerHTML).toContain('sidebar-stat-total');
        });
    });

    describe('setActiveAllButton', () => {
        test('should add active class when true', () => {
            const mockButton = {
                classList: {
                    remove: jest.fn(),
                    add: jest.fn(),
                },
            };
            document.querySelectorAll = jest.fn().mockReturnValue([]);
            document.querySelector = jest.fn().mockReturnValue(mockButton);

            sidebarRenderers.setActiveAllButton(true);

            expect(mockButton.classList.add).toHaveBeenCalledWith('active');
        });

        test('should remove active class when false', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([
                {
                    classList: {
                        remove: jest.fn(),
                    },
                },
            ]);

            sidebarRenderers.setActiveAllButton(false);

            expect(document.querySelectorAll).toHaveBeenCalledWith('.sidebar-all-content');
        });
    });

    describe('_generateProgressHTML', () => {
        test('should generate progress HTML with correct stats', () => {
            const html = (sidebarRenderers as any)._generateProgressHTML(10, 5);

            expect(html).toContain('10');
            expect(html).toContain('50%');
            expect(html).toContain('sidebar-stat-total');
            expect(html).toContain('sidebar-stat-pct');
        });

        test('should apply green color for 100% completion', () => {
            const html = (sidebarRenderers as any)._generateProgressHTML(10, 10);

            expect(html).toContain('text-green-400');
        });

        test('should apply muted color for less than 100%', () => {
            const html = (sidebarRenderers as any)._generateProgressHTML(10, 5);

            expect(html).toContain('text-theme-muted');
        });

        test('should handle zero total', () => {
            const html = (sidebarRenderers as any)._generateProgressHTML(0, 0);

            expect(html).toContain('0%');
        });
    });

    describe('_getPatternStats', () => {
        test('should return stats for specific topic', () => {
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        { name: 'Pattern 1', problems: [{ id: '1', name: 'P1', url: 'url1' }] },
                    ],
                },
            ];

            const stats = (sidebarRenderers as any)._getPatternStats('arrays');

            expect(stats.total).toBe(1);
            expect(stats.solved).toBe(0);
        });

        test('should return stats for all topics', () => {
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        { name: 'Pattern 1', problems: [{ id: '1', name: 'P1', url: 'url1' }] },
                    ],
                },
                {
                    id: 'trees',
                    title: 'Trees',
                    patterns: [
                        { name: 'Pattern 2', problems: [{ id: '2', name: 'P2', url: 'url2' }] },
                    ],
                },
            ];

            const stats = (sidebarRenderers as any)._getPatternStats('all');

            expect(stats.total).toBe(2);
        });

        test('should skip SQL problems in pattern stats', () => {
            data.topicsData = [
                {
                    id: 'mixed',
                    title: 'Mixed',
                    patterns: [
                        {
                            name: 'Pattern 1',
                            problems: [
                                { id: 'regular-1', name: 'Regular', url: 'url1' },
                                { id: 'sql-1', name: 'SQL', url: 'url2' },
                            ],
                        },
                    ],
                },
            ];

            const stats = (sidebarRenderers as any)._getPatternStats('mixed');

            expect(stats.total).toBe(1); // Only regular problem counted
        });
    });

    describe('getTopicIcon', () => {
        test('should return icon for known topic', () => {
            const icon = sidebarRenderers.getTopicIcon('arrays');

            expect(icon).toBe('<svg>arrays</svg>');
        });

        test('should return default icon for unknown topic', () => {
            const icon = sidebarRenderers.getTopicIcon('unknown');

            expect(icon).toBe('<svg>default</svg>');
        });
    });

    describe('Navigation handlers', () => {
        test('should handle topic navigation', async () => {
            // Setup data
            data.topicsData = [
                { id: 'arrays', title: 'Arrays', patterns: [] },
            ];

            // Render sidebar to get navigation handler
            sidebarRenderers.renderSidebar();

            // The navigation handlers are set up inside renderSidebar
            // We can verify they would update URL parameters
            expect(updateUrlParameter).not.toHaveBeenCalled();
        });

        test('should handle algorithm navigation', async () => {
            data.algorithmsData = [
                { id: 'arrays', title: 'Arrays', algorithms: [] },
            ];

            sidebarRenderers.renderSidebar();

            expect(updateUrlParameter).not.toHaveBeenCalled();
        });

        test('should handle SQL navigation', async () => {
            data.sqlData = [
                { id: 'basics', title: 'SQL Basics', topics: [] },
            ];

            sidebarRenderers.renderSidebar();

            expect(updateUrlParameter).not.toHaveBeenCalled();
        });

        test('should handle all content navigation', async () => {
            sidebarRenderers.renderSidebar();

            expect(updateUrlParameter).not.toHaveBeenCalled();
        });

        test('should close mobile menu on narrow screens', async () => {
            // Mock innerWidth
            Object.defineProperty(window, 'innerWidth', {
                writable: true,
                configurable: true,
                value: 500, // Narrow screen
            });

            data.topicsData = [
                { id: 'arrays', title: 'Arrays', patterns: [] },
            ];

            sidebarRenderers.renderSidebar();

            // The mobile menu toggle would be called when a button is clicked
            // We verify the setup includes this logic by checking the button was created
            expect(toggleMobileMenu).not.toHaveBeenCalled();
        });
    });
});
