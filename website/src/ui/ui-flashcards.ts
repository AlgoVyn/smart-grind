// --- FLASH CARDS UI MODULE ---
// Handles flash card study sessions and spaced repetition

import DOMPurify from 'dompurify';
import { state } from '../state';
import { FlashCard, FlashCardProgress, FlashCardSession } from '../types';
import {
    getFlashCardsByCategory,
    getDueFlashCards,
    getFlashCardCategories,
} from '../data/flashcards-data';
import { getToday, getNextReviewDate, showToast } from '../utils';

// --- STATE ---

let currentSession: FlashCardSession | null = null;
let sessionCards: FlashCard[] = [];
let sessionStats = { again: 0, hard: 0, good: 0, easy: 0 };
let isCardFlipped = false;
let keyboardHandler: ((_e: KeyboardEvent) => void) | null = null;

// Debounce timer for saving progress
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// Cache for loaded markdown content (with size limit)
const MAX_CACHE_SIZE = 50;
const markdownContentCache = new Map<string, { front: string; back: string }>();

// Load flashcard content from markdown file with offline support
const loadMarkdownContent = async (cardId: string): Promise<{ front: string; back: string }> => {
    // Check memory cache first
    const cached = markdownContentCache.get(cardId);
    if (cached) return cached;

    // Try multiple possible URLs - the bundle stores under /smartgrind/flashcards/
    const urlNoScope = `/flashcards/${cardId}.md`;
    const urlWithScope = `/smartgrind/flashcards/${cardId}.md`;
    const urls = [urlNoScope, urlWithScope];

    try {
        // Try to get from browser cache first (works offline if previously cached)
        // The service worker uses versioned cache names, so we need to find the right one
        const cacheNames = await caches.keys();
        let response: Response | undefined;

        // Try each URL in each cache
        for (const url of urls) {
            for (const cacheName of cacheNames) {
                if (cacheName.includes('problems-cache')) {
                    const cache = await caches.open(cacheName);
                    response = await cache.match(url);
                    if (response) break;
                }
            }
            if (response) break;
        }

        // If not in cache, try network and cache the result in all relevant caches
        if (!response) {
            try {
                // Try the URL without scope first (most common for direct access)
                const networkResponse = await fetch(urlNoScope);
                if (networkResponse.ok) {
                    // Cache in all problems caches for offline use
                    for (const cacheName of cacheNames) {
                        if (cacheName.includes('problems-cache')) {
                            const cache = await caches.open(cacheName);
                            cache.put(urlNoScope, networkResponse.clone()).catch(() => {});
                        }
                    }
                    response = networkResponse;
                }
            } catch (_networkError) {
                // Network failed, try one more time with caches (might have been added by other code)
                for (const url of urls) {
                    for (const cacheName of cacheNames) {
                        if (cacheName.includes('problems-cache')) {
                            const cache = await caches.open(cacheName);
                            const cachedResp = await cache.match(url);
                            if (cachedResp) {
                                response = cachedResp;
                                break;
                            }
                        }
                    }
                    if (response) break;
                }
            }
        }

        if (!response || !response.ok) {
            console.error(`Failed to load flashcard content for ${cardId}:`, response?.status);
            return { front: '', back: '' };
        }

        const markdown = await response.text();

        // Parse the markdown file
        // Front content is before <!-- front --> marker
        // Back content is between <!-- front --> and <!-- back --> markers
        const frontMarker = '<!-- front -->';
        const backMarker = '<!-- back -->';

        const frontStart = markdown.indexOf(frontMarker);
        const backStart = markdown.indexOf(backMarker);

        let front = '';
        let back = '';

        if (frontStart !== -1) {
            // Front content is before the front marker
            front = markdown.substring(0, frontStart).trim();

            if (backStart !== -1 && backStart > frontStart) {
                // Back content is between front and back markers
                back = markdown.substring(frontStart + frontMarker.length, backStart).trim();
            }
        }

        // Evict oldest entries if cache is full
        if (markdownContentCache.size >= MAX_CACHE_SIZE) {
            const firstKey = markdownContentCache.keys().next().value;
            if (firstKey) markdownContentCache.delete(firstKey);
        }

        const content = { front, back };
        markdownContentCache.set(cardId, content);
        return content;
    } catch (error) {
        console.error(`Error loading flashcard content for ${cardId}:`, error);
        return { front: '', back: '' };
    }
};

// Rating intervals mapped to [min, max] days
const RATING_INTERVALS: Record<string, [number, number]> = {
    again: [0, 0], // Same day
    hard: [1, 2], // 1-2 days
    good: [3, 5], // 3-5 days
    easy: [7, 14], // 7-14 days
};

// Configure markdown renderer with syntax highlighting
const configureMarkdownRenderer = () => {
    const marked = (
        window as unknown as {
            marked?: {
                setOptions: (_opts: { breaks: boolean; gfm: boolean; headerIds: boolean }) => void;
                Renderer: new () => {
                    code: (
                        _code: string | { lang: string; text: string },
                        _language: string
                    ) => string;
                };
            };
        }
    ).marked;
    if (!marked) return null;

    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderer = new (window as any).marked.Renderer();

    // Helper to escape HTML in code blocks
    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    renderer.code = (code: string | { lang: string; text: string }, language: string) => {
        // Handle both object and string parameters
        if (typeof code === 'object') {
            language = code.lang;
            code = code.text;
        }

        const escapedCode = escapeHtml(code);
        const langClass = language ? `language-${language}` : '';

        return `<pre class="${langClass}"><code class="${langClass}">${escapedCode}</code></pre>`;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (marked as any).use({ renderer });
    return marked;
};

// Render markdown content with syntax highlighting
const renderMarkdownContent = (markdown: string, element: HTMLElement): void => {
    const marked = configureMarkdownRenderer();
    if (!marked) {
        element.textContent = markdown;
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = (marked as any).parse(markdown);

    // Sanitize HTML before inserting
    const sanitizedHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p',
            'br',
            'hr',
            'ul',
            'ol',
            'li',
            'blockquote',
            'pre',
            'code',
            'strong',
            'em',
            'b',
            'i',
            'u',
            's',
            'del',
            'ins',
            'a',
            'img',
            'table',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
            'div',
            'span',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
        ],
        ALLOWED_ATTR: [
            'href',
            'src',
            'alt',
            'title',
            'class',
            'id',
            'target',
            'rel',
            'width',
            'height',
            'style',
        ],
    });

    element.innerHTML = sanitizedHtml;

    // Apply syntax highlighting with Prism

    const prism = (
        window as unknown as { Prism?: { highlightAllUnder: (_element: HTMLElement) => void } }
    ).Prism;
    if (prism) {
        prism.highlightAllUnder(element);
    }
};

// --- DOM ELEMENTS ---

const getElements = () => ({
    modal: document.getElementById('flashcards-modal') as HTMLElement | null,
    setupScreen: document.getElementById('flashcards-setup') as HTMLElement | null,
    studyScreen: document.getElementById('flashcards-study') as HTMLElement | null,
    completeScreen: document.getElementById('flashcards-complete') as HTMLElement | null,
    categorySelect: document.getElementById('flashcard-category') as HTMLSelectElement | null,
    countDisplay: document.getElementById('flashcard-count') as HTMLElement | null,
    progressBar: document.getElementById('flashcard-progress-bar') as HTMLElement | null,
    progressText: document.getElementById('flashcard-progress-text') as HTMLElement | null,
    cardTitle: document.getElementById('flashcard-title') as HTMLElement | null,
    cardQuestion: document.getElementById('flashcard-question') as HTMLElement | null,
    cardAnswer: document.getElementById('flashcard-answer') as HTMLElement | null,
    cardFront: document.getElementById('flashcard-front') as HTMLElement | null,
    cardBack: document.getElementById('flashcard-back') as HTMLElement | null,
    typeBadge: document.getElementById('flashcard-type-badge') as HTMLElement | null,
    categoryBadge: document.getElementById('flashcard-category-badge') as HTMLElement | null,
    difficultyBadge: document.getElementById('flashcard-difficulty') as HTMLElement | null,
    ratingSection: document.getElementById('flashcard-rating') as HTMLElement | null,
    flipArea: document.getElementById('flashcard-flip-area') as HTMLElement | null,
});

// --- SESSION MANAGEMENT ---

const calculateNextInterval = (
    _currentInterval: number,
    rating: string
): { nextReviewDate: string | null; newInterval: number } => {
    const today = getToday();
    const interval = RATING_INTERVALS[rating];

    if (!interval) {
        return { nextReviewDate: today, newInterval: 1 };
    }

    const [minDays, maxDays] = interval;

    // For "again", review today
    if (rating === 'again') {
        return { nextReviewDate: today, newInterval: 0 };
    }

    // Calculate days based on rating
    const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const nextReviewDate = getNextReviewDate(today, days);

    return { nextReviewDate, newInterval: days };
};

const updateCardProgress = (cardId: string, rating: string): void => {
    const existingProgress = state.flashCardProgress.get(cardId);
    const { nextReviewDate, newInterval } = calculateNextInterval(
        existingProgress?.reviewInterval || 0,
        rating
    );

    const progress: FlashCardProgress = {
        cardId,
        reviewInterval: newInterval,
        nextReviewDate,
        timesReviewed: (existingProgress?.timesReviewed || 0) + 1,
        timesCorrect: (existingProgress?.timesCorrect || 0) + (rating === 'again' ? 0 : 1),
        lastReviewedAt: new Date().toISOString(),
    };

    state.flashCardProgress.set(cardId, progress);

    // Debounce storage saves to avoid performance issues during rapid reviews
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        state.saveToStorageDebounced();
    }, 300);
};

const loadSessionCards = (): FlashCard[] => {
    const category = currentSession?.categoryFilter ?? null;
    const typeFilter = currentSession?.typeFilter || 'all';

    let cards = getFlashCardsByCategory(category);

    // Apply type filter
    if (typeFilter !== 'all') {
        cards = cards.filter((card) => card.type === typeFilter);
    }

    // Filter by due date if in "due" mode
    const mode = currentSession?.modeFilter || 'all';
    if (mode === 'due') {
        cards = getDueFlashCards(cards, state.flashCardProgress, getToday());
    }

    // Fisher-Yates shuffle for proper randomization
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i]!;
        shuffled[i] = shuffled[j]!;
        shuffled[j] = temp;
    }
    return shuffled;
};

const updateCardCount = (): void => {
    const els = getElements();
    if (!els.countDisplay || !currentSession) return;

    const cards = loadSessionCards();
    els.countDisplay.textContent = cards.length.toString();
};

// --- UI UPDATES ---

const showScreen = (screen: 'setup' | 'study' | 'complete'): void => {
    const els = getElements();
    if (!els.setupScreen || !els.studyScreen || !els.completeScreen) return;

    els.setupScreen.classList.toggle('hidden', screen !== 'setup');
    els.studyScreen.classList.toggle('hidden', screen !== 'study');
    els.completeScreen.classList.toggle('hidden', screen !== 'complete');
};

const renderCard = async (): Promise<void> => {
    const els = getElements();
    if (!currentSession || !els.cardFront || !els.cardBack) return;

    const card = sessionCards[currentSession.currentIndex];
    if (!card) return;

    // Reset card state
    isCardFlipped = false;
    els.cardFront.classList.remove('hidden');
    els.cardBack.classList.add('hidden');
    els.ratingSection?.classList.add('hidden');
    els.flipArea?.classList.remove('hidden');

    // Get card content - load from markdown if front/back are empty
    let frontContent = card.front;
    let backContent = card.back;

    if (!frontContent || !backContent) {
        const mdContent = await loadMarkdownContent(card.id);
        if (!frontContent) frontContent = mdContent.front;
        if (!backContent) backContent = mdContent.back;
    }

    // Skip cards with no content and move to next
    if (!frontContent || !backContent) {
        console.warn(`Card "${card.id}" has no content, skipping`);
        currentSession.currentIndex++;
        if (currentSession.currentIndex >= sessionCards.length) {
            showCompleteScreen();
        } else {
            await renderCard();
        }
        return;
    }

    // Update content - render markdown with syntax highlighting
    if (els.cardTitle) {
        const typeText =
            card.type === 'algorithm' ? 'Algorithm' : card.type === 'sql' ? 'SQL' : 'Pattern';
        els.cardTitle.textContent = typeText;
    }
    if (els.cardQuestion) {
        renderMarkdownContent(frontContent, els.cardQuestion);
    }
    if (els.cardAnswer) {
        renderMarkdownContent(backContent, els.cardAnswer);
    }

    // Update badges
    if (els.typeBadge) {
        els.typeBadge.textContent = card.type;
        const typeClasses = {
            algorithm: 'bg-blue-500/20 text-blue-400',
            pattern: 'bg-purple-500/20 text-purple-400',
            sql: 'bg-green-500/20 text-green-400',
        };
        els.typeBadge.className = `px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            typeClasses[card.type] || typeClasses.pattern
        }`;
    }
    if (els.categoryBadge) {
        const categoryName =
            getFlashCardCategories().find((c) => c.id === card.category)?.name || card.category;
        els.categoryBadge.textContent = categoryName;
    }
    if (els.difficultyBadge) {
        els.difficultyBadge.textContent = card.difficulty.toUpperCase();
        const difficultyColors: Record<string, string> = {
            easy: 'text-green-400',
            medium: 'text-yellow-400',
            hard: 'text-red-400',
        };
        els.difficultyBadge.className = `text-[10px] font-bold ${difficultyColors[card.difficulty]}`;
    }

    // Update progress
    if (els.progressBar) {
        const progress = ((currentSession.currentIndex + 1) / sessionCards.length) * 100;
        els.progressBar.style.width = `${progress}%`;
    }
    if (els.progressText) {
        els.progressText.textContent = `${currentSession.currentIndex + 1}/${sessionCards.length}`;
    }
};

const flipCard = (): void => {
    const els = getElements();
    if (!els.cardFront || !els.cardBack || !els.ratingSection || !els.flipArea) return;

    isCardFlipped = !isCardFlipped;

    if (isCardFlipped) {
        els.cardFront.classList.add('hidden');
        els.cardBack.classList.remove('hidden');
        els.ratingSection.classList.remove('hidden');
        els.flipArea.classList.add('hidden');
    } else {
        els.cardFront.classList.remove('hidden');
        els.cardBack.classList.add('hidden');
        els.ratingSection.classList.add('hidden');
        els.flipArea.classList.remove('hidden');
    }
};

const rateCard = async (rating: string): Promise<void> => {
    if (!currentSession) return;

    const card = sessionCards[currentSession.currentIndex];
    if (!card) return;

    // Update progress
    updateCardProgress(card.id, rating);

    // Update stats
    sessionStats[rating as keyof typeof sessionStats]++;

    // Move to next card
    currentSession.currentIndex++;

    if (currentSession.currentIndex >= sessionCards.length) {
        showCompleteScreen();
    } else {
        await renderCard();
    }
};

const showCompleteScreen = (): void => {
    const els = getElements();
    if (!els.completeScreen) return;

    showScreen('complete');

    // Update stats
    const totalCards = sessionCards.length;
    const sessionCountEl = document.getElementById('flashcard-session-count');
    const statsAgainEl = document.getElementById('flashcard-stats-again');
    const statsHardEl = document.getElementById('flashcard-stats-hard');
    const statsGoodEl = document.getElementById('flashcard-stats-good');
    const statsEasyEl = document.getElementById('flashcard-stats-easy');

    if (sessionCountEl) sessionCountEl.textContent = totalCards.toString();
    if (statsAgainEl) statsAgainEl.textContent = sessionStats.again.toString();
    if (statsHardEl) statsHardEl.textContent = sessionStats.hard.toString();
    if (statsGoodEl) statsGoodEl.textContent = sessionStats.good.toString();
    if (statsEasyEl) statsEasyEl.textContent = sessionStats.easy.toString();
};

// --- EVENT HANDLERS ---

const setupEventListeners = (): void => {
    const els = getElements();

    // Study button in header
    document.getElementById('study-flashcards-btn')?.addEventListener('click', openFlashcardsModal);

    // Cancel button
    document
        .getElementById('flashcard-cancel-btn')
        ?.addEventListener('click', closeFlashcardsModal);

    // Start button
    document.getElementById('flashcard-start-btn')?.addEventListener('click', startStudySession);

    // Close study button - show confirmation modal instead of browser confirm
    document.getElementById('flashcard-close-study-btn')?.addEventListener('click', () => {
        const els = getElements();
        if (els.completeScreen) {
            // Save progress before closing
            state.saveToStorageDebounced();
            closeFlashcardsModal();
        }
    });

    // Flip button
    document.getElementById('flashcard-flip-btn')?.addEventListener('click', flipCard);

    // Click on card to flip
    document.getElementById('flashcard-content')?.addEventListener('click', (e) => {
        // Don't flip if clicking on a button or link
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;
        flipCard();
    });

    // Rating buttons
    document.querySelectorAll('.flashcard-rate-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const rating = (e.currentTarget as HTMLElement).dataset['rating'];
            if (rating) rateCard(rating);
        });
    });

    // Type filter buttons
    document.querySelectorAll('.flashcard-type-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const type = target.dataset['flashcardType'];

            // Update UI
            document.querySelectorAll('.flashcard-type-btn').forEach((b) => {
                b.classList.remove('bg-brand-600', 'text-white');
                b.classList.add('bg-dark-950', 'border', 'border-slate-700', 'text-theme-muted');
            });
            target.classList.remove(
                'bg-dark-950',
                'border',
                'border-slate-700',
                'text-theme-muted'
            );
            target.classList.add('bg-brand-600', 'text-white');

            // Update session
            if (currentSession) {
                currentSession.typeFilter = type as 'all' | 'algorithm' | 'pattern' | 'sql';
            }

            // Update category dropdown based on type filter
            populateCategoryDropdown(type || 'all');

            updateCardCount();
        });
    });

    // Mode filter buttons
    document.querySelectorAll('.flashcard-mode-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;

            // Update UI
            document.querySelectorAll('.flashcard-mode-btn').forEach((b) => {
                b.classList.remove('bg-brand-600', 'text-white');
                b.classList.add('bg-dark-950', 'border', 'border-slate-700', 'text-theme-muted');
            });
            target.classList.remove(
                'bg-dark-950',
                'border',
                'border-slate-700',
                'text-theme-muted'
            );
            target.classList.add('bg-brand-600', 'text-white');

            // Update session state
            if (currentSession) {
                currentSession.modeFilter =
                    (target.dataset['flashcardMode'] as 'all' | 'due') || 'all';
            }
            updateCardCount();
        });
    });

    // Category select
    els.categorySelect?.addEventListener('change', () => {
        if (currentSession) {
            currentSession.categoryFilter = els.categorySelect?.value || null;
        }
        updateCardCount();
    });

    // Complete screen buttons
    document.getElementById('flashcard-study-more-btn')?.addEventListener('click', () => {
        showScreen('setup');
        updateCardCount();
    });

    document
        .getElementById('flashcard-finish-btn')
        ?.addEventListener('click', closeFlashcardsModal);

    // Keyboard shortcuts
    keyboardHandler = handleKeyboard;
    document.addEventListener('keydown', keyboardHandler);
};

const handleKeyboard = (e: KeyboardEvent): void => {
    const modal = document.getElementById('flashcards-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    const studyScreen = document.getElementById('flashcards-study');
    if (!studyScreen || studyScreen.classList.contains('hidden')) return;

    switch (e.key) {
        case ' ':
        case 'Enter':
            e.preventDefault();
            flipCard();
            break;
        case '1':
            if (isCardFlipped) rateCard('again');
            break;
        case '2':
            if (isCardFlipped) rateCard('hard');
            break;
        case '3':
            if (isCardFlipped) rateCard('good');
            break;
        case '4':
            if (isCardFlipped) rateCard('easy');
            break;
        case 'Escape':
            closeFlashcardsModal();
            break;
    }
};

// --- PUBLIC API ---

// Helper function to populate category dropdown based on type filter
const populateCategoryDropdown = (typeFilter: string): void => {
    const els = getElements();
    if (!els.categorySelect) {
        console.warn('Category select element not found');
        return;
    }

    // Save current selection
    const currentSelection = els.categorySelect.value;

    // Clear and add "All Categories" option
    els.categorySelect.innerHTML = '<option value="all">All Categories</option>';

    // Get all categories and filter by type if needed
    const allCategories = getFlashCardCategories();
    const filteredCategories =
        typeFilter === 'all'
            ? allCategories
            : allCategories.filter((cat) => cat.type === typeFilter);

    // Group categories by type for better organization (exclude 'all')
    const categoriesByType = new Map<string, { id: string; name: string }[]>();

    filteredCategories.forEach((cat) => {
        if (cat.id === 'all') return; // Skip 'all' category since it's already added
        const typeLabel = cat.type.charAt(0).toUpperCase() + cat.type.slice(1);
        if (!categoriesByType.has(typeLabel)) {
            categoriesByType.set(typeLabel, []);
        }
        categoriesByType.get(typeLabel)!.push({ id: cat.id, name: cat.name });
    });

    // Add categories grouped by type
    const typeOrder = ['Algorithm', 'Pattern', 'Sql'];
    typeOrder.forEach((typeLabel) => {
        const cats = categoriesByType.get(typeLabel);
        if (cats && cats.length > 0) {
            // Add optgroup for this type
            const optgroup = document.createElement('optgroup');
            optgroup.label = typeLabel === 'Sql' ? 'SQL' : typeLabel + 's';

            cats.forEach((cat) => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                optgroup.appendChild(option);
            });

            els.categorySelect!.appendChild(optgroup);
        }
    });

    // Restore selection if it still exists in the new options
    const optionExists = Array.from(els.categorySelect.options).some(
        (opt) => opt.value === currentSelection
    );
    if (optionExists) {
        els.categorySelect.value = currentSelection;
    }
};

export const openFlashcardsModal = (): void => {
    const els = getElements();
    if (!els.modal) return;

    // Reset session stats
    sessionStats = { again: 0, hard: 0, good: 0, easy: 0 };

    // Populate category dropdown with all categories
    populateCategoryDropdown('all');

    // Initialize session
    currentSession = {
        cardIds: [],
        currentIndex: 0,
        categoryFilter: null,
        typeFilter: 'all',
        modeFilter: 'due', // Default to "due for review" mode
        startedAt: new Date().toISOString(),
    };

    // Show setup screen
    showScreen('setup');
    updateCardCount();

    // Show modal
    els.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

export const closeFlashcardsModal = (): void => {
    const els = getElements();
    if (!els.modal) return;

    els.modal.classList.add('hidden');
    document.body.style.overflow = '';

    // Remove keyboard listener to prevent memory leaks
    if (keyboardHandler) {
        document.removeEventListener('keydown', keyboardHandler);
        keyboardHandler = null;
    }

    // Clear any pending save timeouts
    if (saveTimeout) {
        clearTimeout(saveTimeout);
        saveTimeout = null;
    }

    currentSession = null;
    sessionCards = [];
    isCardFlipped = false;
};

export const startStudySession = async (): Promise<void> => {
    if (!currentSession) return;

    sessionCards = loadSessionCards();

    if (sessionCards.length === 0) {
        showToast('No cards available for the selected criteria');
        return;
    }

    currentSession.cardIds = sessionCards.map((c) => c.id);
    currentSession.currentIndex = 0;

    showScreen('study');
    await renderCard();

    showToast(`Starting study session with ${sessionCards.length} cards`);
};

// --- INITIALIZATION ---

export const initFlashcards = (): void => {
    setupEventListeners();
};

// --- EXPORTS ---

export const flashcards = {
    open: openFlashcardsModal,
    close: closeFlashcardsModal,
    start: startStudySession,
    init: initFlashcards,
};
