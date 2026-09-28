import { Router } from 'express';
import { imageUpload } from '../../middleware/upload';
import { requireAuth, optionalAuth } from '../../middleware/auth.middleware';
import { recipesController } from './recipes.controller';
import { duplicateController } from './duplicate.controller';
import { draftsRouter } from './drafts.routes';
import { recognizeController } from './recognize.controller';
import { searchController } from './search.controller';
import { cookingController } from './cooking.controller';
import { scalingController } from './scaling.controller';
import { suggestionsController } from './suggestions.controller';
import { nutritionRouter } from '../nutrition/nutrition.routes';

export const recipesRouter = Router();

// --- Specific, single-segment routes MUST be registered before the generic
// GET /:id (otherwise Express would match "/search" etc. as id="search"). ---
// `optionalAuth` on every route that attaches computed `safety` so
// `req.userId` is available when the client sends a token — the recipe
// catalog itself stays public/browsable either way (see safety.service.ts).
recipesRouter.get('/search', optionalAuth, searchController.search);
// Pantry-based suggestions need to know WHICH account's pantry to check now
// that pantry is per-account (it used to read the single shared pantry) —
// not explicitly called out in the task spec, but required for this to
// still compile/behave correctly, so this one extra read route needs auth.
recipesRouter.get('/suggestions', requireAuth, suggestionsController.list);
recipesRouter.post('/check-duplicate', optionalAuth, duplicateController.check);
recipesRouter.post('/recognize', imageUpload.single('image'), recognizeController.recognize);
recipesRouter.use('/drafts', draftsRouter);

// --- Multi-segment /:id/... routes (also safe before the generic /:id). ---
recipesRouter.post('/:id/track-use', optionalAuth, recipesController.trackUse);
recipesRouter.get('/:id/cooking-session', cookingController.getSession);
recipesRouter.post('/:id/cooking-session/steps/:stepId/complete', cookingController.completeStep);
// save-variant stamps ownership (RecipeVariant.ownerId), so — unlike the rest
// of the cooking-session routes, which don't touch safety or ownership —
// this one specific route requires a real session instead of optionalAuth.
recipesRouter.post('/:id/cooking-session/save-variant', requireAuth, cookingController.saveVariant);
recipesRouter.post('/:id/scale', scalingController.scale);
recipesRouter.post('/:id/apply-substitution', scalingController.applySubstitution);
recipesRouter.post('/:id/merge', optionalAuth, duplicateController.merge);
recipesRouter.use(nutritionRouter); // adds GET /:id/nutrition

// --- Generic CRUD ---
recipesRouter.get('/:id', optionalAuth, recipesController.getById);
recipesRouter.put('/:id', optionalAuth, recipesController.update);
recipesRouter.delete('/:id', recipesController.remove);
recipesRouter.get('/', optionalAuth, recipesController.list);
// POST /api/recipes requires auth so the recipe can be stamped with
// createdByUserId; GET/list/search/etc. stay public/unauthenticated.
recipesRouter.post('/', requireAuth, recipesController.create);
