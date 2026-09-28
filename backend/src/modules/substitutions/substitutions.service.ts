import { substitutionsRepository } from './substitutions.repository';
import { Substitution } from './substitutions.types';

export interface SubstitutionLookupResult {
  found: boolean;
  ingredient: string;
  substitutions: Substitution[];
  message?: string;
}

export const substitutionsService = {
  lookup(ingredientName: string): SubstitutionLookupResult {
    const substitutions = substitutionsRepository.findByIngredientName(ingredientName);
    if (!substitutions || substitutions.length === 0) {
      return {
        found: false,
        ingredient: ingredientName,
        substitutions: [],
        message: `Nenhuma substituição cadastrada para "${ingredientName}" ainda.`,
      };
    }
    return { found: true, ingredient: ingredientName, substitutions };
  },

  findRatio(ingredientName: string, substitutionName: string): Substitution | undefined {
    const substitutions = substitutionsRepository.findByIngredientName(ingredientName);
    return substitutions?.find(
      (s) => s.name.toLowerCase().trim() === substitutionName.toLowerCase().trim()
    );
  },
};
