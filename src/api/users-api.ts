import type { User } from '../entities/user/model/types/types';
import type { SkillCardProps } from '@/shared/ui/SkillCard';
import type { Skill } from '@/entities/skill/model/types/types';
import type { SkillCategoriesData } from '@/entities/Skill';
import type { DbUser } from '@/entities/user/model/types/types';
import { mapCategoryToTag } from '@/shared/lib/categoryMapper';

interface DbUsersResponse {
  users: DbUser[];
}

/**
 * Загружает список всех пользователей из JSON файла
 * @returns Promise с массивом пользователей
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/db/users.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DbUsersResponse = await response.json();

    // Преобразуем DbUser[] в User[]
    const users: User[] = data.users.map((dbUser) => ({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.contacts?.email || '',
      avatar: dbUser.avatar_image,
      bio:
        dbUser.location && dbUser.age
          ? `${dbUser.location}, ${dbUser.age} ${getAgeWord(dbUser.age)}`
          : dbUser.about_me,
      skills: [],
      createdAt: dbUser.date_of_registration || new Date().toISOString(),
    }));

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Преобразует данные пользователей из JSON в формат SkillCardProps[]
 * Загружает каталог навыков для получения названий и категорий
 * @returns Promise с массивом SkillCardProps
 */
export const fetchUsersAsSkillCards = async (): Promise<SkillCardProps[]> => {
  try {
    // Загружаем данные параллельно
    const [usersResponse, skillsResponse] = await Promise.all([
      fetch('/db/users.json'),
      fetch('/db/skills.json'),
    ]);

    if (!usersResponse.ok) {
      throw new Error(`HTTP error! status: ${usersResponse.status}`);
    }

    if (!skillsResponse.ok) {
      throw new Error(`HTTP error! status: ${skillsResponse.status}`);
    }

    const usersData: DbUsersResponse = await usersResponse.json();
    const skillsCatalog: SkillCategoriesData = await skillsResponse.json();

    // Создаем мапу для быстрого поиска навыков по skill_id
    const skillMap = new Map<string, { name: string; category: string }>();
    skillsCatalog.skill_categories.forEach((category) => {
      category.skills.forEach((skill) => {
        skillMap.set(skill.skill_id, {
          name: skill.skill_name,
          category: category.category,
        });
      });
    });

    // Преобразуем пользователей
    const skillCards: SkillCardProps[] = usersData.users.map((dbUser) => {
      // Преобразуем навыки для обучения (teaching)
      const teachingSkills: Skill[] =
        dbUser.my_skills?.teach?.map((skillData) => {
          const skillInfo = skillMap.get(skillData.skill_id);
          return {
            id: skillData.skill_id,
            title: skillInfo?.name || skillData.skill_id,
            description: skillData.skill_description,
            type: 'teaching' as const,
            category: skillInfo ? mapCategoryToTag(skillInfo.category) : 'other',
            authorId: dbUser.id,
            createdAt: dbUser.date_of_registration || new Date().toISOString(),
          };
        }) || [];

      // Преобразуем навыки для изучения (learning)
      const learningSkills: Skill[] =
        dbUser.my_skills?.learn?.map((skillData) => {
          const skillInfo = skillMap.get(skillData.skill_id);
          return {
            id: skillData.skill_id,
            title: skillInfo?.name || skillData.skill_id,
            description: skillData.skill_description,
            type: 'learning' as const,
            category: skillInfo ? mapCategoryToTag(skillInfo.category) : 'other',
            authorId: dbUser.id,
            createdAt: dbUser.date_of_registration || new Date().toISOString(),
          };
        }) || [];

      // Формируем биографию
      const bio =
        dbUser.location && dbUser.age
          ? `${dbUser.location}, ${dbUser.age} ${getAgeWord(dbUser.age)}`
          : dbUser.about_me || '';

      // Создаем объект User
      const user: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.contacts?.email || '',
        avatar: dbUser.avatar_image,
        bio,
        skills: [],
        createdAt: dbUser.date_of_registration || new Date().toISOString(),
      };

      // Возвращаем SkillCardProps
      return {
        user,
        teachingSkills,
        learningSkills,
        onDetailsClick: () => console.log(`Details clicked for ${dbUser.name}`),
        onLikeClick: () => console.log(`Like clicked for ${dbUser.name}`),
        isLiked: false,
      };
    });

    return skillCards;
  } catch (error) {
    console.error('Error fetching users as skill cards:', error);
    throw error;
  }
};

// Вспомогательная функция для склонения слова "год"
function getAgeWord(age: number): string {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет';
  }

  if (lastDigit === 1) {
    return 'год';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года';
  }

  return 'лет';
}
