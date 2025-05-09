# API Endpoint Implementation Plan: Update Deck

## 1. Przegląd punktu końcowego
Endpoint umożliwia aktualizację istniejącej talii (deck) poprzez zmianę jej nazwy (name). Aktualizacja może obejmować jeden lub oba parametry. Endpoint wymaga uwierzytelnienia i weryfikuje, czy użytkownik jest właścicielem talii.

## 2. Szczegóły żądania
- Metoda HTTP: `PUT`
- Struktura URL: `/decks/{deckId}`
- Parametry:
  - Wymagane: `deckId` (UUID talii w ścieżce URL)
  - Opcjonalne: brak
- Request Body:
  ```json
  {
    "name": "Updated Deck",
  }
  ```
  Uwaga: Co najmniej jedno z pól musi być przekazane.

## 3. Wykorzystywane typy
- DeckDTO
- UpdateDeckCommand
- Nowy schemat walidacji `updateDeckSchema` w oparciu o bibliotekę Zod

## 3. Szczegóły odpowiedzi
- Sukces (200 OK):
  ```json
  {
    "id": "uuid",
    "name": "Updated Deck",
    "share_hash": "abc123",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z"
  }
  ```
- Błędy:
  - 400 Bad Request: Nieprawidłowe dane wejściowe
  - 403 Forbidden: Brak uprawnień do modyfikacji talii
  - 404 Not Found: Talia o podanym ID nie istnieje
  - 500 Internal Server Error: Błąd serwera

## 4. Przepływ danych
1. Endpoint otrzymuje żądanie PUT z identyfikatorem talii w ścieżce URL
2. Middleware uwierzytelniający weryfikuje token JWT i dodaje dane użytkownika do `locals.supabase.auth`
3. Walidacja parametrów wejściowych za pomocą schematu Zod
4. Usługa sprawdza, czy talia istnieje i czy użytkownik jest jej właścicielem
5. Usługa aktualizuje rekord talii w bazie danych
6. Usługa pobiera zaktualizowany rekord i konwertuje go na DTO
7. Endpoint zwraca zaktualizowany obiekt talii

## 5. Względy bezpieczeństwa
1. **Uwierzytelnienie**: Token JWT wymagany w nagłówku `Authorization: Bearer <token>`
2. **Autoryzacja**: Sprawdzenie, czy użytkownik jest właścicielem talii przed aktualizacją
3. **Walidacja danych**: Użycie Zod do sprawdzenia, czy dane wejściowe spełniają wymagania:
   - `name`: Niepusty ciąg znaków po usunięciu białych znaków
   - Co najmniej jedno z tych pól musi być obecne

## 6. Obsługa błędów
1. Nieprawidłowe dane wejściowe (400):
   - Brak wymaganych pól
   - Nieprawidłowy format `name`
   - Nie podano żadnego pola do aktualizacji
2. Talia nie istnieje (404)
3. Użytkownik nie jest właścicielem talii (403)
4. Brak autoryzacji (401)
5. Błąd wewnętrzny serwera (500)

## 7. Rozważania dotyczące wydajności
1. Indeksowanie:
   - `decks.id` powinno być zaindeksowane jako klucz główny
   - `decks.owner_id` powinno być zaindeksowane do szybkiego sprawdzania właściciela
2. Transakcje:
   - Użyj transakcji dla aktualizacji rekordów w bazie danych, aby zapewnić atomowość
3. Aktualizacja name_tsv:
   - Jeśli nazwa jest aktualizowana, `name_tsv` powinno być również zaktualizowane dla zachowania funkcjonalności wyszukiwania pełnotekstowego

## 8. Etapy wdrożenia

### 1. Rozszerzenie schematu walidacji
Dodaj schemat walidacji `updateDeckSchema` w pliku `src/lib/validation/decks.ts`

### 2. Implementacja serwisu
Dodaj funkcję `updateDeck` w pliku `src/lib/services/deckService.ts`, która:
- Sprawdza, czy talia istnieje i należy do użytkownika
- Weryfikuje, czy wybrany szablon istnieje
- Przygotowuje dane do aktualizacji, uwzględniając aktualizację pola name_tsv przy zmianie nazwy
- Aktualizuje rekord w bazie danych
- Zwraca zaktualizowany obiekt talii jako DTO

### 3. Implementacja endpointu
Utwórz plik `src/pages/api/decks/[deckId].ts` z metodą PUT, która:
- Weryfikuje uwierzytelnienie użytkownika
- Waliduje parametry żądania
- Wywołuje usługę aktualizacji talii
- Obsługuje potencjalne błędy:
  - Nieznalezienie talii
  - Brak uprawnień
  - Nieznalezienie szablonu
  - Błędy serwera