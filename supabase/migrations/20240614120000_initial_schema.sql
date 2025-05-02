-- Migration: Initial Schema for Deck Builder
-- Description: Sets up initial tables, enums, constraints, and RLS policies
-- Date: 2024-06-14

-- Create enums
create type attribute_type_enum as enum ('strength', 'defense', 'health');
create type image_entity_type_enum as enum ('deck_background', 'deck_back', 'card_image');

-- Create image_metadata table
create table image_metadata (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    entity_type image_entity_type_enum not null,
    entity_id uuid not null,
    prompt text not null,
    model text not null,
    parameters jsonb,
    file_path text not null,
    created_at timestamptz not null default now()
);

-- Create templates table
create table templates (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create decks table
create table decks (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    template_id uuid not null references templates(id),
    name text not null,
    share_hash text unique not null,
    name_tsv tsvector not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create cards table
create table cards (
    id uuid primary key default gen_random_uuid(),
    deck_id uuid not null references decks(id) on delete cascade,
    title text not null,
    description text,
    image_metadata_id uuid references image_metadata(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create card_attributes table
create table card_attributes (
    id uuid primary key default gen_random_uuid(),
    card_id uuid not null references cards(id) on delete cascade,
    attribute_type attribute_type_enum not null,
    value smallint not null default 0 check (value between 0 and 99),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create indexes
create index decks_owner_idx on decks(owner_id);
create index decks_template_idx on decks(template_id);
create index decks_share_hash_idx on decks(share_hash);
create index decks_name_tsv_gin on decks using gin(name_tsv);
create index cards_deck_idx on cards(deck_id);
create index card_attributes_card_idx on card_attributes(card_id);
create index image_metadata_user_idx on image_metadata(user_id);

-- Enable Row Level Security
alter table templates enable row level security;
alter table decks enable row level security;
alter table cards enable row level security;
alter table card_attributes enable row level security;
alter table image_metadata enable row level security;

-- RLS Policies for templates
-- Public read access to templates
create policy "Templates are viewable by everyone" 
on templates for select 
using (true);

-- RLS Policies for decks
-- Owner has full access
create policy "Owners can manage their decks" 
on decks for all 
using (auth.uid() = owner_id);

-- Public read access for decks with matching share hash via API
create policy "Public can view shared decks" 
on decks for select 
using (true);

-- RLS Policies for cards
-- Only deck owners can manage cards
create policy "Owners can manage their deck cards" 
on cards for all 
using (
    deck_id in (
        select id from decks where owner_id = auth.uid()
    )
);

-- Public can view cards for shared decks
create policy "Public can view cards of shared decks" 
on cards for select 
using (
    deck_id in (
        select id from decks
    )
);

-- RLS Policies for card_attributes
-- Only deck owners can manage card attributes
create policy "Owners can manage their card attributes" 
on card_attributes for all 
using (
    card_id in (
        select id from cards where deck_id in (
            select id from decks where owner_id = auth.uid()
        )
    )
);

-- Public can view card attributes for shared decks
create policy "Public can view card attributes of shared decks" 
on card_attributes for select 
using (
    card_id in (
        select id from cards
    )
);

-- RLS Policies for image_metadata
-- Users can manage their own images
create policy "Users can manage their own images" 
on image_metadata for all 
using (auth.uid() = user_id);

-- Public can view all images
create policy "Public can view all images" 
on image_metadata for select 
using (true); 