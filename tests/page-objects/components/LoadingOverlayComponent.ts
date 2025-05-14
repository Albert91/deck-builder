import { type Page, type Locator, expect } from '@playwright/test';

export class LoadingOverlayComponent {
  readonly page: Page;
  readonly overlay: Locator;
  readonly message: Locator;
  readonly spinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overlay = page.getByTestId('loading-overlay');
    this.message = page.getByTestId('loading-message');
    this.spinner = this.overlay.locator('.animate-spin');
  }

  /**
   * Wait for loading overlay to appear
   */
  async waitForVisible() {
    await this.overlay.waitFor({ state: 'visible' });
  }

  /**
   * Wait for loading to complete (overlay to disappear)
   * @param timeout Optional timeout in milliseconds
   */
  async waitForHidden(timeout?: number) {
    await this.overlay.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if the loading overlay is currently visible
   */
  async isVisible() {
    return await this.overlay.isVisible();
  }

  /**
   * Check if the loading message contains expected text
   * @param text Text expected in the loading message
   */
  async expectMessage(text: string) {
    await expect(this.message).toContainText(text);
  }

  /**
   * Check if spinner is visible and animating
   */
  async expectSpinnerVisible() {
    await expect(this.spinner).toBeVisible();
    // Check for animation class
    await expect(this.spinner).toHaveClass(/animate-spin/);
  }
}
