import { Request, Response } from 'express';
import { searchService } from './search.service';
import { SearchParams } from './search.types';

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

function csv(v: unknown): string[] | undefined {
  const s = str(v);
  if (!s) return undefined;
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

export const searchController = {
  search(req: Request, res: Response) {
    const q = req.query;
    const params: SearchParams = {
      q: str(q.q),
      maxDurationMin: q.maxDurationMin ? Number(q.maxDurationMin) : undefined,
      difficulty: str(q.difficulty),
      diet: str(q.diet),
      allergens: csv(q.allergens),
      season: str(q.season),
      equipment: csv(q.equipment),
      highlightIngredient: str(q.highlightIngredient),
      excludeIngredient: str(q.excludeIngredient),
      sort: (str(q.sort) as SearchParams['sort']) ?? 'relevance',
    };
    res.json(searchService.search(params, req.userId));
  },
};
