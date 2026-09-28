import { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { duplicateService } from './duplicate.service';

export const duplicateController = {
  check(req: Request, res: Response) {
    const { title, ingredients, steps } = req.body;
    if (!title || !Array.isArray(ingredients) || !Array.isArray(steps)) {
      throw AppError.badRequest('title, ingredients e steps são obrigatórios.');
    }
    res.json(duplicateService.check({ title, ingredients, steps }, req.userId));
  },

  merge(req: Request, res: Response) {
    const { draft, choices } = req.body;
    if (!draft || !choices) {
      throw AppError.badRequest('draft e choices são obrigatórios.');
    }
    res.json(duplicateService.merge(req.params.id, draft, choices, req.userId));
  },
};
