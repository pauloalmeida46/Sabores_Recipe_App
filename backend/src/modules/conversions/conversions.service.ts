import { AppError } from '../../utils/AppError';
import { normalizeUnit, toGrams, toMl, isKnownWeightUnit, isKnownVolumeUnit } from '../../utils/units';
import { conversionsRepository } from './conversions.repository';
import { HouseholdMeasure } from './conversions.types';

type BaseResolution = { kind: 'weight'; factor: number } | { kind: 'volume'; factor: number } | null;

export type ConversionResult =
  | { ok: true; value: number; unit: string }
  | { ok: false; error: 'density_unknown'; message: string };

function resolveUnit(unit: string, ownerId?: string): BaseResolution {
  const normalized = normalizeUnit(unit);

  if (isKnownWeightUnit(normalized)) {
    return { kind: 'weight', factor: toGrams(1, normalized) as number };
  }

  // Household measures (xícara, colher de sopa, ...) take precedence over the
  // generic volume table so a personalized ml-equivalent is honored (US-039 AC2/AC3).
  const householdMl = conversionsRepository.getHouseholdMeasureMl(normalized, ownerId);
  if (householdMl !== undefined) {
    return { kind: 'volume', factor: householdMl };
  }

  if (isKnownVolumeUnit(normalized)) {
    return { kind: 'volume', factor: toMl(1, normalized) as number };
  }

  return null;
}

export const conversionsService = {
  listHouseholdMeasures(): HouseholdMeasure[] {
    return conversionsRepository.listHouseholdMeasureDefaults();
  },

  setHouseholdMeasureOverride(ownerId: string, measureName: string, standardEquivalentMl: number) {
    if (standardEquivalentMl <= 0) {
      throw AppError.badRequest('O equivalente em ml deve ser maior que zero.');
    }
    return conversionsRepository.setHouseholdMeasureOverride(ownerId, measureName, standardEquivalentMl);
  },

  getDensity(ingredient: string): number | undefined {
    return conversionsRepository.getIngredientDensity(ingredient);
  },

  convert(params: {
    value: number;
    fromUnit: string;
    toUnit: string;
    ingredient?: string;
    ownerId?: string;
  }): ConversionResult {
    const { value, fromUnit, toUnit, ingredient, ownerId } = params;

    const from = resolveUnit(fromUnit, ownerId);
    const to = resolveUnit(toUnit, ownerId);

    if (!from) throw AppError.badRequest(`Unidade de origem não reconhecida: "${fromUnit}".`);
    if (!to) throw AppError.badRequest(`Unidade de destino não reconhecida: "${toUnit}".`);

    if (from.kind === to.kind) {
      const base = value * from.factor;
      return { ok: true, value: base / to.factor, unit: toUnit };
    }

    // Crossing weight <-> volume requires a known ingredient density (US-038 AC3).
    if (!ingredient) {
      throw AppError.badRequest(
        'Para converter entre peso e volume é necessário informar o parâmetro "ingredient".'
      );
    }
    const density = conversionsRepository.getIngredientDensity(ingredient);
    if (density === undefined) {
      return {
        ok: false,
        error: 'density_unknown',
        message: `Densidade desconhecida para o ingrediente "${ingredient}" — não é possível converter entre peso e volume com segurança.`,
      };
    }

    let grams: number;
    let ml: number;
    if (from.kind === 'weight') {
      grams = value * from.factor;
      ml = grams / density;
      return { ok: true, value: ml / to.factor, unit: toUnit };
    } else {
      ml = value * from.factor;
      grams = ml * density;
      return { ok: true, value: grams / to.factor, unit: toUnit };
    }
  },

  /**
   * Converts an arbitrary recipe-ingredient quantity to grams, reused by the
   * nutrition module. Returns null when the unit can't be resolved to a
   * weight/volume base or (for volume units) no density is known for the
   * ingredient — callers should treat that as "missing data", not zero.
   */
  toGramsForIngredient(quantity: number, unit: string, ingredientName: string): number | null {
    const resolved = resolveUnit(unit);
    if (!resolved) return null;
    if (resolved.kind === 'weight') return quantity * resolved.factor;
    const density = conversionsRepository.getIngredientDensity(ingredientName);
    if (density === undefined) return null;
    const ml = quantity * resolved.factor;
    return ml * density;
  },
};
