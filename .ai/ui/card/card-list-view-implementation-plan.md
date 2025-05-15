# Plan implementacji widoku Listy Kart w Talii

## 1. Przegląd
Widok listy kart w talii służy do prezentacji wszystkich kart należących do wybranej talii oraz umożliwia zarządzanie nimi. Użytkownik może przeglądać, dodawać, edytować, duplikować oraz usuwać karty. Widok prezentuje również informacje o limicie kart (max 100) oraz umożliwia udostępnianie jej.

## 2. Routing widoku
- Ścieżka: `/decks/:deckId/cards`
- Dostęp: Wyłącznie dla zalogowanych użytkowników, którzy są właścicielami talii

## 3. Struktura komponentów
```
DeckCardsPage
├── DeckCardsHeader
│   ├── DeckNameDisplay
│   ├── CardLimitDisplay
│   ├── ExportButton
│   └── ShareButton
├── CardActionBar
│   ├── AddCardButton
│   └── ViewToggle (awers/rewers)
├── CardGrid
│   └── CardItem
│       ├── CardThumbnail
│       └── CardActions (edycja, duplikacja, usunięcie)
├── Pagination
├── EmptyState (wyświetlany gdy brak kart)
└── DeleteConfirmationDialog
```

## 4. Szczegóły komponentów

### DeckCardsPage
- Opis komponentu: Główny komponent strony, koordynuje pobieranie danych i zarządza stanem widoku
- Główne elementy: 
  - Kontener dla wszystkich komponentów podrzędnych
  - Obsługa stanu ładowania i błędów
- Obsługiwane interakcje: 
  - Inicjalizacja zapytań API
  - Przekazywanie danych do komponentów podrzędnych
- Obsługiwana walidacja: 
  - Sprawdzenie poprawności parametru deckId
  - Weryfikacja dostępu użytkownika do talii
- Typy: 
  - CardListResponseDTO
  - DeckDTO
- Propsy: Brak (komponent najwyższego poziomu)

### DeckCardsHeader
- Opis komponentu: Pasek górny zawierający nazwę talii, informacje o limicie kart oraz przyciski eksportu i udostępniania
- Główne elementy: 
  - Nazwa talii
  - Wskaźnik liczby kart (x/100)
  - Przyciski akcji (eksport, udostępnianie)
- Obsługiwane interakcje: 
  - Kliknięcie przycisku eksportu
  - Kliknięcie przycisku udostępniania
- Obsługiwana walidacja: Brak
- Typy: 
  - DeckViewModel (nazwa, liczba kart)
- Propsy: 
  - `deck: DeckViewModel`
  - `onExport: () => void`
  - `onShare: () => void`

### CardLimitDisplay
- Opis komponentu: Wyświetla pasek postępu limitu kart z tooltipem
- Główne elementy: 
  - Pasek postępu
  - Etykieta tekstowa (x/100)
  - Tooltip z informacją o limicie
- Obsługiwane interakcje: Hover na pasku postępu pokazuje tooltip
- Obsługiwana walidacja: Brak
- Typy: Brak
- Propsy: 
  - `currentCount: number`
  - `maxLimit: number = 100`

### CardActionBar
- Opis komponentu: Pasek z przyciskiem dodawania nowej karty i przełącznikiem widoku
- Główne elementy: 
  - Przycisk dodawania karty (disabled gdy osiągnięto limit)
  - Przełącznik widoku awers/rewers
- Obsługiwane interakcje: 
  - Kliknięcie przycisku dodawania karty
  - Zmiana widoku awers/rewers
- Obsługiwana walidacja: 
  - Przycisk dodawania jest wyłączony gdy limit 100 kart jest osiągnięty
- Typy: Brak
- Propsy: 
  - `cardCount: number`
  - `maxLimit: number = 100`
  - `isCardSideBack: boolean`
  - `onAddCard: () => void`
  - `onToggleCardSide: () => void`

### CardGrid
- Opis komponentu: Responsywna siatka kart, dostosowująca liczbę kolumn do szerokości ekranu
- Główne elementy: 
  - Kontenery dla kart w układzie grid
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: 
  - `CardViewModel[]`
- Propsy: 
  - `cards: CardViewModel[]`
  - `isCardSideBack: boolean`
  - `onCardEdit: (cardId: string) => void`
  - `onCardDelete: (cardId: string) => void`

### CardItem
- Opis komponentu: Pojedynczy element karty wyświetlany w siatce
- Główne elementy: 
  - Miniatura karty (awers lub rewers)
  - Menu akcji (edycja, duplikacja, usunięcie)
- Obsługiwane interakcje: 
  - Hover nad kartą pokazuje menu akcji
  - Kliknięcie przycisku edycji
  - Kliknięcie przycisku duplikacji
  - Kliknięcie przycisku usunięcia
- Obsługiwana walidacja: Brak
- Typy: 
  - CardViewModel
- Propsy: 
  - `card: CardViewModel`
  - `isCardSideBack: boolean`
  - `onEdit: () => void`
  - `onDelete: () => void`

### Pagination
- Opis komponentu: Komponent paginacji do nawigacji między stronami wyników
- Główne elementy: 
  - Przyciski nawigacji (poprzednia/następna strona)
  - Wskaźnik bieżącej strony
- Obsługiwane interakcje: 
  - Kliknięcie przycisku zmiany strony
- Obsługiwana walidacja: 
  - Przyciski poprzedniej/następnej strony są wyłączone gdy nie ma więcej stron
- Typy: 
  - PaginationModel
- Propsy: 
  - `pagination: PaginationModel`
  - `onPageChange: (page: number) => void`

### EmptyState
- Opis komponentu: Widok wyświetlany gdy talia nie zawiera żadnych kart
- Główne elementy: 
  - Ilustracja stanu pustego
  - Komunikat tekstowy
  - Przycisk dodawania pierwszej karty
- Obsługiwane interakcje: 
  - Kliknięcie przycisku dodawania karty
- Obsługiwana walidacja: Brak
- Typy: Brak
- Propsy: 
  - `onAddCard: () => void`

### DeleteConfirmationDialog
- Opis komponentu: Modal potwierdzający usunięcie karty
- Główne elementy: 
  - Komunikat ostrzegawczy
  - Przyciski potwierdzenia/anulowania
- Obsługiwane interakcje: 
  - Kliknięcie przycisku potwierdzenia
  - Kliknięcie przycisku anulowania
- Obsługiwana walidacja: Brak
- Typy: Brak
- Propsy: 
  - `isOpen: boolean`
  - `cardTitle: string`
  - `onConfirm: () => void`
  - `onCancel: () => void`

## 5. Typy
### CardViewModel
```typescript
// Model widoku dla pojedynczej karty
export interface CardViewModel extends CardDTO {
  thumbnailUrl: string;       // URL miniatury karty (awers)
  backThumbnailUrl: string;   // URL miniatury karty (rewers)
}

// Parametry listy kart (rozszerzenie PaginationParams)
export interface CardListParams extends PaginationParams {
  viewMode?: 'front' | 'back'; // tryb wyświetlania (awers/rewers)
}

// Stan filtrów widoku kart
export interface CardFilterState {
  page: number;              // aktualna strona
  limit: number;             // liczba kart na stronę
  isCardSideBack: boolean;   // czy pokazywać rewersy kart
}

// Informacje o limicie kart
export interface CardLimitInfo {
  totalCards: number;       // aktualna liczba kart
  cardLimit: number;        // maksymalna liczba kart (100)
}
```

## 6. Zarządzanie stanem
Zarządzanie stanem widoku będzie realizowane przez customowy hook `useCardList`, który będzie odpowiedzialny za:

```typescript
function useCardList(deckId: string) {
  // Stan podstawowy
  const [cards, setCards] = useState<CardViewModel[]>([]);
  const [pagination, setPagination] = useState<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  const [filters, setFilters] = useState<CardFilterState>({
    page: 1,
    limit: 20,
    isCardSideBack: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stan modali
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Stan eksportu
  const [exportStatus, setExportStatus] = useState<ExportStatus>({
    isExporting: false
  });
  
  // Funkcje pobierania danych
  async function fetchCards() {...}
  
  // Funkcje akcji na kartach
  async function addCard() {...}
  async function editCard(cardId: string) {...}
  async function deleteCard(cardId: string) {...}
  
  // Funkcje zarządzania paginacją
  function changePage(page: number) {...}
  
  // Funkcje eksportu i udostępniania
  async function exportToPdf() {...}
  async function shareDeck() {...}
  
  // Funkcje zarządzania stanem UI
  function toggleCardSide() {...}
  function showDeleteConfirmation(cardId: string) {...}
  function cancelDelete() {...}
  
  return {
    cards,
    pagination,
    filters,
    isLoading,
    error,
    showDeleteDialog,
    cardToDelete,
    exportStatus,
    fetchCards,
    addCard,
    editCard,
    showDeleteConfirmation,
    cancelDelete,
    confirmDelete: deleteCard,
    changePage,
    exportToPdf,
    shareDeck,
    toggleCardSide
  };
}
```

## 7. Integracja API
Widok integruje się z endpointem API `/decks/{deckId}/cards` przy użyciu fetch API.

```typescript
// Pobieranie listy kart
async function fetchCards(deckId: string, page: number, limit: number): Promise<CardListResponseDTO> {
  const response = await fetch(`/api/decks/${deckId}/cards?page=${page}&limit=${limit}`);
  
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Brak dostępu do talii');
    } else if (response.status === 404) {
      throw new Error('Talia nie istnieje');
    } else {
      throw new Error('Wystąpił błąd podczas pobierania kart');
    }
  }
  
  return await response.json();
}

// Usuwanie karty
async function deleteCard(deckId: string, cardId: string): Promise<void> {
  const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Nie udało się usunąć karty');
  }
}
```

## 8. Interakcje użytkownika
1. **Przeglądanie kart**
   - Użytkownik wchodzi na stronę `/decks/:deckId/cards`
   - System ładuje pierwszą stronę kart (maksymalnie 20 na stronę)
   - Karty są wyświetlane jako miniatury awersów
   - Użytkownik może przełączyć widok na rewersy kart

2. **Zmiana strony**
   - Użytkownik klika przycisk następnej/poprzedniej strony
   - System pobiera odpowiednią stronę kart
   - UI jest aktualizowany z nowymi kartami

3. **Dodawanie karty**
   - Użytkownik klika przycisk "Dodaj kartę"
   - System przekierowuje do widoku tworzenia karty

4. **Edycja karty**
   - Użytkownik najeżdża na kartę, pojawia się menu akcji
   - Użytkownik klika przycisk edycji
   - System przekierowuje do widoku edycji karty

5. **Duplikowanie karty**
   - Użytkownik klika przycisk duplikacji na karcie
   - System tworzy kopię karty i odświeża listę
   - Jeśli osiągnięto limit 100 kart, wyświetlany jest komunikat błędu

6. **Usuwanie karty**
   - Użytkownik klika przycisk usunięcia na karcie
   - System wyświetla modal potwierdzenia
   - Po potwierdzeniu karta jest usuwana, lista jest odświeżana

7. **Udostępnianie talii**
   - Użytkownik klika przycisk "Udostępnij"
   - System generuje link do udostępniania
   - Link jest wyświetlany użytkownikowi do skopiowania

## 9. Warunki i walidacja
1. **Limit kart**
   - Walidacja: Talia może zawierać maksymalnie 100 kart
   - Komponent: CardActionBar
   - Wpływ na UI: Przycisk "Dodaj kartę" jest wyłączony gdy osiągnięto limit

2. **Dostęp do talii**
   - Walidacja: Użytkownik musi być właścicielem talii
   - Komponent: DeckCardsPage
   - Wpływ na UI: Przekierowanie do strony błędu 403 przy braku dostępu

3. **Istnienie talii**
   - Walidacja: Talia musi istnieć
   - Komponent: DeckCardsPage
   - Wpływ na UI: Przekierowanie do strony błędu 404 gdy talia nie istnieje

4. **Paginacja**
   - Walidacja: Numer strony musi być większy od 0
   - Komponent: Pagination
   - Wpływ na UI: Przyciski poprzedniej/następnej strony są wyłączone gdy nie ma więcej stron

## 10. Obsługa błędów
1. **Błąd pobierania kart**
   - Scenariusz: Błąd API podczas pobierania listy kart
   - Obsługa: Wyświetlenie komunikatu błędu i przycisku ponowienia próby
   - Komponenty: ErrorState wewnątrz DeckCardsPage

2. **Błąd usuwania karty**
   - Scenariusz: Błąd API podczas usuwania karty
   - Obsługa: Wyświetlenie powiadomienia o błędzie, lista nie jest odświeżana

3. **Błąd duplikowania - limit kart**
   - Scenariusz: Próba duplikowania karty po osiągnięciu limitu 100 kart
   - Obsługa: Wyświetlenie komunikatu o osiągnięciu limitu kart

4. **Błąd eksportu do PDF**
   - Scenariusz: Błąd generowania pliku PDF
   - Obsługa: Wyświetlenie komunikatu błędu i możliwość ponowienia próby

5. **Błąd autoryzacji**
   - Scenariusz: Użytkownik nie ma dostępu do talii
   - Obsługa: Przekierowanie do strony błędu 403

## 11. Kroki implementacji

1. **Przygotowanie środowiska**
   - Utworzenie pliku strony `/src/pages/decks/[deckId]/cards.astro`
   - Utworzenie głównego komponentu React `DeckCardsPage.tsx` w katalogu `/src/components/decks/`

2. **Implementacja komponentów UI**
   - Implementacja `DeckCardsHeader.tsx`
   - Implementacja `CardLimitDisplay.tsx`
   - Implementacja `CardActionBar.tsx`
   - Implementacja `CardGrid.tsx` i `CardItem.tsx`
   - Implementacja `DeleteConfirmationDialog.tsx`
   - Zastosowanie komponentu `Pagination.tsx` z istniejącej implementacji

3. **Implementacja customowego hooka**
   - Utworzenie pliku `useCardList.ts` w katalogu `/src/hooks/`
   - Implementacja pobierania danych i zarządzania stanem
   - Implementacja akcji: dodawanie, edycja, duplikacja, usuwanie
   - Implementacja funkcji eksportu i udostępniania

4. **Implementacja funkcji API**
   - Utworzenie lub rozszerzenie pliku `lib/api/cards.ts`
   - Implementacja funkcji pobierania listy kart
   - Implementacja funkcji usuwania, duplikowania karty
   - Implementacja funkcji eksportu talii do PDF

5. **Integracja komponentów**
   - Integracja wszystkich komponentów w `DeckCardsPage`
   - Dodanie obsługi ładowania i błędów
   - Implementacja stanu pustego (EmptyState)

6. **Implementacja strony Astro**
   - Dodanie komponentu React `DeckCardsPage` do pliku Astro
   - Konfiguracja strony z odpowiednimi nagłówkami i metadanymi

7. **Testowanie i debugowanie**
   - Testowanie wszystkich funkcji i interakcji
   - Weryfikacja responsywności widoku
   - Testowanie obsługi błędów i przypadków brzegowych

8. **Finalizacja**
   - Optymalizacja wydajności
   - Dodanie komentarzy i dokumentacji
   - Czyszczenie kodu i ostateczne poprawki 