import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { authService } from '../modules/auth/auth.service';

/**
 * Reads `Authorization: Bearer <token>`, resolves it to a user via
 * authService, and sets `req.userId`. Throws (401) if missing/invalid —
 * Express 4 forwards synchronous throws from middleware to errorHandler.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : undefined;
  if (!token) {
    throw AppError.unauthorized('Autenticação necessária. Envie o header Authorization: Bearer <token>.');
  }

  const user = authService.resolveToken(token);
  if (!user) {
    throw AppError.unauthorized('Sessão inválida ou expirada.');
  }

  req.userId = user.id;
  next();
}

/**
 * Same token resolution as `requireAuth`, but never throws: a missing or
 * invalid token simply leaves `req.userId` undefined and calls `next()`.
 * Used on routes that must stay public/browsable (e.g. the recipe catalog)
 * but that behave better when they DO know who's asking — e.g. computing
 * per-account safety certification when a valid session happens to be
 * present, without requiring one.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : undefined;
  if (token) {
    const user = authService.resolveToken(token);
    if (user) {
      req.userId = user.id;
    }
  }
  next();
}
