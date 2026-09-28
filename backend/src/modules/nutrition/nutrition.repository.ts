import { store } from '../../db/store';
import { normalizeText } from '../../utils/normalize';
import { NutritionPer100g } from './nutrition.types';

export const nutritionRepository = {
  findByIngredientName(name: string): NutritionPer100g | undefined {
    return store.nutritionTable.get(normalizeText(name));
  },
};
