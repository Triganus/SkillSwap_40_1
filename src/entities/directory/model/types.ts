/**
 * Модель категории навыков
 */
export interface Category {
  /** Уникальный идентификатор категории */
  id: string;
  /** Название категории */
  name: string;
  /** ID связанных подкатегорий */
  subcategoryIds: string[];
}

/**
 * Модель подкатегории навыков
 */
export interface Subcategory {
  /** Уникальный идентификатор подкатегории */
  id: string;
  /** Название подкатегории */
  name: string;
  /** ID родительской категории */
  categoryId: string;
}

/**
 * Модель города
 */
export interface City {
  /** Уникальный идентификатор города */
  id: string;
  /** Название города */
  name: string;
}

/**
 * Normalized state для категорий
 */
export interface CategoriesState {
  /** Категории в виде Record<id, Category> */
  entities: Record<string, Category>;
  /** Массив ID всех категорий */
  ids: string[];
  /** Статус загрузки */
  loading: boolean;
  /** Ошибка загрузки */
  error: string | null;
}

/**
 * Normalized state для подкатегорий
 */
export interface SubcategoriesState {
  /** Подкатегории в виде Record<id, Subcategory> */
  entities: Record<string, Subcategory>;
  /** Массив ID всех подкатегорий */
  ids: string[];
  /** Статус загрузки */
  loading: boolean;
  /** Ошибка загрузки */
  error: string | null;
}

/**
 * Normalized state для городов
 */
export interface CitiesState {
  /** Города в виде Record<id, City> */
  entities: Record<string, City>;
  /** Массив ID всех городов */
  ids: string[];
  /** Статус загрузки */
  loading: boolean;
  /** Ошибка загрузки */
  error: string | null;
}
