import type { IRequestHandler } from '../types';
import type { AuthUser } from '@entities/user/model/types/types';
import { delay } from 'msw';

interface CompleteRegistrationRequestBody {
  email: string;
  password: string;
  avatar?: string | null;
  name: string;
  birthDate: string;
  gender: string;
  city: string;
  interests: {
    categories: string[];
    subcategories: string[];
  };
  skill: {
    title: string;
    category: string;
    subcategory: string;
    description: string;
    images: string[];
  };
}

export function createRegistrationCompleteHandler(priority = 100): IRequestHandler {
  return {
    id: 'RegistrationCompleteHandler',
    priority,
    canHandle(request) {
      const url = new URL(request.url);

      return (
        url.pathname === '/api/registration/complete' && request.method.toUpperCase() === 'POST'
      );
    },
    async handle(request) {
      await delay(500);

      let body: CompleteRegistrationRequestBody | null = null;

      try {
        body = (await request.json()) as CompleteRegistrationRequestBody;
      } catch {
        return Response.json({ message: 'Invalid JSON body' }, { status: 400 });
      }

      const email = body?.email?.trim();
      const name = body?.name?.trim();

      if (!email || !name) {
        return Response.json({ message: 'Email and name are required' }, { status: 400 });
      }

      const mockUser: AuthUser = {
        id: `user_${Date.now()}`,
        email: body.email,
        name: body.name,
        avatar_image: body.avatar || undefined,
        date_of_birth: body.birthDate,
        gender: body.gender,
        location: body.city,
        date_of_registration: new Date().toISOString(),
        my_skills: {
          teach: [
            {
              skill_id: body.skill.category,
              skill_description: body.skill.description,
            },
          ],
        },
      };

      return Response.json({
        accessToken: 'mock-access-token-registration',
        refreshToken: 'mock-refresh-token-registration',
        user: mockUser,
      });
    },
  };
}
