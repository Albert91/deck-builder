 # API Endpoint Implementation Plan: Delete Card

## 1. Przegląd punktu końcowego
Endpoint służy do usuwania istniejącej karty z talii. Jest to operacja bezpowrotna, która usuwa kartę wraz z jej atrybutami z bazy danych. Dzięki kaskadowemu usuwaniu, wszystkie powiązane rekordy w tabelach `card_attributes` również zostaną usunięte. Po pomyślnym wykonaniu operacji, endpoint zwraca kod 204 (No Content).

## 2. Szczegóły żądania
- Metoda HTTP: `DELETE`
- Struktura URL: `/decks/{deckId}/cards/{cardId}`
- Parametry:
  - Wymagane: 
    - `deckId` - identyfikator talii (UUID)
    - `cardId` - identyfikator karty do usunięcia (UUID)
  - Opcjonalne: brak
- Request Body: brak

## 3. Wykorzystywane typy
- `deckIdSchema` (zod) - do walidacji identyfikatora talii
- `z.string().uuid()` (zod) - do walidacji identyfikatora karty
- Nie są potrzebne nowe typy DTO lub Command Modele, ponieważ endpoint nie przyjmuje ani nie zwraca danych strukturalnych

## 4. Szczegóły odpowiedzi
- Kod statusu 204 No Content - operacja się powiodła, karta została usunięta
- Kod statusu 400 Bad Request - nieprawidłowy format identyfikatora talii lub karty
- Kod statusu 401 Unauthorized - brak autoryzacji
- Kod statusu 403 Forbidden - użytkownik nie jest właścicielem talii
- Kod statusu 404 Not Found - karta lub talia nie istnieje
- Kod statusu 500 Internal Server Error - nieoczekiwany błąd serwera
- Ciało odpowiedzi: brak dla 204, dla innych kodów obiekt JSON z polem `error` opisującym błąd

## 5. Przepływ danych
1. Otrzymanie żądania DELETE z parametrami deckId i cardId
2. Walidacja parametrów deckId i cardId
3. Sprawdzenie, czy talia istnieje i należy do zalogowanego użytkownika
4. Sprawdzenie, czy karta istnieje i należy do wskazanej talii
5. Usunięcie karty z bazy danych (kaskadowe usunięcie atrybutów karty)
6. Zwrócenie odpowiedzi 204 No Content

## 6. Względy bezpieczeństwa
- Wymaga uwierzytelnienia (sprawdzane przez middleware)
- Autoryzacja: użytkownik musi być właścicielem talii, do której należy karta
- Walidacja parametrów deckId i cardId za pomocą schematów Zod
- Sprawdzenie relacji między kartą a talią, aby zapobiec usuwaniu kart z nieswojej talii

## 7. Obsługa błędów
- Nieprawidłowy format identyfikatora talii lub karty: 400 Bad Request
- Brak autoryzacji: 401 Unauthorized
- Użytkownik nie jest właścicielem talii: 403 Forbidden
- Talia nie istnieje: 404 Not Found
- Karta nie istnieje lub nie należy do wskazanej talii: 404 Not Found
- Błąd bazy danych lub inny nieoczekiwany błąd: 500 Internal Server Error
- Wszystkie błędy są logowane na serwerze (console.error)

## 8. Rozważania dotyczące wydajności
- Operacja jest relatywnie prosta i nie powinna powodować problemów wydajnościowych
- Dzięki kaskadowemu usuwaniu na poziomie bazy danych, nie ma potrzeby przeprowadzania wielu operacji usuwania
- Operacja nie wymaga dodatkowych zapytań do bazy danych poza sprawdzeniem właściciela talii i istnienia karty

## 9. Etapy wdrożenia

### 1. Utworzenie walidatora dla cardId
1. Dodać schemat walidacji `cardIdSchema` do pliku `src/lib/validators/cards.ts`:
```typescript
export const cardIdSchema = z.string().uuid('Identyfikator karty musi być poprawnym UUID');
export type CardIdSchema = z.infer<typeof cardIdSchema>;
```

### 2. Dodanie funkcji do usuwania karty w serwisie kart
1. Dodać funkcję `deleteCard` w pliku `src/lib/services/cardService.ts`:
1. Utworzyć katalog `src/pages/api/decks/[deckId]/cards/[cardId]` jeśli nie istnieje
2. Utworzyć plik `src/pages/api/decks/[deckId]/cards/[cardId]/index.ts` z następującą zawartością: