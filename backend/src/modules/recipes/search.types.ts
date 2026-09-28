export interface SearchParams {
  q?: string;
  maxDurationMin?: number;
  difficulty?: string;
  diet?: string;
  allergens?: string[];
  season?: string;
  equipment?: string[];
  highlightIngredient?: string;
  excludeIngredient?: string;
  sort?: 'relevance' | 'recent' | 'popular';
}
