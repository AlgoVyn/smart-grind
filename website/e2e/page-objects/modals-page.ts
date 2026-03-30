/**
 * Modals Page Object
 * 
 * Represents all modal dialogs in the application.
 */

import { Locator, expect } from '@playwright/test';
import { BasePage } from './base-page';
import { SHORT_TIMEOUT, DEFAULT_TIMEOUT } from '../utils/test-helpers';

export class ModalsPage extends BasePage {
  // Setup modal
  readonly setupModal: Locator;
  readonly googleLoginButton: Locator;
  readonly setupError: Locator;
  
  // Sign in modal
  readonly signinModal: Locator;
  readonly modalGoogleLoginButton: Locator;
  readonly signinError: Locator;
  
  // Alert modal
  readonly alertModal: Locator;
  readonly alertTitle: Locator;
  readonly alertMessage: Locator;
  readonly alertOkButton: Locator;
  
  // Confirm modal
  readonly confirmModal: Locator;
  readonly confirmTitle: Locator;
  readonly confirmMessage: Locator;
  readonly confirmOkButton: Locator;
  readonly confirmCancelButton: Locator;
  
  // Add problem modal
  readonly addProblemModal: Locator;
  readonly problemNameInput: Locator;
  readonly problemUrlInput: Locator;
  readonly categorySelect: Locator;
  readonly patternSelect: Locator;
  readonly newCategoryInput: Locator;
  readonly newPatternInput: Locator;
  readonly saveProblemButton: Locator;
  readonly cancelAddButton: Locator;
  
  // Solution modal
  readonly solutionModal: Locator;
  readonly solutionTitle: Locator;
  readonly solutionContent: Locator;
  readonly solutionCloseButton: Locator;
  readonly tocToggleButton: Locator;
  readonly tocSidebar: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    
    // Setup modal
    this.setupModal = page.locator('#setup-modal');
    this.googleLoginButton = page.locator('#google-login-button');
    this.setupError = page.locator('#setup-error');
    
    // Sign in modal
    this.signinModal = page.locator('#signin-modal');
    this.modalGoogleLoginButton = page.locator('#modal-google-login-button');
    this.signinError = page.locator('#signin-error');
    
    // Alert modal
    this.alertModal = page.locator('#alert-modal');
    this.alertTitle = page.locator('#alert-title');
    this.alertMessage = page.locator('#alert-message');
    this.alertOkButton = page.locator('#alert-ok-btn');
    
    // Confirm modal
    this.confirmModal = page.locator('#confirm-modal');
    this.confirmTitle = page.locator('#confirm-title');
    this.confirmMessage = page.locator('#confirm-message');
    this.confirmOkButton = page.locator('#confirm-ok-btn');
    this.confirmCancelButton = page.locator('#confirm-cancel-btn');
    
    // Add problem modal
    this.addProblemModal = page.locator('#add-problem-modal');
    this.problemNameInput = page.locator('#add-prob-name');
    this.problemUrlInput = page.locator('#add-prob-url');
    this.categorySelect = page.locator('#add-prob-category');
    this.patternSelect = page.locator('#add-prob-pattern');
    this.newCategoryInput = page.locator('#add-prob-category-new');
    this.newPatternInput = page.locator('#add-prob-pattern-new');
    this.saveProblemButton = page.locator('#save-add-btn');
    this.cancelAddButton = page.locator('#cancel-add-btn');
    
    // Solution modal
    this.solutionModal = page.locator('#solution-modal');
    this.solutionTitle = page.locator('#solution-title');
    this.solutionContent = page.locator('#solution-content');
    this.solutionCloseButton = page.locator('#solution-close-btn');
    this.tocToggleButton = page.locator('#toc-toggle-btn');
    this.tocSidebar = page.locator('#solution-toc');
  }

  // === Setup Modal ===
  
  async waitForSetupModal(): Promise<void> {
    await expect(this.setupModal).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  }

  async clickGoogleLoginInSetup(): Promise<void> {
    await this.googleLoginButton.click();
  }

  async isSetupErrorVisible(): Promise<boolean> {
    return this.setupError.isVisible();
  }

  // === Sign In Modal ===

  async waitForSigninModal(): Promise<void> {
    await expect(this.signinModal).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  }

  async clickGoogleLoginInSignin(): Promise<void> {
    await this.modalGoogleLoginButton.click();
  }

  async isSigninErrorVisible(): Promise<boolean> {
    return this.signinError.isVisible();
  }

  async getSigninErrorText(): Promise<string> {
    const text = await this.signinError.textContent();
    return text?.trim() || '';
  }

  // === Alert Modal ===

  async waitForAlertModal(): Promise<void> {
    await expect(this.alertModal).toBeVisible({ timeout: SHORT_TIMEOUT });
  }

  async getAlertTitle(): Promise<string> {
    const text = await this.alertTitle.textContent();
    return text?.trim() || '';
  }

  async getAlertMessage(): Promise<string> {
    const text = await this.alertMessage.textContent();
    return text?.trim() || '';
  }

  async clickAlertOk(): Promise<void> {
    await this.alertOkButton.click();
    await expect(this.alertModal).toBeHidden({ timeout: SHORT_TIMEOUT });
  }

  async isAlertModalVisible(): Promise<boolean> {
    return this.alertModal.isVisible();
  }

  // === Confirm Modal ===

  async waitForConfirmModal(): Promise<void> {
    await expect(this.confirmModal).toBeVisible({ timeout: SHORT_TIMEOUT });
  }

  async getConfirmTitle(): Promise<string> {
    const text = await this.confirmTitle.textContent();
    return text?.trim() || '';
  }

  async getConfirmMessage(): Promise<string> {
    const text = await this.confirmMessage.textContent();
    return text?.trim() || '';
  }

  async clickConfirmOk(): Promise<void> {
    await this.confirmOkButton.click();
    await expect(this.confirmModal).toBeHidden({ timeout: SHORT_TIMEOUT });
  }

  async clickConfirmCancel(): Promise<void> {
    await this.confirmCancelButton.click();
    await expect(this.confirmModal).toBeHidden({ timeout: SHORT_TIMEOUT });
  }

  async isConfirmModalVisible(): Promise<boolean> {
    return this.confirmModal.isVisible();
  }

  // === Add Problem Modal ===

  async waitForAddProblemModal(): Promise<void> {
    await expect(this.addProblemModal).toBeVisible({ timeout: SHORT_TIMEOUT });
  }

  async fillProblemName(name: string): Promise<void> {
    await this.problemNameInput.fill(name);
  }

  async fillProblemUrl(url: string): Promise<void> {
    await this.problemUrlInput.fill(url);
  }

  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption(category);
  }

  async selectPattern(pattern: string): Promise<void> {
    await this.patternSelect.selectOption(pattern);
  }

  async enterNewCategory(name: string): Promise<void> {
    await this.newCategoryInput.fill(name);
  }

  async enterNewPattern(name: string): Promise<void> {
    await this.newPatternInput.fill(name);
  }

  async clickSaveProblem(): Promise<void> {
    await this.saveProblemButton.click();
  }

  async clickCancelAdd(): Promise<void> {
    await this.cancelAddButton.click();
    await expect(this.addProblemModal).toBeHidden({ timeout: SHORT_TIMEOUT });
  }

  async isAddProblemModalVisible(): Promise<boolean> {
    return this.addProblemModal.isVisible();
  }

  async addNewProblem(name: string, url: string, category: string): Promise<void> {
    await this.fillProblemName(name);
    await this.fillProblemUrl(url);
    await this.selectCategory(category);
    await this.clickSaveProblem();
  }

  // === Solution Modal ===

  async waitForSolutionModal(): Promise<void> {
    await expect(this.solutionModal).toBeVisible({ timeout: SHORT_TIMEOUT });
  }

  async getSolutionTitle(): Promise<string> {
    const text = await this.solutionTitle.textContent();
    return text?.trim() || '';
  }

  async closeSolutionModal(): Promise<void> {
    await this.solutionCloseButton.click();
    await expect(this.solutionModal).toBeHidden({ timeout: SHORT_TIMEOUT });
  }

  async toggleToc(): Promise<void> {
    await this.tocToggleButton.click();
  }

  async isTocVisible(): Promise<boolean> {
    return this.tocSidebar.isVisible();
  }

  async waitForSolutionContent(): Promise<void> {
    // Wait for loading to complete
    await this.page.waitForSelector('.loading', { state: 'hidden', timeout: DEFAULT_TIMEOUT });
    await expect(this.solutionContent).toBeVisible();
  }

  // === General Modal Helpers ===

  async closeAllModals(): Promise<void> {
    // Press Escape to close any open modal
    await this.page.keyboard.press('Escape');
    
    // Wait a moment for animations
    await this.page.waitForTimeout(200);
  }

  async isAnyModalOpen(): Promise<boolean> {
    const modals = [
      this.setupModal,
      this.signinModal,
      this.alertModal,
      this.confirmModal,
      this.addProblemModal,
      this.solutionModal,
    ];
    
    for (const modal of modals) {
      if (await modal.isVisible()) {
        return true;
      }
    }
    
    return false;
  }
}
