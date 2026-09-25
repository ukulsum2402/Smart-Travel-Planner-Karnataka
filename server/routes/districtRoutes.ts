import { Router, Request, Response } from 'express';
import { query } from '../config/db.js';
import { KARNATAKA_DISTRICTS } from '../../src/data/districts.js';
import { KARNATAKA_DESTINATIONS } from '../../src/data/destinations.js';
import { KARNATAKA_FOOD_PLACES } from '../../src/data/foodPlaces.js';
import { KARNATAKA_ACCOMMODATIONS } from '../../src/data/accommodations.js';

export const districtRouter = Router();

// GET all districts
districtRouter.get('/', async (_req: Request, res: Response): Promise<any> => {
  try {
    const result = await query(`
      SELECT
        id, name, slug, kannada_name as "kannadaName", zone, region, tagline,
        description, headquarters, best_time_to_visit as "bestTimeToVisit",
        ideal_days as "idealDays", weather_summary as "weatherSummary",
        latitude::float, longitude::float,
        popular_experiences as "popularExperiences",
        destinations_count as "destinationsCount",
        hero_image as "heroImage",
        must_visit_place_ids as "mustVisitPlaceIds"
      FROM districts
      ORDER BY name ASC;
    `);

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        source: 'database',
        count: result.rows.length,
        districts: result.rows,
      });
    }
  } catch (err: any) {
    console.warn('DB query for districts failed, using static source:', err.message);
  }

  // Fallback to static frontend source
  return res.json({
    success: true,
    source: 'static',
    count: KARNATAKA_DISTRICTS.length,
    districts: KARNATAKA_DISTRICTS,
  });
});

// GET district by slug (with associated destinations, food, and accommodations)
districtRouter.get('/:slug', async (req: Request, res: Response): Promise<any> => {
  const { slug } = req.params;

  try {
    const distResult = await query(`
      SELECT
        id, name, slug, kannada_name as "kannadaName", zone, region, tagline,
        description, headquarters, best_time_to_visit as "bestTimeToVisit",
        ideal_days as "idealDays", weather_summary as "weatherSummary",
        latitude::float, longitude::float,
        popular_experiences as "popularExperiences",
        destinations_count as "destinationsCount",
        hero_image as "heroImage"
      FROM districts
      WHERE slug = $1;
    `, [slug]);

    if (distResult.rows.length > 0) {
      const district = distResult.rows[0];

      // Fetch related destinations
      const destResult = await query(`
        SELECT
          id, name, slug, district_id as "districtId", district_name as "districtName",
          categories, short_description as "shortDescription", full_description as "fullDescription",
          why_visit as "whyVisit", image, gallery, latitude::float, longitude::float,
          visit_duration as "visitDuration", entry_fee_string as "entryFee", timings,
          best_months as "bestMonths", rating::float, activities,
          is_hidden_gem as "isHiddenGem", is_featured as "isFeatured",
          accessibility_notes as "accessibilityNotes"
        FROM destinations
        WHERE district_id = $1
        ORDER BY name ASC;
      `, [district.id]);

      // Fetch related food places
      const foodResult = await query(`
        SELECT
          id, name, district_id as "districtId", specialty, cuisine,
          price_range as "priceRange", description, meal_type as "mealType",
          recommended_dish as "recommendedDish"
        FROM food_places
        WHERE district_id = $1
        ORDER BY name ASC;
      `, [district.id]);

      // Fetch related accommodations
      const accResult = await query(`
        SELECT
          id, name, district_id as "districtId", location_area as "locationArea",
          tier, approx_price_per_night as "approxPricePerNight", rating::float,
          description, amenities, image_url as "image"
        FROM accommodations
        WHERE district_id = $1
        ORDER BY approx_price_per_night ASC;
      `, [district.id]);

      return res.json({
        success: true,
        source: 'database',
        district,
        destinations: destResult.rows,
        foodPlaces: foodResult.rows,
        accommodations: accResult.rows,
      });
    }
  } catch (err: any) {
    console.warn(`DB query for district ${slug} failed, using static source:`, err.message);
  }

  // Fallback to static frontend source
  const district = KARNATAKA_DISTRICTS.find(d => d.slug === slug);
  if (!district) {
    return res.status(404).json({
      success: false,
      message: `District with slug "${slug}" not found.`,
    });
  }

  const destinations = KARNATAKA_DESTINATIONS.filter(d => d.districtId === district.id);
  const foodPlaces = KARNATAKA_FOOD_PLACES.filter(f => f.districtId === district.id);
  const accommodations = KARNATAKA_ACCOMMODATIONS.filter(a => a.districtId === district.id);

  return res.json({
    success: true,
    source: 'static',
    district,
    destinations,
    foodPlaces,
    accommodations,
  });
});
