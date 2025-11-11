import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@/app/store';
import type { INotification } from '@entities/notification/model/types/types';

import {
  fetchNotifications,
  markAllNotificationsViewed,
  markNotificationViewed,
  removeViewedNotifications,
} from '@/features/notifications/model/notificationsSlice';
import {
  selectNewNotifications,
  selectViewedNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
} from '@/features/notifications/model/selectors';
import { NotificationsList } from '@/features/notifications/ui/NotificationsList';

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const newNotifications = useSelector(selectNewNotifications);
  const viewedNotifications = useSelector(selectViewedNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsViewed());
  };

  const handleClearViewed = () => {
    dispatch(removeViewedNotifications({ viewedNotifications }));
  };

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isViewed) {
      dispatch(markNotificationViewed(notification.id));
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {loading && <p>Загрузка уведомлений...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Новые уведомления */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Новые уведомления</h2>
          {newNotifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Прочитать всё
            </button>
          )}
        </div>
        <NotificationsList
          notifications={newNotifications}
          onNotificationClick={handleNotificationClick}
          emptyMessage="Нет новых уведомлений"
        />
      </section>

      {/* Просмотренные */}
      <section style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Просмотренные</h2>
          {viewedNotifications.length > 0 && (
            <button
              onClick={handleClearViewed}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Очистить
            </button>
          )}
        </div>
        <NotificationsList
          notifications={viewedNotifications}
          onNotificationClick={handleNotificationClick}
          emptyMessage="Нет просмотренных уведомлений"
        />
      </section>
    </div>
  );
};

export default NotificationsPage;
