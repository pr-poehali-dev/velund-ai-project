-- Add status column to suppliers (pending/approved/rejected)
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES users(id);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS moderated_by INTEGER REFERENCES users(id);

-- Add website_url column for AI parsing
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Create table for website parsing tasks
CREATE TABLE IF NOT EXISTS website_parse_tasks (
    id SERIAL PRIMARY KEY,
    website_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parsed_at TIMESTAMP,
    parsed_data JSONB,
    error_message TEXT,
    products_added INTEGER DEFAULT 0
);

-- Create table for user-submitted suppliers
CREATE TABLE IF NOT EXISTS user_suppliers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    website_url TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMP,
    moderated_by INTEGER REFERENCES users(id),
    rejection_reason TEXT
);

-- Add indices for performance
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_by ON suppliers(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_website_parse_tasks_status ON website_parse_tasks(status);
CREATE INDEX IF NOT EXISTS idx_user_suppliers_status ON user_suppliers(status);
CREATE INDEX IF NOT EXISTS idx_user_suppliers_user_id ON user_suppliers(user_id);