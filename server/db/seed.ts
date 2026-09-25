import { pool } from '../config/db.js';
import { initializeDatabase } from './initDb.js';
import { KARNATAKA_DISTRICTS } from '../../src/data/districts.js';
import { KARNATAKA_DESTINATIONS } from '../../src/data/destinations.js';
import { KARNATAKA_FOOD_PLACES } from '../../src/data/foodPlaces.js';
import { KARNATAKA_ACCOMMODATIONS } from '../../src/data/accommodations.js';
import { KARNATAKA_INTERESTS, STARTING_LOCATIONS } from '../../src/data/interests.js';

// District headquarters mapping
const DISTRICT_HEADQUARTERS: Record<string, string> = {
  kodagu: 'Madikeri',
  chikkamagaluru: 'Chikkamagaluru',
  mysuru: 'Mysuru',
  vijayanagara: 'Hosapete',
  'uttara-kannada': 'Karwar',
  udupi: 'Udupi',
  shivamogga: 'Shivamogga',
  'dakshina-kannada': 'Mangaluru',
  'bengaluru-urban': 'Bengaluru',
  bagalkote: 'Bagalkote',
  hassan: 'Hassan',
};

// Starting city coordinates
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Mangaluru: { lat: 12.9141, lng: 74.8560 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mysuru: { lat: 12.2958, lng: 76.6394 },
  Hubballi: { lat: 15.3647, lng: 75.1240 },
  Belagavi: { lat: 15.8497, lng: 74.4977 },
  Shivamogga: { lat: 13.9299, lng: 75.5681 },
  Ballari: { lat: 15.1394, lng: 76.9214 },
  Hassan: { lat: 13.0033, lng: 76.1004 },
  Tumakuru: { lat: 13.3409, lng: 77.1010 },
  Udupi: { lat: 13.3409, lng: 74.7421 },
  Madikeri: { lat: 12.4244, lng: 75.7382 },
  Chikkamagaluru: { lat: 13.3161, lng: 75.7720 },
  Goa: { lat: 15.2993, lng: 74.1240 },
  Kozhikode: { lat: 11.2588, lng: 75.7804 },
};

// Helper to parse entry fee details
function parseEntryFee(feeStr?: string): { hasFee: boolean; feeAmount: number; feeString: string } {
  if (!feeStr) {
    return { hasFee: false, feeAmount: 0, feeString: 'Free entry' };
  }
  const lower = feeStr.toLowerCase();
  if (lower.includes('free') || lower === 'none' || lower === 'nil') {
    return { hasFee: false, feeAmount: 0, feeString: feeStr };
  }
  const match = feeStr.match(/\d+/);
  if (match) {
    return { hasFee: true, feeAmount: parseInt(match[0], 10), feeString: feeStr };
  }
  return { hasFee: false, feeAmount: 0, feeString: feeStr };
}

export async function seedDatabase() {
  console.log('====================================================');
  console.log('🌱 SMART TRAVEL PLANNER - DATABASE SEED RUNNER');
  console.log('====================================================');

  // Step 1: Ensure database schema exists
  console.log('\n[1/7] Ensuring database schema tables exist...');
  const initResult = await initializeDatabase();
  if (!initResult.success) {
    console.error('❌ Failed to verify database schema. Please check PostgreSQL server.');
    return false;
  }

  let client;
  try {
    client = await pool.connect();
  } catch (connErr: any) {
    console.error('\n❌ Could not connect to PostgreSQL:', connErr.message);
    console.error('Please verify that:');
    console.error('  1. PostgreSQL service is running on port 5432.');
    console.error('  2. Database "smart_travel_planner" exists.');
    console.error('  3. Credentials in .env match your postgres configuration.');
    return false;
  }

  try {
    console.log('\n[2/7] Starting atomic transaction for data seeding...');
    await client.query('BEGIN');

    // ------------------------------------------------------------------
    // A. SEED DISTRICTS (11 Districts)
    // ------------------------------------------------------------------
    console.log(`\n📍 Seeding ${KARNATAKA_DISTRICTS.length} districts...`);
    for (const d of KARNATAKA_DISTRICTS) {
      const hq = DISTRICT_HEADQUARTERS[d.id] || d.name;
      const mustVisit = KARNATAKA_DESTINATIONS
        .filter(dest => dest.districtId === d.id)
        .map(dest => dest.id);

      const query = `
        INSERT INTO districts (
          id, name, slug, kannada_name, zone, region, tagline, description,
          headquarters, best_time_to_visit, ideal_days, weather_summary,
          latitude, longitude, popular_experiences, destinations_count,
          hero_image, must_visit_place_ids
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          kannada_name = EXCLUDED.kannada_name,
          zone = EXCLUDED.zone,
          region = EXCLUDED.region,
          tagline = EXCLUDED.tagline,
          description = EXCLUDED.description,
          headquarters = EXCLUDED.headquarters,
          best_time_to_visit = EXCLUDED.best_time_to_visit,
          ideal_days = EXCLUDED.ideal_days,
          weather_summary = EXCLUDED.weather_summary,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          popular_experiences = EXCLUDED.popular_experiences,
          destinations_count = EXCLUDED.destinations_count,
          hero_image = EXCLUDED.hero_image,
          must_visit_place_ids = EXCLUDED.must_visit_place_ids;
      `;

      await client.query(query, [
        d.id,
        d.name,
        d.slug,
        d.kannadaName || null,
        d.zone,
        d.zone, // region maps to zone
        d.tagline,
        d.description,
        hq,
        d.bestTimeToVisit,
        d.idealDays || null,
        d.weatherSummary || null,
        d.latitude,
        d.longitude,
        d.popularExperiences || [],
        d.destinationsCount || mustVisit.length,
        JSON.stringify(d.heroImage),
        mustVisit,
      ]);
    }
    console.log(`   ✓ ${KARNATAKA_DISTRICTS.length} districts processed successfully.`);

    // ------------------------------------------------------------------
    // B. SEED DESTINATIONS (49 Destinations)
    // ------------------------------------------------------------------
    console.log(`\n🏰 Seeding ${KARNATAKA_DESTINATIONS.length} destinations...`);
    for (const dest of KARNATAKA_DESTINATIONS) {
      const feeInfo = parseEntryFee(dest.entryFee);

      const query = `
        INSERT INTO destinations (
          id, name, slug, district_id, district_name, categories,
          short_description, full_description, why_visit, image, gallery,
          latitude, longitude, visit_duration, entry_fee, entry_fee_amount,
          entry_fee_string, timings, best_months, rating, activities,
          is_hidden_gem, is_featured, accessibility_notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          district_id = EXCLUDED.district_id,
          district_name = EXCLUDED.district_name,
          categories = EXCLUDED.categories,
          short_description = EXCLUDED.short_description,
          full_description = EXCLUDED.full_description,
          why_visit = EXCLUDED.why_visit,
          image = EXCLUDED.image,
          gallery = EXCLUDED.gallery,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude,
          visit_duration = EXCLUDED.visit_duration,
          entry_fee = EXCLUDED.entry_fee,
          entry_fee_amount = EXCLUDED.entry_fee_amount,
          entry_fee_string = EXCLUDED.entry_fee_string,
          timings = EXCLUDED.timings,
          best_months = EXCLUDED.best_months,
          rating = EXCLUDED.rating,
          activities = EXCLUDED.activities,
          is_hidden_gem = EXCLUDED.is_hidden_gem,
          is_featured = EXCLUDED.is_featured,
          accessibility_notes = EXCLUDED.accessibility_notes;
      `;

      await client.query(query, [
        dest.id,
        dest.name,
        dest.slug,
        dest.districtId,
        dest.districtName,
        dest.categories || [],
        dest.shortDescription,
        dest.fullDescription,
        dest.whyVisit || [],
        JSON.stringify(dest.image),
        JSON.stringify(dest.gallery || []),
        dest.latitude,
        dest.longitude,
        dest.visitDuration,
        feeInfo.hasFee,
        feeInfo.feeAmount,
        dest.entryFee || 'Free entry',
        dest.timings || null,
        dest.bestMonths || [],
        dest.rating ?? 4.8,
        dest.activities || [],
        Boolean(dest.isHiddenGem),
        Boolean(dest.isFeatured),
        dest.accessibilityNotes || null,
      ]);
    }
    console.log(`   ✓ ${KARNATAKA_DESTINATIONS.length} destinations processed successfully.`);

    // ------------------------------------------------------------------
    // C. SEED FOOD PLACES (21 Food Places)
    // ------------------------------------------------------------------
    console.log(`\n🍲 Seeding ${KARNATAKA_FOOD_PLACES.length} food places...`);
    for (const f of KARNATAKA_FOOD_PLACES) {
      const query = `
        INSERT INTO food_places (
          id, name, district_id, specialty, cuisine, price_range,
          description, meal_type, recommended_dish
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          district_id = EXCLUDED.district_id,
          specialty = EXCLUDED.specialty,
          cuisine = EXCLUDED.cuisine,
          price_range = EXCLUDED.price_range,
          description = EXCLUDED.description,
          meal_type = EXCLUDED.meal_type,
          recommended_dish = EXCLUDED.recommended_dish;
      `;

      await client.query(query, [
        f.id,
        f.name,
        f.districtId,
        f.specialty,
        f.cuisine,
        f.priceRange,
        f.description,
        f.mealType,
        f.recommendedDish,
      ]);
    }
    console.log(`   ✓ ${KARNATAKA_FOOD_PLACES.length} food places processed successfully.`);

    // ------------------------------------------------------------------
    // D. SEED ACCOMMODATIONS (33 Accommodations)
    // ------------------------------------------------------------------
    console.log(`\n🏨 Seeding ${KARNATAKA_ACCOMMODATIONS.length} accommodations...`);
    for (const a of KARNATAKA_ACCOMMODATIONS) {
      const query = `
        INSERT INTO accommodations (
          id, name, district_id, location_area, tier,
          approx_price_per_night, rating, description, amenities, image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          district_id = EXCLUDED.district_id,
          location_area = EXCLUDED.location_area,
          tier = EXCLUDED.tier,
          approx_price_per_night = EXCLUDED.approx_price_per_night,
          rating = EXCLUDED.rating,
          description = EXCLUDED.description,
          amenities = EXCLUDED.amenities,
          image_url = EXCLUDED.image_url;
      `;

      await client.query(query, [
        a.id,
        a.name,
        a.districtId,
        a.locationArea,
        a.tier,
        a.approxPricePerNight,
        a.rating ?? 4.5,
        a.description,
        a.amenities || [],
        a.image || null,
      ]);
    }
    console.log(`   ✓ ${KARNATAKA_ACCOMMODATIONS.length} accommodations processed successfully.`);

    // ------------------------------------------------------------------
    // E. SEED INTERESTS (14 Interests)
    // ------------------------------------------------------------------
    console.log(`\n✨ Seeding ${KARNATAKA_INTERESTS.length} interests...`);
    for (const item of KARNATAKA_INTERESTS) {
      const query = `
        INSERT INTO interests (id, name, description, icon, badge_color)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          badge_color = EXCLUDED.badge_color;
      `;

      await client.query(query, [
        item.id,
        item.name,
        item.description,
        item.icon,
        item.badgeColor,
      ]);
    }
    console.log(`   ✓ ${KARNATAKA_INTERESTS.length} interests processed successfully.`);

    // ------------------------------------------------------------------
    // F. SEED STARTING LOCATIONS (14 Locations)
    // ------------------------------------------------------------------
    console.log(`\n🧭 Seeding ${STARTING_LOCATIONS.length} starting locations...`);
    for (const city of STARTING_LOCATIONS) {
      const coords = CITY_COORDINATES[city] || { lat: null, lng: null };
      const query = `
        INSERT INTO starting_locations (name, latitude, longitude)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO UPDATE SET
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude;
      `;

      await client.query(query, [city, coords.lat, coords.lng]);
    }
    console.log(`   ✓ ${STARTING_LOCATIONS.length} starting locations processed successfully.`);

    // Commit Transaction
    await client.query('COMMIT');
    console.log('\n✅ Transaction committed successfully!');

    // ------------------------------------------------------------------
    // G. POST-SEED VALIDATION QUERIES
    // ------------------------------------------------------------------
    console.log('\n====================================================');
    console.log('🔍 RUNNING DATABASE VALIDATION CHECKS');
    console.log('====================================================');

    const countDistricts = await client.query('SELECT COUNT(*)::int as count FROM districts;');
    const countDestinations = await client.query('SELECT COUNT(*)::int as count FROM destinations;');
    const countFood = await client.query('SELECT COUNT(*)::int as count FROM food_places;');
    const countAccommodations = await client.query('SELECT COUNT(*)::int as count FROM accommodations;');
    const countInterests = await client.query('SELECT COUNT(*)::int as count FROM interests;');
    const countStarting = await client.query('SELECT COUNT(*)::int as count FROM starting_locations;');

    console.log(`Districts:          ${countDistricts.rows[0].count} (Expected: ${KARNATAKA_DISTRICTS.length})`);
    console.log(`Destinations:       ${countDestinations.rows[0].count} (Expected: ${KARNATAKA_DESTINATIONS.length})`);
    console.log(`Food places:        ${countFood.rows[0].count} (Expected: ${KARNATAKA_FOOD_PLACES.length})`);
    console.log(`Accommodations:     ${countAccommodations.rows[0].count} (Expected: ${KARNATAKA_ACCOMMODATIONS.length})`);
    console.log(`Interests:          ${countInterests.rows[0].count} (Expected: ${KARNATAKA_INTERESTS.length})`);
    console.log(`Starting locations: ${countStarting.rows[0].count} (Expected: ${STARTING_LOCATIONS.length})`);

    // Verify orphan integrity
    const orphanDest = await client.query(`
      SELECT count(*)::int as count FROM destinations WHERE district_id NOT IN (SELECT id FROM districts);
    `);
    const orphanFood = await client.query(`
      SELECT count(*)::int as count FROM food_places WHERE district_id NOT IN (SELECT id FROM districts);
    `);
    const orphanAcc = await client.query(`
      SELECT count(*)::int as count FROM accommodations WHERE district_id NOT IN (SELECT id FROM districts);
    `);

    console.log('\nForeign Key Integrity Verification:');
    console.log(`  Orphan destinations:   ${orphanDest.rows[0].count} (Must be 0)`);
    console.log(`  Orphan food places:    ${orphanFood.rows[0].count} (Must be 0)`);
    console.log(`  Orphan accommodations: ${orphanAcc.rows[0].count} (Must be 0)`);

    // District breakdown query
    const breakdown = await client.query(`
      SELECT d.name, COUNT(dest.id)::int as destination_count
      FROM districts d
      LEFT JOIN destinations dest ON dest.district_id = d.id
      GROUP BY d.id, d.name
      ORDER BY d.name;
    `);

    console.log('\nDestinations Per District:');
    for (const row of breakdown.rows) {
      console.log(`  • ${row.name.padEnd(35)}: ${row.destination_count} places`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    return true;
  } catch (error: any) {
    if (client) {
      await client.query('ROLLBACK');
      console.error('\n⚠️ Transaction rolled back due to error!');
    }
    console.error('❌ Seeding error:', error.message);
    return false;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

// Direct execution from CLI (npm run db:seed)
if (process.argv[1]?.includes('seed')) {
  seedDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}
