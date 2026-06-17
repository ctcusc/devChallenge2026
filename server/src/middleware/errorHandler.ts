import { Request, Response, NextFunction } from 'express';

/**
 * Central error handler. Express recognizes it as an error handler because it
 * takes four arguments. Register it LAST, after all routes, in src/index.ts.
 *
 * This is a stub. Right now it always returns a generic 500. A real
 * implementation would inspect the error (validation vs. not-found vs.
 * unexpected) and choose an appropriate status code and shape.
 *
 * TODO: map known error types to proper status codes (400, 404, 409, ...)
 * TODO: avoid leaking internal error details in production responses
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled error:', err);

  res.status(500).json({
    error: 'Internal Server Error',
  });
}
