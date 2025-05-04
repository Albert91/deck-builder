-- Migration to remove templates from the database

-- Step 1: First remove the foreign key constraint from decks table
ALTER TABLE "public"."decks" DROP CONSTRAINT IF EXISTS "decks_template_id_fkey";

-- Step 2: Remove the template_id column from decks table
ALTER TABLE "public"."decks" DROP COLUMN IF EXISTS "template_id";

-- Step 3: Drop the templates table
DROP TABLE IF EXISTS "public"."templates";

-- Step 4: Create a notice in the migration logs
DO $$
BEGIN
  RAISE NOTICE 'Migration complete: All template-related elements have been removed from the database.';
END $$; 