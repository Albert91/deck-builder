import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';

test.describe('Uwierzytelnianie', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('wyświetla stronę logowania', async () => {
    // Sprawdź, czy formularz logowania jest widoczny
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('nawiguje do strony rejestracji', async ({ page }) => {
    // Kliknij link do rejestracji
    await loginPage.navigateToRegister();

    // Sprawdź, czy jesteśmy na stronie rejestracji
    await expect(page).toHaveURL(/\/register/);
  });

  test('nawiguje do strony resetowania hasła', async ({ page }) => {
    // Kliknij link do resetowania hasła
    await loginPage.navigateToForgotPassword();

    // Sprawdź, czy jesteśmy na stronie resetowania hasła
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});
