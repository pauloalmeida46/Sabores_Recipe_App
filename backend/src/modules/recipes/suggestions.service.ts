/**
 * Pantry-based recipe suggestions (US-002, RF-005/006/007).
 *
 * RF-005: suggest recipes that use exclusively pantry items, or need at
 *   most 3 additional items; recipes needing 0 additional items rank first.
 * RF-006: among equally-viable recipes (same missing-item count), prioritize
 *   the one using pantry ingredients with the closest expiry date (avoids
 *   waste). This is implemented as a tie-break, matching the AC's wording
 *   ("entre receitas igualmente viáveis").
 * RF-007: when no recipe is viable within the 3-extra-item limit, return an
 *   empty state with guidance, plus a fallback list of the closest recipes
 *   (ordered by fewest missing items) so the user can see what's needed.
 *
 * Also respects US-045 (RNF/DoD): unsafe recipes for the active profile's
 * restrictions must never appear in a suggestion flow, so they're filtered
 * out before scoring (recipes with unknown safety are still eligible, per
 * US-045 AC3 — only "unsafe" is excluded).
 */
import { pantryRepository } from '../pantry/pantry.repository';
import { recipesRepository } from './recipes.repository';
import { attachSafetyToMany } from '../safety/safety.service';
import { normalizeText } from '../../utils/normalize';
import { PantryItem } from '../pantry/pantry.types';
import { RecipeSuggestion, SuggestionsResult } from './suggestions.types';

export const MAX_ADDITIONAL_ITEMS = 3;
const FALLBACK_LIMIT = 5;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Word-boundary-aware match: exact match, or one name fully contains the other as whole word(s). Guards against short-substring false positives (e.g. pantry "sal" matching "salmão"). */
function namesMatch(ingredientName: string, pantryNameNormalized: string): boolean {
  const ing = normalizeText(ingredientName);
  if (ing === pantryNameNormalized) return true;
  const [shorter, longer] = pantryNameNormalized.length <= ing.length
    ? [pantryNameNormalized, ing]
    : [ing, pantryNameNormalized];
  if (shorter.length < 4) return false;
  return new RegExp(`\\b${escapeRegex(shorter)}\\b`).test(longer);
}

interface Scored extends RecipeSuggestion {
  missingCount: number;
}

function score(
  recipe: RecipeSuggestion['recipe'],
  pantryItems: Array<PantryItem & { norm: string }>
): Scored {
  const matched: PantryItem[] = [];
  const missingIngredients: string[] = [];

  for (const ingredient of recipe.ingredients) {
    const hit = pantryItems.find((p) => namesMatch(ingredient.name, p.norm));
    if (hit) matched.push(hit);
    else missingIngredients.push(ingredient.name);
  }

  const expiryDates = matched
    .map((m) => m.expiresAt)
    .filter((d): d is string => Boolean(d))
    .sort();

  return {
    recipe,
    pantryHave: matched.length,
    pantryTotal: recipe.ingredients.length,
    missingIngredients,
    missingCount: missingIngredients.length,
    soonestExpiry: expiryDates[0] ?? null,
  };
}

function compareViable(a: Scored, b: Scored): number {
  if (a.missingCount !== b.missingCount) return a.missingCount - b.missingCount; // RF-005
  const ad = a.soonestExpiry ?? '9999-12-31';
  const bd = b.soonestExpiry ?? '9999-12-31';
  if (ad !== bd) return ad.localeCompare(bd); // RF-006
  return a.recipe.title.localeCompare(b.recipe.title, 'pt-BR');
}

function toSuggestion({ missingCount, ...rest }: Scored): RecipeSuggestion {
  return rest;
}

export const suggestionsService = {
  list(ownerId: string): SuggestionsResult {
    const pantryItems = pantryRepository.list(ownerId).map((p) => ({ ...p, norm: normalizeText(p.name) }));

    const safeCandidates = attachSafetyToMany(recipesRepository.list(), ownerId).filter(
      (r) => r.safety !== 'unsafe'
    );

    const scored = safeCandidates.map((recipe) => score(recipe, pantryItems));
    const viable = scored.filter((s) => s.missingCount <= MAX_ADDITIONAL_ITEMS).sort(compareViable);

    if (viable.length === 0) {
      const fallback = [...scored]
        .sort((a, b) => a.missingCount - b.missingCount)
        .slice(0, FALLBACK_LIMIT)
        .map(toSuggestion);

      return {
        suggestions: [],
        empty: true,
        message:
          pantryItems.length === 0
            ? 'Sua despensa está vazia — cadastre alguns itens para receber sugestões de receitas.'
            : 'Nenhuma receita viável com o que há na sua despensa agora (faltam mais de 3 itens em todas).',
        guidance: [
          'Adicione mais itens à despensa para desbloquear sugestões.',
          'Veja abaixo as receitas mais próximas, caso queira comprar o que falta.',
        ],
        fallbackSuggestions: fallback,
      };
    }

    return { suggestions: viable.map(toSuggestion), empty: false };
  },
};
