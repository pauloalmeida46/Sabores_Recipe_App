import { AppError } from '../../utils/AppError';
import { attachSafety, attachSafetyToMany } from '../safety/safety.service';
import { recipesRepository } from './recipes.repository';
import { recipeCreateSchema, validateRecipeStructure } from './recipes.validation';
import { RecipeWithSafety } from './recipes.types';

export const recipesService = {
  list(ownerId?: string): RecipeWithSafety[] {
    return attachSafetyToMany(recipesRepository.list(), ownerId);
  },

  getById(id: string, ownerId?: string): RecipeWithSafety {
    const recipe = recipesRepository.findById(id);
    if (!recipe) throw AppError.notFound(`Receita ${id} não encontrada.`);
    return attachSafety(recipe, ownerId);
  },

  create(rawInput: unknown, createdByUserId: string): RecipeWithSafety {
    const parsed = recipeCreateSchema.parse(rawInput);
    const input = validateRecipeStructure(parsed);
    const recipe = recipesRepository.create(input, createdByUserId);
    return attachSafety(recipe, createdByUserId);
  },

  update(id: string, rawInput: unknown, ownerId?: string): RecipeWithSafety {
    const parsed = recipeCreateSchema.parse(rawInput);
    const input = validateRecipeStructure(parsed);
    const recipe = recipesRepository.replace(id, input);
    if (!recipe) throw AppError.notFound(`Receita ${id} não encontrada.`);
    return attachSafety(recipe, ownerId);
  },

  remove(id: string): void {
    const removed = recipesRepository.remove(id);
    if (!removed) throw AppError.notFound(`Receita ${id} não encontrada.`);
  },

  trackUse(id: string, ownerId?: string): RecipeWithSafety {
    const recipe = recipesRepository.trackUse(id);
    if (!recipe) throw AppError.notFound(`Receita ${id} não encontrada.`);
    return attachSafety(recipe, ownerId);
  },
};
