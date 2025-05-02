# Dokument wymagań produktu (PRD) - AI Card Deck Creator

## 1. Przegląd produktu

AI Card Deck Creator to platforma internetowa umożliwiająca szybkie i intuicyjne tworzenie własnych talii kart do gier bez potrzeby posiadania umiejętności projektowych. Aplikacja wykorzystuje sztuczną inteligencję do generowania grafik na podstawie opisów tekstowych, co pozwala użytkownikom na stworzenie profesjonalnie wyglądających kart w krótkim czasie.

Platforma skierowana jest do szerokiego grona odbiorców w wieku 18-99 lat, ze szczególnym uwzględnieniem entuzjastów gier typu "deck builder", którzy chcą tworzyć własne, unikalne talie bez czasochłonnego procesu projektowania. 

Główne cechy produktu:
- Generowanie jednolitego awersu i tyłu talii przez AI
- Tworzenie obrazów postaci/przedmiotów/miejsc na podstawie tytułu karty
- Edytor treści kart z podglądem na żywo
- System zarządzania taliami kart
- Eksport talii do formatu PDF gotowego do druku
- Możliwość udostępniania talii przez unikalny URL

## 2. Problem użytkownika

Ręczne tworzenie własnych talii kart do gier jest czasochłonne i wymaga umiejętności projektowych, co zniechęca użytkowników do tworzenia własnych, unikalnych gier karcianych. Potencjalni twórcy gier napotykają następujące wyzwania:

1. Brak umiejętności graficznych do stworzenia profesjonalnie wyglądających kart
2. Czasochłonny proces projektowania każdej karty indywidualnie
3. Trudność w zachowaniu spójnego stylu wizualnego dla całej talii
4. Skomplikowany proces przygotowania kart do druku
5. Ograniczony dostęp do narzędzi projektowych przyjaznych dla początkujących

AI Card Deck Creator rozwiązuje te problemy, oferując intuicyjny interfejs wspierany przez AI, który automatyzuje proces tworzenia grafik i zapewnia spójność wizualną całej talii, umożliwiając użytkownikom skoncentrowanie się na mechanice i treści gry, a nie na aspektach technicznych projektowania.

## 3. Wymagania funkcjonalne

### 3.1 System użytkowników
- Rejestracja i logowanie przez email
- Uwierzytelnianie za pomocą hasła lub jednorazowego kodu OTP (ważnego przez 15 minut)
- Przechowywanie talii na koncie użytkownika
- Limit do 5 talii po maksymalnie 100 kart na użytkownika

### 3.2 Generator kart oparty o AI
- Generowanie jednolitego awersu i tyłu talii przez AI (Openrouter.ai i Midjourney)
- Tworzenie obrazów postaci/przedmiotów/miejsc na podstawie tytułu karty
- Umieszczanie wygenerowanych obrazów na jednolitym tle
- Standardowy rozmiar kart: 66x91mm

### 3.3 Edytor kart
- Edycja tytułu i treści karty
- Podgląd na żywo podczas edycji
- Automatyczny zapis postępu prac

### 3.4 System szablonów kart
- Biblioteka 3-5 predefiniowanych szablonów kart reprezentujących różne style graficzne
- Wizualna karuzela szablonów z możliwością podglądu w kontekście talii
- Możliwość wyboru szablonu przed rozpoczęciem generowania kart
- Każdy szablon z zdefiniowanymi miejscami na tytuł, główny obrazek oraz tekst karty

### 3.5 System zarządzania taliami
- Tworzenie, przeglądanie, edycja i usuwanie talii
- Eksport talii do formatu PDF gotowego do druku

### 3.6 System udostępniania
- Generowanie unikalnego URL dla każdej talii kart
- Możliwość przeglądania udostępnionej talii bez konieczności logowania
- Podgląd talii w trybie tylko do odczytu dla osób z linkiem

### 3.7 Interfejs użytkownika
- Interfejs wyłącznie w języku angielskim
- Mapa ścieżki użytkownika od rejestracji do utworzenia pierwszej talii
- Intuicyjny proces tworzenia kart krok po kroku

### 3.8 Analityka
- Gromadzenie podstawowych danych o ilości utworzonych talii i kart
- Dane analityczne przechowywane bezpośrednio w bazie danych (bez zewnętrznych narzędzi)

## 4. Granice produktu

### Co wchodzi w zakres MVP:
- Generowanie kart przez AI na podstawie wprowadzonego tekstu i preferencji użytkownika
- Podstawowy edytor kart z funkcjami generowania tła i obrazów przez AI
- Zarządzanie taliami kart (tworzenie, przeglądanie, edycja, usuwanie)
- System kont użytkowników do przechowywania talii
- Eksport talii do formatu do druku (PDF)
- Udostępnianie talii przez unikalny URL

### Co NIE wchodzi w zakres MVP:
- Zaawansowane funkcje projektowania kart (warstwy, efekty, niestandardowe kształty)
- Wiele szablonów gier karcianych (poza podstawowymi 3-5)
- Współdzielenie talii między użytkownikami z możliwością wspólnej edycji
- Aplikacje mobilne (na początek tylko web)
- Integracja z popularnymi platformami gier karcianych
- Wybór niestandardowych rozmiarów i materiałów kart
- Możliwość dodawania własnych obrazów (tylko obrazy generowane przez AI)
- Elementy grywalizacji
- Specjalne wymagania dotyczące dostępności
- Wielojęzyczny interfejs (tylko język angielski)

## 5. Historyjki użytkowników

### US-001
- Tytuł: Rejestracja użytkownika
- Opis: Jako nowy użytkownik, chcę się zarejestrować w systemie, aby móc tworzyć i przechowywać własne talie kart.
- Kryteria akceptacji:
  - Użytkownik może zarejestrować się podając swój adres email
  - System weryfikuje, czy adres email jest poprawny i unikalny
  - Użytkownik może wybrać metodę uwierzytelniania: hasło lub OTP
  - Po pomyślnej rejestracji, użytkownik jest automatycznie zalogowany
  - System informuje użytkownika o pomyślnym utworzeniu konta

### US-002
- Tytuł: Logowanie użytkownika przez hasło
- Opis: Jako zarejestrowany użytkownik, chcę się zalogować za pomocą mojego emaila i hasła, aby uzyskać dostęp do moich talii kart.
- Kryteria akceptacji:
  - Użytkownik może wprowadzić swój email i hasło
  - System weryfikuje poprawność danych uwierzytelniających
  - W przypadku niepoprawnych danych, system wyświetla stosowny komunikat
  - Po pomyślnym uwierzytelnieniu, użytkownik jest przekierowany do swojego panelu
  - System zapewnia bezpieczne przechowywanie hasła (haszowanie)

### US-003
- Tytuł: Logowanie użytkownika przez OTP
- Opis: Jako zarejestrowany użytkownik, chcę się zalogować za pomocą jednorazowego kodu przesłanego na mój email, aby uzyskać dostęp do moich talii kart.
- Kryteria akceptacji:
  - Użytkownik może wybrać opcję logowania przez OTP
  - System generuje unikalny kod i wysyła go na adres email użytkownika
  - Kod jest ważny przez 15 minut
  - Użytkownik może wprowadzić otrzymany kod
  - System weryfikuje poprawność kodu
  - Po pomyślnym uwierzytelnieniu, użytkownik jest przekierowany do swojego panelu

### US-004
- Tytuł: Tworzenie nowej talii
- Opis: Jako zalogowany użytkownik, chcę utworzyć nową talię kart, aby rozpocząć proces tworzenia gry.
- Kryteria akceptacji:
  - Użytkownik może utworzyć nową talię, nadając jej nazwę
  - System weryfikuje, czy użytkownik nie przekroczył limitu 5 talii
  - Nowa talia jest zapisywana w systemie
  - Użytkownik jest przekierowany do edytora talii
  - System informuje użytkownika o pomyślnym utworzeniu talii

### US-005
- Tytuł: Wybór szablonu talii
- Opis: Jako użytkownik tworzący nową talię, chcę wybrać szablon wyglądu kart, aby zapewnić spójność wizualną.
- Kryteria akceptacji:
  - Użytkownik może przeglądać dostępne szablony kart (3-5 opcji) w formie karuzeli
  - Każdy szablon jest wyświetlany z podglądem przykładowej karty
  - Użytkownik może wybrać szablon dla swojej talii
  - Wybrany szablon jest zapisywany i stosowany do wszystkich kart w talii
  - Użytkownik może zmienić szablon w dowolnym momencie tworzenia talii

### US-006
- Tytuł: Generowanie tła talii przez AI
- Opis: Jako użytkownik tworzący talię, chcę wygenerować jednolite tło dla wszystkich kart w talii za pomocą AI, aby zapewnić spójność wizualną.
- Kryteria akceptacji:
  - Użytkownik może wprowadzić opis pożądanego tła (prompt)
  - System wykorzystuje AI (Openrouter.ai/Midjourney) do wygenerowania tła
  - Wygenerowane tło jest automatycznie dopasowywane do wybranego szablonu
  - System stosuje wygenerowane tło do awersu wszystkich kart w talii
  - Użytkownik ma możliwość regeneracji tła, jeśli nie jest zadowolony z wyniku

### US-007
- Tytuł: Generowanie rewersu kart przez AI
- Opis: Jako użytkownik tworzący talię, chcę wygenerować jednolity rewers (tył) dla wszystkich kart w talii za pomocą AI.
- Kryteria akceptacji:
  - Użytkownik może wprowadzić opis pożądanego rewersu kart (prompt)
  - System wykorzystuje AI do wygenerowania rewersu
  - Wygenerowany rewers jest automatycznie dopasowywany do standardowego rozmiaru karty (66x91mm)
  - System stosuje wygenerowany rewers do wszystkich kart w talii
  - Użytkownik ma możliwość regeneracji rewersu, jeśli nie jest zadowolony z wyniku

### US-008
- Tytuł: Dodawanie nowej karty do talii
- Opis: Jako użytkownik edytujący talię, chcę dodać nową kartę, aby rozbudować moją grę.
- Kryteria akceptacji:
  - Użytkownik może dodać nową kartę do talii
  - System weryfikuje, czy nie przekroczono limitu 100 kart w talii
  - Nowa karta jest tworzona z wybranym szablonem i tłem talii
  - Karta jest dodawana do talii i zapisywana w systemie
  - System informuje użytkownika o pomyślnym dodaniu karty

### US-009
- Tytuł: Generowanie obrazu głównego karty przez AI
- Opis: Jako użytkownik edytujący kartę, chcę wygenerować obraz postaci/przedmiotu/miejsca na podstawie tytułu karty za pomocą AI.
- Kryteria akceptacji:
  - Użytkownik wprowadza tytuł karty, który służy jako prompt dla AI
  - System wykorzystuje AI do wygenerowania obrazu odpowiadającego tytułowi
  - Wygenerowany obraz jest automatycznie umieszczany na karcie w miejscu przewidzianym przez szablon
  - Obraz jest skalowany i kadrowany, aby pasował do szablonu
  - Użytkownik ma możliwość regeneracji obrazu, jeśli nie jest zadowolony z wyniku

### US-010
- Tytuł: Edycja treści karty
- Opis: Jako użytkownik edytujący kartę, chcę zmodyfikować tytuł i opis karty, aby dostosować ją do potrzeb mojej gry.
- Kryteria akceptacji:
  - Użytkownik może edytować tytuł karty
  - Użytkownik może edytować tekst/opis karty
  - System wyświetla podgląd karty w czasie rzeczywistym podczas edycji
  - Zmiany są automatycznie zapisywane
  - System dostosowuje rozmiar tekstu, jeśli przekracza on dostępne miejsce na karcie

### US-011
- Tytuł: Przeglądanie talii
- Opis: Jako zalogowany użytkownik, chcę przeglądać listę moich talii, aby wybrać talię do edycji lub eksportu.
- Kryteria akceptacji:
  - Użytkownik widzi listę wszystkich swoich talii
  - Dla każdej talii wyświetlana jest jej nazwa, liczba kart i miniatura
  - Użytkownik może sortować i filtrować talie
  - Użytkownik może wybrać talię do dalszych działań
  - System informuje o całkowitej liczbie talii i wykorzystaniu limitu (x/5)

### US-012
- Tytuł: Przeglądanie kart w talii
- Opis: Jako użytkownik przeglądający talię, chcę zobaczyć wszystkie karty w talii, aby ocenić ich wygląd i spójność.
- Kryteria akceptacji:
  - Użytkownik widzi listę wszystkich kart w wybranej talii
  - Karty są wyświetlane w formie miniatur
  - Użytkownik może powiększyć dowolną kartę, aby zobaczyć szczegóły
  - Użytkownik może przełączać między widokiem awersu i rewersu kart
  - System informuje o całkowitej liczbie kart w talii i wykorzystaniu limitu (x/100)

### US-013
- Tytuł: Edycja istniejącej karty
- Opis: Jako użytkownik przeglądający talię, chcę edytować istniejącą kartę, aby wprowadzić zmiany.
- Kryteria akceptacji:
  - Użytkownik może wybrać kartę do edycji
  - System wyświetla edytor karty z aktualnymi wartościami
  - Użytkownik może modyfikować tytuł, obraz i treść karty
  - System wyświetla podgląd karty w czasie rzeczywistym
  - Zmiany są automatycznie zapisywane

### US-014
- Tytuł: Usuwanie karty
- Opis: Jako użytkownik edytujący talię, chcę usunąć kartę, której nie potrzebuję.
- Kryteria akceptacji:
  - Użytkownik może wybrać kartę do usunięcia
  - System wyświetla prośbę o potwierdzenie usunięcia
  - Po potwierdzeniu, karta jest trwale usuwana z talii
  - System informuje użytkownika o pomyślnym usunięciu karty
  - Zmiana jest natychmiast widoczna w podglądzie talii

### US-015
- Tytuł: Usuwanie talii
- Opis: Jako zalogowany użytkownik, chcę usunąć talię, której już nie potrzebuję.
- Kryteria akceptacji:
  - Użytkownik może wybrać talię do usunięcia
  - System wyświetla prośbę o potwierdzenie usunięcia
  - Po potwierdzeniu, talia i wszystkie jej karty są trwale usuwane
  - System informuje użytkownika o pomyślnym usunięciu talii
  - Zmiana jest natychmiast widoczna w liście talii użytkownika

### US-016
- Tytuł: Eksport talii do PDF
- Opis: Jako użytkownik z ukończoną talią, chcę wyeksportować moją talię do formatu PDF, aby móc ją wydrukować.
- Kryteria akceptacji:
  - Użytkownik może wybrać talię do eksportu
  - System generuje plik PDF zawierający wszystkie karty w talii
  - Karty w PDF są rozmieszczone optymalnie do druku (standardowy rozmiar 66x91mm)
  - PDF zawiera zarówno awersy, jak i rewersy kart
  - Użytkownik może pobrać wygenerowany plik PDF

### US-017
- Tytuł: Generowanie linku do udostępniania talii
- Opis: Jako użytkownik z ukończoną talią, chcę wygenerować unikalny link, aby udostępnić moją talię innym osobom.
- Kryteria akceptacji:
  - Użytkownik może wygenerować unikalny URL dla wybranej talii
  - System tworzy i wyświetla link do talii
  - Użytkownik może skopiować link do schowka
  - Link pozostaje aktywny dopóki talia istnieje w systemie
  - System informuje użytkownika, że osoby z linkiem będą mogły przeglądać talię

### US-018
- Tytuł: Przeglądanie udostępnionej talii
- Opis: Jako osoba, która otrzymała link do talii, chcę przeglądać udostępnioną talię bez konieczności logowania się.
- Kryteria akceptacji:
  - Użytkownik może otworzyć udostępnioną talię za pomocą otrzymanego linku
  - System wyświetla talię w trybie tylko do odczytu
  - Użytkownik może przeglądać wszystkie karty w talii
  - Użytkownik nie może edytować ani eksportować talii
  - System wyraźnie informuje, że jest to tryb tylko do odczytu

### US-019
- Tytuł: Automatyczny zapis postępu
- Opis: Jako użytkownik edytujący talię, chcę, aby mój postęp był automatycznie zapisywany, aby nie stracić wprowadzonych zmian.
- Kryteria akceptacji:
  - System automatycznie zapisuje zmiany podczas edycji talii i kart
  - Zapis następuje po każdej istotnej zmianie
  - System wyświetla informację o statusie zapisu
  - W przypadku problemów z połączeniem, system informuje użytkownika o niemożności zapisu
  - Po przywróceniu połączenia, system automatycznie synchronizuje zmiany

### US-020
- Tytuł: Zmiana nazwy talii
- Opis: Jako użytkownik zarządzający taliami, chcę zmienić nazwę istniejącej talii, aby lepiej odzwierciedlała jej zawartość.
- Kryteria akceptacji:
  - Użytkownik może edytować nazwę talii
  - System weryfikuje, czy nowa nazwa nie jest pusta
  - Po zatwierdzeniu, nazwa talii jest aktualizowana
  - System informuje użytkownika o pomyślnej zmianie nazwy
  - Zmiana jest natychmiast widoczna w liście talii

### US-021
- Tytuł: Wylogowanie
- Opis: Jako zalogowany użytkownik, chcę się wylogować z systemu, aby zabezpieczyć moje konto.
- Kryteria akceptacji:
  - Użytkownik może wybrać opcję wylogowania
  - System kończy sesję użytkownika
  - Użytkownik jest przekierowany do strony logowania
  - System informuje użytkownika o pomyślnym wylogowaniu
  - Po wylogowaniu, dostęp do talii wymaga ponownego zalogowania

### US-022
- Tytuł: Powiadomienie o limicie talii
- Opis: Jako użytkownik, chcę otrzymać powiadomienie, gdy zbliżam się do limitu talii, aby móc zarządzać moimi zasobami.
- Kryteria akceptacji:
  - System wyświetla informację o aktualnym wykorzystaniu limitu (x/5) talii
  - Gdy użytkownik osiągnie 80% limitu (4 talie), system wyświetla ostrzeżenie
  - Gdy limit zostanie osiągnięty, system blokuje możliwość tworzenia nowych talii
  - System sugeruje usunięcie nieużywanych talii, aby zwolnić miejsce
  - Informacja o limicie jest zawsze widoczna w panelu użytkownika

### US-023
- Tytuł: Powiadomienie o limicie kart
- Opis: Jako użytkownik edytujący talię, chcę otrzymać powiadomienie, gdy zbliżam się do limitu kart w talii, aby planować zawartość talii.
- Kryteria akceptacji:
  - System wyświetla informację o aktualnym wykorzystaniu limitu (x/100) kart
  - Gdy użytkownik osiągnie 90% limitu (90 kart), system wyświetla ostrzeżenie
  - Gdy limit zostanie osiągnięty, system blokuje możliwość dodawania nowych kart
  - System sugeruje usunięcie nieużywanych kart, aby zwolnić miejsce
  - Informacja o limicie jest zawsze widoczna w edytorze talii

### US-024
- Tytuł: Duplikowanie karty
- Opis: Jako użytkownik edytujący talię, chcę zduplikować istniejącą kartę, aby szybko stworzyć podobną kartę bez konieczności generowania nowej od podstaw.
- Kryteria akceptacji:
  - Użytkownik może wybrać kartę do zduplikowania
  - System tworzy kopię karty ze wszystkimi jej elementami
  - Kopia otrzymuje domyślną nazwę "Kopia [oryginalny tytuł]"
  - Użytkownik może edytować zduplikowaną kartę
  - System weryfikuje, czy nie przekroczono limitu 100 kart w talii

## 6. Metryki sukcesu

### 6.1 Metryki wydajności
- Użytkownicy mogą stworzyć kompletną talię kart w mniej niż 30 minut
- 70% użytkowników skutecznie eksportuje swoje talie do druku
- Co najmniej 60% użytkowników tworzy więcej niż jedną talię

### 6.2 Metryki techniczne
- Czas generowania pojedynczego obrazu przez AI nie przekracza 30 sekund
- Czas generowania pliku PDF nie przekracza 60 sekund dla talii zawierającej 100 kart
- Dostępność systemu na poziomie 99.5% w skali miesiąca

### 6.3 Metryki biznesowe
- Liczba aktywnych użytkowników (użytkownicy, którzy zalogowali się w ciągu ostatnich 30 dni)
- Liczba utworzonych talii
- Liczba utworzonych kart
- Średnia liczba kart w talii
- Procent użytkowników, którzy tworzą więcej niż jedną talię

Wszystkie metryki będą mierzone bezpośrednio z bazy danych systemu, bez wykorzystania zewnętrznych narzędzi analitycznych. 