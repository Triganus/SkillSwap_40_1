import { createAsyncThunk } from '@reduxjs/toolkit';
import * as usersApi from '@/api/users-api-v2';
import type { UserListItem, UserProfile } from './types';

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
 * Загрузить рекомендованных пользователей
 */
export const fetchRecommendedUsersThunk = createAsyncThunk<
  { users: UserListItem[]; hasMore: boolean },
  { page?: number; limit?: number }
>('usersV2/fetchRecommended', async (params) => {
  return await usersApi.fetchRecommendedUsers(params);
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
