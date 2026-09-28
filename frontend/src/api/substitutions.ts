import { apiGet } from './client';

/**
 * Local mirror of the backend's substitution lookup shape (see
 * app/backend/src/modules/substitutions/substitutions.types.ts /
 * substitutions.service.ts). Used both to look up substitutions for a
 * missing ingredient and (via `RecipeDetailScreen`'s substitution sheet) to
 * pick one to apply through `applySubstitution` in `api/recipes.ts`.
 */
export type SubstitutionConfidence = 'Alta confiança' | 'Confiança média' | 'Confiança baixa';

export interface SubstitutionOption {
  name: string;
  description: string;
  confidence: SubstitutionConfidence;
  ratio: number;
  functionalNotes: string;
}

export interface SubstitutionLookupResult {
  found: boolean;
  ingredient: string;
  substitutions: SubstitutionOption[];
  message?: string;
}

export function lookupSubstitutions(ingredientName: string): Promise<SubstitutionLookupResult> {
  return apiGet<SubstitutionLookupResult>(`/ingredients/${encodeURIComponent(ingredientName)}/substitutions`);
}
