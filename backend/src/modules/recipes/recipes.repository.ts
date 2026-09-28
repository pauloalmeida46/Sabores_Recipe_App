import { store } from '../../db/store';
import {
  Recipe,
  RecipeCreateInput,
  RecipeDraft,
  RecipeDraftPayload,
  RecipeVariant,
} from './recipes.types';

export const recipesRepository = {
  list(): Recipe[] {
    return Array.from(store.recipes.values());
  },

  findById(id: string): Recipe | undefined {
    return store.recipes.get(id);
  },

  create(input: RecipeCreateInput, createdByUserId: string | null = null): Recipe {
    const now = new Date().toISOString();
    const recipe: Recipe = {
      id: crypto.randomUUID(),
      title: input.title,
      cuisine: input.cuisine,
      glyph: input.glyph ?? 'fork',
      difficulty: input.difficulty,
      servings: input.servings,
      prepTimeMin: input.prepTimeMin,
      cookTimeMin: input.cookTimeMin,
      totalTimeMin: input.totalTimeMin,
      durationMin: input.totalTimeMin,
      safeForRestrictions: true,
      pantryHave: 0,
      pantryTotal: input.ingredients.length,
      calories: 0,
      costPerServing: input.costPerServing ?? 0,
      tags: input.tags ?? [],
      dietTags: input.dietTags ?? [],
      allergens: Array.from(new Set(input.ingredients.flatMap((i) => i.allergens ?? []))),
      ingredientInfoComplete: input.ingredientInfoComplete ?? true,
      equipmentCapacityLiters: input.equipmentCapacityLiters,
      equipmentNeeded: input.equipmentNeeded ?? [],
      season: input.season,
      usageCount: 0,
      lastUsedAt: null,
      ingredients: input.ingredients,
      steps: input.steps,
      nutrition: [],
      createdByUserId,
      createdAt: now,
      updatedAt: now,
    };
    store.recipes.set(recipe.id, recipe);
    return recipe;
  },

  /** Replace keeps the existing `createdByUserId` (attribution isn't reassigned on edit/merge). */
  replace(id: string, input: RecipeCreateInput): Recipe | undefined {
    const existing = store.recipes.get(id);
    if (!existing) return undefined;
    const updated: Recipe = {
      ...existing,
      title: input.title,
      cuisine: input.cuisine,
      glyph: input.glyph ?? existing.glyph,
      difficulty: input.difficulty,
      servings: input.servings,
      prepTimeMin: input.prepTimeMin,
      cookTimeMin: input.cookTimeMin,
      totalTimeMin: input.totalTimeMin,
      durationMin: input.totalTimeMin,
      costPerServing: input.costPerServing ?? existing.costPerServing,
      tags: input.tags ?? existing.tags,
      dietTags: input.dietTags ?? existing.dietTags,
      allergens: Array.from(new Set(input.ingredients.flatMap((i) => i.allergens ?? []))),
      ingredientInfoComplete: input.ingredientInfoComplete ?? existing.ingredientInfoComplete,
      equipmentCapacityLiters: input.equipmentCapacityLiters ?? existing.equipmentCapacityLiters,
      equipmentNeeded: input.equipmentNeeded ?? existing.equipmentNeeded,
      season: input.season ?? existing.season,
      pantryTotal: input.ingredients.length,
      ingredients: input.ingredients,
      steps: input.steps,
      updatedAt: new Date().toISOString(),
    };
    store.recipes.set(id, updated);
    return updated;
  },

  save(recipe: Recipe): Recipe {
    recipe.updatedAt = new Date().toISOString();
    store.recipes.set(recipe.id, recipe);
    return recipe;
  },

  remove(id: string): boolean {
    return store.recipes.delete(id);
  },

  trackUse(id: string): Recipe | undefined {
    const recipe = store.recipes.get(id);
    if (!recipe) return undefined;
    recipe.usageCount += 1;
    recipe.lastUsedAt = new Date().toISOString();
    return recipe;
  },

  // --- Drafts -----------------------------------------------------------

  listDrafts(ownerId?: string): RecipeDraft[] {
    const all = Array.from(store.recipeDrafts.values());
    return ownerId ? all.filter((d) => d.ownerId === ownerId) : all;
  },

  findDraftById(id: string): RecipeDraft | undefined {
    return store.recipeDrafts.get(id);
  },

  createDraft(ownerId: string, data: RecipeDraftPayload): RecipeDraft {
    const now = new Date().toISOString();
    const draft: RecipeDraft = { id: crypto.randomUUID(), ownerId, data, createdAt: now, updatedAt: now };
    store.recipeDrafts.set(draft.id, draft);
    return draft;
  },

  upsertDraft(id: string, ownerId: string, data: RecipeDraftPayload): RecipeDraft {
    const now = new Date().toISOString();
    const existing = store.recipeDrafts.get(id);
    const draft: RecipeDraft = existing
      ? { ...existing, ownerId, data: { ...existing.data, ...data }, updatedAt: now }
      : { id, ownerId, data, createdAt: now, updatedAt: now };
    store.recipeDrafts.set(id, draft);
    return draft;
  },

  deleteDraft(id: string): boolean {
    return store.recipeDrafts.delete(id);
  },

  // --- Variants -----------------------------------------------------------

  createVariant(variant: Omit<RecipeVariant, 'id' | 'createdAt'>): RecipeVariant {
    const created: RecipeVariant = {
      ...variant,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    store.recipeVariants.set(created.id, created);
    return created;
  },

  listVariantsForRecipe(ownerId: string, baseRecipeId: string): RecipeVariant[] {
    return Array.from(store.recipeVariants.values()).filter(
      (v) => v.baseRecipeId === baseRecipeId && v.ownerId === ownerId
    );
  },
};
