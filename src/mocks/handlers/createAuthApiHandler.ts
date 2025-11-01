import type { IRequestHandler } from '../types';
import type { AuthUser, DbUser } from '@entities/user/model/types/types';
import { delay } from 'msw';
import {
  getAuthLoginScenarioResponse,
  type ErrorScenario,
  SCENARIO_HEADER,
} from '../scenarios/authLoginScenarios.ts';

interface LoginRequestBody {
  email: string;
  password: string;
}

export function createAuthApiHandler(priority = 100): IRequestHandler {
  return {
    id: 'AuthApiHandler',
    priority,
    canHandle(request) {
      const url = new URL(request.url);

      return url.pathname === '/api/auth/login' && request.method.toUpperCase() === 'POST';
    },
    async handle(request) {
      await delay(400);

      let body: LoginRequestBody | null = null;

      try {
        body = (await request.json()) as LoginRequestBody;
      } catch {
        return Response.json({ message: 'Invalid JSON body' }, { status: 400 });
      }

      const email = body?.email?.trim();
      const password = body?.password?.trim();

      if (!email || !password) {
        return Response.json({ message: 'Email and password are required' }, { status: 400 });
      }

      const scenario = request.headers.get(SCENARIO_HEADER)?.toLowerCase() as ErrorScenario;

      const earlyResponse = getAuthLoginScenarioResponse(email, password, scenario);

      if (earlyResponse) {
        return earlyResponse;
      }

      // 200 — успех
      const res = await fetch('/db/users.json');

      if (!res.ok) throw new Error(`Failed to load users.json: ${res.status}`);

      const data: { users: DbUser[] } = await res.json();
      const list = data?.users ?? [];
      // Ищем по точному совпадению имени; если не найден, берём первого пользователя как дефолт
      const found = list.find((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? list[0];

      if (!found) {
        throw new Error('List of users not found');
      }

      const mockUser: AuthUser = found as AuthUser;

      return Response.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: mockUser,
      });
    },
  };
}
