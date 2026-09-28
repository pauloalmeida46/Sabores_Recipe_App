/**
 * Duplicate detection & guided merge (US-010, RF22-23).
 *
 * Similarity score = average of:
 *   - title token-overlap (Jaccard over normalized title tokens)
 *   - ingredient-name-set overlap (Jaccard over normalized ingredient names)
 * A score >= DUPLICATE_THRESHOLD flags `possibleDuplicate: true`. This
 * threshold is intentionally documented here since the AC doesn't pin one.
 */
import { AppError } from '../../utils/AppError';
import { normalizeText } from '../../utils/normalize';
import { jaccardSimilarity, titleSimilarity } from '../../utils/similarity';
import { attachSafety } from '../safety/safety.service';
import { recipesRepository } from './recipes.repository';
import { RecipeCreateInput, RecipeIngredient, RecipeStep, RecipeWithSafety } from './recipes.types';
import { DuplicateCheckDraft, MergeChoices, MergeDraft } from './duplicate.types';

export const DUPLICATE_THRESHOLD = 0.6;

export interface DuplicateCandidate {
  score: number;
  possibleDuplicate: boolean;
  recipe: RecipeWithSafety;
}

function ensureId(item: RecipeIngredient): RecipeIngredient {
  return item.id ? item : { ...item, id: crypto.randomUUID() };
}

export const duplicateService = {
  check(draft: DuplicateCheckDraft, ownerId?: string): { candidates: DuplicateCandidate[] } {
    const draftIngredientNames = draft.ingredients.map((i) => i.name);
    const candidates: DuplicateCandidate[] = recipesRepository.list().map((recipe) => {
      const titleScore = titleSimilarity(draft.title, recipe.title);
      const ingredientScore = jaccardSimilarity(
        draftIngredientNames,
        recipe.ingredients.map((i) => i.name)
      );
      const score = (titleScore + ingredientScore) / 2;
      return {
        score: Math.round(score * 1000) / 1000,
        possibleDuplicate: score >= DUPLICATE_THRESHOLD,
        recipe: attachSafety(recipe, ownerId),
      };
    });

    return { candidates: candidates.sort((a, b) => b.score - a.score) };
  },

  merge(existingId: string, draft: MergeDraft, choices: MergeChoices, ownerId?: string) {
    const existing = recipesRepository.findById(existingId);
    if (!existing) throw AppError.notFound(`Receita ${existingId} não encontrada.`);

    const draftIngredients = draft.ingredients.map(ensureId);
    const existingIngredients = existing.ingredients;

    const finalIngredients = mergeIngredientLists(
      existingIngredients,
      draftIngredients,
      choices.mergeIngredients
    );

    const nameToFinalId = new Map(finalIngredients.map((i) => [normalizeText(i.name), i.id]));
    const originLookup = new Map<string, string>(); // ingredient id -> name, across both pools
    for (const i of existingIngredients) originLookup.set(i.id, i.name);
    for (const i of draftIngredients) originLookup.set(i.id, i.name);

    const remapRefs = (refs: string[]): string[] =>
      refs
        .map((ref) => originLookup.get(ref))
        .filter((name): name is string => Boolean(name))
        .map((name) => nameToFinalId.get(normalizeText(name)))
        .filter((id): id is string => Boolean(id));

    const finalSteps = mergeStepLists(existing.steps, draft.steps, choices.mergeSteps, remapRefs);

    const mergedInput: RecipeCreateInput = {
      title: choices.title === 'keepDraft' && draft.title ? draft.title : existing.title,
      cuisine: existing.cuisine,
      glyph: existing.glyph,
      difficulty: existing.difficulty,
      servings: existing.servings,
      prepTimeMin: existing.prepTimeMin,
      cookTimeMin: existing.cookTimeMin,
      totalTimeMin: existing.totalTimeMin,
      costPerServing: existing.costPerServing,
      tags: existing.tags,
      dietTags: existing.dietTags,
      equipmentCapacityLiters: existing.equipmentCapacityLiters,
      equipmentNeeded: existing.equipmentNeeded,
      season: existing.season,
      ingredientInfoComplete: existing.ingredientInfoComplete,
      ingredients: finalIngredients,
      steps: finalSteps,
    };

    const merged = recipesRepository.replace(existingId, mergedInput);
    if (!merged) throw AppError.notFound(`Receita ${existingId} não encontrada.`);
    return attachSafety(merged, ownerId);
  },
};

function mergeIngredientLists(
  existing: RecipeIngredient[],
  draft: RecipeIngredient[],
  mode: 'union' | 'keepExisting' | 'keepDraft'
): RecipeIngredient[] {
  if (mode === 'keepExisting') return existing.map((i) => ({ ...i }));
  if (mode === 'keepDraft') return draft.map((i) => ({ ...i }));
  // union
  const existingNames = new Set(existing.map((i) => normalizeText(i.name)));
  const extra = draft.filter((i) => !existingNames.has(normalizeText(i.name)));
  return [...existing.map((i) => ({ ...i })), ...extra.map((i) => ({ ...i }))];
}

function mergeStepLists(
  existing: RecipeStep[],
  draft: RecipeStep[],
  mode: 'union' | 'keepExisting' | 'keepDraft',
  remapRefs: (refs: string[]) => string[]
): RecipeStep[] {
  const ensureStep = (s: RecipeStep, order: number): RecipeStep => ({
    id: s.id ?? crypto.randomUUID(),
    order,
    text: s.text,
    timerSec: s.timerSec,
    stationLabel: s.stationLabel,
    ingredientRefs: remapRefs(s.ingredientRefs ?? []),
  });

  let pool: RecipeStep[];
  if (mode === 'keepExisting') pool = existing;
  else if (mode === 'keepDraft') pool = draft;
  else {
    const existingTexts = new Set(existing.map((s) => normalizeText(s.text)));
    const extra = draft.filter((s) => !existingTexts.has(normalizeText(s.text)));
    pool = [...existing, ...extra];
  }

  return pool.map((s, idx) => ensureStep(s, idx + 1));
}
