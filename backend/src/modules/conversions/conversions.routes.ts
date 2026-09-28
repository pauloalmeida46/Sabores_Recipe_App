import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { conversionsController } from './conversions.controller';

const customMeasureSchema = z.object({
  ownerId: z.string().trim().min(1, 'ownerId é obrigatório.'),
  measureName: z.string().trim().min(1, 'measureName é obrigatório.'),
  standardEquivalentMl: z.number().positive('O equivalente em ml deve ser maior que zero.'),
});

export const conversionsRouter = Router();

conversionsRouter.get('/units', conversionsController.convertUnits);
conversionsRouter.get('/household-measures', conversionsController.listHouseholdMeasures);
conversionsRouter.put(
  '/household-measures/custom',
  validateBody(customMeasureSchema),
  conversionsController.setHouseholdMeasureCustom
);
