import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';

/** Parses & replaces req.body with the schema output, forwarding ZodErrors to the error handler. */
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}

/** Parses & replaces req.query (as a typed object on req) with the schema output. */
export function validateQuery(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      (req as Request & { validatedQuery: unknown }).validatedQuery = schema.parse(req.query);
      next();
    } catch (err) {
      next(err);
    }
  };
}
