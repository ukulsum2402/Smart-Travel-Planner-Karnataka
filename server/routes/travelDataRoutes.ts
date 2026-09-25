import { Router, Request, Response } from 'express';
import { query } from '../config/db.js';
import { KARNATAKA_INTERESTS, STARTING_LOCATIONS } from '../../src/data/interests.js';
import { KARNATAKA_FOOD_PLACES } from '../../src/data/foodPlaces.js';
import { KARNATAKA_ACCOMMODATIONS } from '../../src/data/accommodations.js';

export const travelDataRouter = Router();

// GET all interests
travelDataRouter.get('/interests', async (_req: Request, res: Response): Promise<any> => {
  try {
    const result = await query(`
      SELECT id, name, description, icon, badge_color as "badgeColor"
      FROM interests
      ORDER BY name ASC;
    `);
    if (result.rows.length > 0) {
      return res.json({
        success: true,
        source: 'database',
        count: result.rows.length,
        interests: result.rows,
      });
    }
  } catch (err: any) {
    console.warn('DB query for interests failed, using static source:', err.message);
  }

  return res.json({
    success: true,
    source: 'static',
    count: KARNATAKA_INTERESTS.length,
    interests: KARNATAKA_INTERESTS,
  });
});

// GET all food places
travelDataRouter.get('/food-places', async (req: Request, res: Response): Promise<any> => {
  const { districtId, mealType } = req.query;

  try {
    let sql = `
      SELECT id, name, district_id as "districtId", specialty, cuisine,
             price_range as "priceRange", description, meal_type as "mealType",
             recommended_dish as "recommendedDish"
      FROM food_places
      WHERE 1=1
    `;
    const params: any[] = [];

    if (districtId) {
      params.push(districtId);
      sql += ` AND district_id = $${params.length}`;
    }
    if (mealType) {
      params.push(mealType);
      sql += ` AND meal_type = $${params.length}`;
    }

    sql += ` ORDER BY name ASC;`;
    const result = await query(sql, params);

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        source: 'database',
        count: result.rows.length,
        foodPlaces: result.rows,
      });
    }
  } catch (err: any) {
    console.warn('DB query for food places failed, using static source:', err.message);
  }

  let list = [...KARNATAKA_FOOD_PLACES];
  if (districtId) list = list.filter(f => f.districtId === districtId);
  if (mealType) list = list.filter(f => f.mealType === mealType);

  return res.json({
    success: true,
    source: 'static',
    count: list.length,
    foodPlaces: list,
  });
});

// GET accommodations
travelDataRouter.get('/accommodations', async (req: Request, res: Response): Promise<any> => {
  const { districtId, tier } = req.query;

  try {
    let sql = `
      SELECT id, name, district_id as "districtId", location_area as "locationArea",
             tier, approx_price_per_night as "approxPricePerNight", rating::float,
             description, amenities, image_url as "image"
      FROM accommodations
      WHERE 1=1
    `;
    const params: any[] = [];

    if (districtId) {
      params.push(districtId);
      sql += ` AND district_id = $${params.length}`;
    }
    if (tier) {
      params.push(tier);
      sql += ` AND tier = $${params.length}`;
    }

    sql += ` ORDER BY approx_price_per_night ASC;`;
    const result = await query(sql, params);

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        source: 'database',
        count: result.rows.length,
        accommodations: result.rows,
      });
    }
  } catch (err: any) {
    console.warn('DB query for accommodations failed, using static source:', err.message);
  }

  let list = [...KARNATAKA_ACCOMMODATIONS];
  if (districtId) list = list.filter(a => a.districtId === districtId);
  if (tier) list = list.filter(a => a.tier === tier);

  return res.json({
    success: true,
    source: 'static',
    count: list.length,
    accommodations: list,
  });
});

// GET starting locations
travelDataRouter.get('/starting-locations', async (_req: Request, res: Response): Promise<any> => {
  try {
    const result = await query(`
      SELECT name, latitude::float, longitude::float
      FROM starting_locations
      ORDER BY name ASC;
    `);

    if (result.rows.length > 0) {
      return res.json({
        success: true,
        source: 'database',
        count: result.rows.length,
        locations: result.rows.map(r => r.name),
        details: result.rows,
      });
    }
  } catch (err: any) {
    console.warn('DB query for starting locations failed, using static source:', err.message);
  }

  return res.json({
    success: true,
    source: 'static',
    count: STARTING_LOCATIONS.length,
    locations: STARTING_LOCATIONS,
  });
});
