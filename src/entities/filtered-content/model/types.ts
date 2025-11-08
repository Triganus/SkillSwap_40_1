import type { SkillCardProps } from '@widgets/Cards/SkillCard';

/**
 * Тип результата фильтрации
 */
export interface FilteredContent {
  /** Отфильтрованные карточки */
  items: SkillCardProps[];
  /** Общее количество элементов до фильтрации */
  totalCount: number;
  /** Количество элементов после фильтрации */
  filteredCount: number;
  /** Активен ли поиск */
  isSearchActive: boolean;
  /** Активны ли боковые фильтры */
  isSidebarFilterActive: boolean;
  /** Строка поиска */
  searchQuery: string;
}

/**
 * Конфигурация для фильтрации и сортировки
 */
export interface FilterConfig {
  /** Тип сортировки */
  sortBy?: 'popular' | 'new' | 'recommended' | 'relevance';
  /** Направление сортировки */
  sortDirection?: 'asc' | 'desc';
  /** Лимит отображаемых элементов */
  limit?: number;
}

/**
 * Чипс для отображения активного фильтра
 */
export interface FilterChip {
  /** Уникальный идентификатор */
  id: string;
  /** Текст для отображения */
  label: string;
  /** Тип фильтра */
  type: 'general' | 'gender' | 'skill' | 'category' | 'city' | 'search';
  /** Данные для удаления конкретного фильтра */
  removePayload?: {
    skillId?: string;
    category?: string;
    city?: string;
  };
}
