import { Request, Response } from 'express';
import { profileService } from './profile.service';

export const profileController = {
  get(req: Request, res: Response) {
    res.json(profileService.get(req.userId!));
  },

  patch(req: Request, res: Response) {
    res.json(profileService.patch(req.userId!, req.body));
  },

  listRestrictions(req: Request, res: Response) {
    res.json({ restrictions: profileService.listRestrictions(req.userId!) });
  },

  addRestriction(req: Request, res: Response) {
    const restriction = profileService.addRestriction(req.userId!, req.body.label, req.body.kind, req.body.allergenKey);
    res.status(201).json(restriction);
  },

  removeRestriction(req: Request, res: Response) {
    profileService.removeRestriction(req.userId!, req.params.id);
    res.status(204).send();
  },

  setRestrictionActive(req: Request, res: Response) {
    res.json(profileService.setRestrictionActive(req.userId!, req.params.id, req.body.active));
  },
};
