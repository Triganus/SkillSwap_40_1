import { useMemo, useCallback } from 'react';
import type { Skill } from '@entities/skill/model/types/types';

interface SkillsCatalog {
  skill_categories: Array<{
    category: string;
    skills: Array<{ skill_id: string; skill_name: string; skill_image: string }>;
  }>;
}

/**
 * Хук для получения изображений навыка из каталога
 */
export function useSkillImages(skill: Skill | undefined, catalog: SkillsCatalog | null) {
  const normalizeImagePath = useCallback((imagePath: string | undefined): string | undefined => {
    if (!imagePath) return undefined;
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  }, []);

  const images = useMemo(() => {
    if (!skill) return [];
    if (!catalog) return [];

    // Ищем навык в каталоге по skill.id
    for (const category of catalog.skill_categories) {
      const foundSkill = category.skills.find((s) => s.skill_id === skill.id);
      if (foundSkill && foundSkill.skill_image) {
        const normalizedPath = normalizeImagePath(foundSkill.skill_image);
        if (normalizedPath) {
          return [normalizedPath];
        }
      }
    }

    return [];
  }, [skill, catalog, normalizeImagePath]);

  return images;
}
