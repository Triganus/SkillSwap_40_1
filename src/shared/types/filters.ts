/**
 * Типы для фильтров
 */

/**
 * Тип для фильтра по гендеру
 * '' - означает "не указан" или "все"
 */
export type GenderFilter = 'Мужской' | 'Женский' | '';

/**
 * Интерфейс для всех фильтров
 */
export interface IFilters {
  subcategories: string[]; // Названия подкатегорий (ранее SkillName)
  gender: GenderFilter;
  cities: string[]; // Названия городов
  searchTarget: 'Хочу научиться' | 'Могу научить' | 'Всё';
}
