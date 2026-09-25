import { Router, Request, Response } from 'express';
import { query } from '../config/db.js';
import { KARNATAKA_DESTINATIONS } from '../../src/data/destinations.js';
import { KARNATAKA_DISTRICTS } from '../../src/data/districts.js';
import { KARNATAKA_FOOD_PLACES } from '../../src/data/foodPlaces.js';
import { KARNATAKA_ACCOMMODATIONS } from '../../src/data/accommodations.js';

export const destinationRouter = Router();

// GET all destinations with search & filtering
destinationRouter.get('/', async (req: Request, res: Response): Promise<any> => {
  const { search, district, category, hidden } = req.query;

  try {
    let sql = `
      SELECT
        id, name, slug, district_id as "districtId", district_name as "districtName",
        categories, short_description as "shortDescription", full_description as "fullDescription",
        why_visit as "whyVisit", image, gallery, latitude::float, longitude::float,
        visit_duration as "visitDuration", entry_fee_string as "entryFee", timings,
        best_months as "bestMonths", rating::float, activities,
        is_hidden_gem as "isHiddenGem", is_featured as "isFeatured",
        accessibility_notes as "accessibilityNotes"
      FROM destinations
      WHERE 1=1
    `;
    const params: any[] = [];

    if (district && district !== 'all') {
      params.push(district);
      sql += ` AND district_id = $${params.length}`;
    }

    if (hidden === 'true') {
      sql += ` AND is_hidden_gem = TRUE`;
    }

    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND $${params.length} = ANY(categories)`;
    }

    if (search && typeof search === 'string' && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      const pIdx = params.length;
      sql += ` AND (
        LOWER(name) LIKE $${pIdx} OR
        LOWER(short_description) LIKE $${pIdx} OR
        LOWER(district_name) LIKE $${pIdx} OR
        EXISTS (SELECT 1 FROM unnest(categories) cat WHERE LOWER(cat) LIKE $${pIdx})
      )`;
    }

    sql += ` ORDER BY rating DESC, name ASC;`;

    const result = await query(sql, params);

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        source: 'database',
        count: result.rows.length,
        destinations: result.rows,
      });
    }
  } catch (err: any) {
    console.warn('DB query for destinations failed, using static source:', err.message);
  }

  // Fallback to static frontend data with same filter logic
  let list = [...KARNATAKA_DESTINATIONS];

  if (district && district !== 'all') {
    list = list.filter(d => d.districtId === district);
  }

  if (hidden === 'true') {
    list = list.filter(d => d.isHiddenGem);
  }

  if (category && category !== 'all') {
    list = list.filter(d => d.categories.some(c => c.toLowerCase() === (category as string).toLowerCase()));
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.shortDescription.toLowerCase().includes(q) ||
      d.districtName.toLowerCase().includes(q) ||
      d.categories.some(c => c.toLowerCase().includes(q))
    );
  }

  return res.json({
    success: true,
    source: 'static',
    count: list.length,
    destinations: list,
  });
});

// GET destination by slug
destinationRouter.get('/:slug', async (req: Request, res: Response): Promise<any> => {
  const { slug } = req.params;

  try {
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
      WHERE slug = $1;
    `, [slug]);

    if (destResult.rows.length > 0) {
      const destination = destResult.rows[0];

      // Fetch district
      const distResult = await query(`
        SELECT id, name, slug, zone, tagline, description, best_time_to_visit as "bestTimeToVisit"
        FROM districts
        WHERE id = $1;
      `, [destination.districtId]);

      // Fetch food places in this district
      const foodResult = await query(`
        SELECT id, name, district_id as "districtId", specialty, cuisine, price_range as "priceRange",
               description, meal_type as "mealType", recommended_dish as "recommendedDish"
        FROM food_places
        WHERE district_id = $1
        ORDER BY name ASC;
      `, [destination.districtId]);

      // Fetch accommodations in this district
      const accResult = await query(`
        SELECT id, name, district_id as "districtId", location_area as "locationArea",
               tier, approx_price_per_night as "approxPricePerNight", rating::float,
               description, amenities, image_url as "image"
        FROM accommodations
        WHERE district_id = $1
        ORDER BY approx_price_per_night ASC;
      `, [destination.districtId]);

      return res.json({
        success: true,
        source: 'database',
        destination,
        district: distResult.rows[0] || null,
        foodPlaces: foodResult.rows,
        accommodations: accResult.rows,
      });
    }
  } catch (err: any) {
    console.warn(`DB query for destination ${slug} failed, using static source:`, err.message);
  }

  // Fallback to static frontend data
  const destination = KARNATAKA_DESTINATIONS.find(d => d.slug === slug);
  if (!destination) {
    return res.status(404).json({
      success: false,
      message: `Destination with slug "${slug}" not found.`,
    });
  }

  const district = KARNATAKA_DISTRICTS.find(d => d.id === destination.districtId);
  const foodPlaces = KARNATAKA_FOOD_PLACES.filter(f => f.districtId === destination.districtId);
  const accommodations = KARNATAKA_ACCOMMODATIONS.filter(a => a.districtId === destination.districtId);

  return res.json({
    success: true,
    source: 'static',
    destination,
    district,
    foodPlaces,
    accommodations,
  });
});
