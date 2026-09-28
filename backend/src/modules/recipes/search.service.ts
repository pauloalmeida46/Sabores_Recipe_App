/**
 * Search & filters (US-012 RF26-27, US-014 RF29-30).
 *
 * Interpretation notes (documented per the task's "loose AC" guidance):
 *  - `allergens` filters OUT recipes whose aggregated allergens/trace
 *    allergens intersect the given list (i.e. "recipes safe from these"),
 *    since the story doesn't pin an exact semantic for this param.
 *  - `equipment` keeps recipes whose `equipmentNeeded` includes ALL of the
 *    given equipment names (i.e. "recipes that use this equipment"), not
 *    "recipes makeable with only this equipment".
 *  - `excludeIngredient` (US-014 AC2) is implemented as "recipes that don't
 *    contain this ingredient at all" — the simplest faithful reading of
 *    "propositalmente excluem"; a richer version would also require an
 *    explicit `deliberatelyExcludes` tag on the recipe, which isn't part of
 *    the seeded model.
 */
import { Recipe } from './recipes.types';
import { recipesRepository } from './recipes.repository';
import { attachSafetyToMany } from '../safety/safety.service';
import { normalizeText } from '../../utils/normalize';
import { SearchParams } from './search.types';

interface ActiveFilter {
  key: keyof SearchParams;
  label: string;
  predicate: (recipe: Recipe) => boolean;
}

function buildFilters(params: SearchParams): ActiveFilter[] {
  const filters: ActiveFilter[] = [];

  if (params.q) {
    const q = normalizeText(params.q);
    filters.push({
      key: 'q',
      label: 'termo de busca',
      predicate: (r) =>
        normalizeText(r.title).includes(q) ||
        normalizeText(r.cuisine).includes(q) ||
        r.tags.some((t) => normalizeText(t).includes(q)) ||
        r.ingredients.some((i) => normalizeText(i.name).includes(q)),
    });
  }

  if (params.maxDurationMin !== undefined) {
    const max = params.maxDurationMin;
    filters.push({ key: 'maxDurationMin', label: 'duração máxima', predicate: (r) => r.totalTimeMin <= max });
  }

  if (params.difficulty) {
    const difficulty = normalizeText(params.difficulty);
    filters.push({ key: 'difficulty', label: 'dificuldade', predicate: (r) => normalizeText(r.difficulty) === difficulty });
  }

  if (params.diet) {
    const diet = normalizeText(params.diet);
    filters.push({ key: 'diet', label: 'dieta', predicate: (r) => r.dietTags.some((t) => normalizeText(t) === diet) });
  }

  if (params.allergens && params.allergens.length > 0) {
    const allergens = params.allergens.map(normalizeText);
    filters.push({
      key: 'allergens',
      label: 'alérgenos',
      predicate: (r) => {
        const recipeAllergens = new Set(
          r.ingredients.flatMap((i) => [...(i.allergens ?? []), ...(i.containsTraceAllergens ?? [])]).map(normalizeText)
        );
        return !allergens.some((a) => recipeAllergens.has(a));
      },
    });
  }

  if (params.season) {
    const season = normalizeText(params.season);
    filters.push({ key: 'season', label: 'estação', predicate: (r) => normalizeText(r.season ?? '') === season });
  }

  if (params.equipment && params.equipment.length > 0) {
    const equipment = params.equipment.map(normalizeText);
    filters.push({
      key: 'equipment',
      label: 'equipamento',
      predicate: (r) => {
        const recipeEquipment = new Set(r.equipmentNeeded.map(normalizeText));
        return equipment.every((e) => recipeEquipment.has(e));
      },
    });
  }

  if (params.highlightIngredient) {
    const name = normalizeText(params.highlightIngredient);
    filters.push({
      key: 'highlightIngredient',
      label: 'ingrediente em destaque',
      predicate: (r) => r.ingredients.some((i) => normalizeText(i.name) === name && i.isKeyIngredient === true),
    });
  }

  if (params.excludeIngredient) {
    const name = normalizeText(params.excludeIngredient);
    filters.push({
      key: 'excludeIngredient',
      label: 'ingrediente excluído',
      predicate: (r) => !r.ingredients.some((i) => normalizeText(i.name) === name),
    });
  }

  return filters;
}

function relevanceScore(recipe: Recipe, q?: string): number {
  let score = recipe.usageCount * 2;
  if (recipe.lastUsedAt) {
    const daysSince = (Date.now() - new Date(recipe.lastUsedAt).getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 30 - daysSince); // more recent = higher bonus, decays over ~30 days
  }
  if (q) {
    const nq = normalizeText(q);
    if (normalizeText(recipe.title).startsWith(nq)) score += 50;
    else if (normalizeText(recipe.title).includes(nq)) score += 20;
  }
  return score;
}

function sortRecipes(recipes: Recipe[], sort: SearchParams['sort'], q?: string): Recipe[] {
  const list = [...recipes];
  if (sort === 'recent') {
    return list.sort((a, b) => (b.lastUsedAt ?? '').localeCompare(a.lastUsedAt ?? ''));
  }
  if (sort === 'popular') {
    return list.sort((a, b) => b.usageCount - a.usageCount);
  }
  // 'relevance' (default) — factors in usage history per US-012 AC2.
  return list.sort((a, b) => relevanceScore(b, q) - relevanceScore(a, q));
}

export interface SearchResult {
  results: ReturnType<typeof attachSafetyToMany>;
  message?: string;
  suggestion?: string;
}

export const searchService = {
  search(params: SearchParams, ownerId?: string): SearchResult {
    const filters = buildFilters(params);
    const all = recipesRepository.list();
    const matches = all.filter((r) => filters.every((f) => f.predicate(r)));

    if (matches.length > 0) {
      const sorted = sortRecipes(matches, params.sort, params.q);
      return { results: attachSafetyToMany(sorted, ownerId) };
    }

    // AC3: empty results must explain why and suggest which filter to relax.
    let suggestion: string | undefined;
    for (const filter of filters) {
      const withoutThisOne = filters.filter((f) => f.key !== filter.key);
      const relaxed = all.filter((r) => withoutThisOne.every((f) => f.predicate(r)));
      if (relaxed.length > 0) {
        suggestion = filter.label;
        break;
      }
    }

    return {
      results: [],
      message: 'Nenhuma receita encontrada com esses filtros.',
      suggestion: suggestion ?? 'remova algum filtro para ampliar a busca',
    };
  },
};
