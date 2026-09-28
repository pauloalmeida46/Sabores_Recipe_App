export type Difficulty = 'Fácil' | 'Intermediário' | 'Avançado';

export type PlaceholderGlyph = 'fork' | 'circle' | 'lines' | 'plus';

export interface Ingredient {
  id: string;
  text: string;
  have: boolean;
}

export interface RecipeStep {
  id: string;
  text: string;
  timerMin?: number;
  stationLabel?: string;
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
  durationMin: number;
  difficulty: Difficulty;
  servings: number;
  safeForRestrictions: boolean;
  pantryHave: number;
  pantryTotal: number;
  calories: number;
  costPerServing: number;
  tags: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutrition: NutritionFact[];
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  expiresLabel: string | null;
  urgent: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

export interface PlanMeal {
  recipeId: string | null;
  calories?: number;
}

export interface PlanDay {
  dateLabel: string;
  weekday: string;
  almoco: PlanMeal;
  jantar: PlanMeal;
  lanche: PlanMeal;
}
