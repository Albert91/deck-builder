# API Endpoint Implementation Plan: List Cards in a Deck

## 1. Przegląd punktu końcowego
Endpoint służy do pobierania paginowanej listy kart należących do określonej talii (deck). Użytkownik musi być właścicielem talii, aby móc uzyskać dostęp do jej kart. Użytkownik może określić, którą stronę wyników chce zobaczyć oraz ile wyników ma być wyświetlanych na jednej stronie.

## 2. Szczegóły żądania
- Metoda HTTP: `GET`
- Struktura URL: `/decks/{deckId}/cards`
- Parametry:
  - Wymagane: 
    - `deckId` - UUID talii w ścieżce URL
  - Opcjonalne:
    - `page` - numer strony (domyślnie 1)
    - `limit` - liczba wyników na stronę (domyślnie 20)

## 3. Wykorzystywane typy
Endpoint będzie korzystał z następujących istniejących typów:
- `CardDTO` - model danych reprezentujący kartę
- `CardListResponseDTO` - model odpowiedzi z paginowaną listą kart

Potrzebne będą także dodatkowe typy/schematy walidacji:
- `listCardsSchema` - schema Zod do walidacji parametrów zapytania

## 4. Szczegóły odpowiedzi
Sukces (200 OK):
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Goblin",
      "description": "Opis goblina...",
      "image_metadata_id": "uuid",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "totalCount": 10,
  "page": 1,
  "limit": 20
}
```

Błędy:
- 400 Bad Request - nieprawidłowe parametry zapytania
- 401 Unauthorized - użytkownik nie jest zalogowany
- 403 Forbidden - użytkownik nie jest właścicielem talii
- 404 Not Found - talia nie istnieje
- 500 Internal Server Error - błąd serwera

## 5. Przepływ danych
1. Walidacja parametrów zapytania (page, limit) przy użyciu Zod
2. Sprawdzenie czy użytkownik jest zalogowany
3. Pobranie talii z bazy danych i sprawdzenie czy użytkownik jest jej właścicielem
4. Pobranie kart z bazy danych z uwzględnieniem paginacji
5. Konwersja danych bazowych na CardDTO
6. Zwrócenie danych w formacie CardListResponseDTO

## 6. Względy bezpieczeństwa
- Uwierzytelnianie: endpoint wymaga zalogowanego użytkownika
- Autoryzacja: użytkownik musi być właścicielem talii
- Walidacja danych wejściowych: wszystkie parametry zapytania są walidowane

## 7. Obsługa błędów
- Nieprawidłowe parametry zapytania (page, limit) -> 400 Bad Request
- Brak uwierzytelnienia -> 401 Unauthorized
- Brak uprawnień do talii -> 403 Forbidden
- Talia nie istnieje -> 404 Not Found
- Błędy serwera -> 500 Internal Server Error + log błędu

## 8. Rozważania dotyczące wydajności
- Paginacja ogranicza ilość zwracanych danych
- Indeks na kolumnie `deck_id` w tabeli `cards` dla szybszego wyszukiwania
- Możliwość cachowania wyników dla często odwiedzanych talii
- Możliwość zastosowania efektywniejszych zapytań SQL w przyszłości, jeśli będzie potrzeba optymalizacji

## 9. Etapy wdrożenia
1. Utworzenie schematu walidacji danych wejściowych
   - Zdefiniowanie schematu Zod dla walidacji parametrów `page` i `limit`
   - Zapewnienie wartości domyślnych i limitów dla parametrów

2. Implementacja funkcji serwisowej
   - Utworzenie funkcji `listCards` w serwisie obsługującym karty
   - Sprawdzenie uprawnień użytkownika do talii
   - Pobieranie danych z bazy z użyciem parametrów paginacji
   - Mapowanie danych z bazy na format DTO

3. Utworzenie pliku endpoint API
   - Obsługa żądania GET z parametrami ścieżki i zapytania
   - Walidacja parametrów wejściowych
   - Wywołanie funkcji serwisowej z odpowiednimi parametrami
   - Obsługa błędów biznesowych i technicznych
   - Formowanie odpowiedzi zgodnie ze specyfikacją

4. Testy
   - Test walidacji danych wejściowych
   - Test autoryzacji (użytkownik nie jest właścicielem talii)
   - Test gdy talia nie istnieje
   - Test poprawnego działania paginacji
   - Test obsługi błędów bazy danych

5. Dokumentacja
   - Aktualizacja dokumentacji API
   - Przykłady użycia endpointu 