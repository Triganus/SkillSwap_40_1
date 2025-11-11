import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { getSearchQuery, setSearchQuery, filterSkills, fetchSkills } from '@entities/skill/model';
import {
  selectSkillCards,
  selectUsersLoading,
  selectUsersTotal,
  selectUsersError,
  fetchRecommendedUsersThunk,
  fetchUsersWithSkillsThunk,
} from '@/entities/user/model-v2';
import { setFilter, getSideBarFilters } from '@/entities/filterSideBar/model/filterSideBarSlice';
import { useContentFiltering } from '@/entities/filtered-content';
import { HomeContent } from './HomeContent';
import type { SkillCardProps } from '@widgets/Cards/SkillCard/type';
import { FilterSideBar } from '@widgets/FilterSideBar/FilterSideBar';
import type { FilterPayload } from '@/entities/filterSideBar/model';
import { selectSkillsCatalog } from '@/entities/directory';
import { NotificationToastList } from '@/features/notifications/ui/NotificationToastList';
import { selectNewNotifications } from '@/features/notifications/model/selectors';
import { markNotificationViewed } from '@/features/notifications/model/notificationsSlice';
import type { INotification } from '@/entities/notification/model/types/types';
import { useAuthV2 } from '@app/Provider.tsx';
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
  const usersError = useAppSelector(selectUsersError);
  const currentFilters = useAppSelector(getSideBarFilters);

  // Справочники из Redux (загружаются централизованно в Provider)
  const skillsCatalog = useAppSelector(selectSkillsCatalog);
  const newNotifications = useAppSelector(selectNewNotifications);
  const { isAuthenticated } = useAuthV2();

  // Локальное состояние для бесконечного скролла рекомендованных
  const [currentRecommendedPage, setCurrentRecommendedPage] = useState(1);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Состояние сортировки
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Флаги для предотвращения зацикливания
  const initialLoadAttemptedRef = useRef(false);
  const isLoadingRef = useRef(false);

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

  const { filteredContent, activeFilters, removeFilter, hasActiveFilters, loadMore, hasMore } =
    useContentFiltering(searchFromUrl, {
      clearSearch,
      sortOrder,
      onSortChange: handleSortChange,
    });

  const isFiltering = filteredContent.isSearchActive || filteredContent.isSidebarFilterActive;

  // Отслеживаем предыдущее состояние фильтрации
  const prevIsFilteringRef = useRef(isFiltering);

  // Синхронизация loadingUsers с ref для предотвращения race conditions
  useEffect(() => {
    isLoadingRef.current = loadingUsers;
  }, [loadingUsers]);

  // Это позволяет загрузить данные при возвращении на страницу
  useEffect(() => {
    initialLoadAttemptedRef.current = false;
  }, []);

  // Загрузка навыков для справочника
  useEffect(() => {
    const loadSkills = async () => {
      try {
        await dispatch(fetchSkills()).unwrap();
      } catch (error) {
        console.error('Failed to load skills catalog:', error);
      }
    };

    loadSkills();
  }, [dispatch]);

  // Загрузка данных по умолчанию при первом монтировании (популярные + новые + рекомендованные)
  useEffect(() => {
    // Предотвращаем повторные попытки, если уже пытались загрузить или идет загрузка
    if (initialLoadAttemptedRef.current || isLoadingRef.current) {
      return;
    }

    // Не загружаем данные, если в режиме фильтрации
    if (isFiltering) {
      return;
    }

    const needsInitialLoad = usersData.length === 0 && !loadingUsers && !usersError;

    if (needsInitialLoad) {
      initialLoadAttemptedRef.current = true;
      isLoadingRef.current = true;

      dispatch(fetchUsersWithSkillsThunk())
        .unwrap()
        .catch((error) => {
          console.error('Failed to load initial users data:', error);

          setTimeout(() => {
            initialLoadAttemptedRef.current = false;
          }, 5000);
        })
        .finally(() => {
          isLoadingRef.current = false;
        });
    }
  }, [dispatch, isFiltering, usersData.length, loadingUsers, usersError]);

  // Отслеживаем переход из режима фильтрации в обычный режим
  useEffect(() => {
    const wasFiltering = prevIsFilteringRef.current;

    // Если были в фильтрации и вышли из неё - загружаем данные по умолчанию
    if (wasFiltering && !isFiltering && !loadingUsers && !isLoadingRef.current) {
      isLoadingRef.current = true;

      dispatch(fetchUsersWithSkillsThunk())
        .unwrap()
        .then(() => {
          setCurrentRecommendedPage(1);
          setHasMoreRecommended(true);
        })
        .catch((error) => {
          console.error('Failed to reload users after filtering:', error);
        })
        .finally(() => {
          isLoadingRef.current = false;
        });
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
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(currentFilters);

      if (filtersChanged) {
        console.log('Filters applied:', filters);

        dispatch(setFilter(filters));
      }

      // TODO: применить фильтры к данным после готовности API
    },
    [dispatch, currentFilters]
  );

  // Обработчики для CardSection
  const handleViewAllPopular = useCallback(() => {
    navigate('/popular-skills');
  }, [navigate]);

  const handleViewAllNew = useCallback(() => {
    navigate('/new-skills');
  }, [navigate]);

  // Обработчик клика на "Подробнее" - переход на страницу навыка
  const handleSkillDetailsClick = useCallback(
    (userId: string) => {
      navigate(`/skill/${userId}`);
    },
    [navigate]
  );

  // Обработчик для бесконечного скролла рекомендованных
  const handleLoadMoreRecommended = useCallback(() => {
    if (!hasMoreRecommended || loadingUsers || isLoadingRef.current) {
      return;
    }

    const nextPage = currentRecommendedPage + 1;
    isLoadingRef.current = true;

    dispatch(
      fetchRecommendedUsersThunk({
        page: nextPage,
        limit: 9,
        replace: false,
      })
    )
      .unwrap()
      .then((result) => {
        if (result && typeof result === 'object' && 'hasMore' in result) {
          const payload = result as { hasMore: boolean };

          setHasMoreRecommended(payload.hasMore);

          if (payload.hasMore) {
            setCurrentRecommendedPage(nextPage);
          }
        }
      })
      .catch((error) => {
        console.error('Failed to load more recommended users:', error);
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  }, [dispatch, currentRecommendedPage, hasMoreRecommended, loadingUsers]);

  const handleToastClick = useCallback(
    (notification: INotification) => {
      if (!notification.isViewed) {
        dispatch(markNotificationViewed(notification.id));
      }

      if (notification.link) {
        navigate(notification.link);
      }
    },
    [dispatch, navigate]
  );

  const handleToastDismiss = useCallback(
    (notification: INotification) => {
      if (!notification.isViewed) {
        dispatch(markNotificationViewed(notification.id));
      }
    },
    [dispatch]
  );

  const sidebarContent = (
    <div className={styles.sidebarInner}>
      {skillsCatalog && (
        <FilterSideBar skillsCatalog={skillsCatalog} onChange={handleFiltersChange} />
      )}

      {isAuthenticated && (
        <NotificationToastList
          className={styles.toastContainer}
          notifications={newNotifications}
          onNotificationClick={handleToastClick}
          onNotificationDismiss={handleToastDismiss}
        />
      )}
    </div>
  );

  // Режим поиска - отображаем только результаты
  if (isFiltering) {
    return (
      <div className={styles.container}>
        <aside className={styles.sidebar}>{sidebarContent}</aside>
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
            onSkillDetailsClick={handleSkillDetailsClick}
          />
        </section>
      </div>
    );
  }

  const shouldShowLoader =
    usersData.length === 0 && (loadingUsers || (!usersError && initialLoadAttemptedRef.current));

  // Обычный режим - отображаем все блоки
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>{sidebarContent}</aside>
      <section className={styles.content}>
        <HomeContent
          cards={usersData}
          isLoading={shouldShowLoader}
          hasMore={hasMoreRecommended}
          onLoadMore={handleLoadMoreRecommended}
          onViewAllPopular={handleViewAllPopular}
          onViewAllNew={handleViewAllNew}
          onSkillDetailsClick={handleSkillDetailsClick}
        />
      </section>
    </div>
  );
}
