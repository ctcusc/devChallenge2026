import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError } from '@/lib/errors';

type Params = { params: { id: string } };

/**
 * GET /api/restaurants/:id
 * Returns a single restaurant, or 404 if it doesn't exist.
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /api/restaurants/:id
 * Update an existing restaurant.
 *
 * TODO: implement. Update the row matching :id and return the updated record
 * (or 404 if it doesn't exist). Validate the body the same way POST does.
 */
export async function PUT(_req: Request, _ctx: Params) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

/**
 * DELETE /api/restaurants/:id
 * Delete a restaurant.
 *
 * TODO: implement. Delete the row matching :id and return 204 (or 404 if it
 * doesn't exist). Decide what should happen to that restaurant's visits.
 */
export async function DELETE(_req: Request, _ctx: Params) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
