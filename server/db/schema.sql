-- ====================================================================
-- SMART TRAVEL PLANNER - KARNATAKA TRAVEL GUIDE DATABASE SCHEMA
-- PostgreSQL 17 Compatible DDL Script
-- ====================================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY DEFAULT gen_random_uuid()::varchar,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    travel_style VARCHAR(50) DEFAULT 'Relaxed' NOT NULL,
    budget_preference VARCHAR(50) DEFAULT 'Moderate' NOT NULL,
    preferred_interests TEXT[] DEFAULT '{}' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- --------------------------------------------------------------------
-- 2. DISTRICTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    kannada_name VARCHAR(100),
    zone VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    headquarters VARCHAR(100) NOT NULL,
    best_time_to_visit VARCHAR(100) NOT NULL,
    ideal_days VARCHAR(50),
    weather_summary TEXT,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    popular_experiences TEXT[] DEFAULT '{}' NOT NULL,
    destinations_count INTEGER DEFAULT 0 NOT NULL,
    hero_image JSONB NOT NULL,
    must_visit_place_ids TEXT[] DEFAULT '{}' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_districts_slug ON districts(slug);
CREATE INDEX IF NOT EXISTS idx_districts_region ON districts(region);
CREATE INDEX IF NOT EXISTS idx_districts_zone ON districts(zone);

-- --------------------------------------------------------------------
-- 3. DESTINATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id) ON DELETE RESTRICT NOT NULL,
    district_name VARCHAR(100),
    categories TEXT[] NOT NULL,
    short_description VARCHAR(300) NOT NULL,
    full_description TEXT NOT NULL,
    why_visit TEXT[] DEFAULT '{}' NOT NULL,
    image JSONB NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    visit_duration VARCHAR(50) NOT NULL,
    entry_fee BOOLEAN DEFAULT FALSE NOT NULL,
    entry_fee_amount INTEGER DEFAULT 0 NOT NULL,
    entry_fee_string VARCHAR(100),
    timings VARCHAR(100),
    best_months TEXT[] NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 4.8 NOT NULL,
    activities TEXT[] NOT NULL,
    is_hidden_gem BOOLEAN DEFAULT FALSE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    accessibility_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_district_id ON destinations(district_id);
CREATE INDEX IF NOT EXISTS idx_destinations_hidden_gem ON destinations(is_hidden_gem);
CREATE INDEX IF NOT EXISTS idx_destinations_categories ON destinations USING GIN(categories);

-- --------------------------------------------------------------------
-- 4. FOOD PLACES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS food_places (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id) ON DELETE CASCADE NOT NULL,
    specialty VARCHAR(200) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    price_range VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    recommended_dish VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_food_places_district_meal ON food_places(district_id, meal_type);

-- --------------------------------------------------------------------
-- 5. ACCOMMODATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id) ON DELETE CASCADE NOT NULL,
    location_area VARCHAR(150) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    approx_price_per_night INTEGER NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 4.5 NOT NULL,
    description TEXT NOT NULL,
    amenities TEXT[] NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_accommodations_district_tier ON accommodations(district_id, tier);

-- --------------------------------------------------------------------
-- 6. INTERESTS TABLE (Reference)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interests (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    badge_color VARCHAR(100) NOT NULL
);

-- --------------------------------------------------------------------
-- 7. STARTING LOCATIONS TABLE (Reference)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS starting_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_starting_locations_name ON starting_locations(name);

-- --------------------------------------------------------------------
-- 8. TRIPS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    starting_point VARCHAR(100) NOT NULL,
    end_point VARCHAR(100) NOT NULL,
    duration_days INTEGER NOT NULL,
    selected_districts TEXT[] NOT NULL,
    selected_district_names TEXT[] NOT NULL,
    interests TEXT[] NOT NULL,
    transport VARCHAR(50) NOT NULL,
    budget_tier VARCHAR(20) NOT NULL,
    travelers_count INTEGER DEFAULT 1 NOT NULL,
    cover_image JSONB NOT NULL,
    days JSONB NOT NULL,
    waypoints JSONB NOT NULL,
    budget_estimate JSONB NOT NULL,
    essentials_to_carry TEXT[] NOT NULL,
    seasonal_tips TEXT[] NOT NULL,
    is_custom_saved BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trips_saved ON trips(user_id, is_custom_saved);
