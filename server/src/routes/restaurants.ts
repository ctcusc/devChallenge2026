import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool';

const router = Router();

/**
 * GET /restaurants
 * Returns all restaurants.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /restaurants/:id
 * Returns a single restaurant, or 404 if it doesn't exist.
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /restaurants
 * Create a new restaurant.
 *
 * TODO: implement. Read the restaurant fields from req.body, insert a row,
 * and return the created restaurant with a 201 status.
 * Note: `rating` currently has no validation anywhere — decide what valid means.
 */
router.post('/', async (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * PUT /restaurants/:id
 * Update an existing restaurant.
 *
 * TODO: implement. Update the row matching :id and return the updated record
 * (or 404 if it doesn't exist).
 */
router.put('/:id', async (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

/**
 * DELETE /restaurants/:id
 * Delete a restaurant.
 *
 * TODO: implement. Delete the row matching :id and return 204 (or 404 if it
 * doesn't exist). Decide what should happen to that restaurant's visits.
 */
router.delete('/:id', async (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
