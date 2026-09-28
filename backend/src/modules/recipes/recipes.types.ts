export type Difficulty = 'Fácil' | 'Intermediário' | 'Avançado';
export type PlaceholderGlyph = 'fork' | 'circle' | 'lines' | 'plus';
export type ScalingRule = 'linear' | 'fixed' | 'sqrt';
export type SafetyStatus = 'certified' | 'unsafe' | 'unknown';

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  note?: string;
  isKeyIngredient?: boolean;
  allergens?: string[];
  containsTraceAllergens?: string[];
  scalingRule: ScalingRule;
}

export interface RecipeStep {
  id: string;
  order: number;
  text: string;
  timerSec?: number;
  stationLabel?: string;
  ingredientRefs: string[];
}

export interface NutritionFact {
  label: string;
  value: number;
  goal: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  glyph: PlaceholderGlyph;
  difficulty: Difficulty;
  servings: number;
  prepTimeMin: number;
  cookTimeMin: number;
  totalTimeMin: number;
  durationMin: number; // kept for compatibility with frontend mock shape (== totalTimeMin)
  safeForRestrictions: boolean; // legacy static flag from the mock data; live safety is computed via safety.service
  pantryHave: number;
  pantryTotal: number;
  calories: number;
  costPerServing: number;
  tags: string[];
  dietTags: string[];
  allergens: string[]; // aggregated across ingredients (main allergens, not trace)
  ingredientInfoComplete: boolean;
  equipmentCapacityLiters?: number;
  equipmentNeeded: string[];
  season?: string;
  usageCount: number;
  lastUsedAt: string | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition: NutritionFact[]; // legacy flat summary, mirrors frontend NutritionFact[]
  /** Attribution only — recipes stay a shared/browsable catalog, not scoped per account. Null for system/seed recipes not created via an authenticated flow. */
  createdByUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Recipe as returned to clients, with the live-computed safety certification attached. */
export interface RecipeWithSafety extends Recipe {
  safety: SafetyStatus;
}

export interface RecipeDraftPayload {
  title?: string;
  cuisine?: string;
  glyph?: PlaceholderGlyph;
  difficulty?: Difficulty;
  servings?: number;
  prepTimeMin?: number;
  cookTimeMin?: number;
  totalTimeMin?: number;
  tags?: string[];
  dietTags?: string[];
  equipmentNeeded?: string[];
  equipmentCapacityLiters?: number;
  season?: string;
  costPerServing?: number;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
}

export interface RecipeDraft {
  id: string;
  ownerId: string;
  data: RecipeDraftPayload;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeVariant {
  id: string;
  ownerId: string;
  baseRecipeId: string;
  label: string;
  stepOverrides: Array<{ stepId: string; timerSec?: number; note?: string }>;
  createdAt: string;
}

export interface RecipeCreateInput {
  title: string;
  cuisine: string;
  glyph?: PlaceholderGlyph;
  difficulty: Difficulty;
  servings: number;
  prepTimeMin: number;
  cookTimeMin: number;
  totalTimeMin: number;
  costPerServing?: number;
  tags?: string[];
  dietTags?: string[];
  equipmentCapacityLiters?: number;
  equipmentNeeded?: string[];
  season?: string;
  ingredientInfoComplete?: boolean;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}
