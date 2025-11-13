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
  {
    users: SkillCardProps[];
    replace: boolean;
    total?: number;
    popularCards?: SkillCardProps[];
    newCards?: SkillCardProps[];
  },
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
>('usersV2/fetchUsersWithSkills', async (params, { getState, dispatch }) => {
  const resolveCurrentUserId = () => {
    const state = getState() as RootState;
    return state.authV2?.user?.id;
  };

  const currentUserId = resolveCurrentUserId();

  const handleLikeClick = ({
    skillOwnerUserId,
    primarySkillId,
  }: {
    skillOwnerUserId: string;
    primarySkillId?: string;
  }) => {
    const currentUserId = resolveCurrentUserId();

    if (!currentUserId) {
      console.log('Cannot toggle like: user is not authenticated');
      return;
    }

    void dispatch(
      toggleSkillLikeByUserIdThunk({
        currentUserId,
        skillOwnerUserId,
      })
    )
      .unwrap()
      .then((result) => {
        const skillId = result.skillId || primarySkillId;
        if (!skillId) {
          return;
        }

        const likesKey = `likes_${skillId}_${skillOwnerUserId}`;
        try {
          const likesData = JSON.parse(
            localStorage.getItem(likesKey) || '{"count":0,"users":[]}'
          ) as { count: number; users: string[] };

          likesData.count = result.likesCount;

          if (result.liked) {
            if (!likesData.users.includes(currentUserId)) {
              likesData.users.push(currentUserId);
            }
          } else {
            likesData.users = likesData.users.filter((id) => id !== currentUserId);
          }

          localStorage.setItem(likesKey, JSON.stringify(likesData));
        } catch (error) {
          console.warn('[fetchUsersWithSkillsThunk] Failed to persist likes', error);
        }
      })
      .catch((error) => {
        console.error('Failed to toggle like for skill card:', error);
      });
  };

  const transformUserToCard = (user: UserListItem) =>
    userListItemToSkillCard(user, {
      currentUserId,
      onLikeClick: handleLikeClick,
    });

  // Если параметры не переданы, загружаем данные по умолчанию (популярные + новые + рекомендованные)
  if (!params) {
    const [popularDataResponse, newDataResponse, recommendedData] = await Promise.all([
      usersApi.fetchPopularUsers({ limit: 3, currentUserId }),
      usersApi.fetchNewUsers({ limit: 3, currentUserId }),
      usersApi.fetchRecommendedUsers({ limit: 9, currentUserId }),
    ]);

    const popularCards = popularDataResponse.users.map((user) => transformUserToCard(user));
    const newCards = newDataResponse.users.map((user) => transformUserToCard(user));

    // Для списка "Рекомендуем" создаем общий массив без дубликатов
    const allUsers = new Map<string, UserListItem>();

    [...popularDataResponse.users, ...newDataResponse.users, ...recommendedData.users].forEach(
      (user) => {
        allUsers.set(user.id, user);
      }
    );

    return {
      users: Array.from(allUsers.values()).map((user) => transformUserToCard(user)),
      replace: true, // Данные по умолчанию всегда заменяют
      total: allUsers.size, // Общее количество для данных по умолчанию
      popularCards, // Сохраняем отдельно топ-3 популярных
      newCards, // Сохраняем отдельно топ-3 новых
    };
  }

  // Если параметры переданы, используем fetchUserListItems с фильтрацией
  if (process.env.NODE_ENV === 'development') {
    console.log('[fetchUsersWithSkillsThunk] Fetching with params:', {
      page: params.page || 1,
      limit: params.limit || 9,
      searchQuery: params.searchQuery,
      subcategoryIds: params.subcategoryIds,
      cities: params.cities,
      gender: params.gender,
      sortBy: params.sortBy || 'newest',
      searchType: params.searchType,
    });
  }

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

  if (process.env.NODE_ENV === 'development') {
    console.log('[fetchUsersWithSkillsThunk] API returned:', {
      usersCount: result.users.length,
      total: result.total,
      replace: params.replace !== undefined ? params.replace : true,
    });
  }

  return {
    users: result.users.map((user) => transformUserToCard(user)),
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
>('usersV2/fetchRecommended', async (params = {}, { getState, dispatch }) => {
  const resolveCurrentUserId = () => {
    const state = getState() as RootState;
    return state.authV2?.user?.id;
  };

  const handleLikeClick = ({
    skillOwnerUserId,
    primarySkillId,
  }: {
    skillOwnerUserId: string;
    primarySkillId?: string;
  }) => {
    const currentUserId = resolveCurrentUserId();

    if (!currentUserId) {
      console.log('Cannot toggle like: user is not authenticated');
      return;
    }

    void dispatch(
      toggleSkillLikeByUserIdThunk({
        currentUserId,
        skillOwnerUserId,
      })
    )
      .unwrap()
      .then((result) => {
        const skillId = result.skillId || primarySkillId;
        if (!skillId) {
          return;
        }

        const likesKey = `likes_${skillId}_${skillOwnerUserId}`;
        try {
          const likesData = JSON.parse(
            localStorage.getItem(likesKey) || '{"count":0,"users":[]}'
          ) as { count: number; users: string[] };

          likesData.count = result.likesCount;

          if (result.liked) {
            if (!likesData.users.includes(currentUserId)) {
              likesData.users.push(currentUserId);
            }
          } else {
            likesData.users = likesData.users.filter((id) => id !== currentUserId);
          }

          localStorage.setItem(likesKey, JSON.stringify(likesData));
        } catch (error) {
          console.warn('[fetchRecommendedUsersThunk] Failed to persist likes', error);
        }
      })
      .catch((error) => {
        console.error('Failed to toggle like for recommended skill card:', error);
      });
  };

  const currentUserId = resolveCurrentUserId();

  const result = await usersApi.fetchRecommendedUsers({
    page: params.page || 1,
    limit: params.limit || 9,
    currentUserId,
  });

  return {
    users: result.users.map((user) =>
      userListItemToSkillCard(user, {
        currentUserId,
        onLikeClick: handleLikeClick,
      })
    ),
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
  {
    currentUserId: string;
    skillOwnerUserId: string;
    skillId: string;
    liked: boolean;
    likesCount: number;
  },
  { currentUserId: string; skillOwnerUserId: string }
>('usersV2/toggleSkillLikeByUserId', async ({ currentUserId, skillOwnerUserId }) => {
  const result = await usersApi.toggleSkillLikeByUserId(currentUserId, skillOwnerUserId);
  return {
    currentUserId,
    skillOwnerUserId,
    skillId: result.skillId,
    liked: result.liked,
    likesCount: result.likesCount,
  };
});

/**
 * Загрузить популярных пользователей (топ 3) для HomePage
 */
export const fetchPopularUsersThunk = createAsyncThunk<UserListItem[]>(
  'usersV2/fetchPopular',
  async () => {
    const response = await usersApi.fetchPopularUsers({ limit: 3 });
    return response.users;
  }
);

/**
 * Загрузить новых пользователей (топ 3) для HomePage
 */
export const fetchNewUsersThunk = createAsyncThunk<UserListItem[]>('usersV2/fetchNew', async () => {
  const response = await usersApi.fetchNewUsers({ limit: 3 });
  return response.users;
});

/**
 * Загрузить популярных пользователей с пагинацией для PopularSkillsPage
 * Возвращает данные в формате для SkillCard с сортировкой по количеству лайков
 */
export const fetchPopularUsersWithPaginationThunk = createAsyncThunk<
  { users: SkillCardProps[]; replace: boolean; total: number; hasMore: boolean },
  {
    page?: number;
    limit?: number;
    replace?: boolean;
  } | void
>('usersV2/fetchPopularWithPagination', async (params, { getState, dispatch }) => {
  const resolveCurrentUserId = () => {
    const state = getState() as RootState;
    return state.authV2?.user?.id;
  };

  const currentUserId = resolveCurrentUserId();

  const handleLikeClick = ({
    skillOwnerUserId,
    primarySkillId,
  }: {
    skillOwnerUserId: string;
    primarySkillId?: string;
  }) => {
    const currentUserId = resolveCurrentUserId();

    if (!currentUserId) {
      console.log('Cannot toggle like: user is not authenticated');
      return;
    }

    void dispatch(
      toggleSkillLikeByUserIdThunk({
        currentUserId,
        skillOwnerUserId,
      })
    )
      .unwrap()
      .then((result) => {
        const skillId = result.skillId || primarySkillId;
        if (!skillId) {
          return;
        }

        const likesKey = `likes_${skillId}_${skillOwnerUserId}`;
        try {
          const likesData = JSON.parse(
            localStorage.getItem(likesKey) || '{"count":0,"users":[]}'
          ) as { count: number; users: string[] };

          likesData.count = result.likesCount;

          if (result.liked) {
            if (!likesData.users.includes(currentUserId)) {
              likesData.users.push(currentUserId);
            }
          } else {
            likesData.users = likesData.users.filter((id) => id !== currentUserId);
          }

          localStorage.setItem(likesKey, JSON.stringify(likesData));
        } catch (error) {
          console.warn('[fetchPopularUsersWithPaginationThunk] Failed to persist likes', error);
        }
      })
      .catch((error) => {
        console.error('Failed to toggle like for skill card:', error);
      });
  };

  const transformUserToCard = (user: UserListItem) =>
    userListItemToSkillCard(user, {
      currentUserId,
      onLikeClick: handleLikeClick,
    });

  const page = params?.page || 1;
  const limit = params?.limit || 9;

  const response = await usersApi.fetchPopularUsers({
    page,
    limit,
    currentUserId,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[fetchPopularUsersWithPaginationThunk] API returned:', {
      usersCount: response.users.length,
      total: response.total,
      hasMore: response.hasMore,
      page,
      limit,
    });
  }

  return {
    users: response.users.map((user) => transformUserToCard(user)),
    replace: params?.replace !== undefined ? params.replace : true,
    total: response.total,
    hasMore: response.hasMore,
  };
});

/**
 * Загрузить новых пользователей с пагинацией для NewSkillsPage
 * Возвращает данные в формате для SkillCard с сортировкой по убыванию даты
 */
export const fetchNewUsersWithPaginationThunk = createAsyncThunk<
  { users: SkillCardProps[]; replace: boolean; total: number; hasMore: boolean },
  {
    page?: number;
    limit?: number;
    replace?: boolean;
  } | void
>('usersV2/fetchNewWithPagination', async (params, { getState, dispatch }) => {
  const resolveCurrentUserId = () => {
    const state = getState() as RootState;
    return state.authV2?.user?.id;
  };

  const currentUserId = resolveCurrentUserId();

  const handleLikeClick = ({
    skillOwnerUserId,
    primarySkillId,
  }: {
    skillOwnerUserId: string;
    primarySkillId?: string;
  }) => {
    const currentUserId = resolveCurrentUserId();

    if (!currentUserId) {
      console.log('Cannot toggle like: user is not authenticated');
      return;
    }

    void dispatch(
      toggleSkillLikeByUserIdThunk({
        currentUserId,
        skillOwnerUserId,
      })
    )
      .unwrap()
      .then((result) => {
        const skillId = result.skillId || primarySkillId;
        if (!skillId) {
          return;
        }

        const likesKey = `likes_${skillId}_${skillOwnerUserId}`;
        try {
          const likesData = JSON.parse(
            localStorage.getItem(likesKey) || '{"count":0,"users":[]}'
          ) as { count: number; users: string[] };

          likesData.count = result.likesCount;

          if (result.liked) {
            if (!likesData.users.includes(currentUserId)) {
              likesData.users.push(currentUserId);
            }
          } else {
            likesData.users = likesData.users.filter((id) => id !== currentUserId);
          }

          localStorage.setItem(likesKey, JSON.stringify(likesData));
        } catch (error) {
          console.warn('[fetchNewUsersWithPaginationThunk] Failed to persist likes', error);
        }
      })
      .catch((error) => {
        console.error('Failed to toggle like for skill card:', error);
      });
  };

  const transformUserToCard = (user: UserListItem) =>
    userListItemToSkillCard(user, {
      currentUserId,
      onLikeClick: handleLikeClick,
    });

  const page = params?.page || 1;
  const limit = params?.limit || 9;

  const response = await usersApi.fetchNewUsers({
    page,
    limit,
    currentUserId,
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('[fetchNewUsersWithPaginationThunk] API returned:', {
      usersCount: response.users.length,
      total: response.total,
      hasMore: response.hasMore,
      page,
      limit,
    });
  }

  return {
    users: response.users.map((user) => transformUserToCard(user)),
    replace: params?.replace !== undefined ? params.replace : true,
    total: response.total,
    hasMore: response.hasMore,
  };
});
