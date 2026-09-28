import { Router } from 'express';
import { substitutionsController } from './substitutions.controller';

export const substitutionsRouter = Router();

substitutionsRouter.get('/:name/substitutions', substitutionsController.lookup);
