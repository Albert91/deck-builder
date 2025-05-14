import { type Page, type Locator, expect } from '@playwright/test';

export class AIGeneratorComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly promptInput: Locator;
  readonly generateFrontButton: Locator;
  readonly generateBackButton: Locator;
  readonly promptTips: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('ai-generator-panel');
    this.promptInput = page.getByTestId('ai-prompt-input');
    this.generateFrontButton = page.getByTestId('generate-front-image-button');
    this.generateBackButton = page.getByTestId('generate-back-image-button');
    this.promptTips = this.container.locator('.text-xs.text-gray-500.bg-gray-50');
  }

  /**
   * Enter text in the AI prompt field
   * @param prompt The prompt text to enter
   */
  async enterPrompt(prompt: string) {
    await this.promptInput.fill(prompt);
  }

  /**
   * Generate front image with the current prompt
   */
  async generateFrontImage() {
    await this.generateFrontButton.click();
  }

  /**
   * Generate back image with the current prompt
   */
  async generateBackImage() {
    await this.generateBackButton.click();
  }

  /**
   * Generate both front and back images with the same prompt
   * @param prompt The prompt text to use
   */
  async generateBothImages(prompt: string) {
    await this.enterPrompt(prompt);
    await this.generateFrontImage();

    // Wait for first generation to complete
    await this.page.waitForSelector('[data-test-id="loading-overlay"]', { state: 'hidden' });

    await this.generateBackImage();
  }

  /**
   * Check if the prompt input field shows an error
   */
  async expectPromptError() {
    const errorElement = this.page.locator('#ai-prompt-error');
    await expect(errorElement).toBeVisible();
  }

  /**
   * Check if the generator is in generating state
   */
  async expectGenerating() {
    // Should show the loading animation with "Generating..." text
    await expect(this.generateFrontButton).toContainText('Generating...');
    await expect(this.generateFrontButton).toBeDisabled();

    if (await this.generateBackButton.isVisible()) {
      await expect(this.generateBackButton).toBeDisabled();
    }
  }

  /**
   * Checks if the prompt tips are visible
   */
  async expectPromptTipsVisible() {
    await expect(this.promptTips).toBeVisible();
    await expect(this.promptTips).toContainText('Prompt Tips:');
  }
}
