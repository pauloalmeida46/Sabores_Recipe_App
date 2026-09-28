import { apiGet, apiPost, apiPut } from './client';

/**
 * Local mirrors of the backend shapes we consume (see
 * app/backend/src/modules/recipes/recipes.types.ts and recipes.validation.ts).
 * We don't import types across the frontend/backend package boundary.
 */

export type Difficulty = 'Fácil' | 'Intermediário' | 'Avançado';
export type PlaceholderGlyph = 'fork' | 'circle' | 'lines' | 'plus';
export type ScalingRule = 'linear' | 'fixed' | 'sqrt';
export type SafetyStatus = 'certified' | 'unsafe' | 'unknown';

export interface RecipeIngredient {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  note?: string;
  isKeyIngredient?: boolean;
  scalingRule?: ScalingRule;
}

export interface RecipeStep {
  id?: string;
  order?: number;
  text: string;
  timerSec?: number;
  stationLabel?: string;
  ingredientRefs: string[];
}

/** Body accepted by draft upsert / finalize, and the direct-create endpoint. */
export interface RecipeCreatePayload {
  title: string;
  cuisine: string;
  glyph?: PlaceholderGlyph;
  difficulty: Difficulty;
  servings: number;
  prepTimeMin: number;
  cookTimeMin: number;
  totalTimeMin: number;
  tags?: string[];
  dietTags?: string[];
  equipmentNeeded?: string[];
  ingredientInfoComplete?: boolean;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

/** Minimal slice of `RecipeWithSafety` this app reads. */
export interface RecipeWithSafety {
  id: string;
  title: string;
  safety: SafetyStatus;
}

export interface RecipeDraft {
  id: string;
  ownerId: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DuplicateCandidate {
  score: number;
  possibleDuplicate: boolean;
  recipe: RecipeWithSafety;
}

export interface DuplicateCheckResult {
  candidates: DuplicateCandidate[];
}

export type MergeChoice = 'keepExisting' | 'keepDraft';

export interface MergeChoices {
  title: MergeChoice;
  mergeIngredients: 'union' | MergeChoice;
  mergeSteps: 'union' | MergeChoice;
}

export interface MergeDraft {
  title?: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

/**
 * `data` accepts any plain object here (typed as `object` rather than
 * `Record<string, unknown>` so a concrete interface like `RecipeCreatePayload`
 * can be passed straight through without a TS index-signature mismatch) —
 * it's serialized as-is and the backend only checks its shape on finalize.
 */

/**
 * US-011 — draft autosave. The backend derives ownership from the
 * `Authorization` header (see `requireAuth` in
 * `app/backend/src/modules/recipes/drafts.routes.ts`) — it no longer accepts
 * a client-supplied `ownerId`.
 */
export function createDraft(data: object = {}): Promise<RecipeDraft> {
  return apiPost<RecipeDraft>('/recipes/drafts', { data });
}

export function upsertDraft(id: string, data: object): Promise<RecipeDraft> {
  return apiPut<RecipeDraft>(`/recipes/drafts/${id}`, { data });
}

export function finalizeDraft(id: string): Promise<RecipeWithSafety> {
  return apiPost<RecipeWithSafety>(`/recipes/drafts/${id}/finalize`);
}

/** US-010 — duplicate detection & guided merge. */
export function checkDuplicate(payload: {
  title: string;
  ingredients: { name: string }[];
  steps: { text: string }[];
}): Promise<DuplicateCheckResult> {
  return apiPost<DuplicateCheckResult>('/recipes/check-duplicate', payload);
}

export function mergeRecipe(
  recipeId: string,
  draft: MergeDraft,
  choices: MergeChoices
): Promise<RecipeWithSafety> {
  return apiPost<RecipeWithSafety>(`/recipes/${recipeId}/merge`, { draft, choices });
}

/** US-002 — pantry-based recipe suggestions. Slice of `RecipeWithSafety` this screen renders. */
export interface SuggestionRecipe {
  id: string;
  title: string;
  cuisine: string;
  glyph: PlaceholderGlyph;
  difficulty: Difficulty;
  servings: number;
  totalTimeMin: number;
  calories: number;
  costPerServing: number;
  tags: string[];
  safety: SafetyStatus;
}

export interface RecipeSuggestion {
  recipe: SuggestionRecipe;
  pantryHave: number;
  pantryTotal: number;
  missingIngredients: string[];
  soonestExpiry: string | null;
}

export interface SuggestionsResult {
  suggestions: RecipeSuggestion[];
  empty: boolean;
  message?: string;
  guidance?: string[];
  fallbackSuggestions?: RecipeSuggestion[];
}

export function getSuggestions(): Promise<SuggestionsResult> {
  return apiGet<SuggestionsResult>('/recipes/suggestions');
}

/**
 * US-012/US-014/US-028/US-029 — recipe detail, search, scaling, substitution,
 * nutrition, and guided-cooking/timers screens.
 *
 * `RecipeDetail`'s `ingredients`/`steps` mirror the backend's real shape
 * (`RecipeIngredient`/`RecipeStep` in
 * app/backend/src/modules/recipes/recipes.types.ts), where `id` (and, for
 * steps, `order`) are always present — unlike the optional-id versions above
 * used for create/draft payloads, where the id doesn't exist yet client-side.
 * Reused (rather than duplicated) for the cooking-session/step-complete
 * responses below, since those carry the exact same shape.
 */
export interface RecipeDetailIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  note?: string;
  isKeyIngredient?: boolean;
  allergens?: string[];
  containsTraceAllergens?: string[];
  scalingRule: ScalingRule;
}

export interface RecipeDetailStep {
  id: string;
  order: number;
  text: string;
  timerSec?: number;
  stationLabel?: string;
  ingredientRefs: string[];
}

export interface RecipeDetail {
  id: string;
  title: string;
  cuisine: string;
  glyph: PlaceholderGlyph;
  difficulty: Difficulty;
  servings: number;
  prepTimeMin: number;
  cookTimeMin: number;
  totalTimeMin: number;
  durationMin: number;
  tags: string[];
  dietTags: string[];
  allergens: string[];
  ingredientInfoComplete: boolean;
  equipmentCapacityLiters?: number;
  equipmentNeeded: string[];
  season?: string;
  usageCount: number;
  lastUsedAt: string | null;
  calories: number;
  costPerServing: number;
  ingredients: RecipeDetailIngredient[];
  steps: RecipeDetailStep[];
  safety: SafetyStatus;
}

export function getRecipe(id: string): Promise<RecipeDetail> {
  return apiGet<RecipeDetail>(`/recipes/${id}`);
}

export interface SearchRecipesParams {
  q?: string;
  maxDurationMin?: number;
  difficulty?: string;
  diet?: string;
  allergens?: string[];
  season?: string;
  equipment?: string[];
  highlightIngredient?: string;
  excludeIngredient?: string;
  sort?: 'relevance' | 'recent' | 'popular';
}

export interface SearchRecipesResult {
  results: RecipeDetail[];
  message?: string;
  suggestion?: string;
}

/** Builds the query string ourselves — skips undefined/empty values, joins array params with commas. */
export function searchRecipes(params: SearchRecipesParams): Promise<SearchRecipesResult> {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.maxDurationMin !== undefined) qs.set('maxDurationMin', String(params.maxDurationMin));
  if (params.difficulty) qs.set('difficulty', params.difficulty);
  if (params.diet) qs.set('diet', params.diet);
  if (params.allergens && params.allergens.length > 0) qs.set('allergens', params.allergens.join(','));
  if (params.season) qs.set('season', params.season);
  if (params.equipment && params.equipment.length > 0) qs.set('equipment', params.equipment.join(','));
  if (params.highlightIngredient) qs.set('highlightIngredient', params.highlightIngredient);
  if (params.excludeIngredient) qs.set('excludeIngredient', params.excludeIngredient);
  if (params.sort) qs.set('sort', params.sort);

  const queryString = qs.toString();
  return apiGet<SearchRecipesResult>(`/recipes/search${queryString ? `?${queryString}` : ''}`);
}

export interface ScaleRecipeResult {
  recipeId: string;
  originalServings: number;
  targetServings: number;
  ratio: number;
  ingredients: RecipeIngredient[];
  warning?: string;
}

export function scaleRecipe(id: string, targetServings: number): Promise<ScaleRecipeResult> {
  return apiPost<ScaleRecipeResult>(`/recipes/${id}/scale`, { targetServings });
}

export interface ApplySubstitutionResult {
  recipeId: string;
  ingredients: RecipeIngredient[];
}

export function applySubstitution(
  id: string,
  ingredientId: string,
  substitutionName: string
): Promise<ApplySubstitutionResult> {
  return apiPost<ApplySubstitutionResult>(`/recipes/${id}/apply-substitution`, {
    ingredientId,
    substitutionName,
  });
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
}

export interface RecipeNutritionResult {
  recipeId: string;
  servings: number;
  totals: NutritionTotals;
  perServing: NutritionTotals;
  missingData: Array<{ ingredientId: string; name: string; reason: string }>;
}

export function getNutrition(id: string): Promise<RecipeNutritionResult> {
  return apiGet<RecipeNutritionResult>(`/recipes/${id}/nutrition`);
}

export interface CookingSessionResult {
  recipeId: string;
  title: string;
  totalSteps: number;
  steps: RecipeDetailStep[];
}

export function getCookingSession(id: string): Promise<CookingSessionResult> {
  return apiGet<CookingSessionResult>(`/recipes/${id}/cooking-session`);
}

export interface CompleteStepResult {
  completedStep: RecipeDetailStep;
  nextStep: RecipeDetailStep | null;
}

export function completeStep(id: string, stepId: string): Promise<CompleteStepResult> {
  return apiPost<CompleteStepResult>(`/recipes/${id}/cooking-session/steps/${stepId}/complete`);
}

/** Bumps `usageCount`/`lastUsedAt` server-side (feeds search's relevance ranking) — response body isn't needed by callers. */
export function trackUse(id: string): Promise<void> {
  return apiPost<void>(`/recipes/${id}/track-use`);
}
