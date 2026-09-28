import { Request, Response } from 'express';
import { AppError } from '../../utils/AppError';
import { conversionsService } from './conversions.service';

export const conversionsController = {
  convertUnits(req: Request, res: Response) {
    const { value, fromUnit, toUnit, ingredient, ownerId } = req.query;

    const numericValue = Number(value);
    if (!value || Number.isNaN(numericValue)) {
      throw AppError.badRequest('Parâmetro "value" deve ser um número.');
    }
    if (typeof fromUnit !== 'string' || !fromUnit) {
      throw AppError.badRequest('Parâmetro "fromUnit" é obrigatório.');
    }
    if (typeof toUnit !== 'string' || !toUnit) {
      throw AppError.badRequest('Parâmetro "toUnit" é obrigatório.');
    }

    const result = conversionsService.convert({
      value: numericValue,
      fromUnit,
      toUnit,
      ingredient: typeof ingredient === 'string' ? ingredient : undefined,
      ownerId: typeof ownerId === 'string' ? ownerId : undefined,
    });

    if (!result.ok) {
      return res.status(200).json(result);
    }
    res.json(result);
  },

  listHouseholdMeasures(_req: Request, res: Response) {
    res.json({ measures: conversionsService.listHouseholdMeasures() });
  },

  setHouseholdMeasureCustom(req: Request, res: Response) {
    const { ownerId, measureName, standardEquivalentMl } = req.body;
    const override = conversionsService.setHouseholdMeasureOverride(ownerId, measureName, standardEquivalentMl);
    res.json(override);
  },
};
