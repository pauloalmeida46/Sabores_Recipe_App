import { Request, Response } from 'express';
import { pantryService } from './pantry.service';

export const pantryController = {
  list(req: Request, res: Response) {
    res.json({ items: pantryService.list(req.userId!) });
  },

  summary(req: Request, res: Response) {
    res.json(pantryService.getSummary(req.userId!));
  },

  create(req: Request, res: Response) {
    const item = pantryService.create(req.userId!, req.body);
    res.status(201).json(item);
  },

  update(req: Request, res: Response) {
    const item = pantryService.update(req.userId!, req.params.id, req.body);
    res.json(item);
  },

  remove(req: Request, res: Response) {
    pantryService.remove(req.userId!, req.params.id);
    res.status(204).send();
  },
};
