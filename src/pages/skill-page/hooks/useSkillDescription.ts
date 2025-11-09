import { useMemo } from 'react';
import type { Skill } from '@entities/skill/model/types/types';
import type { DbUser } from '@entities/user/model';

/**
 * Хук для получения описания навыка
 */
export function useSkillDescription(
  skill: Skill | undefined,
  authorRaw: DbUser | undefined
): string {
  const description = useMemo(() => {
    if (!skill) return '';

    // Если у навыка есть описание, используем его
    if (skill.description) return skill.description;

    // Иначе ищем описание в данных пользователя
    const teachSkill = authorRaw?.my_skills?.teach?.find((t) => t.skill_id === skill.id);
    return teachSkill?.skill_description || '';
  }, [skill, authorRaw]);

  return description;
}
