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
  selectSkillCards,
  selectUsersLoading,
  selectUsersTotal,
  fetchRecommendedUsersThunk,
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
  const totalUsers = useAppSelector(selectUsersTotal);

  // Справочники из Redux (загружаются централизованно в Provider)
  const skillsCatalog = useAppSelector(selectSkillsCatalog);
  const loadingCatalog = useAppSelector(selectDirectoriesLoading);

  // Локальное состояние для бесконечного скролла рекомендованных
  const [currentRecommendedPage, setCurrentRecommendedPage] = useState(1);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Состояние сортировки
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Состояние для показа лоадера при переходе из режима фильтрации в обычный
  const [isLoadingDefaultData, setIsLoadingDefaultData] = useState(false);

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

  const {
    filteredContent,
    activeFilters,
    removeFilter,
    hasActiveFilters,
    loadMore,
    hasMore,
    isFilteringInProgress
  } = useContentFiltering(searchFromUrl, { clearSearch, sortOrder, onSortChange: handleSortChange });

  const isFiltering = filteredContent.isSearchActive || filteredContent.isSidebarFilterActive;

  // Загрузка навыков для справочника
  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  // Загрузка рекомендованных при первом монтировании или при выходе из фильтрации
  useEffect(() => {
    if (!isFiltering && usersData.length === 0 && !loadingUsers) {
      setIsLoadingDefaultData(true);

      dispatch(fetchRecommendedUsersThunk({ page: 1, limit: 9, replace: true })).then(() => {
        setTimeout(() => {
          setIsLoadingDefaultData(false);
        }, 200);
      });
    }
  }, [dispatch, isFiltering, usersData.length, loadingUsers]);

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

  // Обработчик для бесконечного скролла рекомендованных
  const handleLoadMoreRecommended = useCallback(() => {
    if (!hasMoreRecommended || loadingUsers) {
      return;
    }

    const nextPage = currentRecommendedPage + 1;

    dispatch(
      fetchRecommendedUsersThunk({
        page: nextPage,
        limit: 9,
        replace: false,
      })
    ).then((result) => {
      if (result.payload && typeof result.payload === 'object' && 'hasMore' in result.payload) {
        const payload = result.payload as { hasMore: boolean };

        setHasMoreRecommended(payload.hasMore);

        if (payload.hasMore) {
          setCurrentRecommendedPage(nextPage);
        }
      }
    });
  }, [dispatch, currentRecommendedPage, hasMoreRecommended, loadingUsers]);

  // Данные для отображения
  const popularCards = usersData.slice(0, 3); // Первые 3
  const newCards = usersData.slice(3, 6); // Следующие 3
  const recommendedCards = usersData; // Все загруженные (накапливаются)

  // Показываем прелоадер только при первоначальной загрузке (когда нет данных)
  const isInitialLoading = (loadingCatalog || loadingUsers) && usersData.length === 0;

  if (isInitialLoading) {
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
          {isFilteringInProgress ? (
            <div className={styles.preloaderContainer}>
              <PreloaderUI size="large" ariaLabel="Загрузка результатов" />
            </div>
          ) : (
            <>
              {hasActiveFilters && <ActiveFilters filters={activeFilters} onRemove={removeFilter} />}
              <div className={styles.searchResults}>
                <div className={styles.searchHeader}>
                  <TitleUI size="large" className={styles.searchTitle}>
                    Подходящие предложения: {totalUsers}
                  </TitleUI>
                  <button
                    type="button"
                    className={styles.sortButton}
                    onClick={() => handleSortChange(sortOrder === 'newest' ? 'oldest' : 'newest')}
                    aria-label={
                      sortOrder === 'newest'
                        ? 'Сортировать сначала старые'
                        : 'Сортировать сначала новые'
                    }
                  >
                    <Icon name="sort" size={24} className={styles.sortIcon} />
                    {sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}
                  </button>
                </div>
                <InfiniteGridUI
                  onLoadMore={loadMore}
                  hasMore={hasMore}
                  loading={loadingUsers}
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
            </>
          )}
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
        {isLoadingDefaultData ? (
          <div className={styles.preloaderContainer}>
            <PreloaderUI size="large" ariaLabel="Загрузка рекомендаций" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
