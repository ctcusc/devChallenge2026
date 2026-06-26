// Load .env as a side effect on import. pool.ts is imported both by the server
// (via app/routes) and by the standalone migrate/seed scripts, so each of those
// entry points gets DATABASE_URL without having to wire up dotenv itself.
import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  // Fail loudly rather than silently connecting to some default database.
  throw new Error(
    'DATABASE_URL is not set. Copy server/.env.example to server/.env and fill it in.'
  );
}

/**
 * A single shared connection pool for the whole server. Import this `pool`
 * anywhere you need to talk to the database, e.g.
 *
 *   import { pool } from '../db/pool';
 *   const { rows } = await pool.query('SELECT * FROM restaurants');
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  // A pooled client errored while idle. Log it; don't crash the process.
  console.error('Unexpected error on idle PostgreSQL client', err);
});
