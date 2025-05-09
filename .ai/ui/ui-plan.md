
# Architektura UI dla AI Card Deck Creator

## 1. Przegląd struktury UI

Architektura UI dla AI Card Deck Creator opiera się na trzech głównych sekcjach funkcjonalnych, które odzwierciedlają naturalny przepływ pracy użytkownika. Interfejs jest w pełni responsywny, z układem adaptującym się do różnych rozmiarów ekranów (mobile, tablet, desktop). System wykorzystuje motyw jasny/ciemny przełączany ręcznie oraz responsywną nawigację składającą się z pełnego menu na desktop i wysuwanego menu na urządzeniach mobilnych, uzupełnionego o breadcrumbs.

Główne sekcje aplikacji:
- **Autentykacja**: Rejestracja i logowanie (hasło/OTP)
- **Zarządzanie taliami**: Dashboard z listą talii użytkownika
- **Edycja talii/kart**: Szczegółowy widok tworzenia i edycji talii oraz kart

## 2. Lista widoków

### 2.1. Widok logowania/rejestracji
- **Ścieżka**: `/auth`
- **Główny cel**: Umożliwienie użytkownikowi utworzenia konta lub zalogowania się
- **Kluczowe informacje**: Formularze logowania (hasło/OTP), formularz rejestracji
- **Kluczowe komponenty**:
  - Przełącznik między logowaniem a rejestracją
  - Przełącznik metody logowania (hasło/OTP)
  - Formularz z walidacją pól
  - Przyciski akcji (Zaloguj/Zarejestruj)
- **Względy UX/dostępności/bezpieczeństwa**:
  - Wyraźne komunikaty o błędach
  - Walidacja formularzy
  - Zabezpieczenie przed atakami typu CSRF

### 2.2. Dashboard użytkownika
- **Ścieżka**: `/decks`
- **Główny cel**: Prezentacja listy talii użytkownika i zarządzanie nimi
- **Kluczowe informacje**: 
  - Lista talii z miniaturami (losowa karta)
  - Pasek postępu limitu talii (x/5) z tooltipem
  - Sortowanie alfabetyczne
- **Kluczowe komponenty**:
  - Responsywna siatka talii
  - Przycisk tworzenia nowej talii (disabled gdy limit osiągnięty)
  - Akcje dla każdej talii (edycja, usunięcie)
  - Przełącznik trybu jasny/ciemny
- **Względy UX/dostępności/bezpieczeństwa**:
  - Stan pusty (gdy brak talii)
  - Potwierdzenie usunięcia talii
  - Dostępność przez klawiaturę

### 2.3. Kreator/edytor talii
- **Ścieżka**: `/decks/new` lub `/decks/:deckId/edit`
- **Główny cel**: Tworzenie nowej talii lub edycja istniejącej
- **Kluczowe informacje**:
  - Nazwa talii
  - Podgląd awersu i rewersu talii
- **Kluczowe komponenty**:
  - Pole edycji nazwy talii
  - Generator tła (prompt AI)
  - Generator rewersu (prompt AI)
  - Podgląd obu stron
  - Blokada UI podczas generowania
- **Względy UX/dostępności/bezpieczeństwa**:
  - Automatyczny zapis zmian
  - Komunikat podczas generowania AI
  - Toast notification dla błędów
  - Odblokowanie UI po błędzie

### 2.4. Widok listy kart w talii
- **Ścieżka**: `/decks/:deckId/cards`
- **Główny cel**: Prezentacja wszystkich kart w talii i zarządzanie nimi
- **Kluczowe informacje**:
  - Lista kart (awers)
  - Pasek postępu limitu kart (x/100) z tooltipem
- **Kluczowe komponenty**:
  - Responsywna siatka kart (2/4/flex kolumn)
  - Przycisk dodawania nowej karty (disabled gdy limit)
  - Akcje dla każdej karty (edycja, duplikacja, usunięcie)
  - Przyciski eksportu PDF i udostępniania
- **Względy UX/dostępności/bezpieczeństwa**:
  - Potwierdzenie usunięcia karty
  - Stan pusty (gdy brak kart)
  - Wskaźnik statusu eksportu

### 2.5. Edytor karty
- **Ścieżka**: `/decks/:deckId/cards/new` lub `/decks/:deckId/cards/:cardId/edit`
- **Główny cel**: Tworzenie nowej karty lub edycja istniejącej
- **Kluczowe informacje**:
  - Tytuł i opis karty
  - Atrybuty karty (strength, defense, health)
  - Podgląd karty (awers)
- **Kluczowe komponenty**:
  - Pola edycji tytułu i opisu
  - Suwaki dla atrybutów (0-99, domyślnie 0)
  - Podgląd karty w czasie rzeczywistym
  - Blokada UI podczas generowania AI
- **Względy UX/dostępności/bezpieczeństwa**:
  - Automatyczny zapis zmian
  - Komunikat "Tworzenie obrazu karty" podczas generowania
  - Odblokowanie UI po błędzie

### 2.6. Widok udostępnionej talii
- **Ścieżka**: `/shared/:shareHash`
- **Główny cel**: Prezentacja talii w trybie tylko do odczytu dla osób z linkiem
- **Kluczowe informacje**:
  - Lista kart w trybie tylko do odczytu
  - Nazwa talii
- **Kluczowe komponenty**:
  - Responsywna siatka kart (2/4/flex kolumn)
  - Wyraźne oznaczenie trybu "tylko do odczytu"
- **Względy UX/dostępności/bezpieczeństwa**:
  - Brak przycisków edycji
  - Dostęp bez konieczności logowania
  - Zabezpieczenie przed nieautoryzowanym edytowaniem

## 3. Mapa podróży użytkownika

### 3.1. Rejestracja i pierwsze logowanie
1. Użytkownik odwiedza stronę logowania/rejestracji
2. Wybiera opcję rejestracji i wypełnia formularz
3. Po pomyślnej rejestracji, użytkownik jest automatycznie logowany
4. Użytkownik zostaje przekierowany do pustego dashboardu

### 3.2. Tworzenie talii
1. Użytkownik klika przycisk "Nowa talia" na dashboardzie
2. Wprowadza nazwę talii
4. Wprowadza prompt do generowania tła talii przez AI
   - UI jest blokowany z komunikatem o generowaniu
   - Po zakończeniu generowania, tło jest widoczne w podglądzie
5. Wprowadza prompt do generowania rewersu talii przez AI
   - Analogiczny proces jak przy tle
6. Klika "Dalej" aby przejść do listy kart

### 3.3. Zarządzanie kartami
1. Użytkownik widzi pustą listę kart (gdy nowa talia)
2. Klika przycisk "Dodaj kartę"
3. W edytorze karty:
   - Wprowadza tytuł i opis
   - System automatycznie generuje obraz na podstawie tytułu
   - Dostosowuje atrybuty karty (suwaki 0-99)
   - Zmiany są automatycznie zapisywane
4. Wraca do listy kart
5. Dodaje więcej kart / duplikuje istniejące
6. Edytuje/usuwa karty bezpośrednio z listy

### 3.4. Eksport i udostępnianie
1. Użytkownik klika przycisk "Eksportuj do PDF" na widoku listy kart
   - System generuje PDF (wskaźnik postępu)
   - Po zakończeniu, udostępnia link do pobrania
2. Użytkownik klika przycisk "Udostępnij"
   - System generuje unikalny URL
   - Użytkownik może skopiować link do schowka

### 3.5. Przeglądanie udostępnionej talii
1. Osoba otrzymująca link otwiera go w przeglądarce
2. Widzi talię w trybie tylko do odczytu
3. Może przeglądać wszystkie karty, ale nie może ich edytować

## 4. Układ i struktura nawigacji

### 4.1. Główna nawigacja
- **Desktop**: Stała belka górna zawierająca:
  - Logo (link do dashboardu)
  - Link do dashboardu
  - Przełącznik trybu jasny/ciemny
  - Menu użytkownika (wylogowanie)

- **Mobile**: Hamburger menu wysuwane z boku, zawierające te same elementy

### 4.2. Nawigacja kontekstowa
- **Breadcrumbs**: Wyświetlane pod główną nawigacją:
  - Dashboard > [Nazwa talii] > Lista kart
  - Dashboard > [Nazwa talii] > Edycja karty > [Nazwa karty]

### 4.3. Przechodzenie między widokami
- Z dashboardu do tworzenia/edycji talii
- Z edycji talii do listy kart
- Z listy kart do tworzenia/edycji karty
- Z listy kart do eksportu PDF
- Z listy kart do generowania linku udostępniającego

## 5. Kluczowe komponenty

### 5.1. DeckGrid
Responsywna siatka talii wyświetlająca miniatury talii z akcjami. Dostosowana do różnych rozmiarów ekranów (2 kolumny na mobile, 4 na tablet, elastycznie na desktop).

### 5.2. CardGrid
Podobna do DeckGrid, ale dla kart. Wyświetla karty w układzie kolumnowym z przyciskami akcji (edycja, duplikacja, usunięcie).

### 5.3. CardPreview
Komponent podglądu karty w czasie rzeczywistym, aktualizowany podczas edycji. Pokazuje tylko awers karty.

### 5.5. ProgressBar
Pasek postępu z tooltipem pokazującym aktualny stan limitu (x/5 talii lub x/100 kart).

### 5.6. AIGenerator
Komponent do wprowadzania promptu dla AI i wyświetlania statusu generowania. Blokuje interfejs podczas generowania z komunikatem informacyjnym.

### 5.7. AttributeSlider
Suwak do edycji atrybutów karty (strength, defense, health) z zakresem 0-99 i wartością domyślną 0.

### 5.8. ToastNotification
System powiadomień dla błędów (z rozróżnieniem grup 2xx, 4xx, 5xx) i komunikatów o sukcesie.

### 5.9. ConfirmationModal
Modal wyświetlany przed potencjalnie niebezpiecznymi operacjami (np. usunięcie talii/karty).

### 5.10. ThemeToggle
Przełącznik motywu jasnego/ciemnego w nagłówku aplikacji, bez respektowania preferencji systemowych.

### 5.11. Navigation
Komponenty nawigacyjne: menu główne (desktop/mobile) i breadcrumbs, dostosowane do rozmiaru ekranu.

### 5.12. ShareLink
Komponent do generowania i kopiowania linku udostępniającego talię.
