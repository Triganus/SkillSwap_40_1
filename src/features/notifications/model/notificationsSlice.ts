import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { INotificationList } from '@/entities/notification/model/types/types';
import type { RootState } from '@/app/store';
import type { DbUser } from '@/entities/user/model/types/types';

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

const createMockUser = (id: string, name: string, email: string): DbUser => ({
  id,
  name,
  email,
  location: 'Москва',
  avatar_image: '',
  gender: 'Мужской',
  about_me: '',
  my_skills: {
    teach: [],
    learn: [],
  },
  offers: {
    incoming: [],
    outgoing: [],
    archived: [],
  },
  date_of_registration: '2025-01-01',
});

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
            from: createMockUser('u2', 'Иван', 'ivan@example.com'),
            to: createMockUser('u1', 'Анна', 'anna@example.com'),
            isViewed: false,
            link: '/profile/u2',
          },
          {
            id: 'n3',
            type: 'exchange_request',
            date: 'сегодня',
            from: createMockUser('u4', 'Татьяна', 'tatyana@example.com'),
            to: createMockUser('u1', 'Анна', 'anna@example.com'),
            isViewed: false,
            link: '/profile/u4',
          },
        ],
        viewed: [
          {
            id: 'n2',
            type: 'exchange_accepted',
            date: 'вчера',
            from: createMockUser('u3', 'Мария', 'maria@example.com'),
            to: createMockUser('u1', 'Анна', 'anna@example.com'),
            isViewed: true,
            link: '/profile/u3',
          },
          {
            id: 'n4',
            type: 'exchange_request',
            date: '23 мая',
            from: createMockUser('u5', 'Олег', 'oleg@example.com'),
            to: createMockUser('u1', 'Анна', 'anna@example.com'),
            isViewed: true,
            link: '/profile/u5',
          },
        ],
      };
      return mock;
    } catch {
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
    } catch {
      return rejectWithValue('Не удалось отметить уведомление');
    }
  }
);

export const viewAllNotifications = createAsyncThunk(
  'notifications/viewAllNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      return state.notifications.data.new.map((n) => ({ ...n, isViewed: true }));
    } catch {
      return rejectWithValue('Не удалось отметить все уведомления');
    }
  }
);

export const removeViewedNotifications = createAsyncThunk(
  'notifications/removeViewedNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // Мок: удаляем всё
      return [];
    } catch {
      return rejectWithValue('Не удалось удалить уведомления');
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
    markNotificationViewed(state, action: PayloadAction<string>) {
      const notificationId = action.payload;
      const index = state.data.new.findIndex((n) => n.id === notificationId);
      if (index === -1) {
        return;
      }

      const [notification] = state.data.new.splice(index, 1);
      state.data.viewed.push({ ...notification, isViewed: true });
    },
    markAllNotificationsViewed(state) {
      if (state.data.new.length === 0) {
        return;
      }

      const viewedBatch = state.data.new.map((notification) => ({
        ...notification,
        isViewed: true,
      }));

      state.data.viewed.push(...viewedBatch);
      state.data.new = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(viewNotification.fulfilled, (state, action) => {
        const viewed = action.payload;
        state.data.new = state.data.new.filter((n) => n.id !== viewed.id);
        const alreadyViewed = state.data.viewed.some((n) => n.id === viewed.id);
        if (!alreadyViewed) {
          state.data.viewed.push(viewed);
        }
      })
      .addCase(viewAllNotifications.fulfilled, (state, action) => {
        const incomingIds = new Set(action.payload.map((n) => n.id));
        state.data.new = state.data.new.filter((n) => !incomingIds.has(n.id));

        const existingIds = new Set(state.data.viewed.map((n) => n.id));
        action.payload.forEach((notification) => {
          if (!existingIds.has(notification.id)) {
            state.data.viewed.push(notification);
          }
        });
      })
      .addCase(removeViewedNotifications.fulfilled, (state) => {
        state.data.viewed = [];
      });
  },
});

export const { setNotifications, markNotificationViewed, markAllNotificationsViewed } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
