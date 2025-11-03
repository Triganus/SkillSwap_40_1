import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { INotificationList } from '@/entities/notification/model/types/types';
import type { RootState } from '@/app/store';

// Состояние только для уведомлений
interface NotificationsState {
  data: INotificationList;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  data: {
    new: [],
    viewed: [],
  },
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // Моковые уведомления
      const mock: INotificationList = {
        new: [
          {
            id: 'n1',
            type: 'exchange_request',
            date: 'сегодня',
            from: { id: 'u2', name: 'Иван', email: 'ivan@example.com' } as any,
            to: { id: 'u1', name: 'Анна', email: 'anna@example.com' } as any,
            isViewed: false,
            link: '/profile/u2',
          },
        ],
        viewed: [
          {
            id: 'n2',
            type: 'exchange_accepted',
            date: 'вчера',
            from: { id: 'u3', name: 'Мария', email: 'maria@example.com' } as any,
            to: { id: 'u1', name: 'Анна', email: 'anna@example.com' } as any,
            isViewed: true,
            link: '/profile/u3',
          },
        ],
      };
      return mock;
    } catch (err) {
      return rejectWithValue('Не удалось загрузить уведомления');
    }
  }
);

export const viewNotification = createAsyncThunk(
  'notifications/viewNotification',
  async (notificationId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const notification = state.notifications.data.new.find((n) => n.id === notificationId);
      if (!notification) throw new Error('Уведомление не найдено');
      return { ...notification, isViewed: true };
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Не удалось отметить уведомление');
    }
  }
);

export const viewAllNotifications = createAsyncThunk(
  'notifications/viewAllNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      return state.notifications.data.new.map(n => ({ ...n, isViewed: true }));
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Не удалось отметить все уведомления');
    }
  }
);

export const removeViewedNotifications = createAsyncThunk(
  'notifications/removeViewedNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // Мок: удаляем всё
      return [];
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Не удалось удалить уведомления');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<INotificationList>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(viewNotification.fulfilled, (state, action) => {
        const viewed = action.payload;
        state.data.new = state.data.new.filter(n => n.id !== viewed.id);
        state.data.viewed.push(viewed);
      })
      .addCase(viewAllNotifications.fulfilled, (state, action) => {
        state.data.viewed.push(...action.payload);
        state.data.new = [];
      })
      .addCase(removeViewedNotifications.fulfilled, (state) => {
        state.data.viewed = [];
      });
  },
});

export const { setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;