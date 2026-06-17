import { Request, Response, NextFunction } from 'express';

/**
 * Logs one line per request once the response finishes:
 *
 *   GET /restaurants 200 4ms
 *
 * Wired up globally in src/index.ts. Extend it however you like (request ids,
 * structured JSON, skipping health checks, ...).
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });

  next();
}
