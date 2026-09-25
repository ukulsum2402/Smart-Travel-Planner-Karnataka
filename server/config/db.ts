import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Helper to determine SSL settings for remote database (e.g. Neon, Supabase)
const getSslConfig = (databaseUrl?: string) => {
  if (!databaseUrl) return false;
  if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
    return false;
  }
  return { rejectUnauthorized: false };
};

// PostgreSQL connection pool configuration
// Supports connection via DATABASE_URL or individual PG* environment variables
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: getSslConfig(process.env.DATABASE_URL),
        max: 10,
        connectionTimeoutMillis: 10000,
      }
    : {
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'smart_travel_planner',
        password: process.env.PGPASSWORD || '',
        port: Number(process.env.PGPORT) || 5432,
        connectionTimeoutMillis: 5000,
      }
);

// Prevent pool crashes from idle client drop
pool.on('error', (err) => {
  console.warn('⚠️ Idle PostgreSQL pool client error:', err.message);
});

// Helper function to run queries with error logging
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Test connection helper
export const testConnection = async (): Promise<{ success: boolean; message: string; timestamp?: string }> => {
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as database');
    return {
      success: true,
      message: `Connected successfully to PostgreSQL database: ${res.rows[0].database}`,
      timestamp: res.rows[0].current_time,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `PostgreSQL connection failed: ${err.message}`,
    };
  }
};

