import type { UserListItem } from './types';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard';
import type { User } from '@/entities/user/model/types/types';
import type { Skill } from '@/entities/skill/model/types/types';
import type { TagCategory } from '@/shared/ui/Tag';
import {
  getSubcategoriesFromStore,
  getCitiesFromStore,
} from '@/entities/directory/lib/getFromStore';

/**
 * Утилита для преобразования UserListItem в SkillCardProps
 */
export function userListItemToSkillCard(userItem: UserListItem): SkillCardProps {
  const subcategories = getSubcategoriesFromStore();
  const cities = getCitiesFromStore();

  const skillMapById = new Map(subcategories.map((s) => [s.id, s]));
  const cityMap = new Map(cities.map((c) => [c.id, c.name]));
  const cityName = cityMap.get(userItem.cityId) || userItem.cityId;

  const user: User = {
    id: userItem.id,
    name: userItem.name,
    email: '',
    avatar: userItem.avatar || undefined,
    gender:
      userItem.gender === 'male'
        ? 'мужской'
        : userItem.gender === 'female'
          ? 'женский'
          : 'не указан',
    bio: `${cityName}, ${userItem.age} лет`,
    skills: [],
    createdAt: new Date(userItem.createdAt).toISOString(),
  };

  const teachingSkills: Skill[] = userItem.canTeachSkills.map((skillId) => {
    const skillInfo = skillMapById.get(skillId);

    return {
      id: skillId,
      title: skillInfo?.name || skillId, // Используем название из справочника
      description: '',
      type: 'teaching' as const,
      category: (skillInfo?.categoryId || 'other') as TagCategory,
      authorId: userItem.id,
      createdAt: new Date(userItem.createdAt).toISOString(),
    };
  });

  const learningSkills: Skill[] = userItem.wantsToLearnSkills.map((skillId) => {
    const skillInfo = skillMapById.get(skillId);

    return {
      id: skillId,
      title: skillInfo?.name || skillId, // Используем название из справочника
      description: '',
      type: 'learning' as const,
      category: (skillInfo?.categoryId || 'other') as TagCategory,
      authorId: userItem.id,
      createdAt: new Date(userItem.createdAt).toISOString(),
    };
  });

  return {
    user,
    teachingSkills,
    learningSkills,
    onDetailsClick: () => console.log(`Details clicked for ${userItem.name}`),
    onLikeClick: () => console.log(`Like clicked for ${userItem.name}`),
    isLiked: false,
  };
}
