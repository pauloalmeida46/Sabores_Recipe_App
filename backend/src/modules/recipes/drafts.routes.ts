import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth.middleware';
import { draftsController } from './drafts.controller';

const draftPayloadSchema = z.record(z.string(), z.unknown());

// ownerId is no longer accepted from the client — it's derived server-side
// from req.userId (set by requireAuth below) to prevent impersonation.
const createSchema = z.object({
  data: draftPayloadSchema.optional(),
});

const upsertSchema = z.object({
  data: draftPayloadSchema.optional(),
});

export const draftsRouter = Router();

draftsRouter.use(requireAuth);

draftsRouter.get('/', draftsController.list);
draftsRouter.post('/', validateBody(createSchema), draftsController.create);
draftsRouter.get('/:id', draftsController.getById);
draftsRouter.put('/:id', validateBody(upsertSchema), draftsController.upsert);
draftsRouter.post('/:id/finalize', draftsController.finalize);
