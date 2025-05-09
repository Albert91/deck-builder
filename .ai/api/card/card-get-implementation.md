# API Endpoint Implementation Plan: Get Card

## 1. Przegląd punktu końcowego
Endpoint ten umożliwia pobranie pojedynczej karty z określonej talii. Zwraca pełne informacje o karcie, w tym jej atrybuty i dane metadanych obrazu, jeśli są dostępne.

## 2. Szczegóły żądania
- Metoda HTTP: `GET`
- Struktura URL: `/decks/{deckId}/cards/{cardId}`
- Parametry:
  - Wymagane: 
    - `deckId` - UUID talii, do której należy karta
    - `cardId` - UUID karty, którą chcemy pobrać
  - Opcjonalne: brak
- Request Body: brak (metoda GET)

## 3. Wykorzystywane typy
```typescript
// Z istniejących typów
import type { CardDTO, Card } from '../../types';
import { mapToCardDTO } from '../../types';

// Nowy schemat walidacji
export const cardIdSchema = z.string().uuid('Identyfikator karty musi być poprawnym UUID');
export type CardIdSchema = z.infer<typeof cardIdSchema>;
```

## 4. Szczegóły odpowiedzi
- Sukces (200): Obiekt karty
  ```typescript
  {
    id: string;              // UUID karty
    title: string;           // Tytuł karty
    description: string;     // Opis karty (może być null)
    image_metadata_id: string | null; // ID metadanych obrazu (może być null)
    created_at: string;      // Data utworzenia
    updated_at: string;      // Data aktualizacji
    attributes: [            // Tablica atrybutów karty (opcjonalna)
      {
        id: string;          // UUID atrybutu
        attribute_type: string; // Typ atrybutu (enum)
        value: number;       // Wartość atrybutu (0-99)
      }
    ]
  }
  ```
- Błąd (400): Nieprawidłowe parametry
- Błąd (401): Nieautoryzowany dostęp
- Błąd (403): Brak uprawnień do zasobu
- Błąd (404): Karta lub talia nie znaleziona
- Błąd (500): Błąd serwera

## 5. Przepływ danych
1. Walidacja parametrów ścieżki (`deckId` i `cardId`)
2. Autoryzacja użytkownika przy użyciu Supabase Auth
3. Wywołanie funkcji serwisowej `getCard` z `cardService.ts`
4. Wewnątrz funkcji serwisowej:
   - Sprawdzenie, czy talia istnieje i należy do zalogowanego użytkownika
   - Pobranie karty z bazy danych
   - Pobranie atrybutów karty
   - Mapowanie danych na DTO
5. Zwrócenie odpowiedzi z danymi karty lub odpowiednim komunikatem błędu

## 6. Względy bezpieczeństwa
- Uwierzytelnianie: Endpoint wymaga uwierzytelnienia użytkownika przez Supabase Auth
- Autoryzacja: Sprawdzenie, czy użytkownik jest właścicielem talii, do której należy karta
- Walidacja danych: 
  - UUID talii i karty muszą być poprawnymi UUID
  - Sprawdzenie czy karta należy do wskazanej talii

## 7. Obsługa błędów
- `400 Bad Request`: Nieprawidłowy format `deckId` lub `cardId`
- `401 Unauthorized`: Brak autentykacji użytkownika
- `403 Forbidden`: Użytkownik nie jest właścicielem talii
- `404 Not Found`: 
  - Talia o podanym `deckId` nie istnieje
  - Karta o podanym `cardId` nie istnieje lub nie należy do wskazanej talii
- `500 Internal Server Error`: Błędy po stronie serwera (połączenie z bazą danych, itp.)

## 8. Rozważania dotyczące wydajności
- Zapytanie do bazy danych powinno pobierać kartę i jej atrybuty w jednym zapytaniu, aby uniknąć wielokrotnych wywołań API
- Jeśli karta zawiera dużo atrybutów, warto rozważyć paginację atrybutów w przyszłych wersjach API
- Warto rozważyć dodanie cache'owania dla kart, które są często pobierane

## 9. Etapy wdrożenia
1. Zaktualizuj plik `src/lib/validators/cards.ts` - dodaj schemat walidacji `cardIdSchema`
2. Dodaj nową funkcję `getCard` w serwisie `src/lib/services/cardService.ts`
3. Utwórz nowy plik `src/pages/api/decks/[deckId]/cards/[cardId].ts` z implementacją endpointu
4. Zaimplementuj obsługę żądania GET w pliku endpointu
5. Dodaj pełną obsługę błędów i logowanie
6. Przetestuj endpoint z różnymi scenariuszami:
   - Poprawne żądanie (istniejąca karta w istniejącej talii)
   - Nieprawidłowe formaty deckId lub cardId
   - Nieistniejąca talia lub karta
   - Dostęp do talii innego użytkownika
   - Brak uwierzytelnienia
7. Dodaj dokumentację w komentarzach do kodu