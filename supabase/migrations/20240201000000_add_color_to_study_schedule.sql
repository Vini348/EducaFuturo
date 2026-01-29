-- Add color column to study_schedule table
ALTER TABLE study_schedule ADD COLUMN IF NOT EXISTS color TEXT;
