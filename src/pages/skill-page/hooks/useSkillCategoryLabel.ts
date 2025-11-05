import { useMemo } from 'react';
import type { Skill } from '@entities/skill/model/types/types';

interface SkillsCatalog {
  skill_categories: Array<{
    category: string;
    skills: Array<{ skill_id: string; skill_name: string; skill_image: string }>;
  }>;
}

/**
 * Хук для формирования полной категории с подкатегорией
 * Например: "Творчество и искусство / Музыка и звук"
 */
export function useSkillCategoryLabel(skill: Skill | undefined, catalog: SkillsCatalog | null) {
  const categoryLabel = useMemo(() => {
    if (!skill || !catalog) return undefined;

    for (const category of catalog.skill_categories) {
      const foundSkill = category.skills.find((s) => s.skill_id === skill.id);
      if (foundSkill) {
        return `${category.category} / ${foundSkill.skill_name}`;
      }
    }

    return undefined;
  }, [skill, catalog]);

  return categoryLabel;
}
