/**
 * Applying a substitution to one recipe ingredient (US-041 AC3).
 * Returns a recomputed ingredient list without mutating the stored recipe.
 */
import { AppError } from '../../utils/AppError';
import { recipesRepository } from './recipes.repository';
import { substitutionsService } from '../substitutions/substitutions.service';
import { RecipeIngredient } from './recipes.types';

export const applySubstitutionService = {
  apply(recipeId: string, ingredientId: string, substitutionName: string): RecipeIngredient[] {
    const recipe = recipesRepository.findById(recipeId);
    if (!recipe) throw AppError.notFound(`Receita ${recipeId} não encontrada.`);

    const ingredient = recipe.ingredients.find((i) => i.id === ingredientId);
    if (!ingredient) throw AppError.notFound(`Ingrediente ${ingredientId} não encontrado na receita ${recipeId}.`);

    const substitution = substitutionsService.findRatio(ingredient.name, substitutionName);
    if (!substitution) {
      throw AppError.notFound(
        `Substituição "${substitutionName}" não encontrada para o ingrediente "${ingredient.name}".`
      );
    }

    return recipe.ingredients.map((i) =>
      i.id === ingredientId
        ? { ...i, name: substitution.name, quantity: Math.round(i.quantity * substitution.ratio * 100) / 100, note: `Substituído de "${ingredient.name}" (${substitution.confidence})` }
        : { ...i }
    );
  },
};
