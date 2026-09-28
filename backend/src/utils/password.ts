import bcrypt from 'bcryptjs';

/**
 * Thin wrapper around bcryptjs, kept in its own module (rather than inside
 * auth.service.ts) so it can also be imported by seed-data.ts without
 * creating a circular import (seed-data -> auth.service -> auth.repository
 * -> db/store -> seed-data).
 */

const SALT_ROUNDS = 10;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

export function comparePassword(password: string, passwordHash: string): boolean {
  return bcrypt.compareSync(password, passwordHash);
}
