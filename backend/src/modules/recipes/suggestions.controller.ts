import { Request, Response } from 'express';
import { suggestionsService } from './suggestions.service';

export const suggestionsController = {
  list(req: Request, res: Response) {
    res.json(suggestionsService.list(req.userId!));
  },
};
