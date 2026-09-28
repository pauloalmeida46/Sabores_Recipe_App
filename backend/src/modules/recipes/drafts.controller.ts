import { Request, Response } from 'express';
import { draftsService } from './drafts.service';

export const draftsController = {
  list(req: Request, res: Response) {
    res.json({ drafts: draftsService.list(req.userId!) });
  },

  getById(req: Request, res: Response) {
    res.json(draftsService.getById(req.params.id, req.userId!));
  },

  create(req: Request, res: Response) {
    const { data } = req.body;
    res.status(201).json(draftsService.create(req.userId!, data ?? {}));
  },

  upsert(req: Request, res: Response) {
    const { data } = req.body;
    res.json(draftsService.upsert(req.params.id, req.userId!, data ?? {}));
  },

  finalize(req: Request, res: Response) {
    res.status(201).json(draftsService.finalize(req.params.id, req.userId!));
  },
};
