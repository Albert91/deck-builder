-- Migration: Seed Data for Deck Builder
-- Description: Initial seed data for templates
-- Date: 2024-06-14

-- Seed templates
insert into templates (name, description) values
  ('Fantasy Heroes', 'A template for creating fantasy hero character cards with strength, defense, and health attributes'),
  ('Sci-Fi Spaceships', 'A template for creating spaceship cards with attack power, shield strength, and hull integrity'),
  ('Mythical Creatures', 'A template for creating mythical creature cards with power, resilience, and vitality stats'),
  ('Super Heroes', 'A template for creating superhero cards with power, defense, and health attributes'),
  ('Modern Vehicles', 'A template for creating vehicle cards with speed, durability, and fuel efficiency'); 