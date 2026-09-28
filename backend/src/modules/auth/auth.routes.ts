import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth.middleware';
import { authController } from './auth.controller';

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.'),
  email: z.string().trim().email('E-mail inválido.'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
});

const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

export const authRouter = Router();

authRouter.post('/signup', validateBody(signupSchema), authController.signup);
authRouter.post('/login', validateBody(loginSchema), authController.login);
authRouter.post('/logout', requireAuth, authController.logout);
authRouter.get('/me', requireAuth, authController.me);
