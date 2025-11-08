import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  getSearchQuery,
  getSkillsLoading,
  setSearchQuery,
  filterSkills,
  fetchSkills,
} from '@entities/skill/model';
import {
  fetchUsersWithSkillsThunk,
  selectSkillCards,
  selectUsersLoading,
} from '@/entities/user/model-v2';
import { setFilter } from '@/entities/filterSideBar/model/filterSideBarSlice';
import { useContentFiltering } from '@/entities/filtered-content';
import { ActiveFilters } from '@/features/filters';
import { Icon } from '@/shared/ui';
import { CardSectionUI } from '@shared/ui/CardSection';
import { InfiniteGridUI } from '@shared/ui/InfiniteGrid';
import { SkillCard } from '@widgets/Cards/SkillCard';
import type { SkillCardProps } from '@widgets/Cards/SkillCard/type';
import { TitleUI } from '@shared/ui/Title';
import { PreloaderUI } from '@shared/ui/Preloader';
import { FilterSideBar } from '@widgets/FilterSideBar/FilterSideBar';
import type { FilterPayload } from '@/entities/filterSideBar/model';
import { selectSkillsCatalog, selectDirectoriesLoading } from '@/entities/directory';
import styles from './HomePage.module.scss';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux селекторы
  const searchQuery = useAppSelector(getSearchQuery);
  const loading = useAppSelector(getSkillsLoading);
  const usersData = useAppSelector(selectSkillCards) as SkillCardProps[];
  const loadingUsers = useAppSelector(selectUsersLoading);

  // Справочники из Redux (загружаются централизованно в Provider)
  const skillsCatalog = useAppSelector(selectSkillsCatalog);
  const loadingCatalog = useAppSelector(selectDirectoriesLoading);

  // Локальное состояние для бесконечного скролла
  const [displayedRecommendedCount, setDisplayedRecommendedCount] = useState(9);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Состояние сортировки
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Режим поиска
  const searchFromUrl = searchParams.get('search') || '';

  // Функция очистки поискового параметра из URL
  const clearSearch = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);

    newParams.delete('search');

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Функция переключения сортировки
  const handleSortChange = useCallback((order: 'newest' | 'oldest') => {
    setSortOrder(order);
  }, []);

  const { filteredContent, activeFilters, removeFilter, hasActiveFilters } =
    useContentFiltering(searchFromUrl, { clearSearch, sortOrder, onSortChange: handleSortChange });

  const isFiltering = filteredContent.isSearchActive || filteredContent.isSidebarFilterActive;

  // Загрузка навыков и пользователей через Redux
  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (usersData.length === 0 && !loadingUsers) {
      dispatch(fetchUsersWithSkillsThunk());
    }
  }, [dispatch, usersData.length, loadingUsers]);

  // Синхронизация URL параметра поиска с Redux
  useEffect(() => {
    if (searchFromUrl !== searchQuery) {
      dispatch(setSearchQuery(searchFromUrl));
      dispatch(filterSkills());
    }
  }, [searchFromUrl, searchQuery, dispatch]);

  // Обработчик изменения фильтров
  const handleFiltersChange = useCallback(
    (filters: FilterPayload) => {
      console.log('Filters applied:', filters);
      dispatch(setFilter(filters));

      // TODO: применить фильтры к данным после готовности API
    },
    [dispatch]
  );

  // Обработчики для CardSection
  const handleViewAllPopular = useCallback(() => {
    navigate('/popular-skills');
  }, [navigate]);

  const handleViewAllNew = useCallback(() => {
    navigate('/new-skills');
  }, [navigate]);

  // Обработчик для бесконечного скролла
  const handleLoadMoreRecommended = useCallback(() => {
    if (displayedRecommendedCount >= usersData.length) {
      setHasMoreRecommended(false);
      return;
    }

    // Имитация загрузки
    setTimeout(() => {
      setDisplayedRecommendedCount((prev) => Math.min(prev + 9, usersData.length));
    }, 500);
  }, [displayedRecommendedCount, usersData.length]);

  // Данные для отображения
  const popularCards = usersData.slice(0, 3); // Первые 3
  const newCards = usersData.slice(3, 6); // Следующие 3
  const recommendedCards = usersData.slice(0, displayedRecommendedCount);

  // Показываем прелоадер пока загружаются данные
  const isLoading = loadingCatalog || loadingUsers;
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.preloaderContainer}>
          <PreloaderUI size="large" ariaLabel="Загрузка данных" />
        </div>
      </div>
    );
  }

  // Режим поиска - отображаем только результаты
  if (isFiltering) {
    return (
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {skillsCatalog && (
            <FilterSideBar skillsCatalog={skillsCatalog} onChange={handleFiltersChange} />
          )}
        </aside>
        <main className={styles.content}>
          {hasActiveFilters && <ActiveFilters filters={activeFilters} onRemove={removeFilter} />}
          <div className={styles.searchResults}>
            <div className={styles.searchHeader}>
              <TitleUI size="large" className={styles.searchTitle}>
                Подходящие предложения: {filteredContent.filteredCount}
              </TitleUI>
              <button
                type="button"
                className={styles.sortButton}
                onClick={() => handleSortChange(sortOrder === 'newest' ? 'oldest' : 'newest')}
                aria-label={sortOrder === 'newest' ? 'Сортировать сначала старые' : 'Сортировать сначала новые'}
              >
                <Icon name="sort" size={24} className={styles.sortIcon} />
                {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
              </button>
            </div>
            <InfiniteGridUI
              hasMore={false}
              loading={false}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="24px"
              className={styles.searchGrid}
            >
              {filteredContent.items.map((card: SkillCardProps) => (
                <SkillCard
                  key={card.user.id}
                  user={card.user}
                  teachingSkills={card.teachingSkills}
                  learningSkills={card.learningSkills}
                  onDetailsClick={card.onDetailsClick}
                  onLikeClick={card.onLikeClick}
                  isLiked={card.isLiked}
                />
              ))}
            </InfiniteGridUI>
          </div>
        </main>
      </div>
    );
  }

  // Обычный режим - отображаем все блоки
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        {skillsCatalog && (
          <FilterSideBar skillsCatalog={skillsCatalog} onChange={handleFiltersChange} />
        )}
      </aside>
      <main className={styles.content}>
        {/* Блок "Популярное" */}
        <CardSectionUI
          title="Популярное"
          cards={popularCards}
          onLookClick={handleViewAllPopular}
          maxCards={3}
          showButton={true}
        />

        {/* Блок "Новое" */}
        <CardSectionUI
          title="Новое"
          cards={newCards}
          onLookClick={handleViewAllNew}
          maxCards={3}
          showButton={true}
          className={styles.newSection}
        />

        {/* Блок "Рекомендуем" с бесконечным скроллом */}
        <section className={styles.recommendedSection}>
          <TitleUI size="large" className={styles.sectionTitle}>
            Рекомендуем
          </TitleUI>
          <InfiniteGridUI
            onLoadMore={handleLoadMoreRecommended}
            hasMore={hasMoreRecommended}
            loading={loading}
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap="24px"
          >
            {recommendedCards.map((card) => (
              <SkillCard
                key={card.user.id}
                user={card.user}
                teachingSkills={card.teachingSkills}
                learningSkills={card.learningSkills}
                onDetailsClick={card.onDetailsClick}
                onLikeClick={card.onLikeClick}
                isLiked={card.isLiked}
              />
            ))}
          </InfiniteGridUI>
        </section>
      </main>
    </div>
  );
}
