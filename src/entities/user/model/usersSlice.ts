import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DbUser } from './types/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@app/Provider';
import type { SkillCardProps } from '@widgets/Cards/SkillCard';
import { fetchUsersAsSkillCards } from '@/api';

// Состояние: справочник всех пользователей
export interface UsersState {
  byId: Record<string, DbUser>;
  allIds: string[];
  // Данные для HomePage в формате SkillCardProps
  skillCards: SkillCardProps[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  byId: {},
  allIds: [],
  skillCards: [],
  loading: false,
  error: null,
};

/**
 * Асинхронный экшен для загрузки пользователей с навыками для HomePage
 */
export const fetchUsersWithSkills = createAsyncThunk<
  SkillCardProps[],
  void,
  { rejectValue: string; state: RootState }
>('users/fetchUsersWithSkills', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const subcategoriesState = state.subcategories;
    const subcategories = subcategoriesState.ids
      .map(id => subcategoriesState.entities[id])
      .filter(Boolean) as Array<{ id: string; name: string; categoryId: string }>;

    if (import.meta.env.DEV) {
      console.log('[fetchUsersWithSkills] Using subcategories from store:', subcategories.length);
    }

    return await fetchUsersAsSkillCards(subcategories);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch users with skills'
    );
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Добавить или обновить нескольких пользователей
    upsertMany(state, action: PayloadAction<Record<string, DbUser>>) {
      for (const [id, user] of Object.entries(action.payload)) {
        state.byId[id] = user;

        if (!state.allIds.includes(id)) state.allIds.push(id);
      }
    },

    // Удалить пользователя
    remove(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state.byId[id]) {
        delete state.byId[id];
        state.allIds = state.allIds.filter((i) => i !== id);
      }
    },

    // Очистить весь справочник (например, при выходе)
    clearAll(state) {
      state.byId = {};
      state.allIds = [];
      state.skillCards = [];
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { actions: usersActions, reducer: usersReducer } = usersSlice;

// Селекторы
export const selectUsersState = (s: RootState) => s.users;
export const selectUserById = (id: string) => (s: RootState) => s.users.byId[id];
export const selectAllUsers = (state: RootState) =>
  state.users.allIds.map((id) => state.users.byId[id]);
export const getAllUsersWithSkills = (state: RootState) => state.users.skillCards;
export const getUsersLoading = (state: RootState) => state.users.loading;
export const getUsersError = (state: RootState) => state.users.error;

export default usersSlice.reducer;
