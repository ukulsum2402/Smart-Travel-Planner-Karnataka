import { query } from '../config/db.js';

/**
 * Reusable Database Query Helpers for Karnataka Smart Travel Planner
 */

// Districts Queries
export async function getAllDistricts() {
  const res = await query(`
    SELECT 
      id, slug, name, kannada_name as "kannadaName",
      zone, region, tagline, description,
      headquarters, best_time_to_visit as "bestTimeToVisit",
      ideal_days as "idealDays", weather_summary as "weatherSummary",
      latitude, longitude, popular_experiences as "popularExperiences",
      destinations_count as "destinationsCount",
      hero_image as "heroImage", must_visit_place_ids as "mustVisitPlaceIds",
      created_at as "createdAt"
    FROM districts
    ORDER BY name ASC;
  `);
  return res.rows;
}

export async function getDistrictBySlug(slug: string) {
  const res = await query(`
    SELECT 
      id, slug, name, kannada_name as "kannadaName",
      zone, region, tagline, description,
      headquarters, best_time_to_visit as "bestTimeToVisit",
      ideal_days as "idealDays", weather_summary as "weatherSummary",
      latitude, longitude, popular_experiences as "popularExperiences",
      destinations_count as "destinationsCount",
      hero_image as "heroImage", must_visit_place_ids as "mustVisitPlaceIds",
      created_at as "createdAt"
    FROM districts
    WHERE slug = $1 OR id = $1;
  `, [slug]);
  return res.rows[0] || null;
}

// Destinations Queries
export async function getAllDestinations(districtId?: string) {
  let sql = `
    SELECT 
      id, slug, name, district_id as "districtId", district_name as "districtName",
      categories, short_description as "shortDescription", full_description as "fullDescription",
      why_visit as "whyVisit", image, gallery, latitude, longitude,
      visit_duration as "visitDuration", entry_fee as "entryFee",
      entry_fee_amount as "entryFeeAmount", entry_fee_string as "entryFeeString",
      timings, best_months as "bestMonths", rating, activities,
      is_hidden_gem as "isHiddenGem", is_featured as "isFeatured",
      accessibility_notes as "accessibilityNotes", created_at as "createdAt"
    FROM destinations
  `;
  const params: any[] = [];
  if (districtId) {
    sql += ` WHERE district_id = $1`;
    params.push(districtId);
  }
  sql += ` ORDER BY name ASC;`;
  const res = await query(sql, params);
  return res.rows;
}

export async function getDestinationBySlug(slug: string) {
  const res = await query(`
    SELECT 
      id, slug, name, district_id as "districtId", district_name as "districtName",
      categories, short_description as "shortDescription", full_description as "fullDescription",
      why_visit as "whyVisit", image, gallery, latitude, longitude,
      visit_duration as "visitDuration", entry_fee as "entryFee",
      entry_fee_amount as "entryFeeAmount", entry_fee_string as "entryFeeString",
      timings, best_months as "bestMonths", rating, activities,
      is_hidden_gem as "isHiddenGem", is_featured as "isFeatured",
      accessibility_notes as "accessibilityNotes", created_at as "createdAt"
    FROM destinations
    WHERE slug = $1 OR id = $1;
  `, [slug]);
  return res.rows[0] || null;
}

// Food Places Queries
export async function getFoodPlaces(districtId?: string) {
  let sql = `
    SELECT 
      id, name, district_id as "districtId", specialty,
      cuisine, price_range as "priceRange", description,
      meal_type as "mealType", recommended_dish as "recommendedDish",
      created_at as "createdAt"
    FROM food_places
  `;
  const params: any[] = [];
  if (districtId) {
    sql += ` WHERE district_id = $1`;
    params.push(districtId);
  }
  sql += ` ORDER BY name ASC;`;
  const res = await query(sql, params);
  return res.rows;
}

// Accommodations Queries
export async function getAccommodations(districtId?: string) {
  let sql = `
    SELECT 
      id, name, district_id as "districtId", location_area as "locationArea",
      tier, approx_price_per_night as "approxPricePerNight", rating,
      description, amenities, image_url as "image", created_at as "createdAt"
    FROM accommodations
  `;
  const params: any[] = [];
  if (districtId) {
    sql += ` WHERE district_id = $1`;
    params.push(districtId);
  }
  sql += ` ORDER BY tier ASC, rating DESC;`;
  const res = await query(sql, params);
  return res.rows;
}

// Interests Queries
export async function getAllInterests() {
  const res = await query(`
    SELECT id, name, description, icon, badge_color as "badgeColor"
    FROM interests
    ORDER BY name ASC;
  `);
  return res.rows;
}

// Starting Locations Queries
export async function getAllStartingLocations() {
  const res = await query(`
    SELECT id, name, latitude, longitude
    FROM starting_locations
    ORDER BY name ASC;
  `);
  return res.rows;
}
