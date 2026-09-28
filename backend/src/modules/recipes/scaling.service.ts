/**
 * Recipe scaling (US-035, RF62-64).
 *
 * Ingredient quantities scale by targetServings/originalServings, except:
 *  - scalingRule 'fixed'  -> quantity unchanged (e.g. "a gosto" seasoning)
 *  - scalingRule 'sqrt'   -> scales by sqrt(ratio), a common non-linear rule
 *    for leavening/spices where doubling servings shouldn't double the punch
 *    (AC2).
 *
 * Equipment-capacity warning (AC3) heuristic, documented here since the AC
 * doesn't pin an exact formula: we estimate the scaled recipe's total liquid
 * volume by converting each scaled ingredient to liters (volume units
 * directly, weight units via the seeded density table when known; count-based
 * units like "unid"/"a gosto" are treated as negligible and skipped) and warn
 * when that estimate exceeds `equipmentCapacityLiters`.
 */
import { AppError } from '../../utils/AppError';
import { recipesRepository } from './recipes.repository';
import { conversionsService } from '../conversions/conversions.service';
import { RecipeIngredient } from './recipes.types';

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function scaleQuantity(ingredient: RecipeIngredient, ratio: number): number {
  if (ingredient.scalingRule === 'fixed') return ingredient.quantity;
  if (ingredient.scalingRule === 'sqrt') return round(ingredient.quantity * Math.sqrt(ratio));
  return round(ingredient.quantity * ratio);
}

/**
 * Sums each ingredient's estimated volume in liters, reusing the module 9
 * conversion+density logic. Volume units (and household measures) convert
 * directly; weight units convert via the seeded density table when known.
 * Count-based units ("unid", "a gosto", "garrafa", ...) and weight units
 * with no known density are treated as a negligible volume contribution.
 */
function estimateVolumeLiters(ingredients: RecipeIngredient[]): number {
  let totalMl = 0;
  for (const ing of ingredients) {
    try {
      const result = conversionsService.convert({
        value: ing.quantity,
        fromUnit: ing.unit,
        toUnit: 'ml',
        ingredient: ing.name,
      });
      if (result.ok) totalMl += result.value;
    } catch {
      // Unit not recognized as weight/volume (e.g. "unid", "a gosto") — skip.
    }
  }
  return totalMl / 1000;
}

export interface ScaleResult {
  recipeId: string;
  originalServings: number;
  targetServings: number;
  ratio: number;
  ingredients: RecipeIngredient[];
  warning?: string;
}

export const scalingService = {
  scale(recipeId: string, targetServings: number): ScaleResult {
    if (targetServings <= 0) throw AppError.badRequest('targetServings deve ser maior que zero.');
    const recipe = recipesRepository.findById(recipeId);
    if (!recipe) throw AppError.notFound(`Receita ${recipeId} não encontrada.`);

    const ratio = targetServings / recipe.servings;
    const scaledIngredients = recipe.ingredients.map((ing) => ({
      ...ing,
      quantity: scaleQuantity(ing, ratio),
    }));

    const result: ScaleResult = {
      recipeId,
      originalServings: recipe.servings,
      targetServings,
      ratio: round(ratio),
      ingredients: scaledIngredients,
    };

    if (recipe.equipmentCapacityLiters) {
      const estimatedLiters = estimateVolumeLiters(scaledIngredients);
      if (estimatedLiters > recipe.equipmentCapacityLiters) {
        result.warning = `O volume estimado (~${round(estimatedLiters)} L) pode exceder a capacidade do equipamento (${recipe.equipmentCapacityLiters} L). Considere preparar em lotes.`;
      }
    }

    return result;
  },
};
