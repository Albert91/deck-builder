# Database Schema Plan

## 1. Tables

### users

This table is managed by Supabase Auth.

- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **email**: TEXT UNIQUE NOT NULL
- **username**: TEXT UNIQUE NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT now()

### templates
- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **name**: TEXT NOT NULL
- **description**: TEXT
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT now()

### decks
- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **owner_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **template_id**: UUID NOT NULL REFERENCES templates(id)
- **name**: TEXT NOT NULL
- **share_hash**: TEXT UNIQUE NOT NULL
- **name_tsv**: TSVECTOR NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT now()

### cards
- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **deck_id**: UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE
- **title**: TEXT NOT NULL
- **description**: TEXT
- **image_metadata_id**: UUID REFERENCES image_metadata(id)
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT now()

### card_attributes
- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **card_id**: UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE
- **attribute_type**: attribute_type_enum NOT NULL
- **value**: SMALLINT NOT NULL DEFAULT 0 CHECK (value BETWEEN 0 AND 99)
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT now()

### image_metadata
- **id**: UUID PRIMARY KEY DEFAULT gen_random_uuid()
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **entity_type**: image_entity_type_enum NOT NULL
- **entity_id**: UUID NOT NULL
- **prompt**: TEXT NOT NULL
- **model**: TEXT NOT NULL
- **parameters**: JSONB
- **file_path**: TEXT NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT now()

## 2. Relationships

- users (1) ↔ (M) decks
- users (1) ↔ (M) image_metadata
- templates (1) ↔ (M) decks
- decks (1) ↔ (M) cards
- cards (1) ↔ (M) card_attributes

## 3. Indexes

- **decks_owner_idx**: ON decks(owner_id)
- **decks_template_idx**: ON decks(template_id)
- **decks_share_hash_idx**: ON decks(share_hash)
- **decks_name_tsv_gin**: ON decks USING GIN (name_tsv)
- **cards_deck_idx**: ON cards(deck_id)
- **card_attributes_card_idx**: ON card_attributes(card_id)
- **image_metadata_user_idx**: ON image_metadata(user_id)

## 4. Enums

- **attribute_type_enum**: ('strength', 'defense', 'health')
- **image_entity_type_enum**: ('deck_background', 'deck_back', 'card_image')

## 5. Triggers & Functions

- **generate_share_hash**: BEFORE INSERT ON decks
- **update_name_tsv**: BEFORE INSERT OR UPDATE ON decks
- **init_card_attributes**: AFTER INSERT ON cards

## 6. Row-Level Security (RLS)

- Enable RLS on all tables
- **users**: Policies to allow users to SELECT/UPDATE own record
- **decks**: OWNER policy (auth.uid() = owner_id) for CRUD; PUBLIC_READ policy on share_hash match
- **cards**, **card_attributes**, **image_metadata**: OWNER policy based on parent deck owner

## 7. Additional Notes

- Full-text search on deck names via name_tsv
- Hard deletes cascade to child records and Supabase Storage files
- Activity logs to be implemented separately
- Application enforces deck/card limits (5 decks, 100 cards)
