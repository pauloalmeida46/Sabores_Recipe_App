import { normalizeText, tokenize } from './normalize';

/**
 * Jaccard similarity between two sets of strings (already normalized or not —
 * callers pass raw strings and this normalizes each element first).
 */
export function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a.map(normalizeText));
  const setB = new Set(b.map(normalizeText));
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection += 1;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

/** Token-overlap (Jaccard over tokens) similarity between two titles/strings. */
export function titleSimilarity(a: string, b: string): number {
  return jaccardSimilarity(tokenize(a), tokenize(b));
}
