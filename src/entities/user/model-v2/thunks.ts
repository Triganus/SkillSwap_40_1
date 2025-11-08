import { createAsyncThunk } from '@reduxjs/toolkit';
import * as usersApi from '@/api/users-api-v2';
import type { UserListItem, UserProfile } from './types';
import { userListItemToSkillCard } from './utils';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard';

/**
 * Загрузить пользователей для HomePage с параметрами фильтрации
 * Возвращает данные в формате для SkillCard
 */
export const fetchUsersWithSkillsThunk = createAsyncThunk<
  { users: SkillCardProps[]; replace: boolean },
  {
    page?: number;
    limit?: number;
    searchQuery?: string;
    subcategoryIds?: string[];
    cities?: string[];
    gender?: string;
    sortBy?: 'newest' | 'oldest';
    searchType?: 'all' | 'want_to_learn' | 'can_teach';
    replace?: boolean; // Заменить существующие данные или добавить к ним
  } | void
>('usersV2/fetchUsersWithSkills', async (params) => {
  // Если параметры не переданы, загружаем данные по умолчанию (популярные + новые + рекомендованные)
  if (!params) {
    const [popularData, newData, recommendedData] = await Promise.all([
      usersApi.fetchPopularUsers(),
      usersApi.fetchNewUsers(),
      usersApi.fetchRecommendedUsers({ limit: 30 }),
    ]);
    const allUsers = new Map<string, UserListItem>();

    [...popularData, ...newData, ...recommendedData.users].forEach((user) => {
      allUsers.set(user.id, user);
    });

    return {
      users: Array.from(allUsers.values()).map(userListItemToSkillCard),
      replace: true, // Данные по умолчанию всегда заменяют
    };
  }

  // Если параметры переданы, используем fetchUserListItems с фильтрацией
  const result = await usersApi.fetchUserListItems({
    page: params.page || 1,
    limit: params.limit || 9, // По умолчанию 9 карточек
    searchQuery: params.searchQuery,
    subcategoryIds: params.subcategoryIds,
    cities: params.cities,
    gender: params.gender,
    sortBy: params.sortBy || 'newest',
    searchType: params.searchType,
  });

  return {
    users: result.users.map(userListItemToSkillCard),
    replace: params.replace !== undefined ? params.replace : true,
  };
});

/**
 * Загрузить рекомендованных пользователей с пагинацией
 */
export const fetchRecommendedUsersThunk = createAsyncThunk<
  { users: SkillCardProps[]; hasMore: boolean; replace: boolean },
  { page?: number; limit?: number; replace?: boolean }
>('usersV2/fetchRecommended', async (params = {}) => {
  const result = await usersApi.fetchRecommendedUsers({
    page: params.page || 1,
    limit: params.limit || 9,
  });

  return {
    users: result.users.map(userListItemToSkillCard),
    hasMore: result.hasMore,
    replace: params.replace !== undefined ? params.replace : true,
  };
});

/**
 * Загрузить список пользователей для каталога
 */
export const fetchUserListItemsThunk = createAsyncThunk<
  { users: UserListItem[]; hasMore: boolean; replace?: boolean },
  {
    page?: number;
    limit?: number;
    searchQuery?: string;
    categoryIds?: string[];
    subcategoryIds?: string[];
    cities?: string[];
    gender?: string;
    sortBy?: 'newest' | 'oldest';
    searchType?: 'all' | 'want_to_learn' | 'can_teach';
    replace?: boolean; // Заменить существующие данные или добавить к ним
  }
>('usersV2/fetchListItems', async (params) => {
  const result = await usersApi.fetchUserListItems(params);
  return {
    users: result.users,
    hasMore: result.hasMore,
    replace: params.replace,
  };
});

/**
 * Загрузить профиль пользователя
 */
export const fetchUserProfileThunk = createAsyncThunk<UserProfile, string>(
  'usersV2/fetchProfile',
  async (userId) => {
    return await usersApi.fetchUserProfile(userId);
  }
);

/**
 * Обновить профиль пользователя
 */
export const updateUserProfileThunk = createAsyncThunk<
  UserProfile,
  { userId: string; updates: Partial<Omit<UserProfile, 'id'>> }
>('usersV2/updateProfile', async ({ userId, updates }) => {
  return await usersApi.updateUserProfile(userId, updates);
});

/**
 * Лайкнуть/разлайкнуть навык
 */
export const toggleSkillLikeThunk = createAsyncThunk<
  { userId: string; skillId: string; liked: boolean },
  { userId: string; skillId: string }
>('usersV2/toggleSkillLike', async ({ userId, skillId }) => {
  const result = await usersApi.toggleSkillLike(userId, skillId);
  return { userId, skillId, liked: result.liked };
});

/**
 * Загрузить популярных пользователей (топ 3)
 */
export const fetchPopularUsersThunk = createAsyncThunk<UserListItem[]>(
  'usersV2/fetchPopular',
  async () => {
    return await usersApi.fetchPopularUsers();
  }
);

/**
 * Загрузить новых пользователей (топ 3)
 */
export const fetchNewUsersThunk = createAsyncThunk<UserListItem[]>('usersV2/fetchNew', async () => {
  return await usersApi.fetchNewUsers();
});
