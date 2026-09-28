import { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { recipesRepository } from '../recipes/recipes.repository';
import { nutritionService } from './nutrition.service';

export const nutritionController = {
  getForRecipe(req: Request, res: Response) {
    const recipe = recipesRepository.findById(req.params.id);
    if (!recipe) throw AppError.notFound(`Receita ${req.params.id} não encontrada.`);
    res.json(nutritionService.computeRecipeNutrition(recipe));
  },
};
