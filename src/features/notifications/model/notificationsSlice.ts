import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { INotification, INotificationList } from '@/entities/notification/model/types/types';
import type { DbUser } from '@/entities/user/model/types/types';

const NOTIFICATION_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

interface RealUser {
  id: string;
  name: string;
  email: string;
  location: string;
  avatar: string;
  gender: 'male' | 'female';
  teachSkillId?: string;
  learnSkillIds?: string[];
}

const realUsers: Record<string, RealUser> = {
  anna: {
    id: 'user2',
    name: 'Анна',
    email: 'anna.english@mail.ru',
    location: 'Казань',
    avatar: '/db/avatars/anna.png',
    gender: 'female',
    teachSkillId: 'lang_001',
    learnSkillIds: ['art_001', 'lang_002', 'home_001'],
  },
  ivan: {
    id: 'user1',
    name: 'Иван',
    email: 'ivanivan@mail.ru',
    location: 'Санкт-Петербург',
    avatar: '/db/avatars/ivan.png',
    gender: 'male',
    teachSkillId: 'art_004',
    learnSkillIds: ['bus_006', 'hlth_001', 'art_001', 'lang_002'],
  },
  viktoria: {
    id: 'user7',
    name: 'Виктория',
    email: 'victoria.drums@mail.ru',
    location: 'Пермь',
    avatar: '/db/avatars/victoria_kemerovo.png',
    gender: 'female',
    teachSkillId: 'art_004',
    learnSkillIds: ['bus_007', 'lang_004', 'home_003'],
  },
  maria: {
    id: 'user6',
    name: 'Мария',
    email: 'maria.english@mail.ru',
    location: 'Ростов-на-Дону',
    avatar: '/db/avatars/maria_new.png',
    gender: 'female',
    teachSkillId: 'lang_001',
    learnSkillIds: ['art_003', 'hlth_002', 'home_002'],
  },
  oleg: {
    id: 'user10',
    name: 'Олег',
    email: 'oleg.manager@mail.ru',
    location: 'Новосибирск',
    avatar: '/db/avatars/oleg.png',
    gender: 'male',
    teachSkillId: 'bus_005',
    learnSkillIds: ['bus_002', 'art_002', 'hlth_003'],
  },
};

const toDbUser = (user: RealUser): DbUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  location: user.location,
  avatar_image: user.avatar,
  gender: user.gender === 'male' ? 'Мужской' : 'Женский',
  about_me: '',
  my_skills: {
    teach: user.teachSkillId ? [{ skill_id: user.teachSkillId, skill_description: '' }] : [],
    learn:
      user.learnSkillIds?.map((skillId) => ({ skill_id: skillId, skill_description: '' })) ?? [],
  },
  offers: {
    incoming: [],
    outgoing: [],
    archived: [],
  },
  date_of_registration: '2024-01-01',
});

const buildSkillLink = (user: RealUser) => `/skill/${user.id}`;

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
      const anna = toDbUser(realUsers.anna);
      const ivan = toDbUser(realUsers.ivan);
      const viktoria = toDbUser(realUsers.viktoria);
      const maria = toDbUser(realUsers.maria);
      const oleg = toDbUser(realUsers.oleg);

      const mock: INotificationList = {
        new: [
          {
            id: 'n1',
            type: 'exchange_request',
            date: 'сегодня',
            from: ivan,
            to: anna,
            isViewed: false,
            relatedSkillId: realUsers.ivan.teachSkillId,
            link: buildSkillLink(realUsers.ivan),
          },
          {
            id: 'n3',
            type: 'exchange_request',
            date: 'сегодня',
            from: viktoria,
            to: anna,
            isViewed: false,
            relatedSkillId: realUsers.viktoria.teachSkillId,
            link: buildSkillLink(realUsers.viktoria),
          },
        ],
        viewed: [
          {
            id: 'n2',
            type: 'exchange_accepted',
            date: 'вчера',
            from: maria,
            to: anna,
            isViewed: true,
            relatedSkillId: realUsers.maria.teachSkillId,
            link: buildSkillLink(realUsers.maria),
          },
          {
            id: 'n4',
            type: 'exchange_request',
            date: '23 мая',
            from: oleg,
            to: anna,
            isViewed: true,
            relatedSkillId: realUsers.oleg.teachSkillId,
            link: buildSkillLink(realUsers.oleg),
          },
        ],
      };
      return mock;
    } catch (error) {
      console.error('fetchNotifications error', error);
      return rejectWithValue('Не удалось загрузить уведомления');
    }
  }
);

export const viewNotification = createAsyncThunk(
  'notifications/viewNotification',
  async (
    {
      notificationId,
      newNotifications,
    }: { notificationId: string; newNotifications: INotification[] },
    { rejectWithValue }
  ) => {
    try {
      if (!NOTIFICATION_ID_REGEX.test(notificationId)) {
        throw new Error('Некорректный ID уведомления');
      }

      const notification = newNotifications.find((n) => n.id === notificationId);

      if (!notification) {
        throw new Error('Уведомление не найдено');
      }

      return { ...notification, isViewed: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось отметить уведомление';
      return rejectWithValue(message);
    }
  }
);

export const viewAllNotifications = createAsyncThunk(
  'notifications/viewAllNotifications',
  async (
    { newNotifications }: { newNotifications: INotification[] },
    { rejectWithValue }
  ) => {
    try {
      if (!Array.isArray(newNotifications)) {
        throw new Error('Некорректный формат уведомлений');
      }

      return newNotifications.map((notification) => ({ ...notification, isViewed: true }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось отметить все уведомления';
      return rejectWithValue(message);
    }
  }
);

export const removeViewedNotifications = createAsyncThunk(
  'notifications/removeViewedNotifications',
  async (
    { viewedNotifications }: { viewedNotifications: INotification[] },
    { rejectWithValue }
  ) => {
    try {
      if (!Array.isArray(viewedNotifications)) {
        throw new Error('Некорректный формат просмотренных уведомлений');
      }

      // Возвращаем список ID, которые нужно удалить
      return viewedNotifications.map((notification) => notification.id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось удалить уведомления';
      return rejectWithValue(message);
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
      .addCase(viewNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewNotification.fulfilled, (state, action) => {
        state.loading = false;
        const viewed = action.payload;
        state.data.new = state.data.new.filter((n) => n.id !== viewed.id);
        const alreadyViewed = state.data.viewed.some((n) => n.id === viewed.id);
        if (!alreadyViewed) {
          state.data.viewed.push(viewed);
        }
      })
      .addCase(viewNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(viewAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const incomingIds = new Set(action.payload.map((n) => n.id));
        state.data.new = state.data.new.filter((n) => !incomingIds.has(n.id));

        const existingIds = new Set(state.data.viewed.map((n) => n.id));
        action.payload.forEach((notification) => {
          if (!existingIds.has(notification.id)) {
            state.data.viewed.push(notification);
          }
        });
      })
      .addCase(viewAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeViewedNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeViewedNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const idsToRemove = new Set(action.payload);
        state.data.viewed = state.data.viewed.filter((notification) => !idsToRemove.has(notification.id));
      })
      .addCase(removeViewedNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setNotifications, markNotificationViewed, markAllNotificationsViewed } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
