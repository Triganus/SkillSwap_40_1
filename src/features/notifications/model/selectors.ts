import type { RootState } from '@/app/store';

export const selectNotificationsData = (state: RootState) => state.notifications.data;
export const selectNewNotifications = (state: RootState) => state.notifications.data.new;
export const selectViewedNotifications = (state: RootState) => state.notifications.data.viewed;
