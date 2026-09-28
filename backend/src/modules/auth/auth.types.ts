export interface User {
  id: string;
  name: string;
  email: string; // stored normalized: trimmed + lowercased
  passwordHash: string;
  createdAt: string;
}

/** User shape safe to return to clients — never includes passwordHash. */
export type PublicUser = Omit<User, 'passwordHash'>;

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
}
