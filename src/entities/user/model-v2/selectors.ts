import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';
import type { UserListItem, UserProfile, UserListItemWithMatches, SearchType } from './types';

/**
 * ========== Базовые селекторы ==========
 */

export const selectUsersV2State = (state: RootState) => state.usersV2 || state.users;

export const selectUserListItemsIds = (state: RootState) => {
  const usersState = selectUsersV2State(state);
  return usersState?.listItems?.ids || [];
};

export const selectUserListItemsEntities = (state: RootState) => {
  const usersState = selectUsersV2State(state);
  return usersState?.listItems?.entities || {};
};

export const selectUserProfilesIds = (state: RootState) => {
  const usersState = selectUsersV2State(state);
  return usersState?.profiles?.ids || [];
};

export const selectUserProfilesEntities = (state: RootState) => {
  const usersState = selectUsersV2State(state);
  return usersState?.profiles?.entities || {};
};

export const selectUsersLoading = (state: RootState) => {
  const usersState = selectUsersV2State(state);
  return usersState?.loading || false;
};

export const selectUsersError = (state: RootState) => {
  const usersState = selectUsersV2State(state);
  return usersState?.error || null;
};

/**
 * ========== Производные селекторы ==========
 */

/**
 * Селектор всех пользователей для каталога
 */
export const selectAllUserListItems = createSelector(
  [selectUserListItemsIds, selectUserListItemsEntities],
  (ids, entities): UserListItem[] => {
    return ids.map((id) => entities[id]).filter(Boolean) as UserListItem[];
  }
);

/**
 * Селектор пользователя по ID (list item)
 */
export const selectUserListItemById = (userId: string) =>
  createSelector(
    [selectUserListItemsEntities],
    (entities): UserListItem | undefined => entities[userId]
  );

/**
 * Селектор профиля пользователя по ID
 */
export const selectUserProfileById = (userId: string) =>
  createSelector(
    [selectUserProfilesEntities],
    (entities): UserProfile | undefined => entities[userId]
  );

/**
 * ========== Основной селектор с вычисляемыми навыками ==========
 */

/**
 * Вычисление совпадающих навыков в зависимости от типа поиска
 * Это ключевая функция для фильтрации по "Хочу научиться" / "Могу научить"
 */
function computeMatchedSkills(user: UserListItem, searchType: SearchType): string[] {
  switch (searchType) {
    case 'want_to_learn':
      // Если Я хочу научиться, показываем что ПОЛЬЗОВАТЕЛЬ может научить
      return user.canTeachSkills;

    case 'can_teach':
      // Если Я могу научить, показываем чему ПОЛЬЗОВАТЕЛЬ хочет научиться
      return user.wantsToLearnSkills;

    case 'all':
      // Показываем все навыки пользователя
      return [...user.canTeachSkills, ...user.wantsToLearnSkills];

    default:
      return [];
  }
}

/**
 * Мемоизированный селектор для пользователей с вычисляемыми навыками
 * Пересчитывается только при изменении списка пользователей или searchType
 */
export const selectUserListItemsWithMatches = (searchType: SearchType = 'all') =>
  createSelector([selectAllUserListItems], (users): UserListItemWithMatches[] => {
    return users.map((user) => ({
      ...user,
      matchedSkills: computeMatchedSkills(user, searchType),
    }));
  });

/**
 * ========== Селекторы для лайков ==========
 */

/**
 * Проверка, лайкнул ли пользователь навык
 */
export const selectIsSkillLikedByUser = (userId: string, skillId: string) =>
  createSelector([selectUserProfilesEntities], (entities): boolean => {
    const user = entities[userId];
    return user ? user.likedSkillIds.includes(skillId) : false;
  });

/**
 * Получить все лайкнутые навыки пользователя
 */
export const selectUserLikedSkills = (userId: string) =>
  createSelector([selectUserProfilesEntities], (entities): string[] => {
    const user = entities[userId];
    return user?.likedSkillIds || [];
  });

/**
 * ========== Селекторы для фильтрации ==========
 */

/**
 * Фильтрация пользователей по городу
 */
export const selectUsersByCity = (city: string) =>
  createSelector([selectAllUserListItems], (users): UserListItem[] => {
    if (!city) return users;
    return users.filter((user) => user.city === city);
  });

/**
 * Фильтрация пользователей по полу
 */
export const selectUsersByGender = (gender: string) =>
  createSelector([selectAllUserListItems], (users): UserListItem[] => {
    if (!gender || gender === 'all' || gender === 'not_specified') return users;
    return users.filter((user) => user.gender === gender);
  });
