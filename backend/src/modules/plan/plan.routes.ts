import { NextFunction, Request, Response, Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth.middleware';
import { AppError } from '../../utils/AppError';
import { planController } from './plan.controller';
import { MEAL_SLOTS, WEEKDAYS } from './plan.types';

const setMealSchema = z.object({
  recipeId: z.string().nullable(),
});

export const planRouter = Router();

// Weekly plan is per-account — every route below requires auth.
planRouter.use(requireAuth);

function validateWeekdayAndMeal(req: Request, _res: Response, next: NextFunction) {
  if (!WEEKDAYS.includes(req.params.weekday as (typeof WEEKDAYS)[number])) {
    return next(AppError.badRequest(`weekday inválido: "${req.params.weekday}". Use um de ${WEEKDAYS.join(', ')}.`));
  }
  if (!MEAL_SLOTS.includes(req.params.meal as (typeof MEAL_SLOTS)[number])) {
    return next(AppError.badRequest(`meal inválido: "${req.params.meal}". Use um de ${MEAL_SLOTS.join(', ')}.`));
  }
  next();
}

planRouter.get('/week/nutrition/comparison', planController.weekNutritionComparison);
planRouter.get('/week/nutrition', planController.weekNutrition);
planRouter.get('/week', planController.getWeek);
planRouter.put('/week/:weekday/:meal', validateWeekdayAndMeal, validateBody(setMealSchema), planController.setMeal);
