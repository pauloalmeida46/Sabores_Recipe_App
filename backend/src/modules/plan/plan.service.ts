import { AppError } from '../../utils/AppError';
import { recipesRepository } from '../recipes/recipes.repository';
import { nutritionService } from '../nutrition/nutrition.service';
import { profileService } from '../profile/profile.service';
import { planRepository } from './plan.repository';
import { MealSlot, PlanWeek, Weekday } from './plan.types';
import { NutritionTotals } from '../nutrition/nutrition.types';

export const planService = {
  getWeek(ownerId: string): PlanWeek {
    return planRepository.getWeek(ownerId);
  },

  setMeal(ownerId: string, weekday: Weekday, meal: MealSlot, recipeId: string | null) {
    if (recipeId !== null && !recipesRepository.findById(recipeId)) {
      throw AppError.badRequest(`Receita ${recipeId} não encontrada.`);
    }
    const day = planRepository.setMeal(ownerId, weekday, meal, recipeId);
    if (!day) throw AppError.notFound(`Dia ${weekday} não encontrado no plano da semana.`);
    return day;
  },

  weekNutrition(ownerId: string): { totals: NutritionTotals; missingRecipes: string[] } {
    const { days } = planRepository.getWeek(ownerId);
    const totalsList: NutritionTotals[] = [];
    const missingRecipes: string[] = [];

    for (const day of days) {
      for (const meal of ['almoco', 'jantar', 'lanche'] as MealSlot[]) {
        const recipeId = day[meal].recipeId;
        if (!recipeId) continue;
        const recipe = recipesRepository.findById(recipeId);
        if (!recipe) {
          missingRecipes.push(recipeId);
          continue;
        }
        totalsList.push(nutritionService.computeRecipeNutrition(recipe).totals);
      }
    }

    return { totals: nutritionService.sumTotals(totalsList), missingRecipes };
  },

  weekNutritionComparison(ownerId: string) {
    const { totals } = this.weekNutrition(ownerId);
    const goals = profileService.get(ownerId).dailyGoals;
    const weeklyGoals: Record<keyof typeof goals, number> = {
      calories: goals.calories * 7,
      protein: goals.protein * 7,
      carbs: goals.carbs * 7,
      fat: goals.fat * 7,
      fiber: goals.fiber * 7,
      sodium: goals.sodium * 7,
      sugar: goals.sugar * 7,
    };

    const comparison = (Object.keys(weeklyGoals) as Array<keyof typeof goals>).map((key) => {
      const total = totals[key];
      const goal = weeklyGoals[key];
      return {
        nutrient: key,
        total: Math.round(total * 10) / 10,
        goal: Math.round(goal * 10) / 10,
        percentage: goal > 0 ? Math.round((total / goal) * 1000) / 10 : 0,
      };
    });

    return { comparison };
  },
};
