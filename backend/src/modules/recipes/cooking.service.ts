/**
 * Guided cooking + timers (US-028 RF48-50, US-029 RF51-52).
 *
 * The cooking session itself is intentionally stateless (no persisted
 * "current step" per user/device — Sprint 1 has no multi-user auth to key
 * that on): "complete a step" simply computes the next step from the
 * recipe's ordered step list rather than mutating any stored progress.
 * Independent countdown timers are handled by the separate Timers module.
 */
import { AppError } from '../../utils/AppError';
import { recipesRepository } from './recipes.repository';
import { RecipeStep, RecipeVariant } from './recipes.types';

export const cookingService = {
  getSession(recipeId: string) {
    const recipe = recipesRepository.findById(recipeId);
    if (!recipe) throw AppError.notFound(`Receita ${recipeId} não encontrada.`);
    const steps = [...recipe.steps].sort((a, b) => a.order - b.order);
    return {
      recipeId,
      title: recipe.title,
      totalSteps: steps.length,
      steps,
    };
  },

  completeStep(recipeId: string, stepId: string): { completedStep: RecipeStep; nextStep: RecipeStep | null } {
    const recipe = recipesRepository.findById(recipeId);
    if (!recipe) throw AppError.notFound(`Receita ${recipeId} não encontrada.`);
    const steps = [...recipe.steps].sort((a, b) => a.order - b.order);
    const idx = steps.findIndex((s) => s.id === stepId);
    if (idx === -1) throw AppError.notFound(`Passo ${stepId} não encontrado na receita ${recipeId}.`);
    return {
      completedStep: steps[idx],
      nextStep: steps[idx + 1] ?? null,
    };
  },

  saveVariant(
    ownerId: string,
    recipeId: string,
    label: string,
    stepOverrides: Array<{ stepId: string; timerSec?: number; note?: string }>
  ): RecipeVariant {
    const recipe = recipesRepository.findById(recipeId);
    if (!recipe) throw AppError.notFound(`Receita ${recipeId} não encontrada.`);

    const validStepIds = new Set(recipe.steps.map((s) => s.id));
    const invalid = stepOverrides.filter((o) => !validStepIds.has(o.stepId));
    if (invalid.length > 0) {
      throw AppError.badRequest(
        `stepOverrides referencia passos inexistentes: ${invalid.map((o) => o.stepId).join(', ')}.`
      );
    }

    // Saved as a new RecipeVariant — the original recipe is never mutated (AC3).
    return recipesRepository.createVariant({ ownerId, baseRecipeId: recipeId, label, stepOverrides });
  },
};
