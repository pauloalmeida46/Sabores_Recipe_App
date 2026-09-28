import { AppError } from '../../utils/AppError';
import { attachSafety } from '../safety/safety.service';
import { recipesRepository } from './recipes.repository';
import { recipeCreateSchema, validateRecipeStructure } from './recipes.validation';
import { RecipeDraft, RecipeDraftPayload } from './recipes.types';

export const draftsService = {
  list(ownerId: string): RecipeDraft[] {
    return recipesRepository.listDrafts(ownerId);
  },

  getById(id: string, ownerId: string): RecipeDraft {
    const draft = recipesRepository.findDraftById(id);
    if (!draft || draft.ownerId !== ownerId) {
      throw AppError.notFound(`Rascunho ${id} não encontrado.`);
    }
    return draft;
  },

  create(ownerId: string, data: RecipeDraftPayload): RecipeDraft {
    return recipesRepository.createDraft(ownerId, data);
  },

  /** Upsert — this is what the client calls every ~30s for autosave (US-011 AC1). */
  upsert(id: string, ownerId: string, data: RecipeDraftPayload): RecipeDraft {
    const existing = recipesRepository.findDraftById(id);
    if (existing && existing.ownerId !== ownerId) {
      // Don't let one account overwrite another's draft by guessing its id.
      throw AppError.notFound(`Rascunho ${id} não encontrado.`);
    }
    return recipesRepository.upsertDraft(id, ownerId, data);
  },

  /**
   * Runs the draft through the same structured-editor validation as the main
   * recipes CRUD, creates the recipe (stamping createdByUserId with the
   * draft's owner), and discards the temporary draft on success (US-011 AC3).
   */
  finalize(id: string, ownerId: string) {
    const draft = recipesRepository.findDraftById(id);
    if (!draft || draft.ownerId !== ownerId) {
      throw AppError.notFound(`Rascunho ${id} não encontrado.`);
    }

    const parsed = recipeCreateSchema.parse(draft.data);
    const input = validateRecipeStructure(parsed);
    const recipe = recipesRepository.create(input, ownerId);
    recipesRepository.deleteDraft(id);
    return attachSafety(recipe, ownerId);
  },
};
