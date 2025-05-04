# API Endpoint Implementation Plan: List Decks

## 1. Przegląd punktu końcowego
Endpoint `GET /decks` zwraca stronowaną listę talii należących do uwierzytelnionego użytkownika. Obsługuje parametry paginacji oraz full-text search na nazwie talii.

## 2. Szczegóły żądania
- Metoda HTTP: `GET`
- Struktura URL: `/decks`
- Nagłówki:
  - `Authorization: Bearer <token>` (wymagane)
- Parametry zapytania:
  - Wymagane: brak (wszystkie mają wartości domyślne)
  - Opcjonalne:
    - `page` (integer, ≥1, domyślnie 1)
    - `limit` (integer, 1–100, domyślnie 20)
    - `search` (string, pełnotekstowe wyszukiwanie w nazwach talii)
- Typy wykorzystywane do parsowania zapytania:
  ```ts
  // src/types.ts
  interface PaginationParams { page?: number; limit?: number; }
  interface SearchParams extends PaginationParams { search?: string; }
  ```

## 3. Szczegóły odpowiedzi
- Status 200 OK
- Body (JSON):
  ```ts
  import { DeckDTO, DeckListResponseDTO } from 'src/types';
  ```
- Przykład:
  ```json
  {
    "items": [
      {
        "id": "uuid-1",
        "name": "Moja Talia",
        "share_hash": "abc123",
        "created_at": "2024-07-01T12:00:00Z",
        "updated_at": "2024-07-02T08:30:00Z"
      }
    ],
    "totalCount": 5,
    "page": 1,
    "limit": 20
  }
  ```

## 4. Przepływ danych
1. **Route handler** (`src/pages/api/decks.ts`):
   - `export const GET = async ({ request, locals }) => { … }`
   - Odczyt `Authorization` → `locals.supabase.auth.getUser()` → `user.id`
   - Parsowanie i walidacja zapytania za pomocą Zod
   - Wywołanie `deckService.listDecks(user.id, { page, limit, search })`
   - Zwrócenie wyniku w formacie `DeckListResponseDTO`
2. **Service** (`src/lib/services/deckService.ts`):
   - Funkcja `export async function listDecks(userId: string, params: SearchParams)`
   - Budowa zapytania Supabase:
     ```ts
     const query = locals.supabase
       .from('decks')
       .select('id, name, share_hash, created_at, updated_at', { count: 'exact' })
       .eq('owner_id', userId);

     if (params.search) {
       query.textSearch('name_tsv', params.search, { config: 'english' });
     }

     query.range((page-1)*limit, page*limit - 1);
     const { data, count, error } = await query;
     ```
   - Mapowanie surowych rekordów na `DeckDTO[]`
   - Zwrócenie obiektu `{ items, totalCount: count, page, limit }`

## 5. Względy bezpieczeństwa
- Uwierzytelnianie JWT przez Supabase Auth.
- Autoryzacja przez:
  - RLS w bazie (`owner_id = auth.uid()`)
  - Dodatkowy warunek `.eq('owner_id', userId)` w zapytaniu.
- Sanitizacja i walidacja `search` za pomocą Zod (zapobieganie injekcji).
- `export const prerender = false` w pliku Astro, by nie cache'ować prywatnych danych.

## 6. Obsługa błędów
| Kod | Przyczyna                                 | Działanie                           |
|-----|-------------------------------------------|-------------------------------------|
| 400 | Błędne lub niespełniające zakresu parametry | Zwróć `{ error: zodError.message }` |
| 401 | Brak lub nieważny token                  | Zwróć `{ error: "Unauthorized" }`    |
| 500 | Błąd zapytania do bazy lub wewnętrzny     | `console.error(error)` + `{ error: "Server error" }` |

(W wypadku przyszłego wdrożenia można zapisać szczegóły błędu do tabeli `error_logs`.)

## 7. Rozważania dotyczące wydajności
- Indeks GIN na kolumnie `name_tsv` (pełnotekstowe wyszukiwanie).
- Jedno zapytanie z `count: 'exact'` i `range()` zamiast dwóch oddzielnych.
- Ograniczenie `limit ≤ 100` zapobiega zbyt ciężkim zapytaniom.
- Upewnić się, że pola selectowane są tylko niezbędne.

## 8. Kroki implementacji
1. **Zod schema**  
   - Dodaj `searchDecksSchema` w pliku `src/lib/validation/decks.ts`.
2. **Service**  
   - Utwórz/rozbuduj `src/lib/services/deckService.ts` z funkcją `listDecks`.
3. **Route**  
   - W `src/pages/api/decks.ts` zaimplementuj `export const GET`.
   - Pobierz i zwaliduj query params, użytkownika z `locals.supabase`.
   - Wywołaj `deckService.listDecks`.
   - Zwróć `json()` z odpowiednim status code.
5. **Sprawdzenie lintera/formatowania**  
   - Uruchom `yarn lint` i `yarn format`.