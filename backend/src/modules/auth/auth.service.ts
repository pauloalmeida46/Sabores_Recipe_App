import { randomBytes } from 'node:crypto';
import { AppError } from '../../utils/AppError';
import { comparePassword, hashPassword } from '../../utils/password';
import { authRepository } from './auth.repository';
import { PublicUser, Session, User } from './auth.types';
// Provisioning a brand-new account's profile/plan at signup time. These are
// leaf-ish repositories (they only import db/store.ts + their own types, no
// auth module involved), so importing them here doesn't create an import
// cycle — verified by `npm run typecheck` after wiring this up.
import { profileRepository } from '../profile/profile.repository';
import { planRepository } from '../plan/plan.repository';

function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createSessionForUser(userId: string): Session {
  const session: Session = {
    token: randomBytes(32).toString('hex'),
    userId,
    createdAt: new Date().toISOString(),
  };
  return authRepository.createSession(session);
}

export const authService = {
  signup(name: string, email: string, password: string): { user: PublicUser; token: string } {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw AppError.badRequest('Nome é obrigatório.');
    }
    if (!password || password.length < 6) {
      throw AppError.badRequest('Senha deve ter ao menos 6 caracteres.');
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = authRepository.findUserByEmail(normalizedEmail);
    if (existing) {
      throw AppError.badRequest('Este e-mail já está cadastrado.');
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    authRepository.createUser(user);
    // Every account gets exactly one profile and one (empty) weekly plan from
    // the moment it exists — mirrors how pantry starts empty per-account
    // rather than crashing on first access. See profile/plan .repository.ts.
    profileRepository.ensure(user.id);
    planRepository.ensure(user.id);
    const session = createSessionForUser(user.id);
    return { user: toPublicUser(user), token: session.token };
  },

  login(email: string, password: string): { user: PublicUser; token: string } {
    const normalizedEmail = normalizeEmail(email);
    const user = authRepository.findUserByEmail(normalizedEmail);
    // Deliberately generic message — never reveal whether the email exists.
    if (!user || !comparePassword(password, user.passwordHash)) {
      throw AppError.unauthorized('E-mail ou senha incorretos.');
    }
    const session = createSessionForUser(user.id);
    return { user: toPublicUser(user), token: session.token };
  },

  logout(token: string): void {
    authRepository.deleteSession(token);
  },

  /** Returns the User for a valid bearer token, or undefined if missing/invalid. */
  resolveToken(token: string): User | undefined {
    const session = authRepository.findSessionByToken(token);
    if (!session) return undefined;
    return authRepository.findUserById(session.userId);
  },

  getPublicUserById(id: string): PublicUser {
    const user = authRepository.findUserById(id);
    if (!user) throw AppError.unauthorized('Sessão inválida.');
    return toPublicUser(user);
  },
};
