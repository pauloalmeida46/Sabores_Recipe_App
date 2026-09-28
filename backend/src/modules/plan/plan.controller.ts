import { Request, Response } from 'express';
import { planService } from './plan.service';
import { MealSlot, Weekday } from './plan.types';

export const planController = {
  getWeek(req: Request, res: Response) {
    res.json(planService.getWeek(req.userId!));
  },

  setMeal(req: Request, res: Response) {
    const weekday = req.params.weekday as Weekday;
    const meal = req.params.meal as MealSlot;
    const day = planService.setMeal(req.userId!, weekday, meal, req.body.recipeId);
    res.json(day);
  },

  weekNutrition(req: Request, res: Response) {
    res.json(planService.weekNutrition(req.userId!));
  },

  weekNutritionComparison(req: Request, res: Response) {
    res.json(planService.weekNutritionComparison(req.userId!));
  },
};
