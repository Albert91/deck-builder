import { test, expect } from '@playwright/test';
import { DeckFormPage } from '../page-objects/DeckFormPage';
import { CardPreviewComponent } from '../page-objects/components/CardPreviewComponent';
import { LoadingOverlayComponent } from '../page-objects/components/LoadingOverlayComponent';

test.describe('Deck Creation Flow', () => {
  test('should create a new deck successfully', async ({ page }) => {
    // Initialize page objects
    const deckFormPage = new DeckFormPage(page);
    const cardPreview = new CardPreviewComponent(page);
    const loadingOverlay = new LoadingOverlayComponent(page);

    // Navigate to create new deck page
    await deckFormPage.gotoCreate();

    // Verify we're in create mode
    await deckFormPage.expectCreateMode();

    // Fill deck name and create
    const deckName = `Test Deck ${Date.now()}`;
    await deckFormPage.fillDeckName(deckName);

    // Verify card preview is showing default images
    await cardPreview.expectFrontVisible();
    await cardPreview.expectFrontImage('default-card-front.jpeg');

    // Flip card to see back
    await cardPreview.flipCard();
    await cardPreview.expectBackVisible();
    await cardPreview.expectBackImage('default-card-back.jpeg');

    // Create the deck
    await deckFormPage.createDeckButton.click();

    // Wait for loading and redirect
    await loadingOverlay.waitForVisible();
    await loadingOverlay.expectMessage('Creating deck...');

    // Verify we're redirected to edit page (URL should contain the new deck ID)
    await page.waitForURL(/\/decks\/.*\/edit/);

    // Verify we're now in edit mode
    await deckFormPage.expectEditMode();

    // Verify the deck name was preserved
    await expect(deckFormPage.deckNameInput).toHaveValue(deckName);
  });

  // test('should validate required fields', async ({ page }) => {
  //   // Initialize page objects
  //   const deckFormPage = new DeckFormPage(page);

  //   // Navigate to create new deck page
  //   await deckFormPage.gotoCreate();

  //   // Try to create without filling required fields
  //   await deckFormPage.createDeckButton.click();

  //   // Should show validation error
  //   await deckFormPage.expectValidationError();

  //   // Create button should be disabled
  //   await expect(deckFormPage.createDeckButton).toBeDisabled();
  // });
});
