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
  const currentFilters = useAppSelector(getSideBarFilters);

  const normalizedSearchQuery = searchQuery.trim();
  const isSearchActive = normalizedSearchQuery.length > 0;

  // Состояние пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Ref для отслеживания последнего запроса
  const lastRequestRef = useRef<string>('');
  const isInitialMount = useRef(true);

  // Проверяем активность боковых фильтров
  const isSidebarFilterActive = useMemo(() => {
    return (
      !!currentFilters &&
      ((currentFilters.general && currentFilters.general !== 'Всё') ||
        (currentFilters.gender &&
          ['мужской', 'женский'].includes(currentFilters.gender.toLowerCase())) ||
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
        subcategoryIds.push(skill.skill_name);
      });
    });

    const gender =
      currentFilters.gender?.toLowerCase() === 'мужской'
        ? 'male'
        : currentFilters.gender?.toLowerCase() === 'женский'
          ? 'female'
          : undefined;

    const searchType =
      currentFilters.general === 'Могу научить'
        ? 'can_teach'
        : currentFilters.general === 'Хочу научиться'
          ? 'want_to_learn'
          : 'all';

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
              searchType: searchType as 'all' | 'want_to_learn' | 'can_teach',
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

  // Вызываем API только при реальном изменении параметров
  useEffect(() => {
    // Пропускаем первый рендер, если данные уже есть
    if (isInitialMount.current && usersData.length > 0) {
      isInitialMount.current = false;

      return;
    }

    isInitialMount.current = false;

    if (apiParams.requestKey === lastRequestRef.current) {
      return;
    }

    if (loadingUsers) {
      return;
    }

    lastRequestRef.current = apiParams.requestKey;

    // Вызываем API
    if (apiParams.params) {
      dispatch(fetchUsersWithSkillsThunk(apiParams.params)).then((result) => {
        // Проверяем есть ли ещё данные (если вернулось меньше 9, значит это последняя страница)
        if (result.payload && typeof result.payload === 'object' && 'users' in result.payload) {
          const payload = result.payload as { users: unknown[] };

          setHasMore(payload.users.length === 9);
        }
      });
    } else {
      dispatch(fetchUsersWithSkillsThunk()).then(() => {
        setHasMore(false); // Данные по умолчанию не пагинируются
      });
    }
  }, [dispatch, apiParams, loadingUsers, usersData.length]);

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

    if (currentFilters.general && currentFilters.general !== 'Всё') {
      chips.push({
        id: 'general',
        label: currentFilters.general,
        type: 'general',
      });
    }

    if (
      currentFilters.gender &&
      ['мужской', 'женский'].includes(currentFilters.gender.toLowerCase())
    ) {
      chips.push({
        id: 'gender',
        label: `Пол: ${currentFilters.gender}`,
        type: 'gender',
      });
    }

    if (currentFilters.skills) {
      currentFilters.skills.skill_categories.forEach((cat) => {
        cat.skills.forEach((skill) => {
          chips.push({
            id: `skill-${cat.category}-${skill.skill_id}`,
            label: skill.skill_name,
            type: 'skill',
            removePayload: { category: cat.category, skillId: skill.skill_id },
          });
        });
      });
    }

    if (currentFilters.cities && currentFilters.cities.length > 0) {
      currentFilters.cities.forEach((city) => {
        chips.push({
          id: `city-${city}`,
          label: city,
          type: 'city',
          removePayload: { city },
        });
      });
    }

    return chips;
  }, [isSearchActive, normalizedSearchQuery, currentFilters]);

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
