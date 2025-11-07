/**
 * Хелперы для работы с категориями и подкатегориями
 * Реэкспортируют функции из compatibility.ts для удобства
 */

export {
  getAllCategoryNames,
  getSubcategoriesByCategory as getSubcategoriesByCategoryName,
  isSubcategoryInCategory,
  getAllSubcategoryNames,
  isValidCategoryName,
  isValidSubcategoryName,
} from './compatibility';

import type { Category, Subcategory } from '../model/types';

/**
 * Создать словарь категорий с подкатегориями
 * @param categories - массив категорий
 * @param subcategories - массив подкатегорий
 */
export const createCategoriesMap = (
  categories: Category[],
  subcategories: Subcategory[]
): Record<string, string[]> => {
  const map: Record<string, string[]> = {};

  categories.forEach((category) => {
    map[category.name] = subcategories
      .filter((sub) => sub.categoryId === category.id)
      .map((sub) => sub.name);
  });

  return map;
};
