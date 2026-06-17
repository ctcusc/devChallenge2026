import fs from 'fs';
import path from 'path';
import { pool } from './pool';

/**
 * Tiny migration runner: executes every .sql file in ./migrations in
 * alphabetical order. The migrations use `IF NOT EXISTS`, so re-running is safe.
 *
 * This is deliberately minimal. If you outgrow it, a real migration tool
 * (node-pg-migrate, Knex, Prisma, ...) is fair game.
 */
async function migrate(): Promise<void> {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No migration files found.');
    return;
  }

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }

  console.log(`Applied ${files.length} migration(s).`);
}

migrate()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    pool.end().finally(() => process.exit(1));
  });
