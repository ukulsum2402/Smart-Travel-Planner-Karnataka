import fs from 'fs';
import path from 'path';
import { pool } from '../config/db.js';

export async function initializeDatabase() {
  console.log('🔄 Initializing PostgreSQL database tables...');
  try {
    const schemaPath = path.join(process.cwd(), 'server', 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schemaSql);
    console.log('✅ All database tables and indexes created successfully!');
    return { success: true, message: 'Database initialized successfully' };
  } catch (error: any) {
    console.error('❌ Error initializing database:', error.message);
    return { success: false, error: error.message };
  }
}

// If run directly from CLI (e.g. npx tsx server/db/initDb.ts)
if (process.argv[1]?.includes('initDb')) {
  initializeDatabase().then(() => {
    pool.end();
  });
}
