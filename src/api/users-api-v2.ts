import type { UserListItem, UserProfile, TeachingSkill } from '@/entities/user/model-v2';

/**
 * Получить список пользователей для каталога
 */
export async function fetchUserListItems(params?: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  categoryIds?: string[];
  subcategoryIds?: string[];
  cities?: string[];
  gender?: string;
  sortBy?: 'newest' | 'oldest';
  searchType?: 'all' | 'want_to_learn' | 'can_teach';
  replace?: boolean;
  currentUserId?: string;
}): Promise<{ users: UserListItem[]; hasMore: boolean; total: number }> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.searchQuery) searchParams.set('q', params.searchQuery);
  if (params?.categoryIds?.length) searchParams.set('categories', params.categoryIds.join(','));
  if (params?.subcategoryIds?.length)
    searchParams.set('subcategories', params.subcategoryIds.join(','));
  if (params?.cities?.length) searchParams.set('cities', params.cities.join(','));
  if (params?.gender) searchParams.set('gender', params.gender);
  if (params?.sortBy) searchParams.set('sort', params.sortBy);
  if (params?.searchType) searchParams.set('searchType', params.searchType);
  if (params?.currentUserId) searchParams.set('currentUserId', params.currentUserId);

  const response = await fetch(`/api/users?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Получить профиль пользователя по ID
 */
export async function fetchUserProfile(userId: string): Promise<{
  profile: UserProfile;
  skills: TeachingSkill[];
}> {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Обновить профиль пользователя
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id'>>
): Promise<UserProfile> {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Лайкнуть/разлайкнуть навык по ID навыка
 */
export async function toggleSkillLike(
  userId: string,
  skillId: string
): Promise<{ liked: boolean; likesCount: number }> {
  const response = await fetch(`/api/users/${userId}/likes/${skillId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle skill like: ${response.statusText}`);
  }

  return response.json();
}

export async function toggleSkillLikeByUserId(
  currentUserId: string,
  skillOwnerUserId: string
): Promise<{ liked: boolean; skillId: string; likesCount: number }> {
  const response = await fetch(`/api/users/${currentUserId}/likes/by-user/${skillOwnerUserId}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle skill like by user: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Получить рекомендованных пользователей
 */
export async function fetchRecommendedUsers(params?: {
  page?: number;
  limit?: number;
  currentUserId?: string;
}): Promise<{ users: UserListItem[]; hasMore: boolean }> {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.currentUserId) searchParams.set('currentUserId', params.currentUserId);

  const response = await fetch(`/api/users/recommended?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recommended users: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Получить популярных пользователей (топ 3)
 */
export async function fetchPopularUsers(currentUserId?: string): Promise<UserListItem[]> {
  const searchParams = new URLSearchParams();

  searchParams.set('limit', '3');

  if (currentUserId) searchParams.set('currentUserId', currentUserId);

  const response = await fetch(`/api/users/popular?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch popular users: ${response.statusText}`);
  }

  const data = await response.json();

  return data.users || data;
}

/**
 * Получить новых пользователей (топ 3)
 */
export async function fetchNewUsers(currentUserId?: string): Promise<UserListItem[]> {
  const searchParams = new URLSearchParams();

  searchParams.set('limit', '3');

  if (currentUserId) searchParams.set('currentUserId', currentUserId);

  const response = await fetch(`/api/users/new?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch new users: ${response.statusText}`);
  }

  const data = await response.json();

  return data.users || data;
}

/**
 * Получить похожих пользователей на основе навыков текущего пользователя
 */
export async function fetchSimilarUsers(params: {
  userId: string;
  canTeachSkills: string[];
  wantsToLearnSkills: string[];
  limit?: number;
}): Promise<UserListItem[]> {
  const searchParams = new URLSearchParams();

  searchParams.set('userId', params.userId);
  searchParams.set('canTeachSkills', params.canTeachSkills.join(','));
  searchParams.set('wantsToLearnSkills', params.wantsToLearnSkills.join(','));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const response = await fetch(`/api/users/similar?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch similar users: ${response.statusText}`);
  }

  const data = await response.json();
  return data.users || data;
}
