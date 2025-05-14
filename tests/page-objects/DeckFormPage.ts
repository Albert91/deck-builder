import { type Page, type Locator, expect } from '@playwright/test';

export class DeckFormPage {
  readonly page: Page;
  readonly deckNameInput: Locator;
  readonly createDeckButton: Locator;
  readonly saveChangesButton: Locator;
  readonly cancelButton: Locator;
  readonly cardPreview: Locator;
  readonly aiGeneratorPanel: Locator;
  readonly loadingOverlay: Locator;
  readonly loadingMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form components
    this.deckNameInput = page.getByTestId('deck-name-input');
    this.createDeckButton = page.getByTestId('create-deck-button');
    this.saveChangesButton = page.getByTestId('save-changes-button');
    this.cancelButton = page.getByTestId('cancel-button');

    // Preview and loading elements
    this.cardPreview = page.getByTestId('card-preview-container');
    this.aiGeneratorPanel = page.getByTestId('ai-generator-panel');
    this.loadingOverlay = page.getByTestId('loading-overlay');
    this.loadingMessage = page.getByTestId('loading-message');
  }

  /**
   * Navigate to create deck page
   */
  async gotoCreate() {
    await this.page.goto('/decks/new');
  }

  /**
   * Navigate to edit deck page
   * @param deckId The ID of the deck to edit
   */
  async gotoEdit(deckId: string) {
    await this.page.goto(`/decks/${deckId}/edit`);
  }

  /**
   * Fill deck name input field
   * @param name The name to enter for the deck
   */
  async fillDeckName(name: string) {
    await this.deckNameInput.fill(name);
  }

  /**
   * Create a new deck with the specified name
   * @param name The name to give the new deck
   */
  async createDeck(name: string) {
    await this.fillDeckName(name);
    await this.createDeckButton.click();
  }

  /**
   * Update an existing deck
   * @param name Optional new name for the deck
   */
  async updateDeck(name?: string) {
    if (name) {
      await this.fillDeckName(name);
    }
    await this.saveChangesButton.click();
  }

  /**
   * Cancel the current operation and return to previous page
   */
  async cancel() {
    await this.cancelButton.click();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoading() {
    if (await this.loadingOverlay.isVisible()) {
      await this.loadingOverlay.waitFor({ state: 'hidden' });
    }
  }

  /**
   * Verify the form is in create mode
   */
  async expectCreateMode() {
    await expect(this.createDeckButton).toBeVisible();
    await expect(this.saveChangesButton).not.toBeVisible();
  }

  /**
   * Verify the form is in edit mode
   */
  async expectEditMode() {
    await expect(this.saveChangesButton).toBeVisible();
    await expect(this.createDeckButton).not.toBeVisible();
  }

  /**
   * Check if validation error is shown
   */
  async expectValidationError() {
    // Look for error text related to deck name
    const errorText = this.page.getByText('Deck name is required');
    await expect(errorText).toBeVisible();
  }
}
