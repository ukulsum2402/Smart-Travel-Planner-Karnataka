import { Router, Response } from 'express';
import { query } from '../config/db.js';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { generateDynamicItinerary } from '../../src/services/itineraryGenerator.js';
import { SAMPLE_TRIPS } from '../../src/data/sampleTrips.js';
import { Trip, PlannerState } from '../../src/types/index.js';

export const tripRouter = Router();

// In-memory fallback storage when PostgreSQL is not connected yet
const inMemoryTrips: Map<string, Trip> = new Map();
SAMPLE_TRIPS.forEach(t => inMemoryTrips.set(t.id, t));

// Helper to format trip row from database to frontend Trip interface
function formatDbTrip(row: any): Trip {
  return {
    id: row.id,
    title: row.title,
    startingPoint: row.starting_point,
    selectedDistricts: row.selected_districts,
    selectedDistrictNames: row.selected_district_names,
    durationDays: row.duration_days,
    interests: row.interests,
    transport: row.transport,
    budgetTier: row.budget_tier,
    travelersCount: row.travelers_count,
    endPoint: row.end_point,
    routeSummary: row.title,
    createdAt: row.created_at,
    days: row.days,
    budgetEstimate: row.budget_estimate,
    waypoints: row.waypoints,
    essentialsToCarry: row.essentials_to_carry,
    seasonalTips: row.seasonal_tips,
    coverImage: row.cover_image,
    isCustomSaved: row.is_custom_saved,
  };
}

// POST /api/trips/generate: Generate dynamic itinerary and save to database
tripRouter.post('/generate', optionalAuth, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const plan: PlannerState = req.body;

    if (!plan.selectedDistricts || plan.selectedDistricts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one Karnataka district must be selected for trip generation.',
      });
    }

    // Generate dynamic itinerary using verified Karnataka dataset
    const trip = generateDynamicItinerary(plan);
    trip.isCustomSaved = true;

    const userId = req.user?.id || null;

    try {
      const insertQuery = `
        INSERT INTO trips (
          id, user_id, title, starting_point, end_point, duration_days,
          selected_districts, selected_district_names, interests, transport,
          budget_tier, travelers_count, cover_image, days, waypoints,
          budget_estimate, essentials_to_carry, seasonal_tips, is_custom_saved
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          days = EXCLUDED.days,
          waypoints = EXCLUDED.waypoints,
          budget_estimate = EXCLUDED.budget_estimate,
          is_custom_saved = EXCLUDED.is_custom_saved
        RETURNING *;
      `;

      await query(insertQuery, [
        trip.id,
        userId,
        trip.title,
        trip.startingPoint,
        trip.endPoint,
        trip.durationDays,
        trip.selectedDistricts,
        trip.selectedDistrictNames,
        trip.interests,
        trip.transport,
        trip.budgetTier,
        trip.travelersCount,
        JSON.stringify(trip.coverImage),
        JSON.stringify(trip.days),
        JSON.stringify(trip.waypoints),
        JSON.stringify(trip.budgetEstimate),
        trip.essentialsToCarry,
        trip.seasonalTips,
        true,
      ]);

      return res.status(201).json({
        success: true,
        source: 'database',
        trip,
      });
    } catch (dbErr: any) {
      console.warn('DB Insert in /generate failed, saving to local store:', dbErr.message);
      inMemoryTrips.set(trip.id, trip);
      return res.status(201).json({
        success: true,
        source: 'memory',
        trip,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating trip itinerary',
    });
  }
});

// GET /api/trips: Get all trips (or user's saved trips)
tripRouter.get('/', optionalAuth, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    try {
      let sql = 'SELECT * FROM trips';
      const params: any[] = [];

      if (userId) {
        sql += ' WHERE user_id = $1 OR user_id IS NULL';
        params.push(userId);
      }

      sql += ' ORDER BY created_at DESC;';
      const result = await query(sql, params);

      if (result.rows.length > 0) {
        const trips = result.rows.map(formatDbTrip);
        return res.json({
          success: true,
          source: 'database',
          count: trips.length,
          trips,
        });
      }
    } catch (dbErr: any) {
      console.warn('DB query in /trips failed, using in-memory store:', dbErr.message);
    }

    const trips = Array.from(inMemoryTrips.values());
    return res.json({
      success: true,
      source: 'static',
      count: trips.length,
      trips,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching trips',
    });
  }
});

// GET /api/trips/:id: Get trip by ID
tripRouter.get('/:id', async (req, res): Promise<any> => {
  const { id } = req.params;

  try {
    const result = await query('SELECT * FROM trips WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      return res.json({
        success: true,
        source: 'database',
        trip: formatDbTrip(result.rows[0]),
      });
    }
  } catch (dbErr: any) {
    console.warn(`DB query for trip ${id} failed:`, dbErr.message);
  }

  const trip = inMemoryTrips.get(id) || SAMPLE_TRIPS.find(t => t.id === id);
  if (trip) {
    return res.json({
      success: true,
      source: 'memory',
      trip,
    });
  }

  return res.status(404).json({
    success: false,
    message: `Trip with ID "${id}" was not found.`,
  });
});

// POST /api/trips: Save/Create trip
tripRouter.post('/', optionalAuth, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const trip: Trip = req.body;
    const userId = req.user?.id || null;

    try {
      const insertQuery = `
        INSERT INTO trips (
          id, user_id, title, starting_point, end_point, duration_days,
          selected_districts, selected_district_names, interests, transport,
          budget_tier, travelers_count, cover_image, days, waypoints,
          budget_estimate, essentials_to_carry, seasonal_tips, is_custom_saved
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          days = EXCLUDED.days,
          waypoints = EXCLUDED.waypoints,
          budget_estimate = EXCLUDED.budget_estimate,
          is_custom_saved = EXCLUDED.is_custom_saved
        RETURNING *;
      `;

      await query(insertQuery, [
        trip.id,
        userId,
        trip.title,
        trip.startingPoint,
        trip.endPoint,
        trip.durationDays,
        trip.selectedDistricts,
        trip.selectedDistrictNames,
        trip.interests,
        trip.transport,
        trip.budgetTier,
        trip.travelersCount,
        JSON.stringify(trip.coverImage),
        JSON.stringify(trip.days),
        JSON.stringify(trip.waypoints),
        JSON.stringify(trip.budgetEstimate),
        trip.essentialsToCarry,
        trip.seasonalTips,
        trip.isCustomSaved ?? true,
      ]);

      return res.status(201).json({
        success: true,
        source: 'database',
        trip,
      });
    } catch (dbErr: any) {
      console.warn('DB Insert in POST /trips failed:', dbErr.message);
      inMemoryTrips.set(trip.id, trip);
      return res.status(201).json({
        success: true,
        source: 'memory',
        trip,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error saving trip',
    });
  }
});

// PUT /api/trips/:id: Update trip (e.g. toggle bookmark/save state)
tripRouter.put('/:id', async (req, res): Promise<any> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.isCustomSaved !== undefined) {
      const result = await query(
        'UPDATE trips SET is_custom_saved = $1 WHERE id = $2 RETURNING *',
        [updates.isCustomSaved, id]
      );
      if (result.rows.length > 0) {
        return res.json({
          success: true,
          source: 'database',
          trip: formatDbTrip(result.rows[0]),
        });
      }
    }
  } catch (dbErr: any) {
    console.warn(`DB update for trip ${id} failed:`, dbErr.message);
  }

  const existing = inMemoryTrips.get(id);
  if (existing) {
    const updated = { ...existing, ...updates };
    inMemoryTrips.set(id, updated);
    return res.json({
      success: true,
      source: 'memory',
      trip: updated,
    });
  }

  return res.status(404).json({
    success: false,
    message: `Trip with ID "${id}" not found.`,
  });
});

// DELETE /api/trips/:id: Delete trip
tripRouter.delete('/:id', async (req, res): Promise<any> => {
  const { id } = req.params;

  try {
    await query('DELETE FROM trips WHERE id = $1', [id]);
  } catch (dbErr: any) {
    console.warn(`DB delete for trip ${id} failed:`, dbErr.message);
  }

  inMemoryTrips.delete(id);

  return res.json({
    success: true,
    message: `Trip ${id} removed successfully.`,
  });
});
