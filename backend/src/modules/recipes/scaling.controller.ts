import { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { scalingService } from './scaling.service';
import { applySubstitutionService } from './apply-substitution.service';

export const scalingController = {
  scale(req: Request, res: Response) {
    const targetServings = Number(req.body.targetServings);
    if (!targetServings || Number.isNaN(targetServings)) {
      throw AppError.badRequest('targetServings é obrigatório e deve ser um número.');
    }
    res.json(scalingService.scale(req.params.id, targetServings));
  },

  applySubstitution(req: Request, res: Response) {
    const { ingredientId, substitutionName } = req.body;
    if (!ingredientId || !substitutionName) {
      throw AppError.badRequest('ingredientId e substitutionName são obrigatórios.');
    }
    const ingredients = applySubstitutionService.apply(req.params.id, ingredientId, substitutionName);
    res.json({ recipeId: req.params.id, ingredients });
  },
};
