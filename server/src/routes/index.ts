import { Router } from 'express';
import restaurantsRouter from './restaurants';

const router = Router();

router.use('/restaurants', restaurantsRouter);

// TODO: visits router is not implemented yet. There is no ./visits route file.
// Build out the Visit API (list, get, create, update, delete) and mount it here,
// e.g. router.use('/visits', visitsRouter) - and/or nest visits under a
// restaurant, e.g. GET /restaurants/:id/visits.

export default router;
