import { z } from 'zod';
import { AppError } from '../../utils/AppError';
import { RecipeCreateInput } from './recipes.types';

export const ingredientSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Nome do ingrediente é obrigatório.'),
  quantity: z.number({ invalid_type_error: 'Quantidade deve ser um número.' }).nonnegative('Quantidade não pode ser negativa.'),
  unit: z.string().trim().min(1, 'Unidade é obrigatória.'),
  note: z.string().optional(),
  isKeyIngredient: z.boolean().optional(),
  allergens: z.array(z.string()).optional(),
  containsTraceAllergens: z.array(z.string()).optional(),
  scalingRule: z.enum(['linear', 'fixed', 'sqrt']).optional().default('linear'),
});

export const stepSchema = z.object({
  id: z.string().optional(),
  order: z.number().int().optional(),
  text: z.string().trim().min(1, 'Texto do passo é obrigatório.'),
  timerSec: z.number().int().nonnegative().optional(),
  stationLabel: z.string().optional(),
  ingredientRefs: z.array(z.string()).default([]),
});

export const recipeCreateSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório.'),
  cuisine: z.string().trim().min(1, 'Cozinha/estilo é obrigatório.'),
  glyph: z.enum(['fork', 'circle', 'lines', 'plus']).optional(),
  difficulty: z.enum(['Fácil', 'Intermediário', 'Avançado']),
  servings: z.number().int().positive('Número de porções deve ser maior que zero.'),
  prepTimeMin: z.number().nonnegative('prepTimeMin não pode ser negativo.'),
  cookTimeMin: z.number().nonnegative('cookTimeMin não pode ser negativo.'),
  totalTimeMin: z.number().nonnegative('totalTimeMin não pode ser negativo.'),
  costPerServing: z.number().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
  dietTags: z.array(z.string()).optional(),
  equipmentCapacityLiters: z.number().positive().optional(),
  equipmentNeeded: z.array(z.string()).optional(),
  season: z.string().optional(),
  ingredientInfoComplete: z.boolean().optional(),
  ingredients: z.array(ingredientSchema).min(1, 'A receita precisa de ao menos 1 ingrediente.'),
  steps: z.array(stepSchema).min(1, 'A receita precisa de ao menos 1 passo.'),
});

/**
 * Cross-field structural validation for the recipe editor (US-007 AC2/AC3):
 *  - every step's ingredientRefs must reference an existing ingredient id
 *  - totalTimeMin must be >= max(prepTimeMin, cookTimeMin) when both are given
 * Assigns ids/order to ingredients & steps missing them and returns the
 * normalized RecipeCreateInput ready for persistence.
 */
export function validateRecipeStructure(raw: z.infer<typeof recipeCreateSchema>): RecipeCreateInput {
  const ingredients = raw.ingredients.map((ing) => ({
    ...ing,
    id: ing.id ?? crypto.randomUUID(),
    scalingRule: ing.scalingRule ?? 'linear',
  }));
  const ingredientIds = new Set(ingredients.map((i) => i.id));

  const steps = raw.steps.map((s, idx) => ({
    ...s,
    id: s.id ?? crypto.randomUUID(),
    order: s.order ?? idx + 1,
  }));

  for (const step of steps) {
    const missing = step.ingredientRefs.filter((ref) => !ingredientIds.has(ref));
    if (missing.length > 0) {
      throw AppError.badRequest(
        `O passo "${step.text.slice(0, 40)}..." referencia ingredientes inexistentes: ${missing.join(', ')}.`
      );
    }
  }

  if (raw.totalTimeMin < Math.max(raw.prepTimeMin, raw.cookTimeMin)) {
    throw AppError.badRequest(
      'totalTimeMin deve ser maior ou igual ao maior valor entre prepTimeMin e cookTimeMin (tempos incoerentes).'
    );
  }

  return {
    title: raw.title,
    cuisine: raw.cuisine,
    glyph: raw.glyph,
    difficulty: raw.difficulty,
    servings: raw.servings,
    prepTimeMin: raw.prepTimeMin,
    cookTimeMin: raw.cookTimeMin,
    totalTimeMin: raw.totalTimeMin,
    costPerServing: raw.costPerServing,
    tags: raw.tags,
    dietTags: raw.dietTags,
    equipmentCapacityLiters: raw.equipmentCapacityLiters,
    equipmentNeeded: raw.equipmentNeeded,
    season: raw.season,
    ingredientInfoComplete: raw.ingredientInfoComplete,
    ingredients,
    steps,
  };
}
