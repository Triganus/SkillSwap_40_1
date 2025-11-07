import type { Skill } from '@entities/skill/model';
import type { SkillCategoriesData } from '@/entities/Skill';
import type { TagCategory } from '@/shared/ui/Tag';

/**
 * Загружает список всех навыков из новой системы справочников
 * @returns Promise с массивом навыков
 * @deprecated Используйте directoryModel.fetchCategories() и directoryModel.fetchSubcategories() напрямую
 */
export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    // Загружаем категории и подкатегории из новых API
    const [categoriesRes, subcategoriesRes] = await Promise.all([
      fetch('/api/directories/categories'),
      fetch('/api/directories/subcategories'),
    ]);

    if (!categoriesRes.ok || !subcategoriesRes.ok) {
      throw new Error('HTTP error while fetching directories');
    }

    // const categoriesData = await categoriesRes.json();
    const subcategoriesData = await subcategoriesRes.json();

    // const categories = categoriesData.categories;
    const subcategories = subcategoriesData.subcategories;

    // Преобразуем в формат Skill
    const skills: Skill[] = subcategories.map(
      (sub: { id: string; name: string; categoryId: string }) => {
        return {
          id: sub.id,
          title: sub.name,
          description: '',
          type: 'learning',
          category: (sub.categoryId || 'other') as TagCategory,
          authorId: 'mock-author-id',
          createdAt: new Date().toISOString(),
        };
      }
    );

    return skills;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

/**
 * Загружает каталог навыков в формате для фильтров (с категориями)
 * @returns Promise с данными категорий навыков
 * @deprecated Используйте convertToLegacyFormat из @/entities/directory
 */
export const fetchSkillsCatalog = async (): Promise<SkillCategoriesData> => {
  try {
    // Загружаем категории и подкатегории из новых API
    const [categoriesRes, subcategoriesRes] = await Promise.all([
      fetch('/api/directories/categories'),
      fetch('/api/directories/subcategories'),
    ]);

    if (!categoriesRes.ok || !subcategoriesRes.ok) {
      throw new Error('HTTP error while fetching directories');
    }

    const categoriesData = await categoriesRes.json();
    const subcategoriesData = await subcategoriesRes.json();

    const categories = categoriesData.categories;
    const subcategories = subcategoriesData.subcategories;

    // Преобразуем в старый формат SkillCategoriesData
    const skillCategories = categories.map((category: { id: string; name: string }) => {
      const categorySubcategories = subcategories.filter(
        (sub: { categoryId: string }) => sub.categoryId === category.id
      );

      return {
        category: category.name,
        skills: categorySubcategories.map((sub: { id: string; name: string }) => ({
          skill_id: sub.id,
          skill_name: sub.name,
          skill_image: '',
        })),
      };
    });

    return {
      skill_categories: skillCategories,
    };
  } catch (error) {
    console.error('Error fetching skills catalog:', error);
    throw error;
  }
};
