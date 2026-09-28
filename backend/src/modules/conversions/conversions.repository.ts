import { store } from '../../db/store';
import { normalizeText } from '../../utils/normalize';
import { HouseholdMeasureOverride } from './conversions.types';

export const conversionsRepository = {
  listHouseholdMeasureDefaults(): Array<{ measureName: string; standardEquivalentMl: number }> {
    return Array.from(store.householdMeasureDefaults.values());
  },

  getHouseholdMeasureMl(measureName: string, ownerId?: string): number | undefined {
    const normalized = normalizeText(measureName);
    if (ownerId) {
      const override = store.householdMeasureOverrides.get(`${ownerId}::${normalized}`);
      if (override) return override.standardEquivalentMl;
    }
    return store.householdMeasureDefaults.get(normalized)?.standardEquivalentMl;
  },

  setHouseholdMeasureOverride(
    ownerId: string,
    measureName: string,
    standardEquivalentMl: number
  ): HouseholdMeasureOverride {
    const override: HouseholdMeasureOverride = {
      ownerId,
      measureName: normalizeText(measureName),
      standardEquivalentMl,
      updatedAt: new Date().toISOString(),
    };
    store.householdMeasureOverrides.set(`${ownerId}::${override.measureName}`, override);
    return override;
  },

  getIngredientDensity(ingredientName: string): number | undefined {
    return store.ingredientDensities.get(normalizeText(ingredientName));
  },
};
