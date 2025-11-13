import { useMemo } from 'react';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard';
import { SkillCard } from '@/widgets/Cards/SkillCard';
import { CardSectionUI } from '@shared/ui/CardSection';
import { InfiniteGridUI } from '@shared/ui/InfiniteGrid';
import { TitleUI } from '@shared/ui/Title';
import { PreloaderUI } from '@shared/ui/Preloader';
import { ActiveFilters } from '@/features/filters/ui/ActiveFilters';
import type { FilterChip } from '@/entities/filtered-content/model/types';
import styles from './HomeContent.module.scss';
import { SearchHeaderUI } from '@/shared/ui/SearchHeader/SearchHeaderUI';
import { showCardDetails } from '@/entities/sort/lib/cardUtils';
import { sortSkillCards } from '@/entities/sort/lib/sortUtils';

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
  popularCards?: SkillCardProps[];
  newCards?: SkillCardProps[];
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
  popularCards = [],
  newCards = [],
  onSkillDetailsClick,
}) => {
  // Подготавливаем карточки для обычного режима (всегда вызываем хуки)
  const preparedCards = useMemo(() => {
    return showCardDetails(cards, onSkillDetailsClick);
  }, [cards, onSkillDetailsClick]);

  const displayPopularCards = useMemo(() => {
    if (popularCards.length > 0) {
      return showCardDetails(popularCards, onSkillDetailsClick);
    }
    return preparedCards.slice(0, 3);
  }, [popularCards, preparedCards, onSkillDetailsClick]);

  const displayNewCards = useMemo(() => {
    if (newCards.length > 0) {
      return showCardDetails(newCards, onSkillDetailsClick);
    }
    return preparedCards.slice(3, 6);
  }, [newCards, preparedCards, onSkillDetailsClick]);

  const sortedCards = useMemo(() => {
    return sortSkillCards(preparedCards, sortOrder);
  }, [preparedCards, sortOrder]);

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
          <SearchHeaderUI
            title="Подходящие предложения"
            total={totalUsers}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />

          <InfiniteGridUI
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            loading={isLoading}
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap="24px"
            className={styles.grid}
          >
            {sortedCards.map((card) => (
              <SkillCard
                key={card.user.id}
                user={card.user}
                teachingSkills={card.teachingSkills}
                learningSkills={card.learningSkills}
                onDetailsClick={card.onDetailsClick}
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
          cards={displayPopularCards}
          onLookClick={onViewAllPopular}
          maxCards={3}
          showButton={true}
        />
      )}

      {/* Блок "Новое" */}
      {onViewAllNew && (
        <CardSectionUI
          title="Новое"
          cards={displayNewCards}
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
          {sortedCards.map((card) => (
            <SkillCard
              key={card.user.id}
              user={card.user}
              teachingSkills={card.teachingSkills}
              learningSkills={card.learningSkills}
              onDetailsClick={card.onDetailsClick}
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
