-- Users table with roles and subscriptions
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    subscription VARCHAR(50) NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    company_name VARCHAR(255),
    city VARCHAR(100),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_products INTEGER DEFAULT 0,
    last_update TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (metal items)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id),
    name VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(12,2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'тонна',
    quantity DECIMAL(12,2),
    city VARCHAR(100),
    specifications TEXT,
    gost VARCHAR(100),
    size VARCHAR(100),
    views INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price lists uploads
CREATE TABLE price_uploads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    supplier_id INTEGER REFERENCES suppliers(id),
    file_name VARCHAR(500) NOT NULL,
    file_url VARCHAR(1000),
    file_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    ai_score INTEGER DEFAULT 0,
    ai_report JSONB,
    items_found INTEGER DEFAULT 0,
    reject_reason TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMP,
    moderated_by INTEGER REFERENCES users(id)
);

-- CRM clients
CREATE TABLE crm_clients (
    id SERIAL PRIMARY KEY,
    manager_id INTEGER REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    city VARCHAR(100),
    status VARCHAR(50) DEFAULT 'potential',
    total_deals INTEGER DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CRM requests
CREATE TABLE crm_requests (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES crm_clients(id),
    manager_id INTEGER REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'waiting',
    priority VARCHAR(50) DEFAULT 'medium',
    amount DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Commercial proposals
CREATE TABLE proposals (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES crm_clients(id),
    manager_id INTEGER REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    pdf_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP
);

-- Payment requests
CREATE TABLE payment_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    receipt_url VARCHAR(1000) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    moderated_at TIMESTAMP,
    moderated_by INTEGER REFERENCES users(id)
);

-- AI chat history
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search queries log
CREATE TABLE search_queries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_city ON products(city);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_price_uploads_user ON price_uploads(user_id);
CREATE INDEX idx_price_uploads_status ON price_uploads(status);
CREATE INDEX idx_crm_clients_manager ON crm_clients(manager_id);
CREATE INDEX idx_crm_requests_client ON crm_requests(client_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_search_queries_user ON search_queries(user_id);

-- Insert admin user
INSERT INTO users (email, password_hash, full_name, role, subscription)
VALUES ('Shagadik2009@gmail.com', '53060376SHAga11+', 'Администратор', 'admin', 'premium');
