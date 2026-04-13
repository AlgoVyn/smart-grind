/**
 * Enhanced Stats Renderer Tests
 * Additional tests for stats.ts covering:
 * - Stats calculation for all content types
 * - Sidebar stats update
 * - Algorithm and SQL category stats
 * - Filter button updates
 */

// Mock dependencies
jest.mock('@/utils', () => ({
    getToday: jest.fn(() => '2023-01-01'),
    getUniqueProblemsForTopic: jest.fn(() => ({ total: 10, solved: 5, due: 2 })),
}));

jest.mock('@/state', () => ({
    state: {
        ui: {
            activeTopicId: '',
            activeAlgorithmCategoryId: null,
            activeSQLCategoryId: null,
            currentFilter: 'all',
        },

        setProblem: jest.fn(),
        deleteProblem: jest.fn(),
        clearProblems: jest.fn(),
        addDeletedId: jest.fn(),
        removeDeletedId: jest.fn(),
        clearDeletedIds: jest.fn(),
        replaceProblems: jest.fn(),
        replaceDeletedIds: jest.fn(),
        setFlashCardProgress: jest.fn(),
        saveToStorage: jest.fn(),
        saveToStorageDebounced: jest.fn(),
        elements: {
            statTotal: null,
            statSolved: null,
            statDue: null,
            progressBarSolved: null,
            statDueBadge: null,
            sidebarTotalStat: null,
            sidebarTotalBar: null,
            reviewBanner: null,
            reviewCountBanner: null,
            filterBtns: null,
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

jest.mock('@/renderers', () => ({
    renderers: {
        _updateMainStats: jest.fn(),
        _updateSidebarStats: jest.fn(),
        _updateReviewBanner: jest.fn(),
        _updateSidebarStatsOnly: jest.fn(),
        updateStats: jest.fn(),
    },
}));

import { statsRenderers } from '@/renderers/stats';
import { state } from '@/state';
import { data } from '@/data';
import { getToday, getUniqueProblemsForTopic } from '@/utils';
import { renderers } from '@/renderers';

describe('Stats Renderer Enhanced', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Make state methods actually update the mock Map/Set
        (state.setProblem as jest.Mock).mockImplementation((id: string, p: any) => { (state.problems as Map<string, any>).set(id, p); });
        (state.deleteProblem as jest.Mock).mockImplementation((id: string) => { (state.problems as Map<string, any>).delete(id); });
        (state.clearProblems as jest.Mock).mockImplementation(() => { (state.problems as Map<string, any>).clear(); });
        (state.addDeletedId as jest.Mock).mockImplementation((id: string) => { (state.deletedProblemIds as Set<string>).add(id); });
        (state.removeDeletedId as jest.Mock).mockImplementation((id: string) => { (state.deletedProblemIds as Set<string>).delete(id); });
        (state.clearDeletedIds as jest.Mock).mockImplementation(() => { (state.deletedProblemIds as Set<string>).clear(); });


        // Reset state
        state.ui.activeTopicId = '';
        state.ui.activeAlgorithmCategoryId = null;
        state.ui.activeSQLCategoryId = null;
        state.ui.currentFilter = 'all';
        state.clearProblems();

        // Reset elements
        state.elements.statTotal = { innerText: '' } as HTMLElement;
        state.elements.statSolved = { innerText: '' } as HTMLElement;
        state.elements.statDue = { innerText: '' } as HTMLElement;
        state.elements.progressBarSolved = { style: { width: '' } } as HTMLElement;
        state.elements.statDueBadge = {
            classList: { toggle: jest.fn() },
        } as unknown as HTMLElement;
        state.elements.sidebarTotalStat = { innerText: '' } as HTMLElement;
        state.elements.sidebarTotalBar = { style: { width: '' } } as HTMLElement;
        state.elements.reviewBanner = {
            classList: { remove: jest.fn(), add: jest.fn() },
        } as unknown as HTMLElement;
        state.elements.reviewCountBanner = { innerText: '' } as HTMLElement;

        // Reset data
        data.topicsData = [];
        data.algorithmsData = [];
        data.sqlData = [];
    });

    describe('_updateMainStats', () => {
        test('should update all main stat elements', () => {
            const stats = { total: 10, solved: 5, due: 2 };

            statsRenderers._updateMainStats(stats);

            expect(state.elements.statTotal!.innerText).toBe('10');
            expect(state.elements.statSolved!.innerText).toBe('5');
            expect(state.elements.statDue!.innerText).toBe('2');
            expect(state.elements.progressBarSolved!.style.width).toBe('50%');
        });

        test('should show due badge when there are due problems', () => {
            const stats = { total: 10, solved: 5, due: 2 };

            statsRenderers._updateMainStats(stats);

            expect(state.elements.statDueBadge!.classList.toggle).toHaveBeenCalledWith('hidden', false);
        });

        test('should hide due badge when no due problems', () => {
            const stats = { total: 10, solved: 10, due: 0 };

            statsRenderers._updateMainStats(stats);

            expect(state.elements.statDueBadge!.classList.toggle).toHaveBeenCalledWith('hidden', true);
        });

        test('should handle zero total', () => {
            const stats = { total: 0, solved: 0, due: 0 };

            statsRenderers._updateMainStats(stats);

            expect(state.elements.progressBarSolved!.style.width).toBe('0%');
        });

        test('should handle null elements gracefully', () => {
            state.elements.statTotal = null;
            state.elements.statSolved = null;
            state.elements.statDue = null;
            state.elements.progressBarSolved = null;
            state.elements.statDueBadge = null;

            const stats = { total: 10, solved: 5, due: 2 };

            // Should not throw
            expect(() => {
                statsRenderers._updateMainStats(stats);
            }).not.toThrow();
        });
    });

    describe('_updateSidebarStats', () => {
        test('should update sidebar stat elements', () => {
            // Add some problems
            state.setProblem('1', { id: '1', status: 'solved' } as any);
            state.setProblem('2', { id: '2', status: 'unsolved' } as any);

            statsRenderers._updateSidebarStats();

            expect(state.elements.sidebarTotalStat!.innerText).toBe('50%');
            expect(state.elements.sidebarTotalBar!.style.width).toBe('50%');
        });

        test('should handle unique problem IDs', () => {
            // Add duplicate problem IDs (shouldn't happen but test resilience)
            state.setProblem('1', { id: '1', status: 'solved' } as any);

            statsRenderers._updateSidebarStats();

            expect(state.elements.sidebarTotalStat!.innerText).toBe('100%');
        });

        test('should handle zero problems', () => {
            statsRenderers._updateSidebarStats();

            expect(state.elements.sidebarTotalStat!.innerText).toBe('0%');
            expect(state.elements.sidebarTotalBar!.style.width).toBe('0%');
        });

        test('should handle null elements gracefully', () => {
            state.elements.sidebarTotalStat = null;
            state.elements.sidebarTotalBar = null;

            state.setProblem('1', { id: '1', status: 'solved' } as any);

            // Should not throw
            expect(() => {
                statsRenderers._updateSidebarStats();
            }).not.toThrow();
        });
    });

    describe('_updateReviewBanner', () => {
        test('should show review banner when there are due problems', () => {
            statsRenderers._updateReviewBanner(5);

            expect(state.elements.reviewBanner!.classList.remove).toHaveBeenCalledWith('hidden');
            expect(state.elements.reviewCountBanner!.innerText).toBe('5');
        });

        test('should hide review banner when no due problems', () => {
            statsRenderers._updateReviewBanner(0);

            expect(state.elements.reviewBanner!.classList.add).toHaveBeenCalledWith('hidden');
        });

        test('should handle null elements gracefully', () => {
            state.elements.reviewBanner = null;
            state.elements.reviewCountBanner = null;

            // Should not throw
            expect(() => {
                statsRenderers._updateReviewBanner(5);
            }).not.toThrow();
        });
    });

    describe('_getAlgorithmCategoryStats', () => {
        test('should return stats for all algorithms', () => {
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

            // Mark one as solved
            state.setProblem('algo-1', { id: 'algo-1', status: 'solved', nextReviewDate: '2023-01-01' } as any);

            const stats = statsRenderers._getAlgorithmCategoryStats('all');

            expect(stats.total).toBe(3);
            expect(stats.solved).toBe(1);
            expect(stats.due).toBe(1); // algo-1 is due
        });

        test('should return stats for specific category', () => {
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

            state.setProblem('algo-1', { id: 'algo-1', status: 'solved', nextReviewDate: '2024-01-01' } as any);

            const stats = statsRenderers._getAlgorithmCategoryStats('arrays');

            expect(stats.total).toBe(2);
            expect(stats.solved).toBe(1);
            expect(stats.due).toBe(0); // Not due yet
        });

        test('should handle non-existent category', () => {
            data.algorithmsData = [];

            const stats = statsRenderers._getAlgorithmCategoryStats('nonexistent');

            expect(stats.total).toBe(0);
            expect(stats.solved).toBe(0);
            expect(stats.due).toBe(0);
        });

        test('should count due problems correctly', () => {
            const today = '2023-01-01';
            (getToday as jest.Mock).mockReturnValue(today);

            data.algorithmsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    algorithms: [
                        { id: 'algo-1', name: 'Algo 1' },
                    ],
                },
            ];

            // Problem due today
            state.setProblem('algo-1', {
                id: 'algo-1',
                status: 'solved',
                nextReviewDate: today,
            } as any);

            const stats = statsRenderers._getAlgorithmCategoryStats('arrays');

            expect(stats.due).toBe(1);
        });

        test('should not count unsolved problems as due', () => {
            const today = '2023-01-01';
            (getToday as jest.Mock).mockReturnValue(today);

            data.algorithmsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    algorithms: [
                        { id: 'algo-1', name: 'Algo 1' },
                    ],
                },
            ];

            // Unsolved problem
            state.setProblem('algo-1', {
                id: 'algo-1',
                status: 'unsolved',
                nextReviewDate: today,
            } as any);

            const stats = statsRenderers._getAlgorithmCategoryStats('arrays');

            expect(stats.solved).toBe(0);
            expect(stats.due).toBe(0);
        });
    });

    describe('_getSQLCategoryStats', () => {
        test('should return stats for all SQL categories', () => {
            data.sqlData = [
                {
                    id: 'basics',
                    title: 'SQL Basics',
                    topics: [
                        {
                            id: 't1',
                            title: 'Topic 1',
                            patterns: [
                                {
                                    name: 'Pattern 1',
                                    problems: [
                                        { id: 'sql-1', name: 'SQL 1', url: 'url1' },
                                        { id: 'sql-2', name: 'SQL 2', url: 'url2' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            state.setProblem('sql-1', { id: 'sql-1', status: 'solved', nextReviewDate: '2024-01-01' } as any);

            const stats = statsRenderers._getSQLCategoryStats('all');

            expect(stats.total).toBe(2);
            expect(stats.solved).toBe(1);
        });

        test('should return stats for specific SQL category', () => {
            data.sqlData = [
                {
                    id: 'basics',
                    title: 'SQL Basics',
                    topics: [
                        {
                            id: 't1',
                            title: 'Topic 1',
                            patterns: [
                                {
                                    name: 'Pattern 1',
                                    problems: [
                                        { id: 'sql-1', name: 'SQL 1', url: 'url1' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'advanced',
                    title: 'SQL Advanced',
                    topics: [
                        {
                            id: 't2',
                            title: 'Topic 2',
                            patterns: [
                                {
                                    name: 'Pattern 2',
                                    problems: [
                                        { id: 'sql-2', name: 'SQL 2', url: 'url2' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            const stats = statsRenderers._getSQLCategoryStats('basics');

            expect(stats.total).toBe(1);
        });

        test('should count unique problem IDs', () => {
            data.sqlData = [
                {
                    id: 'basics',
                    title: 'SQL Basics',
                    topics: [
                        {
                            id: 't1',
                            title: 'Topic 1',
                            patterns: [
                                {
                                    name: 'Pattern 1',
                                    problems: [
                                        { id: 'sql-1', name: 'SQL 1', url: 'url1' },
                                    ],
                                },
                                {
                                    name: 'Pattern 2',
                                    problems: [
                                        { id: 'sql-1', name: 'SQL 1', url: 'url1' }, // Duplicate
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            const stats = statsRenderers._getSQLCategoryStats('basics');

            expect(stats.total).toBe(1); // Duplicates should be counted once
        });
    });

    describe('_getAllContentStats', () => {
        test('should combine stats from patterns, algorithms, and SQL', () => {
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        {
                            name: 'Pattern 1',
                            problems: [
                                { id: 'p1', name: 'Pattern Problem', url: 'url1' },
                            ],
                        },
                    ],
                },
            ];
            data.algorithmsData = [
                {
                    id: 'algo',
                    title: 'Algorithms',
                    algorithms: [
                        { id: 'a1', name: 'Algo Problem' },
                    ],
                },
            ];
            data.sqlData = [
                {
                    id: 'sql',
                    title: 'SQL',
                    topics: [
                        {
                            id: 't1',
                            title: 'Topic 1',
                            patterns: [
                                {
                                    name: 'Pattern 1',
                                    problems: [
                                        { id: 's1', name: 'SQL Problem', url: 'url1' },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ];

            // Mark some as solved
            state.setProblem('p1', { id: 'p1', status: 'solved', nextReviewDate: '2024-01-01' } as any);
            state.setProblem('a1', { id: 'a1', status: 'solved', nextReviewDate: '2024-01-01' } as any);
            state.setProblem('s1', { id: 's1', status: 'unsolved' } as any);

            const stats = statsRenderers._getAllContentStats();

            expect(stats.total).toBe(3);
            expect(stats.solved).toBe(2);
        });

        test('should handle string problem IDs in patterns', () => {
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        {
                            name: 'Pattern 1',
                            problems: ['string-id-1', 'string-id-2'], // String IDs
                        },
                    ],
                },
            ];

            const stats = statsRenderers._getAllContentStats();

            expect(stats.total).toBe(2);
        });

        test('should handle mixed problem ID formats', () => {
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        {
                            name: 'Pattern 1',
                            problems: [
                                'string-id',
                                { id: 'object-id', name: 'Object', url: 'url' },
                            ],
                        },
                    ],
                },
            ];

            const stats = statsRenderers._getAllContentStats();

            expect(stats.total).toBe(2);
        });

        test('should count due problems from all content types', () => {
            const today = '2023-01-01';
            (getToday as jest.Mock).mockReturnValue(today);

            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [
                        {
                            name: 'Pattern 1',
                            problems: [{ id: 'p1', name: 'P1', url: 'url1' }],
                        },
                    ],
                },
            ];

            // Due problem
            state.setProblem('p1', { id: 'p1', status: 'solved', nextReviewDate: today } as any);

            const stats = statsRenderers._getAllContentStats();

            expect(stats.due).toBe(1);
        });
    });

    describe('updateStats', () => {
        test('should update stats for algorithm view', () => {
            state.ui.activeAlgorithmCategoryId = 'arrays';

            statsRenderers.updateStats();

            expect(renderers._updateMainStats).toHaveBeenCalled();
            expect(renderers._updateSidebarStats).toHaveBeenCalled();
            expect(renderers._updateReviewBanner).toHaveBeenCalled();
        });

        test('should update stats for SQL view', () => {
            state.ui.activeSQLCategoryId = 'basics';

            statsRenderers.updateStats();

            expect(renderers._updateMainStats).toHaveBeenCalled();
        });

        test('should update stats for all content view', () => {
            // No active category means all content view
            state.ui.activeTopicId = '';
            state.ui.activeAlgorithmCategoryId = null;
            state.ui.activeSQLCategoryId = null;

            statsRenderers.updateStats();

            expect(renderers._updateMainStats).toHaveBeenCalled();
        });

        test('should update stats for all topics view', () => {
            state.ui.activeTopicId = 'all';

            statsRenderers.updateStats();

            expect(renderers._updateMainStats).toHaveBeenCalled();
            expect(getUniqueProblemsForTopic).toHaveBeenCalledWith('all');
        });

        test('should update stats for specific topic', () => {
            state.ui.activeTopicId = 'arrays';

            statsRenderers.updateStats();

            expect(getUniqueProblemsForTopic).toHaveBeenCalledWith('arrays');
        });

        test('should call _updateSidebarStatsOnly for performance', () => {
            statsRenderers.updateStats();

            expect(renderers._updateSidebarStatsOnly).toHaveBeenCalled();
        });
    });

    describe('_updateSidebarStatsOnly', () => {
        test('should update sidebar stats without full re-render', () => {
            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [],
                },
            ];

            document.querySelectorAll = jest.fn().mockReturnValue([]);

            statsRenderers._updateSidebarStatsOnly();

            expect(getUniqueProblemsForTopic).toHaveBeenCalledWith('arrays');
        });

        test('should update topic button percentages', () => {
            const mockButton = {
                dataset: { topicId: 'arrays' },
                querySelector: jest.fn(() => ({ textContent: '' })),
            };

            data.topicsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    patterns: [],
                },
            ];

            document.querySelectorAll = jest.fn().mockReturnValue([mockButton]);

            statsRenderers._updateSidebarStatsOnly();

            expect(document.querySelectorAll).toHaveBeenCalledWith('.sidebar-link[data-topic-id]');
        });

        test('should call _updateAlgorithmSidebarStats', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([]);

            const updateAlgorithmSpy = jest.spyOn(statsRenderers, '_updateAlgorithmSidebarStats');

            statsRenderers._updateSidebarStatsOnly();

            expect(updateAlgorithmSpy).toHaveBeenCalled();

            updateAlgorithmSpy.mockRestore();
        });

        test('should call _updateSQLSidebarStats', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([]);

            const updateSQLSpy = jest.spyOn(statsRenderers, '_updateSQLSidebarStats');

            statsRenderers._updateSidebarStatsOnly();

            expect(updateSQLSpy).toHaveBeenCalled();

            updateSQLSpy.mockRestore();
        });

        test('should call _updateAllContentSidebarStats', () => {
            document.querySelectorAll = jest.fn().mockReturnValue([]);

            const updateAllContentSpy = jest.spyOn(statsRenderers, '_updateAllContentSidebarStats');

            statsRenderers._updateSidebarStatsOnly();

            expect(updateAllContentSpy).toHaveBeenCalled();

            updateAllContentSpy.mockRestore();
        });
    });

    describe('_updateAlgorithmSidebarStats', () => {
        test('should update algorithm button percentages', () => {
            data.algorithmsData = [
                {
                    id: 'arrays',
                    title: 'Arrays',
                    algorithms: [],
                },
            ];

            const mockButton = {
                dataset: { categoryId: 'arrays' },
                querySelector: jest.fn(() => null),
            };

            document.querySelectorAll = jest.fn().mockReturnValue([mockButton]);

            // Should not throw
            expect(() => {
                statsRenderers._updateAlgorithmSidebarStats();
            }).not.toThrow();

            expect(document.querySelectorAll).toHaveBeenCalledWith('.sidebar-algorithm-category[data-category-id]');
        });
    });

    describe('_updateSQLSidebarStats', () => {
        test('should update SQL button percentages', () => {
            data.sqlData = [
                {
                    id: 'basics',
                    title: 'SQL Basics',
                    topics: [],
                },
            ];

            const mockButton = {
                dataset: { sqlCategoryId: 'basics' },
                querySelector: jest.fn(() => null),
            };

            document.querySelectorAll = jest.fn().mockReturnValue([mockButton]);

            // Should not throw
            expect(() => {
                statsRenderers._updateSQLSidebarStats();
            }).not.toThrow();

            expect(document.querySelectorAll).toHaveBeenCalledWith('.sidebar-sql-category[data-sql-category-id]');
        });
    });

    describe('_updateAllContentSidebarStats', () => {
        test('should update All Content button percentage', () => {
            const mockButton = {
                querySelector: jest.fn(() => null),
            };

            document.querySelector = jest.fn().mockReturnValue(mockButton);

            // Should not throw
            expect(() => {
                statsRenderers._updateAllContentSidebarStats();
            }).not.toThrow();

            expect(document.querySelector).toHaveBeenCalledWith('.sidebar-all-content');
        });

        test('should do nothing when button not found', () => {
            document.querySelector = jest.fn().mockReturnValue(null);

            // Should not throw
            expect(() => {
                statsRenderers._updateAllContentSidebarStats();
            }).not.toThrow();
        });
    });

    describe('_updateButtonPercentage', () => {
        test('should update percentage span', () => {
            const mockPctSpan = {
                textContent: '',
                className: '',
            };

            const mockButton = {
                querySelector: jest.fn((selector) => {
                    if (selector === '.sidebar-stat-pct') return mockPctSpan;
                    return null;
                }),
            } as unknown as HTMLElement;

            statsRenderers._updateButtonPercentage(mockButton, 75);

            expect(mockPctSpan.textContent).toBe('75%');
        });

        test('should apply green color for 100% completion', () => {
            const mockPctSpan = {
                textContent: '',
                className: '',
            };

            const mockButton = {
                querySelector: jest.fn((selector) => {
                    if (selector === '.sidebar-stat-pct') return mockPctSpan;
                    return null;
                }),
            } as unknown as HTMLElement;

            statsRenderers._updateButtonPercentage(mockButton, 100);

            expect(mockPctSpan.className).toContain('text-green-400');
        });

        test('should update total count when provided', () => {
            const mockTotalSpan = {
                textContent: '',
            };

            const mockButton = {
                querySelector: jest.fn((selector) => {
                    if (selector === '.sidebar-stat-pct') return { textContent: '', className: '' };
                    if (selector === '.sidebar-stat-total') return mockTotalSpan;
                    return null;
                }),
            } as unknown as HTMLElement;

            statsRenderers._updateButtonPercentage(mockButton, 50, 20);

            expect(mockTotalSpan.textContent).toBe('20');
        });

        test('should handle missing elements gracefully', () => {
            const mockButton = {
                querySelector: jest.fn(() => null),
            } as unknown as HTMLElement;

            // Should not throw
            expect(() => {
                statsRenderers._updateButtonPercentage(mockButton, 50);
            }).not.toThrow();
        });
    });

    describe('updateFilterBtns', () => {
        test('should update filter button states', () => {
            const mockBtn1 = {
                dataset: { filter: 'all' },
                classList: {
                    remove: jest.fn(),
                    add: jest.fn(),
                },
            };
            const mockBtn2 = {
                dataset: { filter: 'solved' },
                classList: {
                    remove: jest.fn(),
                    add: jest.fn(),
                },
            };

            state.elements.filterBtns = [mockBtn1, mockBtn2] as any;
            state.ui.currentFilter = 'all';

            statsRenderers.updateFilterBtns();

            expect(mockBtn1.classList.add).toHaveBeenCalledWith('bg-brand-600', 'text-white');
            expect(mockBtn1.classList.remove).toHaveBeenCalledWith('text-theme-bold');
            expect(mockBtn2.classList.remove).toHaveBeenCalledWith('bg-brand-600', 'text-white');
            expect(mockBtn2.classList.add).toHaveBeenCalledWith('text-theme-bold');
        });

        test('should handle missing filterBtns', () => {
            state.elements.filterBtns = null;

            // Should not throw
            expect(() => {
                statsRenderers.updateFilterBtns();
            }).not.toThrow();
        });
    });
});
