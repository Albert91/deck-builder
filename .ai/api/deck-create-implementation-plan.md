# API Endpoint Implementation Plan: Create Deck

## 1. Przegląd punktu końcowego
Endpoint `POST /decks` umożliwia utworzenie nowej talii kart dla zalogowanego użytkownika. Implementuje ograniczenie do maksymalnie 5 talii na użytkownika, zgodnie z wymaganiami PRD.

## 2. Szczegóły żądania
- Metoda HTTP: `POST`
- Struktura URL: `/decks`
- Nagłówki:
  - `Authorization: Bearer <token>` (wymagane)
- Body (JSON):
  ```json
  {
    "name": "My Deck",
    "template_id": "template-uuid"
  }
  ```
- Typy wykorzystywane do parsowania żądania:
  ```ts
  // src/types.ts
  interface CreateDeckCommand {
    name: string;
    template_id: string;
  }
  ```

## 3. Szczegóły odpowiedzi
- Status 201 Created
- Body (JSON):
  ```ts
  import { DeckDTO } from 'src/types';
  ```
- Przykład:
  ```json
  {
    "id": "uuid-1",
    "name": "My Deck",
    "share_hash": "abc123",
    "template_id": "template-uuid",
    "created_at": "2024-07-01T12:00:00Z",
    "updated_at": "2024-07-01T12:00:00Z"
  }
  ```

## 4. Przepływ danych
1. **Route handler** (`src/pages/api/decks.ts`):
   - `export const POST = async ({ request, locals }) => { … }`
   - Odczyt `Authorization` → `locals.supabase.auth.getUser()` → `user.id`
   - Parsowanie i walidacja body zapytania za pomocą Zod
   - Sprawdzenie limitu talii przez `deckService.getUserDeckCount(user.id)`
   - Jeśli limit nie został przekroczony, wywołanie `deckService.createDeck(user.id, validatedData)`
   - Zwrócenie nowo utworzonej talii w formacie `DeckDTO` ze statusem 201
2. **Service** (`src/lib/services/deckService.ts`):
   - Funkcja `export async function getUserDeckCount(userId: string): Promise<number>`
     ```ts
     const { count } = await locals.supabase
       .from('decks')
       .select('*', { count: 'exact', head: true })
       .eq('owner_id', userId);
     return count || 0;
     ```
   - Funkcja `export async function createDeck(userId: string, data: CreateDeckCommand)`
     ```ts
     // Utworzenie nowej talii (share_hash zostanie wygenerowany automatycznie przez trigger w bazie danych)
     const { data: deck, error } = await locals.supabase
       .from('decks')
       .insert({
         name: data.name,
         template_id: data.template_id,
         owner_id: userId
       })
       .select('id, name, share_hash, template_id, created_at, updated_at')
       .single();
     
     if (error) throw new Error(error.message);
     return mapToDeckDTO(deck);
     ```

## 5. Względy bezpieczeństwa
- Uwierzytelnianie JWT przez Supabase Auth.
- Autoryzacja przez Supabase RLS: `owner_id = auth.uid()` w bazie danych.
- Walidacja pól `name` i `template_id` za pomocą Zod:
  - `name`: niepusty string, min 3 znaki, max 50 znaków
  - `template_id`: string w formacie UUID; sprawdzenie czy istnieje w tabeli `templates`
- Weryfikacja limitu talii (max 5) przez deckService.
- `export const prerender = false` w pliku Astro, by nie cache'ować endpointu.

## 6. Obsługa błędów
| Kod | Przyczyna                                  | Działanie                                   |
|-----|-------------------------------------------|---------------------------------------------|
| 400 | Nieprawidłowe dane w body                 | Zwróć `{ error: zodError.message }`         |
| 401 | Brak lub nieważny token                   | Zwróć `{ error: "Unauthorized" }`           |
| 403 | Przekroczony limit talii (5)             | Zwróć `{ error: "Deck limit reached (5)" }` |
| 404 | Nieprawidłowy template_id                | Zwróć `{ error: "Template not found" }`     |
| 500 | Błąd zapytania do bazy lub wewnętrzny     | `console.error(error)` + `{ error: "Server error" }` |

## 7. Rozważania dotyczące wydajności
- Użycie pojedynczego zapytania do sprawdzenia liczby talii zamiast pobierania całej listy.
- Walidacja szablonu przez referencję zewnętrzną (template_id).
- Generowanie losowego share_hash przez trigger bazy danych.
- Indeks na kolumnie `owner_id` w tabeli `decks` dla szybkiego zliczania talii użytkownika.

## 8. Kroki implementacji
1. **Zod schema**
   - Dodaj `createDeckSchema` w pliku `src/lib/validation/decks.ts`:
     ```ts
     export const createDeckSchema = z.object({
       name: z.string().min(3).max(50),
       template_id: z.string().uuid()
     });
     ```
2. **Service**
   - Rozbuduj `src/lib/services/deckService.ts` o funkcje `getUserDeckCount` i `createDeck`.
3. **Route**
   - W `src/pages/api/decks.ts` zaimplementuj `export const POST`.
   - Pobierz i zwaliduj body, użytkownika z `locals.supabase`.
   - Sprawdź limit talii przed utworzeniem nowej.
   - Wywołaj `deckService.createDeck` i zwróć wynik ze statusem 201.
4. **Weryfikacje**
   - Dodaj weryfikację istnienia template_id w tabeli templates.
   - Upewnij się, że RLS w bazie danych jest poprawnie skonfigurowane.
   - Sprawdź, czy trigger generujący share_hash jest skonfigurowany w bazie danych.
5. **Sprawdzenie lintera/formatowania**
   - Uruchom `yarn lint` i `yarn format`. 