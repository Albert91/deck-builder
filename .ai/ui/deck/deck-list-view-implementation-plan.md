# Plan implementacji widoku listy talii

## 1. Przegląd
Widok listy talii pozwala zalogowanemu użytkownikowi przeglądać wszystkie utworzone przez niego talie kart. Użytkownik może zobaczyć podstawowe informacje o każdej talii, filtrować i sortować wyniki oraz wybrać talię do edycji lub eksportu. Widok informuje również o całkowitej liczbie talii i wykorzystaniu limitu (x/5).

## 2. Routing widoku
- Ścieżka: `/decks`
- Wymagana autentykacja: Tak
- Przekierowanie dla niezalogowanych: `/auth/login?redirect=/decks`

## 3. Struktura komponentów
```
DeckListPage
├── DeckListHeader
├── DeckFilterBar
├── LoadingState (warunkowy)
├── ErrorState (warunkowy)
├── EmptyState (warunkowy)
├── DeckGrid
│   ├── DeckCard (wielokrotny)
│   └── ...
└── Pagination
```

## 4. Szczegóły komponentów

### DeckListPage
- Opis komponentu: Główny kontener dla widoku listy talii, odpowiedzialny za pobieranie danych i zarządzanie stanem
- Główne elementy: Layout Astro, nagłówek, pasek filtrów, siatka talii, paginacja
- Obsługiwane interakcje: Zmiana strony, zmiana filtrów, sortowanie
- Obsługiwana walidacja: Sprawdzanie autentykacji użytkownika
- Typy: `DeckListResponseDTO`, `DeckViewModel`, `DeckListParams`
- Propsy: Brak (komponent najwyższego poziomu)

### DeckListHeader
- Opis komponentu: Nagłówek wyświetlający tytuł widoku oraz informację o liczbie talii i limicie (x/5)
- Główne elementy: Tytuł (h1), licznik talii, przycisk "Utwórz nową talię"
- Obsługiwane interakcje: Kliknięcie przycisku "Utwórz nową talię"
- Obsługiwana walidacja: Sprawdzanie czy limit talii został osiągnięty
- Typy: `DeckLimitInfo`
- Propsy: `totalDecks: number`, `deckLimit: number`, `onCreateDeck: () => void`

### DeckFilterBar
- Opis komponentu: Pasek narzędzi z opcjami filtrowania i sortowania talii
- Główne elementy: Pole wyszukiwania, dropdown sortowania, kontrolki kierunku sortowania
- Obsługiwane interakcje: Wprowadzanie tekstu wyszukiwania, wybór opcji sortowania
- Obsługiwana walidacja: Brak
- Typy: `DeckFilterState`, `DeckSortOption`
- Propsy: `filters: DeckFilterState`, `onFilterChange: (filters: DeckFilterState) => void`, `sortOptions: DeckSortOption[]`

### DeckGrid
- Opis komponentu: Responsywna siatka wyświetlająca karty talii
- Główne elementy: Kontener grid z komponentami DeckCard
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: `DeckViewModel[]`
- Propsy: `decks: DeckViewModel[]`, `onDeckSelect: (deckId: string) => void`

### DeckCard
- Opis komponentu: Karta reprezentująca pojedynczą talię
- Główne elementy: Miniatura, nazwa talii, liczba kart, data aktualizacji, opcje (menu kontekstowe)
- Obsługiwane interakcje: Kliknięcie karty, kliknięcie menu opcji
- Obsługiwana walidacja: Brak
- Typy: `DeckViewModel`
- Propsy: `deck: DeckViewModel`, `onClick: () => void`, `onOptionsClick: (option: string, deck: DeckViewModel) => void`

### Pagination
- Opis komponentu: Kontrolki paginacji dla nawigacji między stronami talii
- Główne elementy: Przyciski poprzednia/następna strona, numery stron, wybór liczby elementów na stronę
- Obsługiwane interakcje: Zmiana strony, zmiana liczby elementów na stronę
- Obsługiwana walidacja: Sprawdzanie czy numer strony jest w zakresie
- Typy: `PaginationModel`
- Propsy: `pagination: PaginationModel`, `onPageChange: (page: number) => void`, `onLimitChange: (limit: number) => void`

### EmptyState
- Opis komponentu: Stan wyświetlany gdy użytkownik nie ma żadnych talii
- Główne elementy: Ilustracja, komunikat, przycisk CTA
- Obsługiwane interakcje: Kliknięcie przycisku "Utwórz pierwszą talię"
- Obsługiwana walidacja: Brak
- Typy: Brak
- Propsy: `onCreateDeck: () => void`

### LoadingState
- Opis komponentu: Stan ładowania wyświetlany podczas pobierania danych
- Główne elementy: Animacja ładowania, tekst informacyjny
- Obsługiwane interakcje: Brak
- Obsługiwana walidacja: Brak
- Typy: Brak
- Propsy: Brak

### ErrorState
- Opis komponentu: Stan błędu wyświetlany gdy wystąpi problem z pobieraniem danych
- Główne elementy: Ikona błędu, komunikat, przycisk ponowienia
- Obsługiwane interakcje: Kliknięcie przycisku "Spróbuj ponownie"
- Obsługiwana walidacja: Brak
- Typy: `{ message: string }`
- Propsy: `error: { message: string }`, `onRetry: () => void`

## 5. Typy

```typescript
// Istniejące typy z pliku types.ts
// import { DeckDTO, DeckListResponseDTO, SearchParams } from '../types';

// Nowe typy do implementacji widoku

// Model widoku dla pojedynczej talii
interface DeckViewModel extends DeckDTO {
  cardCount: number;       // liczba kart w talii
  thumbnailUrl: string;    // URL miniatury talii
}

// Parametry listy talii (rozszerzenie SearchParams)
interface DeckListParams extends SearchParams {
  sortBy?: string;          // pole po którym sortujemy
  sortOrder?: 'asc' | 'desc'; // kierunek sortowania
}

// Model paginacji
interface PaginationModel {
  currentPage: number;     // aktualna strona
  totalPages: number;      // całkowita liczba stron
  totalItems: number;      // całkowita liczba elementów
  itemsPerPage: number;    // liczba elementów na stronę
}

// Opcje sortowania talii
interface DeckSortOption {
  id: string;              // identyfikator opcji
  label: string;           // etykieta wyświetlana użytkownikowi
  value: string;           // wartość używana w API
}

// Stan filtrów
interface DeckFilterState {
  search: string;          // tekst wyszukiwania
  sortBy: string;          // pole sortowania
  sortOrder: 'asc' | 'desc'; // kierunek sortowania
}

// Informacje o limicie talii
interface DeckLimitInfo {
  totalDecks: number;      // aktualna liczba talii
  deckLimit: number;       // maksymalna liczba talii (5)
}
```

## 6. Zarządzanie stanem

### Custom Hook: useDeckList
```typescript
function useDeckList(initialParams: DeckListParams = { page: 1, limit: 12 }) {
  // Stan
  const [decks, setDecks] = useState<DeckViewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<DeckListParams>(initialParams);
  const [pagination, setPagination] = useState<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: initialParams.limit || 12
  });

  // Efekty
  useEffect(() => {
    fetchDecks(params);
  }, [params]);

  // Metody
  const fetchDecks = async (queryParams: DeckListParams) => {
    setIsLoading(true);
    setError(null);
    try {
      // Wywołanie API
      const response = await fetch(`/api/decks?${new URLSearchParams({
        page: String(queryParams.page || 1),
        limit: String(queryParams.limit || 12),
        ...(queryParams.search ? { search: queryParams.search } : {}),
        ...(queryParams.sortBy ? { sortBy: queryParams.sortBy } : {}),
        ...(queryParams.sortOrder ? { sortOrder: queryParams.sortOrder } : {})
      })}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DeckListResponseDTO = await response.json();
      
      // Przekształcenie DTO na ViewModel
      const deckViewModels: DeckViewModel[] = data.items.map(deck => ({
        ...deck,
        cardCount: 0, // To zostanie uzupełnione w dodatkowym wywołaniu lub musi być dostarczone przez API
        thumbnailUrl: `/assets/deck-thumbnails/${deck.id}.jpg` // Przykładowe mapowanie
      }));
      
      // Uzupełnienie liczby kart (jeśli API nie dostarcza tej informacji)
      // Tutaj można dodać dodatkowe wywołanie API lub logikę
      
      setDecks(deckViewModels);
      setPagination({
        currentPage: queryParams.page || 1,
        totalPages: Math.ceil(data.totalCount / (queryParams.limit || 12)),
        totalItems: data.totalCount,
        itemsPerPage: queryParams.limit || 12
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Wystąpił nieznany błąd'));
    } finally {
      setIsLoading(false);
    }
  };

  // Metody aktualizacji parametrów
  const setPage = (page: number) => setParams(prev => ({ ...prev, page }));
  const setLimit = (limit: number) => setParams(prev => ({ ...prev, limit, page: 1 }));
  const setSearch = (search: string) => setParams(prev => ({ ...prev, search, page: 1 }));
  const setSortBy = (sortBy: string) => setParams(prev => ({ ...prev, sortBy, page: 1 }));
  const setSortOrder = (sortOrder: 'asc' | 'desc') => setParams(prev => ({ ...prev, sortOrder, page: 1 }));
  
  // Zapisywanie preferencji użytkownika
  useEffect(() => {
    localStorage.setItem('deckListPreferences', JSON.stringify({
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      limit: params.limit
    }));
  }, [params.sortBy, params.sortOrder, params.limit]);

  return {
    decks,
    isLoading,
    error,
    pagination,
    params,
    setPage,
    setLimit,
    setSearch,
    setSortBy,
    setSortOrder,
    refetch: () => fetchDecks(params)
  };
}
```

## 7. Integracja API

### Endpointy

1. **GET /api/decks**
   - Cel: Pobieranie listy talii z paginacją, sortowaniem i filtrowaniem
   - Parametry:
     - page: numer strony (domyślnie 1)
     - limit: liczba elementów na stronę (domyślnie 12)
     - search: opcjonalny tekst wyszukiwania
     - sortBy: pole do sortowania (np. name, created_at, updated_at)
     - sortOrder: kierunek sortowania (asc, desc)
   - Odpowiedź: `DeckListResponseDTO`
   - Obsługa błędów: 401 (Unauthorized), 500 (Server Error)

2. **GET /api/decks/count**
   - Cel: Pobieranie liczby talii użytkownika i limitu
   - Odpowiedź: `{ totalDecks: number, deckLimit: number }`
   - Obsługa błędów: 401 (Unauthorized), 500 (Server Error)

### Implementacja wywołań API

Główna integracja API jest realizowana w hooku `useDeckList`, który obsługuje:
- Pobieranie danych z odpowiednimi parametrami
- Transformację DTO na modele widoku
- Obsługę błędów
- Zarządzanie stanem ładowania

Dodatkowo, w komponencie `DeckListHeader` musi być zaimplementowane pobieranie informacji o limicie talii:

```typescript
const fetchDeckLimit = async () => {
  try {
    const response = await fetch('/api/decks/count');
    if (!response.ok) throw new Error('Nie udało się pobrać informacji o limicie');
    const data: DeckLimitInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Błąd podczas pobierania limitu talii:', error);
    return { totalDecks: 0, deckLimit: 5 }; // Wartości domyślne
  }
};
```

## 8. Interakcje użytkownika

1. **Wyszukiwanie talii**
   - Użytkownik wpisuje tekst w pole wyszukiwania
   - System debounce'uje wprowadzanie tekstu (300ms)
   - System aktualizuje parametr `search` w `useDeckList`
   - Lista talii jest odświeżana z nowym filtrem

2. **Sortowanie talii**
   - Użytkownik wybiera opcję sortowania z dropdownu
   - System aktualizuje parametry `sortBy` i ewentualnie `sortOrder`
   - Lista talii jest odświeżana z nowym sortowaniem

3. **Zmiana strony**
   - Użytkownik klika numer strony, przycisk "Następna" lub "Poprzednia"
   - System aktualizuje parametr `page` w `useDeckList`
   - Lista talii jest odświeżana dla wybranej strony

4. **Zmiana liczby elementów na stronę**
   - Użytkownik wybiera nową wartość z dropdownu
   - System aktualizuje parametr `limit` w `useDeckList`
   - Lista talii jest odświeżana z nową liczbą elementów i resetuje stronę na 1

5. **Wybór talii**
   - Użytkownik klika kartę talii
   - System nawiguje do widoku szczegółów talii `/decks/{deckId}`

6. **Tworzenie nowej talii**
   - Użytkownik klika przycisk "Utwórz nową talię"
   - System sprawdza czy nie osiągnięto limitu talii
   - Jeśli limit nie został osiągnięty, system nawiguje do widoku tworzenia talii `/decks/new`
   - Jeśli limit został osiągnięty, system wyświetla komunikat o ograniczeniu

## 9. Warunki i walidacja

1. **Limit talii**
   - Warunek: Użytkownik może mieć maksymalnie 5 talii
   - Komponenty: `DeckListHeader`
   - Wpływ na UI: Przycisk "Utwórz nową talię" jest wyłączony gdy osiągnięto limit

2. **Zakres paginacji**
   - Warunek: Numer strony musi być dodatni i nie większy niż liczba dostępnych stron
   - Komponenty: `Pagination`
   - Wpływ na UI: Przyciski stron poza zakresem są wyłączone

3. **Wyszukiwanie**
   - Warunek: Tekst wyszukiwania jest przycinany i sanityzowany
   - Komponenty: `DeckFilterBar`
   - Wpływ na UI: Wyświetlane są tylko pasujące wyniki

4. **Autentykacja**
   - Warunek: Użytkownik musi być zalogowany aby uzyskać dostęp do widoku
   - Komponenty: `DeckListPage`
   - Wpływ na UI: Przekierowanie do strony logowania jeśli użytkownik nie jest zalogowany

## 10. Obsługa błędów

1. **Błąd pobierania danych**
   - Scenariusz: Nie udało się pobrać listy talii
   - Obsługa: Wyświetlenie komponentu `ErrorState` z komunikatem błędu i opcją ponowienia
   - Komunikat: "Nie udało się załadować talii. Spróbuj ponownie."

2. **Błąd autentykacji**
   - Scenariusz: Sesja użytkownika wygasła lub token jest nieprawidłowy
   - Obsługa: Przekierowanie do strony logowania z parametrem powrotu
   - Komunikat: "Twoja sesja wygasła. Zaloguj się ponownie."

3. **Pusta lista talii**
   - Scenariusz: Użytkownik nie ma żadnych talii lub filtrowanie nie zwróciło wyników
   - Obsługa: Wyświetlenie komponentu `EmptyState` z odpowiednim komunikatem
   - Komunikat: "Nie masz jeszcze żadnych talii. Utwórz swoją pierwszą talię!" lub "Brak wyników dla podanych kryteriów wyszukiwania."

4. **Błąd serwera**
   - Scenariusz: Serwer zwraca kod 500 lub inny błąd
   - Obsługa: Wyświetlenie ogólnego komunikatu błędu z opcją ponowienia
   - Komunikat: "Wystąpił błąd serwera. Spróbuj ponownie później."

## 11. Kroki implementacji

1. Zdefiniowanie nowych typów i interfejsów w odpowiednim pliku w katalogu `src/types.ts` lub w dedykowanym pliku dla widoku.

2. Implementacja hooka `useDeckList` w katalogu `src/lib/hooks/useDeckList.ts`:
   - Definiowanie stanu i logiki pobierania danych
   - Implementacja metod zarządzania parametrami
   - Dodanie obsługi błędów i loadingu

3. Utworzenie komponentów pomocniczych w katalogu `src/components`:
   - Implementacja `DeckCard.tsx`
   - Implementacja `Pagination.tsx`
   - Implementacja `EmptyState.tsx`, `LoadingState.tsx` i `ErrorState.tsx`

4. Implementacja głównych komponentów widoku:
   - Utworzenie `DeckFilterBar.tsx` z logiką filtrowania i sortowania
   - Utworzenie `DeckListHeader.tsx` z informacją o limicie
   - Utworzenie `DeckGrid.tsx` dla wyświetlania siatki talii

5. Integracja wszystkich komponentów w głównym komponencie strony `src/pages/decks/index.astro` lub `src/pages/decks/index.tsx`:
   - Import wszystkich komponentów
   - Użycie hooka `useDeckList`
   - Warunkowe renderowanie odpowiednich stanów (loading, error, empty)
   - Dodanie obsługi wydarzeń i nawigacji

6. Testowanie i debugowanie:
   - Weryfikacja poprawności renderowania komponentów
   - Testowanie funkcjonalności filtrowania i sortowania
   - Testowanie paginacji
   - Testowanie obsługi błędów

7. Dodanie stylów i poprawek UX:
   - Implementacja responsywnego designu dla różnych rozmiarów ekranu
   - Dodanie animacji dla płynniejszego UX
   - Optymalizacja wydajności (np. wirtualizacja dla dużych list)

8. Finalizacja i dokumentacja:
   - Przegląd zgodności z wymaganiami użytkownika
   - Weryfikacja dostępności (a11y)
   - Dodanie komentarzy do kodu i dokumentacji dla innych programistów 