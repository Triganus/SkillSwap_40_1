import { ProfileSidebar } from '@/features/profile/ui/ProfileSidebar/ProfileSidebar';
import styles from './FavoritesPage.module.scss';
import { Favorites } from '@/features/favorites/ui/Favorites';
import { useEffect, useMemo, useState } from 'react';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import {
  fetchUserProfileThunk,
  selectAuthV2State,
  selectUserLikedSkills,
  selectUserListItemsEntities,
  selectUserProfilesEntities,
} from '@/entities/user/model-v2';
import { getCitiesFromStore, getSubcategoriesFromStore } from '@/entities/directory';
import type { User } from '@/entities/user/model';
import type { TagCategory } from '@/shared/ui/Tag';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthV2State);
  const userListEntities = useAppSelector(selectUserListItemsEntities);
  const userProfilesEntities = useAppSelector(selectUserProfilesEntities);
  const currentUserId = authState.user?.id;

  // Получаем лайкнутые навыки текущего пользователя
  const likedSkillIds = useAppSelector((state) =>
    currentUserId ? selectUserLikedSkills(currentUserId)(state) : []
  );

  const [favoriteCards, setFavoriteCards] = useState<SkillCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем профили для всех лайкнутых навыков
  useEffect(() => {
    if (!currentUserId || !likedSkillIds.length) {
      setFavoriteCards([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const loadFavoriteProfiles = async () => {
      const uniqueUserIds = new Set<string>();

      // Ищем все уникальные userId по лайкнутым навыкам
      Object.keys(userListEntities).forEach((userId) => {
        const user = userListEntities[userId];
        if (
          user &&
          likedSkillIds.some(
            (skillId) =>
              user.canTeachSkills.includes(skillId) || user.wantsToLearnSkills.includes(skillId)
          )
        ) {
          uniqueUserIds.add(userId);
        }
      });

      // Загружаем профили для всех найденных пользователей
      const profilePromises = Array.from(uniqueUserIds).map((userId) =>
        dispatch(fetchUserProfileThunk(userId)).unwrap()
      );

      try {
        await Promise.all(profilePromises);
      } catch (error) {
        console.error('Failed to load favorite profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProfiles();
  }, [dispatch, currentUserId, likedSkillIds, userListEntities]);

  // Формируем карточки избранного
  const favoriteCardsData = useMemo(() => {
    if (!currentUserId) return [];

    const subcategories = getSubcategoriesFromStore();
    const cities = getCitiesFromStore();

    const skillMap = new Map(subcategories.map((s) => [s.id, s]));
    const cityMap = new Map(cities.map((c) => [c.id, c.name]));

    return likedSkillIds
      .map((skillId) => {
        // Ищем пользователя, которому принадлежит этот навык
        const userWithSkill = Object.values(userListEntities).find(
          (user) =>
            user &&
            (user.canTeachSkills.includes(skillId) || user.wantsToLearnSkills.includes(skillId))
        );

        if (!userWithSkill) return null;

        const cityName = cityMap.get(userWithSkill.cityId) || userWithSkill.cityId;

        const user: User = {
          id: userWithSkill.id,
          name: userWithSkill.name,
          email: '',
          avatar: userWithSkill.avatar || undefined,
          gender:
            userWithSkill.gender === 'male'
              ? 'мужской'
              : userWithSkill.gender === 'female'
                ? 'женский'
                : 'не указан',
          bio: `${cityName}, ${userWithSkill.age} лет`,
          skills: [],
          createdAt: new Date(userWithSkill.createdAt).toISOString(),
        };

        // Получаем профиль для получения полной информации о навыках
        const profile = userProfilesEntities[userWithSkill.id];

        const teachingSkills = (profile?.canTeachSkills || [])
          .filter((skillId) => userWithSkill.canTeachSkills.includes(skillId))
          .map((skillId) => {
            const skillInfo = skillMap.get(skillId);
            return {
              id: skillId,
              title: skillInfo?.name || skillId,
              category: (skillInfo?.categoryId || 'other') as TagCategory,
            };
          });

        const learningSkills = (profile?.wantsToLearnSkills || [])
          .filter((skillId) => userWithSkill.wantsToLearnSkills.includes(skillId))
          .map((skillId) => {
            const skillInfo = skillMap.get(skillId);
            return {
              id: skillId,
              title: skillInfo?.name || skillId,
              category: (skillInfo?.categoryId || 'other') as TagCategory,
            };
          });

        return {
          user,
          teachingSkills,
          learningSkills,
          onDetailsClick: () => navigate(`/skill/${userWithSkill.id}`),
          onLikeClick: () => {
            // При клике на лайк в избранном - убираем лайк
            // Это будет обработано через toggleSkillLikeThunk
          },
          isLiked: true,
          likesCount: userWithSkill.primarySkillLikesCount || 0,
        } as SkillCardProps;
      })
      .filter(Boolean) as SkillCardProps[];
  }, [likedSkillIds, currentUserId, userListEntities, userProfilesEntities]);

  useEffect(() => {
    setFavoriteCards(favoriteCardsData);
  }, [favoriteCardsData]);

  const handleSkillDetailsClick = (userId: string) => {
    navigate(`/skill/${userId}`);
  };

  return (
    <div className={styles.content}>
      <ProfileSidebar />
      <div className={styles.main}>
        <Favorites
          totalCards={favoriteCards.length}
          sortOrder="newest"
          hasMore={false}
          isLoading={loading}
          favoriteCards={favoriteCards}
          onSkillDetailsClick={handleSkillDetailsClick}
        />
      </div>
    </div>
  );
}
