import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth.middleware';
import { timersController } from './timers.controller';

const createSchema = z.object({
  recipeId: z.string().optional(),
  stepId: z.string().optional(),
  label: z.string().trim().min(1, 'Rótulo é obrigatório.'),
  durationSec: z.number().int().positive('durationSec deve ser maior que zero.'),
});

const actionSchema = z.object({
  action: z.enum(['pause', 'resume', 'cancel']),
});

export const timersRouter = Router();

// Timers are per-account — every route below requires auth.
timersRouter.use(requireAuth);

timersRouter.get('/', timersController.list);
timersRouter.post('/', validateBody(createSchema), timersController.create);
timersRouter.get('/:id', timersController.getById);
timersRouter.patch('/:id', validateBody(actionSchema), timersController.applyAction);
