import { TitleUI } from '@/shared/ui/Title';
import type React from 'react';
import styles from './Favorites.module.scss';
import { Icon, InfiniteGridUI, TextUI } from '@/shared/ui';
import { SearchHeaderUI } from '@/shared/ui/SearchHeader';
import { SkillCard, type SkillCardProps } from '@/widgets/Cards/SkillCard';
import { useAppDispatch } from '@/shared/hooks/redux';
import { toggleSkillLikeByUserIdThunk } from '@/entities/user/model-v2';

export type FavoritesProps = {
  totalCards?: number;
  sortOrder?: 'newest' | 'oldest';
  hasMore?: boolean;
  isLoading?: boolean;
  favoriteCards: SkillCardProps[];
  onSortChange?: (order: 'newest' | 'oldest') => void;
  onLoadMore?: () => void;
  onSkillDetailsClick?: (skillId: string) => void;
};

export const Favorites: React.FC<FavoritesProps> = ({
  totalCards = 0,
  sortOrder = 'newest',
  hasMore,
  isLoading,
  favoriteCards,
  onSortChange,
  onLoadMore,
  onSkillDetailsClick,
}) => {
  const dispatch = useAppDispatch();

  const handleCardLike = (skillOwnerUserId: string) => {
    dispatch(
      toggleSkillLikeByUserIdThunk({
        currentUserId: 'current_user_id_placeholder',
        skillOwnerUserId,
      })
    );
  };

  const empty = favoriteCards.length === 0;

  return (
    <div className={styles.container}>
      <SearchHeaderUI
        title="Избранное"
        total={totalCards}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />

      {empty ? (
        <div className={styles.emptyState}>
          <TitleUI size="medium" className={styles.title}>
            Ваше избранное пока пустует
          </TitleUI>
          <button>
            <Icon name="sort" size={24} className={styles.sortIcon} />
          </button>
          <TextUI variant="caption" color="primary">
            Начните лайкать карточки участников — те, кто вас вдохновляет, с кем вы хотели бы
            обменяться навыками. Сюда попадут все профили, которые вы отметите лайком.
          </TextUI>
        </div>
      ) : (
        <InfiniteGridUI
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          loading={isLoading}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="24px"
        >
          {favoriteCards.map((card) => (
            <SkillCard
              key={card.user.id}
              user={card.user}
              teachingSkills={card.teachingSkills}
              learningSkills={card.learningSkills}
              onDetailsClick={
                onSkillDetailsClick ? () => onSkillDetailsClick(card.user.id) : card.onDetailsClick
              }
              onLikeClick={() => handleCardLike(card.user.id)}
              isLiked={true}
              likesCount={card.likesCount}
            />
          ))}
        </InfiniteGridUI>
      )}
    </div>
  );
};
