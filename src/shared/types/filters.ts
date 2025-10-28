/**
 * Типы для фильтров
 */

import type { SkillName } from '@/shared/lib/constants/skillCategories';
import type { City } from '@/shared/lib/constants/cities';

/**
 * Тип для фильтра по гендеру
 * '' - означает "не указан" или "все"
 */
export type GenderFilter = 'Мужской' | 'Женский' | '';

/**
 * Интерфейс для всех фильтров
 */
export interface IFilters {
  subcategories: SkillName[];
  gender: GenderFilter;
  cities: City[];
  searchTarget: 'Хочу научиться' | 'Могу научить' | 'Всё';
}
