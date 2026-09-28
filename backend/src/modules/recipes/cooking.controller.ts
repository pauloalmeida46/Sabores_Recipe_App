import { Request, Response } from 'express';
import { cookingService } from './cooking.service';

export const cookingController = {
  getSession(req: Request, res: Response) {
    res.json(cookingService.getSession(req.params.id));
  },

  completeStep(req: Request, res: Response) {
    res.json(cookingService.completeStep(req.params.id, req.params.stepId));
  },

  saveVariant(req: Request, res: Response) {
    const { label, stepOverrides } = req.body;
    res.status(201).json(cookingService.saveVariant(req.userId!, req.params.id, label, stepOverrides ?? []));
  },
};
