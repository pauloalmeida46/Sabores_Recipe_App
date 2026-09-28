export interface HouseholdMeasure {
  measureName: string;
  standardEquivalentMl: number;
}

export interface HouseholdMeasureOverride {
  ownerId: string;
  measureName: string;
  standardEquivalentMl: number;
  updatedAt: string;
}

export interface IngredientDensity {
  ingredient: string;
  gramsPerMl: number;
}
