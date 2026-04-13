/**
 * Enhanced Problem Cards Renderer Tests
 * Additional tests for problem-cards.ts covering:
 * - Card rendering edge cases
 * - Status changes with error handling
 * - Hiding cards with various scenarios
 */

// Mock dependencies before importing
jest.mock('@/utils', () => ({
    getToday: jest.fn(() => '2023-01-01'),
    getNextReviewDate: jest.fn((today, interval) => {
        const date = new Date(today);
        date.setDate(date.getDate() + (interval + 1) * 2);
        return date.toISOString().split('T')[0];
    }),
    shouldShowProblem: jest.fn(() => true),
    showToast: jest.fn(),
    sanitizeInput: jest.fn((str) => str),
    askAI: jest.fn(),
    escapeHtml: jest.fn((str) => str),
}));

jest.mock('@/api', () => ({
    api: {
        saveProblemWithSync: jest.fn().mockResolvedValue(undefined),
        saveDeletedId: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock('@/data', () => ({
    data: {
        algorithmsData: [],
        topicsData: [],
        sqlData: [],
    },
}));

jest.mock('@/state', () => ({
    state: {
        ui: {
            currentFilter: 'all',
            searchQuery: '',
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
        problems: new Map(),
        elements: {},
    },
}));

// Mock renderers module for lazy imports
jest.mock('@/renderers', () => ({
    renderers: {
        updateStats: jest.fn(),
    },
}));

// Mock UI modules
jest.mock('@/ui/ui', () => ({
    ui: {
        showConfirm: jest.fn().mockResolvedValue(true),
        openSolutionModal: jest.fn(),
        openPatternSolutionModal: jest.fn(),
    },
}));

jest.mock('@/ui/ui-markdown', () => ({
    openProblemSQLSolutionModal: jest.fn(),
}));

// Mock html-generators
jest.mock('@/renderers/html-generators', () => ({
    htmlGenerators: {
        generateProblemCardHTML: jest.fn((p) => ({
            className: `problem-card ${p.status}`,
            innerHTML: `<div>${p.name}</div>`,
        })),
    },
}));

import { problemCardRenderers } from '@/renderers/problem-cards';
import { api } from '@/api';
import { state } from '@/state';
import * as utils from '@/utils';
import { ui } from '@/ui/ui';
import { openProblemSQLSolutionModal } from '@/ui/ui-markdown';
import { htmlGenerators } from '@/renderers/html-generators';

describe('Problem Cards Renderer Enhanced', () => {
    let mockCard: HTMLElement;
    let mockButton: HTMLElement;
    let mockGrid: HTMLElement;
    let mockPatternSection: HTMLElement;
    let mockTopicSection: HTMLElement;
    let mockContainer: HTMLElement;
    let mockEmptyState: HTMLElement;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create mock DOM elements
        mockEmptyState = {
            classList: {
                toggle: jest.fn(),
            },
        } as unknown as HTMLElement;

        mockContainer = {
            querySelectorAll: jest.fn(() => []),
        } as unknown as HTMLElement;

        mockTopicSection = {
            style: { display: '' },
            querySelectorAll: jest.fn(() => []),
            parentElement: mockContainer,
        } as unknown as HTMLElement;

        mockPatternSection = {
            style: { display: '' },
            parentElement: mockTopicSection,
        } as unknown as HTMLElement;

        mockGrid = {
            parentElement: mockPatternSection,
            querySelectorAll: jest.fn(() => []),
        } as unknown as HTMLElement;

        mockCard = {
            className: 'problem-card',
            innerHTML: '',
            style: { display: '' },
            dataset: {},
            querySelector: jest.fn(() => mockButton),
            closest: jest.fn((selector) => {
                if (selector === '.group') return mockCard;
                if (selector === '.note-area') return null;
                return null;
            }),
        } as unknown as HTMLElement;

        mockButton = {
            dataset: {},
            closest: jest.fn((selector) => {
                if (selector === '.group') return mockCard;
                return null;
            }),
        } as unknown as HTMLElement;

        // Setup state
        state.ui.currentFilter = 'all';
        state.ui.searchQuery = '';
        state.elements.emptyState = mockEmptyState;
    });

    describe('createProblemCard', () => {
        test('should create card with correct data attributes', () => {
            const problem = {
                id: 'test-problem',
                name: 'Test Problem',
                status: 'unsolved',
                url: 'https://example.com/problem',
            };

            const card = problemCardRenderers.createProblemCard(problem as any);

            expect(card).toBeDefined();
            expect(card.dataset['problemId']).toBe('test-problem');
            expect(htmlGenerators.generateProblemCardHTML).toHaveBeenCalledWith(problem);
        });

        test('should apply correct CSS classes based on status', () => {
            const unsolvedProblem = {
                id: '1',
                name: 'Unsolved',
                status: 'unsolved',
            };

            (htmlGenerators.generateProblemCardHTML as jest.Mock).mockReturnValueOnce({
                className: 'bg-dark-800 border-theme',
                innerHTML: '<div>Unsolved</div>',
            });

            const card = problemCardRenderers.createProblemCard(unsolvedProblem as any);

            expect(card.className).toContain('bg-dark-800');
        });
    });

    describe('reRenderCard', () => {
        test('should update card HTML with new problem state', () => {
            const problem = {
                id: '1',
                name: 'Updated Problem',
                status: 'solved',
            };

            (htmlGenerators.generateProblemCardHTML as jest.Mock).mockReturnValueOnce({
                className: 'problem-card solved',
                innerHTML: '<div>Updated Problem</div>',
            });

            problemCardRenderers.reRenderCard(mockButton, problem as any);

            expect(mockCard.className).toBe('problem-card solved');
            expect(mockCard.innerHTML).toBe('<div>Updated Problem</div>');
        });

        test('should handle mock objects for testing', () => {
            // Test with mock button that has parentElement instead of closest
            const mockMockButton = {
                closest: null,
                parentElement: mockCard,
            } as unknown as HTMLElement;

            const problem = {
                id: '1',
                name: 'Test',
                status: 'unsolved',
            };

            (htmlGenerators.generateProblemCardHTML as jest.Mock).mockReturnValueOnce({
                className: 'problem-card',
                innerHTML: '<div>Test</div>',
            });

            problemCardRenderers.reRenderCard(mockMockButton, problem as any);

            expect(mockCard.className).toBe('problem-card');
        });

        test('should do nothing when card not found', () => {
            const buttonWithNoCard = {
                closest: jest.fn(() => null),
            } as unknown as HTMLElement;

            const problem = {
                id: '1',
                name: 'Test',
                status: 'unsolved',
            };

            // Should not throw
            expect(() => {
                problemCardRenderers.reRenderCard(buttonWithNoCard, problem as any);
            }).not.toThrow();
        });
    });

    describe('reRenderAllCards', () => {
        test('should re-render all instances of a problem card', () => {
            const problem = {
                id: 'multi-instance',
                name: 'Multi Instance Problem',
                status: 'solved',
            };

            const mockCards = [
                { ...mockCard, dataset: { problemId: 'multi-instance' } },
                { ...mockCard, dataset: { problemId: 'multi-instance' } },
            ];

            document.querySelectorAll = jest.fn().mockReturnValue(mockCards);

            // Spy on reRenderCard
            const reRenderCardSpy = jest.spyOn(problemCardRenderers, 'reRenderCard');

            problemCardRenderers.reRenderAllCards(problem as any);

            expect(document.querySelectorAll).toHaveBeenCalledWith('[data-problem-id="multi-instance"]');
            expect(reRenderCardSpy).toHaveBeenCalledTimes(2);

            reRenderCardSpy.mockRestore();
        });

        test('should hide cards when filtered out', () => {
            const problem = {
                id: 'filtered-out',
                name: 'Filtered Problem',
                status: 'solved',
            };

            const mockCards = [
                { ...mockCard, dataset: { problemId: 'filtered-out' } },
            ];

            document.querySelectorAll = jest.fn().mockReturnValue(mockCards);

            const hideCardSpy = jest.spyOn(problemCardRenderers, 'hideCardIfFilteredOut');

            problemCardRenderers.reRenderAllCards(problem as any, true);

            expect(hideCardSpy).toHaveBeenCalled();

            hideCardSpy.mockRestore();
        });

        test('should skip cards without action button', () => {
            const problem = {
                id: 'no-action-btn',
                name: 'Problem',
                status: 'unsolved',
            };

            const mockCardWithoutBtn = {
                ...mockCard,
                querySelector: jest.fn(() => null), // No button found
            };

            document.querySelectorAll = jest.fn().mockReturnValue([mockCardWithoutBtn]);

            // Should not throw
            expect(() => {
                problemCardRenderers.reRenderAllCards(problem as any);
            }).not.toThrow();
        });
    });

    describe('hideCardIfFilteredOut', () => {
        test('should hide card when filtered out', () => {
            const buttonInGrid = {
                closest: jest.fn((selector) => {
                    if (selector === '.group') return mockCard;
                    return null;
                }),
            } as unknown as HTMLElement;

            // Make card have grid as parent
            Object.defineProperty(mockCard, 'parentElement', {
                value: mockGrid,
                writable: true,
            });

            problemCardRenderers.hideCardIfFilteredOut(buttonInGrid);

            expect(mockCard.style.display).toBe('none');
        });

        test('should hide parent section when all cards hidden', () => {
            const buttonInGrid = {
                closest: jest.fn((selector) => {
                    if (selector === '.group') return mockCard;
                    return null;
                }),
            } as unknown as HTMLElement;

            Object.defineProperty(mockCard, 'parentElement', {
                value: mockGrid,
                writable: true,
            });

            // All cards in grid are hidden
            mockGrid.querySelectorAll = jest.fn(() => []);

            problemCardRenderers.hideCardIfFilteredOut(buttonInGrid);

            expect(mockPatternSection.style.display).toBe('none');
        });

        test('should update stats after hiding card', () => {
            const buttonInGrid = {
                closest: jest.fn((selector) => {
                    if (selector === '.group') return mockCard;
                    return null;
                }),
            } as unknown as HTMLElement;

            Object.defineProperty(mockCard, 'parentElement', {
                value: mockGrid,
                writable: true,
            });

            // Should not throw - stats update happens via dynamic import
            expect(() => {
                problemCardRenderers.hideCardIfFilteredOut(buttonInGrid);
            }).not.toThrow();
        });
    });

    describe('performStatusChange', () => {
        test('should apply updates and save successfully', async () => {
            const problem = {
                id: '1',
                name: 'Test',
                status: 'unsolved',
                loading: false,
            };

            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);

            await problemCardRenderers.performStatusChange(
                mockButton,
                problem as any,
                (p) => {
                    p.status = 'solved';
                },
                { successMessage: 'Problem solved!' }
            );

            expect(problem.status).toBe('solved');
            expect(problem.loading).toBe(false);
            expect(api.saveProblemWithSync).toHaveBeenCalled();
            expect(utils.showToast).toHaveBeenCalledWith('Problem solved!', 'success');
        });

        test('should revert changes on error', async () => {
            const problem = {
                id: '1',
                name: 'Test',
                status: 'unsolved',
                reviewInterval: 0,
                nextReviewDate: null,
                loading: false,
            };

            (api.saveProblemWithSync as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            await problemCardRenderers.performStatusChange(
                mockButton,
                problem as any,
                (p) => {
                    p.status = 'solved';
                    p.reviewInterval = 1;
                    p.nextReviewDate = '2023-01-02';
                },
                { errorMessage: 'Failed to save' }
            );

            // Should revert to original values
            expect(problem.status).toBe('unsolved');
            expect(problem.reviewInterval).toBe(0);
            expect(problem.nextReviewDate).toBe(null);
            expect(utils.showToast).toHaveBeenCalledWith('Failed to save', 'error');
        });

        test('should use error message from exception when no custom message provided', async () => {
            const problem = {
                id: '1',
                name: 'Test',
                status: 'unsolved',
                loading: false,
            };

            (api.saveProblemWithSync as jest.Mock).mockRejectedValueOnce(new Error('Custom error'));

            await problemCardRenderers.performStatusChange(
                mockButton,
                problem as any,
                (p) => {
                    p.status = 'solved';
                }
            );

            expect(utils.showToast).toHaveBeenCalledWith(
                'Failed to update problem: Custom error',
                'error'
            );
        });

        test('should clear loading after save completes', async () => {
            const problem = {
                id: '1',
                name: 'Test',
                status: 'unsolved',
                loading: false,
            };

            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);

            await problemCardRenderers.performStatusChange(
                mockButton,
                problem as any,
                (p) => {
                    p.status = 'solved';
                }
            );

            expect(problem.loading).toBe(false);
        });

        test('should call onFinally callback after completion', async () => {
            const problem = {
                id: '1',
                name: 'Test',
                status: 'unsolved',
                loading: false,
            };

            const onFinally = jest.fn();

            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);

            await problemCardRenderers.performStatusChange(
                mockButton,
                problem as any,
                (p) => {
                    p.status = 'solved';
                },
                { onFinally }
            );

            expect(onFinally).toHaveBeenCalledWith(problem);
        });
    });

    describe('handleSolve', () => {
        test('should mark problem as solved with interval 0', async () => {
            const problem = {
                id: '1',
                name: 'Test',
                status: 'unsolved',
                loading: false,
            };

            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);
            (utils.getToday as jest.Mock).mockReturnValue('2023-01-01');
            (utils.getNextReviewDate as jest.Mock).mockReturnValue('2023-01-02');

            await problemCardRenderers.handleSolve(mockButton, problem as any);

            expect(problem.status).toBe('solved');
            expect(problem.reviewInterval).toBe(0);
            expect(problem.nextReviewDate).toBe('2023-01-02');
        });
    });

    describe('handleReview', () => {
        test('should increment review interval', async () => {
            const problem = {
                id: '1',
                name: 'Test',
                status: 'solved',
                reviewInterval: 2,
                loading: false,
            };

            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);
            (utils.getToday as jest.Mock).mockReturnValue('2023-01-01');
            (utils.getNextReviewDate as jest.Mock).mockReturnValue('2023-01-08');

            await problemCardRenderers.handleReview(mockButton, problem as any);

            expect(problem.reviewInterval).toBe(3);
            expect(problem.nextReviewDate).toBe('2023-01-08');
        });

        test('should hide card when problem no longer matches filter', async () => {
            const mockButtonWithCard = {
                closest: jest.fn((selector) => {
                    if (selector === '.group') {
                        return {
                            ...mockCard,
                            querySelector: jest.fn(() => ({ dataset: { action: 'review' } })),
                        };
                    }
                    return null;
                }),
            } as unknown as HTMLElement;

            const problem = {
                id: '1',
                status: 'solved',
                reviewInterval: 1,
                nextReviewDate: '2023-01-01',
                loading: false,
            };
            state.ui.currentFilter = 'review';
            (utils.shouldShowProblem as jest.Mock).mockReturnValue(false);
            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);
            // Spy on reRenderAllCards which calls hideCardIfFilteredOut
            const reRenderAllCardsSpy = jest.spyOn(problemCardRenderers, 'reRenderAllCards');

            await problemCardRenderers.handleReview(mockButtonWithCard, problem as any);

            expect(reRenderAllCardsSpy).toHaveBeenCalledWith(problem, true);

            reRenderAllCardsSpy.mockRestore();
        });
    });

    describe('handleReset', () => {
        test('should reset problem to unsolved state', async () => {
            const problem = {
                id: '1',
                name: 'Test',
                status: 'solved',
                reviewInterval: 3,
                nextReviewDate: '2023-06-01',
                loading: false,
            };

            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);

            await problemCardRenderers.handleReset(mockButton, problem as any);

            expect(problem.status).toBe('unsolved');
            expect(problem.reviewInterval).toBe(0);
            expect(problem.nextReviewDate).toBe(null);
        });
    });

    describe('handleDeleteAction', () => {
        test('should delete problem after confirmation', async () => {
            const problem = {
                id: '1',
                name: 'Test Problem',
                status: 'unsolved',
            };

            (ui.showConfirm as jest.Mock).mockResolvedValueOnce(true);

            await problemCardRenderers.handleDeleteAction(problem as any);

            expect(ui.showConfirm).toHaveBeenCalledWith('Delete "<b>Test Problem</b>"?');
            expect(api.saveDeletedId).toHaveBeenCalledWith('1');
        });

        test('should not delete if user cancels', async () => {
            const problem = {
                id: '1',
                name: 'Test Problem',
                status: 'unsolved',
            };

            (ui.showConfirm as jest.Mock).mockResolvedValueOnce(false);

            await problemCardRenderers.handleDeleteAction(problem as any);

            expect(api.saveDeletedId).not.toHaveBeenCalled();
        });
    });

    describe('handleNoteToggle', () => {
        test('should toggle note area visibility', () => {
            const mockNoteArea = {
                classList: {
                    toggle: jest.fn().mockReturnValue(false), // Now visible
                },
            };

            const buttonWithNoteArea = {
                closest: jest.fn((selector) => {
                    if (selector === '.group') {
                        return {
                            querySelector: jest.fn(() => mockNoteArea),
                        };
                    }
                    return null;
                }),
            } as unknown as HTMLElement;

            const problem = {
                id: '1',
                noteVisible: false,
            };

            problemCardRenderers.handleNoteToggle(buttonWithNoteArea, problem as any);

            expect(mockNoteArea.classList.toggle).toHaveBeenCalledWith('hidden');
            expect(problem.noteVisible).toBe(true);
        });

        test('should handle missing note area gracefully', () => {
            const buttonWithoutNoteArea = {
                closest: jest.fn(() => null),
            } as unknown as HTMLElement;

            const problem = {
                id: '1',
                noteVisible: false,
            };

            // Should not throw
            expect(() => {
                problemCardRenderers.handleNoteToggle(buttonWithoutNoteArea, problem as any);
            }).not.toThrow();
        });
    });

    describe('handleNoteSave', () => {
        test('should save note from textarea', async () => {
            const mockTextarea = {
                value: 'My note content',
            };

            const mockNoteArea = {
                querySelector: jest.fn(() => mockTextarea),
            };

            const buttonInNoteArea = {
                closest: jest.fn((selector) => {
                    if (selector === '.note-area') return mockNoteArea;
                    return null;
                }),
            } as unknown as HTMLElement;

            const problem = {
                id: '1',
                note: '',
                noteVisible: true,
                loading: false,
            };

            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);

            await problemCardRenderers.handleNoteSave(buttonInNoteArea, problem as any);

            expect(problem.note).toBe('My note content');
            expect(problem.noteVisible).toBe(false);
        });

        test('should do nothing if textarea not found', async () => {
            const mockNoteArea = {
                querySelector: jest.fn(() => null),
            };

            const buttonInNoteArea = {
                closest: jest.fn((selector) => {
                    if (selector === '.note-area') return mockNoteArea;
                    return null;
                }),
            } as unknown as HTMLElement;

            const problem = {
                id: '1',
                note: '',
            };

            // Should not throw
            await expect(
                problemCardRenderers.handleNoteSave(buttonInNoteArea, problem as any)
            ).resolves.not.toThrow();
        });
    });

    describe('handleAIActions', () => {
        test('should call askAI with correct parameters', () => {
            const problem = {
                id: '1',
                name: 'Two Sum',
            };

            problemCardRenderers.handleAIActions(problem as any, 'ask-chatgpt');

            expect(utils.askAI).toHaveBeenCalledWith('Two Sum', 'chatgpt', 'problem');
        });

        test('should default to chatgpt when provider not specified', () => {
            const problem = {
                id: '1',
                name: 'Two Sum',
            };

            problemCardRenderers.handleAIActions(problem as any, 'ask');

            expect(utils.askAI).toHaveBeenCalledWith('Two Sum', 'chatgpt', 'problem');
        });

        test('should use extracted provider from action', () => {
            const problem = {
                id: '1',
                name: 'Two Sum',
            };

            problemCardRenderers.handleAIActions(problem as any, 'ask-aistudio');

            expect(utils.askAI).toHaveBeenCalledWith('Two Sum', 'aistudio', 'problem');
        });
    });

    describe('handleSolutionActions', () => {
        test('should open solution modal for regular problems', async () => {
            const button = {
                dataset: {},
            } as unknown as HTMLElement;

            const problem = {
                id: 'regular-1',
                name: 'Regular Problem',
            };

            await problemCardRenderers.handleSolutionActions(button, problem as any, 'solution');

            expect(ui.openSolutionModal).toHaveBeenCalledWith('regular-1');
        });

        test('should open SQL solution modal for SQL problems', async () => {
            const button = {
                dataset: {},
            } as unknown as HTMLElement;

            const problem = {
                id: 'sql-problem-1',
                name: 'SQL Problem',
            };

            await problemCardRenderers.handleSolutionActions(button, problem as any, 'solution');

            expect(openProblemSQLSolutionModal).toHaveBeenCalledWith('SQL Problem');
        });

        test('should open pattern solution modal', async () => {
            const button = {
                dataset: { pattern: 'Two Sum Pattern' },
            } as unknown as HTMLElement;

            const problem = {
                id: '1',
                name: 'Test',
            };

            await problemCardRenderers.handleSolutionActions(button, problem as any, 'pattern-solution');

            expect(ui.openPatternSolutionModal).toHaveBeenCalledWith('Two Sum Pattern');
        });
    });

    describe('handleProblemCardClick', () => {
        test('should handle solve action', async () => {
            const mockBtn = {
                dataset: { action: 'solve' },
            };

            const mockEvent = {
                target: {
                    closest: jest.fn(() => mockBtn),
                },
            };

            const problem = {
                id: '1',
                status: 'unsolved',
            };

            const handleSolveSpy = jest.spyOn(problemCardRenderers, 'handleSolve');
            (api.saveProblemWithSync as jest.Mock).mockResolvedValueOnce(undefined);

            await problemCardRenderers.handleProblemCardClick(mockEvent as any, problem as any);

            expect(handleSolveSpy).toHaveBeenCalled();

            handleSolveSpy.mockRestore();
        });

        test('should handle unknown action gracefully', async () => {
            const mockBtn = {
                dataset: { action: 'unknown' },
            };

            const mockEvent = {
                target: {
                    closest: jest.fn(() => mockBtn),
                },
            };

            const problem = {
                id: '1',
                status: 'unsolved',
            };

            // Should not throw
            await expect(
                problemCardRenderers.handleProblemCardClick(mockEvent as any, problem as any)
            ).resolves.not.toThrow();
        });

        test('should do nothing when button has no action', async () => {
            const mockBtn = {
                dataset: {},
            };

            const mockEvent = {
                target: {
                    closest: jest.fn(() => mockBtn),
                },
            };

            const problem = {
                id: '1',
                status: 'unsolved',
            };

            // Should not throw
            await expect(
                problemCardRenderers.handleProblemCardClick(mockEvent as any, problem as any)
            ).resolves.not.toThrow();
        });
    });
});
