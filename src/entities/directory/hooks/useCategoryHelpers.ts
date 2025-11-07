import { useMemo } from 'react';
import { useDirectories } from './useDirectories';
import {
  getAllCategoryNames,
  getSubcategoriesByCategoryName,
  isSubcategoryInCategory,
  getAllSubcategoryNames,
  isValidCategoryName,
  isValidSubcategoryName,
  createCategoriesMap,
} from '../lib/categoryHelpers';
import type { Category, Subcategory } from '../model/types';

/**
 * Хук для работы с категориями и подкатегориями
 * Предоставляет удобные функции, совместимые со старым API (skillCategories)
 */
export function useCategoryHelpers() {
  const { categories, subcategories } = useDirectories();

  const typedCategories = categories as Category[];
  const typedSubcategories = subcategories as Subcategory[];

  const helpers = useMemo(
    () => ({
      /**
       * Получить список всех названий категорий
       */
      getAllCategories: () => getAllCategoryNames(typedCategories),

      /**
       * Получить список подкатегорий для категории
       * @param categoryName - название категории
       */
      getSkillsByCategory: (categoryName: string) =>
        getSubcategoriesByCategoryName(categoryName, typedCategories, typedSubcategories),

      /**
       * Проверить, существует ли подкатегория в категории
       * @param subcategoryName - название подкатегории
       * @param categoryName - название категории
       */
      isSkillInCategory: (subcategoryName: string, categoryName: string) =>
        isSubcategoryInCategory(subcategoryName, categoryName, typedCategories, typedSubcategories),

      /**
       * Получить все подкатегории
       */
      getAllSkills: () => getAllSubcategoryNames(typedSubcategories),

      /**
       * Проверить, валидна ли категория
       * @param categoryName - название категории
       */
      isValidCategory: (categoryName: string) => isValidCategoryName(categoryName, typedCategories),

      /**
       * Проверить, валидна ли подкатегория
       * @param subcategoryName - название подкатегории
       */
      isValidSkill: (subcategoryName: string) =>
        isValidSubcategoryName(subcategoryName, typedSubcategories),

      /**
       * Создать словарь категорий с подкатегориями
       * Совместимо со старым SKILL_CATEGORIES
       */
      getCategoriesMap: () => createCategoriesMap(typedCategories, typedSubcategories),
    }),
    [typedCategories, typedSubcategories]
  );

  return helpers;
}
