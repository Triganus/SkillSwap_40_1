import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/Provider';
import type { Skill } from './types/types';

// Вспомогательная функция: преобразует skill_id → полный Skill
const getSkillsByIds = (skillsMap: Record<string, Skill>, ids: string[]) => {
  return ids.map((id) => skillsMap[id]).filter(Boolean);
};

export const selectSkillWithAuthor = createSelector(
  [
    (state: RootState) => state.skills.skills,
    (state: RootState) => state.users.byId,
    (_state: RootState, skillId: string) => skillId,
  ],
  (skills, usersById, skillId) => {
    // Находим навык
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return { skill: null, author: null, teachingSkills: [], learningSkills: [] };

    // Находим автора
    const author = usersById[skill.authorId];
    if (!author) return { skill, author: null, teachingSkills: [], learningSkills: [] };

    // Создаём мапу навыков для быстрого поиска
    const skillsMap: Record<string, Skill> = {};
    skills.forEach((s) => {
      skillsMap[s.id] = s;
    });

    // Извлекаем IDs из my_skills
    const teachingIds = author.my_skills?.teach?.map((t) => t.skill_id) || [];
    const learningIds = author.my_skills?.learn?.map((l) => l.skill_id) || [];

    // Преобразуем в полные навыки
    const teachingSkills = getSkillsByIds(skillsMap, teachingIds);
    const learningSkills = getSkillsByIds(skillsMap, learningIds);

    return { skill, author, teachingSkills, learningSkills };
  }
);
