# API Endpoint Implementation Plan: DELETE Deck

## 1. Przegląd punktu końcowego
Endpoint do usuwania talii (deck) wraz z kaskadowym usuwaniem powiązanych kart. Wymaga uwierzytelnienia i sprawdzenia, czy użytkownik jest właścicielem talii. Zwraca kod 204 (No Content) przy powodzeniu, 404 jeśli talia nie istnieje, lub 403 jeśli użytkownik nie ma uprawnień.

## 2. Szczegóły żądania
- Metoda HTTP: DELETE
- Struktura URL: `/decks/{deckId}`
- Parametry:
  - Wymagane: `deckId` (UUID talii do usunięcia)
  - Opcjonalne: brak
- Request Body: brak (DELETE nie wymaga ciała żądania)

## 3. Wykorzystywane typy
- Nie wymaga nowych typów DTO (żądanie DELETE nie zawiera ciała)
- Istniejące typy wykorzystywane w implementacji:
  - `Deck` (z `src/types.ts`) - bazowy typ dla encji talii
  - W przypadku obsługi błędów można użyć prostego interfejsu:
  ```typescript
  interface ErrorResponse {
    error: string;
    details?: string;
  }
  ```

## 4. Szczegóły odpowiedzi
- Sukces:
  - Status: 204 No Content
  - Body: brak
- Błędy:
  - 403 Forbidden: Użytkownik nie jest właścicielem talii
    ```json
    { "error": "Forbidden", "details": "User is not the owner of this deck" }
    ```
  - 404 Not Found: Talia nie istnieje
    ```json
    { "error": "Not Found", "details": "Deck not found" }
    ```
  - 500 Internal Server Error: Błąd serwera
    ```json
    { "error": "Server error" }
    ```

## 5. Przepływ danych
1. Weryfikacja użytkownika poprzez middleware uwierzytelniające Astro
2. Pobranie deckId z parametru URL
3. Walidacja deckId jako poprawnego UUID
4. Sprawdzenie czy talia istnieje
5. Sprawdzenie czy zalogowany użytkownik jest właścicielem talii
6. Usunięcie talii z bazy danych (kaskadowe usunięcie kart jest obsługiwane przez bazę danych)
7. Zwrócenie odpowiedzi 204 No Content

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie**: Wymagane dla każdego żądania poprzez middleware Astro
- **Autoryzacja**: Tylko właściciel talii może ją usunąć (sprawdzenie `owner_id` w bazie danych)
- **Walidacja danych**: UUID talii musi być poprawny, aby zapobiec atakom injection
- **Izolacja danych**: Użytkownik może usuwać tylko swoje talie

## 7. Obsługa błędów
- Przypadki błędów:
  1. Brak uwierzytelnienia (401 Unauthorized)
  2. Talia nie istnieje (404 Not Found)
  3. Użytkownik nie jest właścicielem talii (403 Forbidden)
  4. Błąd bazy danych podczas usuwania (500 Internal Server Error)
- Strategia obsługi:
  - Używanie try/catch dla obsługi wyjątków
  - Logowanie błędów po stronie serwera
  - Zwracanie odpowiednich kodów HTTP z informacyjnymi komunikatami
  - Nie ujawnianie szczegółów technicznych w odpowiedziach błędów

## 8. Rozważania dotyczące wydajności
- Operacja usuwania może być potencjalnie kosztowna jeśli talia zawiera dużo kart
- Kaskadowe usuwanie jest obsługiwane na poziomie bazy danych, co zapewnia atomowość
- Warto rozważyć implementację soft delete w przyszłości (zamiast trwałego usuwania)

## 9. Etapy wdrożenia

### 1. Utworzenie walidatora UUID
```typescript
// src/lib/validation/common.ts
import { z } from 'zod';

export const uuidSchema = z.string().uuid('Invalid UUID format');
```

### 2. Rozszerzenie deckService o metodę usuwania
```typescript
// src/lib/services/deckService.ts
```

### 3. Implementacja endpointu API
```typescript
// src/pages/api/decks/[deckId].ts