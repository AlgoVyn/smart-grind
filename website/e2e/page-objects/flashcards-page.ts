/**
 * Flashcards Page Object
 * 
 * Represents the flashcards modal and study session UI.
 */

import { Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { SHORT_TIMEOUT, DEFAULT_TIMEOUT } from '../utils/test-helpers';

export class FlashcardsPage extends BasePage {
  // Modal containers
  readonly modal: Locator;
  readonly setupScreen: Locator;
  readonly studyScreen: Locator;
  readonly completeScreen: Locator;
  
  // Setup screen elements
  readonly typeButtons: Locator;
  readonly categorySelect: Locator;
  readonly modeButtons: Locator;
  readonly startButton: Locator;
  readonly cancelButton: Locator;
  readonly cardCount: Locator;
  
  // Study screen elements
  readonly cardTitle: Locator;
  readonly cardQuestion: Locator;
  readonly cardAnswer: Locator;
  readonly cardFront: Locator;
  readonly cardBack: Locator;
  readonly flipButton: Locator;
  readonly ratingButtons: Locator;
  readonly progressBar: Locator;
  readonly progressText: Locator;
  readonly closeStudyButton: Locator;
  readonly typeBadge: Locator;
  readonly categoryBadge: Locator;
  readonly difficultyBadge: Locator;
  
  // Complete screen elements
  readonly sessionCount: Locator;
  readonly statsAgain: Locator;
  readonly statsHard: Locator;
  readonly statsGood: Locator;
  readonly statsEasy: Locator;
  readonly studyMoreButton: Locator;
  readonly finishButton: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    
    // Modal
    this.modal = page.locator('#flashcards-modal');
    this.setupScreen = page.locator('#flashcards-setup');
    this.studyScreen = page.locator('#flashcards-study');
    this.completeScreen = page.locator('#flashcards-complete');
    
    // Setup
    this.typeButtons = page.locator('.flashcard-type-btn');
    this.categorySelect = page.locator('#flashcard-category');
    this.modeButtons = page.locator('.flashcard-mode-btn');
    this.startButton = page.locator('#flashcard-start-btn');
    this.cancelButton = page.locator('#flashcard-cancel-btn');
    this.cardCount = page.locator('#flashcard-count');
    
    // Study
    this.cardTitle = page.locator('#flashcard-title');
    this.cardQuestion = page.locator('#flashcard-question');
    this.cardAnswer = page.locator('#flashcard-answer');
    this.cardFront = page.locator('#flashcard-front');
    this.cardBack = page.locator('#flashcard-back');
    this.flipButton = page.locator('#flashcard-flip-btn');
    this.ratingButtons = page.locator('.flashcard-rate-btn');
    this.progressBar = page.locator('#flashcard-progress-bar');
    this.progressText = page.locator('#flashcard-progress-text');
    this.closeStudyButton = page.locator('#flashcard-close-study-btn');
    this.typeBadge = page.locator('#flashcard-type-badge');
    this.categoryBadge = page.locator('#flashcard-category-badge');
    this.difficultyBadge = page.locator('#flashcard-difficulty');
    
    // Complete
    this.sessionCount = page.locator('#flashcard-session-count');
    this.statsAgain = page.locator('#flashcard-stats-again');
    this.statsHard = page.locator('#flashcard-stats-hard');
    this.statsGood = page.locator('#flashcard-stats-good');
    this.statsEasy = page.locator('#flashcard-stats-easy');
    this.studyMoreButton = page.locator('#flashcard-study-more-btn');
    this.finishButton = page.locator('#flashcard-finish-btn');
  }

  /**
   * Wait for modal to be visible
   */
  async waitForModal(): Promise<void> {
    await expect(this.modal).toBeVisible({ timeout: SHORT_TIMEOUT });
  }

  /**
   * Select card type
   */
  async selectType(type: 'all' | 'algorithm' | 'pattern' | 'sql'): Promise<void> {
    const button = this.page.locator(`.flashcard-type-btn[data-flashcard-type="${type}"]`);
    await button.click();
  }

  /**
   * Select category
   */
  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption(category);
  }

  /**
   * Select study mode
   */
  async selectMode(mode: 'due' | 'all'): Promise<void> {
    const button = this.page.locator(`.flashcard-mode-btn[data-flashcard-mode="${mode}"]`);
    await button.click();
  }

  /**
   * Get card count
   */
  async getCardCount(): Promise<number> {
    const text = await this.cardCount.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * Start study session
   */
  async startStudy(): Promise<void> {
    await this.startButton.click();
    await expect(this.studyScreen).toBeVisible({ timeout: SHORT_TIMEOUT });
    // Wait for card to be fully rendered (front visible, back hidden)
    await expect(this.cardFront).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    // Wait for card content to load
    await this.page.waitForTimeout(500);
  }

  /**
   * Cancel and close modal
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await expect(this.modal).toBeHidden({ timeout: SHORT_TIMEOUT });
  }

  /**
   * Flip card to show answer
   */
  async flipCard(): Promise<void> {
    // Wait for flip button to be visible
    await expect(this.flipButton).toBeVisible({ timeout: SHORT_TIMEOUT });
    // Use JavaScript click to avoid actionability issues
    await this.flipButton.evaluate((el: HTMLElement) => el.click());
    // Wait a moment for the flip animation
    await this.page.waitForTimeout(300);
    
    // Wait for card back to be visible by checking the hidden class is removed
    await expect.poll(
      async () => {
        const classes = await this.cardBack.getAttribute('class');
        return !classes?.includes('hidden');
      },
      {
        message: 'Card back did not become visible after flip',
        timeout: DEFAULT_TIMEOUT,
        intervals: [100, 200, 500],
      }
    ).toBe(true);
    
    // Also wait for rating buttons container to be visible (not hidden)
    const ratingContainer = this.page.locator('#flashcard-rating');
    await expect.poll(
      async () => {
        const classes = await ratingContainer.getAttribute('class');
        return !classes?.includes('hidden');
      },
      {
        message: 'Rating buttons container did not become visible after flip',
        timeout: DEFAULT_TIMEOUT,
        intervals: [100, 200, 500],
      }
    ).toBe(true);
  }
  /**
  /**
   * Rate card
   */
  async rateCard(rating: 'again' | 'hard' | 'good' | 'easy'): Promise<void> {
    const button = this.page.locator(`.flashcard-rate-btn[data-rating="${rating}"]`);
    // Wait for rating button to be visible before clicking
    await expect(button).toBeVisible({ timeout: DEFAULT_TIMEOUT });
    await button.evaluate((el: HTMLElement) => el.click());
    // Wait for the UI to update (progress changes, next card rendered)
    await this.page.waitForTimeout(500);
  }

  /**
   * Get current card title
   */
  async getCardTitle(): Promise<string> {
    const text = await this.cardTitle.textContent();
    return text?.trim() || '';
  }

  /**
   * Get current card question
   */
  async getCardQuestion(): Promise<string> {
    const text = await this.cardQuestion.textContent();
    return text?.trim() || '';
  }

  /**
   * Get current card answer
   */
  async getCardAnswer(): Promise<string> {
    // Make sure back is visible first
    await this.flipCard();
    const text = await this.cardAnswer.textContent();
    return text?.trim() || '';
  }

  /**
   * Get progress
   */
  async getProgress(): Promise<{ current: number; total: number }> {
    const text = await this.progressText.textContent() || '0/0';
    const [current, total] = text.split('/').map(n => parseInt(n.trim(), 10));
    return { current: current || 0, total: total || 0 };
  }

  /**
   * Get progress percentage
   */
  async getProgressPercentage(): Promise<number> {
    const style = await this.progressBar.getAttribute('style');
    const match = style?.match(/width:\s*(\d+)%/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Complete a study session
   */
  async completeSession(): Promise<void> {
    await expect(this.completeScreen).toBeVisible({ timeout: SHORT_TIMEOUT });
  }

  /**
   * Get session stats
   */
  async getSessionStats(): Promise<{ 
    count: number; 
    again: number; 
    hard: number; 
    good: number; 
    easy: number 
  }> {
    const count = parseInt(await this.sessionCount.textContent() || '0', 10);
    const again = parseInt(await this.statsAgain.textContent() || '0', 10);
    const hard = parseInt(await this.statsHard.textContent() || '0', 10);
    const good = parseInt(await this.statsGood.textContent() || '0', 10);
    const easy = parseInt(await this.statsEasy.textContent() || '0', 10);
    
    return { count, again, hard, good, easy };
  }

  /**
   * Study more cards
   */
  async studyMore(): Promise<void> {
    await this.studyMoreButton.click();
    await expect(this.setupScreen).toBeVisible({ timeout: SHORT_TIMEOUT });
  }

  /**
   * Finish and close modal
   */
  async finish(): Promise<void> {
    await this.finishButton.click();
    await expect(this.modal).toBeHidden({ timeout: SHORT_TIMEOUT });
  }

  /**
   * Close study session
   */
  async closeStudy(): Promise<void> {
    await this.closeStudyButton.click();
  }

  /**
   * Complete a full study cycle for one card
   */
  async studyOneCard(rating: 'again' | 'hard' | 'good' | 'easy'): Promise<void> {
    await this.flipCard();
    await this.rateCard(rating);
  }

  /**
   * Check if on setup screen
   */
  async isOnSetupScreen(): Promise<boolean> {
    return this.setupScreen.isVisible();
  }

  /**
   * Check if on study screen
   */
  async isOnStudyScreen(): Promise<boolean> {
    return this.studyScreen.isVisible();
  }

  /**
   * Check if on complete screen
   */
  async isOnCompleteScreen(): Promise<boolean> {
    return this.completeScreen.isVisible();
  }

  /**
   * Check if flashcards are available for study
   * Returns true if card count > 0
   */
  async hasFlashcardsAvailable(): Promise<boolean> {
    const count = await this.getCardCount();
    return count > 0;
  }

  /**
   * Skip test if no flashcards available
   * Call this at the start of tests that require flashcards
   */
  async skipIfNoFlashcards(test: import('@playwright/test').TestType<unknown, unknown>): Promise<boolean> {
    if (!await this.hasFlashcardsAvailable()) {
      test.skip(true, 'No flashcards available for testing - test data may be empty');
      return true;
    }
    return false;
  }
}
