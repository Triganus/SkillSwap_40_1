import type { Category, Subcategory } from '../model/types';

/**
 * Получить список подкатегорий для категории по названию
 * Совместимо с getSkillsByCategory из старого API
 */
export function getSubcategoriesByCategory(
  categoryName: string,
  categories: Category[],
  subcategories: Subcategory[]
): string[] {
  const category = categories.find((cat) => cat.name === categoryName);
  if (!category) return [];

  return subcategories.filter((sub) => sub.categoryId === category.id).map((sub) => sub.name);
}

/**
 * Проверить, является ли строка валидным названием подкатегории
 * Совместимо с isValidSkillName из старого API
 */
export function isValidSubcategoryName(
  subcategoryName: string,
  subcategories: Subcategory[]
): boolean {
  return subcategories.some((sub) => sub.name === subcategoryName);
}

/**
 * Получить все названия категорий
 * Совместимо с getAllCategories из старого API
 */
export function getAllCategoryNames(categories: Category[]): string[] {
  return categories.map((cat) => cat.name);
}

/**
 * Получить все названия подкатегорий
 * Совместимо с getAllSkills из старого API
 */
export function getAllSubcategoryNames(subcategories: Subcategory[]): string[] {
  return subcategories.map((sub) => sub.name);
}

/**
 * Проверить, валидно ли название категории
 * Совместимо с isValidSkillCategory из старого API
 */
export function isValidCategoryName(categoryName: string, categories: Category[]): boolean {
  return categories.some((cat) => cat.name === categoryName);
}

/**
 * Проверить, существует ли подкатегория в указанной категории
 * Совместимо с isSkillInCategory из старого API
 */
export function isSubcategoryInCategory(
  subcategoryName: string,
  categoryName: string,
  categories: Category[],
  subcategories: Subcategory[]
): boolean {
  const categorySubcategories = getSubcategoriesByCategory(categoryName, categories, subcategories);
  return categorySubcategories.includes(subcategoryName);
}
