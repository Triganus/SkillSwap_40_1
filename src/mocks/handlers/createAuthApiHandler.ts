import type { IRequestHandler } from '../types';
import type { AuthUser } from '@entities/user/model-v2/types';
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

interface DbUserV2 {
  id: string;
  name: string;
  email: string;
  birthDate: string;
  gender: 'male' | 'female' | 'not_specified';
  cityId: string;
  avatar: string | null;
  bio: string;
  canTeachSkillIds: string[];
  wantsToLearnSkillIds: string[];
  likedSkillIds: string[];
  createdAt: number;
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
      const res = await fetch('/db/users-v2.json');

      if (!res.ok) throw new Error(`Failed to load users-v2.json: ${res.status}`);

      const data: { users: DbUserV2[] } = await res.json();
      const list = data?.users ?? [];

      // Ищем по точному совпадению email; если не найден, берём первого пользователя как дефолт
      const found = list.find((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? list[0];

      if (!found) {
        throw new Error('List of users not found');
      }

      // Формируем AuthUser в формате v2 с обязательными полями
      const mockUser: AuthUser = {
        id: found.id,
        email: found.email,
        name: found.name,
        avatar: found.avatar,
        token: 'mock-access-token-' + found.id,
      };

      return Response.json({
        accessToken: 'mock-access-token-' + found.id,
        refreshToken: 'mock-refresh-token-' + found.id,
        user: mockUser,
      });
    },
  };
}
