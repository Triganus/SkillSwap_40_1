import { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@shared/hooks/redux';
import {
  selectSkillCards,
  selectUsersLoading,
  selectUsersError,
  fetchUsersWithSkillsThunk,
} from '@/entities/user/model-v2';
import {
  getSideBarFilters,
  resetFilter,
  removeSkillFilter,
  removeCityFilter,
  removeGeneralFilter,
  removeGenderFilter,
} from '@/entities/filterSideBar/model/filterSideBarSlice';
import { setSearchQuery } from '@entities/skill/model';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import type { FilteredContent, FilterChip, FilterConfig } from './types';
import { selectAllGenders, selectAllCities } from '@/entities/directory/model/selectors';
import { GENERAL_RB_FILTER_OPTIONS } from '@/shared/lib/constants/GeneralRbFilter';
import { useSidebarFilter } from '@/shared/hooks/useSidebarFilter';

/**
 * Хук для фильтрации через API (серверная фильтрация с пагинацией)
 */
export function useContentFiltering(
  searchQuery: string = '',
  config: FilterConfig = {}
): {
  filteredContent: FilteredContent;
  activeFilters: FilterChip[];
  isLoading: boolean;
  removeFilter: (chipId: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  loadMore: () => void;
  hasMore: boolean;
} {
  const dispatch = useAppDispatch();
  const usersData = useAppSelector(selectSkillCards) as SkillCardProps[];
  const loadingUsers = useAppSelector(selectUsersLoading);
  const usersError = useAppSelector(selectUsersError);
  const currentFilters = useAppSelector(getSideBarFilters);
  const genders = useAppSelector(selectAllGenders);
  const cities = useAppSelector(selectAllCities);

  const normalizedSearchQuery = searchQuery.trim();
  const isSearchActive = normalizedSearchQuery.length > 0;

  // Проверяем активность боковых фильтров (объявляем до использования)
  const isSidebarFilterActive = useMemo(() => {
    return (
      !!currentFilters &&
      ((currentFilters.general && currentFilters.general !== '') ||
        (currentFilters.gender && currentFilters.gender !== '') ||
        !!currentFilters.skills?.skill_categories.some(
          (cat) => cat.skills && cat.skills.length > 0
        ) ||
        (currentFilters.cities && currentFilters.cities.length > 0))
    );
  }, [currentFilters]);

  // Хук для проверки соответствия боковым фильтрам
  const { matchesSidebar } = useSidebarFilter(currentFilters);

  // Состояние пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Ref для отслеживания последнего запроса и защиты от зацикливания
  const lastRequestRef = useRef<string>('');
  const isInitialMount = useRef(true);
  const isLoadingRef = useRef(false);
  const loadAttemptRef = useRef(0);

  // Отладочное логирование состояния данных
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[useContentFilteringServer] Data state:', {
        usersDataCount: usersData.length,
        loadingUsers,
        usersError,
        isSearchActive,
        searchQuery: normalizedSearchQuery,
        isSidebarFilterActive,
        currentFilters: {
          general: currentFilters?.general,
          hasSkills: currentFilters?.skills?.skill_categories?.some(
            (cat) => cat.skills && cat.skills.length > 0
          ),
          selectedSkillIds: currentFilters?.skills?.skill_categories?.flatMap((cat) =>
            cat.skills.map((s) => s.skill_id)
          ),
        },
      });
    }
  }, [
    usersData.length,
    loadingUsers,
    usersError,
    isSearchActive,
    normalizedSearchQuery,
    isSidebarFilterActive,
    currentFilters,
  ]);

  // Синхронизация loadingUsers с ref для предотвращения race conditions
  useEffect(() => {
    isLoadingRef.current = loadingUsers;
  }, [loadingUsers]);

  // Стабилизируем параметры через useMemo
  const apiParams = useMemo(() => {
    const subcategoryIds: string[] = [];

    currentFilters.skills?.skill_categories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        subcategoryIds.push(skill.skill_id);
      });
    });

    const gender =
      currentFilters.gender && currentFilters.gender !== ''
        ? (currentFilters.gender as 'male' | 'female')
        : undefined;

    const searchType =
      currentFilters.general && currentFilters.general !== ''
        ? (currentFilters.general as 'can_teach' | 'want_to_learn')
        : undefined;

    // Создаём уникальный ключ для запроса
    const baseRequestKey = JSON.stringify({
      q: normalizedSearchQuery || undefined,
      skills: subcategoryIds.length > 0 ? subcategoryIds.sort() : undefined,
      cities: currentFilters.cities.length > 0 ? [...currentFilters.cities].sort() : undefined,
      gender,
      sort: config.sortOrder || 'newest',
      type: searchType,
    });

    return {
      baseRequestKey,
      requestKey: `${baseRequestKey}_page_${currentPage}`, // Полный ключ с page
      params:
        isSearchActive || isSidebarFilterActive
          ? {
              searchQuery: normalizedSearchQuery || undefined,
              subcategoryIds: subcategoryIds.length > 0 ? subcategoryIds : undefined,
              cities: currentFilters.cities.length > 0 ? currentFilters.cities : undefined,
              gender,
              sortBy: config.sortOrder || 'newest',
              searchType,
              page: currentPage,
              limit: 9, // Запрашиваем только 9 карточек
              replace: currentPage === 1, // Заменяем данные только на первой странице
            }
          : null,
    };
  }, [
    normalizedSearchQuery,
    currentFilters,
    config.sortOrder,
    isSearchActive,
    isSidebarFilterActive,
    currentPage,
  ]);

  // Сбрасываем страницу при изменении базовых параметров фильтрации
  const prevBaseKeyRef = useRef<string>('');

  useEffect(() => {
    if (apiParams.baseRequestKey !== prevBaseKeyRef.current && prevBaseKeyRef.current !== '') {
      setCurrentPage(1);
      setHasMore(true);
    }

    prevBaseKeyRef.current = apiParams.baseRequestKey;
  }, [apiParams.baseRequestKey]);

  // Выполняем запрос при изменении параметров
  useEffect(() => {
    // Пропускаем первый рендер только если данные уже есть и мы в режиме фильтрации
    if (
      isInitialMount.current &&
      usersData.length > 0 &&
      (isSearchActive || isSidebarFilterActive)
    ) {
      isInitialMount.current = false;

      return;
    }

    isInitialMount.current = false;

    const paramsChanged = apiParams.requestKey !== lastRequestRef.current;

    if (!paramsChanged) {
      return;
    }

    // Защита от зацикливания - ограничиваем количество попыток
    if (loadAttemptRef.current > 3 && usersError) {
      console.error('Too many failed attempts, stopping requests');

      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    lastRequestRef.current = apiParams.requestKey;
    isLoadingRef.current = true;
    loadAttemptRef.current += 1;

    if (apiParams.params) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[useContentFilteringServer] Fetching users with params:', {
          params: apiParams.params,
          hasSearch: isSearchActive,
          hasFilters: isSidebarFilterActive,
        });
      }

      dispatch(fetchUsersWithSkillsThunk(apiParams.params))
        .unwrap()
        .then((result) => {
          if (result && typeof result === 'object' && 'users' in result) {
            const payload = result as { users: unknown[] };

            if (process.env.NODE_ENV === 'development') {
              console.log('[useContentFilteringServer] Users fetched:', {
                count: payload.users.length,
                hasMore: payload.users.length === 9,
              });
            }

            setHasMore(payload.users.length === 9);

            loadAttemptRef.current = 0;
          }
        })
        .catch((error) => {
          console.error('[useContentFilteringServer] Failed to fetch users:', error);

          setHasMore(false);
        })
        .finally(() => {
          isLoadingRef.current = false;
        });
    } else {
      dispatch(fetchUsersWithSkillsThunk())
        .unwrap()
        .then(() => {
          setHasMore(false);
          loadAttemptRef.current = 0;
        })
        .catch((error) => {
          console.error('Failed to fetch default users:', error);

          setHasMore(false);
        })
        .finally(() => {
          isLoadingRef.current = false;
        });
    }
  }, [
    dispatch,
    apiParams.requestKey,
    apiParams.params,
    usersData.length,
    usersError,
    isSearchActive,
    isSidebarFilterActive,
  ]);

  // Функция для загрузки следующей страницы
  const loadMore = useCallback(() => {
    if (!loadingUsers && !isLoadingRef.current && hasMore && !usersError) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loadingUsers, hasMore, usersError]);

  // Клиентская фильтрация результатов поиска
  // При активном фильтре "Могу научить" или "Хочу научиться" поиск должен учитывать только соответствующую категорию
  const searchFilteredData = useMemo(() => {
    if (!isSearchActive) {
      // Отладочное логирование для случая без поиска
      if (process.env.NODE_ENV === 'development' && isSidebarFilterActive) {
        const selectedSkillIds =
          currentFilters?.skills?.skill_categories?.flatMap((cat) =>
            cat.skills.map((s) => s.skill_id)
          ) || [];

        console.log('[useContentFilteringServer] No search, using usersData:', {
          usersDataCount: usersData.length,
          generalFilter: currentFilters?.general,
          hasSkills: currentFilters?.skills?.skill_categories?.some(
            (cat) => cat.skills && cat.skills.length > 0
          ),
          selectedSkillIds,
          sampleCard: usersData[0]
            ? {
                userId: usersData[0].user.id,
                userName: usersData[0].user.name,
                teachingSkillIds: usersData[0].teachingSkills.map((s) => String(s.id)),
                learningSkillIds: usersData[0].learningSkills.map((s) => String(s.id)),
                teachingSkills: usersData[0].teachingSkills.map((s) => ({
                  id: String(s.id),
                  title: s.title,
                })),
                learningSkills: usersData[0].learningSkills.map((s) => ({
                  id: String(s.id),
                  title: s.title,
                })),
              }
            : null,
        });
      }
      return usersData;
    }

    const generalFilter = currentFilters?.general;

    // Если активен фильтр "Могу научить", ищем навык только в teachingSkills
    if (generalFilter === 'can_teach') {
      return usersData.filter((card) => {
        return card.teachingSkills.some((skill) =>
          skill.title.toLowerCase().includes(normalizedSearchQuery.toLowerCase())
        );
      });
    }

    // Если активен фильтр "Хочу научиться", ищем навык только в learningSkills
    if (generalFilter === 'want_to_learn') {
      return usersData.filter((card) => {
        return card.learningSkills.some((skill) =>
          skill.title.toLowerCase().includes(normalizedSearchQuery.toLowerCase())
        );
      });
    }

    // Если фильтр "Всё" или нет фильтра, ищем везде
    return usersData.filter((card) => {
      return (
        card.user.name.toLowerCase().includes(normalizedSearchQuery.toLowerCase()) ||
        card.teachingSkills.some((skill) =>
          skill.title.toLowerCase().includes(normalizedSearchQuery.toLowerCase())
        ) ||
        card.learningSkills.some((skill) =>
          skill.title.toLowerCase().includes(normalizedSearchQuery.toLowerCase())
        )
      );
    });
  }, [usersData, isSearchActive, normalizedSearchQuery, currentFilters?.general]);

  // Применение боковых фильтров к данным после клиентской фильтрации поиска
  const sidebarFilteredData = useMemo(() => {
    // Применяем фильтрацию, если есть хотя бы один фильтр

    const hasAnyFilter =
      (currentFilters?.general && currentFilters.general !== '') ||
      (currentFilters?.skills?.skill_categories?.some(
        (cat) => cat.skills && cat.skills.length > 0
      ) ??
        false) ||
      (currentFilters?.gender && currentFilters.gender !== '') ||
      (currentFilters?.cities && currentFilters.cities.length > 0);

    if (!hasAnyFilter) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          '[useContentFilteringServer] No filters active, returning searchFilteredData:',
          {
            count: searchFilteredData.length,
          }
        );
      }
      return searchFilteredData;
    }

    // Детальное логирование перед фильтрацией
    if (process.env.NODE_ENV === 'development') {
      console.log('[useContentFilteringServer] Before filtering:', {
        inputCount: searchFilteredData.length,
        hasSearch: isSearchActive,
        generalFilter: currentFilters?.general,
        selectedSkillIds: currentFilters?.skills?.skill_categories?.flatMap((cat) =>
          cat.skills.map((s) => s.skill_id)
        ),
        sampleCard: searchFilteredData[0]
          ? {
              userId: searchFilteredData[0].user.id,
              userName: searchFilteredData[0].user.name,
              teachingSkills: searchFilteredData[0].teachingSkills.map((s) => ({
                id: String(s.id),
                title: s.title,
              })),
              learningSkills: searchFilteredData[0].learningSkills.map((s) => ({
                id: String(s.id),
                title: s.title,
              })),
            }
          : null,
      });
    }

    const filtered = searchFilteredData.filter(matchesSidebar);

    // Отладочное логирование после фильтрации
    if (process.env.NODE_ENV === 'development') {
      console.log('[useContentFilteringServer] After filtering:', {
        inputCount: searchFilteredData.length,
        outputCount: filtered.length,
        hasSearch: isSearchActive,
        generalFilter: currentFilters?.general,
        hasSkills: currentFilters?.skills?.skill_categories?.some(
          (cat) => cat.skills && cat.skills.length > 0
        ),
        selectedSkillIds: currentFilters?.skills?.skill_categories?.flatMap((cat) =>
          cat.skills.map((s) => s.skill_id)
        ),
        filteredCards: filtered.slice(0, 3).map((card) => ({
          userId: card.user.id,
          userName: card.user.name,
          teachingSkills: card.teachingSkills.map((s) => ({ id: String(s.id), title: s.title })),
          learningSkills: card.learningSkills.map((s) => ({ id: String(s.id), title: s.title })),
        })),
      });
    }

    return filtered;
  }, [searchFilteredData, currentFilters, matchesSidebar, isSearchActive]);

  // Сортировка отфильтрованных данных
  const sortedData = useMemo(() => {
    const sorted = [...sidebarFilteredData];
    const sortOrder = config.sortOrder || 'newest';

    sorted.sort((a, b) => {
      const dateA = new Date(a.user.createdAt).getTime();
      const dateB = new Date(b.user.createdAt).getTime();

      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return sorted;
  }, [sidebarFilteredData, config.sortOrder]);

  const filteredContent: FilteredContent = useMemo(
    () => ({
      items: sortedData,
      totalCount: sortedData.length,
      filteredCount: sortedData.length,
      isSearchActive,
      isSidebarFilterActive,
      searchQuery: normalizedSearchQuery,
      sortOrder: config.sortOrder || 'newest',
    }),
    [sortedData, isSearchActive, isSidebarFilterActive, normalizedSearchQuery, config.sortOrder]
  );

  // Генерация чипсов активных фильтров
  const activeFilters = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = [];

    if (isSearchActive) {
      chips.push({
        id: 'search',
        label: `Поиск: "${normalizedSearchQuery}"`,
        type: 'search',
      });
    }

    if (currentFilters.general && currentFilters.general !== '') {
      const generalOption = GENERAL_RB_FILTER_OPTIONS.find(
        (opt) => opt.value === currentFilters.general
      );

      if (generalOption) {
        chips.push({
          id: 'general',
          label: generalOption.label,
          type: 'general',
        });
      }
    }

    if (currentFilters.gender && currentFilters.gender !== '') {
      const genderItem = genders.find((g) => g.id === currentFilters.gender);

      if (genderItem) {
        chips.push({
          id: 'gender',
          label: `Пол: ${genderItem.name}`,
          type: 'gender',
        });
      }
    }

    if (currentFilters.skills) {
      currentFilters.skills.skill_categories.forEach((cat) => {
        cat.skills.forEach((skill) => {
          const categoryKey = cat.categoryId || cat.category;

          chips.push({
            id: `skill-${categoryKey}-${skill.skill_id}`,
            label: skill.skill_name,
            type: 'skill',
            removePayload: { category: categoryKey, skillId: skill.skill_id },
          });
        });
      });
    }

    if (currentFilters.cities && currentFilters.cities.length > 0) {
      currentFilters.cities.forEach((cityId) => {
        const city = cities.find((c) => c.id === cityId);
        const cityName = city ? city.name : cityId;

        chips.push({
          id: `city-${cityId}`,
          label: cityName,
          type: 'city',
          removePayload: { city: cityId },
        });
      });
    }

    return chips;
  }, [isSearchActive, normalizedSearchQuery, currentFilters, genders, cities]);

  const removeFilter = useCallback(
    (chipId: string) => {
      if (chipId === 'search') {
        dispatch(setSearchQuery(''));

        config.clearSearch?.();

        return;
      }

      if (chipId === 'general') {
        dispatch(removeGeneralFilter());

        return;
      }

      if (chipId === 'gender') {
        dispatch(removeGenderFilter());

        return;
      }

      if (chipId.startsWith('skill-')) {
        const parts = chipId.split('-');

        if (parts.length >= 3) {
          const categoryName = parts.slice(1, -1).join('-');
          const skillId = parts[parts.length - 1];

          dispatch(removeSkillFilter({ category: categoryName, skillId }));
        }
        return;
      }

      if (chipId.startsWith('city-')) {
        const city = chipId.replace('city-', '');

        dispatch(removeCityFilter(city));

        return;
      }
    },
    [dispatch, config]
  );

  const clearAllFilters = useCallback(() => {
    dispatch(resetFilter());
    dispatch(setSearchQuery(''));
    config.clearSearch?.();
  }, [dispatch, config]);

  const hasActiveFilters = activeFilters.length > 0;

  return {
    filteredContent,
    activeFilters,
    isLoading: loadingUsers,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
    loadMore,
    hasMore,
  };
}
