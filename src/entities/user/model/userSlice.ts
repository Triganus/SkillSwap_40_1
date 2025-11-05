import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { DbUser } from './types/types';
import type { RootState } from '@/app/store';

export interface UserState {
  data: DbUser | null;
  isAuth: boolean;
  isInit: boolean;
  loading: boolean;
  error: string | null;
}

export const checkAuth = createAsyncThunk('user/checkAuth', async (_, { dispatch }) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    await dispatch(fetchCurrentUser());
  } else {
    dispatch(clearUser());
  }
});

// Загрузка текущего пользователя (из localStorage / API)
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // Здесь будет вызов mock API или fetch
      // const response = await api.get('/auth/me');
      // return response.data as DbUser;

      // Пока мок-данные
      const mockUser: DbUser = {
        id: 'user-1',
        name: 'Анна Петрова',
        email: 'anna@example.com',
        location: 'Санкт-Петербург',
        avatar_image: '/avatars/anna.jpg',
        gender: 'Женский',
        about_me: 'Учусь обмениваться навыками',
        my_skills: {
          teach: [{ skill_id: 'drums', skill_description: 'Игра на барабанах' }],
          learn: [{ skill_id: 'english', skill_description: 'Английский язык' }],
        },
        offers: {
          incoming: [],
          outgoing: [],
          archived: [],
        },
        date_of_registration: '2025-01-01',
      };
      return mockUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить профиль';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: UserState = {
  data: null,
  isAuth: false,
  isInit: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Установить пользователя (например, после логина)
    setUser(state, action: PayloadAction<DbUser>) {
      state.data = action.payload;
      state.isAuth = true;
      state.isInit = true;
      state.error = null;
    },

    // Очистить пользователя (выход)
    clearUser(state) {
      state.data = null;
      state.isAuth = false;
      state.isInit = true;
      state.error = null;
    },

    // Установить ошибку
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    // Очистить ошибку
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Загрузка текущего пользователя
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuth = true;
        state.isInit = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuth = false;
        state.isInit = true;
      });
  },
});

export const { setUser, clearUser, setError, clearError } = userSlice.actions;

// Селекторы
export const selectCurrentUser = (state: RootState) => state.user.data;
export const selectIsAuth = (state: RootState) => state.user.isAuth;
export const selectIsInit = (state: RootState) => state.user.isInit;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
