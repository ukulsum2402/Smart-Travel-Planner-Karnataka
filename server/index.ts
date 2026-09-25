import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, query } from './config/db.js';
import { authRouter } from './routes/authRoutes.js';
import { districtRouter } from './routes/districtRoutes.js';
import { destinationRouter } from './routes/destinationRoutes.js';
import { tripRouter } from './routes/tripRoutes.js';
import { travelDataRouter } from './routes/travelDataRoutes.js';
import { seedDatabase } from './db/seed.js';

dotenv.config();

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/districts', districtRouter);
app.use('/api/destinations', destinationRouter);
app.use('/api/trips', tripRouter);
app.use('/api', travelDataRouter);

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  const dbStatus = await testConnection();

  let counts: any = null;
  if (dbStatus.success) {
    try {
      const [dCount, destCount, tripsCount, usersCount] = await Promise.all([
        query('SELECT count(*)::int FROM districts'),
        query('SELECT count(*)::int FROM destinations'),
        query('SELECT count(*)::int FROM trips'),
        query('SELECT count(*)::int FROM users'),
      ]);
      counts = {
        districts: dCount.rows[0].count,
        destinations: destCount.rows[0].count,
        trips: tripsCount.rows[0].count,
        users: usersCount.rows[0].count,
      };
    } catch {}
  }

  res.json({
    success: true,
    message: 'Smart Travel Planner (Karnataka Travel Guide) API is operational',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.success,
      details: dbStatus.message,
      dbTimestamp: dbStatus.timestamp || null,
      counts,
    },
  });
});

// Auto-check and initialize database if DATABASE_URL is present
export async function initializeDatabaseIfConnected() {
  if (!process.env.DATABASE_URL) {
    console.log('ℹ️ DATABASE_URL not set yet. Running in resilient session mode with full static dataset.');
    return;
  }

  try {
    const status = await testConnection();
    if (status.success) {
      console.log('✅ Connected to PostgreSQL database via DATABASE_URL.');
      // Check if seeded
      try {
        const check = await query('SELECT count(*)::int as count FROM districts');
        if (check.rows[0].count === 0) {
          console.log('🌱 Districts table is empty. Running initial database seed...');
          await seedDatabase();
        } else {
          console.log(`📊 Database already seeded with ${check.rows[0].count} Karnataka districts.`);
        }
      } catch (err: any) {
        console.log('🌱 Tables not yet created. Running seed to initialize schema and data...');
        await seedDatabase();
      }
    } else {
      console.warn('⚠️ Could not connect to PostgreSQL:', status.message);
    }
  } catch (err: any) {
    console.warn('⚠️ Database auto-init check skipped:', err.message);
  }
}

export default app;
