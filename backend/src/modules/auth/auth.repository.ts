import { store } from '../../db/store';
import { Session, User } from './auth.types';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const authRepository = {
  findUserById(id: string): User | undefined {
    return store.users.get(id);
  },

  findUserByEmail(email: string): User | undefined {
    const normalized = normalizeEmail(email);
    return Array.from(store.users.values()).find((user) => user.email === normalized);
  },

  createUser(user: User): User {
    store.users.set(user.id, user);
    return user;
  },

  createSession(session: Session): Session {
    store.sessions.set(session.token, session);
    return session;
  },

  findSessionByToken(token: string): Session | undefined {
    return store.sessions.get(token);
  },

  deleteSession(token: string): boolean {
    return store.sessions.delete(token);
  },
};
