/**
 * TACO-style nutrition computation (US-046, RF80-82).
 *
 * Converts each recipe ingredient's quantity to grams (reusing the unit +
 * density conversion logic from the conversions module) and sums the
 * per-100g values from the seeded TACO table, scaled proportionally.
 * Ingredients that can't be converted to grams, or that have no TACO entry,
 * are excluded from the totals and reported under `missingData` instead of
 * silently under/over-reporting.
 */
import { Recipe, RecipeIngredient } from '../recipes/recipes.types';
import { conversionsService } from '../conversions/conversions.service';
import { nutritionRepository } from './nutrition.repository';
import { NutritionTotals } from './nutrition.types';

export interface RecipeNutritionResult {
  recipeId: string;
  servings: number;
  totals: NutritionTotals;
  perServing: NutritionTotals;
  missingData: Array<{ ingredientId: string; name: string; reason: string }>;
}

const ZERO_TOTALS: NutritionTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  sodium: 0,
  sugar: 0,
};

function addScaled(totals: NutritionTotals, per100g: NutritionTotals, grams: number): NutritionTotals {
  const factor = grams / 100;
  return {
    calories: totals.calories + per100g.calories * factor,
    protein: totals.protein + per100g.protein * factor,
    carbs: totals.carbs + per100g.carbs * factor,
    fat: totals.fat + per100g.fat * factor,
    fiber: totals.fiber + per100g.fiber * factor,
    sodium: totals.sodium + per100g.sodium * factor,
    sugar: totals.sugar + per100g.sugar * factor,
  };
}

function round(totals: NutritionTotals): NutritionTotals {
  return {
    calories: Math.round(totals.calories * 10) / 10,
    protein: Math.round(totals.protein * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    fiber: Math.round(totals.fiber * 10) / 10,
    sodium: Math.round(totals.sodium * 10) / 10,
    sugar: Math.round(totals.sugar * 10) / 10,
  };
}

function computeIngredientContribution(ingredient: RecipeIngredient):
  | { ok: true; grams: number; totals: NutritionTotals }
  | { ok: false; reason: string } {
  const grams = conversionsService.toGramsForIngredient(ingredient.quantity, ingredient.unit, ingredient.name);
  if (grams === null) {
    return { ok: false, reason: `Não foi possível converter "${ingredient.unit}" para gramas.` };
  }
  const per100g = nutritionRepository.findByIngredientName(ingredient.name);
  if (!per100g) {
    return { ok: false, reason: `Sem dados nutricionais (TACO) cadastrados para "${ingredient.name}".` };
  }
  return {
    ok: true,
    grams,
    totals: addScaled(ZERO_TOTALS, per100g, grams),
  };
}

export const nutritionService = {
  computeRecipeNutrition(recipe: Recipe): RecipeNutritionResult {
    let totals: NutritionTotals = { ...ZERO_TOTALS };
    const missingData: RecipeNutritionResult['missingData'] = [];

    for (const ingredient of recipe.ingredients) {
      const contribution = computeIngredientContribution(ingredient);
      if (!contribution.ok) {
        missingData.push({ ingredientId: ingredient.id, name: ingredient.name, reason: contribution.reason });
        continue;
      }
      totals = {
        calories: totals.calories + contribution.totals.calories,
        protein: totals.protein + contribution.totals.protein,
        carbs: totals.carbs + contribution.totals.carbs,
        fat: totals.fat + contribution.totals.fat,
        fiber: totals.fiber + contribution.totals.fiber,
        sodium: totals.sodium + contribution.totals.sodium,
        sugar: totals.sugar + contribution.totals.sugar,
      };
    }

    const servings = recipe.servings || 1;
    const perServing: NutritionTotals = {
      calories: totals.calories / servings,
      protein: totals.protein / servings,
      carbs: totals.carbs / servings,
      fat: totals.fat / servings,
      fiber: totals.fiber / servings,
      sodium: totals.sodium / servings,
      sugar: totals.sugar / servings,
    };

    return {
      recipeId: recipe.id,
      servings: recipe.servings,
      totals: round(totals),
      perServing: round(perServing),
      missingData,
    };
  },

  sumTotals(list: NutritionTotals[]): NutritionTotals {
    const sum = list.reduce((acc, t) => ({
      calories: acc.calories + t.calories,
      protein: acc.protein + t.protein,
      carbs: acc.carbs + t.carbs,
      fat: acc.fat + t.fat,
      fiber: acc.fiber + t.fiber,
      sodium: acc.sodium + t.sodium,
      sugar: acc.sugar + t.sugar,
    }), { ...ZERO_TOTALS });
    return round(sum);
  },
};
