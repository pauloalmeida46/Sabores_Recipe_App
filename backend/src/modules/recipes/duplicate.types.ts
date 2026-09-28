import { RecipeIngredient, RecipeStep } from './recipes.types';

/** Minimal shape needed to run the similarity check (US-010 AC1). */
export interface DuplicateCheckDraft {
  title: string;
  ingredients: Array<{ name: string }>;
  steps: Array<{ text: string }>;
}

/** Fuller draft shape accepted by the guided-merge endpoint (US-010 AC3). */
export interface MergeDraft {
  title?: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export type MergeChoice = 'keepExisting' | 'keepDraft';

export interface MergeChoices {
  title: MergeChoice;
  mergeIngredients: 'union' | MergeChoice;
  mergeSteps: 'union' | MergeChoice;
}
