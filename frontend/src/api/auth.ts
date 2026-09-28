import { apiGet, apiPost } from './client';

/**
 * Local mirror of the backend's `PublicUser` shape (see
 * app/backend/src/modules/auth/auth.types.ts) — never includes a password
 * hash.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export function signup(name: string, email: string, password: string): Promise<AuthResult> {
  return apiPost<AuthResult>('/auth/signup', { name, email, password });
}

export function login(email: string, password: string): Promise<AuthResult> {
  return apiPost<AuthResult>('/auth/login', { email, password });
}

/** Requires auth (`Authorization` header attached via `setAuthToken`). Returns `204` — no body. */
export function logout(): Promise<void> {
  return apiPost<void>('/auth/logout');
}

/** Requires auth. Used on cold start to confirm a persisted token is still valid. */
export function me(): Promise<AuthUser> {
  return apiGet<AuthUser>('/auth/me');
}
