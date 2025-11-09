import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import {
  getSearchQuery,
  setSearchQuery,
  filterSkills,
  fetchSkills,
} from '@entities/skill/model';
import {
  selectSkillCards,
  selectUsersLoading,
  selectUsersTotal,
  fetchRecommendedUsersThunk,
  fetchUsersWithSkillsThunk,
} from '@/entities/user/model-v2';
import { setFilter } from '@/entities/filterSideBar/model/filterSideBarSlice';
import { useContentFiltering } from '@/entities/filtered-content';
import { HomeContent } from './HomeContent';
import type { SkillCardProps } from '@widgets/Cards/SkillCard/type';
import { FilterSideBar } from '@widgets/FilterSideBar/FilterSideBar';
import type { FilterPayload } from '@/entities/filterSideBar/model';
import { selectSkillsCatalog } from '@/entities/directory';
import styles from './HomePage.module.scss';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux селекторы
  const searchQuery = useAppSelector(getSearchQuery);
  const usersData = useAppSelector(selectSkillCards) as SkillCardProps[];
  const loadingUsers = useAppSelector(selectUsersLoading);
  const totalUsers = useAppSelector(selectUsersTotal);

  // Справочники из Redux (загружаются централизованно в Provider)
  const skillsCatalog = useAppSelector(selectSkillsCatalog);

  // Локальное состояние для бесконечного скролла рекомендованных
  const [currentRecommendedPage, setCurrentRecommendedPage] = useState(1);
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

  const {
    filteredContent,
    activeFilters,
    removeFilter,
    hasActiveFilters,
    loadMore,
    hasMore,
  } = useContentFiltering(searchFromUrl, {
    clearSearch,
    sortOrder,
    onSortChange: handleSortChange,
  });

  const isFiltering = filteredContent.isSearchActive || filteredContent.isSidebarFilterActive;

  // Отслеживаем предыдущее состояние фильтрации
  const prevIsFilteringRef = useRef(isFiltering);

  // Загрузка навыков для справочника
  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  // Загрузка данных по умолчанию при первом монтировании (популярные + новые + рекомендованные)
  useEffect(() => {
    if (!isFiltering && usersData.length === 0 && !loadingUsers) {
      dispatch(fetchUsersWithSkillsThunk());
    }
  }, [dispatch, isFiltering, usersData.length, loadingUsers]);

  // Отслеживаем переход из режима фильтрации в обычный режим
  useEffect(() => {
    const wasFiltering = prevIsFilteringRef.current;

    // Если были в фильтрации и вышли из неё - загружаем данные по умолчанию
    if (wasFiltering && !isFiltering && !loadingUsers) {
      dispatch(fetchUsersWithSkillsThunk());
      setCurrentRecommendedPage(1);
      setHasMoreRecommended(true);
    }

    prevIsFilteringRef.current = isFiltering;
  }, [dispatch, isFiltering, loadingUsers]);

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

  // Режим поиска - отображаем только результаты
  if (isFiltering) {
    return (
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {skillsCatalog && (
            <FilterSideBar skillsCatalog={skillsCatalog} onChange={handleFiltersChange} />
          )}
        </aside>
        <section className={styles.content}>
          <HomeContent
            cards={filteredContent.items}
            isLoading={loadingUsers}
            hasMore={hasMore}
            onLoadMore={loadMore}
            isFiltering={true}
            totalUsers={totalUsers}
            sortOrder={sortOrder}
            activeFilters={activeFilters}
            hasActiveFilters={hasActiveFilters}
            onSortChange={handleSortChange}
            onRemoveFilter={removeFilter}
          />
        </section>
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
      <section className={styles.content}>
        <HomeContent
          cards={usersData}
          isLoading={loadingUsers}
          hasMore={hasMoreRecommended}
          onLoadMore={handleLoadMoreRecommended}
          onViewAllPopular={handleViewAllPopular}
          onViewAllNew={handleViewAllNew}
        />
      </section>
    </div>
  );
}
