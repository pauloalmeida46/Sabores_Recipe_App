import { store } from '../../db/store';
import { normalizeText } from '../../utils/normalize';
import { Substitution } from './substitutions.types';

export const substitutionsRepository = {
  findByIngredientName(name: string): Substitution[] | undefined {
    return store.substitutions.get(normalizeText(name));
  },
};
