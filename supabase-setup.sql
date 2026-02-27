-- Supabase Database Schema for Zaratan Restaurant App
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. CLIENTS TABLE
-- ============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_created_at ON clients(created_at DESC);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see and update their own data
CREATE POLICY "Users can view their own profile"
  ON clients FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON clients FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 2. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Client relationship (nullable for anonymous orders)
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  -- Order data stored as JSONB for flexibility
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Order metadata
  order_number VARCHAR(50) UNIQUE,
  status VARCHAR(20) DEFAULT 'placed' CHECK (status IN ('placed', 'paid', 'ready', 'completed', 'cancelled')),
  
  -- Total and pricing
  total_amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Guest info (for anonymous orders)
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(50),
  
  -- URL sharing support
  share_token VARCHAR(255) UNIQUE,
  share_expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Additional metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_share_token ON orders(share_token);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_items_gin ON orders USING GIN (items);

-- ============================================
-- 3. HELPER FUNCTIONS
-- ============================================

-- Generate order number sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  order_num TEXT;
BEGIN
  order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Function to generate share token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 4. TRIGGERS
-- ============================================

-- Trigger to auto-generate order number and share token
CREATE OR REPLACE FUNCTION set_order_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  
  IF NEW.share_token IS NULL THEN
    NEW.share_token := generate_share_token();
  END IF;
  
  -- Set share token expiration (30 days by default)
  IF NEW.share_expires_at IS NULL THEN
    NEW.share_expires_at := NOW() + INTERVAL '30 days';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_order
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_defaults();

-- Trigger to update updated_at for clients
CREATE TRIGGER update_clients_updated_at 
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at for orders
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ROW LEVEL SECURITY POLICIES FOR ORDERS
-- ============================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can see their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = client_id);

-- Anyone can view orders with valid share token (if not expired)
CREATE POLICY "Anyone can view orders with valid share token"
  ON orders FOR SELECT
  USING (share_expires_at > NOW());

-- Users can create orders
CREATE POLICY "Authenticated users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = client_id OR client_id IS NULL);

-- Anonymous users can create orders
CREATE POLICY "Anonymous users can create orders"
  ON orders FOR INSERT
  WITH CHECK (client_id IS NULL);

-- Users can update their own orders
CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = client_id);

-- Service role can see all orders
CREATE POLICY "Service role can view all orders"
  ON orders FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update all orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================
-- 6. ORDER EVENTS TABLE (Optional - for audit trail)
-- ============================================

CREATE TABLE order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  old_value TEXT,
  new_value TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES clients(id) ON DELETE SET NULL
);

CREATE INDEX idx_order_events_order_id ON order_events(order_id);
CREATE INDEX idx_order_events_created_at ON order_events(created_at DESC);

ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view events for their orders"
  ON order_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_events.order_id 
      AND orders.client_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage order events"
  ON order_events FOR ALL
  USING (auth.role() = 'service_role');

