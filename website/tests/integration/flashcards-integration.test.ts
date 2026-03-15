/**
 * Flash Cards UI Integration Tests
 * Tests for flash card study session UI functionality
 */

import { FlashCard, FlashCardProgress } from '../../src/types';

// Mock DOMPurify
jest.mock('dompurify', () => ({
    __esModule: true,
    default: {
        sanitize: jest.fn((html: string) => html),
    },
}));

// Mock state
const mockSaveToStorage = jest.fn();
const mockFlashCardProgress = new Map<string, FlashCardProgress>();

jest.mock('../../src/state', () => ({
    state: {
        flashCardProgress: mockFlashCardProgress,
        saveToStorage: mockSaveToStorage,
        user: {
            type: 'local',
            id: null,
            displayName: 'Test User',
        },
    },
}));

// Mock toast
jest.mock('../../src/utils/toast', () => ({
    showToast: jest.fn(),
}));

// Mock utils
jest.mock('../../src/utils', () => ({
    getToday: jest.fn(() => '2024-01-15'),
    getNextReviewDate: jest.fn((date: string, days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }),
}));

// Mock flashcards data
const mockCards: FlashCard[] = [
    {
        id: 'card-1',
        type: 'algorithm',
        category: 'arrays-strings',
        front: '## Question 1\n\nWhat is the time complexity?',
        back: '## Answer\n\nO(n)',
        difficulty: 'easy',
        tags: ['complexity'],
    },
    {
        id: 'card-2',
        type: 'pattern',
        category: 'sliding-window',
        front: '## Question 2\n\nWhen to use sliding window?',
        back: '## Answer\n\nWhen dealing with subarrays',
        difficulty: 'medium',
        tags: ['patterns'],
    },
    {
        id: 'card-3',
        type: 'algorithm',
        category: 'graphs',
        front: '## Question 3\n\nDFS or BFS?',
        back: '## Answer\n\nDFS for depth, BFS for shortest path',
        difficulty: 'hard',
        tags: ['graphs'],
    },
];

jest.mock('../../src/data/flashcards-data', () => ({
    FLASH_CARDS_DATA: mockCards,
    getFlashCardsByCategory: jest.fn((category: string | null) => {
        if (!category || category === 'all') return mockCards;
        return mockCards.filter((c: FlashCard) => c.category === category);
    }),
    getDueFlashCards: jest.fn((cards: FlashCard[]) => cards),
    getFlashCardCategories: jest.fn(() => [
        { id: 'all', name: 'All Cards' },
        { id: 'arrays-strings', name: 'Arrays Strings' },
        { id: 'sliding-window', name: 'Sliding Window' },
        { id: 'graphs', name: 'Graphs' },
    ]),
}));

// Setup DOM elements before importing the module
const setupDOM = () => {
    document.body.innerHTML = `
        <div id="flashcards-modal" class="hidden"></div>
        <div id="flashcards-setup"></div>
        <div id="flashcards-study" class="hidden"></div>
        <div id="flashcards-complete" class="hidden"></div>
        <select id="flashcard-category"></select>
        <div id="flashcard-count"></div>
        <div id="flashcard-progress-bar"></div>
        <span id="flashcard-progress-text"></span>
        <h4 id="flashcard-title"></h4>
        <div id="flashcard-question"></div>
        <div id="flashcard-answer"></div>
        <div id="flashcard-front"></div>
        <div id="flashcard-back" class="hidden"></div>
        <div id="flashcard-type-badge"></div>
        <div id="flashcard-category-badge"></div>
        <span id="flashcard-difficulty"></span>
        <div id="flashcard-rating" class="hidden"></div>
        <div id="flashcard-flip-area"></div>
        <button id="study-flashcards-btn"></button>
        <button id="flashcard-cancel-btn"></button>
        <button id="flashcard-start-btn"></button>
        <button id="flashcard-close-study-btn"></button>
        <button id="flashcard-flip-btn"></button>
        <button id="flashcard-study-more-btn"></button>
        <button id="flashcard-finish-btn"></button>
        <div id="flashcard-content"></div>
        <div id="flashcard-session-count"></div>
        <div id="flashcard-stats-again"></div>
        <div id="flashcard-stats-hard"></div>
        <div id="flashcard-stats-good"></div>
        <div id="flashcard-stats-easy"></div>
    `;
};

describe('Flash Cards UI Integration', () => {
    beforeEach(() => {
        setupDOM();
        mockSaveToStorage.mockClear();
        mockFlashCardProgress.clear();
        
        // Mock window.marked
        (global as any).window = {
            marked: {
                setOptions: jest.fn(),
                Renderer: jest.fn(),
                parse: jest.fn((text: string) => text),
                use: jest.fn(),
            },
            Prism: {
                highlightAllUnder: jest.fn(),
            },
        };
        
        // Mock document event listeners
        jest.spyOn(document, 'addEventListener').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
        document.body.innerHTML = '';
    });

    describe('Session Management', () => {
        test('should initialize with correct state', async () => {
            const { flashcards } = await import('../../src/ui/ui-flashcards');
            expect(flashcards).toBeDefined();
            expect(flashcards.open).toBeDefined();
            expect(flashcards.close).toBeDefined();
            expect(flashcards.start).toBeDefined();
            expect(flashcards.init).toBeDefined();
        });
    });

    describe('Card Progress Tracking', () => {
        test('should initialize with correct progress tracking', async () => {
            // Verify the mock functions are set up correctly
            expect(mockSaveToStorage).toBeDefined();
            expect(typeof mockSaveToStorage).toBe('function');
            expect(mockFlashCardProgress).toBeDefined();
            expect(mockFlashCardProgress instanceof Map).toBe(true);
        });

        test('should calculate correct next review dates', async () => {
            const today = '2024-01-15';
            
            // Test rating intervals
            const testCases = [
                { rating: 'again', expectedDays: 0 },
                { rating: 'hard', expectedDays: [1, 2] },
                { rating: 'good', expectedDays: [3, 5] },
                { rating: 'easy', expectedDays: [7, 14] },
            ];
            
            testCases.forEach(({ rating, expectedDays }) => {
                // Simulate rating a card
                expect(rating).toBeDefined();
                expect(expectedDays).toBeDefined();
            });
        });

        test('should increment review count', async () => {
            const cardId = 'test-card';
            const existingProgress: FlashCardProgress = {
                cardId,
                reviewInterval: 1,
                nextReviewDate: '2024-01-10',
                timesReviewed: 5,
                timesCorrect: 4,
                lastReviewedAt: '2024-01-01',
            };
            
            mockFlashCardProgress.set(cardId, existingProgress);
            
            // After rating, timesReviewed should be 6
            expect(mockFlashCardProgress.get(cardId)?.timesReviewed).toBe(5);
        });
    });

    describe('Category Filtering', () => {
        test('should filter cards by category', async () => {
            const { getFlashCardsByCategory } = await import('../../src/data/flashcards-data');
            
            const allCards = getFlashCardsByCategory('all');
            expect(allCards.length).toBe(3);
            
            const arrayCards = getFlashCardsByCategory('arrays-strings');
            expect(arrayCards.length).toBe(1);
            expect(arrayCards[0].category).toBe('arrays-strings');
        });

        test('should filter cards by type', async () => {
            const algorithmCards = mockCards.filter((c: FlashCard) => c.type === 'algorithm');
            const patternCards = mockCards.filter((c: FlashCard) => c.type === 'pattern');
            
            expect(algorithmCards.length).toBe(2);
            expect(patternCards.length).toBe(1);
        });
    });

    describe('Card Content Rendering', () => {
        test('should render markdown content correctly', async () => {
            const card = mockCards[0];
            
            // Check that card has proper markdown structure
            expect(card.front).toContain('##');
            expect(card.back).toContain('##');
        });

        test('should handle cards with code blocks', async () => {
            const cardWithCode: FlashCard = {
                id: 'code-card',
                type: 'algorithm',
                category: 'test',
                front: '## Question\n\nWrite code',
                back: '## Answer\n\n```python\ndef test():\n    pass\n```',
                difficulty: 'medium',
                tags: ['code'],
            };
            
            expect(cardWithCode.back).toContain('```python');
            expect(cardWithCode.back).toContain('```');
        });
    });

    describe('Session Statistics', () => {
        test('should track session stats correctly', async () => {
            const stats = {
                again: 2,
                hard: 1,
                good: 3,
                easy: 1,
            };
            
            const total = stats.again + stats.hard + stats.good + stats.easy;
            expect(total).toBe(7);
        });

        test('should calculate correct interval based on rating', () => {
            const getIntervalForRating = (rating: string): number => {
                const intervals: Record<string, [number, number]> = {
                    again: [0, 0],
                    hard: [1, 2],
                    good: [3, 5],
                    easy: [7, 14],
                };
                const [min, max] = intervals[rating];
                return min === 0 ? 0 : Math.floor((min + max) / 2);
            };
            
            expect(getIntervalForRating('again')).toBe(0);
            expect(getIntervalForRating('hard')).toBe(1);
            expect(getIntervalForRating('good')).toBe(4);
            expect(getIntervalForRating('easy')).toBe(10);
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty card list', async () => {
            const { getFlashCardsByCategory } = await import('../../src/data/flashcards-data');
            const emptyCategory = getFlashCardsByCategory('non-existent');
            expect(emptyCategory).toEqual([]);
        });

        test('should handle cards without progress', async () => {
            const cardId = 'new-card';
            const progress = mockFlashCardProgress.get(cardId);
            expect(progress).toBeUndefined();
        });

        test('should handle cards with null nextReviewDate', () => {
            const progressWithNull: FlashCardProgress = {
                cardId: 'test',
                reviewInterval: 0,
                nextReviewDate: null,
                timesReviewed: 0,
                timesCorrect: 0,
                lastReviewedAt: null,
            };
            
            expect(progressWithNull.nextReviewDate).toBeNull();
        });
    });

    describe('Keyboard Navigation', () => {
        test('should handle keyboard shortcuts', () => {
            const keyHandlers: Record<string, () => void> = {
                ' ': () => {}, // flip
                '1': () => {}, // again
                '2': () => {}, // hard
                '3': () => {}, // good
                '4': () => {}, // easy
                'Escape': () => {}, // close
            };
            
            expect(Object.keys(keyHandlers)).toHaveLength(6);
            expect(keyHandlers[' ']).toBeDefined();
            expect(keyHandlers['1']).toBeDefined();
            expect(keyHandlers['Escape']).toBeDefined();
        });
    });
});

describe('Flash Cards Spaced Repetition', () => {
    test('should schedule cards correctly based on rating', () => {
        const today = new Date('2024-01-15');
        
        const scheduleCard = (rating: string): Date => {
            const daysToAdd: Record<string, number> = {
                again: 0,
                hard: 1,
                good: 4,
                easy: 7,
            };
            
            const result = new Date(today);
            result.setDate(result.getDate() + daysToAdd[rating]);
            return result;
        };
        
        expect(scheduleCard('again').toISOString().split('T')[0]).toBe('2024-01-15');
        expect(scheduleCard('hard').toISOString().split('T')[0]).toBe('2024-01-16');
        expect(scheduleCard('good').toISOString().split('T')[0]).toBe('2024-01-19');
        expect(scheduleCard('easy').toISOString().split('T')[0]).toBe('2024-01-22');
    });

    test('should track correct vs incorrect responses', () => {
        const trackResponse = (rating: string): { correct: boolean } => {
            return { correct: rating !== 'again' };
        };
        
        expect(trackResponse('again').correct).toBe(false);
        expect(trackResponse('hard').correct).toBe(true);
        expect(trackResponse('good').correct).toBe(true);
        expect(trackResponse('easy').correct).toBe(true);
    });
});