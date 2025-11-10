import type { AuthUser } from '@entities/user/model-v2/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

function hasStringMessage(x: unknown): x is { message: string } {
  return (
    typeof x === 'object' &&
    x !== null &&
    'message' in x &&
    typeof (x as { message?: unknown }).message === 'string'
  );
}

/**
 * Выполняет вход пользователя через API авторизации.
 * Ожидается перехват MSW handler'ом `POST /api/auth/login` в dev-окружении.
 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: request.email, password: request.password }),
  });
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  let data: unknown = null;

  try {
    data = isJson ? await res.json() : await res.text();
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message =
      isJson && hasStringMessage(data) ? data?.message : `Login failed (${res.status})`;

    throw new Error(message);
  }

  if (!isJson) {
    throw new Error('Unexpected response from server (non-JSON). Ensure MSW is enabled.');
  }

  return data as LoginResponse;
}
