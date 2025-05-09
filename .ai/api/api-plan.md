# REST API Plan

## 1. Resources

- **User** (`users` table)
- **Deck** (`decks` table)
- **Card** (`cards` table)
- **CardAttribute** (`card_attributes` table)
- **ImageMetadata** (`image_metadata` table)
- **Auth** (authentication/authorization endpoints)
- **Analytics** (aggregated metrics)

## 2. Endpoints

### 2.4 Decks

#### 2.4.1 List Decks
- Method: `GET`
- URL: `/decks`
- Description: List user's decks with pagination, filtering, and search.
- Authentication: Required
- Query Params:
  - `page` (integer, default=1)
  - `limit` (integer, default=20, max=100)
  - `search` (string, full-text search on deck name)
- Success Response (200):
  ```json
  {
    "items": [ { "id": "...", "name": "My Deck", "share_hash": "..." } ],
    "totalCount": 5,
    "page": 1,
    "limit": 20
  }
  ```

#### 2.4.2 Create Deck
- Method: `POST`
- URL: `/decks`
- Description: Create a new deck (max 5 per user).
- Authentication: Required
- Request Body:
  ```json
  { "name": "My Deck" }
  ```
- Success Response (201):
  ```json
  { "id": "uuid", "name": "My Deck", "share_hash": "abc123" }
  ```
- Error Responses:
  - 400 Bad Request: missing or invalid fields
  - 403 Forbidden: deck limit reached (5)

#### 2.4.3 Get Deck
- Method: `GET`
- URL: `/decks/{deckId}`
- Description: Retrieve a deck and its metadata.
- Authentication: Required
- Success Response (200):
  ```json
  {
    "id": "uuid",
    "name": "My Deck",
    "share_hash": "...",
    "created_at": "...",
    "updated_at": "..."
  }
  ```
- Error Responses:
  - 404 Not Found
  - 403 Forbidden: not owner

#### 2.4.4 Update Deck
- Method: `PUT`
- URL: `/decks/{deckId}`
- Description: Update deck properties (name).
- Authentication: Required
- Request Body:
  ```json
  { "name": "Updated Deck" }
  ```
- Success Response (200): updated deck object
- Error Responses:
  - 400 Bad Request
  - 403 Forbidden

#### 2.4.5 Delete Deck
- Method: `DELETE`
- URL: `/decks/{deckId}`
- Description: Delete a deck and cascade cards.
- Authentication: Required
- Success Response (204 No Content)
- Error Responses:
  - 404 Not Found
  - 403 Forbidden

### 2.5 Public Sharing

#### 2.5.1 View Shared Deck
- Method: `GET`
- URL: `/public/decks/{shareHash}`
- Description: View deck in read-only mode without authentication.
- Success Response (200): deck details + array of cards
- Error Responses:
  - 404 Not Found: invalid shareHash

### 2.6 Deck AI Generation

#### 2.6.1 Generate Background
- Method: `POST`
- URL: `/decks/{deckId}/background`
- Description: Generate or regenerate deck front background via AI.
- Authentication: Required
- Request Body:
  ```json
  { "prompt": "mystical forest at dawn" }
  ```
- Success Response (200):
  ```json
  { "image_metadata_id": "uuid", "file_path": "/path/to/bg.png" }
  ```
- Error Responses:
  - 403 Forbidden
  - 429 Too Many Requests: rate limit

#### 2.6.2 Generate Back
- Method: `POST`
- URL: `/decks/{deckId}/back`
- Description: Generate or regenerate deck back via AI.
- Request Body: same structure as background
- Success Response: same structure

### 2.7 Cards

#### 2.7.1 List Cards
- Method: `GET`
- URL: `/decks/{deckId}/cards`
- Description: Paginated list of cards in a deck.
- Query Params: `page`, `limit`
- Success Response (200):
  ```json
  {
    "items": [ { "id": "...", "title": "Goblin", "description": "..." } ],
    "totalCount": 10,
    "page": 1,
    "limit": 20
  }
  ```

#### 2.7.2 Create Card
- Method: `POST`
- URL: `/decks/{deckId}/cards`
- Description: Add a new card to deck (max 100 cards).
- Request Body:
  ```json
  { "title": "Goblin", "description": "A small green creature" }
  ```
- Success Response (201): card object with `id`
- Error Responses:
  - 403 Forbidden: card limit reached (100)

#### 2.7.3 Get Card
- Method: `GET`
- URL: `/decks/{deckId}/cards/{cardId}`
- Description: Retrieve a single card.
- Success Response (200): card object

#### 2.7.4 Update Card
- Method: `PUT`
- URL: `/decks/{deckId}/cards/{cardId}`
- Description: Edit card title/description.
- Request Body:
  ```json
  { "title": "Orc Warrior", "description": "A powerful fighter" }
  ```
- Success Response (200): updated card object

#### 2.7.5 Delete Card
- Method: `DELETE`
- URL: `/decks/{deckId}/cards/{cardId}`
- Description: Remove card from deck.
- Success Response (204 No Content)

### 2.8 Card AI Generation

#### 2.8.1 Generate Main Image
- Method: `POST`
- URL: `/decks/{deckId}/cards/{cardId}/image`
- Description: Generate or regenerate card main image via AI using card title as prompt.
- Request Body: none (uses existing title)
- Success Response (200):
  ```json
  { "image_metadata_id": "uuid", "file_path": "/path/to/card.png" }
  ```

### 2.9 Export

#### 2.9.1 Export to PDF
- Method: `GET`
- URL: `/decks/{deckId}/export/pdf`
- Description: Generate PDF ready for print for entire deck.
- Authentication: Required
- Success Response (200): PDF binary stream (Content-Type: application/pdf)
- Error Responses:
  - 404 Not Found, 403 Forbidden

### 2.10 Analytics

#### 2.10.1 Deck Analytics
- Method: `GET`
- URL: `/analytics/decks`
- Description: Return count of decks created per user or global metrics.
- Authentication: Admin or limited user
- Success Response (200): `{ "totalDecks": 42 }`

#### 2.10.2 Card Analytics
- Method: `GET`
- URL: `/analytics/cards`
- Description: Return count of cards created per user or global metrics.
- Success Response (200): `{ "totalCards": 389 }`

## 3. Authentication & Authorization

- Use JWT tokens generated by Supabase Auth.
- All private routes require `Authorization: Bearer <token>` header.
- RLS in Supabase enforces:
  - Users can read/update only own records (`owner_id = auth.uid()`).
  - Public deck read by shareHash without auth.
- Rate limit AI endpoints (e.g. 5 calls/min).

## 4. Validation & Business Logic

- **User**: unique email and username; valid email format.
- **Deck**: non-empty name; max 5 decks per user (enforced in controller before insert).
- **Card**: non-empty title; max 100 cards per deck.
- **CardAttribute**: `value` ∈ [0,99]; `attribute_type` ∈ ('strength','defense','health').
- **ImageMetadata**: `entity_type` ∈ ('deck_background','deck_back','card_image').
- Input validation via TypeScript DTOs and Zod or similar.
- Early returns for invalid input.
- Use full-text search on `decks.name_tsv` for `search` param.
- Pagination defaults and limits: page ≥1, limit ≤100.

---

*This API plan adheres to eslint.config.mjs rules, using Yarn as package manager, and aligns with Astro 5, TypeScript 5, React 19, Tailwind 4, Shadcn/ui tech stack.*
