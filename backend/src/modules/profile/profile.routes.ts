import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth.middleware';
import { profileController } from './profile.controller';

const restrictionSchema = z.object({
  label: z.string().trim().min(1, 'Rótulo é obrigatório.'),
  kind: z.enum(['allergy', 'diet']),
  // Only meaningful when kind === 'allergy' — the actual substance/ingredient
  // name to match against recipe ingredients' `allergens` tags (e.g. "nozes"),
  // since the free-text label (e.g. "Alergia a nozes") won't match by itself.
  allergenKey: z.string().trim().min(1).optional(),
});

const restrictionActiveSchema = z.object({
  active: z.boolean(),
});

const patchSchema = z.object({
  name: z.string().trim().min(1).optional(),
  firstName: z.string().trim().min(1).optional(),
  skillLevel: z.enum(['Iniciante', 'Intermediário', 'Avançado']).optional(),
  preferences: z
    .object({
      expiryNoticeDays: z.number().int().nonnegative().optional(),
      syncDevices: z.boolean().optional(),
      autoBackup: z.string().optional(),
    })
    .optional(),
  dailyGoals: z
    .object({
      calories: z.number().nonnegative().optional(),
      protein: z.number().nonnegative().optional(),
      carbs: z.number().nonnegative().optional(),
      fat: z.number().nonnegative().optional(),
      fiber: z.number().nonnegative().optional(),
      sodium: z.number().nonnegative().optional(),
      sugar: z.number().nonnegative().optional(),
    })
    .optional(),
  equipment: z
    .array(z.object({ id: z.string(), label: z.string(), active: z.boolean() }))
    .optional(),
});

export const profileRouter = Router();

// Profile is per-account — every route below requires auth.
profileRouter.use(requireAuth);

profileRouter.get('/', profileController.get);
profileRouter.patch('/', validateBody(patchSchema), profileController.patch);
profileRouter.get('/restrictions', profileController.listRestrictions);
profileRouter.post('/restrictions', validateBody(restrictionSchema), profileController.addRestriction);
profileRouter.patch(
  '/restrictions/:id',
  validateBody(restrictionActiveSchema),
  profileController.setRestrictionActive
);
profileRouter.delete('/restrictions/:id', profileController.removeRestriction);
