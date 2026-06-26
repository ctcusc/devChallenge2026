import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';

/**
 * GET /api/restaurants
 * Returns all restaurants.
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants ORDER BY created_at DESC'
    );
    return NextResponse.json(rows);
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/restaurants
 * Create a new restaurant.
 *
 * TODO: implement. Read the restaurant fields from the request body, insert a
 * row, and return the created restaurant with a 201 status.
 * Note: `rating` currently has no validation anywhere - decide what valid means
 * (e.g. reject anything outside 0-5 with a 400).
 */
export async function POST(_req: Request) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
