import { useMemo } from 'react';
import type { Skill } from '@entities/skill/model/types/types';
import type { DbUser } from '@entities/user/model';

/**
 * Хук для преобразования навыков автора (teaching/learning) в формат Skill[]
 */
export function useAuthorSkills(
  authorRaw: DbUser | undefined,
  skills: Skill[],
  skill: Skill | undefined,
  type: 'teaching' | 'learning'
): Skill[] {
  const authorSkills = useMemo(() => {
    const skillsList =
      type === 'teaching' ? authorRaw?.my_skills?.teach : authorRaw?.my_skills?.learn;
    if (!skillsList || !skills.length || !skill) return [];

    // Создаем мапу навыков для быстрого поиска по ID
    const skillsMap = new Map<string, Skill>();
    skills.forEach((s) => {
      skillsMap.set(s.id, s);
    });

    // Преобразуем skill_id из my_skills в Skill объекты
    return skillsList
      .map((userSkill) => {
        const existingSkill = skillsMap.get(userSkill.skill_id);
        if (existingSkill) {
          return {
            ...existingSkill,
            authorId: authorRaw!.id,
            type: type,
          };
        }

        // Если навык не найден в каталоге, создаем его из данных my_skills
        return {
          id: userSkill.skill_id,
          title: userSkill.skill_description || userSkill.skill_id,
          description: userSkill.skill_description || '',
          type: type,
          category: skill.category,
          authorId: authorRaw!.id,
          createdAt: authorRaw!.date_of_registration || new Date().toISOString(),
        };
      })
      .filter(Boolean);
  }, [authorRaw, skills, skill, type]);

  return authorSkills;
}
