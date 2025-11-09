import type { RootState } from '@/app/store';

export const selectNotificationsData = (state: RootState) => state.notifications.data;
export const selectNewNotifications = (state: RootState) => state.notifications.data.new;
export const selectViewedNotifications = (state: RootState) => state.notifications.data.viewed;
export const selectNotificationsLoading = (state: RootState) => state.notifications.loading;
export const selectNotificationsError = (state: RootState) => state.notifications.error;
