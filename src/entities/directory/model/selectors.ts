import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Category, Subcategory, City } from './types';

// ========== Categories Selectors ==========

/**
 * Базовый селектор состояния категорий
 */
export const selectCategoriesState = (state: RootState) => state.categories;

/**
 * Селектор загрузки категорий
 */
export const selectCategoriesLoading = (state: RootState) => state.categories.loading;

/**
 * Селектор ошибки категорий
 */
export const selectCategoriesError = (state: RootState) => state.categories.error;

/**
 * Селектор всех категорий в виде массива
 */
export const selectAllCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) =>
    categoriesState.ids.map((id) => categoriesState.entities[id]).filter(Boolean) as Category[]
);

/**
 * Селектор категории по ID
 */
export const selectCategoryById = (categoryId: string) =>
  createSelector(
    [selectCategoriesState],
    (categoriesState) => categoriesState.entities[categoryId]
  );

/**
 * Селектор количества категорий
 */
export const selectCategoriesCount = (state: RootState) => state.categories.ids.length;

/**
 * Селектор категорий в виде Record
 */
export const selectCategoriesEntities = (state: RootState) => state.categories.entities;

// ========== Subcategories Selectors ==========

/**
 * Базовый селектор состояния подкатегорий
 */
export const selectSubcategoriesState = (state: RootState) => state.subcategories;

/**
 * Селектор загрузки подкатегорий
 */
export const selectSubcategoriesLoading = (state: RootState) => state.subcategories.loading;

/**
 * Селектор ошибки подкатегорий
 */
export const selectSubcategoriesError = (state: RootState) => state.subcategories.error;

/**
 * Селектор всех подкатегорий в виде массива
 */
export const selectAllSubcategories = createSelector(
  [selectSubcategoriesState],
  (subcategoriesState) =>
    subcategoriesState.ids
      .map((id) => subcategoriesState.entities[id])
      .filter(Boolean) as Subcategory[]
);

/**
 * Селектор подкатегории по ID
 */
export const selectSubcategoryById = (subcategoryId: string) =>
  createSelector(
    [selectSubcategoriesState],
    (subcategoriesState) => subcategoriesState.entities[subcategoryId]
  );

/**
 * Селектор подкатегорий по категории
 */
export const selectSubcategoriesByCategoryId = (categoryId: string) =>
  createSelector([selectAllSubcategories], (subcategories) =>
    subcategories.filter((sub) => sub.categoryId === categoryId)
  );

/**
 * Селектор подкатегорий в виде Record
 */
export const selectSubcategoriesEntities = (state: RootState) => state.subcategories.entities;

/**
 * Селектор количества подкатегорий
 */
export const selectSubcategoriesCount = (state: RootState) => state.subcategories.ids.length;

// ========== Cities Selectors ==========

/**
 * Базовый селектор состояния городов
 */
export const selectCitiesState = (state: RootState) => state.cities;

/**
 * Селектор загрузки городов
 */
export const selectCitiesLoading = (state: RootState) => state.cities.loading;

/**
 * Селектор ошибки городов
 */
export const selectCitiesError = (state: RootState) => state.cities.error;

/**
 * Селектор всех городов в виде массива
 */
export const selectAllCities = createSelector(
  [selectCitiesState],
  (citiesState) => citiesState.ids.map((id) => citiesState.entities[id]).filter(Boolean) as City[]
);

/**
 * Селектор города по ID
 */
export const selectCityById = (cityId: string) =>
  createSelector([selectCitiesState], (citiesState) => citiesState.entities[cityId]);

/**
 * Селектор городов в алфавитном порядке
 */
export const selectCitiesSorted = createSelector([selectAllCities], (cities) =>
  [...cities].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
);

/**
 * Селектор городов в виде Record
 */
export const selectCitiesEntities = (state: RootState) => state.cities.entities;

/**
 * Селектор количества городов
 */
export const selectCitiesCount = (state: RootState) => state.cities.ids.length;

// ========== Combined Selectors ==========

/**
 * Селектор статуса загрузки всех справочников
 */
export const selectDirectoriesLoading = createSelector(
  [selectCategoriesLoading, selectSubcategoriesLoading, selectCitiesLoading],
  (categoriesLoading, subcategoriesLoading, citiesLoading) =>
    categoriesLoading || subcategoriesLoading || citiesLoading
);

/**
 * Селектор готовности всех справочников
 */
export const selectDirectoriesReady = createSelector(
  [selectCategoriesCount, selectSubcategoriesCount, selectCitiesCount, selectDirectoriesLoading],
  (categoriesCount, subcategoriesCount, citiesCount, loading) =>
    !loading && categoriesCount > 0 && subcategoriesCount > 0 && citiesCount > 0
);

/**
 * Селектор категории с подкатегориями
 */
export const selectCategoryWithSubcategories = (categoryId: string) =>
  createSelector(
    [selectCategoryById(categoryId), selectAllSubcategories],
    (category, allSubcategories) => {
      if (!category) return null;

      const subcategories = allSubcategories.filter((sub) => sub.categoryId === categoryId);

      return {
        ...category,
        subcategories,
      };
    }
  );

/**
 * Селектор всех категорий с подкатегориями
 */
export const selectAllCategoriesWithSubcategories = createSelector(
  [selectAllCategories, selectAllSubcategories],
  (categories, subcategories) =>
    categories.map((category) => ({
      ...category,
      subcategories: subcategories.filter((sub) => sub.categoryId === category.id),
    }))
);

// ========== UI Options Selectors ==========

/**
 * Селектор опций городов для dropdown
 * Возвращает массив { label: string, value: string }
 */
export const selectCityOptions = createSelector([selectCitiesSorted], (cities) =>
  cities.map((city) => ({
    label: city.name,
    value: city.name,
  }))
);

/**
 * Селектор опций категорий для dropdown
 * Возвращает массив { label: string, value: string (ID категории) }
 */
export const selectCategoryOptions = createSelector([selectAllCategories], (categories) =>
  categories.map((category) => ({
    label: category.name,
    value: category.id,
  }))
);

/**
 * Селектор опций подкатегорий для dropdown
 * Возвращает массив { label: string, value: string (название) }
 */
export const selectSubcategoryOptions = createSelector([selectAllSubcategories], (subcategories) =>
  subcategories.map((subcategory) => ({
    label: subcategory.name,
    value: subcategory.name,
  }))
);

/**
 * Селектор опций подкатегорий для конкретной категории
 * @param categoryId - ID категории
 */
export const selectSubcategoryOptionsByCategoryId = (categoryId: string) =>
  createSelector([selectSubcategoriesByCategoryId(categoryId)], (subcategories) =>
    subcategories.map((subcategory) => ({
      label: subcategory.name,
      value: subcategory.name,
    }))
  );

/**
 * Селектор ID всех категорий (TagCategory[])
 * Возвращает массив ID категорий, которые совпадают с TagCategory
 */
export const selectCategoryIds = createSelector([selectAllCategories], (categories) =>
  categories.map((category) => category.id)
);

/**
 * Селектор маппинга ID категории → название
 * Возвращает Record<string, string>
 */
export const selectCategoryIdToName = createSelector([selectAllCategories], (categories) =>
  categories.reduce(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {} as Record<string, string>
  )
);

/**
 * Селектор маппинга название категории → ID
 * Возвращает Record<string, string>
 */
export const selectCategoryNameToId = createSelector([selectAllCategories], (categories) =>
  categories.reduce(
    (acc, category) => {
      acc[category.name] = category.id;
      return acc;
    },
    {} as Record<string, string>
  )
);

/**
 * Селектор для получения названия категории по ID
 */
export const selectCategoryNameById = (categoryId: string) =>
  createSelector([selectCategoryIdToName], (idToName) => idToName[categoryId] || '');

/**
 * Селектор для получения ID категории по названию
 */
export const selectCategoryIdByName = (categoryName: string) =>
  createSelector([selectCategoryNameToId], (nameToId) => nameToId[categoryName] || '');

/**
 * Селектор маппинга ID подкатегории → название
 * Возвращает Record<string, string>
 */
export const selectSubcategoryIdToName = createSelector([selectAllSubcategories], (subcategories) =>
  subcategories.reduce(
    (acc, subcategory) => {
      acc[subcategory.id] = subcategory.name;
      return acc;
    },
    {} as Record<string, string>
  )
);

/**
 * Селектор маппинга название подкатегории → ID
 * Возвращает Record<string, string>
 */
export const selectSubcategoryNameToId = createSelector([selectAllSubcategories], (subcategories) =>
  subcategories.reduce(
    (acc, subcategory) => {
      acc[subcategory.name] = subcategory.id;
      return acc;
    },
    {} as Record<string, string>
  )
);

/**
 * Селектор для получения названия подкатегории по ID
 */
export const selectSubcategoryNameById = (subcategoryId: string) =>
  createSelector([selectSubcategoryIdToName], (idToName) => idToName[subcategoryId] || '');

/**
 * Селектор для получения ID подкатегории по названию
 */
export const selectSubcategoryIdByName = (subcategoryName: string) =>
  createSelector([selectSubcategoryNameToId], (nameToId) => nameToId[subcategoryName] || '');

/**
 * Конфигурация цветов и иконок для категорий
 */
export interface CategoryConfig {
  color: string; // CSS переменная для цвета
  iconName: string;
}

/**
 * Маппинг названий категорий на их конфигурацию (цвет и иконка)
 */
const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  'Бизнес и карьера': {
    color: 'var(--tag-business, #eee7f7)', // приглушенный фиолетовый
    iconName: 'briefcase',
  },
  'Иностранные языки': {
    color: 'var(--tag-languages, #e8e5c5)', // приглушенный бежевый
    iconName: 'global',
  },
  'Дом и уют': {
    color: 'var(--tag-home, #f7ebf5)', // приглушенный розовый
    iconName: 'home',
  },
  'Творчество и искусство': {
    color: 'var(--tag-art, #f7e7f2)', // приглушенный розовый
    iconName: 'palette',
  },
  'Образование и развитие': {
    color: 'var(--tag-education, #e7f2f6)', // приглушенный голубой
    iconName: 'book',
  },
  'Здоровье и образ жизни': {
    color: 'var(--tag-health, #e9f7e7)', // приглушенный зеленый
    iconName: 'lifestyle',
  },
};

/**
 * Селектор для получения конфигурации категории по её названию
 * @param categoryName - название категории
 * @returns конфигурация категории или null
 */
export const selectCategoryConfigByName = (categoryName: string): CategoryConfig | null => {
  return CATEGORY_CONFIGS[categoryName] || null;
};

/**
 * Селектор опций подкатегорий для dropdown с ID в value
 * Возвращает массив { label: string (название), value: string (ID) }
 */
export const selectSubcategoryOptionsWithIds = createSelector(
  [selectAllSubcategories],
  (subcategories) =>
    subcategories.map((subcategory) => ({
      label: subcategory.name,
      value: subcategory.id,
    }))
);

/**
 * Селектор опций подкатегорий для конкретной категории с ID в value
 * @param categoryId - ID категории
 */
export const selectSubcategoryOptionsWithIdsByCategoryId = (categoryId: string) =>
  createSelector([selectSubcategoriesByCategoryId(categoryId)], (subcategories) =>
    subcategories.map((subcategory) => ({
      label: subcategory.name,
      value: subcategory.id,
    }))
  );
