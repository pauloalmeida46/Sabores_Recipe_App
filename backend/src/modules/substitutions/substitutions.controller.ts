import { Request, Response } from 'express';
import { substitutionsService } from './substitutions.service';

export const substitutionsController = {
  lookup(req: Request, res: Response) {
    res.json(substitutionsService.lookup(req.params.name));
  },
};
