import type { Category, Subcategory } from '../model/types';
import type { SkillCategoriesData, SkillCategory } from '@/entities/Skill';

/**
 * Преобразует категории и подкатегории в формат SkillCategoriesData (старый формат)
 * для обратной совместимости с существующими компонентами
 */
export function convertToLegacyFormat(
  categories: Category[],
  subcategories: Subcategory[]
): SkillCategoriesData {
  const skillCategories: SkillCategory[] = categories.map((category) => {
    const categorySubcategories = subcategories.filter((sub) => sub.categoryId === category.id);

    return {
      category: category.name,
      skills: categorySubcategories.map((sub) => ({
        skill_id: sub.id,
        skill_name: sub.name,
        skill_image: '',
      })),
    };
  });

  return {
    skill_categories: skillCategories,
  };
}

/**
 * Преобразует данные из старого формата SkillCategoriesData в массив ID подкатегорий
 */
export function extractSubcategoryIds(data: SkillCategoriesData | null): string[] {
  if (!data) {
    return [];
  }

  const ids: string[] = [];

  data.skill_categories.forEach((category) => {
    category.skills.forEach((skill) => {
      ids.push(skill.skill_id);
    });
  });

  return ids;
}

/**
 * Создает SkillCategoriesData из массива ID подкатегорий
 */
export function createLegacyDataFromIds(
  subcategoryIds: string[],
  allCategories: Category[],
  allSubcategories: Subcategory[]
): SkillCategoriesData {
  const selectedSubcategories = allSubcategories.filter((sub) => subcategoryIds.includes(sub.id));

  const categoriesMap = new Map<string, SkillCategory>();

  selectedSubcategories.forEach((sub) => {
    const category = allCategories.find((cat) => cat.id === sub.categoryId);

    if (!category) {
      return;
    }

    if (!categoriesMap.has(category.id)) {
      categoriesMap.set(category.id, {
        category: category.name,
        skills: [],
      });
    }

    categoriesMap.get(category.id)!.skills.push({
      skill_id: sub.id,
      skill_name: sub.name,
      skill_image: '',
    });
  });

  return {
    skill_categories: Array.from(categoriesMap.values()),
  };
}

/**
 * Находит категорию по ID подкатегории
 */
export function findCategoryBySubcategoryId(
  subcategoryId: string,
  categories: Category[],
  subcategories: Subcategory[]
): Category | null {
  const subcategory = subcategories.find((sub) => sub.id === subcategoryId);

  if (!subcategory) {
    return null;
  }

  return categories.find((cat) => cat.id === subcategory.categoryId) || null;
}
