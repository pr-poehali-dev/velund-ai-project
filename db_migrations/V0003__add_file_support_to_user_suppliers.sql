-- Add file storage columns to user_suppliers table
ALTER TABLE user_suppliers ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);
ALTER TABLE user_suppliers ADD COLUMN IF NOT EXISTS file_data TEXT;
ALTER TABLE user_suppliers ADD COLUMN IF NOT EXISTS file_size INTEGER;