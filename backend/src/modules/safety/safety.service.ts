/**
 * Safety certification (US-045, RF78-79).
 *
 * This is a COMPUTED field, never stored: every time a recipe is serialized
 * for a client response (list/detail/search/...), the recipes module calls
 * `attachSafety` here to compute it fresh against the CURRENT active profile
 * restrictions. This means removing a restriction re-unlocks recipes
 * automatically (AC3), with nothing to invalidate or cache.
 */
import { Recipe, RecipeWithSafety, SafetyStatus } from '../recipes/recipes.types';
import { profileService } from '../profile/profile.service';
import { normalizeText } from '../../utils/normalize';

export function computeSafety(recipe: Recipe, activeAllergenKeys: Set<string>): SafetyStatus {
  if (activeAllergenKeys.size > 0) {
    const recipeAllergens = new Set(
      recipe.ingredients.flatMap((ing) => [
        ...(ing.allergens ?? []),
        ...(ing.containsTraceAllergens ?? []), // trace amounts count too (AC1)
      ]).map(normalizeText)
    );
    for (const key of activeAllergenKeys) {
      if (recipeAllergens.has(normalizeText(key))) {
        return 'unsafe';
      }
    }
  }

  if (!recipe.ingredientInfoComplete) {
    // Never silently certify NOR hide as unsafe when ingredient info is incomplete (AC3).
    return 'unknown';
  }

  return 'certified';
}

/**
 * `ownerId` is optional: which account's restrictions apply depends on who's
 * asking. Recipe-reading routes are public (see recipes.routes.ts) but apply
 * `optionalAuth`, so `ownerId` is `req.userId` when a valid session happens
 * to be present, and `undefined` for a genuinely anonymous request — which
 * `profileService.activeAllergenKeys` treats as "no known restrictions".
 */
export function attachSafety(recipe: Recipe, ownerId?: string): RecipeWithSafety {
  const activeAllergenKeys = profileService.activeAllergenKeys(ownerId);
  return { ...recipe, safety: computeSafety(recipe, activeAllergenKeys) };
}

export function attachSafetyToMany(recipes: Recipe[], ownerId?: string): RecipeWithSafety[] {
  const activeAllergenKeys = profileService.activeAllergenKeys(ownerId);
  return recipes.map((recipe) => ({ ...recipe, safety: computeSafety(recipe, activeAllergenKeys) }));
}
