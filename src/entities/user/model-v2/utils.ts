import type { UserListItem } from './types';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard';
import type { User } from '@/entities/user/model/types/types';
import type { Skill } from '@/entities/skill/model/types/types';
import type { TagCategory } from '@/shared/ui/Tag';
import {
  getSubcategoriesFromStore,
  getCitiesFromStore,
} from '@/entities/directory/lib/getFromStore';

type UserListItemToSkillCardOptions = {
  currentUserId?: string | null;
  onDetailsClick?: (userId: string) => void;
  onLikeClick?: (params: { skillOwnerUserId: string; primarySkillId?: string }) => void;
};

/**
 * Утилита для преобразования UserListItem в SkillCardProps
 */
export function userListItemToSkillCard(
  userItem: UserListItem,
  options: UserListItemToSkillCardOptions = {}
): SkillCardProps {
  const { currentUserId, onDetailsClick, onLikeClick } = options;

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

  const card: SkillCardProps = {
    user,
    teachingSkills,
    learningSkills,
    onDetailsClick: onDetailsClick ? () => onDetailsClick(userItem.id) : undefined,
    onLikeClick: onLikeClick
      ? () =>
          onLikeClick({
            skillOwnerUserId: userItem.id,
            primarySkillId: userItem.primarySkillId,
          })
      : () => console.log(`Like clicked for ${userItem.name}`),
    isLiked: userItem.isLikedByCurrentUser || false,
    likesCount: userItem.primarySkillLikesCount || 0,
  };

  // Синхронизируемся с локальным состоянием лайков (как в SkillPage)
  if (userItem.primarySkillId) {
    const likesKey = `likes_${userItem.primarySkillId}_${userItem.id}`;
    try {
      const likesDataRaw = localStorage.getItem(likesKey);
      if (likesDataRaw) {
        const likesData = JSON.parse(likesDataRaw) as { count: number; users: string[] };
        if (Number.isFinite(likesData.count)) {
          card.likesCount = likesData.count;
        }

        const resolvedUserId =
          currentUserId ||
          sessionStorage.getItem('guestId') ||
          null;

        if (resolvedUserId) {
          card.isLiked = likesData.users.includes(resolvedUserId);
        }
      }
    } catch (error) {
      console.warn('[userListItemToSkillCard] Failed to read likes from localStorage', error);
    }
  }

  return card;
}
