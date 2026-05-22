-- ==========================================
-- SCHEMA SQL - BOOKING ACCESSIBLE CONGO
-- ==========================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. admin_profiles (To manage admin access linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE, -- references auth.users(id)
    email text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. hotels
CREATE TABLE IF NOT EXISTS hotels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    name text NOT NULL,
    city text NOT NULL,
    district text,
    address text,
    phone text,
    whatsapp text,
    category text NOT NULL CHECK (category IN ('local_express', 'business', 'mixed', 'avoid')) DEFAULT 'mixed',
    price_min integer,
    price_max integer,
    notes text,
    reliability_score integer DEFAULT 50 CHECK (reliability_score >= 0 AND reliability_score <= 100),
    status text NOT NULL CHECK (status IN ('active', 'paused', 'blacklisted')) DEFAULT 'active',
    last_contacted_at timestamptz
);

-- 3. room_requests
CREATE TABLE IF NOT EXISTS room_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    city text NOT NULL,
    district text,
    budget_min integer,
    budget_max integer,
    stay_type text NOT NULL CHECK (stay_type IN ('few_hours', 'one_night', 'multiple_nights', 'unknown')) DEFAULT 'unknown',
    requested_date date,
    requested_time text,
    guests_count integer DEFAULT 1 CHECK (guests_count > 0),
    preferences text,
    status text NOT NULL CHECK (status IN ('new', 'contacting_hotels', 'offer_found', 'waiting_payment', 'booked', 'cancelled', 'expired', 'failed')) DEFAULT 'new',
    admin_notes text
);

-- 4. bookings
CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    request_id uuid REFERENCES room_requests(id) ON DELETE SET NULL,
    hotel_id uuid REFERENCES hotels(id) ON DELETE SET NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    city text NOT NULL,
    district text,
    final_price integer NOT NULL CHECK (final_price >= 0),
    deposit_amount integer DEFAULT 0 CHECK (deposit_amount >= 0),
    remaining_amount integer DEFAULT 0 CHECK (remaining_amount >= 0),
    voucher_code text UNIQUE NOT NULL,
    checkin_date date,
    checkin_time text,
    status text NOT NULL CHECK (status IN ('created', 'waiting_payment', 'payment_confirmed', 'confirmed', 'voucher_sent', 'checkin_pending', 'checkin_confirmed', 'cancelled', 'disputed', 'refunded')) DEFAULT 'created',
    price_locked boolean DEFAULT true,
    hotel_contact_name text,
    admin_notes text
);

-- 5. payments
CREATE TABLE IF NOT EXISTS payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount integer NOT NULL CHECK (amount > 0),
    method text NOT NULL CHECK (method IN ('mtn_money', 'airtel_money', 'cash', 'other')) DEFAULT 'other',
    status text NOT NULL CHECK (status IN ('pending', 'received', 'failed', 'refunded', 'blocked')) DEFAULT 'pending',
    reference text,
    confirmed_by text,
    confirmed_at timestamptz,
    admin_notes text
);

-- 6. incidents
CREATE TABLE IF NOT EXISTS incidents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
    hotel_id uuid REFERENCES hotels(id) ON DELETE SET NULL,
    type text NOT NULL CHECK (type IN ('price_changed', 'no_room', 'bad_room', 'hotel_cancelled', 'client_complaint', 'suspected_bypass', 'payment_issue', 'other')) DEFAULT 'other',
    severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    description text NOT NULL,
    resolved boolean DEFAULT false,
    resolution_notes text
);

-- Future Expansion Placeholders (Not active in V1, but schema matches structure)
-- CREATE TABLE client_users (id uuid PRIMARY KEY, user_id uuid, ...);
-- CREATE TABLE hotel_users (id uuid PRIMARY KEY, hotel_id uuid, user_id uuid, ...);
-- CREATE TABLE agent_users (id uuid PRIMARY KEY, user_id uuid, ...);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an authenticated admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- V1 Simplicité : Si l'utilisateur est authentifié dans Supabase Auth
  -- on vérifie s'il existe dans la table admin_profiles
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- Policies for admin_profiles ---
CREATE POLICY "Admins can view and manage admin profiles" 
    ON admin_profiles 
    FOR ALL 
    TO authenticated 
    USING (user_id = auth.uid() OR is_admin());

-- --- Policies for hotels ---
CREATE POLICY "Admins can perform all operations on hotels" 
    ON hotels 
    FOR ALL 
    TO authenticated 
    USING (is_admin());

-- --- Policies for room_requests ---
-- Anyone (public client) can submit a request (INSERT)
CREATE POLICY "Public can submit room requests" 
    ON room_requests 
    FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Only admins can select/update/delete requests
CREATE POLICY "Admins can manage room requests" 
    ON room_requests 
    FOR ALL 
    TO authenticated 
    USING (is_admin());

-- --- Policies for bookings ---
CREATE POLICY "Admins can manage bookings" 
    ON bookings 
    FOR ALL 
    TO authenticated 
    USING (is_admin());

-- --- Policies for payments ---
CREATE POLICY "Admins can manage payments" 
    ON payments 
    FOR ALL 
    TO authenticated 
    USING (is_admin());

-- --- Policies for incidents ---
CREATE POLICY "Admins can manage incidents" 
    ON incidents 
    FOR ALL 
    TO authenticated 
    USING (is_admin());
