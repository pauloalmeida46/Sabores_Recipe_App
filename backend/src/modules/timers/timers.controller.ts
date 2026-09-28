import { Request, Response } from 'express';
import { timersService } from './timers.service';

export const timersController = {
  list(req: Request, res: Response) {
    res.json({ timers: timersService.list(req.userId!) });
  },

  getById(req: Request, res: Response) {
    res.json(timersService.getById(req.userId!, req.params.id));
  },

  create(req: Request, res: Response) {
    res.status(201).json(timersService.create(req.userId!, req.body));
  },

  applyAction(req: Request, res: Response) {
    res.json(timersService.applyAction(req.userId!, req.params.id, req.body.action));
  },
};
