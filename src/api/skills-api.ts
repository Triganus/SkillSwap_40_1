import type { Skill } from '../entities/skill/model/types/types';
import { mapCategoryToTag } from '@/shared/lib/categoryMapper';

interface RawSkill {
  skill_id: string;
  skill_name: string;
}

interface RawSkillCategory {
  category: string;
  skills: RawSkill[];
}

/**
 * Загружает список всех навыков из JSON файла
 * @returns Promise с массивом навыков
 */
export const fetchSkills = async (): Promise<Skill[]> => {
  try {
    const response = await fetch('/db/skills.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as { skill_categories: RawSkillCategory[] };

    const skills: Skill[] = data.skill_categories.flatMap((cat) =>
      cat.skills.map((skill) => ({
        id: skill.skill_id,
        title: skill.skill_name,
        description: '', //можно позже добавить в JSON
        type: 'learning', // временно
        category: mapCategoryToTag(cat.category),
        authorId: 'mock-author-id', //временно
        createdAt: new Date().toISOString(),
      }))
    );

    return skills;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};
