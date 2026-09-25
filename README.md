# Smart Travel Planner (Karnataka Travel Guide)

🚀 Live Demo
https://smart-travel-planner-karnataka-1.onrender.com

A full-stack, responsive web application engineered for travelers to discover, explore, and generate customized, day-by-day travel itineraries across the diverse regions of Karnataka, India.

> **Note on Scope:** Smart Travel Planner is a dedicated **user-facing travel discovery and itinerary planning platform**. It does **not** include an administrative dashboard, nor does it provide booking management, merchant portals, or monetary transaction/payment processing systems. All travel recommendations, district guides, accommodation references, and itineraries serve exclusively for travel planning and exploration.

---

## Table of Contents

1. [Project Title](#smart-travel-planner-karnataka-travel-guide)
2. [Project Overview](#project-overview)
3. [Problem Statement](#problem-statement)
4. [Objectives](#objectives)
5. [Key Features](#key-features)
6. [User Workflow](#user-workflow)
7. [Technology Stack](#technology-stack)
8. [System Architecture](#system-architecture)
9. [Frontend Architecture](#frontend-architecture)
10. [Backend Architecture](#backend-architecture)
11. [PostgreSQL Database Overview](#postgresql-database-overview)
12. [Authentication](#authentication)
13. [Trip Generation and District-Based Filtering](#trip-generation-and-district-based-filtering)
14. [API Overview](#api-overview)
15. [Project Structure](#project-structure)
16. [Testing and Verification](#testing-and-verification)
17. [Deployment Information](#deployment-information)
18. [Environment-Variable & Security Notes](#environment-variable--security-notes)
19. [How to Run the Project](#how-to-run-the-project)
20. [Future Scope](#future-scope)
21. [License](#license)

---

## Project Overview

Karnataka offers an exceptional variety of landscapes, cultural landmarks, and biodiversity—from the ancient ruins of the Vijayanagara Empire in Hampi to the misty coffee estates and peaks of Kodagu (Coorg) and Chikkamagaluru, the serene Arabian Sea beaches in Uttara Kannada and Udupi, and the royal heritage of Mysuru.

The **Smart Travel Planner (Karnataka Travel Guide)** serves as an intelligent itinerary architect. By analyzing traveler preferences (starting hub, target districts, duration in days, travel companions, budget tier, transportation mode, and thematic interests), the platform generates logically organized, multi-day routes with geographically clustered destinations, authentic regional dining recommendations, accommodation suggestions, and realistic cost breakdowns.

---

## Problem Statement

Travelers exploring Karnataka frequently face several logistical challenges:
* **Fragmented Information:** Historical landmarks, scenic viewpoints, local cuisine, and transit routes are scattered across disparate travel blogs, review platforms, and guides.
* **Geographical Inefficiencies:** Many automated itinerary tools recommend unrealistic routes that ignore Karnataka's topography (e.g., crossing Western Ghats ghat sections back-and-forth within a single afternoon).
* **Cross-District Contamination:** Generic planners often inject attractions from unrelated districts into targeted travel plans (e.g., placing coastal temples into a highland coffee-plantation itinerary).
* **Generic Cost Estimates:** Standard travel portals rarely adapt estimated travel budgets to group size, accommodation tier, or transportation type.
* **Transient Session Loss:** Without persistent user-linked storage, travel plans created during browsing sessions are easily lost upon browser refresh or device changes.

---

## Objectives

1. **Curate Verified Karnataka Data:** Provide high-fidelity, verified data across 11 key tourism districts, 49 iconic and offbeat destinations, 21 authentic regional eateries, and 33 accommodation tiers.
2. **Deliver Strict District-Isolated Routing:** Ensure that itinerary generation algorithmically respects user-selected districts without mixing in unrelated or out-of-boundary destinations.
3. **Provide Thematic Scoring:** Intelligently prioritize destinations and activities matching user interest tags (Heritage, Nature, Coffee Plantations, Beaches, Waterfalls, Architecture, Cuisine, Wildlife).
4. **Ensure Robust Relational Persistence:** Store user credentials, travel preferences, and custom saved itineraries in PostgreSQL with foreign-key referential integrity.
5. **Offer Offline & Resilient Operation:** Maintain seamless fallback support with static curated datasets if remote database connections experience latency or downtime.
6. **Support Traveler Utility Tools:** Enable responsive map visualization (Leaflet), budget breakdown charts (Recharts), PDF export generation, and bookmarking.

---

## Key Features

* **Interactive Home & Featured Showcases:**
  * Curated district spotlights and seasonal travel advisories (Monsoon, Post-Monsoon, Winter Peak).
  * Quick-start trip generator and popular Karnataka travel themes.

* **Comprehensive Explore & Filter Engine:**
  * Real-time full-text search across destinations, districts, and categories.
  * Multi-dimensional filtering by district, interest category, and "Hidden Gems".
  * Direct access to detailed place cards with ratings, best visit timings, entry fees, and activity lists.

* **District & Destination Deep Dives:**
  * District profiles with headquarters, geographical zone, ideal visit durations, climate summaries, and coordinates.
  * Destination detail pages with high-resolution imagery, why-visit highlights, accessibility notes, and nearby culinary and stay options.

* **Intelligent Multi-Day Trip Planner:**
  * Configurable starting and ending hubs (e.g., Bengaluru, Mangaluru, Mysuru, Hubballi).
  * Multi-district selection with district-isolation constraints.
  * Customizable travel parameters: trip duration (1–7+ days), group size, transport mode (Own Car, Hired Cab, KSRTC Bus, Train), and budget tier (Budget, Moderate, Luxury).
  * Day-by-day scheduling: morning, afternoon, sunset/evening slots with regional dining and stay recommendations.

* **Itinerary Visualization & Export:**
  * Leaflet-powered route waypoints with interactive location markers.
  * Cost estimation breakdown across Accommodation, Food, Transport, and Activities.
  * Packing essentials checklist and seasonal safety advisories.
  * Client-side PDF itinerary download and print formatting.

* **User Accounts & Saved Trips ("My Trips"):**
  * Secure user registration and login with bcrypt hashing and JWT tokens.
  * Persistent trip bookmarking, saving, and deletion backed by PostgreSQL.
  * User profile management with travel style, preferred interests, and budget preferences.

---

## User Workflow

```text
[ Traveler Visits Platform ]
           │
           ├───► Explore Destinations / Districts (Search, Filter by Category or Hidden Gems)
           │
           ├───► Register / Log In (Secure JWT Authentication)
           │
           └───► Launch Trip Planner
                       │
                       ├─ 1. Select Starting & Ending City (e.g., Bengaluru)
                       ├─ 2. Choose Target Districts (e.g., Kodagu + Chikkamagaluru)
                       ├─ 3. Specify Duration, Travelers Count, & Budget Tier
                       ├─ 4. Choose Transport Mode & Thematic Interests
                       │
                       ▼
           [ Generate Dynamic Itinerary ]
                       │
                       ├─ Algorithm filters destinations strictly to selected districts
                       ├─ Scores attractions based on matching traveler interests
                       ├─ Assigns morning, afternoon, and evening activities
                       ├─ Allocates regional meals (breakfast, lunch, dinner) & stays
                       ├─ Computes categorized budget estimation
                       │
                       ▼
           [ View Itinerary Details ]
                       │
                       ├─ Interactive Map with Geo-Waypoints
                       ├─ Download PDF / Print Itinerary
                       └─ Bookmark / Save to "My Trips" (Persisted in PostgreSQL)
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `19.0.1` | Component-based UI library |
| **TypeScript** | `7.0.2` | Static type safety and structured models |
| **Vite** | `8.3.0` | Next-generation frontend build tooling and dev server |
| **Tailwind CSS** | `4.3.3` | Utility-first CSS styling and responsive layouts |
| **React Router** | `7.18.4` | Client-side declarative routing |
| **Lucide React** | `0.546.0` | Comprehensive icon set |
| **Leaflet & @types/leaflet** | `1.9.4` | Interactive geographic maps and marker rendering |
| **Recharts** | `3.10.1` | Budget visualization and data charts |
| **Motion** | `12.23.24` | Smooth micro-animations and transitions |

### Backend & Server
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.x` | JavaScript runtime environment |
| **Express** | `4.21.2` | RESTful API server routing and middleware |
| **TypeScript / TSX** | `4.21.0` | TypeScript execution engine for server scripts |
| **pg (node-postgres)** | `8.23.0` | High-performance PostgreSQL client connection pool |
| **jsonwebtoken** | `9.0.3` | Signed stateless authentication tokens (JWT) |
| **bcryptjs** | `3.0.3` | One-way password salt hashing |
| **cors** | `2.8.6` | Cross-Origin Resource Sharing middleware |
| **dotenv** | `17.2.3` | Environment variable management |
| **esbuild** | `0.25.0` | Fast server bundling for production artifacts |

### Database
| Technology | Specification | Details |
| :--- | :--- | :--- |
| **PostgreSQL** | PostgreSQL 16+ / 17 | Relational database engine |
| **Cloud Provider** | Serverless / Managed (Neon) | Remote managed SSL-secured PostgreSQL instance |
| **Schema Standard** | PostgreSQL DDL | Normalized schema with foreign keys, indexes, and JSONB |

---

## System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (BROWSER)                              │
│                                                                        │
│   React 19 SPA (Pages: Home, Explore, Plan Trip, My Trips, Profile)   │
│   Contexts: AuthContext (JWT State), PlannerContext (Form State)       │
│   Services: apiClient (Fetch + Bearer Auth), itineraryGenerator        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (/api/*)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND (server.ts)                        │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Middleware: CORS, JSON parser, JWT requireAuth / optionalAuth   │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌───────────────────────────────┴────────────────────────────────┐   │
│   │ API Routes:                                                    │   │
│   │  • /api/health       (Database & API health monitor)           │   │
│   │  • /api/auth/*       (Register, Login, /me, /profile)          │   │
│   │  • /api/districts/*  (District listings & detail deep-dives)   │   │
│   │  • /api/destinations/* (Search, district, category filters)    │   │
│   │  • /api/trips/*      (Generate, list, save, bookmark, delete)  │   │
│   │  • /api/interests    (Interests reference list)                │   │
│   │  • /api/food-places  (Culinary suggestions)                    │   │
│   │  • /api/accommodations (Lodging tiers)                         │   │
│   │  • /api/starting-locations (Hub coordinates)                   │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌───────────────────────────────┴────────────────────────────────┐   │
│   │ PostgreSQL Pool (server/config/db.ts)                          │   │
│   │ SSL mode: rejectUnauthorized: false for managed endpoints      │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ TLS / TCP (DATABASE_URL)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     POSTGRESQL DATABASE (Neon)                         │
│                                                                        │
│  Tables:                                                               │
│   • users (Credentials, hashed passwords, travel preferences)         │
│   • districts (11 Karnataka districts with geo-coordinates)           │
│   • destinations (49 places with categories, ratings, timings)        │
│   • food_places (21 regional restaurants with dishes & price tiers)    │
│   • accommodations (33 hotels/homestays across Budget/Mod/Luxury)      │
│   • interests (14 travel themes and badges)                            │
│   • starting_locations (14 travel hubs with GPS coordinates)          │
│   • trips (User itineraries, JSONB days, waypoints, budget estimates)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

The frontend is constructed using a modern React 19 architecture:
* **Entry Point (`src/main.tsx` & `src/App.tsx`):** Sets up top-level providers (`AuthProvider`, `PlannerProvider`) and client routing with `BrowserRouter`.
* **State Management:**
  * `AuthContext`: Tracks authenticated user profile, session JWT, registration, login, profile updates, and logout actions.
  * `PlannerContext`: Manages current trip parameters (starting city, districts, duration, interests, transport, budget).
* **Pages (`src/pages/`):**
  * `HomePage.tsx`: Hero introduction, featured Karnataka districts, curated trips, and key highlights.
  * `ExplorePage.tsx`: Searchable destination directory with filter chips (Districts, Categories, Hidden Gems).
  * `DistrictDetailPage.tsx`: Deep-dive into a specific district including places to visit, local cuisine, and lodging options.
  * `DestinationDetailPage.tsx`: Detailed view for individual attractions with imagery, timings, fees, and location notes.
  * `PlanTripPage.tsx`: Interactive multi-step form to configure parameters and generate customized trips.
  * `TripDetailPage.tsx`: Comprehensive itinerary view with day-by-day timeline, interactive map, budget summary, and PDF exporter.
  * `MyTripsPage.tsx`: User dashboard displaying bookmarked and generated trips stored in PostgreSQL.
  * `ProfilePage.tsx`: User preference editor for travel style, budget tier, and preferred themes.
  * `LoginPage.tsx` & `RegisterPage.tsx`: Clean user credential forms with validation.
* **Component Library (`src/components/`):**
  * `layout/`: Navbar (with mobile responsiveness and auth state dropdown) and Footer.
  * `timeline/`: Day-by-day itinerary timeline cards with morning, afternoon, and evening activity blocks.
  * `common/`: Leaflet map wrapper (`MapView.tsx`), badge pills, loading states, and modal wrappers.
* **Services (`src/services/`):**
  * `apiClient.ts`: Axios/fetch abstraction with automatic JWT Bearer header attachment.
  * `itineraryGenerator.ts`: Algorithmic engine for destination scoring, route building, meal assignment, and budget computation.
  * `pdfService.ts`: Print-ready itinerary layout generation.

---

## Backend Architecture

The backend is built as an Express application mounted inside `server.ts`:
* **Unified Development Server (`server.ts`):** In development, Express mounts Vite middleware (`vite.middlewares`) on port `3000`, enabling seamless API routing and fast frontend HMR on a single port.
* **Production Static Serving:** In production builds, the Express server statically serves compiled assets from `dist/` and directs non-API routes to `dist/index.html`.
* **Connection Pooling (`server/config/db.ts`):** Utilizes `pg.Pool` configured with connection limits, connection timeout handlers, and SSL parameters matching cloud-hosted PostgreSQL instances.
* **Database Resiliency:** All API endpoints implement dual-mode data retrieval. If `DATABASE_URL` is active, queries execute against live PostgreSQL tables. If the database is initializing, queries gracefully fall back to the internal static dataset.
* **Security & Auth Middleware (`server/middleware/auth.ts`):**
  * `requireAuth`: Validates JWT token from the `Authorization: Bearer <token>` header, returning HTTP 401 if missing or expired.
  * `optionalAuth`: Extracts user identity if a valid token is provided, allowing unauthenticated guests to generate trips while associating trips with logged-in user IDs when available.

---

## PostgreSQL Database Overview

The PostgreSQL database enforces relational schema constraints, foreign keys, unique indices, and JSONB document storage.

### Database Schema Structure

```sql
-- 1. USERS
users (
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

-- 2. DISTRICTS
districts (
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

-- 3. DESTINATIONS
destinations (
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

-- 4. FOOD PLACES
food_places (
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

-- 5. ACCOMMODATIONS
accommodations (
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

-- 6. INTERESTS (Reference Table)
interests (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    badge_color VARCHAR(100) NOT NULL
);

-- 7. STARTING LOCATIONS (Reference Table)
starting_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6)
);

-- 8. TRIPS
trips (
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
```

### Verified Seed Dataset Record Counts

The database initialization and seeding script (`server/db/seed.ts`) populates and verifies the following core records:
* **Districts:** 11 (Kodagu, Chikkamagaluru, Mysuru, Vijayanagara, Uttara Kannada, Udupi, Shivamogga, Dakshina Kannada, Bengaluru Urban, Bagalkote, Hassan)
* **Destinations:** 49
* **Food Places:** 21
* **Accommodations:** 33
* **Interests:** 14
* **Starting Locations:** 14
* **Referential Integrity:** 0 orphan destinations, 0 orphan food places, 0 orphan accommodations.

---

## Authentication

Authentication is implemented with stateless JSON Web Tokens (JWT) and one-way cryptographic hashing:
* **Password Security:** All passwords are salted and hashed using `bcryptjs` (salt rounds: 10). Plain-text passwords are never stored or logged.
* **Token Issuance:** Successful `/api/auth/register` and `/api/auth/login` requests return a signed JWT token with a 30-day validity window.
* **Token Verification:** The `requireAuth` middleware verifies the token signature against `process.env.JWT_SECRET`.
* **Payload Structure:** Includes `id`, `email`, and `name`.
* **Session Persistence:** The client stores the JWT token in `localStorage` (`karnataka_travel_token`) and validates the current session via `GET /api/auth/me` on application boot.

---

## Trip Generation and District-Based Filtering

The trip generation engine (`src/services/itineraryGenerator.ts` and `POST /api/trips/generate`) operates with deterministic rules to ensure realistic travel schedules:

1. **Strict District Isolation:**
   * Destinations are strictly filtered using:
     ```typescript
     const eligibleDestinations = KARNATAKA_DESTINATIONS.filter(dest =>
       selectedDistricts.includes(dest.districtId)
     );
     ```
   * *Example:* If a user selects **Kodagu** and **Chikkamagaluru**, every recommended destination belongs exclusively to either Kodagu or Chikkamagaluru. Destinations from Mysuru, Udupi, or other districts are strictly barred from appearing.

2. **Interest-Based Scoring:**
   * Destinations receive preference scores based on the traveler's selected interests:
     * Category match: `+3 points`
     * Activity text match: `+2 points`
     * Description keyword match: `+1 point`
     * Featured flag: `+1.5 points`
   * Higher-scoring destinations are prioritized during daily slot assignments.

3. **Geographical Day Allocation:**
   * Available trip days are distributed across the selected districts.
   * If 2 districts are selected for a 3-day trip, Day 1 and Day 2 focus on District A (e.g., Kodagu), while Day 3 transitions to District B (e.g., Chikkamagaluru).

4. **Time Slot Structuring:**
   * Each day is organized into logical time blocks:
     * **Morning:** High-energy activities, trekking viewpoints, or major monuments (e.g., Abbey Falls, Mullayanagiri Peak, Virupaksha Temple).
     * **Lunch:** District-specific authentic eatery recommendations (e.g., Coorg pork/veg curries, coastal fish thali, Neer Dosa).
     * **Afternoon:** Cultural sites, museums, coffee plantation tours, or shaded nature walks.
     * **Sunset / Evening:** Viewpoints, promenades, lake walks, and evening relaxation.
     * **Stay:** Recommended lodging matching the traveler's budget tier (Budget, Moderate, or Luxury).

5. **Budget Calculation:**
   * The budget estimator computes realistic expenses broken down into Stay, Food, Transport, and Activities based on traveler count, duration, and chosen tier.

---

## API Overview

All API endpoints are prefixed with `/api` and return standardized JSON responses.

### Health Check
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Returns service status, PostgreSQL connectivity, and record counts | No |

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account; returns user profile and JWT | No |
| `POST` | `/api/auth/login` | Authenticate with email/password; returns JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes (Bearer)** |
| `PUT` | `/api/auth/profile` | Update profile preferences (style, budget, interests) | **Yes (Bearer)** |
| `POST` | `/api/auth/logout` | Client logout confirmation | No |

### Districts & Destinations
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/districts` | List all 11 Karnataka districts | No |
| `GET` | `/api/districts/:slug` | Get district details, places, food, and accommodations | No |
| `GET` | `/api/destinations` | Query destinations (`?search=`, `?district=`, `?category=`, `?hidden=`) | No |
| `GET` | `/api/destinations/:slug` | Get destination details with district and nearby stays | No |

### Travel Planning & Trips
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/trips/generate` | Generate dynamic itinerary and save to database | Optional (Attaches user ID if logged in) |
| `GET` | `/api/trips` | Retrieve saved trips for authenticated user | Optional |
| `GET` | `/api/trips/:id` | Retrieve specific trip by ID | No |
| `POST` | `/api/trips` | Save custom trip directly to database | Optional |
| `PUT` | `/api/trips/:id` | Update trip bookmark status or notes | Optional |
| `DELETE` | `/api/trips/:id` | Remove saved trip from PostgreSQL | Optional |

### Travel References
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/interests` | List 14 travel interests and badge colors | No |
| `GET` | `/api/food-places` | List regional dining options (`?districtId=`, `?mealType=`) | No |
| `GET` | `/api/accommodations` | List accommodations (`?districtId=`, `?tier=`) | No |
| `GET` | `/api/starting-locations` | List 14 travel starting hubs and coordinates | No |

---

## Project Structure

```text
smart-travel-planner/
├── .env.example               # Template for environment variables (no secrets)
├── .gitignore                  # Git ignore definitions
├── index.html                 # Single Page Application HTML entry point
├── metadata.json              # AI Studio application metadata and permissions
├── package.json               # Dependencies, build scripts, and engine specs
├── server.ts                  # Main server entry (Express + Vite dev middleware)
├── tsconfig.json              # TypeScript compilation configuration
├── vite.config.ts             # Vite frontend configuration and plugins
│
├── scripts/
│   └── verify-all.ts          # Comprehensive test & verification test suite (20 steps)
│
├── server/
│   ├── index.ts               # Express application router configuration & health check
│   ├── config/
│   │   └── db.ts              # PostgreSQL pg.Pool configuration & query helpers
│   ├── db/
│   │   ├── initDb.ts          # Schema initialization runner
│   │   ├── queryHelpers.ts    # Reusable SQL query helpers
│   │   ├── schema.sql         # PostgreSQL 16/17 DDL schema definition
│   │   ├── seed.sql           # Static SQL seed file
│   │   └── seed.ts            # Programmatic database seed runner with verification
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware (requireAuth, optionalAuth)
│   └── routes/
│       ├── authRoutes.ts      # Authentication endpoints (register, login, me, profile)
│       ├── destinationRoutes.ts # Destination search, listing, and detail routes
│       ├── districtRoutes.ts  # District listings and deep-dive routes
│       ├── travelDataRoutes.ts # Interests, dining, stay, and starting location routes
│       └── tripRoutes.ts      # Trip generation, bookmarking, and deletion routes
│
└── src/
    ├── App.tsx                # Client route configuration and navigation wrappers
    ├── main.tsx               # Client entry point
    ├── index.css              # Global styles and Tailwind CSS directives
    │
    ├── components/
    │   ├── common/            # MapView (Leaflet), Badge, and shared UI components
    │   ├── layout/            # Navbar, Navigation Drawer, and Footer
    │   └── timeline/          # Day-by-day itinerary schedule and activity blocks
    │
    ├── context/
    │   ├── AuthContext.tsx    # User authentication and profile state provider
    │   └── PlannerContext.tsx # Trip generation form state provider
    │
    ├── data/
    │   ├── accommodations.ts  # 33 curated Karnataka hotels and homestays
    │   ├── destinations.ts    # 49 curated destinations with categories and GPS
    │   ├── districts.ts       # 11 Karnataka districts with geographical profiles
    │   ├── essentials.ts      # Packing checklists by region and season
    │   ├── foodPlaces.ts      # 21 authentic regional eateries
    │   ├── interests.ts       # 14 travel interests & 14 starting city coordinates
    │   ├── sampleTrips.ts     # Pre-configured Karnataka showcase itineraries
    │   └── seasons.ts         # Weather guidelines, monsoon advisories, and tips
    │
    ├── pages/
    │   ├── DestinationDetailPage.tsx # Destination showcase with timings and nearby stays
    │   ├── DistrictDetailPage.tsx    # District overview, highlights, and places
    │   ├── ExplorePage.tsx           # Search and multi-filter discovery page
    │   ├── HomePage.tsx              # Landing page with hero, zones, and popular trips
    │   ├── LoginPage.tsx             # User login page
    │   ├── MyTripsPage.tsx           # Saved itineraries dashboard
    │   ├── PlanTripPage.tsx          # Multi-step itinerary configuration wizard
    │   ├── ProfilePage.tsx           # User travel style and preferences editor
    │   ├── RegisterPage.tsx          # User registration page
    │   └── TripDetailPage.tsx        # Generated itinerary viewer with map and PDF export
    │
    ├── services/
    │   ├── apiClient.ts       # Fetch wrapper with Bearer token injection
    │   ├── authService.ts     # Authentication API helpers
    │   ├── destinationService.ts # Destination API client helpers
    │   ├── districtService.ts # District API client helpers
    │   ├── itineraryGenerator.ts # Algorithmic itinerary synthesis and scoring
    │   ├── pdfService.ts      # PDF generation and print styling utilities
    │   └── tripService.ts     # Saved trip CRUD API helpers
    │
    └── types/
        └── index.ts           # Unified TypeScript interfaces and models
```

---

## Testing and Verification

The project includes an end-to-end programmatic verification suite (`scripts/verify-all.ts`) verifying:

1. **PostgreSQL Connectivity:** Verifies database response via `SELECT NOW()`.
2. **Table Schema Integrity:** Confirms all 8 relational tables exist.
3. **Record Count Accuracy:**
   * 11 districts
   * 49 destinations
   * 21 food places
   * 33 accommodations
   * 14 interests
   * 14 starting locations
4. **Foreign Key Integrity:** Confirms zero orphan destination, food, or accommodation records.
5. **API Health Endpoint:** Verifies `/api/health` reports status 200 with live database connectivity.
6. **Authentication Flow:**
   * User registration test verifies password hashing and row insertion into `users`.
   * User login verifies bcrypt comparison and JWT issuance.
   * Authenticated `GET /api/auth/me` validates token resolution.
   * `PUT /api/auth/profile` validates persistence of updated travel styles.
7. **Discovery & Filter APIs:**
   * Full-text search (e.g., "Abbey" returns Abbey Falls).
   * District filter (`?district=kodagu` returns only Kodagu items).
   * Category filter (`?category=Nature` returns only Nature items).
   * Hidden gem filter (`?hidden=true` returns only hidden gems).
8. **District & Destination Details:** Verifies slug resolution for districts and destinations.
9. **Itinerary Synthesis & District Isolation:**
   * Generates a 3-day trip for **Kodagu + Chikkamagaluru**.
   * Verifies that every single activity and viewpoint belongs strictly to Kodagu or Chikkamagaluru.
10. **Trip Management:** Verifies trip generation, saving/bookmarking, retrieval via `GET /api/trips`, and deletion.

To run the verification suite:
```bash
npx tsx scripts/verify-all.ts
```

---

## Deployment Information

* **Server Runtime:** Node.js Express server running on port `3000`.
* **Production Build Workflow:**
  * Compiles frontend assets via `vite build` into the `dist/` directory.
  * Bundles server code via `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.
  * Production launch script: `npm run start` (`node dist/server.cjs`).
* **Static Asset Serving:** In production, Express serves compiled static files from `dist/` with client-side SPA routing fallback to `index.html`.
* **Database Connection:** Connects to any cloud PostgreSQL provider (such as Neon Serverless PostgreSQL) via `DATABASE_URL` with SSL mode enabled.

---

## Environment-Variable & Security Notes

All configuration is managed via environment variables. See `.env.example` for reference:

```bash
# PostgreSQL Connection URL
# Supported: Serverless PostgreSQL (Neon, Supabase, Aiven, or standard PostgreSQL)
DATABASE_URL="postgresql://[user]:[password]@[endpoint]/[dbname]?sslmode=require"

# JWT Secret for Session Authentication
JWT_SECRET="your-strong-random-secret-key"

# Optional Gemini API Key (if generative features are enabled)
GEMINI_API_KEY="your-gemini-api-key"

# Application Host URL
APP_URL="http://localhost:3000"
```

### Security Best Practices Implemented:
* **No Secrets in Source:** Secret values, API keys, and passwords must never be committed to git repositories.
* **SSL/TLS Protection:** Remote database connections use TLS/SSL encryption.
* **Password Hashing:** Passwords are hashed with `bcryptjs` using 10 salt rounds before storage.
* **JWT Expiration:** Tokens are cryptographically signed with bounded lifetimes.
* **SQL Injection Prevention:** All database operations utilize parameterized queries (`$1, $2, ...`) via `node-postgres`.

---

## How to Run the Project

### Prerequisites
* Node.js (version 20 or higher recommended)
* npm or bun
* A PostgreSQL 16+ database (local or cloud-hosted via Neon / Supabase)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/smart-travel-planner.git
cd smart-travel-planner
npm install
```

### 2. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```
Open `.env` and set your `DATABASE_URL` and `JWT_SECRET`.

### 3. Initialize & Seed the Database
Initialize schema tables and seed the verified Karnataka travel dataset:
```bash
npm run db:init
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`. In development, Vite will automatically serve frontend assets with hot module reloading while Express handles API requests.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## Future Scope

While the current platform delivers a complete travel planning experience, potential future enhancements include:
1. **Interactive Route Driving Estimations:** Integration with routing services for live traffic and driving-time updates along Western Ghats ghat roads.
2. **Community Travel Reviews:** Enabling registered travelers to post trip reviews, photos, and personalized trail tips.
3. **Multi-Language Support (Kannada Localization):** Expanding multilingual support to include a full Kannada language interface for regional travelers.
4. **Weather & Monsoon Alerts:** Live meteorological warnings for coastal and highland trekking regions during peak monsoon months.
5. **Collaborative Group Trips:** Enabling multiple registered users to co-plan and edit a shared itinerary simultaneously.

---

## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this software for educational and personal exploration purposes.
