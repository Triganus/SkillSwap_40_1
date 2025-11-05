import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUsersState } from '@entities/user/model/usersSlice';
import type { DbUser, User } from '@entities/user/model';
import type { Skill } from '@entities/skill/model/types/types';
import { useAgeFormatter } from './useAgeFormatter';

/**
 * Хук для поиска автора навыка и преобразования его в формат User
 */
export function useSkillAuthor(skill: Skill | undefined, stateUserId?: string) {
  const usersState = useSelector(selectUsersState);
  const formatAge = useAgeFormatter();

  const authorRaw = useMemo((): DbUser | undefined => {
    if (!skill) return undefined;

    // Приоритет: если передан userId из location.state
    if (stateUserId) {
      const authorFromState = usersState.byId[stateUserId];
      if (
        authorFromState &&
        authorFromState.my_skills?.teach?.some((teachSkill) => teachSkill.skill_id === skill.id)
      ) {
        return authorFromState;
      }
    }

    // Пробуем найти по authorId из навыка
    if (skill.authorId && skill.authorId !== 'mock-author-id') {
      const author = usersState.byId[skill.authorId];
      if (author) return author;
    }

    // Ищем пользователя, у которого есть этот навык в my_skills.teach
    const allUsers = Object.values(usersState.byId);
    return allUsers.find((user) =>
      user.my_skills?.teach?.some((teachSkill) => teachSkill.skill_id === skill.id)
    );
  }, [skill, usersState.byId, stateUserId]);

  const normalizeAvatarPath = (path: string | undefined): string | undefined => {
    if (!path) return undefined;
    return path.startsWith('/') ? path : `/${path}`;
  };

  const author: User | undefined = useMemo(() => {
    if (!authorRaw) return undefined;

    return {
      id: authorRaw.id,
      name: authorRaw.name,
      email: authorRaw.contacts?.email || authorRaw.email || '',
      avatar: normalizeAvatarPath(authorRaw.avatar_image),
      bio:
        authorRaw.location && authorRaw.age
          ? `${authorRaw.location}, ${authorRaw.age} ${formatAge(authorRaw.age)}`
          : authorRaw.about_me || '',
      skills: [],
      createdAt: authorRaw.date_of_registration || new Date().toISOString(),
    };
  }, [authorRaw, formatAge]);

  return { author, authorRaw };
}
