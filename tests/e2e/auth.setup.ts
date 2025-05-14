import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

const authFile = '../../playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Initialize the LoginPage page object
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();

  // Login with test credentials
  await loginPage.login(process.env.E2E_USERNAME!, process.env.E2E_PASSWORD!);

  // Wait for navigation after successful login
  await page.waitForURL('/');

  // Verify authentication was successful by checking for an element
  // that should be visible only to logged-in users
  await expect(page.getByRole('heading', { name: 'My Card Decks', exact: false })).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
