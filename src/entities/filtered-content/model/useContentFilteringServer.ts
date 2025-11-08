import { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@shared/hooks/redux';
import {
  selectSkillCards,
  selectUsersLoading,
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
  isFilteringInProgress: boolean;
  removeFilter: (chipId: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  loadMore: () => void;
  hasMore: boolean;
} {
  const dispatch = useAppDispatch();
  const usersData = useAppSelector(selectSkillCards) as SkillCardProps[];
  const loadingUsers = useAppSelector(selectUsersLoading);
  const currentFilters = useAppSelector(getSideBarFilters);
  const genders = useAppSelector(selectAllGenders);
  const cities = useAppSelector(selectAllCities);

  const normalizedSearchQuery = searchQuery.trim();
  const isSearchActive = normalizedSearchQuery.length > 0;

  // Состояние пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Состояние для показа лоадера при фильтрации
  const [isFilteringInProgress, setIsFilteringInProgress] = useState(false);

  // Ref для отслеживания последнего запроса
  const lastRequestRef = useRef<string>('');
  const isInitialMount = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Проверяем активность боковых фильтров
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

  // Debounce для запроса: показываем лоадер СРАЗУ, запрос задерживаем
  useEffect(() => {
    // Пропускаем первый рендер, если данные уже есть
    if (isInitialMount.current && usersData.length > 0) {
      isInitialMount.current = false;
      return;
    }

    isInitialMount.current = false;

    if (loadingUsers) {
      return;
    }

    const paramsChanged = apiParams.requestKey !== lastRequestRef.current;

    if (!paramsChanged) {
      return;
    }

    if (isSidebarFilterActive || isSearchActive) {
      setIsFilteringInProgress(true);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      lastRequestRef.current = apiParams.requestKey;

      if (apiParams.params) {
        dispatch(fetchUsersWithSkillsThunk(apiParams.params)).then((result) => {
          setIsFilteringInProgress(false);

          if (result.payload && typeof result.payload === 'object' && 'users' in result.payload) {
            const payload = result.payload as { users: unknown[] };

            setHasMore(payload.users.length === 9);
          }
        });
      } else {
        dispatch(fetchUsersWithSkillsThunk()).then(() => {
          setIsFilteringInProgress(false);
          setHasMore(false);
        });
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    dispatch,
    apiParams.requestKey,
    loadingUsers,
    usersData.length,
    isSidebarFilterActive,
    isSearchActive,
    apiParams.params,
  ]);

  // Функция для загрузки следующей страницы
  const loadMore = useCallback(() => {
    if (!loadingUsers && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loadingUsers, hasMore]);

  const filteredContent: FilteredContent = useMemo(
    () => ({
      items: usersData,
      totalCount: usersData.length,
      filteredCount: usersData.length,
      isSearchActive,
      isSidebarFilterActive,
      searchQuery: normalizedSearchQuery,
      sortOrder: config.sortOrder || 'newest',
    }),
    [usersData, isSearchActive, isSidebarFilterActive, normalizedSearchQuery, config.sortOrder]
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
    isFilteringInProgress,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
    loadMore,
    hasMore,
  };
}
