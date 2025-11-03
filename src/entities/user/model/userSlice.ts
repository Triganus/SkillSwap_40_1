import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { DbUser } from './types/types';
import type { INotificationList } from '@/entities/notification/model/types/types';
import type { RootState } from '@/app/store';

export interface UserState {
  data: DbUser | null;
  notifications: INotificationList;
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

// Просмотр одного уведомления
export const viewNotification = createAsyncThunk(
  'user/viewNotification',
  async (notificationId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const notification = state.user.notifications.new.find((n) => n.id === notificationId);
      if (!notification) {
        throw new Error('Уведомление не найдено');
      }

      // Здесь будет вызов API: await api.post(`/notifications/${notificationId}/view`)
      // Пока — просто возвращаем обновлённое уведомление
      return { ...notification, isViewed: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось отметить уведомление';
      return rejectWithValue(errorMessage);
    }
  }
);

// Просмотр всех уведомлений
export const viewAllNotifications = createAsyncThunk(
  'user/viewAllNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const notifications = state.user.notifications.new;

      // API: await api.post('/notifications/view-all')
      return notifications.map((n) => ({ ...n, isViewed: true }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось отметить уведомления';
      return rejectWithValue(errorMessage);
    }
  }
);

// Удаление просмотренных уведомлений
export const removeViewedNotifications = createAsyncThunk(
  'user/removeViewedNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // API: await api.delete('/notifications/viewed')
      return []; // возвращаем пустой массив
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось удалить уведомления';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: UserState = {
  data: null,
  notifications: {
    new: [],
    viewed: [],
  },
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
      state.notifications = { new: [], viewed: [] };
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
      })

      // Просмотр одного уведомления
      .addCase(viewNotification.fulfilled, (state, action) => {
        const viewedNotification = action.payload;
        state.notifications.new = state.notifications.new.filter(
          (n) => n.id !== viewedNotification.id
        );
        state.notifications.viewed.push(viewedNotification);
      })

      // Просмотр всех уведомлений
      .addCase(viewAllNotifications.fulfilled, (state, action) => {
        const viewedNotifications = action.payload;
        state.notifications.viewed.push(...viewedNotifications);
        state.notifications.new = [];
      })

      // Удаление просмотренных
      .addCase(removeViewedNotifications.fulfilled, (state) => {
        state.notifications.viewed = [];
      });
  },
});

export const { setUser, clearUser, setError, clearError } = userSlice.actions;

// Временные mock-экспорты для совместимости с SkillPage (TODO: удалить после рефакторинга)
export const usersActions = {
  upsertMany: (payload: unknown) => ({ type: 'users/upsertMany', payload }),
};

export const selectUsersState = (): { byId: Record<string, DbUser> } => ({ byId: {} });

// Селекторы
export const selectCurrentUser = (state: RootState) => state.user.data;
export const selectIsAuth = (state: RootState) => state.user.isAuth;
export const selectIsInit = (state: RootState) => state.user.isInit;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectNewNotifications = (state: RootState) => state.user.notifications.new;
export const selectViewedNotifications = (state: RootState) => state.user.notifications.viewed;

export default userSlice.reducer;
