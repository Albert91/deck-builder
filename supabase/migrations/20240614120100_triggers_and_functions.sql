-- Migration: Triggers and Functions for Deck Builder
-- Description: Sets up functions and triggers for deck management and card attributes
-- Date: 2024-06-14

-- Function to generate a random share hash
create or replace function generate_share_hash()
returns trigger as $$
declare
  _share_hash text;
  _exists boolean;
begin
  -- Generate random unique share hash
  loop
    -- Generate an 8-character random alphanumeric string
    _share_hash := substr(md5(random()::text), 1, 8);
    
    -- Check if already exists
    select exists(select 1 from decks where share_hash = _share_hash) into _exists;
    
    -- Exit loop if unique
    exit when not _exists;
  end loop;
  
  -- Set the share_hash column
  new.share_hash := _share_hash;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to generate share hash before insert
create trigger before_deck_insert
  before insert on decks
  for each row
  when (new.share_hash is null)
  execute function generate_share_hash();

-- Function to update name_tsv column
create or replace function update_name_tsv()
returns trigger as $$
begin
  new.name_tsv := to_tsvector('english', new.name);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update name_tsv before insert or update
create trigger before_deck_insert_update
  before insert or update of name on decks
  for each row
  execute function update_name_tsv();

-- Function to initialize card attributes after card creation
create or replace function init_card_attributes()
returns trigger as $$
begin
  -- Insert default attributes for the new card
  insert into card_attributes (card_id, attribute_type, value)
  values
    (new.id, 'strength', 0),
    (new.id, 'defense', 0),
    (new.id, 'health', 0);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to initialize card attributes after card insert
create trigger after_card_insert
  after insert on cards
  for each row
  execute function init_card_attributes(); 