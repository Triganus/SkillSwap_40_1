import { TitleUI } from '@/shared/ui/Title';
import type React from 'react';
import styles from './Favorites.module.scss';
import { Button, InfiniteGridUI, TextUI } from '@/shared/ui';
import { SearchHeaderUI } from '@/shared/ui/SearchHeader';
import { SkillCard, type SkillCardProps } from '@/widgets/Cards/SkillCard';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { toggleSkillLikeByUserIdThunk } from '@/entities/user/model-v2';
import { useAuthV2 } from '@/app/Provider';
import { setSortOrder } from '@/entities/sort/model/sortSlice';
import { selectSortOrder } from '@/entities/sort/model/selector';
import { useMemo } from 'react';
import { sortSkillCards } from '@/entities/sort/lib/sortUtils';
import { showCardDetails } from '@/entities/sort/lib/cardUtils';
import { Link } from 'react-router-dom';

export type FavoritesProps = {
  totalCards?: number;
  hasMore?: boolean;
  isLoading?: boolean;
  favoriteCards: SkillCardProps[];
  onLoadMore?: () => void;
  onSkillDetailsClick?: (skillId: string) => void;
};

export const Favorites: React.FC<FavoritesProps> = ({
  totalCards = 0,
  hasMore,
  isLoading,
  favoriteCards,
  onLoadMore,
  onSkillDetailsClick,
}) => {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuthV2();

  const activeSortOrder = useAppSelector(selectSortOrder);

  const handleSortChange = (newOrder: 'newest' | 'oldest') => {
    dispatch(setSortOrder(newOrder));
  };

  const showFavoriteCards = useMemo(() => {
    return showCardDetails(favoriteCards, onSkillDetailsClick);
  }, [favoriteCards, onSkillDetailsClick]);

  const sortFavoriteCards = useMemo(() => {
    return sortSkillCards(showFavoriteCards, activeSortOrder);
  }, [showFavoriteCards, activeSortOrder]);

  const handleCardLike = (skillOwnerUserId: string, primarySkillId?: string) => {
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }
    dispatch(
      toggleSkillLikeByUserIdThunk({
        currentUserId: currentUser.id,
        skillOwnerUserId,
      })
    )
      .unwrap()
      .then((result) => {
        // Обновляем localStorage после успешного переключения лайка
        const skillId = result.skillId || primarySkillId;
        if (!skillId) {
          return;
        }

        const likesKey = `likes_${skillId}_${skillOwnerUserId}`;
        try {
          const likesData = JSON.parse(
            localStorage.getItem(likesKey) || '{"count":0,"users":[]}'
          ) as { count: number; users: string[] };

          likesData.count = result.likesCount;

          if (result.liked) {
            if (!likesData.users.includes(currentUser.id)) {
              likesData.users.push(currentUser.id);
            }
          } else {
            likesData.users = likesData.users.filter((id) => id !== currentUser.id);
          }

          localStorage.setItem(likesKey, JSON.stringify(likesData));
        } catch (error) {
          console.warn('[Favorites] Failed to persist likes to localStorage', error);
        }
      })
      .catch((error) => {
        console.error('[Favorites] Failed to toggle like:', error);
      });
  };

  const empty = favoriteCards.length === 0;

  return (
    <div className={styles.container}>
      <SearchHeaderUI
        title="Избранное"
        total={totalCards}
        sortOrder={activeSortOrder}
        onSortChange={handleSortChange}
      />

      {empty ? (
        <div className={styles.emptyState}>
          <TitleUI size="medium" className={styles.title}>
            Ваше избранное пока пустует
          </TitleUI>
          <TextUI variant="caption" color="primary">
            Начните лайкать карточки участников — те, кто вас вдохновляет, с кем вы хотели бы
            обменяться навыками. Сюда попадут все профили, которые вы отметите лайком.
          </TextUI>
          <Link to="/">
            <Button variant="primary">Вернуться в католог</Button>
          </Link>
        </div>
      ) : (
        <InfiniteGridUI
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          loading={isLoading}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="24px"
        >
          {sortFavoriteCards.map((card) => {
            // Получаем primarySkillId из первой teaching skill или learning skill
            const primarySkillId =
              card.teachingSkills[0]?.id || card.learningSkills[0]?.id || undefined;

            return (
              <SkillCard
                key={card.user.id}
                user={card.user}
                teachingSkills={card.teachingSkills}
                learningSkills={card.learningSkills}
                onDetailsClick={card.onDetailsClick}
                onLikeClick={() => handleCardLike(card.user.id, primarySkillId)}
                isLiked={card.isLiked}
                likesCount={card.likesCount}
              />
            );
          })}
        </InfiniteGridUI>
      )}
    </div>
  );
};
