import { useCallback, useMemo } from 'react';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard';
import { SkillCard } from '@/widgets/Cards/SkillCard';
import { CardSectionUI } from '@shared/ui/CardSection';
import { InfiniteGridUI } from '@shared/ui/InfiniteGrid';
import { TitleUI } from '@shared/ui/Title';
import { PreloaderUI } from '@shared/ui/Preloader';
import { ActiveFilters } from '@/features/filters/ui/ActiveFilters';
import { Icon } from '@/shared/ui/Icon';
import type { FilterChip } from '@/entities/filtered-content/model/types';
import styles from './HomeContent.module.scss';

interface HomeContentProps {
  cards: SkillCardProps[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  // Режим фильтрации
  isFiltering?: boolean;
  totalUsers?: number;
  sortOrder?: 'newest' | 'oldest';
  activeFilters?: FilterChip[];
  hasActiveFilters?: boolean;
  onSortChange?: (order: 'newest' | 'oldest') => void;
  onRemoveFilter?: (chipId: string) => void;
  // Обычный режим
  onViewAllPopular?: () => void;
  onViewAllNew?: () => void;
  // Навигация на страницу навыка
  onSkillDetailsClick?: (skillId: string) => void;
}

export const HomeContent: React.FC<HomeContentProps> = ({
  cards,
  isLoading,
  hasMore,
  onLoadMore,
  isFiltering = false,
  totalUsers = 0,
  sortOrder = 'newest',
  activeFilters = [],
  hasActiveFilters = false,
  onSortChange,
  onRemoveFilter,
  onViewAllPopular,
  onViewAllNew,
  onSkillDetailsClick,
}) => {
  const handleSortClick = useCallback(() => {
    if (onSortChange) {
      onSortChange(sortOrder === 'newest' ? 'oldest' : 'newest');
    }
  }, [sortOrder, onSortChange]);

  // Подготавливаем карточки для обычного режима (всегда вызываем хуки)
  const popularCards = useMemo(() => {
    return cards.slice(0, 3).map((card) => ({
      ...card,
      onDetailsClick: onSkillDetailsClick
        ? () => onSkillDetailsClick(card.user.id)
        : card.onDetailsClick,
    }));
  }, [cards, onSkillDetailsClick]);

  const newCards = useMemo(() => {
    return cards.slice(3, 6).map((card) => ({
      ...card,
      onDetailsClick: onSkillDetailsClick
        ? () => onSkillDetailsClick(card.user.id)
        : card.onDetailsClick,
    }));
  }, [cards, onSkillDetailsClick]);

  // Показываем большой прелоадер только при первой загрузке (когда нет карточек)
  if (isLoading && cards.length === 0) {
    return (
      <div className={styles.preloaderContainer}>
        <PreloaderUI size="large" ariaLabel="Загрузка данных" />
      </div>
    );
  }

  // Режим фильтрации
  if (isFiltering) {
    return (
      <>
        {hasActiveFilters && onRemoveFilter && (
          <ActiveFilters filters={activeFilters} onRemove={onRemoveFilter} />
        )}
        <div className={styles.searchResults}>
          <div className={styles.searchHeader}>
            <TitleUI size="large" className={styles.searchTitle}>
              Подходящие предложения: {totalUsers}
            </TitleUI>
            {onSortChange && (
              <button
                type="button"
                className={styles.sortButton}
                onClick={handleSortClick}
                aria-label={
                  sortOrder === 'newest'
                    ? 'Сортировать сначала старые'
                    : 'Сортировать сначала новые'
                }
              >
                <Icon name="sort" size={24} className={styles.sortIcon} />
                {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
              </button>
            )}
          </div>
          <InfiniteGridUI
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            loading={isLoading}
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap="24px"
            className={styles.grid}
          >
            {cards.map((card) => (
              <SkillCard
                key={card.user.id}
                user={card.user}
                teachingSkills={card.teachingSkills}
                learningSkills={card.learningSkills}
                onDetailsClick={
                  onSkillDetailsClick
                    ? () => onSkillDetailsClick(card.user.id)
                    : card.onDetailsClick
                }
                onLikeClick={card.onLikeClick}
                isLiked={card.isLiked}
                likesCount={card.likesCount}
              />
            ))}
          </InfiniteGridUI>
        </div>
      </>
    );
  }

  // Обычный режим
  return (
    <>
      {/* Блок "Популярное" */}
      {onViewAllPopular && (
        <CardSectionUI
          title="Популярное"
          cards={popularCards}
          onLookClick={onViewAllPopular}
          maxCards={3}
          showButton={true}
        />
      )}

      {/* Блок "Новое" */}
      {onViewAllNew && (
        <CardSectionUI
          title="Новое"
          cards={newCards}
          onLookClick={onViewAllNew}
          maxCards={3}
          showButton={true}
          className={styles.newSection}
        />
      )}

      {/* Блок "Рекомендуем" с бесконечным скроллом */}
      <section className={styles.recommendedSection}>
        <TitleUI size="large" className={styles.sectionTitle}>
          Рекомендуем
        </TitleUI>
        <InfiniteGridUI
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          loading={isLoading}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="24px"
          className={styles.grid}
        >
          {cards.map((card) => (
            <SkillCard
              key={card.user.id}
              user={card.user}
              teachingSkills={card.teachingSkills}
              learningSkills={card.learningSkills}
              onDetailsClick={
                onSkillDetailsClick ? () => onSkillDetailsClick(card.user.id) : card.onDetailsClick
              }
              onLikeClick={card.onLikeClick}
              isLiked={card.isLiked}
              likesCount={card.likesCount}
            />
          ))}
        </InfiniteGridUI>
      </section>
    </>
  );
};
