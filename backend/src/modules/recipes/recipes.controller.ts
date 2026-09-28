import { Request, Response } from 'express';
import { recipesService } from './recipes.service';

export const recipesController = {
  list(req: Request, res: Response) {
    res.json({ recipes: recipesService.list(req.userId) });
  },

  getById(req: Request, res: Response) {
    res.json(recipesService.getById(req.params.id, req.userId));
  },

  create(req: Request, res: Response) {
    res.status(201).json(recipesService.create(req.body, req.userId!));
  },

  update(req: Request, res: Response) {
    res.json(recipesService.update(req.params.id, req.body, req.userId));
  },

  remove(req: Request, res: Response) {
    recipesService.remove(req.params.id);
    res.status(204).send();
  },

  trackUse(req: Request, res: Response) {
    res.json(recipesService.trackUse(req.params.id, req.userId));
  },
};
