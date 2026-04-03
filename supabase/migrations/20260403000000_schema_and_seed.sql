-- Create table for SKUs
CREATE TABLE skus (
    id SERIAL PRIMARY KEY,
    sku_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    supplier_name VARCHAR(255)
);

-- Create table for Storage Sections
CREATE TABLE storage_sections (
    id SERIAL PRIMARY KEY,
    section_code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    temperature_controlled BOOLEAN DEFAULT FALSE
);

-- Create table for Pallets
CREATE TABLE pallets (
    id SERIAL PRIMARY KEY,
    pallet_number VARCHAR(50) UNIQUE NOT NULL,
    storage_section_id INTEGER REFERENCES storage_sections(id),
    status VARCHAR(50) DEFAULT 'Good', -- Good, Damaged, Spill
    notes TEXT
);

-- Create table for Inventory
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    sku_id INTEGER REFERENCES skus(id),
    pallet_id INTEGER REFERENCES pallets(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Available' -- Available, Spoiled, In-Transit
);

-- Create table for Maintenance Logs
CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    equipment_type VARCHAR(100) NOT NULL,
    equipment_id VARCHAR(50),
    reported_by VARCHAR(100),
    issue_description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Scheduled, Completed
    scheduled_date TIMESTAMP
);

-- Insert dummy data
INSERT INTO skus (sku_code, name, category, supplier_name) VALUES
('SKU-992', 'Premium Widgets', 'Electronics', 'Main Supplier Corp'),
('SKU-104', 'Organic Milk 1L', 'Grocery', 'Dairy Farms Inc'),
('SKU-551', 'Industrial Lubricant', 'Supplies', 'Machinery Co');

INSERT INTO storage_sections (section_code, temperature_controlled) VALUES
('A1', FALSE),
('A2', FALSE),
('B1', TRUE),
('B2', TRUE);

INSERT INTO pallets (pallet_number, storage_section_id, status) VALUES
('4A', 1, 'Good'),
('4B', 1, 'Good'),
('5A', 3, 'Good');

INSERT INTO inventory (sku_id, pallet_id, quantity) VALUES
(1, 1, 100),
(1, 2, 80),
(2, 3, 500);

-- Existing issue simulation
INSERT INTO maintenance_logs (equipment_type, equipment_id, issue_description, status) VALUES
('Forklift', 'FL-09', 'Hydraulic leak observed near lifting mechanism.', 'Pending');
