# API Endpoint Implementation Plan: Update Card

## 1. Przegląd punktu końcowego
Endpoint służy do aktualizacji tytułu i/lub opisu karty w określonej talii. Wymaga autentykacji, a użytkownik musi być właścicielem talii zawierającej aktualizowaną kartę.

## 2. Szczegóły żądania
- Metoda HTTP: `PUT`
- Struktura URL: `/decks/{deckId}/cards/{cardId}`
- Parametry ścieżki:
  - `deckId`: UUID talii zawierającej kartę (wymagany)
  - `cardId`: UUID karty do aktualizacji (wymagany)
- Request Body:
  ```json
  {
    "title": "Orc Warrior",
    "description": "A powerful fighter"
  }
  ```
  - `title`: Nowy tytuł karty (opcjonalny, jeśli podany description)
  - `description`: Nowy opis karty (opcjonalny, jeśli podany title)

## 3. Wykorzystywane typy
### Typy DTO i Command Models
```typescript
// Już istniejący w types.ts
export interface UpdateCardCommand {
  title?: string;
  description?: string | null;
}

// Już istniejący w types.ts
export type CardDTO = Pick<Card, 'id' | 'title' | 'description' | 'image_metadata_id' | 'created_at' | 'updated_at'> & {
  attributes?: CardAttributeDTO[];
};
```

### Nowe walidatory (do dodania)
```typescript
// Do dodania w ./src/lib/validators/cards.ts
export const updateCardSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(500).nullable().optional(),
}).refine(data => data.title !== undefined || data.description !== undefined, {
  message: "Należy podać tytuł lub opis karty"
});

export const cardIdSchema = z.string().uuid('Identyfikator karty musi być poprawnym UUID');
export type CardIdSchema = z.infer<typeof cardIdSchema>;
export type UpdateCardSchema = z.infer<typeof updateCardSchema>;
```

## 4. Szczegóły odpowiedzi
- Sukces (200 OK):
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Orc Warrior",
    "description": "A powerful fighter",
    "image_metadata_id": "223e4567-e89b-12d3-a456-426614174000",
    "created_at": "2023-08-16T14:22:18.332Z",
    "updated_at": "2023-08-16T15:30:45.123Z",
    "attributes": [
      {
        "id": "323e4567-e89b-12d3-a456-426614174000",
        "attribute_type": "strength",
        "value": 8
      }
    ]
  }
  ```

- Błędy:
  - 400 Bad Request: Nieprawidłowe dane wejściowe
  - 401 Unauthorized: Niezalogowany użytkownik
  - 403 Forbidden: Użytkownik nie jest właścicielem talii
  - 404 Not Found: Karta lub talia nie istnieje
  - 500 Internal Server Error: Błąd serwera

## 5. Przepływ danych
1. Walidacja parametrów ścieżki (`deckId`, `cardId`) i ciała żądania (`title`, `description`)
2. Sprawdzenie uprawnień użytkownika do talii
3. Sprawdzenie czy karta istnieje i należy do talii
4. Aktualizacja danych karty w bazie danych
5. Pobranie zaktualizowanej karty wraz z atrybutami
6. Przekształcenie danych do formatu CardDTO
7. Zwrócenie odpowiedzi

## 6. Względy bezpieczeństwa
- Walidacja typów i formatów danych wejściowych
- Sprawdzenie czy użytkownik jest właścicielem talii przed modyfikacją karty
- Sanityzacja danych przed zapisem do bazy
- Użycie parametryzowanych zapytań przez Supabase ORM
- Ochrona przed atakami CSRF (Astro/Supabase)
- Używanie tokenów JWT do uwierzytelniania

## 7. Obsługa błędów
- Nieprawidłowe UUID: 400 Bad Request
- Niezalogowany użytkownik: 401 Unauthorized
- Użytkownik nie jest właścicielem talii: 403 Forbidden
- Talia nie istnieje: 404 Not Found
- Karta nie istnieje: 404 Not Found
- Karta nie należy do wskazanej talii: 404 Not Found
- Błąd walidacji danych wejściowych: 400 Bad Request z komunikatem walidacji
- Błąd bazy danych: 500 Internal Server Error z logowaniem błędu

## 8. Rozważania dotyczące wydajności
- Indeksy na kolumnach `cards.id` i `cards.deck_id`
- Aktualizacja tylko zmienionych pól (pomijanie niezmienionych)
- Użycie pojedynczej transakcji dla operacji bazodanowych
- Unikanie dodatkowych zapytań do bazy w miarę możliwości
- Używanie efektywnych struktur danych

## 9. Etapy wdrożenia

### 1. Rozszerzenie walidatorów
1. Dodać `cardIdSchema` i `updateCardSchema` do pliku `./src/lib/validators/cards.ts`

### 2. Rozszerzenie serwisu kart
1. Dodać funkcję `updateCard` do pliku `./src/lib/services/cardService.ts`:
```typescript
export async function updateCard(
  supabase: SupabaseClient,
  userId: string,
  deckId: string,
  cardId: string,
  data: UpdateCardCommand
): Promise<CardDTO> {
  // 1. Sprawdź czy talia istnieje i należy do użytkownika
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, owner_id')
    .eq('id', deckId)
    .single();

  if (deckError) {
    if (deckError.code === 'PGRST116') {
      throw new Error('Deck not found');
    }
    throw deckError;
  }

  // Sprawdź czy użytkownik jest właścicielem talii
  if (deck.owner_id !== userId) {
    throw new Error('User is not the owner of this deck');
  }

  // 2. Sprawdź czy karta istnieje i należy do tej talii
  const { data: existingCard, error: cardError } = await supabase
    .from('cards')
    .select('id')
    .eq('id', cardId)
    .eq('deck_id', deckId)
    .single();

  if (cardError) {
    if (cardError.code === 'PGRST116') {
      throw new Error('Card not found in this deck');
    }
    throw cardError;
  }

  // 3. Aktualizuj kartę
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  updateData.updated_at = new Date().toISOString();

  const { error: updateError } = await supabase
    .from('cards')
    .update(updateData)
    .eq('id', cardId)
    .eq('deck_id', deckId);

  if (updateError) {
    throw updateError;
  }

  // 4. Pobierz zaktualizowaną kartę z atrybutami
  const { data: updatedCard, error: fetchError } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Pobierz atrybuty karty
  const { data: attributes, error: attrError } = await supabase
    .from('card_attributes')
    .select('*')
    .eq('card_id', cardId);

  if (attrError) {
    throw attrError;
  }

  // 5. Zwróć dane w formacie CardDTO
  return mapToCardDTO(updatedCard, attributes || []);
}
```

### 3. Implementacja punktu końcowego API
1. Utworzyć plik `./src/pages/api/decks/[deckId]/cards/[cardId].ts`:
```typescript
import type { APIRoute } from 'astro';
import { cardIdSchema, updateCardSchema } from '../../../../../lib/validators/cards';
import { deckIdSchema } from '../../../../../lib/validators/decks';
import { updateCard } from '../../../../../lib/services/cardService';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request, locals }) => {
  // Sprawdzenie autentykacji
  const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
  
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Walidacja parametrów ścieżki
    const deckIdValidation = deckIdSchema.safeParse(params.deckId);
    const cardIdValidation = cardIdSchema.safeParse(params.cardId);
    
    if (!deckIdValidation.success) {
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowy format identyfikatora talii' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!cardIdValidation.success) {
      return new Response(
        JSON.stringify({ error: 'Nieprawidłowy format identyfikatora karty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Walidacja body żądania
    const body = await request.json();
    const validationResult = updateCardSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: validationResult.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Aktualizacja karty
    try {
      const deckId = deckIdValidation.data;
      const cardId = cardIdValidation.data;
      const updateData = validationResult.data;
      
      const updatedCard = await updateCard(locals.supabase, user.id, deckId, cardId, updateData);
      
      return new Response(
        JSON.stringify(updatedCard),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {
      // Obsługa specyficznych błędów
      if (error.message === 'Deck not found') {
        return new Response(
          JSON.stringify({ error: 'Nie znaleziono talii' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (error.message === 'User is not the owner of this deck') {
        return new Response(
          JSON.stringify({ error: 'Brak dostępu: użytkownik nie jest właścicielem talii' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      if (error.message === 'Card not found in this deck') {
        return new Response(
          JSON.stringify({ error: 'Nie znaleziono karty w tej talii' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      // Ponowne zgłoszenie dla ogólnej obsługi błędów
      throw error;
    }
  } catch (error) {
    console.error('Błąd serwera podczas aktualizacji karty:', error);
    
    return new Response(
      JSON.stringify({ error: 'Błąd serwera' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### 4. Testowanie
1. Utworzyć testy jednostkowe dla walidatora
2. Utworzyć testy dla serwisu kart
3. Utworzyć testy integracyjne dla endpointu

### 5. Dokumentacja
1. Uzupełnić dokumentację API
2. Dodać przykłady użycia w dokumentacji 