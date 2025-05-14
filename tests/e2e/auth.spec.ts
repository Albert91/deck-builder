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

  test('pokazuje błąd dla nieprawidłowych danych logowania', async () => {
    // Próba logowania z nieprawidłowymi danymi
    await loginPage.login('nieprawidlowy@email.com', 'nieprawidlowehaslo');

    // Oczekuj komunikatu o błędzie
    await loginPage.expectErrorMessage('Nieprawidłowy email lub hasło');
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

  // Test dla pomyślnego logowania - wymaga mocku API
  test.skip('poprawnie loguje użytkownika', async ({ page }) => {
    // Arrange
    // Tutaj możemy użyć mocków API Playwright do symulacji udanego logowania
    await page.route('**/auth/v1/token**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          access_token: 'fake-token',
          refresh_token: 'fake-refresh-token',
          user: { id: '123', email: 'test@example.com' },
        }),
      });
    });

    // Act
    await loginPage.login('test@example.com', 'password123');

    // Assert
    // Sprawdź, czy zostaliśmy przekierowani na stronę główną
    await expect(page).toHaveURL('/');
  });
});
