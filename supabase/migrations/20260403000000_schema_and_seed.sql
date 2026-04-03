-- ============================================================
-- Warehouse Inventory Schema
-- Single flat table — shared by the MCP server and the frontend
-- Run via: supabase db push  OR  paste into Supabase SQL editor
-- ============================================================

DROP TABLE IF EXISTS inventory;

CREATE TABLE inventory (
    item_id      VARCHAR(50)  PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    -- Allowed statuses enforced by CHECK constraint
    status       VARCHAR(20)  NOT NULL CHECK (status IN ('in_stock', 'shipped', 'damaged', 'spoiled', 'reserved')),
    quantity     INTEGER      NOT NULL DEFAULT 0,
    location     VARCHAR(100) NOT NULL,
    last_updated TIMESTAMP    NOT NULL DEFAULT NOW(),
    notes        TEXT                         -- nullable: damage/spoilage descriptions
);

-- Auto-update last_updated on every row change
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_inventory_last_updated
BEFORE UPDATE ON inventory
FOR EACH ROW EXECUTE FUNCTION update_last_updated();

-- Enable Supabase Realtime so the frontend receives live updates
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;

-- ============================================================
-- Sample data — 10 realistic items for demo
-- ============================================================
INSERT INTO inventory (item_id, name, status, quantity, location, notes) VALUES
    ('SKU-001', 'Water Bottles (24-pack)',       'in_stock',  320,  'Zone-A, Shelf-1',  NULL),
    ('SKU-002', 'Canned Soup (Tomato, case/12)', 'in_stock',  150,  'Zone-A, Shelf-3',  NULL),
    ('SKU-003', 'Paper Towels (bulk roll x6)',   'reserved',   80,  'Pallet-4B',        'Reserved for order #8821'),
    ('SKU-004', 'Nitrile Gloves (box/100)',      'in_stock',  400,  'Zone-B, Shelf-2',  NULL),
    ('SKU-005', 'Cardboard Boxes (flat, lg)',    'shipped',     0,  'Loading Dock-1',   'Shipped via FedEx — tracking #FX9942'),
    ('SKU-006', 'Hand Sanitizer (1L bottle)',    'in_stock',  210,  'Zone-C, Shelf-1',  NULL),
    ('SKU-007', 'Pallet Wrap (stretch film)',    'damaged',    30,  'Pallet-2A',        '15 rolls torn during forklift incident on 2026-03-28'),
    ('SKU-008', 'Frozen Peas (1kg bag)',         'spoiled',     0,  'Cold Storage-1',   'Freezer malfunction — entire batch spoiled 2026-03-30'),
    ('SKU-009', 'Safety Vests (hi-vis, L)',      'in_stock',   95,  'Zone-B, Shelf-5',  NULL),
    ('SKU-010', 'Duct Tape (48mm x 50m)',        'reserved',   60,  'Zone-D, Shelf-1',  'Reserved for maintenance crew');
