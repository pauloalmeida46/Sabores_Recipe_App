import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/client';
import { AuthUser, login as apiLogin, logout as apiLogout, me as apiMe, signup as apiSignup } from '../api/auth';

const STORAGE_KEY = 'sabores.session';

interface StoredSession {
  token: string;
  user: AuthUser;
}

interface SessionContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

async function persistSession(session: StoredSession | null): Promise<void> {
  try {
    if (session) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    // Best-effort — a failure to persist shouldn't break the in-memory session.
    console.warn('[SessionContext] Falha ao persistir sessão:', err);
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: read a saved session, optimistically apply it, then confirm
  // the token is still valid in the background via GET /api/auth/me. If
  // that 401s (or otherwise fails as an auth error), clear everything and
  // fall back to logged-out.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      let saved: StoredSession | null = null;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        saved = raw ? (JSON.parse(raw) as StoredSession) : null;
      } catch (err) {
        console.warn('[SessionContext] Falha ao ler sessão salva:', err);
      }

      if (cancelled) return;

      if (!saved) {
        setLoading(false);
        return;
      }

      setAuthToken(saved.token);
      setToken(saved.token);
      setUser(saved.user);

      try {
        const freshUser = await apiMe();
        if (cancelled) return;
        setUser(freshUser);
      } catch (err) {
        // Token is no longer valid (or the backend is unreachable) — drop
        // the optimistic session rather than let the app act as if it's
        // logged in with a token the server will reject on every request.
        if (cancelled) return;
        setAuthToken(null);
        setToken(null);
        setUser(null);
        await persistSession(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const applySession = useCallback(async (result: { user: AuthUser; token: string }) => {
    setAuthToken(result.token);
    setToken(result.token);
    setUser(result.user);
    await persistSession({ token: result.token, user: result.user });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await apiLogin(email, password);
      await applySession(result);
    },
    [applySession]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await apiSignup(name, email, password);
      await applySession(result);
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Best-effort — don't block clearing local state if this fails (e.g. offline).
      console.warn('[SessionContext] Falha ao chamar logout no servidor:', err);
    }
    setAuthToken(null);
    setToken(null);
    setUser(null);
    await persistSession(null);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({ user, token, loading, login, signup, logout }),
    [user, token, loading, login, signup, logout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return ctx;
}
