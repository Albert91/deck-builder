# API Endpoint Implementation Plan: Create Card

## 1. Przegląd punktu końcowego
Endpoint `POST /decks/{deckId}/cards` umożliwia dodanie nowej karty do istniejącej talii należącej do zalogowanego użytkownika. Endpoint implementuje ograniczenie do maksymalnie 100 kart na talię, zgodnie z wymaganiami PRD.

## 2. Szczegóły żądania
- Metoda HTTP: `POST`
- Struktura URL: `/decks/{deckId}/cards`
- Parametry URL:
  - `deckId` (UUID) - identyfikator talii, do której dodawana jest karta
- Nagłówki:
  - `Authorization: Bearer <token>` (wymagane)
- Body (JSON):
  ```json
  {
    "title": "Goblin",
    "description": "A small green creature"
  }
  ```

## 3. Wykorzystywane typy
```typescript
// src/lib/validators/cards.ts
export const createCardSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().optional()
});

export type CreateCardSchema = z.infer<typeof createCardSchema>;

// src/types.ts
export interface CreateCardCommand {
  title: string;
  description?: string;
}
```

## 4. Szczegóły odpowiedzi
- Status 201 Created
- Body (JSON):
  ```typescript
  // Zwracany obiekt typu CardDTO
  {
    id: string;
    title: string;
    description: string | null;
    image_metadata_id: string | null;
    created_at: string;
    updated_at: string;
  }
  ```
- Przykład:
  ```json
  {
    "id": "uuid-1",
    "title": "Goblin",
    "description": "A small green creature",
    "image_metadata_id": null,
    "created_at": "2024-07-01T12:00:00Z",
    "updated_at": "2024-07-01T12:00:00Z"
  }
  ```

## 5. Przepływ danych
1. Endpoint otrzymuje żądanie POST z parametrem `deckId` w ścieżce URL i danymi karty w treści żądania
2. Następuje uwierzytelnienie użytkownika poprzez token JWT
3. Weryfikacja poprawności formatu `deckId` za pomocą `deckIdSchema`
4. Parsowanie i walidacja JSON body za pomocą `createCardSchema` 
5. Serwis sprawdza, czy talia o podanym ID istnieje
6. Serwis weryfikuje, czy zalogowany użytkownik jest właścicielem talii
7. Serwis sprawdza, czy nie został przekroczony limit kart (100) dla danej talii
8. Jeśli wszystkie warunki są spełnione, nowa karta jest dodawana do bazy danych
9. Dane utworzonej karty są przekształcane na format DTO i zwracane ze statusem 201
10. W przypadku błędu, odpowiedni komunikat jest generowany i zwracany z właściwym kodem statusu

## 6. Względy bezpieczeństwa
- Uwierzytelnianie JWT przez Supabase Auth
- Autoryzacja przez Supabase RLS i dodatkowe sprawdzenie właściciela talii
- Walidacja pól za pomocą Zod:
  - `title`: niepusty string, max 100 znaków
  - `description`: opcjonalny string
- Weryfikacja limitu kart (max 100) w serwisie
- `export const prerender = false` w pliku Astro dla bezpieczeństwa endpointu

## 7. Obsługa błędów
| Kod | Przyczyna                                 | Działanie                                         |
|-----|-------------------------------------------|--------------------------------------------------|
| 400 | Nieprawidłowy format UUID dla deckId      | `{ error: "Invalid deck ID format" }`            |
| 400 | Nieprawidłowe dane w body                 | `{ error: zodError.message }`                    |
| 401 | Brak lub nieważny token                   | `{ error: "Unauthorized" }`                      |
| 403 | Użytkownik nie jest właścicielem talii    | `{ error: "Forbidden: User is not the owner" }`  |
| 403 | Przekroczony limit kart (100)             | `{ error: "Card limit reached (100)" }`          |
| 404 | Talia nie istnieje                        | `{ error: "Deck not found" }`                    |
| 500 | Błąd zapytania do bazy lub inny błąd      | `{ error: "Server error" }`                      |

## 8. Rozważania dotyczące wydajności
- Wykorzystanie indeksu `cards_deck_idx` na kolumnie `deck_id` w tabeli `cards` dla szybkiego liczenia kart
- Wykorzystanie Supabase RLS do filtrowania danych na poziomie bazy danych
- Wykonanie `head: true` podczas liczenia kart dla optymalizacji zapytania (nie pobiera danych)

## 9. Etapy wdrożenia
1. Utworzenie schematu walidacji `createCardSchema` w `src/lib/validators/cards.ts`
2. Implementacja funkcji serwisowych `getCardCount` i `createCard` w `src/lib/services/cardService.ts`
3. Utworzenie handlera `POST` w `src/pages/api/decks/[deckId]/cards.ts`
4. Implementacja walidacji danych wejściowych i obsługi błędów
5. Testowanie endpointu za pomocą narzędzi takich jak Postman lub curl, z uwzględnieniem:
   - Pozytywnych przypadków użycia (poprawne dane wejściowe)
   - Negatywnych przypadków użycia (nieprawidłowe dane, przekroczony limit kart)
6. Weryfikacja poprawności działania RLS w kontekście bezpieczeństwa
7. Dodanie dokumentacji API dla zespołu frontendowego 