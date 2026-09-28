import { Request, Response } from 'express';
import { authService } from './auth.service';

function extractBearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return undefined;
  const token = header.slice('Bearer '.length).trim();
  return token || undefined;
}

export const authController = {
  signup(req: Request, res: Response) {
    const { name, email, password } = req.body;
    res.status(201).json(authService.signup(name, email, password));
  },

  login(req: Request, res: Response) {
    const { email, password } = req.body;
    res.json(authService.login(email, password));
  },

  logout(req: Request, res: Response) {
    const token = extractBearerToken(req);
    if (token) authService.logout(token);
    res.status(204).send();
  },

  me(req: Request, res: Response) {
    res.json(authService.getPublicUserById(req.userId!));
  },
};
