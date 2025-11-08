import { useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@shared/hooks/redux';
import { selectSkillCards, selectUsersLoading } from '@/entities/user/model-v2';
import {
  getSideBarFilters,
  resetFilter,
  removeSkillFilter,
  removeCityFilter,
  removeGeneralFilter,
  removeGenderFilter,
} from '@/entities/filterSideBar/model/filterSideBarSlice';
import { setSearchQuery } from '@entities/skill/model';
import { selectSkillsCatalog } from '@/entities/directory';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import type { FilteredContent, FilterChip, FilterConfig } from './types';
import { useSidebarFilter } from '@/shared/hooks/useSidebarFilter';

/**
 * Хук для фильтрации, поиска и сортировки контента
 * @param searchQuery - строка поиска из URL или состояния
 * @param config - дополнительная конфигурация фильтрации
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
} {
  // Получаем данные из Redux
  const dispatch = useAppDispatch();
  const usersData = useAppSelector(selectSkillCards) as SkillCardProps[];
  const loadingUsers = useAppSelector(selectUsersLoading);
  const currentFilters = useAppSelector(getSideBarFilters);
  const skillsCatalog = useAppSelector(selectSkillsCatalog);

  // Хук для проверки соответствия боковым фильтрам
  const { matchesSidebar } = useSidebarFilter(currentFilters);

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

  // Нормализованная строка поиска
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const isSearchActive = normalizedSearchQuery.length > 0;

  // Фильтрация по поиску
  const searchFilteredData = useMemo(() => {
    if (!isSearchActive) return usersData;

    return usersData.filter(
      (card) =>
        card.user.name.toLowerCase().includes(normalizedSearchQuery) ||
        card.teachingSkills.some((skill) =>
          skill.title.toLowerCase().includes(normalizedSearchQuery)
        ) ||
        card.learningSkills.some((skill) =>
          skill.title.toLowerCase().includes(normalizedSearchQuery)
        )
    );
  }, [usersData, normalizedSearchQuery, isSearchActive]);

  // Применение боковых фильтров
  const finalFilteredData = useMemo(() => {
    if (!isSidebarFilterActive) return searchFilteredData;
    return searchFilteredData.filter(matchesSidebar);
  }, [searchFilteredData, isSidebarFilterActive, matchesSidebar]);

  // Сортировка (если требуется)
  const sortedData = useMemo(() => {
    if (!config.sortBy) return finalFilteredData;

    const sorted = [...finalFilteredData];

    // Здесь можно добавить различные типы сортировки
    // Пока оставляем базовую реализацию
    switch (config.sortBy) {
      case 'popular':
      case 'new':
      case 'recommended':
      case 'relevance':
      default:
        return sorted;
    }
  }, [finalFilteredData, config.sortBy]);

  // Применение лимита (если требуется)
  const limitedData = useMemo(() => {
    if (!config.limit) return sortedData;

    return sortedData.slice(0, config.limit);
  }, [sortedData, config.limit]);

  // Формирование результата
  const filteredContent: FilteredContent = useMemo(
    () => ({
      items: limitedData,
      totalCount: usersData.length,
      filteredCount: limitedData.length,
      isSearchActive,
      isSidebarFilterActive,
      searchQuery: normalizedSearchQuery,
    }),
    [limitedData, usersData.length, isSearchActive, isSidebarFilterActive, normalizedSearchQuery]
  );

  // Генерация чипсов активных фильтров
  const activeFilters = useMemo(() => {
    const chips: FilterChip[] = [];

    // Чипс для поиска
    if (isSearchActive) {
      chips.push({
        id: 'search',
        label: `Поиск: "${searchQuery}"`,
        type: 'search',
      });
    }

    // Чипс для общего фильтра
    if (currentFilters.general && currentFilters.general !== 'Всё') {
      chips.push({
        id: 'general',
        label: currentFilters.general,
        type: 'general',
      });
    }

    // Чипс для гендера
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

    // Чипсы для навыков
    if (currentFilters.skills?.skill_categories && skillsCatalog) {
      currentFilters.skills.skill_categories.forEach((selectedCategory) => {
        // Находим полную информацию о категории из каталога
        const fullCategory = skillsCatalog.skill_categories.find(
          (cat) => cat.category === selectedCategory.category
        );

        if (!fullCategory) return;

        const totalSkillsInCategory = fullCategory.skills.length;
        const selectedSkillsCount = selectedCategory.skills.length;

        // Если выбраны все навыки категории - показываем только категорию
        if (totalSkillsInCategory === selectedSkillsCount) {
          chips.push({
            id: `category-${selectedCategory.category}`,
            label: selectedCategory.category,
            type: 'category',
            removePayload: {
              category: selectedCategory.category,
            },
          });
        } else {
          // Если выбраны не все - показываем отдельные навыки
          selectedCategory.skills.forEach((skill) => {
            chips.push({
              id: `skill-${selectedCategory.category}-${skill.skill_id}`,
              label: skill.skill_name,
              type: 'skill',
              removePayload: {
                category: selectedCategory.category,
                skillId: skill.skill_id,
              },
            });
          });
        }
      });
    }

    // Чипсы для городов
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
  }, [isSearchActive, searchQuery, currentFilters, skillsCatalog]);

  // Функция удаления конкретного фильтра
  const removeFilter = useCallback(
    (chipId: string) => {
      // Удаление поискового запроса
      if (chipId === 'search') {
        // Очищаем URL параметр если функция передана
        dispatch(setSearchQuery(''));

        config.clearSearch?.();

        return;
      }

      // Удаление общего фильтра
      if (chipId === 'general') {
        dispatch(removeGeneralFilter());
        return;
      }

      // Удаление гендерного фильтра
      if (chipId === 'gender') {
        dispatch(removeGenderFilter());
        return;
      }

      // Удаление целой категории (все навыки)
      if (chipId.startsWith('category-')) {
        const categoryName = chipId.replace('category-', '');

        // Находим категорию в текущих фильтрах
        const categoryInFilters = currentFilters.skills?.skill_categories.find(
          (cat) => cat.category === categoryName
        );

        if (categoryInFilters) {
          // Удаляем все навыки из этой категории
          categoryInFilters.skills.forEach((skill) => {
            dispatch(
              removeSkillFilter({
                category: categoryName,
                skillId: skill.skill_id,
              })
            );
          });
        }
        return;
      }

      // Удаление навыка
      if (chipId.startsWith('skill-')) {
        // Формат: skill-{categoryName}-{skillId}
        const parts = chipId.split('-');

        if (parts.length >= 3) {
          const skillId = parts[parts.length - 1];
          const categoryName = parts.slice(1, -1).join('-');

          dispatch(removeSkillFilter({ category: categoryName, skillId }));
        }
        return;
      }

      // Удаление города
      if (chipId.startsWith('city-')) {
        const city = chipId.replace('city-', '');

        dispatch(removeCityFilter(city));

        return;
      }
    },
    [dispatch, currentFilters, config]
  );

  // Функция очистки всех фильтров
  const clearAllFilters = useCallback(() => {
    dispatch(resetFilter());
    dispatch(setSearchQuery(''));
  }, [dispatch]);

  const hasActiveFilters = activeFilters.length > 0;

  return {
    filteredContent,
    activeFilters,
    isLoading: loadingUsers,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
  };
}
