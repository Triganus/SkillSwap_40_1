import type { IRequestHandler } from '../types';
import type { AuthUser } from '@entities/user/model/types/types';
import { delay } from 'msw';
import { registerMockUser } from './createUsersApiHandler';
import type { RegisterMockUserPayload } from './createUsersApiHandler';
import type { Gender, UserListItem } from '@/entities/user/model-v2/types';

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

      const safeGender = (['male', 'female', 'not_specified'] as Gender[]).includes(
        body.gender as Gender
      )
        ? (body.gender as Gender)
        : ('not_specified' as Gender);

      const createdAt = Date.now();
      const userId = `user_${createdAt}`;
      const skillId = `skill_${userId}_0`;

      const birthDate = new Date(body.birthDate);
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age -= 1;
      }

      const listItem: UserListItem = {
        id: userId,
        name: body.name,
        cityId: body.city,
        age: Number.isFinite(age) ? age : 18,
        gender: safeGender,
        avatar: body.avatar || null,
        canTeachSkills: [body.skill.subcategory],
        wantsToLearnSkills: body.interests?.subcategories || [],
        createdAt,
        primarySkillId: skillId,
        primarySkillLikesCount: 0,
      };

      const payload: RegisterMockUserPayload = {
        listItem,
        profile: {
          bio:
            body.skill.description ||
            `Привет! Меня зовут ${body.name}. Я готов делиться своими знаниями и навыками.`,
        },
        skills: [
          {
            subcategoryId: body.skill.subcategory,
            title: body.skill.title,
            description: body.skill.description,
            categoryId: body.skill.category,
            images: body.skill.images || [],
          },
        ],
      };

      await registerMockUser(payload);

      const mockUser: AuthUser = {
        id: userId,
        email: body.email,
        name: body.name,
        avatar_image: body.avatar || undefined,
        date_of_birth: body.birthDate,
        gender: safeGender,
        location: body.city,
        date_of_registration: new Date(createdAt).toISOString(),
        my_skills: {
          teach: [
            {
              skill_id: skillId,
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
