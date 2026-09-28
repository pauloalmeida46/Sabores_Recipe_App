/**
 * Generic metric/imperial unit conversion helpers (US-038, RF67-68).
 * Household measures (xícara, colher de sopa, ...) are handled separately in
 * the conversions module because they can be personalized per owner — see
 * src/modules/conversions/conversions.service.ts.
 */

export type UnitKind = 'weight' | 'volume' | 'unknown';

const WEIGHT_TO_GRAMS: Record<string, number> = {
  g: 1,
  gram: 1,
  gramas: 1,
  mg: 0.001,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
  lbs: 453.592,
};

const VOLUME_TO_ML: Record<string, number> = {
  ml: 1,
  mililitro: 1,
  mililitros: 1,
  l: 1000,
  litro: 1000,
  litros: 1000,
  floz: 29.5735,
  'fl oz': 29.5735,
  cup: 236.588,
  cups: 236.588,
};

export function normalizeUnit(unit: string): string {
  return unit.trim().toLowerCase();
}

export function unitKind(unit: string): UnitKind {
  const u = normalizeUnit(unit);
  if (u in WEIGHT_TO_GRAMS) return 'weight';
  if (u in VOLUME_TO_ML) return 'volume';
  return 'unknown';
}

export function isKnownWeightUnit(unit: string): boolean {
  return normalizeUnit(unit) in WEIGHT_TO_GRAMS;
}

export function isKnownVolumeUnit(unit: string): boolean {
  return normalizeUnit(unit) in VOLUME_TO_ML;
}

export function toGrams(value: number, unit: string): number | null {
  const u = normalizeUnit(unit);
  if (!(u in WEIGHT_TO_GRAMS)) return null;
  return value * WEIGHT_TO_GRAMS[u];
}

export function fromGrams(grams: number, unit: string): number | null {
  const u = normalizeUnit(unit);
  if (!(u in WEIGHT_TO_GRAMS)) return null;
  return grams / WEIGHT_TO_GRAMS[u];
}

export function toMl(value: number, unit: string): number | null {
  const u = normalizeUnit(unit);
  if (!(u in VOLUME_TO_ML)) return null;
  return value * VOLUME_TO_ML[u];
}

export function fromMl(ml: number, unit: string): number | null {
  const u = normalizeUnit(unit);
  if (!(u in VOLUME_TO_ML)) return null;
  return ml / VOLUME_TO_ML[u];
}

export const BASE_WEIGHT_UNITS = Object.keys(WEIGHT_TO_GRAMS);
export const BASE_VOLUME_UNITS = Object.keys(VOLUME_TO_ML);
