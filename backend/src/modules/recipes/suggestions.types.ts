import { RecipeWithSafety } from './recipes.types';

export interface RecipeSuggestion {
  recipe: RecipeWithSafety;
  pantryHave: number;
  pantryTotal: number;
  missingIngredients: string[];
  /** ISO date of the soonest-expiring pantry item this recipe would use, or null. */
  soonestExpiry: string | null;
}

export interface SuggestionsResult {
  suggestions: RecipeSuggestion[];
  empty: boolean;
  message?: string;
  guidance?: string[];
  /** Populated only when `empty` is true — closest recipes beyond the 3-extra-item limit (RF-007's "ver receitas com mais itens faltantes"). */
  fallbackSuggestions?: RecipeSuggestion[];
}
