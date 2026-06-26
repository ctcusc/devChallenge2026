import express, { Express } from 'express';
import cors from 'cors';

import apiRouter from './routes';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

/**
 * Builds and configures the Express app, but does NOT start listening.
 *
 * Keeping app construction separate from `app.listen()` keeps the wiring in one
 * place and makes the app easy to import elsewhere (scripts, tooling) without
 * binding a port. The server entry point (src/index.ts) imports this and calls
 * listen.
 */
export function createApp(): Express {
  const app = express();
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

  // --- Global middleware ---
  app.use(cors({ origin: clientOrigin.split(',').map((o) => o.trim()) }));
  app.use(express.json());
  app.use(requestLogger);

  // --- Health check ---
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // --- API routes ---
  app.use('/', apiRouter);

  // --- Error handler (must be registered last) ---
  app.use(errorHandler);

  return app;
}
