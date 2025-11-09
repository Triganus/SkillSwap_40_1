import { useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@/app/store';
import type { INotification } from '@/entities/notification/model/types/types';
import {
  removeViewedNotifications,
  viewAllNotifications,
  viewNotification,
} from '@/features/notifications/model/notificationsSlice';
import {
  selectNewNotifications,
  selectNotificationsError,
  selectNotificationsLoading,
  selectViewedNotifications,
} from '@/features/notifications/model/selectors';
import { NotificationsList } from '@/features/notifications/ui/NotificationsList';
import useClickOutside from '@/shared/hooks/useClickOutside';
import styles from './NotificationMenu.module.scss';

interface NotificationMenuProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

export const NotificationMenu: React.FC<NotificationMenuProps> = ({ anchorRef, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const newNotifications = useSelector(selectNewNotifications);
  const viewedNotifications = useSelector(selectViewedNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);

  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside([menuRef, anchorRef], () => onClose(), true);

  const unreadCount = newNotifications.length;
  const hasUnread = unreadCount > 0;
  const hasViewed = viewedNotifications.length > 0;

  const handleNotificationClick = useCallback(
    (notification: INotification) => {
      if (!notification.isViewed) {
        dispatch(viewNotification(notification.id));
      }

      if (notification.link) {
        navigate(notification.link);
      }

      onClose();
    },
    [dispatch, navigate, onClose]
  );

  const handleViewAll = useCallback(() => {
    if (!hasUnread) return;
    dispatch(viewAllNotifications());
  }, [dispatch, hasUnread]);

  const handleClearViewed = useCallback(() => {
    if (!hasViewed) return;
    dispatch(removeViewedNotifications());
  }, [dispatch, hasViewed]);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    return <div className={styles.error}>{error}</div>;
  }, [error]);

  return (
    <div ref={menuRef} className={styles.menu} role="dialog" aria-label="Уведомления">
      <header className={styles.header}>
        <span className={styles.title}>Новые уведомления</span>
        <button
          type="button"
          className={styles.action}
          onClick={handleViewAll}
          disabled={!hasUnread}
        >
          Прочитать всё
        </button>
      </header>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : (
        <NotificationsList
          notifications={newNotifications}
          onNotificationClick={handleNotificationClick}
          emptyMessage="Нет новых уведомлений"
        />
      )}

      <header className={styles.header}>
        <span className={styles.title}>Просмотренные</span>
        <button
          type="button"
          className={styles.action}
          onClick={handleClearViewed}
          disabled={!hasViewed}
        >
          Очистить
        </button>
      </header>

      <NotificationsList
        notifications={viewedNotifications}
        onNotificationClick={handleNotificationClick}
        emptyMessage="Нет просмотренных уведомлений"
      />

      {errorMessage}
    </div>
  );
};

