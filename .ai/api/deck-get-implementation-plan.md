# API Endpoint Implementation Plan: Get Deck

## 1. Przegląd punktu końcowego
Endpoint służy do pobierania szczegółowych informacji o talii (deck) na podstawie jej identyfikatora. Zwraca metadane talii, takie jak nazwa, identyfikator szablonu, hash udostępniania oraz daty utworzenia i aktualizacji. Wymaga uwierzytelnienia i autoryzacji, aby zapewnić, że tylko właściciel talii ma do niej dostęp.

## 2. Szczegóły żądania
- Metoda HTTP: `GET`
- Struktura URL: `/decks/{deckId}`
- Parametry:
  - Wymagane: `deckId` (format UUID) - identyfikator talii w ścieżce URL
  - Opcjonalne: brak
- Request Body: brak (metoda GET)
```typescript
// Istniejący typ DeckDTO zdefiniowany w src/types.ts
export type DeckDTO = Pick<Deck, 'id' | 'name' | 'share_hash' | 'template_id' | 'created_at' | 'updated_at'>;

// Potrzebne rozszerzenie serwisu deckService.ts
export async function getDeckById(
  supabase: SupabaseClient,
  userId: string,
  deckId: string
): Promise<DeckDTO>

// Schemat walidacji parametru deckId
export const deckIdSchema = z.string().uuid('Identyfikator talii musi być poprawnym UUID');
```

## 3. Szczegóły odpowiedzi
- Sukces (200 OK):
  ```json
  {
    "id": "uuid",
    "name": "My Deck",
    "template_id": "uuid",
    "share_hash": "hash_string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
  ```
- Błąd (404 Not Found): Talia o podanym identyfikatorze nie istnieje
  ```json
  {
    "error": "Talia nie została znaleziona"
  }
  ```
- Błąd (403 Forbidden): Użytkownik nie jest właścicielem talii
  ```json
  {
    "error": "Brak uprawnień do wyświetlenia tej talii"
  }
  ```

## 4. Przepływ danych
1. Endpoint otrzymuje żądanie z parametrem `deckId`
2. Następuje walidacja formatu `deckId` (UUID)
3. Serwis wywołuje bazę danych, aby pobrać talię o danym ID
4. Serwis weryfikuje, czy użytkownik jest właścicielem talii
5. Jeśli warunki są spełnione, dane talii są przekształcane na format DTO i zwracane
6. W przypadku błędu, odpowiedni komunikat jest generowany i zwracany z właściwym kodem statusu

## 5. Względy bezpieczeństwa
- **Uwierzytelnianie**: Endpoint wymaga uwierzytelnienia - użytkownik musi być zalogowany
- **Autoryzacja**: Weryfikacja, czy zalogowany użytkownik jest właścicielem talii (owner_id)
- **Walidacja wejścia**: Sprawdzenie poprawności formatu UUID parametru `deckId`
- **Zapobieganie IDOR**: Zabezpieczenie przed bezpośrednim odwołaniem do obiektu przez sprawdzenie właściciela

## 6. Obsługa błędów
- **404 Not Found**: Zwracany, gdy talia o podanym ID nie istnieje
- **403 Forbidden**: Zwracany, gdy użytkownik nie jest właścicielem talii
- **400 Bad Request**: Zwracany, gdy format `deckId` nie jest poprawnym UUID
- **401 Unauthorized**: Zwracany, gdy użytkownik nie jest uwierzytelniony
- **500 Internal Server Error**: Zwracany w przypadku nieoczekiwanych błędów serwera

## 7. Rozważania dotyczące wydajności
- Użycie indeksu na kolumnie `id` w tabeli `decks` zapewnia szybkie wyszukiwanie
- Możliwe implementowanie mechanizmu cachingu odpowiedzi dla często pobieranych talii
- Efektywne pobieranie tylko niezbędnych pól z bazy danych

## 8. Etapy wdrożenia

### 1. Rozszerzenie walidacji
Dodaj schemat walidacji dla parametru deckId w pliku `src/lib/validation/decks.ts`:
```typescript
export const deckIdSchema = z.string().uuid('Identyfikator talii musi być poprawnym UUID');
```

### 2. Rozszerzenie serwisu
Dodaj funkcję `getDeckById` w pliku `src/lib/services/deckService.ts`:
```typescript
/**
 * Pobiera talię na podstawie ID z weryfikacją właściciela
 */
export async function getDeckById(
  supabase: SupabaseClient,
  userId: string,
  deckId: string
): Promise<DeckDTO> {
  const { data, error } = await supabase
    .from('decks')
    .select('id, name, share_hash, template_id, created_at, updated_at')
    .eq('id', deckId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Talia nie została znaleziona');
    }
    console.error('Error fetching deck:', error);
    throw error;
  }

  // Sprawdzenie czy użytkownik jest właścicielem talii
  if (data.owner_id !== userId) {
    throw new Error('Brak uprawnień do wyświetlenia tej talii');
  }

  return mapToDeckDTO(data);
}
```

### 3. Implementacja endpointu
Utwórz nowy plik `src/pages/api/decks/[deckId].ts`: