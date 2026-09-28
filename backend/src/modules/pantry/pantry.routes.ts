import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth.middleware';
import { pantryController } from './pantry.controller';

const createSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.'),
  quantity: z.number({ invalid_type_error: 'Quantidade deve ser um número.' }).positive('Quantidade deve ser maior que zero.'),
  unit: z.string().trim().min(1, 'Unidade é obrigatória.'),
  category: z.string().trim().min(1, 'Categoria é obrigatória.'),
  expiresAt: z.string().datetime().nullable().optional().or(z.string().date().nullable().optional()),
});

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  quantity: z.number().positive('Quantidade deve ser maior que zero.').optional(),
  unit: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  expiresAt: z.string().nullable().optional(),
  urgent: z.boolean().optional(),
});

export const pantryRouter = Router();

// Pantry is per-account — every route below requires auth.
pantryRouter.use(requireAuth);

pantryRouter.get('/summary', pantryController.summary);
pantryRouter.get('/', pantryController.list);
pantryRouter.post('/', validateBody(createSchema), pantryController.create);
pantryRouter.patch('/:id', validateBody(updateSchema), pantryController.update);
pantryRouter.delete('/:id', pantryController.remove);
