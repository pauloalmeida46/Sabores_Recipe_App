import { Router } from 'express';
import { nutritionController } from './nutrition.controller';

// Mounted at /api/recipes, adds GET /api/recipes/:id/nutrition
export const nutritionRouter = Router();

nutritionRouter.get('/:id/nutrition', nutritionController.getForRecipe);
