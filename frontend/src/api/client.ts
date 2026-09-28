import { API_BASE_URL } from './config';

/** Shape of an error response from the backend: `{ error: { message, details? } }`. */
interface BackendErrorBody {
  error?: {
    message?: string;
    details?: unknown;
  };
}

/**
 * Current session token, if any. Set by `SessionContext` whenever the token
 * changes (on load, login, signup, logout) — kept here (rather than imported
 * from the session context) to avoid a circular import between the client
 * and the context that consumes it.
 */
let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers ?? {}),
      },
    });
  } catch (err) {
    // Fetch itself failed — e.g. backend not running, or the device can't
    // reach the resolved host. Never let this crash the app.
    console.warn('[api/client] Falha de rede ao chamar', path, err);
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando e se o dispositivo está na mesma rede.'
    );
  }

  const raw = await response.text();
  let body: unknown;
  try {
    body = raw ? JSON.parse(raw) : undefined;
  } catch {
    body = undefined;
  }

  if (!response.ok) {
    const message = (body as BackendErrorBody)?.error?.message ?? 'Erro inesperado no servidor.';
    throw new Error(message);
  }

  return body as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function apiPost<T>(path: string, data?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export function apiPut<T>(path: string, data?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PUT',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export function apiPatch<T>(path: string, data?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE' });
}
