import { createAsyncThunk } from '@reduxjs/toolkit';
import * as usersApi from '@/api/users-api-v2';
import type { UserListItem, UserProfile, TeachingSkill } from './types';
import { userListItemToSkillCard } from './utils';
import type { SkillCardProps } from '@/widgets/Cards/SkillCard';
import type { RootState } from '@/app/store';

/**
 * Загрузить пользователей для HomePage с параметрами фильтрации
 * Возвращает данные в формате для SkillCard
 */
export const fetchUsersWithSkillsThunk = createAsyncThunk<
  { users: SkillCardProps[]; replace: boolean; total?: number },
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
>('usersV2/fetchUsersWithSkills', async (params, { getState }) => {
  // Получаем currentUserId из auth state
  const state = getState() as RootState;
  const currentUserId = state.authV2?.user?.id;

  // Если параметры не переданы, загружаем данные по умолчанию (популярные + новые + рекомендованные)
  if (!params) {
    const [popularData, newData, recommendedData] = await Promise.all([
      usersApi.fetchPopularUsers(currentUserId),
      usersApi.fetchNewUsers(currentUserId),
      usersApi.fetchRecommendedUsers({ limit: 9, currentUserId }),
    ]);
    const allUsers = new Map<string, UserListItem>();

    [...popularData, ...newData, ...recommendedData.users].forEach((user) => {
      allUsers.set(user.id, user);
    });

    return {
      users: Array.from(allUsers.values()).map((user) => userListItemToSkillCard(user)),
      replace: true, // Данные по умолчанию всегда заменяют
      total: allUsers.size, // Общее количество для данных по умолчанию
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
    currentUserId,
  });

  return {
    users: result.users.map((user) => userListItemToSkillCard(user)),
    replace: params.replace !== undefined ? params.replace : true,
    total: result.total,
  };
});

/**
 * Загрузить рекомендованных пользователей с пагинацией
 */
export const fetchRecommendedUsersThunk = createAsyncThunk<
  { users: SkillCardProps[]; hasMore: boolean; replace: boolean },
  { page?: number; limit?: number; replace?: boolean }
>('usersV2/fetchRecommended', async (params = {}, { getState }) => {
  const state = getState() as RootState;
  const currentUserId = state.authV2?.user?.id;

  const result = await usersApi.fetchRecommendedUsers({
    page: params.page || 1,
    limit: params.limit || 9,
    currentUserId,
  });

  return {
    users: result.users.map((user) => userListItemToSkillCard(user)),
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
>('usersV2/fetchListItems', async (params, { getState }) => {
  // Получаем currentUserId из auth state
  const state = getState() as RootState;
  const currentUserId = state.authV2?.user?.id;

  const result = await usersApi.fetchUserListItems({
    ...params,
    currentUserId,
  });
  return {
    users: result.users,
    hasMore: result.hasMore,
    replace: params.replace,
  };
});

/**
 * Загрузить профиль пользователя
 */
export const fetchUserProfileThunk = createAsyncThunk<
  { profile: UserProfile; skills: TeachingSkill[] },
  string
>('usersV2/fetchProfile', async (userId) => {
  return await usersApi.fetchUserProfile(userId);
});

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
  { userId: string; skillId: string; liked: boolean; likesCount: number },
  { userId: string; skillId: string }
>('usersV2/toggleSkillLike', async ({ userId, skillId }) => {
  const result = await usersApi.toggleSkillLike(userId, skillId);
  return { userId, skillId, liked: result.liked, likesCount: result.likesCount };
});

/**
 * Лайкнуть/разлайкнуть навык по userId владельца навыка
 * Используется когда у нас нет конкретного skillId
 */
export const toggleSkillLikeByUserIdThunk = createAsyncThunk<
  { currentUserId: string; skillId: string; liked: boolean; likesCount: number },
  { currentUserId: string; skillOwnerUserId: string }
>('usersV2/toggleSkillLikeByUserId', async ({ currentUserId, skillOwnerUserId }) => {
  const result = await usersApi.toggleSkillLikeByUserId(currentUserId, skillOwnerUserId);
  return {
    currentUserId,
    skillId: result.skillId,
    liked: result.liked,
    likesCount: result.likesCount,
  };
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
