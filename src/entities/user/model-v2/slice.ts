import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserListItem, UserProfile, UsersState } from './types';
import {
  fetchUserListItemsThunk,
  fetchUserProfileThunk,
  updateUserProfileThunk,
  toggleSkillLikeThunk,
  fetchRecommendedUsersThunk,
  fetchPopularUsersThunk,
  fetchNewUsersThunk,
} from './thunks';

/**
 * Entity Adapters для нормализации данных
 */
const listItemsAdapter = createEntityAdapter<UserListItem>({
  sortComparer: (a, b) => b.createdAt - a.createdAt, // Сортировка по дате (новые первые)
});

const profilesAdapter = createEntityAdapter<UserProfile>();

/**
 * Начальное состояние
 */
const initialState: UsersState = {
  listItems: listItemsAdapter.getInitialState(),
  profiles: profilesAdapter.getInitialState(),
  loading: false,
  error: null,
};

/**
 * Slice для управления пользователями
 */
export const usersSliceV2 = createSlice({
  name: 'usersV2',
  initialState,
  reducers: {
    // ========== List Items (для каталога) ==========

    /**
     * Установить весь список пользователей (замена)
     */
    setUserListItems: (state, action: PayloadAction<UserListItem[]>) => {
      listItemsAdapter.setAll(state.listItems, action.payload);
    },

    /**
     * Добавить пользователей к существующему списку (пагинация)
     */
    addUserListItems: (state, action: PayloadAction<UserListItem[]>) => {
      listItemsAdapter.addMany(state.listItems, action.payload);
    },

    /**
     * Обновить одного пользователя в списке
     */
    updateUserListItem: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<UserListItem> }>
    ) => {
      listItemsAdapter.updateOne(state.listItems, action.payload);
    },

    /**
     * Удалить пользователя из списка
     */
    removeUserListItem: (state, action: PayloadAction<string>) => {
      listItemsAdapter.removeOne(state.listItems, action.payload);
    },

    // ========== Profiles (полные данные) ==========

    /**
     * Установить профиль пользователя
     */
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      profilesAdapter.setOne(state.profiles, action.payload);
    },

    /**
     * Обновить профиль пользователя
     */
    updateUserProfile: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<UserProfile> }>
    ) => {
      profilesAdapter.updateOne(state.profiles, action.payload);
    },

    // ========== Лайки ==========

    /**
     * Переключить лайк навыка для пользователя
     */
    toggleLikedSkill: (state, action: PayloadAction<{ userId: string; skillId: string }>) => {
      const user = state.profiles.entities[action.payload.userId];
      if (user) {
        const index = user.likedSkillIds.indexOf(action.payload.skillId);
        if (index > -1) {
          user.likedSkillIds.splice(index, 1);
        } else {
          user.likedSkillIds.push(action.payload.skillId);
        }
      }
    },

    // ========== Loading states ==========

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // ========== Reset ==========

    /**
     * Сброс всего состояния
     */
    resetUsers: () => initialState,
  },
  extraReducers: (builder) => {
    // ========== fetchUserListItemsThunk ==========
    builder.addCase(fetchUserListItemsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserListItemsThunk.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.replace) {
        listItemsAdapter.setAll(state.listItems, action.payload.users);
      } else {
        listItemsAdapter.addMany(state.listItems, action.payload.users);
      }
    });
    builder.addCase(fetchUserListItemsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch users';
    });

    // ========== fetchUserProfileThunk ==========
    builder.addCase(fetchUserProfileThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
      state.loading = false;
      profilesAdapter.setOne(state.profiles, action.payload);
    });
    builder.addCase(fetchUserProfileThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch user profile';
    });

    // ========== updateUserProfileThunk ==========
    builder.addCase(updateUserProfileThunk.fulfilled, (state, action) => {
      profilesAdapter.setOne(state.profiles, action.payload);
    });

    // ========== toggleSkillLikeThunk ==========
    builder.addCase(toggleSkillLikeThunk.fulfilled, (state, action) => {
      const { userId, skillId, liked } = action.payload;
      const user = state.profiles.entities[userId];
      if (user) {
        if (liked) {
          if (!user.likedSkillIds.includes(skillId)) {
            user.likedSkillIds.push(skillId);
          }
        } else {
          const index = user.likedSkillIds.indexOf(skillId);
          if (index > -1) {
            user.likedSkillIds.splice(index, 1);
          }
        }
      }
    });

    // ========== fetchRecommendedUsersThunk ==========
    builder.addCase(fetchRecommendedUsersThunk.fulfilled, (state, action) => {
      listItemsAdapter.addMany(state.listItems, action.payload.users);
    });

    // ========== fetchPopularUsersThunk ==========
    builder.addCase(fetchPopularUsersThunk.fulfilled, (state, action) => {
      listItemsAdapter.upsertMany(state.listItems, action.payload);
    });

    // ========== fetchNewUsersThunk ==========
    builder.addCase(fetchNewUsersThunk.fulfilled, (state, action) => {
      listItemsAdapter.upsertMany(state.listItems, action.payload);
    });
  },
});

export const {
  setUserListItems,
  addUserListItems,
  updateUserListItem,
  removeUserListItem,
  setUserProfile,
  updateUserProfile,
  toggleLikedSkill,
  setLoading,
  setError,
  resetUsers,
} = usersSliceV2.actions;

export default usersSliceV2.reducer;
