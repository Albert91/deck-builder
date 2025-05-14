# Testowanie projektu Deck Builder

## Testy jednostkowe (Vitest)

Testy jednostkowe wykorzystują [Vitest](https://vitest.dev/) oraz [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). Są używane do testowania pojedynczych komponentów i funkcji.

### Uruchamianie testów jednostkowych

```bash
# Uruchomienie wszystkich testów jednostkowych
yarn test

# Uruchomienie testów w trybie watch
yarn test:watch

# Uruchomienie testów w interfejsie UI
yarn test:ui

# Generowanie raportu pokrycia kodu
yarn test:coverage
```

### Struktura testów jednostkowych

- Testy komponentów i funkcji powinny znajdować się w katalogach `__tests__` obok testowanych plików
- Pliki testów powinny mieć sufiks `.test.ts` lub `.test.tsx`
- Mockowanie zależności należy przeprowadzać przy użyciu `vi.mock()`
- Należy stosować podejście Arrange-Act-Assert do organizacji testów
- Testy powinny być opisowe i czytelne

### Przykład testu jednostkowego

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renderuje przycisk z tekstem', () => {
    // Arrange
    render(<Button>Kliknij mnie</Button>);
    
    // Act & Assert
    expect(screen.getByText('Kliknij mnie')).toBeInTheDocument();
  });
});
```

## Testy end-to-end (Playwright)

Testy E2E wykorzystują [Playwright](https://playwright.dev/) i są używane do testowania całych przepływów użytkownika.

### Uruchamianie testów E2E

```bash
# Uruchomienie wszystkich testów e2e
yarn test:e2e

# Uruchomienie testów w interfejsie UI
yarn test:e2e:ui

# Generowanie testów przy użyciu Playwright Codegen
npx playwright codegen http://localhost:4321
```

### Struktura testów E2E

- Testy E2E znajdują się w katalogu `tests/e2e`
- Page Objects znajdują się w katalogu `tests/page-objects`
- Testy są pogrupowane według funkcjonalności (auth, decks, cards itp.)
- Do izolacji testów używane są konteksty przeglądarek

### Page Object Pattern

W testach E2E stosujemy wzorzec Page Object, który polega na enkapsulacji selektorów i metod specyficznych dla danej strony w jednej klasie. Przykład:

```typescript
// tests/page-objects/LoginPage.ts
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    // ...
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    // ...
  }
}

// tests/e2e/auth.spec.ts
test('użytkownik może się zalogować', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');
  // ...
});
```

## Najlepsze praktyki

1. **Testy jednostkowe**:
   - Używaj mocków dla zależności zewnętrznych
   - Zachowaj testy małe i skupione na konkretnej funkcjonalności
   - Używaj snapshotów tylko w przypadkach, które mają sens

2. **Testy E2E**:
   - Testuj rzeczywiste przepływy użytkownika
   - Używaj atrybutów `data-testid` dla elementów trudnych do zlokalizowania
   - Przygotuj dane testowe przed uruchomieniem testu
   - Izoluj testy, aby mogły być uruchamiane niezależnie

3. **Ogólne zasady**:
   - Pisz testy, które są łatwe w utrzymaniu
   - Nie testuj implementacji, testuj zachowanie
   - Upewnij się, że testy są deterministyczne (nie zawierają losowych elementów)
   - Testy powinny być szybkie w uruchomieniu 