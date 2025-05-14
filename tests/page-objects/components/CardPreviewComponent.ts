import { type Page, type Locator, expect } from '@playwright/test';

export class CardPreviewComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly cardPreviewImage: Locator;
  readonly frontPreview: Locator;
  readonly backPreview: Locator;
  readonly flipButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('card-preview-container');
    this.cardPreviewImage = page.getByTestId('card-preview-image');
    this.frontPreview = page.getByTestId('card-front-preview');
    this.backPreview = page.getByTestId('card-back-preview');
    this.flipButton = page.getByTestId('flip-card-button');
  }

  /**
   * Flip the card to show the other side
   */
  async flipCard() {
    await this.flipButton.click();
  }

  /**
   * Check if front side is currently visible
   */
  async expectFrontVisible() {
    // Use toHaveClass with a partial match for 'opacity-100'
    await expect(this.frontPreview).toHaveClass(/opacity-100/);
    await expect(this.backPreview).toHaveClass(/opacity-0/);
  }

  /**
   * Check if back side is currently visible
   */
  async expectBackVisible() {
    await expect(this.backPreview).toHaveClass(/opacity-100/);
    await expect(this.frontPreview).toHaveClass(/opacity-0/);
  }

  /**
   * Take a screenshot of the current card preview
   * @param name Filename for the screenshot
   */
  async takeScreenshot(name: string) {
    await this.cardPreviewImage.screenshot({ path: `./screenshots/card-${name}.png` });
  }

  /**
   * Verify the preview has expected front image
   * @param expectedSrc Expected image source (can be partial)
   */
  async expectFrontImage(expectedSrc: string) {
    const imgElement = this.frontPreview.locator('img');
    await expect(imgElement).toHaveAttribute('src', new RegExp(expectedSrc));
  }

  /**
   * Verify the preview has expected back image
   * @param expectedSrc Expected image source (can be partial)
   */
  async expectBackImage(expectedSrc: string) {
    const imgElement = this.backPreview.locator('img');
    await expect(imgElement).toHaveAttribute('src', new RegExp(expectedSrc));
  }
}
