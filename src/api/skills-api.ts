import type { Skill } from '../entities/skill/model/types/types';

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
    
    const skills: Skill[] = await response.json();
    return skills;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};
