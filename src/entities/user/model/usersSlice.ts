import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/Provider';
import type { UserListItem, UserProfile } from '@/entities/user/model-v2';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import type { User } from './types/types';
import type { Skill } from '@/entities/skill/model/types/types';
import type { TagCategory } from '@/shared/ui/Tag';
import {
  fetchUserListItems,
  fetchPopularUsers,
  fetchNewUsers,
  fetchRecommendedUsers,
} from '@/api/users-api-v2';
import {
  getSubcategoriesFromStore,
  getCitiesFromStore,
} from '@/entities/directory/lib/getFromStore';

// Адаптеры для нормализованного хранения
const userListAdapter = createEntityAdapter<UserListItem>();
const userProfileAdapter = createEntityAdapter<UserProfile>();

// Состояние
export interface UsersState {
  listItems: ReturnType<typeof userListAdapter.getInitialState>;
  profiles: ReturnType<typeof userProfileAdapter.getInitialState>;
  popularIds: string[];
  newIds: string[];
  // TODO: Для совместимости со старым кодом HomePage
  skillCards: SkillCardProps[];
  // TODO: Для обратной совместимости со старым API
  byId: Record<string, UserListItem>;
  allIds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  listItems: userListAdapter.getInitialState(),
  profiles: userProfileAdapter.getInitialState(),
  popularIds: [],
  newIds: [],
  skillCards: [],
  byId: {},
  allIds: [],
  loading: false,
  error: null,
};

/**
 * Утилита для преобразования UserListItem в SkillCardProps
 */
function userListItemToSkillCard(userItem: UserListItem): SkillCardProps {
  const subcategories = getSubcategoriesFromStore();
  const cities = getCitiesFromStore();
  const skillMap = new Map(subcategories.map((s) => [s.name.toLowerCase(), s]));
  const cityMap = new Map(cities.map((c) => [c.id, c.name]));

  // Получаем название города по ID из справочника
  const cityName = cityMap.get(userItem.cityId) || userItem.cityId;

  const user: User = {
    id: userItem.id,
    name: userItem.name,
    email: '',
    avatar: userItem.avatar || undefined,
    gender:
      userItem.gender === 'male'
        ? 'мужской'
        : userItem.gender === 'female'
          ? 'женский'
          : 'не указан',
    bio: `${cityName}, ${userItem.age} лет`,
    skills: [],
    createdAt: new Date(userItem.createdAt).toISOString(),
  };

  const teachingSkills: Skill[] = userItem.canTeachSkills.map((skillName) => {
    const skillInfo = skillMap.get(skillName.toLowerCase());
    return {
      id: skillInfo?.id || skillName,
      title: skillName,
      description: '',
      type: 'teaching' as const,
      category: (skillInfo?.categoryId || 'other') as TagCategory,
      authorId: userItem.id,
      createdAt: new Date(userItem.createdAt).toISOString(),
    };
  });

  const learningSkills: Skill[] = userItem.wantsToLearnSkills.map((skillName) => {
    const skillInfo = skillMap.get(skillName.toLowerCase());
    return {
      id: skillInfo?.id || skillName,
      title: skillName,
      description: '',
      type: 'learning' as const,
      category: (skillInfo?.categoryId || 'other') as TagCategory,
      authorId: userItem.id,
      createdAt: new Date(userItem.createdAt).toISOString(),
    };
  });

  return {
    user,
    teachingSkills,
    learningSkills,
    onDetailsClick: () => console.log(`Details clicked for ${userItem.name}`),
    onLikeClick: () => console.log(`Like clicked for ${userItem.name}`),
    isLiked: false,
  };
}

/**
 * Загрузка пользователей для HomePage (популярные + новые + рекомендованные)
 */
export const fetchUsersWithSkills = createAsyncThunk<
  SkillCardProps[],
  void,
  { rejectValue: string; state: RootState }
>('users/fetchUsersWithSkills', async (_, { rejectWithValue }) => {
  try {
    // Загружаем популярных (3), новых (3) и рекомендованных (30+)
    const [popularDataResponse, newDataResponse, recommendedData] = await Promise.all([
      fetchPopularUsers(),
      fetchNewUsers(),
      fetchRecommendedUsers({ limit: 30 }),
    ]);

    // Объединяем все данные без дубликатов
    const allUsers = new Map<string, UserListItem>();
    // Все три функции возвращают объекты с полем users
    [...popularDataResponse.users, ...newDataResponse.users, ...recommendedData.users].forEach((user) => {
      allUsers.set(user.id, user);
    });

    // Преобразуем в SkillCardProps
    return Array.from(allUsers.values()).map(userListItemToSkillCard);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch users with skills'
    );
  }
});

/**
 * Загрузка списка пользователей с фильтрацией
 */
export const fetchUserList = createAsyncThunk<
  { users: UserListItem[]; hasMore: boolean; total: number },
  Parameters<typeof fetchUserListItems>[0],
  { rejectValue: string }
>('users/fetchUserList', async (params, { rejectWithValue }) => {
  try {
    return await fetchUserListItems(params);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Для обратной совместимости
    upsertMany(state, action: PayloadAction<Record<string, UserListItem>>) {
      for (const [id, user] of Object.entries(action.payload)) {
        state.byId[id] = user;
        if (!state.allIds.includes(id)) state.allIds.push(id);
      }
    },
    // Очистить весь справочник
    clearAll(state) {
      state.listItems = userListAdapter.getInitialState();
      state.profiles = userProfileAdapter.getInitialState();
      state.skillCards = [];
      state.popularIds = [];
      state.newIds = [];
      state.byId = {};
      state.allIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsersWithSkills
      .addCase(fetchUsersWithSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersWithSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skillCards = action.payload;
        state.error = null;
      })
      .addCase(fetchUsersWithSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })
      // fetchUserList
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        userListAdapter.upsertMany(state.listItems, action.payload.users);
        state.error = null;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { actions: usersActions, reducer: usersReducer } = usersSlice;

// Селекторы
export const selectUsersState = (s: RootState) => s.users;
export const selectAllUsers = (state: RootState) =>
  userListAdapter.getSelectors().selectAll(state.users.listItems);
export const selectUserById = (id: string) => (state: RootState) =>
  userListAdapter.getSelectors().selectById(state.users.listItems, id);
export const getAllUsersWithSkills = (state: RootState) => state.users.skillCards;
export const getUsersLoading = (state: RootState) => state.users.loading;
export const getUsersError = (state: RootState) => state.users.error;

export default usersSlice.reducer;
